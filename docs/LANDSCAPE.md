# Landscape Research

Research date: 2026-07-31. Claims below are limited to features verified in
official documentation or project repositories. “Not documented” does not prove
a feature cannot be custom-built.

## Method and confidence

- Product capabilities were checked in official documentation or first-party
  repositories, not comparison blogs.
- `Documented` means a public workflow is described; it does not guarantee every
  pricing tier or deployment supports it.
- `Not documented` means the reviewed sources did not establish the feature. It
  is not a claim that the feature cannot exist or be custom-built.
- Market surveys establish category pressure, not willingness to buy Capability
  Arena. Consulting and vendor surveys are identified as such.
- Product pages change quickly. Recheck the matrix before implementation or a
  public positioning claim.

## Summary

Several products now cover substantial parts of the workflow. LangSmith has
pairwise human queues, reviewer controls, prompt commits, promotion, and rollback.
Vellum has release review, protected release tags, and approval history.
Braintrust binds comparisons to Git metadata and captures pairwise human choices.

The narrower gap found in public documentation is a portable chain across a
general Git artifact and whichever eval platform a team already uses:

```text
general Git artifact revision
  -> same task/model/runtime
  -> seeded identity-blind assignment
  -> human preference and rationale
  -> hash-verifiable frozen evidence
  -> approval bound to that evidence
  -> portable attestation
```

No reviewed product publicly documents that exact cross-platform binding. This
is an integration and evidence-provenance opportunity, not proof that a new full
platform is needed. Portable eval export alone is no longer a differentiator:
Promptfoo now preserves IDs, timestamps, authors, configs, results, prompts,
runtime options, durations, traces, and optionally embedded media across
export/import. The missing claim is narrower: whether those bytes can be bound to
a pre-registered blind protocol and a human decision in a format independently
verifiable outside Promptfoo or any other producer.

## 2026-07-31 publication refresh

The current market makes three positioning changes necessary before publication:

1. **Do not lead with the review UI.** LangSmith documents pairwise annotation
   queues, Langfuse documents assigned annotation queues plus protected
   production labels, and Label Studio provides pairwise templates and JSON
   exports. Review ergonomics are expected product features, not a durable moat.
2. **Do not lead with portability alone.** Promptfoo's current export/import path
   is materially portable, including optional embedded media. Label Studio also
   exports raw task and annotation JSON. The project must lead with deterministic
   cross-record binding, replayable assignment, frozen exclusions, and an
   independently verifiable decision record.
3. **Publish the contract before the client.** Existing platforms are deeper,
   better funded, and already integrated into release workflows. A new CLI earns
   trust only after schemas, requirement identifiers, valid and invalid vectors,
   and a complete hand-built bundle are public.

Publication research also tightened the repository baseline:

- Node.js 24 is the current LTS line; Node.js 22 remains LTS but is the older
  line. New reference implementation development targets Node.js 24, while
  compatibility with Node.js 22.14+ is tested only if it does not widen the
  dependency or maintenance surface.
- npm trusted publishing requires npm 11.5.1+ and Node.js 22.14+ and supports
  GitHub-hosted, GitLab.com shared, or CircleCI cloud runners. GitHub/GitLab
  trusted publishing automatically emits provenance for public packages from
  public repositories. Stage-only publishing plus interactive 2FA approval is
  the preferred release path.
- GitHub recommends minimum token permissions, full-length commit SHA pins for
  third-party actions, CODEOWNERS protection for workflows, and avoiding
  privileged workflows that check out untrusted pull-request code.
- OpenSSF's passing criteria require a public version-controlled repository,
  standard license location, contribution and vulnerability-reporting process,
  unique release versions, release notes, and a public test invocation.
- The Community Specification process is not a license-file-only choice. It
  expects a contributor agreement, carefully bounded scope, notices, licensing,
  governance, contribution process, and due-process/appeal rules. Until that
  package exists in the dedicated specification repository, this workspace may
  be published only as a non-normative pre-draft design review.

