# Stokoloji — MVP İskelet

Türkçe stok/üretim yönetimi sitesi. **Next.js 15 (web) + Strapi 5 (CMS) + PostgreSQL 16**, pnpm monorepo, Docker Compose ile tek komutta ayağa kalkar.

> **Mimari ilke:** Tool'ların **hesaplama mantığı Next.js'te** yaşar (`apps/web/src/lib/tools/`), CMS'te değil. Strapi yalnızca metinsel içeriği (açıklama, formül anlatımı, SSS) tutar. Böylece içerik güncellemesi deploy gerektirmez, mantık versiyon kontrolünde kalır.

## Hızlı başlangıç

Gerekenler: Docker + Docker Compose. (Host'ta Node/pnpm gerekmez — her şey container içinde çalışır.)

```bash
cd com.stokoloji
docker compose up --build
```

Bu komut:

1. **db** (Postgres 16) ayağa kalkar.
2. **cms** (Strapi 5) DB hazır olunca başlar; ilk açılışta:
   - content type'lar migrate olur,
   - public role'e içerik okuma izni verilir (bootstrap),
   - demo içerik (EOQ tool + "EOQ nedir" blog yazısı) **idempotent** seed edilir.
3. **web** (Next.js) cms healthy olunca başlar.

| Servis | URL |
| --- | --- |
| Web (site) | http://localhost:3000 |
| Strapi admin | http://localhost:1337/admin |
| Strapi REST API | http://localhost:1337/api |

> İlk Strapi açılışında admin paneli derlenir (~1-2 dk). `cms` healthcheck'i `web`'i bekletir.

### İlk admin kullanıcısı

Strapi admin paneli ilk girişte bir **admin kullanıcısı oluşturmanızı** ister (http://localhost:1337/admin). Bu, demonun çalışması için **gerekli değildir** (içerik public read ile gelir); yalnızca CMS'i panelden yönetmek isterseniz oluşturun.

## Demo akışını doğrulama

```bash
# 1) Strapi public read çalışıyor mu? (EOQ tool JSON'u dönmeli)
curl "http://localhost:1337/api/tools?populate=*"

# 2) Tool sayfası: Strapi metni + canlı hesaplama + JSON-LD
open http://localhost:3000/araclar/eoq-hesaplama

# 3) Blog: Strapi içeriği + ilgili tool CTA + Article JSON-LD
open http://localhost:3000/blog/eoq-nedir
```

Tool sayfasında sağdaki kartta değerleri değiştirip **Hesapla**'ya basın: EOQ canlı hesaplanır (Next.js'teki saf `eoq()` fonksiyonu), metin Strapi'den gelir.

## Proje yapısı

```
com.stokoloji/
├─ apps/
│  ├─ web/   # Next.js 15 App Router, TS strict, Tailwind
│  └─ cms/   # Strapi 5 (TS), Postgres
├─ packages/
│  ├─ api-client/  # Strapi ile konuşmanın TEK yolu (typed)
│  └─ ui/          # paylaşılan tasarım token'ları + Tailwind preset
├─ docker-compose.yml
└─ .env.example
```

- **Servisler arası iletişim:** Web → Strapi her zaman `packages/api-client` üzerinden. URL/token yalnızca env'den; hardcode yok.
  - SSR/build içi: `STRAPI_INTERNAL_URL=http://cms:1337` (Docker internal)
  - Tarayıcı: `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
  - Token (opsiyonel): `STRAPI_API_TOKEN` doluysa `Authorization: Bearer` gönderilir.

## Yeni bir tool eklemek (sayfa kodu YAZMADAN)

Tool sayfaları tek bir `ToolPageTemplate` + registry'den beslenir. Yeni tool için **3 adım**:

1. **Saf mantık:** `apps/web/src/lib/tools/<tool>.ts` içinde framework-bağımsız hesaplama fonksiyonu yaz (+ `<tool>.test.ts`).
2. **Registry kaydı:** `apps/web/src/lib/tools/registry.ts` içine bir `CalculatorDef` ekle (alanlar + `compute`). Slug, Strapi'deki slug ile aynı olmalı.
3. **İçerik:** Strapi admin'de (veya seed'de) aynı slug ile bir **Tool** kaydı oluştur (ad, kısa açıklama, formül anlatımı, SSS).

`/araclar/<slug>` otomatik çalışır — yeni route/sayfa dosyası gerekmez.

## Analitik & izlenebilirlik

Üç sağlayıcı, hepsi **consent-gated**: **GA4**, **Microsoft Clarity** (heatmap/session), **Google Search Console** (yalnızca doğrulama, kod gerektirmez — aşağıya bakın).

- Merkezi katman: `apps/web/src/lib/analytics/` → tek `track(event, payload)`. Component'ler doğrudan `gtag`/`clarity` çağırmaz.
- Consent: KVKK uyumlu banner + **Google Consent Mode v2**. Onay verilene kadar **hiçbir tracker yüklenmez**; script'ler onay sonrası `lazyOnload` ile gelir.
- Event seti: `tool_calculated`, `cta_click`, `lead_magnet_view`, `lead_magnet_submit`, `scroll_depth`, `outbound_link`.
- Env (boşsa analytics **sessizce devre dışı**; dev/CI kırılmaz):

```env
NEXT_PUBLIC_GA4_ID=G-XXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```

### Google Search Console kurulumu (kod gerektirmez)

1. https://search.google.com/search-console → "URL prefix" ile `https://stokoloji.com` ekleyin.
2. Doğrulama: DNS TXT kaydı (önerilen) veya `app/layout.tsx` metadata'sına `verification: { google: '...' }` ekleyin.
3. Sitemap'i gönderin: `https://stokoloji.com/sitemap.xml` (Next dinamik üretir).

## Geliştirme komutları (host'ta pnpm varsa)

```bash
pnpm install
pnpm --filter @stokoloji/web test       # eoq unit testi (Vitest)
pnpm --filter @stokoloji/web typecheck   # TS strict
pnpm --filter @stokoloji/web lint
```

> Container içinde: `docker compose exec web pnpm test`

## Tip üretimi (upgrade path)

`packages/api-client/src/types.ts` şu an MVP için elle yazılmıştır. İçerik modeli büyüdükçe Strapi tiplerini otomatik üretip buraya bağlayabilirsiniz:

```bash
docker compose exec cms pnpm strapi ts:generate-types
```

## Ortam değişkenleri

`.env.example` tüm değişkenleri dokümante eder. `docker compose up` dev varsayılanlarıyla `.env` olmadan da çalışır. Üretimde:

```bash
cp .env.example .env   # ve tüm secret'ları rastgele değerlerle değiştirin
```

## Notlar

- Postgres verisi `pgdata`, Strapi uploads `strapi_uploads` volume'lerinde kalıcıdır.
- Opsiyonel reverse proxy: `docker compose --profile proxy up` (Caddy, :80).
- **Kapsam dışı (sonraki adımlar):** Dynamic Zone anasayfa builder, sosyal otomasyon, CI/CD, e-posta toplama backend'i, 8 tool/blog'un tamamı. İskelet bunları kolayca eklenebilir bırakır.
