import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';

export interface FeaturedArticleProps {
  baslik: string;
  href: string;
  gorselUrl?: string | null;
  ozet?: string | null;
  kategoriAd?: string | null;
  kategoriHref?: string;
  tarih?: string | null;
}

/**
 * Büyük öne çıkan yazı kartı. Görsel üstüne yerleşen koyu degrade + metin
 * (görsel yoksa marka degradesine düşer). Hero altı vitrin için.
 */
export function FeaturedArticle({
  baslik,
  href,
  gorselUrl,
  ozet,
  kategoriAd,
  kategoriHref,
  tarih,
}: FeaturedArticleProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-brand-900">
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
        {gorselUrl ? (
          <Image
            src={gorselUrl}
            alt={baslik}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-700 via-brand-900 to-accent-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        {kategoriAd && (
          <div className="mb-3">
            <CategoryBadge ad={kategoriAd} href={kategoriHref} ters />
          </div>
        )}
        <h3 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
          <Link href={href} className="after:absolute after:inset-0">
            {baslik}
          </Link>
        </h3>
        {ozet && (
          <p className="mt-2 line-clamp-2 max-w-xl text-sm text-white/80 sm:text-base">
            {ozet}
          </p>
        )}
        {tarih && <p className="mt-3 text-xs text-white/60">{tarih}</p>}
      </div>
    </article>
  );
}
