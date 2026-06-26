/**
 * Hesaplayıcı kayıt defteri (registry).
 *
 * ToolPageTemplate, Strapi'den gelen tool slug'ına göre buradan hesaplayıcı
 * tanımını bulur. Yeni bir tool eklemek için:
 *   1. `lib/tools/<tool>.ts` içinde saf hesaplama fonksiyonunu yaz (+ test),
 *   2. Buraya bir CalculatorDef ekle (alanlar + compute),
 *   3. Strapi'de aynı slug ile bir Tool kaydı oluştur.
 * Yeni sayfa kodu YAZILMAZ.
 */
import { eoq } from './eoq';
import { stokDevirHizi } from './stok-devir-hizi';
import { emniyetStogu } from './emniyet-stogu';
import { rop } from './rop';
import { oee } from './oee';
import { fireOrani } from './fire-orani';
import { trendyolKomisyon } from './trendyol-komisyon';
import { formatNumber, formatCurrency, formatPercent } from '../format';

export interface CalculatorField {
  name: string;
  label: string;
  suffix?: string;
  defaultValue: number;
  min?: number;
  step?: number;
  /** Verilirse alan sayısal input yerine <select> (preset) olarak render edilir. */
  options?: { label: string; value: number }[];
}

export interface ResultRow {
  label: string;
  value: string;
}

export interface CalculatorOutput {
  /** Büyük monospace ana sonuç */
  value: string;
  unit: string;
  /** Kısa yorum: "EOQ = 200 birim · yılda 5 sipariş" */
  summary: string;
  /** Ek satırlar (yıllık sipariş sayısı, toplam maliyet vb.) */
  rows: ResultRow[];
}

export interface CalculatorDef {
  slug: string;
  fields: CalculatorField[];
  compute: (inputs: Record<string, number>) => CalculatorOutput;
}

const eoqDef: CalculatorDef = {
  slug: 'eoq-hesaplama',
  fields: [
    { name: 'yillikTalep', label: 'Yıllık Talep (D)', suffix: 'birim/yıl', defaultValue: 1000, min: 1, step: 1 },
    { name: 'siparisMaliyeti', label: 'Sipariş Başına Maliyet (S)', suffix: '₺', defaultValue: 10, min: 0.01, step: 0.01 },
    { name: 'tasimaMaliyeti', label: 'Taşıma Maliyeti (H)', suffix: '₺/birim·yıl', defaultValue: 2, min: 0.01, step: 0.01 },
  ],
  compute: (inputs) => {
    const r = eoq({
      yillikTalep: inputs.yillikTalep!,
      siparisMaliyeti: inputs.siparisMaliyeti!,
      tasimaMaliyeti: inputs.tasimaMaliyeti!,
    });
    return {
      value: formatNumber(r.eoq),
      unit: 'birim',
      summary: `EOQ = ${formatNumber(r.eoq)} birim · yılda ${formatNumber(r.yillikSiparisSayisi)} sipariş`,
      rows: [
        { label: 'Yıllık sipariş sayısı', value: `${formatNumber(r.yillikSiparisSayisi)} sipariş` },
        { label: 'Yıllık toplam maliyet', value: formatCurrency(r.toplamMaliyet) },
      ],
    };
  },
};

const stokDevirHiziDef: CalculatorDef = {
  slug: 'stok-devir-hizi-hesaplama',
  fields: [
    { name: 'smm', label: 'Satılan Malların Maliyeti (SMM)', suffix: '₺', defaultValue: 2000000, min: 0.01, step: 1 },
    { name: 'donemBasiStok', label: 'Dönem Başı Stok', suffix: '₺', defaultValue: 300000, min: 0, step: 1 },
    { name: 'donemSonuStok', label: 'Dönem Sonu Stok', suffix: '₺', defaultValue: 400000, min: 0, step: 1 },
    {
      name: 'donemGunu',
      label: 'Hesap Dönemi',
      defaultValue: 365,
      options: [
        { label: 'Yıllık (365 gün)', value: 365 },
        { label: 'Çeyreklik (90 gün)', value: 90 },
        { label: 'Aylık (30 gün)', value: 30 },
      ],
    },
  ],
  compute: (inputs) => {
    const donemGunu = inputs.donemGunu ?? 365;
    const r = stokDevirHizi({
      smm: inputs.smm!,
      donemBasiStok: inputs.donemBasiStok!,
      donemSonuStok: inputs.donemSonuStok!,
      donemGunu,
    });
    const donemAdi = donemGunu === 30 ? 'ay' : donemGunu === 90 ? 'çeyrek' : 'yıl';
    return {
      value: formatNumber(r.devirHizi),
      unit: `kez/${donemAdi}`,
      summary: `Stok devir hızı = ${formatNumber(r.devirHizi)} kez · stok ortalama ${formatNumber(r.stoktaKalmaSuresi)} günde bir tükeniyor`,
      rows: [
        { label: 'Ortalama stok', value: formatCurrency(r.ortalamaStok) },
        { label: 'Stokta kalma süresi', value: `${formatNumber(r.stoktaKalmaSuresi)} gün` },
      ],
    };
  },
};

