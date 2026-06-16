import Link from 'next/link';
import type { Banner, Blog, Tool } from '@stokoloji/api-client';
import { strapi, mediaUrl } from '@/lib/strapi';
import { formatDate } from '@/lib/format';
import { groupPostsByCategory } from '@/lib/home';
import { categoryKey, type CatKey } from '@/lib/nav';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { resolveBannerSlides } from '@/lib/banners';

export const revalidate = 60;

const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const LinkArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const ToolIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M19 9l-5 5-4-4-3 3" /></svg>
);

const CAT_COLOR: Record<CatKey, string> = {
  stok: 'var(--cat-stok)',
  uretim: 'var(--cat-uretim)',
  maliyet: 'var(--cat-maliyet)',
  analiz: 'var(--cat-analiz)',
  tedarik: 'var(--cat-tedarik)',
};

async function safeData() {
  const [home, posts, tools, banners] = await Promise.all([
    strapi.getHomepage().catch(() => null),
    strapi.listBlogPosts().catch(() => [] as Blog[]),
    strapi.listTools().catch(() => [] as Tool[]),
    strapi.listBanners().catch(() => [] as Banner[]),
  ]);
  return { home, posts, tools, banners };
}

function Thumb({ url, alt, label, cat, corner }: { url?: string | null; alt?: string | null; label: string; cat?: CatKey; corner?: string }) {
  return (
    <div className={`ph thumb${url ? ' has-img' : ''}`} data-label={label}>
      {url && <img src={url} alt={alt ?? ''} loading="lazy" />}
      {corner && <span className="chip cat-corner" data-cat={cat ?? 'stok'}>{corner}</span>}
    </div>
  );
}

