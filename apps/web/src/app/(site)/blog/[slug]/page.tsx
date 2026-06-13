import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { strapi, mediaUrl } from '@/lib/strapi';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BlocksRenderer } from '@/components/BlocksRenderer';
import { TOCSidebar } from '@/components/TOCSidebar';
import { AuthorBox } from '@/components/AuthorBox';
import { JsonLd } from '@/components/JsonLd';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { ScrollDepthTracker } from '@/components/analytics/ScrollDepthTracker';
import { articleJsonLd, breadcrumbListJsonLd } from '@/lib/seo/jsonld';
import { extractToc } from '@/lib/blocks';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  try {
    const posts = await strapi.listBlogPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await strapi.getBlogPost(slug).catch(() => null);
  if (!post) return {};
  const title = post.seo?.title ?? post.baslik;
  const description = post.seo?.description ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title, description, type: 'article' },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await strapi.getBlogPost(slug).catch(() => null);
  if (!post) notFound();

  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  const toc = extractToc(post.icerik);
  const crumbs = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.baslik, href: `/blog/${post.slug}` },
  ];

  return (
    <article className="container" style={{ paddingBlock: 'var(--s-6) var(--s-8)' }}>
      <ScrollDepthTracker />
      <JsonLd
        data={breadcrumbListJsonLd(crumbs.map((c) => ({ name: c.name, url: `${siteUrl}${c.href}` })))}
      />
      <JsonLd
        data={articleJsonLd({
          headline: post.baslik,
          description: post.seo?.description ?? post.baslik,
          url: pageUrl,
          authorName: post.yazar?.ad,
          datePublished: post.yayinTarihi ?? post.publishedAt ?? undefined,
          dateModified: post.guncellemeTarihi ?? undefined,
          image: mediaUrl(post.kapakGorseli?.url),
        })}
      />

      <Breadcrumb items={crumbs} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <TOCSidebar items={toc} />
        </aside>

        <div className="min-w-0">
          <h1 className="h1">{post.baslik}</h1>
          {post.yazar && (
            <p className="small muted" style={{ marginTop: 'var(--s-3)' }}>
              {post.yazar.ad}
              {post.yazar.unvan ? ` · ${post.yazar.unvan}` : ''}
            </p>
          )}

          <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
            <BlocksRenderer content={post.icerik} />
          </div>

          {/* İlgili tool'a CTA */}
          {post.iliskiliTool && (
            <div className="mt-8 rounded-xl border border-accent-500/30 bg-accent-500/5 p-6">
              <p className="font-semibold text-brand-900">
                {post.iliskiliTool.ad} aracını deneyin
              </p>
              <p className="mt-1 text-sm text-muted">
                Bu kavramı kendi sayılarınızla canlı hesaplayın.
              </p>
              <TrackedLink
                href={`/araclar/${post.iliskiliTool.slug}`}
                event="cta_click"
                payload={{ label: post.iliskiliTool.ad, konum: 'blog_ilgili_tool' }}
                className="mt-3 inline-block rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
              >
                {post.iliskiliTool.ad} →
              </TrackedLink>
            </div>
          )}

          {post.yazar && (
            <AuthorBox
              author={{
                ad: post.yazar.ad,
                unvan: post.yazar.unvan,
                bio: post.yazar.bio,
                avatarUrl: mediaUrl(post.yazar.avatar?.url),
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
