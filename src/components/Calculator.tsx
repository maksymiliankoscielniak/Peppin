import { useMemo, useState } from 'react';
import { Beaker, Check, ClipboardCopy, History, Save, Trash2, Undo2, AlertTriangle } from 'lucide-react';
import { CalcInput, DoseUnit, SYRINGES, SyringeId, calculate, fmt, summaryText } from '../lib/calc';
import { useLocalStorage } from '../lib/storage';
import Syringe from './Syringe';

interface FormState {
  vial: string;
  diluent: string;
  syringe: SyringeId;
  dose: string;
  doseUnit: DoseUnit;
}

interface SavedEntry {
  id: string;
  savedAt: number;
  label: string;
  form: FormState;
}

const VIAL_PRESETS = ['2', '5', '10'];
const DILUENT_PRESETS = ['1', '2', '3'];
const DEFAULT_FORM: FormState = { vial: '5', diluent: '2', syringe: 'u100', dose: '250', doseUnit: 'mcg' };

const num = (s: string): number => (s.trim() === '' ? NaN : Number(s.replace(',', '.')));

export default function Calculator() {
  const [form, setForm] = useLocalStorage<FormState>('peppin.form', DEFAULT_FORM);
  const [saved, setSaved] = useLocalStorage<SavedEntry[]>('peppin.saved', []);
  const [copied, setCopied] = useState(false);
  const [label, setLabel] = useState('');

  const input: CalcInput = useMemo(
    () => ({ vialMg: num(form.vial), diluentMl: num(form.diluent), syringe: form.syringe, dose: num(form.dose), doseUnit: form.doseUnit }),
    [form],
  );
  const outcome = useMemo(() => calculate(input), [input]);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const r = outcome.ok ? outcome.result : null;
  const spec = SYRINGES[form.syringe];

  const copy = async () => {
    if (!r) return;
    const text = summaryText(input, r, label || undefined);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const save = () => {
    if (!r) return;
    const entry: SavedEntry = {
      id: `${Date.now()}`,
      savedAt: Date.now(),
      label: label.trim() || `${form.vial} mg / ${form.diluent} ml`,
      form: { ...form },
    };
    setSaved((s) => [entry, ...s].slice(0, 20));
    setLabel('');
  };

  return (
    <div className="calc">
      <div className="panel calc__inputs">
        <h3 className="panel__title"><Beaker size={16} /> Inputs</h3>

        <Field label="Amount in vial" hint="mg">
          <div className="chips">
            {VIAL_PRESETS.map((v) => (
              <button key={v} type="button" className={`chip ${form.vial === v ? 'is-on' : ''}`} onClick={() => set('vial', v)}>{v} mg</button>
            ))}
            <NumberBox value={form.vial} onChange={(v) => set('vial', v)} unit="mg" invalid={!(num(form.vial) > 0)} />
          </div>
        </Field>

        <Field label="Diluent added (bacteriostatic water)" hint="ml">
          <div className="chips">
            {DILUENT_PRESETS.map((v) => (
              <button key={v} type="button" className={`chip ${form.diluent === v ? 'is-on' : ''}`} onClick={() => set('diluent', v)}>{v} ml</button>
            ))}
            <NumberBox value={form.diluent} onChange={(v) => set('diluent', v)} unit="ml" invalid={!(num(form.diluent) > 0)} />
          </div>
        </Field>

        <Field label="Syringe type">
          <div className="seg">
            {(Object.keys(SYRINGES) as SyringeId[]).map((id) => (
              <button key={id} type="button" className={`seg__btn ${form.syringe === id ? 'is-on' : ''}`} onClick={() => set('syringe', id)}>
                {SYRINGES[id].short}
              </button>
            ))}
          </div>
          <p className="muted small">{spec.label}</p>
        </Field>

        <Field label="Target single dose">
          <div className="chips">
            <NumberBox value={form.dose} onChange={(v) => set('dose', v)} unit={form.doseUnit} invalid={!(num(form.dose) > 0)} wide />
            <div className="seg seg--sm">
              {(['mcg', 'mg'] as DoseUnit[]).map((u) => (
                <button key={u} type="button" className={`seg__btn ${form.doseUnit === u ? 'is-on' : ''}`} onClick={() => set('doseUnit', u)}>{u}</button>
              ))}
            </div>
          </div>
        </Field>
      </div>

      <div className="panel calc__outputs">
        <h3 className="panel__title"><Check size={16} /> Results</h3>

        {!outcome.ok && (
          <ul className="errors">
            {outcome.errors.map((e) => (
              <li key={e}><AlertTriangle size={14} /> {e}</li>
            ))}
          </ul>
        )}

        <div className="stats">
          <Stat label="Concentration" value={r ? fmt(r.concentrationMgPerMl, 3) : '–'} unit="mg/ml" sub={r ? `${fmt(r.concentrationMcgPerMl, 1)} mcg/ml` : undefined} />
          <Stat label="Draw volume" value={r ? fmt(r.volumeMl, 3) : '–'} unit="ml" />
          <Stat
            label={spec.unitsPerMl ? 'Syringe marks' : 'Syringe reading'}
            value={r ? (r.units !== null ? fmt(r.units, 1) : fmt(r.volumeMl, 2)) : '–'}
            unit={spec.unitsPerMl ? 'units' : 'ml'}
            accent
          />
          <Stat label="Doses per vial" value={r ? String(r.dosesPerVial) : '–'} unit="full" />
        </div>

        <Syringe syringe={form.syringe} fillRatio={r ? r.fillRatio : null} units={r ? r.units : null} volumeMl={r ? r.volumeMl : null} />

        {r?.warnings.map((w) => (
          <p key={w} className="warn"><AlertTriangle size={14} /> {w}</p>
        ))}

        <div className="actions">
          <input className="input input--label" placeholder="Label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} />
          <button type="button" className="btn btn--primary" onClick={copy} disabled={!r}>
            {copied ? <Check size={16} /> : <ClipboardCopy size={16} />} {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button type="button" className="btn" onClick={save} disabled={!r}>
            <Save size={16} /> Save calculation
          </button>
        </div>
      </div>

      <div className="panel calc__history">
        <h3 className="panel__title"><History size={16} /> Saved calculations <span className="muted small">stored only in this browser</span></h3>
        {saved.length === 0 ? (
          <p className="muted">Nothing saved yet.</p>
        ) : (
          <ul className="history">
            {saved.map((e) => {
              const out = calculate({ vialMg: num(e.form.vial), diluentMl: num(e.form.diluent), syringe: e.form.syringe, dose: num(e.form.dose), doseUnit: e.form.doseUnit });
              return (
                <li key={e.id}>
                  <div>
                    <strong>{e.label}</strong>
                    <span className="muted small">
                      {e.form.vial} mg + {e.form.diluent} ml · {SYRINGES[e.form.syringe].short} · {e.form.dose} {e.form.doseUnit}
                      {out.ok ? ` → ${out.result.units !== null ? fmt(out.result.units, 1) + ' units' : fmt(out.result.volumeMl, 2) + ' ml'}` : ''}
                    </span>
                  </div>
                  <div className="history__btns">
                    <button type="button" className="icon-btn" title="Load" onClick={() => setForm(e.form)}><Undo2 size={15} /></button>
                    <button type="button" className="icon-btn" title="Delete" onClick={() => setSaved((s) => s.filter((x) => x.id !== e.id))}><Trash2 size={15} /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="field__label">{label}{hint && <span className="muted"> · {hint}</span>}</label>
      {children}
    </div>
  );
}

function NumberBox({ value, onChange, unit, invalid, wide }: { value: string; onChange: (v: string) => void; unit: string; invalid?: boolean; wide?: boolean }) {
  return (
    <div className={`numbox ${invalid ? 'is-invalid' : ''} ${wide ? 'numbox--wide' : ''}`}>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9.,]/g, ''))} aria-label={`Custom value in ${unit}`} />
      <span>{unit}</span>
    </div>
  );
}

function Stat({ label, value, unit, sub, accent }: { label: string; value: string; unit: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`stat ${accent ? 'stat--accent' : ''}`}>
      <span className="stat__label">{label}</span>
      <span className="stat__value" key={value}>{value}<small>{unit}</small></span>
      {sub && <span className="stat__sub">{sub}</span>}
    </div>
  );
}
