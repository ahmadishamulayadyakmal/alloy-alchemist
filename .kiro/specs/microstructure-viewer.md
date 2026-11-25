# Spec — Microstructure Viewer

## Requirements
- Schematic SVG rendering of the predicted phases (ferrite, pearlite, martensite,
  bainite, austenite, cementite), each with a distinct pattern and a legend with fractions.
- Toggle between "After quenching" and "Slow-cooled" states.
- Rendering is deterministic for a given prediction (seeded from the phase fractions).

## Design
- `src/components/MicrostructureViewer.tsx`.
- Seeded PRNG (mulberry32) so the same composition always draws the same picture.
- Clearly labelled "Schematic rendering — not a real micrograph" in the UI.

## Tasks
- [x] Seeded shape generator per phase type
- [x] SVG viewer with state toggle and legend
