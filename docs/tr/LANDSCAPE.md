# Ekosistem Araştırması

> Bu belge, İngilizce [kaynak metnin](../LANDSCAPE.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farkında İngilizce metin geçerlidir.

Araştırma tarihi: 2026-07-31. Aşağıdaki iddialar, resmî dokümantasyonda veya proje
repository'lerinde doğrulanan özelliklerle sınırlıdır. “Belgelenmemiş” olması, bir
özelliğin özel olarak geliştirilemeyeceğini kanıtlamaz.

## Yöntem ve güven düzeyi

- Ürün capability'leri karşılaştırma blog'larında değil, resmî dokümantasyonda
  veya first-party repository'lerde kontrol edilmiştir.
- `Documented`, public workflow'un açıklandığı anlamına gelir; her pricing tier
  veya deployment'ın bunu desteklediğini garanti etmez.
- `Not documented`, incelenen kaynakların özelliği doğrulamadığı anlamına gelir.
  Özelliğin var olamayacağı veya özel olarak geliştirilemeyeceği iddiası değildir.
- Market survey'leri Capability Arena'ya ödeme isteğini değil, category pressure'ı
  doğrular. Consulting ve vendor survey'leri bu nitelikleriyle belirtilmiştir.
- Product page'ler hızla değişir. Implementation veya public positioning claim
  öncesinde matrisi yeniden kontrol edin.

## Özet

Artık birçok ürün iş akışının önemli bölümlerini kapsıyor. LangSmith pairwise
human queue, reviewer control, prompt commit, promotion ve rollback sunuyor.
Vellum release review, protected release tag ve approval history sunuyor.
Braintrust comparison'ları Git metadata'ya bağlıyor ve pairwise human choice'ları
yakalıyor.

Public dokümantasyonda bulunan daha dar boşluk, genel bir Git artifact ile ekibin
zaten kullandığı herhangi bir eval platformu arasındaki taşınabilir zincirdir:

```text
general Git artifact revision
  -> same task/model/runtime
  -> seeded identity-blind assignment
  -> human preference and rationale
  -> hash-verifiable frozen evidence
  -> approval bound to that evidence
  -> portable attestation
```

İncelenen hiçbir ürün bu exact cross-platform binding'i public olarak
belgelememektedir. Bu, yeni ve kapsamlı bir platform gerektiğinin kanıtı değil,
integration ve evidence-provenance fırsatıdır. Portable eval export tek başına
artık farklılaştırıcı değildir: Promptfoo export/import boyunca ID'leri,
timestamp'leri, author'ları, config'leri, result'ları, prompt'ları, runtime
option'larını, duration'ları, trace'leri ve isteğe bağlı embedded media'yı korur.
Eksik iddia daha dardır: bu byte'ların pre-registered blind protocol ve human
decision'a, Promptfoo veya herhangi bir producer dışında bağımsız doğrulanabilen
formatta bağlanıp bağlanamayacağı.

## 2026-07-31 publication yenilemesi

Güncel pazar, publication öncesinde üç positioning değişikliğini gerekli kılıyor:

1. **Review UI ile başlamayın.** LangSmith pairwise annotation queue'ları,
   Langfuse assigned annotation queue'ları ve protected production label'ları,
   Label Studio ise pairwise template ve JSON export'ları belgeliyor. Review
   ergonomisi beklenen ürün özelliğidir, kalıcı bir moat değildir.
2. **Yalnız portability ile başlamayın.** Promptfoo'nun güncel export/import yolu,
   optional embedded media dâhil somut biçimde taşınabilirdir. Label Studio da raw
   task ve annotation JSON export eder. Proje; deterministic cross-record binding,
   replayable assignment, frozen exclusion ve independently verifiable decision
   record ile başlamalıdır.
3. **Client'tan önce sözleşmeyi yayımlayın.** Mevcut platformlar daha derin, daha
   iyi fonlanmış ve release workflow'larına zaten entegredir. Yeni CLI ancak schema,
   requirement identifier, valid ve invalid vector ile tamamen elle oluşturulmuş
   bundle public olduktan sonra güven kazanır.

Publication araştırması repository baseline'ı da sıkılaştırdı:

- Node.js 24 güncel LTS serisidir; Node.js 22 LTS olarak kalmakla birlikte eski
  seridir. Yeni reference implementation geliştirmesi Node.js 24'ü hedefler;
  Node.js 22.14+ compatibility yalnızca dependency veya maintenance surface'i
  genişletmediği sürece test edilir.
- npm trusted publishing, npm 11.5.1+ ve Node.js 22.14+ gerektirir ve GitHub-hosted,
  GitLab.com shared veya CircleCI cloud runner'larını destekler. GitHub/GitLab
  trusted publishing, public repository'lerdeki public package'lar için otomatik
  olarak provenance üretir. Interactive 2FA approval ile stage-only publishing
  tercih edilen release yoludur.
- GitHub minimum token permission, third-party action'lar için full-length commit
  SHA pin, workflow'lar için CODEOWNERS protection ve untrusted pull-request
  code'unu checkout eden privileged workflow'lardan kaçınmayı önerir.
- OpenSSF passing criteria; public version-controlled repository, standard license
  location, contribution ve vulnerability-reporting process, unique release
  version, release note ve public test invocation gerektirir.
- Community Specification süreci yalnızca license-file seçimi değildir. Contributor
  agreement, dikkatle sınırlandırılmış scope, notice, licensing, governance,
  contribution process ve due-process/appeal rule'ları bekler. Bu paket dedicated
  specification repository'de bulunana kadar bu workspace yalnızca non-normative
  pre-draft design review olarak yayımlanabilir.

2026-07-31 tarihli exact-name kontrollerinde “Release Evidence Kit” ile eşleşen
GitHub repository bulunmadı; `release-evidence` ve `release-evidence-kit` public
npm sayfaları 404 döndürdü. Bunlar reservation veya trademark clearance değil,
point-in-time gözlemleridir. Publication'dan hemen önce iki registry'yi yeniden
kontrol edin ve trademark/domain review yapın.

Bu yenilemenin birincil kaynakları:

- https://www.promptfoo.dev/docs/usage/command-line/
- https://www.promptfoo.dev/docs/integrations/github-action/
- https://langfuse.com/docs/evaluation/evaluation-methods/annotation-queues
- https://langfuse.com/docs/prompt-management/features/prompt-version-control
- https://labelstud.io/guide/export
- https://nodejs.org/en/about/previous-releases
- https://docs.npmjs.com/trusted-publishers
- https://docs.github.com/en/actions/how-tos/security-for-github-actions/security-guides/security-hardening-for-github-actions
- https://www.bestpractices.dev/en/criteria/0
- https://github.com/CommunitySpecification/Community_Specification

## Pazar ihtiyacı

### Doğrulanmış baskı

- Stanford AI Index 2026, %88 organizational AI adoption bildirmektedir.
  Belgelenmiş AI incident'ları 2024'te 233'ten 2025'te 362'ye yükselirken
  responsible-AI benchmark reporting düzensiz kalmıştır.
- McKinsey'nin 2025 global survey'i 105 ülkeden 1.993 katılımcı içeriyordu. %88,
  en az bir function'da regular AI use bildirirken yaklaşık üçte ikisi
  organizasyonlarının enterprise-wide scaling'e başlamadığını söylüyor. AI
  kullanan organizasyonlardan katılanların %51'i en az bir negative consequence,
  yaklaşık üçte biri ise inaccuracy kaynaklı consequence bildiriyor.
- Deloitte'un dördüncü enterprise GenAI survey'i 14 ülkede AI deneyimli 2.773
  lideri kapsadı. %78 AI spending'in artmasını bekledi, %38 regulatory compliance'ı
  development/deployment barrier olarak adlandırdı ve %69 full governance
  implementation'ın bir yıldan uzun sürmesini bekledi. Bu, tüm işletmelerin
  random sample'ı değil, GenAI pilotu veya implementation'ı yürüten organizasyonlara
  yönelik consulting survey'dir.
- NIST AI RMF ve voluntary Playbook'u governance, documentation, TEVV, human
  oversight, monitoring ve continual improvement'ı açıkça kapsar.
- OpenAI task-specific continuous eval, human calibration ve subjective judgment
  için randomized blinded human test önerir. Human evaluation'ın yüksek kaliteli
  ancak yavaş ve pahalı olduğunu da belirtir. Anthropic de mümkün olduğunda
  automation, nuance maliyeti haklı çıkardığında human grading önerir.
- OpenAI GDPval (2025-09-25), bu ürünün yöntemi için mevcut en güçlü practice
  evidence'dır. Expert grader'lar model ve human deliverable'larını “not knowing
  which is AI versus human generated” biçiminde blind karşılaştırır; task author'lar
  consistency için rubric yazar ve OpenAI automated grader'ının “is not yet as
  reliable as expert graders, so we don't use it to replace them” olduğunu belirtir.

### Düzenleyici zaman çizelgesi (2026-07-30 tarihinde doğrulandı)

8 July 2026 tarihli Regulation (EU) 2026/1744, Digital Omnibus on AI, 24 July
2026'da OJ L 2026/1744'te yayımlandı ve yürürlüktedir. AI Act'i (Regulation (EU)
2024/1689) değiştirir ve burada en önemli tarihleri ileri taşır:

