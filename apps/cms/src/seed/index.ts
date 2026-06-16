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

const ol = (items: string[]): any => ({
  type: 'list',
  format: 'ordered',
  children: items.map((text) => ({
    type: 'list-item',
    children: [{ type: 'text', text }],
  })),
});

// inline node yardımcıları (zengin paragraf: link + bold + kod)
const t = (text: string): any => ({ type: 'text', text });
const b = (text: string): any => ({ type: 'text', text, bold: true });
const code = (text: string): any => ({ type: 'text', text, code: true });
const a = (text: string, url: string): any => ({
  type: 'link',
  url,
  children: [{ type: 'text', text }],
});
const pr = (...children: any[]): any => ({ type: 'paragraph', children });

// statik web görseli (/img/...) — Strapi medya değil, public asset
const img = (url: string, alt: string, caption?: string): any => ({
  type: 'image',
  image: { url, alternativeText: alt, ...(caption ? { caption } : {}) },
});

// gerçek <table> render eden özel blocks node'u (BlocksRenderer'da case 'table')
const table = (headers: string[], rows: string[][]): any => ({ type: 'table', headers, rows });

/* --------------------------------- içerik --------------------------------- */

const FORMUL_ACIKLAMASI = [
  pr(
    b('EOQ hesaplama'),
    t(
      ', bir ürünü her seferinde kaç adet sipariş etmen gerektiğini bulan klasik stok yönetimi yöntemidir. Amaç basit: çok sık sipariş verirsen sipariş maliyetin (operasyon, nakliye, işçilik) artar; çok seyrek ve büyük sipariş verirsen depoda fazla mal tutarsın ve taşıma maliyetin (depo, sigorta, bağlanan sermaye) şişer. Ekonomik sipariş miktarı (Economic Order Quantity) bu iki maliyetin toplamını en küçük yapan denge noktasıdır.',
    ),
  ),
  h(2, 'EOQ formülü nedir?'),
  p('Ekonomik sipariş miktarı şu formülle bulunur (EOQ formula):'),
  pr(code('EOQ = √(2 × D × S / H)')),
  p(
    'Burada D yıllık talep (adet/yıl), S sipariş başına maliyet, H ise birim başına yıllık taşıma maliyetidir. Formülün sonucu, sipariş ve taşıma maliyetlerinin tam olarak eşitlendiği sipariş büyüklüğüdür.',
  ),
  h(2, 'Aracı nasıl kullanırım?'),
  p('Üç değeri girmen yeterli:'),
  table(
    ['Girdi', 'Anlamı', 'Örnek'],
    [
      ['Yıllık talep (D)', 'Bir yılda satılan/kullanılan adet', '1000 adet'],
      ['Sipariş maliyeti (S)', 'Her sipariş için sabit maliyet', '100 TL'],
      ['Taşıma maliyeti (H)', 'Birim başına yıllık stok tutma maliyeti', '5 TL'],
    ],
  ),
  p(
    'Bu örnekte araç EOQ değerini 200 adet, yıllık sipariş sayısını 5, toplam yıllık maliyeti ise 1.000 TL olarak verir. Sonuç ekranındaki maliyet eğrisi grafiği, sipariş ve taşıma maliyetlerinin nasıl kesiştiğini görsel olarak gösterir.',
  ),
  h(2, 'Sonucu nasıl yorumlamalısın?'),
  p(
    'EOQ bir başlangıç noktasıdır, kutsal bir sayı değil. Çıkan değeri tedarikçinin minimum sipariş adedi, kutu/paket katları ve nakit akışınla birlikte değerlendir. EOQ talebin sabit ve bilindiğini, maliyetlerin değişmediğini varsayar; talebin dalgalıysa EOQ değerini emniyet stoğu ile birlikte kullanman gerekir.',
  ),
  pr(
    t('Yöntemin mantığını, varsayımlarını ve adım adım örneğini derinlemesine anlatan rehber için '),
    a('EOQ nedir? Ekonomik sipariş miktarı rehberi', '/icerik/eoq-nedir'),
    t(' yazısına bakabilirsin.'),
  ),
];

