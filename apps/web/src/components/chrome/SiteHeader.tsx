'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { CatKey, NavData, NavItem } from '@/lib/nav';

const CAT_COLOR: Record<CatKey, string> = {
  stok: 'var(--cat-stok)',
  uretim: 'var(--cat-uretim)',
  maliyet: 'var(--cat-maliyet)',
  analiz: 'var(--cat-analiz)',
  tedarik: 'var(--cat-tedarik)',
};

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
};

function MegaList({ items }: { items: NavItem[] }) {
  return (
    <div className="mega-list">
      {items.slice(0, 6).map((t, i) => (
        <Link key={`${t.href}-${i}`} href={t.href}>
          <span className="swatch" style={{ background: CAT_COLOR[t.cat] }} />
          {t.name}
        </Link>
      ))}
    </div>
  );
}

function Mega({
  items,
  heading,
  feature,
}: {
  items: NavItem[];
  heading: string;
  feature: { cat: CatKey; label: string; title: string; meta: string };
}) {
  return (
    <div className="mega">
      <div className="mega-col">
        <h5>{heading}</h5>
        <MegaList items={items} />
      </div>
      <div className="mega-feature">
        <div className="ph" data-label="öne çıkan görsel" />
        <span className="chip" data-cat={feature.cat}>{feature.label}</span>
        <div className="mf-title" style={{ marginTop: 8 }}>{feature.title}</div>
        <div className="mf-meta">{feature.meta}</div>
      </div>
    </div>
  );
}

export function SiteHeader({ nav }: { nav: NavData }) {
  const [openMega, setOpenMega] = useState<'tools' | 'blog' | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
  }, [searchOpen]);

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
        <div className="utility-bar">
          <div className="container">
            <span className="ub-icon">{Icon.sheet}</span>
            <span className="ub-text">Ücretsiz Excel stok takip şablonunu indir.</span>
            <Link href="/#lead">Hemen al →</Link>
          </div>
        </div>
        <div className="container">
          <nav className="nav">
            <Link className="brand" href="/">Stokoloji<span className="dot">.</span></Link>
            <ul className="nav-links">
              <li
                className={`has-mega${openMega === 'tools' ? ' open' : ''}`}
                onMouseEnter={() => hoverOpen('tools')}
                onMouseLeave={hoverClose}
              >
                <button type="button" onClick={() => setOpenMega((p) => (p === 'tools' ? null : 'tools'))}>
                  Araçlar {Icon.caret}
                </button>
                <Mega
                  items={nav.tools}
                  heading="Hesaplayıcı Araçlar"
                  feature={{ cat: 'stok', label: 'Stok Yönetimi', title: 'EOQ Hesaplayıcı', meta: 'Sipariş miktarını maliyet eğrisiyle optimize et. En çok kullanılan aracımız.' }}
                />
              </li>
              <li
                className={`has-mega${openMega === 'blog' ? ' open' : ''}`}
                onMouseEnter={() => hoverOpen('blog')}
                onMouseLeave={hoverClose}
              >
                <button type="button" onClick={() => setOpenMega((p) => (p === 'blog' ? null : 'blog'))}>
                  Blog {Icon.caret}
                </button>
                <Mega
                  items={nav.posts}
                  heading="Son Yazılar"
                  feature={{ cat: 'analiz', label: 'Analiz / Veri', title: 'Stok devir hızı kaç olmalı?', meta: 'Sektör ortalamaları ve yorumlama rehberi.' }}
                />
              </li>
              <li><Link href="/araclar">Kategoriler</Link></li>
              <li><Link href="/#hakkinda">Hakkında</Link></li>
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
          <input ref={searchInput} type="text" placeholder="Araç veya yazı ara… (örn. EOQ, emniyet stoğu)" aria-label="Arama" />
          <div className="sp-hint">
            <span>Popüler:</span>
            <span className="chip" data-cat="stok">EOQ</span>
            <span className="chip" data-cat="stok">Emniyet Stoğu</span>
            <span className="chip" data-cat="analiz">ABC Analizi</span>
            <span className="chip" data-cat="analiz">Stok Devir Hızı</span>
          </div>
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
        <DrawerSection title="Blog" items={nav.posts} onNavigate={() => setDrawerOpen(false)} />
        <div className="drawer-section">
          <div className="ds-title">Genel</div>
          <Link href="/araclar" onClick={() => setDrawerOpen(false)}>Kategoriler</Link>
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
