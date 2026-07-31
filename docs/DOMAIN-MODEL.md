# Domain Model

All mutable definitions are revisioned. Historical studies reference immutable
revisions and snapshots, never “latest” records.

## Model layers

The domain has two implementation layers:

- V0 bundle model: the minimum portable records required to test the project
  thesis without a database.
- Reference vocabulary: non-normative naming used when discussing the format.
  It is not a schema and is not implemented.

The bundle is not a lossy export of an internal product model. It is the stable
verification boundary that the reference CLI and independent implementations
must support.

## V0 bundle model

### BundleManifest

Canonical root record:

```text
schemaVersion, bundleId, createdAt, sourceGit, artifactRefs,
datasetRef, runtimeDeclarationRef, outputSetRef, protocolRef,
reviewLogRef, evidenceRefs[], decisionRefs[]
```

Every reference includes a relative path, media type, byte length, and SHA-256
hash. The manifest excludes its own hash; a detached bundle hash or signed Git
commit may bind the root.

### ArtifactArchive

One deterministic baseline or candidate archive plus manifest:

```text
role, rootHash, manifestHash, sourceRevision, dirtyState,
fileCount, totalBytes, files[]
```

The role-to-archive mapping is private reviewer metadata and is never included
in pre-decision browser payloads.

### ImportedOutputSet

Ordered case/output records from any runner:

```text
importer, importerVersion, sourceExperiment?, datasetHash,
runtimeDeclaration, records[]
```

Each record binds `caseId`, `armOpaqueId`, `inputHash`, `outputHash`, output
path, and available provenance. Missing provenance is explicit, not synthesized.

### ProtocolManifest

```text
mode=pairwise, datasetHash, armOpaqueIds, assignmentAlgorithm,
algorithmVersion, seedCommitment, renderer, rubric, exclusionRules
```

### AssignmentPlan and ReviewRecord

Assignments are deterministic records with opaque presentation IDs and
owner-side arm mapping. Reviews append to JSONL:

```text
reviewId, assignmentId, reviewerRef, verdict, rationale, tags,
renderedSnapshotHash, submittedAt, previousRecordHash?
```

`previousRecordHash` creates an optional hash chain. Duplicate assignment/reviewer
submissions are rejected; corrections append a superseding record rather than
editing prior bytes.

### EvidenceManifest

```text
analysisVersion, protocolHash, includedReviewIds, exclusionRecords,
descriptiveMetrics, sampleLimitations, integrityChecks, createdAt
```

V0 evidence has no `eligible` status. A changed inclusion set, exclusion,
algorithm, or protocol creates a new evidence manifest.

### DecisionManifest

```text
decision, artifactHash, evidenceHash, policyHash?, actor,
rationale, createdAt, previousDecisionHash?
```

Decision is `approve` or `reject`. It records a human recommendation and never
claims that deployment occurred.

### V0 integrity rules

- Bundle references resolve inside the bundle and match declared hashes.
- Artifact, dataset, output, protocol, review, evidence, and decision bytes are
  never silently rewritten.
- Pre-decision reviewer payloads contain no arm identity or source metadata.
- Study close rejects new review records.
- Exclusion and correction records append; they do not delete history.
- Evidence lists exact included review IDs and integrity-check results.
- Decision binds exact artifact and evidence hashes.
- Verification requires no database or running server.

## Reference vocabulary

The entities below are non-normative naming used when discussing the format and
when an adopter keeps records outside a bundle. They are not a database schema
and this project does not implement them as one.

## Capability and artifact

### Capability

Long-lived identity and metadata:

```text
id, projectId, name, kind, description, createdAt
```

`kind` is an extensible label such as prompt, skill, agent, toolset, rag, or
workflow. It does not change core behavior.

### ArtifactSnapshot

Immutable file/folder revision:

```text
id, capabilityId, manifestHash, rootHash, fileCount, totalBytes,
sourceRevision, createdAt
```

