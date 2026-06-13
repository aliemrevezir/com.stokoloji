/** Microsoft Clarity sağlayıcı adaptörü. Sadece bu dosya clarity API'sini bilir. */
import type { AnalyticsEventName, AnalyticsPayload } from '../types';

type Clarity = (...args: unknown[]) => void;

function getClarity(): Clarity | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { clarity?: Clarity };
  return typeof w.clarity === 'function' ? w.clarity : null;
}

export function clarityTrack(event: AnalyticsEventName, payload: AnalyticsPayload): void {
  const clarity = getClarity();
  if (!clarity) return;
  // Clarity custom event + ana etiketleri tag olarak işaretle.
  clarity('event', event);
  for (const [key, val] of Object.entries(payload)) {
    if (val !== undefined) clarity('set', key, String(val));
  }
}

export function clarityUpdateConsent(granted: boolean): void {
  const clarity = getClarity();
  if (!clarity) return;
  clarity('consent', granted);
}
