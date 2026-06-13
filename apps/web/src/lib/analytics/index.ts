/**
 * Merkezi tracking abstraction — TEK giriş noktası.
 *
 * Component'ler doğrudan gtag/clarity ÇAĞIRMAZ; yalnızca bu `track()` fonksiyonunu
 * kullanır. track(), consent durumuna saygı duyar ve event'i tüm aktif
 * sağlayıcılara dağıtır. Sağlayıcı değişirse (Clarity çıkar/yeni araç girer)
 * yalnızca bu katman değişir, component kodu değişmez.
 */
import { getConsent } from './consent';
import { ga4Track } from './providers/ga4';
import { clarityTrack } from './providers/clarity';
import type { AnalyticsEventMap, AnalyticsEventName } from './types';

export function track<K extends AnalyticsEventName>(
  event: K,
  payload: AnalyticsEventMap[K],
): void {
  if (typeof window === 'undefined') return;
  // Onay yoksa hiçbir sağlayıcıya gönderme.
  if (getConsent() !== 'granted') return;

  ga4Track(event, payload);
  clarityTrack(event, payload);
}

export type { AnalyticsEventMap, AnalyticsEventName } from './types';
export {
  getConsent,
  setConsent,
  onConsentChange,
  readStoredConsent,
} from './consent';
export type { ConsentStatus } from './consent';
