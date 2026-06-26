# Trendyol Kâr & Komisyon Hesaplayıcı — Veri & Formül Paketi

**Hazırlanma tarihi:** 26.06.2026
**Amaç:** stokoloji.com "Trendyol Kâr & Komisyon Hesaplayıcı" aracının besleneceği güncel, kaynaklı veri ve hesaplama mantığı. (Bu doküman kod değildir; kodu Ali yazacak.)

> ## ⚠️ EN ÖNEMLİ UYARI — ARAÇTA DA GÖSTERİLMELİ
> Trendyol komisyon oranları **resmi/bağlayıcı değildir.** Oranlar **alt kategori, ürün grubu, marka, satıcı seviyesi (1–5), kadın girişimci/kooperatif programları, kampanya dönemi ve bireysel sözleşmeye** göre değişir. Bağlayıcı tek kaynak satıcının **Trendyol Satıcı Paneli > Anlaşma Bilgileri** ekranıdır (login gerektirir, dışarıdan doğrulanamaz). Trendyol Akademi sayfası (akademi.trendyol.com) JS ile yüklenip panele yönlendirdiği için herkese açık sayısal kategori tablosu yayınlamıyor. Bu nedenle aşağıdaki **tüm sayısal oranlar ikincil (e-ticaret entegrasyon firması) kaynaklardan** derlenmiştir ve **aralık** olarak verilmiştir. Araçta her oranın yanında "tahmini / kaynak: X / son güncelleme: tarih" ibaresi ve panelden doğrulama uyarısı bulunmalıdır.

---

## 1. Kategori Bazlı Komisyon Tablosu (2026)

| Kategori | Komisyon Aralığı (%) | Örnek Ürünler | Kaynak + Tarih |
|---|---|---|---|
| **Giyim (kadın/erkek/çocuk)** | %17 – %21,36 ⚠️çelişki | Üst/alt giyim, iç giyim, dış giyim, spor giyim | IdeaSoft 06.02.2026 (%21,36); Yengeç 26.02.2026 (%21,36); Ticimax 20.04.2026 (%17–20) |
| **Ayakkabı** | ~%23,39 (Ticimax aksesuar bandı %19–20) | Tüm ayakkabı türleri | IdeaSoft 06.02.2026; Yengeç 26.02.2026 (%23,39) |
| **Çanta & Aksesuar** | %20,34 – %23 | Çanta %21,36; atkı/bere/şal %21,36; kemer/şapka/saç aks. %22,37; saat %21,36 | IdeaSoft 06.02.2026; Yengeç 26.02.2026; Ticimax 20.04.2026 (%22–23) |
| **Takı** | ~%22,37 | Bijuteri, gümüş bileklik/kolye/küpe, çelik takı, choker | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Elektronik** | %7 – %28 | Telefon %7; TV %8; oyun konsolu %8; telefon yedek parça %27 | Ticimax 20.04.2026 (%7–28); IdeaSoft & Yengeç (kalem bazlı) |
| **Bilgisayar & Tablet** | %7,5 – %15,5 | Dizüstü/oyuncu PC %7,5; bilgisayar yedek parça %15,5; tablet aks. %22 | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Telefon Aksesuar** | %15 – %27 | Telefon kılıf/batarya/ekran/kamera %27; genel aksesuar %15–25 | IdeaSoft & Yengeç (%27 parça); Ticimax (%15–25) |
| **Kozmetik & Parfüm** | %12 – %17,5 | Cilt/ağız bakım %16,78; makyaj; parfüm | Ticimax 20.04.2026 (%12–17,5); IdeaSoft & Yengeç (%16,78) |
| **Kişisel Bakım** | %16,78 – %17,5 | Epilatör/saç düzleştirici/maşa %17,5; ağda; cilt bakım %16,78 | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Ev & Yaşam** | %11 – %21,36 | Avize/aydınlatma %21,36; ev tekstili %20,34; beyaz eşya %11 | IdeaSoft & Yengeç; Ticimax (%11–21) |
| **Mutfak & Küçük Ev Aletleri** | %11 – %19,32 | Mutfak gereçleri/sofra/pişirme %19,32; küçük ev aletleri %15; beyaz eşya %11 | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Anne & Bebek** | ~%16,5 | Bebek arabası/puset/oto koltuğu; emzirme ürünleri; bebek banyo eşyaları | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Kitap & Kırtasiye** | ⚠️ **Trendyol-özel net oran bulunamadı** | Kitap, kırtasiye; sadece "sanatsal kağıt/kalem %16,78" teyitli | Ticimax %7–17 = **Hepsiburada verisi**, Trendyol değil; IdeaSoft & Yengeç sadece sanatsal malzeme |
| **Oyuncak & Hobi** | ~%16,5 | Çocuk ve bebek oyuncakları | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Spor & Outdoor** | %10,5 – %15 | Spor giyim/aletleri, bisiklet/paten, outdoor | Ticimax 20.04.2026 (%10,5–15) |
| **Bahçe & Yapı Market** | %15,5 – %17,5 | Bahçe dekorasyonu/havuz %17,5; el aletleri/elektrikli el aletleri %15,5 | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Gıda & İçecek (Süpermarket)** | %8 – %18 (kalem bazlı ~%15,25) | Atıştırmalık, kuru gıda, süt & kahvaltılık %15,25 | Ticimax 20.04.2026 (%8–18); IdeaSoft & Yengeç (%15,25) |
| **Pet Shop** | ~%15,25 | Köpek kuru/konserve maması | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Otomotiv Aksesuar** | ~%16,5 | Oto bakım / temizlik ürünleri | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |
| **Sağlık & Wellness** | ~%17,29 | Hasta bezi ve temizlik ürünleri | IdeaSoft 06.02.2026; Yengeç 26.02.2026 |