export default async function HomePage() {
  const { home, posts, tools, banners } = await safeData();
  const heroSlides = resolveBannerSlides(banners);

  const featuredPosts = home?.oneCikanYazilar?.length ? home.oneCikanYazilar : posts;
  const showcaseTools = (home?.oneCikanAraclar?.length ? home.oneCikanAraclar : tools).slice(0, 4);
  const heroFeatured = featuredPosts[0];
  const sidePosts = featuredPosts.slice(1, 4);
  const categoryGroups = groupPostsByCategory(posts);

  // Banner yokken gösterilen statik fallback hero metni (Strapi'ye bağlı değil).
  const heroTitle = 'Stok kararlarını tahminle değil, hesapla.';
  const heroSub =
    'EOQ, emniyet stoğu, yeniden sipariş noktası ve ABC analizi için çalışan hesaplayıcılar; her aracı ne zaman ve nasıl kullanacağını öğreten mühendislik temelli rehberler. Slogan yerine formül.';
  const primaryCta = { metin: 'Araçları keşfet', link: '/araclar' };

  return (
    <>
      {/* ============================ HERO CAROUSEL ============================ */}
      {heroSlides.length > 0 ? (
        <HeroCarousel slides={heroSlides} />
      ) : (
        /* Strapi'de yayınlanmış banner yoksa ince statik fallback hero. */
        <section className="hero-fallback">
          <div className="container hero-fallback-inner">
            <span className="eyebrow">Stok &amp; Üretim Yönetimi Otoritesi</span>
            <h1 className="display hero-title">{heroTitle}</h1>
            <p className="lead hero-sub">{heroSub}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary btn-lg" href={primaryCta.link}>
                {primaryCta.metin} <ArrowRight size={17} />
              </Link>
              <Link className="btn btn-secondary btn-lg" href="/#hakkinda">Neden Stokoloji?</Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================ ÖNE ÇIKAN BLOK ============================ */}
      {heroFeatured && (
        <section className="section-tight">
          <div className="container">
            <div className="hero-eyebrow">
              <span className="eyebrow">Editörün Seçtikleri</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div className="hero-grid" data-single={sidePosts.length === 0 ? '' : undefined}>
              <article className="card card-hover featured-card reveal">
                <Link href={`/blog/${heroFeatured.slug}`} style={{ display: 'block' }}>
                  <Thumb
                    url={mediaUrl(heroFeatured.kapakGorseli?.url)}
                    alt={heroFeatured.kapakGorseli?.alternativeText}
                    label="öne çıkan görsel"
                    cat={categoryKey(heroFeatured.kategori?.slug ?? heroFeatured.kategori?.ad)}
                    corner={heroFeatured.kategori?.ad ?? 'Rehber'}
                  />
                </Link>
                <div className="body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span className="badge badge-teal">Öne çıkan</span>
                    <span className="small muted">{formatDate(heroFeatured.yayinTarihi) ?? 'Rehber'}</span>
                  </div>
                  <Link href={`/blog/${heroFeatured.slug}`}><h2 className="title">{heroFeatured.baslik}</h2></Link>
                  {heroFeatured.seo?.description && <p className="excerpt">{heroFeatured.seo.description}</p>}
                  <div style={{ marginTop: 'var(--s-5)' }}>
                    <Link className="btn btn-primary" href={`/blog/${heroFeatured.slug}`}>
                      Yazıyı oku <ArrowRight />
                    </Link>
                  </div>
                </div>
              </article>

              {sidePosts.length > 0 && (
              <aside className="hero-side reveal">
                <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Öne çıkanlar</div>
                {sidePosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="compact-card">
                    <Thumb url={mediaUrl(post.kapakGorseli?.url)} alt={post.kapakGorseli?.alternativeText} label="görsel" />
                    <div>
                      {post.kategori?.ad && (
                        <span className="chip" data-cat={categoryKey(post.kategori.slug ?? post.kategori.ad)} style={{ fontSize: '.625rem', padding: '3px 7px' }}>
                          {post.kategori.ad}
                        </span>
                      )}
                      <div className="title" style={{ marginTop: 6 }}>{post.baslik}</div>
                      <div className="meta">{formatDate(post.yayinTarihi) ?? 'Rehber'}</div>
                    </div>
                  </Link>
                ))}
              </aside>
              )}
            </div>

          </div>
        </section>
      )}

      {/* ============================ FEATURED TOOLS ============================ */}
      {showcaseTools.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Hesaplayıcılar</span>
                <h2 className="h2" style={{ marginTop: 8 }}>Öne çıkan araçlar</h2>
              </div>
              <Link className="link-arrow" href="/araclar">Tüm araçlar <LinkArrowIcon /></Link>
            </div>
            <div className="grid cols-4">
              {showcaseTools.map((tool) => {
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
          </div>
        </section>
      )}

      {/* ============================ CATEGORY STRIPS ============================ */}
      {categoryGroups.map((group) => {
        const cat = categoryKey(group.kategori.slug ?? group.kategori.ad);
        return (
          <section key={group.kategori.slug ?? group.kategori.id} className="cat-strip" style={{ '--cat': CAT_COLOR[cat] } as React.CSSProperties}>
            <div className="container">
              <div className="cat-strip-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="cat-tick" />
                  <h2 className="h2">{group.kategori.ad}</h2>
                </div>
                <Link className="link-arrow" href="/blog" style={{ color: CAT_COLOR[cat] }}>Tümü <LinkArrowIcon /></Link>
              </div>
              <div className="grid cols-3">
                {group.posts.slice(0, 3).map((post) => (
                  <article key={post.slug} className="card card-hover std-card">
                    <Link href={`/blog/${post.slug}`}>
                      <Thumb url={mediaUrl(post.kapakGorseli?.url)} alt={post.kapakGorseli?.alternativeText} label="görsel" cat={cat} corner={group.kategori.ad} />
                    </Link>
                    <div className="body">
                      <Link href={`/blog/${post.slug}`}><h3 className="title">{post.baslik}</h3></Link>
                      {post.seo?.description && <p className="muted small">{post.seo.description}</p>}
                      <div className="meta">
                        <span>{post.yazar?.ad ?? 'Ali'}</span><span>·</span><span>{formatDate(post.yayinTarihi) ?? 'Rehber'}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ============================ AUTHORITY ============================ */}
      <section className="section" id="hakkinda">
        <div className="container">
          <div className="authority">
            <div className="authority-text">
              <span className="eyebrow">Neden Stokoloji?</span>
              <h2 className="h2" style={{ margin: '14px 0' }}>Magazin gibi zengin, mühendislik gibi disiplinli</h2>
              <p className="lead">Stokoloji bir blog yığını değil. Her araç gerçek bir karar problemini çözer; her yazı o aracı ne zaman ve nasıl kullanacağını öğretir. Tahmin yerine hesap, slogan yerine formül.</p>
              <ul className="why-list">
                <li><span className="why-num mono">01</span><div><b>Çalışan araçlar.</b> EOQ, emniyet stoğu, ROP ve ABC analizini örnek değerlerle anında dene.</div></li>
                <li><span className="why-num mono">02</span><div><b>Şeffaf formüller.</b> Her sonucun arkasındaki denklem ve varsayımlar açıkça gösterilir.</div></li>
                <li><span className="why-num mono">03</span><div><b>Türkçe ve uygulanabilir.</b> Sektörden gerçekçi örnekler, indirilebilir Excel şablonları.</div></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ LEAD MAGNET ============================ */}
      <section className="section-tight" id="lead">
        <div className="container">
          <div className="lead-magnet">
            <div>
              <span className="eyebrow" style={{ color: 'var(--teal-light)' }}>Ücretsiz Şablon</span>
              <h3>Stok takip ve EOQ Excel şablonu</h3>
              <p>Hazır formüllü çalışma kitabı: kalem bazında EOQ, emniyet stoğu ve yeniden sipariş noktası tek dosyada. E-postanı bırak, hemen gönderelim.</p>
            </div>
            <form className="lm-form" action="#lead">
              <input className="input" type="email" placeholder="E-posta adresin" aria-label="E-posta" />
              <button className="btn btn-primary" type="submit">İndir</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
