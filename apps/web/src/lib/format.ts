/** Türkçe sayı/para formatlayıcıları (sonuç gösterimi için). */

const nf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
const cf = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
});

export function formatNumber(value: number): string {
  return nf.format(value);
}

export function formatCurrency(value: number): string {
  return cf.format(value);
}

const pf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });

/** 0-1 aralığındaki oranı Türkçe yüzde gösterimine çevirir (0.875 → "%87,5"). */
export function formatPercent(ratio: number): string {
  return `%${pf.format(ratio * 100)}`;
}

const df = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** ISO tarih dizesini Türkçe okunur tarihe çevirir (geçersizse null). */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return df.format(date);
}
