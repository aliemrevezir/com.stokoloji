# BLOG: Trendyol Kâr Hesaplama: Net Kazanç, Kâr Marjı ve Fiyatlama

> Strapi `Blog` kaydı. Hedef keyword: **trendyol kar hesaplama** (1.900/ay, KD 10).
> Açı farkı (cannibalization önleme): mekanik formül 02 numaralı yazıda; bu yazı kârlılık, marj yorumu ve fiyatlama kararı odaklı.
> Veri kaynağı: `trendyol-komisyon-veri-paketi.md`.

---

## Strapi alanları

**baslik:** Trendyol Kâr Hesaplama: Net Kazancını, Marjını ve Doğru Fiyatı Bulma

**slug:** `trendyol-kar-hesaplama`

**kategori:** E-ticaret / Pazaryeri

**yazar:** Ali (METU Endüstri Mühendisliği, production ERP/MRP geliştiricisi)

**iliskiliTool:** `trendyol-komisyon-hesaplama`

**yayinTarihi:** 2026-06-26
**guncellemeTarihi:** 2026-06-26

### seo.meta

**title:** Trendyol Kâr Hesaplama: Net Kazanç ve Kâr Marjı Rehberi

**description:** Trendyol kâr hesaplama: net kazancını, kâr marjını ve başabaş fiyatını nasıl bulursun, sağlıklı marj kaçtır, kampanya kârı nasıl etkiler. Ücretsiz hesaplayıcı.

---

## icerik (richtext / Markdown gövde)

# Trendyol Kâr Hesaplama: Net Kazancını, Marjını ve Doğru Fiyatı Bulma

Trendyol kâr hesaplama, satış fiyatından ürün maliyetini ve tüm pazaryeri kesintilerini düşüp elinde gerçekten kalan net kazancı bulmaktır. Çoğu satıcı cironun büyüklüğüne bakıp kâr ettiğini sanır; oysa komisyon, KDV, kargo ve hizmet bedeli düşüldükten sonra tablo çok farklı görünebilir. Bu yazıda net kârı nasıl yorumlayacağını, sağlıklı bir kâr marjının ne olduğunu ve doğru satış fiyatını nasıl belirleyeceğini anlatıyorum.

## Net kâr ile ciro neden karıştırılmamalı?

Ciro, müşterinin ödediği toplam tutardır; net kâr ise tüm maliyetler ve kesintiler düştükten sonra cebine giren paradır. Trendyol'da bir ürün 600 TL'ye satıldığında, bunun bir kısmı KDV olarak devlete, bir kısmı komisyon olarak Trendyol'a, bir kısmı kargo ve hizmet bedeline gider; geriye kalanın da içinden ürün maliyetini çıkarman gerekir. Yüksek ciro, düşük hatta negatif kâr ile rahatlıkla bir arada olabilir. Bu yüzden her ürünü tek tek kâr bazında değerlendirmek şarttır.

Net kârı hızlıca görmek için satış fiyatını, maliyeti ve kategoriyi [Trendyol komisyon ve kâr hesaplayıcısına](/araclar/trendyol-komisyon-hesaplama) girip sonucu anında alabilirsin.

## Trendyol net kâr nasıl hesaplanır?

Net kâr, basitçe şu mantıkla çıkar: KDV hariç satış tutarından, KDV hariç ürün maliyetini, komisyonu, kargoyu ve hizmet bedelini çıkarırsın. KDV mükellefi bir satıcı için bu kalemleri KDV hariç çalışmak doğru olandır, çünkü tahsil edilen ve ödenen KDV beyannamede birbirini götürür. Stopajı ise net kârdan düşmemelisin; yüzde 1 stopaj yıl sonu vergisinden mahsup edilen peşin bir vergidir, gider değildir.

Hesabın mekaniğini ve adım adım formülü merak ediyorsan [Trendyol komisyon nasıl hesaplanır](/blog/trendyol-komisyon-nasil-hesaplanir) yazısında örnekle anlattım. Burada asıl odağımız, çıkan rakamı nasıl yorumlayacağın.

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

Trendyol kâr hesaplama, ciroya değil ürün bazlı net kazanca bakmaktır. Sağlıklı bir kâr marjı kategoriye ve komisyona göre değişir; bu yüzden önce başabaş fiyatı bulup hedef kârını onun üzerine koymak en güvenli yöntemdir. Kendi ürününde net kârı, marjı ve başabaş fiyatı saniyeler içinde görmek için [komisyon ve kâr hesaplayıcısını](/araclar/trendyol-komisyon-hesaplama) kullan; kategori oranları için [komisyon oranları 2026 listesine](/blog/trendyol-komisyon-oranlari) bakabilirsin.

### sss (content.sss)

**soru:** Trendyol'da kâr nasıl hesaplanır?
**cevap:** KDV hariç satış tutarından, KDV hariç ürün maliyetini, komisyonu, kargoyu ve hizmet bedelini çıkararak net kârı bulursun. Stopajı net kârdan düşmemelisin, çünkü o yıl sonu vergisinden mahsup edilen peşin bir vergidir. En hızlı yol, hesaplayıcıya satış fiyatı, maliyet ve kategoriyi girmektir.

**soru:** Trendyol'da kâr marjı kaç olmalı?
**cevap:** Sağlıklı marj kategoriye ve komisyona göre değişir. Komisyonu düşük elektronikte dar marjla çalışılabilirken, komisyonu yüksek takı ve aksesuarda aynı kârı yakalamak için fiyatı veya maliyeti daha sıkı yönetmek gerekir. Tek bir doğru rakam yoktur; başabaş fiyatın üzerinde bıraktığın tampon belirleyicidir.

**soru:** Kampanyaya girince kârım ne olur?
**cevap:** Kampanyalarda asıl etki zorunlu indirimin marjı daraltmasıdır; bazı kampanyalarda ek katkı payı da çıkabilir. Kampanyaya girmeden önce indirimli fiyatı hesaplayıcıya girip net kârın pozitif kalıp kalmadığını kontrol etmek, zararına satışı önler.

**soru:** Net kâr ile ciro arasındaki fark nedir?
**cevap:** Ciro müşterinin ödediği toplam tutardır; net kâr ise KDV, komisyon, kargo, hizmet bedeli ve ürün maliyeti düştükten sonra elinde kalandır. Yüksek ciro düşük hatta negatif kâr ile bir arada olabilir, bu yüzden her ürünü kâr bazında değerlendirmek gerekir.
