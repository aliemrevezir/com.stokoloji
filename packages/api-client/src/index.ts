/**
 * @stokoloji/api-client — Strapi ile konuşmak için TEK giriş noktası.
 *
 * Next.js (veya başka bir tüketici) Strapi'ye doğrudan `fetch` ATMAZ; her zaman
 * bu client üzerinden konuşur. URL ve token yalnızca `createClient` argümanından
 * gelir — burada hiçbir şey hardcode edilmez.
 */

import type {
  Anasayfa,
  Announcement,
  Banner,
  Blog,
  SozlukTerimi,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  Tool,
} from './types';

export * from './types';

export interface StrapiClientOptions {
  /** Örn. SSR'da `http://cms:1337`, tarayıcıda public URL. */
  baseUrl: string;
  /** Opsiyonel. Doluysa `Authorization: Bearer <token>` gönderilir. */
  token?: string;
  /** Next.js ISR için varsayılan revalidate (saniye). */
  defaultRevalidate?: number;
}

export interface FetchOptions {
  /** Bu istek için ISR revalidate süresi (saniye). */
  revalidate?: number;
  /** Ek query parametreleri (Strapi qs formatı). */
  query?: Record<string, string>;
}

const TOOL_POPULATE: Record<string, string> = {
  'populate[seo][populate]': 'ogImage',
  'populate[kapakGorseli]': 'true',
  'populate[kategori]': 'true',
  'populate[sss]': 'true',
  'populate[iliskiliYazilar]': 'true',
};

const BLOG_POPULATE: Record<string, string> = {
  'populate[seo][populate]': 'ogImage',
  'populate[kategori]': 'true',
  'populate[yazar][populate]': 'avatar',
  'populate[kapakGorseli]': 'true',
  'populate[iliskiliTool]': 'true',
  'populate[sss]': 'true',
};

const HOME_POPULATE: Record<string, string> = {
  'populate[oneCikanYazilar][populate][kapakGorseli]': 'true',
  'populate[oneCikanYazilar][populate][kategori]': 'true',
  'populate[oneCikanYazilar][populate][seo]': 'true',
  'populate[oneCikanAraclar][populate][kategori]': 'true',
};

const BANNER_POPULATE: Record<string, string> = {
  // Blog'tan başlık/excerpt/kapak; araçtan başlık/kısa açıklama türetilir.
  'populate[blog][populate][kapakGorseli]': 'true',
  'populate[blog][populate][seo]': 'true',
  'populate[blog][populate][kategori]': 'true',
  'populate[arac][populate][kategori]': 'true',
  'populate[arac][populate][kapakGorseli]': 'true',
  'populate[gorsel]': 'true',
};

const SOZLUK_POPULATE: Record<string, string> = {
  'populate[ilgiliTerimler]': 'true',
  'populate[seo][populate]': 'ogImage',
};

/**
 * Türk alfabesi gösterim sırası (29 harf). Sözlük gruplama/sıralaması bu sıraya
 * göre yapılır; JS'in `localeCompare('tr')`'ı yerine sabit indeks kullanılır.
 */
export const TR_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z',
] as const;

/** Türkçe diakritik harf → ASCII URL segmenti. Ç→c, Ğ→g, ı/İ/I→i, Ö→o, Ş→s, Ü→u. */
export function harfToSlug(harf: string): string {
  const map: Record<string, string> = {
    Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u',
  };
  const upper = harf.toLocaleUpperCase('tr');
  return (map[upper] ?? upper.toLocaleLowerCase('en')).normalize('NFC');
}

/** ASCII harf segmenti → o sayfada toplanacak Türk alfabesi harfleri. 'c' → ['C','Ç']. */
export function harflerForSlug(asciiHarf: string): string[] {
  const slug = asciiHarf.toLowerCase();
  return TR_ALPHABET.filter((h) => harfToSlug(h) === slug);
}

