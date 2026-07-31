> Bu belge, [İngilizce kaynağın](SECURITY.md) bilgilendirme amaçlı Türkçe çevirisidir. Yorum farklılığı durumunda İngilizce metin geçerlidir.

# Güvenlik Politikası

## Desteklenen yüzey

| Yüzey | Durum |
| --- | --- |
| Public pre-draft belgeleri ve statik site | Supported for reporting |
| Önerilen bundle formatı | Design review only |
| CLI, verifier, npm paketi veya GitHub Action | Not released; no supported version |

Güvenlikle ilgili bildirimler; önerilen inceleme protokolünde aday kimliğinin sızmasını, path traversal veya canonicalization belirsizliğini, secret ifşasını, güvenli olmayan rendering'i, digest karışıklığını, transparency log gizlilik riskini ve workflow veya yayın zinciri zayıflıklarını içerir.

## Güvenlik açığı bildirme

Deponun **Security -> Report a vulnerability** akışını kullanın. Şüphelenilen bir güvenlik açığı için public issue açmayın veya private prompt'ları, çıktıları, reviewer verilerini, kimlik bilgilerini ya da exploit ayrıntılarını public bir tartışmaya dahil etmeyin.

Public depo için Private vulnerability reporting etkindir. **Report a vulnerability** düğmesi beklenmedik biçimde kullanılamıyorsa hassas ayrıntıları public issue içinde açıklamayın; maintainer'ın private kanalı geri yükleyebilmesi için yalnızca kanalın kullanılamadığını bildirin.

Maintainer, private bir bildirimi 14 gün içinde aldığını teyit etmeyi hedefler. Bu çalışma şu anda yayımlanmış bir executable'ı olmayan bir tasarım deposu olduğundan çözüm; spesifikasyon düzeltmesi, tehdit modeli güncellemesi, yayın uyarısı veya güvenli olmayan bir önerinin geri çekilmesi olabilir.

## Açıklama

Bildiren kişi ve maintainer, açıklama zamanlaması üzerinde anlaşmalıdır. Yayımlanmış bir implementasyon mevcut olduğunda desteklenen sürümler, önem derecesinin ele alınışı, advisory'ler ve patch zaman çizelgeleri ilk paket release'inden önce buraya eklenecektir.