**Genel aralık (tüm kategoriler):** Kaynaklar tüm Trendyol komisyonlarını yaklaşık **%5 – %28** aralığında veriyor. En düşük: dijital hediye kartı %5, akıllı telefon %7. En yüksek: telefon yedek parça %27, takı/aksesuar ~%22–23.

**Özel oranlar (kategori dışı, fiyatlamada hatırlat):** Kadın girişimci/kooperatif programları %1,80–%5,50; Seviye 4 satıcılar genel orandan ~%2,5–7 düşük; Seviye 5 satıcılar ~%2,5–10 düşük; bazı markalar (Adidas/Nike spor giyimde %15,25 vs genel %21,36) indirimli. (Kaynak: IdeaSoft 06.02.2026)

### Kaynaklar arası çelişkiler (uydurma ortalama verilmedi)

1. **Giyim (en belirgin):** IdeaSoft + Yengeç tek oran %21,36 derken Ticimax %17–20 bandı veriyor. İki bağımsız blok farklı söylüyor — araçta aralık olarak bırak.
2. **Ayakkabı:** IdeaSoft/Yengeç %23,39; Ticimax'ın açık tablosunda ayrı satır yok. Ticimax'ta görülen %19,49 değeri **Hepsiburada** içindir, Trendyol değil — karıştırma.
3. **Kitap & Kırtasiye:** Hiçbir kaynakta Trendyol'a özel net kitap oranı yok. %7–17 bandı Hepsiburada verisi. **Veri bulunamadı — tahmin edilmedi.**
4. **Pazaryeri karışması:** Ticimax üç pazaryerini birlikte listeliyor; bazı spesifik oranlar (TV %6,78, altın %6 vb.) Hepsiburada'dan. Yalnızca Ticimax'ın "Trendyol" bölümündeki bantlar kullanıldı.
5. **KDV tabanı çelişkisi:** Bkz. Bölüm 3 — bu, formülü doğrudan etkilediği için ayrı ele alındı.

---

## 2. Komisyon Dışı Kesinti Kalemleri

