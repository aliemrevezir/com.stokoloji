/**
 * Sözlük yardımcıları — terimleri Türk alfabesi sırasında harf gruplarına böler.
 * Harf → ASCII URL eşlemesi `@stokoloji/api-client` içindedir (tek kaynak).
 */
import { TR_ALPHABET, harfToSlug, type SozlukTerimi } from '@stokoloji/api-client';

export { TR_ALPHABET, harfToSlug };

export interface HarfGrubu {
  /** Tam Türk alfabesi harfi (gösterim), ör. "Ç". */
  harf: string;
  /** ASCII URL segmenti, ör. "c". */
  slug: string;
  terimler: SozlukTerimi[];
}

/**
 * Terimleri `baslangicHarfi`'ye göre Türk alfabesi sırasında gruplar.
 * Boş harfler atlanır; her grup içinde terimler `kelime`'ye göre sıralı varsayılır
 * (Strapi `sort=kelime:asc` döndürür).
 */
export function groupByHarf(terimler: SozlukTerimi[]): HarfGrubu[] {
  const map = new Map<string, SozlukTerimi[]>();
  for (const t of terimler) {
    const harf = (t.baslangicHarfi ?? '').toLocaleUpperCase('tr');
    if (!harf) continue;
    if (!map.has(harf)) map.set(harf, []);
    map.get(harf)!.push(t);
  }
  return TR_ALPHABET.filter((h) => map.has(h)).map((harf) => ({
    harf,
    slug: harfToSlug(harf),
    terimler: map.get(harf)!,
  }));
}

/** Sözlükteki tüm dolu harfler için distinct ASCII URL segmentleri (sitemap/generateStaticParams). */
export function distinctHarfSluglari(terimler: SozlukTerimi[]): string[] {
  const set = new Set<string>();
  for (const t of terimler) {
    if (t.baslangicHarfi) set.add(harfToSlug(t.baslangicHarfi));
  }
  return [...set];
}
