# Claude Code Prompt — Trendyol Komisyon & Kâr hesaplama motoru

> Bunu Claude Code'a (repo kökünde çalışırken) ver. İçeriği zaten seed'de hazır; bu görev SADECE hesaplama motoru + registry + sayfa wiring.

---

Stokoloji monorepo'sunda `trendyol-komisyon-hesaplama` tool'unun hesaplama motorunu yaz. İçerik (Strapi Tool + 3 blog) zaten `apps/cms/src/seed/trendyol-komisyon.ts` ile seed'de mevcut; sen yalnızca `apps/web` tarafındaki saf hesaplama mantığını + registry kaydını ekleyeceksin. Yeni sayfa kodu YAZMA (mimari kural 4: `ToolPageTemplate` registry'den beslenir).

## Önce oku (pattern'i birebir izle)
1. `apps/web/src/lib/tools/eoq.ts` ve `eoq.test.ts` — saf fonksiyon + Vitest pattern.
2. `apps/web/src/lib/tools/registry.ts` — `CalculatorField`, `CalculatorOutput`, `CalculatorDef` arayüzleri ve `eoqDef`. Select alanlar `options` ile destekleniyor; `compute(inputs: Record<string, number>)`.
3. `apps/web/src/components/CalculatorCard.tsx` — analytics `tool_calculated` event'i burada nasıl atılıyor (mimari kural 5: doğrudan gtag DEĞİL, merkezi `track()`).
4. `trendyol-komisyon-veri-paketi.md` (repo kökü) — kategori→oran JSON'u (`_meta` + 20 kategori) ve doğrulanmış formül. Oranlar TAHMİNİ/aralık; motor bunu olduğu gibi kullansın.

## Mimari kurallar (İHLAL ETME)
- Hesaplama mantığı SADECE `apps/web/src/lib/tools/*.ts` içinde saf, test edilebilir fonksiyon. Strapi'de mantık YOK.
- Yeni tool = `lib/tools/trendyol-komisyon.ts` (+ test) + `registry.ts`'e bir `CalculatorDef`. Strapi kaydı zaten var (slug: `trendyol-komisyon-hesaplama`).
- Analytics event yalnız merkezi `track()` ile; component doğrudan `gtag`/`clarity` çağırmaz.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` temiz geçmeli. Em dash kullanma (proje kuralı).

## Saf fonksiyon spesifikasyonu — `lib/tools/trendyol-komisyon.ts`

```ts
export interface TrendyolKomisyonInput {
  satisFiyatiKdvDahil: number;   // müşterinin ödediği fiyat (TL)
  alisMaliyetiKdvDahil: number;  // ürün alış maliyeti (KDV dahil, TL)
  komisyonOrani: number;         // ondalık, ör. 0.20  (yüzde değil)
  kdvOrani?: number;             // ondalık, default 0.20 (0.10 / 0.01 olabilir)
  kargoKdvDahil?: number;        // kullanıcı girer, default 0
  hizmetBedeliKdvHaric?: number; // default 10.99 (alternatif 6.99); net nakit yük
  komisyonTabani?: 'haric' | 'dahil'; // default 'haric'
}

export interface TrendyolKomisyonResult {
  kdvHaricSatis: number;
  komisyonTutari: number;     // gerçek nakit yük (çıplak; komisyon KDV'si indirilebilir → nötr)
  stopaj: number;             // BİLGİ amaçlı; net kârdan DÜŞÜLMEZ (mahsup edilen peşin vergi)
  toplamKesinti: number;      // komisyon + hizmet + kargo(KDV hariç)
  netKar: number;
  karMarji: number;           // yüzde
  basabasFiyatKdvDahil: number;
}
```

### Formül (KDV mükellefi satıcı; doğrulanmış KDV-nötr model)
```
v   = kdvOrani (default 0.20)
Sh  = satisFiyatiKdvDahil / (1 + v)
Ah  = alisMaliyetiKdvDahil / (1 + v)
kargoHaric  = kargoKdvDahil / (1 + v)
hizmet      = hizmetBedeliKdvHaric

komisyonTutari = (komisyonTabani === 'haric') ? Sh * komisyonOrani
                                              : satisFiyatiKdvDahil * komisyonOrani
stopaj         = Sh * 0.01                 // bilgi satırı, kârdan düşülmez
toplamKesinti  = komisyonTutari + hizmet + kargoHaric
netKar         = Sh - Ah - komisyonTutari - hizmet - kargoHaric
karMarji       = netKar / satisFiyatiKdvDahil * 100

