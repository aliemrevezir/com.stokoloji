import type { Core } from '@strapi/strapi';

/* -----------------------------------------------------------------------------
 * Trendyol Komisyon & Kâr cluster seed'i (1 tool + 3 blog).
 *
 * İçerik richtext (Markdown) alanlara DOĞRUDAN string olarak yazılır; blocks
 * dizisi kurulmaz. Gerekçe: FAZ 2'de içerik modeli Markdown'a taşındı ve
 * `migrateContentToMarkdown` düz Markdown string'e DOKUNMAZ (idempotent), bu
 * yüzden string atamak hem daha basit hem de panel düzenlemeleriyle uyumludur.
 *
 * NOT: Tüm string değerler backtick (template literal) ile yazıldı; Türkçe metin
 * sık kesme işareti (1'dir, KDV'si, Trendyol'da) içerdiğinden tek tırnak string'i
 * erken kapatır. Tool'un hesaplama motoru (apps/web lib/tools/trendyol-komisyon.ts
 * + registry + route) henüz YOK; bu seed yalnız METİNSEL içeriği oluşturur
 * (mimari kural 1). Oranlar TAHMİNİ/aralıktır; kaynak: trendyol-komisyon-veri-paketi.md.
 * --------------------------------------------------------------------------- */

const TOOL_FORMUL = `# Trendyol Komisyon & Kâr Hesaplayıcı

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

Kategori bazlı oranların tamamı için [Trendyol komisyon oranları 2026 listesine](/icerik/trendyol-komisyon-oranlari), hesabın mantığı için [komisyon nasıl hesaplanır rehberine](/icerik/trendyol-komisyon-nasil-hesaplanir) bakabilirsin.

> Sonuçlar bilgilendirme amaçlıdır. Bağlayıcı komisyon, kargo ve hizmet bedeli için Trendyol Satıcı Paneli esas alınmalıdır.`;

const TOOL_SSS = [
  {
    soru: `Trendyol komisyon hesaplama aracı ücretsiz mi?`,
    cevap: `Evet, araç tamamen ücretsizdir ve kayıt, üyelik veya API bağlama gerektirmez. Satış fiyatı, maliyet ve kategoriyi girip sonucu anında görürsün.`,
  },
  {
    soru: `Trendyol komisyon oranları neden tahmini olarak veriliyor?`,
    cevap: `Trendyol komisyonlarını alt kategori, ürün grubu, satıcı seviyesi, kampanya dönemi ve bireysel sözleşmeye göre belirler ve herkese açık tek bir resmi tablo yayınlamaz. Bu yüzden araçtaki oranlar 2026 ikincil kaynaklardan derlenmiş aralık tahminleridir; kendi bağlayıcı oranını Satıcı Paneli Anlaşma Bilgileri ekranından görebilirsin.`,
  },
  {
    soru: `Komisyon KDV dahil mi yoksa KDV hariç fiyattan mı kesiliyor?`,
    cevap: `Kaynaklar bu konuda ayrışıyor. Çoğu kaynak komisyonun KDV hariç satış matrahından kesildiğini, ardından komisyon tutarına yüzde 20 KDV eklendiğini söyler. Araç varsayılan olarak KDV hariç matrahı kullanır, ancak KDV dahil baza da geçebilirsin.`,
  },
  {
    soru: `Stopaj net kârımı azaltır mı?`,
    cevap: `Stopaj, KDV hariç satış tutarı üzerinden yüzde 1'dir ve Trendyol tarafından kesilir. Ancak bu bir gider değil, yıl sonu gelir veya kurumlar vergisinden mahsup edilen peşin ödenmiş vergidir. Nihai kârını azaltmaz; yalnızca yıl içi nakit akışını geçici olarak etkiler.`,
  },
  {
    soru: `Başabaş satış fiyatı ne demek?`,
    cevap: `Tüm maliyetler ve kesintiler düşüldükten sonra net kârın tam sıfır olduğu satış fiyatıdır. Ürünü bu fiyatın altına satarsan zarar edersin. Araç bunu hesaplayarak güvenli alt fiyat sınırını gösterir.`,
  },
];

