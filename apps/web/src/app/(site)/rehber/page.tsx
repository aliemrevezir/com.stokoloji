import Link from 'next/link';
import type { Metadata } from 'next';
import type { Tool, Blog } from '@stokoloji/api-client';
import { strapi } from '@/lib/strapi';
import { categoryKey, CATEGORIES, type CatKey } from '@/lib/nav';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbListJsonLd, collectionPageJsonLd } from '@/lib/seo/jsonld';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Stok ve Üretim Yönetimi Rehberi',
  description:
    'Stok ve üretim yönetiminin temel kavramları tek haritada. Her kavram için anlaşılır rehber yazısı ve interaktif hesaplayıcı: EOQ, emniyet stoğu, ROP, stok devir hızı, ABC analizi.',
  alternates: { canonical: '/rehber' },
};

const CAT_COLOR: Record<CatKey, string> = {
  stok: 'var(--cat-stok)',
  uretim: 'var(--cat-uretim)',
  maliyet: 'var(--cat-maliyet)',
  analiz: 'var(--cat-analiz)',
  tedarik: 'var(--cat-tedarik)',
};

/** Hub'ta gösterilen tek kavram satırı: rehber yazısı + (varsa) hesaplayıcı. */
interface ConceptRow {
  name: string;
  cat: CatKey;
  definition?: string;
  toolHref?: string;
  blogHref?: string;
}

const CalcIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="12" y1="10" x2="12" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="8" y2="14" /><line x1="12" y1="14" x2="12" y2="14" /><line x1="16" y1="14" x2="16" y2="18" /><line x1="8" y1="18" x2="12" y2="18" /></svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
);

/** Karttaki içerik tipini söyleyen kısa etiket. */
function typeLabel(row: ConceptRow): string {
  if (row.toolHref && row.blogHref) return 'Rehber + Hesaplayıcı';
  if (row.toolHref) return 'Hesaplayıcı';
  return 'Rehber';
}

function firstBlogHref(tool: Tool): string | undefined {
  const blog = tool.iliskiliYazilar?.[0];
  return blog ? `/icerik/${blog.slug}` : undefined;
}

