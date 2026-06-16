import Link from 'next/link';
import type { Metadata } from 'next';
import type { SozlukTerimi } from '@stokoloji/api-client';
import { strapi } from '@/lib/strapi';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbListJsonLd, definedTermSetJsonLd } from '@/lib/seo/jsonld';
import { TR_ALPHABET, harfToSlug, groupByHarf } from '@/lib/sozluk';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const ACIKLAMA =
  'Stok yönetimi, üretim planlama ve tedarik zinciri terimlerinin sade ve uygulamalı sözlüğü. EOQ, emniyet stoğu, ROP, stok devir hızı ve daha fazlasının anlamı, harfe göre düzenli.';

export const metadata: Metadata = {
  title: 'Stok ve Üretim Yönetimi Sözlüğü',
  description: ACIKLAMA,
  alternates: { canonical: '/sozluk' },
};

export default async function SozlukPage() {
  let terimler = [] as SozlukTerimi[];
  try {
    terimler = await strapi.listSozlukTerimleri();
  } catch {
    terimler = [];
  }

  const gruplar = groupByHarf(terimler);
  const doluSluglar = new Set(gruplar.map((g) => g.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: 'Ana Sayfa', url: `${siteUrl}/` },
          { name: 'Sözlük', url: `${siteUrl}/sozluk` },
        ])}
      />
      <JsonLd
        data={definedTermSetJsonLd({
          name: 'Stok ve Üretim Yönetimi Sözlüğü',
          description: ACIKLAMA,
          url: `${siteUrl}/sozluk`,
          terms: terimler.map((t) => ({
            term: t.kelime,
            definition: t.kisaTanim,
            url: `${siteUrl}/sozluk/${harfToSlug(t.baslangicHarfi)}#${t.slug}`,
          })),
        })}
      />

      <div className="container">
        <nav className="breadcrumb" style={{ '--cat': 'var(--cat-analiz)' } as React.CSSProperties}>
          <Link href="/">Ana Sayfa</Link>
          <span className="sep">/</span>
          <span className="current">Sözlük</span>
        </nav>
      </div>

      <section className="cat-hero" style={{ '--cat': 'var(--cat-analiz)' } as React.CSSProperties}>
        <div className="container">
          <span className="cat-tick" style={{ width: 36, height: 5, display: 'block', borderRadius: 3, background: 'var(--cat)', marginBottom: 'var(--s-4)' }} />
          <h1 className="h1" style={{ marginBottom: 'var(--s-3)' }}>Stok ve Üretim Yönetimi Sözlüğü</h1>
          <p className="lead" style={{ maxWidth: '62ch' }}>{ACIKLAMA}</p>

          <div className="cat-tabs" style={{ '--c': 'var(--cat-analiz)' } as React.CSSProperties}>
            {TR_ALPHABET.map((harf) => {
              const slug = harfToSlug(harf);
              const dolu = doluSluglar.has(slug);
              return dolu ? (
                <Link key={harf} href={`/sozluk/${slug}`} className="cat-tab" aria-label={`${harf} harfi`}>
                  {harf}
                </Link>
              ) : (
                <span key={harf} className="cat-tab is-disabled" aria-disabled="true" title="Bu harfte henüz terim yok">
                  {harf}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 'var(--s-6)' }}>
        <div className="container">
          <div className="archive-head">
            <h2 className="h3" style={{ margin: 0 }}>Tüm terimler</h2>
            <span className="small muted"><b style={{ color: 'var(--ink)' }}>{terimler.length}</b> terim</span>
          </div>

          {gruplar.map((grup) => (
            <div key={grup.harf} id={grup.slug} style={{ marginTop: 'var(--s-7)', scrollMarginTop: '90px' }}>
              <h3 className="h4" style={{ marginBottom: 'var(--s-4)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--cat-analiz, var(--teal))' }}>{grup.harf}</span>
                <span className="small muted" style={{ fontWeight: 400 }}>{grup.terimler.length} terim</span>
              </h3>
              <div className="grid cols-3" style={{ gap: 'var(--s-4)' }}>
                {grup.terimler.map((terim) => (
                  <Link
                    key={terim.slug}
                    href={`/sozluk/${grup.slug}#${terim.slug}`}
                    className="card card-hover"
                    style={{ padding: 'var(--s-4) var(--s-5)', display: 'block' }}
                  >
                    <strong style={{ display: 'block', fontSize: '1.0625rem', marginBottom: 6 }}>{terim.kelime}</strong>
                    <span className="muted small" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {terim.kisaTanim}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {terimler.length === 0 && (
            <p className="muted" style={{ marginTop: 'var(--s-5)' }}>Henüz terim eklenmedi.</p>
          )}
        </div>
      </section>
    </>
  );
}
