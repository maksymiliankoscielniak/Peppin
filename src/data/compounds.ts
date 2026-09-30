export type CategoryId = 'tissue' | 'gh' | 'cognitive' | 'metabolic' | 'pigment';

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: 'tissue', label: 'Tissue & joints', blurb: 'Repair-related research' },
  { id: 'gh', label: 'GH axis & sleep', blurb: 'Secretagogues & appetite' },
  { id: 'cognitive', label: 'Cognition & nerves', blurb: 'Neuropeptide research' },
  { id: 'metabolic', label: 'Metabolism', blurb: 'Fat-metabolism research' },
  { id: 'pigment', label: 'Pigmentation', blurb: 'Melanocortin research' },
];

export interface Compound {
  id: string;
  name: string;
  aka?: string;
  category: CategoryId;
  mechanism: string;
  evidence: string;
  regulatory: string;
  tradeoffs: string[];
  keywords: string[];
}

/**
 * Educational overview only. No dosing, cycle length or injection schedules are given on purpose –
 * this project is not a source of medical guidance.
 */
export const COMPOUNDS: Compound[] = [
  {
    id: 'bpc157',
    name: 'BPC-157',
    aka: 'Body Protection Compound-157',
    category: 'tissue',
    mechanism:
      'A synthetic 15-amino-acid fragment derived from a gastric protein. In animal models it has been linked to angiogenesis signalling (VEGFR2) and faster tendon and gut-lining healing.',
    evidence: 'Almost entirely preclinical (rodent) studies; human data is minimal.',
    regulatory: 'Not approved for human use. Sold as a “research chemical”.',
    tradeoffs: ['Long-term safety in humans is unknown', 'Product purity of grey-market vials varies wildly', 'Impressive rat results ≠ impressive human results'],
    keywords: ['joint', 'tendon', 'ligament', 'gut', 'injury', 'healing', 'knee', 'stomach', 'regeneration'],
  },
  {
    id: 'tb500',
    name: 'TB-500',
    aka: 'Thymosin beta-4 fragment',
    category: 'tissue',
    mechanism:
      'A synthetic fragment related to thymosin beta-4, an actin-binding protein involved in cell migration. Studied in animal wound-healing and cardiac-repair models.',
    evidence: 'Preclinical; limited early-phase work on the full-length thymosin beta-4 protein.',
    regulatory: 'Not approved for human use. Prohibited in competitive sport (WADA).',
    tradeoffs: ['Theoretical concern about promoting cell migration in unwanted tissue', 'Anti-doping bans', 'Quality control of fragments is inconsistent'],
    keywords: ['wound', 'recovery', 'muscle', 'joint', 'heart', 'healing', 'injury'],
  },
  {
    id: 'mk677',
    name: 'Ibutamoren (MK-677)',
    aka: 'Oral ghrelin-receptor agonist',
    category: 'gh',
    mechanism:
      'An orally active, non-peptide ghrelin-receptor agonist that raises growth hormone and IGF-1 levels in clinical studies. Listed here because it is often discussed next to peptides – note it is not injected, so the reconstitution calculator does not apply.',
    evidence: 'Human trials exist (older adults, GH-deficient children); it never reached approval.',
    regulatory: 'Investigational only. Prohibited in competitive sport.',
    tradeoffs: ['Big appetite spikes', 'Water retention and swelling', 'Reduced insulin sensitivity / higher fasting glucose in trials', 'Daytime lethargy reported'],
    keywords: ['sleep', 'appetite', 'growth hormone', 'gh', 'hunger', 'night', 'recovery'],
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    aka: 'GHRP – selective ghrelin agonist',
    category: 'gh',
    mechanism:
      'A pentapeptide growth-hormone secretagogue that stimulates pituitary GH release through the ghrelin receptor, with relatively little effect on cortisol or prolactin in early studies.',
    evidence: 'Phase 2 human trial (post-operative ileus) was discontinued for lack of efficacy.',
    regulatory: 'Not approved anywhere. Prohibited in competitive sport.',
    tradeoffs: ['Hunger pangs', 'Flushing and headache', 'Transient water retention'],
    keywords: ['gh', 'growth hormone', 'sleep', 'appetite', 'recovery'],
  },
  {
    id: 'cjc1295',
    name: 'CJC-1295',
    aka: 'GHRH analogue',
    category: 'gh',
    mechanism:
      'A modified growth-hormone-releasing-hormone analogue designed to resist degradation, prolonging stimulation of GH and IGF-1 secretion in early human studies.',
    evidence: 'Small early-phase trials; development was halted.',
    regulatory: 'Not approved. Prohibited in competitive sport.',
    tradeoffs: ['Flushing and injection-site reactions', 'Water retention', 'Sustained GH elevation has unknown long-term consequences'],
    keywords: ['gh', 'growth hormone', 'sleep', 'recovery', 'ghrh'],
  },
  {
    id: 'semax',
    name: 'Semax',
    aka: 'ACTH(4-10) analogue',
    category: 'cognitive',
    mechanism:
      'A heptapeptide derived from an ACTH fragment with a stabilising Pro-Gly-Pro tail. Reported to influence BDNF expression and neuro-protection in animal and small clinical studies.',
    evidence: 'Mostly Russian-language studies; few large, independent trials.',
    regulatory: 'Registered for some uses in Russia; not approved in the US or EU.',
    tradeoffs: ['Evidence base is thin and regionally limited', 'Effects on mood/irritability reported anecdotally'],
    keywords: ['focus', 'memory', 'brain', 'cognition', 'stroke', 'attention', 'nootropic'],
  },
  {
    id: 'selank',
    name: 'Selank',
    aka: 'Tuftsin analogue',
    category: 'cognitive',
    mechanism:
      'A synthetic analogue of the immune peptide tuftsin. Investigated for anxiolytic and immunomodulating effects, possibly via GABA-ergic and monoamine modulation.',
    evidence: 'Small studies, primarily from Russian groups.',
    regulatory: 'Registered in Russia; not approved in the US or EU.',
    tradeoffs: ['Limited independent replication', 'Fatigue or drowsiness described by some users'],
    keywords: ['anxiety', 'stress', 'calm', 'mood', 'brain', 'nerves', 'nootropic'],
  },
  {
    id: 'aod9604',
    name: 'AOD-9604',
    aka: 'hGH fragment 177-191 (modified)',
    category: 'metabolic',
    mechanism:
      'A modified fragment of the C-terminus of human growth hormone, designed to mimic GH’s effect on fat metabolism without its effect on growth.',
    evidence: 'Phase 2b obesity trials did not show clinically meaningful weight loss.',
    regulatory: 'Not approved as a drug.',
    tradeoffs: ['Human trials underdelivered', 'Marketing claims routinely outrun the data'],
    keywords: ['fat', 'weight', 'metabolism', 'lipolysis', 'obesity', 'cutting'],
  },
  {
    id: 'frag176',
    name: 'Frag 176-191',
    aka: 'hGH fragment 176-191',
    category: 'metabolic',
    mechanism:
      'The unmodified C-terminal fragment of human growth hormone, investigated for a lipolytic effect in cell and animal studies.',
    evidence: 'Preclinical; essentially no controlled human data.',
    regulatory: 'Not approved for human use.',
    tradeoffs: ['Very little evidence of benefit', 'Product quality unverified'],
    keywords: ['fat', 'weight', 'metabolism', 'lipolysis', 'cutting'],
  },
  {
    id: 'mt2',
    name: 'Melanotan II',
    aka: 'Non-selective melanocortin agonist',
    category: 'pigment',
    mechanism:
      'A cyclic peptide that activates several melanocortin receptors, stimulating melanin production. It also acts on receptors involved in appetite and sexual arousal.',
    evidence: 'Small early human studies; regulators have issued public warnings.',
    regulatory: 'Unapproved – health authorities (e.g. MHRA, TGA) explicitly warn against its use.',
    tradeoffs: ['Nausea and flushing', 'Unintended sexual side effects', 'Reports of darkening / changing moles – dermatology red flag', 'Unregulated products are a lottery'],
    keywords: ['tan', 'skin', 'pigment', 'sun', 'melanin', 'uv'],
  },
];
