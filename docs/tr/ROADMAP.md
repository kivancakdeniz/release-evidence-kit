# Teslimat Yol Haritası

> Bu belge, İngilizce [kaynak metnin](../ROADMAP.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

## Bildirim

Başkalarının uygulayabileceği bir format ile bu formatın çalıştığını kanıtlayan en
küçük ve dürüst referans uygulama yayımlansın.

V0 bir platform değil, overlay'dir: çıktıları içe aktarır, blind review toplar ve
doğrulanabilir bir decision bundle export eder. Provider runner'ları, kimlik
doğrulama, veritabanları, hosted service'ler, tracing ve N-arm ranking ertelenmiş
özellikler değildir. Projenin kapsamı dışındadır.

## Aşama V0 — 4-8 haftalık doğrulama prototipi

Girdiler:

- baseline capability klasörü,
- candidate capability klasörü,
- en az birkaç case içeren dataset JSON,
- içe aktarılmış baseline/candidate çıktıları,
- isteğe bağlı rubric YAML.

Akış:

1. `release-evidence init`
2. `release-evidence bundle create study.yaml`
3. baseline, candidate, dataset, runtime declaration ve içe aktarılmış çıktıları
   doğrulayıp arşivleme
4. `release-evidence review serve <bundle>` loopback'e bağlanır ve opaque,
   dengeli A/B assignment'ları sunar
5. reviewer, append-only JSONL'a A/B/equal/abstain, rationale ve tag gönderir
6. `release-evidence freeze <bundle>` included review ID'lerini, exclusion'ları,
   descriptive metric'leri, algorithm version'ı ve hash'leri kaydeder
7. `release-evidence decide <bundle> --approve|--reject` human rationale'ı
   artifact, evidence ve policy hash'lerine bağlar
8. `release-evidence verify <bundle>` zinciri bağımsız olarak doğrular

V0 storage, self-contained directory veya tar archive'dır. Artifact byte'ları
bundle'a kopyalanır, review'lar append-only JSONL'dır ve manifest'ler canonical
JSON'dır. Database migration veya server-managed project state gerekmez.

### V0 haftalık sıralama

#### Hafta 1 — Problemi yeniden oynatma ve elle oluşturulan tek bundle

- üç design partner bulun,
- her partner'ın son iki gerçek capability promotion decision'ını yeniden kurun,
- mevcut araçları, geçen süreyi, decision owner'ı, eksik evidence'ı ve blind
  review'un kabul edilebilir olup olmayacağını kaydedin,
- bu gerçek kararlardan birinden, text editor ve `sha256sum` dışında araç
  kullanmadan **elle** eksiksiz bir evidence bundle oluşturun,
- ikiden az ekibin yinelenen subjective release decision'ı varsa durun.

Elle oluşturulan bundle, tüm normative text'lerden önce gelir. Formatın bir insan
tarafından yazılabilir olup olmadığını anlamanın tek ucuz yolu budur ve format ön
taslağındaki hiçbir ek specification yazımıyla çözülemeyecek açık soruları
yanıtlar.

#### Hafta 2 — Bundle sözleşmesi

- flat path ve digest array içeren canonical manifest schema'ları,
- genel JSON output importer,
- Git commit/dirty-state metadata ile deterministik artifact archive/hash,
- bundle create ve verify komutları,
- manifest, directory identity ve review log'u kapsayan POSIX shell verifier.

#### Hafta 3 — Blind review

- minimal loopback sayfası,
- opaque A/B presentation ID'leri,
- review öncesinde seed commit edilerek seeded balanced side ordering,
- A/B/equal-good/equal-bad/abstain, rationale ve tag'ler,
- decline option içeren post-preference blinding check sorusu.

#### Hafta 4 — Bütünlük

- append-only review JSONL,
- idempotent assignment ve submit,
- ilk review'dan önce yazılan pre-registration record,
- açıklanan seed'den assignment plan replay ve unfilled-assignment sayımı,
- HTML, URL ve pre-decision payload için candidate identity leak testleri,
- ikinci bir makine veya temiz environment'ta export/import doğrulaması.

#### Hafta 5 — Freeze ve decision

- açık close ve exclusion record'ları,
- descriptive preference, tie, case, reviewer ve side-position summary'leri,
- observed reviewer agreement ve case başına majority outcome log,
- blinding-check toplamları,
- immutable evidence manifest,
- approve/reject manifest ve isteğe bağlı signed Git commit.

#### Hafta 6-8 — Yalnızca gerçek kullanım

- Promptfoo importer ile design partner'ın istediği bir importer,
- yerel kurulum olmadan bundle üretip doğrulayan GitHub Action,
- producer ile kod paylaşmayan bağımsız verifier,
- katılan her ekip için en az iki gerçek karar,
- yalnızca iş akışını tamamlamayı engelleyen sorunları düzeltme,
- platform administration veya yeni study mode eklememe.

### V0 devam gate'i

Yalnızca aşağıdakilerin tümü doğruysa V0 sonrasında etkin geliştirmeye devam edin:

- kurulum 15 dakikanın altındadır,
- maintainer dışındaki en az bir ekip tekrar tekrar bundle üretir,
- en az bir decision değişir, engellenir veya gecikir ya da ölçülen bir
  audit/handoff işi somut biçimde kısalır,
- tamamlanan tüm bundle'lar sunucu olmadan bağımsız olarak doğrulanır,
- bağımsız verifier yayımlanmış tüm vector'ları geçer.

Gate başarısız olursa specification'ı güncel sürümünde dondurun, vector'ları ve
example bundle'ları yayımlanmış tutun, project status'u dürüstçe işaretleyin ve
özellik eklemeyi bırakın. Çalışmayı gerekçelendirmek için ürüne dönüştürmeyin.

## Release planı

Normative sıra. Public pre-draft, specification release değil design-review
publication'dır. Sonraki her release bağımsız olarak kullanılabilir ve hiçbiri
servis getirmez.

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

Teslimatlar: Apache-2.0 altındaki bu planning workspace; açık pre-draft status;
research source'ları; scope, architecture, decisions, threat model ve publication
checklist; contribution, governance, security ve archival path'ler.

Çıkış ölçütleri: protected default branch bulunan public Git repository;
standard location'da license; private vulnerability reporting etkin; issue ve
pull request process belgelenmiş; install command, conformance claim, package
claim veya approved-specification dili yok; name, npm, trademark ve domain
kontrolleri tarihli ve kayıtlı.

P0 bu workspace için publication target'tır. Dedicated Community Specification
repository ve tüm legal/governance paketi var olana kadar specification
değişiklikleri proposal olarak kalır.

### R0 — Planlama ve format ön taslağı

Teslimatlar: scope, architecture, domain, threat, landscape ve decision belgeleri;
evidence format draft; üzerinde çalışılmış örnek statement ve predicate.

Çıkış ölçütleri: çözümlenmemiş blinding, privacy veya verification boundary kararı
yok; format gerçek bir study'yi kâğıt üzerinde uçtan uca ifade eder.

### R1 — Dondurulmuş taslak ve vector'lar

Teslimatlar: RFC 2119 ve RFC 8174 keyword kullanımlı versioned specification
text; predicate ve bundle manifest için JSON Schema; her normative requirement
için stable identifier; valid ve invalid case'leri kapsayan conformance vector'ları;
en az bir eksiksiz example bundle.

Çıkış ölçütleri: her normative requirement en az bir vector ile eşleşir;
vector'lar CI'da kendi manifest schema'larına göre doğrulanır; example bundle
yalnızca specification text kullanılarak elle doğrulanır.

### R2 — Referans CLI ve review sayfası

Teslimatlar: `init`, `bundle create`, `review serve`, `freeze`, `decide`,
`verify`; append-only review log; opaque presentation identifier'ları ve balanced
side ordering içeren loopback-only review page.

Çıkış ölçütleri: candidate identity reviewer markup, URL ve pre-decision payload'da
yoktur; aynı seed assignment plan'ı yeniden üretir; assignment ve submission
idempotent'tır; frozen bundle immutable'dır.

### R3 — Bağımsız verifier ve conformance runner

Teslimatlar: producer ile kod paylaşmayan verifier; belgelenmiş command-line
protocol üzerinden herhangi bir implementation'a karşı vector'ları çalıştıran
conformance runner; yayımlanmış conformance report.

Çıkış ölçütleri: bağımsız verifier her vector'ı geçer; kasıtlı olarak bozulmuş
bir bundle, error message içinde requirement identifier ile başarısız olur.

Bu release herhangi bir özellikten daha önemlidir. Hayatta kalan küçük
specification'ların ya çalışan bir conformance suite'i ya da birden fazla
independent implementation'ı vardı.

### R4 — CI dağıtımı ve importer'lar

Teslimatlar: yerel kurulum olmadan bundle üretip doğrulayan GitHub Action; custom
predicate type ile isteğe bağlı attestation emission; genel JSON importer ve
Promptfoo importer.

Çıkış ölçütleri: repository, CLI kurmadan bundle üretip doğrulayabilir; format
hiçbir CI provider olmadan da çalışmaya devam eder.

### R5 — Onaylanmış public release

Teslimatlar: ADR-023'teki trust baseline; specification, vector ve code arasında
licensing split; governance, maintainer, successor ve archival dosyaları;
machine-readable project status.

Çıkış ölçütleri: temiz bir makine macOS, Linux ve Windows'ta 15 dakikadan kısa
sürede verified bundle üretir; iş akışında hiçbir şey hosted service gerektirmez;
npm publishing, provenance ile stage-only trusted publishing kullanır; paket
clean-tarball installation, SBOM, Scorecard ve immutable-release kontrollerini
geçer.

## Repository düzeni

Specification'ı source code'dan ayırmaya ilişkin belgelenmiş Community
Specification uygulamasını izleyen iki repository:

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

Dokümantasyon dört modlu ayrıma uyar: ilk kullanım için tutorial, tarifler için
how-to, normative material için reference ve gerekçe için explanation. Tarifler
ve normative text hiçbir zaman aynı belgede karıştırılmaz.

## Sürümleme policy'si

- Specification version ve conformance vector version birlikte ilerler; böylece
  conformance her zaman belirli bir belgeye conformance anlamına gelir.
- Referans implementation bağımsız version alır ve hangi specification version'ı
  uyguladığını bildirir.
- Predicate type URI major version'ı taşır ve `0.x` major sayılır.
- Tanınmayan field'lar consumer'lar tarafından yok sayılır; böylece additive
  change'ler minor kalır.
- Bir field'ı kaldırmak veya başka amaçla kullanmak major change'dir ve yeni
  predicate type URI gerektirir.
- Stability belirten sözcükler directory veya import path'lerde hiçbir zaman yer
  almaz.

## Conformance yaklaşımı

Conformance, self assertion ile değil yayımlanmış vector'ları geçmekle tanımlanır.

- Vector'lar code değil data file'dır; bu nedenle her dildeki implementation
  onları çalıştırabilir.
- Implementation'lar git submodule veya published package olarak tüketilir.
- Her vector uyguladığı requirement identifier'larını belirtir.
- Optional profile'lar ayrı directory'de bulunur ve bildirilen expected-failure
  list ile atlanabilir.
- Requirement'lar MUST'ı yalnızca interoperability gerçekten buna bağlıysa
  kullanır. MUST inflation bir specification'ı test edilemez hâle getirir.

## Açıkça kapsam dışında

Bunlar sonraki milestone'da değildir. Tasarım gereği hariç tutulmuştur ve bunlara
yönelik bir istek, istekte bulunanı mevcut bir platforma yönlendirme işaretidir:

- her tür veritabanı, sunucu veya hosted service,
- authentication, authorization veya reviewer coordination,
- provider runner, model gateway veya shell execution,
- prompt management, environment veya deployment,
- trace storage,
- statistical eligibility verdict,
- multimodal review,
- telemetry.

N-arm ranking, planlanmış çalışma olarak değil olası gelecek predicate version
olarak kayıtlı kalır.

## Benimseyen doğrulama planı

Üç prospective adopter'a yaklaşın:

1. prompt veya instruction ekibi,
2. agent veya toolset ekibi,
3. extraction, classification veya RAG gibi non-language capability ekibi.

Her birinden iki historical release decision'ı replay etmesini, ardından iki
live decision tamamlamasını isteyin. Setup time, missing importer'lar, reviewer
cost, completion rate, verifiability, blinding'in sonucu değiştirip değiştirmediği
ve ekibin istenmeden ikinci kez çalıştırıp çalıştırmadığını izleyin.

Amaç müşteri bulmak değil, formatı yanlışlamaktır. Tarifin reviewer zamanına
değmediğini söyleyen partner, implementation maliyetinden önce bu sonucu
sağladığı için en değerli sonuçtur.

## Bakım ve arşivleme policy'si

- Release cadence bildirin ve buna uyun. Tek maintainer için düzenlilik,
  hacimden daha güçlü bir işarettir.
- Machine-readable project status yayımlayın ve activity değiştiğinde dürüstçe
  güncelleyin.
- Governance dosyasında bus factor'ı belirtin ve successor path adlandırın.
- Terk etmek yerine dondurun: geliştirme durursa specification version'ı
  sabitleyin, vector ve example'ları yayımlanmış tutun ve bundle'ların araç
  olmadan okunabilen düz dosyalar olduğunu belgeleyin.
- Sessizce değil, status change ve final release ile bilinçli olarak arşivleyin.