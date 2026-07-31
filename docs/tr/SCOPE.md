# Kapsam ve Hedef Dışı Konular

> Bu belge, İngilizce [kaynak metnin](../SCOPE.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

## Problem

Ekipler prompt'ları, agent instruction'larını, skill'leri, toolset'leri ve
workflow dosyalarını sık sık değiştirir; ancak bir değişikliği promotion kararı
çoğu zaman birkaç manual example'a, automated score'a veya reviewer intuition'a
dayanır. Mevcut evaluation araçları test çalıştırabilir, human label toplayabilir
ve bazı durumlarda prompt version'larını promote edebilir. Daha dar kapsamlı ve
çözülmemiş sorun portability ve binding'dir: evidence çoğu zaman bir Git artifact,
case set, runtime declaration, blind human feedback, exclusion, analysis ve
approval'ın bunları üreten platform dışında birlikte doğrulanmasını sağlayacak
biçimde paketlenmez.

Release Evidence Kit bu decision boundary için bir overlay'dir; kullanımda olan
runner, trace store, annotation platform veya deployment system'ın yerine geçmez.

## Proje tezi

Format yalnızca benimseyen için aşağıdakilerin tümü doğru olduğunda tanımlanmaya
değerdir:

- capability change'leri Git'te saklanır ve tekrar tekrar release edilir,
- output quality, deterministic test'lerin çözemediği judgment'lar içerir,
- reviewer'ların çıktıyı hangi revision'ın ürettiğini bilmemesi gerekir,
- release owner, tool veya vendor değişikliklerinden sonra da geçerli evidence'a
  ihtiyaç duyar,
- yanlış release'in maliyeti structured review maliyetinden yüksektir.

Teslimat bir review UI veya servis değil, taşınabilir evidence format'tır. Bundle;
input ve output digest'lerini, assignment protocol'ü, review'ları, exclusion'ları,
analysis version'ı ve human decision'ı bağlar. Bu projenin yazmadığı araçlar dâhil
her araç bu kayıtları üretebilir veya tüketebilir.

## Kimin için

Benimseyen profili:

- yaklaşık 20-200 kişilik AI platform veya product ekibi,
- haftalık veya aylık prompt, agent, tool-policy, RAG veya workflow release'leri,
- değişiklik kaynağı olarak Git ve en az bir mevcut eval veya trace aracı,
- quality-sensitive veya regulated use case'ler,
- adı belirlenmiş release owner ve domain reviewer'lara erişim.

Güçlü ilk use case'ler customer-support agent'ları, internal copilot'lar, legal
veya compliance writing ve agent tool-policy change'leridir. Solo developer,
seyrek değişen prompt veya güvenilir code-based grading içeren task kötü uyumdur;
çünkü review overhead beklenen risk azaltımını aşar. Ayrıntılı rubric'e
indirgenebilen task da zayıf uyumdur; çünkü automated grader'lar bu durumda human
agreement'a yaklaşır.

Satılacak bir şey olmadığı için buyer yoktur. Geçerli soru, bir ekibin tarifi
istenmeden iki kez çalıştırıp çalıştırmayacağıdır.

## Neden şimdi ve kanıtlanmamış olanlar

Güncel evidence, ayrı bir araca olan talebi değil kategori ihtiyacını destekler:

- Stanford AI Index 2026, %88 organizational AI adoption ve 2024'teki 233'ten
  2025'te 362'ye çıkan belgelenmiş AI incident bildirir.
- McKinsey'nin 2025'te 1.993 katılımcıyla yaptığı araştırma %88 regular AI use
  bildirirken organizasyonların yaklaşık üçte ikisi enterprise scaling'e
  başlamamıştır; AI kullanan organizasyonların %51'i en az bir negative consequence
  bildirmektedir.
- NIST AI RMF ve Playbook'u governance, documentation, TEVV, human oversight,
  monitoring ve change management'ı vurgular.
- OpenAI, task-specific continuous evaluation, human feedback'e göre calibration
  ve subjective quality için randomized blinded human test'leri önerir.
- OpenAI'ın GDPval'i (2025-09-25) tam olarak bu yöntemi uygular: expert grader'lar
  hangisinin hangisi olduğunu bilmeden model ve human deliverable'larını blind
  olarak karşılaştırır, task author'lar rubric sağlar ve OpenAI automated
  grader'ının expert grader'ların yerini alacak kadar güvenilir olmadığını belirtir.
  Bu, ayrı bir araca yönelik talebi değil yöntemi doğrular.
- OpenAI'ın hosted Evals platformunun 2026-10-31 tarihinde read-only olması ve
  2026-11-30 tarihinde kapanması planlanmakta; Promptfoo bir migration path olarak
  belgelenmektedir. Bu, proje için talep kanıtı değil platform volatility ve
  portability işaretidir.

Zamanlama compliance odaklı bir wedge'in aleyhine değişmiştir. 2026-07-24'te
yayımlanan Digital Omnibus on AI, Regulation (EU) 2026/1744; AI Act Chapter III
high-risk yükümlülüklerini Annex III sistemleri için 2 December 2027'ye,
product-embedded sistemler için 2 August 2028'e erteler. Logging, human oversight
ve documentation yükümlülükleri değişmeden kalır; ancak bütçeyi zorlayacak son
tarih önceki plana göre yaklaşık 16 ay sonradır. 2026 H2 ile 2027 H1 dönemini
design-partner window olarak ele alın ve sales case'i yasal aciliyet üzerine
kurmayın. ISO/IEC 42001 ve 42005 certification evidence daha yakın dönemli
dayanaktır.

Bu kaynaklar büyüyen evaluation ve governance problemini gösterir. Ekiplerin ayrı
bir evidence layer benimseyeceğini göstermez. İnce bir referans uygulamayla
specification yayımlamak, yalnızca ölçekte karşılığını veren altyapıya girişmeden
bunu sınamanın en ucuz yoludur.

Kaynaklar ve rekabet değerlendirmesi `LANDSCAPE.md` içinde tutulur.

## Formatın yanıtlaması gerekenler

Baseline artifact, candidate artifact ve frozen case set verildiğinde conforming
bundle şu soruları yanıtlar:

1. İki revision da aynı declared runtime condition'larda mı değerlendirildi?
2. Reviewer'lara balanced ordering ile identity-blind output'lar mı gösterildi?
3. Reviewer'lar neyi, neden tercih etti?
4. Exclusion'lar, analysis version ve stated limitation'lar nelerdi?
5. Kararı kim ve tam olarak hangi evidence digest'e göre kaydetti?

Yanıtın çalışan bir sunucu ve network erişimi olmadan offline doğrulanabilmesi
MUST'tır. Projenin bu garantiyi korumak için execution, identity, storage veya
deployment'a sahip olması gerekmez.

## Birincil kullanıcılar

### Release owner

Protocol'ü dondurur, reviewer'ları seçer, exclusion'ları inceler ve decision'ı
kaydeder. Yeni control plane benimsemeden auditability ve reproducibility ister.

### Capability author

Candidate snapshot oluşturur, mevcut eval runner'dan case output'larını içe
aktarır, regression'ları inceler ve study açar. Git-native CLI ve hızlı local
loop ister.

### Reviewer

Candidate identity'yi görmeden output'ları karşılaştırır, preference ve rationale
bırakır ve atanan işi verimli biçimde tamamlar.

### Auditor veya risk owner

Modeli yeniden çalıştırmadan frozen study input'larını, exclusion'ları, analysis
version'ları ve decision record'ları inceler.

## Temel işler

- Bir file veya folder'dan immutable capability artifact snapshot'ı oluşturma.
- Versioned case dataset'i dondurma.
- Mevcut provenance ile baseline/candidate output'larını içe aktarma.
- Study protocol ve deterministic assignment plan oluşturma.
- Pairwise human preference, tie, rationale, tag ve correction toplama.
- Descriptive metric ve limitation'larla evidence snapshot'ı dondurma.
- Deployment tetiklemeden açık ve named human decision kaydetme.
- Reproducible study bundle ve preference dataset export etme.

## Capability modeli

Capability, metadata ile birlikte immutable artifact'tır. `prompt`, `skill`,
`agent`, `toolset`, `rag` ve `workflow` ayrı domain subclass'ları değil,
label'lardır. Core, output'ları ve evidence'ı değerlendirir; integration'lar
artifact'ın nasıl yürütüleceğine karar verir.

## Study modları

### v0.1: pairwise

İki arm, identity-blind A/B presentation, equal/tie desteği, rationale, tag ve
balanced side assignment.

### Olası sonraki sürüm: ranking

Balanced incomplete-block pairwise task kullanan üç ila sekiz arm. Reviewer'lardan
hiçbir zaman tüm arm'ları tek ekranda sıralamaları istenmez. Bu planlanmış çalışma
değildir; predicate design'ın yanlışlıkla bunu engellememesi için kaydedilmiştir.
Extension yerine yeni predicate major version gerektirebilir.

## Reviewer modları

Kapsamda:

- Local owner ve reviewer: yalnızca loopback, authentication yok.
- Shared bundle: reviewer bir bundle alır, offline review yapar ve owner'ın digest
  ile birleştirip doğruladığı append-only review log'u geri verir.

Kapsam dışında: OIDC identity, invite token, anonymous public participation ve
her tür reviewer coordination service. Koordineli multi-reviewer workflow'a
ihtiyaç duyan ekipler mevcut annotation platformunu kullanmalı ve çıktısını içe
aktarmalıdır.

## Kanıt yaklaşımı

Analiz betimseldir. Format count'ları, position balance'ı ve stated limitation'ları
raporlar. v0.1'de eligibility verdict, confidence interval veya pass/fail gate
üretmez; çünkü calibrated sample size olmadan statistical claim yayımlamak bu
projenin yapabileceği en zararlı şey olacaktır.

Policy evaluation benimseyene aittir. Policy uygulandığında digest'i decision
attestation'a kaydedilir ve policy'nin monotonik ifade edilebilmesi MUST'tır: bir
attestation'ı yok saymak hiçbir zaman denial'ı approval'a dönüştürmemelidir.

Adı belirtilmiş bir kişi decision'ı kaydeder. Formattaki hiçbir şey onay veremez.

## Hedef dışı konular

- Ürün, hosted service veya platform olmak.
- Model çalıştırmak ya da provider'ları gateway arkasında barındırmak.
- Promptfoo, Opik, Langfuse, LangSmith, Braintrust veya Label Studio'nun yerine
  geçmek.
- Production trace volume depolamak.
- Prompt, environment, release veya deployment yönetmek.
- Identity, access control veya reviewer coordination sağlamak.
- Capability artifact'larını otomatik olarak yeniden yazmak veya deploy etmek.
- Keyfî veya remote shell execution.
- Küçük veya self-selected sample'lardan statistical certainty iddia etmek.
- Herhangi bir tür telemetry toplamak.

## Repository ve lisanslama sınırı

Lisanslar ve kullanım biçimleri farklı olduğu için iki repository:

- Specification ve conformance vector'ları. Specification text Community
  Specification License 1.0 altında, vector'lar submodule olarak vendor
  edilebilmeleri için permissive license altındadır. Specification'ı code'dan
  ayırmak belgelenmiş Community Specification uygulamasıdır ve burada önemlidir;
  çünkü specification license'ları tüm belgenin independent implementation'ları
  için hak verirken code license'ları contribution kapsamında hak verir.
- Reference implementation, CLI ve GitHub Action, Apache-2.0 altındadır.

Hiçbir optional hosted component, bundle üretmek veya doğrulamak için gerekli
olamaz.

Specification'ı bir foundation'a bağışlamak şu anda mümkün değildir. OpenSSF
project entry, en az iki organizasyondan en az üç maintainer gerektirir;
single-maintainer proje bunu karşılayamaz. Community Specification governance
text, specification'ı daha sonra başka bir standards organization'a sunma
mekanizmasını zaten içerir; dolayısıyla şimdi bunu seçmek, bugün kullanılabilir
olduğunu varsaymadan bu path'i açık tutar.

## Proje metrikleri

- Clone'dan ilk verified bundle'a kadar geçen süre.
- Yalnızca export edilen dosyalardan offline doğrulanan bundle yüzdesi.
- Bundle üreten repository sayısı.
- Independent implementation veya integration sayısı.
- Bilinen her implementation için conformance vector pass rate.
- Blind evidence sayesinde değiştirilen, engellenen veya daha iyi belgelenen
  decision'lar.
- İstenmeden tarifi ikinci kez çalıştıran ekipler.

Stars ve download count'lar açıkça başarı ölçüsü olarak izlenmez. Bu kategoride
gerçek kullanımdan çok büyük oranlarda saparlar ve bunları optimize etmek benzer
projelerde abandonment öncesinde görülmüştür.

## Teslimat sırası

Throwaway spike dışında implementation code yazmadan önce:

1. Üç prospective adopter ile son iki gerçek release decision'larını kullanarak
   görüşün ve eksik evidence chain'i yeniden kurun.
2. Format draft'ı dondurun ve example bundle'lar ile conformance vector'larını
   yayımlayın.
3. Output'ları içe aktaran ve self-contained, verifiable bundle yazan CLI ile
   loopback review page sunun.
4. Producer ile code paylaşmayan bağımsız verifier yazın.
5. Özellik eklemeden adopter başına en az iki gerçek decision çalıştırın.

## Devam ve arşivleme

Yalnızca aşağıdaki durumlarda etkin geliştirmeye devam edin:

- setup 15 dakikanın altındadır,
- maintainer dışındaki en az bir ekip tekrar tekrar bundle üretir,
- blind evidence nedeniyle en az bir decision değiştirilir, engellenir veya
  somut biçimde daha iyi belgelenir,
- tamamlanan her bundle sunucu olmadan bağımsız doğrulanır,
- bağımsız verifier yayımlanmış vector'ları geçer.

Bunlar başarısız olursa çalışmayı kurtarmak için ürüne pivot etmeyin.
Specification'ı güncel version'da dondurun, machine-readable project status
vocabulary ile repository status'u dürüstçe işaretleyin, vector'ları ve example
bundle'ları yayımlanmış tutun ve bundle'ların okumak için araç gerektirmeyen düz
dosyalar olarak kaldığını belirtin.

Governance dosyasının bus factor'ı belirtmesi ve successor path adlandırması
MUST'tır; böylece bakımı yapılmayan specification yine de fork edilip devam
ettirilebilir. Abandonment bu kategorideki bu boyuttaki projelerin en yaygın
sonucudur; bu nedenle inkâr edilmez, planlanır.