const BLOG_ORANLARI = `# Trendyol Komisyon Oranları 2026: Kategori Kategori Güncel Liste

Trendyol komisyon oranları 2026'da kategoriye göre yaklaşık yüzde 5 ile yüzde 28 arasında değişiyor. Bu yazıda 20 kategori için güncel komisyon aralıklarını, her birinin kaynağını ve "Trendyol ne kadar komisyon alıyor" sorusunun net cevabını bulacaksın. Rakamlar tahmini ve aralık olarak verildi; nedenini hemen aşağıda açıklıyorum, çünkü bu nokta çoğu listede atlanıyor ve satıcıyı yanıltıyor.

## Trendyol komisyon oranları neden "kesin" değildir?

Trendyol, kategori komisyonlarını herkese açık tek bir resmi tabloda yayınlamaz. Oranlar alt kategoriye, ürün grubuna, markaya, satıcı seviyene (1'den 5'e), kadın girişimci veya kooperatif programlarına, kampanya dönemine ve bireysel sözleşmene göre değişir. Bağlayıcı tek kaynak senin Trendyol Satıcı Paneli içindeki Anlaşma Bilgileri ekranındır. Bu yüzden internetteki hiçbir liste (bu yazı dahil) senin mağazana özel kesin oranı veremez; ancak doğru bir aralık verebilir.

Aşağıdaki rakamlar IdeaSoft (06.02.2026), Yengeç (26.02.2026) ve Ticimax (20.04.2026) gibi birden fazla bağımsız 2026 kaynağından derlendi. Kaynaklar çeliştiğinde bunu açıkça yazdım; uydurma bir ortalama vermedim.

Bir uyarı daha: internette üst sıralarda çıkan komisyon listelerinin önemli bir kısmı 2021 ile 2024 arası tarihlidir ve güncelliğini yitirmiştir. Bir listenin yayın veya güncelleme tarihine mutlaka bak; eski oranlar fiyatlamanı yanıltır. Resmi eğitim kaynağı olarak Trendyol Akademi de konuyu anlatır, ancak kategori bazlı bağlayıcı tabloyu yine yalnızca senin Satıcı Panelin gösterir.

## Kategori bazlı Trendyol komisyon oranları tablosu

| Kategori | Komisyon Aralığı | Örnek Ürünler |
|---|---|---|
| Giyim (kadın/erkek/çocuk) | %17 ile %21,36 | Üst giyim, iç giyim, dış giyim |
| Ayakkabı | ~%23,39 | Tüm ayakkabı türleri |
| Çanta & Aksesuar | %20,34 ile %23 | Çanta, kemer, şapka, saat |
| Takı | ~%22,37 | Bijuteri, gümüş ve çelik takı |
| Elektronik | %7 ile %28 | Telefon (%7), TV (%8), yedek parça (%27) |
| Bilgisayar & Tablet | %7,5 ile %15,5 | Dizüstü, oyuncu PC, tablet aksesuar |
| Telefon Aksesuar | %15 ile %27 | Kılıf, batarya, ekran, kamera |
| Kozmetik & Parfüm | %12 ile %17,5 | Cilt bakım, makyaj, parfüm |
| Kişisel Bakım | %16,78 ile %17,5 | Epilatör, saç düzleştirici, ağda |
| Ev & Yaşam | %11 ile %21,36 | Aydınlatma, ev tekstili, beyaz eşya |
| Mutfak & Küçük Ev Aletleri | %11 ile %19,32 | Sofra, pişirme, küçük ev aletleri |
| Anne & Bebek | ~%16,5 | Bebek arabası, oto koltuğu, banyo eşyaları |
| Kitap & Kırtasiye | Veri bulunamadı | (Güvenilir Trendyol-özel oran yok) |
| Oyuncak & Hobi | ~%16,5 | Çocuk ve bebek oyuncakları |
| Spor & Outdoor | %10,5 ile %15 | Spor giyim, aletler, bisiklet, outdoor |
| Bahçe & Yapı Market | %15,5 ile %17,5 | Bahçe dekorasyonu, el aletleri |
| Gıda & İçecek | %8 ile %18 | Atıştırmalık, kuru gıda, kahvaltılık |
| Pet Shop | ~%15,25 | Köpek kuru ve konserve maması |
| Otomotiv Aksesuar | ~%16,5 | Oto bakım ve temizlik ürünleri |
| Sağlık & Wellness | ~%17,29 | Hasta bezi ve temizlik ürünleri |

Tabloyu kendi ürününe uygulayıp net kârı görmek istersen [Trendyol Komisyon & Kâr Hesaplayıcı](/araclar/trendyol-komisyon-hesaplama) ile satış fiyatını ve maliyetini girip sonucu anında alabilirsin.

## Trendyol ne kadar komisyon alıyor?

Kısa cevap: çoğu kategoride yaklaşık yüzde 15 ile yüzde 22 arasında. En düşük komisyonlar elektronikte; akıllı telefon yaklaşık yüzde 7, televizyon yaklaşık yüzde 8 ile listenin en altında. En yüksek komisyonlar ise telefon yedek parçalarında (batarya, ekran, kamera) yaklaşık yüzde 27 ve takı ile aksesuarda yaklaşık yüzde 22 ila 23 seviyesinde. Yani "Trendyol ne kadar komisyon alıyor" sorusunun cevabı tek bir rakam değil, sattığın kategoriye bağlı bir aralıktır.

Komisyonun yanında ödediğin başka kalemler de var: gönderi başına platform hizmet bedeli (2026'da yaklaşık 6,99 ila 10,99 TL artı KDV), kargo bedeli, yüzde 1 stopaj ve iade maliyetleri. Bunların hepsini ve doğru hesap yöntemini [Trendyol komisyon nasıl hesaplanır](/icerik/trendyol-komisyon-nasil-hesaplanir) yazısında adım adım anlattım.

## Kaynaklar arası çelişkiler (dikkat edilmesi gerekenler)

Şeffaf olmak gerekirse, tüm kaynaklar aynı rakamı vermiyor. En belirgin üç nokta şöyle. Giyimde IdeaSoft ve Yengeç tek oran olarak yüzde 21,36 verirken Ticimax yüzde 17 ila 20 bandını gösteriyor; bu yüzden tabloda aralık bıraktım. Ayakkabı için bazı listelerde görülen yüzde 19,49 değeri aslında Hepsiburada verisidir, Trendyol değil. Kitap ve kırtasiye için ise hiçbir kaynakta Trendyol'a özel güvenilir bir oran bulamadım; o yüzden "veri bulunamadı" yazdım ve tahmin etmedim. Bir oranı kesin diye sunmaktansa belirsizliği dürüstçe göstermeyi tercih ediyorum.

## Satıcı seviyesi komisyonu nasıl etkiler?

Komisyon oranların sabit değil. Trendyol'un satıcı seviyesi sistemi (performansına göre 1'den 5'e) komisyonunu aşağı çeker; üst seviye satıcılar genel orana göre yaklaşık yüzde 2,5 ila 10 daha düşük komisyon ödeyebilir. Kadın girişimci ve kooperatif programlarında oranlar yüzde 1,80 ile yüzde 5,50 gibi çok daha düşük seviyelere inebiliyor. Bazı büyük markalarda da indirimli özel oranlar var. Bu yüzden tablodaki aralığın üst ucunu değil, kendi panelindeki gerçek oranı esas almalısın.

### Deneyimimden bir not

Production sistemler geliştiren biri olarak şunu sık görüyorum: satıcılar komisyonu tek bir yüzde sanıp fiyatını ona göre kuruyor, sonra kargo, hizmet bedeli ve KDV etkisi devreye girince beklediği kâr buharlaşıyor. Bir ERP/MRP sisteminde maliyet hesabını kurarken öğrendiğim şey, "görünen komisyon" ile "gerçek nakit kesinti" arasındaki farkın her zaman ayrı izlenmesi gerektiği. O yüzden bu yazıdaki tabloyu bir başlangıç noktası olarak kullan, ama nihai fiyat kararını verirken tüm kalemleri tek tek hesaba kat.

## Sonuç

Trendyol komisyon oranları 2026'da kategoriye göre yaklaşık yüzde 5 ile yüzde 28 arasında değişiyor ve hiçbir liste senin mağazana özel kesin oranı veremez. Doğru yaklaşım, güncel bir aralıktan başlamak, kendi panelindeki oranı doğrulamak ve net kârı tüm kesintilerle birlikte hesaplamaktır. Hesabı saniyeler içinde yapmak için [komisyon ve kâr hesaplayıcısını](/araclar/trendyol-komisyon-hesaplama) kullanabilir, kârlılığını derinleştirmek için [Trendyol kâr hesaplama rehberini](/icerik/trendyol-kar-hesaplama) okuyabilirsin.`;

