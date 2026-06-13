/**
 * Consent (onay) durumu — framework bağımsız çekirdek.
 *
 * Durum localStorage'da kalıcı tutulur. Hem track() (React dışı) hem de
 * React component'leri (useConsent) buradan okur. KVKK/Consent Mode v2 ile
 * uyumlu: varsayılan 'unknown' (=henüz onay yok → tracker yüklenmez).
 */

export type ConsentStatus = 'unknown' | 'granted' | 'denied';

const STORAGE_KEY = 'stokoloji_consent_v1';

function readStored(): ConsentStatus {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : 'unknown';
  } catch {
    return 'unknown';
  }
}

// Modül yüklenince (tarayıcıda) saklı değeri al.
let current: ConsentStatus = readStored();

const listeners = new Set<() => void>();

export function getConsent(): ConsentStatus {
  return current;
}

export function readStoredConsent(): ConsentStatus {
  return readStored();
}

export function setConsent(status: ConsentStatus): void {
  current = status;
  if (typeof window !== 'undefined') {
    try {
      if (status === 'unknown') {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, status);
      }
    } catch {
      /* yoksay */
    }
  }
  listeners.forEach((cb) => cb());
}

/** React useSyncExternalStore aboneliği için. */
export function onConsentChange(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
