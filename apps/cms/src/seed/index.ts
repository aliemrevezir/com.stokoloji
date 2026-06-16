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

// display formül bloğu — BlocksRenderer `code` bloğu olarak basılır: backslash'lı
// içerik (gerçek LaTeX) → KaTeX ile dizilir; düz metin (kelimeli formül) → şık formül
// kartı. Tek başına satır olan formüller için kullanılır (inline `code` taklit DEĞİL).
const fx = (latex: string): any => ({ type: 'code', children: [{ type: 'text', text: latex }] });

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
  fx('EOQ = \\sqrt{\\dfrac{2 \\times D \\times S}{H}}'),
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
  fx('EOQ = \\sqrt{\\dfrac{2 \\times D \\times S}{H}}'),
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

export const BLOG_SSS = [
  {
    soru: 'EOQ açılımı nedir? (What does EOQ mean?)',
    cevap:
      'EOQ, "Economic Order Quantity" yani ekonomik sipariş miktarı anlamına gelir. Toplam stok maliyetini en aza indiren optimum sipariş büyüklüğünü ifade eder.',
  },
  {
    soru: 'EOQ formülü nedir?',
    cevap:
      'EOQ = √(2DS/H); burada D yıllık talep, S sipariş başına maliyet, H ise birim başına yıllık taşıma maliyetidir. Sonuç, sipariş ve taşıma maliyetlerinin eşitlendiği sipariş büyüklüğüdür.',
  },
  {
    soru: 'EOQ hangi iki maliyeti dengeler?',
    cevap:
      'Sipariş verme maliyeti (operasyon, nakliye, işçilik) ile stok taşıma maliyetini (depo, sigorta, bağlanan sermaye) dengeler. Sık sipariş taşıma maliyetini düşürür ama sipariş maliyetini artırır; EOQ ikisinin toplamını en küçük yapan noktadır.',
  },
  {
    soru: 'EOQ formülünün varsayımları nelerdir?',
    cevap:
      'Klasik EOQ; talebin sabit ve bilindiğini, sipariş ve taşıma maliyetlerinin değişmediğini, teslimin anında olduğunu ve stoksuzluğa izin verilmediğini varsayar. Talep dalgalıysa EOQ\'yu emniyet stoğuyla birlikte kullanmak gerekir.',
  },
  {
    soru: 'EOQ ve emniyet stoğu aynı şey mi?',
    cevap:
      'Hayır. EOQ ne kadar sipariş vereceğini, emniyet stoğu ise talep ve tedarik belirsizliğine karşı ne kadar tampon tutman gerektiğini belirler; ikisi birlikte kullanılır.',
  },
  {
    soru: "EOQ Excel'de nasıl hesaplanır?",
    cevap:
      'Yıllık talep, sipariş maliyeti ve birim taşıma maliyetini üç hücreye girip =KAREKÖK((2*talep*sipariş_maliyeti)/taşıma_maliyeti) formülünü yazarsın. Üstteki araç aynı hesabı anında yapıp maliyet eğrisini de gösterir.',
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
      unvan: 'ODTÜ Endüstri Mühendisliği · Üretim ve yazılım geliştirici',
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
  pr(
    b('Stok devir hızı (inventory turnover)'),
    t(
      ', bir işletmenin stoğunu belirli bir dönemde kaç kez sattığını ve yeniden tazelediğini gösteren temel stok yönetimi oranıdır. Tek bir sayıyla nakitinin ne kadar süre rafta beklediğini, stokta bağlanan sermayenin ne kadar verimli döndüğünü özetler. Bu rehberde stok devir hızının ne olduğunu, formülünü, işlenmiş bir örneğini, sektör ortalamalarını ve sonucu nasıl yorumlayacağını adım adım ele alıyoruz; dilersen önce kendi rakamlarını ',
    ),
    a('stok devir hızı hesaplama aracıyla', '/araclar/stok-devir-hizi-hesaplama'),
    t(' deneyebilirsin.'),
  ),
  h(2, 'Stok devir hızı ne demek?'),
  p(
    'Stok devir hızı, bir dönem boyunca sattığın malların maliyetini o dönemde elinde tuttuğun ortalama stoğa oranlar. Sonuç bir adettir: "stoğumu bu dönemde kaç kez komple sattım ve yeniledim?" sorusunun cevabıdır. İngilizcesi inventory turnover ya da stock turnover olarak geçer. Yüksek bir değer stoğun hızlı döndüğünü, düşük bir değer ise malın rafta uzun süre beklediğini gösterir. Bu oran satın alma, üretim planlama ve perakende stok yönetiminin en çok kullanılan performans göstergelerinden biridir; çünkü hem nakit akışını hem depolama maliyetini hem de eskime riskini aynı anda yansıtır.',
  ),
  h(2, 'Stok devir hızı nasıl hesaplanır? Formülü nedir?'),
  p('Stok devir hızı formülü iki adımdan oluşur:'),
  fx('Stok Devir Hızı = Satılan Malların Maliyeti (SMM) / Ortalama Stok'),
  fx('Ortalama Stok = (Dönem Başı Stok + Dönem Sonu Stok) / 2'),
  p(
    'Paya ciro değil satılan malların maliyetini (SMM) yazman kritiktir. Ciro kâr marjını da içerdiği için oranı yapay olarak yükseltir ve stoğunu olduğundan verimli gösterir. Hem pay hem payda maliyet bazında olunca oran tutarlı kalır. Formülün değişkenleri şöyledir:',
  ),
  table(
    ['Değişken', 'Anlamı', 'Birim'],
    [
      ['SMM', 'Dönemde satılan malların maliyeti', '₺'],
      ['Dönem başı stok', 'Dönemin başındaki stok değeri', '₺'],
      ['Dönem sonu stok', 'Dönemin sonundaki stok değeri', '₺'],
      ['Ortalama stok', '(Dönem başı + dönem sonu) / 2', '₺'],
    ],
  ),
  h(2, 'Stok devir hızı hesaplama örneği'),
  p(
    'Bir işletmenin yıllık SMM değeri 2.000.000 ₺ olsun. Yıl başında deposunda 300.000 ₺, yıl sonunda 400.000 ₺ değerinde stok bulunuyor. Hesabı adım adım yapalım:',
  ),
  table(
    ['Adım', 'İşlem', 'Sonuç'],
    [
      ['1. Ortalama stok', '(300.000 + 400.000) / 2', '350.000 ₺'],
      ['2. Stok devir hızı', '2.000.000 / 350.000', '5,71'],
      ['3. Stokta kalma süresi', '365 / 5,71', '64 gün'],
    ],
  ),
  p(
    'Sonuç: bu işletme stoğunu yılda yaklaşık 5,71 kez döndürüyor; başka bir deyişle bir ürün depoya girdikten ortalama 64 gün sonra satılıyor. Bu değer tek başına iyi ya da kötü değildir; anlamı sektör ortalaması ve geçmiş dönemlerle kıyaslandığında ortaya çıkar.',
  ),
  h(2, 'Stok devir hızı kaç olmalı? Sektör ortalamaları'),
  p(
    'Tek bir ideal değer yoktur; doğru aralık tamamen sektöre ve iş modeline bağlıdır. Hızlı tüketim ürünlerinde yüksek devir beklenirken, dayanıklı tüketim ve yedek parçada düşük devir normaldir. Aşağıdaki tablo tipik aralıkları hem yıllık devir sayısı hem de ortalama stokta kalma süresi olarak veriyor:',
  ),
  table(
    ['Sektör', 'Tipik devir (yıl)', 'Stokta kalma (gün)'],
    [
      ['Market / hızlı tüketim (FMCG)', '8 - 12', '30 - 45'],
      ['E-ticaret / perakende', '5 - 10', '36 - 73'],
      ['Elektronik', '4 - 8', '45 - 90'],
      ['Üretim / imalat (hammadde)', '4 - 6', '60 - 90'],
      ['Dayanıklı tüketim / mobilya', '2 - 5', '73 - 180'],
      ['Yedek parça / ağır sanayi', '1 - 3', '120 - 365'],
    ],
  ),
  p(
    'Bu aralıkları mutlak doğru değil, başlangıç referansı olarak kullan. Asıl anlamlı kıyas iki yerdedir: kendi geçmiş dönemlerin (devir hızın artıyor mu azalıyor mu) ve doğrudan rakiplerin. Sektör ortalamasının belirgin altındaysan stok yönetiminde iyileştirme alanın var demektir.',
  ),
  h(2, 'Stok devir hızı nasıl yorumlanır? Yüksek mi iyi düşük mü?'),
  ul([
    'Yüksek devir hızı: nakit hızlı döner, depolama ve sigorta maliyeti düşer, eskime riski azalır. Ancak aşırı yüksek değer çoğu zaman stoğu çok ince tuttuğunun işaretidir; stoksuz kalma ve kaçan satış riski artar.',
    'Düşük devir hızı: sermaye stokta bağlanır, depo dolar, fire ve demode olma riski yükselir. Ölü stok ve fazla sipariş çoğu zaman bunun arkasındadır.',
    'Dengeli devir hızı: talebi karşılayacak kadar stok tutarken sermayeyi gereksiz bağlamayan bölgedir; hedef budur.',
  ]),
  p(
    'Devir hızını asla tek başına okuma; her zaman servis seviyesi (talebi karşılama oranı) ile birlikte değerlendir. Yüksek devir, sürekli stoksuz kalarak elde ediliyorsa bu bir başarı değil, gizli bir satış kaybıdır.',
  ),
  h(2, 'Stok devir süresi (stokta kalma süresi) nasıl bulunur?'),
  p(
    'Stok devir hızını güne çevirmek çoğu zaman daha sezgiseldir. Stokta kalma süresi, bir ürünün depoya girdikten sonra ortalama kaç gün satılmadan beklediğini gösterir:',
  ),
  fx('Stokta Kalma Süresi (gün) = 365 / Stok Devir Hızı'),
  p(
    'Devir hızı 5,71 olan örneğimizde stokta kalma süresi 365 / 5,71 = 64 gündür. Bazı kaynaklar yılı 360 gün kabul eder; fark küçüktür, dönemler arasında tutarlı olman yeterlidir.',
  ),
  h(2, 'Stok devir hızı nasıl artırılır?'),
  p('Düşük devir hızını yükseltmek için en çok işe yarayan adımlar şunlardır:'),
  ol([
    'Talep tahminini iyileştir: geçmiş satış verisiyle daha doğru tahmin yap, fazla siparişin önüne geç.',
    'Ölü ve yavaş dönen stoğu temizle: demode ürünleri indirim veya kampanyayla erit, deponun sermaye bağladığı kalemleri azalt.',
    'Sipariş miktarını optimize et: her seferinde ne kadar sipariş vereceğini ekonomik sipariş miktarı ile hesapla.',
    'Tedarik süresini kısalt: daha hızlı ve güvenilir tedarikçilerle çalışıp daha küçük ve sık sipariş ver.',
    'ABC analizi uygula: cironun çoğunu getiren A grubu ürünlere odaklan, C grubunda stoğu minimumda tut.',
  ]),
  h(2, 'Stok devir hızı hesaplarken sık yapılan hatalar'),
  ul([
    'Paya ciro yazmak: SMM yerine satış cirosu kullanmak oranı yapay olarak şişirir. Daima maliyet bazını kullan.',
    'Tek günün stoğunu almak: dönem başı ve dönem sonu ortalamasını kullan; tek bir günün fotoğrafı mevsimsel dalgalanmada yanıltır.',
    'Sektörü görmezden gelmek: 3 değeri bir markette zayıf, ağır sanayide gayet iyi olabilir. Kıyas hep sektör içindir.',
    'Mevsimselliği atlamak: yıllık tek oran yerine çeyreklik bakmak, kampanya ve sezon etkisini gizlemez.',
  ]),
  pr(
    b('Sahadan bir not: '),
    t(
      'Üretim yazılımı geliştirirken çok sayıda işletmenin tek bir "ortalama devir hızı" peşinde koştuğunu, oysa asıl bilginin ürün kırılımında saklı olduğunu gözlemledim. Toplamda 5 görünen devir hızı, A grubu ürünlerde 12, kuyrukta unutulmuş onlarca C kaleminde ise 1 olabilir. Devir hızını tek bir kurumsal sayı yerine ürün veya kategori bazında izlersen, sermayeni hangi rafların kilitlediğini net görürsün; iyileştirme de oradan başlar.',
    ),
  ),
  pr(
    t('Stok devir hızı stoğunun ne kadar verimli döndüğünü söyler; ne kadar ve ne zaman sipariş vereceğini ise '),
    a('ekonomik sipariş miktarı (EOQ)', '/icerik/eoq-nedir'),
    t(' ve yeniden sipariş noktası belirler. Kendi devir hızını saniyeler içinde hesaplamak için '),
    a('stok devir hızı hesaplama aracını', '/araclar/stok-devir-hizi-hesaplama'),
    t(', sipariş miktarını optimize etmek için '),
    a('EOQ hesaplama aracını', '/araclar/eoq-hesaplama'),
    t(' kullanabilirsin.'),
  ),
];

export const SDH_SSS = [
  {
    soru: 'Stok devir hızı nasıl hesaplanır?',
    cevap:
      'Satılan malların maliyeti (SMM), ortalama stoğa bölünür: SDH = SMM / Ortalama Stok. Ortalama stok, dönem başı ve dönem sonu stoğun ortalamasıdır.',
  },
  {
    soru: 'Düşük stok devir hızı ne anlama gelir?',
    cevap:
      'Düşük devir, stoğun yavaş satıldığını ve depoda uzun beklediğini gösterir; fazla stok, bağlanan sermaye, eskime ve depolama maliyeti riski demektir. Talep tahminini, sipariş miktarını (EOQ) ve yavaş hareket eden kalemleri gözden geçirmek gerekir.',
  },
  {
    soru: 'Stok devir hızı kaç olmalı?',
    cevap:
      'Sektöre göre değişir; tek bir ideal değer yoktur. Markette 8-12, e-ticaret/perakendede 5-10, elektronikte 4-8, üretimde 4-6, dayanıklı tüketimde 2-5 tipiktir. Asıl kıyas kendi geçmiş dönemlerin ve sektör rakiplerindir.',
  },
  {
    soru: 'Stok devir hızı yüksek mi iyi düşük mü iyi?',
    cevap:
      'Genelde yüksek devir iyidir: nakit hızlı döner, depolama ve eskime maliyeti düşer. Ancak aşırı yüksek değer stoksuz kalma riskini artırır. Devir hızını her zaman servis seviyesiyle birlikte yorumla.',
  },
  {
    soru: 'Stokta kalma süresi nasıl bulunur?',
    cevap:
      '365 günü stok devir hızına bölersin. Devir hızı 5 olan bir işletmede ortalama stokta kalma süresi 73 gündür; devir hızı 5,71 ise yaklaşık 64 gündür.',
  },
  {
    soru: 'Stok devir hızı ile ciro arasındaki fark nedir?',
    cevap:
      'Ciro satış tutarıdır ve kâr marjını içerir; stok devir hızının payında ise satılan malların maliyeti (SMM) kullanılır. Ciroyla hesaplarsan oran yapay olarak yüksek çıkar ve yanıltır.',
  },
  {
    soru: 'Stok devir hızının İngilizcesi nedir?',
    cevap:
      'Stok devir hızı İngilizcede inventory turnover veya stock turnover ratio olarak geçer. Stokta kalma süresi ise days inventory outstanding (DIO) olarak adlandırılır.',
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
      baslik: 'Stok Devir Hızı Nedir? Formülü, Hesaplama ve Kaç Olmalı',
      slug: 'stok-devir-hizi-nedir',
      icerik: SDH_BLOG,
      seo: {
        title: 'Stok Devir Hızı Nedir? Formülü, Hesaplama ve Kaç Olmalı',
        description:
          'Stok devir hızı nedir, formülü nasıl uygulanır, kaç olmalı ve nasıl yorumlanır? Sektör ortalamaları tablosu, işlenmiş örnek ve stokta kalma süresiyle adım adım rehber.',
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

/* ------------------------------- emniyet stoğu ------------------------------ */

const EMNIYET_BLOG = [
  pr(
    b('Emniyet stoğu (güvenlik stoğu, İngilizcesi safety stock)'),
    t(
      `, talebin veya tedarik süresinin beklenenden sapması durumunda stoksuz kalmamak için elinde tuttuğun ekstra tampon stoktur. Türkçe kaynakların çoğu tek bir formül verip geçer; bu rehberde emniyet stoğunun neden gerekli olduğunu, hangi yöntemlerle hesaplandığını, servis seviyesinin sonucu nasıl değiştirdiğini ve formülü Excel'de adım adım nasıl kuracağını gerçek sayılarla anlatıyorum. Kendi verinle hızlı denemek için `,
    ),
    a('emniyet stoğu hesaplama aracını', '/araclar/emniyet-stogu-hesaplama'),
    t(' da kullanabilirsin.'),
  ),

  h(2, 'Emniyet stoğu nedir?'),
  p(
    `Emniyet stoğu, ortalama talebi karşılamaya yetecek stoğun üzerine eklenen güvenlik payıdır. Talep her zaman ortalamada seyretmez; bazı günler beklenenin üstüne çıkar. Tedarikçi de her zaman söz verdiği günde teslim etmez. Emniyet stoğu bu iki belirsizliğe karşı tampon görevi görür ve müşteriyi "stokta yok" cevabıyla kaybetme riskini azaltır. Kısacası emniyet stoğu, parayla satın aldığın bir güvence payıdır.`,
  ),

  h(3, 'Emniyet stoğu, güvenlik stoğu, safety stock: aynı kavram mı?'),
  p(
    `Evet. "Emniyet stoğu" ve "güvenlik stoğu" aynı kavramın iki Türkçe karşılığıdır; ikisi de İngilizcedeki safety stock teriminin çevirisidir. Akademik ve kurumsal kaynaklarda çoğunlukla emniyet stoğu kullanılır, perakende ve POS yazılımlarında ise güvenlik stoğu daha sık geçer. Bu yazıda ikisini eş anlamlı kullanıyorum.`,
  ),

  h(2, 'Emniyet stoğuna neden ihtiyaç var?'),
  p('Emniyet stoğu ihtiyacını doğuran iki ayrı belirsizlik kaynağı vardır.'),
  h(3, 'Talep belirsizliği'),
  p(
    `Birinci kaynak talep belirsizliğidir: bir kampanya, sezon etkisi ya da beklenmedik toplu sipariş talebi yukarı çeker. Sattığın miktar günden güne ne kadar dalgalanıyorsa, ortalamaya göre verdiğin sipariş o kadar yetersiz kalma riski taşır.`,
  ),
  h(3, 'Tedarik süresi belirsizliği'),
  p(
    `İkinci kaynak tedarik süresi belirsizliğidir: tedarikçi gecikir, gümrükte bekleme olur, üretim aksar. Sipariş ettiğin mal gelene kadar geçen sürede ortalamanın üstündeki her talep, emniyet stoğun yoksa doğrudan kayıp satıştır. Tampon stok, bu riskin maliyetini önceden ve kontrollü biçimde üstlenmeni sağlar.`,
  ),
  img(
    '/uploads/emniyet_stogu_1.jpg',
    'Emniyet stoğu tampon grafiği: ortalama talep, tedarik süresi penceresi ve güvenlik stoğu tampon bandı',
    'Tedarik süresi boyunca ortalamanın üstündeki talebi karşılayan emniyet stoğu tampon bölgesi',
  ),

  h(2, 'Emniyet stoğu nasıl hesaplanır?'),
  p(
    'Emniyet stoğunu hesaplamanın birkaç yöntemi vardır. Önce hızlı ama kaba olanlardan, sonra tercih edilen istatistiksel yönteme geçelim.',
  ),
  h(3, 'Basit yöntemler ve neden aşırı stok önerir'),
  h(4, 'Güvenlik günü yöntemi'),
  p('En kaba yaklaşım, "kaç günlük ekstra stok tutayım" mantığıdır:'),
  fx('Emniyet Stoğu = Ortalama Günlük Talep × Güvenlik Günü'),
  p(
    `Hızlıdır ve istatistik gerektirmez; ama güvenlik gününü neye göre seçtiğin belirsizdir, bu yüzden çoğu zaman ya çok fazla ya çok az stok önerir.`,
  ),
  h(4, 'Ortalama-maksimum yöntemi'),
  p('İkinci basit yöntem en kötü senaryoyu temel alır:'),
  fx('Emniyet Stoğu = (Maks. Günlük Talep × Maks. Tedarik Süresi) − (Ort. Günlük Talep × Ort. Tedarik Süresi)'),
  p(
    `Bu yöntem geçmişteki uç değerleri koruduğu için güvenli görünür, ancak nadiren yaşanan en kötü günü kural haline getirdiğinden genellikle gereğinden fazla stok bağlar ve sermaye maliyetini şişirir.`,
  ),
  h(3, 'İstatistiksel (servis seviyeli) yöntem'),
  p(
    `Pratikte tercih edilen yöntem, "ne kadar risk almak istiyorum" sorusunu sayıya çeviren istatistiksel formüldür:`,
  ),
  fx('SS = Z \\times \\sigma_d \\times \\sqrt{L}'),
  p(
    `Burada Z hedef servis seviyesine karşılık gelen güven katsayısı, σ_d günlük talebin standart sapması (dalgalanması), L ise tedarik süresidir (gün). Bu formül, talebin normal dağıldığı varsayımıyla, almak istediğin riski doğrudan stok miktarına bağladığı için yaygın kabul görür.`,
  ),
  h(4, 'Talebin standart sapması (σ_d) veriden nasıl bulunur'),
  pr(
    t(
      `Formülün en çok atlanan parçası σ_d değeridir. Standart sapma, günlük satışlarının ortalamadan ne kadar saptığını ölçer. Geçmiş satış verin varsa Excel veya Google Sheets'te tek fonksiyonla bulabilirsin: günlük satış rakamlarını bir sütuna yaz, boş bir hücreye `,
    ),
    code('=STDEV.S(A2:A31)'),
    t(
      ' yaz. Bu sana son 30 günün talep standart sapmasını verir. Standart sapma büyüdükçe talep daha düzensiz demektir ve formül daha büyük bir tampon önerir.',
    ),
  ),
  h(3, 'Servis seviyesi, Z katsayısı ve fill rate'),
  p(
    `Servis seviyesi, "talebi karşılayamama riskini ne kadar düşük tutmak istiyorum" sorusunun cevabıdır ve doğrudan Z katsayısını belirler.`,
  ),
  h(4, 'Genişletilmiş servis seviyesi ve Z tablosu'),
  table(
    ['Servis seviyesi', 'Z katsayısı', 'Anlamı'],
    [
      ['%50', '0,00', 'Tampon yok, salt ortalamaya güven'],
      ['%85', '1,04', 'Düşük öncelikli kalemler'],
      ['%90', '1,28', '10 dönemde yaklaşık 1 stoksuzluk riski'],
      ['%95', '1,65', 'Çoğu işletme için dengeli tercih'],
      ['%97,5', '1,96', 'Yüksek öncelikli kalemler'],
      ['%98', '2,05', 'Kritik ürünler için yüksek güvence'],
      ['%99', '2,33', 'Stoksuzluğun çok maliyetli olduğu durumlar'],
      ['%99,9', '3,09', 'Neredeyse hiç stoksuz kalmama hedefi'],
    ],
  ),
  p(
    `Servis seviyesini %95'ten %99'a çıkarmak kulağa küçük gelir; ama Z'yi 1,65'ten 2,33'e taşır, yani emniyet stoğunu yaklaşık %40 artırır. Bu yüzden tüm ürünlere aynı yüksek servis seviyesini uygulamak pahalı bir hatadır.`,
  ),
  img(
    '/uploads/emniyet_stogu_2.jpg',
    'Servis seviyesi ve Z katsayısı: normal dağılım eğrisinde sağ kuyruğun taralı gösterimi',
    'Servis seviyesi yükseldikçe Z katsayısı ve gereken emniyet stoğu artar',
  ),
  h(4, 'Servis seviyesi mi, fill rate mı?'),
  p(
    `Burada sık karışan iki ölçüt var. Yukarıdaki tabloda kullandığımız döngü servis seviyesi (cycle service level), bir sipariş döngüsünde hiç stoksuz kalmama olasılığıdır. Fill rate (talep karşılama oranı) ise toplam talebin yüzde kaçını stoktan karşıladığındır. İkisi aynı değildir: bir ürün döngülerin sadece %90'ında stoksuz kalmasa bile, talebin %98'ini karşılıyor olabilir. Pratikte çoğu işletme için döngü servis seviyesiyle başlamak yeterli bir temel verir.`,
  ),

  h(2, 'Hangi formülü ne zaman kullanmalı?'),
  p(
    'Yukarıdaki temel formül yalnızca talep dalgalanmasını hesaba katar. Gerçekte hangi belirsizliğin baskın olduğuna göre formül değişir.',
  ),
  h(3, 'Sadece talep belirsizliği'),
  p('Tedarik süren neredeyse sabitse (tedarikçi her zaman aynı günde teslim ediyorsa) temel formül yeterlidir:'),
  fx('SS = Z \\times \\sigma_d \\times \\sqrt{L}'),
  h(3, 'Sadece tedarik süresi belirsizliği'),
  p('Talebin oldukça istikrarlı ama tedarik sürenin oynak olduğu durumda belirsizliği tedarik süresinin standart sapması taşır:'),
  fx('SS = Z \\times \\sigma_L \\times D_{ort}'),
  p(
    `Burada σ_L tedarik süresinin standart sapması, D_ort ortalama günlük taleptir. Türkçe kaynakların çoğu bu varyantı atlar; oysa ithalata bağlı işlerde baskın belirsizlik çoğu zaman budur.`,
  ),
  h(3, 'İleri seviye: kombine belirsizlik (King 2011)'),
  p('Hem talep hem tedarik süresi dalgalanıyorsa iki belirsizliği birlikte modellemek gerekir. King (2011) tarafından verilen kombine formül şudur:'),
  fx('SS = Z \\times \\sqrt{(L \\times \\sigma_d^2) + (\\sigma_L \\times D_{ort})^2}'),
  p(
    `Dikkat edilmesi gereken nokta şu: iki belirsizlik birlikte hesaplandığında toplam emniyet stoğu, ikisini ayrı ayrı bulup toplamaktan daha düşük çıkar; çünkü varyanslar karekök içinde birleşir. İki riski ayrı ayrı toplamak yaygın ve pahalı bir hatadır. Çoğu işletme için ilk adımda servis seviyeli temel formül yeterli bir başlangıçtır; veri biriktikçe model bu kombine biçime rafine edilir.`,
  ),

  h(2, "Adım adım örnek: emniyet stoğunu Excel'de hesaplama"),
  pr(
    t('Bir ürünü ele alalım. Son 30 günün satışından '),
    code('=STDEV.S(...)'),
    t(
      ' ile günlük talep standart sapmasını 20 adet bulduğunu, tedarik süresinin 9 gün ve hedef servis seviyesinin %95 (Z = 1,65) olduğunu varsayalım.',
    ),
  ),
  fx('SS = 1{,}65 \\times 20 \\times \\sqrt{9} = 1{,}65 \\times 20 \\times 3 = 99 \\text{ adet}'),
  p(
    `Yani işletme, ortalama talebi karşılayan stoğun üzerine yaklaşık 100 adet tampon tutarsa, dönemlerin %95'inde stoksuz kalmaz.`,
  ),
  h(3, 'Excel ve Sheets şablonuyla hesaplama'),
  pr(
    t('Aynı hesabı tekrar tekrar yapmak yerine hazır bir şablon kullanabilirsin: bir sütuna günlük satışları gir, '),
    code('STDEV.S'),
    t(' ile σ_d değerini, ardından '),
    code('=Z*σ*KAREKÖK(L)'),
    t(' ile emniyet stoğunu otomatik hesaplat. Hazırladığımız '),
    b('emniyet stoğu Excel şablonunu'),
    t(' indirip kendi rakamlarınla doldurabilir, anında sonucu görebilirsin. '),
    a('Şablonu indir', '/araclar/emniyet-stogu-hesaplama'),
    t(' ve interaktif hesaplayıcıyla karşılaştır.'),
  ),

  h(2, 'Emniyet stoğu ile yeniden sipariş noktası ilişkisi'),
  p(
    `Emniyet stoğu tek başına "ne zaman sipariş vereceğim" sorusunu cevaplamaz; o sorunun cevabı yeniden sipariş noktasıdır (ROP) ve emniyet stoğunu doğrudan içerir:`,
  ),
  fx('Yeniden Sipariş Noktası = (Ortalama Günlük Talep × Tedarik Süresi) + Emniyet Stoğu'),
  pr(
    t(`Yani emniyet stoğu, ROP'un bir bileşenidir. Sipariş tetikleme seviyeni kurmak için `),
    a('yeniden sipariş noktası nedir', '/icerik/yeniden-siparis-noktasi-nedir'),
    t(' yazısına ve '),
    a('yeniden sipariş noktası hesaplama', '/araclar/yeniden-siparis-noktasi-hesaplama'),
    t(' aracına geçebilirsin.'),
  ),

  h(2, 'Emniyet stoğunu etkileyen faktörler ve nasıl azaltılır?'),
  p(
    `Emniyet stoğu ihtiyacın üç değişkene bağlıdır. Birincisi talep dalgalanması (σ_d): satışların ne kadar değişkense tampon o kadar büyür. İkincisi tedarik süresi (L): süre uzadıkça belirsizliğe açık pencere genişler ve formüldeki √L terimi yükselir. Üçüncüsü hedef servis seviyesi (Z): ne kadar yüksek güvence istersen o kadar fazla stok bağlarsın.`,
  ),
  p(
    `Bu üç değişken aynı zamanda emniyet stoğunu azaltmanın da kaldıraçlarıdır. Tedarik süresini kısaltmak (yakın tedarikçi, daha sık sipariş), talep tahminini iyileştirerek dalgalanmayı düşürmek ve tedarikçi güvenilirliğini artırmak gereken tamponu doğrudan küçültür. Aynı servis seviyesini daha az stokla tutmanın yolu budur.`,
  ),

  h(2, 'Sık yapılan 5 hata'),
  ol([
    'Tek "kaç günlük stok" kuralı. Dalgalanması yüksek bir ürünle istikrarlı satan bir ürüne aynı tamponu uygulamak; biri sürekli stoksuz kalırken diğeri depoda para bağlar.',
    'Servis seviyesini her kaleme aynı uygulamak. A sınıfı (yüksek ciro) ürünlere %98-99, C sınıfı ürünlere %85-90 servis seviyesi mantıklıdır; bunu ABC analiziyle birleştirmek bütçeyi doğru yere koyar.',
    'σ yerine ortalama kullanmak. Formül standart sapma ister; ortalama talebi koymak emniyet stoğunu tamamen anlamsızlaştırır.',
    'Birim tutarsızlığı. σ_d günlükse tedarik süresi de gün cinsinden olmalı; gün ile haftayı karıştırmak sonucu katlar.',
    'Tedarik süresi belirsizliğini ihmal. İthalata bağlı işlerde baskın risk tedarik süresidir; yalnız talep formülü kullanmak ciddi şekilde eksik tampon verir.',
  ]),
  p(
    `Ürün stok sistemleri üzerinde çalışırken en sık gördüğüm hata birincisidir: tek bir kuralla tüm kataloğa aynı tamponu uygulamak. Servis seviyesini ürünün ciro sınıfına göre ayarlamak hem maliyeti hem stoksuzluk riskini birlikte optimize eder.`,
  ),

  h(2, 'İleri kavram: DDMRP dinamik tamponları'),
  p(
    `Klasik emniyet stoğu statiktir: kalem başına bir kez tanımlanır ve çoğu zaman güncellenmeden kalır. Demand Driven MRP (DDMRP) yaklaşımı buna alternatif olarak dinamik tamponlar kullanır; tampon seviyeleri gerçek tüketime göre sürekli güncellenir ve renk bölgeleriyle (yeşil, sarı, kırmızı) yönetilir. Birçok kalemli, oynak talepli işletmelerde statik emniyet stoğunun zayıf kaldığı yerde DDMRP daha esnek bir koruma sağlar. Çoğu KOBİ için başlangıç noktası yine de servis seviyeli emniyet stoğudur; DDMRP olgunlaşmış bir sonraki adımdır.`,
  ),

  pr(
    b('Kaynak: '),
    t('King, P. L. (2011). "Crack the Code: Understanding safety stock and mastering its equations." APICS Magazine. '),
    a('web.mit.edu/2.810/www/files/readings/King_SafetyStock.pdf', 'https://web.mit.edu/2.810/www/files/readings/King_SafetyStock.pdf'),
  ),
];

export const EMNIYET_SSS = [
  {
    soru: 'Emniyet stoğu ile güvenlik stoğu aynı şey mi?',
    cevap:
      'Evet, ikisi de aynı kavramın Türkçe karşılığıdır; İngilizcesi "safety stock"tur. Emniyet stoğu daha çok akademik, güvenlik stoğu daha çok perakende dilinde kullanılır.',
  },
  {
    soru: 'Emniyet stoğu kaç günlük olmalı?',
    cevap:
      'Sabit bir gün sayısı yoktur; tedarik süresine ve talep dalgalanmasına bağlıdır. Pratik bir başlangıç olarak yerli tedarikçide 3-5 gün, ithal üründe 15-30 gün tutulur; ama doğru değer servis seviyeli formülle (Z × σ_d × √L) ürün bazında hesaplanmalıdır.',
  },
  {
    soru: 'Emniyet stoğu formülü nedir?',
    cevap:
      'İstatistiksel yöntemde SS = Z × σ_d × √L; Z servis seviyesi katsayısı, σ_d günlük talep standart sapması, L tedarik süresidir. Hem talep hem tedarik süresi oynaksa kombine formül kullanılır.',
  },
  {
    soru: 'Emniyet stoğu neden tutulur?',
    cevap:
      'Talep ve tedarik süresindeki belirsizliğe karşı stoksuz kalmamak için tutulur. Tampon olmadan, mal gelene kadar ortalamanın üstündeki her talep kayıp satıştır.',
  },
  {
    soru: "Emniyet stoğu Excel'de nasıl hesaplanır?",
    cevap:
      'Günlük satışları bir sütuna girip =STDEV.S(...) ile standart sapmayı bulursun, sonra Z × σ × KAREKÖK(tedarik süresi) formülüyle emniyet stoğunu hesaplarsın. Hazır şablonu indirip rakamlarını doldurman yeterlidir.',
  },
  {
    soru: 'Servis seviyesi kaç olmalı?',
    cevap:
      'Çoğu işletme için %95 dengeli bir tercihtir. Stoksuzluğun çok maliyetli olduğu kritik ürünlerde %98 veya %99 seçilebilir; düşük öncelikli ürünlerde %85-90 yeterlidir.',
  },
  {
    soru: 'Emniyet stoğu nasıl azaltılır?',
    cevap:
      'Tedarik süresini kısaltmak, talep tahminini iyileştirerek dalgalanmayı düşürmek ve tedarikçi güvenilirliğini artırmak emniyet stoğu ihtiyacını azaltır.',
  },
];

const EMNIYET_TOOL_FORMUL = [
  pr(
    b('Emniyet stoğu hesaplama'),
    t(
      `, talebin ve tedarik süresinin belirsiz olduğu durumlarda stoksuz kalmamak için elinde bulundurman gereken tampon stoğu bulur. Ortalama talebe göre sipariş verirsen, talebin beklenenin üstüne çıktığı veya tedarikçinin geciktiği zamanlarda satışı kaçırırsın. Emniyet stoğu bu riski parayla satın aldığın güvence payıdır. Kavramın derin anlatımı için `,
    ),
    a('emniyet stoğu nedir', '/icerik/emniyet-stogu-nedir'),
    t(' rehberine bakabilirsin.'),
  ),
  h(2, 'Emniyet stoğu formülü nedir?'),
  p('Bu araç istatistiksel (servis seviyeli) yöntemi kullanır:'),
  fx('SS = Z \\times \\sigma_d \\times \\sqrt{L}'),
  p(
    `Burada Z hedef servis seviyesine karşılık gelen güven katsayısı, σ_d günlük talebin standart sapması (dalgalanması), L ise tedarik süresidir (gün). Servis seviyesi yükseldikçe Z büyür ve daha fazla tampon stok gerekir. Hem talebin hem tedarik süresinin oynak olduğu durumlarda iki belirsizliği birleştiren kombine formül kullanılır; bunun ayrıntısı blog rehberinde anlatılır.`,
  ),
  h(2, 'Servis seviyesi ve Z katsayısı'),
  p('Servis seviyesi, "talebi karşılayamama riskini ne kadar düşük tutmak istiyorum" sorusunun cevabıdır:'),
  table(
    ['Servis seviyesi', 'Z katsayısı', 'Anlamı'],
    [
      ['%90', '1,28', '10 dönemde yaklaşık 1 stoksuzluk riski'],
      ['%95', '1,65', 'Çoğu işletme için dengeli tercih'],
      ['%97,5', '1,96', 'Yüksek öncelikli kalemler'],
      ['%98', '2,05', 'Kritik ürünler için yüksek güvence'],
      ['%99', '2,33', 'Stoksuzluğun çok maliyetli olduğu durumlar'],
    ],
  ),
  h(2, 'Aracı nasıl kullanırım?'),
  pr(
    t(
      `Üç değeri gir: günlük talep standart sapması (σ_d), tedarik süresi (L, gün) ve hedef servis seviyesi. Standart sapmayı bilmiyorsan geçmiş günlük satışlarından Excel'de `,
    ),
    code('=STDEV.S(...)'),
    t(
      ' ile bulabilirsin. Örneğin günlük talep dalgalanması 20 adet, tedarik süresi 9 gün ve servis seviyesi %95 (Z = 1,65) ise emniyet stoğu 1,65 × 20 × √9 = 1,65 × 20 × 3 = 99 adet çıkar. Aynı hesabı kendi verinle tekrar etmek için ',
    ),
    b('emniyet stoğu Excel şablonunu'),
    t(' indirip doldurabilirsin.'),
  ),
  h(2, 'Sonucu nasıl yorumlamalısın?'),
  pr(
    t(
      `Emniyet stoğu yükseldikçe stoksuz kalma riskin düşer ama bağladığın sermaye ve taşıma maliyetin artar; doğru servis seviyesi bu iki maliyetin dengesidir. A sınıfı (yüksek ciro) ürünlerde yüksek, C sınıfı ürünlerde düşük servis seviyesi mantıklıdır; bu mantık doğrudan ABC analiziyle birleşir. Emniyet stoğunu bulduktan sonra sipariş tetikleme seviyeni kurmak için `,
    ),
    a('yeniden sipariş noktası hesaplama', '/araclar/yeniden-siparis-noktasi-hesaplama'),
    t(' aracına geç; ROP doğrudan emniyet stoğunu içerir. Ne kadar sipariş vereceğini ise '),
    a('EOQ hesaplama', '/araclar/eoq-hesaplama'),
    t(' aracıyla bulabilirsin.'),
  ),
];

const EMNIYET_TOOL_SSS = [
  {
    soru: 'Emniyet stoğu nasıl hesaplanır?',
    cevap: `İstatistiksel yöntemde emniyet stoğu, servis seviyesi katsayısı Z ile günlük talep standart sapması ve tedarik süresinin kareköküyle çarpılarak bulunur: SS = Z × σ_d × √L.`,
  },
  {
    soru: 'Servis seviyesi neyi belirler?',
    cevap: `Servis seviyesi, talebi karşılayabilme olasılığını belirler. %95 servis seviyesi, dönemlerin %95'inde stoksuz kalmamayı hedeflediğin anlamına gelir ve Z katsayısı 1,65'tir.`,
  },
  {
    soru: 'Standart sapmayı (σ_d) nasıl bulurum?',
    cevap: `Geçmiş günlük satışlarını bir sütuna yazıp Excel veya Google Sheets'te =STDEV.S(...) fonksiyonunu kullanarak bulabilirsin. Bu değer talebin günden güne ne kadar dalgalandığını ölçer.`,
  },
  {
    soru: 'Emniyet stoğu çok yüksek olursa ne olur?',
    cevap: `Stoksuz kalma riski düşer ama depoda bağlanan sermaye ve taşıma maliyeti artar. Amaç, hizmet riski ile stok maliyeti arasında denge kurmaktır.`,
  },
  {
    soru: 'Emniyet stoğu ile yeniden sipariş noktası arasındaki ilişki nedir?',
    cevap: `Yeniden sipariş noktası, tedarik süresindeki ortalama talebe emniyet stoğunun eklenmesiyle bulunur; yani emniyet stoğu ROP'un bir bileşenidir.`,
  },
];

/**
 * Container public/uploads içine önceden konmuş bir görsele işaret eden
 * plugin::upload.file kaydı sağlar (idempotent). upload service'in dosya-shape
 * belirsizliğine girmeden, var olan dosyaya media kaydı bağlamak için kullanılır.
 * Dosya kaydı kurulamazsa undefined döner; çağıran kapağı boş bırakıp devam eder.
 */
async function ensureLocalFile(
  strapi: Core.Strapi,
  opts: { url: string; name: string; alt: string; hash: string; size: number; width?: number; height?: number },
): Promise<number | undefined> {
  try {
    const existingFile = await strapi.db
      .query('plugin::upload.file')
      .findOne({ where: { url: opts.url } });
    const file =
      existingFile ??
      (await strapi.db.query('plugin::upload.file').create({
        data: {
          name: opts.name,
          alternativeText: opts.alt,
          hash: opts.hash,
          ext: '.jpg',
          mime: 'image/jpeg',
          size: opts.size,
          width: opts.width ?? 1200,
          height: opts.height ?? 630,
          url: opts.url,
          provider: 'local',
          folderPath: '/',
        },
      }));
    return file?.id;
  } catch (e) {
    strapi.log.warn(`[seed] Görsel kaydı bağlanamadı (${opts.url}): ${e}`);
    return undefined;
  }
}

/**
 * Emniyet stoğu içeriğini seed'ler: blog yazısı + hesaplama tool'u (idempotent;
 * blog ve tool ayrı ayrı guard'lanır, ikisi de varsa atlar). Kapak görselleri
 * container public/uploads'taki dosyalara ensureLocalFile ile bağlanır. Blog ile
 * tool birbirine (iliskiliTool / iliskiliYazilar) ilişkilendirilir.
 */
export async function seedEmniyetStogu(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'emniyet-stogu-nedir' },
  });
  const existingTool = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'emniyet-stogu-hesaplama' },
  });
  if (existing && existingTool) {
    strapi.log.info('[seed] Emniyet stoğu içeriği (blog + tool) zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Emniyet stoğu içeriği oluşturuluyor...');

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

  // --- TOOL ---
  let tool = existingTool;
  if (!tool) {
    const toolKapakId = await ensureLocalFile(strapi, {
      url: '/uploads/emniyet_stogu_tool.jpg',
      name: 'emniyet_stogu_tool.jpg',
      alt: 'Emniyet stoğu hesaplama aracı kapak görseli',
      hash: 'emniyet_stogu_tool_cover_seed',
      size: 280.58,
    });
    tool = await strapi.documents('api::tool.tool').create({
      data: {
        ad: 'Emniyet Stoğu Hesaplama',
        slug: 'emniyet-stogu-hesaplama',
        kisaAciklama:
          'Talep dalgalanmanı, tedarik süreni ve hedef servis seviyeni gir; emniyet stoğu hesaplama aracı stoksuz kalmamak için tutman gereken tampon stoğu Z-skoru yöntemiyle versin.',
        formulAciklamasi: EMNIYET_TOOL_FORMUL,
        ...(toolKapakId ? { kapakGorseli: toolKapakId } : {}),
        seo: {
          title: 'Emniyet Stoğu Hesaplama: Servis Seviyeli Araç [2026]',
          description:
            'Emniyet stoğu hesaplama aracı ile servis seviyesine göre güvenlik stoğunu bul. Talep dalgalanması ve tedarik süresini gir, optimum tampon stoğu ve Z tablosunu gör.',
        },
        kategori: kategori.documentId,
        sss: EMNIYET_TOOL_SSS,
      },
      status: 'published',
    });
    strapi.log.info('[seed] Emniyet stoğu tool kaydı oluşturuldu.');
  }

  // --- BLOG ---
  let blog = existing;
  if (!blog) {
    const kapakId = await ensureLocalFile(strapi, {
      url: '/uploads/emniyet-stogu-nedir.jpg',
      name: 'emniyet-stogu-nedir.jpg',
      alt: 'Emniyet stoğu: talep ve tedarik süresi belirsizliğine karşı güvenlik tamponu',
      hash: 'emniyet_stogu_nedir_cover_seed',
      size: 100.82,
    });
    blog = await strapi.documents('api::blog.blog').create({
      data: {
        baslik: 'Emniyet Stoğu Nedir? Formülü, Servis Seviyesi ve Hesaplama Rehberi [2026]',
        slug: 'emniyet-stogu-nedir',
        icerik: EMNIYET_BLOG,
        ...(kapakId ? { kapakGorseli: kapakId } : {}),
        iliskiliTool: tool.documentId,
        seo: {
          title: 'Emniyet Stoğu Nedir? Formülü ve Hesaplama [2026]',
          description:
            'Emniyet stoğu (güvenlik stoğu) nedir, nasıl hesaplanır? Servis seviyesi, Z-skoru tablosu, Excel ile standart sapma ve formül varyantları. Örnekli tampon stok rehberi.',
        },
        kategori: kategori.documentId,
        yazar: yazar.documentId,
        sss: EMNIYET_SSS,
        yayinTarihi: '2026-06-17T09:00:00.000Z',
        guncellemeTarihi: '2026-06-17T09:00:00.000Z',
      },
      status: 'published',
    });
    strapi.log.info('[seed] Emniyet stoğu blog içeriği oluşturuldu.');
  } else {
    // Blog önceden vardı; tool yeni oluşturulduysa ilişkilendir.
    await strapi.documents('api::blog.blog').update({
      documentId: blog.documentId,
      data: { iliskiliTool: tool.documentId },
      status: 'published',
    });
  }

  // Tool tarafından blog'a ilişki (oneToMany iliskiliYazilar).
  await strapi.documents('api::tool.tool').update({
    documentId: tool.documentId,
    data: { iliskiliYazilar: [blog.documentId] },
    status: 'published',
  });

  strapi.log.info('[seed] Emniyet stoğu içeriği başarıyla oluşturuldu.');
}

