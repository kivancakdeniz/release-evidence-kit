# Security and Threat Model

## Security posture

The reference implementation is local and import-only. It never executes
capability code, exposes a public review link, accepts a remote identity, or
receives provider credentials. Those surfaces are absent, not disabled options.

## Assets

- capability source artifacts,
- model prompts and outputs,
- reviewer identity and feedback,
- study assignment seed and arm mapping,
- evidence and decision records,
- imported trace summaries and structured outputs,
- portable bundle manifests, review logs, and detached bundle hash.

## Trust boundaries

1. Local filesystem to artifact snapshotter.
2. Imported output files to bundle contents.
3. CLI to loopback review browser.
4. Bundle transfer between an owner and a reviewer.
5. Bundle to any third-party verifier.
6. CI workflow to attestation signing and transparency log.

## Major threats and mitigations

### Secret capture in snapshots

Threat: `.env`, credentials, private keys, browser state, or generated caches are
included in an artifact.

Mitigations:

- default deny patterns for known secret/state files,
- explicit include roots,
- gitleaks-compatible scan before snapshot acceptance,
- size/file-count limits,
- manifest preview and confirmation,
- documentation that bundle encryption and access control belong to the adopter's
  existing file-transfer and storage systems.

### Path traversal and symlink escape

Threat: artifact traversal reads outside the declared root.

Mitigations:

- canonical root resolution,
- reject absolute and parent segments,
- inspect every symlink target,
- reject device files and sockets,
- deterministic path normalization tests.

### Untrusted input execution

Threat: a crafted manifest, imported output, or artifact causes command execution
or reaches a parser feature that loads external resources.

Mitigations:

- no provider runner, plugin loader, lifecycle script, template execution, or
  shell command surface,
- structured parsers with external entity and remote reference loading disabled,
- importer selection from a built-in allowlist,
- imported values passed as data rather than command, path, or HTML fragments,
- conformance vectors for malicious paths, parser edge cases, and oversized data.

### Blinding leaks

Threat: reviewer discovers candidate identity through labels, DOM, URL, network
payload, output metadata, timing, or consistent ordering.

Mitigations:

- opaque assignment and presentation IDs,
- strip candidate labels/paths/hashes from reviewer payload,
- owner-side mapping only,
- deterministic balanced order,
- renderer redaction policy,
- pre-release browser/network leak tests,
- delay identity reveal until review is submitted or study closes.

### Assignment manipulation

Threat: reviewer requests assignments repeatedly to seek a desired arm/order or
submits more than once.

Mitigations:

- assignments come from the pre-registered deterministic plan,
- opaque assignment and presentation IDs,
- idempotent submit,
- immutable algorithm version and seed commitment,
- append-only correction and exclusion records,
- planned, completed, excluded, and unfilled counts remain visible after freeze.

### Feedback poisoning and abuse

Threat: spam, coordinated voting, copied rationale, Sybil reviewers, or prompt
injection text manipulates evidence.

Mitigations:

- owner-selected reviewers recorded by opaque local reference,
- duplicate assignment/reviewer checks,
- rationale length and schema limits,
- anomaly flags and exclusions rather than destructive deletion,
- reviewer-pool and selection limitations recorded by stable code,
- no automatic decision or downstream action.

### Statistical misuse

Threat: dependent reviews are treated as independent, small samples are promoted,
or multiple comparisons produce false winners.

Mitigations:

- frozen protocol, endpoints, and exclusion rules,
- raw counts, position balance, observed agreement, and per-case outcomes,
- no confidence interval, significance test, eligibility status, or default gate,
- explicit limitation codes bound to local detail records,
- a named human records the decision and its rationale.

### Returned review log tampering

Threat: a reviewer returns a modified review log, or an owner silently edits a
returned log before freezing evidence.

Mitigations:

- review logs are append-only with unique record identifiers,
- merges are performed by digest and the resulting digest is recorded in the
  evidence record,
- excluded records are retained with a reason rather than deleted,
- the evidence record lists exactly which review identifiers it included, so a
  later reader can recount.

This threat is accepted rather than eliminated. The format proves what evidence a
decision was made against; it cannot prove that reviewers were honest or that an
owner selected reviewers fairly.

### Bundle disclosure

Threat: a bundle copy exposes capability source, model outputs, reviewer feedback,
or local identities to an unintended recipient.

Mitigations:

- restrictive local file permissions by default,
- explicit warning before bundle transfer,
- a public attestation predicate containing no identities or free text,
- bundle encryption and recipient access control delegated to the adopter's
  existing transfer system.

### Stored XSS and renderer attacks

Threat: model output or rationale contains HTML/script or malicious JSON keys.

Mitigations:

- sanitize Markdown and disallow raw HTML by default,
- render JSON as text, not HTML,
- strict CSP,
- no dynamic script URLs,
- artifact downloads served with safe content disposition,
- renderer snapshot tests.

