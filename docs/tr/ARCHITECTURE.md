# Mimari

> Bu belge, İngilizce [kaynak metnin](../ARCHITECTURE.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

## Mimari ilke

Sınır, kanıt bundle'ıdır. Bunun dışındaki her şey değiştirilebilir.

Yürütme, trace depolama, kimlik, iş birliği ve dağıtım; benimseyenlerin zaten
kullandığı araçlarda kalır. Bu proje bir format, bundle üretme yöntemi ve bundle
doğrulama yöntemi sağlar. Hiçbir zaman kayıt sistemi hâline gelmez.

Açıkça belirtilmesi gereken bir sonuç şudur: referans uygulama ortadan kalkarsa
bile üretilmiş her bundle, yalnızca kendi byte'larından okunabilir ve
doğrulanabilir kalmalıdır.

## Format katmanları

```text
predicate    blind evaluation results, defined by this project
statement    in-toto Statement v1, reused
envelope     DSSE, reused, optional
bundle       evidence directory plus a canonical manifest
```

Yalnızca predicate yenidir. Alan düzeyindeki ayrıntılar için kanıt formatı ön
taslağına bakın.

## Mantıksal akış

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

## Referans dağıtım

```text
release-evidence CLI
  -> creates a self-contained bundle
  -> starts a loopback-only review page
  -> appends reviews to JSONL
  -> freezes canonical evidence and decision records
  -> verifies every referenced digest without a server
```

Projeye ait bir veritabanı, paylaşımlı içerik adresli depo, yönetim API'si,
yönetim arayüzü, kimlik doğrulama, sağlayıcı runner'ı veya barındırılan bileşen
yoktur. Artifact dosyaları ve içe aktarılan çıktılar bundle'a kopyalanır. Bu
çoğaltma kasıtlıdır: bundle'ın bu projeyi hiç duymamış bir makinede
doğrulanabilmesini sağlayan budur.

## Dağıtım tarifleri

İş akışını çalıştırmanın desteklenen üç yolu vardır. Hiçbiri bu proje tarafından
işletilen bir servis gerektirmez.

### Yerel, CI olmadan

```text
release-evidence CLI
  -> creates a self-contained bundle
  -> starts a loopback-only review page
  -> appends reviews to JSONL
  -> freezes canonical evidence and decision records
  -> verifies every digest with no network
```

Bu temel seçenektir ve her zaman çalışması MUST'tır. Aynı zamanda, GitHub
Enterprise Server kullanıcıları dâhil olmak üzere, benimseyenin barındırılan CI
kullanamadığı durumlarda kullanılabilen tek tariftir.

### CI-attested

```text
repository CI job
  -> restores the bundle produced locally or by an importer
  -> verifies it
  -> emits an in-toto attestation with a custom predicate type
  -> a consumer verifies with the platform CLI or any Sigstore client
```

Bu seçenek, bir sunucu eklemeden kurcalamaya karşı kanıt ve zaman damgalı imza
sağlar. Benimseyenlere iki husus açıklanmalıdır: yalnızca imzalama sertifikası ve
doğrulanmış zaman damgaları attestation'ı üreten iş akışının denetimi dışındadır;
dolayısıyla güvenliği ihlal edilmiş bir iş akışı predicate içeriğini yine de
sahteleyebilir. Ayrıca public repository'lerde attestation, public ve değişmez
bir şeffaflık günlüğüne yazılır; bu nedenle predicate, reviewer kimlikleri veya
gerekçe metni yerine toplu değerler ve digest'ler taşır.

### Paylaşılan bundle ile review

```text
owner produces bundle -> reviewer receives a copy
  -> reviewer reviews offline
  -> reviewer returns an append-only review log
  -> owner merges by digest and freezes
```

Bu yöntem; kimlik, davet veya rezervasyon sistemi oluşturmadan birden çok
reviewer ile çalışmayı kapsar. Kapsam uğruna kullanım kolaylığından bilinçli
olarak ödün verir.

## Repository düzeni

Lisans ve kullanım biçimine göre ayrılmış iki repository:

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

Uygulama tek ve küçük bir paket olarak kalır. Bir adapter monorepo'su, kalıcılık
katmanı veya API paketi yoktur; çünkü sunucu yoktur.

## Artifact snapshot'ları

Artifact snapshot'ı, bildirilen bir dosya ya da klasör kökü üzerinde
deterministik bir digest ile içerik manifest'inden oluşur. Dizin kimliği, yalnızca
göreli yol ve içeriği kapsayan in-toto `dirHash` algoritmasını kullanır. mtime,
sahip ve izinlerin hariç tutulması, yeniden üretilebilir arşivlerdeki hata
biçimlerinin çoğunu ortadan kaldırır; böylece arşiv formatı kimliğin parçası
olmaktan çıkar ve bir taşıma konusu hâline gelir.

Paylaşımlı içerik adresli depo yoktur. Bundle'lar referans verdikleri öğeleri
kopyalar; bunun bedeli çoğaltma, kazancı ise taşınabilirliktir.

Snapshot süreci şunları yapmalıdır:

- göreli yolları POSIX ayraçlarına normalize etmek,
- mutlak yolları ve `..` kaçışlarını reddetmek,
- kök dışına çıkan sembolik bağlantıları reddetmek,
- dosya sayısı, dosya başına boyut ve toplam boyut sınırlarını uygulamak,
- yapılandırılan secret'ları ve üretilmiş dosyaları hariç tutmak,
- byte hash'ini, göreli yolu, mode'u ve media type'ı kaydetmek,
- deterministik bir manifest hash'i oluşturmak.

Artifact türü metadata'dır. Temel mantık prompt/skill/agent alt sınıfları
tanımlamaz.

## Yürütme modeli

Proje yürütme sonuçlarını içe aktarır. Asla bir model çağırmaz, sağlayıcı
kimlik bilgilerini tutmaz ve bir shell komutu çalıştırmaz.

Desteklenen girdiler:

- genel JSON veya JSONL çıktı kümeleri,
- Promptfoo sonuçları,
- gerektikçe katkı sağlanan diğer importer'lar.

İçe aktarılan bir yürütme; case kimliğini, arm kimliğini, input digest'ini,
output digest'ini, importer adını ve sürümünü ve kaynağın sağladığı tüm
provenance'ı kaydeder. Eksik provenance üretilmez; eksik olarak kaydedilir. Çıktı
düzenlemek yeni bir kayıt oluşturur, geçmişi asla yeniden yazmaz.

## Atama ve blinding

- Bir study açıldıktan sonra protocol revision değiştirilemez.
- Assignment plan, study seed'i ve algoritma sürümünden türetilir.
- Reviewer payload yalnızca opaque arm presentation ID'lerini içerir.
- Candidate adları, branch'ler, artifact yolları, etiketler ve hash'ler reviewer
  DOM'unda, URL'de veya karar öncesi network payload'ında yer almaz.
- Pairwise side assignment, tamamlanmış bir batch içinde dengelenir.
- Assignment ve review gönderimi idempotent'tır.
- Study'nin kapatılması, dâhil edilen review'ları ve exclusion kurallarını
  dondurur.

## Renderer'lar

Desteklenen renderer'lar:

- düz metin ve Markdown,
- kararlı anahtar sıralamasına ve daraltılabilir bölümlere sahip yapısal JSON.

Trace özetleri ve multimodal çıktılar kapsam dışındadır. Bu bir trace backend'i
değildir.

## Kanıt kayıtları

Kanıt hesaplaması deterministik ve sürümlüdür. Betimsel metrikler ve açık örneklem
sınırlamaları üretir; hiçbir zaman istatistiksel uygunluk iddiasında bulunmaz.

Bir kanıt kaydı şunlara referans verir:

- dondurulmuş protocol'e,
- dâhil edilen review kimliklerine ve exclusion kümesine,
- analiz algoritmasının sürümüne,
- betimsel sayımlara ve konum dengesine,
- bütünlük denetimi sonuçlarına.

Bir exclusion'ın veya algoritmanın değiştirilmesi yeni bir kayıt üretir. Kayıtlar
yerinde düzenlenmez.

## Karar kaydı

Karar, dağıtım değildir. Şunları kaydeder:

- capability ve candidate artifact digest'lerini,
- evidence digest'ini,
- bir policy uygulandıysa policy digest'ini,
- kararı kaydeden adı belirtilmiş kişiyi,
- kararı, gerekçeyi ve zaman damgasını.

Karar kaydı, bilinçli olarak belirli bir framework'e bağlı olmayan in-toto Simple
Verification Result predicate'ini yeniden kullanır. Downstream sistemler bu kaydı
tüketebilir; bu projedeki hiçbir şey kayda göre eylem gerçekleştirmez.

Bu kayıt, bundle içindeki canonical bir dosyadır ve benimseyen geçmiş tutmak
isterse Git'te izlenir. Bir ledger servisi yoktur.

## Arayüzler

Kararlı arayüzler bundle formatı, JSON Schema'lar, conformance vector'ları ve
komut satırı yüzeyidir. HTTP API yoktur.

Review sayfası, bir review oturumu boyunca loopback üzerinde sunulur ve yalnızca
oturumun ihtiyaç duyduğu işlemleri sağlar: sonraki assignment'ı alma ve review
gönderme. Bir application server değildir ve oturumdan daha uzun süre çalışmaz.