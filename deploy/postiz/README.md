# Postiz kurulumu (Coolify / aynı VPS)

Stokoloji sosyal otomasyonu için self-hosted Postiz. **Lean profil**: Elasticsearch yok,
Temporal postgres visibility ile çalışır (RAM ~1.2–1.8 GB). Platform hedefi: **X + LinkedIn**.

## Stack

| Servis | Rol | RAM limiti |
|---|---|---|
| `postiz` | uygulama (frontend+backend+cron) | 1500m |
| `postiz-postgres` | Postiz DB | 256m |
| `postiz-redis` | kuyruk/cache | 128m |
| `temporal-postgresql` | Temporal DB + visibility | 256m |
| `temporal` | workflow motoru | 512m |

> Temporal UI ve admin-tools bilinçli çıkarıldı. Workflow'ları görsel izlemek istersen
> compose'a geri eklenebilir (resmi compose'daki `temporal-ui` bloğu), ama public domain atama.

## 1. Ön hazırlık (lokal)

Secret üret:

```bash
openssl rand -hex 32   # POSTIZ_JWT_SECRET
openssl rand -hex 16   # POSTIZ_DB_PASSWORD
openssl rand -hex 16   # TEMPORAL_DB_PASSWORD
```

DNS: Coolify VPS IP'sine `postiz.stokoloji.com` için **A kaydı** ekle.

## 2. Coolify'da kaynak oluştur

1. Yeni Resource → **Docker Compose** (Stokoloji projesiyle aynı sunucuda).
2. Kaynak olarak bu repo + `deploy/postiz/docker-compose.yaml` yolunu göster
   (veya compose içeriğini panele yapıştır). `dynamicconfig/` klasörünün de gelmesi gerekir;
   repo bağlama yöntemi bunu otomatik taşır, yapıştırma yönteminde dynamicconfig'i ayrıca ekle.
3. **Environment Variables** sekmesine `.env.example`'daki değişkenleri gir (üretilen secret'larla).
4. `postiz` servisine **domain** ata: `https://postiz.stokoloji.com`, **port 5000**.
   (compose'da `4007:5000` var; Coolify Traefik 5000'e proxy'ler, SSL otomatik.)
5. Diğer servislere domain ATAMA (sadece dahili).
6. Deploy.

## 3. İlk boot doğrulama

- İlk boot ~2-3 dk (Temporal şema kurulumu + Postiz migration). `start_period` buna göre ayarlı.
- `temporal` healthy olmadan `postiz` başlamaz; sırayı bekle.
- RAM'i izle: `docker stats`. Swap'e taşıyorsa Stokoloji ile çakışıyordur — gerekirse
  `mem_limit` değerlerini kıs veya VPS RAM upgrade'i tekrar gündeme al.

## 4. Post-deploy (panel işi)

1. `https://postiz.stokoloji.com` → ilk kullanıcıyı **kaydet** (admin sen olursun).
2. Kayıttan sonra Coolify env'de `POSTIZ_DISABLE_REGISTRATION=true` yap → redeploy
   (siteyi herkese açık kayda kapatır).
3. **X + LinkedIn OAuth app'leri oluştur** (developer.twitter.com / linkedin.com/developers),
   `X_API_KEY/SECRET` ve `LINKEDIN_CLIENT_ID/SECRET`'i Coolify env'e gir → redeploy.
   - Callback/redirect URL: Postiz'de "Add Channel" ekranı her platform için tam redirect
     URL'ini gösterir; onu provider app ayarına birebir yapıştır.
4. Postiz UI → **Settings > Developers > Public API** → API key üret.
   Bu key webhook pipeline için lazım (sonraki adım).

## 5. Sonraki adım — webhook pipeline

Strapi içerik publish → Postiz API'ye **draft/scheduled post** taslağı. Kod `apps/cms`
lifecycle'ında yaşayacak (ayrı worker container yok = RAM tasarrufu). Postiz canlı +
API key hazır olunca bağlanır. Detay ana CLAUDE.md "Postiz" notunda.

## Doğrulama (API canlı mı)

```bash
curl -H "Authorization: <API_KEY>" https://postiz.stokoloji.com/api/public/v1/integrations
```

Bağlı kanalları (X/LinkedIn) JSON döndürmeli; her birinin `id`'si post atarken kullanılır.