const BLOG_ORANLARI_SSS = [
  {
    soru: `Trendyol 2026'da en yüksek komisyonu hangi kategoride alıyor?`,
    cevap: `Güncel kaynaklara göre en yüksek komisyonlar telefon yedek parçalarında (batarya, ekran, kamera) yaklaşık yüzde 27 ve takı ile aksesuar kategorisinde yaklaşık yüzde 22 ila 23 seviyesindedir. En düşük komisyonlar ise akıllı telefon (~%7) ve televizyon (~%8) gibi elektronik ürünlerdedir.`,
  },
  {
    soru: `Trendyol giyim komisyonu yüzde kaç?`,
    cevap: `Kaynaklar ayrışıyor: IdeaSoft ve Yengeç giyimi yüzde 21,36 olarak verirken Ticimax yüzde 17 ila 20 bandını gösteriyor. Bu yüzden giyim için yüzde 17 ile yüzde 21,36 arası bir aralık esas almak ve kendi panelinden doğrulamak en doğrusu.`,
  },
  {
    soru: `Trendyol komisyon oranları nereden resmi olarak öğrenilir?`,
    cevap: `Tek bağlayıcı kaynak Trendyol Satıcı Paneli içindeki Anlaşma Bilgileri ekranıdır. İnternetteki listeler ikincil kaynaklardan derlenir ve yalnızca aralık tahmini verebilir; mağazana özel kesin oran panelde görünür.`,
  },
  {
    soru: `Komisyon dışında Trendyol başka ne kesiyor?`,
    cevap: `Komisyona ek olarak gönderi başına platform hizmet bedeli (yaklaşık 6,99 ila 10,99 TL artı KDV), kargo bedeli, KDV hariç tutar üzerinden yüzde 1 stopaj ve iade durumunda kargo maliyeti gibi kalemler vardır. Detaylı hesap için komisyon nasıl hesaplanır yazısına bakabilirsin.`,
  },
];

