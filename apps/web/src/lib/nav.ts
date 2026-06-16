/**
 * Header / footer chrome için navigasyon verisi.
 *
 * Strapi'den araç + yazı listelerini çeker; Strapi kapalıysa (dev/ilk kurulum)
 * statik fallback listesine düşer ki chrome her durumda render olsun.
 * Tüm değerler serileştirilebilir (client SiteHeader'a prop olarak geçer).
 */
import type { Blog, Tool } from '@stokoloji/api-client';
import { strapi, mediaUrl } from './strapi';

/** Kategori renk anahtarı — theme.css'teki --cat-* ve chip data-cat ile eşleşir. */
export type CatKey = 'stok' | 'uretim' | 'maliyet' | 'analiz' | 'tedarik';

export interface NavItem {
  name: string;
  href: string;
  cat: CatKey;
  /** Mega menü "öne çıkan" önizlemesinde chip etiketi (ör. "Stok Yönetimi"). */
  catLabel?: string;
  /** Önizleme alt metni (tool: kısa açıklama, yazı: SEO açıklaması). */
  desc?: string;
  /** Önizleme kapak görseli — mediaUrl ile çözülmüş mutlak URL. */
  imageUrl?: string | null;
}

/** CatKey → okunabilir etiket (Strapi kategorisi yoksa fallback). */
export const CAT_LABEL: Record<CatKey, string> = {
  stok: 'Stok Yönetimi',
  uretim: 'Üretim Planlama',
  maliyet: 'Maliyet / Finans',
  analiz: 'Analiz / Veri',
  tedarik: 'Tedarik',
};

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
  { label: 'Stok Yönetimi', href: '/rehber#stok', cat: 'stok' },
  { label: 'Üretim Planlama', href: '/rehber#uretim', cat: 'uretim' },
  { label: 'Maliyet / Finans', href: '/rehber#maliyet', cat: 'maliyet' },
  { label: 'Analiz / Veri', href: '/rehber#analiz', cat: 'analiz' },
  { label: 'Tedarik', href: '/rehber#tedarik', cat: 'tedarik' },
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
  { name: 'EOQ nedir ve nasıl hesaplanır?', cat: 'stok', href: '/icerik' },
  { name: 'Emniyet stoğu formülü ve servis seviyesi', cat: 'stok', href: '/icerik' },
  { name: 'ABC analizi ile stok önceliklendirme', cat: 'analiz', href: '/icerik' },
  { name: 'Stok devir hızı kaç olmalı?', cat: 'analiz', href: '/icerik' },
  { name: 'MRP ve üretim planlamanın temelleri', cat: 'uretim', href: '/icerik' },
];

function toolItem(t: Tool): NavItem {
  const cat = categoryKey(t.kategori?.slug ?? t.kategori?.ad);
  return {
    name: t.ad,
    href: `/araclar/${t.slug}`,
    cat,
    catLabel: t.kategori?.ad ?? CAT_LABEL[cat],
    desc: t.kisaAciklama ?? undefined,
    imageUrl: mediaUrl(t.kapakGorseli?.url),
  };
}
function postItem(p: Blog): NavItem {
  const cat = categoryKey(p.kategori?.slug ?? p.kategori?.ad);
  return {
    name: p.baslik,
    href: `/icerik/${p.slug}`,
    cat,
    catLabel: p.kategori?.ad ?? CAT_LABEL[cat],
    desc: p.seo?.description ?? undefined,
    imageUrl: mediaUrl(p.kapakGorseli?.url),
  };
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