/* ----------------------- yeniden sipariş noktası (ROP) ----------------------- */

const ROP_BLOG = [
  pr(
    b('Yeniden sipariş noktası (ROP, İngilizcesi reorder point)'),
    t(
      ', stoğun hangi seviyeye düştüğünde yeni siparişi vermen gerektiğini gösteren stok kontrol eşiğidir. Aynı kavram Türkçe kaynaklarda "sipariş verme noktası", "minimum stok seviyesi" ya da "kritik stok seviyesi" olarak da geçer. EOQ "ne kadar", emniyet stoğu "ne kadar tampon" sorusunu cevaplıyordu; yeniden sipariş noktası ise "ne zaman" sorusunu cevaplar. Bu rehberde ROP\'un formülünü, değişken talep ve tedarik süresinde nasıl hesaplandığını, Excel\'de adım adım örneğini ve EOQ ile emniyet stoğuyla nasıl birleştiğini gerçek sayılarla anlatıyorum. Kendi rakamlarını denemek için ',
    ),
    a('yeniden sipariş noktası hesaplama aracını', '/araclar/yeniden-siparis-noktasi-hesaplama'),
    t(' kullanabilirsin.'),
  ),
  h(2, 'Yeniden sipariş noktası nedir?'),
  p(
    'Yeniden sipariş noktası, sipariş verme alarmını tetikleyen stok seviyesidir. Stok bu seviyeye indiğinde yeni sipariş verirsin; amaç, sipariş ettiğin mal gelene kadar elindeki stoğun tükenmemesidir. Doğru kurulmuş bir ROP, stoksuz kalmayı önlerken gereksiz erken sipariş vermeni de engeller. Modern ERP ve stok yazılımları stok bu eşiğe düştüğünde otomatik uyarı üretir; SAP gibi sistemlerde bu, yeniden sipariş noktası planlaması olarak adlandırılır.',
  ),
  img(
    '/uploads/rop-grafik.jpg',
    'Yeniden sipariş noktası zaman-stok grafiği: stok ROP eşiğine düştüğünde sipariş verilir, tedarik süresi boyunca stok düşmeye devam eder.',
    'Stok yeniden sipariş noktasına (ROP) düştüğünde sipariş verilir; mal tedarik süresi boyunca gelir, emniyet stoğu bu sürede güvence sağlar.',
  ),
  h(3, 'Reorder point, sipariş verme noktası, minimum stok seviyesi: aynı şey mi?'),
  p(
    'Büyük ölçüde evet. "Yeniden sipariş noktası" ve "reorder point" birebir aynı kavramdır; "sipariş verme noktası" da aynı eşiği anlatır. "Minimum stok seviyesi" ve "kritik stok seviyesi" çoğu işletmede ROP ile aynı anlamda kullanılır: stoğun düşmesine izin verdiğin alt sınır. Teknik olarak küçük bir nüans vardır; bazı kaynaklar minimum stok seviyesini doğrudan emniyet stoğu olarak tanımlar. Bu yazıda yeniden sipariş noktasını sipariş tetikleme eşiği anlamında kullanıyorum ve emniyet stoğunu onun bir bileşeni olarak ele alıyorum.',
  ),
  h(2, 'Yeniden sipariş noktası neden önemli?'),
  p(
    'Sipariş zamanlamasını sezgiyle yönetmek iki yönde de hata üretir. ROP bu kararı sayısallaştırır: tedarik süresi boyunca tüketeceğin miktarı ve belirsizlik tamponunu birleştirip net bir tetikleme seviyesi verir.',
  ),
  h(3, 'Erken sipariş verirsen sermaye bağlanır'),
  p(
    'Stok daha yüksekken sipariş verirsen depoda gereksiz mal birikir. Bağlanan sermaye başka bir yerde değerlendirilemez, depo ve sigorta maliyeti artar, fire ve demode olma riski yükselir. Erken sipariş güvenli hissettirir ama parayı rafta tutar.',
  ),
  h(3, 'Geç sipariş verirsen satış kaçar'),
  p(
    'Stok çok düşmeden sipariş vermezsen, sipariş ettiğin mal gelene kadar stoğun biter. Bu durumda yalnız o satışı değil, çoğu zaman müşteriyi de kaybedersin. ROP\'un asıl işi, tedarik süresi boyunca elinde yeterli mal kalmasını garanti altına almaktır.',
  ),
  h(2, 'Yeniden sipariş noktası nasıl hesaplanır?'),
  p(
    'ROP\'un mantığı tek cümleyle özetlenir: mal gelene kadar tüketeceğin ortalama miktarı bul, üzerine belirsizlik tamponunu ekle.',
  ),
  h(3, 'Temel formül'),
  p('Sabit tedarik süresi varsayımıyla yeniden sipariş noktası şu formülle bulunur:'),
  fx('ROP = (Ortalama Günlük Talep × Tedarik Süresi) + Emniyet Stoğu'),
  p(
    'İlk terim tedarik süresi talebidir (lead time demand): sipariş verdiğin andan mal gelene kadar geçen sürede ortalama ne kadar tüketeceğin. İkinci terim emniyet stoğudur: bu süre içinde talebin ortalamayı aşması veya tedarikin gecikmesi ihtimaline karşı tampon.',
  ),
  h(4, 'Emniyet stoğu neden ROP\'un parçası?'),
  pr(
    t(
      'Emniyet stoğunu hesaba katmazsan, ROP yalnız ortalama tüketimi karşılar. Talep tam ortalama gittiği sürece bu yeterlidir; ama gerçek hayatta talebin yarısı ortalamanın üstündedir. Emniyet stoğu olmayan bir ROP, istatistiksel olarak yaklaşık her iki dönemden birinde stoksuzluk üretir. Tampon bileşeni bu yüzden tercih değil, formülün gerçek dünyada işe yaramasının şartıdır. Emniyet stoğunu kendi verinle hesaplamak için ',
    ),
    a('emniyet stoğu hesaplama', '/araclar/emniyet-stogu-hesaplama'),
    t(' aracını kullan.'),
  ),
  h(3, 'Değişken talep ve tedarik süresi: istatistiksel ROP'),
  p(
    'Temel formül, tedarik süresinin sabit olduğunu varsayar. Gerçekte hem talep hem tedarik süresi dalgalanır. Bu durumda emniyet stoğunu sabit bir sayı olarak değil, servis seviyesine bağlı istatistiksel bir değer olarak hesaplarsın ve ROP\'a öyle eklersin:',
  ),
  fx('ROP = (Ortalama Günlük Talep × Tedarik Süresi) + (Z × σ_d × √Tedarik Süresi)'),
  p(
    'Buradaki ikinci terim doğrudan emniyet stoğu formülüdür. Z hedef servis seviyesine karşılık gelen güven katsayısı, σ_d günlük talebin standart sapmasıdır. Yani istatistiksel ROP, tedarik süresi talebinin üstüne servis seviyeli emniyet stoğunu ekler. Servis seviyesini yükselttikçe Z büyür, emniyet stoğu artar ve ROP yukarı çıkar.',
  ),
  h(4, 'Standart sapmadan ROP'),
  pr(
    t(
      'İstatistiksel ROP\'un anahtarı σ_d değeridir. Bunu geçmiş günlük satışlarından bulursun: satış serisini bir sütuna yazıp Excel veya Google Sheets\'te ',
    ),
    code('=STDEV.S(...)'),
    t(
      ' fonksiyonunu kullanırsın. Bu değer talebin günden güne ne kadar dalgalandığını ölçer; ne kadar büyükse o kadar tampon gerekir. Talebin oynaklığını ölçmeden kurulan bir ROP, aslında bir tahminden ibarettir.',
    ),
  ),
  h(3, 'Excel\'de adım adım hesaplama'),
  pr(
    t(
      'ROP\'u Excel\'de kurmak üç sütun ister: ortalama günlük talep, tedarik süresi ve emniyet stoğu. Ortalama talebi ',
    ),
    code('=ORTALAMA(...)'),
    t(', emniyet stoğunu istatistiksel formülle hesaplarsın; ROP hücresi ise '),
    code('=(ortalama_talep*tedarik_suresi)+emniyet_stogu'),
    t(
      ' olur. Aynı tabloyu sıfırdan kurmamak için hazır stok kontrol Excel şablonunu indirip kendi verinle doldurabilirsin.',
    ),
  ),
  h(2, 'Adım adım örnek'),
  p(
    'Bir ürünün ortalama günlük talebi 50 adet, tedarik süresi 9 gün ve emniyet stoğu 99 adet olsun. Önce tedarik süresi talebini bul: 50 × 9 = 450 adet. Üzerine emniyet stoğunu ekle: 450 + 99 = 549 adet. Sonuç: stok 549 adede düştüğünde yeni siparişini vermelisin. Sipariş miktarını ise EOQ belirler; örneğin EOQ 200 ise, stok 549\'a indiğinde 200 adet sipariş verirsin.',
  ),
  table(
    ['Bileşen', 'Hesap', 'Sonuç'],
    [
      ['Tedarik süresi talebi', '50 adet/gün × 9 gün', '450 adet'],
      ['Emniyet stoğu', 'servis seviyeli, ayrı hesaplanır', '99 adet'],
      ['Yeniden sipariş noktası', '450 + 99', '549 adet'],
    ],
  ),
  pr(
    t('Bu örnekteki 99 adetlik emniyet stoğunun nereden geldiğini '),
    a('emniyet stoğu nedir', '/icerik/emniyet-stogu-nedir'),
    t(
      ' yazısında adım adım hesapladım; aynı ürün üzerinden ilerliyorum ki üç kavram tek bir örnekte birleşsin.',
    ),
  ),
  h(2, 'Yeniden sipariş noktası, EOQ ve emniyet stoğu nasıl birleşir?'),
  p('Bu üç kavram tek bir stok kontrol sisteminin parçalarıdır ve birbirini tamamlar:'),
  ul([
    'EOQ her seferinde ne kadar sipariş vereceğini söyler.',
    'Emniyet stoğu belirsizliğe karşı ne kadar tampon tutacağını söyler.',
    'Yeniden sipariş noktası ne zaman sipariş vereceğini söyler ve emniyet stoğunu içine alır.',
  ]),
  pr(
    t(
      'Pratikte döngü şöyle işler: stok yeniden sipariş noktasına düşer, EOQ kadar sipariş verilir, mal gelene kadar emniyet stoğu güvence sağlar. Üçünü birlikte kuran bir işletme hem stoksuz kalmayı hem de aşırı stoğu aynı anda kontrol eder. Sipariş miktarını ',
    ),
    a('EOQ hesaplama', '/araclar/eoq-hesaplama'),
    t(', tampon stoğunu '),
    a('emniyet stoğu hesaplama', '/araclar/emniyet-stogu-hesaplama'),
    t(' aracıyla bulup değerleri '),
    a('yeniden sipariş noktası hesaplama', '/araclar/yeniden-siparis-noktasi-hesaplama'),
    t(' aracında birleştirebilirsin.'),
  ),
  h(2, 'Yeniden sipariş noktasını sürekli mi periyodik mi gözden geçirmeli?'),
  p(
    'İki temel sistem vardır. Sürekli gözden geçirme sisteminde stok her hareket sonrası kontrol edilir ve ROP\'a düşünce sipariş tetiklenir; bu yöntem ROP mantığının doğrudan uygulamasıdır ve modern stok yazılımlarının varsayılanıdır. Periyodik gözden geçirme sisteminde ise stok belirli aralıklarla (örneğin haftada bir) kontrol edilir; bu durumda emniyet stoğu, gözden geçirme aralığını da kapsayacak şekilde biraz daha yüksek tutulur, çünkü iki kontrol arasında stok ROP\'un altına inmiş olabilir. Hangi sistemi seçeceğin, stok takibini ne kadar otomatikleştirebildiğine bağlıdır.',
  ),
  h(2, 'Yeniden sipariş noktası ile sipariş miktarı farkı nedir?'),
  p(
    'Sık karıştırılan iki kavramdır. Yeniden sipariş noktası (reorder point) ne zaman sipariş vereceğini, sipariş miktarı (reorder quantity) ise her seferinde kaç adet sipariş vereceğini belirler. ROP bir eşik seviyesidir; sipariş miktarı bir parti büyüklüğüdür ve onu EOQ verir. Stok ROP\'a düştüğünde sistem alarm üretir, sen de EOQ kadar sipariş açarsın. İkisi ayrı kararlardır ama aynı döngüde çalışır.',
  ),
  h(2, 'Sık yapılan 5 hata'),
  p('ERP sistemleri kurarken ROP tarafında tekrar tekrar gördüğüm hatalar şunlar:'),
  ol([
    'Emniyet stoğunu atlamak. ROP\'u yalnız tedarik süresi × günlük talep olarak tanımlamak en yaygın hata; bu, ortalama bir dünya varsayar ve dönem dönem stoksuzluk üretir.',
    'Tedarik süresini sabit kabul etmek. Tedarik süresi tedarikçiye, mevsime ve lojistiğe göre değişir; gerçek teslim verisiyle düzenli güncellenmezse ROP gerçeği yansıtmaz.',
    'Birimleri karıştırmak. Talebi haftalık, tedarik süresini günlük girersen sonuç anlamsız çıkar; iki değer de aynı zaman birimine çevrilmelidir.',
    'Tek bir ROP\'u tüm ürünlere uygulamak. A sınıfı ürünle C sınıfı ürün aynı servis seviyesini gerektirmez; bu mantık doğrudan ABC analiziyle birleşir.',
    'Minimum stok seviyesini elle yuvarlak sayı olarak belirlemek. Sezgiyle konan 100 ya da 500 gibi değerler ne tedarik süresini ne talep oynaklığını yansıtır; ROP hesaplanmalı, tahmin edilmemelidir.',
  ]),
  pr(
    b('Kaynak: '),
    t('King, P. L. (2011). "Crack the Code: Understanding safety stock and mastering its equations." APICS Magazine. '),
    a(
      'web.mit.edu/2.810/www/files/readings/King_SafetyStock.pdf',
      'https://web.mit.edu/2.810/www/files/readings/King_SafetyStock.pdf',
    ),
  ),
];