Exact-name checks on 2026-07-31 found no GitHub repository matching “Release
Evidence Kit”; the public npm pages for `release-evidence` and
`release-evidence-kit` returned 404. These are point-in-time observations, not a
reservation or trademark clearance. Recheck both registries and perform a
trademark/domain review immediately before publication.

Primary sources for this refresh:

- https://www.promptfoo.dev/docs/usage/command-line/
- https://www.promptfoo.dev/docs/integrations/github-action/
- https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues
- https://langfuse.com/docs/prompt-management/features/prompt-version-control
- https://labelstud.io/guide/export
- https://nodejs.org/en/about/previous-releases
- https://docs.npmjs.com/trusted-publishers
- https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions
- https://www.bestpractices.dev/en/criteria/0
- https://github.com/CommunitySpecification/Community_Specification

## Market need

### Verified pressure

- Stanford AI Index 2026 reports 88% organizational AI adoption. Documented AI
  incidents increased from 233 in 2024 to 362 in 2025, while responsible-AI
  benchmark reporting remains uneven.
- McKinsey's 2025 global survey had 1,993 respondents across 105 countries. 88%
  report regular AI use in at least one function, but nearly two-thirds say
  their organizations have not begun enterprise-wide scaling. Among respondents
  from AI-using organizations, 51% report at least one negative consequence and
  nearly one-third report consequences from inaccuracy.
- Deloitte's fourth enterprise GenAI survey covered 2,773 AI-experienced leaders
  in 14 countries. 78% expected AI spending to rise, 38% named regulatory
  compliance as a development/deployment barrier, and 69% expected full
  governance implementation to take more than a year. This is a consulting
  survey of organizations already piloting or implementing GenAI, not a random
  sample of all businesses.
- NIST AI RMF and its voluntary Playbook explicitly cover governance,
  documentation, TEVV, human oversight, monitoring, and continual improvement.
- OpenAI recommends task-specific continuous evals, human calibration, and
  randomized blinded human tests for subjective judgment. It also notes that
  human evaluation is high quality but slow and expensive. Anthropic similarly
  recommends automating when possible and using human grading where nuance
  justifies the cost.
- OpenAI's GDPval (2025-09-25) is the strongest available practice evidence for
  this product's method. Expert graders blindly compare model and human
  deliverables "not knowing which is AI versus human generated", task authors
  write rubrics for consistency, and OpenAI states its automated grader "is not
  yet as reliable as expert graders, so we don't use it to replace them."

### Regulatory timeline (verified 2026-07-30)

Regulation (EU) 2026/1744 of 8 July 2026, the Digital Omnibus on AI, was
published in OJ L 2026/1744 on 24 July 2026 and is in force. It amends the AI
Act (Regulation (EU) 2024/1689) and moves the dates that matter most here:

| Obligation | Previous date | Current date |
| --- | --- | --- |
| Chapter III Sections 1-3, Annex III high-risk (Art. 6(2)) | 2 Aug 2026 | 2 Dec 2027 |
| Chapter III Sections 1-3, product-embedded high-risk (Art. 6(1)) | 2 Aug 2027 | 2 Aug 2028 |
| Art. 50 transparency marking | 2 Aug 2026 | Unchanged, with a 4-month transition for systems already on the market |
| Art. 72(3) post-market monitoring template | Implementing act | Guidance by 2 Sep 2027 |

Recital 40 gives the reason: delayed standards, common specifications, guidance,
and national competent authorities. The omnibus also narrows the safety-component
definition (new Art. 6(1a)-(1c)), softens the AI literacy duty (Art. 4), extends
simplified quality management to all SMEs (Art. 63(1)), and allows simplified
technical documentation for SMEs and small mid-caps (Art. 11(1)).

The substance this project depends on is unchanged but deferred: logging and
record-keeping, human oversight, technical documentation, and deployer log
retention still exist, roughly 16 months later than originally scheduled.

