'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import type { BannerSlide } from '@/lib/banners';

const ROTATE_MS = 5000;

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/**
 * Tam genişlik (full-bleed) hero carousel. Slide verisi Strapi'den türetilir
 * (bkz. lib/banners.ts). Tıklamalar merkezi track() katmanına `cta_click` olarak
 * gider (TrackedLink); component doğrudan gtag/clarity ÇAĞIRMAZ.
 */
export function HeroCarousel({ slides }: { slides: BannerSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  const go = useCallback(
    (next: number) => setCurrent((prev) => (next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || paused || reducedMotion.current) return;
    const id = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  if (slides.length === 0) return null;

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Öne çıkan içerikler"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hc-track">
        {slides.map((slide, i) => (
          <TrackedLink
            key={slide.key}
            href={slide.href}
            event="cta_click"
            payload={{ label: slide.baslik, konum: 'hero_carousel' }}
            className={`hc-slide${i === current ? ' is-active' : ''}`}
          >
            {slide.gorselUrl ? (
              // next/image değil: optimizer görseli sunucu tarafında çeker ve
              // docker dev'de web container `localhost:1337`e ulaşamaz (500). Düz
              // <img> tarayıcıda yükler — projedeki diğer Strapi görselleriyle tutarlı.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="hc-img"
                src={slide.gorselUrl}
                alt={slide.gorselAlt}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            ) : (
              <span className="hc-img hc-img-fallback" aria-hidden />
            )}
            <span className="hc-overlay" aria-hidden />
            <span className="hc-content">
              <span className="container hc-content-inner">
                <span className="eyebrow hc-eyebrow">Öne çıkan</span>
                <span className="display hc-title">{slide.baslik}</span>
                {slide.excerpt && <span className="hc-excerpt">{slide.excerpt}</span>}
                <span className="btn btn-primary btn-lg hc-cta">
                  Devamını gör <ArrowRight />
                </span>
              </span>
            </span>
          </TrackedLink>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" className="hc-arrow hc-prev" aria-label="Önceki banner" onClick={() => go(current - 1)}>‹</button>
          <button type="button" className="hc-arrow hc-next" aria-label="Sonraki banner" onClick={() => go(current + 1)}>›</button>
          <div className="hc-dots" role="tablist" aria-label="Banner seçimi">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`${i + 1}. banner`}
                className={`hc-dot${i === current ? ' is-active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
