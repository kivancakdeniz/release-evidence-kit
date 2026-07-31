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
  let decoded;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    return report(sourceFile, `link contains invalid URL encoding: ${target}`);
  }
  const resolved = normalize(resolve(dirname(sourceFile), decoded));
  if (!resolved.startsWith(root)) return report(sourceFile, `link escapes repository: ${target}`);
  if (!existsSync(resolved)) report(sourceFile, `broken local link: ${target}`);
}

function parseHtmlStartTags(html) {
  const tags = [];
  const isWhitespace = (character) => character === " " || character === "\n" || character === "\r" || character === "\t" || character === "\f";
  const isTagNameCharacter = (character) => Boolean(character) && /[A-Za-z0-9:-]/.test(character);
  const isAttributeNameCharacter = (character) => Boolean(character) && !isWhitespace(character) && character !== "=" && character !== ">" && character !== "/";

  let index = 0;
  while (index < html.length) {
    const opening = html.indexOf("<", index);
    if (opening === -1) break;
    let cursor = opening + 1;
    if (!/[A-Za-z]/.test(html[cursor] ?? "")) {
      index = opening + 1;
      continue;
    }

    const tagNameStart = cursor;
    while (isTagNameCharacter(html[cursor])) cursor += 1;
    const name = html.slice(tagNameStart, cursor).toLowerCase();
    const attributes = new Map();

    while (cursor < html.length) {
      while (isWhitespace(html[cursor])) cursor += 1;
      if (html[cursor] === ">") {
        cursor += 1;
        break;
      }
      if (html[cursor] === "/" && html[cursor + 1] === ">") {
        cursor += 2;
        break;
      }

      const attributeNameStart = cursor;
      while (isAttributeNameCharacter(html[cursor])) cursor += 1;
      if (cursor === attributeNameStart) {
        cursor += 1;
        continue;
      }
      const attributeName = html.slice(attributeNameStart, cursor).toLowerCase();
      while (isWhitespace(html[cursor])) cursor += 1;

      let value = "";
      if (html[cursor] === "=") {
        cursor += 1;
        while (isWhitespace(html[cursor])) cursor += 1;
        const quote = html[cursor] === '"' || html[cursor] === "'" ? html[cursor] : null;
        if (quote) {
          cursor += 1;
          const valueStart = cursor;
          while (cursor < html.length && html[cursor] !== quote) cursor += 1;
          value = html.slice(valueStart, cursor);
          if (html[cursor] === quote) cursor += 1;
        } else {
          const valueStart = cursor;
          while (cursor < html.length && !isWhitespace(html[cursor]) && html[cursor] !== ">") cursor += 1;
          value = html.slice(valueStart, cursor);
        }
      }
      attributes.set(attributeName, value);
    }

    tags.push({ name, attributes, startTagEnd: cursor });
    index = Math.max(cursor, opening + 1);
  }
  return tags;
}

for (const file of files) {
  const extension = extname(file).toLowerCase();
  if (extension !== ".md" && extension !== ".html") continue;
  const content = readFileSync(file, "utf8");
  if (extension === ".md") {
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) validateTarget(file, match[1]);
  } else {
    for (const tag of parseHtmlStartTags(content)) {
      for (const attributeName of ["href", "src"]) {
        if (tag.attributes.has(attributeName)) validateTarget(file, tag.attributes.get(attributeName));
      }
      const href = tag.attributes.get("href") ?? "";
      if (tag.name === "a" && /^https?:/i.test(href)) {
        const rel = new Set((tag.attributes.get("rel") ?? "").toLowerCase().split(/\s+/).filter(Boolean));
        if (tag.attributes.get("target") !== "_blank" || !rel.has("noopener") || !rel.has("noreferrer")) {
          report(file, `external link must use target=_blank and rel=noopener noreferrer: ${href}`);
        }
      }
    }
  }
}

for (const file of files.filter((candidate) => extname(candidate).toLowerCase() === ".svg")) {
  const svg = readFileSync(file, "utf8");
  for (const tag of parseHtmlStartTags(svg)) {
    if (tag.name === "script" || tag.name === "foreignobject") report(file, `contains forbidden SVG element: ${tag.name}`);
    for (const [attributeName, value] of tag.attributes) {
      if (attributeName.startsWith("on")) report(file, `contains SVG event attribute: ${attributeName}`);
      if (value.trim().toLowerCase().startsWith("javascript:")) report(file, `contains JavaScript SVG attribute: ${attributeName}`);
      if ((attributeName === "href" || attributeName === "xlink:href" || attributeName === "src") && /^https?:/i.test(value.trim())) {
        report(file, `contains external SVG resource: ${value}`);
      }
    }
  }
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
const siteTags = parseHtmlStartTags(site);
if (/npx\s+release-evidence|npm\s+(?:i|install)\s+release-evidence/.test(site)) errors.push("index.html: unreleased install command is present");
if (!site.includes("No implementation") || !site.includes("No implementation or conformance claim")) {
  errors.push("index.html: pre-draft limitation is not explicit");
}
const referrerPolicy = siteTags.find((tag) => tag.name === "meta" && tag.attributes.get("name")?.toLowerCase() === "referrer")?.attributes.get("content");
if (referrerPolicy?.toLowerCase() !== "no-referrer") errors.push("index.html: no-referrer policy is missing");
const contentSecurityPolicy = siteTags.find((tag) => tag.name === "meta" && tag.attributes.get("http-equiv")?.toLowerCase() === "content-security-policy")?.attributes.get("content");
if (!contentSecurityPolicy) {
  errors.push("index.html: Content Security Policy is missing");
} else {
  for (const scriptTag of siteTags.filter((tag) => tag.name === "script")) {
    const closing = site.indexOf("</script>", scriptTag.startTagEnd);
    if (closing === -1) {
      errors.push("index.html: script element is not closed");
      continue;
    }
    const script = site.slice(scriptTag.startTagEnd, closing);
    const hash = `sha256-${createHash("sha256").update(script).digest("base64")}`;
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
