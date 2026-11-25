# Spec — AI Tutor

## Requirements
- Explains the current result: Ms temperature, carbon equivalent / weldability,
  hardness, each alloying element's role, and why tempering matters.
- Explanations are generated from the computed numbers — the tutor can never invent
  a formula or a value.
- A static FAQ covers concepts that do not depend on the composition (martensite,
  stainless mechanism, hardness vs hardenability, pearlite).

## Design
- `buildTutorNotes(comp, analysis)` in the engine returns `{title, body}` notes.
- `TUTOR_FAQ` holds the composition-independent answers.
- `src/components/TutorPanel.tsx` renders both as collapsible `<details>` blocks.

## Tasks
- [x] `buildTutorNotes` + `TUTOR_FAQ` in the engine
- [x] Tutor panel with collapsible notes
- [ ] Stretch: LLM-backed free chat (only if P0 is complete and time remains)