### 2.1 Platform Hizmet Bedeli (gönderi başı sabit)
Trendyol komisyondan **ayrı**, **gönderi başına sabit** "Platform Hizmet Bedeli" alıyor; kategoriden bağımsız, gönderim hızına bağlı.
- "Bugün Kargoda" / aynı gün taşımaya geçen gönderiler: **6,99 TL + KDV**
- Etiketsiz / aynı gün taşımaya geçmeyen gönderiler: **10,99 TL + KDV**
- Güncelleme: 30.01.2026. İade paketlerinde uygulanmaz.
- **Mikro ihracat:** ürün başına KDV dahil satış fiyatı üzerinden **%6 Uluslararası Hizmet Bedeli** (sadece mikro ihracatçı).
- ⚠️ **Çelişki:** Faturaport (Nisan 2026) aynı kalemi 8,49 / 5,49 TL + KDV veriyor (muhtemelen eski tarife). En güncel ve en çok tekrarlanan değerler **6,99 / 10,99 TL + KDV.** Panelden doğrula.
- Kaynak: eticaretmerkezim, pazarfiyat (Trendyol duyuru metnini alıntılıyor), 26.06.2026. *Not: akademi.trendyol.com sayfası JS-render olduğundan ham veri çekilemedi.*

### 2.2 Kargo Bedeli
- **Desi formülü:** (En × Boy × Yükseklik cm) / 3000. Kargo firması, ağırlık (kg) ile hacim-desi'den **büyük olanı** baz alır.
- **Kim öder:** Genel olarak **satıcı**; hak edişten düşülür, toplu faturalanır.
- **Barem sistemi:** 0–299,99 TL siparişler "Barem"e girer (indirimli kargo); 300 TL üstü veya 10 desi üstü gönderilerde standart anlaşmalı tarife.
- ⚠️ **Ciddi çelişki (desi tarifesi):** İki kaynak grubu uyuşmuyor.
  - *Yüksek (anlaşmalı liste fiyatı):* 1 desi Trendyol Express ~77,54 TL + KDV; Aras 0–2 desi 83,93 TL + KDV; aralık 77,54 – 594,46 TL (Faturaport, Sentos).
  - *Düşük (Barem/satıcıya yansıyan net):* 0–1 desi 20–25 TL; 2–3 desi 25–30 TL; 11–20 desi 55–90 TL (satisanaliz, kendisi "tahmini" notu düşmüş).
  - Olası açıklama: yüksek = standart liste tarifesi, düşük = Barem/Trendyol katkısı sonrası satıcıya yansıyan net. **Araçta kargoyu kullanıcının elle gireceği bir alan yap; sabit tarife gömme.** İki senaryoyu (liste vs barem) opsiyon olarak sunmak ayrıştırıcı olur.
- **Ücretsiz kargo eşikleri (tahmini):** 150 TL üstü kısmi, 300 TL üstü büyük çoğunluk, 500 TL üstü bazı kategorilerde tam katkı. Panelden doğrula.
- Kaynak: satisanaliz 11.04.2026, sentos, faturaport, 26.06.2026.

### 2.3 Stopaj / Vergisel Kesinti (en güvenilir kalem — resmi mevzuat)
- **Oran: %1 vergi tevkifatı (stopaj).** Dayanak: 21.12.2024 tarih 9284 sayılı CB Kararı + 330 No.lu GVK Genel Tebliği. Yürürlük 01.01.2025.
- **Matrah: KDV hariç satış tutarı** (komisyon/kargo/banka komisyonu matrahı değiştirmez; brüt satış matrahı, kesinti öncesi).
- **Nasıl:** Trendyol keser ve devlete yatırır. Satıcı bunu **kendi gelir/kurumlar vergisinden mahsup eder** — yani **gider değil, peşin ödenen vergidir.** Nihai kârı azaltmaz; nakit akışını geçici etkiler.
- **İstisna:** Kapıda nakit/EFT-POS ile tahsil edilen satışlarda kesilmez.
- Kaynak: muhasebenews.com (330 No.lu GVK Tebliği), dopigo, parasut, 26.06.2026.

