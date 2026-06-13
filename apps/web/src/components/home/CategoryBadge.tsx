import Link from 'next/link';

export interface CategoryBadgeProps {
  ad: string;
  href?: string;
  /** Koyu zeminde (hero/öne çıkan görsel üstü) kullanım için açık varyant. */
  ters?: boolean;
}

/** Küçük kategori pill'i. Link'li veya düz metin olarak kullanılabilir. */
export function CategoryBadge({ ad, href, ters = false }: CategoryBadgeProps) {
  const className = ters
    ? 'inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur'
    : 'inline-flex items-center rounded-full bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent-600';

  if (href) {
    return (
      <Link href={href} className={`${className} transition hover:opacity-80`}>
        {ad}
      </Link>
    );
  }
  return <span className={className}>{ad}</span>;
}
