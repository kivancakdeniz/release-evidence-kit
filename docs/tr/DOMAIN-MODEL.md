# Domain Modeli

> Bu belge, İngilizce [kaynak metnin](../DOMAIN-MODEL.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

Değiştirilebilir tüm tanımlar revision'lıdır. Geçmiş study'ler “latest” kayıtlara
değil, immutable revision ve snapshot'lara referans verir.

## Model katmanları

Domain'in iki implementation katmanı vardır:

- V0 bundle modeli: proje tezini veritabanı olmadan sınamak için gerekli en küçük
  taşınabilir kayıtlar.
- Referans söz dağarcığı: format tartışılırken kullanılan non-normative adlandırma.
  Bir schema değildir ve uygulanmaz.

Bundle, bir internal product model'in kayıplı export'u değildir. Referans CLI'ın
ve bağımsız implementation'ların desteklemesi gereken kararlı verification
boundary'dir.

## V0 bundle modeli

### BundleManifest

Canonical root record:

```text
schemaVersion, bundleId, createdAt, sourceGit, artifactRefs,
datasetRef, runtimeDeclarationRef, outputSetRef, protocolRef,
reviewLogRef, evidenceRefs[], decisionRefs[]
```

Her referans relative path, media type, byte length ve SHA-256 hash içerir.
Manifest kendi hash'ini içermez; detached bundle hash veya signed Git commit
root'u bağlayabilir.

### ArtifactArchive

Bir deterministik baseline veya candidate archive ile manifest'i:

```text
role, rootHash, manifestHash, sourceRevision, dirtyState,
fileCount, totalBytes, files[]
```

Role-to-archive mapping private reviewer metadata'sıdır ve pre-decision browser
payload'larına hiçbir zaman dâhil edilmez.

### ImportedOutputSet

Herhangi bir runner'dan sıralı case/output kayıtları:

```text
importer, importerVersion, sourceExperiment?, datasetHash,
runtimeDeclaration, records[]
```

Her kayıt `caseId`, `armOpaqueId`, `inputHash`, `outputHash`, output path ve
mevcut provenance'ı bağlar. Eksik provenance açıktır, üretilmez.

### ProtocolManifest

```text
mode=pairwise, datasetHash, armOpaqueIds, assignmentAlgorithm,
algorithmVersion, seedCommitment, renderer, rubric, exclusionRules
```

### AssignmentPlan ve ReviewRecord

Assignment'lar opaque presentation ID'leri ve owner-side arm mapping'i olan
deterministik kayıtlardır. Review'lar JSONL'a eklenir:

```text
reviewId, assignmentId, reviewerRef, verdict, rationale, tags,
renderedSnapshotHash, submittedAt, previousRecordHash?
```

`previousRecordHash` isteğe bağlı bir hash chain oluşturur. Yinelenen
assignment/reviewer gönderimleri reddedilir; düzeltmeler önceki byte'ları
düzenlemek yerine onların yerini alan yeni bir kayıt ekler.

### EvidenceManifest

```text
analysisVersion, protocolHash, includedReviewIds, exclusionRecords,
descriptiveMetrics, sampleLimitations, integrityChecks, createdAt
```

V0 evidence'da `eligible` durumu yoktur. Inclusion set, exclusion, algorithm veya
protocol değiştiğinde yeni evidence manifest oluşturulur.

### DecisionManifest

```text
decision, artifactHash, evidenceHash, policyHash?, actor,
rationale, createdAt, previousDecisionHash?
```

Decision, `approve` veya `reject` değeridir. Bir human recommendation kaydeder ve
deployment'ın gerçekleştiğini asla iddia etmez.

### V0 bütünlük kuralları

- Bundle referansları bundle içinde çözülür ve bildirilen hash'lerle eşleşir.
- Artifact, dataset, output, protocol, review, evidence ve decision byte'ları
  hiçbir zaman sessizce yeniden yazılmaz.
- Pre-decision reviewer payload'ları arm identity veya source metadata içermez.
- Study kapatıldıktan sonra yeni review record'lar reddedilir.
- Exclusion ve correction record'ları eklenir; geçmişi silmez.
- Evidence, kesin included review ID'lerini ve integrity-check sonuçlarını listeler.
- Decision, kesin artifact ve evidence hash'lerini bağlar.
- Verification veritabanı veya çalışan sunucu gerektirmez.

## Referans söz dağarcığı

Aşağıdaki entity'ler format tartışılırken ve benimseyen bundle dışında kayıt
tutarken kullanılan non-normative adlandırmadır. Bunlar database schema değildir
ve bu proje bunları öyle uygulamaz.

## Capability ve artifact

### Capability

Uzun ömürlü kimlik ve metadata:

```text
id, projectId, name, kind, description, createdAt
```

`kind`; prompt, skill, agent, toolset, rag veya workflow gibi genişletilebilir bir
etikettir. Core behavior'ı değiştirmez.

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

Uzun ömürlü case collection identity.

### DatasetRevision

Case revision'larının ve schema version'ın immutable ordered set'i.

### CaseRevision

```text
id, caseId, input, expected?, metadata, inputHash, createdAt
```

Case'ler structured JSON içerebilir. Schema, dataset revision başına bildirilir.

## Candidate ve içe aktarılmış yürütme

### Candidate

Bir artifact snapshot'ını opaque study arm'a bağlar:

```text
id, projectId, artifactSnapshotId, label
```

Label hiçbir zaman blind reviewer'a gönderilmez.

### ImportedExecution

Bir case için içe aktarılmış tek candidate çıktısı:

```text
id, candidateId, caseRevisionId, importer, importerVersion, inputHash,
outputRef, outputHash, sourceProvenance?, error?
```

Proje, source tool tarafından sağlanan provenance'ı kaydeder ve eksik execution
detail'larını hiçbir zaman üretmez.

## Study

### Study

Uzun ömürlü identity ve lifecycle state:

```text
draft -> open -> closed -> analyzed -> decided -> archived
```

### ProtocolRevision

Immutable rules:

```text
mode, armIds, datasetRevisionId, renderer, rubricRevisionId,
assignmentAlgorithm, seedCommitment, exclusionPolicy, limitationCodes
```

v0.1'de mode `pairwise`'dır. Ranking yeni bir predicate major version gerektirir.

### Arm

Bir candidate'a bağlı opaque study arm. Reviewer payload farklı presentation ID'leri
kullanır.

### Assignment

```text
id, studyId, caseRevisionId, reviewerScope, presentationOrder,
algorithmVersion
```

`presentationOrder` owner-side bundle metadata'sında kalır. Reviewer response
yalnızca assignment ID ile seçilen presentation ID/tie değerini içerir.

## Reviewer ve erişim

Reviewer yalnızca benimseyenin seçtiği opaque referansla tanımlanır; bu referans
yerel review log'a kaydedilir ve predicate'e hiçbir zaman konulmaz.

Identity provider'lar, invitation token'ları ve anonymous participation kapsam
dışındadır. Koordineli reviewer yönetimine ihtiyaç duyan ekipler mevcut bir
annotation platformu kullanmalı ve çıktısını içe aktarmalıdır.

## Geri bildirim

### Review

```text
id, assignmentId, reviewerRef, verdict, ranking?, rationale, tags,
correction?, renderedSnapshotHash, submittedAt
```

Pairwise verdict:

```text
presentation A | presentation B | equal-good | equal-bad | abstain
```

Owner-side process, gönderimden sonra presentation'ı temelindeki arm'a çözümler.

### RubricRevision

Tag key'lerini, açıklamaları, required field'ları, rationale limit'lerini ve
renderer instruction'larını tanımlar. Study tek bir rubric revision'ı dondurur.

### ExclusionDecision

Original review'u silmeden review exclusion'ı kaydeder:

```text
reviewId, reasonCode, rationale, actor, decidedAt
```

## Kanıt

### AnalysisBatch

Review ve exclusion ID'lerinin dondurulmuş kümesi ile close timestamp.

### EvidenceSnapshot

```text
id, studyId, analysisBatchHash, analysisVersion, metrics,
sampleLimitations, biasChecks, integrityChecks, createdAt
```

### Policy referansı

Benimseyen bir release policy uyguladığında yalnızca digest kaydedilir; böylece
decision, o sırada yürürlükte olan kesin policy text'e göre kontrol edilebilir.

Format bir policy language tanımlamaz ve policy'leri değerlendirmez. Eligibility
status üretmez. Bu kayıtları tüketen her policy monotonik olarak ifade
edilebilmelidir: bir attestation'ı yok saymak hiçbir zaman denial'ı approval'a
dönüştürmemelidir.

## Karar

### DecisionRecord

Kesin hash'lere bağlı human decision:

```text
id, projectId, candidateSnapshotId, evidenceSnapshotId,
policyRevisionId, actorId, decision, rationale, createdAt
```

### Downstream tüketim

Decision record, adı belirtilmiş bir kişinin candidate artifact hakkında vardığı
sonucu kesin bir evidence digest'e bağlı olarak belirtir. External system'ler
bunu okuyup eyleme geçebilir.

Bu proje channel, environment veya promotion ledger tanımlamaz ve deployment
gerçekleştirmez.

## Bütünlük kuralları

- Snapshot content hiçbir zaman değişmez.
- Pair output, study açıldıktan sonra hiçbir zaman değişmez.
- Open study protocol hiçbir zaman değişmez.
- Closed study review kabul etmez.
- Review submit, assignment/reviewer başına idempotent'tır.
- Evidence snapshot'ları hiçbir zaman değişmez.
- Decision kesin artifact, evidence ve isteğe bağlı policy digest'lerine referans
  verir.
- Bir decision kaydetmek deployment veya başka bir external action tetiklemez.