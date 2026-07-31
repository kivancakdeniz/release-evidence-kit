# Architecture Decision Log

Decisions are planning commitments, not immutable facts. A changed decision
receives a new entry with rationale and consequences.

## ADR-001 — Project name

**Status:** Superseded by ADR-031

Use **Capability Arena** as the working name. “Capability” covers prompts,
skills, agents, toolsets, RAG strategies, and workflows without making language
skills the core abstraction.

The GitHub account path and npm package name appeared available on 2026-07-30.
A formal trademark/domain search remains required before broad launch.

## ADR-002 — Product category

**Status:** Accepted

Position the project as portable blind release evidence for Git-managed AI
capabilities, not as a general LLM evaluation, observability, prompt management,
or deployment platform.

## ADR-003 — Initial user

**Status:** Accepted

Optimize for enterprise AI teams while keeping the local workflow usable by an
individual developer. Open-source deployment is one organization with many
projects; multi-tenant SaaS is deferred.

## ADR-004 — Capability abstraction

**Status:** Accepted

A capability is an immutable file/folder artifact snapshot. Prompt, skill,
agent, toolset, RAG, and workflow are metadata values, not domain subclasses.

## ADR-005 — Study modes

**Status:** Accepted

MVP implements pairwise studies only. Domain contracts reserve N-arm ranking,
but ranking UI and analysis move to 1.1 and use balanced pairwise blocks rather
than all-arm ranking screens.

## ADR-006 — Human-controlled decision

**Status:** Accepted, revised by ADR-021

A named human records approve or reject against exact artifact, evidence, and
optional policy digests. The project defines no eligibility verdict, promotion
channel, or deployment action. Downstream systems may consume the record, but the
reference implementation never acts on it.

## ADR-007 — Technology stack

**Status:** Accepted, revised by ADR-021 and ADR-028

Original decision: TypeScript end to end; pnpm workspaces and Turborepo;
React/Vite web; Fastify control plane; Drizzle with SQLite locally and PostgreSQL
for teams.

Current decision: a single small TypeScript package providing the CLI, a
loopback review page, and a verifier, plus a GitHub Action. No workspace tooling,
no server framework, no ORM, and no database. The stack shrinks because the
project is a specification with a reference implementation, not a product.

Implementation baseline:

- Node.js 24 LTS, strict TypeScript, and ESM; `pnpm` is a maintainer tool, not a
  requirement for package consumers. Node.js 22.14+ is a compatibility target
  only while it remains supportable without extra dependencies or conditional
  code.
- One npm package when released, with no install scripts. CLI argument parsing,
  filesystem access, hashing, and the loopback HTTP listener use Node built-ins.
- The review page is browser-native HTML, CSS, and JavaScript served as static
  assets on `127.0.0.1`; it has no React runtime or application framework.
- Runtime dependencies are limited to standards-critical parsing,
  canonicalization, and schema validation that would be riskier to implement
  ad hoc. Every dependency is pinned, audited, and justified in the repository.
- Producer and independent verifier compile from disjoint module roots. A test
  fails if the verifier imports producer code. The specification repository also
  carries the dependency-free POSIX verifier for core digest checks.
- Use the Node test runner for unit and conformance tests. Use Playwright only for
  reviewer-flow, accessibility, CSP, and candidate-identity leak checks.

## ADR-008 — Deployment profiles

**Status:** Superseded by ADR-021

Original decision staged a loopback service, then Docker Compose with PostgreSQL
and OIDC, then a hosted collector.

Current decision: three recipes, none of them a service this project operates.
Local with no CI, CI-attested, and shared-bundle review. Hosted deployment,
relational storage, and public collection are out of scope rather than deferred.

## ADR-009 — Authentication

**Status:** Superseded by ADR-021

Original decision planned an OIDC BFF, scoped invite tokens, and anonymous
sessions.

Current decision: there is no authentication, because there is no server and no
shared state. The review page binds loopback for the duration of a session.
Multi-reviewer work uses shared bundles merged by digest. Adopters needing
identity and coordination should use an existing annotation platform and import
its output.

## ADR-010 — Runner scope

**Status:** Superseded by ADR-021

Original decision: MVP imports outputs; 1.1 adds an OpenAI-compatible HTTP runner
and a restricted local shell runner.

Current decision: the project imports outputs only. Provider calls, credentials,
and shell execution remain outside the reference implementation. Adopters run
capabilities with their existing eval tooling and import the resulting records.

## ADR-011 — Observability

**Status:** Superseded by ADR-021

Original decision exposed an OpenTelemetry/OpenInference port with optional
exporters.

