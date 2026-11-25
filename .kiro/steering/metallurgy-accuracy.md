# Steering — Metallurgy Accuracy

These rules are non-negotiable. They exist because a teaching tool that states a wrong
number with confidence is worse than no tool at all.

## Approved models (only these)
- Carbon Equivalent (IIW): CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
- Martensite start, Andrews (1965): Ms (°C) = 539 − 423C − 30.4Mn − 17.7Ni − 12.1Cr − 7.5Mo
- Ac3, Andrews (1965): Ac3 (°C) = 910 − 203√C − 15.2Ni + 44.7Si + 104V + 31.5Mo + 13.1W − 30Mn − 11Cr − 20Cu + 700P + 400Al + 120As + 400Ti
- As-quenched hardness: standard hardness-vs-carbon curve, approximated as
  HRC ≈ 20 + 60√C, capped at ~65 HRC, always shown as a band (±5 HRC), never a single exact number.
- Fe–C diagram: simplified teaching version. A3 ≈ 912 − 240·C (C ≤ 0.77 wt%),
  Acm ≈ 727 + 313·(C − 0.77) (C > 0.77 wt%), eutectoid 727 °C at 0.77% C.
  The diagram must be labelled "simplified" in the UI.

## Rules
- Show hardness as a **band**, never as false precision.
- The Fe–C diagram and microstructure viewer are **schematic** — label them so in the UI.
- Austenitizing temperature is shown as Ac3 + 30 °C, stated as a starting guide, not a procedure.
- Stainless threshold: Cr ≥ 10.5 wt%. Austenitic stainless needs Cr ≥ 16 and Ni ≥ 8 wt%.
- Weldability guidance follows CE bands: ≤ 0.40 good, 0.40–0.60 preheat, > 0.60 full procedure.
- Every displayed number must be reproducible from the engine + its unit tests.
- The app footer carries the disclaimer: educational estimates, not a substitute for
  datasheets, standards, or laboratory testing.
