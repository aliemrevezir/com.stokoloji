import Link from 'next/link';

export interface Crumb {
  name: string;
  href: string;
}

/** Breadcrumb gezinme (görsel). JSON-LD ayrıca BreadcrumbList ile basılır. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-brand-900">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-brand-700">{item.name}</Link>
              )}
              {!last && <span className="text-line">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