| Yükümlülük | Önceki tarih | Güncel tarih |
| --- | --- | --- |
| Chapter III Sections 1-3, Annex III high-risk (Art. 6(2)) | 2 Aug 2026 | 2 Dec 2027 |
| Chapter III Sections 1-3, product-embedded high-risk (Art. 6(1)) | 2 Aug 2027 | 2 Aug 2028 |
| Art. 50 transparency marking | 2 Aug 2026 | Değişmedi; hâlihazırda piyasadaki sistemler için 4 aylık geçişle |
| Art. 72(3) post-market monitoring template | Implementing act | 2 Sep 2027'ye kadar guidance |

Recital 40 gerekçeyi verir: geciken standard'lar, common specification'lar,
guidance ve national competent authority'ler. Omnibus ayrıca safety-component
tanımını daraltır (yeni Art. 6(1a)-(1c)), AI literacy yükümlülüğünü yumuşatır
(Art. 4), simplified quality management'ı tüm SME'lere genişletir (Art. 63(1)) ve
SME ile small mid-cap'ler için simplified technical documentation'a izin verir
(Art. 11(1)).

Bu projenin dayandığı öz değişmemiş, yalnızca ertelenmiştir: logging ve
record-keeping, human oversight, technical documentation ve deployer log retention
yaklaşık 16 ay sonra da vardır.

