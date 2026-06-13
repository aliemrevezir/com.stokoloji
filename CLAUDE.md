# OpenWolf

@.wolf/OPENWOLF.md

This project uses OpenWolf for context management. Read and follow .wolf/OPENWOLF.md every session. Check .wolf/cerebrum.md before generating code. Check .wolf/anatomy.md before reading files.


# CLAUDE.md — Stokoloji

Bu dosya bir Claude Code oturumunun projeye sıfırdan girdiğinde bilmesi gereken her şeyi içerir. Yeni bir konuşmaya başlarken önce bunu oku.

## Proje kimliği

**Stokoloji** (stokoloji.com): Türkçe stok ve üretim yönetimi sitesi. Hem **interaktif hesaplayıcı tool'lar** hem **blog içeriği** barındırır. Amaç: Türkçe'de zayıf/boş olan bir nişte (EOQ, emniyet stoğu, ROP, ABC analizi, stok devir hızı gibi konular) hesaplayıcı + anlaşılır anlatım sunan otorite kaynağı olmak; organik trafik büyütmek, uzun vadede gelire taşımak.

Hedef kitle: (1) EM/işletme öğrencisi, (2) junior üretim planlama / satın alma uzmanı, (3) KOBİ sahibi/yöneticisi.

Konumlandırma: "tool sitesi" değil, "stoğu/üretimi sana öğreten otorite". Her kavram için **blog yazısı + hesaplayıcı çifti** üretilir ve birbirine yönlendirir.

## Bağlam dokümanları (repo dışı, üst klasörde)

Strateji ve içerik kararları bu repodan bir üst klasörde (`../`) yaşar. İlgili işte mutlaka oku:

- `../seo-portfoy-raporu.md` — master plan: strateji, tech stack, content model, monetizasyon, ölçüm planı, 12 haftalık takvim. **Tek doğruluk kaynağı.**
- `../serp-analizi.md` — cluster bazlı SERP taraması, hangi keyword açık/dolu.
- `../rakip-tasarim-teardown.md` — rakip tasarım analizi + başlangıç tasarım yönü + component listesi.
- `../icerik-uretim-kurallari.md` — her içeriğin yayın öncesi geçtiği checklist (SEO, format, schema, E-E-A-T). İçerik yazarken **zorunlu**.
- `../launch-icerik/` — ilk launch cluster'ının hazır içeriği (3 tool + 3 blog), Strapi alanlarına maplenmiş markdown. Strapi'ye girilecek.
- `../stokoloji-claude-code-prompt.md` — bu repoyu üreten orijinal scaffold prompt'u.

## Tech stack

