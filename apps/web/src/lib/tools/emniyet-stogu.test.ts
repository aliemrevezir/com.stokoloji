import { describe, it, expect } from 'vitest';
import { emniyetStogu, inverseNormal } from './emniyet-stogu';

describe('inverseNormal', () => {
  it('bilinen servis seviyesi Z değerlerini yaklaşık verir', () => {
    expect(inverseNormal(0.9)).toBeCloseTo(1.2816, 3);
    expect(inverseNormal(0.95)).toBeCloseTo(1.6449, 3);
    expect(inverseNormal(0.975)).toBeCloseTo(1.96, 2);
    expect(inverseNormal(0.99)).toBeCloseTo(2.3263, 3);
  });

  it('0 ve 1 sınırlarında hata fırlatır', () => {
    expect(() => inverseNormal(0)).toThrow(RangeError);
    expect(() => inverseNormal(1)).toThrow(RangeError);
  });
});

describe('emniyetStogu', () => {
  it('bilinen örnek için doğru emniyet stoğu hesaplar', () => {
    // σ_d=20, L=9, %95 (Z≈1,6449) → 1,6449×20×3 ≈ 98,69 → yuvarlı 99
    const r = emniyetStogu({ talepStdSapma: 20, tedarikSuresi: 9, servisSeviyesi: 95 });
    expect(r.zKatsayisi).toBeCloseTo(1.6449, 3);
    expect(r.emniyetStogu).toBeCloseTo(98.69, 1);
    expect(r.emniyetStoguYuvarli).toBe(99);
  });

  it('talep dalgalanması sıfırsa emniyet stoğu sıfırdır', () => {
    const r = emniyetStogu({ talepStdSapma: 0, tedarikSuresi: 9, servisSeviyesi: 95 });
    expect(r.emniyetStogu).toBe(0);
    expect(r.emniyetStoguYuvarli).toBe(0);
  });

  it('servis seviyesi yükseldikçe emniyet stoğu artar', () => {
    const dusuk = emniyetStogu({ talepStdSapma: 20, tedarikSuresi: 9, servisSeviyesi: 90 });
    const yuksek = emniyetStogu({ talepStdSapma: 20, tedarikSuresi: 9, servisSeviyesi: 99 });
    expect(yuksek.emniyetStogu).toBeGreaterThan(dusuk.emniyetStogu);
  });

  it('geçersiz girdilerde hata fırlatır', () => {
    expect(() => emniyetStogu({ talepStdSapma: -1, tedarikSuresi: 9, servisSeviyesi: 95 })).toThrow(
      RangeError,
    );
    expect(() => emniyetStogu({ talepStdSapma: 20, tedarikSuresi: 0, servisSeviyesi: 95 })).toThrow(
      RangeError,
    );
    expect(() => emniyetStogu({ talepStdSapma: 20, tedarikSuresi: 9, servisSeviyesi: 100 })).toThrow(
      RangeError,
    );
  });
});
