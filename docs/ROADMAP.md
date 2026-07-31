# Delivery Roadmap

## Statement

Publish a format that other people can implement, plus the smallest honest
reference implementation that proves the format works.

V0 is an overlay, not a platform: it imports outputs, collects blind review, and
exports a verifiable decision bundle. Provider runners, authentication,
databases, hosted services, tracing, and N-arm ranking are not deferred features.
They are outside the project.

## Stage V0 — 4-8 week validation prototype

Inputs:

- baseline capability folder,
- candidate capability folder,
- dataset JSON with at least several cases,
- imported baseline/candidate outputs,
- optional rubric YAML.

Flow:

1. `release-evidence init`
2. `release-evidence bundle create study.yaml`
3. validate and archive baseline, candidate, dataset, runtime declaration, and
   imported outputs
4. `release-evidence review serve <bundle>` binds loopback and presents opaque,
   balanced A/B assignments
5. reviewer submits A/B/equal/abstain, rationale, and tags to append-only JSONL
6. `release-evidence freeze <bundle>` records included review IDs,
   exclusions, descriptive metrics, algorithm version, and hashes
7. `release-evidence decide <bundle> --approve|--reject` binds a human rationale
   to artifact, evidence, and policy hashes
8. `release-evidence verify <bundle>` independently verifies the chain

V0 storage is a self-contained directory or tar archive. Artifact bytes are
copied into the bundle, reviews are append-only JSONL, and manifests are canonical
JSON. No database migration or server-managed project state is required.

### V0 weekly sequence

#### Week 1 — Problem replay and one hand-built bundle

- recruit three design partners,
- reconstruct each partner's last two real capability promotion decisions,
- record current tools, elapsed time, decision owner, missing evidence, and
  whether blind review would have been acceptable,
- assemble one complete evidence bundle **by hand**, from one of those real
  decisions, with no tooling beyond a text editor and `sha256sum`,
- stop if fewer than two teams have repeated subjective release decisions.

The hand-built bundle comes before any normative text. It is the only cheap way
to find out whether the format is writable by a human, and it settles the open
questions in the format draft that no further round of specification writing can.

#### Week 2 — Bundle contract

- canonical manifest schemas, with a flat path and digest array,
- generic JSON output importer,
- deterministic artifact archive/hash plus Git commit/dirty-state metadata,
- bundle create and verify commands,
- a POSIX shell verifier covering manifest, directory identity, and review log.

#### Week 3 — Blind review

- minimal loopback page,
- opaque A/B presentation IDs,
- seeded balanced side ordering, with the seed committed before reviewing,
- A/B/equal-good/equal-bad/abstain, rationale, and tags,
- the post-preference blinding check question, with a decline option.

#### Week 4 — Integrity

- append-only review JSONL,
- idempotent assignment and submit,
- pre-registration record written before the first review,
- assignment plan replay from the revealed seed, and unfilled-assignment counting,
- candidate identity leak tests for HTML, URL, and pre-decision payload,
- export/import verification on a second machine or clean environment.

#### Week 5 — Freeze and decision

- explicit close and exclusion records,
- descriptive preference, tie, case, reviewer, and side-position summaries,
- observed reviewer agreement and the per-case majority outcome log,
- blinding-check totals,
- immutable evidence manifest,
- approve/reject manifest and optional signed Git commit.

#### Weeks 6-8 — Real use only

- Promptfoo importer plus one importer requested by a design partner,
- a GitHub Action that produces and verifies a bundle without a local install,
- an independent verifier that shares no code with the producer,
- at least two real decisions per participating team,
- fix only blockers to completing the workflow,
- do not add platform administration or new study modes.

### V0 continuation gate

Continue active development past V0 only when all are true:

- setup is under 15 minutes,
- at least one team outside the maintainer produces bundles repeatedly,
- at least one decision changes, is blocked or delayed, or a measured
  audit/handoff task is materially shortened,
- all completed bundles verify independently with no server,
- the independent verifier passes every published vector.

If the gate fails, freeze the specification at its current version, keep the
vectors and example bundles published, mark the project status honestly, and stop
adding features. Do not convert the effort into a product to justify it.

## Release plan

Normative order. The public pre-draft is a design-review publication, not a
specification release. Each later release is independently usable and none
introduces a service.

```text
P0 public pre-draft design review
  -> R0 planning and format draft
  -> R1 frozen draft, schemas, conformance vectors, example bundles
  -> R2 reference CLI and loopback review page
  -> R3 independent verifier and conformance runner
  -> R4 CI distribution and importers
  -> R5 approved public release once the trust baseline holds
```

### P0 — Public pre-draft design review

Deliverables: this planning workspace under Apache-2.0; explicit pre-draft
status; research sources; scope, architecture, decisions, threat model, and
publication checklist; contribution, governance, security, and archival paths.

Exit criteria: public Git repository with protected default branch; license in a
standard location; private vulnerability reporting enabled; issue and pull
request process documented; no install command, conformance claim, package claim,
or approved-specification language; name, npm, trademark, and domain checks dated
and recorded.

P0 is the publication target for the current workspace. Specification changes
remain proposals until the dedicated Community Specification repository and its
full legal/governance package exist.

### R0 — Planning and format draft

Deliverables: scope, architecture, domain, threat, landscape, and decision
documents; the evidence format draft; a worked example statement and predicate.

