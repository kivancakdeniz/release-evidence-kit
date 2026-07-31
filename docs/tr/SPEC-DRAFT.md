# Kanıt Formatı Ön Taslağı

> Bu belge, İngilizce [kaynak metnin](../SPEC-DRAFT.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.
>
> **Durum:** Ön taslak planlama çalışmasıdır ve normatif değildir.

Durum: pre-draft planning sketch. Normative değildir. Herhangi bir kod
yazılmadan önce formatın uygulanabilir olduğunu kanıtlamak ve daha sonra dedicated
specification repository'ye taşınmak için vardır.

Final specification içindeki MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD,
SHOULD NOT, RECOMMENDED, NOT RECOMMENDED, MAY ve OPTIONAL anahtar sözcükleri,
yalnızca tamamen büyük harfle göründüklerinde BCP 14'te (RFC 2119, RFC 8174)
açıklandığı biçimde yorumlanacaktır.

## Tasarım kuralı

Yeni bir envelope, signing scheme, transparency log veya verification CLI icat
etmeyin. in-toto attestation stack'i yeniden kullanın ve yalnızca var olmayan tek
şeyi tanımlayın: bir capability revision'ın blind human evaluation'ını açıklayan
predicate.

in-toto attestation framework'ünden katmanlar:

```text
predicate   <- defined here
statement   <- in-toto Statement v1
envelope    <- DSSE, optional
bundle      <- JSON Lines of envelopes, plus a self-describing evidence directory
```

## Statement biçimi

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

Doğrulanmış in-toto kurallarını izleyen notlar:

- `_type` her zaman `https://in-toto.io/Statement/v1` olması MUST'tır.
- `subject` bir ResourceDescriptor array'dir; bu nedenle multiple entry'ye izin
  verilir. Her entry'nin `digest` taşıması MUST'tır.
- İki DigestSet, kabul edilebilir herhangi bir field eşleşirse eşleşmiş sayılır.
  Bu nedenle `dirHash` ve `gitCommit` aynı DigestSet'te görünmemeleri MUST'tır:
  aynı commit farklı working-tree byte'larına sahip olabilir ve aksi durumda
  `gitCommit` eşleşmesi `dirHash` uyuşmazlığını gizler.
- Predicate type URI'ları hiçbir yerde kayıtlı değildir. Natural URI namespacing
  yeterli kabul edilir. URI'nin version içermesi SHOULD ve human-readable
  description'a çözülmesi SHOULD'dur; ancak çözümlenemez olması MAY'dir.
- URI authority, maintainer'ın denetlediği bir domain olması MUST'tır.
  `in-toto.io/attestation/...` namespace'i yalnızca ITE-9 predicate process
  üzerinden resmî inceleme sonrasında kullanılabilir.
- Type URI'ları için `0.X` major version sayılır.
- Tanınmayan field'ların consumer'lar tarafından yok sayılması MUST'tır.

### Neden üç subject var

Candidate artifact attested edilen şeydir ve exact byte identity'si `dirHash`
subject'tir. Source commit ayrı bir provenance subject'tir; böylece consumer,
DigestSet'in any-field matching rule'u üzerinden byte identity'yi zayıflatmadan
bunu zorunlu tutabilir. Packaged bundle, toolchain compatibility için üçüncü
subject'tir; çünkü GitHub attestation tooling artifact'ları file path üzerinde
`sha256` hesaplayarak eşleştirir ve `subject-digest` input'unun
`sha256:<hex>` olması gerekir.

### Dizin hashing

Archive hash'lemek yerine in-toto DigestSet'teki `dirHash` kullanın. `dirHash`,
in-toto tarafından lowercase hex biçiminde ve `h1:` prefix'i olmadan ifade edilen
Go `sumdb/dirhash` Hash1 olarak tanımlanır. Yalnızca relative POSIX path ve content'i
kapsar. File'lar path byte'larına göre sıralanır; dış SHA-256 input her file için
exact bir line içerir: lowercase content SHA-256, iki ASCII space, path ve LF.
LF içeren path'ler reddedilir.

in-toto dokümantasyonu şu pipeline'ı açıklayıcı bir eşdeğer olarak verir:

```text
find . -type f | cut -c3- | LC_ALL=C sort | xargs -r sha256sum | sha256sum
```

Bu reference verifier değildir: yaygın `xargs` ve `sha256sum` varyantları
operating system'lar arasında farklıdır ve bazı valid file name'leri yanlış işler.
Conformance algorithm ve POSIX verifier'ın belirtilen summary byte'larını doğrudan
oluşturması; space, tab, leading dash, non-ASCII name ve empty directory'yi test
etmesi MUST'tır.

Bu yaklaşım mtime, uid, gid ve permission'ları kasıtlı olarak hariç tutar; bu da
reproducible-archive failure mode'larının çoğunu kaldırır. Archive determinism
böylece identity için değil, yalnızca transport container için önemlidir.

File mode semantik olarak anlamlı olduğunda `gitTree` ayrıca kendi adlandırılmış
ResourceDescriptor'ı olarak kaydedilmesi MAY'dir; çünkü path, content ve unix
mode'u kapsar. `dirHash` ile aynı DigestSet'i paylaşmaması MUST'tır.

## BlindEvaluation predicate, v0.1 taslağı

Field naming in-toto predicate guidance'ı izler: lowerCamelCase, `Z` biçiminde
RFC 3339 timestamp'leri ve anlamını belirten timestamp adları.

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

### Pre-registration ve neden zorunlu olduğu

`preRegistration.digest`, protocol object'in **ilk review record yazılmadan
önceki** hâlinin JCS digest'idir: mode, algorithm, seed commitment, case set
digest, rubric digest ve arm artifact digest'leri. Review başlamadan önce bundle'a
yazılması MUST'tır ve frozen predicate'in aynı değeri taşıması MUST'tır.

Bu olmadan producer'ın study'yi çalıştırmasını, sonucu beğenmemesini, case set'i
sessizce değiştirmesini veya bir arm'ı kaldırmasını ve sayılar uygun görünene kadar
yeniden çalıştırmasını hiçbir şey engellemez. Bu failure mode sessiz, ucuz ve
output'ta görünmezdir. Pre-registration yeniden çalıştırmayı engellemez; farklı
pre-registration digest'e sahip ikinci bir bundle olarak görünür kılar ve bu,
projenin başka her yerde iddia ettiği tek şeydir.

### Assignment bütünlüğü: seed'i açıklama

`seedCommitment` tek başına hiçbir şeyi kanıtlamaz; çünkü hiç açılmayan commitment
kontrol edilemez. Frozen bundle'ın bu nedenle `assignmentSeed`'i açıklaması
MUST'tır ve verifier'ın `sha256(assignmentSeed)` değerinin `seedCommitment`'a
eşit olduğunu ve `assignmentAlgorithm`'ın bu seed ile replay edilmesinin
`assignments.jsonl` dosyasını byte for byte yeniden ürettiğini doğrulaması
MUST'tır.

Bu, yalnız count'ların kapatamayacağı açığı kapatır. Aggregate total'lar,
kaybedeceğini düşündüğü comparison'ları hiç atamamış producer ile tutarlıdır.
`plannedComparisons` ve `unfilledAssignments` bunu görünür kılar: 110 comparison
planlayan ve 40 unfilled comparison bildiren study, temiz bir 70-comparison study
gibi sunulmak yerine olduğu gibi okunur.

### Blinding iddia edilmez, ölçülür

`blinding.armIdentityWithheld` software hakkında bir statement'tır. Reviewer'ların
arm'ları yine de ayırt edip edemediği hakkında hiçbir şey söylemez; pratikte çoğu
zaman ayırt edebilirler: bir arm heading kullanır, biri sürekli daha uzundur, biri
her zaman apology ile başlar. Reviewer yeni version'ın hangisi olduğunu bildiğine
inandığında preference count, output yerine beklentisini ölçer.

Bu nedenle reviewer'lara preference kaydettikten sonra, explicit decline option
ile hangi arm'ın candidate olduğunu düşündüklerinin sorulması SHOULD'dur.
Predicate total'ları raporlar. Systematic misidentification da arm'ların ayırt
edilebilir olduğunu gösterebildiği için `guessedCorrectly / guessesRecorded` iki
yönde de descriptive diagnostic'tir. V0.1 distance threshold tanımlamaz,
`blindHeld` veya `blindFailed` field üretmemesi MUST'tır ve verifier'ın bunlardan
birini türetmemesi MUST'tır. Az guess ile distance kararsızdır; otomatik
sınıflandırma bu predicate'in başka yerde reddettiği statistical verdict'ü
getirir. Benimseyenin pre-registered policy uygulaması ve policy digest'i decision
record'a bağlaması MAY'dir.

Bu, evidence'ın anlamlı olup olmaması üzerinde en büyük etkiye sahip tek
değişikliktir ve comparison başına bir ekstra tıklamaya mal olur.

### Agreement betimseldir, inferential değildir

Birbiriyle agreement sağlayan yedi reviewer'ın ürettiği 58'e 38 split, agreement
sağlamayan yedi reviewer'ın aynı split'inden farklı bir nesnedir. Agreement figure
olmadan aggregate, noise iken decisive görünebilir.

`agreement`, birden fazla reviewer tarafından review edilen case'ler üzerinde
observed pairwise agreement'ı raporlar: aynı case üzerinde aynı outcome'u kaydeden
reviewer pair sayısının aynı case'i review eden reviewer pair sayısına oranı.
Krippendorff's alpha gibi chance corrected coefficient'ların kendi method name'i
altında ek olarak raporlanması MAY'dir; ancak observed figure'ın yerini almaması
MUST'tır. Çünkü her chance correction bir model içerir ve bu taslak modelling
claim'de bulunmaz.

### Case başına sonuçlar decision-relevant sinyali taşır

Aggregate preference count'lar bundle'daki en az yararlı sayıdır. Bir release
nadiren candidate 58'e 38 kazandığı için engellenir; daha önce çalışan dokuz
belirli case artık çalışmadığı için engellenir.

Bu nedenle `byCase`, case başına majority outcome'u raporlar ve case id ile
per-arm tally'leri içeren, case başına bir record taşıyan `case-outcomes.jsonl`
dosyasına işaret eder. `casesPreferringBaseline` regression list length'tir ve
bundle reviewer'ın önce okuması gereken field'dır.

### Runtime eşitliği

Bu formatın comparability claim'i “same cases, same runtime, one variable changed”
şeklindedir. Her arm yalnızca kendi runtime file'ını adlandırdığında claim
doğrulanamaz. Bu nedenle arm'ların byte-identical `runtime` digest'e referans
vermesi MUST'tır. Runtime'lar gerçekten farklıysa arm'lar bu formatın kastettiği
anlamda karşılaştırılabilir değildir. Producer'ın `runtime-mismatch` limitation
code kullanması, local detail record'a digest ile referans vermesi MUST'tır ve
study'yi single-variable comparison olarak sunmaması MUST'tır.

### Limitation record'ları

Predicate limitation'ları free-text string değil, machine-readable object'lerdir.
Her object stable `code` taşır ve local bundle içindeki detail file'a name ve
SHA-256 digest ile referans vermesi MAY'dir. Predicate schema'nın unknown code'ları
reddetmesi MUST'tır; new code specification revision gerektirir. Bu yaklaşım,
public attestation'ları güvenle yayımlanabilir tutarken bilinçli olarak paylaşılan
bundle'ın context'i korumasına izin verir.

### Transparency log davranışından türetilen privacy kuralı

Predicate'in reviewer identity, free text, prompt body veya model output
içermemesi MUST'tır. Yalnızca stable identifier, aggregate, timestamp ve content
digest taşır.

Nedeni: public repository'lerde üretilen attestation'lar Sigstore public good
instance'a yazılır ve immutable, publicly readable transparency log'a kaydedilir.
Predicate'e konulan her şey fiilen geri alınamaz. Rationale text ve reviewer
identity, otomatik yayımlanmak yerine bilinçli olarak paylaşılan local evidence
bundle içinde kalır.

### Sayım kuralları

Field name aksini belirtmedikçe predicate'teki her count reviewer veya case değil,
**comparison** sayısıdır. Aşağıdaki invariant'ların geçerli olması MUST'tır ve bir
verifier tarafından free text okunmadan kontrol edilebilmesi MUST'tır:

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

Tie ve abstention'lar ayrı raporlanır ve preference count'lara katılmaması
MUST'tır. Taslak bilinçli olarak statistical claim'de bulunmadığından v0.1'de
confidence interval veya eligibility verdict yoktur.

## Karar katmanı: yeniden kullanın, icat etmeyin

Human approval record'ın, herhangi bir framework'e bağlı olmayacak şekilde
tasarlanmış in-toto Simple Verification Result predicate'i
`https://in-toto.io/attestation/svr/v0.2`'yi yeniden kullanması SHOULD'dur:

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

`verifier.policies` REQUIRED'dır ve policy uygulanmadığında empty array olması
MUST'tır. Property name'leri, policy engine'lerin kendi property'lerini namespace
ettiği mevcut uygulamayla uyumlu biçimde project prefix kullanır.

`verifiedLevels` alanı SLSA result enum'a bağlı, `slsaVersion` ve
`dependencyLevels` field'ları burada anlamsız olan SLSA Verification Summary
Attestation'dan kaçının. Modeli, iki arm arasındaki graded preference yerine
pass/fail olan named test varsayan Test Result predicate'inden kaçının.

### Monotonik policy tasarımı

Bu attestation'ları tüketen policy'lerin monotonik ifade edilebilmesi MUST'tır:
bir attestation'ı yok saymak denial'ı hiçbir zaman approval'a dönüştürmemelidir.
Kuralları “bad attestation varsa reddet” değil, “approved evaluation attestation
yoksa reddet” biçiminde yazın.

## Canonicalization ve signing

- Bir JSON document hash'lendiğinde ve bu hash digest olarak kullanıldığında,
  document'ın hashing öncesinde RFC 8785 (JCS) ile canonicalize edilmesi MUST'tır.
- JCS input'u I-JSON ile sınırlar. Implementation'ların NaN ve Infinity ile lone
  surrogate'larda error vermesi MUST'tır.
- IEEE 754 double olarak exact temsil edilemeyen number'ların string olarak encode
  edilmesi MUST'tır. Bu predicate'teki tüm count'lar small integer olduğundan
  v0.1'de hiçbir field'ın non-integer numeric value taşımasına izin verilmez.
- Signing OPTIONAL'dır. Kullanıldığında statement, `payloadType` değeri
  `application/vnd.in-toto+json` olan DSSE envelope içinde sarmalanır.
  Consumer'ların media type yerine statement `predicateType`'a dayanması SHOULD'dur.
- DSSE raw payload byte'larının pre-authentication encoding'ini imzalar; dolayısıyla
  signature security için canonicalization gerekmez. Verifier'ların verification
  sonrasında payload'ı çıkarmak için envelope'u yeniden parse etmemesi MUST'tır.

## Bundle düzeni

Evidence bundle, transport için archive olarak paketlenmesi MAY olan self-describing
directory'dir:

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

in-toto bundle layer, envelope'lardan oluşan JSON Lines'dır ve bir bütün olarak
açıkça authenticated değildir; dolayısıyla attacker envelope'ları remove, replay
veya inject edebilir. Bu nedenle `manifest.json` referenced file'ların tümünü
digest'leriyle listeler ve verification'ın individual attestation'a güvenmeden
önce manifest'i kontrol etmesi MUST'tır.

## Doğrulama algoritması

Conforming verifier'ın şunları yapması MUST'tır:

1. `manifest.json` dosyasını okuyup her referenced path'in bundle içinde
   çözüldüğünü ve declared digest ile eşleştiğini doğrulamak.
2. Her arm artifact directory için `dirHash` değerini yeniden hesaplayıp
   predicate ile karşılaştırmak ve tüm arm'ların aynı `runtime` digest'e referans
   verdiğini doğrulamak.
3. `reviews.jsonl` digest'ini yeniden hesaplayıp `reviews.log.digest` ile
   eşleştiğini doğrulamak.
4. `sha256(protocol.assignmentSeed)` değerinin `protocol.seedCommitment` ile
   eşleştiğini doğrulamak, bu seed ile `assignmentAlgorithm`'ı replay edip sonucun
   `assignments.jsonl` ile eşleştiğini doğrulamak; ardından her review record'un
   planned assignment ile eşleştiğini ve `unfilledAssignments` değerinin review
   record'u olmayan planned assignment sayısına eşit olduğunu doğrulamak.
5. `assignmentSeed` çıkarılmış protocol object'in JCS form'u üzerinde
   `preRegistration.digest` değerini yeniden hesaplayıp review başlamadan önce
   kaydedilen değerle eşleştiğini doğrulamak.
6. `reviews.jsonl` ve `case-outcomes.jsonl` üzerinden counting rule'lardaki her
   invariant'ı yeniden hesaplayıp predicate ile eşleştiğini doğrulamak.
7. Decision attestation'ın evaluation attestation'a ve iddia ettiği policy
   digest'e referans verdiğini doğrulamak.
8. DSSE envelope varsa payload'ı okumadan önce signature'ı doğrulamak ve yalnızca
   verified payload byte'larını kullanmak.

Verifier'ın 1'den 7'ye kadar olan adımları network access ve running server olmadan
tamamlayabilmesi MUST'tır.

### Verification bu projeye bağlı olmaması MUST'tır

Bu kategoride baskın failure mode abandonment'tır; dolayısıyla tek verifier'ı
bakımı yapılmayan repository'deki npm package olan bundle çözdüğünü iddia ettiği
problemi çözmemiştir. Bu nedenle 1'den 3'e kadar olan adımların standard command
line tool'larla ifade edilebilir kalması MUST'tır ve specification repository'nin
zengin implementation'ların yanı sıra bu alt küme için POSIX shell reference
verifier yayımlaması MUST'tır.

```sh
# step 1, manifest integrity
jq -r '.files[] | "\(.sha256)  \(.path)"' manifest.json | sha256sum -c -

# step 2, capability directory identity
( cd artifacts/candidate && find . -type f | cut -c3- | LC_ALL=C sort \
    | xargs -r sha256sum | sha256sum )

# step 3, review log integrity
sha256sum reviews.jsonl
```

Bu nedenle `manifest.json` daha zengin yapılar daha elegant olsa bile path ve
`sha256` çiftlerinden oluşan flat `files` array'i koruması MUST'tır; çünkü bu,
bir yabancının 2035'te hiçbir şey kurmadan kontrol edebileceği yapıdır.

## Conformance profilleri

| Profil | Gereksinim |
| --- | --- |
| Core | Produce and verify an unsigned bundle, including `dirHash`, JCS canonicalization, and the verification algorithm above |
| Signed | Additionally produce and verify DSSE envelopes |
| CI | Additionally emit attestations through a CI provider such as GitHub artifact attestations |

Conformance self assertion ile değil, yayımlanmış test vector'larını geçmekle
tanımlanır. Her normative requirement en az bir vector ile eşleşen stable
identifier alır.

## CI entegrasyonu taslağı

Güncel GitHub dokümantasyonuna göre doğrulanmıştır. Custom predicate'ler
desteklenmektedir.

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

CLI varsayılan olarak SLSA provenance kullandığından verification açıkça
predicate type gerektirir:

```bash
gh attestation verify evidence-bundle.tar \
  -R acme/ai-platform \
  --predicate-type https://<controlled-domain>/BlindEvaluation/v0.1
```

Benimseyenler için belgelenmesi MUST olan kısıtlamalar:

- Artifact attestation'lar public repository'ler için tüm planlarda kullanılabilir.
  Private ve internal repository'ler GitHub Enterprise Cloud gerektirir; GitHub
  Enterprise Server desteklenmez. Bu nedenle formatın herhangi bir CI provider
  olmadan tamamen kullanılabilir kalması MUST'tır.
- `predicate` veya `predicate-path` 16 MB ile sınırlıdır ve statement en fazla
  1024 subject taşıyabilir.
- Yalnızca signing certificate ve verified timestamp'ler attestation'ı üreten
  workflow'un denetimi dışındadır. Compromised workflow predicate content'i
  sahteleyebilir. Bunun önemli olduğu yerlerde reusable workflow'dan attestation
  üretin ve `--signer-workflow` ile doğrulayın.
- Bundle ve trusted root indirilerek offline verification yapılabilir; ancak
  cached trusted root'un expiry'si yoktur ve key revocation'ı yansıtmaz.

## Açık sorular

- Review log'un record başına hash chain gerektirip gerektirmediği veya tüm
  append-only file üzerinde digest'in yeterli olup olmadığı. Bunu first principle
  üzerinden yanıtlamak boşa çabadır; gerçek bir bundle oluşturup shared-bundle
  tarifindeki partial-return merging'in chain'i zorunlu kılıp kılmadığına bakın.
- N-arm ranking için ikinci predicate gerekip gerekmediği veya `arms` ve `results`
  alanlarının genelleşip genelleşmediği.
- Yeterli sayıda gerçek bundle, observed agreement'ın yanıltıcı olup olmadığını
  gösterebildiğinde `agreement` alanının chance-corrected coefficient'ı da zorunlu
  kılıp kılmaması gerektiği.
- `in-toto.io` namespace'ine izin verecek ancak predicate'in in-toto repository'de
  bakımını gerektirecek ITE-9 incelemesinin istenip istenmemesi.

Taslak sırasında çözüldü: `runtime` her arm'ın içinde kalır; çünkü arm'ların
byte-identical digest paylaşması MUST'tır ve per-arm field bu kontrolü implied
değil local yapar.

## Bu taslağın kâğıt üzerinde yanıtlayamayacağı soru

Specification yazımının yeni bir turu bu belgeyi iyileştirmeyecektir. Gerçek bir
bundle üzerinde hiç çalıştırılmamıştır ve yukarıdaki açık sorular, gerçek bir
release decision'dan elle oluşturulacak tek bir bundle'ın bir öğleden sonra
yanıtlayacağı sorulardır. Normative text yazmadan önce bu bundle'ı elle üretmek
sonraki adımdır. Otuz decision ve sıfır bundle içeren specification, bu projenin
kaçınmayı amaçladığı failure mode'dur.