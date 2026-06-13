import Image from 'next/image';
import Link from 'next/link';

export interface PromoBannerProps {
  baslik: string;
  aciklama?: string | null;
  vurguMetni?: string | null;
  link?: string | null;
  /** Önceden çözülmüş (mediaUrl ile) görsel URL'i. */
  gorselUrl?: string | null;
}

/** Tekil promosyon bannerı. Görselli ya da düz degrade zeminli çalışır. */
export function PromoBanner({
  baslik,
  aciklama,
  vurguMetni,
  link,
  gorselUrl,
}: PromoBannerProps) {
  const inner = (
    <div className="group relative flex min-h-[9rem] flex-col justify-end overflow-hidden rounded-xl border border-line bg-brand-900 p-5 text-white">
      {gorselUrl ? (
        <Image
          src={gorselUrl}
          alt={baslik}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-accent-600" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 to-transparent" />
      <div className="relative">
        {vurguMetni && (
          <span className="inline-flex items-center rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            {vurguMetni}
          </span>
        )}
        <p className="mt-2 text-lg font-semibold leading-snug">{baslik}</p>
        {aciklama && (
          <p className="mt-1 line-clamp-2 text-sm text-white/80">{aciklama}</p>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
