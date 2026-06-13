import type { ReactNode } from 'react';

type Variant = 'tip' | 'warning' | 'info';

const styles: Record<Variant, { wrap: string; icon: string }> = {
  tip: { wrap: 'border-accent-500/40 bg-accent-500/5', icon: '💡' },
  warning: { wrap: 'border-amber-400/50 bg-amber-50', icon: '⚠️' },
  info: { wrap: 'border-brand-500/30 bg-brand-50', icon: 'ℹ️' },
};

/** Zoho "points to remember" tarzı vurgulu kutu. */
export function CalloutBox({
  variant = 'tip',
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[variant];
  return (
    <div className={`my-5 flex gap-3 rounded-lg border p-4 ${s.wrap}`}>
      <span aria-hidden className="text-lg leading-none">{s.icon}</span>
      <div className="text-sm text-ink/90">
        {title && <p className="mb-1 font-semibold text-brand-900">{title}</p>}
        {children}
      </div>
    </div>
  );
}