Current decision: the tool emits no telemetry and exports nothing. Integration
with tracing systems is inbound only, as importers that turn an existing tool's
output into a bundle. Nothing in the workflow may require an observability
backend, and no data leaves the adopter's machine unless the adopter explicitly
publishes an attestation.

## ADR-012 — Output renderers

**Status:** Accepted

MVP supports text/Markdown and structured JSON. Agent trace summary is 1.1.
Multimodal outputs are deferred.

## ADR-013 — Evidence policy

**Status:** Superseded by ADR-021

Original decision shipped default statistical gates with a versioned policy
override.

Current decision: analysis is descriptive only. The format reports counts,
position balance, and stated limitations, and never emits an eligibility verdict
or confidence interval. Policy evaluation belongs to the adopter, and only a
policy digest is recorded. Publishing a statistical claim without calibrated
sample sizes would be the most damaging thing this project could do.

## ADR-014 — Persistence boundary

**Status:** Superseded by ADR-019 and ADR-026

Original decision planned SQLite and PostgreSQL adapters behind domain ports with
a content-addressed artifact store.

Current decision: the only persistence is a portable bundle of canonical JSON,
append-only JSONL, and copied artifact bytes. There is no database and no shared
object store. Directory identity uses `dirHash`, so deduplication is not needed
for correctness.

## ADR-015 — License and visibility

**Status:** Superseded by ADR-028 and ADR-037

Original decision used Apache-2.0 for everything and kept the planning workspace
private until the full release trust baseline. Current decision permits this
Apache-2.0 workspace to become public as a non-normative P0 design review.
Normative specification and executable release licensing remain split and keep
their later trust gates.

## ADR-016 — Existing tool integration

**Status:** Accepted

Build portable artifact, blind study, evidence, and decision contracts. Integrate
rather than replicate provider runners, tracing backends, generic annotation
systems, prompt managers, and deployment environments. Generic JSON and
Promptfoo imports are first; OpenInference, LangSmith, Opik/Langfuse, and Label
Studio remain optional boundaries.

## ADR-017 — Planning-only workspace

**Status:** Accepted, fulfilled and amended by ADR-037

The initial workspace contains planning documents only. No package manifest,
source tree, dependency, Git repository, or public repository is created until
the planning review is explicitly approved.

The 2026-07-31 publication review approved creating a public Git repository for
the planning documents and static site only. Package manifests, dependencies, and
implementation source remain gated by R1/R2.

## ADR-018 — Overlay-first delivery

**Status:** Accepted, amended by ADR-021

Run a 4-8 week V0 before expanding scope. V0 must import outputs, compute
deterministic artifact digests, collect blind balanced pairwise reviews, freeze
evidence, record a human decision, and verify a portable bundle.

The continuation gate requires repeated real use by at least one team outside the
maintainer, independent bundle verification, a materially affected decision or
workflow, and setup under 15 minutes. Failing the gate means freezing the
specification, not building a product to justify the work.

## ADR-019 — Portable bundle is the primary boundary

**Status:** Accepted

The independently verifiable evidence bundle is the stable product contract.
Databases, hosted APIs, UIs, and integrations are replaceable producers or
consumers. Every decision must be verifiable from exported bytes without access
to a server operated by this project.

## ADR-020 — Product fallback

**Status:** Accepted

If V0 or the later product-market checkpoint fails, preserve the schemas and
reduce scope to a CLI/GitHub Action plus integrations for established eval
platforms. Do not continue adding standalone platform features to compensate for
weak repeated use.

## ADR-021 — Specification is the primary published artifact

**Status:** Accepted

Publish the evidence bundle schema as a versioned specification in its own right,
with the CLI as a reference implementation rather than the product.

Rationale: in software supply chain attestation, the durable layer was the format
(in-toto predicates, SLSA, SPDX, CycloneDX) while clients stayed interchangeable.
A single maintainer can own a format but cannot outbuild company-backed
platforms. Define the bundle so other tools can emit and verify it, and provide
an independent verifier that does not share code with the producer.

## ADR-022 — Distribute through CI before a CLI install

**Status:** Accepted

Ship a GitHub Action as a first-class distribution channel alongside the npm
package.

Rationale: provenance and attestation mechanisms spread when they required no
separate install. Asking an enterprise to install an unknown CLI from an
unaffiliated maintainer is the largest adoption barrier, and CI distribution
avoids it while producing verifiable artifacts by default.

## ADR-023 — Trust baseline required before public release

**Status:** Accepted, amended by ADR-037 and ADR-039

