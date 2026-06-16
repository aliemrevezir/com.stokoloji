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

export function websiteJsonLd(params: {
  name: string;
  url: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: params.name,
    url: params.url,
    inLanguage: 'tr-TR',
    ...(params.description ? { description: params.description } : {}),
  };
}

export function organizationJsonLd(params: {
  name: string;
  url: string;
  logo: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: params.name,
    url: params.url,
    logo: params.logo,
  };
}

export function collectionPageJsonLd(params: {
  name: string;
  description: string;
  url: string;
  items?: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: 'tr-TR',
    ...(params.items && params.items.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: params.items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }
      : {}),
  };
}

export function itemListJsonLd(params: {
  name: string;
  items: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: params.name,
    itemListElement: params.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
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

/**
 * Türkçe blog yazıları için BlogPosting. Yazar `Person` olarak gömülür
 * (E-E-A-T sinyali); `publisher` Organization olarak eklenir.
 */
export function blogPostingJsonLd(params: {
  headline: string;
  description: string;
  url: string;
  authorName?: string;
  authorTitle?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string | null;
  siteUrl: string;
  organizationName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.headline,
    description: params.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': params.url },
    inLanguage: 'tr-TR',
    author: params.authorName
      ? {
          '@type': 'Person',
          name: params.authorName,
          ...(params.authorTitle ? { jobTitle: params.authorTitle } : {}),
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: params.organizationName ?? 'Stokoloji',
      logo: { '@type': 'ImageObject', url: `${params.siteUrl}/icon.svg` },
    },
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    image: params.image ?? undefined,
  };
}