- Monorepo: pnpm workspaces (`apps/*`, `packages/*`). Node >=22, pnpm 9.15.
- **apps/web**: Next.js 15 (App Router), React 19, TypeScript strict, Tailwind 3, Vitest. SSG + ISR.
- **apps/cms**: Strapi 5 (TypeScript), PostgreSQL 16.
- **packages/api-client**: Strapi'ye tek giriş noktası olan typed client (`@stokoloji/api-client`).
- **packages/ui**: paylaşılan design token'ları / Tailwind preset (`@stokoloji/ui`).
- Container: Docker Compose (`db`, `cms`, `web`; opsiyonel `caddy` proxy profili). Registry hedefi: GHCR (POMS workflow'uyla aynı).

## Dizin yapısı

```
apps/web/src/lib/
  tools/        # SAF hesaplama mantığı (eoq.ts + eoq.test.ts), registry.ts
  seo/          # JSON-LD builder'ları (jsonld.ts)
  design/       # tokens.ts
  strapi.ts     # düşük seviye Strapi erişimi
  format.ts
apps/cms/src/
  api/          # content-type'lar: blog, tool, kategori, yazar
  components/    # seo/meta.json, content/sss.json
  seed/         # demo veri seed (index.ts)
packages/api-client/src/   # index.ts (getTool, getBlogPost, ...), types.ts
packages/ui/src/           # tokens.ts
```

## Kritik mimari kurallar (İHLAL ETME)

1. **Hesaplama mantığı Next.js'te yaşar, CMS'te DEĞİL.** Tool'ların formülü `apps/web/src/lib/tools/*.ts` içinde saf, test edilebilir fonksiyonlardır. Strapi yalnızca tool'un metnini tutar (açıklama, formül anlatımı, SSS). Böylece içerik güncellemesi deploy gerektirmez, mantık versiyon kontrolünde kalır.
2. **Tüm Strapi erişimi `packages/api-client` üzerinden.** Component/sayfa içinde doğrudan `fetch(strapi)` veya hardcode URL/token yasak.
3. **Servisler arası iletişim env ile gevşek bağlı.** SSR/build içi çağrı `STRAPI_INTERNAL_URL` (`http://cms:1337`); tarayıcı çağrısı `NEXT_PUBLIC_STRAPI_URL`. Token `STRAPI_API_TOKEN` (boşsa public read).
4. **Reusable tool sayfaları.** Yeni tool eklemek = yeni `lib/tools/x.ts` + `registry.ts` kaydı + Strapi `Tool` kaydı. Yeni sayfa kodu yazmadan; tek `ToolPageTemplate` config'ten beslenir.
5. **Analitik mimaride birinci sınıf.** Tracking koda sonradan yamanmaz. Merkezi `lib/analytics/track(event, payload)` katmanı consent durumuna göre GA4 + Microsoft Clarity'ye dağıtır; provider değişse component değişmez. Component'ler `data-track` / tipli event taşır, doğrudan `gtag`/`clarity` çağırmaz.
6. **Consent zorunlu.** KVKK uyumlu cookie consent (CMP) + Google Consent Mode v2. Trackerlar yalnızca açık onay sonrası yüklenir. `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_CLARITY_ID` boşsa analytics sessizce devre dışı.
7. **CWV koruması.** Lighthouse mobil 90+ zorunlu. Tracker script'leri defer/lazy ve consent-gated yüklenir. Tool sayfaları above-the-fold'da hesaba başlar.

## Komutlar

- Tümünü ayağa kaldır: `docker compose up` (web :3000, cms admin :1337/admin, db :5432). Proxy ile: `docker compose --profile proxy up`.
- Geliştirme: `pnpm dev:web`, `pnpm dev:cms`.
- Kalite: `pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest; `eoq.ts` unit testli).
- `.env.example`'ı `.env`'e kopyala; compose dev için makul varsayılanları taşır.

## İçerik & SEO standardı

İçerik yazarken `../icerik-uretim-kurallari.md` checklist'i zorunludur. Öne çıkan kurallar:

- Ana keyword ilk 100 kelimede; tek H1; en az 2 H2 soru formatında (PAA hedefi).
- **Uzun çizgi (em dash) YASAK** — noktalı virgül / iki nokta / ayrı cümle kullan.
- Blog min ~800 kelime (SERP rakibine göre), tool açıklaması 400-600 kelime; en az 1 tablo, görsellerde Türkçe alt metin.
- 4-8 bağlamsal iç link (cluster içi + ilgili tool); tool CTA iki noktada.
- JSON-LD: blog `Article`+`BreadcrumbList`(+`FAQPage`); tool `WebApplication`+`FAQPage`+`BreadcrumbList`.
- E-E-A-T: yazar kutusu (Ali, METU EM + production developer), her yazıda en az 1 deneyim paragrafı.
- Slug Türkçe karaktersiz, keyword'lü (`/araclar/eoq-hesaplama`, `/blog/eoq-nedir`).

## Mevcut durum (2026-06)

Kurulu: monorepo iskeleti, docker-compose (db+cms+web+caddy profili), Strapi content-type'ları (blog, tool, kategori, yazar) + component'ler (seo.meta, content.sss), `api-client`, design token'ları, `lib/tools/eoq.ts`+test, `lib/seo/jsonld.ts`, `lib/strapi.ts`, seed iskeleti, analitik env değişkenleri.

**Premium editorial tasarım uygulandı (`ornek/` referansından):**

- **Tema sistemi:** `apps/web/src/app/theme.css` — `ornek/theme.css`'ten taşınan tam design system (renk/tipografi token'ları, `.btn/.card/.chip/.result/.formula-card/.faq-item/.prose` vb. semantik sınıflar, header/footer chrome, sayfa-düzeyi layout'lar). Fontlar `next/font` ile: Newsreader (serif display), Inter (`--font-geist`), JetBrains Mono. `globals.css`'ten SONRA import edilir.
- **Chrome:** `components/chrome/SiteHeader.tsx` (client; mega menü, arama overlay `⌘K`, mobil drawer, sticky), `SiteFooter.tsx`. Nav verisi `lib/nav.ts` (Strapi'den, fallback'li). `layout.tsx` bunları kullanır.
- **Sayfalar:** anasayfa (`(site)/page.tsx`; hero + canlı EOQ önizleme `HeroSignature`, öne çıkan blok, araç grid, kategori şeritleri, otorite, lead magnet), araç sayfası (`ToolPageTemplate` = EOQ düzeni; sol içerik + sağ sticky `CalculatorCard` calc-card + `CostChart`), araçlar/blog liste sayfaları (Kategori.html arşiv stili), blog detay (`.prose`).
- Tüm veri Strapi'den; hesap mantığı hâlâ `lib/tools/*` (kural 1 korundu).

**Analitik & ölçüm (entegre edildi):**

- **Hesaplar açıldı, ID'ler bağlandı.** GA4 Measurement ID `G-3TQF6XG6XX`, Microsoft Clarity Project ID `x6l7nkaqw5`. Search Console `stokoloji.com` için **DNS (CNAME) doğrulaması** ile eklendi (env'e gerek yok).
- **Local config:** `apps/web/.env.local` (gitignore'da) — GA4 + Clarity ID'leri burada; `pnpm dev:web` bunları okur. Docker/Coolify için aynı değişkenler `.env` / Coolify env panelinden geçer (`NEXT_PUBLIC_*` build-time gömülür).
- **Akış:** `ConsentBanner` (KVKK CMP) → onay → `AnalyticsScripts` Consent Mode v2 ile gtag (`anonymize_ip`) + Clarity'yi `lazyOnload` yükler. ID'ler boşsa `isAnalyticsConfigured()` false → banner + script'ler sessizce kapalı. Google'ın ham gtag snippet'i kullanılmaz; kod ID'den üretir.
- **Search Console meta yöntemi de hazır:** `layout.tsx` metadata `verification.google`, env `GOOGLE_SITE_VERIFICATION` doluysa `<head>`'e basar (`.env.example` + docker-compose'a eklendi). Şu an DNS yöntemi kullanıldığı için boş.
- **Bağlı event:** yalnız `tool_calculated` (`CalculatorCard`). Diğer CTA'lar (`hero`, lead magnet formu, footer newsletter, calc-card CTA) henüz `track()`'e bağlı değil.

**Çözülen sorun:** Çift `@types/react` (web@19 vs cms@18) tip hataları → root `package.json`'a `pnpm.overrides` ile `@types/react` 19.2.17 + `@types/react-dom` 19.2.3 sabitlendi (commit `ebe6bfa`).

**Henüz YOK (sıradaki iş):**

- `sitemap.ts`/`robots.ts` içeriğinin yeni route'larla doğrulanması; eski kullanılmayan `components/home/*` (HeroBanner, BannerStrip vb.) temizliği.
- `emniyet-stogu.ts` ve `rop.ts` tool mantığı + registry kayıtları (şu an yalnız EOQ'da calc-card + grafik var).
- Launch içeriğinin (`../launch-icerik/`) Strapi'ye girilmesi.
- Liste sorgusu (`listBlogPosts`) yalnız `kategori` populate ediyor; kart görsel/özet için `kapakGorseli`+`seo` populate eklenebilir (şimdilik placeholder).
- **Kalan analytics CTA'larını merkezi `track(event, payload)`'e bağla** (hero CTA'ları, lead magnet formu → `lead_magnet_submit`, footer newsletter, calc-card "Excel şablonuyla kaydet" → `cta_click`). ÖNEMLİ: CTA'lar doğrudan `gtag`/`clarity` çağırmaz; tek `track()` katmanı çağrılır, o consent'e göre **GA4 + Clarity ikisine de aynı event'i** dağıtır (mimari kural 5). Yani event'ler ortak; provider eklenir/çıkarsa component değişmez. `data-track` attribute'u tek başına event atmaz — `TrackedLink`/`track()` kullanılmalı. Event tipleri `lib/analytics/types.ts`'te (`AnalyticsEventMap`).
- Favicon fix (`icon.svg` XML yorumundaki çift tire) push'landı (`b0038c6`); **web redeploy + hard refresh** sonrası sekmede görünür. GA4 canlıda doğrulandı (gtag 200), Clarity kurulu (kullanıcı uBlock'u engelliyordu, gerçek ziyaretçide yüklenir).
- **Deploy (Coolify) — CANLI (2026-06-13).** db + cms + web ayakta. Kaynak: `docker-compose.prod.yml` (Docker Compose build pack), prod Dockerfile'lar (`next build`+`start` / `strapi build`+`start`), `pgdata`+`strapi_uploads` kalıcı volume, caddy yok (Coolify Traefik + otomatik SSL). `next.config.mjs` prod Strapi host'unu `NEXT_PUBLIC_STRAPI_URL`'den türetir (next/image). Env referansı `.env.prod.example`. Domain: web `stokoloji.com`, cms `cms.stokoloji.com`.
  - **Deploy'da çıkan ve çözülen 4 tuzak (tekrar deploy'da bil):** (1) VPS 6 GB RAM yetmiyordu, eşzamanlı `next build`+`strapi build` OOM yapıyordu → sunucuya **8 GB swap** eklendi. (2) `strapi build`, fresh image'da `types/generated/` (gitignore) olmadan seed'deki `iliskiliYazilar`'da TS hatası veriyordu → cms Dockerfile'a `strapi ts:generate-types`. (3) O komut Strapi'yi boot ettiği için `public/uploads` aranıyordu → `mkdir -p public/uploads`. (4) Strapi `APP_KEYS` + diğer secret'lar Coolify env'de yoktu → boot crash-loop → secret'lar Coolify env'e girildi (runtime, build variable DEĞİL).
  - **Kalan (post-deploy panel işi):** Strapi admin kullanıcısı; içerik tiplerine **public read** izni (Settings > Roles > Public) ya da API token üretip `STRAPI_API_TOKEN`'a koymak + web redeploy; içerik girişi (`../launch-icerik/` / seed). `.xyz` ileride 301 → `.com`.

## Launch kapsamı (ilk dalga)

İlk cluster: **EOQ + emniyet stoğu + ROP üçgeni** (3 tool + 3 blog), birbirine iç linkli. İçerik hazır (`../launch-icerik/`). Sonra: ABC analizi (CSV upload) farklılaştırıcı tool, sonra diğer tool'lar (master plan bölüm 2.4).

## Kırmızı çizgiler / çalışma tarzı

- **Kalitesiz ürün çıkma; hız için kaliteden taviz verme.** Thin/yığın AI içerik kırmızı çizgi; her içerikte gerçek deneyim katmanı şart.
- Hack değil sustainable çözüm. Kısa vadeli kazanç için uzun vadeli vizyonu feda etme.
- Çalışma dili Türkçe-İngilizce karışık; UI metinleri ve içerik **Türkçe**, teknik terimler İngilizce kalır.
- Önce çalışır halde tut, sonra iterasyon yap. Her hafta yayınlanabilir bir minimum çıkar.
