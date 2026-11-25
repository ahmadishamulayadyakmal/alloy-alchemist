# Steering — Tech

## Stack
- Vite + React 19 + TypeScript (strict). No backend.
- Plain CSS in `src/index.css` (no CSS framework — keeps the bundle small and the theme exact).
- Vitest for unit tests. `npm test` must pass before any commit.
- Deploy target: Vercel (static build output from `npm run build`).

## Conventions
- All metallurgy math lives in `src/lib/metallurgy.ts` and nowhere else. UI components
  never compute formulas inline — they call the engine and render results.
- Every formula in the engine has at least one unit test in `src/lib/metallurgy.test.ts`
  with a hand-checked expected value.
- Type-only imports use `import type` (verbatimModuleSyntax is on).
- English identifiers and comments. Units: wt% for composition, °C for temperature, HRC for hardness.
- Keep the repo self-contained: `/.kiro` is committed and never added to `.gitignore`.
