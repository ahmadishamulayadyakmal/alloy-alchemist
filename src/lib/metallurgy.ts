/**
 * Alloy Alchemist — metallurgy calculation engine.
 *
 * All formulas are established empirical models used for teaching.
 * Results are EDUCATIONAL ESTIMATES, not a substitute for datasheets,
 * standards, or laboratory testing.
 *
 * Sources:
 * - Carbon Equivalent (IIW): CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
 * - Ms temperature: Andrews (1965), Ms (°C) = 539 - 423C - 30.4Mn - 17.7Ni - 12.1Cr - 7.5Mo
 * - Ac3 temperature: Andrews (1965), Ac3 (°C) = 910 - 203*sqrt(C) - 15.2Ni + 44.7Si
 *   + 104V + 31.5Mo + 13.1W - 30Mn - 11Cr - 20Cu + 700P + 400Al + 120As + 400Ti
 * - As-quenched hardness: standard hardness-vs-carbon curve, approximated as
 *   HRC ≈ 20 + 60*sqrt(C%), capped at ~65 HRC, shown as a band (±5 HRC).
 * - Fe-C diagram boundaries are a simplified teaching version.
 */

export interface Composition {
  /** Carbon, wt% — the single most important element in steel. */
  C: number;
  Mn: number;
  Si: number;
  Cr: number;
  Ni: number;
  Mo: number;
  V: number;
  Cu: number;
  /** Trace elements, kept at 0 in the mixer but part of the Ac3 equation. */
  P: number;
  Al: number;
  W: number;
  Ti: number;
  As: number;
}

export type ElementKey = keyof Composition;

export interface ElementDef {
  key: ElementKey;
  symbol: string;
  name: string;
  max: number;
  step: number;
  role: string;
}

/** Elements exposed in the mixer. Order matters: carbon first. */
export const ELEMENTS: ElementDef[] = [
  { key: 'C', symbol: 'C', name: 'Carbon', max: 2, step: 0.01, role: 'Sets hardness and strength. More carbon = harder, but more brittle.' },
  { key: 'Mn', symbol: 'Mn', name: 'Manganese', max: 2, step: 0.05, role: 'Boosts hardenability, deoxidizes the melt, counters sulfur.' },
  { key: 'Si', symbol: 'Si', name: 'Silicon', max: 2, step: 0.05, role: 'Deoxidizer; strengthens ferrite and raises Ac3.' },
  { key: 'Cr', symbol: 'Cr', name: 'Chromium', max: 20, step: 0.1, role: 'Above 10.5% it makes stainless steel; also adds hardenability and wear resistance.' },
  { key: 'Ni', symbol: 'Ni', name: 'Nickel', max: 15, step: 0.1, role: 'Stabilizes austenite, adds toughness — especially at low temperature.' },
  { key: 'Mo', symbol: 'Mo', name: 'Molybdenum', max: 5, step: 0.05, role: 'Deepens hardenability, resists temper softening, fights pitting in stainless.' },
  { key: 'V', symbol: 'V', name: 'Vanadium', max: 2, step: 0.05, role: 'Forms hard carbides; refines grain size.' },
  { key: 'Cu', symbol: 'Cu', name: 'Copper', max: 2, step: 0.05, role: 'Adds corrosion resistance; can strengthen by precipitation.' },
];

export const EMPTY_COMPOSITION: Composition = {
  C: 0.45, Mn: 0.75, Si: 0.25, Cr: 0, Ni: 0, Mo: 0, V: 0, Cu: 0,
  P: 0, Al: 0, W: 0, Ti: 0, As: 0,
};

export interface Preset {
  id: string;
  name: string;
  note: string;
  composition: Composition;
}

const base = (over: Partial<Composition>): Composition => ({ ...EMPTY_COMPOSITION, ...over });