export const ROP_SSS = [
  {
    soru: 'Yeniden sipariş noktası ne demek?',
    cevap:
      'Yeniden sipariş noktası (ROP), stoğun hangi seviyeye düştüğünde yeni sipariş verilmesi gerektiğini gösteren eşik stok seviyesidir. Türkçede sipariş verme noktası, minimum stok seviyesi ya da kritik stok seviyesi olarak da geçer.',
  },
  {
    soru: 'Değişken tedarik süresinde ROP nasıl hesaplanır?',
    cevap:
      'Tedarik süresi ve talep dalgalanıyorsa emniyet stoğunu servis seviyeli (Z × σ_d × √tedarik süresi) yöntemle hesaplayıp tedarik süresi talebine eklersin: ROP = (ortalama günlük talep × tedarik süresi) + istatistiksel emniyet stoğu. Servis seviyesi yükseldikçe ROP artar.',
  },
  {
    soru: 'ROP formülü nedir?',
    cevap:
      'ROP = (ortalama günlük talep × tedarik süresi) + emniyet stoğu. Talep ve tedarik süresi değişkense emniyet stoğu, servis seviyeli (Z × σ_d × √tedarik süresi) yöntemle hesaplanır.',
  },
  {
    soru: 'Yeniden sipariş noktası nasıl hesaplanır?',
    cevap:
      'Önce tedarik süresi boyunca beklenen tüketimi bul (günlük talep × tedarik süresi), sonra emniyet stoğunu ekle. Örneğin günde 50 adet, 9 gün tedarik ve 99 adet emniyet stoğu için ROP = 450 + 99 = 549 adettir.',
  },
  {
    soru: 'ROP ile EOQ birlikte nasıl kullanılır?',
    cevap:
      'Stok ROP seviyesine düştüğünde EOQ kadar sipariş verilir. ROP zamanlamayı, EOQ ise miktarı belirler.',
  },
  {
    soru: 'Yeniden sipariş noktası neden emniyet stoğu içerir?',
    cevap:
      'Çünkü tedarik süresi boyunca talep ortalamayı aşabilir veya tedarik gecikebilir; emniyet stoğu bu belirsizliği karşılar ve stoksuz kalmayı önler. Emniyet stoğu olmadan stoksuzluk riski yaklaşık %50\'ye çıkar.',
  },
  {
    soru: 'Minimum stok seviyesi ile yeniden sipariş noktası aynı şey mi?',
    cevap:
      'Pratikte çoğunlukla aynı eşiği anlatır: stoğun düşmesine izin verdiğin alt sınır ve sipariş tetikleme noktası. Bazı kaynaklar minimum stok seviyesini doğrudan emniyet stoğu olarak tanımlar.',
  },
];