const BLOG_HESAPLAMA = `# Trendyol Komisyon Nasıl Hesaplanır? KDV, Stopaj ve Kargo Dahil Tam Rehber

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

Trendyol komisyonu temelde satış fiyatı çarpı kategori oranıdır, ama doğru net kâr için KDV tabanını, stopajı, kargoyu ve hizmet bedelini de hesaba katman gerekir. KDV tabanı konusunda kaynaklar ayrışıyor; bu yüzden iki bazı da görebileceğin bir hesaba güvenmek en sağlıklısı. Kendi ürününde tüm kalemlerle net kârı ve başabaş fiyatı görmek için [Trendyol komisyon ve kâr hesaplayıcısını](/araclar/trendyol-komisyon-hesaplama) kullan; kategori oranları için [komisyon oranları 2026 listesine](/icerik/trendyol-komisyon-oranlari) göz at.`;

const BLOG_HESAPLAMA_SSS = [
  {
    soru: `Trendyol komisyonu KDV dahil mi yoksa KDV hariç fiyattan mı hesaplanır?`,
    cevap: `Kaynaklar ayrışıyor. Çoğu kaynak komisyonun KDV hariç satış matrahından kesildiğini, ardından komisyon tutarına yüzde 20 KDV eklenip faturalandırıldığını söyler; bazı kaynaklar KDV dahil tutarı baz alır. En yaygın yaklaşım KDV hariç matrahtır, ancak iki baz arasında kâr marjı birkaç puan değişebilir.`,
  },
  {
    soru: `Trendyol stopajı kârımı düşürür mü?`,
    cevap: `Stopaj, KDV hariç satış tutarı üzerinden yüzde 1'dir ve Trendyol tarafından kesilir. Ancak bu bir gider değil, yıl sonu vergisinden mahsup edilen peşin ödenmiş vergidir. Bu nedenle nihai kârını azaltmaz; yalnızca yıl içi nakit akışını geçici olarak etkiler.`,
  },
  {
    soru: `Trendyol komisyonuna ayrıca KDV ekleniyor mu?`,
    cevap: `Evet, komisyon tutarının üzerine yüzde 20 KDV eklenip satıcıya faturalandırılır. Ancak bu KDV, KDV mükellefi satıcının beyannamesinde indirilecek KDV olarak geri kazanıldığı için gerçek nakit yük çıplak komisyon tutarıdır.`,
  },
  {
    soru: `Başabaş satış fiyatı nasıl hesaplanır?`,
    cevap: `KDV hariç başabaş fiyat, (KDV hariç alış maliyeti artı kargo artı hizmet bedeli) toplamının (1 eksi komisyon oranı) değerine bölünmesiyle bulunur. Bu fiyatta net kâr sıfırdır; altına satış zarardır. Hesaplayıcı bunu otomatik gösterir.`,
  },
];