export const PRESETS: Preset[] = [
  { id: '1045', name: 'AISI 1045', note: 'Classic medium-carbon engineering steel', composition: base({ C: 0.45, Mn: 0.75, Si: 0.25 }) },
  { id: '4140', name: 'AISI 4140', note: 'Cr-Mo alloy steel, shafts & gears', composition: base({ C: 0.4, Mn: 0.85, Si: 0.25, Cr: 1.0, Mo: 0.2 }) },
  { id: '4340', name: 'AISI 4340', note: 'Ni-Cr-Mo steel, high toughness', composition: base({ C: 0.4, Mn: 0.7, Si: 0.25, Cr: 0.8, Ni: 1.8, Mo: 0.25 }) },
  { id: '316l', name: '316L Stainless', note: 'Austenitic stainless, marine & medical', composition: base({ C: 0.03, Mn: 1.5, Si: 0.5, Cr: 17, Ni: 12, Mo: 2.5 }) },
  { id: 'd2', name: 'D2 Tool Steel', note: 'High-carbon, high-chromium cold-work tool steel', composition: base({ C: 1.5, Mn: 0.4, Si: 0.3, Cr: 12, Mo: 1.0, V: 1.0 }) },
  { id: '1018', name: 'AISI 1018', note: 'Mild steel, easy to weld & machine', composition: base({ C: 0.18, Mn: 0.8, Si: 0.2 }) },
];

/** "Transmute" one-click recipes that demonstrate a design intent. */
export const RECIPES: { id: string; label: string; hint: string; presetId: string }[] = [
  { id: 'harder', label: 'Make it harder', hint: 'Raise carbon toward 0.6% and add Cr + Mo', presetId: '4140' },
  { id: 'stainless', label: 'Make it stainless', hint: 'Push chromium past 10.5% with nickel', presetId: '316l' },
  { id: 'weldable', label: 'Make it weldable', hint: 'Drop carbon and carbon equivalent', presetId: '1018' },
];

export function ironBalance(comp: Composition): number {
  const alloying = (Object.keys(comp) as ElementKey[]).reduce((sum, k) => sum + comp[k], 0);
  return Math.max(0, 100 - alloying);
}

/** Carbon Equivalent, IIW formula. Above ~0.45, preheat is usually needed for welding. */
export function carbonEquivalent(comp: Composition): number {
  return comp.C + comp.Mn / 6 + (comp.Cr + comp.Mo + comp.V) / 5 + (comp.Ni + comp.Cu) / 15;
}

/** Martensite-start temperature, Andrews (1965). Clamped to a displayable range. */
export function martensiteStart(comp: Composition): number {
  const ms = 539 - 423 * comp.C - 30.4 * comp.Mn - 17.7 * comp.Ni - 12.1 * comp.Cr - 7.5 * comp.Mo;
  return Math.round(Math.max(-100, Math.min(550, ms)));
}

/** Ac3 (fully austenitic) temperature, Andrews (1965). Clamped to a displayable range. */
export function ac3Temperature(comp: Composition): number {
  const ac3 =
    910 - 203 * Math.sqrt(comp.C) - 15.2 * comp.Ni + 44.7 * comp.Si + 104 * comp.V +
    31.5 * comp.Mo + 13.1 * comp.W - 30 * comp.Mn - 11 * comp.Cr - 20 * comp.Cu +
    700 * comp.P + 400 * comp.Al + 120 * comp.As + 400 * comp.Ti;
  return Math.round(Math.max(700, Math.min(1000, ac3)));
}

/** Eutectoid temperature, effectively constant for teaching purposes. */
export const AC1_TEMPERATURE = 727;

export interface HardnessBand {
  typical: number;
  low: number;
  high: number;
  unit: 'HRC';
  note: string;
}

/** Estimated as-quenched hardness band from the hardness-vs-carbon curve. */
export function estimatedHardness(comp: Composition): HardnessBand {
  if (comp.C < 0.05) {
    return { typical: 0, low: 0, high: 0, unit: 'HRC', note: 'Too little carbon to harden by quenching — it stays soft.' };
  }
  const typical = Math.min(65, Math.round(20 + 60 * Math.sqrt(comp.C)));
  return {
    typical,
    low: Math.max(15, typical - 5),
    high: Math.min(67, typical + 5),
    unit: 'HRC',
    note: 'Estimate from the hardness-vs-carbon curve. Real values depend on quenching and section size.',
  };
}

export type PhaseName = 'Ferrite' | 'Pearlite' | 'Martensite' | 'Bainite' | 'Austenite' | 'Cementite';

export interface PhaseFraction {
  phase: PhaseName;
  fraction: number; // 0..1
  blurb: string;
}

export interface MicrostructurePrediction {
  annealed: PhaseFraction[];
  quenched: PhaseFraction[];
  family: string;
  summary: string;
  flags: string[];
}

