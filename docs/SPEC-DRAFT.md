# Evidence Format Draft

Status: pre-draft planning sketch. Not normative. It exists to prove the format
is implementable before any code is written, and to be moved into a dedicated
specification repository later.

The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT,
RECOMMENDED, NOT RECOMMENDED, MAY, and OPTIONAL in the final specification are to
be interpreted as described in BCP 14 (RFC 2119, RFC 8174) when, and only when,
they appear in all capitals.

## Design rule

Do not invent a new envelope, signing scheme, transparency log, or verification
CLI. Reuse the in-toto attestation stack and define only the one thing that does
not exist: a predicate describing blind human evaluation of a capability
revision.

Layers, from the in-toto attestation framework:

```text
predicate   <- defined here
statement   <- in-toto Statement v1
envelope    <- DSSE, optional
bundle      <- JSON Lines of envelopes, plus a self-describing evidence directory
```

## Statement shape

```json
{
  "_type": "https://in-toto.io/Statement/v1",
  "subject": [
    {
      "name": "capability/candidate",
      "digest": {
        "dirHash": "<hex>"
      }
    },
    {
      "name": "source/revision",
      "digest": { "gitCommit": "<hex>" }
    },
    {
      "name": "evidence-bundle.tar",
      "digest": { "sha256": "<hex>" }
    }
  ],
  "predicateType": "https://<controlled-domain>/BlindEvaluation/v0.1",
  "predicate": { }
}
```

Notes that follow verified in-toto rules:

- `_type` MUST always be `https://in-toto.io/Statement/v1`.
- `subject` is a ResourceDescriptor array, so multiple entries are allowed. Every
  entry MUST carry a `digest`.
- Two DigestSets are considered matching if any acceptable field matches.
  Therefore `dirHash` and `gitCommit` MUST NOT appear in the same DigestSet: the
  same commit can have different working-tree bytes, and a `gitCommit` match would
  otherwise mask a `dirHash` mismatch.
- Predicate type URIs are not registered anywhere. Natural URI namespacing is
  considered sufficient. The URI SHOULD include a version and SHOULD resolve to a
  human-readable description, but MAY be unresolvable.
- The URI authority MUST be a domain the maintainer controls. The
  `in-toto.io/attestation/...` namespace is only available after official vetting
  through the ITE-9 predicate process.
- For type URIs, `0.X` counts as a major version.
- Unrecognized fields MUST be ignored by consumers.

### Why three subjects

The candidate artifact is the thing being attested, and its exact byte identity
is the `dirHash` subject. The source commit is a separate provenance subject so a
consumer can require it without weakening byte identity through DigestSet's
any-field matching rule. The packaged bundle is a third subject for toolchain
compatibility, because GitHub attestation tooling matches artifacts by computing
`sha256` over a file path and its `subject-digest` input must be `sha256:<hex>`.

### Directory hashing

Use `dirHash` from the in-toto DigestSet rather than hashing an archive.
`dirHash` is defined by in-toto as Go `sumdb/dirhash` Hash1, expressed as
lowercase hex without the `h1:` prefix. It covers only relative POSIX path plus
content. Files are sorted by path bytes, and the outer SHA-256 input contains one
exact line per file: lowercase content SHA-256, two ASCII spaces, path, and LF.
Paths containing LF are rejected.

The in-toto documentation gives this pipeline as an explanatory equivalent:

```text
find . -type f | cut -c3- | LC_ALL=C sort | xargs -r sha256sum | sha256sum
```

It is not the reference verifier: common `xargs` and `sha256sum` variants differ
across operating systems and mishandle some valid file names. The conformance
algorithm and POSIX verifier MUST construct the specified summary bytes directly
and test spaces, tabs, leading dashes, non-ASCII names, and an empty directory.

This deliberately excludes mtime, uid, gid, and permissions, which removes most
reproducible-archive failure modes. Archive determinism then only matters for the
transport container, not for identity.

`gitTree` MAY additionally be recorded as its own named ResourceDescriptor where
file mode is semantically relevant, since it covers path, content, and unix mode.
It MUST NOT share a DigestSet with `dirHash`.

## BlindEvaluation predicate, v0.1 sketch

Field naming follows in-toto predicate guidance: lowerCamelCase, RFC 3339
timestamps in `Z`, and timestamp names that state their meaning.

