import { describe, it, expect } from 'vitest';
import { fireOrani } from './fire-orani';

describe('fireOrani', () => {
  it('tipik değerler için doğru oran hesaplar', () => {
    // 1000 giren, 50 fire → %5 fire, %95 verim, 950 sağlam
    const r = fireOrani({ toplamGiren: 1000, fireMiktari: 50 });
    expect(r.fireOrani).toBeCloseTo(0.05, 6);
    expect(r.verim).toBeCloseTo(0.95, 6);
    expect(r.saglamMiktar).toBe(950);
  });

  it('fire sıfırsa oran 0 verim 1 olur', () => {
    const r = fireOrani({ toplamGiren: 500, fireMiktari: 0 });
    expect(r.fireOrani).toBe(0);
    expect(r.verim).toBe(1);
    expect(r.saglamMiktar).toBe(500);
  });

  it('ondalıklı (kg) girdileri destekler', () => {
    const r = fireOrani({ toplamGiren: 250.5, fireMiktari: 12.5 });
    expect(r.fireOrani).toBeCloseTo(0.049900, 5);
    expect(r.saglamMiktar).toBeCloseTo(238, 6);
  });

  it('geçersiz girdilerde hata fırlatır', () => {
    expect(() => fireOrani({ toplamGiren: 0, fireMiktari: 0 })).toThrow(RangeError);
    expect(() => fireOrani({ toplamGiren: 100, fireMiktari: -5 })).toThrow(RangeError);
    expect(() => fireOrani({ toplamGiren: 100, fireMiktari: 150 })).toThrow(RangeError);
  });
});
