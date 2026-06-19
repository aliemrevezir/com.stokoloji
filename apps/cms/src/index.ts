import type { Core } from '@strapi/strapi';
import { access, copyFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import {
  BLOG_SSS,
  EMNIYET_SSS,
  ROP_SSS,
  SDH_BLOG,
  SDH_SSS,
  seedBanners,
  seedDemoContent,
  seedDuyuru,
  seedEmniyetStogu,
  seedHomepage,
  seedRop,
  seedStokDevirHizi,
} from './seed';
import { seedSozluk } from './seed/sozluk';

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
    'sozluk-terimi': ['find', 'findOne'],
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

/**
 * İç link migration (idempotent): blocks içindeki link node'larında `/blog/<slug>`
 * URL'lerini canlı blog route'una (`/icerik/<slug>`) çevirir. Eski seed kayıtları
 * `/blog/` yazdığı ve canlı route `/icerik/` olduğu için kırık linkleri onarır.
 */
async function migrateInternalLinks(strapi: Core.Strapi): Promise<void> {
  // Bir blocks ağacını dolaşır; type:'link' node'larının url'sini düzeltir.
  const fix = (node: any): boolean => {
    let changed = false;
    if (node?.type === 'link' && typeof node.url === 'string' && node.url.startsWith('/blog/')) {
      node.url = node.url.replace(/^\/blog\//, '/icerik/');
      changed = true;
    }
    if (Array.isArray(node?.children)) {
      for (const child of node.children) {
        if (fix(child)) changed = true;
      }
    }
    return changed;
  };
  const convert = (nodes: any[]): { out: any[]; changed: boolean } => {
    let changed = false;
    for (const node of nodes) {
      if (fix(node)) changed = true;
    }
    return { out: nodes, changed };
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
        strapi.log.info(`[migrate-link] blog güncellendi: ${b.slug}`);
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
        strapi.log.info(`[migrate-link] tool güncellendi: ${tl.slug}`);
      }
    }
  } catch (err) {
    strapi.log.warn(`[migrate-link] atlandı: ${(err as Error).message}`);
  }
}

/**
 * Seed görsellerini (git'li `seed-assets/uploads/`) çalışma anında `public/uploads/`
 * volume'una kopyalar (yoksa). Neden: `public/uploads` kalıcı bir named volume'dur ve
 * image build'indeki dosyaları GÖLGELER; fresh prod deploy'da boş başlar → seed'in
 * oluşturduğu `plugin::upload.file` kayıtları ve gövde görselleri 404 verirdi. Binary'ler
 * git'te (`seed-assets/`, .dockerignore/.gitignore DIŞINDA) → image'a girer → buradan
 * volume'a kopyalanır. Idempotent: var olan dosya atlanır. Seed'lerden ÖNCE çalışmalı.
 * Hata boot'u BOZMAMALI (try/catch).
 */
async function ensureUploadAssets(strapi: Core.Strapi): Promise<void> {
  try {
    const srcDir = join(process.cwd(), 'seed-assets', 'uploads');
    const destDir = join(process.cwd(), 'public', 'uploads');
    let files: string[];
    try {
      files = await readdir(srcDir);
    } catch {
      return; // asset klasörü yoksa sessizce geç
    }
    await mkdir(destDir, { recursive: true });
    let copied = 0;
    for (const file of files) {
      if (file.startsWith('.')) continue;
      const dest = join(destDir, file);
      try {
        await access(dest); // varsa atla
      } catch {
        await copyFile(join(srcDir, file), dest);
        copied++;
      }
    }
    if (copied > 0) strapi.log.info(`[assets] ${copied} seed görseli public/uploads'a kopyalandı.`);
  } catch (err) {
    strapi.log.warn(`[assets] Seed görselleri kopyalanamadı: ${(err as Error).message}`);
  }
}

/**
 * Blog SSS (FAQ) içeriğini canonical seed dizileriyle senkronlar (idempotent) ve
 * gövdedeki artık "Sıkça/Sık sorulan sorular" başlığını + giriş paragrafını temizler.
 *
 * Gerekçe: SSS alanı blog detayında artık GÖRÜNÜR render ediliyor (tek alan hem
 * JSON-LD hem görünür FAQ). Mevcut kayıtlar idempotent seed guard'ı yüzünden
 * güncellenmez; bu migration Semrush + Google PAA araştırmasıyla zenginleştirilen
 * FAQ'ı canlı kayıtlara taşır. NOT: bu 4 launch blog'unun FAQ'ı seed-yönetimlidir;
 * panelden elle düzenleme sonraki boot'ta canonical ile geri yazılır. İçeriğin
 * gerçekten değiştiği kayda dokunur (soru+cevap imzası farklıysa) → yakınsar.
 */
