import { describe, it, expect } from 'vitest';
import { stokDevirHizi } from './stok-devir-hizi';

describe('stokDevirHizi', () => {
  it('bilinen değerler için doğru devir hızı hesaplar', () => {
    // SMM=2.000.000, başı=300.000, sonu=400.000 → ort=350.000 → SDH ≈ 5,71
    const r = stokDevirHizi({ smm: 2_000_000, donemBasiStok: 300_000, donemSonuStok: 400_000 });
    expect(r.ortalamaStok).toBeCloseTo(350_000, 6);
    expect(r.devirHizi).toBeCloseTo(5.7142857, 5);
    // stokta kalma = 365 / 5,7142857 ≈ 63,875 gün
    expect(r.stoktaKalmaSuresi).toBeCloseTo(63.875, 3);
  });

  it('dönem günü değiştirilince stokta kalma süresi orantılı değişir', () => {
    // aylık: 30 günlük dönem
    const r = stokDevirHizi({
      smm: 600_000,
      donemBasiStok: 100_000,
      donemSonuStok: 100_000,
      donemGunu: 30,
    });
    expect(r.devirHizi).toBeCloseTo(6, 6);
    expect(r.stoktaKalmaSuresi).toBeCloseTo(5, 6);
  });

  it('geçersiz (sıfır/negatif) girdilerde hata fırlatır', () => {
    expect(() => stokDevirHizi({ smm: 0, donemBasiStok: 100, donemSonuStok: 100 })).toThrow(
      RangeError,
    );
    expect(() => stokDevirHizi({ smm: 1000, donemBasiStok: 0, donemSonuStok: 0 })).toThrow(
      RangeError,
    );
    expect(() => stokDevirHizi({ smm: 1000, donemBasiStok: -50, donemSonuStok: 100 })).toThrow(
      RangeError,
    );
  });
});
