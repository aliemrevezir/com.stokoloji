import { ArticleCard, type ArticleCardProps } from './ArticleCard';
import { SectionHeading } from './SectionHeading';

export interface CategorySectionProps {
  baslik: string;
  href?: string;
  yazilar: ArticleCardProps[];
}

/** Tek kategori bloğu: başlık + o kategoriye ait yazı kartları grid'i. */
export function CategorySection({ baslik, href, yazilar }: CategorySectionProps) {
  if (yazilar.length === 0) return null;
  return (
    <section>
      <SectionHeading baslik={baslik} href={href} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {yazilar.map((yazi) => (
          <ArticleCard key={yazi.href} {...yazi} />
        ))}
      </div>
    </section>
  );
}
