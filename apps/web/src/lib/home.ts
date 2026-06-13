import type { Blog, Kategori } from '@stokoloji/api-client';

export interface CategoryGroup {
  kategori: Kategori;
  posts: Blog[];
}

/**
 * Blog yazılarını kategorilerine göre gruplar. Kategorisi olmayan yazılar
 * atlanır. Grup sırası, yazıların geliş sırasındaki ilk görülme sırasına göre
 * korunur (liste zaten yayınTarihi:desc geldiği için en güncel kategori öne gelir).
 */
export function groupPostsByCategory(posts: Blog[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();

  for (const post of posts) {
    const kategori = post.kategori;
    if (!kategori) continue;
    const key = kategori.slug ?? String(kategori.id);
    const existing = groups.get(key);
    if (existing) {
      existing.posts.push(post);
    } else {
      groups.set(key, { kategori, posts: [post] });
    }
  }

  return Array.from(groups.values());
}