export default async function RehberPage() {
  let tools: Tool[] = [];
  let posts: Blog[] = [];
  try {
    [tools, posts] = await Promise.all([
      strapi.listTools({ query: { 'populate[iliskiliYazilar]': 'true' } }),
      strapi.listBlogPosts({ query: { 'populate[iliskiliTool]': 'true' } }),
    ]);
  } catch {
    tools = [];
    posts = [];
  }

  // Her tool bir kavramdır; ilişkili rehber yazısına bağlanır.
  const conceptsFromTools: ConceptRow[] = tools.map((t) => ({
    name: t.ad,
    cat: categoryKey(t.kategori?.slug ?? t.kategori?.ad),
    definition: t.kisaAciklama ?? undefined,
    toolHref: `/araclar/${t.slug}`,
    blogHref: firstBlogHref(t),
  }));

  // Bir hesaplayıcıya bağlı OLMAYAN yazılar: salt rehber kavramları (tekrarı önle).
  const conceptsFromPosts: ConceptRow[] = posts
    .filter((p) => !p.iliskiliTool)
    .map((p) => ({
      name: p.baslik,
      cat: categoryKey(p.kategori?.slug ?? p.kategori?.ad),
      definition: p.seo?.description ?? undefined,
      blogHref: `/icerik/${p.slug}`,
    }));

  const allConcepts = [...conceptsFromTools, ...conceptsFromPosts];
  const byCat = (cat: CatKey) => allConcepts.filter((c) => c.cat === cat);

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: 'Ana Sayfa', url: `${siteUrl}/` },
          { name: 'Rehber', url: `${siteUrl}/rehber` },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: 'Stok ve Üretim Yönetimi Rehberi',
          description:
            'Stok ve üretim yönetiminin temel kavramları; her kavram için rehber yazısı ve hesaplayıcı.',
          url: `${siteUrl}/rehber`,
          items: allConcepts
            .map((c) => ({ name: c.name, url: `${siteUrl}${c.blogHref ?? c.toolHref ?? '/rehber'}` })),
        })}
      />

      <div className="container">
        <nav className="breadcrumb" style={{ '--cat': 'var(--cat-stok)' } as React.CSSProperties}>
          <Link href="/">Ana Sayfa</Link>
          <span className="sep">/</span>
          <span className="current">Rehber</span>
        </nav>
      </div>

      <section className="cat-hero" style={{ '--cat': 'var(--cat-stok)' } as React.CSSProperties}>
        <div className="container">
          <span style={{ width: 36, height: 5, display: 'block', borderRadius: 3, background: 'var(--cat)', marginBottom: 'var(--s-4)' }} />
          <h1 className="h1" style={{ marginBottom: 'var(--s-3)' }}>Stok ve Üretim Yönetimi Rehberi</h1>
          <p className="lead" style={{ maxWidth: '62ch' }}>
            Stoğu ve üretimi yönetmenin temel kavramları tek haritada. Her kavram için önce anlaşılır
            bir rehber yazısı, sonra kendi rakamlarınla çalışabileceğin bir hesaplayıcı. Nereden
            başlayacağını bilmiyorsan, doğru yer burası.
          </p>
          <div className="cat-tabs">
            {CATEGORIES.map((c) => (
              <a key={c.label} href={`#${c.cat}`} className="cat-tab" style={{ '--c': CAT_COLOR[c.cat] } as React.CSSProperties}>
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 'var(--s-6)' }}>
        <div className="container" style={{ display: 'grid', gap: 'var(--s-8)' }}>
          {CATEGORIES.map((category) => {
            const rows = byCat(category.cat);
            return (
              <div key={category.cat} id={category.cat} style={{ scrollMarginTop: 96 }}>
                <div className="archive-head" style={{ borderLeft: `4px solid ${CAT_COLOR[category.cat]}`, paddingLeft: 'var(--s-4)' }}>
                  <h2 className="h3" style={{ margin: 0 }}>{category.label}</h2>
                  {rows.length > 0 && (
                    <span className="small muted"><b style={{ color: 'var(--ink)' }}>{rows.length}</b> kavram</span>
                  )}
                </div>

                {rows.length === 0 ? (
                  <p className="muted small" style={{ marginTop: 'var(--s-4)' }}>
                    Bu başlıktaki rehberler ve hesaplayıcılar hazırlanıyor.
                  </p>
                ) : (
                  <div className="grid cols-3" style={{ marginTop: 'var(--s-5)' }}>
                    {rows.map((row, i) => (
                      <div key={`${row.name}-${i}`} className="tool-card card-hover" data-cat={row.cat}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s-3)' }}>
                          <div className="icon">{row.toolHref ? <CalcIcon /> : <BookIcon />}</div>
                          <span className="chip" data-cat={row.cat} style={{ fontSize: '.75rem' }}>{typeLabel(row)}</span>
                        </div>
                        <div className="name">{row.name}</div>
                        {row.definition && <p className="desc">{row.definition}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)', marginTop: 'var(--s-2)', paddingTop: 'var(--s-4)', borderTop: '1px solid var(--border)' }}>
                          {row.toolHref ? (
                            <>
                              <Link href={row.toolHref} className="btn btn-primary btn-sm">Hesapla →</Link>
                              {row.blogHref && (
                                <Link href={row.blogHref} className="link-arrow" style={{ fontSize: '.875rem' }}>Kavramı oku</Link>
                              )}
                            </>
                          ) : (
                            row.blogHref && (
                              <Link href={row.blogHref} className="btn btn-primary btn-sm">Rehberi oku →</Link>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {allConcepts.length === 0 && (
            <p className="muted" style={{ marginTop: 'var(--s-5)' }}>Rehber içeriği yakında eklenecek.</p>
          )}
        </div>
      </section>
    </>
  );
}
