import type { MetadataRoute } from 'next';
import { strapi } from '@/lib/strapi';
import { distinctHarfSluglari } from '@/lib/sozluk';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let tools: Awaited<ReturnType<typeof strapi.listTools>> = [];
  let posts: Awaited<ReturnType<typeof strapi.listBlogPosts>> = [];
  let terimler: Awaited<ReturnType<typeof strapi.listSozlukTerimleri>> = [];
  try {
    tools = await strapi.listTools();
  } catch {
    tools = [];
  }
  try {
    posts = await strapi.listBlogPosts();
  } catch {
    posts = [];
  }
  try {
    terimler = await strapi.listSozlukTerimleri();
  } catch {
    terimler = [];
  }

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ['', '/rehber', '/araclar', '/icerik', '/sozluk'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/araclar/${tool.slug}`,
    lastModified: tool.updatedAt ? new Date(tool.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/icerik/${post.slug}`,
    lastModified: post.guncellemeTarihi
      ? new Date(post.guncellemeTarihi)
      : post.updatedAt
        ? new Date(post.updatedAt)
        : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const sozlukRoutes: MetadataRoute.Sitemap = distinctHarfSluglari(terimler).map((harf) => ({
    url: `${siteUrl}/sozluk/${harf}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes, ...sozlukRoutes];
}
