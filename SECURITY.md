# Security Policy

## Supported surface

| Surface | Status |
| --- | --- |
| Public pre-draft documents and static site | Supported for reporting |
| Proposed bundle format | Design review only |
| CLI, verifier, npm package, or GitHub Action | Not released; no supported version |

Security-relevant reports include candidate-identity leakage in the proposed review protocol, path traversal or canonicalization ambiguity, secret disclosure, unsafe rendering, digest confusion, transparency-log privacy exposure, and workflow or publication-chain weaknesses.

## Reporting a vulnerability

Use the repository's **Security -> Report a vulnerability** flow. Do not open a public issue for a suspected vulnerability or include private prompts, outputs, reviewer data, credentials, or exploit details in a public discussion.

Private vulnerability reporting is enabled for the public repository. If the **Report a vulnerability** button is unexpectedly unavailable, do not disclose sensitive details in a public issue; report only that the private channel is unavailable so the maintainer can restore it.

The maintainer aims to acknowledge a private report within 14 days. Because this is currently a design repository with no released executable, remediation may be a specification correction, threat-model update, publication warning, or withdrawal of an unsafe proposal.

## Disclosure

The reporter and maintainer should agree on disclosure timing. Once a released implementation exists, supported versions, severity handling, advisories, and patch timelines will be added here before the first package release.
