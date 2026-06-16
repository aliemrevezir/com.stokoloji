/** Strapi blocks içeriğiyle ilgili saf yardımcılar. */

const TR_MAP: Record<string, string> = {
  ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
  Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
};

export function slugify(text: string): string {
  return text
    .split('')
    .map((ch) => TR_MAP[ch] ?? ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function inlineText(children: unknown): string {
  if (!Array.isArray(children)) return '';
  return children
    .map((c) => (c && typeof c === 'object' && 'text' in c ? String((c as { text: unknown }).text ?? '') : ''))
    .join('');
}

export interface TocEntry {
  id: string;
  label: string;
}

/** İlk paragraf(lar)dan meta description için özet üretir (varsayılan 160 karakter). */
export function excerptFromBlocks(content: unknown, maxLen = 160): string | undefined {
  if (!Array.isArray(content)) return undefined;
  let text = '';
  for (const block of content as { type?: string; children?: unknown }[]) {
    if (block.type === 'paragraph') {
      const part = inlineText(block.children);
      if (part) text += (text ? ' ' : '') + part;
      if (text.length >= maxLen) break;
    }
  }
  text = text.trim();
  if (!text) return undefined;
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** İçerikteki level-2 başlıklardan içindekiler (TOC) listesi üretir. */
export function extractToc(content: unknown): TocEntry[] {
  if (!Array.isArray(content)) return [];
  const toc: TocEntry[] = [];
  for (const block of content as { type?: string; level?: number; children?: unknown }[]) {
    if (block.type === 'heading' && block.level === 2) {
      const label = inlineText(block.children);
      if (label) toc.push({ id: slugify(label), label });
    }
  }
  return toc;
}
