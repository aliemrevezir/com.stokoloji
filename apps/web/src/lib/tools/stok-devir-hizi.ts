/**
 * Stok Devir Hızı — SAF hesaplama mantığı.
 *
 * Framework bağımsız, yan etkisiz, test edilebilir. Strapi yalnızca bu tool'un
 * METNİNİ tutar; hesaplama burada, versiyon kontrolünde yaşar.
 *
 * SDH = SMM / Ortalama Stok
 *   SMM = dönemdeki Satılan Malların Maliyeti
 *   Ortalama Stok = (Dönem Başı Stok + Dönem Sonu Stok) / 2
 * Stokta kalma süresi (gün) = Dönem günü (varsayılan 365) / SDH
 */

export interface StokDevirHiziInput {
  /** Satılan Malların Maliyeti — dönem (₺) */
  smm: number;
  /** Dönem başı stok değeri (₺) */
  donemBasiStok: number;
  /** Dönem sonu stok değeri (₺) */
  donemSonuStok: number;
  /** Stokta kalma süresi hesabı için dönem günü (varsayılan 365 = yıllık) */
  donemGunu?: number;
}

export interface StokDevirHiziResult {
  /** Ortalama stok değeri (₺) */
  ortalamaStok: number;
  /** Stok devir hızı (dönemde kaç kez) */
  devirHizi: number;
  /** Ortalama stokta kalma süresi (gün) */
  stoktaKalmaSuresi: number;
}

export function stokDevirHizi(input: StokDevirHiziInput): StokDevirHiziResult {
  const { smm, donemBasiStok, donemSonuStok, donemGunu = 365 } = input;

  if (![smm, donemBasiStok, donemSonuStok, donemGunu].every(Number.isFinite)) {
    throw new RangeError('Stok devir hızı girdileri sayısal olmalıdır.');
  }
  if (smm <= 0) {
    throw new RangeError('Satılan malların maliyeti sıfırdan büyük olmalıdır.');
  }
  if (donemBasiStok < 0 || donemSonuStok < 0) {
    throw new RangeError('Stok değerleri negatif olamaz.');
  }

  const ortalamaStok = (donemBasiStok + donemSonuStok) / 2;
  if (ortalamaStok <= 0) {
    throw new RangeError('Ortalama stok sıfırdan büyük olmalıdır.');
  }

  const devirHizi = smm / ortalamaStok;
  const stoktaKalmaSuresi = donemGunu / devirHizi;

  return { ortalamaStok, devirHizi, stoktaKalmaSuresi };
}