Exit criteria: no unresolved blinding, privacy, or verification boundary
decision; the format expresses a real study end to end on paper.

### R1 — Frozen draft and vectors

Deliverables: versioned specification text with RFC 2119 and RFC 8174 keyword
usage; JSON Schema for the predicate and the bundle manifest; a stable identifier
for every normative requirement; conformance vectors covering valid and invalid
cases; at least one complete example bundle.

Exit criteria: every normative requirement maps to at least one vector; the
vectors validate against their own manifest schema in CI; the example bundle
verifies by hand using only the specification text.

### R2 — Reference CLI and review page

Deliverables: `init`, `bundle create`, `review serve`, `freeze`, `decide`,
`verify`; append-only review log; loopback-only review page with opaque
presentation identifiers and balanced side ordering.

Exit criteria: candidate identity absent from reviewer markup, URL, and
pre-decision payload; same seed reproduces the assignment plan; assignment and
submission are idempotent; a frozen bundle is immutable.

### R3 — Independent verifier and conformance runner

Deliverables: a verifier that shares no code with the producer; a conformance
runner that executes the vectors against any implementation through a documented
command-line protocol; a published conformance report.

Exit criteria: the independent verifier passes every vector; a deliberately
corrupted bundle fails with a requirement identifier in the error message.

This release matters more than any feature. Small specifications that survived
had either a working conformance suite or more than one independent
implementation.

### R4 — CI distribution and importers

Deliverables: a GitHub Action that produces and verifies a bundle with no local
install; optional attestation emission using a custom predicate type; a generic
JSON importer and a Promptfoo importer.

Exit criteria: a repository can produce and verify a bundle without installing
the CLI; the format still works with no CI provider at all.

### R5 — Approved public release

Deliverables: the trust baseline in ADR-023; licensing split between
specification, vectors, and code; governance, maintainer, successor, and archival
files; machine-readable project status.

Exit criteria: a clean machine produces a verified bundle in under 15 minutes on
macOS, Linux, and Windows; nothing in the workflow requires a hosted service; npm
publishing uses stage-only trusted publishing with provenance; the package passes
clean-tarball installation, SBOM, Scorecard, and immutable-release checks.

## Repository layout

Two repositories, following the documented Community Specification practice of
separating specification from source code:

```text
release-evidence-kit-spec/      Community Specification License 1.0
  spec/v0/                      normative text
  schemas/v0/                   JSON Schema
  requirements/v0.yaml          machine-readable requirement identifiers
  vectors/                      permissively licensed, vendorable as a submodule
  docs/                         tutorial, how-to, reference, explanation

release-evidence-kit/           Apache-2.0
  action.yml                    GitHub Action at repository root
  src/                          CLI and review page
  conformance-protocol.md       command-line protocol for third-party clients
```

Documentation follows a four-mode split: tutorial for first use, how-to for
recipes, reference for normative material, and explanation for rationale. Recipes
and normative text are never mixed in the same document.

## Versioning policy

- The specification version and the conformance vector version move together, so
  that conformance always means conformance to a specific document.
- The reference implementation versions independently and declares which
  specification version it implements.
- The predicate type URI carries the major version, and `0.x` counts as major.
- Unrecognized fields are ignored by consumers, so additive changes stay minor.
- Removing or repurposing a field is a major change and requires a new predicate
  type URI.
- Words that denote stability never appear in directory or import paths.

## Conformance approach

Conformance is defined as passing the published vectors, not as self assertion.

- Vectors are data files, not code, so implementations in any language can run
  them.
- Implementations are consumed as a git submodule or a published package.
- Each vector names the requirement identifiers it exercises.
- Optional profiles live in a separate directory and may be skipped with a
  declared expected-failure list.
- Requirements use MUST only where interoperability genuinely depends on them.
  MUST inflation makes a specification untestable.

## Explicitly out of scope

These are not on a later milestone. They are excluded by design, and a request
for them is a signal to point the requester at an existing platform:

- databases, servers, or hosted services of any kind,
- authentication, authorization, or reviewer coordination,
- provider runners, model gateways, or shell execution,
- prompt management, environments, or deployment,
- trace storage,
- statistical eligibility verdicts,
- multimodal review,
- telemetry.

N-arm ranking remains recorded as a possible future predicate version, not as
planned work.

## Adopter validation plan

Approach three prospective adopters:

1. a prompt or instruction team,
2. an agent or toolset team,
3. a non-language capability team such as extraction, classification, or RAG.

Ask each to replay two historical release decisions, then complete two live ones.
Track setup time, missing importers, reviewer cost, completion rate,
verifiability, whether blinding changed the outcome, and whether the team runs it
a second time without being asked.

The purpose is to falsify the format, not to recruit customers. A partner who
says the recipe is not worth the reviewer time is the most valuable result,
because it arrives before implementation cost.

## Maintenance and archival policy

- Declare a release cadence and keep it. For a single maintainer, regularity is a
  stronger signal than volume.
- Publish a machine-readable project status and update it honestly when activity
  changes.
- State the bus factor in the governance file and name a successor path.
- Freeze rather than abandon: if development stops, pin the specification
  version, keep vectors and examples published, and document that bundles are
  plain files readable without any tooling.
- Archive deliberately, with a status change and a final release, rather than by
  silence.
