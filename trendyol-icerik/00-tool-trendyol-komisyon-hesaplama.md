# TOOL: Trendyol Komisyon & Kâr Hesaplayıcı

> Strapi `Tool` kaydı. Hesaplama mantığı Next.js `lib/tools/trendyol-komisyon.ts` içinde yaşar (mimari kural 1). Bu dosya yalnızca metinsel içeriği taşır.
> Hedef keyword: **trendyol komisyon hesaplama** (9.900/ay, KD 13) + **trendyol kar hesaplama** (1.900/ay, KD 10).
> Veri kaynağı: `trendyol-komisyon-veri-paketi.md` (26.06.2026). Oranlar tahmini ve aralıktır.

---

## Strapi alanları

**ad:** Trendyol Komisyon & Kâr Hesaplayıcı

**slug:** `trendyol-komisyon-hesaplama`

**kategori:** E-ticaret / Pazaryeri (ya da mevcut en yakın kategori)

**iliskiliYazilar:** `trendyol-komisyon-oranlari`, `trendyol-komisyon-nasil-hesaplanir`, `trendyol-kar-hesaplama`

**kisaAciklama (text, meta/özet):**
Satış fiyatını, ürün maliyetini ve kategori komisyonunu gir; Trendyol komisyonunu, KDV ve stopaj etkisini, kargo ve hizmet bedelini düşüp net kârını, kâr marjını ve başabaş satış fiyatını anında hesapla. Kategori komisyon oranları 2026 verisiyle hazır gelir, dilersen elle değiştirirsin.

### seo.meta

**title:** Trendyol Komisyon Hesaplama 2026: Net Kâr & Komisyon Aracı

**description:** Trendyol komisyon hesaplama aracı: kategoriye göre komisyon, KDV, stopaj, kargo ve hizmet bedelini düşüp net kârını ve başabaş fiyatını ücretsiz hesapla. Kayıt yok.

---

## formulAciklamasi (richtext / Markdown gövde)

# Trendyol Komisyon & Kâr Hesaplayıcı

Trendyol komisyon hesaplama işini tahmine bırakmadan yapmak için bu aracı kullan. Satış fiyatını, ürün alış maliyetini ve ürünün kategorisini gir; araç sana komisyon tutarını, KDV ve stopaj etkisini, kargo ile hizmet bedelini ve en sonunda eline geçecek **net kârı** gösterir. Aynı ekranda kâr marjını ve "başabaş satış fiyatını" da görürsün, yani ürünü hangi fiyatın altına satarsan zarar etmeye başladığını.

Aracın çıktıları şunlar: komisyon tutarı, toplam kesinti, net kâr, kâr marjı yüzdesi ve başabaş (kâr sıfır) fiyat. Böylece "bu üründe gerçekten kazanıyor muyum" sorusunu net bir rakamla yanıtlarsın.

## Trendyol komisyon hesaplama nasıl çalışır?

Hesaplayıcı dört girdiyle çalışır: satış fiyatı (KDV dahil), ürün alış maliyeti, kategori (komisyon oranını otomatik getirir) ve kargo bedeli. Komisyon oranını kategoriden hazır alırsın ama satıcı seviyene veya sözleşmene göre elle değiştirebilirsin. Bu önemli, çünkü Trendyol komisyon oranları resmi ve sabit değildir; alt kategoriye, satıcı seviyesine, kampanya dönemine ve sözleşmene göre değişir. Aracın getirdiği oran 2026 ikincil kaynaklardan derlenmiş bir **aralık tahminidir**; bağlayıcı oranı her zaman Trendyol Satıcı Paneli içindeki Anlaşma Bilgileri ekranından doğrula.

## Komisyon hangi tutar üzerinden hesaplanıyor?

