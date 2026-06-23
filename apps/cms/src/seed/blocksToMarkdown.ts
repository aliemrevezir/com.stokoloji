/* ---------------------------------------------------------------------------
 * Strapi "blocks" JSON → Markdown dönüştürücü.
 *
 * İçerik artık panelden düzenlenebilir Markdown (richtext) olarak yaşar. Bu modül
 * iki yerde kullanılır:
 *   1) seed/index.ts — yeni kayıtların gövdesini (blocks helper'larıyla yazılı)
 *      Markdown string'e çevirir (fresh DB).
 *   2) src/index.ts migrateContentToMarkdown — canlı DB'deki eski blocks JSON'u
 *      (veya schema json→richtext cast'inden gelen JSON-metni) bir kez Markdown'a
 *      çevirir. Düz Markdown ise DOKUNMAZ → panel düzenlemeleri kalıcı kalır.
 *
 * Notlar:
 *   - `code` node = display formül: backslash içeriyorsa LaTeX → `$$...$$`
 *     (remark-math + KaTeX); kelimeli formül → ```formula fenced blok (web'de
 *     formül kartı olarak stillenir).
 *   - `/blog/<slug>` iç linkleri canlı route'a (`/icerik/<slug>`) çevrilir.
 *   - Artık "Sıkça Sorulan Sorular" başlığı + giriş paragrafı gövdeden atılır
 *     (sorular ayrı `sss` alanından görünür basılır — syncBlogFaq sözleşmesi).
 * ------------------------------------------------------------------------- */

type Node = Record<string, any>;

const isFaqHeading = (node: Node): boolean =>
  node?.type === 'heading' &&
  typeof node?.children?.[0]?.text === 'string' &&
  /^s[ıi]k(ça)?\s+sorulan\s+sorular$/i.test(node.children[0].text.trim());

const isFaqIntro = (node: Node): boolean =>
  node?.type === 'paragraph' &&
  typeof node?.children?.[0]?.text === 'string' &&
  /^aşağıda\b/i.test(node.children[0].text.trim());

/** Satır-içi node dizisini (text/link + bold/italic/code) Markdown'a çevirir. */
function inlineToMd(nodes: unknown, inTable = false): string {
  if (!Array.isArray(nodes)) return '';
  return nodes
    .map((n: Node) => {
      if (n?.type === 'link') {
        const text = inlineToMd(n.children, inTable);
        let url = typeof n.url === 'string' ? n.url : '';
        url = url.replace(/^\/blog\//, '/icerik/');
        return `[${text}](${url})`;
      }
      let s = typeof n?.text === 'string' ? n.text : '';
      if (inTable) s = s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      if (n?.code) s = '`' + s + '`';
      // Bold/italic: baştaki/sondaki boşluk işaretlerin DIŞINDA kalmalı; aksi halde
      // CommonMark `** metin **` formatını emphasis saymaz, `**` düz metin sızar.
      if (n?.bold || n?.italic) {
        const lead = (s.match(/^\s*/) ?? [''])[0];
        const trail = (s.match(/\s*$/) ?? [''])[0];
        let core = s.slice(lead.length, s.length - trail.length);
        if (core) {
          if (n.bold) core = `**${core}**`;
          if (n.italic) core = `*${core}*`;
          s = lead + core + trail;
        }
      }
      return s;
    })
    .join('');
}

function tableToMd(node: Node): string {
  const headers: string[] = Array.isArray(node.headers) ? node.headers : [];
  const rows: string[][] = Array.isArray(node.rows) ? node.rows : [];
  const esc = (c: unknown) => String(c ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  if (headers.length === 0) return '';
  const head = `| ${headers.map(esc).join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n');
  let md = [head, sep, body].filter(Boolean).join('\n');
  if (node.caption) md += `\n\n*${esc(node.caption)}*`;
  return md;
}

function blockToMd(node: Node): string {
  switch (node?.type) {
    case 'heading': {
      const level = Math.min(Math.max(Number(node.level) || 2, 1), 6);
      return `${'#'.repeat(level)} ${inlineToMd(node.children)}`;
    }
    case 'paragraph':
      return inlineToMd(node.children);
    case 'list': {
      const ordered = node.format === 'ordered';
      const items: Node[] = Array.isArray(node.children) ? node.children : [];
      return items
        .map((li, idx) => `${ordered ? `${idx + 1}.` : '-'} ${inlineToMd(li.children)}`)
        .join('\n');
    }
    case 'quote':
      return `> ${inlineToMd(node.children)}`;
    case 'table':
      return tableToMd(node);
    case 'image': {
      const url = node.image?.url ?? '';
      const alt = String(node.image?.alternativeText ?? '').replace(/[[\]]/g, '');
      if (!url) return '';
      const base = `![${alt}](${url})`;
      return node.image?.caption ? `${base}\n\n*${node.image.caption}*` : base;
    }
    case 'code': {
      const text = (Array.isArray(node.children) ? node.children : [])
        .map((c: Node) => c?.text ?? '')
        .join('\n');
      // Backslash içeren = gerçek LaTeX → display math; kelimeli formül → formül kartı.
      return text.includes('\\') ? `$$\n${text}\n$$` : '```formula\n' + text + '\n```';
    }
    default:
      return inlineToMd(node?.children);
  }
}

/** Bir blocks dizisini tam bir Markdown gövdesine çevirir (FAQ başlığı atılır). */
export function blocksToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks)) return '';
  const out: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const node = blocks[i] as Node;
    if (isFaqHeading(node)) {
      if (isFaqIntro(blocks[i + 1] as Node)) i += 1; // takip eden giriş paragrafını da atla
      continue;
    }
    const md = blockToMd(node);
    if (md !== '') out.push(md);
  }
  return `${out.join('\n\n').trim()}\n`;
}

/**
 * Migration normalizer: alanın mevcut değerini Markdown'a çevirir; ZATEN düz
 * Markdown ise `null` döner (= dokunma). Tüm olası şekilleri kapsar:
 *   - dizi (json kolonu, blocks)               → çevir
 *   - "[...]" (json→text cast'inden JSON-metni) → parse + çevir
 *   - "\"...\"" (çift-encode string)            → aç, içi blocks ise çevir
 *   - düz markdown string                       → null (panel düzenlemesi korunur)
 */
export function contentToMarkdown(value: unknown): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return blocksToMarkdown(value);
  if (typeof value !== 'string') return null;

  const s = value.trim();
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) return blocksToMarkdown(arr);
    } catch {
      /* düz metin '[' ile başlıyorsa parse hatası → markdown say */
    }
    return null;
  }
  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      const inner = JSON.parse(s);
      if (typeof inner === 'string' && inner.trim().startsWith('[')) {
        const arr = JSON.parse(inner);
        if (Array.isArray(arr)) return blocksToMarkdown(arr);
      }
    } catch {
      /* yoksay */
    }
    return null;
  }
  return null; // zaten düz markdown
}