ISO/IEC 42001:2023 (AI management systems) and ISO/IEC 42005:2025 (AI system
impact assessment) remain the nearer-term audit hook, because certification
evidence is requested by auditors rather than by a statutory deadline. NIST
states that AI RMF 1.0 is under revision, so it should not be cited as a stable
specification.

Sources:

- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1744
- https://www.iso.org/standard/42001
- https://www.nist.gov/itl/ai-risk-management-framework

Note: third-party timeline trackers were stale at the time of writing. The
widely cited artificialintelligenceact.eu implementation timeline still showed a
2 August 2026 high-risk date and was last updated 1 August 2024. Verify dates in
EUR-Lex, not in trackers.

### What the evidence does not prove

The evidence shows more AI use, more operational risk, and stronger evaluation
and governance expectations. It does not establish demand for a separate blind
evidence product. Existing platform budgets may absorb the need, and many teams
will prefer automated graders over repeated human studies. Willingness to adopt
and pay is therefore the first experiment, not an implementation detail.

The 2026 omnibus makes this risk larger, not smaller. Deferred obligations mean
deferred compliance budget. A buyer in 2026 has a defensible reason to postpone,
so the near-term wedge must be internal release quality and audit readiness, not
statutory deadlines. Treat 2026 H2 through 2027 H1 as a design-partner window
and expect the first real purchasing pressure closer to the 2 December 2027
date.

Counter-evidence on the method itself must also be recorded. Where a task can be
reduced to a detailed rubric, automated graders approach human agreement, which
shrinks the space where blind human studies are worth their cost. Human review
remains slow and expensive, and both OpenAI and Anthropic advise automating
whenever it is defensible.

Primary sources:

- https://hai.stanford.edu/ai-index/2026-ai-index-report
- https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
- https://www.deloitte.com/us/en/about/press-room/state-of-generative-ai.html
- https://www.nist.gov/itl/ai-risk-management-framework
- https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook
- https://developers.openai.com/api/docs/guides/evaluation-best-practices
- https://openai.com/index/gdpval/
- https://platform.claude.com/docs/en/docs/test-and-evaluate/define-success
- https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability

## Closest products

### Promptfoo

- MIT, local-first CLI and eval matrix.
- Promptfoo announced that it is part of OpenAI while remaining MIT licensed.
- Strong provider/test/assertion runner and CI integration.
- Portable eval export/import preserves source identity and most execution
  context; `--include-media` embeds referenced media bytes, while secrets are
  redacted and some local relationships are intentionally not reconstructed.
- Basic self-host server uses SQLite, no built-in auth, single replica, and is
  explicitly not recommended for production team use.
- Manual output review exists. A seeded blind human assignment study, reviewer
  protocol, and approval/promotion record are not documented.

Use as an optional runner/import integration; do not compete on provider count.

Sources:
- https://www.promptfoo.dev/docs/configuration/guide/
- https://www.promptfoo.dev/docs/usage/self-hosting/
- https://github.com/promptfoo/promptfoo

### LangSmith

- Pairwise annotation queues show Run A and Run B with A/B/Equal decisions,
  rubrics, comments, reviewer reservations, and reviewer counts.
- Programmatic pairwise evaluators support `randomize_order`.
- Annotation queues support reservations, reviewer counts, and assigned
  reviewers. The reviewed human pairwise queue documentation does not state that
  experiment identity is hidden or that A/B side order is randomized.
- Prompt commits can be promoted to staging or production; environment history
  supports rollback, and owner-only mode can restrict promotion.
- Self-hosting on Azure is documented for enterprise deployments on AKS with
  PostgreSQL, Redis, ClickHouse, and Blob Storage.
- A promotion bound to a frozen human evidence snapshot or a general Git folder
  is not documented.

This is the closest commercial workflow competitor.

Sources:
- https://docs.langchain.com/langsmith/annotation-queues
- https://docs.langchain.com/langsmith/evaluate-pairwise
- https://docs.langchain.com/langsmith/azure-self-hosted

### Braintrust

