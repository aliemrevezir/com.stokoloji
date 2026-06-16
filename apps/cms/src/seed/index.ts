import type { Core } from '@strapi/strapi';

/* ----------------------------- blocks yardımcıları -----------------------------
 * Strapi 'blocks' alanı runtime'da düz JSON node dizisidir; generated tipler
 * (BlocksValue) katı bir union olduğundan elle kurulan node'lar widening yüzünden
 * uyuşmaz. Dönüş tipini `any` işaretleyerek seed'i tip uyuşmazlığından kurtarıyoruz
 * (aksi halde tek bir tip hatası TÜM cms derlemesini bloklar — banner API dahil). */

const p = (text: string): any => ({
  type: 'paragraph',
  children: [{ type: 'text', text }],
});

const h = (level: number, text: string): any => ({
  type: 'heading',
  level,
  children: [{ type: 'text', text }],
});

const ul = (items: string[]): any => ({
  type: 'list',
  format: 'unordered',
  children: items.map((text) => ({
    type: 'list-item',
    children: [{ type: 'text', text }],
  })),
});

/* --------------------------------- içerik --------------------------------- */

const FORMUL_ACIKLAMASI = [
  h(2, 'EOQ formülü nedir?'),
  p(
    'Ekonomik Sipariş Miktarı (EOQ), toplam stok maliyetini (sipariş verme + elde tutma) en aza indiren ideal sipariş büyüklüğüdür. Aşağıdaki formülle hesaplanır:',
  ),
  p('EOQ = √( (2 × D × S) / H )'),
  h(3, 'Değişkenler'),
  ul([
    'D — Yıllık talep (birim/yıl)',
    'S — Sipariş başına maliyet (₺/sipariş)',
    'H — Birim başına yıllık taşıma/elde tutma maliyeti (₺/birim·yıl)',
  ]),
  p(
    'Sonuç, her siparişte kaç birim ısmarlamanız gerektiğini söyler. Yıllık sipariş sayısı ise D / EOQ ile bulunur.',
  ),
];

const BLOG_ICERIK = [
  p(
    'Ekonomik Sipariş Miktarı (EOQ), bir işletmenin stok maliyetlerini en aza indirmek için her siparişte kaç birim sipariş etmesi gerektiğini belirleyen klasik bir envanter yönetimi modelidir. Sipariş verme maliyeti ile elde tutma maliyeti arasındaki dengeyi kurar.',
  ),
  h(2, 'EOQ neden önemlidir?'),
  p(
    'Çok sık sipariş vermek sipariş maliyetlerini; çok seyrek ve büyük sipariş vermek ise depolama ve sermaye maliyetlerini artırır. EOQ bu iki maliyet kaleminin toplamını minimize eden noktayı verir.',
  ),
  h(2, 'EOQ modelinin varsayımları'),
  ul([
    'Talep sabittir ve bilinir.',
    'Birim fiyat sabittir (miktar indirimi yoktur).',
    'Tedarik süresi sabittir.',
    'Stoksuz kalma (kıtlık) olmaz.',
  ]),
  p(
    'Bu varsayımlar gerçek hayatta her zaman tam sağlanmasa da EOQ, sipariş politikası için güçlü bir başlangıç noktası ve referans değeri sunar.',
  ),
];

const SSS = [
  {
    soru: 'EOQ formülünde hangi değerlere ihtiyacım var?',
    cevap:
      'Üç değere: yıllık talep (D), sipariş başına maliyet (S) ve birim başına yıllık taşıma maliyeti (H).',
  },
  {
    soru: 'EOQ her sektör için uygun mu?',
    cevap:
      'Talebin görece istikrarlı olduğu durumlarda çok kullanışlıdır. Talebin dalgalı olduğu durumlarda emniyet stoğu gibi ek modellerle birlikte kullanılmalıdır.',
  },
  {
    soru: 'Yılda kaç sipariş vermem gerektiğini nasıl bulurum?',
    cevap: 'Yıllık talebi (D) EOQ sonucuna bölün: sipariş sayısı = D / EOQ.',
  },
];

/* --------------------------------- seed --------------------------------- */

/**
 * Demo içeriğini oluşturur (idempotent — EOQ tool zaten varsa atlar).
 * Entegrasyonun çalıştığını kanıtlayan minimum dikey dilim:
 * 1 Kategori, 1 Yazar, 1 Tool (EOQ), 1 Blog (EOQ nedir, tool'a bağlı).
 */
