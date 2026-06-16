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
  'populate[gorsel]': 'true',
};

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
