/**
 * OEE (Toplam Ekipman Etkinliği) — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * OEE = Kullanılabilirlik x Performans x Kalite
 *   Kullanılabilirlik = Çalışma Süresi / Planlanan Üretim Süresi
 *     Çalışma Süresi = Planlanan Süre - Duruş Süresi
 *   Performans = (İdeal Çevrim Süresi x Toplam Üretim) / Çalışma Süresi
 *     (İdeal çevrim süresi saniye; çalışma süresi dakika olduğundan saniyeye çevrilir.)
 *   Kalite = (Toplam Üretim - Kusurlu Adet) / Toplam Üretim
 * Tüm oranlar 0-1 aralığındadır; gösterimde yüzdeye çevrilir.
 */

export interface OeeInput {
  /** Planlanan üretim süresi (dakika) — vardiya süresi eksi planlı molalar */
  planlananSure: number;
  /** Plansız duruş süresi (dakika) — arıza, ayar, malzeme bekleme */
  durusSuresi: number;
  /** İdeal (teorik) çevrim süresi (saniye/adet) */
  idealCevrimSuresi: number;
  /** Dönemde üretilen toplam adet (sağlam + kusurlu) */
  toplamUretim: number;
  /** Kusurlu/ıskarta adet */
  kusurluAdet: number;
}

export interface OeeResult {
  /** Çalışma süresi (dakika) = planlanan - duruş */
  calismaSuresi: number;
  /** Kullanılabilirlik oranı (0-1) */
  kullanilabilirlik: number;
  /** Performans oranı (0-1) */
  performans: number;
  /** Kalite oranı (0-1) */
  kalite: number;
  /** OEE oranı (0-1) = K x P x Q */
  oee: number;
  /** Sağlam (kusursuz) üretilen adet */
  saglamAdet: number;
}

/** Oranı [0, 1] aralığına sıkıştırır (kayan nokta/aşırı girdiye karşı). */
function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function oee(input: OeeInput): OeeResult {
  const { planlananSure, durusSuresi, idealCevrimSuresi, toplamUretim, kusurluAdet } = input;

  if (
    ![planlananSure, durusSuresi, idealCevrimSuresi, toplamUretim, kusurluAdet].every(
      Number.isFinite,
    )
  ) {
    throw new RangeError('OEE girdileri sayısal olmalıdır.');
  }
  if (planlananSure <= 0) {
    throw new RangeError('Planlanan üretim süresi sıfırdan büyük olmalıdır.');
  }
  if (durusSuresi < 0 || idealCevrimSuresi < 0 || kusurluAdet < 0) {
    throw new RangeError('Süre ve adet değerleri negatif olamaz.');
  }
  if (durusSuresi >= planlananSure) {
    throw new RangeError('Duruş süresi planlanan süreden küçük olmalıdır.');
  }
  if (toplamUretim <= 0) {
    throw new RangeError('Toplam üretim sıfırdan büyük olmalıdır.');
  }
  if (kusurluAdet > toplamUretim) {
    throw new RangeError('Kusurlu adet toplam üretimden büyük olamaz.');
  }

  const calismaSuresi = planlananSure - durusSuresi;
  const kullanilabilirlik = clamp01(calismaSuresi / planlananSure);

  // İdeal çevrim süresi saniye → dakikaya çevrilir; teorik üretim süresi (dk).
  const teorikUretimSuresi = (idealCevrimSuresi / 60) * toplamUretim;
  const performans = clamp01(teorikUretimSuresi / calismaSuresi);

  const saglamAdet = toplamUretim - kusurluAdet;
  const kalite = clamp01(saglamAdet / toplamUretim);

  const oeeRatio = kullanilabilirlik * performans * kalite;

  return {
    calismaSuresi,
    kullanilabilirlik,
    performans,
    kalite,
    oee: oeeRatio,
    saglamAdet,
  };
}
