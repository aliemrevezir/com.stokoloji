'use client';

import { useState } from 'react';

export interface FaqItem {
  soru: string;
  cevap: string;
}

/** Açılır SSS listesi. FAQPage JSON-LD ayrıca sayfada basılır. */
export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-line rounded-lg border border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-medium text-brand-900">{item.soru}</span>
              <span className="ml-3 text-accent-500">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm leading-6 text-ink/90">{item.cevap}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
