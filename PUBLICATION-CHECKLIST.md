# Publication Checklist

Review date: 2026-07-31

This checklist separates what is present in the workspace from settings and legal checks that can only be completed when the public repository identities exist.

## P0 public pre-draft

| Gate | Status | Evidence or next action |
| --- | --- | --- |
| Pre-draft status is explicit | Ready | [PROJECT-STATUS.md](PROJECT-STATUS.md) |
| No implementation or conformance claim | Ready | README, website, status file |
| Scope, architecture, threat model, research, decisions | Ready | `docs/` |
| Repository license in standard location | Ready | [LICENSE](LICENSE), Apache-2.0 |
| Contribution and appeal process | Ready | [CONTRIBUTING.md](CONTRIBUTING.md), [GOVERNANCE.md](GOVERNANCE.md) |
| Security reporting policy | Ready | [SECURITY.md](SECURITY.md); GitHub private vulnerability reporting enabled 2026-07-31 |
| Conduct policy | Ready | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Public Git history and remote URL | Ready | [kivancakdeniz/release-evidence-kit](https://github.com/kivancakdeniz/release-evidence-kit), public `main` history |
| Protected default branch / ruleset | Ready for P0 | Linear history and conversation resolution required; force-push and deletion disabled. PR-only merge is deferred while bus factor is 1. |
| CODEOWNERS | Ready | `.github/`, workflows, scripts, documents, site, security policy, and checklist owned by `@kivancakdeniz` |
| Issue and pull-request templates | Ready | Research and objection forms, private-security contact, and PR checklist published |
| Private vulnerability reporting | Ready | Enabled in GitHub repository security settings |
| Exact GitHub and npm name recheck | Ready for P0 | GitHub repository claimed 2026-07-31; npm candidate pages returned 404 but no package name is claimed or reserved |
| Trademark and custom-domain review | Deferred | Required before an npm/product/custom-domain release; P0 claims no package or custom domain and makes no legal-clearance claim |
| Bitmap/SVG source and usage rights | Ready | Generation history, terms basis, and metadata review recorded in [assets/README.md](assets/README.md) |
| External link and bilingual-page check | Ready | Live site checked at [kivancakdeniz.github.io/release-evidence-kit](https://kivancakdeniz.github.io/release-evidence-kit/) |
| GitHub Pages deployment | Ready | SHA-pinned workflow, allowlisted artifact, CSP, no-referrer, robots, and sitemap; initial deployment succeeded 2026-07-31 |
| Repository security analysis | Ready | Dependabot alerts/updates, secret scanning, and push protection enabled |

P0 MUST NOT publish an npm package, installation command, conformance badge, approved-specification claim, or `latest` schema URL.

## R1 approved draft preparation

- Create the dedicated specification repository.
- Adopt the complete Community Specification package: contributor agreement, scope, notices, license, governance, contribution policy, code of conduct, and approval/appeal process.
- Assign stable requirement identifiers.
- Publish JSON Schemas, valid and invalid vectors, and a complete hand-built bundle.
- Prove the hand-built bundle with a verifier that follows only the written specification.

## R2-R5 implementation release

- Target Node.js 24 LTS; test Node.js 22.14+ only while low-cost and supported.
- Use a package `files` allowlist; inspect `npm pack --dry-run` output.
- Install the packed tarball in clean macOS, Linux, and Windows environments.
- Keep runtime dependencies standards-critical, pinned, audited, and documented.
- Pin third-party GitHub Actions to full commit SHAs and grant minimum token permissions.
- Never use privileged workflows to check out untrusted pull-request code.
- Use npm trusted publishing from a GitHub-hosted runner with npm 11.5.1+.
- Restrict automation to `npm stage publish`; approve the staged package interactively with 2FA.
- Disable traditional automation tokens after the trusted publisher is proven.
- Publish provenance, SBOM, checksums, release notes, and an immutable release/tag.
- Run dependency review, code scanning, secret scanning, and OpenSSF Scorecard.
- Verify the package contains no install lifecycle script, telemetry, hidden network call, or undeclared file.

## Release stop rule

Do not publish merely because the remaining work is operational. A missing license, private security channel, asset right, name clearance, conformance vector, or clean-package test is a release blocker, not a follow-up task.
