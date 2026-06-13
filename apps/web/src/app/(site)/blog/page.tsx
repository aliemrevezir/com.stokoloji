import Link from 'next/link';
import type { Metadata } from 'next';
import type { Blog } from '@stokoloji/api-client';
import { strapi, mediaUrl } from '@/lib/strapi';
import { formatDate } from '@/lib/format';
import { categoryKey, type CatKey } from '@/lib/nav';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stok ve üretim yönetimi üzerine uygulamalı, mühendislik temelli rehberler.',
  alternates: { canonical: '/blog' },
};

function Thumb({ url, alt, label, cat, corner }: { url?: string | null; alt?: string | null; label: string; cat: CatKey; corner: string }) {
  return (
    <div className={`ph thumb${url ? ' has-img' : ''}`} data-label={label}>
      {url && <img src={url} alt={alt ?? ''} loading="lazy" />}
      <span className="chip cat-corner" data-cat={cat}>{corner}</span>
    </div>
  );
}

export default async function BlogListPage() {
  let posts = [] as Blog[];
  try {
    posts = await strapi.listBlogPosts();
  } catch {
    posts = [];
  }

  return (
    <>
      <div className="container">
        <nav className="breadcrumb" style={{ '--cat': 'var(--cat-stok)' } as React.CSSProperties}>
          <Link href="/">Ana Sayfa</Link>
          <span className="sep">/</span>
          <span className="current">Blog</span>
        </nav>
      </div>

      <section className="cat-hero" style={{ '--cat': 'var(--cat-stok)' } as React.CSSProperties}>
        <div className="container">
          <span className="cat-tick" style={{ width: 36, height: 5, display: 'block', borderRadius: 3, background: 'var(--cat)', marginBottom: 'var(--s-4)' }} />
          <h1 className="h1" style={{ marginBottom: 'var(--s-3)' }}>Blog</h1>
          <p className="lead" style={{ maxWidth: '60ch' }}>
            Stok ve üretim yönetimi üzerine kavram yazıları ve uygulamalı rehberler. Her yazı, ilgili hesaplayıcıya yönlendirir.
          </p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 'var(--s-6)' }}>
        <div className="container">
          <div className="archive-head">
            <span className="small muted"><b style={{ color: 'var(--ink)' }}>{posts.length}</b> yazı</span>
          </div>

          <div className="grid cols-3" style={{ marginTop: 'var(--s-5)' }}>
            {posts.map((post) => {
              const cat = categoryKey(post.kategori?.slug ?? post.kategori?.ad);
              return (
                <article key={post.slug} className="card card-hover std-card">
                  <Link href={`/blog/${post.slug}`}>
                    <Thumb url={mediaUrl(post.kapakGorseli?.url)} alt={post.kapakGorseli?.alternativeText} label="görsel" cat={cat} corner={post.kategori?.ad ?? 'Rehber'} />
                  </Link>
                  <div className="body">
                    <Link href={`/blog/${post.slug}`}><h3 className="title">{post.baslik}</h3></Link>
                    {post.seo?.description && <p className="muted small">{post.seo.description}</p>}
                    <div className="meta">
                      <span>{post.yazar?.ad ?? 'Ali'}</span><span>·</span><span>{formatDate(post.yayinTarihi) ?? 'Rehber'}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {posts.length === 0 && (
            <p className="muted" style={{ marginTop: 'var(--s-5)' }}>Henüz yazı eklenmedi.</p>
          )}
        </div>
      </section>
    </>
  );
}
