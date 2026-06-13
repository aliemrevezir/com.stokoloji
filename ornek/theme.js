/* ==========================================================================
   STOKOLOJİ — Shared chrome + interactions
   Injects header + footer, wires mega-menu, search, mobile drawer, sticky.
   ========================================================================== */
(function () {
  'use strict';

  const TOOLS = [
    { name: 'EOQ (Ekonomik Sipariş Miktarı)', cat: 'stok',    href: 'EOQ Hesaplayıcı.html' },
    { name: 'Emniyet Stoğu',                   cat: 'stok',    href: '#' },
    { name: 'Yeniden Sipariş Noktası (ROP)',   cat: 'stok',    href: '#' },
    { name: 'ABC Analizi',                     cat: 'analiz',  href: '#' },
    { name: 'Stok Devir Hızı',                 cat: 'analiz',  href: '#' },
    { name: 'Üretim Parti Büyüklüğü',          cat: 'uretim',  href: '#' },
    { name: 'Taşıma Maliyeti Hesabı',          cat: 'maliyet', href: '#' },
    { name: 'Tedarik Süresi Analizi',          cat: 'tedarik', href: '#' },
  ];
  const BLOG = [
    { name: 'EOQ nedir ve nasıl hesaplanır?',         cat: 'stok',    href: 'Blog.html' },
    { name: 'Emniyet stoğu formülü ve servis seviyesi', cat: 'stok',  href: '#' },
    { name: 'ABC analizi ile stok önceliklendirme',   cat: 'analiz',  href: '#' },
    { name: 'Stok devir hızı kaç olmalı?',            cat: 'analiz',  href: '#' },
    { name: 'MRP ve üretim planlamanın temelleri',    cat: 'uretim',  href: '#' },
    { name: 'Taşıma maliyeti gerçekte neye mal olur?', cat: 'maliyet', href: '#' },
  ];
  const CATS = {
    stok:    { label: 'Stok Yönetimi',    color: 'var(--cat-stok)' },
    uretim:  { label: 'Üretim Planlama',  color: 'var(--cat-uretim)' },
    maliyet: { label: 'Maliyet / Finans', color: 'var(--cat-maliyet)' },
    analiz:  { label: 'Analiz / Veri',    color: 'var(--cat-analiz)' },
    tedarik: { label: 'Tedarik',          color: 'var(--cat-tedarik)' },
  };

  const ic = {
    caret: '<svg class="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    search: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    sheet: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg>',
  };

  function megaList(items) {
    return items.slice(0, 6).map(t =>
      `<a href="${t.href}"><span class="swatch" style="background:${CATS[t.cat].color}"></span>${t.name}</a>`
    ).join('');
  }

  function buildHeader() {
    const toolsMega = `
      <div class="mega">
        <div class="mega-col">
          <h5>Hesaplayıcı Araçlar</h5>
          <div class="mega-list">${megaList(TOOLS)}</div>
        </div>
        <div class="mega-feature">
          <div class="ph" data-label="öne çıkan tool görseli"></div>
          <span class="chip" data-cat="stok">Stok Yönetimi</span>
          <div class="mf-title" style="margin-top:8px">EOQ Hesaplayıcı</div>
          <div class="mf-meta">Sipariş miktarını maliyet eğrisiyle optimize et. En çok kullanılan aracımız.</div>
        </div>
      </div>`;
    const blogMega = `
      <div class="mega">
        <div class="mega-col">
          <h5>Son Yazılar</h5>
          <div class="mega-list">${megaList(BLOG)}</div>
        </div>
        <div class="mega-feature">
          <div class="ph" data-label="öne çıkan yazı görseli"></div>
          <span class="chip" data-cat="analiz">Analiz / Veri</span>
          <div class="mf-title" style="margin-top:8px">Stok devir hızı kaç olmalı?</div>
          <div class="mf-meta">Sektör ortalamaları ve yorumlama rehberi.</div>
        </div>
      </div>`;

    return `
    <div class="utility-bar">
      <div class="container">
        <span class="ub-icon">${ic.sheet}</span>
        <span class="ub-text">Ücretsiz Excel stok takip şablonunu indir.</span>
        <a href="#lead">Hemen al →</a>
      </div>
    </div>
    <div class="container">
      <nav class="nav">
        <a class="brand" href="index.html">Stokoloji<span class="dot">.</span></a>
        <ul class="nav-links">
          <li class="has-mega" data-mega><button type="button">Araçlar ${ic.caret}</button>${toolsMega}</li>
          <li class="has-mega" data-mega><button type="button">Blog ${ic.caret}</button>${blogMega}</li>
          <li><a href="Kategori.html">Kategoriler</a></li>
          <li><a href="#hakkinda">Hakkında</a></li>
          <li><a href="Design System.html">Tema Sistemi</a></li>
        </ul>
        <div class="nav-right">
          <button class="icon-btn search-only" type="button" data-search-open aria-label="Ara">${ic.search}</button>
          <a class="btn btn-primary btn-sm" href="EOQ Hesaplayıcı.html">Araçları Aç</a>
          <button class="icon-btn menu-toggle" type="button" data-drawer-open aria-label="Menü">${ic.menu}</button>
        </div>
      </nav>
    </div>`;
  }

  function buildSearch() {
    return `
    <div class="search-overlay" data-search>
      <div class="search-panel">
        <input type="text" placeholder="Araç veya yazı ara… (örn. EOQ, emniyet stoğu)" aria-label="Arama">
        <div class="sp-hint">
          <span>Popüler:</span>
          <span class="chip" data-cat="stok">EOQ</span>
          <span class="chip" data-cat="stok">Emniyet Stoğu</span>
          <span class="chip" data-cat="analiz">ABC Analizi</span>
          <span class="chip" data-cat="analiz">Stok Devir Hızı</span>
        </div>
      </div>
    </div>`;
  }

  function buildDrawer() {
    const sec = (title, items) => `
      <div class="drawer-section">
        <div class="ds-title">${title}</div>
        ${items.map(t => `<a href="${t.href}"><span class="swatch" style="width:8px;height:8px;border-radius:2px;background:${CATS[t.cat].color}"></span>${t.name}</a>`).join('')}
      </div>`;
    return `
    <div class="drawer" data-drawer>
      <div class="drawer-head">
        <span class="brand">Stokoloji<span class="dot">.</span></span>
        <button class="icon-btn" type="button" data-drawer-close aria-label="Kapat">${ic.close}</button>
      </div>
      ${sec('Araçlar', TOOLS.slice(0,6))}
      ${sec('Blog', BLOG.slice(0,5))}
      <div class="drawer-section">
        <div class="ds-title">Genel</div>
        <a href="Kategori.html">Kategoriler</a>
        <a href="#hakkinda">Hakkında</a>
        <a href="Design System.html">Tema Sistemi</a>
      </div>
      <a class="btn btn-primary btn-block" href="EOQ Hesaplayıcı.html" style="margin-top:16px">Araçları Aç</a>
    </div>`;
  }

  function buildFooter() {
    const flink = items => items.map(t => `<a href="${t.href}">${t.name}</a>`).join('');
    return `
    <div class="container">
      <div class="footer-top">
        <div class="f-brand">
          <span class="brand">Stokoloji<span class="dot">.</span></span>
          <p style="color:var(--ink-light);margin-top:12px;font-size:.9375rem;max-width:32ch">Stok ve üretim yönetimi için hesaplayıcı araçlar ve mühendislik temelli rehberler. Tahmin değil, hesap.</p>
          <div class="f-author">
            <span class="avatar">A</span>
            <div>
              <div style="color:#fff;font-weight:600;font-size:.9375rem">Ali</div>
              <div style="font-size:.8125rem">ODTÜ Endüstri Mühendisliği · production developer. İçeriklerin ve hesap modellerinin yazarı.</div>
            </div>
          </div>
        </div>
        <div>
          <h5>Araçlar</h5>
          <div class="f-links">${flink(TOOLS.slice(0,6))}</div>
        </div>
        <div>
          <h5>Kategoriler</h5>
          <div class="f-links">
            ${Object.entries(CATS).map(([k,v]) => `<a href="Kategori.html">${v.label}</a>`).join('')}
          </div>
        </div>
        <div class="f-news">
          <h5>Bültene Katıl</h5>
          <p style="color:var(--ink-light);font-size:.9375rem;margin-bottom:14px">Yeni araçlar ve rehberler için ayda iki kez, spam yok.</p>
          <form class="lm-form" style="display:flex;gap:8px" onsubmit="return false">
            <input class="input" type="email" placeholder="E-posta adresin" aria-label="E-posta">
            <button class="btn btn-primary btn-sm" type="submit">Katıl</button>
          </form>
          <p style="color:var(--ink-light);font-size:.75rem;margin-top:18px;line-height:1.5">Stokoloji eğitim amaçlıdır. Hesap sonuçları karar desteğidir; profesyonel danışmanlık yerine geçmez.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Stokoloji. Tüm hakları saklıdır.</span>
        <span style="display:flex;gap:18px">
          <a href="#">Gizlilik</a><a href="#">Kullanım Şartları</a><a href="#hakkinda">İletişim</a>
        </span>
      </div>
    </div>`;
  }

  function init() {
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');
    if (header) { header.className = 'site-header'; header.innerHTML = buildHeader(); }
    if (footer) { footer.className = 'site-footer'; footer.innerHTML = buildFooter(); }
    document.body.insertAdjacentHTML('beforeend', buildSearch());
    document.body.insertAdjacentHTML('beforeend', buildDrawer());

    // Mega menus (hover on desktop, click as fallback)
    document.querySelectorAll('[data-mega]').forEach(li => {
      const btn = li.querySelector('button');
      let timer;
      const open = () => { closeAllMega(li); li.classList.add('open'); };
      const close = () => li.classList.remove('open');
      li.addEventListener('mouseenter', () => { clearTimeout(timer); open(); });
      li.addEventListener('mouseleave', () => { timer = setTimeout(close, 120); });
      btn.addEventListener('click', e => { e.preventDefault(); li.classList.toggle('open'); });
    });
    function closeAllMega(except) {
      document.querySelectorAll('[data-mega].open').forEach(el => { if (el !== except) el.classList.remove('open'); });
    }
    document.addEventListener('click', e => { if (!e.target.closest('[data-mega]')) closeAllMega(); });

    // Sticky shadow
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }

    // Search overlay
    const overlay = document.querySelector('[data-search]');
    const openSearch = () => { overlay.classList.add('open'); setTimeout(() => overlay.querySelector('input').focus(), 60); };
    const closeSearch = () => overlay.classList.remove('open');
    document.querySelectorAll('[data-search-open]').forEach(b => b.addEventListener('click', openSearch));
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });

    // Drawer
    const drawer = document.querySelector('[data-drawer]');
    document.querySelectorAll('[data-drawer-open]').forEach(b => b.addEventListener('click', () => drawer.classList.add('open')));
    document.querySelectorAll('[data-drawer-close]').forEach(b => b.addEventListener('click', () => drawer.classList.remove('open')));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeSearch(); drawer.classList.remove('open'); closeAllMega(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    });

    // Reveal on scroll (transition-based — final state is real opacity, capture-safe)
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
      document.documentElement.classList.add('js-anim');
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        reveals.forEach(el => io.observe(el));
        // Safety net: anything still hidden after 1.2s gets shown
        setTimeout(() => reveals.forEach(el => el.classList.add('in')), 1200);
      } else {
        reveals.forEach(el => el.classList.add('in'));
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