const emniyetStoguDef: CalculatorDef = {
  slug: 'emniyet-stogu-hesaplama',
  fields: [
    { name: 'talepStdSapma', label: 'Günlük Talep Std. Sapması (σ_d)', suffix: 'birim/gün', defaultValue: 20, min: 0, step: 0.1 },
    { name: 'tedarikSuresi', label: 'Tedarik Süresi (L)', suffix: 'gün', defaultValue: 9, min: 0.1, step: 0.1 },
    { name: 'servisSeviyesi', label: 'Hedef Servis Seviyesi', suffix: '%', defaultValue: 95, min: 50, step: 0.5 },
  ],
  compute: (inputs) => {
    const r = emniyetStogu({
      talepStdSapma: inputs.talepStdSapma!,
      tedarikSuresi: inputs.tedarikSuresi!,
      servisSeviyesi: inputs.servisSeviyesi!,
    });
    return {
      value: formatNumber(r.emniyetStoguYuvarli),
      unit: 'birim',
      summary: `Emniyet stoğu = ${formatNumber(r.emniyetStoguYuvarli)} birim · %${formatNumber(inputs.servisSeviyesi!)} servis seviyesi (Z = ${formatNumber(r.zKatsayisi)})`,
      rows: [
        { label: 'Kullanılan Z katsayısı', value: formatNumber(r.zKatsayisi) },
        { label: 'Ham emniyet stoğu', value: `${formatNumber(r.emniyetStogu)} birim` },
      ],
    };
  },
};

const ropDef: CalculatorDef = {
  slug: 'yeniden-siparis-noktasi-hesaplama',
  fields: [
    { name: 'gunlukTalep', label: 'Ortalama Günlük Talep', suffix: 'adet/gün', defaultValue: 50, min: 0, step: 0.1 },
    { name: 'tedarikSuresi', label: 'Tedarik Süresi (L)', suffix: 'gün', defaultValue: 9, min: 0.1, step: 0.1 },
    { name: 'emniyetStogu', label: 'Emniyet Stoğu', suffix: 'adet', defaultValue: 99, min: 0, step: 1 },
  ],
  compute: (inputs) => {
    const r = rop({
      gunlukTalep: inputs.gunlukTalep!,
      tedarikSuresi: inputs.tedarikSuresi!,
      emniyetStogu: inputs.emniyetStogu!,
    });
    return {
      value: formatNumber(r.ropYuvarli),
      unit: 'birim',
      summary: `Yeniden sipariş noktası = ${formatNumber(r.ropYuvarli)} birim · stok bu seviyeye düşünce sipariş ver`,
      rows: [
        { label: 'Tedarik süresi talebi', value: `${formatNumber(r.tedarikSuresiTalebi)} birim` },
        { label: 'Emniyet stoğu payı', value: `${formatNumber(inputs.emniyetStogu!)} birim` },
      ],
    };
  },
};