const BLOG_ICERIK = [
  pr(
    b('EOQ (Economic Order Quantity, ekonomik sipariş miktarı)'),
    t(
      ', bir ürünü her seferinde kaç adet sipariş edersen toplam stok maliyetinin en düşük olacağını bulan bir stok yönetimi yöntemidir. Türkçe kaynaklarda çoğunlukla yüzeysel anlatılan bu konuyu; formülü, varsayımları ve gerçek bir örnekle bu rehberde net biçimde ele alıyoruz. Yazının sonunda kavramı ',
    ),
    a('EOQ hesaplama aracı', '/araclar/eoq-hesaplama'),
    t(' ile birkaç saniyede uygulamaya dökebilirsin.'),
  ),
  h(2, 'EOQ (ekonomik sipariş miktarı) nedir?'),
  p(
    'EOQ, sipariş verme maliyeti ile stok taşıma maliyetinin toplamını en aza indiren optimum sipariş büyüklüğüdür. Adı "ekonomik" çünkü en ucuz değil, en dengeli noktayı arar. Çok sık küçük siparişler sipariş maliyetini, seyrek büyük siparişler ise depo ve sermaye maliyetini yükseltir; EOQ tam ortadaki dengeyi verir.',
  ),
  h(2, 'EOQ neden önemlidir?'),
  p(
    'İki maliyet kalemi birbirine zıt yönde hareket eder. Sipariş sıklığını artırdığında elinde daha az mal kalır, taşıma maliyeti düşer ama her sipariş ayrı bir operasyon maliyeti doğurur. Sipariş miktarını büyüttüğünde sipariş sayısı azalır, fakat depoda bağlanan sermaye ve fire riski artar. EOQ bu iki eğrinin kesiştiği, toplam maliyetin minimum olduğu noktayı sayısal olarak bulmanı sağlar. Bu yüzden satın alma, üretim planlama ve perakende stok yönetiminin temel taşıdır.',
  ),
  img(
    '/img/eoq-maliyet-grafigi.svg',
    'EOQ maliyet ödünleşme grafiği: sipariş maliyeti azalırken taşıma maliyeti artar; toplam maliyetin en düşük olduğu nokta EOQ değerini verir.',
    'Sipariş ve taşıma maliyetinin kesiştiği nokta toplam maliyeti minimuma indirir; bu nokta EOQ’dur.',
  ),
  h(2, 'EOQ formülü ve değişkenleri nelerdir?'),
  p('Ekonomik sipariş miktarı şu formülle hesaplanır (EOQ formula):'),
  pr(code('EOQ = √(2 × D × S / H)')),
  table(
    ['Değişken', 'Açıklama', 'Birim'],
    [
      ['D', 'Yıllık talep', 'adet/yıl'],
      ['S', 'Sipariş başına sabit maliyet', 'TL/sipariş'],
      ['H', 'Birim başına yıllık taşıma maliyeti', 'TL/adet·yıl'],
    ],
  ),
  p(
    'Taşıma maliyeti H çoğu zaman doğrudan verilmez; birim maliyetin bir yüzdesi olarak (örneğin yıllık %20 sermaye + depo maliyeti) hesaplanır. Bu durumda H = birim maliyet × taşıma oranı olur. Bu kalemi eksik hesaplamak, EOQ’yu olduğundan büyük gösteren en yaygın hatadır.',
  ),
  h(2, 'EOQ nasıl hesaplanır? (adım adım örnek)'),
  p(
    'Bir işletmenin bir ürün için yıllık talebi 1000 adet, her siparişin maliyeti 100 TL, bir birimi bir yıl stokta tutmanın maliyeti 5 TL olsun.',
  ),
  ol([
    'Payı hesapla: 2 × 1000 × 100 = 200.000',
    'Paydaya böl: 200.000 / 5 = 40.000',
    'Karekök al: √40.000 = 200',
  ]),
  p(
    'Sonuç: ekonomik sipariş miktarı 200 adettir. Yıllık sipariş sayısı 1000 / 200 = 5 olur; yani işletme yılda 5 kez 200’er adet sipariş vermelidir. Bu noktada yıllık sipariş maliyeti (5 × 100 = 500 TL) ile yıllık taşıma maliyeti (ortalama stok 100 adet × 5 TL = 500 TL) birbirine eşitlenir ve toplam maliyet 1.000 TL ile minimuma iner. EOQ noktasının ayırt edici özelliği budur: optimumda iki maliyet kalemi her zaman eşittir.',
  ),
  h(2, 'EOQ formülünün varsayımları ve sınırlamaları nelerdir?'),
  p(
    'EOQ güçlü ama varsayımları katı bir modeldir. Talebin yıl boyunca sabit ve bilindiğini, birim fiyatın sipariş miktarından bağımsız olduğunu (miktar iskontosu yok), tedarik süresinin sabit olduğunu ve stoğun anında teslim edildiğini varsayar. Gerçek hayatta talep dalgalanır ve tedarik gecikir; bu yüzden EOQ tek başına yeterli değildir. Talep belirsizliğini yönetmek için EOQ’yu emniyet stoğu ile, sipariş zamanlamasını ise yeniden sipariş noktası ile tamamlaman gerekir.',
  ),
  p(
    'Pratikte bir gözlem: ürün ERP sistemleri kurarken çok işletmenin EOQ’yu hiç kullanmadan, alışkanlıkla "her ay bir kamyon" mantığıyla sipariş verdiğini görüyorum. Oysa basit bir EOQ hesabı çoğu zaman yıllık stok maliyetinin görünür biçimde düşebileceğini gösteriyor; formül akademik değil, doğrudan nakit etkisi olan bir araçtır.',
  ),
  h(2, 'Miktar iskontosu EOQ’yu nasıl değiştirir?'),
  p(
    'Klasik EOQ, birim fiyatın sipariş miktarından bağımsız olduğunu varsayar. Oysa tedarikçiler çoğu zaman belirli adedin üzerinde indirim uygular. Bu durumda yalnızca sipariş ve taşıma maliyetine bakmak yetmez; satın alma maliyetini de hesaba katman gerekir. Pratik yaklaşım şudur: önce klasik EOQ’yu hesapla, sonra indirim eşiklerindeki toplam maliyeti (satın alma + sipariş + taşıma) ayrı ayrı karşılaştır. Bazen indirim eşiğine ulaşmak için EOQ’dan biraz fazla sipariş vermek, toplamda daha ucuza gelir.',
  ),
  h(2, 'EOQ hesaplarken sık yapılan hatalar nelerdir?'),
  p(
    'İlk hata, taşıma maliyetini eksik hesaplamaktır. H yalnızca depo kirası değildir; bağlanan sermayenin fırsat maliyeti, sigorta, fire ve eskime de buna dahildir. İkinci hata, EOQ’yu sabit bir kural gibi kullanmaktır; talep değiştikçe EOQ da değişir, bu yüzden periyodik olarak güncellenmelidir. Üçüncü hata, EOQ’yu emniyet stoğu ve sipariş zamanlamasından kopuk düşünmektir. EOQ tek başına stoksuz kalmayı önlemez; yalnızca sipariş büyüklüğünü optimize eder.',
  ),
  h(2, 'Sıradaki adım'),
  pr(
    t(
      'EOQ ne kadar sipariş vereceğini söyler; ne zaman sipariş vereceğini değil. Talebin dalgalıysa bu değeri emniyet stoğu ve yeniden sipariş noktası ile tamamlaman gerekir. Kendi rakamlarını denemek için ',
    ),
    a('EOQ hesaplama aracını', '/araclar/eoq-hesaplama'),
    t(' kullanabilirsin.'),
  ),
];

