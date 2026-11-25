import { useMemo, useState } from 'react';
import { analyze, buildTutorNotes, EMPTY_COMPOSITION, PRESETS } from './lib/metallurgy';
import type { Composition, Preset } from './lib/metallurgy';
import CompositionMixer from './components/CompositionMixer';
import ResultsPanel from './components/ResultsPanel';
import PhaseDiagram from './components/PhaseDiagram';
import MicrostructureViewer from './components/MicrostructureViewer';
import TutorPanel from './components/TutorPanel';
import Reveal from './components/Reveal';

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
          <span className="badge"><span className="dot" aria-hidden="true" />Kiroween 2026</span>
          <span className="badge">Frankenstein</span>
          <span className="badge">Built with Kiro</span>
        </p>
        <h1>⚗️ Alloy <span className="ember-word">Alchemist</span></h1>
        <p className="tagline">
          Mix a steel like ingredients in a cauldron — and watch the app predict its microstructure,
          hardness, and heat treatment. Medieval alchemy, 1960s metallurgy equations, and an AI tutor
          walk into one app.
        </p>
        <div className="molten-bar" aria-hidden="true" />
      </header>

      <main className="layout">
        <div className="col">
          <Reveal>
            <CompositionMixer
              composition={composition}
              activePresetId={activePresetId}
              onCompositionChange={handleCompositionChange}
              onPreset={applyPreset}
              onRecipe={applyRecipe}
            />
          </Reveal>
          <Reveal delay={100}>
            <PhaseDiagram carbon={composition.C} temperature={temperature} onTemperatureChange={setTemperature} />
          </Reveal>
        </div>
        <div className="col">
          <Reveal>
            <ResultsPanel analysis={analysis} />
          </Reveal>
          <Reveal delay={100}>
            <MicrostructureViewer prediction={analysis.microstructure} />
          </Reveal>
          <Reveal delay={150}>
            <TutorPanel notes={notes} />
          </Reveal>
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
