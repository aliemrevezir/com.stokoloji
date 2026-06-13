import type { ResultRow } from '@/lib/tools/registry';

/** Büyük monospace sonuç + kısa yorum + ek satırlar. */
export function ResultDisplay({
  value,
  unit,
  summary,
  rows,
}: {
  value: string;
  unit: string;
  summary: string;
  rows: ResultRow[];
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-4xl font-bold tracking-tight text-accent-600">
          {value}
        </span>
        <span className="text-sm text-muted">{unit}</span>
      </div>
      <p className="mt-1 text-sm text-brand-900">{summary}</p>
      {rows.length > 0 && (
        <dl className="mt-4 space-y-2 border-t border-line pt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <dt className="text-muted">{row.label}</dt>
              <dd className="font-mono font-medium text-brand-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