const BLOG_SSS = [
  {
    soru: 'EOQ açılımı nedir? (What does EOQ mean?)',
    cevap:
      'EOQ, "Economic Order Quantity" yani ekonomik sipariş miktarı anlamına gelir. Toplam stok maliyetini en aza indiren optimum sipariş büyüklüğünü ifade eder.',
  },
  {
    soru: 'EOQ formülü nedir?',
    cevap:
      'EOQ = √(2DS/H); burada D yıllık talep, S sipariş maliyeti, H birim yıllık taşıma maliyetidir.',
  },
  {
    soru: 'EOQ ne işe yarar?',
    cevap:
      'Sipariş ve taşıma maliyetlerinin toplamını en aza indiren optimum sipariş büyüklüğünü bularak stok maliyetini düşürür.',
  },
  {
    soru: 'EOQ ve emniyet stoğu aynı şey mi?',
    cevap:
      'Hayır. EOQ ne kadar sipariş vereceğini, emniyet stoğu ise talep ve tedarik belirsizliğine karşı ne kadar tampon tutman gerektiğini belirler; ikisi birlikte kullanılır.',
  },
  {
    soru: 'EOQ değeri ne sıklıkla güncellenmeli?',
    cevap:
      'EOQ talebe ve maliyetlere bağlıdır; talep, sipariş maliyeti veya taşıma maliyeti belirgin biçimde değiştiğinde yeniden hesaplanmalıdır. Pratikte yılda en az bir kez gözden geçirmek iyi bir alışkanlıktır.',
  },
];

