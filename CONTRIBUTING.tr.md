> Bu belge, [İngilizce kaynağın](CONTRIBUTING.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farklılığı durumunda İngilizce metin geçerlidir.

# Katkıda Bulunma

Release Evidence Kit şu anda public bir pre-draft design review'dur. Katkılar formatı yanlışlamaya, iddialarını daraltmaya veya bir birlikte çalışabilirlik gereksinimini test edilebilir hâle getirmeye çalışmalıdır.

## Şu anda yararlı katkılar

- Gerçek bir AI capability release kararını yeniden oluşturun ve eksik kanıtı belirleyin.
- Bir çelişkiyi, privacy leak'i, belirsiz digest kuralını veya doğrulanamaz iddiayı bildirin.
- Geçerli veya geçersiz bir conformance vector'ı önerin.
- Birincil kaynak kullanarak bir landscape iddiasını düzeltin.
- Statik sitenin erişilebilirliğini veya olgusal tutarlılığını iyileştirin.

## Issue türleri

Şu prefix'lerden birini kullanın:

- Kaynaklandırılmış bir landscape düzeltmesi için `Research:`.
- Teknik, yönetişim, gizlilik veya kapsamla ilgili bir endişe için `Objection:`.
- Yeni bir gereksinim veya değiştirilmiş bir contract için `Proposal:`.
- İfade, çeviri, linkler veya erişilebilirlik için `Editorial:`.

Güvenlik issue'ları public issue tracker'ı değil, [SECURITY.md](SECURITY.md) içindeki süreci izler.

## Pull request'ler

1. Her pull request'te tek bir davranışsal veya editoryal konu ele alın.
2. Issue'yu linkleyin veya ayrı bir issue'nun neden değer katmayacağını açıklayın.
3. Kabul edilmiş bir kararı değiştirirken ilgili ADR'yi güncelleyin.
4. Eski ve yeni kuralı birbirinden ayıracak conformance vector'ını ekleyin veya açıklayın.
5. Bir ADR açıkça değiştirmediği sürece import-only, no-service, no-telemetry sınırını koruyun.
6. P0 sırasında bağımlılık veya executable code eklemekten kaçının.

Bu tasarım deposuna yapılan katkılar Apache-2.0 kapsamında lisanslanır.

## Spesifikasyon katkıları

Bu depo henüz Community Specification License kapsamında normatif spesifikasyon katkılarını kabul etmemektedir. Bu süreç yalnızca özel spesifikasyon deposunda contributor agreement, kapsam, bildirimler, yönetişim, katkı politikası ve davranış kuralları tamamlandıktan sonra açılır. O zamana kadar buradaki tüm format değişiklikleri normatif olmayan önerilerdir.

## İnceleme ve temyiz

Maintainer, kabul edilen mimari değişiklikleri [docs/DECISIONS.md](docs/DECISIONS.md) içinde kaydeder. Reddedilen bir öneri; kararı, teknik dayanağı ve talep edilen çözümü belirten bir `Objection:` issue'su aracılığıyla temyiz edilebilir. Maintainer yazılı olarak yanıt verecek ve itirazı karar kaydıyla birlikte koruyacaktır.