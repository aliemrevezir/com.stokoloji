/**
 * Strapi 5 REST response tipleri.
 *
 * NOT: Bunlar MVP için elle yazılmış, Strapi içerik modeline birebir karşılık
 * gelen tiplerdir. İçerik modeli büyüdükçe `strapi ts:generate-types` ile
 * otomatik üretime geçilebilir (bkz. README "Tip üretimi" bölümü) ve burada
 * yalnızca düzleştirilmiş (flattened) görünüm tutulabilir.
 *
 * Strapi 5'te REST yanıtları artık `attributes` altında DEĞİL; alanlar doğrudan
 * nesnenin üstünde döner. İlişkiler de doğrudan iç içe nesne olarak gelir.
 */

/** Strapi'nin her kayıtta döndürdüğü temel sistem alanları. */
export interface StrapiEntityMeta {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string | null;
}

/** Strapi `blocks` alanı — zengin metin düğümleri dizisi. */
export type BlocksContent = unknown[];

/** Strapi media nesnesi (kapak görseli vb.). */
export interface StrapiMedia extends StrapiEntityMeta {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
}

/** SEO component (seo.meta). */
export interface SeoMeta {
  title?: string | null;
  description?: string | null;
  ogImage?: StrapiMedia | null;
}

/** SSS component (content.sss) — repeatable. */
export interface Sss {
  id?: number;
  soru: string;
  cevap: string;
}

export interface Kategori extends StrapiEntityMeta {
  ad: string;
  slug: string;
}

export interface Yazar extends StrapiEntityMeta {
  ad: string;
  unvan?: string | null;
  bio?: string | null;
  avatar?: StrapiMedia | null;
}

export interface Tool extends StrapiEntityMeta {
  ad: string;
  slug: string;
  kisaAciklama?: string | null;
  formulAciklamasi?: BlocksContent | null;
  seo?: SeoMeta | null;
  kategori?: Kategori | null;
  sss?: Sss[] | null;
  iliskiliYazilar?: Blog[] | null;
}

export interface Blog extends StrapiEntityMeta {
  baslik: string;
  slug: string;
  icerik?: BlocksContent | null;
  kapakGorseli?: StrapiMedia | null;
  seo?: SeoMeta | null;
  kategori?: Kategori | null;
  yazar?: Yazar | null;
  iliskiliTool?: Tool | null;
  yayinTarihi?: string | null;
  guncellemeTarihi?: string | null;
}

/** Hero component (content.hero) — anasayfa banner içeriği. */
export interface Hero {
  id?: number;
  baslik: string;
  vurgu?: string | null;
  altBaslik?: string | null;
  birincilCtaMetni?: string | null;
  birincilCtaLink?: string | null;
  ikincilCtaMetni?: string | null;
  ikincilCtaLink?: string | null;
  gorsel?: StrapiMedia | null;
}

/** Banner component (content.banner) — repeatable promosyon bannerı. */
export interface Banner {
  id?: number;
  baslik: string;
  aciklama?: string | null;
  vurguMetni?: string | null;
  link?: string | null;
  gorsel?: StrapiMedia | null;
}

/** Anasayfa single type — hero, bannerlar ve öne çıkan içerik küratörlüğü. */
export interface Anasayfa extends StrapiEntityMeta {
  hero?: Hero | null;
  bannerlar?: Banner[] | null;
  oneCikanYazilar?: Blog[] | null;
  oneCikanAraclar?: Tool[] | null;
}

/** Strapi REST collection yanıtı. */
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/** Strapi REST single yanıtı. */
export interface StrapiSingleResponse<T> {
  data: T | null;
  meta?: Record<string, unknown>;
}