const BLOG_KAR = `# Trendyol Kâr Hesaplama: Net Kazancını, Marjını ve Doğru Fiyatı Bulma

Trendyol kâr hesaplama, satış fiyatından ürün maliyetini ve tüm pazaryeri kesintilerini düşüp elinde gerçekten kalan net kazancı bulmaktır. Çoğu satıcı cironun büyüklüğüne bakıp kâr ettiğini sanır; oysa komisyon, KDV, kargo ve hizmet bedeli düşüldükten sonra tablo çok farklı görünebilir. Bu yazıda net kârı nasıl yorumlayacağını, sağlıklı bir kâr marjının ne olduğunu ve doğru satış fiyatını nasıl belirleyeceğini anlatıyorum.

## Net kâr ile ciro neden karıştırılmamalı?

Ciro, müşterinin ödediği toplam tutardır; net kâr ise tüm maliyetler ve kesintiler düştükten sonra cebine giren paradır. Trendyol'da bir ürün 600 TL'ye satıldığında, bunun bir kısmı KDV olarak devlete, bir kısmı komisyon olarak Trendyol'a, bir kısmı kargo ve hizmet bedeline gider; geriye kalanın da içinden ürün maliyetini çıkarman gerekir. Yüksek ciro, düşük hatta negatif kâr ile rahatlıkla bir arada olabilir. Bu yüzden her ürünü tek tek kâr bazında değerlendirmek şarttır.

Net kârı hızlıca görmek için satış fiyatını, maliyeti ve kategoriyi [Trendyol komisyon ve kâr hesaplayıcısına](/araclar/trendyol-komisyon-hesaplama) girip sonucu anında alabilirsin.

## Trendyol net kâr nasıl hesaplanır?

Net kâr, basitçe şu mantıkla çıkar: KDV hariç satış tutarından, KDV hariç ürün maliyetini, komisyonu, kargoyu ve hizmet bedelini çıkarırsın. KDV mükellefi bir satıcı için bu kalemleri KDV hariç çalışmak doğru olandır, çünkü tahsil edilen ve ödenen KDV beyannamede birbirini götürür. Stopajı ise net kârdan düşmemelisin; yüzde 1 stopaj yıl sonu vergisinden mahsup edilen peşin bir vergidir, gider değildir.

Hesabın mekaniğini ve adım adım formülü merak ediyorsan [Trendyol komisyon nasıl hesaplanır](/icerik/trendyol-komisyon-nasil-hesaplanir) yazısında örnekle anlattım. Burada asıl odağımız, çıkan rakamı nasıl yorumlayacağın.

## Kâr marjı kaç olmalı?

Kâr marjı, net kârın satış fiyatına oranıdır ve fiyatlama kararının pusulasıdır. Pazaryeri komisyonları kategoriye göre yüzde 7 ile yüzde 28 arasında değiştiği için, sağlıklı bir marj da kategoriye göre değişir. Komisyonu düşük elektronik ürünlerde dar bir marjla çalışmak mümkünken, komisyonu yüksek aksesuar veya takıda aynı marjı yakalamak için satış fiyatını daha yüksek kurman gerekir.

Aşağıdaki tablo, farklı kategori komisyonlarında aynı maliyet yapısının net kârı nasıl değiştirdiğini gösteriyor (600 TL satış, 240 TL alış, 100 TL kargo, 10,99 TL hizmet bedeli, KDV hariç baz varsayımıyla).

| Komisyon Oranı | Örnek Kategori | Yaklaşık Net Kâr | Yaklaşık Marj |
|---|---|---|---|
| %8 | Elektronik (alt uç) | Daha yüksek | ~%27 |
| %16 | Kozmetik / Pet | Orta | ~%21 |
| %20 | Giyim / Ev | Daha düşük | ~%17,6 |
| %23 | Takı / Aksesuar | En düşük | ~%14 |

Tablo, komisyon oranı arttıkça aynı fiyatta kârın nasıl eridiğini gösteriyor. Bu yüzden yüksek komisyonlu kategorilerde fiyatı ya da maliyeti yönetmek kritik.

## Hedef kâr için doğru satış fiyatını bulmak

Çoğu satıcı fiyatı önce koyup kârı sonra hesaplıyor. Tersini yapmak daha sağlıklı: önce hedeflediğin kâr marjını belirle, sonra o marja ulaşan satış fiyatını bul. Burada başabaş fiyat kavramı işe yarar. Başabaş fiyat, net kârın tam sıfır olduğu fiyattır; yani güvenli alt sınırın. Hedef kârını bu sınırın üzerine eklersin. Örneğin yukarıdaki senaryoda başabaş fiyat KDV dahil yaklaşık 441 TL ise, 600 TL'lik satış sana yaklaşık 159 TL'lik bir tampon bırakır. Hesaplayıcı hem başabaş fiyatı hem mevcut marjını gösterdiği için bu kararı veriye dayandırabilirsin.

## Kampanyalar kârı nasıl etkiler?

Büyük kampanya dönemlerinde (Efsane Günler, Black Friday gibi) asıl risk komisyon oranının değil, zorunlu indirimlerin marjı daraltmasıdır. Bazı kampanyalarda ek katkı payı da çıkabiliyor, ama bunun sabit bir oranı yoktur ve kampanyaya göre değişir. Bir kampanyaya girmeden önce indirimli fiyatı hesaplayıcıya girip net kârın hâlâ pozitif kalıp kalmadığını kontrol et; çünkü ciro hedefi uğruna zararına satış yapmak kolaydır.

### Deneyimimden bir not

Solo geliştirdiğim production ERP sisteminde kârlılık raporlarını kurarken net şunu gördüm: işletmeler en çok "ortalama marj" tuzağına düşüyor. Toplam kâra bakıp idare ediyor sanırken, ürünlerin yarısı zarar, yarısı kâr ediyor ve ortalama yanıltıyor. Doğru yaklaşım, her ürünü kendi başabaş fiyatına göre değerlendirmek ve zarar eden kalemleri ya fiyatla ya maliyetle düzeltmektir. Endüstri mühendisliği tarafında buna katkı payı analizi deniyor; pazaryeri satıcısı için karşılığı tam olarak ürün bazlı net kâr hesabıdır.

## Sonuç

Trendyol kâr hesaplama, ciroya değil ürün bazlı net kazanca bakmaktır. Sağlıklı bir kâr marjı kategoriye ve komisyona göre değişir; bu yüzden önce başabaş fiyatı bulup hedef kârını onun üzerine koymak en güvenli yöntemdir. Kendi ürününde net kârı, marjı ve başabaş fiyatı saniyeler içinde görmek için [komisyon ve kâr hesaplayıcısını](/araclar/trendyol-komisyon-hesaplama) kullan; kategori oranları için [komisyon oranları 2026 listesine](/icerik/trendyol-komisyon-oranlari) bakabilirsin.`;

