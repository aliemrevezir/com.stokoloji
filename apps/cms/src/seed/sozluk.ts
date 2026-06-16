import type { Core } from '@strapi/strapi';
import { SOZLUK_TERIMLERI } from './sozluk-data';

const UID = 'api::sozluk-terimi.sozluk-terimi';

/**
 * Sözlük terimlerini idempotent şekilde seed eder.
 *
 * İki geçişli:
 *  1) Her terimi slug ile arar; yoksa oluşturur (ilişkiler hariç). slug → documentId
 *     eşlemesi toplanır (var olanlar dahil).
 *  2) `ilgili` slug'larını documentId'lere çevirip `ilgiliTerimler` ilişkisini bağlar.
 *
 * Tüm terimler zaten varsa hiçbir şey yazılmaz (sadece eksik ilişkiler tamamlanır).
 */
export async function seedSozluk(strapi: Core.Strapi): Promise<void> {
  const docs = strapi.documents(UID as any);
  const idBySlug = new Map<string, string>();
  let created = 0;

  // 1. geçiş — terimleri oluştur / mevcutları topla.
  for (const t of SOZLUK_TERIMLERI) {
    const existing = await docs.findFirst({ filters: { slug: t.slug } });
    if (existing) {
      idBySlug.set(t.slug, existing.documentId);
      continue;
    }
    const doc = await docs.create({
      data: {
        kelime: t.kelime,
        slug: t.slug,
        baslangicHarfi: t.harf,
        kisaTanim: t.kisaTanim,
        anlam: t.anlam,
      },
      status: 'published',
    });
    idBySlug.set(t.slug, doc.documentId);
    created += 1;
  }

  if (created > 0) {
    strapi.log.info(`[seed-sozluk] ${created} terim oluşturuldu.`);
  } else {
    strapi.log.info('[seed-sozluk] Tüm terimler mevcut; ilişkiler doğrulanıyor.');
  }

  // 2. geçiş — ilişkili terimleri bağla.
  for (const t of SOZLUK_TERIMLERI) {
    if (!t.ilgili || t.ilgili.length === 0) continue;
    const documentId = idBySlug.get(t.slug);
    if (!documentId) continue;
    const rel = t.ilgili
      .map((slug) => idBySlug.get(slug))
      .filter((id): id is string => Boolean(id));
    if (rel.length === 0) continue;
    await docs.update({
      documentId,
      data: { ilgiliTerimler: rel },
      status: 'published',
    });
  }
}