const oeeDef: CalculatorDef = {
  slug: 'oee-hesaplama',
  fields: [
    { name: 'planlananSure', label: 'Planlanan Üretim Süresi', suffix: 'dk', defaultValue: 480, min: 1, step: 1 },
    { name: 'durusSuresi', label: 'Plansız Duruş Süresi', suffix: 'dk', defaultValue: 60, min: 0, step: 1 },
    { name: 'idealCevrimSuresi', label: 'İdeal Çevrim Süresi', suffix: 'sn/adet', defaultValue: 1, min: 0.01, step: 0.01 },
    { name: 'toplamUretim', label: 'Toplam Üretim', suffix: 'adet', defaultValue: 19271, min: 1, step: 1 },
    { name: 'kusurluAdet', label: 'Kusurlu Adet', suffix: 'adet', defaultValue: 423, min: 0, step: 1 },
  ],
  compute: (inputs) => {
    const r = oee({
      planlananSure: inputs.planlananSure!,
      durusSuresi: inputs.durusSuresi!,
      idealCevrimSuresi: inputs.idealCevrimSuresi!,
      toplamUretim: inputs.toplamUretim!,
      kusurluAdet: inputs.kusurluAdet!,
    });
    return {
      value: formatPercent(r.oee),
      unit: 'OEE',
      summary: `OEE = ${formatPercent(r.oee)} · Kullanılabilirlik ${formatPercent(
        r.kullanilabilirlik,
      )} × Performans ${formatPercent(r.performans)} × Kalite ${formatPercent(r.kalite)}`,
      rows: [
        { label: 'Kullanılabilirlik', value: formatPercent(r.kullanilabilirlik) },
        { label: 'Performans', value: formatPercent(r.performans) },
        { label: 'Kalite', value: formatPercent(r.kalite) },
        { label: 'Sağlam üretim', value: `${formatNumber(r.saglamAdet)} adet` },
      ],
    };
  },
};

const fireOraniDef: CalculatorDef = {
  slug: 'fire-orani-hesaplama',
  fields: [
    { name: 'toplamGiren', label: 'Toplam Giren Miktar', suffix: 'adet', defaultValue: 1000, min: 0.01, step: 1 },
    { name: 'fireMiktari', label: 'Fire / Hurda Miktarı', suffix: 'adet', defaultValue: 50, min: 0, step: 1 },
  ],
  compute: (inputs) => {
    const r = fireOrani({
      toplamGiren: inputs.toplamGiren!,
      fireMiktari: inputs.fireMiktari!,
    });
    return {
      value: formatPercent(r.fireOrani),
      unit: 'fire',
      summary: `Fire oranı = ${formatPercent(r.fireOrani)} · verim ${formatPercent(
        r.verim,
      )} · sağlam ${formatNumber(r.saglamMiktar)} birim`,
      rows: [
        { label: 'Verim (sağlam oranı)', value: formatPercent(r.verim) },
        { label: 'Sağlam miktar', value: `${formatNumber(r.saglamMiktar)} birim` },
      ],
    };
  },
};

/**
 * Kategori → temsili komisyon oranı (ondalık; aralığın ortası).
 * Oranlar TAHMİNİDİR; bağlayıcı oran Trendyol Satıcı Panelindedir.
 * Veri kaynağı: trendyol-komisyon-veri-paketi.md. Kitap & Kırtasiye için
 * Trendyol'a özel net oran bulunamadığından listeye alınmadı.
 */