const BLOG_KAR_SSS = [
  {
    soru: `Trendyol'da kâr nasıl hesaplanır?`,
    cevap: `KDV hariç satış tutarından, KDV hariç ürün maliyetini, komisyonu, kargoyu ve hizmet bedelini çıkararak net kârı bulursun. Stopajı net kârdan düşmemelisin, çünkü o yıl sonu vergisinden mahsup edilen peşin bir vergidir. En hızlı yol, hesaplayıcıya satış fiyatı, maliyet ve kategoriyi girmektir.`,
  },
  {
    soru: `Trendyol'da kâr marjı kaç olmalı?`,
    cevap: `Sağlıklı marj kategoriye ve komisyona göre değişir. Komisyonu düşük elektronikte dar marjla çalışılabilirken, komisyonu yüksek takı ve aksesuarda aynı kârı yakalamak için fiyatı veya maliyeti daha sıkı yönetmek gerekir. Tek bir doğru rakam yoktur; başabaş fiyatın üzerinde bıraktığın tampon belirleyicidir.`,
  },
  {
    soru: `Kampanyaya girince kârım ne olur?`,
    cevap: `Kampanyalarda asıl etki zorunlu indirimin marjı daraltmasıdır; bazı kampanyalarda ek katkı payı da çıkabilir. Kampanyaya girmeden önce indirimli fiyatı hesaplayıcıya girip net kârın pozitif kalıp kalmadığını kontrol etmek, zararına satışı önler.`,
  },
  {
    soru: `Net kâr ile ciro arasındaki fark nedir?`,
    cevap: `Ciro müşterinin ödediği toplam tutardır; net kâr ise KDV, komisyon, kargo, hizmet bedeli ve ürün maliyeti düştükten sonra elinde kalandır. Yüksek ciro düşük hatta negatif kâr ile bir arada olabilir, bu yüzden her ürünü kâr bazında değerlendirmek gerekir.`,
  },
];

