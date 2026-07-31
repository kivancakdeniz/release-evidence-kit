> Bu belge, [İngilizce kaynağın](GOVERNANCE.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farklılığı durumunda İngilizce metin geçerlidir.

# Yönetişim

## Mevcut model

Release Evidence Kit, tek maintainer'lı bir pre-draft'tır. Maintainer şu anda editör ve release owner olarak görev yapar. Bus factor **1**'dir. Projenin in-toto, OpenSSF, Linux Foundation veya başka bir standart kuruluşuyla bağlantısı yoktur; proje bunlar tarafından desteklenmez veya yönetilmez.

Bu depo, uzlaşıyla onaylanmış bir spesifikasyonu değil, bir design review'u barındırır. Maintainer, yazılı destek ve itirazları değerlendirdikten sonra değişiklikleri kabul edebilir; ancak bu süreci sektör uzlaşısı olarak tanımlamamalıdır.

## Kararlar

- Kapsam ve birlikte çalışabilirlik kararları [docs/DECISIONS.md](docs/DECISIONS.md) içinde kaydedilir.
- Esaslı değişiklikler yeni bir ADR veya mevcut bir ADR'de açık bir değişiklik gerektirir.
- Kararlar sonuçlarını belirtir ve hükümsüz kılınabilir; geçmiş yeniden yazılmaz.
- Araştırma iddiaları birincil kaynaklar ve inceleme tarihi gerektirir.

## İtirazlar ve temyizler

Herkes, etkilenen kararı, kanıtı ve talep edilen çözümü açıklayan bir `Objection:` issue'su açabilir. Maintainer itirazı iyi niyetle değerlendirecek, yazılı olarak yanıtlayacak ve tasarımı değiştirdiğinde çözümü ilgili ADR'den linkleyecektir.

## Release'ler

P0 sırasında tek release yetkilisi maintainer'dır. P0 release'leri yalnızca belgeleri ve statik siteyi yayımlayabilir. İlgili roadmap kapıları geçilmeden hiçbir paket, conformance iddiası veya onaylanmış spesifikasyon yayımlanamaz.

## Halefiyet ve arşivleme

Bir halef; yayımlanmış bundle'ların okunabilirliğini, durumun dürüstçe belirtilmesini, güvenlik bildirimini, karar geçmişini ve public bir ADR aracılığıyla değiştirilmedikçe projenin kapsam dışı hedeflerini korumayı kabul etmelidir.

Halef bulunamaz ve bakım durursa:

1. [PROJECT-STATUS.md](PROJECT-STATUS.md) dosyasını `archived` olarak işaretleyin,
2. tamamlanmamış işleri ve bilinen riskleri açıklayan son bir release note yayımlayın,
3. onay anlamı ima etmeden son spesifikasyon durumunu dondurun,
4. hukuken ve operasyonel olarak mümkün olduğunda örnekleri ve vector'ları erişilebilir tutun,
5. izlenmeyen bir release kanalı bırakmak yerine paket dağıtımını devre dışı bırakın veya deprecated olarak işaretleyin.

Daha sonraki Community Specification çalışma grubunun kendi yönetişim ve due-process kuralları olacaktır. Bu dosya söz konusu sürecin yerini tutmaz.