ISO/IEC 42001:2023 (AI management systems) ve ISO/IEC 42005:2025 (AI system impact
assessment), certification evidence yasal son tarihten değil auditor'lardan
istendiği için daha yakın dönemli audit hook olarak kalır. NIST, AI RMF 1.0'ın
revizyonda olduğunu belirtir; bu nedenle stable specification olarak
alıntılanmamalıdır.

Kaynaklar:

- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1744
- https://www.iso.org/standard/42001
- https://www.nist.gov/itl/ai-risk-management-framework

Not: third-party timeline tracker'lar yazım sırasında güncel değildi. Yaygın
alıntılanan artificialintelligenceact.eu implementation timeline hâlâ 2 August
2026 high-risk tarihini gösteriyordu ve son olarak 1 August 2024'te
güncellenmişti. Tarihleri tracker'lardan değil EUR-Lex'ten doğrulayın.

### Kanıtların ispatlamadığı şeyler

Evidence daha fazla AI kullanımı, daha fazla operational risk ve daha güçlü
evaluation ve governance beklentileri gösterir. Ayrı bir blind evidence ürününe
talebi doğrulamaz. Mevcut platform bütçeleri ihtiyacı karşılayabilir ve birçok
ekip repeated human study yerine automated grader'ı tercih edecektir. Benimseme
ve ödeme isteği bu nedenle implementation detail değil, ilk deneydir.

2026 omnibus bu riski küçültmez, büyütür. Ertelenen yükümlülükler ertelenen
compliance budget anlamına gelir. 2026'daki buyer'ın ertelemek için savunulabilir
bir gerekçesi vardır; bu nedenle near-term wedge statutory deadline değil,
internal release quality ve audit readiness olmalıdır. 2026 H2 ile 2027 H1'i
design-partner window olarak ele alın ve ilk gerçek purchasing pressure'ı 2
December 2027 tarihine yakın bekleyin.

Yöntemin counter-evidence'ı da kaydedilmelidir. Task ayrıntılı rubric'e
indirgenebildiğinde automated grader'lar human agreement'a yaklaşır; bu da blind
human study'lerin maliyetine değdiği alanı daraltır. Human review yavaş ve pahalı
olmaya devam eder; OpenAI ve Anthropic de savunulabilir her durumda automation
önerir.

Birincil kaynaklar:

- https://hai.stanford.edu/ai-index/2026-ai-index-report
- https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
- https://www.deloitte.com/us/en/about/press-room/state-of-generative-ai.html
- https://www.nist.gov/itl/ai-risk-management-framework
- https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook
- https://developers.openai.com/api/docs/guides/evaluation-best-practices
- https://openai.com/index/gdpval/
- https://platform.claude.com/docs/en/docs/test-and-evaluate/define-success
- https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability

