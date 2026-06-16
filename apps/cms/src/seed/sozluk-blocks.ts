/**
 * Sözlük seed'i için blocks yardımcıları + veri tipi.
 *
 * Strapi 'blocks' alanı runtime'da düz JSON node dizisidir; generated tipler katı
 * union olduğundan elle kurulan node'lar uyuşmaz — bu yüzden node helper'ları `any`
 * döndürür (bkz. seed/index.ts'teki aynı gerekçe).
 *
 * `sozluk-data.ts` bu helper'larla terim anlamlarını kurar; `sozluk.ts` runner'ı
 * veriyi okuyup idempotent şekilde Strapi'ye yazar.
 */

/** Düz paragraf. */
export const P = (text: string): any => ({
  type: 'paragraph',
  children: [{ type: 'text', text }],
});

/** Karışık inline'lı paragraf: P(T('...'), B('...'), L('...', '/araclar/...')). */
export const RP = (...children: any[]): any => ({ type: 'paragraph', children });

/** inline düz metin. */
export const T = (text: string): any => ({ type: 'text', text });
/** inline kalın metin. */
export const B = (text: string): any => ({ type: 'text', text, bold: true });
/** inline link (iç link: /araclar/..., /icerik/..., /sozluk/...). */
export const L = (text: string, url: string): any => ({
  type: 'link',
  url,
  children: [{ type: 'text', text }],
});

/** Başlık (alt-başlık). Sözlükte genelde level 3 kullanılır. */
export const H = (level: number, text: string): any => ({
  type: 'heading',
  level,
  children: [{ type: 'text', text }],
});

/** Sırasız liste. */
export const UL = (items: string[]): any => ({
  type: 'list',
  format: 'unordered',
  children: items.map((text) => ({
    type: 'list-item',
    children: [{ type: 'text', text }],
  })),
});

/** Sıralı liste. */
export const OL = (items: string[]): any => ({
  type: 'list',
  format: 'ordered',
  children: items.map((text) => ({
    type: 'list-item',
    children: [{ type: 'text', text }],
  })),
});

/** Gerçek <table> render eden özel node (web BlocksRenderer'da case 'table'). */
export const TABLE = (headers: string[], rows: string[][]): any => ({
  type: 'table',
  headers,
  rows,
});

/** Tek bir sözlük terimi (seed verisi). */
export interface SozlukData {
  /** Görünen terim, ör. "Emniyet Stoğu". */
  kelime: string;
  /** ASCII, keyword'lü slug; anchor + deep link için. Ör. "emniyet-stogu". */
  slug: string;
  /** Tam Türk alfabesi başlangıç harfi, ör. "E", "Ç", "İ". */
  harf: string;
  /** 1-2 cümle özet (kart + meta description). */
  kisaTanim: string;
  /** Tam tanım — blocks node dizisi (P/RP/H/UL/OL/TABLE). */
  anlam: any[];
  /** İlişkili terimlerin slug'ları (sözlük-içi çapraz link). */
  ilgili?: string[];
}
