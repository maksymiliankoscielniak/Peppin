import { useMemo, useState } from 'react';
import { Compass, FlaskConical, Scale, ShieldAlert, Stethoscope } from 'lucide-react';
import { CATEGORIES, COMPOUNDS } from '../data/compounds';

interface Theme {
  id: string;
  label: string;
  /** Words a user might write. */
  words: string[];
  caveat?: string;
  /** compound id -> why it comes up for this theme (honest about evidence). */
  why: Record<string, string>;
}

const THEMES: Theme[] = [
  {
    id: 'energy',
    label: 'Feeling tired a lot',
    words: ['tired', 'fatigue', 'exhausted', 'energy', 'lethargic', 'sluggish', 'drained', 'low energy'],
    caveat:
      'Ongoing tiredness has many common causes (sleep quality, iron/B12/vitamin D, thyroid, mood, stress, medication). Worth a check-up before anything else – none of the compounds below is an established treatment for fatigue.',
    why: {
      ipamorelin: 'Discussed for sleep depth and recovery through growth-hormone release – an indirect link at best; no solid evidence that it treats tiredness.',
      cjc1295: 'Raises GH/IGF-1 in early studies, which is why it is mentioned for recovery and sleep. Again, nothing shows it fixes fatigue.',
      mk677: 'Raised GH/IGF-1 in trials, but daytime lethargy is one of its reported side effects – a mixed signal for someone who is already tired.',
    },
  },
  {
    id: 'weight',
    label: 'Losing weight / body fat',
    words: ['weight', 'lose', 'fat', 'slim', 'diet', 'obese', 'obesity', 'belly', 'lean', 'metabolism', 'cutting'],
    caveat:
      'For weight loss, lifestyle changes and clinician-prescribed, properly trialled treatments have far stronger evidence than anything in this list.',
    why: {
      retatrutide: 'A triple GIP/GLP-1/glucagon agonist in clinical trials – by far the most substantial weight-loss evidence here, but still unapproved and with significant GI side effects.',
      aod9604: 'Designed to copy growth hormone’s fat-metabolism effect without its other actions – but phase 2b obesity trials did not show meaningful weight loss.',
      frag176: 'The unmodified version of the same idea; supported only by cell and animal work.',
    },
  },
  {
    id: 'skin',
    label: 'Skin condition & appearance',
    words: ['skin', 'complexion', 'wrinkle', 'wrinkles', 'aging', 'ageing', 'collagen', 'acne', 'glow', 'hair', 'face'],
    caveat: 'Persistent skin problems (acne, rashes, sudden changes) are best looked at by a dermatologist.',
    why: {
      ghkcu: 'The best-known peptide in skin research: topical studies report modest gains in firmness and collagen remodelling, and it is already used in cosmetics.',
      bpc157: 'Studied for wound and tissue repair in animals – not for cosmetic skin improvement.',
    },
  },
  {
    id: 'joints',
    label: 'Joints, tendons & injuries',
    words: ['joint', 'joints', 'tendon', 'ligament', 'knee', 'shoulder', 'injury', 'injured', 'sore', 'elbow', 'back pain'],
    caveat: 'Persistent joint pain or an injury deserves a proper diagnosis (doctor or physio). Evidence below is largely from animals.',
    why: {
      bpc157: 'The most talked-about repair peptide: rodent studies show faster tendon and gut-lining healing; human data is minimal.',
      tb500: 'Related to thymosin beta-4, studied in animal wound-healing models; limited human data.',
    },
  },
  {
    id: 'gut',
    label: 'Gut & digestion',
    words: ['gut', 'stomach', 'digestion', 'bloating', 'ibs', 'bowel', 'reflux'],
    caveat: 'Ongoing digestive symptoms should be evaluated by a doctor.',
    why: { bpc157: 'Derived from a gastric protein and studied for gut-lining protection – in animals.' },
  },
  {
    id: 'sleep',
    label: 'Sleep & recovery',
    words: ['sleep', 'insomnia', 'rest', 'recovery', 'night', 'recover'],
    why: {
      ipamorelin: 'A GH secretagogue mentioned for sleep and recovery; evidence in humans is thin.',
      cjc1295: 'GHRH analogue that raises GH/IGF-1; development was halted.',
      mk677: 'Reported to increase deep-sleep time in a small study, alongside appetite and water-retention effects.',
    },
  },
  {
    id: 'appetite',
    label: 'Appetite & hunger',
    words: ['appetite', 'hunger', 'hungry', 'eat more', 'underweight'],
    why: {
      mk677: 'A ghrelin-receptor agonist – big appetite increase is one of its best-documented effects.',
      ipamorelin: 'Also acts on the ghrelin receptor, with milder hunger effects.',
    },
  },
  {
    id: 'focus',
    label: 'Focus & memory',
    words: ['focus', 'concentration', 'concentrate', 'memory', 'brain', 'attention', 'cognition', 'brain fog', 'fog'],
    caveat: 'Trouble concentrating can stem from sleep, stress or health issues worth discussing with a doctor.',
    why: {
      semax: 'An ACTH-fragment analogue reported to influence BDNF; evidence is mostly small Russian studies.',
      selank: 'Mostly studied for anxiety, with some reports on cognitive effects.',
    },
  },
  {
    id: 'stress',
    label: 'Stress & anxiety',
    words: ['stress', 'stressed', 'anxiety', 'anxious', 'calm', 'mood', 'nervous'],
    caveat: 'If stress or anxiety is affecting daily life, a clinician or therapist is the right first step.',
    why: {
      selank: 'A tuftsin analogue investigated for anxiolytic effects; limited independent replication.',
      semax: 'Studied for neuro-protection and mood-related effects; thin evidence base.',
    },
  },
  {
    id: 'tan',
    label: 'Tanning & pigmentation',
    words: ['tan', 'tanning', 'pigment', 'sun', 'melanin'],
    caveat: 'Health authorities explicitly warn against unapproved tanning injections; watch your moles and see a dermatologist.',
    why: { mt2: 'Stimulates melanin via melanocortin receptors – but with notable side effects and regulator warnings.' },
  },
];