## En yakın ürünler

### Promptfoo

- MIT, local-first CLI ve eval matrix.
- Promptfoo, MIT lisanslı kalırken OpenAI'ın parçası olduğunu duyurdu.
- Güçlü provider/test/assertion runner ve CI integration.
- Portable eval export/import, source identity ve execution context'in çoğunu
  korur; `--include-media` referenced media byte'larını gömerken secret'lar
  redacted edilir ve bazı local relationship'ler kasıtlı olarak yeniden kurulmaz.
- Basic self-host server SQLite kullanır, built-in auth yoktur, single replica'dır
  ve production team use için açıkça önerilmez.
- Manual output review vardır. Seeded blind human assignment study, reviewer
  protocol ve approval/promotion record belgelenmemiştir.

İsteğe bağlı runner/import integration olarak kullanın; provider sayısında
rekabet etmeyin.

Kaynaklar:
- https://www.promptfoo.dev/docs/configuration/guide/
- https://www.promptfoo.dev/docs/usage/self-hosting/
- https://github.com/promptfoo/promptfoo

### LangSmith

- Pairwise annotation queue'lar A/B/Equal decision, rubric, comment, reviewer
  reservation ve reviewer count ile Run A ve Run B gösterir.
- Programmatic pairwise evaluator'lar `randomize_order` destekler.
- Annotation queue'lar reservation, reviewer count ve assigned reviewer destekler.
  İncelenen human pairwise queue dokümantasyonu experiment identity'nin gizli
  olduğunu veya A/B side order'ın randomized olduğunu belirtmez.
- Prompt commit'leri staging veya production'a promote edilebilir; environment
  history rollback destekler ve owner-only mode promotion'ı kısıtlayabilir.
- Azure üzerinde self-hosting; PostgreSQL, Redis, ClickHouse ve Blob Storage ile
  AKS üzerinde enterprise deployment için belgelenmiştir.
- Frozen human evidence snapshot veya general Git folder'a bağlı promotion
  belgelenmemiştir.

Bu, en yakın commercial workflow competitor'dır.

Kaynaklar:
- https://docs.langchain.com/langsmith/annotation-queues
- https://docs.langchain.com/langsmith/evaluate-pairwise
- https://docs.langchain.com/langsmith/azure-self-hosted

### Braintrust

- Comparative experiment'lar matching test case'leri hizalar ve delta hesaplar.
- Pairwise card Base veya Comparison preference ve optional comment kaydeder.
- Aggregate win/loss ve export kullanılabilir.
- Base/Comparison identity açıktır; blind identity ve side randomization
  belgelenmemiştir.
- Baseline Git branch/commit metadata'yı izleyebilir ve CI comparison'ları
  belgelenmiştir.
- SDK Apache-2.0'dır; complete platform commercial'dır.

Kaynak:
- https://www.braintrust.dev/docs/evaluate/compare-experiments
- https://github.com/braintrustdata/braintrust-sdk-javascript

### Langfuse

- Self-hosting ve official Azure Terraform deployment ile MIT core.
- Versioned prompt, label, diff, rollback, versioned dataset, experiment, manual
  score, comment, assigned annotation queue ve keyboard-driven queue processing.
- Protected prompt label'ları production-label change'lerini role göre kısıtlar;
  ancak admin ve owner bu label'ları yine de taşıyabilir veya silebilir. Bu,
  immutable release evidence değil release access control'dür.
- Historical dataset version'ları, daha sonra update veya delete edilen item'lar
  dâhil tekrar çalıştırılabilir; schema revision dataset versioning'in parçası
  değildir.
- Experiment compare view annotation sırasında full context'i korur.
- Blind randomized pairwise human study protocol belgelenmemiştir.

İsteğe bağlı tracing/prompt metadata export target olarak kullanın.

Kaynaklar:
- https://langfuse.com/docs/evaluation/experiments
- https://langfuse.com/docs/evaluation/evaluation-methods/annotation
- https://langfuse.com/docs/prompt-management/features/prompt-version-control
- https://langfuse.com/self-hosting/deployment/azure

### Opik

- Backend ve web application dâhil Apache-2.0 full platform.
- Güçlü self-hosted tracing, dataset, experiment, prompt management, evaluation,
  annotation ve optimization.
- Docker ve Kubernetes deployment belgelenmiştir.
- Evidence promotion içeren human identity-blind randomized pairwise study
  belgelenmemiştir.

