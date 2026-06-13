'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import { getCalculator, type CalculatorOutput } from '@/lib/tools/registry';
import { CostChart } from './tools/CostChart';

/**
 * Sticky, ön-doldurulmuş hesap kartı (tasarım: ornek/EOQ Hesaplayıcı.html calc-card).
 * Hesaplama mantığı registry'deki saf fonksiyondan gelir (CMS'te değil); sonuç
 * girdi değiştikçe canlı güncellenir. Analitik merkezi track() ile gönderilir —
 * component içinde hardcode gtag/clarity YOKTUR.
 */
export function CalculatorCard({
  slug,
  baslik,
  resultLabel,
}: {
  slug: string;
  baslik: string;
  resultLabel: string;
}) {
  const def = getCalculator(slug);
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries((def?.fields ?? []).map((f) => [f.name, f.defaultValue])),
  );

  const output = useMemo<CalculatorOutput | { error: string }>(() => {
    if (!def) return { error: 'Hesaplayıcı bulunamadı' };
    try {
      return def.compute(values);
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Geçersiz girdi' };
    }
  }, [def, values]);

  if (!def) return null;

  const hasError = 'error' in output;

  const handleChange = (name: string, raw: string) => {
    const num = raw === '' ? NaN : Number(raw);
    setValues((prev) => {
      const next = { ...prev, [name]: num };
      if (def) {
        try {
          const out = def.compute(next);
          track('tool_calculated', { tool_slug: def.slug, sonuc: out.summary });
        } catch {
          /* geçersiz girdi: event gönderme */
        }
      }
      return next;
    });
  };

  const isEoq = slug === 'eoq-hesaplama';

  return (
    <div className="calc-card">
      <div className="calc-head">
        <span className="icon" style={{ width: 38, height: 38, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'var(--teal-tint)', color: 'var(--teal-hover)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /></svg>
        </span>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{baslik}</div>
          <div className="small muted">Değerleri değiştir, anında gör</div>
        </div>
      </div>

      <div className="calc-body">
        {hasError ? (
          <div className="result" style={{ background: 'var(--cat-maliyet)' }}>
            <div className="result-label">Hata</div>
            <div className="result-unit" style={{ marginTop: 8 }}>{output.error}</div>
          </div>
        ) : (
          <>
            <div className="result">
              <div className="result-label">{resultLabel}</div>
              <div className="result-value">{output.value}</div>
              <div className="result-unit">{output.unit}</div>
              <div className="result-note">{output.summary}</div>
            </div>

            {output.rows.length > 0 && (
              <div className="result-secondary">
                {output.rows.map((row) => (
                  <div className="cell" key={row.label}>
                    <div className="k">{row.label}</div>
                    <div className="v">{row.value}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <hr className="divider" />

        {def.fields.map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <div className="input-group">
              <input
                className="input"
                id={field.name}
                type="number"
                inputMode="decimal"
                min={field.min}
                step={field.step}
                value={Number.isNaN(values[field.name]) ? '' : values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
              {field.suffix && <span className="suffix">{field.suffix}</span>}
            </div>
          </div>
        ))}

        {isEoq && !hasError && (
          <CostChart
            D={values.yillikTalep ?? 0}
            S={values.siparisMaliyeti ?? 0}
            H={values.tasimaMaliyeti ?? 0}
          />
        )}

        <Link className="btn btn-primary btn-block" href="/#lead" data-track="cta_click">
          Excel şablonuyla kaydet
        </Link>
      </div>
    </div>
  );
}
