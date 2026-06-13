import Link from 'next/link';

export interface RelatedItem {
  ad: string;
  slug: string;
  kisaAciklama?: string | null;
  href: string;
}

/** İç link cluster'ı — ilgili tool/yazı kartları. */
export function RelatedToolsGrid({
  baslik = 'İlgili Araçlar',
  items,
}: {
  baslik?: string;
  items: RelatedItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-brand-900">{baslik}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="rounded-lg border border-line p-4 transition hover:border-accent-500 hover:shadow-sm"
          >
            <p className="font-medium text-brand-900">{item.ad}</p>
            {item.kisaAciklama && (
              <p className="mt-1 line-clamp-2 text-sm text-muted">{item.kisaAciklama}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
