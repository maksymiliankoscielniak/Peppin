import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Atom, Calculator as CalcIcon, LineChart, ShieldAlert } from 'lucide-react';
import Background from './components/Background';
import Logo from './components/Logo';
import Calculator from './components/Calculator';
import Library from './components/Library';
import HalfLife from './components/HalfLife';

const DISCLAIMER =
  'THIS PROJECT IS FOR EDUCATIONAL, INFORMATIONAL AND SATIRICAL PURPOSES ONLY. The material is not medical advice and is not an encouragement to use any substance. All calculations and data are purely illustrative and intended for simulation.';

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`}>
      {children}
    </div>
  );
}

function Vial() {
  return (
    <svg className="vial" viewBox="0 0 220 320" aria-hidden="true">
      <defs>
        <clipPath id="vialBody"><path d="M56 96 h108 a14 14 0 0 1 14 14 v170 a26 26 0 0 1 -26 26 h-84 a26 26 0 0 1 -26 -26 v-170 a14 14 0 0 1 14 -14z" /></clipPath>
        <linearGradient id="vialLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ee8ee" />
          <stop offset="1" stopColor="#1aa7cb" />
        </linearGradient>
      </defs>
      <rect x="70" y="38" width="80" height="26" rx="6" fill="#dbe8ef" stroke="#5f7f92" strokeWidth="2" />
      <rect x="62" y="60" width="96" height="36" rx="5" fill="#c3d5df" stroke="#5f7f92" strokeWidth="2" />
      <g clipPath="url(#vialBody)">
        <rect x="40" y="96" width="140" height="240" fill="#f3fafd" />
        <g className="vial__wave">
          <path d="M-100 170 q 30 -12 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 V340 H-100z" fill="url(#vialLiquid)" opacity=".9" />
        </g>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} className="vial__bubble" cx={78 + i * 17} cy="300" r={2.5 + (i % 3)} style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
        <rect x="70" y="100" width="12" height="200" rx="6" fill="#fff" opacity=".45" />
      </g>
      <path d="M56 96 h108 a14 14 0 0 1 14 14 v170 a26 26 0 0 1 -26 26 h-84 a26 26 0 0 1 -26 -26 v-170 a14 14 0 0 1 14 -14z" fill="none" stroke="#5f7f92" strokeWidth="2.5" />
      <rect x="62" y="196" width="96" height="62" rx="4" fill="#fff" stroke="#9fb7c4" />
      <g className="vial__label" fill="none" stroke="#0b2a3a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M84 216 C86 226 86 236 88 246" />
        <path d="M84 216 C96 213 102 219 96 224 C92 227 87 227 85 226" />
        <path d="M110 218 C108 230 108 238 110 246" />
      </g>
      <text x="110" y="252" textAnchor="middle" fontSize="7" fontFamily="JetBrains Mono, monospace" fill="#5f7f92">5 mg · LYO</text>
    </svg>
  );
}

export default function App() {
  return (
    <>
      <Background />
      <div className="topbar" role="note">
        <ShieldAlert size={15} />
        <p>{DISCLAIMER}</p>
      </div>

      <header className="nav">
        <a className="nav__brand" href="#top" aria-label="Peppin home">
          <Logo markOnly animate={false} className="nav__logo" />
          <span>Peppin</span>
        </a>
        <nav>
          <a href="#calculator">Calculator</a>
          <a href="#library">Library</a>
          <a href="#halflife">Half-life</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <span className="eyebrow"><span className="pulse" /> Reconstitution math lab · v1.0</span>
            <Logo className="hero__logo" />
            <p className="hero__lead">
              A clean, private, client-side workbench for peptide-vial arithmetic. Enter your own numbers, see the syringe, copy the
              summary. Nothing leaves your browser.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary" href="#calculator"><CalcIcon size={16} /> Open calculator</a>
              <a className="btn" href="#library"><Atom size={16} /> Browse library</a>
            </div>
            <a className="scroll-hint" href="#calculator" aria-label="Scroll"><ArrowDown size={16} /></a>
          </div>
          <div className="hero__art">
            <div className="hero__ring" />
            <Vial />
            <span className="float-tag float-tag--a">mg ÷ ml</span>
            <span className="float-tag float-tag--b">units</span>
            <span className="float-tag float-tag--c">mcg/ml</span>
          </div>
        </section>

        <section id="calculator" className="section">
          <Reveal>
            <SectionHead n="A" icon={<CalcIcon size={18} />} title="Reconstitution calculator" text="Concentration, draw volume and syringe marks – calculated live, with validation and zero-division guards." />
            <Calculator />
          </Reveal>
        </section>

        <section id="library" className="section">
          <Reveal>
            <SectionHead n="B" icon={<Atom size={18} />} title="Compound library" text="An educational overview of commonly discussed research compounds: mechanism, what the evidence actually says, regulatory status and trade-offs. No dosing or cycle advice." />
            <Library />
          </Reveal>
        </section>

        <section id="halflife" className="section">
          <Reveal>
            <SectionHead n="C" icon={<LineChart size={18} />} title="Half-life simulator" text="See how a substance with a given half-life accumulates or fades when administered at regular intervals. Bring your own numbers – it is a pharmacokinetics classroom toy." />
            <HalfLife />
          </Reveal>
        </section>

        <section id="about" className="section">
          <Reveal>
            <div className="about">
              <h2>About Peppin</h2>
              <p>
                Peppin is a static, client-side web app. There is no server and no account – calculations and saved entries live in your
                browser’s localStorage and can be wiped at any time by clearing site data.
              </p>
              <p>
                The compounds listed in the library are, for the most part, <strong>not approved medicines</strong>. Grey-market
                products can be mislabelled, contaminated or under-dosed. If you are considering any injectable, talk to a qualified
                clinician first.
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <Logo markOnly animate={false} className="footer__logo" />
        <p>{DISCLAIMER}</p>
        <span className="muted small">© {new Date().getFullYear()} Peppin · Not medical advice.</span>
      </footer>
    </>
  );
}

function SectionHead({ n, icon, title, text }: { n: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="section__head">
      <span className="section__n">{n}</span>
      <div>
        <h2>{icon} {title}</h2>
        <p className="muted">{text}</p>
      </div>
    </div>
  );
}
