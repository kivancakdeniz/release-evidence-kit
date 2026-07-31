# Contributing

Release Evidence Kit is currently a public pre-draft design review. Contributions should try to falsify the format, narrow its claims, or make an interoperability requirement testable.

## Useful contributions now

- Reconstruct a real AI capability release decision and identify missing evidence.
- Report a contradiction, privacy leak, ambiguous digest rule, or unverifiable claim.
- Propose a valid or invalid conformance vector.
- Correct a landscape claim using a first-party source.
- Improve the static site's accessibility or factual consistency.

## Issue types

Use one of these prefixes:

- `Research:` for a sourced landscape correction.
- `Objection:` for a technical, governance, privacy, or scope concern.
- `Proposal:` for a new requirement or changed contract.
- `Editorial:` for wording, translation, links, or accessibility.

Security issues follow [SECURITY.md](SECURITY.md), not the public issue tracker.

## Pull requests

1. Keep one behavioral or editorial concern per pull request.
2. Link the issue or explain why a separate issue would add no value.
3. Update the relevant ADR when changing an accepted decision.
4. Add or describe the conformance vector that would distinguish the old and new rule.
5. Preserve the import-only, no-service, no-telemetry boundary unless an ADR explicitly changes it.
6. Avoid adding dependencies or executable code during P0.

Contributions to this design repository are licensed under Apache-2.0.

## Specification contributions

This repository does not yet accept normative specification contributions under the Community Specification License. That process opens only in the dedicated specification repository after its contributor agreement, scope, notices, governance, contribution policy, and code of conduct are complete. Until then, all format changes here are non-normative proposals.

## Review and appeal

The maintainer records accepted architectural changes in [docs/DECISIONS.md](docs/DECISIONS.md). A rejected proposal may be appealed through an `Objection:` issue that states the decision, technical basis, and requested remedy. The maintainer will respond in writing and preserve the objection with the decision record.
