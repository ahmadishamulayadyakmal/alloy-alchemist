# Spec — Fe–C Phase Diagram

## Requirements
- Simplified SVG Fe–C diagram for steels (0–2.0 wt% C, 500–1600 °C).
- Draws the A3 line, Acm line, and the 727 °C eutectoid line; labels the eutectoid point.
- A temperature slider (500–1500 °C) moves a marker; the composition's C% draws a vertical marker.
- The phase region at (C, T) is named in plain text under the diagram.

## Design
- `src/components/PhaseDiagram.tsx`, pure SVG (no chart library).
- Region logic in `phaseAt(c, temp)` in the engine — the diagram never computes phases itself.
- Boundaries are straight-line teaching approximations; the UI labels the diagram "simplified".

## Tasks
- [x] `a3Line`, `acmLine`, `phaseAt` in the engine, with unit tests
- [x] SVG diagram with axes, boundaries, region labels, live marker
- [x] Temperature slider wired to App state
