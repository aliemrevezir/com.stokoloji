export interface TocItem {
  id: string;
  label: string;
}

/** Blog için sticky "Bu yazıda" içindekiler. */
export function TOCSidebar({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="İçindekiler" className="sticky top-6 text-sm">
      <p className="mb-2 font-semibold text-brand-900">Bu yazıda</p>
      <ul className="space-y-1.5 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-ml-px block border-l border-transparent pl-3 text-muted hover:border-accent-500 hover:text-brand-700"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
