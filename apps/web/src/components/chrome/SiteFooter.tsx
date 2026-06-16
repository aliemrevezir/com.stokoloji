import Link from 'next/link';
import type { NavData } from '@/lib/nav';

/** Koyu zeminli site footer'ı (tasarım: ornek/theme.js buildFooter). */
export function SiteFooter({ nav, year }: { nav: NavData; year: number }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="f-brand">
            <span className="brand">Stokoloji<span className="dot">.</span></span>
            <p style={{ color: 'var(--ink-light)', marginTop: 12, fontSize: '.9375rem', maxWidth: '32ch' }}>
              Stok ve üretim yönetimi için hesaplayıcı araçlar ve mühendislik temelli rehberler. Tahmin değil, hesap.
            </p>
          </div>

          <div>
            <h5>Araçlar</h5>
            <div className="f-links">
              {nav.tools.slice(0, 6).map((t, i) => (
                <Link key={`${t.href}-${i}`} href={t.href}>{t.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h5>Kategoriler</h5>
            <div className="f-links">
              {nav.categories.map((c) => (
                <Link key={c.label} href={c.href}>{c.label}</Link>
              ))}
            </div>
          </div>

          <div className="f-news">
            <h5>Bültene Katıl</h5>
            <p style={{ color: 'var(--ink-light)', fontSize: '.9375rem', marginBottom: 14 }}>
              Yeni araçlar ve rehberler için ayda iki kez, spam yok.
            </p>
            <form className="lm-form" style={{ display: 'flex', gap: 8 }} action="/#lead">
              <input className="input" type="email" placeholder="E-posta adresin" aria-label="E-posta" />
              <button className="btn btn-primary btn-sm" type="submit">Katıl</button>
            </form>
            <p style={{ color: 'var(--ink-light)', fontSize: '.75rem', marginTop: 18, lineHeight: 1.5 }}>
              Stokoloji eğitim amaçlıdır. Hesap sonuçları karar desteğidir; profesyonel danışmanlık yerine geçmez.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Stokoloji. Tüm hakları saklıdır.</span>
          <span style={{ display: 'flex', gap: 18 }}>
            <Link href="/gizlilik">Gizlilik</Link>
            <Link href="/gizlilik">Kullanım Şartları</Link>
            <Link href="/#hakkinda">İletişim</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
