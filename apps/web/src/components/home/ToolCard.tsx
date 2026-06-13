import Link from 'next/link';

export interface ToolCardProps {
  ad: string;
  href: string;
  kisaAciklama?: string | null;
  kategoriAd?: string | null;
}

/** Araç vitrini kartı. Anasayfa ve liste sayfalarında tekrar kullanılabilir. */
export function ToolCard({ ad, href, kisaAciklama, kategoriAd }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-md"
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 font-mono text-sm font-bold text-accent-600">
        {ad.charAt(0)}
      </div>
      {kategoriAd && (
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {kategoriAd}
        </p>
      )}
      <p className="mt-0.5 font-semibold text-brand-900 group-hover:text-accent-600">
        {ad}
      </p>
      {kisaAciklama && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">{kisaAciklama}</p>
      )}
      <span className="mt-3 text-sm font-medium text-accent-600">
        Hesapla →
      </span>
    </Link>
  );
}
