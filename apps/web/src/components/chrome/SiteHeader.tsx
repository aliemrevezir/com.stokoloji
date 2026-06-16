'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { CAT_LABEL, type CatKey, type NavData, type NavItem } from '@/lib/nav';
import type { Announcement, DuyuruIkon } from '@stokoloji/api-client';

const CAT_COLOR: Record<CatKey, string> = {
  stok: 'var(--cat-stok)',
  uretim: 'var(--cat-uretim)',
  maliyet: 'var(--cat-maliyet)',
  analiz: 'var(--cat-analiz)',
  tedarik: 'var(--cat-tedarik)',
};

/** Türkçe karakterleri sadeleştirip küçük harfe indirger (ı/i, ç→c, ğ→g, ş→s, ö→o, ü→u). */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

interface SearchHit extends NavItem {
  kind: 'Araç' | 'Yazı';
}

const Icon = {
  caret: (
    <svg className="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
  ),
  search: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  ),
  close: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
  sheet: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /></svg>
  ),
  etiket: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.2" /></svg>
  ),
  zil: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  ),
  hediye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5zM12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5z" /></svg>
  ),
  bilgi: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  yildiz: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
};

/** Duyuru ikonu enum değerini inline SVG'ye eşler ('yok' → ikon basılmaz). */
const ANNOUNCEMENT_ICONS: Record<Exclude<DuyuruIkon, 'yok'>, React.ReactNode> = {
  sheet: Icon.sheet,
  etiket: Icon.etiket,
  zil: Icon.zil,
  hediye: Icon.hediye,
  bilgi: Icon.bilgi,
  yildiz: Icon.yildiz,
};

function Mega({ items, heading, onNavigate }: { items: NavItem[]; heading: string; onNavigate: () => void }) {
  const list = items.slice(0, 6);
  // Hover/focus edilen öğe sağdaki "öne çıkan" önizlemeyi sürer; varsayılan ilk öğe.
  const [activeIdx, setActiveIdx] = useState(0);
  const active = list[activeIdx] ?? list[0];
  if (!active) return null;

  return (
    <div className="mega">
      <div className="mega-col">
        <p className="mega-heading">{heading}</p>
        <div className="mega-list">
          {list.map((t, i) => (
            <Link
              key={`${t.href}-${i}`}
              href={t.href}
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
              onClick={onNavigate}
            >
              <span className="swatch" style={{ background: CAT_COLOR[t.cat] }} />
              {t.name}
            </Link>
          ))}
        </div>
      </div>
      <Link className="mega-feature" href={active.href} onClick={onNavigate}>
        <div className={`ph${active.imageUrl ? ' has-img' : ''}`} data-label="öne çıkan görsel">
          {active.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.imageUrl} alt={active.name} />
          )}
        </div>
        <span className="chip" data-cat={active.cat}>{active.catLabel ?? CAT_LABEL[active.cat]}</span>
        <div className="mf-title" style={{ marginTop: 8 }}>{active.name}</div>
        {active.desc && <div className="mf-meta">{active.desc}</div>}
      </Link>
    </div>
  );
}

const DUYURU_DISMISS_KEY = 'duyuru-dismissed';