async function syncBlogFaq(strapi: Core.Strapi): Promise<void> {
  const FAQ_BY_SLUG: Record<string, { soru: string; cevap: string }[]> = {
    'eoq-nedir': BLOG_SSS,
    'stok-devir-hizi-nedir': SDH_SSS,
    'emniyet-stogu-nedir': EMNIYET_SSS,
    'yeniden-siparis-noktasi-nedir': ROP_SSS,
  };
  // gövdeden silinecek artık FAQ başlığı (sorular ayrı alandan görünür basılıyor)
  const isFaqHeading = (node: any): boolean =>
    node?.type === 'heading' &&
    typeof node?.children?.[0]?.text === 'string' &&
    /^s[ıi]k(ça)?\s+sorulan\s+sorular$/i.test(node.children[0].text.trim());
  const isFaqIntro = (node: any): boolean =>
    node?.type === 'paragraph' &&
    typeof node?.children?.[0]?.text === 'string' &&
    /^aşağıda\b/i.test(node.children[0].text.trim());

  const sig = (items: { soru: string; cevap: string }[]): string =>
    items.map((q) => `${q.soru}::${q.cevap}`).join('||');

  try {
    for (const [slug, faq] of Object.entries(FAQ_BY_SLUG)) {
      const blog: any = await strapi.documents('api::blog.blog').findFirst({
        filters: { slug },
        populate: ['sss'],
      });
      if (!blog) continue;

      const data: Record<string, unknown> = {};

      // 1) FAQ senkronu (yalnız farklıysa)
      const current = Array.isArray(blog.sss)
        ? blog.sss.map((q: any) => ({ soru: q.soru, cevap: q.cevap }))
        : [];
      if (sig(current) !== sig(faq)) {
        data.sss = faq;
      }

      // 2) Gövdeden artık FAQ başlığı + giriş paragrafını temizle
      if (Array.isArray(blog.icerik)) {
        const out: any[] = [];
        let changed = false;
        for (let i = 0; i < blog.icerik.length; i++) {
          const node = blog.icerik[i];
          if (isFaqHeading(node)) {
            changed = true;
            if (isFaqIntro(blog.icerik[i + 1])) i += 1; // takip eden giriş paragrafını da atla
            continue;
          }
          out.push(node);
        }
        if (changed) data.icerik = out;
      }

      if (Object.keys(data).length > 0) {
        await strapi.documents('api::blog.blog').update({
          documentId: blog.documentId,
          data,
          status: 'published',
        });
        strapi.log.info(`[migrate-faq] blog güncellendi: ${slug} (${Object.keys(data).join(', ')})`);
      }
    }
  } catch (err) {
    strapi.log.warn(`[migrate-faq] atlandı: ${(err as Error).message}`);
  }
}

/**
 * Stok devir hızı blog gövdesini (icerik) canonical SDH_BLOG ile senkronlar
 * (idempotent). seedStokDevirHizi CREATE-only olduğundan mevcut canlı kayıt
 * güncellenmez; bu migration, SEO için zenginleştirilen gövdeyi (yeni H2/H3
 * bölümleri: bilançodan hesaplama, dönem seçimi, hammadde/perakende/çoklu ürün
 * örnekleri, Excel) canlıya taşır. Yalnızca içerik imzası farklıysa yazar →
 * yakınsar. NOT: gövde seed-yönetimlidir; panelden elle düzenleme sonraki boot'ta
 * canonical ile geri yazılır (SDH_SSS ↔ syncBlogFaq ile aynı sözleşme).
 */
async function migrateStokDevirHiziBody(strapi: Core.Strapi): Promise<void> {
  try {
    const blog: any = await strapi.documents('api::blog.blog').findFirst({
      filters: { slug: 'stok-devir-hizi-nedir' },
    });
    if (!blog) return;

    const sig = (icerik: unknown): string => JSON.stringify(icerik ?? null);
    if (sig(blog.icerik) === sig(SDH_BLOG)) return;

    await strapi.documents('api::blog.blog').update({
      documentId: blog.documentId,
      data: { icerik: SDH_BLOG },
      status: 'published',
    });
    strapi.log.info('[migrate-sdh-body] stok-devir-hizi-nedir gövdesi güncellendi.');
  } catch (err) {
    strapi.log.warn(`[migrate-sdh-body] atlandı: ${(err as Error).message}`);
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureUploadAssets(strapi);
    await setPublicReadPermissions(strapi);
    await seedDemoContent(strapi);
    await seedStokDevirHizi(strapi);
    await seedEmniyetStogu(strapi);
    await seedRop(strapi);
    await seedHomepage(strapi);
    await seedBanners(strapi);
    await seedDuyuru(strapi);
    await seedSozluk(strapi);
    await migrateFormulaBlocks(strapi);
    await migrateInternalLinks(strapi);
    await migrateStokDevirHiziBody(strapi);
    await syncBlogFaq(strapi);
    await setAnasayfaFieldHints(strapi);
  },
};