### 2.4 İade Maliyetleri
- **Komisyon iadesi:** İade onaylanınca kesilen komisyon **nakit geri ödenmez**; bir sonraki komisyon faturasından **mahsup edilir** (sonuçta satıcıya döner, gecikmeli).
- **İade kargosu:** 2026 düzenlemesiyle tüketiciden iade kargo ücreti talebi yasaklandı → **iade kargo maliyeti satıcıya geçti.** Trendyol'da satıcıya faturalanır.
  - ⚠️ Çelişki: satisanaliz, satıcı-kaynaklı (kusurlu ürün) vs müşteri-kaynaklı (cayma) iade ayrımı yapıyordu; 2026 yönetmeliğiyle bu nüans satıcı aleyhine daralmış görünüyor. Panelden teyit.
- **Hizmet bedeli:** İade paketlerinde uygulanmaz.
- Kaynak: faturaport, bizimhesap, eleman.net (2026 yönetmeliği), yengec, 26.06.2026.

### 2.5 Kampanya Katılım Ücretleri
- Büyük kampanya dönemlerinde (Efsane Günler, Black Friday vb.) standart komisyona ek **"kampanya katkı payı"** ve/veya zorunlu indirim koşulu uygulanabiliyor. Asıl marj etkisi zorunlu indirimden gelir; oranın kendisi değişmeyebilir.
- ⚠️ **Net TL/oran rakamı bulunamadı** — kampanya ve kategoriye göre değişiyor, sabit değer üçüncü parti kaynaklarda yok. **Tahmin edilmedi.** Araçta opsiyonel manuel alan olarak bırak.
- Kaynak: karpanel.app, faturaport, 26.06.2026.

---

## 3. Hesaplama Formülü (KDV tabanı net belirtilmiş)

### 3.1 KRİTİK — Komisyon hangi taban üzerinden? (kaynaklar çelişiyor)

Bu, aracın doğruluğunu belirleyen tek en önemli karar. İki ayrı soru karıştırılıyor:

**Soru A — Komisyon % hangi fiyata uygulanır?** (KDV dahil mi, KDV hariç matrah mı?)
- **KDV hariç matrah görüşü:** Faturaport (Nisan 2026) ve Sentos açıkça "komisyon, ürünün **KDV hariç** satış fiyatı üzerinden hesaplanır" diyor.
- **KDV dahil görüşü:** Ticimax (20.04.2026), komisyonun "**KDV dahil satış tutarı** üzerinden" kesildiğini söylüyor.
- **➜ Sonuç:** Kaynaklar **çelişiyor.** Tek bir "doğru"yu dayatmak yanlış olur. **Öneri:** Aracı KDV tabanını **kullanıcının seçebileceği bir parametre** olarak kur (varsayılan: KDV hariç matrah — daha çok kaynak bunu söylüyor ve mantıken komisyon faturası matrah üzerinden kesilir), ama "KDV dahil baz" seçeneğini de sun ve farkı göster. Aşağıdaki örnekte iki senaryonun marjı **%17,6 vs %14,3** çıkıyor — fark küçük değil.

**Soru B — Komisyonun üstüne ayrıca KDV ekleniyor mu?** Evet. Komisyon tutarına **%20 komisyon-KDV'si** eklenip satıcıya faturalanır. ANCAK bu KDV satıcının KDV beyannamesinde **indirilecek KDV** olarak geri kazanılır → **gerçek nakit yükü komisyonun kendisidir** (KDV'si nötr). Nakit akışında önce çıkar, beyanla geri gelir.

### 3.2 Notasyon
- `Sd` = KDV dahil satış fiyatı (müşterinin ödediği)
- `Sh` = KDV hariç satış matrahı = `Sd / (1+v)` , `v` = KDV oranı (0,20 / 0,10 / 0,01)
- `Ad` = KDV dahil alış maliyeti; `Ah` = `Ad / (1+v)`
- `k` = komisyon oranı (çıplak); `base` = "haric" | "dahil"
- `Kd` = kargo bedeli (KDV dahil, kullanıcı girer); `Kh` = `Kd / (1+v)`
- `H` = platform hizmet bedeli, KDV hariç (6,99 veya 10,99)

