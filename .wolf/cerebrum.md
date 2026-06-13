# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-06-14

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

- İletişim **Türkçe**, kısa, aksiyona dönük; samimi ton ("knkm/kanka"). Listeden çok prose; karar öncesi kısa sparring/devil's advocate, sonra net küçük adımlar.
- **Hız için kaliteden taviz yok**; sustainable çözüm, hack değil. Thin/yığın AI içerik kırmızı çizgi.
- **Secret'ları düz metin memory dosyasına YAZMA** — password manager + Coolify env. Kullanıcı bunu açıkça istedi; sadece "şuraya saklanıyor" işaretçisi kabul.
- Commit'leri **anlamlı, gruplu** ister (feat/fix/chore/docs, açıklamalı gövde). Commit/push'u açıkça söyleyince yap.
- Değişikliği körlemesine commitleme — kullanıcı (veya başka araç) dosya düzenlemiş olabilir; önce diff'e bak.
- UI metinleri + içerik **Türkçe**, teknik terimler İngilizce. **Uzun çizgi (em dash) YASAK.**

## Key Learnings

- **Project:** stokoloji
- **Description:** Türkçe stok/üretim yönetimi sitesi. **Next.js 15 (web) + Strapi 5 (CMS) + PostgreSQL 16**, pnpm monorepo, Docker Compose ile tek komutta ayağa kalkar.
- **CANLI (2026-06-14):** Coolify ile deploy edildi. web `stokoloji.com`, cms `cms.stokoloji.com` (ayrı subdomain — medya URL'leri için şart). Otomatik SSL (Coolify Traefik). Kaynak: `docker-compose.prod.yml` + prod Dockerfile'lar.
- **Deploy yapısı:** Coolify'da **Docker Compose** build pack (Nixpacks DEĞİL — 3 servis + volume + internal network var). Prod Dockerfile'lar dev'den ayrı: web `next build`+`start`, cms `strapi build`+`start`. `caddy` profili prod'da kullanılmaz (Coolify kendi proxy'sini getirir).
- **Analytics mimarisi:** tek merkezi `lib/analytics/track(event, payload)` → consent'e göre **GA4 + Clarity ikisine de** dağıtır (provider adaptörleri `lib/analytics/providers/`). Component'ler `track()` çağırır; `gtag`/`clarity`'yi direkt çağırmaz. `data-track` attribute'u tek başına event ATMAZ.
- **Analytics consent-gated:** GA4/Clarity script'leri SADECE "Kabul Et" sonrası yüklenir → SSR HTML'de yokturlar (normal, hata değil). Google'ın otomatik tag doğrulaması bu yüzden tag'i "bulamaz"; gerçek doğrulama: Kabul Et → DevTools Network `collect` / GA4 Realtime/DebugView.
- **Env:** `NEXT_PUBLIC_*` build-time bundle'a gömülür → Coolify'da **Build Variable** olarak da girilmeli (runtime yetmez). Strapi secret'ları (`APP_KEYS` vb.) **runtime** (build variable değil).
- **GA4:** `G-3TQF6XG6XX`, Clarity: `x6l7nkaqw5`, Search Console: DNS (CNAME) doğrulaması. `.env.local` (gitignore) local dev için.
- **next/image** `AuthorBox`'ta aktif → prod Strapi medya host'u `next.config.mjs`'te `NEXT_PUBLIC_STRAPI_URL`'den türetilir (remotePatterns).

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->

- [2026-06-14] SVG dosyalarında (örn. `app/icon.svg`) XML yorumlarında `--` (çift tire, örn. `--ink`/`--teal`) KULLANMA. `<!-- -->` içi `--` içeremez → SVG parse edilmez → favicon gelmez (globe fallback). Yorumları sade tut veya kaldır.
- [2026-06-14] Coolify'da Strapi deploy'unda secret env'leri (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`) ATLAMA → Strapi boot etmez, crash-loop (`App keys are required`). Hepsi zorunlu.
- [2026-06-14] Prod cms Dockerfile'da `strapi build` öncesi `strapi ts:generate-types` ŞART — `types/generated/` gitignore'da, fresh image'da yok; olmadan seed gibi tipli dosyalar `iliskiliYazilar` vb. alanlarda TS hatası verir. Ayrıca typegen Strapi'yi boot ettiği için `mkdir -p public/uploads` gerekir (upload plugin klasörü arar).
- [2026-06-14] Background/pipe'lı build'de "exit 0" YANILTICI olabilir (tail pipe'ın çıkışı, build'in değil). Gerçek exit'i `; echo EXIT=$?` ile AYRI doğrula.
- [2026-06-14] Coolify BuildKit gerçek `next build`/`strapi build` stdout'unu gizleyip sadece `Dockerfile:line` + `exit code 1` gösterebilir. Gerçek hata için: VPS'te `docker build -f ... .` ELLE çalıştır, ya da kaynağı (RAM/OOM gibi) çözünce build ilerleyip gerçek hata ortaya çıkar.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->

- [2026-06-14] **Deploy = Coolify + Docker Compose build pack** (`docker-compose.prod.yml`). Nixpacks değil: tek servis varsayardı, db+cms'i kaçırırdı. Compose 3 servisi, kalıcı volume'ları (`pgdata`+`strapi_uploads`) ve internal network'ü (`http://cms:1337`) yönetir.
- [2026-06-14] **VPS 6 GB RAM yetmedi** (boştayken ~2 GB available); eşzamanlı `next build`+`strapi build` OOM yapıyordu (çıktısız exit). Çözüm: sunucuya **8 GB swap** (`/swapfile_build`, fstab'a eklendi). Sunucu büyütmek yerine swap — ucuz, build'i öldürmez.
- [2026-06-14] **cms ayrı subdomain** `cms.stokoloji.com` — tarayıcı Strapi medya URL'lerini buradan çeker; aynı domain'de servis edilmez.
- [2026-06-14] **Search Console = DNS (CNAME) doğrulaması** (meta yöntemi `layout.tsx`'te `verification.google` + `GOOGLE_SITE_VERIFICATION` env olarak da hazır ama kullanılmadı).
- [2026-06-14] **Çift `@types/react`** (web@19 vs cms@18) → root `package.json` `pnpm.overrides` ile `@types/react` 19.2.17 + `@types/react-dom` 19.2.3 sabitlendi.
- [ileride] `.xyz` → `.com` 301 (Cloudflare/DNS redirect, içerik servis etmeden).
