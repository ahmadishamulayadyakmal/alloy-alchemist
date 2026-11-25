import { useMemo, useState } from 'react';
import type { MicrostructurePrediction, PhaseName } from '../lib/metallurgy';

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const PHASE_COLORS: Record<PhaseName, string> = {
  Ferrite: '#c9ced4',
  Pearlite: '#8a7f70',
  Martensite: '#2e2a26',
  Bainite: '#6e6257',
  Austenite: '#e6e1d5',
  Cementite: '#1c1a18',
};

interface Shape {
  kind: PhaseName;
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
}

function buildShapes(phases: MicrostructurePrediction['quenched'], seedKey: string): Shape[] {
  const rng = mulberry32(hashString(seedKey));
  const shapes: Shape[] = [];
  for (const p of phases) {
    const count = Math.round(p.fraction * 34);
    for (let i = 0; i < count; i++) {
      shapes.push({
        kind: p.phase,
        x: 10 + rng() * 540,
        y: 10 + rng() * 190,
        rx: 12 + rng() * 16,
        ry: 8 + rng() * 10,
        rot: rng() * 180,
      });
    }
  }
  return shapes;
}

export default function MicrostructureViewer({ prediction }: { prediction: MicrostructurePrediction }) {
  const [mode, setMode] = useState<'quenched' | 'annealed'>('quenched');
  const phases = mode === 'quenched' ? prediction.quenched : prediction.annealed;
  const seedKey = `${mode}:${phases.map((p) => `${p.phase}:${p.fraction.toFixed(2)}`).join(',')}`;
  const shapes = useMemo(() => buildShapes(phases, seedKey), [phases, seedKey]);

  return (
    <section className="card" aria-label="Microstructure viewer">
      <h2><span className="step">4</span> Under the microscope</h2>
      <p className="muted">Schematic rendering — not a real micrograph — of the predicted phases.</p>

      <div className="presets" role="group" aria-label="Microstructure state">
        <button type="button" className={mode === 'quenched' ? 'chip active' : 'chip'} onClick={() => setMode('quenched')}>
          After quenching
        </button>
        <button type="button" className={mode === 'annealed' ? 'chip active' : 'chip'} onClick={() => setMode('annealed')}>
          Slow-cooled
        </button>
      </div>

      <svg viewBox="0 0 560 210" className="micro" role="img" aria-label={`Schematic microstructure: ${phases.map((p) => `${Math.round(p.fraction * 100)} percent ${p.phase}`).join(', ')}`}>
        <defs>
          <pattern id="pearlite-stripes" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#b9ac9c" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#4a4238" strokeWidth="2" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="560" height="210" className="micro-bg" />
        {shapes.map((s, i) =>
          s.kind === 'Pearlite' ? (
            <circle key={i} cx={s.x} cy={s.y} r={s.rx} fill="url(#pearlite-stripes)" stroke="#4a4238" strokeWidth="1.5" />
          ) : s.kind === 'Martensite' ? (
            <rect key={i} x={s.x - s.rx} y={s.y - 3} width={s.rx * 2} height={6} rx={3} fill={PHASE_COLORS.Martensite} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
          ) : s.kind === 'Cementite' ? (
            <circle key={i} cx={s.x} cy={s.y} r={s.rx * 0.5} fill="none" stroke={PHASE_COLORS.Cementite} strokeWidth="3" />
          ) : s.kind === 'Bainite' ? (
            <g key={i} stroke={PHASE_COLORS.Bainite} strokeWidth="2" transform={`rotate(${s.rot} ${s.x} ${s.y})`}>
              <line x1={s.x - s.rx} y1={s.y} x2={s.x + s.rx} y2={s.y} />
              <line x1={s.x - s.rx * 0.6} y1={s.y - 5} x2={s.x + s.rx * 0.6} y2={s.y - 5} />
              <line x1={s.x - s.rx * 0.6} y1={s.y + 5} x2={s.x + s.rx * 0.6} y2={s.y + 5} />
            </g>
          ) : (
            <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill={PHASE_COLORS[s.kind]} stroke="#8a8f96" strokeWidth="1" opacity={0.9} />
          ),
        )}
      </svg>

      <ul className="legend">
        {phases.map((p) => (
          <li key={p.phase}>
            <span className="swatch" style={{ background: PHASE_COLORS[p.phase] }} />
            <strong>{p.phase} {Math.round(p.fraction * 100)}%</strong> — {p.blurb}
          </li>
        ))}
      </ul>
    </section>
  );
}