// Başabaş (netKar = 0):
// 'haric'  : BEharic = (Ah + kargoHaric + hizmet) / (1 - komisyonOrani)
// 'dahil'  : BEdahil = (Ah + kargoHaric + hizmet) / (1/(1+v) - komisyonOrani)
basabasFiyatKdvDahil = (komisyonTabani === 'haric')
  ? ((Ah + kargoHaric + hizmet) / (1 - komisyonOrani)) * (1 + v)
  : (Ah + kargoHaric + hizmet) / (1 / (1 + v) - komisyonOrani);
```

### Edge case / guard
- `komisyonOrani` 0–1 arası; `haric` baz için `>= 1` ise başabaş tanımsız → NaN/Infinity yerine güvenli davran (ör. `Infinity` döndür ya da guard'la). `dahil` baz için payda `1/(1+v) - oran <= 0` ise aynı şekilde.
- Negatif/0 girdilerde çökmeysin; satış 0 ise marj 0 döndür.
- Para çıktısı 2 ondalık; UI tarafında `formatCurrency`/`formatPercent` (lib/format) kullan.

## Registry kaydı — `registry.ts`
`trendyolKomisyonDef: CalculatorDef` ekle, slug `trendyol-komisyon-hesaplama`. Alanlar:
- `satisFiyati` (₺, default 600), `alisMaliyeti` (₺, default 240), `kargo` (₺, default 100)
- `kategori` → **select**: `options` = veri paketindeki kategoriler; her option `value` = temsili komisyon oranı (aralığın ortası, ondalık). Kitap & Kırtasiye için veri yok → ya listeye koyma ya da "elle gir" seçeneği yap.
- `komisyonOrani` (%, default seçili kategoriden; kullanıcı override edebilir) — generic card iki alanı bağlayamıyorsa, `kategori` select'inin value'su doğrudan oran olarak kullanılsın + ayrı opsiyonel override alanı. Basit yaklaşımı tercih et, overengineering yapma.
- `kdvOrani` → select [20, 10, 1] (default 20), `hizmetBedeli` → select [10.99, 6.99] (default 10.99)
- `komisyonTabani` → select [{label:'KDV hariç (önerilen)', value:0}, {label:'KDV dahil', value:1}], default 0

`compute(inputs)`: yukarıdaki saf fonksiyonu çağır, `CalculatorOutput` üret:
- `value` = netKar (formatCurrency), `unit` = '₺ net kâr'
- `summary` = `Marj %X · komisyon Y₺ · başabaş Z₺`
- `rows` = KDV hariç satış, komisyon tutarı, hizmet bedeli, kargo (KDV hariç), toplam kesinti, **stopaj (bilgi: mahsup edilir)**, başabaş fiyat (KDV dahil)

> ÖNEMLİ: Stopaj satırı "bilgi" olarak gösterilsin, net kârın içinde DÜŞÜLMESİN. Sonuç kartında küçük bir uyarı: "Oranlar tahminidir; bağlayıcı oran Trendyol Satıcı Panelindedir."

## Testler — `lib/tools/trendyol-komisyon.test.ts` (Vitest)
Doğrulanmış fixture (kod ile teyit edildi):

| Senaryo | Girdi | Beklenen |
|---|---|---|
| KDV hariç baz | satış 600, alış 240, oran 0.20, kargo 100, hizmet 10.99, v 0.20 | kdvHaricSatis 500; komisyon 100; netKar ≈ 105.68; marj ≈ 17.61 |
| KDV dahil baz | aynı girdiler, tabanı 'dahil' | komisyon 120; netKar ≈ 85.68; marj ≈ 14.28 |
| Başabaş (haric) | aynı girdiler | basabasFiyatKdvDahil ≈ 441.49 |
| Başabaş doğrulama | satış = 441.49, diğerleri aynı, 'haric' | netKar ≈ 0 (tolerans ±0.1) |

Ondalık karşılaştırmada `toBeCloseTo` kullan.

## Kabul kriterleri
- `pnpm test` yeni testler dahil yeşil; `pnpm typecheck` + `pnpm lint` temiz.
- `/araclar/trendyol-komisyon-hesaplama` sayfası registry'den hesaplayıcıyı render ediyor (Strapi metni + sağda calc-card).
- `tool_calculated` event'i merkezi `track()` ile atılıyor (EOQ ile aynı yol).
- Kategori değiştirince oran güncelleniyor; KDV tabanı değişince netKar/marj değişiyor (manuel doğrula).

## Kapsam DIŞI (yapma)
- Yeni sayfa/route dosyası yazma (ToolPageTemplate yeterli).
- Strapi şema/seed değişikliği (içerik hazır).
- Kampanya katkı payı, iade simülasyonu, KDV-mükellefi-değil senaryosu → v2 (şimdilik ekleme; istersen TODO yorumu bırak).
```
