# Memory

> Chronological action log. Hooks and AI append to this file automatically.
> Old sessions are consolidated by the daemon weekly.

## Session 2026-06-14 — Analytics kurulumu + Coolify'a ilk canlı deploy

Hedef: GA4 + Clarity + Search Console entegrasyonu, sonra Coolify ile canlıya çıkmak. Sonuç: **site CANLI** (`stokoloji.com` + `cms.stokoloji.com`), analytics doğrulandı.

| HH:MM | description | file(s) | outcome | ~tokens |
| --- | --- | --- | --- | --- |
| --:-- | Search Console meta doğrulama desteği + analytics env dokümantasyonu | layout.tsx, .env.example, docker-compose.yml, apps/web/.env.local | GA4 G-3TQF6XG6XX + Clarity x6l7nkaqw5 bağlandı; SC = DNS | ~2k |
| --:-- | git init + remote + 6 anlamlı commit + push | (repo) | github.com/aliemrevezir/com.stokoloji main yüklendi | ~3k |
| --:-- | Coolify prod dosyaları | apps/web/Dockerfile.prod, apps/cms/Dockerfile.prod, docker-compose.prod.yml, .env.prod.example, next.config.mjs | prod build/start, caddy yok, kalıcı volume | ~3k |
| --:-- | Deploy tuzağı 1: OOM | (VPS) | 8 GB swap eklendi | ~1k |
| --:-- | Deploy tuzağı 2+3: cms build | apps/cms/Dockerfile.prod | ts:generate-types + mkdir public/uploads → cms build geçti (local Docker exit 0) | ~4k |
| --:-- | Deploy tuzağı 4: Strapi boot | (Coolify env) | APP_KEYS + 5 secret üretilip girildi → cms healthy | ~1k |
| --:-- | Deploy CANLI | — | db+cms+web ayakta, public read açık, EOQ içeriği geldi | — |
| --:-- | Favicon fix | apps/web/src/app/icon.svg | XML yorumundaki çift tire kaldırıldı | ~0.5k |
| --:-- | Analytics doğrulama | — | GA4 gtag canlıda 200; Clarity kullanıcı uBlock'unda bloklu (kodda sorun yok) | — |
| --:-- | Backlog + .wolf güncelleme | CLAUDE.md, .wolf/* | CTA event'leri merkezi track() notu + cerebrum/buglog/memory | ~2k |

**Çözülen buglar:** bug-001..006 (buglog.json). Özet: swap → cms ts:generate-types → mkdir uploads → Strapi secret'ları → favicon SVG XML.

**Sıradaki iş:** CTA event'lerini merkezi `track()`'e bağla (GA4+Clarity ortak); emniyet stoğu + ROP içerik/tool; favicon redeploy+hard refresh; `.xyz` 301; liste kartı populate; sitemap/robots doğrulama + eski `components/home/*` temizliği.

## Session: 2026-06-16 17:41

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 17:54 | Created ../../../../.claude/plans/stokoloji-com-un-anasayfas-ndaki-hero-se-zippy-coral.md | — | ~2094 |
| 17:56 | Created apps/cms/src/api/banner/content-types/banner/schema.json | — | ~218 |
| 17:56 | Created apps/cms/src/api/banner/routes/banner.ts | — | ~32 |
| 17:56 | Created apps/cms/src/api/banner/controllers/banner.ts | — | ~33 |
| 17:56 | Created apps/cms/src/api/banner/services/banner.ts | — | ~32 |
| 17:56 | Edited packages/api-client/src/types.ts | component() → retilir() | ~187 |
| 17:56 | Edited packages/api-client/src/index.ts | 7→8 lines | ~35 |
| 17:56 | Edited packages/api-client/src/index.ts | expanded (+8 lines) | ~194 |
| 17:56 | Edited packages/api-client/src/index.ts | modified listBanners() | ~156 |
| 17:57 | Created apps/web/src/lib/banners.ts | — | ~533 |
| 17:57 | Created apps/web/src/lib/banners.test.ts | — | ~808 |
| 17:57 | Edited apps/web/src/lib/banners.test.ts | "boş (bağlantısız) banner" → "bağlantısız banner kayıtl" | ~18 |
| 17:58 | Created apps/web/src/components/home/HeroCarousel.tsx | — | ~1181 |
| 17:58 | Edited apps/web/src/app/(site)/page.tsx | added 1 import(s) | ~117 |
| 17:58 | Edited apps/web/src/app/(site)/page.tsx | modified safeData() | ~97 |
| 17:58 | Edited apps/web/src/app/(site)/page.tsx | modified HomePage() | ~44 |
| 17:58 | Edited apps/web/src/app/(site)/page.tsx | reduced (-27 lines) | ~262 |
| 17:59 | Edited apps/web/src/app/theme.css | modified media() | ~900 |
| 17:59 | Edited apps/web/src/app/theme.css | inline fix | ~26 |
| 18:00 | Edited apps/cms/src/index.ts | 4→5 lines | ~56 |
| 18:00 | Edited apps/cms/src/index.ts | inline fix | ~20 |
| 18:00 | Edited apps/cms/src/index.ts | 2→3 lines | ~28 |
| 18:00 | Edited apps/cms/src/seed/index.ts | 4→4 lines | ~66 |
| 18:01 | Edited apps/cms/src/seed/index.ts | added 4 condition(s) | ~480 |
| 18:01 | Edited apps/web/src/lib/banners.test.ts | 2→2 lines | ~22 |
| 18:03 | Edited apps/cms/src/api/anasayfa/content-types/anasayfa/schema.json | inline fix | ~22 |
| 18:03 | Edited apps/cms/src/api/anasayfa/content-types/anasayfa/schema.json | removed 6 lines | ~7 |

### Oturum özeti — 2026-06-16 (hero → banner carousel)
Anasayfa hero'su tam genişlik (full-bleed) otomatik dönen banner carousel'e dönüştürüldü, Strapi-yönetilen.
- YENİ: api::banner.banner collection-type (blog/arac relation + opsiyonel gorsel + sira, draftAndPublish), api-client listBanners() + Banner tipi, apps/web/src/lib/banners.ts saf resolveBannerSlide() + test (6 test), HeroCarousel.tsx (5sn auto-rotate, ok+nokta, a11y, prefers-reduced-motion, TrackedLink cta_click), theme.css .hero-carousel/.hero-fallback, seedBanners().
- KALDIRILDI: inline hero + HeroSignature.tsx (EOQ canvas), HeroBanner/PromoBanner/BannerStrip.tsx, content.banner component + Anasayfa.bannerlar alani.
- Izin: setPublicReadPermissions'a banner eklendi. Dogrulama: test 9 gecti, typecheck temiz, lint sadece eski <img> uyarilari.
| 18:05 | Session end: 27 writes across 10 files (stokoloji-com-un-anasayfas-ndaki-hero-se-zippy-coral.md, schema.json, banner.ts, types.ts, index.ts) | 16 reads | ~31505 tok |
| 18:10 | Edited apps/cms/src/seed/index.ts | 21→25 lines | ~236 |
| 18:12 | Session end: 28 writes across 10 files (stokoloji-com-un-anasayfas-ndaki-hero-se-zippy-coral.md, schema.json, banner.ts, types.ts, index.ts) | 17 reads | ~32151 tok |
| 18:28 | Edited apps/cms/src/api/anasayfa/content-types/anasayfa/schema.json | 12→7 lines | ~52 |
| 18:29 | Edited packages/api-client/src/index.ts | 3→2 lines | ~32 |
| 18:29 | Edited packages/api-client/src/types.ts | removed 14 lines | ~1 |
| 18:29 | Edited packages/api-client/src/types.ts | 6→5 lines | ~58 |
| 18:29 | Edited apps/cms/src/seed/index.ts | reduced (-10 lines) | ~62 |
| 18:29 | Edited apps/web/src/app/(site)/page.tsx | 8→5 lines | ~124 |
| 18:29 | Edited apps/cms/src/seed/index.ts | 4→4 lines | ~66 |
| 18:32 | Session end: 35 writes across 10 files (stokoloji-com-un-anasayfas-ndaki-hero-se-zippy-coral.md, schema.json, banner.ts, types.ts, index.ts) | 17 reads | ~32613 tok |
| 18:37 | Edited apps/web/src/components/home/HeroCarousel.tsx | 4→3 lines | ~23 |
| 18:38 | Edited apps/web/src/components/home/HeroCarousel.tsx | CSS: il, localhost | ~204 |
| 18:38 | Session end: 37 writes across 10 files (stokoloji-com-un-anasayfas-ndaki-hero-se-zippy-coral.md, schema.json, banner.ts, types.ts, index.ts) | 17 reads | ~32840 tok |

## Session: 2026-06-16 18:43

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 18:44 | Edited apps/web/src/components/BlocksRenderer.tsx | added 1 import(s) | ~93 |
| 18:44 | Edited apps/web/src/components/BlocksRenderer.tsx | expanded (+7 lines) | ~73 |
| 18:44 | Edited apps/web/src/components/BlocksRenderer.tsx | added optional chaining | ~265 |
| 18:44 | Edited apps/web/src/app/(site)/blog/[slug]/page.tsx | added optional chaining | ~292 |
| 18:45 | Session end: 4 writes across 2 files (BlocksRenderer.tsx, page.tsx) | 3 reads | ~4555 tok |
| 18:45 | blog detayına sabit oranlı (16/9) kapak görseli eklendi | apps/web/src/app/(site)/blog/[slug]/page.tsx | typecheck+lint temiz | ~3k |
| 18:45 | Session end: 4 writes across 2 files (BlocksRenderer.tsx, page.tsx) | 3 reads | ~4555 tok |
| 18:48 | Session end: 4 writes across 2 files (BlocksRenderer.tsx, page.tsx) | 3 reads | ~4555 tok |

## Session: 2026-06-16 18:48

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
