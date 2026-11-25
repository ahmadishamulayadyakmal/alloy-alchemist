# Steering — Product

## What Alloy Alchemist is
An interactive web app that teaches physical metallurgy by letting users mix a steel
composition and instantly see the predicted microstructure, estimated hardness, and
recommended heat treatment — with an AI tutor explaining the "why".

## Audience
Engineering and materials-science students learning physical metallurgy, and anyone
curious about what happens inside a heat-treatment furnace.

## Tone and language
- All UI text, labels, and narration in **English**.
- Plain language first, technical term second — never the reverse.
- Honest about uncertainty: predictions are **educational estimates**, always labelled as such.

## Visual direction
- Alchemist-lab dark theme: charcoal panels, ember-orange accents, steel blue for data.
- Retro-pixel touches (hard shadows, chunky borders), but diagrams stay technically accurate.
- No game HUD, scores, levels, or "PRESS START" — this is a teaching tool, not a game.

## Scope guardrails
- Client-side only. No backend, no accounts, no database.
- Never present an estimate as a measured value or a datasheet figure.
- Never invent a formula, a standard, or a citation. If a number cannot be traced to a
  named empirical model in `src/lib/metallurgy.ts`, it does not ship.
