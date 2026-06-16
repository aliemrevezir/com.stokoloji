import { describe, it, expect } from 'vitest';
import { rop } from './rop';

describe('rop', () => {
  it('bilinen örnek için doğru ROP hesaplar', () => {
    // günlük talep=50, L=9, emniyet stoğu=99 → (50×9)+99 = 549
    const r = rop({ gunlukTalep: 50, tedarikSuresi: 9, emniyetStogu: 99 });
    expect(r.tedarikSuresiTalebi).toBe(450);
    expect(r.rop).toBe(549);
    expect(r.ropYuvarli).toBe(549);
  });

  it('emniyet stoğu sıfırsa ROP yalnız tedarik süresi talebine eşittir', () => {
    const r = rop({ gunlukTalep: 50, tedarikSuresi: 9, emniyetStogu: 0 });
    expect(r.rop).toBe(450);
    expect(r.ropYuvarli).toBe(450);
  });

  it('ham sonucu yukarı yuvarlar', () => {
    // (12,3×4) + 10 = 59,2 → 60
    const r = rop({ gunlukTalep: 12.3, tedarikSuresi: 4, emniyetStogu: 10 });
    expect(r.rop).toBeCloseTo(59.2, 5);
    expect(r.ropYuvarli).toBe(60);
  });

  it('tedarik süresi uzadıkça ROP artar', () => {
    const kisa = rop({ gunlukTalep: 50, tedarikSuresi: 5, emniyetStogu: 99 });
    const uzun = rop({ gunlukTalep: 50, tedarikSuresi: 12, emniyetStogu: 99 });
    expect(uzun.rop).toBeGreaterThan(kisa.rop);
  });

  it('geçersiz girdilerde hata fırlatır', () => {
    expect(() => rop({ gunlukTalep: -1, tedarikSuresi: 9, emniyetStogu: 99 })).toThrow(RangeError);
    expect(() => rop({ gunlukTalep: 50, tedarikSuresi: 0, emniyetStogu: 99 })).toThrow(RangeError);
    expect(() => rop({ gunlukTalep: 50, tedarikSuresi: 9, emniyetStogu: -5 })).toThrow(RangeError);
  });
});