### 3.3 Adımlar
```
Adım 1  Sh = Sd / (1+v)
Adım 2  Komisyon = (base=="haric") ? Sh * k : Sd * k       # KDV'si nötr olduğu için çıplak tutar nakit yüküdür
Adım 3  Stopaj = Sh * 0.01                                  # peşin vergi; mahsup edilebilir → "bilgi" olarak göster, nihai kârdan düşme (opsiyonel)
Adım 4  Toplam Kesinti = Komisyon + H + Kh + Stopaj         # (komisyon/hizmet/kargo KDV'leri indirilebilir, nötr)
Adım 5  Net Kâr = Sh - Ah - Komisyon - H - Kh               # KDV nötr modeli; alış da KDV hariç alınır
Adım 6  Kâr Marjı (%) = Net Kâr / Sd * 100
Adım 7  Başabaş (KDV hariç) = (Ah + Kh + H) / (1 - k)       # base=="haric" için
        Başabaş (KDV dahil)  = Başabaş(haric) * (1+v)
```
> **Stopaj notu:** Stopaj gider değil, mahsup edilen peşin vergidir. Net kâr satırından düşmek teknik olarak yanlış olur; ayrı bir "nakit akışı / yıl içi tahsil edilen" bilgi satırında göstermek daha doğru. Araçta toggle bırak.

> **KDV notu:** Yukarıdaki "KDV nötr" model (her şeyi KDV hariç çalış) satıcı KDV mükellefiyse doğrudur — tahsil edilen KDV devlete gider, ödenen KDV'ler indirilir, ikisi de kârı etkilemez. Mükellef olmayan/basit usul satıcı için KDV bir maliyettir; o senaryoda KDV dahil rakamlarla çalışılmalı. Araçta "KDV mükellefiyim" toggle'ı bunu çözer.

### 3.4 Doğrulanmış örnek hesap
Girdiler: `Sd=600`, `Ad=240` (KDV dahil alış), `k=%20`, `Kd=100` (KDV dahil kargo), `H=10,99`, `v=%20`.

| Senaryo | Sh | Komisyon | Net Kâr | Marj |
|---|---|---|---|---|
| **KDV hariç taban** (önerilen varsayılan) | 500,00 | 100,00 | **105,68 TL** | **%17,61** |
| **KDV dahil taban** (Ticimax görüşü) | 500,00 | 120,00 | 85,68 TL | %14,28 |

**Başabaş fiyat (KDV hariç taban):** KDV hariç **367,90 TL** → KDV dahil **441,49 TL.** Bu fiyatta satıldığında net kâr = 0,00 TL, marj = %0 (programatik olarak doğrulandı). Bu fiyatın altına satış zarardır.

*(Hesaplar `python3` ile doğrulandı; iki senaryonun ayrışması ve başabaş noktasında kârın tam sıfır olması teyit edildi.)*

---

## 4. Makine-Okunur Veri (JSON)

> `min`/`max` = çıplak komisyon oranı yüzdesi. `kdv_default` = kategorinin yaygın KDV oranı (Trendyol satışında çoğu üründe %20; gıda/kitap gibi istisnalar belirtildi). `not` alanı çelişki/veri durumunu kodda göstermek için. **Tüm oranlar tahmini; bağlayıcı değildir.**

