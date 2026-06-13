/**
 * EOQ (Ekonomik Sipariş Miktarı) — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * EOQ = √( (2 · D · S) / H )
 *   D = yıllık talep, S = sipariş başına maliyet, H = birim/yıl taşıma maliyeti
 */

export interface EoqInput {
  /** Yıllık talep (birim/yıl) — D */
  yillikTalep: number;
  /** Sipariş başına maliyet (₺) — S */
  siparisMaliyeti: number;
  /** Birim başına yıllık taşıma/elde tutma maliyeti (₺) — H */
  tasimaMaliyeti: number;
}

export interface EoqResult {
  /** Ekonomik sipariş miktarı (birim) */
  eoq: number;
  /** Yılda verilecek sipariş sayısı (D / EOQ) */
  yillikSiparisSayisi: number;
  /** Yıllık toplam maliyet (sipariş + taşıma) */
  toplamMaliyet: number;
}

export function eoq(input: EoqInput): EoqResult {
  const { yillikTalep: D, siparisMaliyeti: S, tasimaMaliyeti: H } = input;

  if (!Number.isFinite(D) || !Number.isFinite(S) || !Number.isFinite(H)) {
    throw new RangeError('EOQ girdileri sayısal olmalıdır.');
  }
  if (D <= 0 || S <= 0 || H <= 0) {
    throw new RangeError('EOQ girdileri sıfırdan büyük olmalıdır.');
  }

  const eoqValue = Math.sqrt((2 * D * S) / H);
  const yillikSiparisSayisi = D / eoqValue;
  const toplamMaliyet = (D / eoqValue) * S + (eoqValue / 2) * H;

  return {
    eoq: eoqValue,
    yillikSiparisSayisi,
    toplamMaliyet,
  };
}