En iyi open-source observability integration candidate'ıdır; fork edilecek
foundation değildir.

Kaynak:
- https://github.com/comet-ml/opik

### Vellum

- Prompt ve workflow deployment'larının environment-scoped release history'si
  vardır ve environment'lar arasında promote edilebilir.
- Release Reviews; named review request, comment, approve/request changes ve
  review history destekler.
- Protected release tag'leri en az bir approval ve outstanding change request
  olmamasını gerektirir; bu premium özelliktir.
- Evidence'a bağlı blind randomized pairwise human output study ve approval
  belgelenmemiştir.

Vellum incelenenler içinde en yakın release-governance competitor'dır. Release
Evidence Kit, prompt/workflow deployment system'ı ile rekabet etmemelidir.

Kaynaklar:
- https://docs.vellum.ai/product/deployments/release-reviews.md
- https://docs.vellum.ai/product/deployments/environments.md

## Capability matrisi

`Yes`, public olarak belgelenmiş demektir. `Partial`, yakın bir özelliğin var
olduğu ancak column'ın tamamını doğrulamadığı anlamına gelir. `ND`, incelenen
kaynaklarda belgelenmediği anlamına gelir.

| Ürün | Human pairwise | Blind/random order | Reviewer workflow | Version/provenance | Evidence gate | Approval/promotion | Local/self-host |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Promptfoo | Manual review, study değil | ND | ND | Config/results export: partial | CI threshold'ları: partial | ND | Yes; basic server production için değil |
| LangSmith | Yes | Programmatic random order; human queue blinding ND | Yes | Prompt commit ve experiment | Frozen evidence gate ND | Prompt promote/rollback | Enterprise self-host |
| Braintrust | Yes | Explicit Base/Comparison | ND | Git metadata ve experiment baseline | CI comparison: partial | Environment deploy: partial | Enterprise |
| Langfuse | Manual compare scoring | ND | Annotation queue'ları | Prompt ve dataset version'ları | Protected label: partial | Label promotion: partial | MIT core self-host |
| Opik | Human annotation; pairwise ND | ND | Annotation queue var; pairwise ND | Dataset/experiment/prompt | Online rule: partial | ND | Apache-2.0 full self-host |
| Vellum | Qualitative review; blind pairwise ND | ND | Release reviewer'ları | Prompt/workflow release history | Protected release tag | Yes | Commercial deployment option'ları |
| Label Studio | Yes | Side randomization ND | Assignment/review control'leri | General Git artifact ND | Export: partial | Yalnızca annotation accept/reject | Apache-2.0 self-host |
| Argilla | Ranking question | ND | Task distribution | Dataset metadata | Dataset setting: partial | ND | Apache-2.0; yalnız maintenance |
| Phoenix | Human annotation; pairwise ND | ND | ND | Versioned prompt/dataset | ND | ND | ELv2 self-host |
| W&B Weave | Structured human annotation | Pairwise ND | ND | Versioned scorer object | Feedback silinebilir | ND | Commercial self-managed |

Matris overlay strategy'yi destekler: her satır yararlı execution, storage veya
collaboration primitive'lerine zaten sahiptir; hiçbirinin public dokümantasyonu
tam portable evidence binding'i doğrulamaz.

## Annotation komşuları

### Label Studio

- Apache-2.0, local Docker/pip ve PostgreSQL deployment.
- Official side-by-side LLM template, iki answer üzerinde `Pairwise` kullanır.
- Esnek UI ve export format'ları. Raw JSON; task data, annotation ID, timestamp ve
  `completed_by` içerir. Export'lar portable annotation record'dur; ancak Git
  artifact, assignment protocol ve decision'ı cryptographic olarak bağlamaz.
- Assignment randomization, capability provenance, experiment freezing ve
  promotion gate'leri bunun dışında geliştirilmelidir.

Kaynak:
- https://labelstud.io/templates/llm_side_by_side
- https://github.com/HumanSignal/label-studio

### Argilla

- Instruction, response1, response2 ve `RankingQuestion` içeren Apache-2.0
  ranking dataset template.
- İyi preference dataset workflow ve self-hosting.
- Maintainer'lar yeni feature development'ın durduğunu; bug fix ve patch'lerin
  devam ettiğini belirtiyor.
- Randomized blind study ve artifact promotion belgelenmemiştir.

Kaynak:
- https://docs.argilla.io/latest/reference/argilla/settings/settings/
- https://github.com/argilla-io/argilla

