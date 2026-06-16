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
import { formatNumber, formatCurrency } from '../format';

export interface CalculatorField {
  name: string;
  label: string;
  suffix?: string;
  defaultValue: number;
  min?: number;
  step?: number;
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
  ],
  compute: (inputs) => {
    const r = stokDevirHizi({
      smm: inputs.smm!,
      donemBasiStok: inputs.donemBasiStok!,
      donemSonuStok: inputs.donemSonuStok!,
    });
    return {
      value: formatNumber(r.devirHizi),
      unit: 'kez/yıl',
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

const REGISTRY: Record<string, CalculatorDef> = {
  [eoqDef.slug]: eoqDef,
  [stokDevirHiziDef.slug]: stokDevirHiziDef,
  [emniyetStoguDef.slug]: emniyetStoguDef,
  [ropDef.slug]: ropDef,
};

export function getCalculator(slug: string): CalculatorDef | null {
  return REGISTRY[slug] ?? null;
}
