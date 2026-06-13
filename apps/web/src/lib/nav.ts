/**
 * Header / footer chrome için navigasyon verisi.
 *
 * Strapi'den araç + yazı listelerini çeker; Strapi kapalıysa (dev/ilk kurulum)
 * statik fallback listesine düşer ki chrome her durumda render olsun.
 * Tüm değerler serileştirilebilir (client SiteHeader'a prop olarak geçer).
 */
import type { Blog, Tool } from '@stokoloji/api-client';
import { strapi } from './strapi';

/** Kategori renk anahtarı — theme.css'teki --cat-* ve chip data-cat ile eşleşir. */
export type CatKey = 'stok' | 'uretim' | 'maliyet' | 'analiz' | 'tedarik';

export interface NavItem {
  name: string;
  href: string;
  cat: CatKey;
}

export interface NavCategory {
  label: string;
  href: string;
  cat: CatKey;
}

export interface NavData {
  tools: NavItem[];
  posts: NavItem[];
  categories: NavCategory[];
}

/** Strapi kategori slug/adından renk anahtarını türetir. */
export function categoryKey(value?: string | null): CatKey {
  const v = (value ?? '').toLowerCase();
  if (v.includes('uretim') || v.includes('üretim')) return 'uretim';
  if (v.includes('maliyet') || v.includes('finans')) return 'maliyet';
  if (v.includes('analiz') || v.includes('veri')) return 'analiz';
  if (v.includes('tedarik')) return 'tedarik';
  return 'stok';
}

export const CATEGORIES: NavCategory[] = [
  { label: 'Stok Yönetimi', href: '/araclar', cat: 'stok' },
  { label: 'Üretim Planlama', href: '/araclar', cat: 'uretim' },
  { label: 'Maliyet / Finans', href: '/araclar', cat: 'maliyet' },
  { label: 'Analiz / Veri', href: '/araclar', cat: 'analiz' },
  { label: 'Tedarik', href: '/araclar', cat: 'tedarik' },
];

const FALLBACK_TOOLS: NavItem[] = [
  { name: 'EOQ (Ekonomik Sipariş Miktarı)', cat: 'stok', href: '/araclar/eoq-hesaplama' },
  { name: 'Emniyet Stoğu', cat: 'stok', href: '/araclar' },
  { name: 'Yeniden Sipariş Noktası (ROP)', cat: 'stok', href: '/araclar' },
  { name: 'ABC Analizi', cat: 'analiz', href: '/araclar' },
  { name: 'Stok Devir Hızı', cat: 'analiz', href: '/araclar' },
  { name: 'Üretim Parti Büyüklüğü', cat: 'uretim', href: '/araclar' },
];

const FALLBACK_POSTS: NavItem[] = [
  { name: 'EOQ nedir ve nasıl hesaplanır?', cat: 'stok', href: '/blog' },
  { name: 'Emniyet stoğu formülü ve servis seviyesi', cat: 'stok', href: '/blog' },
  { name: 'ABC analizi ile stok önceliklendirme', cat: 'analiz', href: '/blog' },
  { name: 'Stok devir hızı kaç olmalı?', cat: 'analiz', href: '/blog' },
  { name: 'MRP ve üretim planlamanın temelleri', cat: 'uretim', href: '/blog' },
];

function toolItem(t: Tool): NavItem {
  return { name: t.ad, href: `/araclar/${t.slug}`, cat: categoryKey(t.kategori?.slug ?? t.kategori?.ad) };
}
function postItem(p: Blog): NavItem {
  return { name: p.baslik, href: `/blog/${p.slug}`, cat: categoryKey(p.kategori?.slug ?? p.kategori?.ad) };
}

/** Strapi'den nav verisini topla; hata olursa statik fallback. */
export async function getNavData(): Promise<NavData> {
  const [tools, posts] = await Promise.all([
    strapi.listTools().catch(() => [] as Tool[]),
    strapi.listBlogPosts().catch(() => [] as Blog[]),
  ]);

  return {
    tools: tools.length ? tools.slice(0, 6).map(toolItem) : FALLBACK_TOOLS,
    posts: posts.length ? posts.slice(0, 6).map(postItem) : FALLBACK_POSTS,
    categories: CATEGORIES,
  };
}
