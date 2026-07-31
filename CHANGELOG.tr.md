> Bu belge, [İngilizce kaynağın](CHANGELOG.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farklılığı durumunda İngilizce metin geçerlidir.

# Değişiklik Günlüğü

Bu tasarım deposundaki kayda değer tüm public değişiklikler burada belgelenir.

## 0.0.1-pre-draft - 2026-07-31

### Eklendi

- Public pre-draft kanıt formatı design review'u.
- İki dilli İngilizce ve Türkçe proje dokümantasyonu.
- Mimari, kapsam, alan modeli, tehdit modeli, landscape araştırması, roadmap ve ADR günlüğü.
- Statik iki dilli proje sitesi ve belgelenmiş görsel varlık provenance'ı.
- Apache-2.0 lisansı ile yönetişim, katkı, davranış, güvenlik, durum ve yayın politikaları.
- Bağımlılıksız yayın doğrulaması ve SHA ile sabitlenmiş GitHub Pages deployment workflow'u.

### Güvenlik

- Public ağaç; yaygın secret ve kimlik bilgisi formatları, yerel kullanıcı yolları, tenant tanımlayıcıları, private key'ler ve görsel metadata'sı için tarandı.
- Depo otomasyonunun ve yerel araçların deploy edilen site artefaktına kopyalanmaması için bir yayın allowlist'i eklendi.
- Statik siteye Content Security Policy ve no-referrer politikası eklendi.

### Sınırlamalar

- Onaylanmış bir spesifikasyon, şema, conformance vector'ı, örnek kanıt bundle'ı, CLI, verifier, npm paketi veya GitHub Action mevcut değildir.
- Bu release yalnızca bir design review yayımlar ve herhangi bir conformance iddiasında bulunmaz.