### ArtifactFile

```text
snapshotId, relativePath, byteHash, size, mode, mediaType, blobRef
```

## Dataset

### Dataset

Long-lived case collection identity.

### DatasetRevision

Immutable ordered set of case revisions and schema version.

### CaseRevision

```text
id, caseId, input, expected?, metadata, inputHash, createdAt
```

Cases may contain structured JSON. Schema is declared per dataset revision.

## Candidate and imported execution

### Candidate

Binds an artifact snapshot to an opaque study arm:

```text
id, projectId, artifactSnapshotId, label
```

The label is never sent to a blind reviewer.

### ImportedExecution

One imported candidate output for one case:

```text
id, candidateId, caseRevisionId, importer, importerVersion, inputHash,
outputRef, outputHash, sourceProvenance?, error?
```

The project records provenance supplied by the source tool and never synthesizes
missing execution details.

## Study

### Study

Long-lived identity and lifecycle state:

```text
draft -> open -> closed -> analyzed -> decided -> archived
```

### ProtocolRevision

Immutable rules:

```text
mode, armIds, datasetRevisionId, renderer, rubricRevisionId,
assignmentAlgorithm, seedCommitment, exclusionPolicy, limitationCodes
```

Mode at v0.1 is `pairwise`. Ranking would require a new predicate major version.

### Arm

Opaque study arm linked to one candidate. Reviewer payload uses separate
presentation IDs.

### Assignment

```text
id, studyId, caseRevisionId, reviewerScope, presentationOrder,
algorithmVersion
```

`presentationOrder` stays in owner-side bundle metadata. Reviewer response
contains only the assignment ID and chosen presentation ID/tie.

## Reviewer and access

A reviewer is identified only by an opaque reference chosen by the adopter, which
is recorded in the local review log and never placed in a predicate.

Identity providers, invitation tokens, and anonymous participation are out of
scope. Teams needing coordinated reviewer management should use an existing
annotation platform and import its output.

## Feedback

### Review

```text
id, assignmentId, reviewerRef, verdict, ranking?, rationale, tags,
correction?, renderedSnapshotHash, submittedAt
```

Pairwise verdict:

```text
presentation A | presentation B | equal-good | equal-bad | abstain
```

The owner-side process resolves the presentation to the underlying arm after
submission.

### RubricRevision

Defines tag keys, descriptions, required fields, rationale limits, and renderer
instructions. A study freezes one rubric revision.

### ExclusionDecision

Records review exclusion without deleting the original review:

```text
reviewId, reasonCode, rationale, actor, decidedAt
```

## Evidence

### AnalysisBatch

Frozen set of review and exclusion IDs plus close timestamp.

### EvidenceSnapshot

```text
id, studyId, analysisBatchHash, analysisVersion, metrics,
sampleLimitations, biasChecks, integrityChecks, createdAt
```

### Policy reference

When an adopter applies a release policy, only its digest is recorded, so a
decision can be checked against the exact policy text that was in force.

The format does not define a policy language and does not evaluate policies. It
emits no eligibility status. Any policy consuming these records must be
expressible monotonically: ignoring an attestation must never turn a denial into
an approval.

## Decision

### DecisionRecord

Human decision bound to exact hashes:

```text
id, projectId, candidateSnapshotId, evidenceSnapshotId,
policyRevisionId, actorId, decision, rationale, createdAt
```

### Downstream consumption

A decision record states what a named human concluded about a candidate artifact,
bound to an exact evidence digest. External systems may read it and act on it.

This project defines no channels, environments, or promotion ledger, and performs
no deployment.

## Integrity rules

- Snapshot content never mutates.
- Pair output never mutates after study open.
- Open study protocol never mutates.
- Closed study accepts no reviews.
- Review submit is idempotent per assignment/reviewer.
- Evidence snapshots never mutate.
- A decision references exact artifact, evidence, and optional policy digests.
- Recording a decision never triggers deployment or another external action.
