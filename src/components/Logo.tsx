interface LogoProps {
  className?: string;
  animate?: boolean;
  /** Show only the touching "pp" mark. */
  markOnly?: boolean;
}

/**
 * Hand-drawn wordmark: P e [p|p] i n – the two middle p's share a stem and touch.
 * Paths use pathLength=1 so the draw-on animation is a simple dash offset.
 */
export default function Logo({ className, animate = true, markOnly = false }: LogoProps) {
  const vb = markOnly ? '225 205 200 240' : '50 70 500 380';
  const cls = ['logo', animate ? 'logo--animate' : '', className ?? ''].join(' ').trim();
  const s = (i: number) => ({ '--i': i } as React.CSSProperties);
  return (
    <svg className={cls} viewBox={vb} role="img" aria-label="Peppin" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {!markOnly && (
        <g className="logo__letters">
          {/* P */}
          <path pathLength={1} style={s(0)} d="M68 96 C67 150 72 240 88 308" />
          <path pathLength={1} style={s(1)} d="M68 96 C100 82 140 84 151 106 C155 128 118 148 76 152" />
          {/* e */}
          <path pathLength={1} style={s(2)} d="M112 272 C135 268 165 262 174 248 C180 234 150 224 128 234 C104 246 104 285 130 297 C150 305 172 296 187 280" />
        </g>
      )}
      {/* the two touching p's – a "q-shaped" bowl and a "p" bowl sharing one stem */}
      <g className="logo__pp">
        <path pathLength={1} style={s(3)} d="M300 236 C304 300 312 380 318 428" />
        <path pathLength={1} style={s(4)} d="M298 235 C262 236 246 258 249 282 C254 302 285 302 308 296" />
        <path pathLength={1} style={s(5)} d="M352 231 C336 270 318 320 316 392" />
        <path pathLength={1} style={s(6)} d="M347 231 C380 222 402 240 393 266 C384 286 356 288 334 284" />
        <circle className="logo__touch" cx="316" cy="370" r="5" />
      </g>
      {!markOnly && (
        <g className="logo__letters">
          {/* i */}
          <path pathLength={1} style={s(7)} d="M446 262 C440 275 436 285 432 294" />
          <circle className="logo__dot" cx="456" cy="236" r="3.6" />
          {/* n */}
          <path pathLength={1} style={s(8)} d="M479 298 C478 275 480 255 485 250" />
          <path pathLength={1} style={s(9)} d="M485 252 C505 240 522 262 520 300" />
        </g>
      )}
    </svg>
  );
}
