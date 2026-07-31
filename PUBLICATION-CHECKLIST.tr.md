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
| Güvenlik bildirim politikası | Ready | [SECURITY.md](SECURITY.md); GitHub private vulnerability reporting 2026-07-31 tarihinde etkinleştirildi |
| Davranış politikası | Ready | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |
| Public Git geçmişi ve remote URL | Ready | [kivancakdeniz/release-evidence-kit](https://github.com/kivancakdeniz/release-evidence-kit), public `main` geçmişi |
| Korumalı varsayılan branch / ruleset | P0 için Ready | Linear history ve conversation resolution zorunlu; force-push ve silme kapalı. Bus factor 1 iken yalnız PR ile merge ertelendi. |
| CODEOWNERS | Ready | `.github/`, workflow'lar, scriptler, dokümanlar, site, güvenlik politikası ve checklist `@kivancakdeniz` sahipliğinde |
| Issue ve pull-request şablonları | Ready | Araştırma ve itiraz formları, private-security bağlantısı ve PR checklist'i yayımlandı |
| Private vulnerability reporting | Ready | GitHub depo güvenlik ayarlarında etkin |
| Kesin GitHub ve npm adı yeniden kontrolü | P0 için Ready | GitHub deposu 2026-07-31 tarihinde alındı; npm aday sayfaları 404 döndürdü ancak paket adı alınmadı veya rezerve edilmedi |
| Trademark ve custom-domain incelemesi | Deferred | npm/ürün/custom-domain release'inden önce zorunlu; P0 paket veya custom domain iddia etmiyor ve hukuki izin iddiası taşımıyor |
| Bitmap/SVG kaynağı ve kullanım hakları | Ready | Üretim geçmişi, şartların dayanağı ve metadata incelemesi [assets/README.md](assets/README.md) içinde kaydedildi |
| Harici link ve iki dilli sayfa kontrolü | Ready | Canlı site [kivancakdeniz.github.io/release-evidence-kit](https://kivancakdeniz.github.io/release-evidence-kit/) adresinde kontrol edildi |
| GitHub Pages deployment | Ready | SHA-pinned workflow, allowlist artefakt, CSP, no-referrer, robots ve sitemap; ilk deployment 2026-07-31 tarihinde başarılı |
| Depo güvenlik analizi | Ready | Dependabot alert/update, secret scanning ve push protection etkin |

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