Do not publish an approved specification, npm package, GitHub Action, or other
executable release until all of the following hold: staged npm trusted publishing
with provenance, no install scripts, no telemetry, no network calls in the core
path, a small and auditable dependency tree, Apache-2.0 with NOTICE when third-party
attributions require it, SECURITY.md, a published SBOM, and governance that states
the single-maintainer bus factor and documents an exit plan.

P0 may publish non-executable, explicitly non-normative design documents after
its narrower repository, license, security-reporting, governance, name, and asset
rights gates pass.

Rationale: after the 2025 npm supply chain incidents, an unknown publisher
without these signals will be rejected by enterprise review regardless of product
quality. The exit plan matters because the dominant failure mode in this category
is abandonment, not lack of interest.

## ADR-024 — Adoption expectations and success metric

**Status:** Accepted

Measure success by repositories producing and verifying bundles and by repeated
real decisions, not by stars or downloads.

Every reviewed project above five thousand stars in this category is company
backed, and the closest human-in-the-loop projects have stalled. A realistic
twelve-month outcome is a few hundred stars, single-digit to low-double-digit
real teams, and near-zero sustained outside contributors. Plans that require
broad adoption to be worthwhile must be rejected at design time.

## ADR-025 — Reuse the in-toto attestation stack

**Status:** Accepted

Express evidence as an in-toto Statement v1 with a project-controlled predicate
type URI. Wrap in DSSE when signing. Do not invent an envelope, a signature
scheme, a transparency log, or a verification CLI.

Predicate type URIs are not registered anywhere; natural URI namespacing is
considered sufficient, and the URI should carry a version. The
`in-toto.io/attestation` namespace requires official vetting, so start with a
controlled domain and treat vetting as an optional later step.

Consequence: existing tooling can carry the evidence, and a compromised or
abandoned reference implementation does not strand adopters.

## ADR-026 — Directory identity uses dirHash, JSON digests use JCS

**Status:** Accepted

Use the in-toto `dirHash` algorithm for capability directory identity. It covers
relative path and content only, excluding mtime, owner, and permissions, which
eliminates most reproducible-archive failure modes. Record `gitCommit` as a
separate named ResourceDescriptor for provenance, never in the same DigestSet as
`dirHash`: in-toto treats two DigestSets as matching when any acceptable field
matches, so combining them would let a commit match conceal different working-tree
bytes. Record `gitTree` as another separately named descriptor where file mode is
meaningful.

When a JSON document is hashed and that hash is used as a digest, canonicalize
with RFC 8785 first. Because that scheme constrains numbers to IEEE 754 doubles
and rejects NaN, Infinity, and lone surrogates, numeric fields are restricted to
small integers and any other quantity is carried as a string.

Also include a plain `sha256` subject over the packaged bundle, because CI
attestation tooling matches artifacts by file digest and requires sha256.

## ADR-027 — Evidence predicate carries no identities or sensitive text

**Status:** Accepted

The predicate carries stable identifiers, aggregate counts, timestamps, and
content digests only. Reviewer identities, rationale text, prompts, model outputs,
and free-form limitation text stay inside the local bundle. Limitations use
specification-defined codes and may point to local detail records by digest.

Rationale: attestations produced from public repositories are written to a
publicly readable, immutable transparency log. Anything placed in a predicate is
effectively unretractable. The bundle can be shared deliberately; a transparency
log entry cannot be unshared.

## ADR-028 — Licensing and repository split

**Status:** Accepted, amended by ADR-037

Specification text under the Community Specification License 1.0, conformance
vectors under a permissive license so they can be vendored, implementation under
Apache-2.0, in two repositories.

Rationale: code licenses grant rights scoped to contributions, while
specification licenses grant rights for independent implementations of the whole
document. Separating specification from code is the documented practice for that
license family, and the same governance text already contains the mechanism for
submitting the specification to another standards organization later.

Donating to a foundation is not currently possible. Project entry requires
multiple maintainers from multiple organizations, which a single-maintainer
project cannot satisfy. Choose licensing now that keeps the option open rather
than pretending the option is available.

## ADR-029 — Conformance is defined by published vectors

**Status:** Accepted

An implementation is conformant if it passes the published conformance vectors
for a stated specification version. Self assertion does not count.

Vectors are data files so any language can run them, each vector names the
requirement identifiers it exercises, and optional profiles are separated with a
declared expected-failure mechanism. The specification version and the vector
version move together.

The project must ship a verifier that shares no code with the producer. Without
it, conformance claims are circular.

## ADR-030 — Governance, status, and archival

**Status:** Accepted