/**
 * Trendyol komisyon cluster'ını (1 tool + 3 blog) oluşturur. Idempotent: tool ve
 * 3 blog slug'ı zaten varsa atlar. "E-ticaret" kategorisini ve mevcut yazarı
 * (Ali) yeniden kullanır; yoksa oluşturur. Tüm içerik richtext (Markdown) string.
 */
export async function seedTrendyolKomisyon(strapi: Core.Strapi): Promise<void> {
  const existingTool = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'trendyol-komisyon-hesaplama' },
  });
  const existingOranlari = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'trendyol-komisyon-oranlari' },
  });
  const existingHesaplama = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'trendyol-komisyon-nasil-hesaplanir' },
  });
  const existingKar = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'trendyol-kar-hesaplama' },
  });

  if (existingTool && existingOranlari && existingHesaplama && existingKar) {
    strapi.log.info('[seed] Trendyol komisyon içeriği (tool + 3 blog) zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Trendyol komisyon içeriği oluşturuluyor...');

  const kategori =
    (await strapi.documents('api::kategori.kategori').findFirst({
      filters: { slug: 'e-ticaret' },
    })) ??
    (await strapi.documents('api::kategori.kategori').create({
      data: { ad: 'E-ticaret', slug: 'e-ticaret' },
      status: 'published',
    }));

  const yazar =
    (await strapi.documents('api::yazar.yazar').findFirst()) ??
    (await strapi.documents('api::yazar.yazar').create({
      data: {
        ad: 'Ali',
        unvan: 'METU Endüstri Mühendisliği, production developer',
        bio: 'Production ERP/MRP sistemleri geliştiren, stok ve operasyon araçları üzerine yazan endüstri mühendisi.',
      },
      status: 'published',
    }));

  // --- TOOL ---
  let tool = existingTool;
  if (!tool) {
    tool = await strapi.documents('api::tool.tool').create({
      data: {
        ad: 'Trendyol Komisyon & Kâr Hesaplayıcı',
        slug: 'trendyol-komisyon-hesaplama',
        kisaAciklama:
          'Satış fiyatını, ürün maliyetini ve kategori komisyonunu gir; Trendyol komisyonunu, KDV ve stopaj etkisini, kargo ve hizmet bedelini düşüp net kârını, kâr marjını ve başabaş satış fiyatını anında hesapla. Kategori komisyon oranları 2026 verisiyle hazır gelir, dilersen elle değiştirirsin.',
        formulAciklamasi: TOOL_FORMUL,
        seo: {
          title: 'Trendyol Komisyon Hesaplama 2026: Net Kâr & Komisyon Aracı',
          description:
            'Trendyol komisyon hesaplama aracı: kategoriye göre komisyon, KDV, stopaj, kargo ve hizmet bedelini düşüp net kârını ve başabaş fiyatını ücretsiz hesapla. Kayıt yok.',
        },
        kategori: kategori.documentId,
        sss: TOOL_SSS,
      },
      status: 'published',
    });
    strapi.log.info('[seed] Trendyol komisyon tool kaydı oluşturuldu.');
  }

  // --- BLOG 1: Komisyon oranları ---
  let blogOranlari = existingOranlari;
  if (!blogOranlari) {
    blogOranlari = await strapi.documents('api::blog.blog').create({
      data: {
        baslik: 'Trendyol Komisyon Oranları 2026: Kategori Kategori Güncel Liste',
        slug: 'trendyol-komisyon-oranlari',
        icerik: BLOG_ORANLARI,
        iliskiliTool: tool.documentId,
        seo: {
          title: 'Trendyol Komisyon Oranları 2026: Kategori Kategori Liste',
          description:
            'Trendyol komisyon oranları 2026: giyim, elektronik, kozmetik ve 20 kategori için güncel aralıklar, kaynaklarıyla. Trendyol ne kadar komisyon alıyor, hesaplayıcıyla gör.',
        },
        kategori: kategori.documentId,
        yazar: yazar.documentId,
        sss: BLOG_ORANLARI_SSS,
        yayinTarihi: '2026-06-26T09:00:00.000Z',
        guncellemeTarihi: '2026-06-26T09:00:00.000Z',
      },
      status: 'published',
    });
    strapi.log.info('[seed] Trendyol komisyon oranları blogu oluşturuldu.');
  }

  // --- BLOG 2: Komisyon nasıl hesaplanır ---
  let blogHesaplama = existingHesaplama;
  if (!blogHesaplama) {
    blogHesaplama = await strapi.documents('api::blog.blog').create({
      data: {
        baslik: 'Trendyol Komisyon Nasıl Hesaplanır? KDV, Stopaj ve Kargo Dahil Tam Rehber',
        slug: 'trendyol-komisyon-nasil-hesaplanir',
        icerik: BLOG_HESAPLAMA,
        iliskiliTool: tool.documentId,
        seo: {
          title: 'Trendyol Komisyon Nasıl Hesaplanır? (KDV, Stopaj, Kargo)',
          description:
            'Trendyol satış komisyonu nasıl hesaplanır? KDV hariç mi dahil mi, stopaj, kargo ve hizmet bedeli dahil adım adım formül ve örnek hesap. Hesaplayıcıyla dene.',
        },
        kategori: kategori.documentId,
        yazar: yazar.documentId,
        sss: BLOG_HESAPLAMA_SSS,
        yayinTarihi: '2026-06-26T09:00:00.000Z',
        guncellemeTarihi: '2026-06-26T09:00:00.000Z',
      },
      status: 'published',
    });
    strapi.log.info('[seed] Trendyol komisyon hesaplama blogu oluşturuldu.');
  }

  // --- BLOG 3: Kâr hesaplama ---
  let blogKar = existingKar;
  if (!blogKar) {
    blogKar = await strapi.documents('api::blog.blog').create({
      data: {
        baslik: 'Trendyol Kâr Hesaplama: Net Kazancını, Marjını ve Doğru Fiyatı Bulma',
        slug: 'trendyol-kar-hesaplama',
        icerik: BLOG_KAR,
        iliskiliTool: tool.documentId,
        seo: {
          title: 'Trendyol Kâr Hesaplama: Net Kazanç ve Kâr Marjı Rehberi',
          description:
            'Trendyol kâr hesaplama: net kazancını, kâr marjını ve başabaş fiyatını nasıl bulursun, sağlıklı marj kaçtır, kampanya kârı nasıl etkiler. Ücretsiz hesaplayıcı.',
        },
        kategori: kategori.documentId,
        yazar: yazar.documentId,
        sss: BLOG_KAR_SSS,
        yayinTarihi: '2026-06-26T09:00:00.000Z',
        guncellemeTarihi: '2026-06-26T09:00:00.000Z',
      },
      status: 'published',
    });
    strapi.log.info('[seed] Trendyol kâr hesaplama blogu oluşturuldu.');
  }

  // Tool -> bloglar (oneToMany iliskiliYazilar).
  await strapi.documents('api::tool.tool').update({
    documentId: tool.documentId,
    data: {
      iliskiliYazilar: [
        blogOranlari.documentId,
        blogHesaplama.documentId,
        blogKar.documentId,
      ],
    },
    status: 'published',
  });

  strapi.log.info('[seed] Trendyol komisyon içeriği başarıyla oluşturuldu.');
}
