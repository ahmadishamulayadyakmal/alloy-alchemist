# Alloy Alchemist ⚗️

Mix a steel like ingredients in a cauldron — and watch the app predict its microstructure,
estimated hardness, and recommended heat treatment. Medieval alchemy, 1960s metallurgy
equations, and an AI tutor walk into one app.

**Kiroween 2026 — Frankenstein category.** Built spec-first with Kiro (specs, steering,
and hooks live in `/.kiro`).

## What it does

- **Composition mixer** — sliders for C, Mn, Si, Cr, Ni, Mo, V, Cu, with real steel-grade
  presets (1045, 4140, 4340, 316L, D2, 1018) and one-click "Transmute" recipes.
- **Calculation engine** — carbon equivalent (IIW), Ms and Ac3 (Andrews 1965), as-quenched
  hardness band, microstructure prediction, and heat-treatment recommendation.
- **Interactive Fe–C diagram** — simplified teaching diagram with a live composition point
  and temperature slider.
- **Microstructure viewer** — schematic rendering of the predicted phases, quenched vs annealed.
- **AI tutor** — explanations generated from your numbers; it can never invent a formula.

## Run it

```bash
npm install
npm run dev      # local dev server
npm test         # 21 unit tests for the calculation engine
npm run build    # production build in dist/
```

## Formulas used

- Carbon Equivalent (IIW): CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
- Ms, Andrews (1965): Ms (°C) = 539 − 423C − 30.4Mn − 17.7Ni − 12.1Cr − 7.5Mo
- Ac3, Andrews (1965): Ac3 (°C) = 910 − 203√C − 15.2Ni + 44.7Si + 104V + 31.5Mo + 13.1W − 30Mn − 11Cr − 20Cu + 700P + 400Al + 120As + 400Ti
- Hardness: standard hardness-vs-carbon curve, HRC ≈ 20 + 60√C, capped ~65 HRC, shown as a band.

## How Kiro was used

- **Specs** — one spec per module in `.kiro/specs/` (mixer, calculation engine, Fe–C diagram,
  microstructure viewer, tutor), written before the code.
- **Steering** — `.kiro/steering/` enforces product tone, tech conventions, and metallurgy
  accuracy rules (approved models only, hardness as a band, diagrams labelled simplified).
- **Hooks** — formula unit tests run on every change; the engine is the single source of truth.

## Disclaimer

All predictions are **educational estimates** from empirical models, not a substitute for
datasheets, standards, or laboratory testing.

## License

MIT — see [LICENSE](LICENSE).
