import Link from 'next/link';
import type { Metadata } from 'next';
import type { Tool } from '@stokoloji/api-client';
import { strapi } from '@/lib/strapi';
import { categoryKey, CATEGORIES, type CatKey } from '@/lib/nav';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Araçlar',
  description: 'Stok ve üretim yönetimi için interaktif hesaplayıcılar: EOQ, emniyet stoğu, ROP ve daha fazlası.',
  alternates: { canonical: '/araclar' },
};

const CAT_COLOR: Record<CatKey, string> = {
  stok: 'var(--cat-stok)',
  uretim: 'var(--cat-uretim)',
  maliyet: 'var(--cat-maliyet)',
  analiz: 'var(--cat-analiz)',
  tedarik: 'var(--cat-tedarik)',
};

const ToolIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M19 9l-5 5-4-4-3 3" /></svg>
);

export default async function ToolsPage() {
  let tools = [] as Tool[];
  try {
    tools = await strapi.listTools();
  } catch {
    tools = [];
  }

  return (
    <>
      <div className="container">
        <nav className="breadcrumb" style={{ '--cat': 'var(--cat-stok)' } as React.CSSProperties}>
          <Link href="/">Ana Sayfa</Link>
          <span className="sep">/</span>
          <span className="current">Araçlar</span>
        </nav>
      </div>

      <section className="cat-hero" style={{ '--cat': 'var(--cat-stok)' } as React.CSSProperties}>
        <div className="container">
          <span className="cat-tick" style={{ width: 36, height: 5, display: 'block', borderRadius: 3, background: 'var(--cat)', marginBottom: 'var(--s-4)' }} />
          <h1 className="h1" style={{ marginBottom: 'var(--s-3)' }}>Hesaplayıcı Araçlar</h1>
          <p className="lead" style={{ maxWidth: '60ch' }}>
            Ne kadar, ne zaman ve hangi kalemden sipariş vereceğini hesapla. EOQ'dan emniyet stoğuna, stok ve üretim yönetiminin tüm araçları burada.
          </p>
          <div className="cat-tabs">
            {CATEGORIES.map((c, i) => (
              <Link key={c.label} href={c.href} className={`cat-tab${i === 0 ? ' active' : ''}`} style={{ '--c': CAT_COLOR[c.cat] } as React.CSSProperties}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 'var(--s-6)' }}>
        <div className="container">
          <div className="archive-head">
            <span className="small muted"><b style={{ color: 'var(--ink)' }}>{tools.length}</b> araç</span>
          </div>

          <div className="grid cols-3" style={{ marginTop: 'var(--s-5)' }}>
            {tools.map((tool) => {
              const cat = categoryKey(tool.kategori?.slug ?? tool.kategori?.ad);
              return (
                <Link key={tool.slug} className="card card-hover tool-card" data-cat={cat} href={`/araclar/${tool.slug}`}>
                  <div className="icon"><ToolIcon /></div>
                  <div className="name">{tool.ad}</div>
                  {tool.kisaAciklama && <p className="desc">{tool.kisaAciklama}</p>}
                  <span className="link-arrow" style={{ fontSize: '.875rem' }}>Hesapla →</span>
                </Link>
              );
            })}
          </div>

          {tools.length === 0 && (
            <p className="muted" style={{ marginTop: 'var(--s-5)' }}>Henüz araç eklenmedi.</p>
          )}
        </div>
      </section>
    </>
  );
}
