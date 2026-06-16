import { P, RP, T, B, L, H, UL, OL, TABLE, type SozlukData } from './sozluk-blocks';

export const SOZLUK_TERIMLERI: SozlukData[] = [
  {
    kelime: 'Stok',
    slug: 'stok',
    harf: 'S',
    kisaTanim:
      'İşletmenin satış, üretim veya kullanım için elinde bulundurduğu hammadde, yarı mamul ve ürünlerin tümü; sermayeyi bağlayan ama talebi karşılayan fiziksel varlıktır.',
    anlam: [
      RP(
        B('Stok (inventory)'),
        T(', bir işletmenin gelecekteki talebi karşılamak amacıyla elinde tuttuğu hammadde, yarı mamul ve bitmiş ürünlerin toplamıdır. Hem talebi anında karşılamayı sağlar hem de işletme sermayesini bağladığı için bir maliyet kalemidir.'),
      ),
      P('Stoklar genellikle üç ana grupta toplanır: hammadde stoğu, üretim sürecindeki yarı mamul (WIP) stoğu ve satışa hazır mamul stoğu. Doğru stok seviyesini bulmak, stoksuz kalma riski ile taşıma maliyeti arasında denge kurmak demektir.'),
      RP(
        T('Örneğin bir mobilya atölyesinde kereste hammadde stoğu, montaj bekleyen parçalar yarı mamul, depodaki masalar ise mamul stoğudur. Stok seviyesinin sağlığını ölçmek için '),
        L('stok devir hızı hesaplama aracını', '/araclar/stok-devir-hizi-hesaplama'),
        T(' kullanabilirsin.'),
      ),
    ],
    ilgili: ['stok-yonetimi', 'envanter', 'stok-devir-hizi'],
  },
  {
    kelime: 'Stok Yönetimi',
    slug: 'stok-yonetimi',
    harf: 'S',
    kisaTanim:
      'Doğru ürünü, doğru miktarda, doğru zamanda bulundurmak için stok seviyelerini planlama, izleme ve kontrol etme disiplinidir; amacı maliyet ile hizmet seviyesini dengelemektir.',
    anlam: [
      RP(
        B('Stok yönetimi (inventory management)'),
        T(', işletmenin elindeki stokları sipariş etme, depolama ve kullanma süreçlerini planlayıp kontrol etme faaliyetidir. Temel sorusu şudur: ne zaman, ne kadar sipariş vermeliyim?'),
      ),
      P('İyi bir stok yönetimi, stoksuz kalma kayıplarını azaltırken aşırı stoktan kaynaklanan taşıma ve sermaye bağlama maliyetlerini de düşürür. Sipariş miktarı, yeniden sipariş noktası ve emniyet stoğu gibi parametreler bu disiplinin temel araçlarıdır.'),
      RP(
        T('Optimal sipariş miktarını belirlemek için '),
        L('EOQ hesaplama aracı', '/araclar/eoq-hesaplama'),
        T(' ile başlayabilir, kavramın temelini '),
        L('EOQ nedir yazısından', '/icerik/eoq-nedir'),
        T(' okuyabilirsin.'),
      ),
    ],
    ilgili: ['stok-kontrolu', 'ekonomik-siparis-miktari', 'envanter'],
  },
  {
    kelime: 'Stok Kontrolü',
    slug: 'stok-kontrolu',
    harf: 'S',
    kisaTanim:
      'Mevcut stok seviyelerini sayım, kayıt ve raporlama ile sürekli izleyip planlanan seviyeyle karşılaştırma; sapmaları tespit edip düzeltici aksiyon alma faaliyetidir.',
    anlam: [
      RP(
        B('Stok kontrolü (inventory control)'),
        T(', elde bulunan stok miktarının kayıt altında tutulması, fiziksel sayımla doğrulanması ve hedef seviyelerle karşılaştırılarak yönetilmesidir. Stok yönetiminin operasyonel, gün gün yürüyen ayağıdır.'),
      ),
      P('Stok kontrolü iki temel yaklaşımla yapılır: sürekli sistemde her hareket anında kaydedilirken, periyodik sistemde stok belirli aralıklarla sayılır. Barkod ve RFID gibi teknolojiler bu süreci hızlandırır ve hata oranını düşürür.'),
      P('Pratikte stok kontrolünün amacı kayıt ile gerçeğin uyumlu olmasıdır; kayıtta 100 adet görünen bir ürün depoda 80 adetse, planlama yanlış kararlar üretir.'),
    ],
    ilgili: ['stok-sayimi', 'stok-dogrulugu', 'dongusel-sayim'],
  },
  {
    kelime: 'Envanter',
    slug: 'envanter',
    harf: 'E',
    kisaTanim:
      'İşletmenin belirli bir andaki tüm stoklarının miktar ve değer olarak dökümü; muhasebe ve operasyonda "stok" kavramıyla çoğu zaman eş anlamlı kullanılır.',
    anlam: [
      RP(
        B('Envanter (inventory)'),
        T(', bir işletmenin sahip olduğu stok kalemlerinin belirli bir tarihteki tam listesi ve değeridir. Türkçede çoğu bağlamda "stok" ile aynı anlamda kullanılır; muhasebede ise dönem sonu sayımıyla çıkarılan varlık dökümünü ifade eder.'),
      ),
      P('Envanter kavramı hem fiziksel sayımı hem de bu sayımın parasal değerini kapsar. Üretim ve perakende işletmelerinde envanter, dönen varlıkların önemli bir bölümünü oluşturur ve bilançoda izlenir.'),
      P('Örneğin yıl sonunda yapılan envanter sayımı, kayıttaki değerle fiziksel gerçeği karşılaştırarak fire, kayıp veya hatayı ortaya çıkarır.'),
    ],
    ilgili: ['stok', 'stok-sayimi', 'stok-degerleme'],
  },
  {
    kelime: 'Stok Devir Hızı',
    slug: 'stok-devir-hizi',
    harf: 'S',
    kisaTanim:
      'Belirli bir dönemde stoğun kaç kez yenilendiğini gösteren oran; satılan malın maliyetinin ortalama stoğa bölünmesiyle bulunur ve stoğun ne kadar verimli kullanıldığını ölçer.',
    anlam: [
      RP(
        B('Stok devir hızı (inventory turnover)'),
        T(', bir dönemde stoğun kaç kez tamamen satılıp yenilendiğini gösteren orandır. Formülü satılan malın maliyeti bölü ortalama stoktur. Yüksek devir hızı, stoğun hızlı sattığını ve sermayenin verimli döndüğünü işaret eder.'),
      ),
      P('Çok düşük devir hızı atıl ve ölü stoğa işaret ederken, çok yüksek devir hızı da sık sık stoksuz kalma riskini gösterebilir. İdeal oran sektöre göre değişir; üretimde genelde 4 ile 6 arası sağlıklı kabul edilir.'),
      RP(
        T('Kendi oranını '),
        L('stok devir hızı hesaplama aracıyla', '/araclar/stok-devir-hizi-hesaplama'),
        T(' bulabilir, yorumlama detayları için '),
        L('stok devir hızı nedir yazısını', '/icerik/stok-devir-hizi-nedir'),
        T(' okuyabilirsin.'),
      ),
    ],
    ilgili: ['ortalama-stok', 'stokta-kalma-suresi', 'stok-devir-orani'],
  },
  {
    kelime: 'Ortalama Stok',
    slug: 'ortalama-stok',
    harf: 'O',
    kisaTanim:
      'Bir dönem boyunca elde tutulan stoğun tipik seviyesi; en yalın haliyle dönem başı ve dönem sonu stoğun toplamının ikiye bölünmesiyle hesaplanır.',
    anlam: [
      RP(
        B('Ortalama stok (average inventory)'),
        T(', bir dönem içinde işletmenin elinde bulundurduğu stoğun ortalama seviyesidir. Basit yöntemde dönem başı stok ile dönem sonu stok toplanıp ikiye bölünür; daha hassas hesaplamada aylık veya haftalık sayımların ortalaması alınır.'),
      ),
      P('Ortalama stok, devir hızı ve taşıma maliyeti hesaplamalarının paydasını oluşturduğu için doğru belirlenmesi önemlidir. Sezonluk dalgalanması yüksek ürünlerde yalnızca dönem başı ve sonu kullanmak yanıltıcı olabilir.'),
      RP(
        T('Ortalama stok, '),
        L('stok devir hızı hesaplamasının', '/araclar/stok-devir-hizi-hesaplama'),
        T(' temel girdisidir.'),
      ),
    ],
    ilgili: ['stok-devir-hizi', 'cevrim-stogu', 'emniyet-stogu'],
  },
  {
    kelime: 'Emniyet Stoğu',
    slug: 'emniyet-stogu',
    harf: 'E',
    kisaTanim:
      'Talep dalgalanması ve tedarik gecikmelerine karşı tutulan tampon stok; stoksuz kalma riskini düşürmek için normal ortalama tüketimin üzerine eklenen güvenlik payıdır.',
    anlam: [
      RP(
        B('Emniyet stoğu (safety stock)'),
        T(', talebin beklenenden yüksek çıkması veya tedarikçinin geç teslim etmesi durumunda üretimin ya da satışın durmaması için elde tutulan tampon miktardır. Ortalama tüketim üzerinden hesaplanan normal stoğun üstüne eklenir; amacı '),
        B('hizmet seviyesini'),
        T(' korumakla taşıma maliyetini dengede tutmak arasında doğru noktayı bulmaktır.'),
      ),
      P('Klasik yaklaşımda emniyet stoğu, hizmet seviyesine karşılık gelen Z katsayısı, tedarik süresi (lead time) ve talebin standart sapması kullanılarak hesaplanır. Tedarik süresi uzadıkça veya talep daha değişken hale geldikçe gereken tampon büyür.'),
      RP(
        T('Doğru tampon miktarını '),
        L('emniyet stoğu hesaplama aracıyla', '/araclar/emniyet-stogu-hesaplama'),
        T(' bulabilir, kavramın detaylı anlatımı için '),
        L('emniyet stoğu nedir yazısını', '/icerik/emniyet-stogu-nedir'),
        T(' okuyabilirsin.'),
      ),
    ],
    ilgili: ['yeniden-siparis-noktasi', 'tedarik-suresi', 'hizmet-seviyesi'],
  },
  {
    kelime: 'Yeniden Sipariş Noktası',
    slug: 'yeniden-siparis-noktasi',
    harf: 'Y',
    kisaTanim:
      'Stoğun, yeni sipariş verilmesi gereken seviyeye düştüğü kritik miktar; tedarik süresince beklenen tüketim ile emniyet stoğunun toplamına eşittir.',
    anlam: [
      RP(
        B('Yeniden sipariş noktası (reorder point, ROP)'),
        T(', stok seviyesinin yeni bir sipariş açılmasını gerektiren kritik eşiğe indiği andır. Stok bu seviyeye düştüğünde sipariş verilir ve yeni mal, mevcut stok bitmeden önce gelir.'),
      ),
      P('ROP iki bileşenden oluşur: tedarik süresi boyunca beklenen ortalama tüketim ve olası gecikme veya talep sıçramasına karşı tutulan emniyet stoğu. Formülü kabaca günlük tüketim çarpı tedarik süresi artı emniyet stoğudur.'),
      RP(
        T('Kendi sipariş noktanı '),
        L('ROP hesaplama aracıyla', '/araclar/yeniden-siparis-noktasi-hesaplama'),
        T(' bulabilir, mantığını '),
        L('yeniden sipariş noktası nedir yazısından', '/icerik/yeniden-siparis-noktasi-nedir'),
        T(' öğrenebilirsin.'),
      ),
    ],
    ilgili: ['emniyet-stogu', 'tedarik-suresi', 'siparis-noktasi'],
  },
  {
    kelime: 'Ekonomik Sipariş Miktarı',
    slug: 'ekonomik-siparis-miktari',
    harf: 'E',
    kisaTanim:
      'Toplam sipariş ve taşıma maliyetini en aza indiren optimal sipariş miktarı; sipariş başına maliyet ile elde tutma maliyetinin dengelendiği noktayı verir.',
    anlam: [
      RP(
        B('Ekonomik sipariş miktarı (economic order quantity, EOQ)'),
        T(', her siparişte ne kadar sipariş verilirse toplam stok maliyetinin en düşük olacağını bulan klasik formüldür. Sipariş verme maliyeti ile elde tutma maliyeti arasındaki dengeyi kurar.'),
      ),
      P('Sık sipariş vermek sipariş maliyetini, az ama büyük sipariş vermek taşıma maliyetini artırır. EOQ bu iki maliyetin toplamının minimum olduğu sipariş miktarını verir; formülü yıllık talep, sipariş maliyeti ve birim taşıma maliyetini kullanır.'),
      RP(
        T('Optimal miktarı '),
        L('EOQ hesaplama aracıyla', '/araclar/eoq-hesaplama'),
        T(' hesaplayabilir, türetimi için '),
        L('EOQ nedir yazısını', '/icerik/eoq-nedir'),
        T(' inceleyebilirsin.'),
      ),
    ],
    ilgili: ['siparis-maliyeti', 'tasima-maliyeti', 'parti-buyuklugu'],
  },
  {
    kelime: 'Elde Bulundurma (Taşıma) Maliyeti',
    slug: 'tasima-maliyeti',
    harf: 'E',
    kisaTanim:
      'Stoğu elde tutmanın yarattığı maliyet; depo, sigorta, fire, eskime ve bağlanan sermayenin fırsat maliyetini kapsar ve genelde stok değerinin yüzdesi olarak ifade edilir.',
    anlam: [
      RP(
        B('Elde bulundurma maliyeti (carrying / holding cost)'),
        T(', stoğu belirli bir süre depolamanın toplam maliyetidir. Depo kirası, sigorta, eskime, fire, soğutma ve en önemlisi stoğa bağlanan paranın başka yerde değerlendirilememesinden doğan sermaye bağlama maliyetini içerir.'),
      ),
      P('Genellikle stok değerinin yıllık yüzdesi olarak ifade edilir; örneğin yüzde 25 taşıma maliyeti, 100 TL değerindeki stoğun yılda 25 TL maliyet yarattığı anlamına gelir. Bu oran EOQ hesabının kritik girdisidir.'),
      RP(
        T('Bu maliyet, '),
        L('EOQ hesaplama aracında', '/araclar/eoq-hesaplama'),
        T(' optimal sipariş miktarını doğrudan belirler.'),
      ),
    ],
    ilgili: ['siparis-maliyeti', 'sermaye-baglama-maliyeti', 'ekonomik-siparis-miktari'],
  },
  {
    kelime: 'Sipariş (Hazırlık) Maliyeti',
    slug: 'siparis-maliyeti',
    harf: 'S',
    kisaTanim:
      'Bir siparişi vermenin veya bir üretim partisini başlatmanın sabit maliyeti; tedarikçi iletişimi, evrak, nakliye ve üretimde hat hazırlık (setup) giderlerini kapsar.',
    anlam: [
      RP(
        B('Sipariş maliyeti (ordering / setup cost)'),
        T(', sipariş miktarından bağımsız olarak her sipariş veya üretim partisi başına oluşan sabit maliyettir. Satın almada teklif alma, sözleşme, evrak ve nakliye; üretimde ise hattın yeni ürüne hazırlanması (setup) giderini içerir.'),
      ),
      P('Sipariş maliyeti sabit olduğu için sık sipariş vermek toplam maliyeti yukarı çeker. Bu yüzden EOQ, sipariş maliyeti ile taşıma maliyetini dengeleyerek en uygun parti büyüklüğünü bulur.'),
      RP(
        T('Sipariş maliyeti, '),
        L('EOQ hesaplamasının', '/araclar/eoq-hesaplama'),
        T(' iki temel girdisinden biridir.'),
      ),
    ],
    ilgili: ['tasima-maliyeti', 'ekonomik-siparis-miktari', 'hazirlik-suresi'],
  },
  {
    kelime: 'Stoksuzluk Maliyeti',
    slug: 'stoksuzluk-maliyeti',
    harf: 'S',
    kisaTanim:
      'Talep olduğu halde stok bulunmamasının yarattığı kayıp; kaçan satış, gecikme cezaları, acil tedarik giderleri ve müşteri kaybı gibi doğrudan ve dolaylı zararları kapsar.',
    anlam: [
      RP(
        B('Stoksuzluk maliyeti (stockout / shortage cost)'),
        T(', bir ürünün talep edildiği anda stokta bulunmamasının işletmeye yüklediği maliyettir. En görünür kısmı kaçan satıştır; bunun yanında acil tedarik, hızlı kargo, üretim duruşu ve uzun vadede müşteri sadakatinin kaybı gibi kalemleri içerir.'),
      ),
      P('Stoksuzluk maliyetini ölçmek zordur çünkü kayıp satış ve itibar zararı kayıtlara doğrudan yansımaz. Yine de emniyet stoğu seviyesini belirlerken bu maliyetin taşıma maliyetiyle dengelenmesi gerekir.'),
      RP(
        T('Stoksuz kalma riskini '),
        L('emniyet stoğu hesaplaması', '/araclar/emniyet-stogu-hesaplama'),
        T(' ve hizmet seviyesi seçimiyle yönetebilirsin.'),
      ),
    ],
    ilgili: ['emniyet-stogu', 'hizmet-seviyesi', 'backorder'],
  },
  {
    kelime: 'Tedarik',
    slug: 'tedarik',
    harf: 'T',
    kisaTanim:
      'İşletmenin ihtiyaç duyduğu mal ve hizmetleri dış kaynaklardan temin etme süreci; tedarikçi seçiminden teslim alımına kadar olan adımları kapsar.',
    anlam: [
      RP(
        B('Tedarik (procurement / sourcing)'),
        T(', bir işletmenin üretim veya satış için gereken hammadde, malzeme ve hizmetleri dış kaynaklardan sağlama faaliyetidir. Tedarikçi araştırması, fiyat görüşmesi, sipariş ve teslim alma adımlarını içerir.'),
      ),
      P('Etkili tedarik, sadece en ucuz fiyatı bulmak değil; kalite, teslim güvenilirliği ve süreklilik arasında denge kurmaktır. Tek tedarikçiye bağımlılık riski azaltmak için çoğu işletme alternatif kaynaklar tutar.'),
      P('Örneğin bir üreticinin kritik bir parça için ikinci bir tedarikçi belirlemesi, ana tedarikçide yaşanan bir gecikmenin üretimi durdurmasını engeller.'),
    ],
    ilgili: ['satin-alma', 'tedarik-zinciri', 'tedarikci'],
  },
  {
    kelime: 'Tedarik Zinciri',
    slug: 'tedarik-zinciri',
    harf: 'T',
    kisaTanim:
      'Hammaddeden son müşteriye kadar ürünün geçtiği tüm işletme, süreç ve akışların oluşturduğu ağ; tedarikçi, üretici, dağıtıcı ve perakendeciyi birbirine bağlar.',
    anlam: [
      RP(
        B('Tedarik zinciri (supply chain)'),
        T(', bir ürünün hammadde halinden son tüketiciye ulaşana kadar geçtiği tedarikçi, üretici, depo, dağıtıcı ve perakendeci ağının tamamıdır. Bu ağ boyunca malzeme, bilgi ve para akar.'),
      ),
      P('Tedarik zincirinin her halkası birbirine bağlıdır; bir tedarikçideki aksama, zincirin sonundaki müşteriye kadar yansır. Bu zincir etkisine literatürde kamçı etkisi (bullwhip effect) denir.'),
      P('Örneğin bir otomobil üreticisinin zinciri yüzlerce parça tedarikçisini, montaj fabrikasını, lojistik firmalarını ve bayileri kapsar.'),
    ],
    ilgili: ['tedarik-zinciri-yonetimi', 'tedarik', 'lojistik'],
  },
  {
    kelime: 'Tedarik Zinciri Yönetimi',
    slug: 'tedarik-zinciri-yonetimi',
    harf: 'T',
    kisaTanim:
      'Tedarik zincirindeki malzeme, bilgi ve para akışlarını uçtan uca planlama, koordine etme ve optimize etme disiplini; toplam maliyeti düşürürken müşteri hizmetini artırmayı hedefler.',
    anlam: [
      RP(
        B('Tedarik zinciri yönetimi (supply chain management, SCM)'),
        T(', tedarikçiden son müşteriye kadar tüm akışların planlanması ve koordine edilmesidir. Amacı doğru ürünü doğru yerde, doğru zamanda ve en düşük toplam maliyetle bulundurmaktır.'),
      ),
      P('SCM; talep tahmini, tedarik, üretim planlama, depolama ve dağıtımı tek bir bütün olarak ele alır. İyi yönetilen bir zincir, stok seviyelerini düşürürken teslim performansını artırır.'),
      P('Modern SCM, halkalar arası bilgi paylaşımına ve dijital sistemlere dayanır; veri paylaşımı kamçı etkisini azaltır ve zinciri daha esnek kılar.'),
    ],
    ilgili: ['tedarik-zinciri', 'lojistik', 'talep-tahmini'],
  },
  {
    kelime: 'Tedarik Süresi',
    slug: 'tedarik-suresi',
    harf: 'T',
    kisaTanim:
      'Sipariş verildiği andan malın kullanıma hazır şekilde teslim alındığı ana kadar geçen süre; emniyet stoğu ve yeniden sipariş noktası hesabının kritik girdisidir.',
    anlam: [
      RP(
        B('Tedarik süresi (lead time)'),
        T(', bir sipariş açıldığı andan malzemenin teslim alınıp kullanıma hazır hale geldiği ana kadar geçen toplam süredir. Sipariş işleme, üretim, sevkiyat ve mal kabul aşamalarını kapsar.'),
      ),
      P('Tedarik süresi ne kadar uzun ve değişkense, stoksuz kalmamak için o kadar fazla emniyet stoğu ve daha yüksek bir yeniden sipariş noktası gerekir. Süreyi kısaltmak, gereken tampon stoğu doğrudan azaltır.'),
      RP(
        T('Tedarik süresi, hem '),
        L('emniyet stoğu', '/araclar/emniyet-stogu-hesaplama'),
        T(' hem de '),
        L('yeniden sipariş noktası', '/araclar/yeniden-siparis-noktasi-hesaplama'),
        T(' hesabının temel girdisidir.'),
      ),
    ],
    ilgili: ['emniyet-stogu', 'yeniden-siparis-noktasi', 'bekleme-suresi'],
  },
  {
    kelime: 'Satın Alma',
    slug: 'satin-alma',
    harf: 'S',
    kisaTanim:
      'İşletmenin ihtiyaç duyduğu mal ve hizmetlerin tedarikçilerden satın alınmasını yürüten fonksiyon; talep toplama, sipariş verme ve tedarikçi ilişkilerini kapsar.',
    anlam: [
      RP(
        B('Satın alma (purchasing)'),
        T(', tedarik sürecinin operasyonel ayağıdır; ihtiyaçların toplanması, tedarikçiden teklif alınması, satın alma siparişinin (PO) açılması ve teslimin takibini kapsar.'),
      ),
      P('Satın alma kararları doğrudan stok seviyelerini etkiler. Ne zaman ve ne kadar sipariş verileceği; EOQ, yeniden sipariş noktası ve tedarikçi koşulları gibi parametrelere göre belirlenir.'),
      RP(
        T('Satın alma miktarını optimize etmek için '),
        L('EOQ hesabını', '/araclar/eoq-hesaplama'),
        T(' kullanabilirsin.'),
      ),
    ],
    ilgili: ['satin-alma-siparisi', 'tedarik', 'minimum-siparis-miktari'],
  },
  {
    kelime: 'Sipariş Noktası',
    slug: 'siparis-noktasi',
    harf: 'S',
    kisaTanim:
      'Stoğun yeni sipariş tetiklemesi gereken seviyeyi ifade eden genel terim; çoğu sistemde yeniden sipariş noktası (ROP) ile aynı anlamda kullanılır.',
    anlam: [
      RP(
        B('Sipariş noktası'),
        T(', stok seviyesinin yeni bir satın alma veya üretim siparişini tetiklediği eşiktir. Pratikte yeniden sipariş noktası (reorder point, ROP) ile çoğunlukla aynı anlamda kullanılır.'),
      ),
      P('Sipariş noktası belirlenirken tedarik süresi boyunca tüketilecek miktar ve emniyet stoğu hesaba katılır. Stok bu eşiğe indiğinde sistem otomatik bir sipariş önerisi üretebilir.'),
      RP(
        T('Detaylı hesap için '),
        L('yeniden sipariş noktası aracına', '/araclar/yeniden-siparis-noktasi-hesaplama'),
        T(' bakabilirsin.'),
      ),
    ],
    ilgili: ['yeniden-siparis-noktasi', 'emniyet-stogu', 'tedarik-suresi'],
  },
  {
    kelime: 'Çevrim Stoğu',
    slug: 'cevrim-stogu',
    harf: 'Ç',
    kisaTanim:
      'İki sipariş arasında normal tüketimi karşılamak için tutulan stok; sipariş miktarının ortalama olarak yarısına denk gelir ve emniyet stoğunun üzerinde dalgalanır.',
    anlam: [
      RP(
        B('Çevrim stoğu (cycle stock)'),
        T(', iki sipariş arasında olağan talebi karşılamak için tutulan stok kısmıdır. Sipariş geldiğinde en yüksek seviyeye çıkar, tüketildikçe azalır ve yeni sipariş geldiğinde tekrar dolar.'),
      ),
      P('Çevrim stoğu ortalama olarak sipariş miktarının yarısı kadardır. Emniyet stoğunun aksine talebin normal seyrini karşılar; emniyet stoğu ise yalnızca beklenmedik sapmalar için altta durur.'),
      P('Örneğin her seferinde 200 adet sipariş veriliyorsa, ortalama çevrim stoğu 100 adettir ve bunun üstüne emniyet stoğu eklenir.'),
    ],
    ilgili: ['emniyet-stogu', 'ortalama-stok', 'ekonomik-siparis-miktari'],
  },
  {
    kelime: 'Ölü Stok',
    slug: 'olu-stok',
    harf: 'Ö',
    kisaTanim:
      'Uzun süredir hiç hareket görmeyen, satış veya kullanım ihtimali kalmamış stok; sermayeyi bağlar, depo yer kaplar ve genelde değer kaybına uğrar.',
    anlam: [
      RP(
        B('Ölü stok (dead stock)'),
        T(', belirli bir süre boyunca hiç satılmamış veya kullanılmamış, gelecekte de talep görme ihtimali çok düşük olan stoktur. Sermayeyi bağlar, depo alanını işgal eder ve zamanla eskiyerek değer kaybeder.'),
      ),
      P('Ölü stok genellikle yanlış talep tahmini, modası geçmiş ürünler veya aşırı sipariş kaynaklıdır. ABC ve yaşlandırma analizleriyle tespit edilip indirim, iade veya elden çıkarma ile temizlenir.'),
      P('Düşük stok devir hızı, ölü stoğun erken uyarı işaretidir; devir hızı düştükçe ölü stok riski artar.'),
    ],
    ilgili: ['atil-stok', 'stok-yaslandirma', 'stok-devir-hizi'],
  },
  {
    kelime: 'Atıl Stok',
    slug: 'atil-stok',
    harf: 'A',
    kisaTanim:
      'Talebin çok altında, yavaş hareket eden ve uzun süre depoda bekleyen stok; ölü stok kadar değersiz değildir ama sermayeyi gereksiz bağlar.',
    anlam: [
      RP(
        B('Atıl stok (slow-moving / excess stock)'),
        T(', talebe kıyasla fazla tutulan, yavaş hareket eden ve uzun süre depoda bekleyen stoktur. Henüz tamamen ölü değildir; bir miktar satışı vardır ama elde tutma maliyeti getirisinden yüksektir.'),
      ),
      P('Atıl stok, zamanında müdahale edilmezse ölü stoğa dönüşür. Erken tespit için stok yaşı, devir hızı ve ABC analizi birlikte kullanılır; yavaş hareket edenler kampanya veya sipariş frenleme ile yönetilir.'),
      P('Örneğin son altı ayda sadece birkaç adet satan ama deposunda yüzlerce adet bekleyen bir ürün, klasik bir atıl stok adayıdır.'),
    ],
    ilgili: ['olu-stok', 'stok-devir-hizi', 'abc-analizi'],
  },
  {
    kelime: 'ABC Analizi',
    slug: 'abc-analizi',
    harf: 'A',
    kisaTanim:
      'Stok kalemlerini değer veya öneme göre A, B, C gruplarına ayıran sınıflandırma yöntemi; az sayıda yüksek değerli kalemin (A) toplam değerin büyük kısmını oluşturduğu Pareto ilkesine dayanır.',
    anlam: [
      RP(
        B('ABC analizi'),
        T(', stok kalemlerini yıllık kullanım değerine göre üç gruba ayıran bir önceliklendirme yöntemidir. Pareto (80/20) ilkesine dayanır: az sayıda kalem toplam değerin büyük bölümünü oluşturur, çoğu kalem ise küçük bir paya sahiptir.'),
      ),
      TABLE(
        ['Grup', 'Tipik kalem payı', 'Tipik değer payı', 'Kontrol sıklığı'],
        [
          ['A', 'yaklaşık %20', 'yaklaşık %80', 'Sık ve sıkı'],
          ['B', 'yaklaşık %30', 'yaklaşık %15', 'Orta'],
          ['C', 'yaklaşık %50', 'yaklaşık %5', 'Seyrek ve gevşek'],
        ],
      ),
      P('A grubu kalemler yüksek değerli olduğu için sıkı izlenir ve sık sayılır; C grubu düşük değerli olduğundan daha gevşek yönetilir. Bu yaklaşım, kontrol çabasını en çok değer yaratan kalemlere odaklar.'),
    ],
    ilgili: ['ved-analizi', 'dongusel-sayim', 'stok-kontrolu'],
  },
  {
    kelime: 'VED Analizi',
    slug: 'ved-analizi',
    harf: 'V',
    kisaTanim:
      'Stok kalemlerini kritiklik düzeyine göre Hayati (Vital), Gerekli (Essential) ve İstenen (Desirable) olarak ayıran yöntem; özellikle yedek parça ve sağlık stoklarında kullanılır.',
    anlam: [
      RP(
        B('VED analizi'),
        T(', stok kalemlerini parasal değere göre değil, üretim veya hizmetin sürekliliği için ne kadar kritik olduklarına göre sınıflandırır. Üç grup vardır: Vital (hayati), Essential (gerekli) ve Desirable (istenen).'),
      ),
      P('Hayati kalemler, eksikliği üretimi veya hizmeti tamamen durduran parçalardır; bunlarda stoksuz kalma kabul edilemez. İstenen kalemlerin eksikliği ise küçük rahatsızlıklar yaratır. VED, ABC analizini değer yerine kritiklikle tamamlar.'),
      P('Örneğin bir hastanede acil ilaçlar Vital, rutin sarf malzemeleri Essential, dekoratif ürünler Desirable olarak sınıflandırılabilir.'),
    ],
    ilgili: ['abc-analizi', 'emniyet-stogu', 'stok-kontrolu'],
  },
  {
    kelime: 'Stok Sayımı',
    slug: 'stok-sayimi',
    harf: 'S',
    kisaTanim:
      'Depodaki fiziksel stoğun fiilen sayılarak kayıtlarla karşılaştırılması işlemi; tüm stoğu kapsayan dönemsel sayım ya da bölüm bölüm yapılan döngüsel sayım şeklinde yürütülür.',
    anlam: [
      RP(
        B('Stok sayımı (stocktaking / physical count)'),
        T(', depodaki gerçek stok miktarının fiziksel olarak sayılması ve sistemdeki kayıtlarla karşılaştırılmasıdır. Amacı kayıt ile gerçeğin uyumunu doğrulamak ve sapmaların nedenini bulmaktır.'),
      ),
      P('İki temel yöntem vardır: tüm stoğun belirli aralıklarla bir kerede sayıldığı dönemsel sayım ve stoğun küçük gruplara bölünüp sırayla sürekli sayıldığı döngüsel sayım. Döngüsel sayım, operasyonu durdurmadan doğruluğu yüksek tutar.'),
      P('Sayım sonrası kayıt ile gerçek arasındaki fark, stok doğruluğu oranı olarak raporlanır ve düzeltici aksiyona girdi olur.'),
    ],
    ilgili: ['dongusel-sayim', 'stok-dogrulugu', 'stok-kontrolu'],
  },
  {
    kelime: 'Döngüsel Sayım',
    slug: 'dongusel-sayim',
    harf: 'D',
    kisaTanim:
      'Tüm stoğu tek seferde değil, küçük gruplara bölerek belirli bir takvimde sürekli sayma yöntemi; operasyonu durdurmadan stok doğruluğunu yüksek tutar.',
    anlam: [
      RP(
        B('Döngüsel sayım (cycle counting)'),
        T(', stoğun tamamını bir kerede saymak yerine küçük bölümlere ayırıp düzenli bir takvimle sürekli sayma yöntemidir. Böylece depo durmadan, yıl boyunca yayılmış küçük sayımlarla doğruluk korunur.'),
      ),
      P('Genellikle ABC analizine bağlanır: A grubu kalemler daha sık, C grubu daha seyrek sayılır. Bu yaklaşım, hataları erken yakalar ve dönemsel toplu sayımın yarattığı kesintiyi ortadan kaldırır.'),
      P('Örneğin her gün depodaki kalemlerin küçük bir bölümü sayılır; A kalemleri ayda bir, C kalemleri yılda bir kez ele alınabilir.'),
    ],
    ilgili: ['stok-sayimi', 'abc-analizi', 'stok-dogrulugu'],
  },
  {
    kelime: 'FIFO',
    slug: 'fifo',
    harf: 'F',
    kisaTanim:
      'İlk giren ilk çıkar (First In, First Out) prensibi; depoya önce giren stoğun önce kullanılmasını ya da satılmasını sağlayan stok akış ve değerleme yöntemidir.',
    anlam: [
      RP(
        B('FIFO (First In, First Out)'),
        T(', "ilk giren ilk çıkar" anlamına gelen stok akış prensibidir. Depoya önce giren parti önce sevk edilir; böylece eski stoklar bekletilmeden tüketilir.'),
      ),
      P('FIFO, raf ömrü olan gıda, ilaç ve kimyasal gibi ürünlerde eskimeyi ve fireyi azaltır. Muhasebede ise stok değerlemesinde kullanılır; satılan malın maliyeti en eski alış fiyatlarından hesaplanır.'),
      P('Enflasyonist dönemde FIFO, eski ve daha ucuz maliyetleri gidere yazdığı için raporlanan karı görece yüksek gösterir; bu yönüyle LIFO ve FEFO ile karşılaştırılır.'),
    ],
    ilgili: ['lifo', 'fefo', 'raf-omru'],
  },
  {
    kelime: 'LIFO',
    slug: 'lifo',
    harf: 'L',
    kisaTanim:
      'Son giren ilk çıkar (Last In, First Out) prensibi; depoya en son giren stoğun önce kullanıldığı ya da değerlemede son alış fiyatının önce gidere yazıldığı yöntemdir.',
    anlam: [
      RP(
        B('LIFO (Last In, First Out)'),
        T(', "son giren ilk çıkar" prensibidir; en son alınan stok önce kullanılır. Fiziksel akış olarak nadir tercih edilir çünkü eski stoklar dipte kalıp eskiyebilir.'),
      ),
      P('LIFO daha çok muhasebe değerlemesinde anlamlıdır. Enflasyonist ortamda son ve daha pahalı maliyetleri gidere yazdığı için raporlanan karı düşürür. Türkiye dahil birçok muhasebe standardında kullanımı sınırlandırılmıştır.'),
      P('FIFO ve FEFO ile karşılaştırıldığında LIFO, raf ömrü hassas ürünlerde uygun değildir; çünkü en eski stoklar sürekli bekletilir.'),
    ],
    ilgili: ['fifo', 'fefo', 'stok-degerleme'],
  },
  {
    kelime: 'FEFO',
    slug: 'fefo',
    harf: 'F',
    kisaTanim:
      'Son kullanma tarihi önce dolan ilk çıkar (First Expired, First Out) prensibi; raf ömrü olan ürünlerde fireyi en aza indirmek için tarihe göre sevkiyat yapar.',
    anlam: [
      RP(
        B('FEFO (First Expired, First Out)'),
        T(', "son kullanma tarihi önce dolan ilk çıkar" prensibidir. Sevkiyat sırası giriş tarihine değil, ürünün son kullanma tarihine göre belirlenir.'),
      ),
      P('FEFO, gıda, ilaç ve kozmetik gibi raf ömrü kritik ürünlerde FIFO yerine tercih edilir. Çünkü sonradan gelen bir parti, daha erken bozulacaksa önce sevk edilmelidir; bu da son kullanma tarihi kaynaklı fireyi azaltır.'),
      P('Örneğin depoya bugün gelen ama iki ay sonra son kullanma tarihi dolacak bir ürün, üç ay önce gelen ama daha geç bozulacak üründen önce çıkar.'),
    ],
    ilgili: ['fifo', 'raf-omru', 'parti-takibi'],
  },
  {
    kelime: 'Konsinye Stok',
    slug: 'konsinye-stok',
    harf: 'K',
    kisaTanim:
      'Mülkiyeti tedarikçide kalan ancak alıcının deposunda bulunan stok; alıcı yalnızca kullandığı ya da sattığı kadarının bedelini öder, kalanı tedarikçinin malıdır.',
    anlam: [
      RP(
        B('Konsinye stok (consignment stock)'),
        T(', tedarikçinin malını alıcının deposuna yerleştirdiği ama mülkiyetin kullanım ya da satış anına kadar tedarikçide kaldığı modeldir. Alıcı yalnızca tükettiği kadarını faturalandırır.'),
      ),
      P('Konsinye, alıcının sermaye bağlamadan ürünü elinin altında tutmasını sağlar; tedarikçi ise rafta görünürlük ve daha sıkı bir ticari ilişki kazanır. Stok riskinin büyük kısmı tedarikçide kalır.'),
      P('Tedarikçi yönetimli envanter (VMI) modelleri sıklıkla konsinye stokla birlikte uygulanır.'),
    ],
    ilgili: ['emanet-stok', 'tedarikci-yonetimli-envanter', 'tedarikci'],
  },
  {
    kelime: 'Emanet Stok',
    slug: 'emanet-stok',
    harf: 'E',
    kisaTanim:
      'İşletmenin deposunda bulunan ama mülkiyeti başka bir tarafa ait olan stok; konsinye düzeninde tedarikçinin alıcı deposunda tuttuğu mallar buna örnektir.',
    anlam: [
      RP(
        B('Emanet stok'),
        T(', fiziksel olarak işletmenin deposunda durduğu halde mülkiyeti üçüncü bir tarafa ait olan stoktur. Konsinye düzeninde tedarikçinin alıcı deposundaki malı tipik bir emanet stok örneğidir.'),
      ),
      P('Emanet stok, işletmenin kendi varlığı olmadığı için bilançoda kendi stoğundan ayrı izlenir. Buna karşılık fiziksel sayım, depolama ve doğruluk açısından kendi stoğuyla aynı titizlikle yönetilmesi gerekir.'),
      P('Sayım ve raporlamada emanet stoğun kendi stoktan net ayrılması, hem mali hem operasyonel hata riskini düşürür.'),
    ],
    ilgili: ['konsinye-stok', 'stok-dogrulugu', 'tedarikci'],
  },
  {
    kelime: 'Fire',
    slug: 'fire',
    harf: 'F',
    kisaTanim:
      'Üretim, taşıma veya depolama sırasında doğal olarak oluşan ve geri kazanılamayan stok kaybı; buharlaşma, dökülme, bozulma ve kırılma gibi nedenlerden kaynaklanır.',
    anlam: [
      RP(
        B('Fire'),
        T(', üretim, taşıma veya depolama sürecinde doğal nedenlerle oluşan ve geri kazanılamayan miktar kaybıdır. Buharlaşma, dökülme, kuruma, bozulma ve kırılma tipik fire kaynaklarıdır.'),
      ),
      P('Fire oranı çoğu sektörde belirli sınırlar içinde normal kabul edilir ve maliyetlendirmeye dahil edilir. Beklenenin üzerindeki fire ise süreçte bir sorun, yanlış depolama veya kalite problemi işaretidir.'),
      P('Hurda ve ıskartadan farkı, firenin genelde sürecin kaçınılmaz bir yan ürünü olmasıdır; örneğin metal kesiminde oluşan talaş kaybı.'),
    ],
    ilgili: ['hurda', 'iskarta', 'stok-yaslandirma'],
  },
  {
    kelime: 'Hurda',
    slug: 'hurda',
    harf: 'H',
    kisaTanim:
      'Üretim sürecinde standartları sağlamayan veya kullanılamaz hale gelen ve genelde geri dönüşüm dışında değeri kalmayan malzeme; çoğunlukla atık olarak elden çıkarılır.',
    anlam: [
      RP(
        B('Hurda (scrap)'),
        T(', üretim sırasında istenen kaliteyi sağlamayan veya işlevini yitiren ve normal şekilde kullanılamayan malzemedir. Çoğunlukla geri dönüşüme gönderilir ya da düşük bedelle elden çıkarılır.'),
      ),
      P('Hurda oranı, üretim verimliliğinin önemli bir göstergesidir. Yüksek hurda; hatalı süreç, kötü hammadde kalitesi veya yetersiz kontrol anlamına gelir ve doğrudan maliyeti artırır.'),
      P('Bazı durumlarda hurda yeniden işlemeyle kurtarılabilirken, kurtarılamayanlar atık olarak değerlendirilir.'),
    ],
    ilgili: ['iskarta', 'fire', 'yeniden-isleme'],
  },
  {
    kelime: 'SKU',
    slug: 'sku',
    harf: 'S',
    kisaTanim:
      'Stok takip birimi (Stock Keeping Unit); her benzersiz ürün varyantını ayırt etmek için atanan tekil tanımlayıcı koddur. Renk, beden ve ambalaj gibi farklar ayrı SKU oluşturur.',
    anlam: [
      RP(
        B('SKU (Stock Keeping Unit, stok takip birimi)'),
        T(', bir işletmenin sattığı veya tuttuğu her benzersiz ürün varyantına atadığı tekil tanımlayıcı koddur. Aynı tişörtün farklı renk ve bedenleri ayrı SKU’lardır.'),
      ),
      P('SKU, barkod veya GTIN gibi evrensel kodlardan farklı olarak işletmeye özgüdür; firma kendi mantığına göre tanımlar. Stok takibi, satış raporlaması ve sipariş yönetimi SKU bazında yürür.'),
      P('SKU sayısı arttıkça stok yönetimi karmaşıklaşır; bu yüzden çok geniş ürün yelpazesi olan işletmeler ABC analizini SKU bazında uygular.'),
    ],
    ilgili: ['barkod', 'seri-numarasi', 'abc-analizi'],
  },
  {
    kelime: 'Parti (Lot) Büyüklüğü',
    slug: 'parti-buyuklugu',
    harf: 'P',
    kisaTanim:
      'Bir seferde üretilen veya sipariş edilen miktar; lot büyüklüğü artarsa sipariş/hazırlık maliyeti birim başına düşer ama taşıma maliyeti yükselir.',
    anlam: [
      RP(
        B('Parti büyüklüğü (lot size)'),
        T(', tek bir üretim çevriminde veya tek bir siparişte ele alınan miktardır. Büyük partiler sipariş ve hazırlık maliyetini birim başına seyreltir; küçük partiler ise stok ve taşıma maliyetini azaltır.'),
      ),
      P('Optimal parti büyüklüğünü bulmak, sipariş maliyeti ile taşıma maliyeti arasındaki dengeyi kurmaktır. EOQ tam olarak bu sorunu çözer; yalın üretim ise küçük partilerle akışı düzgünleştirmeyi hedefler.'),
      RP(
        T('Optimal parti miktarını '),
        L('EOQ hesaplama aracıyla', '/araclar/eoq-hesaplama'),
        T(' belirleyebilirsin.'),
      ),
    ],
    ilgili: ['ekonomik-siparis-miktari', 'minimum-siparis-miktari', 'hazirlik-suresi'],
  },
  {
    kelime: 'Minimum Sipariş Miktarı',
    slug: 'minimum-siparis-miktari',
    harf: 'M',
    kisaTanim:
      'Bir tedarikçinin kabul ettiği en küçük sipariş miktarı (MOQ); alıcıyı bazen ihtiyacından fazla sipariş vermeye zorlar ve optimal sipariş miktarını kısıtlar.',
    anlam: [
      RP(
        B('Minimum sipariş miktarı (minimum order quantity, MOQ)'),
        T(', bir tedarikçinin bir kalem için kabul ettiği en düşük sipariş adedidir. Tedarikçi, üretim veya lojistik maliyetlerini karşılamak için bu alt sınırı koyar.'),
      ),
      P('MOQ, hesaplanan ekonomik sipariş miktarının altında kalan ihtiyaçlarda alıcıyı zorda bırakır; ya gereğinden fazla sipariş verilir ya da alternatif tedarikçi aranır. Bu durum çevrim stoğunu ve taşıma maliyetini artırabilir.'),
      RP(
        T('MOQ kısıtı, '),
        L('EOQ hesabının', '/araclar/eoq-hesaplama'),
        T(' sonucu uygulanırken dikkate alınmalıdır.'),
      ),
    ],
    ilgili: ['parti-buyuklugu', 'ekonomik-siparis-miktari', 'tedarikci'],
  },
  {
    kelime: 'Bekleme Süresi',
    slug: 'bekleme-suresi',
    harf: 'B',
    kisaTanim:
      'Bir malzeme veya siparişin bir sonraki işleme başlanana kadar atıl şekilde beklediği süre; yalın üretimde israf kabul edilen yedi tür kayıptan biridir.',
    anlam: [
      RP(
        B('Bekleme süresi (waiting / queue time)'),
        T(', bir parça veya siparişin bir işlem bittikten sonra bir sonraki işlemin başlamasını beklerken atıl geçirdiği süredir. Üretimde toplam çevrim süresinin önemli bir bölümünü oluşturur.'),
      ),
      P('Yalın üretim felsefesinde bekleme, değer katmayan yedi temel israftan biridir. Bekleme süreleri kısaldıkça toplam tedarik süresi ve süreçteki yarı mamul stoğu da azalır.'),
      P('Örneğin bir parça bir makinede 5 dakikada işlenip 2 saat sıra bekliyorsa, asıl iyileştirme alanı işlem değil bekleme süresidir.'),
    ],
    ilgili: ['cevrim-suresi', 'yalin-uretim', 'darbogaz'],
  },
  {
    kelime: 'Hizmet Seviyesi',
    slug: 'hizmet-seviyesi',
    harf: 'H',
    kisaTanim:
      'Talebin stoktan karşılanabilme olasılığı; örneğin yüzde 95 hizmet seviyesi, siparişlerin yüzde 95’inin anında karşılandığı anlamına gelir ve emniyet stoğunu doğrudan belirler.',
    anlam: [
      RP(
        B('Hizmet seviyesi (service level)'),
        T(', bir talebin stoktan anında karşılanabilme olasılığıdır. Yüzde 95 hizmet seviyesi, ortalama olarak talebin yüzde 95’inin stok varken karşılandığı, yüzde 5 ihtimalle stoksuz kalındığı anlamına gelir.'),
      ),
      P('Hedeflenen hizmet seviyesi yükseldikçe gereken emniyet stoğu artar; çünkü daha nadir stoksuz kalmak için daha büyük bir tampon gerekir. Yüzde 99 ile yüzde 100 arasındaki son adımın maliyeti genelde çok yüksektir.'),
      RP(
        T('Hizmet seviyesi, '),
        L('emniyet stoğu hesaplamasında', '/araclar/emniyet-stogu-hesaplama'),
        T(' Z katsayısı üzerinden tampon miktarını belirler.'),
      ),
    ],
    ilgili: ['emniyet-stogu', 'stoksuzluk-maliyeti', 'backorder'],
  },
  {
    kelime: 'Stok Devir Oranı',
    slug: 'stok-devir-orani',
    harf: 'S',
    kisaTanim:
      'Stok devir hızının sayısal ifadesi; bir dönemde stoğun kaç kez döndüğünü gösteren orandır ve genelde "stok devir hızı" ile eş anlamlı kullanılır.',
    anlam: [
      RP(
        B('Stok devir oranı'),
        T(', stok devir hızının orana dökülmüş halidir ve bir dönemde stoğun kaç kez yenilendiğini gösterir. Pratikte "stok devir hızı" terimiyle çoğunlukla aynı anlamda kullanılır.'),
      ),
      P('Oran, satılan malın maliyetinin ortalama stoğa bölünmesiyle bulunur. Örneğin oranın 6 çıkması, stoğun bir yılda altı kez tamamen satılıp yenilendiğini ifade eder.'),
      RP(
        T('Kendi oranını '),
        L('stok devir hızı aracıyla', '/araclar/stok-devir-hizi-hesaplama'),
        T(' hesaplayabilirsin.'),
      ),
    ],
    ilgili: ['stok-devir-hizi', 'stokta-kalma-suresi', 'ortalama-stok'],
  },
  {
    kelime: 'Stokta Kalma Süresi',
    slug: 'stokta-kalma-suresi',
    harf: 'S',
    kisaTanim:
      'Stoğun ortalama olarak kaç gün depoda beklediğini gösteren ölçü (DSI); 365’in stok devir hızına bölünmesiyle bulunur ve devir hızının gün cinsinden karşılığıdır.',
    anlam: [
      RP(
        B('Stokta kalma süresi (days sales of inventory, DSI)'),
        T(', stoğun ortalama olarak kaç gün depoda beklediğini gösteren ölçüdür. 365 gün stok devir hızına bölünerek hesaplanır; devir hızının gün cinsinden karşılığıdır.'),
      ),
      P('Örneğin stok devir hızı 6 ise, stokta kalma süresi yaklaşık 60 gündür; yani bir ürün ortalama iki ay depoda bekler. Süre kısaldıkça sermaye daha hızlı serbest kalır ve eskime riski azalır.'),
      RP(
        T('Bu ölçü, '),
        L('stok devir hızının', '/icerik/stok-devir-hizi-nedir'),
        T(' gün cinsinden yorumlanmış halidir.'),
      ),
    ],
    ilgili: ['stok-devir-hizi', 'stok-devir-orani', 'ortalama-stok'],
  },
  {
    kelime: 'Backorder',
    slug: 'backorder',
    harf: 'B',
    kisaTanim:
      'Talep edildiği anda stokta olmayan ama iptal edilmeyip sonradan karşılanmak üzere kayıt altına alınan sipariş; karşılanamayan ama kaybedilmeyen talebi ifade eder.',
    anlam: [
      RP(
        B('Backorder (ön sipariş / karşılanamayan talep)'),
        T(', müşteri talep ettiği anda ürün stokta olmadığı için hemen teslim edilemeyen ama iptal de edilmeyip stok geldiğinde karşılanmak üzere bekletilen sipariştir. Satış kaybedilmez, ertelenir.'),
      ),
      P('Backorder, tamamen kaybedilen satıştan daha az zararlıdır ama yine de teslim gecikmesi, müşteri memnuniyetsizliği ve ek lojistik maliyeti yaratır. Yüksek backorder oranı, emniyet stoğunun veya hizmet seviyesinin yetersiz olduğunu gösterir.'),
      RP(
        T('Backorder riskini, '),
        L('emniyet stoğu', '/araclar/emniyet-stogu-hesaplama'),
        T(' ve hizmet seviyesi seçimiyle yönetebilirsin.'),
      ),
    ],
    ilgili: ['stoksuzluk-maliyeti', 'hizmet-seviyesi', 'bekleyen-siparis'],
  },
  {
    kelime: 'Kanban',
    slug: 'kanban',
    harf: 'K',
    kisaTanim:
      'Üretim ve malzeme akışını görsel kartlar veya sinyallerle yöneten çekme sistemi; bir sonraki adım tükettikçe önceki adıma yeniden üretim ya da tedarik sinyali gönderir.',
    anlam: [
      RP(
        B('Kanban'),
        T(', Japonca "kart" anlamına gelir ve üretimi talebe göre tetikleyen görsel bir çekme sistemidir. Bir istasyon malzemeyi tükettikçe önceki istasyona kart veya sinyalle "yeniden üret" mesajı gönderir.'),
      ),
      P('Kanban, fazla üretimi ve süreçteki yarı mamul stoğunu sınırlar; çünkü yalnızca tüketilen kadar yeniden üretilir. Yalın üretimin ve tam zamanında (JIT) yaklaşımının temel uygulama araçlarından biridir.'),
      P('Günümüzde fiziksel kart yerine dijital kanban panoları da kullanılır; aynı çekme mantığı yazılımla yönetilir.'),
    ],
    ilgili: ['jit', 'yalin-uretim', 'cekme-sistemi'],
  },
  {
    kelime: 'JIT (Tam Zamanında Üretim)',
    slug: 'jit',
    harf: 'J',
    kisaTanim:
      'Malzemeyi ve ürünü tam ihtiyaç duyulduğu anda, ihtiyaç duyulduğu kadar üretme veya tedarik etme yaklaşımı; stoğu en aza indirerek israfı azaltmayı hedefler.',
    anlam: [
      RP(
        B('JIT (just-in-time, tam zamanında üretim)'),
        T(', malzemenin ve ürünün ne erken ne geç, tam ihtiyaç duyulduğu anda ve gereken kadar sağlanmasını hedefleyen üretim felsefesidir. Amacı stoğu ve onunla gelen israfı en aza indirmektir.'),
      ),
      P('JIT, düşük stokla çalıştığı için tedarik güvenilirliğine ve kaliteye bağımlıdır; bir aksama tüm hattı durdurabilir. Bu yüzden güçlü tedarikçi ilişkileri, kısa tedarik süreleri ve kanban gibi çekme mekanizmalarıyla desteklenir.'),
      P('Toyota Üretim Sistemi’nin temelinde yer alır ve yalın üretimle yakından ilişkilidir.'),
    ],
    ilgili: ['yalin-uretim', 'kanban', 'cekme-sistemi'],
  },
  {
    kelime: 'Yalın Üretim',
    slug: 'yalin-uretim',
    harf: 'Y',
    kisaTanim:
      'Müşteriye değer katmayan her türlü israfı (fazla stok, bekleme, fazla üretim, taşıma) ortadan kaldırmayı hedefleyen üretim felsefesi; Toyota Üretim Sistemi’ne dayanır.',
    anlam: [
      RP(
        B('Yalın üretim (lean manufacturing)'),
        T(', müşteriye değer katmayan tüm faaliyetleri israf olarak görüp sistematik biçimde azaltmayı amaçlayan üretim yaklaşımıdır. Toyota Üretim Sistemi’nden doğmuştur.'),
      ),
      P('Yalın düşünce yedi temel israfı hedef alır: fazla üretim, bekleme, gereksiz taşıma, aşırı işleme, fazla stok, gereksiz hareket ve hatalı ürün. Stok da bir israf türü olarak görülür ve mümkün olduğunca azaltılır.'),
      P('Kanban, JIT, sürekli iyileştirme (kaizen) ve değer akışı haritalama yalın üretimin temel araçlarındandır.'),
    ],
    ilgili: ['jit', 'kanban', 'cekme-sistemi'],
  },
  {
    kelime: 'MRP (Malzeme İhtiyaç Planlaması)',
    slug: 'mrp',
    harf: 'M',
    kisaTanim:
      'Ana üretim planı, ürün ağacı ve eldeki stoktan yola çıkarak hangi malzemenin ne zaman ve ne kadar gerektiğini hesaplayan planlama sistemi; net ihtiyaç ve sipariş planı üretir.',
    anlam: [
      RP(
        B('MRP (material requirements planning, malzeme ihtiyaç planlaması)'),
        T(', bir üretim planını gerçekleştirmek için hangi malzemeden ne zaman ve ne kadar gerektiğini hesaplayan sistemdir. Üç temel girdiyi kullanır: ana üretim çizelgesi, ürün ağacı (BOM) ve mevcut stok.'),
      ),
      P('MRP önce brüt ihtiyacı belirler, ardından eldeki stoğu ve bekleyen siparişleri düşerek net ihtiyacı bulur. Tedarik sürelerini de hesaba katarak sipariş ve üretim emirlerini doğru zamana yerleştirir.'),
      P('MRP, sezgisel sipariş yerine hesaplanmış, talebe bağlı bir planlama sağlar; bu yönüyle bağımsız talep için kullanılan EOQ ve ROP yaklaşımlarından ayrılır.'),
    ],
    ilgili: ['mrp-ii', 'urun-agaci', 'ana-uretim-cizelgesi'],
  },
  {
    kelime: 'MRP II',
    slug: 'mrp-ii',
    harf: 'M',
    kisaTanim:
      'Malzeme ihtiyaç planlamasını kapasite, finans ve diğer kaynaklarla bütünleştiren genişletilmiş üretim kaynakları planlaması (Manufacturing Resource Planning); ERP’nin öncülüdür.',
    anlam: [
      RP(
        B('MRP II (manufacturing resource planning, üretim kaynakları planlaması)'),
        T(', klasik MRP’yi yalnızca malzemeyle sınırlı kalmaktan çıkarıp kapasite planlama, finans, satın alma ve insan gücü gibi kaynakları da kapsayacak biçimde genişleten sistemdir.'),
      ),
      P('MRP sadece "hangi malzeme ne zaman gerekli" sorusunu yanıtlarken, MRP II "bu planı gerçekleştirecek kapasitem ve kaynağım var mı" sorusunu da ekler. Böylece planlama daha gerçekçi ve bütünleşik hale gelir.'),
      P('MRP II, zamanla muhasebe, satış ve dağıtımı da içine alarak modern ERP sistemlerinin temelini oluşturmuştur.'),
    ],
    ilgili: ['mrp', 'erp', 'kapasite-planlama'],
  },
  {
    kelime: 'ERP',
    slug: 'erp',
    harf: 'E',
    kisaTanim:
      'Kurumsal kaynak planlaması (Enterprise Resource Planning); üretim, stok, satın alma, finans, satış ve insan kaynaklarını tek bir entegre veri tabanı üzerinde birleştiren yazılım sistemidir.',
    anlam: [
      RP(
        B('ERP (enterprise resource planning, kurumsal kaynak planlaması)'),
        T(', bir işletmenin üretim, stok, satın alma, finans, satış ve insan kaynakları gibi tüm temel süreçlerini ortak bir veri tabanı üzerinde birleştiren bütünleşik yazılımdır.'),
      ),
      P('ERP’nin temel değeri tek doğruluk kaynağıdır; bir departmandaki veri tüm sisteme yansır, böylece kopukluk ve tekrar eden veri girişi azalır. Stok yönetimi, ERP’nin merkezi modüllerinden biridir.'),
      P('ERP, MRP ve MRP II’nin evrimleşmiş, tüm işletmeyi kapsayan halidir; SAP, Oracle ve birçok yerli çözüm bu kategoridedir.'),
    ],
    ilgili: ['mrp-ii', 'mrp', 'depo-yonetimi'],
  },
  {
    kelime: 'Üretim Planlama',
    slug: 'uretim-planlama',
    harf: 'Ü',
    kisaTanim:
      'Talebi karşılamak için neyin, ne zaman, ne kadar ve hangi kaynaklarla üretileceğini belirleme süreci; talep tahmini, kapasite ve stoğu bir araya getirerek üretim takvimini oluşturur.',
    anlam: [
      RP(
        B('Üretim planlama (production planning)'),
        T(', gelecekteki talebi karşılamak için hangi ürünün ne zaman, ne miktarda ve hangi kaynaklarla üretileceğini belirleme sürecidir. Talep tahmini, mevcut stok, kapasite ve tedarik sürelerini birlikte değerlendirir.'),
      ),
      P('İyi bir üretim planı, ne stoksuz kalıp talebi kaçıracak ne de gereğinden fazla üretip stok biriktirecek şekilde dengeyi kurar. Çıktısı genellikle ana üretim çizelgesi (MPS) olarak somutlaşır.'),
      P('Üretim planlama; talep tahmini, MRP, kapasite planlama ve çizelgeleme adımlarını birbirine bağlayan üst düzey bir koordinasyondur.'),
    ],
    ilgili: ['ana-uretim-cizelgesi', 'kapasite-planlama', 'cizelgeleme'],
  },
  {
    kelime: 'Ana Üretim Çizelgesi',
    slug: 'ana-uretim-cizelgesi',
    harf: 'A',
    kisaTanim:
      'Hangi bitmiş ürünün hangi dönemde ne kadar üretileceğini gösteren detaylı plan (MPS); üretim planını somut, zaman bazlı bir programa dönüştürür ve MRP’yi besler.',
    anlam: [
      RP(
        B('Ana üretim çizelgesi (master production schedule, MPS)'),
        T(', hangi bitmiş ürünün hangi haftada veya günde ne kadar üretileceğini belirten ayrıntılı plandır. Üst düzey üretim planını, somut ve zaman bazlı bir programa dönüştürür.'),
      ),
      P('MPS, MRP sisteminin temel girdisidir; "ne kadar mamul, ne zaman" bilgisi olmadan malzeme ihtiyacı hesaplanamaz. Talep tahmini, kesin siparişler ve eldeki stok dengelenerek oluşturulur.'),
      P('İyi kurgulanmış bir MPS, kapasiteyi aşmadan teslim taahhütlerini karşılayacak gerçekçi bir üretim ritmi sağlar.'),
    ],
    ilgili: ['uretim-planlama', 'mrp', 'kapasite-planlama'],
  },
  {
    kelime: 'Kapasite Planlama',
    slug: 'kapasite-planlama',
    harf: 'K',
    kisaTanim:
      'Üretim planını gerçekleştirmek için gereken makine, işgücü ve zaman kaynağının yeterli olup olmadığını belirleme süreci; talep ile üretim kapasitesini eşleştirir.',
    anlam: [
      RP(
        B('Kapasite planlama (capacity planning)'),
        T(', bir üretim planını hayata geçirmek için gereken makine, işgücü ve zaman kaynağının mevcut kapasiteyle karşılanıp karşılanamayacağını belirleme sürecidir. Talep ile üretebilme gücünü eşleştirir.'),
      ),
      P('Kapasite yetersizse plan gerçekçi değildir; fazla kapasite ise atıl maliyet yaratır. Bu nedenle kapasite planlama, üretim planının uygulanabilirliğini test eden kritik bir kontrol adımıdır.'),
      P('Darboğaz iş istasyonları kapasiteyi sınırladığı için, kapasite planlamada öncelikle bu darboğazlar dikkate alınır.'),
    ],
    ilgili: ['uretim-planlama', 'darbogaz', 'ana-uretim-cizelgesi'],
  },
  {
    kelime: 'Çizelgeleme',
    slug: 'cizelgeleme',
    harf: 'Ç',
    kisaTanim:
      'İş emirlerinin hangi makinede, hangi sırayla ve hangi zaman aralığında işleneceğini belirleme faaliyeti; üretim planını saatlik, operasyon düzeyinde uygulamaya çevirir.',
    anlam: [
      RP(
        B('Çizelgeleme (scheduling)'),
        T(', işlerin hangi makinede, hangi sırayla ve hangi zaman diliminde yapılacağını belirleyen operasyonel planlamadır. Üretim planını ve ana üretim çizelgesini saatlik, atölye seviyesinde uygulamaya döker.'),
      ),
      P('İyi bir çizelge, makinelerin atıl kalma süresini azaltır, teslim tarihlerini tutturur ve darboğazları gözetir. Sıralama kuralları (örneğin en kısa işlem süresi önce) farklı amaçlara göre seçilir.'),
      P('Çizelgeleme, kapasiteyi gün gün gerçeğe dönüştüren son planlama katmanıdır; planlama ile fiili üretim arasındaki köprüdür.'),
    ],
    ilgili: ['is-emri', 'kapasite-planlama', 'darbogaz'],
  },
  {
    kelime: 'İş Emri',
    slug: 'is-emri',
    harf: 'İ',
    kisaTanim:
      'Belirli bir ürünün belirli miktarda üretilmesi için verilen resmi talimat; ne, ne kadar, hangi rotayla ve ne zaman üretileceğini tanımlayan üretim belgesidir.',
    anlam: [
      RP(
        B('İş emri (work order)'),
        T(', belirli bir ürünün belirli bir miktarda üretilmesi için atölyeye verilen resmi talimattır. Hangi ürünün, ne kadar, hangi operasyon rotasıyla ve hangi tarihte üretileceğini tanımlar.'),
      ),
      P('İş emri, planlamanın somut üretim faaliyetine dönüştüğü belgedir. Üzerinde tüketilen malzeme, harcanan işçilik ve oluşan hurda kaydedilerek maliyet ve verimlilik takibi yapılır.'),
      P('MRP ve çizelgeleme sonucu üretilen iş emirleri, üretim sahasının günlük çalışma listesini oluşturur.'),
    ],
    ilgili: ['rota', 'cizelgeleme', 'urun-agaci'],
  },
  {
    kelime: 'Rota',
    slug: 'rota',
    harf: 'R',
    kisaTanim:
      'Bir ürünün üretilmesi için gereken operasyonların sırasını, hangi makinede yapılacağını ve standart sürelerini tanımlayan belge; ürün ağacının "nasıl üretilir" tarafıdır.',
    anlam: [
      RP(
        B('Rota (operasyon rotası, routing)'),
        T(', bir ürünün üretilmesi için izlenecek operasyonların sırasını, her operasyonun hangi iş istasyonunda yapılacağını ve standart sürelerini tanımlayan belgedir. "Nasıl üretilir" sorusunun yanıtıdır.'),
      ),
      P('Ürün ağacı malzemeleri (ne lazım) tanımlarken, rota süreci (nasıl yapılır) tanımlar. İkisi birlikte üretim planlamanın, kapasite hesabının ve maliyetlendirmenin temelini oluşturur.'),
      P('Rota üzerindeki standart süreler, çizelgeleme ve kapasite planlamada işlerin ne kadar süreceğini öngörmek için kullanılır.'),
    ],
    ilgili: ['urun-agaci', 'is-emri', 'cevrim-suresi'],
  },
  {
    kelime: 'Ürün Ağacı (BOM)',
    slug: 'urun-agaci',
    harf: 'Ü',
    kisaTanim:
      'Bir bitmiş ürünü oluşturmak için gereken tüm hammadde, parça ve yarı mamulün miktarlarıyla birlikte hiyerarşik listesi (Bill of Materials); MRP’nin temel girdisidir.',
    anlam: [
      RP(
        B('Ürün ağacı (bill of materials, BOM)'),
        T(', bir bitmiş ürünü üretmek için gereken tüm hammadde, parça ve yarı mamulün, miktarlarıyla birlikte hiyerarşik dökümüdür. "Bu ürün hangi parçalardan, ne kadar oluşur" sorusunu yanıtlar.'),
      ),
      P('Ürün ağacı, MRP’nin malzeme ihtiyacını hesaplamak için kullandığı temel girdidir. Bir bisiklet ağacında iki teker, bir gövde, bir zincir gibi alt bileşenler ve bunların alt parçaları yer alır.'),
      P('Rota ürünün nasıl üretileceğini, ürün ağacı ise nelerden üretileceğini tanımlar; ikisi birlikte üretim verisinin omurgasıdır.'),
    ],
    ilgili: ['rota', 'mrp', 'brut-net-ihtiyac'],
  },
  {
    kelime: 'Darboğaz',
    slug: 'darbogaz',
    harf: 'D',
    kisaTanim:
      'Bir üretim akışında kapasitesi en düşük olan ve tüm sistemin hızını sınırlayan istasyon ya da kaynak; toplam çıktı, darboğazın kapasitesiyle sınırlıdır.',
    anlam: [
      RP(
        B('Darboğaz (bottleneck)'),
        T(', bir üretim hattında kapasitesi en düşük olan ve dolayısıyla tüm akışın hızını belirleyen iş istasyonu veya kaynaktır. Sistemin toplam çıktısı, bu en zayıf halkanın kapasitesini geçemez.'),
      ),
      P('Kısıtlar teorisine göre iyileştirme önce darboğaza yapılmalıdır; darboğaz olmayan bir istasyonu hızlandırmak toplam çıktıyı artırmaz, sadece önünde stok birikmesine yol açar.'),
      P('Örneğin saatte 100 parça işleyen bir hatta bir istasyon saatte 60 parça işliyorsa, hattın gerçek kapasitesi 60’dır; darboğaz orasıdır.'),
    ],
    ilgili: ['kapasite-planlama', 'cevrim-suresi', 'takt-suresi'],
  },
  {
    kelime: 'Çevrim Süresi',
    slug: 'cevrim-suresi',
    harf: 'Ç',
    kisaTanim:
      'Bir birim ürünün üretim sürecinin başından sonuna kadar geçen toplam süre ya da ardışık iki ürünün hattan çıkması arasındaki süre; verimlilik ve teslim hızının temel ölçüsüdür.',
    anlam: [
      RP(
        B('Çevrim süresi (cycle time)'),
        T(', bir ürünün üretim sürecini tamamlaması için geçen süredir. İki yaygın anlamı vardır: bir parçanın işlenmeye başlamasından bitmesine kadar geçen süre veya ardışık iki ürünün hattan çıkması arasındaki süre.'),
      ),
      P('Çevrim süresi; işlem, bekleme, hazırlık ve taşıma sürelerinin toplamından oluşur. Bunların çoğu değer katmayan zamandır, dolayısıyla iyileştirmenin asıl alanı bekleme ve hazırlık süreleridir.'),
      P('Çevrim süresi takt süresinden kısaysa hat talebe yetişebilir; uzunsa darboğaz vardır ve teslimat aksar.'),
    ],
    ilgili: ['takt-suresi', 'bekleme-suresi', 'darbogaz'],
  },
  {
    kelime: 'Hazırlık (Setup) Süresi',
    slug: 'hazirlik-suresi',
    harf: 'H',
    kisaTanim:
      'Bir makineyi veya hattı bir üründen başka bir ürüne geçirmek için yapılan ayar, temizlik ve değişim süresi; uzun setup süreleri büyük parti üretimini teşvik eder.',
    anlam: [
      RP(
        B('Hazırlık süresi (setup / changeover time)'),
        T(', bir makineyi bir üründen başka bir ürüne geçirmek için harcanan ayar, kalıp değişimi, temizlik ve test süresidir. Bu süre boyunca makine üretim yapmaz, yani bir maliyettir.'),
      ),
      P('Hazırlık süresi uzunsa, işletme bu maliyeti dağıtmak için büyük partiler üretmeye yönelir; bu da stoğu artırır. Süreyi kısaltmak (SMED gibi teknikler) küçük partileri ekonomik kılar ve yalın akışı destekler.'),
      P('Hazırlık süresi, EOQ ve parti büyüklüğü kararlarının arkasındaki sipariş/hazırlık maliyetinin üretimdeki karşılığıdır.'),
    ],
    ilgili: ['siparis-maliyeti', 'parti-buyuklugu', 'oee'],
  },
  {
    kelime: 'OEE (Toplam Ekipman Etkinliği)',
    slug: 'oee',
    harf: 'O',
    kisaTanim:
      'Bir ekipmanın kullanılabilirlik, performans ve kalite boyutlarını tek bir orana indirgeyen verimlilik ölçütü (Overall Equipment Effectiveness); ideal üretimin ne kadarına ulaşıldığını gösterir.',
    anlam: [
      RP(
        B('OEE (overall equipment effectiveness, toplam ekipman etkinliği)'),
        T(', bir makinenin ya da hattın gerçek üretkenliğini tek bir yüzdeyle ölçen göstergedir. Üç bileşenin çarpımıdır: kullanılabilirlik, performans ve kalite.'),
      ),
      UL([
        'Kullanılabilirlik: planlı sürenin ne kadarında makine fiilen çalıştı (duruşların etkisi).',
        'Performans: çalışırken ideal hıza göre ne kadar üretildi (yavaşlamaların etkisi).',
        'Kalite: üretilenin ne kadarı kusursuz çıktı (fire ve ıskartanın etkisi).',
      ]),
      P('Üç oranın çarpımı OEE’yi verir; örneğin her biri yüzde 90 ise OEE yaklaşık yüzde 73 olur. Dünya standardı olarak yüzde 85 ve üzeri çok iyi kabul edilir.'),
    ],
    ilgili: ['hazirlik-suresi', 'cevrim-suresi', 'iskarta'],
  },
  {
    kelime: 'Takt Süresi',
    slug: 'takt-suresi',
    harf: 'T',
    kisaTanim:
      'Müşteri talebini tam karşılamak için bir ürünün ne sıklıkla üretilmesi gerektiğini belirleyen ritim; kullanılabilir üretim süresinin müşteri talebine bölünmesiyle bulunur.',
    anlam: [
      RP(
        B('Takt süresi (takt time)'),
        T(', müşteri talebine tam yetişmek için bir birim ürünün hangi aralıkla üretilmesi gerektiğini gösteren üretim ritmidir. Kullanılabilir üretim süresinin müşteri talebine bölünmesiyle bulunur.'),
      ),
      P('Örneğin vardiyada 480 dakika çalışıp 240 ürün talep ediliyorsa, takt süresi 2 dakikadır; yani her 2 dakikada bir ürün çıkmalıdır. Çevrim süresi bu hedeften uzunsa talep karşılanamaz.'),
      P('Takt süresi, yalın üretimde hattı talebe göre dengelemenin ve kapasiteyi planlamanın referans ritmidir.'),
    ],
    ilgili: ['cevrim-suresi', 'yalin-uretim', 'kapasite-planlama'],
  },
  {
    kelime: 'Talep Tahmini',
    slug: 'talep-tahmini',
    harf: 'T',
    kisaTanim:
      'Geçmiş veriler, eğilimler ve mevsimsellik kullanılarak gelecekteki talebin öngörülmesi; stok, üretim ve satın alma planlamasının tümünün başladığı temel girdidir.',
    anlam: [
      RP(
        B('Talep tahmini (demand forecasting)'),
        T(', geçmiş satış verileri, trendler, mevsimsellik ve dış etkenler kullanılarak gelecekteki talebin öngörülmesidir. Stok seviyeleri, üretim planı ve satın alma kararlarının hepsi bu tahminden beslenir.'),
      ),
      P('Tahmin asla tam doğru olmaz; bu yüzden tahmin hatasına karşı emniyet stoğu tutulur. Talep ne kadar değişken ve öngörülemezse, hata payı ve gereken tampon o kadar büyür.'),
      RP(
        T('Talep değişkenliği, '),
        L('emniyet stoğu hesabının', '/araclar/emniyet-stogu-hesaplama'),
        T(' standart sapma girdisini doğrudan belirler.'),
      ),
    ],
    ilgili: ['talep-degiskenligi', 'mevsimsellik', 'emniyet-stogu'],
  },
  {
    kelime: 'Yığın (Push) Üretim',
    slug: 'push-uretim',
    harf: 'Y',
    kisaTanim:
      'Üretimin gerçek talep yerine tahmine göre önceden planlandığı sistem; ürünler talep gelmeden üretilip stoğa yığılır, bu da fazla stok riski taşır.',
    anlam: [
      RP(
        B('Yığın üretim (push system)'),
        T(', üretimin müşteri talebine göre değil, talep tahminine dayanarak önceden planlandığı sistemdir. Ürünler talep gelmeden üretilip stoğa itilir, talep geldiğinde stoktan karşılanır.'),
      ),
      P('Push sistemi, kesintisiz üretim ve ölçek ekonomisi sağlar ama tahmin yanlışsa fazla stok veya ölü stok riski yaratır. MRP temelde bir push yaklaşımıdır; planlanan üretimi öne iter.'),
      P('Çekme (pull) sistemiyle temel farkı, push’ta üretimin tahmini, pull’da ise gerçek tüketimin tetiklemesidir.'),
    ],
    ilgili: ['cekme-sistemi', 'mrp', 'talep-tahmini'],
  },
  {
    kelime: 'Çekme (Pull) Sistemi',
    slug: 'cekme-sistemi',
    harf: 'Ç',
    kisaTanim:
      'Üretimin tahmine değil, gerçek tüketime göre tetiklendiği sistem; bir sonraki adım malzeme çektikçe önceki adım üretir, böylece fazla stok ve israf azalır.',
    anlam: [
      RP(
        B('Çekme sistemi (pull system)'),
        T(', üretimin önceden tahmine göre değil, gerçek tüketim tarafından tetiklendiği yaklaşımdır. Bir istasyon malzeme çektikçe önceki istasyon yalnızca o kadarını yeniden üretir.'),
      ),
      P('Pull sistemi fazla üretimi ve aradaki yarı mamul stoğunu sınırlar; çünkü hiçbir adım talep olmadan üretmez. Kanban, çekme sistemini işleten en yaygın araçtır ve JIT ile yalın üretimin temelindedir.'),
      P('Push sistemi üretimi öne iterken, pull sistemi talebi geriye doğru çeker; bu fark stok seviyelerini belirgin biçimde etkiler.'),
    ],
    ilgili: ['push-uretim', 'kanban', 'jit'],
  },
  {
    kelime: 'Depo Yönetimi (WMS)',
    slug: 'depo-yonetimi',
    harf: 'D',
    kisaTanim:
      'Deponun mal kabul, yerleştirme, toplama ve sevkiyat operasyonlarını planlayıp kontrol eden sistem; depo yönetim yazılımı (WMS) bu süreçleri dijitalleştirir.',
    anlam: [
      RP(
        B('Depo yönetimi (warehouse management system, WMS)'),
        T(', deponun fiziksel operasyonlarını (mal kabul, raf yerleştirme, sipariş toplama, paketleme ve sevkiyat) planlayıp izleyen sistemdir. WMS yazılımı bu adımları dijital olarak yönetir.'),
      ),
      P('İyi bir depo yönetimi; toplama mesafelerini kısaltır, hatalı sevkiyatı azaltır ve stok doğruluğunu yüksek tutar. Barkod ve RFID ile entegre çalışarak her hareketi gerçek zamanlı izler.'),
      P('Depo yönetimi, stok kontrolünün fiziksel ayağıdır; doğru yerleştirme ve toplama, FIFO/FEFO kurallarının uygulanmasını da mümkün kılar.'),
    ],
    ilgili: ['mal-kabul', 'sevkiyat', 'stok-dogrulugu'],
  },
  {
    kelime: 'Mal Kabul',
    slug: 'mal-kabul',
    harf: 'M',
    kisaTanim:
      'Tedarikçiden gelen malların depoya alınırken miktar, kalite ve evrak açısından kontrol edilip sisteme kaydedilmesi süreci; stok doğruluğunun başladığı ilk noktadır.',
    anlam: [
      RP(
        B('Mal kabul (goods receipt)'),
        T(', tedarikçiden gelen ürünlerin depoya girişinde miktar, kalite ve belge yönünden kontrol edilip kayıt altına alınması işlemidir. Stok kaydı ilk burada güncellenir.'),
      ),
      P('Mal kabulde sipariş ile gelen miktar karşılaştırılır, hasarlı veya hatalı ürünler ayrılır ve uygun olanlar stoğa alınır. Bu aşamadaki hata, depo boyunca taşınan bir stok doğruluğu sorununa dönüşür.'),
      P('Mal kabul, tedarik süresinin son halkası ve depo operasyonunun ilk adımıdır; teslim performansı da burada ölçülür.'),
    ],
    ilgili: ['depo-yonetimi', 'kalite-kontrol', 'stok-dogrulugu'],
  },
  {
    kelime: 'Sevkiyat',
    slug: 'sevkiyat',
    harf: 'S',
    kisaTanim:
      'Hazırlanan siparişlerin depodan çıkarılıp müşteriye ya da bir sonraki noktaya gönderilmesi süreci; toplama, paketleme ve taşıyıcıya teslim adımlarını kapsar.',
    anlam: [
      RP(
        B('Sevkiyat (shipping / dispatch)'),
        T(', depodaki ürünlerin toplanıp paketlenerek müşteriye veya bir sonraki dağıtım noktasına gönderilmesi sürecidir. Depo operasyonunun çıkış ayağıdır ve teslim performansını doğrudan etkiler.'),
      ),
      P('Sevkiyatta doğru ürünün doğru miktarda, doğru zamanda ve hasarsız teslim edilmesi esastır. Hatalı sevkiyat hem müşteri memnuniyetsizliği hem de iade ve stok düzeltme maliyeti yaratır.'),
      P('FIFO veya FEFO kuralları sevkiyat sırasında uygulanır; hangi partinin önce çıkacağı burada belirlenir.'),
    ],
    ilgili: ['depo-yonetimi', 'mal-kabul', 'teslim-performansi'],
  },
  {
    kelime: 'Palet',
    slug: 'palet',
    harf: 'P',
    kisaTanim:
      'Ürünlerin üzerine istiflenerek forklift veya transpaletle birlikte taşındığı standart taşıma platformu; depolama ve sevkiyatta birim yük oluşturmayı sağlar.',
    anlam: [
      RP(
        B('Palet (pallet)'),
        T(', ürünlerin üzerine düzenli biçimde istiflenip forklift veya transpaletle tek seferde taşındığı standart platformdur. Çok sayıda kalemi tek bir birim yük halinde hareket ettirmeyi sağlar.'),
      ),
      P('Standart palet ölçüleri (örneğin Euro palet 80x120 cm), depo raf tasarımını, kamyon doluluk hesabını ve istif kapasitesini belirler. Palet bazlı çalışmak elleçleme süresini ve hasar riskini azaltır.'),
      P('Depo yönetiminde stok genellikle palet, koli ve adet seviyelerinde takip edilir; bu hiyerarşi toplama ve yerleştirmeyi kolaylaştırır.'),
    ],
    ilgili: ['depo-yonetimi', 'sevkiyat', 'mal-kabul'],
  },
  {
    kelime: 'Raf Ömrü',
    slug: 'raf-omru',
    harf: 'R',
    kisaTanim:
      'Bir ürünün kalitesini ve kullanılabilirliğini koruduğu süre; bu süre dolduğunda ürün satılamaz veya kullanılamaz hale gelir ve fire riski oluşturur.',
    anlam: [
      RP(
        B('Raf ömrü (shelf life)'),
        T(', bir ürünün belirlenen koşullarda kalitesini, güvenliğini ve kullanılabilirliğini koruduğu süredir. Bu süre dolduğunda ürün satılamaz veya kullanılamaz hale gelir.'),
      ),
      P('Raf ömrü kısa olan gıda, ilaç ve kimyasal ürünlerde stok stratejisi tamamen tarih odaklıdır; bu yüzden FEFO uygulanır ve emniyet stoğu dikkatli ayarlanır. Aşırı stok burada doğrudan fire ve zarar demektir.'),
      P('Raf ömrü yönetimi parti takibiyle birlikte yürür; her partinin son kullanma tarihi izlenmeden tarihe göre sevkiyat yapılamaz.'),
    ],
    ilgili: ['fefo', 'parti-takibi', 'stok-yaslandirma'],
  },
  {
    kelime: 'Parti Takibi',
    slug: 'parti-takibi',
    harf: 'P',
    kisaTanim:
      'Aynı üretim ya da tedarik partisine ait ürünlerin tekil bir parti numarasıyla izlenmesi; geri çağırma, kalite ve son kullanma tarihi yönetimi için zorunludur.',
    anlam: [
      RP(
        B('Parti takibi (lot / batch tracking)'),
        T(', aynı üretim veya tedarik partisinden gelen ürünlerin ortak bir parti numarasıyla baştan sona izlenmesidir. Hangi hammaddeden, hangi tarihte, hangi koşulda üretildiği bu numarayla bağlanır.'),
      ),
      P('Parti takibi, bir kalite sorunu çıktığında yalnızca etkilenen partinin geri çağrılmasını sağlar; tüm stoğu değil. Gıda, ilaç ve otomotiv gibi sektörlerde yasal olarak zorunludur.'),
      P('Parti takibi, FEFO uygulamasının ve raf ömrü yönetiminin de altyapısını oluşturur; tarih ancak parti bazında izlenebilir.'),
    ],
    ilgili: ['seri-numarasi', 'fefo', 'raf-omru'],
  },
  {
    kelime: 'Seri Numarası',
    slug: 'seri-numarasi',
    harf: 'S',
    kisaTanim:
      'Her bir ürün adedine atanan benzersiz tekil tanımlayıcı; partiden farklı olarak tek tek ürün düzeyinde izleme, garanti ve servis takibi sağlar.',
    anlam: [
      RP(
        B('Seri numarası (serial number)'),
        T(', tek bir ürün adedine atanan benzersiz kimliktir. Parti numarası bir grup ürünü ortak izlerken, seri numarası her adedi tek tek ayırt eder.'),
      ),
      P('Seri numarası; garanti, servis geçmişi, hırsızlık takibi ve bireysel geri çağırma gerektiren yüksek değerli ürünlerde (elektronik, makine, otomotiv) kullanılır. Her adedin yaşam döngüsü ayrı izlenir.'),
      P('Parti takibi grup bazlı, seri takibi birim bazlı izleme sağlar; ikisi izlenebilirliğin iki farklı çözünürlük seviyesidir.'),
    ],
    ilgili: ['parti-takibi', 'barkod', 'sku'],
  },
  {
    kelime: 'Bekleyen Sipariş',
    slug: 'bekleyen-siparis',
    harf: 'B',
    kisaTanim:
      'Verilmiş ama henüz teslim edilmemiş, yolda olan sipariş; net ihtiyaç ve gelecekteki stok seviyesi hesaplanırken eldeki stoğa eklenmesi gereken miktardır.',
    anlam: [
      RP(
        B('Bekleyen sipariş (on-order stock)'),
        T(', verilmiş ancak henüz teslim alınmamış, tedarik sürecinde yolda olan sipariştir. Fiziksel olarak depoda değildir ama yakında gelecek olduğundan planlamada hesaba katılır.'),
      ),
      P('Net ihtiyaç hesaplanırken bekleyen siparişler eldeki stoğa eklenir; aksi halde aynı malzeme için gereksiz yere ikinci kez sipariş açılır. MRP ve ROP mantığı bu miktarı dikkate alır.'),
      P('Bekleyen sipariş, müşteri tarafındaki backorder ile karıştırılmamalıdır; biri işletmenin tedarikçiye verdiği, diğeri müşterinin işletmeden bekleyen siparişidir.'),
    ],
    ilgili: ['backorder', 'brut-net-ihtiyac', 'yeniden-siparis-noktasi'],
  },
  {
    kelime: 'Brüt ve Net İhtiyaç',
    slug: 'brut-net-ihtiyac',
    harf: 'B',
    kisaTanim:
      'Brüt ihtiyaç, üretim için gereken toplam malzeme miktarı; net ihtiyaç ise bundan eldeki stok ve bekleyen siparişler düşüldükten sonra gerçekten sipariş edilmesi gereken miktardır.',
    anlam: [
      RP(
        B('Brüt ihtiyaç ve net ihtiyaç'),
        T(', MRP hesabının iki temel kavramıdır. Brüt ihtiyaç, üretim planını gerçekleştirmek için gereken toplam malzeme miktarıdır; hiçbir stok yokmuş gibi düşünülür.'),
      ),
      P('Net ihtiyaç ise brüt ihtiyaçtan eldeki stok ve bekleyen (yoldaki) siparişler düşülerek bulunur. Sonuç, gerçekten yeni sipariş açılması gereken miktarı verir. Net ihtiyaç sıfır veya negatifse yeni sipariş gerekmez.'),
      P('Bu ayrım, MRP’nin gereksiz sipariş açmadan ve stoksuz kalmadan tam ihtiyaç kadar tedarik etmesini sağlar.'),
    ],
    ilgili: ['mrp', 'bekleyen-siparis', 'urun-agaci'],
  },
  {
    kelime: 'Güvenlik Payı',
    slug: 'guvenlik-payi',
    harf: 'G',
    kisaTanim:
      'Belirsizliklere karşı planlanan değerin üzerine eklenen tampon; stok bağlamında emniyet stoğu, sürede ise güvenlik süresi olarak somutlaşan genel koruma kavramıdır.',
    anlam: [
      RP(
        B('Güvenlik payı'),
        T(', talep, süre veya miktar tahminlerindeki belirsizliğe karşı planlanan değerin üzerine konulan tampondur. Amacı, beklenmedik sapmalar gerçekleştiğinde planın çökmesini önlemektir.'),
      ),
      P('Stok yönetiminde güvenlik payı emniyet stoğu olarak, planlamada ise güvenlik süresi (siparişi olması gerekenden erken verme) olarak uygulanır. İkisi de belirsizliği maliyetle satın almanın yollarıdır.'),
      RP(
        T('Stok tarafındaki güvenlik payını '),
        L('emniyet stoğu hesabıyla', '/araclar/emniyet-stogu-hesaplama'),
        T(' belirleyebilirsin.'),
      ),
    ],
    ilgili: ['emniyet-stogu', 'hizmet-seviyesi', 'talep-degiskenligi'],
  },
  {
    kelime: 'Tedarikçi',
    slug: 'tedarikci',
    harf: 'T',
    kisaTanim:
      'İşletmeye hammadde, parça, ürün veya hizmet sağlayan dış kaynak; teslim güvenilirliği, kalitesi ve fiyatı işletmenin stok ve üretim performansını doğrudan etkiler.',
    anlam: [
      RP(
        B('Tedarikçi (supplier / vendor)'),
        T(', işletmeye üretim veya satış için gereken hammadde, parça, ürün ya da hizmeti sağlayan dış taraftır. Tedarik zincirinin başlangıç halkasıdır ve performansı zincirin tamamına yansır.'),
      ),
      P('Tedarikçinin teslim süresi, teslim güvenilirliği ve kalite tutarlılığı; gereken emniyet stoğunu ve yeniden sipariş noktasını doğrudan belirler. Güvenilir bir tedarikçi daha az tampon stok gerektirir.'),
      P('Kritik kalemlerde tek tedarikçiye bağımlılık risklidir; bu yüzden çoğu işletme alternatif tedarikçilerle çalışır ve teslim performansını düzenli ölçer.'),
    ],
    ilgili: ['teslim-performansi', 'satin-alma', 'tedarik-suresi'],
  },
  {
    kelime: 'Satın Alma Siparişi (PO)',
    slug: 'satin-alma-siparisi',
    harf: 'S',
    kisaTanim:
      'Alıcının tedarikçiye gönderdiği, hangi üründen ne kadar, hangi fiyat ve teslim koşuluyla istendiğini belirten resmi sipariş belgesi (Purchase Order); satın alma sürecini bağlayıcı kılar.',
    anlam: [
      RP(
        B('Satın alma siparişi (purchase order, PO)'),
        T(', alıcının tedarikçiye gönderdiği, istenen ürünü, miktarı, fiyatı, teslim tarihini ve koşullarını belirten resmi sipariş belgesidir. Tedarikçi kabul ettiğinde bağlayıcı bir anlaşmaya dönüşür.'),
      ),
      P('PO, satın alma sürecini kayıt altına alır ve mal kabulde gelen ürünle karşılaştırılan referans belgedir. Üç yönlü eşleştirmede (sipariş, mal kabul, fatura) merkezi rol oynar.'),
      P('Açık satın alma siparişleri, planlamada bekleyen sipariş olarak izlenir ve net ihtiyaç hesabına girer.'),
    ],
    ilgili: ['satin-alma', 'bekleyen-siparis', 'mal-kabul'],
  },
  {
    kelime: 'Teslim Performansı',
    slug: 'teslim-performansi',
    harf: 'T',
    kisaTanim:
      'Tedarikçinin veya işletmenin siparişleri söz verilen zamanda ve miktarda teslim etme başarısı; genellikle tam zamanında ve eksiksiz teslim oranıyla (OTIF) ölçülür.',
    anlam: [
      RP(
        B('Teslim performansı (delivery performance)'),
        T(', siparişlerin taahhüt edilen tarihte ve miktarda teslim edilme başarısıdır. En yaygın ölçüsü OTIF (on-time in-full); yani hem zamanında hem eksiksiz teslim edilen sipariş oranıdır.'),
      ),
      P('Düşük teslim performansı, alıcının daha fazla emniyet stoğu tutmasını zorunlu kılar; çünkü güvenilmeyen teslime karşı tampon büyütülür. Yüksek ve istikrarlı teslim performansı ise stoğu güvenle düşürmeyi mümkün kılar.'),
      P('Teslim performansı, tedarikçi değerlendirmesinin ve sözleşme yenilemelerinin temel kriterlerinden biridir.'),
    ],
    ilgili: ['tedarikci', 'tedarik-suresi', 'emniyet-stogu'],
  },
  {
    kelime: 'Kalite Kontrol',
    slug: 'kalite-kontrol',
    harf: 'K',
    kisaTanim:
      'Ürün veya malzemenin belirlenen kalite standartlarını karşılayıp karşılamadığını ölçen ve uygunsuzları ayıran faaliyet; mal kabulde, süreçte ve son üründe uygulanır.',
    anlam: [
      RP(
        B('Kalite kontrol (quality control, QC)'),
        T(', ürün veya malzemenin belirlenen standartlara uygunluğunu muayene, test ve ölçümle doğrulayan ve uygunsuz olanları ayıran faaliyettir. Mal kabulde, üretim sürecinde ve son üründe uygulanır.'),
      ),
      P('Kalite kontrolde tespit edilen uygunsuz ürünler ıskartaya ayrılır, yeniden işlemeye gönderilir veya tedarikçiye iade edilir. Yüksek hata oranı hem maliyeti hem de stok doğruluğunu olumsuz etkiler.'),
      P('Mal kabuldeki kalite kontrol, hatalı malzemenin stoğa girmesini önleyerek üretimi ve müşteri memnuniyetini korur.'),
    ],
    ilgili: ['iskarta', 'yeniden-isleme', 'mal-kabul'],
  },
  {
    kelime: 'Iskarta',
    slug: 'iskarta',
    harf: 'I',
    kisaTanim:
      'Kalite standartlarını sağlamadığı için satılamayan veya kullanılamayan ürün; düzeltilemiyorsa hurdaya ayrılır, düzeltilebiliyorsa yeniden işlemeye gönderilir.',
    anlam: [
      RP(
        B('Iskarta (reject / defective)'),
        T(', kalite kontrolde belirlenen standartları karşılamadığı için kabul edilmeyen üründür. Iskarta, hatasının türüne göre ya yeniden işlemeyle kurtarılır ya da hurdaya ayrılır.'),
      ),
      P('Iskarta oranı, üretim kalitesinin ve sürecin kararlılığının doğrudan göstergesidir. Yüksek ıskarta; hammadde, ayar veya işçilik kaynaklı bir sorunu işaret eder ve maliyeti yükseltir.'),
      P('Iskarta, OEE’nin kalite bileşenini düşürür; kusursuz çıkmayan her ürün bu oranı aşağı çeker.'),
    ],
    ilgili: ['hurda', 'yeniden-isleme', 'kalite-kontrol'],
  },
  {
    kelime: 'Yeniden İşleme',
    slug: 'yeniden-isleme',
    harf: 'Y',
    kisaTanim:
      'Standartları sağlamayan bir ürünü hurdaya ayırmak yerine düzelterek kullanılabilir hale getirme işlemi; ek maliyet yaratır ama malzeme kaybını önler.',
    anlam: [
      RP(
        B('Yeniden işleme (rework)'),
        T(', kalite standardını sağlamayan bir ürünü atmak yerine ek operasyonlarla düzeltip kullanılabilir hale getirmektir. Iskartayı kurtarmanın bir yoludur ve malzemeyi tamamen kaybetmekten daha ekonomik olabilir.'),
      ),
      P('Yeniden işleme ücretsiz değildir; ek işçilik, makine zamanı ve malzeme gerektirir, üretim akışını da yavaşlatır. Bu yüzden hedef, ürünü ilk seferde doğru üretip yeniden işleme ihtiyacını en aza indirmektir.'),
      P('Yüksek yeniden işleme oranı, gizli bir kapasite ve maliyet kaybıdır; süreç iyileştirmesinin önemli bir sinyalidir.'),
    ],
    ilgili: ['iskarta', 'hurda', 'kalite-kontrol'],
  },
  {
    kelime: 'Stok Yaşlandırma',
    slug: 'stok-yaslandirma',
    harf: 'S',
    kisaTanim:
      'Stok kalemlerinin depoda ne kadar süredir beklediğine göre yaş aralıklarına ayrılması; atıl ve ölü stoğu erken tespit etmeye yarayan bir analiz yöntemidir.',
    anlam: [
      RP(
        B('Stok yaşlandırma (inventory aging)'),
        T(', stok kalemlerinin depoya giriş tarihine göre yaş aralıklarına (örneğin 0-30, 31-90, 90+ gün) bölünerek analiz edilmesidir. Hangi stoğun ne kadar süredir beklediğini gösterir.'),
      ),
      P('Yaşlandırma analizi, atıl ve ölü stoğu erken yakalamanın en pratik yoludur. Belirli bir yaşı geçen kalemler için indirim, kampanya veya elden çıkarma kararı alınır; böylece sermaye serbest kalır.'),
      P('Raf ömrü olan ürünlerde yaşlandırma, son kullanma tarihi yönetimiyle birleşir ve fire riskini öngörmeyi sağlar.'),
    ],
    ilgili: ['olu-stok', 'atil-stok', 'raf-omru'],
  },
  {
    kelime: 'Sermaye Bağlama Maliyeti',
    slug: 'sermaye-baglama-maliyeti',
    harf: 'S',
    kisaTanim:
      'Stoğa yatırılan paranın başka bir yatırımda değerlendirilememesinden doğan fırsat maliyeti; taşıma maliyetinin genelde en büyük bileşenidir.',
    anlam: [
      RP(
        B('Sermaye bağlama maliyeti (cost of capital tied up)'),
        T(', stoğa yatırılan paranın o stokta bekledği sürece başka bir yatırımda, örneğin makinede veya finansal getiride değerlendirilememesinden doğan fırsat maliyetidir. Görünmez ama gerçek bir maliyettir.'),
      ),
      P('Bu maliyet genellikle işletmenin sermaye maliyeti veya beklenen getiri oranıyla hesaplanır ve taşıma maliyetinin en büyük bileşenidir. Yüksek faiz ortamında stok tutmanın maliyeti belirgin biçimde artar.'),
      RP(
        T('Sermaye bağlama maliyeti, '),
        L('taşıma maliyetinin', '/araclar/eoq-hesaplama'),
        T(' ana parçası olarak EOQ hesabına yansır.'),
      ),
    ],
    ilgili: ['tasima-maliyeti', 'stok-devir-hizi', 'ekonomik-siparis-miktari'],
  },
  {
    kelime: 'Sipariş Çevrim Süresi',
    slug: 'siparis-cevrim-suresi',
    harf: 'S',
    kisaTanim:
      'İki ardışık sipariş verme anı arasında geçen süre; sipariş miktarı ve talep hızı tarafından belirlenir, sık sipariş kısa çevrim, büyük sipariş uzun çevrim anlamına gelir.',
    anlam: [
      RP(
        B('Sipariş çevrim süresi (order cycle time)'),
        T(', aynı kalem için iki ardışık siparişin verilmesi arasında geçen süredir. Sipariş miktarı talebe bölünerek bulunur; büyük partiler uzun, küçük partiler kısa çevrim demektir.'),
      ),
      P('Sipariş çevrim süresi, çevrim stoğunu ve sipariş sıklığını belirler. EOQ ile optimize edildiğinde, sipariş maliyeti ile taşıma maliyetini dengeleyen ideal sipariş ritmi ortaya çıkar.'),
      P('Bu kavram müşteri tarafındaki teslim süresiyle karıştırılmamalıdır; burada konu işletmenin kendi yeniden sipariş ritmidir.'),
    ],
    ilgili: ['ekonomik-siparis-miktari', 'cevrim-stogu', 'parti-buyuklugu'],
  },
  {
    kelime: 'Tam Zamanında Teslim',
    slug: 'tam-zamaninda-teslim',
    harf: 'T',
    kisaTanim:
      'Siparişin söz verilen tarihte, ne erken ne geç teslim edilmesi; teslim performansının temel boyutudur ve düşük olduğunda emniyet stoğu ihtiyacını artırır.',
    anlam: [
      RP(
        B('Tam zamanında teslim (on-time delivery, OTD)'),
        T(', siparişin taahhüt edilen tarihte teslim edilme oranıdır. Erken teslim bile çoğu zaman istenmez; çünkü depoda erken stok birikmesine ve planlama bozulmasına yol açar.'),
      ),
      P('Tam zamanında teslim oranı yüksekse, alıcı stoğunu güvenle düşürebilir. Oran düşükse belirsizliği telafi etmek için emniyet stoğu büyütülür; yani güvenilmeyen teslim doğrudan stok maliyetine dönüşür.'),
      P('OTD, OTIF ölçütünün "zamanında" kısmıdır; "eksiksiz" kısmıyla birlikte teslim performansını oluşturur.'),
    ],
    ilgili: ['teslim-performansi', 'tedarikci', 'emniyet-stogu'],
  },
  {
    kelime: 'Çapraz Sevkiyat (Cross-docking)',
    slug: 'capraz-sevkiyat',
    harf: 'Ç',
    kisaTanim:
      'Gelen malların depoda stoklanmadan, mal kabulden doğrudan sevkiyata aktarılması yöntemi; depolama maliyetini ve teslim süresini azaltır.',
    anlam: [
      RP(
        B('Çapraz sevkiyat (cross-docking)'),
        T(', tedarikçiden gelen malların depoya yerleştirilip stoklanmadan, mal kabul alanından doğrudan giden sevkiyat araçlarına aktarılması yöntemidir. Stok adımı atlanır.'),
      ),
      P('Çapraz sevkiyat depolama maliyetini, elleçleme sayısını ve teslim süresini düşürür. Ancak iyi senkronize edilmiş bir akış ve güvenilir tedarik gerektirir; gelen ve giden zamanlaması tutmazsa tıkanma yaşanır.'),
      P('Hızlı dönen, raf ömrü kısa veya talebi önceden eşleşmiş ürünlerde özellikle etkilidir; perakende dağıtım merkezlerinde yaygındır.'),
    ],
    ilgili: ['depo-yonetimi', 'sevkiyat', 'lojistik'],
  },
  {
    kelime: 'Drop Shipping',
    slug: 'drop-shipping',
    harf: 'D',
    kisaTanim:
      'Satıcının ürünü kendi deposunda stoklamadan, sipariş geldiğinde doğrudan tedarikçiden müşteriye gönderttiği model; satıcı stok tutmaz, sermaye bağlamaz.',
    anlam: [
      RP(
        B('Drop shipping (stoksuz satış)'),
        T(', satıcının ürünü kendi deposunda hiç bulundurmadan, müşteri sipariş verdiğinde ürünü doğrudan tedarikçiden veya üreticiden müşteriye sevk ettirdiği iş modelidir. Satıcı yalnızca aracılık eder.'),
      ),
      P('Drop shipping’in en büyük avantajı stok tutma ve sermaye bağlama yükünün ortadan kalkmasıdır. Buna karşılık satıcı stok ve teslim sürecini doğrudan kontrol edemez; teslim hızı ve kalite tamamen tedarikçiye bağlıdır.'),
      P('E-ticarette yaygın bu model, klasik stok yönetiminin tersine işler; stoksuzluk riski tedarikçiye devredilir ama kâr marjı da daha incedir.'),
    ],
    ilgili: ['konsinye-stok', 'tedarikci-yonetimli-envanter', 'tedarikci'],
  },
  {
    kelime: 'VMI (Tedarikçi Yönetimli Envanter)',
    slug: 'tedarikci-yonetimli-envanter',
    harf: 'T',
    kisaTanim:
      'Stok seviyelerinin ve yeniden sipariş kararlarının alıcı yerine tedarikçi tarafından yönetildiği model (Vendor Managed Inventory); tedarikçi tüketimi izleyip kendisi ikmal yapar.',
    anlam: [
      RP(
        B('VMI (vendor managed inventory, tedarikçi yönetimli envanter)'),
        T(', alıcının stok seviyelerini ve yeniden sipariş kararlarını tedarikçiye devrettiği iş birliği modelidir. Tedarikçi, alıcının tüketim verisini izleyip stoğu kendisi ikmal eder.'),
      ),
      P('VMI, alıcının sipariş yükünü ve stoksuz kalma riskini azaltır; tedarikçi ise talebi daha iyi görerek üretimini planlar ve kamçı etkisini düşürür. Genellikle konsinye stokla birlikte uygulanır.'),
      P('Başarısı, iki taraf arasında düzenli ve güvenilir tüketim verisi paylaşımına bağlıdır; veri akarsa stok her iki taraf için de optimize olur.'),
    ],
    ilgili: ['konsinye-stok', 'tedarikci', 'tedarik-zinciri-yonetimi'],
  },
  {
    kelime: 'Talep Değişkenliği',
    slug: 'talep-degiskenligi',
    harf: 'T',
    kisaTanim:
      'Talebin ortalamasından ne kadar saptığının ölçüsü; genelde standart sapma ile ifade edilir ve değişkenlik arttıkça gereken emniyet stoğu büyür.',
    anlam: [
      RP(
        B('Talep değişkenliği (demand variability)'),
        T(', talebin dönemden döneme ortalamasından ne kadar saptığını gösteren ölçüdür. İstatistiksel olarak çoğunlukla standart sapmayla ifade edilir; yüksek değişkenlik, öngörülemez talep demektir.'),
      ),
      P('Talep ne kadar değişkense, aynı hizmet seviyesini korumak için o kadar büyük bir emniyet stoğu gerekir. Düzenli ve istikrarlı talep ise düşük tamponla yönetilebilir. Bu yüzden değişkenlik, stok maliyetinin gizli sürücüsüdür.'),
      RP(
        T('Talep değişkenliği, '),
        L('emniyet stoğu hesabının', '/araclar/emniyet-stogu-hesaplama'),
        T(' standart sapma girdisini oluşturur.'),
      ),
    ],
    ilgili: ['emniyet-stogu', 'talep-tahmini', 'mevsimsellik'],
  },
  {
    kelime: 'Mevsimsellik',
    slug: 'mevsimsellik',
    harf: 'M',
    kisaTanim:
      'Talebin yılın belirli dönemlerinde düzenli olarak yükselip alçalması; tahmin, stok ve üretim planlamasının bu döngüye göre uyarlanmasını gerektirir.',
    anlam: [
      RP(
        B('Mevsimsellik (seasonality)'),
        T(', talebin yılın belirli dönemlerinde düzenli ve öngörülebilir biçimde yükselip alçalmasıdır. Bayram öncesi gıda talebi, yaz aylarında klima satışı gibi tekrar eden döngüler tipik örneklerdir.'),
      ),
      P('Mevsimsellik düzenli olduğu için tahmine dahil edilebilir; bu sayede sezon öncesi stok artırılır, sezon sonrası ise sipariş frenlenir. Mevsimselliği görmezden gelmek, sezonda stoksuzluğa, sezon dışında atıl stoğa yol açar.'),
      RP(
        T('Mevsimsel desenler '),
        L('talep tahminine', '/icerik/yeniden-siparis-noktasi-nedir'),
        T(' ve stok planına işlenmelidir.'),
      ),
    ],
    ilgili: ['talep-tahmini', 'talep-degiskenligi', 'atil-stok'],
  },
  {
    kelime: 'Stok Doğruluğu',
    slug: 'stok-dogrulugu',
    harf: 'S',
    kisaTanim:
      'Sistemdeki stok kaydı ile depodaki fiziksel gerçeğin ne kadar örtüştüğünün ölçüsü; düşük doğruluk, planlamanın tamamını hatalı hale getirir.',
    anlam: [
      RP(
        B('Stok doğruluğu (inventory accuracy)'),
        T(', sistemdeki kayıtlı stok miktarı ile depodaki fiziksel miktarın ne kadar uyuştuğunu gösteren orandır. Genellikle sayım sonrası doğru kalem sayısının toplam kaleme oranıyla ifade edilir.'),
      ),
      P('Düşük stok doğruluğu tüm planlamayı çürütür; kayıtta var görünen ama gerçekte olmayan stok stoksuzluğa, gerçekte var olan ama kayıtta olmayan stok ise gereksiz siparişe yol açar. Hedef genelde yüzde 95 ve üzeridir.'),
      P('Döngüsel sayım, barkod ve disiplinli mal kabul, stok doğruluğunu yüksek tutmanın en etkili araçlarıdır.'),
    ],
    ilgili: ['dongusel-sayim', 'stok-sayimi', 'barkod'],
  },
  {
    kelime: 'Barkod',
    slug: 'barkod',
    harf: 'B',
    kisaTanim:
      'Ürün bilgisini optik okuyucuyla okunabilen çizgi veya kare desenlerle kodlayan tanımlama teknolojisi; stok hareketlerinin hızlı ve hatasız kaydedilmesini sağlar.',
    anlam: [
      RP(
        B('Barkod (barcode)'),
        T(', ürün veya kalem bilgisini optik okuyucuyla okunabilen çizgi (1D) veya kare (2D, QR) desenlerle kodlayan tanımlama teknolojisidir. Her tarama, bir stok hareketini saniyeler içinde sisteme kaydeder.'),
      ),
      P('Barkod, manuel veri girişine kıyasla hem çok daha hızlıdır hem de hata oranını büyük ölçüde düşürür. Mal kabul, sayım, toplama ve sevkiyatta kullanılarak stok doğruluğunu doğrudan yükseltir.'),
      P('Barkod tek tek okutma gerektirirken, RFID temassız ve toplu okuma sunar; ikisi izleme teknolojisinin iki farklı seviyesidir.'),
    ],
    ilgili: ['rfid', 'sku', 'stok-dogrulugu'],
  },
  {
    kelime: 'RFID',
    slug: 'rfid',
    harf: 'R',
    kisaTanim:
      'Ürünlere yerleştirilen etiketlerin radyo dalgalarıyla temassız ve toplu okunmasını sağlayan tanımlama teknolojisi; barkodun aksine görüş hattı ve tek tek okutma gerektirmez.',
    anlam: [
      RP(
        B('RFID (radio frequency identification)'),
        T(', ürünlere yerleştirilen küçük etiketlerin radyo dalgalarıyla temassız okunmasını sağlayan teknolojidir. Barkodun aksine doğrudan görüş hattı gerekmez ve çok sayıda etiket aynı anda toplu okunabilir.'),
      ),
      P('RFID, sayım ve takip hızını çok artırır; bir palet dolusu ürün tek geçişte okunabilir. Maliyeti barkoda göre yüksek olduğundan genellikle yüksek değerli ürünlerde veya hızlı sayım gereken depolarda tercih edilir.'),
      P('RFID, stok doğruluğunu ve gerçek zamanlı izlenebilirliği artırır; barkodun yapamadığı toplu ve otomatik okuma burada devreye girer.'),
    ],
    ilgili: ['barkod', 'stok-dogrulugu', 'depo-yonetimi'],
  },
  {
    kelime: 'Lojistik',
    slug: 'lojistik',
    harf: 'L',
    kisaTanim:
      'Malların doğru yerde, doğru zamanda ve uygun maliyetle bulunması için taşıma, depolama ve dağıtım faaliyetlerinin planlanıp yürütülmesi; tedarik zincirinin fiziksel akış ayağıdır.',
    anlam: [
      RP(
        B('Lojistik (logistics)'),
        T(', hammadde ve ürünlerin tedarik noktasından tüketim noktasına taşınması, depolanması ve dağıtılmasının planlanıp yürütülmesidir. Tedarik zincirinin fiziksel akışını yöneten ayağıdır.'),
      ),
      P('Lojistik; taşıma modu seçimi, rota planlama, depo konumlandırma ve dağıtım ağı tasarımını kapsar. Amacı hizmet seviyesini korurken toplam taşıma ve depolama maliyetini en aza indirmektir.'),
      P('İyi lojistik, kısa ve güvenilir tedarik süreleri sağlayarak gereken stok seviyesini ve emniyet stoğunu doğrudan düşürür.'),
    ],
    ilgili: ['tedarik-zinciri', 'depo-yonetimi', 'capraz-sevkiyat'],
  },
  {
    kelime: 'Stok Değerleme',
    slug: 'stok-degerleme',
    harf: 'S',
    kisaTanim:
      'Eldeki stoğun parasal değerinin belirlenmesi; FIFO, LIFO veya ağırlıklı ortalama gibi yöntemlerle yapılır ve satılan malın maliyetini ve dönem karını etkiler.',
    anlam: [
      RP(
        B('Stok değerleme (inventory valuation)'),
        T(', dönem sonunda eldeki stoğun ve satılan malın parasal değerinin hesaplanmasıdır. Hangi alış fiyatının hangi maliyete yansıtılacağına göre sonuç değişir.'),
      ),
      P('Başlıca yöntemler FIFO (ilk giren ilk çıkar), LIFO (son giren ilk çıkar) ve ağırlıklı ortalama maliyettir. Yöntem seçimi, özellikle fiyatların değiştiği dönemlerde satılan malın maliyetini ve raporlanan karı doğrudan etkiler.'),
      P('Stok değerleme hem mali tablolara hem de vergiye yansıdığı için, kullanılan yöntem muhasebe standartlarıyla uyumlu seçilmelidir.'),
    ],
    ilgili: ['fifo', 'lifo', 'envanter'],
  },
  {
    kelime: 'İstasyon',
    slug: 'istasyon',
    harf: 'İ',
    kisaTanim:
      'Üretim hattında belirli bir operasyonun gerçekleştirildiği iş noktası; makine, operatör ve araç-gereçten oluşur ve hattın kapasitesi istasyonların en yavaşıyla sınırlıdır.',
    anlam: [
      RP(
        B('İş istasyonu (work station)'),
        T(', üretim akışında belirli bir operasyonun yapıldığı iş noktasıdır. Bir makine, bir operatör veya ikisinin birleşiminden oluşabilir ve her istasyonun bir işlem süresi ile kapasitesi vardır.'),
      ),
      P('Bir hat, sıralı istasyonların zinciridir; toplam çıktı, en yavaş istasyonun (darboğazın) kapasitesiyle sınırlıdır. Hattı dengelemek, istasyonların iş yükünü takt süresine yakın eşitlemektir.'),
      P('Çizelgeleme ve kapasite planlama, işleri istasyonlara dağıtırken bu süreleri ve kapasiteleri temel alır.'),
    ],
    ilgili: ['darbogaz', 'cevrim-suresi', 'takt-suresi'],
  },
  {
    kelime: 'Ölçek Ekonomisi',
    slug: 'olcek-ekonomisi',
    harf: 'Ö',
    kisaTanim:
      'Üretim veya sipariş miktarı arttıkça birim başına maliyetin düşmesi; sabit maliyetlerin daha çok birime dağılmasıyla ortaya çıkar ve büyük partileri cazip kılar.',
    anlam: [
      RP(
        B('Ölçek ekonomisi (economies of scale)'),
        T(', üretim ya da sipariş hacmi büyüdükçe birim başına maliyetin düşmesidir. Sabit maliyetler (hazırlık, sipariş, kurulum) daha fazla birime yayıldığında her birime düşen pay azalır.'),
      ),
      P('Ölçek ekonomisi büyük partileri ekonomik kılar ama bir sınırı vardır; çünkü büyük parti daha fazla stok ve taşıma maliyeti demektir. EOQ, tam olarak bu iki etkiyi dengeleyerek optimal miktarı bulur.'),
      P('Ölçek ekonomisinin cazibesiyle aşırı büyük sipariş vermek, taşıma maliyeti ve atıl stok riskiyle dengelenmelidir.'),
    ],
    ilgili: ['ekonomik-siparis-miktari', 'parti-buyuklugu', 'tasima-maliyeti'],
  },
  {
    kelime: 'Kamçı Etkisi',
    slug: 'kamci-etkisi',
    harf: 'K',
    kisaTanim:
      'Tedarik zincirinde son müşteri talebindeki küçük dalgalanmaların zincir boyunca geriye gittikçe büyüyerek tedarikçide aşırı stok ve sipariş dalgalanmasına yol açması (bullwhip effect).',
    anlam: [
      RP(
        B('Kamçı etkisi (bullwhip effect)'),
        T(', tedarik zincirinde son müşteri talebindeki küçük bir dalgalanmanın, zincirin yukarısına doğru gittikçe büyümesidir. Perakendecideki ufak bir artış, tedarikçi seviyesinde çok daha büyük sipariş sıçramalarına dönüşür.'),
      ),
      P('Etkinin başlıca nedenleri; her halkanın ayrı tahmin yapması, toplu sipariş alışkanlığı, fiyat dalgalanmaları ve bilgi paylaşımı eksikliğidir. Sonuç, zincir boyunca biriken gereksiz stok ve verimsizliktir.'),
      P('Kamçı etkisini azaltmanın yolu, gerçek talep verisinin zincir boyunca paylaşılması ve VMI gibi iş birliği modelleridir.'),
    ],
    ilgili: ['tedarik-zinciri-yonetimi', 'tedarikci-yonetimli-envanter', 'talep-degiskenligi'],
  },
  {
    kelime: 'Devir Hızı',
    slug: 'devir-hizi',
    harf: 'D',
    kisaTanim:
      'Bir varlığın belirli bir dönemde kaç kez döndüğünü gösteren genel verimlilik ölçüsü; stokta "stok devir hızı", alacaklarda "alacak devir hızı" olarak somutlaşır.',
    anlam: [
      RP(
        B('Devir hızı (turnover)'),
        T(', bir varlığın belirli bir dönem boyunca kaç kez kullanılıp yenilendiğini gösteren genel verimlilik ölçüsüdür. Stok için stok devir hızı, alacaklar için alacak devir hızı gibi farklı varyantları vardır.'),
      ),
      P('Genel mantık aynıdır: bir akış büyüklüğü (örneğin satış maliyeti) ilgili varlığın ortalamasına bölünür. Yüksek devir hızı, varlığın verimli ve hızlı döndüğünü, sermayenin etkin kullanıldığını gösterir.'),
      RP(
        T('Stok bağlamındaki uygulaması için '),
        L('stok devir hızı yazısına', '/icerik/stok-devir-hizi-nedir'),
        T(' bakabilirsin.'),
      ),
    ],
    ilgili: ['stok-devir-hizi', 'stok-devir-orani', 'ortalama-stok'],
  },
];
