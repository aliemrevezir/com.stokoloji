import type { Metadata } from 'next';
import { Newsreader, Inter, JetBrains_Mono } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';
import './theme.css';
import { ConsentBanner } from '@/components/analytics/ConsentBanner';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { getNavData } from '@/lib/nav';
import { strapi } from '@/lib/strapi';

// Editoryal serif başlık fontu (tasarım imzası).
const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
});

// UI + gövde (Geist yerine güvenli, görsel olarak yakın grotesk).
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
  display: 'swap',
});

// Veri + sonuç (monospace).
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Stok Yönetimi Araçları ve Rehberleri | Stokoloji',
    template: '%s | Stokoloji',
  },
  description:
    'EOQ, emniyet stoğu, yeniden sipariş noktası ve ABC analizi için hesaplayıcı araçlar; üretim planlama ve maliyet yönetimi rehberleri. Tahmin değil, hesap.',
  // Search Console HTML meta doğrulaması (env doluysa otomatik basılır).
  // Alternatif/önerilen yöntem registrar'da DNS TXT kaydıdır.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = await getNavData();
  const announcement = await strapi.getActiveAnnouncement().catch(() => null);
  const year = new Date().getFullYear();

  return (
    <html lang="tr" className={`${newsreader.variable} ${inter.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Site geneli kimlik şeması — her sayfada bir kez basılır. */}
        <JsonLd
          data={organizationJsonLd({
            name: 'Stokoloji',
            url: siteUrl,
            logo: `${siteUrl}/icon.svg`,
          })}
        />
        <JsonLd
          data={websiteJsonLd({
            name: 'Stokoloji',
            url: siteUrl,
            description:
              'Stok ve üretim yönetimi için hesaplayıcı araçlar ve mühendislik temelli rehberler.',
          })}
        />
        <SiteHeader nav={nav} announcement={announcement} />

        <main className="flex-1">{children}</main>

        <SiteFooter nav={nav} year={year} />

        <ConsentBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
