# Changelog

All notable public changes to this design repository are documented here.

## 0.0.1-pre-draft - 2026-07-31

### Added

- Public pre-draft evidence-format design review.
- Bilingual English and Turkish project documentation.
- Architecture, scope, domain model, threat model, landscape research, roadmap, and ADR log.
- Static bilingual project site and documented visual-asset provenance.
- Apache-2.0 license, governance, contribution, conduct, security, status, and publication policies.
- Dependency-free publication validation and SHA-pinned GitHub Pages deployment workflow.

### Security

- Scanned the public tree for common secret and credential formats, local user paths, tenant identifiers, private keys, and image metadata.
- Added a publication allowlist so repository automation and local tooling are not copied into the deployed site artifact.
- Added a Content Security Policy and no-referrer policy to the static site.

### Limitations

- No approved specification, schema, conformance vector, example evidence bundle, CLI, verifier, npm package, or GitHub Action exists.
- This release publishes a design review only and makes no conformance claim.