```json
{
  "protocol": {
    "mode": "pairwise",
    "assignmentAlgorithm": "balanced-seeded/v1",
    "assignmentSeed": "<hex>",
    "seedCommitment": { "sha256": "<hex>" },
    "preRegistration": {
      "digest": { "sha256": "<hex>" },
      "registeredAt": "2026-07-28T08:00:00Z"
    },
    "assignmentPlan": { "name": "assignments.jsonl", "digest": { "sha256": "<hex>" } },
    "blinding": {
      "armIdentityWithheld": true,
      "sideBalanced": true
    },
    "caseSet": { "name": "cases.jsonl", "digest": { "sha256": "<hex>" } },
    "rubric": { "name": "rubric.yaml", "digest": { "sha256": "<hex>" } }
  },
  "arms": [
    {
      "armId": "arm-1",
      "role": "baseline",
      "artifact": { "name": "baseline/", "digest": { "dirHash": "<hex>" } },
      "runtime": { "name": "runtime.json", "digest": { "sha256": "<hex>" } }
    },
    {
      "armId": "arm-2",
      "role": "candidate",
      "artifact": { "name": "candidate/", "digest": { "dirHash": "<hex>" } },
      "runtime": { "name": "runtime.json", "digest": { "sha256": "<hex>" } }
    }
  ],
  "execution": {
    "importer": "promptfoo",
    "importerVersion": "0.121.19",
    "outputSet": { "name": "outputs.jsonl", "digest": { "sha256": "<hex>" } }
  },
  "reviews": {
    "log": { "name": "reviews.jsonl", "digest": { "sha256": "<hex>" } },
    "plannedComparisons": 110,
    "includedComparisons": 104,
    "excludedComparisons": 3,
    "unfilledAssignments": 3,
    "distinctReviewers": 7,
    "distinctCases": 52
  },
  "blindingCheck": {
    "method": "reviewer-guess/v1",
    "guessesRecorded": 92,
    "guessedCorrectly": 49,
    "guessDeclined": 12
  },
  "results": {
    "analysisVersion": "descriptive/v1",
    "decisiveComparisons": 96,
    "candidatePreferred": 58,
    "baselinePreferred": 38,
    "ties": 6,
    "abstentions": 2,
    "positionBalance": { "candidateShownFirst": 52, "candidateShownSecond": 52 },
    "agreement": {
      "method": "observed-pairwise/v1",
      "multiplyReviewedCases": 40,
      "agreeingReviewerPairs": 96,
      "comparableReviewerPairs": 140
    },
    "byCase": {
      "log": { "name": "case-outcomes.jsonl", "digest": { "sha256": "<hex>" } },
      "casesPreferringCandidate": 31,
      "casesPreferringBaseline": 9,
      "casesWithoutMajority": 12
    }
  },
  "limitations": [
    {
      "code": "reviewer-pool-single-organization",
      "detail": { "name": "limitations/reviewer-pool.json", "digest": { "sha256": "<hex>" } }
    },
    {
      "code": "no-population-level-claim",
      "detail": { "name": "limitations/sample-scope.json", "digest": { "sha256": "<hex>" } }
    }
  ],
  "evaluatedAt": "2026-07-31T09:12:04Z"
}
```

### Pre-registration, and why it is required

`preRegistration.digest` is the JCS digest of the protocol object as it stood
**before the first review record was written**: mode, algorithm, seed commitment,
case set digest, rubric digest, and arm artifact digests. It MUST be written to
the bundle before reviewing starts, and the frozen predicate MUST carry the same
value.

Without it, nothing stops a producer from running the study, disliking the
result, quietly changing the case set or dropping an arm, and re-running until
the numbers are agreeable. That failure mode is silent, cheap, and invisible in
the output. Pre-registration does not prevent a re-run; it makes the re-run
visible as a second bundle with a different pre-registration digest, which is all
this project claims to do anywhere else.

### Assignment integrity: reveal the seed

`seedCommitment` alone proves nothing, because a commitment that is never opened
is not checkable. The frozen bundle MUST therefore reveal `assignmentSeed`, and a
verifier MUST confirm that `sha256(assignmentSeed)` equals `seedCommitment` and
that replaying `assignmentAlgorithm` with that seed reproduces `assignments.jsonl`
byte for byte.

