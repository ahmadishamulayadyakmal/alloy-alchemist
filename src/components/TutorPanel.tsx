import type { TutorNote } from '../lib/metallurgy';
import { TUTOR_FAQ } from '../lib/metallurgy';

export default function TutorPanel({ notes }: { notes: TutorNote[] }) {
  return (
    <section className="card" aria-label="AI tutor">
      <h2><span className="step">5</span> Ask the Alchemist</h2>
      <p className="muted">
        Explanations generated from your numbers — every answer is derived from the computed results, never invented.
      </p>

      {notes.map((n) => (
        <details key={n.title} className="tutor-note">
          <summary>{n.title}</summary>
          <p>{n.body}</p>
        </details>
      ))}

      <h3>Always true, whatever you mix</h3>
      {TUTOR_FAQ.map((n) => (
        <details key={n.title} className="tutor-note">
          <summary>{n.title}</summary>
          <p>{n.body}</p>
        </details>
      ))}
    </section>
  );
}
