# Scope and Non-Goals

## Problem

Teams change prompts, agent instructions, skills, toolsets, and workflow files
frequently, but the decision to promote a change is often based on a few manual
examples, an automated score, or reviewer intuition. Existing evaluation tools
can run tests, collect human labels, and in some cases promote prompt versions.
The narrower unresolved problem is portability and binding: evidence is rarely
packaged so that a Git artifact, case set, runtime declaration, blind human
feedback, exclusions, analysis, and approval can be verified together outside
the platform that produced them.

Release Evidence Kit is an overlay for that decision boundary, not a replacement
for the runner, trace store, annotation platform, or deployment system already in
use.

## Project thesis

The format is worth defining only when all of the following are true for an
adopter:

- capability changes are stored in Git and released repeatedly,
- output quality includes judgments that deterministic tests cannot settle,
- reviewers should not know which revision produced an output,
- a release owner needs evidence that survives tool or vendor changes,
- the cost of a wrong release exceeds the cost of structured review.

The deliverable is a portable evidence format, not a review UI and not a service.
A bundle binds input and output digests, assignment protocol, reviews,
exclusions, analysis version, and human decision. Any tool may produce or consume
those records, including tools this project does not write.

## Who this is for

Adopter profile:

- an AI platform or product team with roughly 20-200 people,
- weekly or monthly prompt, agent, tool-policy, RAG, or workflow releases,
- Git as the source of change and at least one existing eval or trace tool,
- quality-sensitive or regulated use cases,
- a named release owner and access to domain reviewers.

Strong initial use cases include customer-support agents, internal copilots,
legal or compliance writing, and agent tool-policy changes. A solo developer, an
infrequently changed prompt, or a task with reliable code-based grading is a poor
fit because review overhead will exceed the expected risk reduction. A task that
can be reduced to a detailed rubric is also a weak fit, because automated graders
approach human agreement in that regime.

There is no buyer, because there is nothing to sell. The relevant question is
whether a team will run the recipe twice without being asked.

## Why now, and what remains unproven

Current evidence supports the category need, not demand for a dedicated tool:

- Stanford AI Index 2026 reports 88% organizational AI adoption and 362
  documented AI incidents in 2025, up from 233 in 2024.
- McKinsey's 2025 survey of 1,993 respondents reports 88% regular AI use, while
  nearly two-thirds of organizations have not begun enterprise scaling; 51% of
  AI-using organizations report at least one negative consequence.
- NIST AI RMF and its Playbook emphasize governance, documentation, TEVV, human
  oversight, monitoring, and change management.
- OpenAI recommends task-specific continuous evaluation, calibration against
  human feedback, and randomized blinded human tests for subjective quality.
- OpenAI's GDPval (2025-09-25) applies exactly this method: expert graders
  blindly compare model and human deliverables without knowing which is which,
  task authors supply rubrics, and OpenAI states its automated grader is not yet
  reliable enough to replace expert graders. This validates the method, not the
  demand for a separate tool.
- OpenAI's hosted Evals platform is scheduled to become read-only on 2026-10-31
  and shut down on 2026-11-30, with Promptfoo documented as a migration path.
  This is a platform-volatility and portability signal, not proof of demand for
  this project.

Timing has moved against a compliance-driven wedge. Regulation (EU) 2026/1744,
the Digital Omnibus on AI published 2026-07-24, defers the AI Act high-risk
obligations in Chapter III to 2 December 2027 for Annex III systems and to
2 August 2028 for product-embedded systems. The logging, human oversight, and
documentation duties survive unchanged, but the deadline that would force budget
is roughly 16 months later than previously planned. Treat 2026 H2 through 2027 H1
as a design-partner window and do not build a sales case on statutory urgency.
ISO/IEC 42001 and 42005 certification evidence is the nearer-term hook.

These sources show a growing evaluation and governance problem. They do not show
that teams will adopt a separate evidence layer. Publishing a specification with
a thin reference implementation is the cheapest way to test that without
committing to infrastructure that only pays off at scale.

Sources and competitive qualification are maintained in `LANDSCAPE.md`.

## What the format must answer

Given a baseline artifact, a candidate artifact, and a frozen case set, a
conforming bundle answers:

1. Were both revisions evaluated under the same declared runtime conditions?
2. Were reviewers shown identity-blind outputs with balanced ordering?
3. What did reviewers prefer, and why?
4. What were the exclusions, the analysis version, and the stated limitations?
5. Who recorded the decision, against exactly which evidence digest?

The answer MUST be verifiable offline, with no running server and no network
access. The project does not need to own execution, identity, storage, or
deployment to keep that guarantee.

## Primary users

### Release owner

Freezes the protocol, selects reviewers, reviews exclusions, and records the
decision. Needs auditability and reproducibility without adopting a new control
plane.

### Capability author

Snapshots a candidate, imports case outputs from the existing eval runner,
inspects regressions, and opens a study. Needs a Git-native CLI and fast local
loop.

### Reviewer

Compares outputs without seeing candidate identity, leaves a preference and
rationale, and completes assigned work efficiently.

### Auditor or risk owner

Inspects frozen study inputs, exclusions, analysis versions, and decision records
without rerunning the model.