This closes the gap that counts alone cannot close. Aggregate totals are
consistent with a producer who simply never assigned the comparisons they
expected to lose. `plannedComparisons` and `unfilledAssignments` make that
visible: a study that planned 110 comparisons and reports 40 unfilled ones is
readable as such, rather than presenting as a clean 70-comparison study.

### Blinding is measured, not asserted

`blinding.armIdentityWithheld` is a statement about the software. It says nothing
about whether reviewers could still tell the arms apart, and in practice they
often can: one arm formats with headings, one is consistently longer, one always
opens with an apology. Once a reviewer believes they know which is the new
version, the preference count measures their expectation rather than the output.

Reviewers SHOULD therefore be asked, after recording a preference, which arm they
believe was the candidate, with an explicit decline option. The predicate reports
the totals. `guessedCorrectly / guessesRecorded` is a descriptive diagnostic in
both directions because systematic misidentification can also indicate that arms
were distinguishable. V0.1 defines no distance threshold, MUST NOT emit a
`blindHeld` or `blindFailed` field, and a verifier MUST NOT derive one. With few
guesses, the distance is unstable; automatically classifying it would introduce
the statistical verdict this predicate otherwise rejects. An adopter MAY apply a
pre-registered policy and bind that policy digest to the decision record.

This is the single change with the largest effect on whether the evidence means
anything, and it costs one extra click per comparison.

### Agreement is descriptive, not inferential

A 58 to 38 split produced by seven reviewers who agree with each other is a
different object from the same split produced by seven reviewers who do not.
Without an agreement figure the aggregate can look decisive while being noise.

`agreement` reports observed pairwise agreement over cases reviewed by more than
one reviewer: the number of reviewer pairs that recorded the same outcome on the
same case, over the number of reviewer pairs that reviewed the same case. Chance
corrected coefficients such as Krippendorff's alpha MAY be reported additionally
under their own method name, but MUST NOT replace the observed figure, because
every chance correction embeds a model and this draft makes no modelling claim.

### Per-case outcomes carry the decision-relevant signal

Aggregate preference counts are the least useful number in the bundle. A release
is rarely blocked because the candidate won 58 to 38; it is blocked because nine
specific cases that used to work now do not.

`byCase` therefore reports the per-case majority outcome and points at
`case-outcomes.jsonl`, which carries one record per case with its case id and the
per-arm tallies. `casesPreferringBaseline` is the regression list length, and it
is the field a reviewer of the bundle should read first.

### Runtime parity

The comparability claim of this format is "same cases, same runtime, one variable
changed". That claim is unverifiable while each arm merely names its own runtime
file. Arms MUST therefore reference a byte-identical `runtime` digest. If the
runtimes genuinely differ, the arms are not comparable in the sense this format
means. The producer MUST use the `runtime-mismatch` limitation code, reference a
local detail record by digest, and MUST NOT present the study as a single-variable
comparison.

### Limitation records

Predicate limitations are machine-readable objects, not free-text strings. Each
object carries a stable `code` and MAY reference a detail file inside the local
bundle by name and SHA-256 digest. The predicate schema MUST reject unknown codes;
new codes require a specification revision. This keeps public attestations safe
to publish while allowing the deliberately shared bundle to preserve context.

### Privacy rule, derived from transparency log behaviour

The predicate MUST NOT contain reviewer identities, free text, prompt bodies, or
model outputs. It carries stable identifiers, aggregates, timestamps, and content
digests only.

Reason: attestations produced in public repositories are written to the Sigstore
public good instance and recorded in an immutable, publicly readable transparency
log. Anything placed in the predicate is effectively unretractable. Rationale
text and reviewer identity stay inside the local evidence bundle, which is shared
deliberately rather than published automatically.

### Counting rules

Every count in the predicate is a count of **comparisons**, not of reviewers or
cases, except where the field name says otherwise. The following invariants MUST
hold and MUST be checkable by a verifier without reading any free text:

```text
includedComparisons = decisiveComparisons + ties + abstentions
plannedComparisons  = includedComparisons + excludedComparisons + unfilledAssignments
decisiveComparisons = candidatePreferred + baselinePreferred
positionBalance.candidateShownFirst + positionBalance.candidateShownSecond
                    = includedComparisons
blindingCheck.guessesRecorded + blindingCheck.guessDeclined
                    <= includedComparisons
byCase.casesPreferringCandidate + byCase.casesPreferringBaseline
                    + byCase.casesWithoutMajority = distinctCases
```