## Diğer evaluation komşuları

- OpenAI Evals repository: MIT runner/registry; dataset rights yine de kontrol
  edilmelidir; human study UI yoktur. Ayrı hosted Evals platformu 2026-10-31'de
  read-only olur ve 2026-11-30'da kapanması planlanır. OpenAI, Promptfoo'yu
  migration path olarak belgeler.
- DeepEval: Apache-2.0 test/evaluator library; human A/B control plane yoktur.
- Giskard: Apache-2.0 agent testing/security; human preference workflow yoktur.
- Phoenix: geniş tracing/eval/prompt platformu; ancak Elastic License 2.0 OSI
  open source değildir ve proje için core dependency olmaya uygun değildir.
- W&B Weave: commercial/shared backend'li Apache SDK; güçlü versioned object,
  structured human annotation ve deletable feedback; belgelenmiş blind study
  chain yoktur.
- Galileo: session/trace/span üzerinde annotation; Annotation Queues Enterprise
  Beta'dır. Blind pairwise release evidence belgelenmemiştir.
- Parea: experiment, DVC workspace capture, manual annotation correlation ve CI
  assertion. Blind pairwise approval belgelenmemiştir.
- Patronus: trace, experiment ve evaluation genelinde explanation içeren structured
  human annotation. Blind pairwise promotion belgelenmemiştir.
- Humanloop: ekip Anthropic'e katılmıştır ve platform kapanmaktadır; viable
  product dependency değildir.

## Küçük “arena” projeleri

`llm arena evaluation`, `human preference llm evaluation` ve
`prompt ab testing llm` için yapılan GitHub aramaları bu kapsama uyan established
reusable framework döndürmedi. Küçük `elementshq/jury-arena` projesi human blind
feedback ve promotion governance'a değil LLM-as-a-judge'a odaklanır.

## Geliştirme ve entegrasyon ayrımı

Geliştirilecekler:

- deterministic artifact archive/hash ve Git metadata,
- portable study ve evidence schema'ları,
- seeded opaque assignment'lar,
- identity blinding,
- human feedback contract,
- frozen evidence manifest,
- decision record ve optional attestation.

Entegre edilecekler:

- Promptfoo veya custom runner'lar,
- OpenTelemetry/OpenInference,
- Opik/Langfuse/Phoenix trace export,
- Label Studio import/export,
- provider SDK'ları,
- external object store'lar.

Design partner'lar mevcut ürünün bu sorumluluğu taşıyamadığını kanıtlayana kadar
general trace backend, provider matrix, team annotation system, prompt editor,
deployment environment manager veya policy administration UI geliştirmeyin.

## Pazar girişi ve benimseme riski

En iyi initial customer profile:

- 20-200 kişilik quality-sensitive AI platform ekibi,
- Git-managed prompt, agent instruction, tool-policy, RAG configuration veya
  workflow için weekly veya monthly release,
- değiştirmek istemedikleri mevcut eval/trace platformu,
- domain reviewer'lar ve named release owner,
- audit, data-locality veya vendor-portability pressure.

Buyer AI platform veya engineering leader'dır; risk/model-governance çoğu zaman
co-buyer'dır. Reviewer ve capability author kullanıcıdır, mutlaka buyer değildir.

Başlıca adoption risk'leri:

- human review pahalıdır ve bottleneck olur,
- mature platform'lar dataset, identity ve release history'ye zaten sahiptir,
- ikinci UI ve control plane switching ve integration cost'u artırır,
- local-first deployment privacy'yi çözer, reviewer coordination'ı çözmez,
- ekipler rigorous study yerine LLM-as-judge ve spot check'i kabul edebilir.

Bu nedenle ürün önce output import etmeli, tüm evidence'ı export etmeli, migration
gerektirmemeli ve bir gün içinde gerçek release decision üzerinde değerini
kanıtlamalıdır.

## Karmaşıklık-fayda değerlendirmesi

Score'lar yön göstericidir: 1 düşük, 5 yüksektir. Ratio `benefit / complexity`
olarak hesaplanır ve financial forecast için değil validation work'ü sıralamak
için kullanılır.

