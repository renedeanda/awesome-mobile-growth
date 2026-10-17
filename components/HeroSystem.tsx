// A static App Store search result built from the site's example app, with the limits each field must fit.
export const heroFields = [
  { label: "Name", value: "Rollbook: Film Photo Log", limit: 30 },
  { label: "Subtitle", value: "Exposure notes for every roll", limit: 30 },
];
export const heroShots = ["Know what worked on every roll", "Log each frame in one tap", "Meter light with your phone camera"];

export function HeroSystem() {
  return <figure className="hero-preview" aria-label="Example App Store search result">
    <div className="hero-preview__phone">
      <div className="hero-preview__search"><span aria-hidden="true">⌕</span> film camera</div>
      <div className="hero-preview__result">
        <span className="hero-preview__icon" aria-hidden="true">R</span>
        <div><strong>{heroFields[0].value}</strong><span>{heroFields[1].value}</span><small>★★★★★ 4.8 · 2.1K</small></div>
        <span className="hero-preview__get">Get</span>
      </div>
      <div className="hero-preview__shots">{heroShots.map((caption, index) => <div key={caption} className={`hero-preview__shot hero-preview__shot--${index + 1}`}><p>{caption}</p><i aria-hidden="true"/><i aria-hidden="true"/><i aria-hidden="true"/></div>)}</div>
    </div>
    <figcaption className="hero-preview__fields">
      {heroFields.map((field) => <span key={field.label}><b>{field.label}</b> {field.value.length}/{field.limit}</span>)}
      <span><b>First 3 screenshots</b> shown in search</span>
      <em>Example app</em>
    </figcaption>
  </figure>;
}
