'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 404 sayfasında "rastgele yazı" CTA'sı. Tıklamada slug listesinden rastgele
 * birini seçip ilgili içerik sayfasına yönlendirir; liste boşsa /icerik'e düşer.
 */
export function RandomPostLink({ slugs, className, children }: { slugs: string[]; className?: string; children: React.ReactNode }) {
  const router = useRouter();

  const go = useCallback(() => {
    if (slugs.length === 0) {
      router.push('/icerik');
      return;
    }
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/icerik/${slug}`);
  }, [slugs, router]);

  return (
    <button type="button" onClick={go} className={className}>
      {children}
    </button>
  );
}