| Bileşen | Fayda | Karmaşıklık | Oran | Doğrulama kararı |
| --- | ---: | ---: | ---: | --- |
| Artifact archive/hash + Git metadata | 5 | 2 | 2.50 | Şimdi geliştir |
| Blind balanced pairwise page | 5 | 3 | 1.67 | Şimdi geliştir |
| Rationale ve rubric tag'leri | 5 | 1 | 5.00 | Şimdi geliştir |
| Frozen evidence manifest | 5 | 2 | 2.50 | Şimdi geliştir |
| Approve/reject manifest | 4 | 1 | 4.00 | Şimdi geliştir |
| Generic importer + Promptfoo importer | 5 | 2 | 2.50 | Şimdi geliştir |
| General content-addressed store | 2 | 4 | 0.50 | Ertele; bundle içine kopyala |
| SQLite relational control plane | 2 | 3 | 0.67 | Ertele; önce JSON/JSONL |
| Fastify management API | 2 | 4 | 0.50 | Ertele; yalnız loopback review |
| Control-plane GUI | 1 | 5 | 0.20 | Ertele |
| Statistical eligibility gate | 2 | 4 | 0.50 | Önce descriptive; sample'ları validate et |
| OIDC ve reviewer reservation | 2 | 5 | 0.40 | Coordination pilot'ları engelleyene kadar ertele |
| PostgreSQL/Azure/public collector | 1 | 5 | 0.20 | Kapsam dışı; onun yerine entegre et |

İlk vertical slice, beş high-value primitive'i değeri yalnızca repeat team
adoption sonrasında görülen bazı platform investment'larıyla birleştirir.
Validation version; self-contained directory/tar bundle, append-only JSONL review,
loopback page, deterministic hashing ve Git-tracked decision kullanmalıdır. Bu,
control plane maliyetini önden ödemeden farklılaştırıcı davranışı sınar.

## Open-source benimseme gerçekliği

Category metric'leri 2026-07-30 tarihinde GitHub ve registry API'larından
toplandı. Star count ilgiyi ölçer, kullanımı değil; download count CI ve bot
traffic içerir. Recent commit volume en yararlı maintenance signal'dır.

| Proje | Star | Son commit | 90 gündeki commit | Destek |
| --- | ---: | --- | ---: | --- |
| langfuse | 32.2k | 2026-07-30 | 1,402 | Şirket |
| label-studio | 28.0k | 2026-07-30 | 117 | Şirket |
| promptfoo | 23.8k | 2026-07-30 | 908 | Şirket, artık OpenAI'ın parçası |
| opik | 21.0k | 2026-07-30 | 947 | Şirket |
| openai/evals | 19.1k | 2026-04-14 | 0 | Şirket, atıl |
| deepeval | 17.3k | 2026-07-28 | 594 | Şirket |
| ragas | 15.1k | 2026-02-24 | 0 | Devredildi, atıl |
| phoenix | 10.8k | 2026-07-30 | 1,003 | Şirket, ELv2 |
| argilla | 5.1k | 2025-08-05 | 0 | Şirket, durakladı |

Üç sonuç çıkar.

Birincisi, bu kategoride beş bin star'ın üzerindeki her proje şirket desteklidir.
Bağlantısız single-maintainer proje bu seviyede görünmez. Liderler solo
maintainer'ın eşleşemeyeceği commit volume'u sürdürür.

İkincisi, human-in-the-loop tooling en zayıf alt segmenttir. Argilla 5.1k star ile
duraklamış; Label Studio ise 28k star'a rağmen mütevazı maintenance volume
göstermiştir. Human review tooling, sürekli kullanımdan daha kolay ilgi çeker.

Üçüncüsü, dormancy baskın failure mode'dur. Argilla, ragas ve openai/evals geniş
kitlelere ve yakın zamanda commit yapılmamış repository'lere sahiptir. Solo
maintainer için gerçekçi risk kimsenin aracı kullanmaması değil, birkaç ekibin
bağımlı olması ve ardından projenin terk edilmesidir.

### Provenance ve attestation araçlarından ders

Portable evidence bundle'a en yakın başarılı analogue software supply chain
attestation'dır. Orada yayılan şey standalone client değil, format ve platform
integration olmuştur:

- in-toto predicate'leri, SLSA level'ları ve SPDX veya CycloneDX document'ları
  interoperable layer olmuştur; cosign ve `gh attestation verify` birbirinin
  yerine kullanılabilen client'lardır.
- npm provenance ve GitHub artifact attestation ayrı tool install gerektirmediği
  için benimsenmiştir.
- Verification, production kadar önemliydi. `npm audit signatures` ve
  `gh attestation verify`, consumer'lara önemsemeleri için neden verdi.
