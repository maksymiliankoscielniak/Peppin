import { useMemo, useState } from 'react';

/**
 * Generic first-order elimination model in arbitrary units (each administration = 1.0).
 * Purely a teaching tool: the user supplies every number, nothing here is a recommendation.
 */
export default function HalfLife() {
  const [t12, setT12] = useState('6');
  const [interval, setIntervalH] = useState('24');
  const [count, setCount] = useState('6');

  const t = Number(t12);
  const tau = Number(interval);
  const n = Math.min(Math.max(Math.floor(Number(count)), 1), 30);
  const valid = t > 0 && tau > 0 && Number.isFinite(n);

  const model = useMemo(() => {
    if (!valid) return null;
    const k = Math.LN2 / t;
    const horizon = tau * n + tau; // show one extra interval after the last one
    const steps = 400;
    const pts: [number, number][] = [];
    let max = 0;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * horizon;
      let y = 0;
      for (let d = 0; d < n; d++) {
        const dt = x - d * tau;
        if (dt >= 0) y += Math.exp(-k * dt);
      }
      pts.push([x, y]);
      if (y > max) max = y;
    }
    const r = Math.exp(-k * tau);
    const accumulation = 1 / (1 - r); // steady-state peak in multiples of one administration
    return { pts, horizon, max, accumulation, remainingAfter: Math.exp(-k * tau) * 100 };
  }, [t, tau, n, valid]);

  const W = 640;
  const H = 240;
  const P = { l: 44, r: 12, t: 14, b: 32 };
  const path = model
    ? model.pts
        .map(([x, y], i) => {
          const px = P.l + (x / model.horizon) * (W - P.l - P.r);
          const py = H - P.b - (y / (model.max * 1.1)) * (H - P.t - P.b);
          return `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`;
        })
        .join(' ')
    : '';

  return (
    <div className="panel hl">
      <div className="hl__inputs">
        <label className="field">
          <span className="field__label">Half-life <span className="muted">· hours</span></span>
          <input className="input" inputMode="decimal" value={t12} onChange={(e) => setT12(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Interval between administrations <span className="muted">· hours</span></span>
          <input className="input" inputMode="decimal" value={interval} onChange={(e) => setIntervalH(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Number of administrations <span className="muted">· 1–30</span></span>
          <input className="input" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} />
        </label>
        {model && (
          <dl className="hl__facts">
            <div><dt>Left after one interval</dt><dd>{model.remainingAfter.toFixed(1)}%</dd></div>
            <div><dt>Steady-state peak</dt><dd>{model.accumulation.toFixed(2)}× one dose</dd></div>
          </dl>
        )}
      </div>

      <div className="hl__chart">
        {model ? (
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Simulated level over time">
            <defs>
              <linearGradient id="hlfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#12a5c9" stopOpacity=".28" />
                <stop offset="1" stopColor="#12a5c9" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((f) => {
              const y = P.t + f * (H - P.t - P.b);
              return <line key={f} x1={P.l} x2={W - P.r} y1={y} y2={y} stroke="#d8e5ec" strokeDasharray="2 4" />;
            })}
            <path d={`${path} L${W - P.r} ${H - P.b} L${P.l} ${H - P.b} Z`} fill="url(#hlfill)" />
            <path key={`${t}-${tau}-${n}`} className="hl__line" d={path} fill="none" stroke="#0a8fb0" strokeWidth="2.2" pathLength={1} />
            <text x={P.l} y={H - 8} className="syringe__num">0</text>
            <text x={W - P.r} y={H - 8} textAnchor="end" className="syringe__num">{Math.round(model.horizon)} h</text>
            <text x={8} y={P.t + 6} className="syringe__num">level</text>
          </svg>
        ) : (
          <p className="muted">Enter positive numbers to see the curve.</p>
        )}
        <p className="muted small">Arbitrary units, first-order elimination. A teaching model – not a schedule or recommendation.</p>
      </div>
    </div>
  );
}
