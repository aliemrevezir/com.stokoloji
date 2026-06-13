import Link from 'next/link';

export interface SectionHeadingProps {
  baslik: string;
  /** Verilirse sağda "Tümü →" linki gösterilir. */
  href?: string;
  linkMetni?: string;
}

/** Bölüm başlığı + opsiyonel "Tümü →" linki. Anasayfa bölümlerinde tekrar kullanılır. */
export function SectionHeading({
  baslik,
  href,
  linkMetni = 'Tümü →',
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between border-b border-line pb-3">
      <h2 className="text-xl font-semibold tracking-tight text-brand-900 sm:text-2xl">
        {baslik}
      </h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-accent-600 hover:underline"
        >
          {linkMetni}
        </Link>
      )}
    </div>
  );
}
