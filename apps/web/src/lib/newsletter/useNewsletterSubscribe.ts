'use client';

import { useCallback, useState } from 'react';
import type { SubscribeStatus } from './listmonk';

/**
 * Newsletter abonelik hook'u — tek istek mantığı, tüm formlar paylaşır
 * (LeadMagnetForm, footer, ileride pop-up vb.). UI sunumu component'in işi;
 * burası yalnız `/api/newsletter`'a POST atıp durumu yönetir.
 *
 * `track()` çağrısı BURADA yapılmaz — hangi event'in atılacağını çağıran
 * component bilir (mimari kural 5: tracking merkezi katmandan, component
 * provider'a doğrudan dokunmaz).
 */

export type NewsletterPhase = 'idle' | 'loading' | 'success' | 'error';

export interface UseNewsletterSubscribe {
  phase: NewsletterPhase;
  /** Başarı/zaten-kayıtlı/devre-dışı ayrımı için ESP'nin döndüğü durum. */
  status: SubscribeStatus | null;
  /** true ise UI hata mesajı gösterebilir. */
  error: boolean;
  submit: (email: string) => Promise<SubscribeStatus | null>;
  reset: () => void;
}

export function useNewsletterSubscribe(source: string): UseNewsletterSubscribe {
  const [phase, setPhase] = useState<NewsletterPhase>('idle');
  const [status, setStatus] = useState<SubscribeStatus | null>(null);

  const submit = useCallback(
    async (email: string): Promise<SubscribeStatus | null> => {
      setPhase('loading');
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source }),
        });
        const data = (await res.json().catch(() => null)) as { status?: SubscribeStatus } | null;
        const next = data?.status ?? (res.ok ? 'subscribed' : 'error');
        setStatus(next);
        setPhase(res.ok ? 'success' : 'error');
        return next;
      } catch {
        setStatus('error');
        setPhase('error');
        return 'error';
      }
    },
    [source],
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setStatus(null);
  }, []);

  return { phase, status, error: phase === 'error', submit, reset };
}
