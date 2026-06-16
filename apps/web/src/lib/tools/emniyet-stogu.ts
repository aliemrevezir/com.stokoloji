/**
 * Emniyet Stoğu — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * İstatistiksel (servis seviyeli) yöntem:
 *   Emniyet Stoğu = Z × σ_d × √L
 *     σ_d = günlük talebin standart sapması
 *     L   = tedarik süresi (gün)
 *     Z   = hedef servis seviyesine karşılık gelen güven katsayısı
 *           (standart normal dağılımın ters CDF'i)
 */

export interface EmniyetStoguInput {
  /** Günlük talebin standart sapması (σ_d) */
  talepStdSapma: number;
  /** Tedarik süresi (L, gün) */
  tedarikSuresi: number;
  /** Hedef servis seviyesi (%) — örn. 95 */
  servisSeviyesi: number;
}

export interface EmniyetStoguResult {
  /** Kullanılan Z güven katsayısı */
  zKatsayisi: number;
  /** Ham emniyet stoğu (yuvarlanmamış) */
  emniyetStogu: number;
  /** Pratik kullanım için yukarı yuvarlanmış emniyet stoğu (adet) */
  emniyetStoguYuvarli: number;
}

/**
 * Standart normal dağılımın ters CDF'i (inverse normal / probit).
 * Acklam'ın rasyonel yaklaşımı; |hata| < 1.15e-9. p ∈ (0,1).
 */
export function inverseNormal(p: number): number {
  if (!(p > 0 && p < 1)) {
    throw new RangeError('Olasılık 0 ile 1 arasında olmalıdır.');
  }
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0, -2.549732539343734e0,
    4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0, 3.754408661907416e0,
  ];
  const plow = 0.02425;
  const phigh = 1 - plow;

  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (p <= phigh) {
    const q = p - 0.5;
    const r = q * q;
    return (
      ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
      (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
    );
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(
    (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
    ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
  );
}

export function emniyetStogu(input: EmniyetStoguInput): EmniyetStoguResult {
  const { talepStdSapma, tedarikSuresi, servisSeviyesi } = input;

  if (![talepStdSapma, tedarikSuresi, servisSeviyesi].every(Number.isFinite)) {
    throw new RangeError('Emniyet stoğu girdileri sayısal olmalıdır.');
  }
  if (talepStdSapma < 0) {
    throw new RangeError('Talep standart sapması negatif olamaz.');
  }
  if (tedarikSuresi <= 0) {
    throw new RangeError('Tedarik süresi sıfırdan büyük olmalıdır.');
  }
  if (!(servisSeviyesi > 0 && servisSeviyesi < 100)) {
    throw new RangeError('Servis seviyesi 0 ile 100 arasında (hariç) olmalıdır.');
  }

  const zKatsayisi = inverseNormal(servisSeviyesi / 100);
  const emniyetStoguHam = zKatsayisi * talepStdSapma * Math.sqrt(tedarikSuresi);

  return {
    zKatsayisi,
    emniyetStogu: emniyetStoguHam,
    emniyetStoguYuvarli: Math.ceil(emniyetStoguHam),
  };
}
