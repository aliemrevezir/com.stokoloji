/**
 * Banner → carousel slide çözümleme.
 *
 * Banner Strapi'de yalnızca bir referans tutar (blog VEYA arac) + opsiyonel
 * görsel + sıra. Görünüm verisi (başlık, excerpt, link, görsel) buradaki SAF
 * fonksiyonla türetilir; bu sayede mantık test edilebilir ve UI'den ayrıdır.
 *
 * Görsel önceliği: banner.gorsel → blog.kapakGorseli → (yok → degrade).
 */
import type { Banner } from '@stokoloji/api-client';
import { mediaUrl } from './strapi';

export interface BannerSlide {
  /** Stabil anahtar (React key + sıralama). */
  key: string;
  baslik: string;
  excerpt: string;
  href: string;
  /** Çözülmüş public görsel URL'i; yoksa null (degrade arka plan). */
  gorselUrl: string | null;
  gorselAlt: string;
}

/** Tek bir banner'ı slide'a çevirir; bağlı içerik yoksa null döner. */
export function resolveBannerSlide(banner: Banner): BannerSlide | null {
  if (banner.blog) {
    const blog = banner.blog;
    return {
      key: `banner-${banner.id}`,
      baslik: blog.baslik,
      excerpt: blog.seo?.description ?? '',
      href: `/icerik/${blog.slug}`,
      gorselUrl: mediaUrl(banner.gorsel?.url) ?? mediaUrl(blog.kapakGorseli?.url),
      gorselAlt:
        banner.gorsel?.alternativeText ??
        blog.kapakGorseli?.alternativeText ??
        blog.baslik,
    };
  }

  if (banner.arac) {
    const arac = banner.arac;
    return {
      key: `banner-${banner.id}`,
      baslik: arac.ad,
      excerpt: arac.kisaAciklama ?? '',
      href: `/araclar/${arac.slug}`,
      gorselUrl: mediaUrl(banner.gorsel?.url),
      gorselAlt: banner.gorsel?.alternativeText ?? arac.ad,
    };
  }

  return null;
}

/** Banner listesini render edilebilir slide dizisine çevirir (boşları atar). */
export function resolveBannerSlides(banners: Banner[]): BannerSlide[] {
  return banners.map(resolveBannerSlide).filter((s): s is BannerSlide => s !== null);
}