Bu, sonucu en çok etkileyen ayrıntı. Kaynakların çoğu (örneğin Faturaport ve Sentos) komisyonun ürünün **KDV hariç** satış fiyatı üzerinden hesaplandığını söyler; bazı kaynaklar ise KDV dahil tutarı baz alır. Aracımız varsayılan olarak KDV hariç matrahı kullanır ama tek tıkla KDV dahil baza geçebilirsin, çünkü ikisi arasındaki fark kâr marjında birkaç puanı bulabilir. Komisyon tutarının üzerine ayrıca yüzde 20 KDV eklenip faturalandırılır; bu KDV satıcının beyannamesinde indirilecek KDV olduğundan gerçek nakit yükü çıplak komisyon tutarıdır.

## Hesaba katılan kesinti kalemleri

Araç sadece komisyonu değil, satıcıyı etkileyen diğer kalemleri de gösterir. Platform hizmet bedeli gönderi başına sabittir (2026'da yaklaşık 6,99 ila 10,99 TL artı KDV). Kargo bedeli desi veya ağırlığın büyük olanına göre belirlenir ve genel olarak satıcıya aittir. Stopaj ise KDV hariç satış tutarı üzerinden yüzde 1'dir; bu bir gider değil, yıl sonu vergisinden mahsup edilen peşin vergidir, bu yüzden araç onu ayrı bir bilgi satırında gösterir, net kârdan doğrudan düşmez.

## Kimler için?

Trendyol'da satış yapan KOBİ sahibi, satın alma ve fiyatlama yapan uzman ve işletme öğrencisi için tasarlandı. Yeni bir ürünü listelemeden önce fiyatını sınamak, bir kampanya indiriminin kârı sıfırlayıp sıfırlamadığını görmek veya hedef kâr marjına ulaşmak için minimum fiyatı bulmak istiyorsan doğru yerdesin. Kayıt veya API bağlama gerektirmez; gir ve hesapla.

> Sonuçlar bilgilendirme amaçlıdır. Bağlayıcı komisyon, kargo ve hizmet bedeli için Trendyol Satıcı Paneli esas alınmalıdır.

### sss (content.sss, repeatable)

**soru:** Trendyol komisyon hesaplama aracı ücretsiz mi?
**cevap:** Evet, araç tamamen ücretsizdir ve kayıt, üyelik veya API bağlama gerektirmez. Satış fiyatı, maliyet ve kategoriyi girip sonucu anında görürsün.

**soru:** Trendyol komisyon oranları neden tahmini olarak veriliyor?
**cevap:** Trendyol komisyonlarını alt kategori, ürün grubu, satıcı seviyesi, kampanya dönemi ve bireysel sözleşmeye göre belirler ve herkese açık tek bir resmi tablo yayınlamaz. Bu yüzden araçtaki oranlar 2026 ikincil kaynaklardan derlenmiş aralık tahminleridir; kendi bağlayıcı oranını Satıcı Paneli Anlaşma Bilgileri ekranından görebilirsin.

**soru:** Komisyon KDV dahil mi yoksa KDV hariç fiyattan mı kesiliyor?
**cevap:** Kaynaklar bu konuda ayrışıyor. Çoğu kaynak komisyonun KDV hariç satış matrahından kesildiğini, ardından komisyon tutarına yüzde 20 KDV eklendiğini söyler. Araç varsayılan olarak KDV hariç matrahı kullanır, ancak KDV dahil baza da geçebilirsin.

**soru:** Stopaj net kârımı azaltır mı?
**cevap:** Stopaj, KDV hariç satış tutarı üzerinden yüzde 1'dir ve Trendyol tarafından kesilir. Ancak bu bir gider değil, yıl sonu gelir veya kurumlar vergisinden mahsup edilen peşin ödenmiş vergidir. Nihai kârını azaltmaz; yalnızca yıl içi nakit akışını geçici olarak etkiler.

**soru:** Başabaş satış fiyatı ne demek?
**cevap:** Tüm maliyetler ve kesintiler düşüldükten sonra net kârın tam sıfır olduğu satış fiyatıdır. Ürünü bu fiyatın altına satarsan zarar edersin. Araç bunu hesaplayarak güvenli alt fiyat sınırını gösterir.
