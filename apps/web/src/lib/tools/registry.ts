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

const REGISTRY: Record<string, CalculatorDef> = {
  [eoqDef.slug]: eoqDef,
};

export function getCalculator(slug: string): CalculatorDef | null {
  return REGISTRY[slug] ?? null;
}
