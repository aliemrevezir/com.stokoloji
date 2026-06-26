# BLOG: Trendyol Komisyon Nasıl Hesaplanır? (KDV, Stopaj, Kargo Dahil)

> Strapi `Blog` kaydı. Hedef keyword: **trendyol satış komisyonu** (320) + **trendyol komisyon** (1.900) + "trendyol komisyon hesaplama" long-tail.
> Veri kaynağı: `trendyol-komisyon-veri-paketi.md`. Örnek hesap programatik doğrulandı.

---

## Strapi alanları

**baslik:** Trendyol Komisyon Nasıl Hesaplanır? KDV, Stopaj ve Kargo Dahil Tam Rehber

**slug:** `trendyol-komisyon-nasil-hesaplanir`

**kategori:** E-ticaret / Pazaryeri

**yazar:** Ali (METU Endüstri Mühendisliği, production ERP/MRP geliştiricisi)

**iliskiliTool:** `trendyol-komisyon-hesaplama`

**yayinTarihi:** 2026-06-26
**guncellemeTarihi:** 2026-06-26

### seo.meta

**title:** Trendyol Komisyon Nasıl Hesaplanır? (KDV, Stopaj, Kargo)

**description:** Trendyol satış komisyonu nasıl hesaplanır? KDV hariç mi dahil mi, stopaj, kargo ve hizmet bedeli dahil adım adım formül ve örnek hesap. Hesaplayıcıyla dene.

---

## icerik (richtext / Markdown gövde)

# Trendyol Komisyon Nasıl Hesaplanır? KDV, Stopaj ve Kargo Dahil Tam Rehber

Trendyol satış komisyonu, ürünün satış fiyatı ile kategori komisyon oranının çarpımından çıkar; ama gerçek net kârı bulmak için işin içine KDV tabanı, stopaj, kargo ve hizmet bedeli de girer. Bu yazıda komisyonun tam olarak hangi tutar üzerinden hesaplandığını, en çok karıştırılan KDV sorusunu ve baştan sona örnek bir hesabı bulacaksın. Rakamların hepsi 2026 kaynaklarına dayanıyor ve örnek hesap kod ile doğrulandı.

## Trendyol komisyonu hangi tutar üzerinden hesaplanır?

İşte en kritik ve en çok karıştırılan nokta: komisyon, ürünün **KDV hariç** satış fiyatı (matrah) üzerinden mi, yoksa müşterinin ödediği **KDV dahil** fiyat üzerinden mi hesaplanır?

Kaynakların çoğu (örneğin Faturaport ve Sentos) komisyonun KDV hariç matrah üzerinden kesildiğini söylüyor. Bazı kaynaklar (örneğin Ticimax) ise KDV dahil tutarı baz alıyor. Yani kaynaklar bu konuda ayrışıyor. Pratikte en yaygın ve mantıken en tutarlı yaklaşım şudur: komisyon KDV hariç matrah üzerinden hesaplanır, sonra bu komisyon tutarının üzerine ayrıca yüzde 20 KDV eklenip sana faturalandırılır.

Buradaki ikinci inceliğe dikkat: komisyona eklenen o yüzde 20 KDV, senin KDV beyannamende indirilecek KDV olarak geri kazanılır. Yani gerçek nakit yükün, KDV'siz çıplak komisyon tutarıdır. Nakit akışında önce KDV'li tutar çıkar, sonra beyanla geri gelir.

İki yaklaşım arasındaki fark küçük değil. Aynı üründe KDV hariç baz ile KDV dahil baz arasında kâr marjı birkaç puan oynayabilir; bu yüzden [komisyon hesaplayıcısı](/araclar/trendyol-komisyon-hesaplama) iki bazı da göstererek doğru kararı sana bırakır.

## Komisyon dışındaki kesinti kalemleri

Net kârı doğru bulmak için komisyonun yanına şu kalemleri eklemen gerekir.

Platform hizmet bedeli gönderi başına sabittir. 2026 verilerine göre "Bugün Kargoda" gönderilerde yaklaşık 6,99 TL artı KDV, standart gönderilerde yaklaşık 10,99 TL artı KDV uygulanır. İade paketlerinde bu bedel alınmaz.

Kargo bedeli desi mantığıyla belirlenir. Desi, (en çarpı boy çarpı yükseklik) bölü 3000 formülüyle bulunur ve kargo firması ağırlık ile hacim-desiden büyük olanı baz alır. Kargo bedeli genel olarak satıcıya aittir ve hak edişten düşülür. Resmi tek bir desi tarifesi herkese açık değildir; kaynaklarda hem yüksek (anlaşmalı liste) hem düşük (barem destekli) tarifeler geçiyor, bu yüzden hesaplayıcıda kargoyu elle girersin.

Stopaj, KDV hariç satış tutarı üzerinden yüzde 1'dir. Dayanağı 330 No.lu Gelir Vergisi Kanunu Genel Tebliği ve ilgili Cumhurbaşkanı Kararıdır; 1 Ocak 2025'ten beri yürürlüktedir. Önemli ayrım: stopaj bir gider değildir, yıl sonu gelir veya kurumlar vergisinden mahsup edilen peşin ödenmiş bir vergidir. Bu yüzden nihai kârı azaltmaz, yalnızca yıl içi nakit akışını etkiler.

İade maliyetlerinde 2026 düzenlemesiyle iade kargo bedeli büyük ölçüde satıcıya geçti. Kesilen komisyon ise iade onaylandığında nakit geri ödenmez, bir sonraki komisyon faturasından mahsup edilir.

