import { AC1_TEMPERATURE, a3Line, acmLine, phaseAt } from '../lib/metallurgy';

interface Props {
  carbon: number;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
}

const W = 660;
const H = 440;
const ML = 52;
const MR = 18;
const MT = 24;
const MB = 44;
const C_MAX = 2.0;
const T_MIN = 500;
const T_MAX = 1600;

const x = (c: number) => ML + (c / C_MAX) * (W - ML - MR);
const y = (t: number) => H - MB - ((t - T_MIN) / (T_MAX - T_MIN)) * (H - MT - MB);

function linePath(fn: (c: number) => number, c0: number, c1: number): string {
  const steps = 24;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const c = c0 + ((c1 - c0) * i) / steps;
    const t = fn(c);
    if (!Number.isFinite(t)) continue;
    d += `${i === 0 ? 'M' : 'L'}${x(c).toFixed(1)},${y(t).toFixed(1)} `;
  }
  return d;
}

export default function PhaseDiagram({ carbon, temperature, onTemperatureChange }: Props) {
  const region = phaseAt(carbon, temperature);
  return (
    <section className="card" aria-label="Iron-carbon phase diagram">
      <h2><span className="step">3</span> The iron–carbon map</h2>
      <p className="muted">
        Simplified Fe–C diagram for steels. Move the temperature slider and watch your alloy cross the phase boundaries.
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label={`Iron-carbon diagram. Composition ${carbon.toFixed(2)} percent carbon at ${temperature} degrees Celsius is in the ${region} region.`}>
        {/* gridlines + axes */}
        {[600, 800, 1000, 1200, 1400, 1600].map((t) => (
          <g key={t}>
            <line x1={ML} y1={y(t)} x2={W - MR} y2={y(t)} className="grid" />
            <text x={ML - 8} y={y(t) + 4} className="axis" textAnchor="end">{t}</text>
          </g>
        ))}
        {[0, 0.5, 1, 1.5, 2].map((c) => (
          <g key={c}>
            <line x1={x(c)} y1={MT} x2={x(c)} y2={H - MB} className="grid" />
            <text x={x(c)} y={H - MB + 20} className="axis" textAnchor="middle">{c.toFixed(1)}</text>
          </g>
        ))}
        <text x={ML - 8} y={MT - 8} className="axis-title" textAnchor="start">Temperature (°C)</text>
        <text x={(W - ML - MR) / 2 + ML} y={H - 6} className="axis-title" textAnchor="middle">Carbon (wt%)</text>

        {/* phase boundaries */}
        <path d={linePath(a3Line, 0, 0.77)} className="boundary" />
        <path d={linePath(acmLine, 0.77, 2.0)} className="boundary" />
        <line x1={x(0)} y1={y(AC1_TEMPERATURE)} x2={x(2)} y2={y(AC1_TEMPERATURE)} className="boundary eutectoid" />
        <circle cx={x(0.77)} cy={y(AC1_TEMPERATURE)} r={4} className="eutectoid-dot" />
        <text x={x(0.77) + 10} y={y(AC1_TEMPERATURE) - 8} className="diagram-label">Eutectoid 0.77% C, 727 °C</text>

        {/* region labels */}
        <text x={x(0.55)} y={y(1250)} className="diagram-label big">γ Austenite</text>
        <text x={x(0.3)} y={y(850)} className="diagram-label">α + γ</text>
        <text x={x(1.45)} y={y(950)} className="diagram-label">γ + Fe₃C</text>
        <text x={x(0.3)} y={y(620)} className="diagram-label">α + Pearlite</text>
        <text x={x(1.45)} y={y(620)} className="diagram-label">Pearlite + Fe₃C</text>

        {/* composition + temperature marker — glides via CSS transform */}
        <g className="marker-group" style={{ transform: `translate(${x(carbon)}px, 0)` }}>
          <line x1={0} y1={MT} x2={0} y2={H - MB} className="marker" />
        </g>
        <g className="marker-group" style={{ transform: `translate(0, ${y(temperature)}px)` }}>
          <line x1={ML} y1={0} x2={W - MR} y2={0} className="marker" />
        </g>
        <g className="marker-group" style={{ transform: `translate(${x(carbon)}px, ${y(temperature)}px)` }}>
          <circle cx={0} cy={0} r={7} className="marker-dot" />
        </g>
      </svg>

      <label className="slider-row temp-slider">
        <span className="slider-head">
          <strong>Temperature</strong>
          <span className="value">{temperature} °C</span>
        </span>
        <input
          type="range"
          min={500}
          max={1500}
          step={10}
          value={temperature}
          aria-label="Temperature in degrees Celsius"
          style={{ background: `linear-gradient(90deg, var(--ember) ${((temperature - 500) / 1000) * 100}%, var(--line) ${((temperature - 500) / 1000) * 100}%)` }}
          onChange={(e) => onTemperatureChange(parseInt(e.target.value, 10))}
        />
      </label>

      <p className="region">
        At <strong>{carbon.toFixed(2)}% C</strong> and <strong>{temperature} °C</strong> your alloy is in the{' '}
        <strong>{region}</strong> region.
      </p>
      <p className="muted small">Teaching diagram: boundaries are simplified straight-line approximations of the real Fe–C system.</p>
    </section>
  );
}
