/**
 * Web uygulamasının Strapi'ye TEK bağlantı noktası.
 *
 * api-client'tan client örneğini env ile üretir. URL/token hardcode edilmez:
 *  - Server (SSR/build): STRAPI_INTERNAL_URL (Docker internal, http://cms:1337)
 *  - Tarayıcı tarafı (gerekirse): NEXT_PUBLIC_STRAPI_URL (public URL)
 *  - Token: STRAPI_API_TOKEN (opsiyonel; boşsa public read kullanılır)
 *
 * Veri çekme işlemleri server component'lerde yapıldığından varsayılan olarak
 * internal URL kullanılır.
 */
import { createClient } from '@stokoloji/api-client';

const isServer = typeof window === 'undefined';

const baseUrl = isServer
  ? process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    'http://cms:1337'
  : process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const strapi = createClient({
  baseUrl,
  token: process.env.STRAPI_API_TOKEN || undefined,
  defaultRevalidate: 60,
});

/** Tarayıcıdaki <img> vb. için medya URL'ini public hale getirir. */
export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const publicBase = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${publicBase}${url}`;
}