const PRESETS = ['Feeling tired a lot', 'Losing weight', 'Skin condition', 'Joints & injuries', 'Gut & digestion', 'Sleep & recovery', 'Focus & memory', 'Stress & anxiety', 'Tanning'];

function detect(text: string): Theme[] {
  const t = ` ${text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ')} `;
  return THEMES.filter((th) => th.words.some((w) => t.includes(` ${w} `) || (w.length >= 5 && t.includes(` ${w}`))));
}

export default function Finder({ onOpenCalculator }: { onOpenCalculator: () => void }) {
  const [text, setText] = useState('');
  const themes = useMemo(() => detect(text), [text]);

  const addPreset = (p: string) => setText((t) => (t.toLowerCase().includes(p.toLowerCase()) ? t : `${t}${t.trim() ? ', ' : ''}${p}`));

  return (
    <div className="panel finder">
      <div className="finder__input">
        <label className="field__label" htmlFor="need">Tell us what’s going on – in your own words</label>
        <textarea
          id="need"
          className="input finder__text"
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. “I’m tired a lot, I want to lose weight and I’d like to improve my skin.”"
        />
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p} type="button" className="chip" onClick={() => addPreset(p)}>+ {p}</button>
          ))}
        </div>
        {text && <button type="button" className="btn finder__clear" onClick={() => setText('')}>Clear</button>}
        <p className="muted small finder__note">
          <ShieldAlert size={13} /> This lists what the research literature associates with each goal and how strong that evidence is. It is not a recommended
          stack or treatment plan, and dosing is intentionally not provided.
        </p>
      </div>

      <div className="finder__results">
        {!text.trim() && <p className="muted"><Compass size={14} /> Write a few sentences or tap the presets. You can combine several goals.</p>}
        {text.trim() && themes.length === 0 && <p className="muted">Couldn’t match any goals yet. Try words like tired, weight, skin, joints, sleep, focus, stress…</p>}

        {themes.map((th) => {
          const items = COMPOUNDS.filter((c) => th.why[c.id]);
          return (
            <section key={th.id} className="theme">
              <h4 className="theme__title">{th.label}</h4>
              {th.caveat && <p className="theme__caveat"><Stethoscope size={15} /> {th.caveat}</p>}
              <div className="theme__list">
                {items.map((c, i) => (
                  <article key={c.id} className="card finder__card" style={{ animationDelay: `${i * 70}ms` }}>
                    <span className="tag">{CATEGORIES.find((x) => x.id === c.category)!.label}</span>
                    <h5>{c.name}</h5>
                    <p className="why"><strong>Why it came up:</strong> {th.why[c.id]}</p>
                    <div className="row"><span className="row__icon"><FlaskConical size={15} /></span><div><strong>Evidence</strong><p>{c.evidence}</p></div></div>
                    <div className="row"><span className="row__icon"><ShieldAlert size={15} /></span><div><strong>Status</strong><p>{c.regulatory}</p></div></div>
                    <div className="row"><span className="row__icon"><Scale size={15} /></span><div><strong>Trade-offs</strong><ul>{c.tradeoffs.slice(0, 2).map((t) => <li key={t}>{t}</li>)}</ul></div></div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {themes.length > 0 && (
          <button type="button" className="btn finder__calc" onClick={onOpenCalculator}>Have a prescribed dose? Open the calculator</button>
        )}
      </div>
    </div>
  );
}