const phase = (name: PhaseName, fraction: number, blurb: string): PhaseFraction => ({ phase: name, fraction, blurb });

export function predictMicrostructure(comp: Composition): MicrostructurePrediction {
  const { C, Cr, Ni } = comp;
  const ce = carbonEquivalent(comp);
  const flags: string[] = [];

  // --- Stainless families ---
  if (Cr >= 10.5 && Ni >= 8 && Cr >= 16) {
    return {
      family: 'Austenitic stainless steel',
      summary: 'Stable austenite at room temperature. It cannot be hardened by quenching — only by cold work.',
      annealed: [phase('Austenite', 1, 'Face-centred cubic grains, non-magnetic, very corrosion resistant.')],
      quenched: [phase('Austenite', 1, 'Quenching does not harden it; it only locks in the austenite.')],
      flags: ['Stainless (Cr ≥ 10.5%)', 'Non-hardenable by heat treatment', 'Excellent corrosion resistance'],
    };
  }
  if (Cr >= 10.5) {
    flags.push('Stainless (Cr ≥ 10.5%)');
    if (C >= 0.15) {
      return {
        family: 'Martensitic stainless steel',
        summary: 'Enough chromium for stainless behaviour and enough carbon to harden by quenching.',
        annealed: [phase('Ferrite', 0.6, 'Chromium-rich ferrite.'), phase('Pearlite', 0.4, 'With coarse carbides.')],
        quenched: [phase('Martensite', 0.75, 'Hard, chromium-bearing martensite.'), phase('Ferrite', 0.25, 'Some retained ferrite.')],
        flags: [...flags, 'Hardenable by quenching', 'Needs tempering after quenching'],
      };
    }
    return {
      family: 'Ferritic stainless steel',
      summary: 'Corrosion resistant ferrite. It stays soft and does not harden much by quenching.',
      annealed: [phase('Ferrite', 1, 'Chromium-rich ferrite grains.')],
      quenched: [phase('Ferrite', 0.9, 'Still ferrite.'), phase('Martensite', 0.1, 'A little martensite at grain boundaries.')],
      flags: [...flags, 'Limited hardenability', 'Good corrosion resistance'],
    };
  }

  // --- Plain carbon / low-alloy steels ---
  const pearliteFraction = Math.min(1, Math.max(0, C / 0.77));
  const annealed: PhaseFraction[] =
    C < 0.05
      ? [phase('Ferrite', 1, 'Soft, ductile ferrite grains.')]
      : C < 0.77
        ? [
            phase('Ferrite', 1 - pearliteFraction, 'Soft, ductile matrix.'),
            phase('Pearlite', pearliteFraction, 'Layered ferrite + cementite — the strength of the steel.'),
          ]
        : C <= 0.8
          ? [phase('Pearlite', 1, 'Fully pearlitic — strong, but less ductile.')]
          : [
              phase('Pearlite', 0.85, 'Mostly pearlite.'),
              phase('Cementite', 0.15, 'Hard, brittle cementite network at grain boundaries.'),
            ];

  // Quenched prediction, driven by carbon and hardenability (CE).
  let quenched: PhaseFraction[];
  let family = 'Carbon / low-alloy steel';
  if (C < 0.12) {
    quenched = [
      phase('Ferrite', 0.65, 'Quenching barely changes it — not enough carbon.'),
      phase('Bainite', 0.35, 'Some bainite where alloying helped.'),
    ];
    family = 'Low-carbon steel — limited hardenability';
  } else if (C < 0.3) {
    const m = ce >= 0.45 ? 0.55 : 0.4;
    quenched = [
      phase('Martensite', m, 'Hard martensite where the quench was fast enough.'),
      phase('Bainite', 0.3, 'Bainite in slower-cooling regions.'),
      phase('Ferrite', 1 - m - 0.3, 'Soft ferrite remains.'),
    ];
  } else if (C < 0.8) {
    const m = ce >= 0.5 ? 0.85 : 0.7;
    quenched = [
      phase('Martensite', m, 'Dominant hard martensite.'),
      phase('Bainite', 1 - m, 'A little bainite.'),
    ];
    family = 'Medium-carbon steel — good hardenability';
  } else {
    quenched = [
      phase('Martensite', 0.7, 'Hard martensite, but brittle without tempering.'),
      phase('Austenite', 0.15, 'Retained austenite — high carbon lowers Ms.'),
      phase('Cementite', 0.15, 'Undissolved carbides remain.'),
    ];
    family = 'High-carbon steel — very hard, needs tempering';
  }

  if (ce > 0.45) flags.push('High carbon equivalent — preheat before welding');
  if (ce > 0.6) flags.push('Very high hardenability — prefer oil or air quench to avoid cracking');
  if (C >= 0.6) flags.push('High carbon — quench cracks are a real risk; temper immediately');

  return { family, summary: `${family}. ${annealed.map((p) => `${Math.round(p.fraction * 100)}% ${p.phase.toLowerCase()}`).join(' + ')} when annealed; quenching shifts it toward martensite.`, annealed, quenched, flags };
}