const ROP_TOOL_FORMUL = [
  pr(
    b('Yeniden sipariş noktası hesaplama'),
    t(
      ' (ROP), stoğun hangi seviyeye indiğinde yeni sipariş vermen gerektiğini bulur. EOQ ne kadar sipariş vereceğini söyler; yeniden sipariş noktası ise ne zaman sipariş vereceğini. İkisi birlikte stok kontrol döngüsünü tamamlar: stok ROP\'a düştüğünde EOQ kadar sipariş verirsin. Kavramın derin anlatımı, değişken talep için istatistiksel ROP ve Excel örneği için ',
    ),
    a('yeniden sipariş noktası nedir', '/icerik/yeniden-siparis-noktasi-nedir'),
    t(' rehberine bakabilirsin.'),
  ),
  h(2, 'Yeniden sipariş noktası formülü nedir?'),
  p('ROP, tedarik süresi boyunca beklenen talebe emniyet stoğunun eklenmesiyle bulunur:'),
  fx('ROP = (Ortalama Günlük Talep × Tedarik Süresi) + Emniyet Stoğu'),
  p(
    'İlk terim tedarik süresi talebidir: sipariş verildiği andan mal gelene kadar tüketeceğin ortalama miktar. Emniyet stoğu ise bu süre içindeki talep dalgalanması ve gecikmelere karşı tampondur. Emniyet stoğu sıfır kabul edilirse ROP yalnız tedarik süresi talebine eşit olur, ki bu da stoksuzluk riskini yaklaşık %50\'ye çıkarır.',
  ),
  h(2, 'Aracı nasıl kullanırım?'),
  p('Üç değeri gir: ortalama günlük talep, tedarik süresi (gün) ve emniyet stoğu.'),
  table(
    ['Girdi', 'Anlamı', 'Örnek'],
    [
      ['Ortalama günlük talep', 'Günde satılan/kullanılan ortalama adet', '50 adet'],
      ['Tedarik süresi', 'Sipariş verildikten sonra teslim süresi', '9 gün'],
      ['Emniyet stoğu', 'Belirsizliğe karşı tampon stok', '99 adet'],
    ],
  ),
  pr(
    t(
      'Örneğin ortalama günlük talep 50 adet, tedarik süresi 9 gün ve emniyet stoğu 99 adet ise ROP = (50 × 9) + 99 = 450 + 99 = 549 adet çıkar. Yani stok 549 adede düştüğünde yeni siparişini vermelisin. Emniyet stoğu girdisini servis seviyeli yöntemle hesaplamak için ',
    ),
    b('stok kontrol Excel şablonunu'),
    t(' indirip kendi verinle doldurabilirsin.'),
  ),
  h(2, 'Sonucu nasıl yorumlamalısın?'),
  pr(
    t(
      'ROP, sipariş tetikleme alarmındır. Stok bu seviyeye indiğinde sipariş verirsen, mal gelene kadar elindeki stok ortalama talebi karşılar ve emniyet stoğu beklenmedik durumları kapatır. Emniyet stoğu girdisini doğru belirlemek için önce ',
    ),
    a('emniyet stoğu hesaplama', '/araclar/emniyet-stogu-hesaplama'),
    t(' aracını kullan; sipariş miktarını ise '),
    a('EOQ hesaplama', '/araclar/eoq-hesaplama'),
    t(' aracıyla bul. Stoğunun ne sıklıkta döndüğünü görmek için '),
    a('stok devir hızı hesaplama', '/araclar/stok-devir-hizi-hesaplama'),
    t(' aracına da bakabilirsin. Bu araçlar birlikte tam bir stok kontrol sistemi oluşturur.'),
  ),
];

