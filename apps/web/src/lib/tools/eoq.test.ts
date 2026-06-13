import { describe, it, expect } from 'vitest';
import { eoq } from './eoq';

describe('eoq', () => {
  it('bilinen değerler için doğru EOQ hesaplar', () => {
    // D=1000, S=10, H=2 → EOQ = sqrt(2*1000*10/2) = sqrt(10000) = 100
    const result = eoq({ yillikTalep: 1000, siparisMaliyeti: 10, tasimaMaliyeti: 2 });
    expect(result.eoq).toBeCloseTo(100, 6);
    expect(result.yillikSiparisSayisi).toBeCloseTo(10, 6);
    // toplam maliyet = (1000/100)*10 + (100/2)*2 = 100 + 100 = 200
    expect(result.toplamMaliyet).toBeCloseTo(200, 6);
  });

  it('optimum noktada sipariş ve taşıma maliyeti eşittir', () => {
    const { eoq: q, toplamMaliyet } = eoq({
      yillikTalep: 2400,
      siparisMaliyeti: 50,
      tasimaMaliyeti: 3,
    });
    const siparisMaliyetiToplam = (2400 / q) * 50;
    const tasimaMaliyetiToplam = (q / 2) * 3;
    expect(siparisMaliyetiToplam).toBeCloseTo(tasimaMaliyetiToplam, 6);
    expect(siparisMaliyetiToplam + tasimaMaliyetiToplam).toBeCloseTo(toplamMaliyet, 6);
  });

  it('geçersiz (sıfır/negatif) girdilerde hata fırlatır', () => {
    expect(() => eoq({ yillikTalep: 0, siparisMaliyeti: 10, tasimaMaliyeti: 2 })).toThrow(
      RangeError,
    );
    expect(() => eoq({ yillikTalep: 100, siparisMaliyeti: -1, tasimaMaliyeti: 2 })).toThrow(
      RangeError,
    );
  });
});
