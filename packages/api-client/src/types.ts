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
  sss?: Sss[] | null;
  yayinTarihi?: string | null;
  guncellemeTarihi?: string | null;
}

/**
 * Banner collection type — anasayfa hero carousel slide'ı.
 *
 * Banner kendi metnini tutmaz: bir blog VEYA bir araca bağlanır; başlık, excerpt
 * ve link o içerikten otomatik türetilir (bkz. web `lib/banners.ts`). `gorsel`
 * opsiyoneldir ve doluysa arka plan görselini override eder.
 */
export interface Banner extends StrapiEntityMeta {
  sira: number;
  blog?: Blog | null;
  arac?: Tool | null;
  gorsel?: StrapiMedia | null;
}

/** Duyuru barı ikon anahtarı — web `SiteHeader` `Icon` map'iyle birebir eşleşir. */
export type DuyuruIkon =
  | 'sheet'
  | 'etiket'
  | 'zil'
  | 'hediye'
  | 'bilgi'
  | 'yildiz'
  | 'yok';

/**
 * Duyuru collection type — en üstteki utility bar duyurusu.
 *
 * Birden fazla kayıt saklanır; `aktif` olanlardan en düşük `sira`'lı gösterilir.
 * Hiçbiri aktif değilse bar render edilmez.
 */
export interface Announcement extends StrapiEntityMeta {
  mesaj: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ikon?: DuyuruIkon | null;
  aktif?: boolean | null;
  sira?: number | null;
}

/** Anasayfa single type — öne çıkan içerik küratörlüğü (yazılar/araçlar). */
export interface Anasayfa extends StrapiEntityMeta {
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