- Comparative experiments align matching test cases and calculate deltas.
- Pairwise card records Base or Comparison preference and optional comments.
- Aggregate wins/losses and exports are available.
- Base/Comparison identity is explicit; blind identity and side randomization are
  not documented.
- Baselines can follow Git branch/commit metadata, and CI comparisons are
  documented.
- SDK is Apache-2.0; the complete platform is commercial.

Source:
- https://www.braintrust.dev/docs/evaluate/compare-experiments
- https://github.com/braintrustdata/braintrust-sdk-javascript

### Langfuse

- MIT core with self-hosting and an official Azure Terraform deployment.
- Versioned prompts, labels, diff, rollback, versioned datasets, experiments,
  manual scores, comments, assigned annotation queues, and keyboard-driven queue
  processing.
- Protected prompt labels restrict production-label changes by role, but admins
  and owners may still move or delete those labels; this is release access
  control, not immutable release evidence.
- Historical dataset versions can be rerun, including items later updated or
  deleted; schema revisions are not part of dataset versioning.
- Experiment compare view retains full context while annotating.
- A blind randomized pairwise human study protocol is not documented.

Use as an optional tracing/prompt metadata export target.

Sources:
- https://langfuse.com/docs/evaluation/experiments
- https://langfuse.com/docs/evaluation/evaluation-methods/annotation
- https://langfuse.com/docs/prompt-management/features/prompt-version-control
- https://langfuse.com/self-hosting/deployment/azure

### Opik

- Apache-2.0 full platform, including backend and web application.
- Strong self-hosted tracing, datasets, experiments, prompt management,
  evaluation, annotation, and optimization.
- Docker and Kubernetes deployment are documented.
- A human identity-blind randomized pairwise study with evidence promotion is
  not documented.

Best open-source observability integration candidate; not a foundation to fork.

Source:
- https://github.com/comet-ml/opik

### Vellum

- Prompt and workflow deployments have environment-scoped release histories and
  can be promoted between environments.
- Release Reviews support named review requests, comments, approve/request
  changes, and review history.
- Protected release tags require at least one approval and no outstanding change
  request; this is a premium feature.
- A blind randomized pairwise human output study and approval bound to its
  evidence are not documented.

Vellum is the closest reviewed release-governance competitor. Release Evidence
Kit should not compete with its prompt/workflow deployment system.

Sources:
- https://docs.vellum.ai/product/deployments/release-reviews.md
- https://docs.vellum.ai/product/deployments/environments.md

## Capability matrix

`Yes` means publicly documented. `Partial` means an adjacent feature exists but
does not establish the full column. `ND` means not documented in reviewed sources.

| Product | Human pairwise | Blind/random order | Reviewer workflow | Version/provenance | Evidence gate | Approval/promotion | Local/self-host |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Promptfoo | Manual review, not study | ND | ND | Config/results export: partial | CI thresholds: partial | ND | Yes; basic server not for production |
| LangSmith | Yes | Programmatic random order; human queue blinding ND | Yes | Prompt commits and experiments | Frozen evidence gate ND | Prompt promote/rollback | Enterprise self-host |
| Braintrust | Yes | Explicit Base/Comparison | ND | Git metadata and experiment baseline | CI comparison: partial | Environment deploy: partial | Enterprise |
| Langfuse | Manual compare scoring | ND | Annotation queues | Prompt and dataset versions | Protected labels: partial | Label promotion: partial | MIT core self-host |
| Opik | Human annotation; pairwise ND | ND | Annotation queues exist; pairwise ND | Datasets/experiments/prompts | Online rules: partial | ND | Apache-2.0 full self-host |
| Vellum | Qualitative review; blind pairwise ND | ND | Release reviewers | Prompt/workflow release history | Protected release tag | Yes | Commercial deployment options |
| Label Studio | Yes | Side randomization ND | Assignment/review controls | General Git artifact ND | Export: partial | Annotation accept/reject only | Apache-2.0 self-host |
| Argilla | Ranking question | ND | Task distribution | Dataset metadata | Dataset settings: partial | ND | Apache-2.0; maintenance only |
| Phoenix | Human annotation; pairwise ND | ND | ND | Versioned prompts/datasets | ND | ND | ELv2 self-host |
| W&B Weave | Structured human annotation | Pairwise ND | ND | Versioned scorer objects | Feedback is deletable | ND | Commercial self-managed |

