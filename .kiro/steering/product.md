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
- Warm light theme: parchment background, warm-white cards, terracotta and amber
  accents, muted steel blue for data. Editorial serif for display headings, system
  sans for UI, monospace for numbers and element symbols.
- One spacing scale, one soft warm shadow, one radius. Generous whitespace; the
  hierarchy comes from type size and weight, not from decoration.
- Motion is meaningful, never noise: sections reveal once on scroll, numbers ease
  to their new value, bars and diagram markers glide, hover lifts cards and chips.
  Every animation is disabled under `prefers-reduced-motion`.
- No game HUD, scores, levels, or "PRESS START" — this is a teaching tool, not a game.

## Scope guardrails
- Client-side only. No backend, no accounts, no database.
- Never present an estimate as a measured value or a datasheet figure.
- Never invent a formula, a standard, or a citation. If a number cannot be traced to a
  named empirical model in `src/lib/metallurgy.ts`, it does not ship.
