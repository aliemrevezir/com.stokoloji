export interface TocItem {
  id: string;
  label: string;
  /** 2 = ana bölüm, 3 = alt başlık (girintili). Eski çağrılar için opsiyonel. */
  level?: number;
}

/** Blog için sticky "Bu yazıda" içindekiler (H2 ana, H3 girintili). */
export function TOCSidebar({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="İçindekiler" className="text-sm">
      <p className="mb-2 font-semibold text-brand-900">Bu yazıda</p>
      <ul className="space-y-1.5 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l border-transparent text-muted hover:border-accent-500 hover:text-brand-700 ${
                item.level === 3 ? 'pl-6 text-[0.8125rem]' : 'pl-3'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