export async function seedDemoContent(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'eoq-hesaplama' },
  });

  if (existing) {
    strapi.log.info('[seed] Demo içerik zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Demo içerik oluşturuluyor...');

  const kategori = await strapi.documents('api::kategori.kategori').create({
    data: { ad: 'Stok Yönetimi', slug: 'stok-yonetimi' },
    status: 'published',
  });

  const yazar = await strapi.documents('api::yazar.yazar').create({
    data: {
      ad: 'Stokoloji Editör Ekibi',
      unvan: 'Stok & Tedarik Zinciri',
      bio: 'Stok yönetimi ve operasyon araçları üzerine içerik üreten editör ekibi.',
    },
    status: 'published',
  });

  const tool = await strapi.documents('api::tool.tool').create({
    data: {
      ad: 'EOQ Hesaplama',
      slug: 'eoq-hesaplama',
      kisaAciklama:
        'Ekonomik Sipariş Miktarını (EOQ) saniyeler içinde hesaplayın: yıllık talep, sipariş maliyeti ve taşıma maliyetini girin, ideal sipariş büyüklüğünü öğrenin.',
      formulAciklamasi: FORMUL_ACIKLAMASI,
      seo: {
        title: 'EOQ Hesaplama Aracı | Ekonomik Sipariş Miktarı',
        description:
          'Ücretsiz EOQ (Ekonomik Sipariş Miktarı) hesaplama aracı. Yıllık talep, sipariş ve taşıma maliyetiyle ideal sipariş miktarını ve yıllık sipariş sayısını hesaplayın.',
      },
      kategori: kategori.documentId,
      sss: SSS,
    },
    status: 'published',
  });

  const blog = await strapi.documents('api::blog.blog').create({
    data: {
      baslik: 'EOQ Nedir? Ekonomik Sipariş Miktarı Rehberi',
      slug: 'eoq-nedir',
      icerik: BLOG_ICERIK,
      seo: {
        title: 'EOQ Nedir? Ekonomik Sipariş Miktarı Rehberi',
        description:
          'EOQ (Ekonomik Sipariş Miktarı) nedir, neden önemlidir ve hangi varsayımlara dayanır? Stok maliyetlerini düşüren sipariş politikasını öğrenin.',
      },
      kategori: kategori.documentId,
      yazar: yazar.documentId,
      iliskiliTool: tool.documentId,
      yayinTarihi: '2025-01-15T09:00:00.000Z',
      guncellemeTarihi: '2025-01-15T09:00:00.000Z',
    },
    status: 'published',
  });

  // Tool ↔ Blog ilişkisini (iliskiliYazilar) tamamla.
  await strapi.documents('api::tool.tool').update({
    documentId: tool.documentId,
    data: { iliskiliYazilar: [blog.documentId] },
    status: 'published',
  });

  strapi.log.info('[seed] Demo içerik başarıyla oluşturuldu.');
}

/**
 * Anasayfa single type'ını seed'ler (idempotent — kayıt zaten varsa atlar).
 *
 * Demo içerik guard'ından BAĞIMSIZ çalışır: EOQ içeriği önceden seed edilmiş
 * olsa bile anasayfa kaydı oluşturulur. Öne çıkan tool/blog'u mevcut kayıtlardan
 * (varsa) slug ile bağlar; bulunmazsa boş kürasyonla devam eder.
 */
export async function seedHomepage(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::anasayfa.anasayfa').findFirst();
  if (existing) {
    strapi.log.info('[seed] Anasayfa zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Anasayfa içeriği oluşturuluyor...');

  const tool = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'eoq-hesaplama' },
  });
  const blog = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'eoq-nedir' },
  });

  await strapi.documents('api::anasayfa.anasayfa').create({
    data: {
      oneCikanYazilar: blog ? [blog.documentId] : [],
      oneCikanAraclar: tool ? [tool.documentId] : [],
    },
    status: 'published',
  });

  strapi.log.info('[seed] Anasayfa içeriği başarıyla oluşturuldu.');
}

/**
 * Hero carousel banner'larını seed'ler (idempotent — kayıt varsa atlar).
 *
 * Banner kendi metnini tutmaz; mevcut blog/tool kayıtlarına bağlanır. Başlık,
 * excerpt ve link web tarafında bu referanstan türetilir (bkz. web lib/banners.ts).
 * Görsel opsiyoneldir; seed'de yüklenmez, panelden eklenebilir.
 */
export async function seedBanners(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::banner.banner').findFirst();
  if (existing) {
    strapi.log.info('[seed] Banner kayıtları zaten mevcut, atlanıyor.');
    return;
  }

  const tool = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'eoq-hesaplama' },
  });
  const blog = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'eoq-nedir' },
  });

  if (!tool && !blog) {
    strapi.log.warn('[seed] Banner için bağlanacak blog/tool bulunamadı, atlandı.');
    return;
  }

  strapi.log.info('[seed] Banner kayıtları oluşturuluyor...');

  if (blog) {
    await strapi.documents('api::banner.banner').create({
      data: { blog: blog.documentId, sira: 1 },
      status: 'published',
    });
  }
  if (tool) {
    await strapi.documents('api::banner.banner').create({
      data: { arac: tool.documentId, sira: 2 },
      status: 'published',
    });
  }

  strapi.log.info('[seed] Banner kayıtları başarıyla oluşturuldu.');
}
