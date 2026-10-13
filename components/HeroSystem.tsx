const steps = [
  { n: "01", question: "What are they trying to find?", label: "Intent", example: "A private journal that works offline" },
  { n: "02", question: "What can the app honestly promise?", label: "Promise", example: "Write anywhere. Keep it yours." },
  { n: "03", question: "What proves it in one glance?", label: "Proof", example: "Real UI, legible copy, visible privacy" },
  { n: "04", question: "Did the right people stay?", label: "Learning", example: "Read conversion with activation and retention" },
];
export function HeroSystem() { return <div className="hero-system" aria-label="Four questions for a useful store page"><div className="hero-system__line" aria-hidden="true"/>{steps.map((step) => <section key={step.n} className="hero-system__step"><span className="hero-system__number">{step.n}</span><div><p>{step.label}</p><h2>{step.question}</h2><span>{step.example}</span></div></section>)}</div>; }
