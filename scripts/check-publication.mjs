#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, dirname, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const excludedDirectories = new Set([".git", ".vscode", "_site", "node_modules"]);
const textExtensions = new Set([".html", ".md", ".mjs", ".svg", ".txt", ".xml", ".yml", ".yaml"]);
const errors = [];

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolutePath));
    else files.push(absolutePath);
  }
  return files;
}

function report(file, message) {
  errors.push(`${relative(root, file)}: ${message}`);
}

const sensitivePatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["GitHub token", /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})/],
  ["OpenAI-style secret", /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Azure storage key", /\bAccountKey=[A-Za-z0-9+/=]{20,}/i],
  ["local macOS user path", /\/Users\/[^/\s]+\//],
  ["Microsoft tenant domain", /\b[A-Za-z0-9.-]+\.onmicrosoft\.com\b/i],
  ["embedded Azure endpoint", /\b[A-Za-z0-9-]+\.(?:cognitiveservices\.azure\.com|openai\.azure\.com)\b/i],
];

const files = walk(root);
for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (!textExtensions.has(extension) && relative(root, file) !== "LICENSE") continue;
  const content = readFileSync(file, "utf8");
  for (const [name, pattern] of sensitivePatterns) {
    if (pattern.test(content)) report(file, `contains a possible ${name}`);
  }
}

function validateTarget(sourceFile, rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/g, "");
  if (!target || target.includes("${") || target.startsWith("#") || /^(?:https?:|mailto:|data:|javascript:)/i.test(target)) return;
  const withoutFragment = target.split("#", 1)[0].split("?", 1)[0];
  if (!withoutFragment) return;
  const decoded = decodeURIComponent(withoutFragment);
  const resolved = normalize(resolve(dirname(sourceFile), decoded));
  if (!resolved.startsWith(root)) return report(sourceFile, `link escapes repository: ${target}`);
  if (!existsSync(resolved)) report(sourceFile, `broken local link: ${target}`);
}

for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (extension !== ".md" && extension !== ".html") continue;
  const content = readFileSync(file, "utf8");
  if (extension === ".md") {
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) validateTarget(file, match[1]);
  } else {
    for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) validateTarget(file, match[1]);
    for (const match of content.matchAll(/<a\s+[^>]*href="https?:[^>]+>/g)) {
      if (!/target="_blank"/.test(match[0]) || !/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(match[0])) {
        report(file, `external link must use target=_blank and rel=noopener noreferrer: ${match[0]}`);
      }
    }
  }
}

for (const file of files.filter((candidate) => extname(candidate).toLowerCase() === ".svg")) {
  const svg = readFileSync(file, "utf8");
  const unsafeSvgPatterns = [/<script\b/i, /\bon\w+\s*=/i, /javascript:/i, /<foreignObject\b/i, /(?:href|src)="https?:/i];
  if (unsafeSvgPatterns.some((pattern) => pattern.test(svg))) report(file, "contains active or external SVG content");
}

const requiredFiles = [
  "LICENSE",
  "robots.txt",
  "sitemap.xml",
  "README.md",
  "README.tr.md",
  "CHANGELOG.md",
  "CHANGELOG.tr.md",
  "PROJECT-STATUS.md",
  "PROJECT-STATUS.tr.md",
  "PUBLICATION-CHECKLIST.md",
  "PUBLICATION-CHECKLIST.tr.md",
  "SECURITY.md",
  "SECURITY.tr.md",
  "CONTRIBUTING.md",
  "CONTRIBUTING.tr.md",
  "GOVERNANCE.md",
  "GOVERNANCE.tr.md",
  "CODE_OF_CONDUCT.md",
  "CODE_OF_CONDUCT.tr.md",
  "assets/README.md",
  "docs/README.md",
  "docs/tr/README.md",
  "docs/tr/ARCHITECTURE.md",
  "docs/tr/DECISIONS.md",
  "docs/tr/DOMAIN-MODEL.md",
  "docs/tr/LANDSCAPE.md",
  "docs/tr/ROADMAP.md",
  "docs/tr/SCOPE.md",
  "docs/tr/SPEC-DRAFT.md",
  "docs/tr/THREAT-MODEL.md",
];
for (const requiredFile of requiredFiles) {
  if (!existsSync(join(root, requiredFile))) errors.push(`${requiredFile}: required publication file is missing`);
}

const status = readFileSync(join(root, "PROJECT-STATUS.md"), "utf8");
for (const expected of ["status: pre-draft", "publication: public-design-review", "specification: not-approved", "implementation: none"]) {
  if (!status.includes(expected)) errors.push(`PROJECT-STATUS.md: missing ${expected}`);
}

const assetRecord = readFileSync(join(root, "assets/README.md"), "utf8");
if (/Not yet recorded|\| Blocked \|/.test(assetRecord)) errors.push("assets/README.md: asset provenance is incomplete");

const site = readFileSync(join(root, "index.html"), "utf8");
if (/npx\s+release-evidence|npm\s+(?:i|install)\s+release-evidence/.test(site)) errors.push("index.html: unreleased install command is present");
if (!site.includes("No implementation") || !site.includes("No implementation or conformance claim")) {
  errors.push("index.html: pre-draft limitation is not explicit");
}
if (!site.includes('<meta name="referrer" content="no-referrer">')) errors.push("index.html: no-referrer policy is missing");
const contentSecurityPolicy = site.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/)?.[1];
if (!contentSecurityPolicy) {
  errors.push("index.html: Content Security Policy is missing");
} else {
  for (const match of site.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const hash = `sha256-${createHash("sha256").update(match[1]).digest("base64")}`;
    if (!contentSecurityPolicy.includes(`'${hash}'`)) errors.push(`index.html: CSP is missing script hash ${hash}`);
  }
  for (const directive of ["default-src 'none'", "connect-src 'none'", "object-src 'none'", "form-action 'none'"]) {
    if (!contentSecurityPolicy.includes(directive)) errors.push(`index.html: CSP is missing ${directive}`);
  }
}

if (errors.length > 0) {
  console.error(`Publication validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Publication validation passed: ${files.length} files checked.`);