```json
{
  "_meta": {
    "kaynak_tarih": "2026-06-26",
    "uyari": "Oranlar resmi/baglayici degil; aralik olarak verilmistir. Baglayici kaynak: Trendyol Satici Paneli > Anlasma Bilgileri.",
    "kaynaklar": ["IdeaSoft 06.02.2026", "Yengec 26.02.2026", "Ticimax 20.04.2026"],
    "komisyon_kdv_tabani": "celiskili: Faturaport/Sentos=KDV haric, Ticimax=KDV dahil. Varsayilan: haric.",
    "komisyon_uzerine_kdv": 0.20,
    "stopaj": 0.01,
    "platform_hizmet_bedeli_haric": { "bugun_kargoda": 6.99, "standart": 10.99 }
  },
  "kategoriler": {
    "giyim":               { "min": 17.0, "max": 21.36, "kdv_default": 20, "not": "celiski: Ticimax %17-20, IdeaSoft/Yengec %21.36" },
    "ayakkabi":            { "min": 19.0, "max": 23.39, "kdv_default": 20, "not": "IdeaSoft/Yengec %23.39" },
    "canta_aksesuar":      { "min": 20.34, "max": 23.0, "kdv_default": 20, "not": null },
    "taki":                { "min": 21.36, "max": 22.37, "kdv_default": 20, "not": null },
    "elektronik":          { "min": 7.0, "max": 28.0, "kdv_default": 20, "not": "genis bant: telefon %7, yedek parca %27" },
    "bilgisayar_tablet":   { "min": 7.5, "max": 15.5, "kdv_default": 20, "not": null },
    "telefon_aksesuar":    { "min": 15.0, "max": 27.0, "kdv_default": 20, "not": null },
    "kozmetik_parfum":     { "min": 12.0, "max": 17.5, "kdv_default": 20, "not": null },
    "kisisel_bakim":       { "min": 16.78, "max": 17.5, "kdv_default": 20, "not": null },
    "ev_yasam":            { "min": 11.0, "max": 21.36, "kdv_default": 20, "not": "beyaz esya alt ucu %11" },
    "mutfak_kucuk_ev":     { "min": 11.0, "max": 19.32, "kdv_default": 20, "not": null },
    "anne_bebek":          { "min": 16.5, "max": 16.5, "kdv_default": 20, "not": "tek nokta deger" },
    "kitap_kirtasiye":     { "min": null, "max": null, "kdv_default": 10, "not": "VERI BULUNAMADI: Trendyol-ozel net oran yok; %7-17 Hepsiburada verisi" },
    "oyuncak_hobi":        { "min": 16.5, "max": 16.5, "kdv_default": 20, "not": null },
    "spor_outdoor":        { "min": 10.5, "max": 15.0, "kdv_default": 20, "not": null },
    "bahce_yapi_market":   { "min": 15.5, "max": 17.5, "kdv_default": 20, "not": null },
    "gida_icecek":         { "min": 8.0, "max": 18.0, "kdv_default": 1, "not": "kalem bazli ~%15.25; KDV gidada degisken (%1/%10/%20)" },
    "pet_shop":            { "min": 15.25, "max": 15.25, "kdv_default": 20, "not": "tek nokta deger" },
    "otomotiv_aksesuar":   { "min": 16.5, "max": 16.5, "kdv_default": 20, "not": "tek nokta deger" },
    "saglik_wellness":     { "min": 17.29, "max": 17.29, "kdv_default": 20, "not": "tek nokta deger" }
  }
}
```

---

## 5. Rakip Notları (ayrışma fırsatları için)

