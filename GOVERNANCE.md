# Governance

## Current model

Release Evidence Kit is a single-maintainer pre-draft. The maintainer currently acts as editor and release owner. Bus factor is **1**. The project is not affiliated with, endorsed by, or governed by in-toto, OpenSSF, the Linux Foundation, or another standards body.

This repository hosts a design review, not a consensus-approved specification. The maintainer may accept changes after considering written support and objections, but must not describe that process as industry consensus.

## Decisions

- Scope and interoperability decisions are recorded in [docs/DECISIONS.md](docs/DECISIONS.md).
- Material changes require a new ADR or an explicit amendment to an existing ADR.
- Decisions state consequences and may be superseded; history is not rewritten.
- Research claims require first-party sources and a review date.

## Objections and appeals

Anyone may open an `Objection:` issue describing the affected decision, evidence, and requested remedy. The maintainer will consider the objection in good faith, respond in writing, and link the resolution from the relevant ADR when it changes the design.

## Releases

The maintainer is the only release authority during P0. P0 releases may publish documents and the static site only. No package, conformance claim, or approved specification may be released before the corresponding roadmap gates pass.

## Succession and archival

A successor must agree to preserve published bundle readability, status honesty, security reporting, decision history, and the project's non-goals unless changed through a public ADR.

If no successor is available and maintenance stops:

1. mark [PROJECT-STATUS.md](PROJECT-STATUS.md) as `archived`,
2. publish a final release note describing unfinished work and known risks,
3. freeze the last specification status without implying approval,
4. keep examples and vectors available when legally and operationally possible,
5. disable or deprecate package distribution rather than leave an unmonitored release channel.

The later Community Specification working group will have its own governance and due-process rules. This file does not substitute for that process.
