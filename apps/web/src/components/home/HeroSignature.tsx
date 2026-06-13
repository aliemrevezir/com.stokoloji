'use client';

import { useEffect, useRef } from 'react';

/**
 * Anasayfa hero imzası: mini EOQ maliyet eğrisi (markanın görsel imzası).
 * Sabit örnek değerlerle (D=12000, S=250, H=18) optimum noktayı çizer.
 * Kaynak: ornek/index.html hero spark script'i.
 */
export function HeroSignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const D = 12000, S = 250, H = 18;
    const eoq = Math.sqrt((2 * D * S) / H);

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 150, cssH = cssW * 0.5;
      canvas.width = cssW * dpr; canvas.height = cssH * dpr;
      canvas.style.height = cssH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const padT = 8, padB = 8, padL = 4, padR = 4;
      const W = cssW - padL - padR, Hh = cssH - padT - padB;
      const qMax = eoq * 2.4, qMin = qMax * 0.05;
      const order = (q: number) => (D / q) * S;
      const hold = (q: number) => (q / 2) * H;
      const total = (q: number) => order(q) + hold(q);
      const yMax = Math.max(total(qMin), total(qMax)) * 1.05;
      const X = (q: number) => padL + ((q - qMin) / (qMax - qMin)) * W;
      const Y = (v: number) => padT + Hh - (Math.min(v, yMax) / yMax) * Hh;

      function curve(fn: (q: number) => number, color: string, width: number, dash?: number[]) {
        if (!ctx) return;
        ctx.beginPath(); ctx.setLineDash(dash || []); ctx.strokeStyle = color; ctx.lineWidth = width;
        for (let i = 0; i <= 90; i++) { const q = qMin + (qMax - qMin) * (i / 90); const x = X(q), y = Y(fn(q)); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      curve(order, '#9db4c8', 1.25, [3, 2]);
      curve(hold, '#c2ccd6', 1.25, [3, 2]);
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) { const q = qMin + (qMax - qMin) * (i / 90); const x = X(q), y = Y(total(q)); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.lineTo(X(qMax), padT + Hh); ctx.lineTo(X(qMin), padT + Hh); ctx.closePath();
      ctx.fillStyle = 'rgba(14,165,164,.08)'; ctx.fill();
      curve(total, '#0ea5a4', 2.25);
      const ex = X(eoq), ey = Y(total(eoq));
      ctx.strokeStyle = 'rgba(14,165,164,.3)'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, padT + Hh); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#0ea5a4'; ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return <canvas ref={canvasRef} className="sig-spark" width={280} height={120} aria-hidden="true" />;
}
