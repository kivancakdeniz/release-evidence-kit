> Bu belge, [İngilizce kaynağın](PUBLICATION-CHECKLIST.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farklılığı durumunda İngilizce metin geçerlidir.

# Yayın Checklist'i

İnceleme tarihi: 2026-07-31

Bu checklist, workspace'te mevcut olanları yalnızca public depo kimlikleri oluşturulduğunda tamamlanabilecek ayarlardan ve hukuki kontrollerden ayırır.

## P0 public pre-draft

| Kapı | Durum | Kanıt veya sonraki eylem |
| --- | --- | --- |
| Pre-draft durumu açıkça belirtilmiş | Ready | [PROJECT-STATUS.md](PROJECT-STATUS.md) |
| Implementasyon veya conformance iddiası yok | Ready | README, web sitesi, durum dosyası |
| Kapsam, mimari, tehdit modeli, araştırma, kararlar | Ready | `docs/` |
| Depo lisansı standart konumda | Ready | [LICENSE](LICENSE), Apache-2.0 |
| Katkı ve itiraz süreci | Ready | [CONTRIBUTING.md](CONTRIBUTING.md), [GOVERNANCE.md](GOVERNANCE.md) |
| Güvenlik bildirim politikası | Documented | [SECURITY.md](SECURITY.md); GitHub private reporting yine de etkinleştirilmelidir |
| Davranış politikası | Ready | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Public Git geçmişi ve remote URL | Blocked | Git'i başlatın ve public depoyu oluşturun |
| Korumalı varsayılan branch / ruleset | Blocked | PR'ları ve durum kontrollerini zorunlu kılın; kaçınılmazsa tek maintainer için istisnayı kaydedin |
| CODEOWNERS | Blocked | Nihai GitHub kullanıcısı veya organizasyonu bilindikten sonra ekleyin; `.github/` ve workflow'ların sahipliğini tanımlayın |
| Issue ve pull-request şablonları | Blocked | Depo URL'si ve katkı etiketleri seçildikten sonra ekleyin |
| Private vulnerability reporting | Blocked | Depo görünürlüğünü public olarak değiştirmeden önce etkinleştirin |
| Kesin GitHub ve npm adı yeniden kontrolü | Point-in-time only | 2026-07-31: kesin GitHub araması sıfır sonuç döndürdü; her iki aday ad için npm public sayfaları 404 döndürdü |
| Trademark ve domain incelemesi | Blocked | Public kimlikleri oluşturmadan hemen önce tamamlayın |
| Bitmap/SVG kaynağı ve kullanım hakları | Ready | Üretim geçmişi, şartların dayanağı ve metadata incelemesi [assets/README.md](assets/README.md) içinde kaydedildi |
| Harici link ve iki dilli sayfa kontrolü | Ready locally | Deployment URL'si mevcut olduktan sonra yeniden çalıştırın |

P0 bir npm paketi, kurulum komutu, conformance rozeti, onaylanmış spesifikasyon iddiası veya `latest` şema URL'si yayımlamamalıdır.

## R1 onaylanmış draft hazırlığı

- Özel spesifikasyon deposunu oluşturun.
- Eksiksiz Community Specification paketini benimseyin: contributor agreement, kapsam, bildirimler, lisans, yönetişim, katkı politikası, davranış kuralları ve onay/itiraz süreci.
- Kararlı gereksinim tanımlayıcıları atayın.
- JSON Schema'ları, geçerli ve geçersiz vector'ları ve elle oluşturulmuş eksiksiz bir bundle'ı yayımlayın.
- Elle oluşturulmuş bundle'ı yalnızca yazılı spesifikasyonu izleyen bir verifier ile kanıtlayın.

## R2-R5 implementasyon release'i

- Node.js 24 LTS'i hedefleyin; Node.js 22.14+ sürümünü yalnızca düşük maliyetli ve desteklenen durumda olduğu sürece test edin.
- Bir paket `files` allowlist'i kullanın; `npm pack --dry-run` çıktısını inceleyin.
- Paketlenmiş tarball'u temiz macOS, Linux ve Windows ortamlarında kurun.
- Runtime bağımlılıklarını standartlar açısından kritik, sabitlenmiş, denetlenmiş ve belgelenmiş tutun.
- Üçüncü taraf GitHub Actions'ı tam commit SHA'larına sabitleyin ve minimum token izinleri verin.
- Güvenilmeyen pull-request kodunu checkout etmek için asla ayrıcalıklı workflow'lar kullanmayın.
- npm 11.5.1+ ile GitHub-hosted runner üzerinden npm trusted publishing kullanın.
- Otomasyonu `npm stage publish` ile sınırlayın; staged paketi 2FA ile etkileşimli olarak onaylayın.
- Trusted publisher kanıtlandıktan sonra geleneksel otomasyon token'larını devre dışı bırakın.
- Provenance, SBOM, checksum'lar, release note'ları ve değişmez bir release/tag yayımlayın.
- Dependency review, code scanning, secret scanning ve OpenSSF Scorecard çalıştırın.
- Paketin install lifecycle script'i, telemetry, gizli network call veya bildirilmemiş dosya içermediğini doğrulayın.

## Release durdurma kuralı

Yalnızca kalan işler operasyonel olduğu için yayın yapmayın. Eksik lisans, private güvenlik kanalı, varlık hakkı, ad uygunluk kontrolü, conformance vector'ı veya temiz paket testi takip işi değil, release engelidir.