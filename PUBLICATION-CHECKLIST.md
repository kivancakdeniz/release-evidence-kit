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
| Security reporting policy | Documented | [SECURITY.md](SECURITY.md); GitHub private reporting still must be enabled |
| Conduct policy | Ready | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Public Git history and remote URL | Blocked | Initialize Git and create the public repository |
| Protected default branch / ruleset | Blocked | Require PRs and status checks; record exception for the single maintainer if unavoidable |
| CODEOWNERS | Blocked | Add after the final GitHub user or organization is known; own `.github/` and workflows |
| Issue and pull-request templates | Blocked | Add after repository URL and contribution labels are chosen |
| Private vulnerability reporting | Blocked | Enable before changing repository visibility to public |
| Exact GitHub and npm name recheck | Point-in-time only | 2026-07-31: exact GitHub search returned zero; npm public pages for both candidate names returned 404 |
| Trademark and domain review | Blocked | Complete immediately before creating public identities |
| Bitmap/SVG source and usage rights | Ready | Generation history, terms basis, and metadata review recorded in [assets/README.md](assets/README.md) |
| External link and bilingual-page check | Ready locally | Re-run after deployment URL exists |

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