const ROP_TOOL_SSS = [
  {
    soru: 'Yeniden sipariş noktası nasıl hesaplanır?',
    cevap:
      'ROP, ortalama günlük talebin tedarik süresiyle çarpımına emniyet stoğunun eklenmesiyle bulunur: ROP = (günlük talep × tedarik süresi) + emniyet stoğu.',
  },
  {
    soru: 'ROP ve EOQ arasındaki fark nedir?',
    cevap:
      'ROP ne zaman sipariş vereceğini, EOQ ise her seferinde ne kadar sipariş vereceğini belirler. Stok ROP seviyesine düştüğünde EOQ kadar sipariş verilir.',
  },
  {
    soru: 'Emniyet stoğu olmadan ROP hesaplanır mı?',
    cevap:
      'Hesaplanır ama önerilmez. Emniyet stoğu sıfır olduğunda ROP yalnız ortalama talebi karşılar ve stoksuz kalma riski yaklaşık %50\'ye çıkar.',
  },
  {
    soru: 'Tedarik süresi değişirse ROP\'u güncellemeli miyim?',
    cevap: 'Evet. Tedarik süresi uzarsa ROP yükselmeli; aksi halde mal gelmeden stoğun biter.',
  },
  {
    soru: 'Minimum stok seviyesi ile yeniden sipariş noktası aynı mı?',
    cevap:
      'Pratikte çoğunlukla aynı eşiği anlatır: sipariş tetikleme noktası ve stoğun düşmesine izin verilen alt sınır.',
  },
];

