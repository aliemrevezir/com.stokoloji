import Image from 'next/image';
import Link from 'next/link';

export interface HeroCta {
  metin: string;
  link: string;
}

export interface HeroBannerProps {
  baslik?: string | null;
  /** Başlıktan sonra teal vurguyla gösterilen kelime/öbek. */
  vurgu?: string | null;
  altBaslik?: string | null;
  birincilCta?: HeroCta | null;
  ikincilCta?: HeroCta | null;
  /** Önceden çözülmüş (mediaUrl ile) görsel URL'i; yoksa dekoratif degrade. */
  gorselUrl?: string | null;
}

const FALLBACK = {
  baslik: 'Stok yönetimini',
  vurgu: 'sayılara dökün',
  altBaslik:
    'EOQ, emniyet stoğu ve stok devir hızı için ücretsiz, hızlı hesaplayıcılar; yanında uygulamalı rehberler.',
} as const;

/**
 * Premium hero banner — koyu petrol → teal degrade zemin. İçerik CMS'ten
 * gelir; alanlar boşsa makul fallback metnine düşer. Tek başına da kullanılabilir.
 */
export function HeroBanner({
  baslik,
  vurgu,
  altBaslik,
  birincilCta,
  ikincilCta,
  gorselUrl,
}: HeroBannerProps) {
  const _baslik = baslik?.trim() || FALLBACK.baslik;
  const _vurgu = vurgu?.trim() || (baslik ? null : FALLBACK.vurgu);
  const _altBaslik = altBaslik?.trim() || (baslik ? null : FALLBACK.altBaslik);
  const _birincil = birincilCta ?? { metin: 'Araçları keşfet', link: '/araclar' };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900 via-brand-700 to-accent-600 text-white">
      {/* Dekoratif ışıma */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl"
        aria-hidden
      />
      <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {_baslik}
            {_vurgu && (
              <>
                {' '}
                <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                  {_vurgu}
                </span>
              </>
            )}
          </h1>
          {_altBaslik && (
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              {_altBaslik}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={_birincil.link}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-white/90"
            >
              {_birincil.metin}
            </Link>
            {ikincilCta && (
              <Link
                href={ikincilCta.link}
                className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {ikincilCta.metin}
              </Link>
            )}
          </div>
        </div>

        {gorselUrl && (
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-white/20 lg:block">
            <Image
              src={gorselUrl}
              alt={_baslik}
              fill
              priority
              sizes="40vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
