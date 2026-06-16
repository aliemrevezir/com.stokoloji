import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { SozlukTerimi } from '@stokoloji/api-client';
import { strapi } from '@/lib/strapi';
import { JsonLd } from '@/components/JsonLd';
import { BlocksRenderer } from '@/components/BlocksRenderer';
import { breadcrumbListJsonLd, definedTermSetJsonLd } from '@/lib/seo/jsonld';
import { harfToSlug, distinctHarfSluglari } from '@/lib/sozluk';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  try {
    const terimler = await strapi.listSozlukTerimleri();
    return distinctHarfSluglari(terimler).map((harf) => ({ harf }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ harf: string }>;
}): Promise<Metadata> {
  const { harf } = await params;
  const gosterim = harf.toLocaleUpperCase('tr');
  return {
    title: `${gosterim} Harfi — Stok ve Üretim Yönetimi Sözlüğü`,
    description: `${gosterim} harfi ile başlayan stok yönetimi, üretim planlama ve tedarik zinciri terimlerinin anlamları.`,
    alternates: { canonical: `/sozluk/${harf}` },
  };
}

export default async function SozlukHarfPage({
  params,
}: {
  params: Promise<{ harf: string }>;
}) {
  const { harf } = await params;

  let terimler = [] as SozlukTerimi[];
  try {
    terimler = await strapi.listSozlukByHarf(harf);
  } catch {
    terimler = [];
  }

  if (terimler.length === 0) notFound();

  const gosterim = harf.toLocaleUpperCase('tr');
  const pageUrl = `${siteUrl}/sozluk/${harf}`;
  // ilgiliTerimler'i kendi harf sayfası anchor'ına linklemek için slug→harf eşlemesi.
  const harfForSlug = new Map(terimler.map((t) => [t.slug, harfToSlug(t.baslangicHarfi)]));

  return (
    <>
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: 'Ana Sayfa', url: `${siteUrl}/` },
          { name: 'Sözlük', url: `${siteUrl}/sozluk` },
          { name: `${gosterim} Harfi`, url: pageUrl },
        ])}
      />
      <JsonLd
        data={definedTermSetJsonLd({
          name: `${gosterim} Harfi Terimleri`,
          description: `${gosterim} harfi ile başlayan stok ve üretim yönetimi terimleri.`,
          url: pageUrl,
          terms: terimler.map((t) => ({
            term: t.kelime,
            definition: t.kisaTanim,
            url: `${pageUrl}#${t.slug}`,
          })),
        })}
      />

      <div className="container">
        <nav className="breadcrumb" style={{ '--cat': 'var(--cat-analiz)' } as React.CSSProperties}>
          <Link href="/">Ana Sayfa</Link>
          <span className="sep">/</span>
          <Link href="/sozluk">Sözlük</Link>
          <span className="sep">/</span>
          <span className="current">{gosterim} Harfi</span>
        </nav>
      </div>

      <section className="cat-hero" style={{ '--cat': 'var(--cat-analiz)' } as React.CSSProperties}>
        <div className="container">
          <span className="cat-tick" style={{ width: 36, height: 5, display: 'block', borderRadius: 3, background: 'var(--cat)', marginBottom: 'var(--s-4)' }} />
          <h1 className="h1" style={{ marginBottom: 'var(--s-3)' }}>{gosterim} Harfi</h1>
          <p className="small muted">{terimler.length} terim · <Link href="/sozluk">tüm sözlüğe dön</Link></p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 'var(--s-6)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          {terimler.map((terim) => (
            <article key={terim.slug} id={terim.slug} style={{ marginBottom: 'var(--s-8)', scrollMarginTop: '90px' }}>
              <h2 className="h3" style={{ marginBottom: 'var(--s-2)' }}>{terim.kelime}</h2>
              <p className="lead" style={{ fontSize: '1.0625rem', marginBottom: 'var(--s-3)' }}>{terim.kisaTanim}</p>
              {terim.anlam && (
                <div className="prose">
                  <BlocksRenderer content={terim.anlam} />
                </div>
              )}
              {terim.ilgiliTerimler && terim.ilgiliTerimler.length > 0 && (
                <p className="small muted" style={{ marginTop: 'var(--s-4)' }}>
                  İlgili terimler:{' '}
                  {terim.ilgiliTerimler.map((ilgili, i) => {
                    const ihref = `/sozluk/${harfForSlug.get(ilgili.slug) ?? harfToSlug(ilgili.baslangicHarfi)}#${ilgili.slug}`;
                    return (
                      <span key={ilgili.slug}>
                        {i > 0 && ', '}
                        <Link href={ihref}>{ilgili.kelime}</Link>
                      </span>
                    );
                  })}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