export interface HeatTreatment {
  austenitizingC: number;
  quenchMedium: 'Water' | 'Oil' | 'Air';
  quenchNote: string;
  temperingNote: string;
  weldability: string;
}

export function recommendHeatTreatment(comp: Composition): HeatTreatment {
  const ce = carbonEquivalent(comp);
  const ac3 = ac3Temperature(comp);
  const austenitizingC = ac3 + 30;
  const alloy = comp.Cr + comp.Mo + comp.Ni;

  let quenchMedium: HeatTreatment['quenchMedium'] = 'Water';
  let quenchNote = 'Water quench — fast enough for plain carbon grades, but it is the harshest on the steel.';
  if (alloy >= 2 || ce >= 0.6) {
    quenchMedium = 'Oil';
    quenchNote = 'Oil quench — high hardenability means oil is fast enough, and far less likely to crack the part.';
  }
  if (alloy >= 5 || comp.Cr >= 10.5) {
    quenchMedium = 'Air';
    quenchNote = 'Air quench — this alloy hardens even in still air. Quenching harder would only add cracks.';
  }

  return {
    austenitizingC,
    quenchMedium,
    quenchNote,
    temperingNote: 'Temper immediately after quenching. Higher tempering temperatures trade hardness for toughness — around 150–200 °C keeps hardness, 400–600 °C restores toughness.',
    weldability: ce <= 0.4
      ? 'Good weldability — no preheat normally required.'
      : ce <= 0.6
        ? 'Fair weldability — preheat to ~100–150 °C and use low-hydrogen electrodes.'
        : 'Poor weldability — preheat, control interpass temperature, and post-weld heat treat.',
  };
}

/** Simplified Fe-C diagram boundaries (teaching version, C in wt%, T in °C). */
export function a3Line(c: number): number {
  if (c <= 0) return 912;
  if (c >= 0.77) return AC1_TEMPERATURE;
  return 912 - 240 * c;
}

export function acmLine(c: number): number {
  if (c <= 0.77) return Number.POSITIVE_INFINITY;
  return AC1_TEMPERATURE + 313 * (c - 0.77);
}

export type PhaseRegion =
  | 'Liquid'
  | 'Austenite (γ)'
  | 'Ferrite + Austenite'
  | 'Austenite + Cementite'
  | 'Ferrite + Pearlite'
  | 'Pearlite'
  | 'Pearlite + Cementite';

/** Which phase region a (C, T) point sits in, on the simplified diagram. */
export function phaseAt(c: number, tempC: number): PhaseRegion {
  if (tempC >= 1495) return 'Liquid';
  if (tempC > a3Line(c) && c <= 0.77) return 'Austenite (γ)';
  if (tempC > acmLine(c) && c > 0.77) return 'Austenite (γ)';
  if (tempC > AC1_TEMPERATURE) {
    return c <= 0.77 ? 'Ferrite + Austenite' : 'Austenite + Cementite';
  }
  if (c < 0.7) return 'Ferrite + Pearlite';
  if (c <= 0.85) return 'Pearlite';
  return 'Pearlite + Cementite';
}

export interface Analysis {
  composition: Composition;
  iron: number;
  ce: number;
  ms: number;
  ac3: number;
  hardness: HardnessBand;
  microstructure: MicrostructurePrediction;
  heatTreatment: HeatTreatment;
}

export function analyze(comp: Composition): Analysis {
  return {
    composition: comp,
    iron: ironBalance(comp),
    ce: carbonEquivalent(comp),
    ms: martensiteStart(comp),
    ac3: ac3Temperature(comp),
    hardness: estimatedHardness(comp),
    microstructure: predictMicrostructure(comp),
    heatTreatment: recommendHeatTreatment(comp),
  };
}

