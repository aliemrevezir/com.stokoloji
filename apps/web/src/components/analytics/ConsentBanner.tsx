'use client';

import { setConsent } from '@/lib/analytics';
import { useConsent, isAnalyticsConfigured } from '@/lib/analytics/useConsent';

/**
 * KVKK uyumlu cookie consent banner'ı (CMP).
 * - Analitik yapılandırılmamışsa (env boş) görünmez.
 * - Onay verilene/reddedilene kadar gösterilir; tercih kalıcı saklanır.
 * - Onay verilince AnalyticsScripts tetiklenir (useConsent üzerinden).
 */
export function ConsentBanner() {
  const status = useConsent();

  if (!isAnalyticsConfigured()) return null;
  if (status !== 'unknown') return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihleri"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Bu site, deneyimi iyileştirmek ve trafiği anlamak için çerez kullanır.
          Onayınız olmadan hiçbir analitik/izleme aracı yüklenmez.{' '}
          <a href="/gizlilik" className="font-medium text-brand-700 underline">
            Gizlilik politikası
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent('denied')}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-brand-900 hover:bg-canvas"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => setConsent('granted')}
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
