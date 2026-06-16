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
    await setAnasayfaFieldHints(strapi);
  },
};