The matrix supports an overlay strategy: every row already owns useful execution,
storage, or collaboration primitives, while none publicly establishes the full
portable evidence binding.

## Annotation neighbors

### Label Studio

- Apache-2.0, local Docker/pip and PostgreSQL deployment.
- Official side-by-side LLM template uses `Pairwise` over two answers.
- Flexible UI and export formats. Raw JSON includes task data, annotation IDs,
  timestamps, and `completed_by`; exports are portable annotation records but do
  not cryptographically bind a Git artifact, assignment protocol, and decision.
- Assignment randomization, capability provenance, experiment freezing, and
  promotion gates must be built outside it.

Source:
- https://labelstud.io/templates/llm_side_by_side
- https://github.com/HumanSignal/label-studio

### Argilla

- Apache-2.0 ranking dataset template with instruction, response1, response2,
  and `RankingQuestion`.
- Good preference dataset workflow and self-hosting.
- Maintainers state that new feature development has stopped; bug fixes and
  patches continue.
- Randomized blind studies and artifact promotion are not documented.

Source:
- https://docs.argilla.io/latest/reference/argilla/settings/settings/
- https://github.com/argilla-io/argilla

## Other evaluation neighbors

- OpenAI Evals repository: MIT runner/registry; dataset rights still require
  checking; no human study UI. The separate hosted Evals platform becomes
  read-only on 2026-10-31 and is scheduled to shut down on 2026-11-30. OpenAI
  documents Promptfoo as a migration path.
- DeepEval: Apache-2.0 test/evaluator library; no human A/B control plane.
- Giskard: Apache-2.0 agent testing/security; no human preference workflow.
- Phoenix: broad tracing/eval/prompt platform, but Elastic License 2.0 is not
  OSI open source and is unsuitable as a core dependency for this project.
- W&B Weave: Apache SDK with commercial/shared backend; strong versioned objects,
  structured human annotations, and deletable feedback; no documented blind
  study chain.
- Galileo: annotations on sessions/traces/spans; Annotation Queues are Enterprise
  Beta. Blind pairwise release evidence is not documented.
- Parea: experiments, DVC workspace capture, manual annotation correlation, and
  CI assertions. Blind pairwise approval is not documented.
- Patronus: structured human annotations with explanations across traces,
  experiments, and evaluations. Blind pairwise promotion is not documented.
- Humanloop: the team joined Anthropic and is sunsetting the platform; it is not
  a viable product dependency.

## Small “arena” projects

GitHub searches for `llm arena evaluation`, `human preference llm evaluation`,
and `prompt ab testing llm` returned no established reusable framework matching
this scope. A small `elementshq/jury-arena` project focuses on LLM-as-a-judge,
not human blind feedback and promotion governance.

## Build versus integrate

Build:

- deterministic artifact archive/hash and Git metadata,
- portable study and evidence schemas,
- seeded opaque assignments,
- identity blinding,
- human feedback contract,
- frozen evidence manifest,
- decision record and optional attestation.

Integrate:

- Promptfoo or custom runners,
- OpenTelemetry/OpenInference,
- Opik/Langfuse/Phoenix trace export,
- Label Studio import/export,
- provider SDKs,
- external object stores.

Do not build a general trace backend, provider matrix, team annotation system,
prompt editor, deployment environment manager, or policy administration UI until
design partners prove that an existing product cannot carry that responsibility.

## Market wedge and adoption risk

Best initial customer profile:

- quality-sensitive AI platform teams with 20-200 people,
- weekly or monthly releases of Git-managed prompts, agent instructions,
  tool-policy, RAG configuration, or workflows,
