import { PromoBanner, type PromoBannerProps } from './PromoBanner';

export interface BannerStripProps {
  bannerlar: PromoBannerProps[];
}

/** Promosyon bannerlarını responsive şeritte dizen ince wrapper. */
export function BannerStrip({ bannerlar }: BannerStripProps) {
  if (bannerlar.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bannerlar.map((banner, i) => (
        <PromoBanner key={`${banner.baslik}-${i}`} {...banner} />
      ))}
    </div>
  );
}
