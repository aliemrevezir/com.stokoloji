import Link from 'next/link';
import type { Tool } from '@stokoloji/api-client';
import { CalculatorCard } from './CalculatorCard';
import { MarkdownContent } from './MarkdownContent';
import { JsonLd } from './JsonLd';
import { ScrollDepthTracker } from './analytics/ScrollDepthTracker';
import { getCalculator } from '@/lib/tools/registry';
import { categoryKey, type CatKey } from '@/lib/nav';
import {
  breadcrumbListJsonLd,
  faqPageJsonLd,
  webApplicationJsonLd,
} from '@/lib/seo/jsonld';

const CAT_COLOR: Record<CatKey, string> = {
  stok: 'var(--cat-stok)',
  uretim: 'var(--cat-uretim)',
  maliyet: 'var(--cat-maliyet)',
  analiz: 'var(--cat-analiz)',
  tedarik: 'var(--cat-tedarik)',
};

/**
 * TEK tool sayfası şablonu (tasarım: ornek/EOQ Hesaplayıcı.html).
 * Sol: editoryal içerik (tanım, formül, SSS, ilgili, yazar); sağ: sticky hesap
 * kartı. Yeni tool eklemek sayfa kodu GEREKTİRMEZ (slug → registry + Strapi).
 */
export function ToolPageTemplate({ tool, siteUrl }: { tool: Tool; siteUrl: string }) {
  const def = getCalculator(tool.slug);
  const pageUrl = `${siteUrl}/araclar/${tool.slug}`;
  const sss = tool.sss ?? [];
  const cat = categoryKey(tool.kategori?.slug ?? tool.kategori?.ad);
  const catLabel = tool.kategori?.ad ?? 'Stok Yönetimi';

  const crumbs = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Araçlar', href: '/araclar' },
    { name: tool.ad, href: `/araclar/${tool.slug}` },
  ];

  const related = (tool.iliskiliYazilar ?? []).slice(0, 3);

  return (
    <>
      <ScrollDepthTracker />
      <JsonLd data={breadcrumbListJsonLd(crumbs.map((c) => ({ name: c.name, url: `${siteUrl}${c.href}` })))} />
      <JsonLd
        data={webApplicationJsonLd({
          name: tool.ad,
          description: tool.kisaAciklama ?? tool.ad,
          url: pageUrl,
        })}
      />
      {sss.length > 0 && <JsonLd data={faqPageJsonLd(sss)} />}

      <div className="container">
        <nav className="breadcrumb" style={{ '--cat': CAT_COLOR[cat] } as React.CSSProperties}>
          <Link href="/">Ana Sayfa</Link>
          <span className="sep">/</span>
          <Link href="/araclar">{catLabel}</Link>
          <span className="sep">/</span>
          <span className="current">{tool.ad}</span>
        </nav>
      </div>

      <div className="container">
        <div className="tool-layout">
          {/* SOL: içerik */}
          <div className="tool-main">
            <header className="tool-head">
              <span className="chip" data-cat={cat}>{catLabel}</span>
              <h1 className="h1" style={{ margin: '14px 0' }}>{tool.ad}</h1>
              {tool.kisaAciklama && <p className="lead">{tool.kisaAciklama}</p>}
            </header>

            {tool.formulAciklamasi && (
              <section className="def-block prose" style={{ marginTop: 'var(--s-6)' }}>
                <h2 className="h3">Nasıl çalışır?</h2>
                <MarkdownContent markdown={tool.formulAciklamasi} />
              </section>
            )}

            {sss.length > 0 && (
              <section className="def-block" style={{ marginTop: 'var(--s-7)' }}>
                <h2 className="h3" style={{ marginBottom: 'var(--s-3)' }}>Sık sorulan sorular</h2>
                {sss.map((item, i) => (
                  <details className="faq-item" key={item.id ?? i} open={i === 0}>
                    <summary>{item.soru}</summary>
                    <div className="faq-a">{item.cevap}</div>
                  </details>
                ))}
              </section>
            )}

            {related.length > 0 && (
              <section className="def-block" style={{ marginTop: 'var(--s-7)' }}>
                <h2 className="h3" style={{ marginBottom: 'var(--s-5)' }}>İlgili içerikler</h2>
                <div className="grid cols-3">
                  {related.map((yazi) => (
                    <Link key={yazi.slug} className="card card-hover tool-card" data-cat={cat} href={`/icerik/${yazi.slug}`}>
                      <div className="name" style={{ fontSize: '1.0625rem' }}>{yazi.baslik}</div>
                      {yazi.seo?.description && <p className="desc">{yazi.seo.description}</p>}
                      <span className="link-arrow" style={{ fontSize: '.8125rem' }}>Oku →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section style={{ marginTop: 'var(--s-7)' }}>
              <div className="author-box">
                <span className="avatar">A</span>
                <div>
                  <div className="a-name">Ali</div>
                  <div className="a-role">ODTÜ Endüstri Mühendisliği · Production Developer</div>
                  <p className="a-bio">Bu hesap modeli klasik formüllere dayanır ve sabit talep, sabit tedarik süresi gibi varsayımlarla çalışır. Saha problemlerini sadeleştirip karar destek araçlarına dönüştürüyorum.</p>
                </div>
              </div>
              <p className="small muted" style={{ marginTop: 'var(--s-4)' }}>
                Yasal uyarı: Stokoloji araçları eğitim ve karar destek amaçlıdır. Sonuçlar işletmenizin gerçek maliyet yapısına göre doğrulanmalıdır; profesyonel danışmanlık yerine geçmez.
              </p>
            </section>
          </div>

          {/* SAĞ: sticky hesap kartı */}
          <aside className="tool-aside">
            {def ? (
              <CalculatorCard slug={tool.slug} baslik={tool.ad} resultLabel={tool.ad} />
            ) : (
              <div className="callout">
                <div className="callout-title">Hesaplayıcı yakında</div>
                <p className="muted small">Bu araç için interaktif hesaplayıcı henüz tanımlı değil.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