Publish governance that names a single maintainer, states the bus factor, defines
an objection path, and names a successor route. Publish machine-readable project
status and keep it truthful.

If development stops, freeze the specification version, keep vectors and examples
published, and state that bundles are plain files readable without tooling.
Archive deliberately with a final release rather than by silence.

Rationale: in this category the dominant failure mode is a project with a real
audience and no recent commits. Planning for that outcome is cheaper than
denying it, and it is the difference between a harmless archive and a stranded
dependency.

## ADR-031 — Rename to Release Evidence Kit

**Status:** Accepted, supersedes ADR-001

Rename the project from Capability Arena to **Release Evidence Kit**. The
specification repository becomes `release-evidence-kit-spec`, the implementation
repository `release-evidence-kit`, and the CLI binary `release-evidence`.

Rationale: “Arena” implies a leaderboard or a public benchmark between
competitors, which is the opposite of what this produces. The project emits
evidence for one team's own release decision. The new name states the output
(release evidence) and the self-hosted nature (a kit you stand up yourself), and
it is understandable without reading the documentation first.

Consequence: the CLI surface flattens, because the old name forced awkward
repetition. `evidence freeze` becomes `freeze`, `decision approve` becomes
`decide`, and `bundle verify` becomes `verify`. Availability of the GitHub path
and the npm package name must be re-checked before the first publish, and the
trademark search in ADR-001 still applies to the new name.

## ADR-032 — Blinding is measured, not asserted

**Status:** Accepted

Ask each reviewer, after they record a preference, which arm they believe was the
candidate, with an explicit decline option. Report the totals in the predicate and
expose the correct-guess rate as a descriptive diagnostic.

Rationale: `armIdentityWithheld: true` describes the software, not the reviewer.
Arms routinely differ in length, formatting, or tone, so reviewers de-blind
themselves within a handful of comparisons and the preference count then measures
their expectation. A bundle that asserts blinding without measuring it makes a
claim it cannot support, which is the exact failure this project exists to
prevent. The cost is one click per comparison.

Consequence: v0.1 defines no threshold for `blindHeld` or `blindFailed` and emits
neither label. Distance from 0.5 is unstable with few guesses, and classifying it
would introduce the statistical verdict the format otherwise rejects. An adopter
may apply a pre-registered policy, record its digest, and add a controlled
limitation code; the core verifier only checks the reported counts.

## ADR-033 — Reveal the assignment seed and pre-register the protocol

**Status:** Accepted

Reveal `assignmentSeed` in the frozen bundle so a verifier can replay the
assignment plan, and freeze a `pre-registration.json` digest of the protocol
before the first review record is written.

Rationale: a commitment that is never opened proves nothing, and aggregate counts
cannot distinguish a clean study from one where losing comparisons were never
assigned. Equally, nothing otherwise prevents running a study, disliking the
result, and re-running with a changed case set. Neither mechanism prevents
misconduct; both make it visible, which is the only thing this format claims to do
anywhere else.

Consequence: the verification algorithm gains a replay step, and the predicate
reports `plannedComparisons` and `unfilledAssignments` so an incomplete study
reads as incomplete rather than as a smaller clean one.

## ADR-034 — Report agreement and per-case outcomes

**Status:** Accepted

Report observed pairwise reviewer agreement over multiply-reviewed cases, and a
per-case majority outcome log, in addition to aggregate preference counts.

Rationale: an aggregate split says nothing about whether reviewers agreed, so a
noisy result can present as decisive. More importantly, aggregate counts are the
least decision-relevant number in the bundle: releases are rarely blocked because
the candidate won 58 to 38, they are blocked because nine specific cases that used
to work no longer do. Both figures are descriptive and require no model, so they
do not breach the no-statistical-claim rule.

Chance-corrected coefficients may be reported additionally but must not replace
the observed figure, because every chance correction embeds a model.

## ADR-035 — Arms must share a byte-identical runtime declaration

**Status:** Accepted

All arms MUST reference the same `runtime` digest. Where runtimes genuinely
differ, the producer MUST use the `runtime-mismatch` limitation code, bind the
local explanation by digest, and MUST NOT present the study as a single-variable
comparison.

Rationale: the comparability claim of the format is "same cases, same runtime, one
variable changed". While each arm merely names its own runtime file, that claim is
unverifiable and two arms run against different models would still produce a
bundle that verifies cleanly.

## ADR-036 — Core verification must not require this project's tooling

**Status:** Accepted

