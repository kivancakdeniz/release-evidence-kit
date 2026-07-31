#!/usr/bin/env node

import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "_site");
const publicationFiles = [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "README.md",
  "README.tr.md",
  "CHANGELOG.md",
  "CHANGELOG.tr.md",
  "PROJECT-STATUS.md",
  "PROJECT-STATUS.tr.md",
  "PUBLICATION-CHECKLIST.md",
  "PUBLICATION-CHECKLIST.tr.md",
  "GOVERNANCE.md",
  "GOVERNANCE.tr.md",
  "CONTRIBUTING.md",
  "CONTRIBUTING.tr.md",
  "SECURITY.md",
  "SECURITY.tr.md",
  "CODE_OF_CONDUCT.md",
  "CODE_OF_CONDUCT.tr.md",
  "assets",
  "docs",
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const source of publicationFiles) {
  cpSync(join(root, source), join(output, source), { recursive: true });
}
writeFileSync(join(output, ".nojekyll"), "", "utf8");
console.log(`Built static site with ${publicationFiles.length} allowlisted entries.`);
