# Stokoloji — Claude Design Prompt (Premium Editoryal Magazin Teması)

> **Kullanım:** Aşağıdaki "PROMPT" bloğunun tamamını Claude Design'a tek seferde ver. Hedef: tek tek sayfa değil, **bütünsel bir tema** — premium bir WordPress magazin teması (SmartMag, Newspaper, Foxiz kalitesinde) gibi, ama bir haber sitesi değil **stok/üretim yönetimi otorite + hesaplayıcı platformu**. Önce tema kimliğini ve design system'i kur, sonra sayfaları aynı sistemden türet. Çıktı yüksek sadakatli (high-fidelity), masaüstü + mobil.

---

# PROMPT

## ROL & KALİTE ÇITASI

Sen kıdemli bir art director + product designer'sın. **Stokoloji** için (stokoloji.com — Türkçe stok ve üretim yönetimi otorite sitesi) **eksiksiz, profesyonel bir tema** tasarla. Çıktı, ThemeForest'taki en çok satan premium magazin temaları kalitesinde olmalı: tutarlı design system, zengin ama düzenli editoryal grid, keskin tipografi hiyerarşisi, her component'in tüm durumlarıyla tanımlı olması. "Birkaç sayfa mockup" değil, **satılabilir bir tema** üret.

Bu bir haber/magazin sitesi DEĞİL: hem interaktif hesaplayıcı tool'lar (EOQ, emniyet stoğu, ROP, ABC analizi, stok devir hızı) hem bunları öğreten blog içeriği barındıran bir **mühendislik otorite platformu**. SmartMag-vari editoryal zenginliği al; magazin sitesinin güven düşüren kısımlarını (clickbait, reklam tıkışıklığı, dağınık palet) alma. Karakter: **otoriter, ölçülü, mühendislik güveni veren, ama sıcak ve okunabilir.**

Hedef kitle: EM/işletme öğrencisi, junior üretim planlama / satın alma uzmanı, KOBİ sahibi. Dil: **Türkçe** (tüm UI + içerik; teknik terimler İngilizce: EOQ, ROP, ABC).

---

## 1. SANAT YÖNÜ (art direction)

Tema kişiliği üç kelime: **otorite, netlik, derinlik.** Referans his: bir mühendislik dergisinin editoryal ciddiyeti + modern bir SaaS ürününün düzeni. Bol beyaz alan ama "boş" değil; her ekran bilgi yoğun ama nefes alıyor. Magazin ritmi (öne çıkan blok → kategori şeritleri → kart gridleri) korunur, fakat her blok bir amaca hizmet eder (tool veya yazıya yönlendirme).

Kaçın: gradient bombardımanı, çok renkli magazin paleti, dekoratif stok görsel yığını, otomatik karusel, kenar reklam slotları, em dash.

---

## 2. DESIGN SYSTEM — TEMELLER

### 2.1 Renk sistemi
**Yapısal marka (petrol/koyu lacivert) — UI iskeleti, başlık, nav, footer:**
`#0f2a43` (ink/ana), `#163a5c`, `#1e4e79`, açık `#d6e4f0`, en açık `#eef4fa`.

**Aksiyon rengi (teal) — SADECE buton, CTA, aktif durum, hesap SONUCU vurgusu. Başka yerde kullanma:**
`#0ea5a4`, hover `#0c8a89`, açık `#2cc3c0`.

**Nötrler:** metin `#0f2a43`, ikincil metin `#5b6b7b`, çizgi/border `#e2e8f0`, yüzey `#ffffff`, zemin `#f7fafc`.

**Kategori aksan paleti (magazin zenginliği — SADECE editoryal etiketleme: kategori çipi, kategori şerit başlığı, blog kategori rozeti). Aksiyon ile karışmasın, butonlarda kullanma. Hepsi ölçülü/muted, AA kontrastlı:**
- Stok Yönetimi → koyu mavi `#1e4e79`
- Üretim Planlama → kehribar `#b45309`
- Maliyet/Finans → bordo `#9f1239`
- Analiz/Veri → mor `#6d28d9`
- Tedarik → yeşil `#15803d`

> Disiplin: petrol = yapı, teal = aksiyon, kategori renkleri = sadece editoryal etiket. Bu üç katman birbirine karışmaz. Magazin zenginliğini kategori katmanı verir; mühendislik ciddiyetini tek-aksiyon disiplini korur.

Tüm metin/zemin kombinasyonları **WCAG AA** (≥4.5:1 gövde, ≥3:1 büyük başlık).