Ties and abstentions are reported separately and MUST NOT be folded into
preference counts. No confidence interval or eligibility verdict is included at
v0.1, because the draft deliberately makes no statistical claim.

## Decision layer: reuse, do not invent

The human approval record SHOULD reuse the in-toto Simple Verification Result
predicate, `https://in-toto.io/attestation/svr/v0.2`, which is explicitly
designed not to be coupled to any specific framework:

```json
{
  "verifier": {
    "id": "https://github.com/acme/ai-platform",
    "policies": [
      { "name": "gate-policy.yaml", "digest": { "sha256": "<hex>" } }
    ]
  },
  "timeCreated": "2026-07-31T10:02:11Z",
  "properties": [
    "REK_BLIND_EVALUATION_PRESENT",
    "REK_HUMAN_APPROVED"
  ]
}
```

`verifier.policies` is REQUIRED and MUST be an empty array when no policy was
applied. Property names use a project prefix, matching existing practice where
policy engines namespace their own properties.

Avoid the SLSA Verification Summary Attestation, whose `verifiedLevels` is bound
to the SLSA result enum and whose `slsaVersion` and `dependencyLevels` fields
have no meaning here. Avoid the Test Result predicate, whose model assumes named
tests that pass or fail rather than graded preferences between two arms.

### Monotonic policy design

Policies consuming these attestations MUST be expressible monotonically: ignoring
an attestation must never turn a denial into an approval. Write rules as "reject
unless an approved evaluation attestation is present", never as "reject if a bad
attestation is present".

## Canonicalization and signing

- When a JSON document is hashed and that hash is used as a digest, the document
  MUST be canonicalized with RFC 8785 (JCS) before hashing.
- JCS constrains input to I-JSON. Implementations MUST error on NaN and Infinity
  and on lone surrogates.
- Numbers that cannot be represented exactly as IEEE 754 doubles MUST be encoded
  as strings. All counts in this predicate are small integers, so no field is
  permitted to carry a non-integer numeric value at v0.1.
- Signing is OPTIONAL. When used, the statement is wrapped in a DSSE envelope
  with `payloadType` set to `application/vnd.in-toto+json`. Consumers SHOULD rely
  on the statement `predicateType` rather than the media type.
- DSSE signs the pre-authentication encoding of the raw payload bytes, so
  canonicalization is not required for signature security. Verifiers MUST NOT
  re-parse the envelope to extract the payload after verification.

## Bundle layout

The evidence bundle is a self-describing directory that MAY be packaged as an
archive for transport:

```text
evidence-bundle/
  manifest.json          canonical root record, flat list of path and sha256
  pre-registration.json  protocol frozen before the first review
  cases.jsonl
  outputs.jsonl
  assignments.jsonl      planned comparisons, replayable from the seed
  reviews.jsonl          append-only, one record per line
  case-outcomes.jsonl    per-case majority outcome
  exclusions.jsonl
  rubric.yaml
  runtime.json
  artifacts/
    baseline/
    candidate/
  attestations/
    evaluation.intoto.jsonl
    decision.intoto.jsonl
```

The in-toto bundle layer is JSON Lines of envelopes and is explicitly not
authenticated as a whole, so an attacker can remove, replay, or inject
envelopes. `manifest.json` therefore lists every referenced file with its digest,
and verification MUST check the manifest before trusting any individual
attestation.

## Verification algorithm

A conforming verifier MUST:

1. Read `manifest.json` and confirm every referenced path resolves inside the
   bundle and matches its declared digest.
2. Recompute `dirHash` for each arm artifact directory and compare with the
   predicate, and confirm that all arms reference the same `runtime` digest.
3. Recompute the digest of `reviews.jsonl` and confirm it matches
   `reviews.log.digest`.
4. Confirm `sha256(protocol.assignmentSeed)` equals `protocol.seedCommitment`,
   replay `assignmentAlgorithm` with that seed, and confirm the result matches
   `assignments.jsonl`; then confirm every review record maps to a planned
   assignment and that `unfilledAssignments` equals the number of planned
   assignments with no review record.
5. Recompute `preRegistration.digest` over the JCS form of the protocol object
   with `assignmentSeed` removed, and confirm it matches the value recorded
   before reviewing started.
