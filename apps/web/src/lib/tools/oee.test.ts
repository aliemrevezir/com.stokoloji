import { describe, it, expect } from 'vitest';
import { oee } from './oee';

describe('oee', () => {
  it('dünya-class referans örneğini doğru hesaplar', () => {
    // Planlanan 480 dk, duruş 60 dk → çalışma 420 dk
    // İdeal çevrim 1 sn/adet, toplam üretim 19.271 adet
    // Kalite: 19.271 - 423 kusurlu = 18.848 sağlam
    const r = oee({
      planlananSure: 480,
      durusSuresi: 60,
      idealCevrimSuresi: 1,
      toplamUretim: 19_271,
      kusurluAdet: 423,
    });
    expect(r.kullanilabilirlik).toBeCloseTo(0.875, 4); // 420/480
    expect(r.performans).toBeCloseTo(0.764722, 4); // (1/60*19271)/420
    expect(r.kalite).toBeCloseTo(0.97805, 4); // 18848/19271
    expect(r.oee).toBeCloseTo(0.654444, 4); // 0.875 * 0.764722 * 0.97805
    expect(r.saglamAdet).toBe(18_848);
  });

  it('mükemmel üretimde tüm oranlar 1 olur', () => {
    // duruş yok, ideal hız tam tutuyor, kusur yok
    const r = oee({
      planlananSure: 600,
      durusSuresi: 0,
      idealCevrimSuresi: 60, // 1 dk/adet
      toplamUretim: 600,
      kusurluAdet: 0,
    });
    expect(r.kullanilabilirlik).toBeCloseTo(1, 6);
    expect(r.performans).toBeCloseTo(1, 6);
    expect(r.kalite).toBeCloseTo(1, 6);
    expect(r.oee).toBeCloseTo(1, 6);
  });

  it('ideal süreden hızlı üretimde performans 1 ile sınırlanır', () => {
    const r = oee({
      planlananSure: 100,
      durusSuresi: 0,
      idealCevrimSuresi: 120, // 2 dk/adet beklenir
      toplamUretim: 100, // 200 dk'lık iş 100 dk'da → >1 ham performans
      kusurluAdet: 0,
    });
    expect(r.performans).toBe(1);
  });

  it('geçersiz girdilerde hata fırlatır', () => {
    expect(() =>
      oee({ planlananSure: 0, durusSuresi: 0, idealCevrimSuresi: 1, toplamUretim: 10, kusurluAdet: 0 }),
    ).toThrow(RangeError);
    expect(() =>
      oee({ planlananSure: 100, durusSuresi: 100, idealCevrimSuresi: 1, toplamUretim: 10, kusurluAdet: 0 }),
    ).toThrow(RangeError);
    expect(() =>
      oee({ planlananSure: 100, durusSuresi: 10, idealCevrimSuresi: 1, toplamUretim: 0, kusurluAdet: 0 }),
    ).toThrow(RangeError);
    expect(() =>
      oee({ planlananSure: 100, durusSuresi: 10, idealCevrimSuresi: 1, toplamUretim: 10, kusurluAdet: 20 }),
    ).toThrow(RangeError);
  });
});