export function createClient(options: StrapiClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const defaultRevalidate = options.defaultRevalidate ?? 60;

  async function request<T>(path: string, opts: FetchOptions = {}): Promise<T> {
    const url = new URL(`${baseUrl}/api${path}`);
    if (opts.query) {
      for (const [key, value] of Object.entries(opts.query)) {
        url.searchParams.set(key, value);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const res = await fetch(url.toString(), {
      headers,
      // Next.js'in ISR cache'i bu alanı okur; başka runtime'larda yok sayılır.
      next: { revalidate: opts.revalidate ?? defaultRevalidate },
    } as RequestInit);

    if (!res.ok) {
      throw new Error(
        `Strapi isteği başarısız (${res.status} ${res.statusText}): ${path}`,
      );
    }

    return (await res.json()) as T;
  }

  function buildQuery(
    base: Record<string, string>,
    extra?: Record<string, string>,
  ): Record<string, string> {
    return { ...base, ...extra };
  }

  return {
    /** Tek bir tool'u slug ile getirir (yoksa null). */
    async getTool(slug: string, opts: FetchOptions = {}): Promise<Tool | null> {
      const data = await request<StrapiCollectionResponse<Tool>>('/tools', {
        ...opts,
        query: buildQuery(
          { 'filters[slug][$eq]': slug, ...TOOL_POPULATE },
          opts.query,
        ),
      });
      return data.data[0] ?? null;
    },

    /** Tüm tool'ları listeler (liste/sitemap için). */
    async listTools(opts: FetchOptions = {}): Promise<Tool[]> {
      const data = await request<StrapiCollectionResponse<Tool>>('/tools', {
        ...opts,
        query: buildQuery(
          {
            'populate[kategori]': 'true',
            'populate[kapakGorseli]': 'true',
            'sort': 'ad:asc',
          },
          opts.query,
        ),
      });
      return data.data;
    },

    /** Tek bir blog yazısını slug ile getirir (yoksa null). */
    async getBlogPost(
      slug: string,
      opts: FetchOptions = {},
    ): Promise<Blog | null> {
      const data = await request<StrapiCollectionResponse<Blog>>('/blogs', {
        ...opts,
        query: buildQuery(
          { 'filters[slug][$eq]': slug, ...BLOG_POPULATE },
          opts.query,
        ),
      });
      return data.data[0] ?? null;
    },

    /** Tüm blog yazılarını listeler. */
    async listBlogPosts(opts: FetchOptions = {}): Promise<Blog[]> {
      const data = await request<StrapiCollectionResponse<Blog>>('/blogs', {
        ...opts,
        query: buildQuery(
          {
            'populate[kategori]': 'true',
            'populate[kapakGorseli]': 'true',
            'populate[seo]': 'true',
            'populate[yazar]': 'true',
            'sort': 'yayinTarihi:desc',
          },
          opts.query,
        ),
      });
      return data.data;
    },

    /** Yayınlanmış hero carousel banner'larını sıra (sira) artan getirir. */
    async listBanners(opts: FetchOptions = {}): Promise<Banner[]> {
      const data = await request<StrapiCollectionResponse<Banner>>('/banners', {
        ...opts,
        query: buildQuery(
          { 'sort': 'sira:asc', ...BANNER_POPULATE },
          opts.query,
        ),
      });
      return data.data;
    },

    /**
     * Aktif duyuru barını getirir (yoksa null).
     *
     * Birden fazla duyuru `aktif=true` olabilir; en düşük `sira`'lı tek kayıt
     * döner. Hiç aktif kayıt yoksa null → bar render edilmez.
     */
    async getActiveAnnouncement(
      opts: FetchOptions = {},
    ): Promise<Announcement | null> {
      const data = await request<StrapiCollectionResponse<Announcement>>(
        '/duyurular',
        {
          ...opts,
          query: buildQuery(
            {
              'filters[aktif][$eq]': 'true',
              'sort': 'sira:asc',
              'pagination[limit]': '1',
            },
            opts.query,
          ),
        },
      );
      return data.data[0] ?? null;
    },

    /** Tüm sözlük terimlerini kelimeye göre artan getirir (liste/sitemap için). */
    async listSozlukTerimleri(
      opts: FetchOptions = {},
    ): Promise<SozlukTerimi[]> {
      const data = await request<StrapiCollectionResponse<SozlukTerimi>>(
        '/sozluk-terimleri',
        {
          ...opts,
          query: buildQuery(
            { 'sort': 'kelime:asc', 'pagination[limit]': '500', ...SOZLUK_POPULATE },
            opts.query,
          ),
        },
      );
      return data.data;
    },

    /**
     * Bir ASCII harf segmentine ait sözlük terimlerini getirir.
     *
     * URL Türkçe karaktersizdir; diakritik harfler base harfe katlanır
     * (`/sozluk/c` → C ve Ç). Bu yüzden tek harf değil, `harflerForSlug` ile
     * bulunan Türk alfabesi harf kümesi `$in` ile filtrelenir.
     */
    async listSozlukByHarf(
      asciiHarf: string,
      opts: FetchOptions = {},
    ): Promise<SozlukTerimi[]> {
      const harfler = harflerForSlug(asciiHarf);
      if (harfler.length === 0) return [];
      const filters: Record<string, string> = {};
      harfler.forEach((h, i) => {
        filters[`filters[baslangicHarfi][$in][${i}]`] = h;
      });
      const data = await request<StrapiCollectionResponse<SozlukTerimi>>(
        '/sozluk-terimleri',
        {
          ...opts,
          query: buildQuery(
            { 'sort': 'kelime:asc', 'pagination[limit]': '200', ...filters, ...SOZLUK_POPULATE },
            opts.query,
          ),
        },
      );
      return data.data;
    },

    /** Anasayfa single type'ını getirir (hero, öne çıkan içerik). */
    async getHomepage(opts: FetchOptions = {}): Promise<Anasayfa | null> {
      const data = await request<StrapiSingleResponse<Anasayfa>>('/anasayfa', {
        ...opts,
        query: buildQuery(HOME_POPULATE, opts.query),
      });
      return data.data ?? null;
    },

    /** Düşük seviye erişim (gerekirse). */
    request,
  };
}

export type StrapiClient = ReturnType<typeof createClient>;
