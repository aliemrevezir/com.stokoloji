import type { Core } from '@strapi/strapi';
import { access, copyFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import {
  BLOG_SSS,
  EMNIYET_SSS,
  ROP_SSS,
  SDH_SSS,
  seedBanners,
  seedDemoContent,
  seedDuyuru,
  seedEmniyetStogu,
  seedFireOrani,
  seedHomepage,
  seedMrp,
  seedOee,
  seedRop,
  seedStokDevirHizi,
  seedStokNedir,
} from './seed';
import { seedSozluk } from './seed/sozluk';
import { contentToMarkdown } from './seed/blocksToMarkdown';

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

/* NOT: `migrateFormulaBlocks` ve `migrateInternalLinks` (blocks-dizisi yazan eski
 * migration'lar) FAZ 2'de KALDIRILDI. İçerik artık Markdown (richtext); alana dizi
 * yazmak `ValidationError` verirdi. Link düzeltmesi (`/blog/→/icerik/`) ve formül
 * dönüşümü artık `seed/blocksToMarkdown.ts` converter'ı içinde. Tek içerik yazıcısı
 * `migrateContentToMarkdown`. */

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
  // NOT: gövdeden FAQ başlığı temizliği FAZ 2'de buradan KALDIRILDI — artık
  // `blocksToMarkdown` converter'ı FAQ başlığını atıyor. Bu fonksiyon yalnız `sss`
  // (ayrı component alanı) senkronundan sorumlu; `icerik`'e DOKUNMAZ (Markdown).
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
 * İçeriği (blog `icerik` + tool `formulAciklamasi`) BİR KEZ Markdown'a taşır.
 *
 * Alan tipi `json` → `richtext` (Markdown editörü) yapıldı; eski kayıtlar hâlâ
 * blocks JSON tutuyor (ya da schema cast'inden gelen JSON-metni). Bu migration
 * `contentToMarkdown` ile her kaydı normalize eder:
 *   - blocks dizisi / JSON-metni  → Markdown string'e çevrilir, yazılır.
 *   - zaten düz Markdown          → `null` döner, DOKUNULMAZ.
 *
 * Böylece dönüşüm idempotent + tek-seferliktir: bir kez Markdown'a döndükten
 * sonra panelden yapılan düzenlemeler sonraki boot'larda EZİLMEZ (kullanıcının
 * asıl hedefi). Hata boot'u BOZMAMALI (try/catch). syncBlogFaq'tan SONRA çalışır
 * (FAQ gövdeden temizlendikten sonra çevirir; converter da FAQ başlığını atar).
 */
async function migrateContentToMarkdown(strapi: Core.Strapi): Promise<void> {
  try {
    const blogs: any[] = await strapi.documents('api::blog.blog').findMany({ status: 'published' });
    for (const b of blogs) {
      const md = contentToMarkdown(b.icerik);
      if (md == null) continue;
      await strapi.documents('api::blog.blog').update({
        documentId: b.documentId,
        data: { icerik: md },
        status: 'published',
      });
      strapi.log.info(`[migrate-md] blog Markdown'a taşındı: ${b.slug}`);
    }

    const tools: any[] = await strapi.documents('api::tool.tool').findMany({ status: 'published' });
    for (const tl of tools) {
      const md = contentToMarkdown(tl.formulAciklamasi);
      if (md == null) continue;
      await strapi.documents('api::tool.tool').update({
        documentId: tl.documentId,
        data: { formulAciklamasi: md },
        status: 'published',
      });
      strapi.log.info(`[migrate-md] tool Markdown'a taşındı: ${tl.slug}`);
    }
  } catch (err) {
    strapi.log.warn(`[migrate-md] atlandı: ${(err as Error).message}`);
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureUploadAssets(strapi);
    await setPublicReadPermissions(strapi);
    await seedDemoContent(strapi);
    await seedStokDevirHizi(strapi);
    await seedStokNedir(strapi);
    await seedEmniyetStogu(strapi);
    await seedRop(strapi);
    await seedOee(strapi);
    await seedFireOrani(strapi);
    await seedMrp(strapi);
    await seedHomepage(strapi);
    await seedBanners(strapi);
    await seedDuyuru(strapi);
    await seedSozluk(strapi);
    await syncBlogFaq(strapi);
    await migrateContentToMarkdown(strapi);
    await setAnasayfaFieldHints(strapi);
  },
};