### Decision tampering

Threat: evidence or policy changes after a decision is recorded, or a different
artifact is released under the same label.

Mitigations:

- immutable content digests,
- decision bound to evidence, policy, and artifact digests,
- append-only decision records,
- optional signed attestation over the decision,
- consuming systems verify digests before acting.

### Bundle tampering and partial writes

Threat: a local actor edits reviews, swaps an output, truncates JSONL, or freezes
evidence while a review write is incomplete.

Mitigations:

- canonical JSON and declared SHA-256 for every referenced file,
- atomic temporary-file then rename for manifest writes,
- append-only review records with unique IDs and optional previous-record hash,
- exclusive close/freeze lock and explicit closed marker,
- evidence lists exact included review IDs and hashes,
- `bundle verify` before analysis, decision, import, or deployment consumption,
- optional signed Git commit or detached signature for custody beyond one host.

### Irreversible disclosure through a transparency log

Threat: an adopter emits an attestation from a public repository, and reviewer
identities, rationale text, prompts, or outputs become permanently public.

Attestations produced in public repositories are signed by a public-good instance
and recorded in an immutable, publicly readable transparency log. There is no
retraction.

Mitigations:

- the predicate carries aggregates and digests only, never identities or free
  text,
- the specification states this as a requirement rather than a recommendation,
- documentation warns that private and internal repositories need a paid tier and
  that self-hosted CI is unsupported for this feature,
- the local recipe works with no CI provider at all.

### Falsified predicate content from a compromised workflow

Threat: an attacker with access to the CI job that emits the attestation writes
arbitrary predicate content, and downstream consumers trust it because the
signature verifies.

Only the signing certificate and verified timestamps are outside the control of
the workflow that produced the attestation. Predicate contents are not.

Mitigations:

- emit attestations from a reusable workflow that the calling repository cannot
  modify, and verify the signer workflow identity,
- treat an attestation as evidence that a bundle existed at a time, from a
  source, not as evidence that the humans behind it were honest,
- keep the bundle itself independently verifiable so a consumer can recheck the
  claims rather than trusting the signature alone.

### Attestation bundle manipulation

Threat: an attacker removes, replays, or injects envelopes, because the in-toto
bundle layer is explicitly not authenticated as a whole.

Mitigations:

- the bundle manifest lists every referenced file with its digest, and
  verification checks the manifest before trusting any individual attestation,
- policies are written monotonically, so ignoring an attestation can never turn a
  denial into an approval,
- decision records reference the exact evidence digest they were made against.

### Signature and canonicalization pitfalls

Threat: an implementation verifies a signature and then re-parses the envelope to
extract the payload, or canonicalization silently rewrites values.

Mitigations:

- verifiers use only the verified payload bytes and never re-parse the envelope
  after verification,
- numeric fields are restricted to small integers, so canonicalization cannot
  change a value through floating-point rewriting,
- implementations reject NaN, Infinity, and lone surrogates rather than coercing
  them,
- conformance vectors include cases that fail if a value is round-tripped through
  a native date or big-number type.

### Stale trust material

Threat: an offline verifier keeps a cached trust root and accepts material that
has since been revoked.

A cached trust root has no built-in expiry, and a verifier cannot tell whether
key material was revoked after it was fetched.

Mitigations:

- document that offline verification is point-in-time,
- record when the trust root was fetched,
- keep signature verification optional so that core verification never depends on
  external trust material.

## Deployment profiles

### Local

- CLI and loopback-only review page,
- self-contained bundle and no database,
- imported outputs only,
- no auth, provider network calls, shell runner, or public links,
- file permissions limit bundle access to the local user by default.

### CI-attested

- attestation emitted from a workflow the calling repository cannot modify,
- predicate content restricted to aggregates and digests,
- signer identity verified on the consuming side,
- the workflow never receives reviewer identities or rationale text.

### Shared-bundle review

- bundles are transferred deliberately by the owner,
- returned review logs are append-only and merged by digest,
- the owner verifies the whole bundle before freezing evidence,
- no shared service, account, or invitation mechanism exists.

Profiles involving hosted services, databases, authentication providers, or
public collection are out of scope and are not planned.

## Security release gates

- [ ] Bundle path traversal, canonicalization, and digest verification pass.
- [ ] Partial or truncated review writes cannot enter frozen evidence.
- [ ] Snapshot traversal and secret tests pass.
- [ ] Reviewer payload has no candidate identity leakage.
- [ ] Review submission is idempotent.
- [ ] Freeze and decision invariants pass.
- [ ] Predicate contains no identity or free-text field, enforced by schema.
- [ ] Verification uses only verified payload bytes after signature checking.
- [ ] Dependency and secret scans are clean.
- [ ] CSP and output sanitization tests pass.
- [ ] Verification succeeds in a clean environment with no server and no network.
- [ ] Conformance vectors pass on the independent verifier.