const trendyolKomisyonDef: CalculatorDef = {
  slug: 'trendyol-komisyon-hesaplama',
  fields: [
    { name: 'satisFiyati', label: 'Satış Fiyatı (KDV dahil)', suffix: '₺', defaultValue: 600, min: 0, step: 0.01 },
    { name: 'alisMaliyeti', label: 'Alış Maliyeti (KDV dahil)', suffix: '₺', defaultValue: 240, min: 0, step: 0.01 },
    { name: 'kargo', label: 'Kargo Bedeli (KDV dahil)', suffix: '₺', defaultValue: 100, min: 0, step: 0.01 },
    {
      name: 'kategori',
      label: 'Kategori (tahmini oran)',
      defaultValue: 0.1918,
      options: [
        { label: 'Giyim (~%19,18)', value: 0.1918 },
        { label: 'Ayakkabı (~%21,20)', value: 0.212 },
        { label: 'Çanta & Aksesuar (~%21,67)', value: 0.2167 },
        { label: 'Takı (~%21,87)', value: 0.2187 },
        { label: 'Elektronik (~%17,50)', value: 0.175 },
        { label: 'Bilgisayar & Tablet (~%11,50)', value: 0.115 },
        { label: 'Telefon Aksesuar (~%21,00)', value: 0.21 },
        { label: 'Kozmetik & Parfüm (~%14,75)', value: 0.1475 },
        { label: 'Kişisel Bakım (~%17,14)', value: 0.1714 },
        { label: 'Ev & Yaşam (~%16,18)', value: 0.1618 },
        { label: 'Mutfak & Küçük Ev (~%15,16)', value: 0.1516 },
        { label: 'Anne & Bebek (~%16,50)', value: 0.165 },
        { label: 'Oyuncak & Hobi (~%16,50)', value: 0.165 },
        { label: 'Spor & Outdoor (~%12,75)', value: 0.1275 },
        { label: 'Bahçe & Yapı Market (~%16,50)', value: 0.165 },
        { label: 'Gıda & İçecek (~%13,00)', value: 0.13 },
        { label: 'Pet Shop (~%15,25)', value: 0.1525 },
        { label: 'Otomotiv Aksesuar (~%16,50)', value: 0.165 },
        { label: 'Sağlık & Wellness (~%17,29)', value: 0.1729 },
      ],
    },
    { name: 'komisyonOrani', label: 'Komisyon Oranı (elle, 0 = kategoriyi kullan)', suffix: '%', defaultValue: 0, min: 0, step: 0.01 },
    {
      name: 'kdvOrani',
      label: 'KDV Oranı',
      defaultValue: 20,
      options: [
        { label: '%20', value: 20 },
        { label: '%10', value: 10 },
        { label: '%1', value: 1 },
      ],
    },
    {
      name: 'hizmetBedeli',
      label: 'Platform Hizmet Bedeli (KDV hariç)',
      defaultValue: 10.99,
      options: [
        { label: '10,99 ₺ (standart)', value: 10.99 },
        { label: '6,99 ₺ (Bugün Kargoda)', value: 6.99 },
      ],
    },
    {
      name: 'komisyonTabani',
      label: 'Komisyon Tabanı',
      defaultValue: 0,
      options: [
        { label: 'KDV hariç (önerilen)', value: 0 },
        { label: 'KDV dahil', value: 1 },
      ],
    },
  ],
  compute: (inputs) => {
    const v = (inputs.kdvOrani ?? 20) / 100;
    const elleOran = inputs.komisyonOrani ?? 0;
    const komisyonOrani = elleOran > 0 ? elleOran / 100 : (inputs.kategori ?? 0);
    const r = trendyolKomisyon({
      satisFiyatiKdvDahil: inputs.satisFiyati!,
      alisMaliyetiKdvDahil: inputs.alisMaliyeti!,
      komisyonOrani,
      kdvOrani: v,
      kargoKdvDahil: inputs.kargo ?? 0,
      hizmetBedeliKdvHaric: inputs.hizmetBedeli ?? 10.99,
      komisyonTabani: inputs.komisyonTabani === 1 ? 'dahil' : 'haric',
    });
    const kargoHaric = (inputs.kargo ?? 0) > 0 ? (inputs.kargo ?? 0) / (1 + v) : 0;
    const basabas = Number.isFinite(r.basabasFiyatKdvDahil)
      ? formatCurrency(r.basabasFiyatKdvDahil)
      : '—';
    return {
      value: formatCurrency(r.netKar),
      unit: '₺ net kâr',
      summary: `Marj %${formatNumber(r.karMarji)} · komisyon ${formatCurrency(
        r.komisyonTutari,
      )} · başabaş ${basabas}`,
      rows: [
        { label: 'KDV hariç satış', value: formatCurrency(r.kdvHaricSatis) },
        { label: 'Komisyon tutarı', value: formatCurrency(r.komisyonTutari) },
        { label: 'Platform hizmet bedeli', value: formatCurrency(inputs.hizmetBedeli ?? 10.99) },
        { label: 'Kargo (KDV hariç)', value: formatCurrency(kargoHaric) },
        { label: 'Toplam kesinti', value: formatCurrency(r.toplamKesinti) },
        { label: 'Stopaj (bilgi: mahsup edilir)', value: formatCurrency(r.stopaj) },
        { label: 'Başabaş fiyat (KDV dahil)', value: basabas },
      ],
    };
  },
};

const REGISTRY: Record<string, CalculatorDef> = {
  [eoqDef.slug]: eoqDef,
  [stokDevirHiziDef.slug]: stokDevirHiziDef,
  [emniyetStoguDef.slug]: emniyetStoguDef,
  [ropDef.slug]: ropDef,
  [oeeDef.slug]: oeeDef,
  [fireOraniDef.slug]: fireOraniDef,
  [trendyolKomisyonDef.slug]: trendyolKomisyonDef,
};

export function getCalculator(slug: string): CalculatorDef | null {
  return REGISTRY[slug] ?? null;
}
