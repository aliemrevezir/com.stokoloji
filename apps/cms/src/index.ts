import type { Core } from '@strapi/strapi';
import { seedBanners, seedDemoContent, seedDuyuru, seedEmniyetStogu, seedHomepage, seedStokDevirHizi } from './seed';

/**
 * Public role'e içerik okuma izni ver (idempotent).
 * Böylece `docker compose up` sonrası sıfır manuel adımla api-client veri çekebilir.
 */
async function setPublicReadPermissions(strapi: Core.Strapi): Promise<void> {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[izinler] Public role bulunamadı, izinler atlandı.');
    return;
  }

  const permissionsByModel: Record<string, string[]> = {
    tool: ['find', 'findOne'],
    blog: ['find', 'findOne'],
    kategori: ['find', 'findOne'],
    yazar: ['find', 'findOne'],
    banner: ['find', 'findOne'],
    duyuru: ['find', 'findOne'],
    // Single type yalnızca `find` action'ı kullanır (findOne yoktur).
    anasayfa: ['find'],
  };

  for (const [model, actions] of Object.entries(permissionsByModel)) {
    for (const action of actions) {
      const uid = `api::${model}.${model}.${action}`;
      const existing = await strapi.db
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action: uid, role: publicRole.id } });

      if (!existing) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action: uid, role: publicRole.id },
        });
        strapi.log.info(`[izinler] Public izin verildi: ${uid}`);
      }
    }
  }
}

/**
 * Anasayfa "Öne Çıkan Yazılar" / "Öne Çıkan Araçlar" alanlarının altına
 * content-manager edit görünümünde görünecek bir açıklama yazar (en fazla 4
 * kuralı). Field açıklaması şema dosyasında DEĞİL, content-manager
 * konfigürasyonunda (DB) tutulur; bu yüzden burada idempotent set edilir.
 * Hata boot'u BOZMAMALI (try/catch) — config henüz oluşmamışsa sessizce atlar.
 */
async function setAnasayfaFieldHints(strapi: Core.Strapi): Promise<void> {
  const hints: Record<string, string> = {
    oneCikanYazilar:
      'Editörün Seçtikleri bölümünü besler. En fazla 4 yazı ekle: ilki büyük kart, sonraki 3 yan sütun olur; fazlası gösterilmez. Kapak görseli, başlık ve excerpt (SEO açıklaması) yazının kendisinden gelir.',
    oneCikanAraclar:
      'Anasayfa hesaplayıcı vitrinini besler. En fazla 4 araç; fazlası gösterilmez.',
  };

  try {
    const store = strapi.store({
      type: 'plugin',
      name: 'content_manager_configuration',
      key: 'content_types::api::anasayfa.anasayfa',
    });
    const config = (await store.get()) as {
      metadatas?: Record<string, { edit?: { description?: string } }>;
    } | null;

    if (!config?.metadatas) {
      strapi.log.info(
        '[anasayfa] content-manager konfigürasyonu hazır değil, alan açıklamaları atlandı.',
      );
      return;
    }

    let changed = false;
    for (const [field, desc] of Object.entries(hints)) {
      const edit = config.metadatas[field]?.edit;
      if (edit && edit.description !== desc) {
        edit.description = desc;
        changed = true;
      }
    }

    if (changed) {
      await store.set({ value: config });
      strapi.log.info('[anasayfa] Öne çıkan alan açıklamaları ayarlandı.');
    }
  } catch (err) {
    strapi.log.warn(
      `[anasayfa] Alan açıklamaları ayarlanamadı: ${(err as Error).message}`,
    );
  }
}

/**
 * Mevcut blog/tool içeriğindeki "tek başına formül" paragraflarını (inline `code`
 * text node) blok düzeyi `code` node'una çevirir → web'de KaTeX/şık formül kartı
 * olarak render edilir (BlocksRenderer `case 'code'`). Sembolik formüller LaTeX'e
 * maplenir; kelimeli formüller metin kartı olur. Idempotent: dönüştürülen node artık
 * `paragraph` değil `code` olduğundan tekrar çalıştırınca atlanır. Yeni seed `fx()`
 * kullanır; bu migration ESKİ DB kayıtlarını (idempotent seed atladığı için) düzeltir.
 * Hata boot'u BOZMAMALI (try/catch).
 */
