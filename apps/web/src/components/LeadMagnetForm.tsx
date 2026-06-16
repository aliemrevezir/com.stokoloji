'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

/**
 * Anasayfa lead magnet formu (Excel şablonu). Bölüm görünür olunca
 * `lead_magnet_view`, e-posta gönderilince `lead_magnet_submit` event'i atar.
 *
 * E-posta toplama backend'i (Strapi `Abone` + Brevo) şimdilik KAPSAM DIŞI —
 * submit yalnızca izlenir ve teşekkür gösterir. Tracking, merkezi `track()`
 * katmanından geçer; burada doğrudan gtag/clarity YOKTUR.
 */
export function LeadMagnetForm({ id = 'anasayfa-stok-yonetimi-paneli' }: { id?: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const viewed = useRef(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('lead_magnet_submit', { id });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="lm-thanks" role="status">
        Teşekkürler! Şablonu en kısa sürede e-postanıza göndereceğiz.
      </p>
    );
  }

  return (
    <form ref={ref} className="lm-form" onSubmit={handleSubmit} data-track="lead_magnet">
      <input
        className="input"
        type="email"
        required
        placeholder="E-posta adresin"
        aria-label="E-posta"
      />
      <button className="btn btn-primary" type="submit">
        İndir
      </button>
    </form>
  );
}
