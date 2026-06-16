import type { Core } from '@strapi/strapi';
import { seedBanners, seedDemoContent, seedHomepage } from './seed';

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

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicReadPermissions(strapi);
    await seedDemoContent(strapi);
    await seedHomepage(strapi);
    await seedBanners(strapi);
  },
};
