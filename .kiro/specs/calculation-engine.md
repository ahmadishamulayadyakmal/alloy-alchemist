# Spec — Calculation Engine

## Requirements
- Single source of truth: `src/lib/metallurgy.ts`, pure functions, no UI imports.
- Computes: iron balance, carbon equivalent (IIW), Ms (Andrews), Ac3 (Andrews),
  as-quenched hardness band, annealed + quenched microstructure prediction,
  heat-treatment recommendation (austenitizing, quench medium, tempering, weldability).
- Recognizes stainless families (austenitic / martensitic / ferritic) by Cr and Ni thresholds.
- Every formula has a unit test with a hand-checked expected value.

## Design
- `analyze(comp)` returns one `Analysis` object consumed by all UI components.
- Microstructure rules are transparent `if/else` on C% and CE — no hidden magic numbers;
  thresholds reference the steering file.
- Hardness is a band (`{low, typical, high}`), never a single exact number.

## Tasks
- [x] Engine with CE, Ms, Ac3, hardness band, microstructure, heat treatment
- [x] Presets and recipes data
- [x] 21 unit tests in `src/lib/metallurgy.test.ts` (CE, Ms, Ac3, hardness, phases, end-to-end)
- [x] `npm test` passes
