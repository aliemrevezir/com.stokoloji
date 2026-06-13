import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';

export interface ArticleCardProps {
  baslik: string;
  href: string;
  /** Önceden çözülmüş (mediaUrl ile) kapak görseli URL'i. */
  gorselUrl?: string | null;
  ozet?: string | null;
  kategoriAd?: string | null;
  kategoriHref?: string;
  tarih?: string | null;
}

/** Blog yazısı kartı (kapak görseli + kategori + başlık + özet + tarih). */
export function ArticleCard({
  baslik,
  href,
  gorselUrl,
  ozet,
  kategoriAd,
  kategoriHref,
  tarih,
}: ArticleCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-brand-50">
        {gorselUrl ? (
          <Image
            src={gorselUrl}
            alt={baslik}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 to-accent-500/10 font-mono text-2xl font-bold text-brand-700/40">
            Stokoloji
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {kategoriAd && (
          <div className="mb-2">
            <CategoryBadge ad={kategoriAd} href={kategoriHref} />
          </div>
        )}
        <h3 className="font-semibold leading-snug text-brand-900">
          <Link href={href} className="group-hover:text-accent-600">
            {baslik}
          </Link>
        </h3>
        {ozet && <p className="mt-1.5 line-clamp-2 text-sm text-muted">{ozet}</p>}
        {tarih && <p className="mt-3 text-xs text-muted">{tarih}</p>}
      </div>
    </article>
  );
}