export function SiteHeader({
  nav,
  announcement,
}: {
  nav: NavData;
  announcement?: Announcement | null;
}) {
  const [openMega, setOpenMega] = useState<'tools' | 'blog' | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [duyuruDismissed, setDuyuruDismissed] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDrawerOpen(false);
        setOpenMega(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInput.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    setQuery('');
  }, [searchOpen]);

  // Duyuru kapatma durumu: ziyaretçi bu duyuruyu (documentId) daha önce
  // kapattıysa gizli kalır. SSR'da görünür; mount sonrası kontrol edilir.
  useEffect(() => {
    if (!announcement) return;
    try {
      setDuyuruDismissed(
        localStorage.getItem(DUYURU_DISMISS_KEY) === announcement.documentId,
      );
    } catch {
      // localStorage erişilemezse (gizli mod vb.) bar görünür kalır.
    }
  }, [announcement]);

  const dismissDuyuru = () => {
    setDuyuruDismissed(true);
    try {
      if (announcement) {
        localStorage.setItem(DUYURU_DISMISS_KEY, announcement.documentId);
      }
    } catch {
      // sessizce yoksay
    }
  };

  // Aranabilir set: araçlar + yazılar. nav zaten Strapi'den geldiği için ek istek yok.
  const index = useMemo<SearchHit[]>(
    () => [
      ...nav.tools.map((t) => ({ ...t, kind: 'Araç' as const })),
      ...nav.posts.map((p) => ({ ...p, kind: 'Yazı' as const })),
    ],
    [nav],
  );

  const results = useMemo<SearchHit[]>(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    const terms = q.split(/\s+/);
    return index
      .filter((item) => {
        const haystack = normalize(item.name);
        return terms.every((term) => haystack.includes(term));
      })
      .slice(0, 8);
  }, [index, query]);

  const closeSearch = () => setSearchOpen(false);

  const hoverOpen = (which: 'tools' | 'blog') => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMega(which);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setOpenMega(null), 120);
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        {announcement && !duyuruDismissed && (
          <div className="utility-bar">
            <div className="container">
              {announcement.ikon && announcement.ikon !== 'yok' && (
                <span className="ub-icon">
                  {ANNOUNCEMENT_ICONS[announcement.ikon] ?? Icon.sheet}
                </span>
              )}
              <span className="ub-text">{announcement.mesaj}</span>
              {announcement.ctaLabel && announcement.ctaHref && (
                <Link
                  href={announcement.ctaHref}
                  data-track="duyuru_click"
                  onClick={() =>
                    track('duyuru_click', {
                      label: announcement.ctaLabel!,
                      href: announcement.ctaHref!,
                      duyuru_id: announcement.documentId,
                    })
                  }
                >
                  {announcement.ctaLabel} →
                </Link>
              )}
              <button
                type="button"
                className="ub-close"
                aria-label="Duyuruyu kapat"
                onClick={dismissDuyuru}
              >
                {Icon.close}
              </button>
            </div>
          </div>
        )}
        <div className="container">
          <nav className="nav">
            <Link className="brand" href="/">Stokoloji<span className="dot">.</span></Link>
            <ul className="nav-links">
              <li
                className={`has-mega${openMega === 'tools' ? ' open' : ''}`}
                onMouseEnter={() => hoverOpen('tools')}
                onMouseLeave={hoverClose}
              >
                <span className="nav-trigger">
                  <Link href="/araclar" onClick={() => setOpenMega(null)}>Araçlar</Link>
                  <button
                    type="button"
                    className="nav-caret"
                    aria-label="Araçlar menüsünü aç/kapat"
                    aria-expanded={openMega === 'tools'}
                    onClick={() => setOpenMega((p) => (p === 'tools' ? null : 'tools'))}
                  >
                    {Icon.caret}
                  </button>
                </span>
                <Mega items={nav.tools} heading="Hesaplayıcı Araçlar" onNavigate={() => setOpenMega(null)} />
              </li>
              <li
                className={`has-mega${openMega === 'blog' ? ' open' : ''}`}
                onMouseEnter={() => hoverOpen('blog')}
                onMouseLeave={hoverClose}
              >
                <span className="nav-trigger">
                  <Link href="/icerik" onClick={() => setOpenMega(null)}>İçerik</Link>
                  <button
                    type="button"
                    className="nav-caret"
                    aria-label="İçerik menüsünü aç/kapat"
                    aria-expanded={openMega === 'blog'}
                    onClick={() => setOpenMega((p) => (p === 'blog' ? null : 'blog'))}
                  >
                    {Icon.caret}
                  </button>
                </span>
                <Mega items={nav.posts} heading="Son Yazılar" onNavigate={() => setOpenMega(null)} />
              </li>
              <li><Link href="/sozluk">Sözlük</Link></li>
              <li><Link href="/rehber">Rehber</Link></li>
              {/* <li><Link href="/#hakkinda">Hakkında</Link></li> */}
            </ul>
            <div className="nav-right">
              <button className="icon-btn search-only" type="button" aria-label="Ara" onClick={() => setSearchOpen(true)}>
                {Icon.search}
              </button>
              <Link className="btn btn-primary btn-sm" href="/araclar">Araçları Aç</Link>
              <button className="icon-btn menu-toggle" type="button" aria-label="Menü" onClick={() => setDrawerOpen(true)}>
                {Icon.menu}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Arama overlay */}
      <div
        className={`search-overlay${searchOpen ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSearchOpen(false);
        }}
      >
        <div className="search-panel">
          <input
            ref={searchInput}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Araç veya yazı ara… (örn. EOQ, emniyet stoğu)"
            aria-label="Arama"
          />
          {query.trim() ? (
            results.length > 0 ? (
              <div className="sp-results">
                {results.map((hit) => (
                  <Link key={`${hit.kind}-${hit.href}`} href={hit.href} className="sp-result" onClick={closeSearch}>
                    <span className="swatch" style={{ background: CAT_COLOR[hit.cat] }} />
                    <span className="sp-result-name">{hit.name}</span>
                    <span className="sp-result-kind">{hit.kind}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="sp-empty">Sonuç bulunamadı.</div>
            )
          ) : (
            <div className="sp-hint">
              <span>Popüler:</span>
              <button type="button" className="chip" data-cat="stok" onClick={() => setQuery('EOQ')}>EOQ</button>
              <button type="button" className="chip" data-cat="stok" onClick={() => setQuery('Emniyet Stoğu')}>Emniyet Stoğu</button>
              <button type="button" className="chip" data-cat="analiz" onClick={() => setQuery('ABC Analizi')}>ABC Analizi</button>
              <button type="button" className="chip" data-cat="analiz" onClick={() => setQuery('Stok Devir Hızı')}>Stok Devir Hızı</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobil drawer */}
      <div className={`drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-head">
          <span className="brand">Stokoloji<span className="dot">.</span></span>
          <button className="icon-btn" type="button" aria-label="Kapat" onClick={() => setDrawerOpen(false)}>
            {Icon.close}
          </button>
        </div>
        <DrawerSection title="Araçlar" items={nav.tools} onNavigate={() => setDrawerOpen(false)} />
        <DrawerSection title="İçerik" items={nav.posts} onNavigate={() => setDrawerOpen(false)} />
        <div className="drawer-section">
          <div className="ds-title">Genel</div>
          <Link href="/sozluk" onClick={() => setDrawerOpen(false)}>Sözlük</Link>
          <Link href="/rehber" onClick={() => setDrawerOpen(false)}>Rehber</Link>
          <Link href="/#hakkinda" onClick={() => setDrawerOpen(false)}>Hakkında</Link>
        </div>
        <Link className="btn btn-primary btn-block" href="/araclar" style={{ marginTop: 16 }} onClick={() => setDrawerOpen(false)}>
          Araçları Aç
        </Link>
      </div>
    </>
  );
}

function DrawerSection({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate: () => void }) {
  return (
    <div className="drawer-section">
      <div className="ds-title">{title}</div>
      {items.slice(0, 6).map((t, i) => (
        <Link key={`${t.href}-${i}`} href={t.href} onClick={onNavigate}>
          <span className="swatch" style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLOR[t.cat] }} />
          {t.name}
        </Link>
      ))}
    </div>
  );
}
