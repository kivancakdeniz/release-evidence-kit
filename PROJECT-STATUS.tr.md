---
project: Release Evidence Kit
status: pre-draft
publication: public-design-review
specification: not-approved
implementation: none
conformance-vectors: none
reference-cli: none
last-reviewed: 2026-07-31
---

> Bu belge, [İngilizce kaynağın](PROJECT-STATUS.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farklılığı durumunda İngilizce metin geçerlidir.

# Proje Durumu

Release Evidence Kit, public bir pre-draft design review'dur. Bu depo araştırma, mimari kararlar, bir tehdit modeli ve normatif olmayan bir format taslağı içerir.

## Mevcut olanlar

- Tanımlanmış bir problem ve dar kapsamlı kapsam dışı hedefler.
- Önerilen bir kanıt zinciri ve predicate yapısı.
- Bir teslimat ve yanlışlama planı.
- Statik, iki dilli bir proje sayfası.

## Mevcut olmayanlar

- Onaylanmış bir spesifikasyon yoktur.
- JSON Schema veya conformance vector'ları yoktur.
- Bağımsız doğrulamadan geçmiş örnek bir bundle yoktur.
- Referans CLI, inceleme sunucusu, verifier, npm paketi veya GitHub Action yoktur.
- Hiçbir implementasyon bu pre-draft'a conformance iddiasında bulunamaz.

## Durum ilerleyişi

`pre-draft` -> `draft` -> `approved`

Bir durum değişikliği için bir ADR, yukarıdaki makinece okunabilir metadata'nın güncellenmesi ve [docs/ROADMAP.md](docs/ROADMAP.md) içindeki release kapılarının geçilmesi gerekir. Draft ve approved durumları ayrıca özel Community Specification deposunu ve bu deponun hukuk/yönetişim paketini gerektirir.

## Arşiv durumu

Çalışma durursa bu dosya `status: archived` olarak değiştirilecek, bilinen son sınırlamalar kaydedilecek ve depo tasarım geçmişi olarak okunabilir kalacaktır. Hiçbir benimseyen, burada açıklanan yayımlanmamış komutlara veya şemalara bağımlı olmamalıdır.