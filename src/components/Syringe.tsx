import { SYRINGES, SyringeId } from '../lib/calc';

interface Props {
  syringe: SyringeId;
  /** 0..1+ of the barrel to fill; null = nothing valid to show. */
  fillRatio: number | null;
  units: number | null;
  volumeMl: number | null;
}

const X0 = 70; // barrel start
const W = 520; // barrel length

export default function Syringe({ syringe, fillRatio, units, volumeMl }: Props) {
  const spec = SYRINGES[syringe];
  const over = fillRatio !== null && fillRatio > 1;
  const ratio = fillRatio === null ? 0 : Math.min(Math.max(fillRatio, 0), 1);
  const fillW = W * ratio;

  // graduations
  const isUnits = spec.unitsPerMl !== null;
  const total = isUnits ? spec.unitsPerMl! * spec.capacityMl : Math.round(spec.capacityMl * 100);
  const minorEvery = isUnits ? (syringe === 'u40' ? 1 : 2) : 1;
  const majorEvery = isUnits ? (syringe === 'u40' ? 5 : 10) : 10;
  const ticks: { x: number; major: boolean; label?: string }[] = [];
  for (let i = 0; i <= total; i += minorEvery) {
    const major = i % majorEvery === 0;
    ticks.push({
      x: X0 + (i / total) * W,
      major,
      label: major ? (isUnits ? String(i) : (i / 100).toFixed(1)) : undefined,
    });
  }

  const label = fillRatio === null ? 'Enter values' : units !== null ? `${round(units)} units` : `${volumeMl?.toFixed(2)} ml`;

  return (
    <svg className="syringe" viewBox="0 0 700 180" role="img" aria-label="Syringe graduation preview">
      <defs>
        <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5ce1e6" />
          <stop offset="1" stopColor="#12a5c9" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset="1" stopColor="#dbeaf2" stopOpacity=".5" />
        </linearGradient>
        <clipPath id="barrelClip">
          <rect x={X0} y="62" width={W} height="52" rx="3" />
        </clipPath>
      </defs>

      {/* needle + hub */}
      <line x1="4" y1="88" x2="42" y2="88" stroke="#7d96a5" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 80 L70 74 L70 102 L42 96 Z" fill="#c7d8e2" stroke="#7d96a5" strokeWidth="1.5" />

      {/* barrel */}
      <rect x={X0} y="62" width={W} height="52" rx="3" fill="url(#glass)" stroke="#5f7f92" strokeWidth="2" />
      <g clipPath="url(#barrelClip)">
        <rect
          className="syringe__liquid"
          x={X0}
          y="62"
          height="52"
          fill={over ? '#f4a3a3' : 'url(#liquid)'}
          style={{ width: fillW }}
        />
        <rect x={X0} y="62" width={W} height="10" fill="#fff" opacity=".35" />
      </g>

      {/* plunger */}
      <g className="syringe__plunger" style={{ transform: `translateX(${fillW}px)` }}>
        <rect x={X0 - 2} y="66" width="14" height="44" rx="2" fill="#2b4656" />
        <rect x={X0 + 12} y="84" width="120" height="8" fill="#9db4c2" />
        <rect x={X0 + 132} y="70" width="10" height="36" rx="3" fill="#7d96a5" />
      </g>

      {/* flange */}
      <rect x={X0 + W - 2} y="54" width="10" height="68" rx="3" fill="#c7d8e2" stroke="#7d96a5" strokeWidth="1.5" />

      {/* ticks */}
      {ticks.map((t) => (
        <g key={t.x}>
          <line x1={t.x} x2={t.x} y1={114} y2={t.major ? 130 : 122} stroke="#33566a" strokeWidth={t.major ? 1.6 : 1} />
          {t.label && (
            <text x={t.x} y="146" textAnchor="middle" className="syringe__num">
              {t.label}
            </text>
          )}
        </g>
      ))}
      <text x={X0 + W} y="172" textAnchor="end" className="syringe__cap">
        {isUnits ? `${spec.short} · units` : `${spec.short} · ml`}
      </text>

      {/* marker */}
      {fillRatio !== null && (
        <g className="syringe__marker" style={{ transform: `translateX(${fillW}px)` }}>
          <line x1={X0} x2={X0} y1="26" y2="62" stroke={over ? '#d64545' : '#0a8fb0'} strokeWidth="2" strokeDasharray="3 3" />
          <g transform={`translate(${X0} 0)`}>
            <rect x="-46" y="4" width="92" height="24" rx="12" fill={over ? '#d64545' : '#0a8fb0'} />
            <text x="0" y="20.5" textAnchor="middle" className="syringe__tag">
              {label}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

function round(n: number): string {
  return String(Math.round(n * 10) / 10);
}
