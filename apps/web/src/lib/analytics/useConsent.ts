'use client';

import { useSyncExternalStore } from 'react';
import { getConsent, onConsentChange, type ConsentStatus } from './consent';

/** Consent durumunu React'e bağlar (banner + script yükleme için). */
export function useConsent(): ConsentStatus {
  return useSyncExternalStore<ConsentStatus>(
    onConsentChange,
    getConsent,
    () => 'unknown',
  );
}

/** Analitik yapılandırılmış mı? (env'de en az bir sağlayıcı ID'si var mı?) */
export function isAnalyticsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_CLARITY_ID,
  );
}
