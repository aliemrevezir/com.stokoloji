/**
 * Fire Oranı (hurda/ıskarta oranı) — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * Fire Oranı (%) = (Fire Miktarı / Toplam Giren) x 100
 *   Sağlam Miktar = Toplam Giren - Fire Miktarı
 *   Verim (%) = (Sağlam Miktar / Toplam Giren) x 100 = 100 - Fire Oranı
 *
 * Birim soyut: adet, kg, metre vb. olabilir; tek koşul giren ile firenin aynı
 * birimde olması.
 */

export interface FireOraniInput {
  /** Sürece giren toplam miktar (adet/kg/metre) */
  toplamGiren: number;
  /** Fire/hurda/ıskarta miktarı (aynı birim) */
  fireMiktari: number;
}

export interface FireOraniResult {
  /** Fire oranı (0-1) */
  fireOrani: number;
  /** Verim / kullanılabilir oran (0-1) */
  verim: number;
  /** Sağlam (kullanılabilir) miktar */
  saglamMiktar: number;
}

export function fireOrani(input: FireOraniInput): FireOraniResult {
  const { toplamGiren, fireMiktari } = input;

  if (![toplamGiren, fireMiktari].every(Number.isFinite)) {
    throw new RangeError('Fire oranı girdileri sayısal olmalıdır.');
  }
  if (toplamGiren <= 0) {
    throw new RangeError('Toplam giren miktar sıfırdan büyük olmalıdır.');
  }
  if (fireMiktari < 0) {
    throw new RangeError('Fire miktarı negatif olamaz.');
  }
  if (fireMiktari > toplamGiren) {
    throw new RangeError('Fire miktarı toplam giren miktardan büyük olamaz.');
  }

  const oran = fireMiktari / toplamGiren;
  const saglamMiktar = toplamGiren - fireMiktari;

  return {
    fireOrani: oran,
    verim: 1 - oran,
    saglamMiktar,
  };
}