### 2.2 Tipografi
- **Editoryal başlık (blog H1/H2, magazin manşetleri):** karakterli bir grotesk veya çağdaş serif (örn. başlık için "Fraunces"/"Newsreader" serif opsiyonu, UI için "Inter"/"Geist"/"Manrope"). Magazin hissini başlık tipografisi verir; istersen başlık serif + gövde sans ikilisi kur.
- **UI + gövde:** grotesk sans (Inter/Geist/Manrope).
- **Veri / hesap sonucu / formül:** monospace (JetBrains Mono / Geist Mono). Markanın imzası: sonuç sayıları büyük, net, monospace.
- **Tip ölçeği** (kabaca, responsive clamp): Display 48–64, H1 36–44, H2 28–32, H3 22–24, H4 18–20, gövde 16–18 (blogda 18–19, satır yüksekliği 1.7), küçük 14, etiket 12–13 (uppercase, letter-spacing artırılmış). Editoryal gövde satır uzunluğu 65–75 karakter (`max-width: ~68ch`).
- Ağırlıklar: başlık 600–700, gövde 400, etiket 600. Net hiyerarşi, en az 3 kademe.

### 2.3 Grid & boşluk
- 12 kolon grid, içerik max-width ~1200–1280px, gutter 24–32px.
- Spacing ölçeği 4 tabanlı: 4, 8, 12, 16, 24, 32, 48, 64, 96. Tutarlı dikey ritim; bölümler arası ≥64px.
- Magazin "asimetrik" blokları (büyük öne çıkan kart + yanında küçük kart listesi) için 8/4 veya 7/5 kolon bölünmeleri.