async function migrateFormulaBlocks(strapi: Core.Strapi): Promise<void> {
  // Eski (inline code) formül metni → yeni (code block) LaTeX. Map'te olmayan
  // tek-code paragraflar (kelimeli formüller) metni aynen taşınır → metin kartı.
  const LATEX: Record<string, string> = {
    'EOQ = √(2 × D × S / H)': 'EOQ = \\sqrt{\\dfrac{2 \\times D \\times S}{H}}',
    'Emniyet Stoğu = Z × σ_d × √L': 'SS = Z \\times \\sigma_d \\times \\sqrt{L}',
    'Emniyet Stoğu = Z × σ_L × D_ort': 'SS = Z \\times \\sigma_L \\times D_{ort}',
    'Emniyet Stoğu = Z × √[ (L × σ_d²) + (σ_L × D_ort)² ]':
      'SS = Z \\times \\sqrt{(L \\times \\sigma_d^2) + (\\sigma_L \\times D_{ort})^2}',
    'Emniyet Stoğu = 1,65 × 20 × √9 = 1,65 × 20 × 3 = 99 adet':
      'SS = 1{,}65 \\times 20 \\times \\sqrt{9} = 1{,}65 \\times 20 \\times 3 = 99 \\text{ adet}',
  };

  // Yalnız "tek bir inline code text node içeren paragraf" formül satırı sayılır
  // (içinde STDEV gibi karışık prose'da code geçen paragraflar çok-çocukludur, atlanır).
  const convert = (nodes: any[]): { out: any[]; changed: boolean } => {
    let changed = false;
    const out = nodes.map((node) => {
      if (
        node?.type === 'paragraph' &&
        Array.isArray(node.children) &&
        node.children.length === 1 &&
        node.children[0]?.type === 'text' &&
        node.children[0]?.code === true &&
        typeof node.children[0]?.text === 'string'
      ) {
        changed = true;
        const raw = node.children[0].text.trim();
        return { type: 'code', children: [{ type: 'text', text: LATEX[raw] ?? raw }] };
      }
      return node;
    });
    return { out, changed };
  };

  try {
    const blogs: any[] = await strapi.documents('api::blog.blog').findMany({ status: 'published' });
    for (const b of blogs) {
      if (!Array.isArray(b.icerik)) continue;
      const { out, changed } = convert(b.icerik);
      if (changed) {
        await strapi.documents('api::blog.blog').update({
          documentId: b.documentId,
          data: { icerik: out },
          status: 'published',
        });
        strapi.log.info(`[migrate-formul] blog güncellendi: ${b.slug}`);
      }
    }

    const tools: any[] = await strapi.documents('api::tool.tool').findMany({ status: 'published' });
    for (const tl of tools) {
      if (!Array.isArray(tl.formulAciklamasi)) continue;
      const { out, changed } = convert(tl.formulAciklamasi);
      if (changed) {
        await strapi.documents('api::tool.tool').update({
          documentId: tl.documentId,
          data: { formulAciklamasi: out },
          status: 'published',
        });
        strapi.log.info(`[migrate-formul] tool güncellendi: ${tl.slug}`);
      }
    }
  } catch (err) {
    strapi.log.warn(`[migrate-formul] atlandı: ${(err as Error).message}`);
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicReadPermissions(strapi);
    await seedDemoContent(strapi);
    await seedStokDevirHizi(strapi);
    await seedEmniyetStogu(strapi);
    await seedHomepage(strapi);
    await seedBanners(strapi);
    await seedDuyuru(strapi);
    await migrateFormulaBlocks(strapi);
    await setAnasayfaFieldHints(strapi);
  },
};
