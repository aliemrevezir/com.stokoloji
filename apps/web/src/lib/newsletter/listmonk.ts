/**
 * Newsletter (Listmonk) — SUNUCU TARAFI tek giriş noktası.
 *
 * Tüm Listmonk erişimi buradan geçer; component/route doğrudan `fetch(listmonk)`
 * atmaz (Strapi için `api-client` neyse, newsletter için burası odur). Token
 * yalnız sunucuda kalır, tarayıcıya sızmaz.
 *
 * GRACEFUL (analytics ile aynı desen): env eksikse `isNewsletterConfigured()`
 * false döner ve `subscribe()` `disabled` durumuyla sessizce geçer — build/SSR
 * kırılmaz, geliştirme ortamında ESP olmadan da form çalışır gibi davranır.
 *
 * Çift opt-in (KVKK): `preconfirm_subscriptions` false ile abone "unconfirmed"
 * olarak eklenir. DİKKAT — Listmonk admin API'si (`POST /api/subscribers`) opt-in
 * onay e-postasını OTOMATİK göndermez (yalnız public form gönderir). Bu yüzden
 * kayıttan sonra onay e-postasını ayrı uçtan (`/optin`) biz tetikleriz; Listmonk
 * onu Amazon SES SMTP relay üzerinden yollar. Onay tıklanmadan listeye yazılmaz.
 */

export type SubscribeStatus =
  | 'subscribed' // yeni abone oluşturuldu (double opt-in ise onay e-postası gönderildi)
  | 'already' // e-posta zaten kayıtlı
  | 'disabled' // env yapılandırılmamış; sessizce geçildi
  | 'invalid' // geçersiz e-posta
  | 'error'; // Listmonk tarafı / ağ hatası

export interface SubscribeResult {
  status: SubscribeStatus;
  /** İnsan-okur kısa mesaj (UI'da gösterilebilir, opsiyonel). */
  message?: string;
}

export interface SubscribeInput {
  email: string;
  /** Görünen ad; yoksa e-postanın yerel kısmı kullanılır. */
  name?: string;
  /** Hangi listelere; verilmezse env'deki varsayılan liste(ler). */
  lists?: number[];
  /** Aboneye yazılacak ek nitelikler (template/segment için). */
  attribs?: Record<string, unknown>;
  /** Formun kaynağı (lead_magnet / footer / ...). `attribs.source`'a yazılır. */
  source?: string;
}

interface ListmonkConfig {
  baseUrl: string; // sondaki / temizlenmiş
  user: string;
  token: string;
  lists: number[];
}

/** Env'i okuyup eksiksizse config döner; değilse null (graceful kapalı). */
function readConfig(): ListmonkConfig | null {
  const baseUrl = process.env.LISTMONK_API_URL?.replace(/\/+$/, '');
  const user = process.env.LISTMONK_API_USER;
  const token = process.env.LISTMONK_API_TOKEN;
  if (!baseUrl || !user || !token) return null;

  const lists = (process.env.LISTMONK_LIST_ID ?? '')
    .split(',')
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  return { baseUrl, user, token, lists };
}

/** Newsletter backend'i çağrılabilir durumda mı (UI'ı buna göre degrade et). */
export function isNewsletterConfigured(): boolean {
  return readConfig() !== null;
}

/** Basit ama yeterli e-posta doğrulaması (sunucu tarafı son kontrol). */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Yeni oluşturulan (unconfirmed) aboneye çift opt-in onay e-postasını
 * tetikler. Admin API kaydı tek başına bu e-postayı GÖNDERMEZ; bu uç,
 * panelin "Send opt-in campaign" eylemiyle aynı işi yapar. Hata
 * durumunda abonelik akışını bozmaz, yalnız loglar (manuel resend mümkün).
 */
async function sendOptin(config: ListmonkConfig, subscriberId: number): Promise<void> {
  try {
    const res = await fetch(`${config.baseUrl}/api/subscribers/${subscriberId}/optin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${config.user}:${config.token}`,
      },
      body: '{}',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[newsletter] opt-in e-postası gönderilemedi ${res.status}: ${detail.slice(0, 300)}`);
    }
  } catch (err) {
    console.error('[newsletter] opt-in isteği başarısız:', err);
  }
}

/**
 * Aboneyi Listmonk'a yazar; double opt-in listede onay e-postasını da
 * (`sendOptin`) tetikler. Onay tıklanana dek abone "unconfirmed" kalır.
 */
export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  const config = readConfig();
  if (!config) return { status: 'disabled' };

  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) return { status: 'invalid' };

  const lists = input.lists?.length ? input.lists : config.lists;
  const name = input.name?.trim() || email.split('@')[0];

  const body = {
    email,
    name,
    status: 'enabled' as const,
    lists,
    // false → double opt-in listede Listmonk onay e-postası gönderir (KVKK).
    preconfirm_subscriptions: false,
    attribs: {
      ...(input.attribs ?? {}),
      ...(input.source ? { source: input.source } : {}),
    },
  };

  try {
    const res = await fetch(`${config.baseUrl}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // v3+ önerilen biçim; BasicAuth da desteklenir.
        Authorization: `token ${config.user}:${config.token}`,
      },
      body: JSON.stringify(body),
      // ESP yavaşsa kullanıcıyı bekletme; 8 sn'de kes.
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      // Abone oluştu; opt-in onay e-postasını ayrı uçtan tetikle (admin API
      // otomatik göndermiyor). Yeni abonenin id'sini create yanıtından al.
      const created = (await res.json().catch(() => null)) as { data?: { id?: number } } | null;
      const id = created?.data?.id;
      if (id) await sendOptin(config, id);
      return { status: 'subscribed' };
    }

    // Listmonk e-posta zaten varsa 409 döner — kullanıcı için bu da başarıdır.
    if (res.status === 409) return { status: 'already' };

    const detail = await res.text().catch(() => '');
    console.error(`[newsletter] Listmonk ${res.status}: ${detail.slice(0, 300)}`);
    return { status: 'error' };
  } catch (err) {
    console.error('[newsletter] Listmonk isteği başarısız:', err);
    return { status: 'error' };
  }
}
