'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

/**
 * Lead magnet bloğu (örn. Excel şablonu). Görünür olunca `lead_magnet_view`,
 * gönderilince `lead_magnet_submit` event'i atar. E-posta toplama backend'i
 * bu demoda KAPSAM DIŞI — submit yalnızca izlenir ve teşekkür gösterir.
 */
export function LeadMagnetBlock({
  id,
  baslik,
  aciklama,
}: {
  id: string;
  baslik: string;
  aciklama: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('lead_magnet_submit', { id });
    setSubmitted(true);
  };

  return (
    <div
      ref={ref}
      data-track="lead_magnet"
      className="my-8 rounded-xl border border-accent-500/30 bg-accent-500/5 p-6"
    >
      <p className="font-semibold text-brand-900">{baslik}</p>
      <p className="mt-1 text-sm text-muted">{aciklama}</p>
      {submitted ? (
        <p className="mt-4 text-sm font-medium text-accent-600">
          Teşekkürler! (Demo — gerçek gönderim bu iskelette kapsam dışı.)
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="E-posta adresiniz"
            className="flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent-500"
          />
          <button
            type="submit"
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
          >
            İndir
          </button>
        </form>
      )}
    </div>
  );
}
