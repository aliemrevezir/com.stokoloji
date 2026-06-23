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
  /** Başlık seviyesi (2 = ana bölüm, 3 = alt başlık → girintili gösterilir). */
  level: number;
}

/** Satır-içi Markdown işaretlerini sökerek düz metin verir (TOC etiketi + özet için). */
function stripInlineMd(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // görsel
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // link → metin
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/\$([^$]+)\$/g, '$1') // inline math
    .trim();
}

const FAQ_HEADING_RE = /^s[ıi]k(ça)?\s+sorulan\s+sorular$/i;

/** İlk paragraf(lar)dan meta description için özet üretir (varsayılan 160 karakter). */
export function excerptFromBlocks(content: unknown, maxLen = 160): string | undefined {
  let text = '';
  if (typeof content === 'string') {
    let inFence = false;
    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim();
      if (line.startsWith('```')) { inFence = !inFence; continue; }
      if (inFence) continue;
      // başlık / tablo / liste / alıntı / görsel / boş satır = paragraf değil
      if (!line || /^[#>|-]/.test(line) || /^\d+\.\s/.test(line) || line.startsWith('![')) continue;
      const part = stripInlineMd(line);
      if (part) text += (text ? ' ' : '') + part;
      if (text.length >= maxLen) break;
    }
  } else if (Array.isArray(content)) {
    for (const block of content as { type?: string; children?: unknown }[]) {
      if (block.type === 'paragraph') {
        const part = inlineText(block.children);
        if (part) text += (text ? ' ' : '') + part;
        if (text.length >= maxLen) break;
      }
    }
  }
  text = text.trim();
  if (!text) return undefined;
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** İçerikteki H2 + H3 başlıklardan içindekiler (TOC) listesi üretir (H3 girintili). */
export function extractToc(content: unknown): TocEntry[] {
  const toc: TocEntry[] = [];
  if (typeof content === 'string') {
    let inFence = false;
    for (const rawLine of content.split('\n')) {
      const line = rawLine.trim();
      if (line.startsWith('```')) { inFence = !inFence; continue; }
      if (inFence) continue;
      const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
      if (!m) continue;
      const label = stripInlineMd(m[2] ?? '');
      if (!label || FAQ_HEADING_RE.test(label)) continue;
      toc.push({ id: slugify(label), label, level: (m[1] ?? '').length });
    }
    return toc;
  }
  if (!Array.isArray(content)) return [];
  for (const block of content as { type?: string; level?: number; children?: unknown }[]) {
    if (block.type === 'heading' && (block.level === 2 || block.level === 3)) {
      const label = inlineText(block.children);
      if (label) toc.push({ id: slugify(label), label, level: block.level });
    }
  }
  return toc;
}