- Benimseme, özellikle September 2025 npm worm incident gibi forcing event ile
  Cyber Resilience Act gibi regulatory pressure birleştiğinde hızlandı.

Buraya uygulandığında: kimsenin doğrulamak için nedeni olmayan evidence bundle
yalnızca JSON file'dır. Savunulabilir asset, başka araçların üretip tüketebildiği,
CI üzerinden dağıtılan documented predicate ve verification story'dir; yeni CLI
kurulumu değildir.

Yakın AI standard çalışmaları vardır, ancak bu boşluğu kapsamaz. OpenSSF Model
Signing model artifact'larını, CoSAI workstream 1 AI supply chain'i, MLCommons
AILuminate automated safety benchmarking'i ele alır. Hiçbiri human-judgment
release evidence predicate tanımlamaz.

### Güven ve benimseme tahmini

Post-incident supply chain ortamında yeni npm CLI yayımlayan bağımsız maintainer
için gerçekçi 12 aylık sonuç yaklaşık 100 ila 700 star, tek haneli ila düşük çift
haneli gerçek ekip ve sıfıra yakın sürekli dış contributor'dır. GitHub Action ile
dağıtım en zor engeli, yani enterprise'ı bilinmeyen CLI kurmaya ikna etme
gereksinimini ortadan kaldırır.

Herhangi bir public release öncesinde minimum trust baseline: provenance ile npm
trusted publishing, install script olmaması, telemetry olmaması, core path'te
network call olmaması, küçük ve denetlenebilir dependency tree, NOTICE ile
Apache-2.0, SECURITY.md, published SBOM ve bus factor'ı dürüstçe belirterek
maintenance durduğunda bundle'ların okunabilir kalacağı exit plan'ı belgeleyen
governance file.

## Lisans etkileri

- Release Evidence Kit: Apache-2.0.
- Güvenli optional integration target'ları: notice ve patent term'leri korunarak
  Apache-2.0 ve MIT API/SDK'ları.
- ELv2 kısıtlamaları nedeniyle Phoenix server code kopyalamayın.
- OpenAI Evals ile bundle edilen dataset'lerin code license'ı paylaştığını
  varsaymayın.
- Commercial control plane'e hard dependency oluşturmaktan kaçının.

## Konumlandırma

Önerilen açıklama:

> Git ile yönetilen AI capability'leri için taşınabilir blind release evidence.

Genişletilmiş açıklama:

> Release Evidence Kit, mevcut eval stack'inizden gelen çıktıları prompt, skill,
> agent, toolset, RAG ve workflow'lar için blind, reproducible review ve
> hash-verifiable approval bundle'a dönüştürür.

Farklılaştırıcı unsur provider breadth, tracing volume, prompt management,
deployment veya generic labeling değil cross-platform evidence binding'dir.

## Sonuç

Geliştirin; ancak platform olarak değil, ince bir referans uygulamaya sahip
specification olarak ve adoption expectation'ları buna göre belirlenmiş biçimde.

Yöntem geçerlidir ve frontier lab'lar tarafından tam olarak bu judgment sınıfı
için kullanılır. Portable, verifiable, cross-tool human release evidence alanındaki
boşluk gerçektir. Eksik olan demand pressure'dır: evidence çalışmasını zorunlu
kılacak AI Act yükümlülükleri December 2027 ve August 2028'e taşınmıştır ve
kategori solo maintainer'ın ürün geliştirmede geçemeyeceği iyi fonlanmış
platformlara aittir.

4-8 haftalık overlay-first prototype ile ilerleyin. Control plane geliştirmeyin.
Bundle schema'yı birincil artifact olarak yayımlayın; küçük CLI, bağımsız verifier
ve GitHub Action'ı referans producer ve consumer olarak sunun; mevcut eval
araçlarıyla rekabet etmek yerine bunlar için importer ekleyin.

Yalnızca maintainer dışındaki en az bir ekip workflow'u tekrarladığında, blind
evidence gerçek release decision'ı değiştirdiğinde veya somut biçimde
iyileştirdiğinde, setup 15 dakikanın altında kaldığında, her bundle independently
verify edildiğinde ve independent verifier yayımlanan vector'ları geçtiğinde
active development'a devam edin. Aksi durumda specification'ı dondurun,
vector'ları yayımlanmış tutun ve durun.

Başarıyı star ile değil, bundle üretip doğrulayan repository sayısıyla ölçün.
Proje monthly release sürdüremiyorsa başkaları üzerine geliştirme yapmadan önce
bunu repository'de belirtin.