export type SyringeId = 'u100' | 'u40' | 'ml05' | 'ml10';
export type DoseUnit = 'mcg' | 'mg';

export interface SyringeSpec {
  id: SyringeId;
  label: string;
  short: string;
  capacityMl: number;
  /** Units per ml for insulin-style syringes; null for volumetric (ml) syringes. */
  unitsPerMl: number | null;
  /** Smallest practical graduation, in ml. */
  tickMl: number;
}

export const SYRINGES: Record<SyringeId, SyringeSpec> = {
  u100: { id: 'u100', label: 'U-100 (100 units = 1 ml)', short: 'U-100', capacityMl: 1, unitsPerMl: 100, tickMl: 0.01 },
  u40: { id: 'u40', label: 'U-40 (40 units = 1 ml)', short: 'U-40', capacityMl: 1, unitsPerMl: 40, tickMl: 0.025 },
  ml05: { id: 'ml05', label: '0.5 ml volumetric', short: '0.5 ml', capacityMl: 0.5, unitsPerMl: null, tickMl: 0.01 },
  ml10: { id: 'ml10', label: '1.0 ml volumetric', short: '1.0 ml', capacityMl: 1, unitsPerMl: null, tickMl: 0.02 },
};

export interface CalcInput {
  vialMg: number;
  diluentMl: number;
  syringe: SyringeId;
  dose: number;
  doseUnit: DoseUnit;
}

export interface CalcResult {
  concentrationMgPerMl: number;
  concentrationMcgPerMl: number;
  doseMcg: number;
  volumeMl: number;
  /** Units to draw (insulin syringes) or null for volumetric syringes. */
  units: number | null;
  dosesPerVial: number;
  fillRatio: number;
  warnings: string[];
}

export type CalcOutcome =
  | { ok: true; result: CalcResult }
  | { ok: false; errors: string[] };

const isPos = (n: number): boolean => Number.isFinite(n) && n > 0;

export function toMcg(value: number, unit: DoseUnit): number {
  return unit === 'mg' ? value * 1000 : value;
}

export function calculate(input: CalcInput): CalcOutcome {
  const errors: string[] = [];
  if (!isPos(input.vialMg)) errors.push('Vial amount must be greater than 0 mg.');
  if (!isPos(input.diluentMl)) errors.push('Diluent volume must be greater than 0 ml.');
  if (!isPos(input.dose)) errors.push('Dose must be greater than 0.');
  if (errors.length) return { ok: false, errors };

  const spec = SYRINGES[input.syringe];
  const concentrationMgPerMl = input.vialMg / input.diluentMl;
  const concentrationMcgPerMl = concentrationMgPerMl * 1000;
  const doseMcg = toMcg(input.dose, input.doseUnit);
  const volumeMl = doseMcg / concentrationMcgPerMl;
  const units = spec.unitsPerMl === null ? null : volumeMl * spec.unitsPerMl;
  const dosesPerVial = Math.floor((input.vialMg * 1000) / doseMcg + 1e-9);
  const fillRatio = volumeMl / spec.capacityMl;

  const warnings: string[] = [];
  if (doseMcg > input.vialMg * 1000) {
    warnings.push('The entered dose is larger than the whole vial.');
  }
  if (volumeMl > spec.capacityMl) {
    warnings.push(
      `Required volume (${fmt(volumeMl, 3)} ml) exceeds the ${spec.short} syringe capacity (${spec.capacityMl} ml). Add less diluent or use a different syringe.`,
    );
  }
  if (volumeMl > 0 && volumeMl < spec.tickMl) {
    warnings.push(
      `Volume is below the smallest graduation (${fmt(spec.tickMl, 3)} ml) – it cannot be measured accurately. Add more diluent.`,
    );
  }
  return {
    ok: true,
    result: { concentrationMgPerMl, concentrationMcgPerMl, doseMcg, volumeMl, units, dosesPerVial, fillRatio, warnings },
  };
}

/** Round to `digits` decimals and strip trailing zeros. */
export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '–';
  const f = 10 ** digits;
  return String(Math.round((n + Number.EPSILON) * f) / f);
}

export function summaryText(input: CalcInput, r: CalcResult, label?: string): string {
  const spec = SYRINGES[input.syringe];
  const lines = [
    `PEPPIN – reconstitution summary${label ? ` (${label})` : ''}`,
    `Vial: ${fmt(input.vialMg, 3)} mg + ${fmt(input.diluentMl, 3)} ml diluent`,
    `Concentration: ${fmt(r.concentrationMgPerMl, 3)} mg/ml (${fmt(r.concentrationMcgPerMl, 1)} mcg/ml)`,
    `Syringe: ${spec.label}`,
    `Target dose: ${fmt(input.dose, 3)} ${input.doseUnit} (${fmt(r.doseMcg, 1)} mcg)`,
    `Draw volume: ${fmt(r.volumeMl, 3)} ml` + (r.units !== null ? ` = ${fmt(r.units, 1)} units` : ''),
    `Doses per vial: ${r.dosesPerVial}`,
    'Educational / satirical simulation only – not medical advice.',
  ];
  return lines.join('\n');
}
