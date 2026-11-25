# Spec — Composition Mixer

## Requirements
- User can set C, Mn, Si, Cr, Ni, Mo, V, Cu in wt% via sliders with live values.
- Iron balance (100 − alloying) is displayed and updates live.
- Six steel-grade presets (1045, 4140, 4340, 316L, D2, 1018) fill the mixer in one click.
- Three "Transmute" recipes (Make it harder / Make it stainless / Make it weldable) jump to a preset.
- Changing any slider clears the active preset highlight.

## Design
- `src/components/CompositionMixer.tsx`, state owned by `App`.
- Sliders: range inputs, `accent-color` ember orange; each row shows symbol, name, value, and the element's role in one line.
- Presets as pill buttons; active preset highlighted.

## Tasks
- [x] Element definitions and ranges in `src/lib/metallurgy.ts` (`ELEMENTS`, `PRESETS`, `RECIPES`)
- [x] Mixer component with sliders, presets, recipes, iron balance
- [x] Wire to App state; slider edits clear the preset