const TOOL_SSS = [
  {
    soru: 'EOQ nasıl hesaplanır?',
    cevap:
      'EOQ, 2 ile yıllık talebi ve sipariş maliyetini çarpıp birim taşıma maliyetine bölerek ve sonucun karekökünü alarak hesaplanır: EOQ = √(2DS/H). Yukarıdaki araca üç değeri girerek sonucu anında alabilirsin.',
  },
  {
    soru: 'EOQ formülündeki D, S ve H ne anlama gelir?',
    cevap:
      'D yıllık toplam talebi (adet), S her bir siparişin sabit maliyetini, H ise bir birimi bir yıl boyunca stokta tutmanın maliyetini ifade eder.',
  },
  {
    soru: 'EOQ her işletme için doğru sonucu verir mi?',
    cevap:
      'EOQ, talebin sabit ve maliyetlerin değişmediği varsayımına dayanır. Talebi dalgalı işletmelerde EOQ’yu emniyet stoğu ve yeniden sipariş noktası ile birlikte kullanmak gerekir.',
  },
  {
    soru: 'EOQ ile sipariş sayısı arasındaki ilişki nedir?',
    cevap:
      'Yıllık sipariş sayısı, yıllık talebin EOQ’ya bölünmesiyle bulunur. EOQ büyüdükçe sipariş sayısı azalır, taşıma maliyeti artar; küçüldükçe tersi olur.',
  },
  {
    soru: 'EOQ hesaplama aracı ücretsiz mi?',
    cevap:
      'Evet. EOQ hesaplama aracı tamamen ücretsizdir, üyelik gerektirmez ve sınırsız kullanılabilir.',
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
      ad: 'Ali',
      unvan: 'METU Endüstri Mühendisliği · Üretim ve yazılım geliştirici',
      bio: 'Endüstri mühendisliği altyapısı ve sahada ERP/üretim sistemi kurma deneyimiyle stok ve üretim yönetimi araçları geliştiriyor. Stokoloji’deki içerik ve hesaplayıcıları akademik teoriyi pratik kararlara çevirmek için yazıyor.',
    },
    status: 'published',
  });

  const tool = await strapi.documents('api::tool.tool').create({
    data: {
      ad: 'EOQ Hesaplama (Ekonomik Sipariş Miktarı)',
      slug: 'eoq-hesaplama',
      kisaAciklama:
        'Yıllık talebini, sipariş başına maliyetini ve birim taşıma maliyetini gir; EOQ hesaplama aracı toplam stok maliyetini en aza indiren optimum sipariş miktarını anında versin.',
      formulAciklamasi: FORMUL_ACIKLAMASI,
      seo: {
        title: 'EOQ Hesaplama Aracı: Ekonomik Sipariş Miktarı [2026]',
        description:
          'Ücretsiz EOQ hesaplama aracı ile ekonomik sipariş miktarını saniyede bul. Yıllık talep, sipariş ve taşıma maliyetini gir, optimum sipariş büyüklüğünü gör.',
      },
      kategori: kategori.documentId,
      sss: TOOL_SSS,
    },
    status: 'published',
  });

  const blog = await strapi.documents('api::blog.blog').create({
    data: {
      baslik: 'EOQ Nedir? Ekonomik Sipariş Miktarı Formülü ve Hesaplama [2026]',
      slug: 'eoq-nedir',
      icerik: BLOG_ICERIK,
      seo: {
        title: 'EOQ Nedir? Ekonomik Sipariş Miktarı Formülü [2026]',
        description:
          'EOQ (ekonomik sipariş miktarı) nedir, formülü nasıl uygulanır, örnekle adım adım hesaplama ve varsayımları. Stok maliyetini düşüren sipariş büyüklüğü rehberi.',
      },
      kategori: kategori.documentId,
      yazar: yazar.documentId,
      iliskiliTool: tool.documentId,
      sss: BLOG_SSS,
      yayinTarihi: '2026-01-15T09:00:00.000Z',
      guncellemeTarihi: '2026-06-16T09:00:00.000Z',
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

/* ----------------------- stok devir hızı içeriği ----------------------- */

const SDH_FORMUL = [
  h(2, 'Stok devir hızı formülü nedir?'),
  p(
    'Stok devir hızı, işletmenin stoğunu bir dönemde kaç kez sattığını ve yenilediğini ölçer. Şu formülle hesaplanır:',
  ),
  p('Stok Devir Hızı = Satılan Malların Maliyeti (SMM) / Ortalama Stok'),
  p('Ortalama Stok = (Dönem Başı Stok + Dönem Sonu Stok) / 2'),
  h(3, 'Değişkenler'),
  ul([
    'SMM — Dönemde satılan malların maliyeti (₺)',
    'Dönem başı stok — Dönem başındaki stok değeri (₺)',
    'Dönem sonu stok — Dönem sonundaki stok değeri (₺)',
  ]),
  p(
    'Pay olarak ciro değil SMM kullanılır; ciro kâr marjı içerdiği için oranı yanıltıcı yükseltir. Stokta kalma süresi ise 365 günün devir hızına bölünmesiyle bulunur.',
  ),
];

const SDH_BLOG = [
  p(
    'Stok devir hızı, bir işletmenin stoğunu bir dönemde kaç kez sattığını ve yenilediğini gösteren orandır. Stoğunun ne kadar verimli döndüğünü, nakitinin ne kadar süre rafta beklediğini tek bir sayıyla özetler.',
  ),
  h(2, 'Stok devir hızı nasıl hesaplanır?'),
  p(
    'Satılan malların maliyeti (SMM), dönem başı ve dönem sonu stoğun ortalamasına bölünür: SDH = SMM / Ortalama Stok. Örneğin SMM 2.000.000 TL, ortalama stok 350.000 TL ise devir hızı 5,71 olur; bu da stoğun yılda yaklaşık altı kez döndüğü anlamına gelir.',
  ),
  h(2, 'Stok devir hızı kaç olmalı?'),
  p(
    'Tek bir ideal değer yoktur, sektöre göre değişir. Genel kural olarak 4-6 dengeli kabul edilir; markette 8-12, elektronikte 4-8, dayanıklı tüketimde 2-5 tipiktir. Asıl kıyas kendi geçmiş dönemlerin ve sektör rakiplerindir.',
  ),
  h(2, 'Yüksek mi iyi düşük mü?'),
  ul([
    'Yüksek devir: nakit hızlı döner, depolama maliyeti düşer; ama aşırı yüksekse stoksuz kalma riski artar.',
    'Düşük devir: sermaye stokta bağlanır, eskime ve fire riski yükselir.',
    'Devir hızını her zaman servis seviyesiyle birlikte oku.',
  ]),
  p(
    'Stok devir hızı stoğunun ne kadar verimli döndüğünü söyler; ne kadar ve ne zaman sipariş vereceğini ise EOQ, emniyet stoğu ve yeniden sipariş noktası belirler.',
  ),
];

const SDH_SSS = [
  {
    soru: 'Stok devir hızı nasıl hesaplanır?',
    cevap:
      'Satılan malların maliyeti (SMM), ortalama stoğa bölünür: SDH = SMM / Ortalama Stok. Ortalama stok, dönem başı ve dönem sonu stoğun ortalamasıdır.',
  },
  {
    soru: 'Stok devir hızı kaç olmalı?',
    cevap:
      'Sektöre göre değişir; genel kural olarak 4-6 dengeli kabul edilir. Markette 8-12, elektronikte 4-8, dayanıklı tüketimde 2-5 tipiktir.',
  },
  {
    soru: 'Stokta kalma süresi nasıl bulunur?',
    cevap:
      '365 günü stok devir hızına bölersin. Devir hızı 5 olan bir işletmede ortalama stokta kalma süresi 73 gündür.',
  },
];

/**
 * Stok devir hızı tool + blog içeriğini seed'ler (idempotent — kendi slug'ına
 * guard'lı, EOQ seed'inden bağımsız çalışır). Mevcut "Stok Yönetimi" kategorisi
 * ile editör yazarını yeniden kullanır; yoksa oluşturur.
 */
export async function seedStokDevirHizi(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'stok-devir-hizi-hesaplama' },
  });
  if (existing) {
    strapi.log.info('[seed] Stok devir hızı içeriği zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Stok devir hızı içeriği oluşturuluyor...');

  const kategori =
    (await strapi.documents('api::kategori.kategori').findFirst({
      filters: { slug: 'stok-yonetimi' },
    })) ??
    (await strapi.documents('api::kategori.kategori').create({
      data: { ad: 'Stok Yönetimi', slug: 'stok-yonetimi' },
      status: 'published',
    }));

  const yazar =
    (await strapi.documents('api::yazar.yazar').findFirst()) ??
    (await strapi.documents('api::yazar.yazar').create({
      data: {
        ad: 'Stokoloji Editör Ekibi',
        unvan: 'Stok & Tedarik Zinciri',
        bio: 'Stok yönetimi ve operasyon araçları üzerine içerik üreten editör ekibi.',
      },
      status: 'published',
    }));

  const tool = await strapi.documents('api::tool.tool').create({
    data: {
      ad: 'Stok Devir Hızı Hesaplama',
      slug: 'stok-devir-hizi-hesaplama',
      kisaAciklama:
        'Stok devir hızını saniyeler içinde hesaplayın: SMM, dönem başı ve dönem sonu stoğunu girin, stoğunuzu dönemde kaç kez döndürdüğünüzü ve stokta kalma süresini öğrenin.',
      formulAciklamasi: SDH_FORMUL,
      seo: {
        title: 'Stok Devir Hızı Hesaplama Aracı | Stokoloji',
        description:
          'Ücretsiz stok devir hızı hesaplama aracı. SMM, dönem başı ve dönem sonu stoğu girin; devir hızını ve stokta kalma süresini anında hesaplayın.',
      },
      kategori: kategori.documentId,
      sss: SDH_SSS,
    },
    status: 'published',
  });

  const blog = await strapi.documents('api::blog.blog').create({
    data: {
      baslik: 'Stok Devir Hızı Nedir? Formülü ve Nasıl Hesaplanır',
      slug: 'stok-devir-hizi-nedir',
      icerik: SDH_BLOG,
      seo: {
        title: 'Stok Devir Hızı Nedir? Formülü ve Hesaplama',
        description:
          'Stok devir hızı nedir, formülü nasıl uygulanır, kaç olmalı ve nasıl yorumlanır? Sektör ortalamaları ve işlenmiş örnekle adım adım rehber.',
      },
      kategori: kategori.documentId,
      yazar: yazar.documentId,
      iliskiliTool: tool.documentId,
      yayinTarihi: '2026-06-16T09:00:00.000Z',
      guncellemeTarihi: '2026-06-16T09:00:00.000Z',
    },
    status: 'published',
  });

  await strapi.documents('api::tool.tool').update({
    documentId: tool.documentId,
    data: { iliskiliYazilar: [blog.documentId] },
    status: 'published',
  });

  strapi.log.info('[seed] Stok devir hızı içeriği başarıyla oluşturuldu.');
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

/**
 * Varsayılan duyuru barını seed'ler (idempotent — kayıt varsa atlar).
 *
 * Fresh kurulumda en üstteki utility bar dolu gelsin diye tek aktif kayıt
 * oluşturur. Panelden ek duyurular eklenip `aktif` ile açılıp kapatılabilir;
 * birden fazla aktif olursa web en düşük `sira`'lı kaydı gösterir.
 */
export async function seedDuyuru(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::duyuru.duyuru').findFirst();
  if (existing) {
    strapi.log.info('[seed] Duyuru kaydı zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Duyuru kaydı oluşturuluyor...');

  await strapi.documents('api::duyuru.duyuru').create({
    data: {
      mesaj: 'Ücretsiz Excel stok takip şablonunu indir.',
      ctaLabel: 'Hemen al',
      ctaHref: '/#lead',
      ikon: 'sheet',
      aktif: true,
      sira: 0,
    },
    status: 'published',
  });

  strapi.log.info('[seed] Duyuru kaydı başarıyla oluşturuldu.');
}
