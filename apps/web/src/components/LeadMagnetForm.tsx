'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import { NewsletterForm } from './NewsletterForm';

/**
 * Anasayfa lead magnet formu (Excel şablonu). Bölüm görünür olunca
 * `lead_magnet_view`, e-posta gönderilince `lead_magnet_submit` event'i atar.
 *
 * E-posta toplama artık gerçek: reusable `NewsletterForm` → `/api/newsletter`
 * → Listmonk (çift opt-in, SES SMTP). Lead-magnet'e özgü funnel event'i
 * `onSuccess` ile atılır; generic `newsletter_submit`'i NewsletterForm yollar.
 */
export function LeadMagnetForm({ id = 'anasayfa-stok-yonetimi-paneli' }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !viewed.current) {
            viewed.current = true;
            track('lead_magnet_view', { id });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div ref={ref} data-track="lead_magnet">
      <NewsletterForm
        source={id}
        buttonLabel="İndir"
        successMessage="Teşekkürler! Onay e-postasını kontrol et; ardından şablonu göndereceğiz."
        onSuccess={() => track('lead_magnet_submit', { id })}
      />
    </div>
  );
}
