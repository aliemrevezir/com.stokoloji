/**
 * Yeniden Sipariş Noktası (ROP) — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * Temel (sabit tedarik süresi) yöntemi:
 *   ROP = (Ortalama Günlük Talep × Tedarik Süresi) + Emniyet Stoğu
 *     gunlukTalep  = ortalama günlük talep (adet/gün)
 *     tedarikSuresi = tedarik süresi (L, gün)
 *     emniyetStogu  = belirsizliğe karşı tampon (adet); emniyet stoğu
 *                     hesaplayıcısından beslenir
 *
 * İlk terim tedarik süresi talebidir (lead time demand): sipariş verildiği andan
 * mal gelene kadar tüketilen ortalama miktar. Emniyet stoğu sıfır kabul edilirse
 * ROP yalnız tedarik süresi talebine eşit olur ve stoksuzluk riski %50'ye çıkar.
 */

export interface RopInput {
  /** Ortalama günlük talep (adet/gün) */
  gunlukTalep: number;
  /** Tedarik süresi (L, gün) */
  tedarikSuresi: number;
  /** Emniyet stoğu (adet) */
  emniyetStogu: number;
}

export interface RopResult {
  /** Tedarik süresi talebi = günlük talep × tedarik süresi */
  tedarikSuresiTalebi: number;
  /** Ham yeniden sipariş noktası (yuvarlanmamış) */
  rop: number;
  /** Pratik kullanım için yukarı yuvarlanmış ROP (adet) */
  ropYuvarli: number;
}

export function rop(input: RopInput): RopResult {
  const { gunlukTalep, tedarikSuresi, emniyetStogu } = input;

  if (![gunlukTalep, tedarikSuresi, emniyetStogu].every(Number.isFinite)) {
    throw new RangeError('Yeniden sipariş noktası girdileri sayısal olmalıdır.');
  }
  if (gunlukTalep < 0) {
    throw new RangeError('Ortalama günlük talep negatif olamaz.');
  }
  if (tedarikSuresi <= 0) {
    throw new RangeError('Tedarik süresi sıfırdan büyük olmalıdır.');
  }
  if (emniyetStogu < 0) {
    throw new RangeError('Emniyet stoğu negatif olamaz.');
  }

  const tedarikSuresiTalebi = gunlukTalep * tedarikSuresi;
  const ropHam = tedarikSuresiTalebi + emniyetStogu;

  return {
    tedarikSuresiTalebi,
    rop: ropHam,
    ropYuvarli: Math.ceil(ropHam),
  };
}
