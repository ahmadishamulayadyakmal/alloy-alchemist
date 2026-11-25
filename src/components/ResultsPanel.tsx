import type { Analysis } from '../lib/metallurgy';

function PhaseBars({ phases }: { phases: Analysis['microstructure']['annealed'] }) {
  return (
    <div className="phase-bars">
      {phases.map((p) => (
        <div key={p.phase} className="phase-row">
          <span className="phase-name">{p.phase}</span>
          <span className="bar-track">
            <span className={`bar-fill phase-${p.phase.toLowerCase()}`} style={{ width: `${Math.round(p.fraction * 100)}%` }} />
          </span>
          <span className="phase-pct">{Math.round(p.fraction * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPanel({ analysis }: { analysis: Analysis }) {
  const { ce, ms, ac3, hardness, microstructure, heatTreatment } = analysis;
  return (
    <section className="card" aria-label="Prediction results">
      <h2><span className="step">2</span> The transmutation</h2>
      <p className="family">{microstructure.family}</p>
      <p className="muted">{microstructure.summary}</p>

      {microstructure.flags.length > 0 && (
        <div className="flags">
          {microstructure.flags.map((f) => (
            <span key={f} className="flag">⚠ {f}</span>
          ))}
        </div>
      )}

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Martensite start (Ms)</span>
          <span className="stat-value">{ms} °C</span>
          <span className="stat-note">Andrews (1965)</span>
        </div>
        <div className="stat">
          <span className="stat-label">Ac3 — fully austenitic</span>
          <span className="stat-value">{ac3} °C</span>
          <span className="stat-note">Andrews (1965)</span>
        </div>
        <div className="stat">
          <span className="stat-label">Carbon equivalent (CE)</span>
          <span className="stat-value">{ce.toFixed(2)}</span>
          <span className="stat-note">{ce <= 0.4 ? 'Welds without preheat' : ce <= 0.6 ? 'Preheat recommended' : 'Preheat + procedure required'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Est. as-quenched hardness</span>
          <span className="stat-value">
            {hardness.typical === 0 ? '—' : `${hardness.low}–${hardness.high} HRC`}
          </span>
          <span className="stat-note">{hardness.typical === 0 ? 'Too little carbon to harden' : `Typical ≈ ${hardness.typical} HRC`}</span>
        </div>
      </div>

      {hardness.typical > 0 && (
        <div className="hardness-bar" aria-label={`Estimated hardness ${hardness.low} to ${hardness.high} HRC`}>
          <span className="bar-track">
            <span className="bar-fill hardness" style={{ width: `${(hardness.typical / 67) * 100}%` }} />
          </span>
          <span className="muted small">0 HRC — soft iron · 67 HRC — near the practical limit</span>
        </div>
      )}

      <h3>After quenching</h3>
      <PhaseBars phases={microstructure.quenched} />
      <h3>Slow-cooled (annealed)</h3>
      <PhaseBars phases={microstructure.annealed} />

      <h3>Recommended heat treatment</h3>
      <dl className="ht">
        <div><dt>Austenitize at</dt><dd>{heatTreatment.austenitizingC} °C (Ac3 + 30 °C)</dd></div>
        <div><dt>Quench in</dt><dd>{heatTreatment.quenchMedium} — {heatTreatment.quenchNote}</dd></div>
        <div><dt>Tempering</dt><dd>{heatTreatment.temperingNote}</dd></div>
        <div><dt>Weldability</dt><dd>{heatTreatment.weldability}</dd></div>
      </dl>
    </section>
  );
}
