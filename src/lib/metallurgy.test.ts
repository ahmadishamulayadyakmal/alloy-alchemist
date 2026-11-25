import { describe, expect, it } from 'vitest';
import {
  ac3Temperature,
  analyze,
  carbonEquivalent,
  estimatedHardness,
  martensiteStart,
  phaseAt,
  predictMicrostructure,
  PRESETS,
} from './metallurgy';

const preset = (id: string) => PRESETS.find((p) => p.id === id)!.composition;

describe('carbonEquivalent (IIW)', () => {
  it('computes CE for AISI 1045: 0.45 + 0.75/6 = 0.575', () => {
    expect(carbonEquivalent(preset('1045'))).toBeCloseTo(0.575, 3);
  });
  it('computes CE for AISI 4140: 0.40 + 0.85/6 + (1.0+0.2)/5 = 0.782', () => {
    expect(carbonEquivalent(preset('4140'))).toBeCloseTo(0.782, 3);
  });
  it('316L has a high CE from nickel and chromium', () => {
    expect(carbonEquivalent(preset('316l'))).toBeGreaterThan(3);
  });
});

describe('martensiteStart (Andrews 1965)', () => {
  it('computes Ms for AISI 1045 ≈ 326 °C', () => {
    expect(martensiteStart(preset('1045'))).toBeCloseTo(326, 0);
  });
  it('alloying depresses Ms: 4340 is lower than 1045', () => {
    expect(martensiteStart(preset('4340'))).toBeLessThan(martensiteStart(preset('1045')));
  });
  it('stays in a displayable range even for extreme compositions', () => {
    const ms = martensiteStart({ ...preset('d2'), C: 2, Cr: 20, Ni: 15, Mo: 5, Mn: 2, Si: 2, V: 2, Cu: 2, P: 0, Al: 0, W: 0, Ti: 0, As: 0 });
    expect(ms).toBeGreaterThanOrEqual(-100);
  });
});

describe('ac3Temperature (Andrews 1965)', () => {
  it('computes Ac3 for AISI 1045 ≈ 762 °C', () => {
    expect(ac3Temperature(preset('1045'))).toBeCloseTo(762, 0);
  });
  it('silicon raises Ac3', () => {
    const base = preset('1045');
    expect(ac3Temperature({ ...base, Si: 2 })).toBeGreaterThan(ac3Temperature(base));
  });
});

describe('estimatedHardness', () => {
  it('gives a band around 60 HRC for 0.45% C', () => {
    const h = estimatedHardness(preset('1045'));
    expect(h.typical).toBeGreaterThanOrEqual(55);
    expect(h.typical).toBeLessThanOrEqual(65);
    expect(h.low).toBeLessThan(h.typical);
    expect(h.high).toBeGreaterThan(h.typical);
  });
  it('cannot harden steel with almost no carbon', () => {
    const h = estimatedHardness({ ...preset('1018'), C: 0.02 });
    expect(h.typical).toBe(0);
  });
  it('caps near 65 HRC for very high carbon', () => {
    const h = estimatedHardness(preset('d2'));
    expect(h.typical).toBeLessThanOrEqual(65);
  });
});

describe('predictMicrostructure', () => {
  it('recognizes 316L as austenitic stainless that cannot harden by quenching', () => {
    const m = predictMicrostructure(preset('316l'));
    expect(m.family).toMatch(/Austenitic stainless/);
    expect(m.quenched[0].phase).toBe('Austenite');
  });
  it('recognizes D2 as a high-carbon, hardenable grade', () => {
    const m = predictMicrostructure(preset('d2'));
    expect(m.quenched.some((p) => p.phase === 'Martensite')).toBe(true);
  });
  it('predicts ferrite + pearlite for annealed 1045', () => {
    const m = predictMicrostructure(preset('1045'));
    const names = m.annealed.map((p) => p.phase);
    expect(names).toContain('Ferrite');
    expect(names).toContain('Pearlite');
  });
  it('flags high CE grades for welding preheat', () => {
    const m = predictMicrostructure(preset('4140'));
    expect(m.flags.some((f) => f.includes('preheat'))).toBe(true);
  });
});

describe('phaseAt (simplified Fe-C diagram)', () => {
  it('0.45% C at 900 °C is austenite', () => {
    expect(phaseAt(0.45, 900)).toBe('Austenite (γ)');
  });
  it('0.45% C at 800 °C is ferrite + austenite', () => {
    expect(phaseAt(0.45, 800)).toBe('Ferrite + Austenite');
  });
  it('0.45% C at 600 °C is ferrite + pearlite', () => {
    expect(phaseAt(0.45, 600)).toBe('Ferrite + Pearlite');
  });
  it('1.2% C at 600 °C is pearlite + cementite', () => {
    expect(phaseAt(1.2, 600)).toBe('Pearlite + Cementite');
  });
  it('above 1495 °C is liquid', () => {
    expect(phaseAt(0.45, 1550)).toBe('Liquid');
  });
});

describe('analyze (end to end)', () => {
  it('returns a consistent analysis for every preset', () => {
    for (const p of PRESETS) {
      const a = analyze(p.composition);
      expect(a.iron).toBeGreaterThan(60);
      expect(a.iron).toBeLessThanOrEqual(100);
      expect(a.ms).toBeGreaterThanOrEqual(-100);
      expect(a.ac3).toBeGreaterThanOrEqual(700);
      expect(a.heatTreatment.austenitizingC).toBeGreaterThan(a.ac3);
    }
  });
});