Manifest integrity, capability directory identity, and review log integrity MUST
remain expressible with standard command line tools, and the specification
repository MUST publish a POSIX shell reference verifier for that subset.
`manifest.json` keeps a flat array of path and `sha256` pairs for this reason.

Rationale: ADR-030 already accepts that abandonment is the dominant failure mode.
A bundle whose only verifier is an npm package from an unmaintained repository has
not solved the problem this project claims to solve, and asking an enterprise to
install an unknown CLI merely to check a hash is the largest adoption barrier that
remains. A dependency-free verifier is also the artifact most likely to attract an
independent implementation, which ADR-024 names as the success signal that matters.

Consequence: TypeScript remains appropriate for the producer and the review page,
where a browser is required anyway, but it is explicitly not on the critical path
for reading a bundle.

## ADR-037 — Publish a non-normative design preview first

**Status:** Accepted

Publish this workspace first as a **public pre-draft design review**, not as a
released specification or reference implementation. The repository may describe
the proposed format, research, threat model, and roadmap, but MUST NOT claim
conformance, implementation availability, or an approved Community Specification.

The current design repository uses Apache-2.0. The later normative specification
moves to its own repository only after the full Community Specification package
exists: contributor agreement, scope, notices, license, governance, contribution
process, code of conduct, and documented approval/appeal process. Specification
contributions do not open in this design repository, avoiding ambiguous patent
commitments during the pre-draft stage.

Rationale: the Community Specification process is a governance and IP framework,
not a license file to drop into an otherwise ordinary repository. A public design
review can test the thesis without pretending that a single-maintainer pre-draft
has already passed a consensus process.

## ADR-038 — Target Node.js 24 for new implementation work

**Status:** Accepted

Develop and release the reference implementation on Node.js 24 LTS. Test Node.js
22.14+ compatibility only while Node 22 remains supported and the compatibility
cost stays near zero. Do not add polyfills, alternate bundles, or dependencies to
preserve the older line.

Rationale: on 2026-07-31 Node.js 24 is the current LTS line and Node.js 22 is the
older LTS line. A new package should optimize its maintenance window rather than
start on the previous baseline. Node 22.14 remains relevant because npm trusted
publishing requires at least Node 22.14 and npm 11.5.1.

## ADR-039 — Release through staged trusted publishing

**Status:** Accepted

The npm package, once it exists, is released from a public GitHub repository on a
GitHub-hosted runner through npm trusted publishing. The trusted publisher is
restricted to `npm stage publish`; a maintainer reviews and approves the staged
package with 2FA. Traditional automation tokens are disabled after the trusted
publisher is proven.

Release gates:

- npm 11.5.1+ and Node.js 24 on the release runner,
- no `preinstall`, `install`, `postinstall`, or implicit native build,
- a package `files` allowlist and `npm pack --dry-run` content review,
- clean-room install and CLI smoke test from the packed tarball,
- automatic npm provenance, SBOM, checksums, and human-readable release notes,
- minimum `GITHUB_TOKEN` permissions and no privileged checkout of untrusted code,
- every third-party action pinned to a full commit SHA and workflow files owned by
  CODEOWNERS,
- immutable release/tag settings and OpenSSF Scorecard review before R5.

Rationale: a provenance tool distributed through an opaque or token-published
package would fail its own trust argument. Provenance links source and build; it
does not prove benign behavior, so package-content review and clean installation
remain separate gates.

## ADR-040 — Differentiate on binding, not export or review UI

**Status:** Accepted

Position the project as the verifiable binding between existing eval exports and
a release decision. Do not claim portable exports, annotation queues, pairwise
screens, or production labels as unique capabilities: Promptfoo, Label Studio,
LangSmith, and Langfuse already document substantial versions of those features.

The differentiating contract is:

```text
artifact bytes + runtime + pre-registered protocol + assignment replay
  + append-only human review + frozen exclusions + decision digest
  -> independently verifiable evidence bundle
```

The first integration proof is Promptfoo import because its export is rich and
portable. Label Studio JSON is the second useful boundary for teams that already
own reviewer coordination. Neither integration may become a required dependency.

## ADR-041 — Decouple package and executable names

**Status:** Accepted

Keep the executable name `release-evidence`. Choose the npm package name only at
R2 publication time; it MAY be scoped even if the unscoped name appears available.
The website, schemas, and predicate type MUST NOT depend on the npm package name.

Point-in-time checks on 2026-07-31 found no exact GitHub repository result for
“Release Evidence Kit” and 404 responses for the public npm pages of
`release-evidence` and `release-evidence-kit`. This is not a reservation or legal
clearance. Recheck registries and complete trademark/domain review immediately
before creating public identities.
