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
