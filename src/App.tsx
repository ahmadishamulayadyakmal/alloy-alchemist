import { useMemo, useState } from 'react';
import { analyze, buildTutorNotes, EMPTY_COMPOSITION, PRESETS } from './lib/metallurgy';
import type { Composition, Preset } from './lib/metallurgy';
import CompositionMixer from './components/CompositionMixer';
import ResultsPanel from './components/ResultsPanel';
import PhaseDiagram from './components/PhaseDiagram';
import MicrostructureViewer from './components/MicrostructureViewer';
import TutorPanel from './components/TutorPanel';

export default function App() {
  const [composition, setComposition] = useState<Composition>(EMPTY_COMPOSITION);
  const [activePresetId, setActivePresetId] = useState<string | null>('1045');
  const [temperature, setTemperature] = useState(900);

  const analysis = useMemo(() => analyze(composition), [composition]);
  const notes = useMemo(() => buildTutorNotes(composition, analysis), [composition, analysis]);

  const applyPreset = (preset: Preset) => {
    setComposition({ ...preset.composition });
    setActivePresetId(preset.id);
  };

  const applyRecipe = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) applyPreset(preset);
  };

  const handleCompositionChange = (comp: Composition) => {
    setComposition(comp);
    setActivePresetId(null);
  };

  return (
    <div className="app">
      <header className="hero">
        <p className="badges">
          <span className="badge">Kiroween 2026</span>
          <span className="badge">Frankenstein</span>
          <span className="badge">Built with Kiro</span>
        </p>
        <h1>⚗️ Alloy Alchemist</h1>
        <p className="tagline">
          Mix a steel like ingredients in a cauldron — and watch the app predict its microstructure,
          hardness, and heat treatment. Medieval alchemy, 1960s metallurgy equations, and an AI tutor
          walk into one app.
        </p>
      </header>

      <main className="layout">
        <div className="col">
          <CompositionMixer
            composition={composition}
            activePresetId={activePresetId}
            onCompositionChange={handleCompositionChange}
            onPreset={applyPreset}
            onRecipe={applyRecipe}
          />
          <PhaseDiagram carbon={composition.C} temperature={temperature} onTemperatureChange={setTemperature} />
        </div>
        <div className="col">
          <ResultsPanel analysis={analysis} />
          <MicrostructureViewer prediction={analysis.microstructure} />
          <TutorPanel notes={notes} />
        </div>
      </main>

      <footer className="footer">
        <p>
          <strong>Educational estimates.</strong> All predictions come from established empirical models
          (IIW carbon equivalent, Andrews Ms and Ac3 equations, the hardness-vs-carbon curve) and a
          simplified Fe–C diagram. They are for learning, not a substitute for datasheets, standards,
          or laboratory testing.
        </p>
        <p className="muted small">
          Alloy Alchemist — Kiroween 2026 (Frankenstein). Built spec-first with Kiro: specs, steering,
          and hooks live in the <code>/.kiro</code> directory of the repository.
        </p>
      </footer>
    </div>
  );
}
