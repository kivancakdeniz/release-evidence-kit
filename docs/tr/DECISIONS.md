# Mimari Karar Günlüğü

> Bu belge, İngilizce [kaynak metnin](../DECISIONS.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

Kararlar değişmez olgular değil, planlama taahhütleridir. Değiştirilen bir karar,
gerekçesi ve sonuçlarıyla birlikte yeni bir kayıt alır.

## ADR-001 — Proje adı

**Durum:** ADR-031 tarafından geçersiz kılındı

Çalışma adı olarak **Capability Arena** kullanılsın. “Capability”; prompt'ları,
skill'leri, agent'ları, toolset'leri, RAG stratejilerini ve iş akışlarını, dil
skill'lerini temel soyutlama hâline getirmeden kapsar.

GitHub hesap yolu ve npm paket adı 2026-07-30 tarihinde kullanılabilir
görünüyordu. Geniş kapsamlı lansmandan önce resmî bir marka/domain araştırması
yapılması gerekmektedir.

## ADR-002 — Ürün kategorisi

**Durum:** Kabul edildi

Proje; genel bir LLM evaluation, observability, prompt yönetimi veya dağıtım
platformu olarak değil, Git ile yönetilen AI capability'leri için taşınabilir
blind release evidence olarak konumlandırılsın.

## ADR-003 — İlk kullanıcı

**Durum:** Kabul edildi

Yerel iş akışını bireysel bir geliştiricinin kullanabileceği hâlde tutarken
enterprise AI ekipleri için optimize edilsin. Open-source dağıtım, çok sayıda
projesi olan tek bir organizasyondur; multi-tenant SaaS ertelenmiştir.

## ADR-004 — Capability soyutlaması

**Durum:** Kabul edildi

Capability, değişmez bir dosya/klasör artifact snapshot'ıdır. Prompt, skill,
agent, toolset, RAG ve workflow; domain alt sınıfları değil, metadata
değerleridir.

## ADR-005 — Study modları

**Durum:** Kabul edildi

MVP yalnızca pairwise study'leri uygular. Domain sözleşmeleri N-arm ranking için
yer ayırır; ancak ranking UI ve analiz 1.1'e taşınır ve tüm arm'ların aynı ekranda
sıralanması yerine dengeli pairwise block'lar kullanır.

## ADR-006 — İnsan denetimindeki karar

**Durum:** Kabul edildi, ADR-021 ile revize edildi

Adı belirtilmiş bir kişi; kesin artifact, evidence ve isteğe bağlı policy
digest'lerine göre onay veya ret kaydeder. Proje hiçbir eligibility verdict,
promotion channel veya deployment action tanımlamaz. Downstream sistemler kaydı
tüketebilir; ancak referans uygulama hiçbir zaman kayda göre eylem gerçekleştirmez.

## ADR-007 — Teknoloji yığını

**Durum:** Kabul edildi, ADR-021 ve ADR-028 ile revize edildi

İlk karar: uçtan uca TypeScript; pnpm workspace'leri ve Turborepo; React/Vite web;
Fastify control plane; yerelde SQLite ve ekipler için PostgreSQL ile Drizzle.

Güncel karar: CLI, loopback review sayfası ve verifier sağlayan tek ve küçük bir
TypeScript paketi ile bir GitHub Action. Workspace aracı, sunucu framework'ü, ORM
ve veritabanı yoktur. Proje bir ürün değil, referans uygulamalı bir specification
olduğu için yığın küçülür.

Uygulama temeli:

- Node.js 24 LTS, strict TypeScript ve ESM; `pnpm`, package consumer'ları için
  gereksinim değil, maintainer aracıdır. Node.js 22.14+ yalnızca ek dependency
  veya conditional code olmadan desteklenebildiği sürece compatibility target'tır.
- Yayınlandığında install script'i olmayan tek npm paketi. CLI argument parsing,
  filesystem erişimi, hashing ve loopback HTTP listener, Node built-in'lerini
  kullanır.
- Review sayfası, `127.0.0.1` üzerinde static asset olarak sunulan browser-native
  HTML, CSS ve JavaScript'tir; React runtime'ı veya application framework'ü
  yoktur.
- Runtime dependency'leri, ad hoc uygulaması daha riskli olacak standartlar için
  kritik parsing, canonicalization ve schema validation ile sınırlıdır. Her
  dependency sabitlenir, denetlenir ve repository'de gerekçelendirilir.
- Producer ve bağımsız verifier, birbirinden ayrık module root'lardan derlenir.
  Verifier producer kodunu import ederse test başarısız olur. Specification
  repository'si ayrıca temel digest kontrolleri için dependency içermeyen POSIX
  verifier'ı barındırır.
- Unit ve conformance testleri için Node test runner kullanılır. Playwright
  yalnızca reviewer flow, accessibility, CSP ve candidate identity leak testleri
  için kullanılır.

## ADR-008 — Dağıtım profilleri

**Durum:** ADR-021 tarafından geçersiz kılındı

İlk karar; önce loopback servisini, ardından PostgreSQL ve OIDC içeren Docker
Compose'u, sonrasında da barındırılan bir collector'ı aşamalı olarak planlıyordu.

Güncel karar: hiçbiri bu proje tarafından işletilen bir servis olmayan üç tarif.
CI olmadan yerel kullanım, CI-attested kullanım ve shared-bundle review.
Barındırılan dağıtım, ilişkisel depolama ve public collection ertelenmemiş, kapsam
dışında bırakılmıştır.

## ADR-009 — Kimlik doğrulama

**Durum:** ADR-021 tarafından geçersiz kılındı

İlk karar bir OIDC BFF, scoped invite token'ları ve anonymous session'lar
planlıyordu.

Güncel karar: sunucu ve paylaşılan state olmadığı için kimlik doğrulama yoktur.
Review sayfası, session süresince loopback'e bağlanır. Birden çok reviewer ile
çalışmada digest ile birleştirilen shared bundle'lar kullanılır. Kimlik ve
koordinasyona ihtiyaç duyan benimseyenler mevcut bir annotation platformu
kullanmalı ve çıktısını içe aktarmalıdır.

## ADR-010 — Runner kapsamı

**Durum:** ADR-021 tarafından geçersiz kılındı

İlk karar: MVP çıktıları içe aktarır; 1.1, OpenAI-compatible HTTP runner ve
kısıtlanmış yerel shell runner ekler.

Güncel karar: proje yalnızca çıktıları içe aktarır. Sağlayıcı çağrıları,
credentials ve shell yürütme referans uygulamanın dışında kalır. Benimseyenler
capability'leri mevcut eval araçlarıyla çalıştırır ve ortaya çıkan kayıtları içe
aktarır.

## ADR-011 — Observability

**Durum:** ADR-021 tarafından geçersiz kılındı

İlk karar, isteğe bağlı exporter'larla bir OpenTelemetry/OpenInference port'u
sunuyordu.

Güncel karar: araç telemetry üretmez ve hiçbir şeyi export etmez. Tracing
sistemleriyle entegrasyon yalnızca inbound'dur; mevcut bir aracın çıktısını
bundle'a dönüştüren importer'lar olarak sağlanır. İş akışındaki hiçbir şey bir
observability backend'i gerektiremez ve benimseyen açıkça bir attestation
yayımlamadıkça hiçbir veri makinesinden çıkmaz.

## ADR-012 — Çıktı renderer'ları

**Durum:** Kabul edildi

MVP text/Markdown ve structured JSON destekler. Agent trace summary 1.1'dedir.
Multimodal çıktılar ertelenmiştir.

## ADR-013 — Kanıt policy'si

**Durum:** ADR-021 tarafından geçersiz kılındı

İlk karar, sürümlü bir policy override ile varsayılan istatistiksel gate'ler
sunuyordu.

Güncel karar: analiz yalnızca betimseldir. Format sayımları, konum dengesini ve
belirtilen sınırlamaları raporlar; hiçbir zaman eligibility verdict veya
confidence interval üretmez. Policy değerlendirmesi benimseyene aittir ve
yalnızca policy digest kaydedilir. Kalibre edilmiş örneklem boyutları olmadan
istatistiksel iddia yayımlamak, bu projenin yapabileceği en zararlı şey olacaktır.

## ADR-014 — Kalıcılık sınırı

**Durum:** ADR-019 ve ADR-026 tarafından geçersiz kılındı

İlk karar, content-addressed artifact store ile domain port'larının arkasında
SQLite ve PostgreSQL adapter'ları planlıyordu.

Güncel karar: tek kalıcılık mekanizması canonical JSON, append-only JSONL ve
kopyalanmış artifact byte'larından oluşan taşınabilir bir bundle'dır. Veritabanı
ve paylaşımlı object store yoktur. Dizin kimliği `dirHash` kullandığından
deduplication doğruluk için gerekli değildir.

## ADR-015 — Lisans ve görünürlük

**Durum:** ADR-028 ve ADR-037 tarafından geçersiz kılındı

İlk karar her şey için Apache-2.0 kullanıyor ve tam release trust baseline elde
edilene kadar planlama workspace'ini private tutuyordu. Güncel karar, Apache-2.0
lisanslı bu workspace'in non-normative P0 design review olarak public olmasına
izin verir. Normative specification ve executable release lisansları ayrılmıştır
ve sonraki trust gate'lerini korur.

## ADR-016 — Mevcut araç entegrasyonu

**Durum:** Kabul edildi

Taşınabilir artifact, blind study, evidence ve decision sözleşmeleri oluşturulsun.
Provider runner'ları, tracing backend'leri, genel annotation sistemleri, prompt
manager'ları ve deployment environment'ları çoğaltmak yerine entegre edilsin.
Önce genel JSON ve Promptfoo import'ları gelir; OpenInference, LangSmith,
Opik/Langfuse ve Label Studio isteğe bağlı sınırlar olarak kalır.

## ADR-017 — Yalnızca planlama workspace'i

**Durum:** Kabul edildi, yerine getirildi ve ADR-037 ile değiştirildi

İlk workspace yalnızca planlama belgelerini içerir. Planlama review'u açıkça
onaylanana kadar package manifest, source tree, dependency, Git repository veya
public repository oluşturulmaz.

2026-07-31 tarihli publication review, yalnızca planlama belgeleri ve static site
için public bir Git repository oluşturulmasını onayladı. Package manifest'leri,
dependency'ler ve implementation source, R1/R2 gate'lerine bağlı kalır.

## ADR-018 — Overlay-first teslimat

**Durum:** Kabul edildi, ADR-021 ile değiştirildi

Kapsamı genişletmeden önce 4-8 haftalık bir V0 yürütülsün. V0; çıktıları içe
aktarmalı, deterministik artifact digest'leri hesaplamalı, blind ve dengeli
pairwise review'lar toplamalı, evidence'ı dondurmalı, insan kararını kaydetmeli
ve taşınabilir bir bundle'ı doğrulamalıdır.

Devam gate'i; maintainer dışındaki en az bir ekip tarafından yinelenen gerçek
kullanım, bağımsız bundle doğrulaması, somut biçimde etkilenmiş bir karar veya iş
akışı ve 15 dakikanın altında kurulum gerektirir. Gate'in başarısız olması ürün
geliştirerek çalışmayı gerekçelendirmek değil, specification'ı dondurmak demektir.

## ADR-019 — Birincil sınır taşınabilir bundle'dır

**Durum:** Kabul edildi

Bağımsız olarak doğrulanabilen evidence bundle, kararlı ürün sözleşmesidir.
Veritabanları, hosted API'ler, UI'lar ve entegrasyonlar değiştirilebilir producer
veya consumer'lardır. Her karar, bu proje tarafından işletilen bir sunucuya
erişmeden export edilen byte'lardan doğrulanabilmelidir.

## ADR-020 — Ürün fallback'i

**Durum:** Kabul edildi

V0 veya sonraki product-market checkpoint başarısız olursa schema'lar korunsun ve
kapsam, established eval platformları için entegrasyonlar ile CLI/GitHub Action'a
indirgensin. Zayıf yinelenen kullanımı telafi etmek için bağımsız platform
özellikleri eklenmeye devam edilmesin.

## ADR-021 — Birincil yayımlanan artifact specification'dır

**Durum:** Kabul edildi

Evidence bundle schema, başlı başına sürümlü bir specification olarak
yayımlansın; CLI ürün değil, referans uygulama olsun.

Gerekçe: software supply chain attestation alanında kalıcı katman format olmuştur
(in-toto predicate'leri, SLSA, SPDX, CycloneDX); istemciler ise birbirinin yerine
kullanılabilir kalmıştır. Tek bir maintainer bir formatı yönetebilir, ancak
şirket destekli platformlarla ürün geliştirme yarışına giremez. Bundle, başka
araçların onu üretip doğrulayabileceği biçimde tanımlansın ve producer ile kod
paylaşmayan bağımsız bir verifier sağlansın.

## ADR-022 — CLI kurulumundan önce CI üzerinden dağıtım

**Durum:** Kabul edildi

GitHub Action, npm paketiyle birlikte birinci sınıf dağıtım kanalı olarak
sunulsun.

Gerekçe: provenance ve attestation mekanizmaları ayrı kurulum gerektirmediğinde
yaygınlaştı. Bir enterprise'dan bağlantısız bir maintainer'ın bilinmeyen CLI'ını
kurmasını istemek en büyük benimseme engelidir; CI dağıtımı bu engeli aşarken
varsayılan olarak doğrulanabilir artifact'lar üretir.

## ADR-023 — Public release öncesinde trust baseline zorunluluğu

**Durum:** Kabul edildi, ADR-037 ve ADR-039 ile değiştirildi

Şunların tümü sağlanana kadar onaylanmış bir specification, npm paketi, GitHub
Action veya başka bir executable release yayımlanmasın: provenance ile aşamalı
npm trusted publishing, install script'lerinin olmaması, telemetry olmaması,
core path'te network call bulunmaması, küçük ve denetlenebilir bir dependency
tree, üçüncü taraf atıfları gerektiriyorsa NOTICE ile Apache-2.0, SECURITY.md,
yayımlanmış SBOM ve single-maintainer bus factor'ı belirterek exit plan'ı
belgeleyen governance.

P0, daha dar kapsamlı repository, lisans, security reporting, governance, ad ve
asset rights gate'lerini geçtikten sonra executable olmayan ve açıkça
non-normative design document'ları yayımlayabilir.

Gerekçe: 2025 npm supply chain olaylarından sonra bu işaretleri taşımayan
bilinmeyen bir publisher, ürün kalitesi ne olursa olsun enterprise review
tarafından reddedilecektir. Exit plan önemlidir; çünkü bu kategoride baskın
failure mode ilgi eksikliği değil, terk edilmedir.

## ADR-024 — Benimseme beklentileri ve başarı metriği

**Durum:** Kabul edildi

Başarı stars veya downloads ile değil, bundle üretip doğrulayan repository'lerle
ve yinelenen gerçek kararlarla ölçülsün.

Bu kategoride incelenen ve beş binin üzerinde star'a sahip her proje şirket
desteklidir; en yakın human-in-the-loop projeleri ise duraklamıştır. Gerçekçi on
iki aylık sonuç; birkaç yüz star, tek haneli ila düşük çift haneli sayıda gerçek
ekip ve sıfıra yakın sürekli dış contributor'dır. Değerli olmak için geniş
benimseme gerektiren planlar tasarım aşamasında reddedilmelidir.

## ADR-025 — in-toto attestation yığını yeniden kullanılsın

**Durum:** Kabul edildi

Evidence, proje denetimindeki bir predicate type URI ile in-toto Statement v1
olarak ifade edilsin. İmzalanırken DSSE ile sarmalansın. Yeni bir envelope, imza
şeması, transparency log veya verification CLI icat edilmesin.

Predicate type URI'ları hiçbir yerde kayıtlı değildir; doğal URI namespacing
yeterli kabul edilir ve URI bir sürüm taşımalıdır. `in-toto.io/attestation`
namespace'i resmî inceleme gerektirdiğinden denetlenen bir domain ile başlanmalı
ve inceleme daha sonra isteğe bağlı bir adım olarak ele alınmalıdır.

Sonuç: mevcut araçlar evidence'ı taşıyabilir ve güvenliği ihlal edilmiş veya terk
edilmiş bir referans uygulama benimseyenleri mahsur bırakmaz.

## ADR-026 — Dizin kimliği dirHash, JSON digest'leri JCS kullanır

**Durum:** Kabul edildi

Capability directory identity için in-toto `dirHash` algoritması kullanılsın.
mtime, owner ve permission'ları hariç tutarak yalnızca relative path ve content'i
kapsar; bu, reproducible archive failure mode'larının çoğunu ortadan kaldırır.
`gitCommit`, provenance için ayrı adlandırılmış ResourceDescriptor olarak
kaydedilsin ve asla `dirHash` ile aynı DigestSet'te bulunmasın: in-toto, iki
DigestSet'i kabul edilebilir alanlardan herhangi biri eşleştiğinde eşleşmiş sayar;
dolayısıyla bunları birleştirmek, bir commit eşleşmesinin farklı working-tree
byte'larını gizlemesine izin verir. File mode anlamlı olduğunda `gitTree` ayrıca
adlandırılmış başka bir descriptor olarak kaydedilsin.

Bir JSON belgesi hash'lendiğinde ve bu hash digest olarak kullanıldığında önce
RFC 8785 ile canonicalize edilsin. Bu şema sayıları IEEE 754 double ile
sınırlandırdığı ve NaN, Infinity ile lone surrogate'ları reddettiği için numeric
field'lar küçük integer'larla sınırlıdır; diğer tüm nicelikler string olarak
taşınır.

CI attestation araçları artifact'ları file digest ile eşleştirdiği ve sha256
gerektirdiği için paketlenmiş bundle üzerinde düz bir `sha256` subject de
bulunsun.

## ADR-027 — Evidence predicate kimlik veya hassas metin taşımaz

**Durum:** Kabul edildi

Predicate yalnızca kararlı identifier'lar, aggregate count'lar, timestamp'ler ve
content digest'leri taşır. Reviewer kimlikleri, rationale text, prompt'lar, model
çıktıları ve free-form limitation text yerel bundle içinde kalır. Limitation'lar
specification-defined code'lar kullanır ve digest ile yerel detail record'lara
işaret edebilir.

Gerekçe: public repository'lerden üretilen attestation'lar public olarak
okunabilen, immutable bir transparency log'a yazılır. Predicate'e konulan her şey
fiilen geri alınamaz. Bundle bilinçli olarak paylaşılabilir; transparency log
kaydı paylaşımdan geri çekilemez.

## ADR-028 — Lisanslama ve repository ayrımı

**Durum:** Kabul edildi, ADR-037 ile değiştirildi

Specification metni Community Specification License 1.0, conformance vector'ları
vendor edilebilmeleri için permissive license, implementation ise Apache-2.0
altında iki repository'de bulunsun.

Gerekçe: code license'ları contribution kapsamında hak verirken specification
license'ları belgenin tamamının bağımsız uygulamaları için hak verir. Specification
ile kodu ayırmak bu lisans ailesi için belgelenmiş uygulamadır ve aynı governance
metni, specification'ı daha sonra başka bir standards organization'a sunma
mekanizmasını zaten içerir.

Bir foundation'a bağış şu anda mümkün değildir. Project entry, birden çok
organizasyondan birden çok maintainer gerektirir; single-maintainer proje bunu
karşılayamaz. Seçenek varmış gibi davranmak yerine gelecekte açık kalmasını
sağlayacak lisans şimdi seçilsin.

## ADR-029 — Conformance yayımlanmış vector'larla tanımlanır

**Durum:** Kabul edildi

Bir implementation, belirtilen specification version için yayımlanmış conformance
vector'larını geçiyorsa conformant'tır. Self assertion yeterli değildir.

Her dilin çalıştırabilmesi için vector'lar data file'dır; her vector, uyguladığı
requirement identifier'larını belirtir ve optional profile'lar bildirilen bir
expected-failure mekanizmasıyla ayrılır. Specification version ile vector version
birlikte ilerler.

Proje, producer ile kod paylaşmayan bir verifier sunmalıdır. Aksi hâlde
conformance iddiaları döngüseldir.

## ADR-030 — Governance, durum ve arşivleme

**Durum:** Kabul edildi

Tek maintainer'ı adlandıran, bus factor'ı belirten, objection path tanımlayan ve
successor route bildiren governance yayımlansın. Machine-readable project status
yayımlansın ve doğru tutulsun.

Geliştirme durursa specification version dondurulsun, vector'lar ve örnekler
yayımlanmış olarak tutulsun ve bundle'ların araç olmadan okunabilen düz dosyalar
olduğu belirtilsin. Sessizce bırakmak yerine final release ile bilinçli olarak
arşivlensin.

Gerekçe: bu kategoride baskın failure mode, gerçek kullanıcı kitlesi olan ancak
yakın zamanda commit almamış projedir. Bu sonucu planlamak onu inkâr etmekten daha
ucuzdur ve zararsız bir arşiv ile mahsur kalan dependency arasındaki farktır.

## ADR-031 — Release Evidence Kit olarak yeniden adlandırma

**Durum:** Kabul edildi, ADR-001'in yerini alır

Projenin adı Capability Arena'dan **Release Evidence Kit** olarak değiştirilsin.
Specification repository'si `release-evidence-kit-spec`, implementation
repository'si `release-evidence-kit`, CLI binary'si ise `release-evidence` olsun.

Gerekçe: “Arena”, rakipler arasında leaderboard veya public benchmark çağrışımı
yapar; bu, üretilen şeyin tam tersidir. Proje, bir ekibin kendi release kararı
için evidence üretir. Yeni ad çıktıyı (release evidence) ve self-hosted niteliği
(kendiniz kurduğunuz bir kit) belirtir ve önce dokümanları okumadan anlaşılabilir.

Sonuç: eski ad garip tekrarları zorunlu kıldığı için CLI surface sadeleşir.
`evidence freeze`, `freeze`; `decision approve`, `decide`; `bundle verify` ise
`verify` olur. GitHub path ve npm package name erişilebilirliği ilk publish
öncesinde yeniden kontrol edilmelidir; ADR-001'deki trademark search yeni ad için
de geçerlidir.

## ADR-032 — Blinding iddia edilmez, ölçülür

**Durum:** Kabul edildi

Her reviewer'a preference kaydettikten sonra, açık bir decline option ile hangi
arm'ın candidate olduğunu düşündüğü sorulsun. Toplamlar predicate'te raporlansın
ve correct-guess rate betimsel diagnostic olarak gösterilsin.

Gerekçe: `armIdentityWithheld: true` reviewer'ı değil, software'i tanımlar.
Arm'lar sıklıkla length, formatting veya tone bakımından farklıdır; reviewer'lar
birkaç comparison içinde kendilerini de-blind eder ve preference count artık
beklentilerini ölçer. Blinding'i ölçmeden iddia eden bir bundle, destekleyemediği
bir iddiada bulunur; bu, projenin önlemek için var olduğu hatanın aynısıdır.
Maliyeti comparison başına tek tıklamadır.

Sonuç: v0.1, `blindHeld` veya `blindFailed` için threshold tanımlamaz ve iki
etiketi de üretmez. Az sayıda guess ile 0.5'e uzaklık kararsızdır ve bunu
sınıflandırmak formatın başka yerde reddettiği statistical verdict'ü getirir.
Benimseyen pre-registered bir policy uygulayabilir, digest'ini kaydedebilir ve
controlled limitation code ekleyebilir; core verifier yalnızca bildirilen
count'ları kontrol eder.

## ADR-033 — Assignment seed'i açıklansın ve protocol önceden kaydedilsin

**Durum:** Kabul edildi

Verifier'ın assignment plan'ı replay edebilmesi için dondurulmuş bundle içinde
`assignmentSeed` açıklansın ve ilk review record yazılmadan önce protocol'ün
`pre-registration.json` digest'i dondurulsun.

Gerekçe: hiçbir zaman açılmayan commitment hiçbir şeyi kanıtlamaz ve aggregate
count'lar, kaybedileceği düşünülen comparison'ların hiç atanmadığı bir study ile
temiz bir study'yi ayıramaz. Aynı şekilde, başka hiçbir şey bir study
çalıştırmayı, sonucu beğenmeyip değiştirilmiş bir case set ile yeniden çalıştırmayı
engellemez. İki mekanizma da suistimali önlemez; görünür kılar ve bu formatın başka
yerlerde iddia ettiği tek şey de budur.

Sonuç: verification algorithm bir replay step kazanır; predicate,
`plannedComparisons` ve `unfilledAssignments` değerlerini raporlar; böylece
incomplete study daha küçük ve temiz bir study gibi değil, incomplete olarak
okunur.

## ADR-034 — Agreement ve case başına sonuçlar raporlansın

**Durum:** Kabul edildi

Aggregate preference count'lara ek olarak, birden çok kez review edilen case'ler
üzerinden observed pairwise reviewer agreement ve case başına majority outcome
log raporlansın.

Gerekçe: aggregate split reviewer'ların anlaşmaya varıp varmadığı hakkında hiçbir
şey söylemez; dolayısıyla noisy result decisive görünebilir. Daha önemlisi,
aggregate count'lar bundle'daki decision-relevant değeri en düşük sayıdır:
release'ler nadiren candidate 58'e 38 kazandığı için engellenir; daha önce çalışan
dokuz belirli case artık çalışmadığı için engellenir. İki değer de betimseldir ve
model gerektirmez; bu nedenle no-statistical-claim kuralını ihlal etmez.

Chance-corrected coefficient'lar ek olarak raporlanabilir; ancak observed figure
yerine geçmemelidir, çünkü her chance correction bir model içerir.

## ADR-035 — Arm'lar byte düzeyinde aynı runtime declaration'ı paylaşmalıdır

**Durum:** Kabul edildi

Tüm arm'lar aynı `runtime` digest'ine referans vermeleri MUST'tır. Runtime'ların
gerçekten farklı olduğu durumlarda producer'ın `runtime-mismatch` limitation
code'unu kullanması, yerel açıklamayı digest ile bağlaması MUST'tır ve study'yi
single-variable comparison olarak sunmaması MUST'tır.

Gerekçe: formatın comparability claim'i “same cases, same runtime, one variable
changed” şeklindedir. Her arm yalnızca kendi runtime dosyasını adlandırdığında bu
iddia doğrulanamaz ve farklı modellere karşı çalışan iki arm yine de sorunsuz
doğrulanan bir bundle üretebilir.

## ADR-036 — Core verification bu projenin araçlarını gerektirmemelidir

**Durum:** Kabul edildi

Manifest integrity, capability directory identity ve review log integrity standart
command line araçlarıyla ifade edilebilir kalmaları MUST'tır; specification
repository'sinin bu alt küme için POSIX shell reference verifier yayımlaması
MUST'tır. Bu nedenle `manifest.json`, path ve `sha256` çiftlerinden oluşan flat
array'i korur.

Gerekçe: ADR-030, abandonment'ın baskın failure mode olduğunu zaten kabul eder.
Tek verifier'ı bakımsız bir repository'deki npm paketi olan bundle, projenin
çözdüğünü iddia ettiği sorunu çözmemiştir; bir enterprise'dan yalnızca hash
kontrolü için bilinmeyen CLI kurmasını istemek kalan en büyük adoption barrier'dır.
Dependency-free verifier ayrıca ADR-024'ün önemli başarı göstergesi olarak
adlandırdığı independent implementation'ı çekme olasılığı en yüksek artifact'tır.

Sonuç: bir browser'ın zaten gerektiği producer ve review page için TypeScript
uygun kalır; ancak bundle okumanın critical path'inde olmadığı açıkça belirtilir.

## ADR-037 — Önce non-normative design preview yayımlansın

**Durum:** Kabul edildi

Bu workspace önce yayımlanmış specification veya reference implementation olarak
değil, **public pre-draft design review** olarak yayımlansın. Repository önerilen
formatı, araştırmayı, threat model'i ve roadmap'i açıklayabilir; ancak conformance,
implementation availability veya approved Community Specification iddiasında
bulunmaması MUST'tır.

Güncel design repository Apache-2.0 kullanır. Sonraki normative specification,
yalnızca Community Specification paketinin tamamı mevcut olduktan sonra kendi
repository'sine taşınır: contributor agreement, scope, notices, license,
governance, contribution process, code of conduct ve belgelenmiş approval/appeal
process. Pre-draft aşamasında belirsiz patent taahhütlerinden kaçınmak için bu
design repository'de specification contribution'ları açılmaz.

Gerekçe: Community Specification süreci, sıradan bir repository'ye bırakılacak
bir license file değil, governance ve IP framework'üdür. Public design review,
single-maintainer pre-draft'ın bir consensus process'ten geçtiğini varsaymadan
tezi test edebilir.

## ADR-038 — Yeni implementation çalışmaları için Node.js 24 hedeflensin

**Durum:** Kabul edildi

Referans uygulama Node.js 24 LTS üzerinde geliştirilsin ve yayımlansın. Node.js
22.14+ compatibility yalnızca Node 22 desteklendiği ve compatibility maliyeti
sıfıra yakın kaldığı sürece test edilsin. Eski seriyi korumak için polyfill,
alternate bundle veya dependency eklenmesin.

Gerekçe: 2026-07-31 tarihinde Node.js 24 güncel LTS, Node.js 22 ise eski LTS
serisidir. Yeni bir paket önceki baseline'da başlamak yerine maintenance window'u
optimize etmelidir. Node 22.14 geçerliliğini korur; çünkü npm trusted publishing
en az Node 22.14 ve npm 11.5.1 gerektirir.

## ADR-039 — Aşamalı trusted publishing ile release

**Durum:** Kabul edildi

npm paketi oluşturulduğunda, public GitHub repository'den GitHub-hosted runner
üzerinde npm trusted publishing aracılığıyla yayımlansın. Trusted publisher
`npm stage publish` ile sınırlandırılsın; maintainer, staged paketi 2FA ile review
edip onaylasın. Trusted publisher doğrulandıktan sonra traditional automation
token'ları devre dışı bırakılsın.

Release gate'leri:

- release runner'da npm 11.5.1+ ve Node.js 24,
- `preinstall`, `install`, `postinstall` veya implicit native build olmaması,
- package `files` allowlist'i ve `npm pack --dry-run` content review,
- packed tarball'dan clean-room install ve CLI smoke test,
- automatic npm provenance, SBOM, checksum'lar ve human-readable release note'lar,
- minimum `GITHUB_TOKEN` permission'ları ve untrusted code'un privileged checkout
  edilmemesi,
- her third-party action'ın full commit SHA'ya pinlenmesi ve workflow dosyalarının
  CODEOWNERS tarafından yönetilmesi,
- R5 öncesinde immutable release/tag ayarları ve OpenSSF Scorecard review.

Gerekçe: opaque veya token-published paketle dağıtılan provenance aracı kendi
trust argument'ını geçersiz kılar. Provenance source ile build'i bağlar; benign
behavior kanıtlamaz. Bu nedenle package-content review ve clean installation
ayrı gate'ler olarak kalır.

## ADR-040 — Export veya review UI ile değil, binding ile farklılaşma

**Durum:** Kabul edildi

Proje, mevcut eval export'ları ile release kararı arasındaki doğrulanabilir binding
olarak konumlandırılsın. Portable export'lar, annotation queue'ları, pairwise
screen'ler veya production label'ları benzersiz capability olarak sunulmasın:
Promptfoo, Label Studio, LangSmith ve Langfuse bu özelliklerin önemli sürümlerini
zaten belgelemektedir.

Farklılaştırıcı sözleşme şudur:

```text
artifact bytes + runtime + pre-registered protocol + assignment replay
  + append-only human review + frozen exclusions + decision digest
  -> independently verifiable evidence bundle
```

İlk integration proof Promptfoo import'udur; çünkü export'u zengin ve
taşınabilirdir. Label Studio JSON, reviewer coordination'ı zaten yöneten ekipler
için ikinci yararlı sınırdır. İki entegrasyon da required dependency olamaz.

## ADR-041 — Package ve executable adlarını ayırma

**Durum:** Kabul edildi

Executable adı `release-evidence` olarak kalsın. npm package name yalnızca R2
publication zamanında seçilsin; unscoped name kullanılabilir görünse bile scoped
olması MAY'dir. Website, schema'lar ve predicate type npm package name'e bağlı
olmaması MUST'tır.

2026-07-31 tarihinde yapılan point-in-time kontrollerde “Release Evidence Kit”
için exact GitHub repository sonucu bulunmadı; `release-evidence` ve
`release-evidence-kit` public npm sayfaları 404 yanıtı verdi. Bu bir reservation
veya legal clearance değildir. Public identity'leri oluşturmadan hemen önce
registry'ler yeniden kontrol edilsin ve trademark/domain review tamamlansın.