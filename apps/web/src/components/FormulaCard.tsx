import type { ReactNode } from 'react';

/** Sol accent bordürlü, monospace formül kartı. */
export function FormulaCard({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-line border-l-4 border-l-accent-500 bg-canvas p-5">
      <div className="font-mono text-sm leading-7 text-brand-900">{children}</div>
    </div>
  );
}