/* ------------------------------------------------------------------ */
/* Tutor — curated explanations generated from the computed results.  */
/* No external AI call: every sentence is derived from the numbers    */
/* above, so the tutor can never invent a formula or a value.         */
/* ------------------------------------------------------------------ */

export interface TutorNote {
  title: string;
  body: string;
}

export function buildTutorNotes(comp: Composition, a: Analysis): TutorNote[] {
  const notes: TutorNote[] = [];
  const el = (k: ElementKey) => ELEMENTS.find((e) => e.key === k);

  notes.push({
    title: `Why is the Ms temperature ${a.ms} °C?`,
    body: `Martensite starts forming when the steel cools to ${a.ms} °C. Every alloying element drags Ms down — carbon most of all (−423 °C per 1% C in Andrews' equation), then manganese, nickel, chromium and molybdenum. That is why high-alloy steels can keep some soft retained austenite at room temperature.`,
  });

  notes.push({
    title: 'What does the carbon equivalent mean?',
    body: `Your CE is ${a.ce.toFixed(2)}. It compresses the whole composition into one weldability number: carbon counts fully, manganese a sixth, chromium/molybdenum/vanadium a fifth, nickel/copper a fifteenth. ${a.ce <= 0.4 ? 'Below 0.40 it generally welds without preheat.' : a.ce <= 0.6 ? 'Between 0.40 and 0.60, preheat to roughly 100–150 °C to avoid hydrogen cracking.' : 'Above 0.60, treat welding as a procedure — preheat, control interpass temperature, and post-weld heat treat.'}`,
  });

  notes.push({
    title: `Why ${a.hardness.typical} HRC after quenching?`,
    body: a.hardness.typical === 0
      ? 'With this little carbon, martensite barely forms — there is almost no carbon to trap in the iron lattice, so quenching cannot make it hard.'
      : `As-quenched hardness is mostly a carbon story: more carbon trapped in the martensite lattice means a harder, more distorted structure. Your ${comp.C.toFixed(2)}% C lands around ${a.hardness.low}–${a.hardness.high} HRC. Alloying helps the quench reach the core (hardenability), but it does not raise the maximum hardness — only carbon does that.`,
  });

  const present = ELEMENTS.filter((e) => comp[e.key] >= 0.1 && e.key !== 'C');
  if (present.length > 0) {
    notes.push({
      title: 'What is each alloying element doing here?',
      body: present.map((e) => `${e.symbol} (${comp[e.key].toFixed(2)}%): ${e.role}`).join(' '),
    });
  } else {
    notes.push({
      title: 'What is each alloying element doing here?',
      body: 'Right now this is essentially a plain carbon steel — only carbon and a little manganese are doing the work. Try adding chromium past 10.5% and watch the family change to stainless, or add nickel and see Ms drop and toughness rise.',
    });
  }

  notes.push({
    title: 'Why temper after quenching?',
    body: 'Fresh martensite is hard but brittle — it is full of internal stress. Tempering (reheating to 150–600 °C) lets some carbon escape the lattice, trading a little hardness for a lot of toughness. Skip tempering and the part can crack on the shelf.',
  });

  void el;
  return notes;
}

export const TUTOR_FAQ: TutorNote[] = [
  { title: 'What is martensite, really?', body: 'Martensite is iron with carbon trapped inside it. When austenite is cooled very fast, carbon has no time to escape, so the lattice distorts into a stressed, needle-like structure. That distortion is what makes quenched steel hard — and brittle.' },
  { title: 'Why does chromium make stainless steel?', body: 'Above about 10.5% chromium, the steel forms a thin, invisible chromium-oxide skin that seals the surface from oxygen and water. Scratch it and it reforms by itself — that is why stainless does not rust like plain steel.' },
  { title: 'What is the difference between hardness and hardenability?', body: 'Hardness is how hard the steel gets — set mostly by carbon. Hardenability is how deep the hardness goes — set by alloying elements like manganese, chromium and molybdenum, which slow down the formation of soft phases so the quench can reach the core.' },
  { title: 'What is pearlite?', body: 'Pearlite is a layered mixture of soft ferrite and hard cementite that forms when austenite cools slowly through 727 °C. Under a microscope it looks like a fingerprint — and those layers are what give medium-carbon steel its strength.' },
];
