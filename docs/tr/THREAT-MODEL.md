# Güvenlik ve Tehdit Modeli

> Bu belge, İngilizce [kaynak metnin](../THREAT-MODEL.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

## Güvenlik duruşu

Referans uygulama yerel ve yalnızca import amaçlıdır. Capability code'u hiçbir
zaman yürütmez, public review link'i sunmaz, remote identity kabul etmez veya
provider credential almaz. Bu yüzeyler devre dışı bırakılmış seçenekler değil,
yoktur.

## Varlıklar

- capability source artifact'ları,
- model prompt'ları ve output'ları,
- reviewer identity ve feedback,
- study assignment seed ve arm mapping,
- evidence ve decision record'ları,
- içe aktarılmış trace summary'leri ve structured output'lar,
- portable bundle manifest'leri, review log'ları ve detached bundle hash.

## Güven sınırları

1. Local filesystem'dan artifact snapshotter'a.
2. İçe aktarılmış output file'lardan bundle content'e.
3. CLI'dan loopback review browser'a.
4. Owner ile reviewer arasında bundle transferi.
5. Bundle'dan herhangi bir third-party verifier'a.
6. CI workflow'dan attestation signing ve transparency log'a.

## Başlıca tehditler ve azaltımlar

### Snapshot'larda secret yakalanması

Tehdit: `.env`, credential'lar, private key'ler, browser state veya generated
cache'ler artifact'a dâhil edilir.

Azaltımlar:

- bilinen secret/state dosyaları için default deny pattern'ları,
- açık include root'ları,
- snapshot kabulünden önce gitleaks-compatible scan,
- size/file-count limit'leri,
- manifest preview ve confirmation,
- bundle encryption ve access control'ün benimseyenin mevcut file-transfer ve
  storage system'larına ait olduğunu belirten dokümantasyon.

### Path traversal ve symlink escape

Tehdit: artifact traversal, bildirilen root dışını okur.

Azaltımlar:

- canonical root resolution,
- absolute path ve parent segment'lerini reddetme,
- her symlink target'ı inceleme,
- device file ve socket'leri reddetme,
- deterministic path normalization testleri.

### Güvenilmeyen girdinin yürütülmesi

Tehdit: özel hazırlanmış manifest, içe aktarılmış output veya artifact command
execution'a neden olur ya da external resource yükleyen parser özelliğine ulaşır.

Azaltımlar:

- provider runner, plugin loader, lifecycle script, template execution veya shell
  command surface olmaması,
- external entity ve remote reference loading devre dışı bırakılmış structured
  parser'lar,
- built-in allowlist'ten importer selection,
- içe aktarılmış değerlerin command, path veya HTML fragment olarak değil data
  olarak aktarılması,
- malicious path, parser edge case ve oversized data için conformance vector'ları.

### Blinding sızıntıları

Tehdit: reviewer; label, DOM, URL, network payload, output metadata, timing veya
consistent ordering üzerinden candidate identity'yi keşfeder.

Azaltımlar:

- opaque assignment ve presentation ID'leri,
- reviewer payload'dan candidate label/path/hash'lerini çıkarma,
- yalnızca owner-side mapping,
- deterministic balanced order,
- renderer redaction policy,
- pre-release browser/network leak testleri,
- identity reveal'ı review gönderilene veya study kapanana kadar geciktirme.

### Assignment manipülasyonu

Tehdit: reviewer istediği arm/order'ı bulmak için tekrar tekrar assignment ister
veya birden fazla kez gönderim yapar.

Azaltımlar:

- assignment'ların pre-registered deterministic plan'dan gelmesi,
- opaque assignment ve presentation ID'leri,
- idempotent submit,
- immutable algorithm version ve seed commitment,
- append-only correction ve exclusion record'ları,
- planned, completed, excluded ve unfilled count'ların freeze sonrasında görünür
  kalması.

### Feedback poisoning ve kötüye kullanım

Tehdit: spam, coordinated voting, copied rationale, Sybil reviewer veya prompt
injection text evidence'ı manipüle eder.

Azaltımlar:

- opaque local reference ile kaydedilmiş owner-selected reviewer'lar,
- duplicate assignment/reviewer kontrolleri,
- rationale length ve schema limit'leri,
- destructive deletion yerine anomaly flag ve exclusion'lar,
- stable code ile reviewer-pool ve selection limitation kaydı,
- automatic decision veya downstream action olmaması.

### İstatistiksel kötüye kullanım

Tehdit: dependent review'lar independent olarak ele alınır, small sample'lar
promote edilir veya multiple comparison false winner üretir.

Azaltımlar:

- frozen protocol, endpoint ve exclusion rule'ları,
- raw count'lar, position balance, observed agreement ve per-case outcome'lar,
- confidence interval, significance test, eligibility status veya default gate
  olmaması,
- local detail record'lara bağlı explicit limitation code'ları,
- adı belirtilmiş kişinin decision ve rationale'ı kaydetmesi.

### Geri dönen review log'un kurcalanması

Tehdit: reviewer değiştirilmiş review log geri verir veya owner evidence'ı
dondurmadan önce geri dönen log'u sessizce düzenler.

Azaltımlar:

- review log'lar unique record identifier ile append-only'dir,
- merge'ler digest ile yapılır ve ortaya çıkan digest evidence record'a kaydedilir,
- excluded record'lar silinmek yerine reason ile tutulur,
- evidence record tam olarak hangi review identifier'ları dâhil ettiğini listeler;
  böylece daha sonraki okuyucu yeniden sayabilir.

Bu tehdit ortadan kaldırılmak yerine kabul edilmiştir. Format bir decision'ın
hangi evidence'a göre verildiğini kanıtlar; reviewer'ların dürüst olduğunu veya
owner'ın reviewer'ları adil seçtiğini kanıtlayamaz.

### Bundle'ın açığa çıkması

Tehdit: bundle kopyası capability source, model output, reviewer feedback veya
local identity'leri istenmeyen alıcıya açar.

Azaltımlar:

- varsayılan olarak restrictive local file permission'ları,
- bundle transferinden önce explicit warning,
- identity veya free text içermeyen public attestation predicate,
- bundle encryption ve recipient access control'ün benimseyenin mevcut transfer
  system'ına devredilmesi.

### Stored XSS ve renderer saldırıları

Tehdit: model output veya rationale HTML/script ya da malicious JSON key içerir.

Azaltımlar:

- Markdown'ı sanitize etme ve raw HTML'i varsayılan olarak engelleme,
- JSON'ı HTML değil text olarak render etme,
- strict CSP,
- dynamic script URL olmaması,
- artifact download'larını safe content disposition ile sunma,
- renderer snapshot testleri.

### Decision'ın kurcalanması

Tehdit: decision kaydedildikten sonra evidence veya policy değişir ya da farklı
artifact aynı label ile release edilir.

Azaltımlar:

- immutable content digest'leri,
- decision'ın evidence, policy ve artifact digest'lerine bağlanması,
- append-only decision record'ları,
- decision üzerinde isteğe bağlı signed attestation,
- consuming system'ların eylemden önce digest'leri doğrulaması.

### Bundle'ın kurcalanması ve kısmi yazımlar

Tehdit: local actor review'ları düzenler, output'u değiştirir, JSONL'ı keser veya
review yazımı tamamlanmadan evidence'ı dondurur.

Azaltımlar:

- her referenced file için canonical JSON ve declared SHA-256,
- manifest write için atomic temporary-file then rename,
- unique ID ve optional previous-record hash içeren append-only review record'ları,
- exclusive close/freeze lock ve explicit closed marker,
- evidence'ın exact included review ID ve hash'lerini listelemesi,
- analysis, decision, import veya deployment consumption öncesinde `bundle verify`,
- tek host dışındaki custody için optional signed Git commit veya detached signature.

### Transparency log üzerinden geri döndürülemez ifşa

Tehdit: benimseyen public repository'den attestation üretir; reviewer identity,
rationale text, prompt veya output kalıcı olarak public olur.

Public repository'lerde üretilen attestation'lar public-good instance tarafından
imzalanır ve immutable, publicly readable transparency log'a kaydedilir. Geri
çekme yoktur.

Azaltımlar:

- predicate identity veya free text değil yalnızca aggregate ve digest taşır,
- specification bunu recommendation değil requirement olarak belirtir,
- dokümantasyon private ve internal repository'lerin paid tier gerektirdiği ve
  self-hosted CI'ın bu özellik için desteklenmediği konusunda uyarır,
- local recipe hiçbir CI provider olmadan çalışır.

### Güvenliği ihlal edilmiş workflow'dan sahte predicate içeriği

Tehdit: attestation üreten CI job'a erişimi olan saldırgan keyfî predicate content
yazar ve downstream consumer signature doğrulandığı için buna güvenir.

Yalnızca signing certificate ve verified timestamp'ler attestation'ı üreten
workflow'un denetimi dışındadır. Predicate content değildir.

Azaltımlar:

- attestation'ları calling repository'nin değiştiremeyeceği reusable workflow'dan
  üretme ve signer workflow identity'yi doğrulama,
- attestation'ı arkasındaki insanların dürüst olduğunun değil, belirli zamanda ve
  kaynaktan bir bundle var olduğunun evidence'ı olarak ele alma,
- consumer'ın yalnızca signature'a güvenmek yerine claim'leri yeniden kontrol
  edebilmesi için bundle'ı independently verifiable tutma.

### Attestation bundle manipülasyonu

Tehdit: in-toto bundle layer bir bütün olarak açıkça authenticated olmadığından
saldırgan envelope'ları kaldırır, replay eder veya inject eder.

Azaltımlar:

- bundle manifest her referenced file'ı digest'iyle listeler ve verification,
  individual attestation'a güvenmeden önce manifest'i kontrol eder,
- policy'ler monotonik yazılır; böylece attestation'ı yok saymak denial'ı hiçbir
  zaman approval'a dönüştüremez,
- decision record'ları verildikleri exact evidence digest'e referans verir.

### İmza ve canonicalization tuzakları

Tehdit: implementation signature doğrular ve ardından payload'ı çıkarmak için
envelope'u yeniden parse eder ya da canonicalization değerleri sessizce yeniden
yazar.

Azaltımlar:

- verifier yalnızca verified payload byte'larını kullanır ve verification sonrası
  envelope'u asla yeniden parse etmez,
- numeric field'lar small integer'larla sınırlıdır; böylece canonicalization bir
  değeri floating-point rewrite yoluyla değiştiremez,
- implementation'lar NaN, Infinity ve lone surrogate'ları coercion yerine reddeder,
- conformance vector'ları, bir değer native date veya big-number type üzerinden
  round-trip edildiğinde başarısız olan case'leri içerir.

### Eski trust material

Tehdit: offline verifier cached trust root tutar ve daha sonra revoke edilmiş
material'ı kabul eder.

Cached trust root'un built-in expiry'si yoktur ve verifier key material'ın
alındıktan sonra revoke edilip edilmediğini anlayamaz.

Azaltımlar:

- offline verification'ın point-in-time olduğunu belgeleme,
- trust root'un ne zaman alındığını kaydetme,
- core verification'ın external trust material'a hiçbir zaman bağlı olmaması için
  signature verification'ı optional tutma.

## Dağıtım profilleri

### Yerel

- CLI ve loopback-only review page,
- self-contained bundle ve veritabanı yok,
- yalnızca imported output'lar,
- auth, provider network call, shell runner veya public link yok,
- file permission'ları varsayılan olarak bundle erişimini local user ile sınırlar.

### CI-attested

- attestation, calling repository'nin değiştiremeyeceği workflow'dan üretilir,
- predicate content aggregate ve digest ile sınırlıdır,
- signer identity consuming side'da doğrulanır,
- workflow reviewer identity veya rationale text'i hiçbir zaman almaz.

### Shared-bundle review

- bundle'lar owner tarafından bilinçli olarak transfer edilir,
- geri dönen review log'lar append-only'dir ve digest ile birleştirilir,
- owner evidence'ı dondurmadan önce tüm bundle'ı doğrular,
- shared service, account veya invitation mechanism yoktur.

Hosted service, database, authentication provider veya public collection içeren
profiller kapsam dışındadır ve planlanmamıştır.

## Güvenlik release gate'leri

- [ ] Bundle path traversal, canonicalization ve digest verification geçer.
- [ ] Partial veya truncated review write'lar frozen evidence'a giremez.
- [ ] Snapshot traversal ve secret testleri geçer.
- [ ] Reviewer payload'da candidate identity leakage yoktur.
- [ ] Review submission idempotent'tır.
- [ ] Freeze ve decision invariant'ları geçer.
- [ ] Predicate identity veya free-text field içermez; schema bunu zorunlu kılar.
- [ ] Verification, signature checking sonrasında yalnızca verified payload byte'larını kullanır.
- [ ] Dependency ve secret scan'leri temizdir.
- [ ] CSP ve output sanitization testleri geçer.
- [ ] Verification, server ve network olmayan temiz environment'ta başarılı olur.
- [ ] Conformance vector'ları bağımsız verifier'da geçer.