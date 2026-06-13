'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

const THRESHOLDS = [25, 50, 75, 100] as const;

/** Sayfa kaydırma derinliğini izler; her eşik bir kez `scroll_depth` gönderir. */
export function ScrollDepthTracker() {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((doc.scrollTop / scrollable) * 100);

      for (const t of THRESHOLDS) {
        if (percent >= t && !fired.current.has(t)) {
          fired.current.add(t);
          track('scroll_depth', { yuzde: t });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
