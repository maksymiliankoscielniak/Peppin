import { useMemo, useState } from 'react';
import { Compass, FlaskConical, Scale, ShieldAlert, Sparkles } from 'lucide-react';
import { CATEGORIES, COMPOUNDS, Compound } from '../data/compounds';

const PRESETS: { label: string; query: string }[] = [
  { label: 'Joint & tendon recovery', query: 'joint tendon injury recovery' },
  { label: 'Gut & stomach', query: 'gut stomach' },
  { label: 'Sleep & night recovery', query: 'sleep night recovery' },
  { label: 'Appetite & hunger', query: 'appetite hunger' },
  { label: 'Focus & memory', query: 'focus memory brain' },
  { label: 'Stress & anxiety', query: 'stress anxiety calm' },
  { label: 'Fat metabolism', query: 'fat weight metabolism' },
  { label: 'Skin tone & tanning', query: 'tan skin pigment' },
];

function tokens(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length >= 3);
}

function score(c: Compound, q: string, toks: string[]): number {
  let s = 0;
  for (const k of c.keywords) {
    if (q.includes(k)) s += 2;
    else if (toks.some((t) => k.includes(t) || t.includes(k))) s += 1;
  }
  const hay = `${c.name} ${c.aka ?? ''} ${c.mechanism}`.toLowerCase();
  for (const t of toks) if (hay.includes(t)) s += 0.5;
  return s;
}

export default function Finder({ onOpenCalculator }: { onOpenCalculator: () => void }) {
  const [text, setText] = useState('');
  const [active, setActive] = useState<string | null>(null);

  const q = (active ?? text).trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    const toks = tokens(q);
    return COMPOUNDS.map((c) => ({ c, s: score(c, q, toks) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4);
  }, [q]);

  return (
    <div className="panel finder">
      <div className="finder__input">
        <label className="field__label" htmlFor="need">What are you interested in?</label>
        <div className="search">
          <Compass size={16} />
          <input
            id="need"
            value={text}
            onChange={(e) => { setText(e.target.value); setActive(null); }}
            placeholder="Describe a goal in your own words – e.g. “sore knee after running”, “can’t focus”…"
          />
        </div>
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className={`chip ${active === p.query ? 'is-on' : ''}`} onClick={() => { setActive(active === p.query ? null : p.query); setText(''); }}>
              {p.label}
            </button>
          ))}
        </div>
        <p className="muted small finder__note">
          <ShieldAlert size={13} /> Matches are keyword-based suggestions for reading up on – not recommendations. Dosing is intentionally not provided; a
          qualified clinician decides what (if anything) is appropriate.
        </p>
      </div>

      <div className="finder__results">
        {!q && <p className="muted"><Sparkles size={14} /> Pick a preset or type a goal to see related compounds from the library.</p>}
        {q && results.length === 0 && <p className="muted">No close matches. Try other words (joint, sleep, focus, fat, skin…).</p>}
        {results.map(({ c }, i) => (
          <article key={c.id} className="card finder__card" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="tag">{CATEGORIES.find((x) => x.id === c.category)!.label}</span>
            <h4>{c.name}</h4>
            <p className="card__lead">{c.mechanism}</p>
            <div className="row"><span className="row__icon"><FlaskConical size={15} /></span><div><strong>Evidence</strong><p>{c.evidence}</p></div></div>
            <div className="row"><span className="row__icon"><ShieldAlert size={15} /></span><div><strong>Status</strong><p>{c.regulatory}</p></div></div>
            <div className="row"><span className="row__icon"><Scale size={15} /></span><div><strong>Trade-offs</strong><ul>{c.tradeoffs.slice(0, 2).map((t) => <li key={t}>{t}</li>)}</ul></div></div>
          </article>
        ))}
        {results.length > 0 && (
          <button type="button" className="btn finder__calc" onClick={onOpenCalculator}>Have a prescribed dose? Open the calculator</button>
        )}
      </div>
    </div>
  );
}
