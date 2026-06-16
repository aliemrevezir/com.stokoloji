/**
 * Minimal Strapi "blocks" zengin metin renderer'ı.
 *
 * Demoda kullanılan düğümleri (paragraf, başlık, liste, alıntı, görsel, satır-içi
 * biçimlendirme, bağlantı) kapsar. Dış bağımlılık YOKTUR. Yeni bir blok türü
 * gerekirse buraya eklenir.
 */
import { Fragment, type ReactNode } from 'react';
import { slugify } from '@/lib/blocks';
import { mediaUrl } from '@/lib/strapi';

type InlineNode = {
  type: 'text' | 'link';
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  url?: string;
  children?: InlineNode[];
};

type ImageData = {
  url?: string;
  alternativeText?: string | null;
  caption?: string | null;
};

type BlockNode = {
  type: string;
  level?: number;
  format?: 'ordered' | 'unordered';
  image?: ImageData;
  headers?: string[];
  rows?: string[][];
  caption?: string | null;
  children?: (InlineNode | BlockNode)[];
};

function renderInline(nodes: InlineNode[] | undefined, keyPrefix: string): ReactNode {
  if (!nodes) return null;
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;
    if (node.type === 'link') {
      return (
        <a
          key={key}
          href={node.url}
          className="font-medium text-accent-600 underline underline-offset-2"
        >
          {renderInline(node.children, key)}
        </a>
      );
    }
    let content: ReactNode = node.text ?? '';
    if (node.code) content = <code className="rounded bg-canvas px-1 font-mono text-sm">{content}</code>;
    if (node.bold) content = <strong>{content}</strong>;
    if (node.italic) content = <em>{content}</em>;
    if (node.underline) content = <u>{content}</u>;
    return <Fragment key={key}>{content}</Fragment>;
  });
}

function renderBlock(block: BlockNode, key: string): ReactNode {
  const inline = block.children as InlineNode[] | undefined;
  switch (block.type) {
    case 'heading': {
      const cls = 'mt-8 mb-3 font-semibold text-brand-900 scroll-mt-24';
      const text = (inline ?? []).map((n) => n.text ?? '').join('');
      const id = slugify(text);
      if (block.level === 2) return <h2 key={key} id={id} className={`text-2xl ${cls}`}>{renderInline(inline, key)}</h2>;
      if (block.level === 3) return <h3 key={key} id={id} className={`text-xl ${cls}`}>{renderInline(inline, key)}</h3>;
      return <h4 key={key} id={id} className={`text-lg ${cls}`}>{renderInline(inline, key)}</h4>;
    }
    case 'list': {
      const items = (block.children as BlockNode[]) ?? [];
      const lis = items.map((li, i) => (
        <li key={`${key}-li-${i}`}>{renderInline(li.children as InlineNode[], `${key}-li-${i}`)}</li>
      ));
      return block.format === 'ordered' ? (
        <ol key={key} className="my-4 list-decimal space-y-1 pl-6 text-ink/90">{lis}</ol>
      ) : (
        <ul key={key} className="my-4 list-disc space-y-1 pl-6 text-ink/90">{lis}</ul>
      );
    }
    case 'quote':
      return (
        <blockquote key={key} className="my-4 border-l-4 border-accent-500 pl-4 italic text-muted">
          {renderInline(inline, key)}
        </blockquote>
      );
    case 'table': {
      if (!block.headers || !block.rows) return null;
      return (
        <figure key={key} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {block.headers.map((head, i) => (
                  <th key={i} className="border-b-2 border-brand-200 px-3 py-2 text-left font-semibold text-brand-900">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-brand-100 px-3 py-2 align-top text-ink/90">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted">{block.caption}</figcaption>
          )}
        </figure>
      );
    }
    case 'image': {
      // Strapi blocks görseli medya verisini node içine gömer (ekstra populate yok).
      // next/image değil düz <img>: docker dev'de optimizer localhost:1337'e ulaşamaz.
      // `/img/` ile başlayan yol web'in kendi public asset'idir (Strapi host eklenmez).
      const raw = block.image?.url;
      const url = raw && raw.startsWith('/img/') ? raw : mediaUrl(raw);
      if (!url) return null;
      const alt = block.image?.alternativeText ?? '';
      return (
        <figure key={key} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} loading="lazy" className="w-full rounded-lg" />
          {block.image?.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted">{block.image.caption}</figcaption>
          )}
        </figure>
      );
    }
    case 'paragraph':
    default:
      return (
        <p key={key} className="my-4 leading-7 text-ink/90">
          {renderInline(inline, key)}
        </p>
      );
  }
}

export function BlocksRenderer({ content }: { content: unknown }) {
  if (!Array.isArray(content)) return null;
  return <>{(content as BlockNode[]).map((block, i) => renderBlock(block, `b-${i}`))}</>;
}
