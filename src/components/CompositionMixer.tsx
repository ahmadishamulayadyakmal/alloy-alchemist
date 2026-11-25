import type { Composition, Preset } from '../lib/metallurgy';
import { ELEMENTS, PRESETS, RECIPES, ironBalance } from '../lib/metallurgy';

interface Props {
  composition: Composition;
  activePresetId: string | null;
  onCompositionChange: (comp: Composition) => void;
  onPreset: (preset: Preset) => void;
  onRecipe: (presetId: string) => void;
}

export default function CompositionMixer({ composition, activePresetId, onCompositionChange, onPreset, onRecipe }: Props) {
  return (
    <section className="card" aria-label="Composition mixer">
      <h2><span className="step">1</span> Mix your alloy</h2>
      <p className="muted">Drag the ingredients into the cauldron. Iron makes up the balance.</p>

      <div className="presets" role="group" aria-label="Steel grade presets">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={activePresetId === p.id ? 'chip active' : 'chip'}
            onClick={() => onPreset(p)}
            title={p.note}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="recipes" role="group" aria-label="Transmute recipes">
        {RECIPES.map((r) => (
          <button key={r.id} type="button" className="recipe" onClick={() => onRecipe(r.presetId)} title={r.hint}>
            ✦ {r.label}
          </button>
        ))}
      </div>

      <div className="sliders">
        {ELEMENTS.map((el) => (
          <label key={el.key} className="slider-row">
            <span className="slider-head">
              <strong>{el.symbol}</strong> {el.name}
              <span className="value">{composition[el.key].toFixed(2)} wt%</span>
            </span>
            <input
              type="range"
              min={0}
              max={el.max}
              step={el.step}
              value={composition[el.key]}
              aria-label={`${el.name} content in weight percent`}
              onChange={(e) =>
                onCompositionChange({ ...composition, [el.key]: parseFloat(e.target.value) })
              }
            />
            <span className="role">{el.role}</span>
          </label>
        ))}
      </div>

      <p className="balance">
        Balance: <strong>Fe {ironBalance(composition).toFixed(2)} wt%</strong>
      </p>
    </section>
  );
}