### 2.4 Yükseklik, köşe, çizgi
- Radius ölçeği: 6 / 8 / 12 / 16px (kartlar ~12). Pill butonlar için tam radius opsiyonel.
- Gölge: 2 kademe, yumuşak ve düşük opaklık (kart hover'da hafif yükselir). Abartılı drop-shadow yok; magazin temizliği ince çizgi + minimal gölge ile sağlanır.
- Bölücüler: 1px `#e2e8f0` çizgiler, kategori şeritlerinde üst accent çizgisi (kategori rengiyle, ince).

### 2.5 İkon & görsel
- İkonlar ince çizgi (line) stili, tutarlı stroke.
- Editoryal öne çıkan görseller: 16:9 / 4:3 oranlı, üzerinde okunabilirlik için hafif overlay; köşeler radius'la. Veri görselleri (chart) markanın renk sistemine uyar (teal + nötr eksen).
- Görsellerde kategori rozeti köşede.

### 2.6 Hareket
- Geçişler 150–250ms, `ease-out`. Hover: kartta hafif yükselme + görselde çok hafif zoom. Sticky elemanlarda yumuşak gölge belirmesi. Scroll-jank yok; CWV korunur (Lighthouse mobil 90+ hedefi). Abartılı animasyon yok.

---

## 3. GLOBAL CHROME (her sayfada ortak)

**Header:** sol logo (Stokoloji wordmark), birincil nav: **Araçlar** ve **Blog** için kategori **mega-menü** (kategori renkleriyle etiketli alt linkler + öne çıkan tool/yazı önizlemesi), "Hakkında", sağda **arama** ikonu (açılır arama). Scroll'da kompakt sticky header. Reklam banner'ı yok. Üstte ince bir "newsletter / Excel şablon" şeridi opsiyonel.

**Breadcrumb:** içerik ve tool sayfalarında, kategori rengiyle ince vurgulu.

**Footer (zengin, magazin-grade):** tool dizini iç linkleri (cluster'lara bölünmüş, SEO için zengin), kategori linkleri, yazar/otorite kısa kartı (Ali — METU Endüstri Mühendisliği + production developer), newsletter kutusu, yasal. Magazin temalarının "site haritası gibi footer" zenginliği.

---

## 4. COMPONENT KÜTÜPHANESİ (hepsi tüm durumlarıyla)

Her component için **default / hover / active / focus / disabled / loading / error** durumlarını tanımla (uygun olanlar).

**Genel:** Button (primary teal / secondary outline / ghost), Input + Select + Slider (hesap formu için), Tag/kategori çipi, Pagination, Badge/rozet, Tabs, Tooltip, Toast.

**İçerik kartları (magazin):** `FeaturedCard` (büyük, görsel + kategori rozeti + başlık + özet), `StandardCard`, `CompactCard` (liste satırı), `ToolCard` (tool adı + ne işe yarar + "Hesapla" mikro-CTA).

**Tool çekirdeği:** `CalculatorCard` (sticky; minimal 3–4 input, prefilled örnek değer, "ileri seçenekler" açılır, tek teal buton), `ResultDisplay` (büyük monospace sonuç + birim + tek satır yorum), `FormulaCard` (monospace, sol teal accent bordür), `CostCurveChart` (sipariş/elde tutma/toplam maliyet eğrileri + EOQ kesişimi — TR rakiplerde yok, imza).

**Editoryal/otorite:** `AuthorBox` (E-E-A-T), `TOCSidebar` (sticky "Bu yazıda"), `FAQAccordion`, `RelatedToolsGrid` (iç link cluster), `LeadMagnetBlock` (Excel şablon indir + email), `CalloutBox` ("aklında tut" numaralı), `Breadcrumb`.

---

## 5. SAYFA ŞABLONLARI (tek tema, tutarlı sistem)

### 5.1 Anasayfa (magazin editoryal akış)
1. **Hero/öne çıkan blok:** clickbait manşet değil; net değer önermesi + en güçlü içerik/tool'a büyük `FeaturedCard` + yanında 2–3 `CompactCard`. Altında popüler tool çipleri (EOQ, Emniyet Stoğu, ROP, ABC).
2. **"Öne çıkan araçlar" grid'i:** `ToolCard`'lar, kategori rengine göre rozetli.
3. **Kategori şeritleri:** "Stok Yönetimi", "Üretim Planlama", "Maliyet/Finans" vb. — her şerit üstte kategori-renkli ince accent + başlık + "tümü" linki + içinde tool & blog kartları karışık (tool ↔ blog yönlendirmesi).
4. **Otorite şeridi:** "Neden Stokoloji?" + yazar otoritesi.
5. **Newsletter / lead magnet** bandı.
6. Zengin footer.

### 5.2 Tool sayfası (EOQ örneği) — sitenin kalbi
İki kolon + **sağ sticky `CalculatorCard`** (masaüstü 7/5; mobilde kart en üstte). Above-the-fold: breadcrumb → H1 (keyword başta) → 1–2 cümle → sol kısa tanım, sağ hesap kartı (prefilled, monospace `ResultDisplay`, altında `CostCurveChart`). Fold altı: "EOQ nedir?" 40–60 kelime → `FormulaCard` → "nasıl yorumlanır" + bloga köprü → `FAQAccordion` → `RelatedToolsGrid` (EOQ–emniyet stoğu–ROP üçgeni) → `AuthorBox` → yasal uyarı. Tool above-the-fold'da hesaba başlar.

### 5.3 Blog tekil sayfası (content-first otorite)
Kategori rozeti (kategori rengi) → fayda+sayı içeren H1 (editoryal başlık tipografisi) → yazar + tarih + okuma süresi → iki kolon: sol **sticky `TOCSidebar`**, sağ içerik. İlk 100 kelimede keyword, soru formatlı H2'ler, en az 1 tablo + görsel (Türkçe alt metin), içerikte 2 noktada tool CTA, `LeadMagnetBlock` (Excel şablon), `CalloutBox`, sonda contextual iç linkler + güncelleme tarihi + `AuthorBox`.

### 5.4 (Bonus, tutarlılık için) Kategori/arşiv sayfası
Kategori başlığı + renk + açıklama, altında `StandardCard` grid + pagination. Magazin arşiv düzeni.

---

## 6. RESPONSIVE
Breakpoint'ler: mobil ≤640, tablet 641–1024, masaüstü ≥1025. Tool sayfasında kart mobilde üste taşınır; blog TOC mobilde açılır "İçindekiler" düğmesine dönüşür; mega-menü mobilde tam ekran drawer; kart gridleri 4→2→1 kolona iner. Her sayfanın hem masaüstü hem mobil görünümünü ver.

---

## 7. ÇIKTI BEKLENTİSİ & KIRMIZI ÇİZGİLER
- Tek tutarlı design system'den türeyen **eksiksiz tema**: foundations (renk/tip/grid/component) önce, sonra 3 ana + 1 bonus sayfa, masaüstü + mobil.
- Gerçek Türkçe örnek metin ve gerçekçi sayılar (lorem ipsum değil).
- Component'ler durumlarıyla tutarlı; tema bir bütün gibi dursun, "ayrı sayfalar" gibi değil.
- **Kırmızı çizgiler:** em dash kullanma · teal'i sadece aksiyon/sonuçta kullan · kategori renkleri sadece etiketleme · koyu tema yok · gradient bombardımanı yok · reklam/clickbait yok · above-the-fold tool sayfasını hesaba başlatır · WCAG AA + CWV (Lighthouse mobil 90+) korunur.