/**
 * Yeniden sipariş noktası (ROP) içeriğini seed'ler: blog yazısı + hesaplama
 * tool'u (idempotent; blog ve tool ayrı ayrı guard'lanır). Kapak görselleri
 * sonraki turda eklenecek (placeholder). Blog ile tool birbirine
 * (iliskiliTool / iliskiliYazilar) ilişkilendirilir.
 */
export async function seedRop(strapi: Core.Strapi): Promise<void> {
  const existing = await strapi.documents('api::blog.blog').findFirst({
    filters: { slug: 'yeniden-siparis-noktasi-nedir' },
    populate: ['kapakGorseli'],
  });
  const existingTool = await strapi.documents('api::tool.tool').findFirst({
    filters: { slug: 'yeniden-siparis-noktasi-hesaplama' },
    populate: ['kapakGorseli'],
  });
  // Kapak görselleri sonradan eklendi: ikisi de varsa VE ikisinin de kapağı
  // bağlıysa atla. Kapak eksikse bir kez backfill et (içerik elle düzenlenmişse
  // ezme; yalnız kapağı olmayan kayda dokun).
  if (existing && existingTool && existing.kapakGorseli && existingTool.kapakGorseli) {
    strapi.log.info('[seed] Yeniden sipariş noktası içeriği (blog + tool) zaten mevcut, atlanıyor.');
    return;
  }

  strapi.log.info('[seed] Yeniden sipariş noktası içeriği oluşturuluyor...');

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

  // --- TOOL ---
  const toolKapakId = await ensureLocalFile(strapi, {
    url: '/uploads/rop-tool.jpg',
    name: 'rop-tool.jpg',
    alt: 'Yeniden sipariş noktası hesaplama aracı kapak görseli',
    hash: 'rop_tool_cover_seed',
    size: 83,
    width: 1600,
    height: 845,
  });
  let tool = existingTool;
  if (!tool) {
    tool = await strapi.documents('api::tool.tool').create({
      data: {
        ad: 'Yeniden Sipariş Noktası Hesaplama',
        slug: 'yeniden-siparis-noktasi-hesaplama',
        kisaAciklama:
          'Ortalama günlük talebini, tedarik süreni ve emniyet stoğunu gir; yeniden sipariş noktası hesaplama aracı stoğun hangi seviyeye düşünce yeni sipariş vermen gerektiğini söylesin.',
        formulAciklamasi: ROP_TOOL_FORMUL,
        ...(toolKapakId ? { kapakGorseli: toolKapakId } : {}),
        seo: {
          title: 'Yeniden Sipariş Noktası Hesaplama (ROP) Aracı [2026]',
          description:
            'Yeniden sipariş noktası hesaplama aracı ile ne zaman sipariş vereceğini bul. Ortalama günlük talep, tedarik süresi ve emniyet stoğunu gir, ROP seviyeni ve tedarik süresi talebini gör.',
        },
        kategori: kategori.documentId,
        sss: ROP_TOOL_SSS,
      },
      status: 'published',
    });
    strapi.log.info('[seed] Yeniden sipariş noktası tool kaydı oluşturuldu.');
  } else if (!existingTool.kapakGorseli && toolKapakId) {
    // Kapak eksik kayda backfill (içeriği ezme).
    await strapi.documents('api::tool.tool').update({
      documentId: tool.documentId,
      data: { kapakGorseli: toolKapakId },
      status: 'published',
    });
    strapi.log.info('[seed] Yeniden sipariş noktası tool kapağı backfill edildi.');
  }

  // --- BLOG ---
  const kapakId = await ensureLocalFile(strapi, {
    url: '/uploads/rop-kapak.jpg',
    name: 'rop-kapak.jpg',
    alt: 'Yeniden sipariş noktası: stok seviyesinin ROP eşiğine düşüşü ve sipariş tetikleme anı',
    hash: 'rop_kapak_cover_seed',
    size: 69,
    width: 1600,
    height: 845,
  });
  let blog = existing;
  if (!blog) {
    blog = await strapi.documents('api::blog.blog').create({
      data: {
        baslik: 'Yeniden Sipariş Noktası (ROP) Nedir? Formülü ve Hesaplama Rehberi [2026]',
        slug: 'yeniden-siparis-noktasi-nedir',
        icerik: ROP_BLOG,
        ...(kapakId ? { kapakGorseli: kapakId } : {}),
        iliskiliTool: tool.documentId,
        seo: {
          title: 'Yeniden Sipariş Noktası Nedir? ROP Formülü ve Hesaplama [2026]',
          description:
            'Yeniden sipariş noktası (ROP) nedir, nasıl hesaplanır? Formülü, değişken talep için istatistiksel ROP, Excel örneği ve EOQ ile ilişkisi. Ne zaman sipariş vereceğini belirleyen rehber.',
        },
        kategori: kategori.documentId,
        yazar: yazar.documentId,
        sss: ROP_SSS,
        yayinTarihi: '2026-06-17T09:00:00.000Z',
        guncellemeTarihi: '2026-06-17T09:00:00.000Z',
      },
      status: 'published',
    });
    strapi.log.info('[seed] Yeniden sipariş noktası blog içeriği oluşturuldu.');
  } else if (!existing.kapakGorseli) {
    // Kapak eksik: kapağı bağla ve gövdeyi (görsel node'u dahil) bir kez yenile.
    await strapi.documents('api::blog.blog').update({
      documentId: blog.documentId,
      data: {
        icerik: ROP_BLOG,
        ...(kapakId ? { kapakGorseli: kapakId } : {}),
        iliskiliTool: tool.documentId,
      },
      status: 'published',
    });
    strapi.log.info('[seed] Yeniden sipariş noktası blog kapağı + görseli backfill edildi.');
  } else {
    await strapi.documents('api::blog.blog').update({
      documentId: blog.documentId,
      data: { iliskiliTool: tool.documentId },
      status: 'published',
    });
  }

  // Tool tarafından blog'a ilişki (oneToMany iliskiliYazilar).
  await strapi.documents('api::tool.tool').update({
    documentId: tool.documentId,
    data: { iliskiliYazilar: [blog.documentId] },
    status: 'published',
  });

  strapi.log.info('[seed] Yeniden sipariş noktası içeriği başarıyla oluşturuldu.');
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
