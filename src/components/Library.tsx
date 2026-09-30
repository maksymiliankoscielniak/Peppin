import { useMemo, useState } from 'react';
import { ChevronDown, Search, ShieldAlert, FlaskConical, Scale } from 'lucide-react';
import { CATEGORIES, COMPOUNDS, CategoryId } from '../data/compounds';

export default function Library() {
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return COMPOUNDS.filter((c) => {
      if (cat !== 'all' && c.category !== cat) return false;
      if (!needle) return true;
      return [c.name, c.aka ?? '', c.mechanism, ...c.keywords].join(' ').toLowerCase().includes(needle);
    });
  }, [cat, q]);

  return (
    <div>
      <div className="lib__controls">
        <div className="search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or topic – e.g. “joint”, “sleep”, “tan”…" />
        </div>
        <div className="chips">
          <button type="button" className={`chip ${cat === 'all' ? 'is-on' : ''}`} onClick={() => setCat('all')}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => setCat(c.id)}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="cards">
        {list.map((c, i) => {
          const isOpen = open === c.id;
          const category = CATEGORIES.find((x) => x.id === c.category)!;
          return (
            <article key={c.id} className={`card ${isOpen ? 'is-open' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              <button type="button" className="card__head" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}>
                <div>
                  <span className="tag">{category.label}</span>
                  <h4>{c.name}</h4>
                  {c.aka && <span className="muted small">{c.aka}</span>}
                </div>
                <ChevronDown size={18} className="card__chev" />
              </button>
              <p className="card__lead">{c.mechanism}</p>
              <div className="card__more">
                <div className="card__more-inner">
                  <Row icon={<FlaskConical size={15} />} title="State of evidence" text={c.evidence} />
                  <Row icon={<ShieldAlert size={15} />} title="Regulatory status" text={c.regulatory} />
                  <div className="row">
                    <span className="row__icon"><Scale size={15} /></span>
                    <div>
                      <strong>Side-effects &amp; trade-offs</strong>
                      <ul>{c.tradeoffs.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        {list.length === 0 && <p className="muted">No compounds match that search.</p>}
      </div>
    </div>
  );
}

function Row({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="row">
      <span className="row__icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