## Adım adım Trendyol komisyon ve kâr formülü

Aşağıdaki formül KDV oranını yüzde 20 varsayar (gıda ve kitap gibi farklı KDV oranları olan ürünlerde doğru oranı kullan).

1. KDV hariç satış matrahı: Satış fiyatı bölü 1,20
2. Komisyon tutarı: KDV hariç matrah çarpı komisyon oranı (gerçek nakit yük; komisyon KDV'si indirilebilir olduğu için çıplak tutar alınır)
3. Stopaj: KDV hariç matrah çarpı yüzde 1 (mahsup edilebilir; ayrı bilgi satırı)
4. Toplam kesinti: Komisyon artı hizmet bedeli artı kargo
5. Net kâr: KDV hariç satış eksi KDV hariç alış eksi komisyon eksi hizmet bedeli eksi kargo
6. Kâr marjı yüzdesi: Net kâr bölü satış fiyatı çarpı 100
7. Başabaş fiyat (KDV hariç): (KDV hariç alış artı kargo artı hizmet bedeli) bölü (1 eksi komisyon oranı)

## Örnek hesap (doğrulanmış)

Diyelim ki bir ürünü 600 TL'ye (KDV dahil) satıyorsun, alış maliyetin 240 TL (KDV dahil), kategori komisyonun yüzde 20, kargo 100 TL ve hizmet bedeli 10,99 TL.

KDV hariç satış matrahı 500 TL olur. Komisyon, KDV hariç baz ile 100 TL çıkar (faturada KDV ile 120 TL görünür ama 20 TL'si indirilebilir). Tüm kesintiler düşüldüğünde net kâr yaklaşık 105,68 TL, kâr marjı ise yaklaşık yüzde 17,6'dır. Aynı ürünü komisyonu KDV dahil bazdan hesaplarsan komisyon 120 TL'ye çıkar ve net kâr yaklaşık 85,68 TL'ye, marj yüzde 14,3'e iner. İşte KDV tabanı seçiminin gerçek etkisi bu.

Bu üründe başabaş satış fiyatı KDV hariç yaklaşık 367,90 TL, yani KDV dahil yaklaşık 441,49 TL'dir. Ürünü bu fiyatın altına satarsan zarar etmeye başlarsın. Bu rakamlar bir hesap motoruyla doğrulandı.

### Deneyimimden bir not

Bir ERP/MRP sisteminde maliyet ve kâr modülü kurarken en çok hata yapılan yer KDV tabanıdır. İnsanlar komisyonu KDV dahil fiyattan hesaplayıp maliyeti olduğundan yüksek görüyor ya da tersine stopajı gider yazıp kârı olduğundan düşük gösteriyor. Doğru model, KDV mükellefi bir satıcı için her şeyi KDV hariç çalışmak ve stopajı ayrı bir nakit akışı kalemi olarak tutmaktır. Bu ayrım, fiyatlama kararını tahminden çıkarıp rakama dayandırır.

## Sonuç

Trendyol komisyonu temelde satış fiyatı çarpı kategori oranıdır, ama doğru net kâr için KDV tabanını, stopajı, kargoyu ve hizmet bedelini de hesaba katman gerekir. KDV tabanı konusunda kaynaklar ayrışıyor; bu yüzden iki bazı da görebileceğin bir hesaba güvenmek en sağlıklısı. Kendi ürününde tüm kalemlerle net kârı ve başabaş fiyatı görmek için [Trendyol komisyon ve kâr hesaplayıcısını](/araclar/trendyol-komisyon-hesaplama) kullan; kategori oranları için [komisyon oranları 2026 listesine](/blog/trendyol-komisyon-oranlari) göz at.

### sss (content.sss)

**soru:** Trendyol komisyonu KDV dahil mi yoksa KDV hariç fiyattan mı hesaplanır?
**cevap:** Kaynaklar ayrışıyor. Çoğu kaynak komisyonun KDV hariç satış matrahından kesildiğini, ardından komisyon tutarına yüzde 20 KDV eklenip faturalandırıldığını söyler; bazı kaynaklar KDV dahil tutarı baz alır. En yaygın yaklaşım KDV hariç matrahtır, ancak iki baz arasında kâr marjı birkaç puan değişebilir.

**soru:** Trendyol stopajı kârımı düşürür mü?
**cevap:** Stopaj, KDV hariç satış tutarı üzerinden yüzde 1'dir ve Trendyol tarafından kesilir. Ancak bu bir gider değil, yıl sonu vergisinden mahsup edilen peşin ödenmiş vergidir. Bu nedenle nihai kârını azaltmaz; yalnızca yıl içi nakit akışını geçici olarak etkiler.

**soru:** Trendyol komisyonuna ayrıca KDV ekleniyor mu?
**cevap:** Evet, komisyon tutarının üzerine yüzde 20 KDV eklenip satıcıya faturalandırılır. Ancak bu KDV, KDV mükellefi satıcının beyannamesinde indirilecek KDV olarak geri kazanıldığı için gerçek nakit yük çıplak komisyon tutarıdır.

**soru:** Başabaş satış fiyatı nasıl hesaplanır?
**cevap:** KDV hariç başabaş fiyat, (KDV hariç alış maliyeti artı kargo artı hizmet bedeli) toplamının (1 eksi komisyon oranı) değerine bölünmesiyle bulunur. Bu fiyatta net kâr sıfırdır; altına satış zarardır. Hesaplayıcı bunu otomatik gösterir.
