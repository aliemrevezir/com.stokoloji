/**
 * Markdown gövde renderer'ı (blog `icerik` + tool `formulAciklamasi`).
 *
 * İçerik artık panelden düzenlenebilir Markdown'dır. Render zinciri:
 *   - remark-gfm   → GFM tabloları (`| | |`)
 *   - remark-math + rehype-katex → `$...$` inline, `$$...$$` display formül (SSR)
 *   - ```formula bloğu → kelimeli formül kartı (KaTeX'in zayıf olduğu TR formüller)
 *
 * Başlık id'leri `slugify` ile üretilir (rehype-slug DEĞİL) → TOC anchor'ları
 * (lib/blocks `extractToc`) ile birebir tutarlı. Tüm stiller BlocksRenderer'ın
 * önceki Tailwind sınıflarıyla aynı; görsel çıktı değişmez.
 *
 * Server component: ekstra client JS yok (CWV — mimari kural 7). Bir dizi (eski
 * blocks) gelirse güvenlik ağı olarak BlocksRenderer'a düşer (geçiş + sözlük).
 */
import type { ReactNode } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';
import { slugify } from '@/lib/blocks';
import { mediaUrl } from '@/lib/strapi';
import { BlocksRenderer } from './BlocksRenderer';

/** React children ağacından düz metni toplar (başlık id'si + formül kartı için). */
function flatten(node: ReactNode): string {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flatten).join('');
  if (typeof node === 'object' && 'props' in node) {
    return flatten((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

const headingCls = 'mt-8 mb-3 font-semibold text-brand-900 scroll-mt-24';

const components: Components = {
  h1: ({ children }) => (
    <h1 id={slugify(flatten(children))} className={`text-3xl ${headingCls}`}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 id={slugify(flatten(children))} className={`text-2xl ${headingCls}`}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(flatten(children))} className={`text-xl ${headingCls}`}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 id={slugify(flatten(children))} className={`text-lg ${headingCls}`}>{children}</h4>
  ),
  p: ({ children }) => <p className="my-4 leading-7 text-ink/90">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="font-medium text-accent-600 underline underline-offset-2">{children}</a>
  ),
  ul: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-6 text-ink/90">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-1 pl-6 text-ink/90">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-accent-500 pl-4 italic text-muted">{children}</blockquote>
  ),
  table: ({ children }) => (
    <figure className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </figure>
  ),
  th: ({ children }) => (
    <th className="border-b-2 border-brand-200 px-3 py-2 text-left font-semibold text-brand-900">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-brand-100 px-3 py-2 align-top text-ink/90">{children}</td>
  ),
  img: ({ src, alt }) => {
    const raw = typeof src === 'string' ? src : undefined;
    // `/img/` ile başlayan yol web'in kendi public asset'i (Strapi host eklenmez).
    const url = raw && raw.startsWith('/img/') ? raw : mediaUrl(raw);
    if (!url) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt ?? ''} loading="lazy" className="w-full rounded-lg" />;
  },
  // Satır-içi `code` (tek backtick). Blok formül `pre` ile yakalanır.
  code: ({ children }) => (
    <code className="rounded bg-canvas px-1 font-mono text-sm">{children}</code>
  ),
  // ```formula bloğu → kelimeli formül kartı (BlocksRenderer ile aynı stil).
  pre: ({ children }) => (
    <div className="formula-block formula-block--text">
      <span className="formula-block__text">{flatten(children).trim()}</span>
    </div>
  ),
};

export function MarkdownContent({ markdown }: { markdown: unknown }) {
  // Geçiş/güvenlik ağı: bir kayıt hâlâ blocks dizisi ise eski renderer.
  if (Array.isArray(markdown)) return <BlocksRenderer content={markdown} />;
  if (typeof markdown !== 'string' || markdown.trim() === '') return null;
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {markdown}
    </Markdown>
  );
}
