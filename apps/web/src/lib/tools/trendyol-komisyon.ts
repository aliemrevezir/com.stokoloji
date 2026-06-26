/**
 * Trendyol Komisyon & Kâr — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * KDV mükellefi satıcı için "KDV nötr" model: tahsil edilen ve ödenen KDV'ler
 * indirilir, kârı etkilemez. Tüm kalemler KDV hariç çalışılır. Komisyon üzerine
 * eklenen KDV de indirilebildiği için gerçek nakit yük çıplak komisyon tutarıdır.
 * Detay/kaynaklar: trendyol-komisyon-veri-paketi.md.
 */

export interface TrendyolKomisyonInput {
  /** Müşterinin ödediği KDV dahil satış fiyatı (₺) */
  satisFiyatiKdvDahil: number;
  /** Ürün alış maliyeti, KDV dahil (₺) */
  alisMaliyetiKdvDahil: number;
  /** Komisyon oranı, ondalık (ör. 0.20). Yüzde değil. */
  komisyonOrani: number;
  /** KDV oranı, ondalık (default 0.20; 0.10 / 0.01 olabilir) */
  kdvOrani?: number;
  /** Kargo bedeli, KDV dahil (kullanıcı girer, default 0) */
  kargoKdvDahil?: number;
  /** Platform hizmet bedeli, KDV hariç (default 10.99; alternatif 6.99) */
  hizmetBedeliKdvHaric?: number;
  /** Komisyon hangi tabandan kesilir (default 'haric') */
  komisyonTabani?: 'haric' | 'dahil';
}

export interface TrendyolKomisyonResult {
  /** KDV hariç satış matrahı */
  kdvHaricSatis: number;
  /** Komisyonun gerçek nakit yükü (çıplak; komisyon KDV'si indirilebilir → nötr) */
  komisyonTutari: number;
  /** BİLGİ amaçlı; net kârdan DÜŞÜLMEZ (mahsup edilen peşin vergi) */
  stopaj: number;
  /** Komisyon + hizmet bedeli + kargo (KDV hariç) */
  toplamKesinti: number;
  /** Net kâr (KDV nötr model) */
  netKar: number;
  /** Kâr marjı, yüzde (net kâr / KDV dahil satış * 100) */
  karMarji: number;
  /** Net kârın sıfır olduğu KDV dahil satış fiyatı */
  basabasFiyatKdvDahil: number;
}

export function trendyolKomisyon(input: TrendyolKomisyonInput): TrendyolKomisyonResult {
  const {
    satisFiyatiKdvDahil: Sd,
    alisMaliyetiKdvDahil: Ad,
    komisyonOrani: k,
    kdvOrani: v = 0.2,
    kargoKdvDahil: Kd = 0,
    hizmetBedeliKdvHaric: hizmet = 10.99,
    komisyonTabani = 'haric',
  } = input;

  if (![Sd, Ad, k, v, Kd, hizmet].every(Number.isFinite)) {
    throw new RangeError('Trendyol komisyon girdileri sayısal olmalıdır.');
  }
  if (Sd < 0 || Ad < 0 || k < 0 || v < 0 || Kd < 0 || hizmet < 0) {
    throw new RangeError('Trendyol komisyon girdileri negatif olamaz.');
  }

  // v >= 0 doğrulandığından (1 + v) >= 1; bölme güvenli.
  const Sh = Sd / (1 + v);
  const Ah = Ad / (1 + v);
  const kargoHaric = Kd / (1 + v);

  const komisyonTutari = komisyonTabani === 'haric' ? Sh * k : Sd * k;
  const stopaj = Sh * 0.01;
  const toplamKesinti = komisyonTutari + hizmet + kargoHaric;
  const netKar = Sh - Ah - komisyonTutari - hizmet - kargoHaric;
  const karMarji = Sd > 0 ? (netKar / Sd) * 100 : 0;

  // Başabaş (netKar = 0). Payda işareti yanlışsa başabaş tanımsız → Infinity.
  const sabitYuk = Ah + kargoHaric + hizmet;
  let basabasFiyatKdvDahil: number;
  if (komisyonTabani === 'haric') {
    basabasFiyatKdvDahil = k < 1 ? (sabitYuk / (1 - k)) * (1 + v) : Infinity;
  } else {
    const payda = 1 / (1 + v) - k;
    basabasFiyatKdvDahil = payda > 0 ? sabitYuk / payda : Infinity;
  }

  return {
    kdvHaricSatis: Sh,
    komisyonTutari,
    stopaj,
    toplamKesinti,
    netKar,
    karMarji,
    basabasFiyatKdvDahil,
  };
}
