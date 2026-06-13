'use client';

import { useEffect, useRef } from 'react';

/**
 * EOQ maliyet eğrisi grafiği (sipariş / elde tutma / toplam).
 * Saf görselleştirme; hesap mantığı registry'deki eoq fonksiyonuyla aynı
 * formülü kullanır. Kaynak: ornek/EOQ Hesaplayıcı.html drawChart.
 */
export function CostChart({ D, S, H }: { D: number; S: number; H: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!(D > 0 && S >= 0 && H > 0)) return;

    const nf0 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 600, cssH = 300;
      canvas.width = cssW * dpr; canvas.height = cssH * dpr;
      canvas.style.height = cssH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const padL = 44, padR = 12, padT = 14, padB = 26;
      const W = cssW - padL - padR, Hh = cssH - padT - padB;

      const eoq = Math.sqrt((2 * D * S) / H);
      const qMax = Math.max(eoq * 2.4, eoq + 10);
      const qMin = Math.max(1, qMax * 0.04);
      const N = 120;

      const order = (q: number) => (D / q) * S;
      const hold = (q: number) => (q / 2) * H;
      const totalF = (q: number) => order(q) + hold(q);
      const total = totalF(eoq);

      const yMax = Math.max(totalF(qMin), totalF(qMax)) * 1.05;
      const X = (q: number) => padL + ((q - qMin) / (qMax - qMin)) * W;
      const Y = (v: number) => padT + Hh - (Math.min(v, yMax) / yMax) * Hh;

      ctx.strokeStyle = '#eef2f6'; ctx.lineWidth = 1;
      ctx.fillStyle = '#8595a4'; ctx.font = '10px "JetBrains Mono", monospace';
      for (let i = 0; i <= 4; i++) {
        const gy = padT + (Hh / 4) * i;
        ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(cssW - padR, gy); ctx.stroke();
        const val = yMax * (1 - i / 4);
        ctx.fillText(nf0.format(Math.round(val / 1000)) + 'k', 6, gy + 3);
      }

      function curve(fn: (q: number) => number, color: string, width: number, dash?: number[]) {
        if (!ctx) return;
        ctx.beginPath(); ctx.setLineDash(dash || []); ctx.strokeStyle = color; ctx.lineWidth = width;
        for (let i = 0; i <= N; i++) { const q = qMin + (qMax - qMin) * (i / N); const x = X(q), y = Y(fn(q)); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      curve(order, '#1e4e79', 1.75, [4, 3]);
      curve(hold, '#8595a4', 1.75, [4, 3]);
      curve(totalF, '#0ea5a4', 2.75);

      const ex = X(eoq), ey = Y(total);
      ctx.strokeStyle = 'rgba(14,165,164,.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, padT + Hh); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#0ea5a4'; ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

      ctx.fillStyle = '#0f2a43'; ctx.font = '600 11px "JetBrains Mono", monospace';
      const label = 'EOQ ' + nf0.format(Math.round(eoq));
      const lw = ctx.measureText(label).width;
      const lx = Math.min(Math.max(ex - lw / 2, padL), cssW - padR - lw);
      ctx.fillText(label, lx, Math.max(ey - 10, padT + 10));
    }

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [D, S, H]);

  return (
    <div className="chart-wrap">
      <div className="chart-head">
        <span className="small" style={{ fontWeight: 600, color: 'var(--ink-2)' }}>Maliyet eğrisi</span>
        <div className="chart-legend">
          <span><i style={{ background: 'var(--teal)' }} />Toplam</span>
          <span><i style={{ background: 'var(--cat-stok)' }} />Sipariş</span>
          <span><i style={{ background: 'var(--text-3)' }} />Elde tutma</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="cost-chart" width={640} height={320} />
      <div className="chart-x small muted">Sipariş miktarı (adet) →</div>
    </div>
  );
}
