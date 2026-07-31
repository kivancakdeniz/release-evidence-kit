# Architecture

## Architecture principle

The evidence bundle is the boundary. Everything else is replaceable.

Execution, trace storage, identity, collaboration, and deployment stay in the
tools an adopter already runs. This project supplies a format, a way to produce a
bundle, and a way to verify one. It never becomes the system of record.

A consequence worth stating plainly: if the reference implementation disappears,
every bundle ever produced must remain readable and verifiable from its own
bytes.

## Format layers

```text
predicate    blind evaluation results, defined by this project
statement    in-toto Statement v1, reused
envelope     DSSE, reused, optional
bundle       evidence directory plus a canonical manifest
```

Only the predicate is new. See the evidence format draft for field-level detail.

## Logical flow

```text
Git / filesystem
  -> artifact digest over a declared root
  -> frozen case set and protocol
  -> imported executions
  -> seeded opaque assignments
  -> blind review page
  -> reviews and exclusions
  -> frozen evidence record
  -> human decision record
  -> optional attestation and signature
```

## Reference deployment

```text
release-evidence CLI
  -> creates a self-contained bundle
  -> starts a loopback-only review page
  -> appends reviews to JSONL
  -> freezes canonical evidence and decision records
  -> verifies every referenced digest without a server
```

There is no project database, shared content-addressed store, management API,
management UI, authentication, provider runner, or hosted component. Artifact
files and imported outputs are copied into the bundle. That duplication is
intentional: it is what makes a bundle verifiable on a machine that has never
heard of this project.

## Deployment recipes

Three supported ways to run the workflow. None of them requires a service
operated by this project.

### Local, no CI

```text
release-evidence CLI
  -> creates a self-contained bundle
  -> starts a loopback-only review page
  -> appends reviews to JSONL
  -> freezes canonical evidence and decision records
  -> verifies every digest with no network
```

This is the baseline and MUST always work. It is also the only recipe available
when the adopter cannot use hosted CI, which includes GitHub Enterprise Server
users.

### CI-attested

```text
repository CI job
  -> restores the bundle produced locally or by an importer
  -> verifies it
  -> emits an in-toto attestation with a custom predicate type
  -> a consumer verifies with the platform CLI or any Sigstore client
```

This adds tamper-evidence and a timestamped signature without adding a server.
Adopters must be told two things: only the signing certificate and verified
timestamps are outside the control of the workflow that produced the attestation,
so a compromised workflow can still falsify predicate contents; and on public
repositories the attestation is written to a public, immutable transparency log,
which is why the predicate carries aggregates and digests rather than reviewer
identities or rationale text.

### Shared-bundle review

```text
owner produces bundle -> reviewer receives a copy
  -> reviewer reviews offline
  -> reviewer returns an append-only review log
  -> owner merges by digest and freezes
```

This covers multi-reviewer work without building identity, invitations, or
reservations. It trades convenience for scope, deliberately.

## Repository layout

Two repositories, split by license and by consumption pattern:

```text
release-evidence-kit-spec/
  spec/v0/          normative text
  schemas/v0/       JSON Schema
  requirements/     stable identifiers for normative statements
  vectors/          conformance vectors, vendorable as a submodule
  docs/             tutorial, how-to, reference, explanation

release-evidence-kit/
  action.yml        GitHub Action, must sit at repository root
  src/cli/          init, bundle, review, freeze, decide, verify
  src/review-web/   loopback review page
  src/verify/       verifier with no shared code path with the producer
  examples/
```

The implementation stays a single small package. There is no monorepo of
adapters, no persistence layer, and no API package, because there is no server.

## Artifact snapshots

An artifact snapshot is a deterministic digest over a declared file or folder
root, plus a content manifest. Directory identity uses the in-toto `dirHash`
algorithm, which covers relative path and content only. Excluding mtime, owner,
and permissions removes most reproducible-archive failure modes, so archive
format becomes a transport concern rather than part of identity.

There is no shared content-addressed store. Bundles copy what they reference,
which costs duplication and buys portability.

The snapshot process must:

- normalize relative paths to POSIX separators,
- reject absolute paths and `..` escapes,
- reject symlinks leaving the root,
- enforce file count, per-file size, and total size limits,
- exclude configured secrets and generated files,
- record byte hash, relative path, mode, and media type,
- create a deterministic manifest hash.

Artifact type is metadata. Core logic does not define prompt/skill/agent
subclasses.

## Execution model

The project imports execution results. It never calls a model, never holds
provider credentials, and never executes a shell command.

Supported inputs:

- generic JSON or JSONL output sets,
- Promptfoo results,
- other importers contributed as needed.

An imported execution records case identity, arm identity, input digest, output
digest, importer name and version, and whatever provenance the source supplied.
Missing provenance is recorded as missing rather than synthesized. Output editing
creates a new record; it never rewrites history.

## Assignment and blinding

- Protocol revision is immutable once a study opens.
- Assignment plan is derived from a study seed and algorithm version.
- Reviewer payload contains opaque arm presentation IDs only.
- Candidate names, branches, artifact paths, labels, and hashes do not appear in
  reviewer DOM, URL, or pre-decision network payload.
- Pairwise side assignment is balanced within one completed batch.
- Assignment and review submission are idempotent.
- Study close freezes included reviews and exclusion rules.

## Renderers

Supported renderers:

- plain text and Markdown,
- structured JSON with stable key ordering and collapsible sections.

Trace summaries and multimodal outputs are out of scope. This is not a trace
backend.

## Evidence records

Evidence computation is deterministic and versioned. It produces descriptive
metrics and explicit sample limitations, and never claims statistical
eligibility.

An evidence record references:

- the frozen protocol,
- included review identifiers and the exclusion set,
- the analysis algorithm version,
- descriptive counts and position balance,
- integrity check results.

Changing an exclusion or the algorithm produces a new record. Records are never
edited in place.

## Decision record

A decision is not a deployment. It records:

- the capability and candidate artifact digests,
- the evidence digest,
- the policy digest, when a policy was applied,
- the named human who recorded it,
- the decision, rationale, and timestamp.

The decision record reuses the in-toto Simple Verification Result predicate,
which is deliberately not coupled to any particular framework. Downstream systems
may consume it; nothing in this project acts on it.

It is a canonical file inside the bundle, tracked in Git if the adopter wants
history. There is no ledger service.

## Interfaces

The stable interfaces are the bundle format, the JSON Schemas, the conformance
vectors, and the command-line surface. There is no HTTP API.

The review page is served on loopback for the duration of a review session and
exposes only what that session needs: fetching the next assignment and submitting
a review. It is not an application server, and it does not outlive the session.
