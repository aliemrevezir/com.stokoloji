import { describe, it, expect } from 'vitest';
import type { Banner } from '@stokoloji/api-client';
import { resolveBannerSlide, resolveBannerSlides } from './banners';

const baseMeta = { id: 1, documentId: 'doc1', sira: 0 };

describe('resolveBannerSlide', () => {
  it('blog referansından başlık/excerpt/link/görsel türetir', () => {
    const banner: Banner = {
      ...baseMeta,
      blog: {
        id: 5,
        documentId: 'b5',
        baslik: 'EOQ Nedir?',
        slug: 'eoq-nedir',
        seo: { description: 'Ekonomik sipariş miktarı açıklaması.' },
        kapakGorseli: { id: 9, documentId: 'm9', url: '/uploads/eoq.jpg', alternativeText: 'EOQ grafiği' },
      },
    };
    const slide = resolveBannerSlide(banner);
    expect(slide).not.toBeNull();
    expect(slide!.baslik).toBe('EOQ Nedir?');
    expect(slide!.excerpt).toBe('Ekonomik sipariş miktarı açıklaması.');
    expect(slide!.href).toBe('/icerik/eoq-nedir');
    expect(slide!.gorselUrl).toContain('/uploads/eoq.jpg');
    expect(slide!.gorselAlt).toBe('EOQ grafiği');
  });

  it('banner.gorsel blog kapağını override eder', () => {
    const banner: Banner = {
      ...baseMeta,
      gorsel: { id: 1, documentId: 'g1', url: '/uploads/ozel.jpg' },
      blog: {
        id: 5, documentId: 'b5', baslik: 'X', slug: 'x',
        kapakGorseli: { id: 9, documentId: 'm9', url: '/uploads/kapak.jpg' },
      },
    };
    expect(resolveBannerSlide(banner)!.gorselUrl).toContain('/uploads/ozel.jpg');
  });

  it('araç referansından türetir, kapak olmadığı için görsel null olabilir', () => {
    const banner: Banner = {
      ...baseMeta,
      arac: { id: 7, documentId: 't7', ad: 'EOQ Hesaplama', slug: 'eoq-hesaplama', kisaAciklama: 'Hesaplayıcı' },
    };
    const slide = resolveBannerSlide(banner);
    expect(slide!.baslik).toBe('EOQ Hesaplama');
    expect(slide!.excerpt).toBe('Hesaplayıcı');
    expect(slide!.href).toBe('/araclar/eoq-hesaplama');
    expect(slide!.gorselUrl).toBeNull();
  });

  it('ne blog ne araç bağlıysa null döner', () => {
    expect(resolveBannerSlide({ ...baseMeta })).toBeNull();
  });

  it('blog araçtan önce gelir (ikisi de bağlıysa)', () => {
    const banner: Banner = {
      ...baseMeta,
      blog: { id: 5, documentId: 'b5', baslik: 'Blog', slug: 'blog' },
      arac: { id: 7, documentId: 't7', ad: 'Arac', slug: 'arac' },
    };
    expect(resolveBannerSlide(banner)!.href).toBe('/icerik/blog');
  });
});

describe('resolveBannerSlides', () => {
  it('bağlantısız banner kayıtlarını listeden atar', () => {
    const banners: Banner[] = [
      { ...baseMeta, id: 1, blog: { id: 5, documentId: 'b5', baslik: 'A', slug: 'a' } },
      { ...baseMeta, id: 2 },
    ];
    const slides = resolveBannerSlides(banners);
    expect(slides).toHaveLength(1);
    expect(slides[0]!.baslik).toBe('A');
  });
});