- an existing eval/trace platform they do not want to replace,
- domain reviewers and a named release owner,
- audit, data-locality, or vendor-portability pressure.

Buyer: AI platform or engineering leader, often with risk/model-governance as a
co-buyer. Reviewer and capability author are users, not necessarily buyers.

Main adoption risks:

- human review is expensive and becomes a bottleneck,
- mature platforms already own datasets, identities, and release history,
- a second UI and control plane increases switching and integration cost,
- local-first deployment solves privacy but not reviewer coordination,
- teams may accept LLM-as-judge plus spot checks rather than rigorous studies.

The product must therefore import outputs first, export all evidence, avoid
requiring migration, and prove value on a real release decision within one day.

## Complexity-benefit assessment

Scores are directional: 1 is low, 5 is high. Ratio is `benefit / complexity` and
is used to order validation work, not as a financial forecast.

| Component | Benefit | Complexity | Ratio | Validation decision |
| --- | ---: | ---: | ---: | --- |
| Artifact archive/hash + Git metadata | 5 | 2 | 2.50 | Build now |
| Blind balanced pairwise page | 5 | 3 | 1.67 | Build now |
| Rationale and rubric tags | 5 | 1 | 5.00 | Build now |
| Frozen evidence manifest | 5 | 2 | 2.50 | Build now |
| Approve/reject manifest | 4 | 1 | 4.00 | Build now |
| Generic importer + Promptfoo importer | 5 | 2 | 2.50 | Build now |
| General content-addressed store | 2 | 4 | 0.50 | Defer; copy into bundle |
| SQLite relational control plane | 2 | 3 | 0.67 | Defer; JSON/JSONL first |
| Fastify management API | 2 | 4 | 0.50 | Defer; loopback review only |
| Control-plane GUI | 1 | 5 | 0.20 | Defer |
| Statistical eligibility gates | 2 | 4 | 0.50 | Descriptive first; validate samples |
| OIDC and reviewer reservations | 2 | 5 | 0.40 | Defer until coordination blocks pilots |
| PostgreSQL/Azure/public collector | 1 | 5 | 0.20 | Out of scope; integrate instead |

The original vertical slice combines five high-value primitives with several
platform investments whose value only appears after repeat team adoption. The
validation version should use a self-contained directory/tar bundle, append-only
JSONL reviews, a loopback page, deterministic hashing, and Git-tracked decisions.
That tests the differentiated behavior without prepaying for a control plane.

## Open-source adoption reality

Category metrics collected 2026-07-30 from the GitHub and registry APIs. Star
counts measure attention, not use; download counts include CI and bot traffic.
Recent commit volume is the most useful maintenance signal.

| Project | Stars | Last commit | Commits in 90 days | Backing |
| --- | ---: | --- | ---: | --- |
| langfuse | 32.2k | 2026-07-30 | 1,402 | Company |
| label-studio | 28.0k | 2026-07-30 | 117 | Company |
| promptfoo | 23.8k | 2026-07-30 | 908 | Company, now part of OpenAI |
| opik | 21.0k | 2026-07-30 | 947 | Company |
| openai/evals | 19.1k | 2026-04-14 | 0 | Company, dormant |
| deepeval | 17.3k | 2026-07-28 | 594 | Company |
| ragas | 15.1k | 2026-02-24 | 0 | Transferred, dormant |
| phoenix | 10.8k | 2026-07-30 | 1,003 | Company, ELv2 |
| argilla | 5.1k | 2025-08-05 | 0 | Company, stalled |

Three conclusions follow.

First, every project above five thousand stars in this category is backed by a
company. No unaffiliated single-maintainer project appears at that level. The
leaders sustain commit volumes a solo maintainer cannot match.

Second, human-in-the-loop tooling is the weakest sub-segment. Argilla stalled
with 5.1k stars and Label Studio, despite 28k stars, shows modest maintenance
volume. Human review tooling attracts attention more easily than sustained use.