6. Recompute every invariant in the counting rules from `reviews.jsonl` and
   `case-outcomes.jsonl`, and confirm each matches the predicate.
7. Confirm the decision attestation references the evaluation attestation and the
   policy digest it claims.
8. If a DSSE envelope is present, verify the signature before reading the
   payload, and use only the verified payload bytes.

A verifier MUST be able to complete steps 1 to 7 with no network access and no
running server.

### Verification MUST NOT depend on this project

The dominant failure mode in this category is abandonment, so a bundle whose only
verifier is an npm package from an unmaintained repository has not solved the
problem it claims to solve. Steps 1 to 3 MUST therefore remain expressible with
standard command line tools, and the specification repository MUST publish a
POSIX shell reference verifier of that subset alongside any richer
implementation.

```sh
# step 1, manifest integrity
jq -r '.files[] | "\(.sha256)  \(.path)"' manifest.json | sha256sum -c -

# step 2, capability directory identity
( cd artifacts/candidate && find . -type f | cut -c3- | LC_ALL=C sort \
    | xargs -r sha256sum | sha256sum )

# step 3, review log integrity
sha256sum reviews.jsonl
```

`manifest.json` MUST therefore keep a flat `files` array of path and `sha256`
pairs, even though richer structures would be more elegant, because that shape is
the one a stranger can check in 2035 without installing anything.

## Conformance profiles

| Profile | Requirement |
| --- | --- |
| Core | Produce and verify an unsigned bundle, including `dirHash`, JCS canonicalization, and the verification algorithm above |
| Signed | Additionally produce and verify DSSE envelopes |
| CI | Additionally emit attestations through a CI provider such as GitHub artifact attestations |

Conformance is defined by passing the published test vectors, not by self
assertion. Each normative requirement gets a stable identifier that maps to at
least one vector.

## CI integration sketch

Verified against current GitHub documentation. Custom predicates are supported.

```yaml
permissions:
  id-token: write
  attestations: write

steps:
  - uses: actions/attest@v4
    with:
      subject-path: evidence-bundle.tar
      predicate-type: https://<controlled-domain>/BlindEvaluation/v0.1
      predicate-path: evaluation-predicate.json
```

Verification requires the predicate type explicitly, because the CLI defaults to
SLSA provenance:

```bash
gh attestation verify evidence-bundle.tar \
  -R acme/ai-platform \
  --predicate-type https://<controlled-domain>/BlindEvaluation/v0.1
```

Constraints that MUST be documented for adopters:

- Artifact attestations are available for public repositories on all plans.
  Private and internal repositories require GitHub Enterprise Cloud, and GitHub
  Enterprise Server is not supported. The format therefore MUST remain fully
  usable with no CI provider at all.
- `predicate` or `predicate-path` is limited to 16 MB, and a statement may carry
  at most 1024 subjects.
- Only the signing certificate and verified timestamps are outside the control of
  the workflow that produced the attestation. A compromised workflow can falsify
  predicate contents. Where this matters, produce attestations from a reusable
  workflow and verify with `--signer-workflow`.
- Offline verification is possible by downloading the bundle and a trusted root,
  but a cached trusted root has no expiry and will not reflect key revocation.

## Open questions

- Whether the review log needs a per-record hash chain, or whether a digest over
  the whole append-only file is sufficient. Answering this from first principles
  is wasted effort; build one real bundle and see whether partial-return merging
  in the shared-bundle recipe forces the chain.
- Whether a second predicate is needed for N-arm ranking, or whether `arms` and
  `results` generalize.
- Whether `agreement` should also require a chance-corrected coefficient once
  enough real bundles exist to show whether observed agreement misleads.
- Whether to seek ITE-9 vetting, which would allow the `in-toto.io` namespace but
  requires maintaining the predicate in the in-toto repository.

Resolved while drafting: `runtime` stays inside each arm, because arms MUST share
a byte-identical digest and a per-arm field makes that check local rather than
implied.

## The question this draft cannot answer on paper

No further round of specification writing will improve this document. It has
never been run against a real bundle, and the open questions above are exactly
the ones that a single hand-built bundle from one real release decision would
settle in an afternoon. Producing that bundle by hand, before writing normative
text, is the next step. A specification with thirty decisions and zero bundles is
the failure mode this project claims to be avoiding.