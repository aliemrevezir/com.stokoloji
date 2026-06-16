/** Analitik event sözlüğü — tipli. Tüm track() çağrıları buradan tip alır. */

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export interface AnalyticsEventMap {
  /** Bir hesaplayıcı çalıştırıldı (EOQ demo butonuna bağlı). */
  tool_calculated: { tool_slug: string; sonuc?: string } & AnalyticsPayload;
  /** CTA tıklaması. */
  cta_click: { label: string; konum?: string } & AnalyticsPayload;
  /** Lead magnet bloğu görüntülendi. */
  lead_magnet_view: { id: string } & AnalyticsPayload;
  /** Lead magnet formu gönderildi. */
  lead_magnet_submit: { id: string } & AnalyticsPayload;
  /** Üst duyuru barındaki CTA'ya tıklandı ("duyuruya basanlar"). */
  duyuru_click: { label: string; href: string; duyuru_id?: string } & AnalyticsPayload;
  /** Sayfa kaydırma derinliği eşiği aşıldı. */
  scroll_depth: { yuzde: number } & AnalyticsPayload;
  /** Dış bağlantıya tıklandı. */
  outbound_link: { url: string } & AnalyticsPayload;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
