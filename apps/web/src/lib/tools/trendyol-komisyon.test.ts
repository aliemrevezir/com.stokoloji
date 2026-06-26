import { describe, it, expect } from 'vitest';
import { trendyolKomisyon } from './trendyol-komisyon';

describe('trendyolKomisyon', () => {
  const temel = {
    satisFiyatiKdvDahil: 600,
    alisMaliyetiKdvDahil: 240,
    komisyonOrani: 0.2,
    kdvOrani: 0.2,
    kargoKdvDahil: 100,
    hizmetBedeliKdvHaric: 10.99,
  } as const;

  it('KDV hariç taban için doğru kâr hesaplar', () => {
    const r = trendyolKomisyon({ ...temel, komisyonTabani: 'haric' });
    expect(r.kdvHaricSatis).toBeCloseTo(500, 2);
    expect(r.komisyonTutari).toBeCloseTo(100, 2);
    expect(r.netKar).toBeCloseTo(105.68, 2);
    expect(r.karMarji).toBeCloseTo(17.61, 2);
  });

  it('KDV dahil taban komisyonu KDV dahil fiyat üzerinden hesaplar', () => {
    const r = trendyolKomisyon({ ...temel, komisyonTabani: 'dahil' });
    expect(r.komisyonTutari).toBeCloseTo(120, 2);
    expect(r.netKar).toBeCloseTo(85.68, 2);
    expect(r.karMarji).toBeCloseTo(14.28, 2);
  });

  it('başabaş fiyatını (KDV dahil) doğru hesaplar', () => {
    const r = trendyolKomisyon({ ...temel, komisyonTabani: 'haric' });
    expect(r.basabasFiyatKdvDahil).toBeCloseTo(441.49, 2);
  });

  it('başabaş fiyatında net kâr sıfırdır', () => {
    const r = trendyolKomisyon({
      ...temel,
      satisFiyatiKdvDahil: 441.49,
      komisyonTabani: 'haric',
    });
    expect(r.netKar).toBeCloseTo(0, 1);
  });

  it('stopaj KDV hariç satışın %1 i ve net kârdan düşülmez', () => {
    const r = trendyolKomisyon({ ...temel, komisyonTabani: 'haric' });
    expect(r.stopaj).toBeCloseTo(5, 2);
    // stopaj toplam kesintiye dahil değil
    expect(r.toplamKesinti).toBeCloseTo(100 + 10.99 + 100 / 1.2, 2);
  });

  it('satış 0 ise çökmeden 0 marj döndürür', () => {
    const r = trendyolKomisyon({ ...temel, satisFiyatiKdvDahil: 0 });
    expect(r.karMarji).toBe(0);
    expect(Number.isFinite(r.netKar)).toBe(true);
  });

  it('negatif girdilerde RangeError fırlatır', () => {
    expect(() => trendyolKomisyon({ ...temel, satisFiyatiKdvDahil: -1 })).toThrow(RangeError);
    expect(() => trendyolKomisyon({ ...temel, komisyonOrani: -0.1 })).toThrow(RangeError);
    expect(() => trendyolKomisyon({ ...temel, kdvOrani: -0.2 })).toThrow(RangeError);
  });

  it('komisyon oranı >= 1 (haric) ise başabaş Infinity döner', () => {
    const r = trendyolKomisyon({ ...temel, komisyonOrani: 1, komisyonTabani: 'haric' });
    expect(r.basabasFiyatKdvDahil).toBe(Infinity);
  });
});