- **KarPanel (karpanel.app):** Asıl ürün API bağlamalı abonelik SaaS (349–1.299₺); ücretsiz hesaplayıcı arayanı kayıt+API hunisine sokuyor. Statik kaynaklı oran tablosu landing'de yok. *Güçlü yanı:* içerik/E-E-A-T (stopaj, KDV, kargo anlatan 6 güncel blog) — en ciddi içerik rakibi.
- **Beekod (beekod.com):** Kayıtsız tek ekran hesaplayıcı ama sadece **8 kaba kategori**; "oranlar tahmini" deyip kaynak/tarih vermiyor. **KDV ve stopaj ayrımı yok**, break-even yok, eğitici içerik yok. Lead toplama yan ürünü.
- **SatışAnaliz (satisanaliz.com):** Hesaplayıcılar tamamen **login arkasında** (anonim "hemen hesapla" niyetini karşılamıyor). Kâr hesabı ikincil özellik; asıl konum satış verisi analizi.
- **Sentos (sentos.com.tr):** İçerik tarafı en güçlü rakip (doğru "komisyon KDV hariçten kesilir" bilgisi, kategori örnekleri, SSS, 25.06.2026 güncel). *Zayıf:* hesaplayıcı iframe/JS, her CTA demo/WhatsApp lead hunisine yönlendiriyor, menü dağınık.
- **trendyolkomisyonhesaplama.com:** Sade kayıtsız araç; **kategori seçimi yok** (komisyonu kullanıcı elle giriyor → en büyük intent'i kaçırıyor), kaynak/içerik yok. Tek artısı "kâr hedefleme" (ters hesap) özelliği.

**Stokoloji'nin ayrışma alanları:** (1) güncel + **kaynak & tarih gösterilen** geniş kategori listesi; (2) tüm kesintiler ayrı satırda + **doğru KDV mantığı** (rakiplerin çoğu yanlış); (3) hem break-even hem "hedef kâr için kaça satmalıyım" ters hesap; (4) **kayıt/lead hunisi yok**, sade CWV-dostu UX; (5) arkasında gerçek eğitici blog + yazar kutusu (E-E-A-T) — stokoloji'nin "araç+blog çifti" modeline birebir oturur.

---

## 6. Kaynak Listesi (erişim: 26.06.2026)

**Komisyon oranları**
- Trendyol Akademi (RESMİ, JS-render, sayısal tablo alınamadı) — https://akademi.trendyol.com/satici-bilgi-merkezi/detay/trendyol-komisyonlari
- IdeaSoft (güncelleme 06.02.2026) — https://www.ideasoft.com.tr/trendyol-komisyon-oranlari/
- Yengeç (güncelleme 26.02.2026) — https://yengec.co/blog/trendyol-komisyon-oranlari/
- Ticimax (güncelleme 20.04.2026) — https://www.ticimax.com/blog/pazaryerleri-komisyon-oranlari
- eticaretmerkezim (05.01.2026) — https://www.eticaretmerkezim.com/trendyol-komisyon-oranlari-2026-kategorilere-gore-guncel-liste-hesaplama/

**Kesintiler / formül / KDV**
- Faturaport (Nisan 2026, formül + KDV tabanı) — https://faturaport.com/blog/on-muhasebe/2026-trendyol-kar-hesaplama-komisyon-kargo-kdv-ve-net-kazanc-rehberi
- Sentos (komisyon KDV hariç teyit) — https://www.sentos.com.tr/trendyol-komisyon-oranlari/
- pazarfiyat (hizmet bedeli) — https://pazarfiyat.com/blog/51-trendyol-platform-hizmet-bedeli-2026
- satisanaliz (kargo desi) — https://satisanaliz.com/blog/trendyol-kargo-ucretleri-2026
- Sentos (kargo) — https://www.sentos.com.tr/trendyol-kargo-ucretleri-ve-kargo-entegrasyonu/

**Stopaj / vergi (resmi mevzuat)**
- muhasebenews (330 No.lu GVK Tebliği, 9284 sayılı CB Kararı) — https://www.muhasebenews.com/trendyol-ve-yemek-sepeti-gibi-e-ticaret-sitelerinden-yapilan-satislardaki-stopaj-uygulamasi-nasil-olacak/
- dopigo (2026 stopaj) — https://www.dopigo.com/2026-stopaj-kesintisi-ve-duzenlemeler/

**İade / yönetmelik**
- eleman.net (iade kargo 2026 yönetmeliği) — https://www.eleman.net/is-rehberi/mevzuatlar/iade-kargo-ucreti-h14544
- yengec (kargo/iade) — https://yengec.co/blog/trendyol-kargo-ucretleri/

**Rakip araçlar**
- https://karpanel.app/ · https://beekod.com/tr/tools/trendyol-komisyon · https://satisanaliz.com/ · https://www.sentos.com.tr/trendyol-komisyon-hesaplama/ · https://trendyolkomisyonhesaplama.com/

---

### Özet: araca taşınması gereken 3 kritik karar
1. **KDV tabanı bir parametre olmalı** (varsayılan KDV hariç) — kaynaklar çelişiyor, kullanıcıya bırak ve farkı göster.
2. **Kargo elle girilmeli** — resmi desi tarifesi yok, iki çelişen senaryo var; sabit tablo gömme.
3. **Stopaj "bilgi/nakit akışı" satırı** olmalı, net kârdan düşülmemeli (mahsup edilen peşin vergi).
