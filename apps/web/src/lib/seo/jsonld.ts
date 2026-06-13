/**
 * JSON-LD (schema.org) builder'ları. Saf fonksiyonlar — düz nesne döner,
 * <JsonLd> component'i ile sayfaya basılır.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageJsonLd(faqs: { soru: string; cevap: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.soru,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.cevap,
      },
    })),
  };
}

export function webApplicationJsonLd(params: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: params.name,
    description: params.description,
    url: params.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
    },
  };
}

export function articleJsonLd(params: {
  headline: string;
  description: string;
  url: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.headline,
    description: params.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
    author: params.authorName
      ? { '@type': 'Organization', name: params.authorName }
      : undefined,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    image: params.image ?? undefined,
  };
}
