import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Stokoloji çerez ve gizlilik politikası.',
  alternates: { canonical: '/gizlilik' },
};

export default function GizlilikPage() {
  return (
    <div className="container" style={{ maxWidth: 760, paddingBlock: 'var(--s-7)' }}>
      <h1 className="h1">Gizlilik ve Çerez Politikası</h1>
      <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
        <p>
          Stokoloji, deneyiminizi iyileştirmek ve site trafiğini anlamak için analitik
          çerezler kullanır. Açık onayınız olmadan hiçbir analitik veya izleme aracı
          (Google Analytics, Microsoft Clarity) yüklenmez.
        </p>
        <p>
          Çerez bannerında <strong>Reddet</strong> seçeneğini kullanarak izlemeyi
          kapatabilirsiniz; tercihiniz tarayıcınızda saklanır ve istediğiniz zaman
          değiştirebilirsiniz.
        </p>
        <p className="text-sm text-muted">
          Bu metin demo amaçlıdır; üretimde KVKK gereklilikleri doğrultusunda
          detaylandırılmalıdır.
        </p>
      </div>
    </div>
  );
}
