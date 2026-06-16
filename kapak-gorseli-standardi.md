# Kapak Görseli Prompt Standardı — Stokoloji

Her **blog yazısı** ve **tool** yayınlanırken kapak görseli bu standarttan üretilir. Amaç: sitede blog'lar bir görsel aile, tool'lar başka bir aile gibi dursun; ama ikisi de aynı markaya ait hissetsin. Görsel ağırlıklı, minimal, premium editorial.

## Ortak marka kuralları (her prompt'a gömülü)

- **Palet (kesin):** derin lacivert `#0f2a43`, teal accent `#0ea5a4`, açık zemin `#eef4fa` / `#f7fafc`, sıcak vurgu amber `#b45309`.
- **Stil:** modern editorial, flat vector, hafif geometrik, bol negative space.
- **Oran:** 1200×630 (OG/kapak), güvenli kenar boşluğu.
- **Başlık fontu:** "clean serif display (Newsreader / Georgia benzeri)" — site serifi Newsreader ile uyum için.
- **Yasak (`--no`):** clutter, stock photo, 3d render, people faces, watermark. Gerçek metin/sayı kalabalığı, UI screenshot yok.

## İki aile arasındaki fark

| | Blog | Tool |
|---|---|---|
| Düzen | Split layout | Merkezi tek kompozisyon |
| Metin | **Sol panelde başlık var** | **Yazısız** |
| Sağ/merkez görsel | Konunun kavramsal metaforu | Formül kartı + sonuç düğümü (compute hissi) |

---

## 1) BLOG kapağı — split layout (başlık + görsel)

**Şablon:**

```
Editorial blog cover, split layout. Left 45%: solid deep navy #0f2a43 panel
holding a short Turkish headline "{BASLIK}" in a clean serif display font,
white text, left-aligned, generous margins, optional small teal #0ea5a4
underline accent. Right 55%: flat vector illustration on soft light #eef4fa
background showing {METAFOR}, thin geometric line work, teal #0ea5a4 accents,
one amber #b45309 spark, faint dotted grid, soft long shadows. Strict palette:
navy #0f2a43, teal #0ea5a4, light #eef4fa, amber #b45309. Premium magazine
aesthetic, calm and authoritative, lots of negative space. 1200x630, safe
margins. --no clutter, stock photo, 3d render, people faces, watermark
```

Her yeni blog için sadece `{BASLIK}` + `{METAFOR}` değişir; gerisi sabit.

### Üretilmiş örnekler

**A) "Stok devir hızı nedir":**

```
Editorial blog cover, split layout. Left 45%: solid deep navy #0f2a43 panel
with Turkish headline "Stok Devir Hızı Nedir?" in a clean serif display font,
white, left-aligned, generous margins, small teal #0ea5a4 underline. Right
55%: flat vector illustration on soft light #eef4fa background — a circular
rotating arrow cycling boxes through a warehouse shelf, suggesting speed and
rotation, thin line work, teal accents, one amber #b45309 spark, faint dotted
grid, soft shadows. Strict palette navy #0f2a43 / teal #0ea5a4 / light
#eef4fa / amber #b45309. Premium, calm, authoritative, negative space.
1200x630, safe margins. --no clutter, stock photo, 3d render, people, watermark
```

**B) "EOQ nedir":**

```
Editorial blog cover, split layout. Left 45%: solid deep navy #0f2a43 panel
with Turkish headline "EOQ Nedir?" in a clean serif display font, white,
left-aligned, generous margins, small teal #0ea5a4 underline. Right 55%:
flat vector illustration on soft light #eef4fa background — a simple U-shaped
cost curve finding its lowest point, with stacked order boxes balancing
against a holding-cost icon, thin line work, teal accents, amber #b45309
highlight at the optimal point, faint dotted grid, soft shadows. Strict
palette navy #0f2a43 / teal #0ea5a4 / light #eef4fa / amber #b45309. Premium,
calm, authoritative, negative space. 1200x630, safe margins. --no clutter,
stock photo, 3d render, people, watermark
```

---

## 2) TOOL kapağı — yazısız, merkezi kompozisyon

**Şablon:**

```
Editorial cover illustration for an interactive Turkish calculator tool:
"{ARAC_ADI}". Flat vector, minimal, generous negative space. Central element:
a stylized {FORMUL_VEYA_DIYAGRAM} connected by a teal line to a {SONUC_DUGUMU},
hinting input→result. Color palette strictly: deep navy #0f2a43, teal #0ea5a4
primary accent, soft light #eef4fa surfaces, amber #b45309 highlight on the
result node. Thin geometric line work, faint dotted grid, soft shadows.
Conveys "compute / instant result", tool feel. No real text or digits, no UI
chrome. Crisp, modern, trustworthy. 1200x630, wide, safe margins. --no
clutter, stock photo, 3d render, people, watermark
```

Her yeni tool için `{ARAC_ADI}` + merkez diyagram/sonuç düğümü değişir; gerisi sabit.

### Üretilmiş örnekler

**Stok devir hızı hesaplama:**

```
Editorial cover illustration for an interactive Turkish calculator tool:
"stok devir hızı hesaplama". Flat vector, minimal, generous negative space.
Central element: a stylized formula card connected by a teal line to a simple
rising/looping chart node, hinting input→result. Color palette strictly: deep
navy #0f2a43, teal #0ea5a4 primary accent, soft light #eef4fa surfaces, amber
#b45309 highlight on the result node. Thin geometric line work, faint dotted
grid, soft shadows. Conveys "compute / instant result", tool feel. No real
text or digits, no UI chrome. Crisp, modern, trustworthy. 1200x630, wide,
safe margins. --no clutter, stock photo, 3d render, people, watermark
```

**EOQ hesaplama:**

```
Editorial cover illustration for an interactive Turkish calculator tool:
"EOQ hesaplama". Flat vector, minimal, generous negative space. Central
element: a stylized formula card connected by a teal line to a U-shaped cost
curve, with the lowest point marked as the optimal order quantity, hinting
input→result. Color palette strictly: deep navy #0f2a43, teal #0ea5a4 primary
accent, soft light #eef4fa surfaces, amber #b45309 highlight on the optimal
point node. Thin geometric line work, faint dotted grid, soft shadows.
Conveys "compute / instant result", tool feel. No real text or digits, no UI
chrome. Crisp, modern, trustworthy. 1200x630, wide, safe margins. --no
clutter, stock photo, 3d render, people, watermark
```

---

## Kullanım akışı

1. Yeni içerik (blog/tool) yayına hazırlanırken bu dosyayı aç.
2. Blog ise split şablonu, tool ise yazısız şablonu kopyala; placeholder'ları doldur.
3. Üret, paleti/oranı kontrol et, kapak olarak Strapi `kapakGorseli` alanına yükle.
4. İyi çıkan yeni örnekleri buraya "Üretilmiş örnekler" altına ekle ki kütüphane büyüsün.
