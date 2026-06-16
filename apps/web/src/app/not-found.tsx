import Link from 'next/link';
import type { Metadata } from 'next';
import type { Blog } from '@stokoloji/api-client';
import { strapi } from '@/lib/strapi';
import { RandomPostLink } from '@/components/RandomPostLink';

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı (404)',
  description: 'Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Ana sayfaya dönün ya da rehberlerimize göz atın.',
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  let posts = [] as Blog[];
  try {
    posts = await strapi.listBlogPosts();
  } catch {
    posts = [];
  }
  const slugs = posts.map((p) => p.slug).filter(Boolean);

  return (
    <section className="section" style={{ paddingBlock: 'var(--s-9, 6rem)' }}>
      <div className="container" style={{ maxWidth: '60ch', textAlign: 'center' }}>
        <span
          className="chip"
          style={{ display: 'inline-flex', marginBottom: 'var(--s-4)' }}
        >
          Hata 404
        </span>

        <p
          aria-hidden
          style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 'clamp(4rem, 18vw, 9rem)',
            lineHeight: 1,
            fontWeight: 600,
            color: 'var(--teal)',
            margin: 0,
            letterSpacing: '-0.04em',
          }}
        >
          404
        </p>

        <h1 className="h1" style={{ marginTop: 'var(--s-4)', marginBottom: 'var(--s-3)' }}>
          Bu rafı boş bulduk
        </h1>
        <p className="lead muted" style={{ marginInline: 'auto', marginBottom: 'var(--s-6)' }}>
          Aradığınız sayfa taşınmış, adı değişmiş ya da hiç var olmamış olabilir.
          Stok devir hızından EOQ&apos;ya, doğru yere birlikte gidelim.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 'var(--s-3)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="btn btn-primary btn-lg">
            Ana sayfaya dön
          </Link>
          <RandomPostLink slugs={slugs} className="btn btn-secondary btn-lg">
            Rastgele bir yazı oku
          </RandomPostLink>
        </div>

        <div style={{ marginTop: 'var(--s-7, 3rem)' }}>
          <p className="small muted" style={{ marginBottom: 'var(--s-3)' }}>
            Veya doğrudan şuralara göz atın
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--s-3)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/araclar" className="btn btn-ghost btn-sm">
              Hesaplayıcılar
            </Link>
            <Link href="/icerik" className="btn btn-ghost btn-sm">
              Rehberler
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
