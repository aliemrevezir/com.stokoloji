/** GA4 sağlayıcı adaptörü. Sadece bu dosya gtag API'sini bilir. */
import type { AnalyticsEventName, AnalyticsPayload } from '../types';

type Gtag = (...args: unknown[]) => void;

function getGtag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { gtag?: Gtag };
  return typeof w.gtag === 'function' ? w.gtag : null;
}

export function ga4Track(event: AnalyticsEventName, payload: AnalyticsPayload): void {
  const gtag = getGtag();
  if (!gtag) return;
  gtag('event', event, payload);
}

/** Consent Mode v2 güncellemesi. */
export function ga4UpdateConsent(granted: boolean): void {
  const gtag = getGtag();
  if (!gtag) return;
  const value = granted ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}