Third, dormancy is the dominant failure mode. Argilla, ragas, and openai/evals
all have large audiences and no recent commits. For a solo maintainer the
realistic risk is not that nobody uses the tool, but that a few teams depend on
it and then it is abandoned.

### Lesson from provenance and attestation tooling

The closest successful analogue to a portable evidence bundle is software supply
chain attestation. What actually spread there was the format and the platform
integration, not the standalone client:

- in-toto predicates, SLSA levels, and SPDX or CycloneDX documents became the
  interoperable layer; cosign and `gh attestation verify` are interchangeable
  clients.
- npm provenance and GitHub artifact attestations required no separate tool
  install, which is why they were adopted.
- Verification mattered as much as production. `npm audit signatures` and
  `gh attestation verify` gave consumers a reason to care.
- Adoption accelerated after a forcing event, notably the September 2025 npm
  worm incident, combined with regulatory pressure such as the Cyber Resilience
  Act.

Applied here: an evidence bundle nobody has a reason to verify is only a JSON
file. The defensible asset is a documented predicate and verification story that
other tools can emit and consume, distributed through CI rather than through a
new CLI install.

Adjacent AI standards work exists but does not cover this gap. OpenSSF Model
Signing addresses model artifacts, CoSAI workstream 1 addresses AI supply chain,
and MLCommons AILuminate addresses automated safety benchmarking. None of them
defines a human-judgment release evidence predicate.

### Trust and adoption forecast

For an unaffiliated maintainer publishing a new npm CLI in the post-incident
supply chain climate, the realistic 12-month outcome is roughly 100 to 700 stars,
single-digit to low-double-digit real teams, and close to zero sustained outside
contributors. Distribution through a GitHub Action avoids the hardest barrier,
which is persuading an enterprise to install an unknown CLI.

Minimum trust baseline before any public release: npm trusted publishing with
provenance, no install scripts, no telemetry, no network calls in the core path,
a small and auditable dependency tree, Apache-2.0 with NOTICE, SECURITY.md,
published SBOM, and a governance file that states the bus factor honestly and
documents an exit plan so that bundles remain readable if maintenance stops.

## License implications

- Release Evidence Kit: Apache-2.0.
- Safe optional integration targets: Apache-2.0 and MIT APIs/SDKs, preserving
  notices and patent terms.
- Do not copy Phoenix server code due to ELv2 restrictions.
- Do not assume datasets bundled with OpenAI Evals share the code license.
- Avoid creating a hard dependency on a commercial control plane.

## Positioning

Recommended description:

> Portable blind release evidence for Git-managed AI capabilities.

Expanded description:

> Release Evidence Kit turns outputs from your existing eval stack into a
> blinded, reproducible review and a hash-verifiable approval bundle for prompts,
> skills, agents, toolsets, RAG, and workflows.

The differentiator is cross-platform evidence binding, not provider breadth,
tracing volume, prompt management, deployment, or generic labeling.

## Verdict

Build it, but as a specification with a thin reference implementation, not as a
platform, and with adoption expectations set accordingly.

The method is sound and is used by frontier labs for exactly this class of
judgment. The gap in portable, verifiable, cross-tool human release evidence is
real. What is missing is demand pressure: the AI Act obligations that would have
forced evidence work moved to December 2027 and August 2028, and the category is
owned by well-funded platforms that a solo maintainer cannot outbuild.

Proceed with a 4-8 week overlay-first prototype. Do not build a control plane.
Publish the bundle schema as the primary artifact, ship a small CLI, an
independent verifier, and a GitHub Action as reference producers and consumers,
and add importers for existing eval tools rather than competing with them.

Continue active development only when at least one team outside the maintainer
repeats the workflow, blind evidence changes or materially improves a real
release decision, setup stays under 15 minutes, every bundle verifies
independently, and the independent verifier passes the published vectors.
Otherwise freeze the specification, keep the vectors published, and stop.

Measure success by the number of repositories producing and verifying bundles,
not by stars. If the project cannot sustain monthly releases, say so in the
repository before others build on it.
