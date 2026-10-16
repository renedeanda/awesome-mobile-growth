// A static App Store search result built from the site's example app, with the limits each field must fit.
const fields = [
  { label: "Name", value: "Northstar: Habit Tracker", limit: 30 },
  { label: "Subtitle", value: "Build routines in 2 minutes", limit: 30 },
];
const shots = ["Build routines in 2 minutes a day", "Check off habits with one tap", "See how habits affect your mood"];

export function HeroSystem() {
  return <figure className="hero-preview" aria-label="Example App Store search result">
    <div className="hero-preview__phone">
      <div className="hero-preview__search"><span aria-hidden="true">⌕</span> habit tracker</div>
      <div className="hero-preview__result">
        <span className="hero-preview__icon" aria-hidden="true">N</span>
        <div><strong>{fields[0].value}</strong><span>{fields[1].value}</span><small>★★★★★ 4.8 · 2.1K</small></div>
        <span className="hero-preview__get">Get</span>
      </div>
      <div className="hero-preview__shots">{shots.map((caption, index) => <div key={caption} className={`hero-preview__shot hero-preview__shot--${index + 1}`}><p>{caption}</p><i aria-hidden="true"/><i aria-hidden="true"/><i aria-hidden="true"/></div>)}</div>
    </div>
    <figcaption className="hero-preview__fields">
      {fields.map((field) => <span key={field.label}><b>{field.label}</b> {field.value.length}/{field.limit}</span>)}
      <span><b>First 3 screenshots</b> shown in search</span>
      <em>Example app</em>
    </figcaption>
  </figure>;
}