## Core jobs

- Snapshot an immutable capability artifact from a file or folder.
- Freeze a versioned case dataset.
- Import baseline/candidate outputs with available provenance.
- Create a study protocol and deterministic assignment plan.
- Collect pairwise human preferences, ties, rationales, tags, and corrections.
- Freeze an evidence snapshot with descriptive metrics and limitations.
- Record an explicit, named human decision without triggering deployment.
- Export a reproducible study bundle and preference dataset.

## Capability model

A capability is an immutable artifact plus metadata. `prompt`, `skill`, `agent`,
`toolset`, `rag`, and `workflow` are labels, not separate domain subclasses.
The core evaluates outputs and evidence; integrations decide how an artifact is
executed.

## Study modes

### v0.1: pairwise

Two arms, identity-blind A/B presentation, equal/tie support, rationale, tags,
and balanced side assignment.

### Possible later: ranking

Three to eight arms using balanced incomplete-block pairwise tasks. Reviewers are
never asked to rank all arms on one screen. This is not scheduled work; it is
recorded so the predicate design does not accidentally block it. It may require a
new predicate major version rather than an extension.

## Reviewer modes

In scope:

- Local owner and reviewer: loopback only, no authentication.
- Shared bundle: a reviewer receives a bundle, reviews offline, and returns an
  append-only review log that the owner merges and verifies by digest.

Out of scope: OIDC identity, invite tokens, anonymous public participation, and
any reviewer coordination service. Teams that need coordinated multi-reviewer
workflows should use an existing annotation platform and import its output.

## Evidence philosophy

Analysis is descriptive. The format reports counts, position balance, and stated
limitations. It does not emit an eligibility verdict, a confidence interval, or a
pass/fail gate at v0.1, because publishing a statistical claim without calibrated
sample sizes would be the most damaging thing this project could do.

Policy evaluation belongs to the adopter. Where a policy is applied, its digest
is recorded in the decision attestation, and the policy MUST be expressible
monotonically: ignoring an attestation must never turn a denial into an approval.

A named human records the decision. Nothing in the format can approve anything.

## Non-goals

- Becoming a product, a hosted service, or a platform.
- Running models, or hosting providers behind a gateway.
- Replacing Promptfoo, Opik, Langfuse, LangSmith, Braintrust, or Label Studio.
- Storing production trace volume.
- Managing prompts, environments, releases, or deployments.
- Providing identity, access control, or reviewer coordination.
- Automatically rewriting or deploying capability artifacts.
- Arbitrary or remote shell execution.
- Claiming statistical certainty from small or self-selected samples.
- Collecting telemetry of any kind.

## Repository and licensing boundary

Two repositories, because the licenses and the consumption patterns differ:

- Specification and conformance vectors. Specification text under the Community
  Specification License 1.0, vectors under a permissive license so they can be
  vendored as a submodule. Separating specification from code is the documented
  Community Specification practice, and it matters here because specification
  licenses grant rights for independent implementations of the whole document,
  while code licenses grant rights scoped to a contribution.
- Reference implementation, CLI, and GitHub Action under Apache-2.0.

No optional hosted component may be required to produce or verify a bundle.

Donating the specification to a foundation is not currently possible. OpenSSF
project entry requires at least three maintainers from at least two
organizations, which a single-maintainer project cannot satisfy. The Community
Specification governance text already contains the mechanism for submitting a
specification to another standards organization later, so choosing it now keeps
that path open without pretending it is available today.

## Project metrics

- Time from clone to first verified bundle.
- Percentage of bundles that verify offline from exported files alone.
- Number of repositories producing bundles.
- Number of independent implementations or integrations.
- Conformance vector pass rate for each known implementation.
- Decisions changed, blocked, or documented better because of blind evidence.
- Teams running the recipe a second time without prompting.

Stars and download counts are explicitly not tracked as success measures. In this
category they diverge from real use by orders of magnitude, and optimizing for
them has preceded abandonment in comparable projects.

## Delivery sequence

Before writing any implementation code beyond a throwaway spike:

1. Interview three prospective adopters using their last two real release
   decisions and reconstruct the missing evidence chain.
2. Freeze a format draft and publish example bundles and conformance vectors.
3. Deliver a CLI plus loopback review page that imports outputs and writes a
   self-contained, verifiable bundle.
4. Write an independent verifier that shares no code with the producer.
5. Run at least two real decisions per adopter without adding features.

## Continuation and archival

Continue active development only if:

- setup is under 15 minutes,
- at least one team outside the maintainer produces bundles repeatedly,
- at least one decision is changed, blocked, or documented materially better
  because of the blind evidence,
- every completed bundle verifies independently with no server,
- the independent verifier passes the published vectors.

If those fail, do not pivot into a product to rescue the effort. Freeze the
specification at its current version, mark the repository status honestly using a
machine-readable project status vocabulary, keep the vectors and example bundles
published, and state that bundles remain plain files that need no tooling to
read.

The governance file MUST state the bus factor and name a successor path, so that
an unmaintained specification can still be forked and continued. Abandonment is
the most common outcome for projects of this size in this category, so it is
planned for rather than denied.
