"use client";

import { appleInAppEventBadges } from "@/lib/storeSpecs";
import { LIMITS, type ListingFields, warnings } from "@/lib/workbench";

type EventKey = "appleEventReference" | "appleEventName" | "appleEventShort" | "appleEventLong";
const eventFields: Array<[EventKey, string, string]> = [
  ["appleEventReference", "Reference name", "Only you see this in App Store Connect."],
  ["appleEventName", "Event name", "Title case. Skip words like “event” or “challenge”: the badge says that."],
  ["appleEventShort", "Short description", "Shown on the event card. Sentence case."],
  ["appleEventLong", "Long description", "Shown on the event details page. No specific prices."],
];

/** Drafts an App Store in-app event against Apple's field limits, with an illustrative event card. */
export function EventDraft({ fields, badge, onField, onBadge }: { fields: ListingFields; badge: string; onField: (key: EventKey, value: string) => void; onBadge: (badge: string) => void }) {
  const flags = [...new Set(eventFields.flatMap(([key]) => warnings(fields[key])))];
  const priced = /[$€£¥]\s?\d|\d\s?(?:usd|eur|gbp)\b/i.test(`${fields.appleEventShort} ${fields.appleEventLong}`);
  return <div className="workbench-grid">
    <section className="fields" aria-label="In-app event fields">
      <label className="field"><span className="field-label">Badge</span><span className="field-help">Apple shows the event type on the card.</span>
        <select value={badge} onChange={(event) => onBadge(event.target.value)}>{appleInAppEventBadges.map((name) => <option key={name}>{name}</option>)}</select>
      </label>
      {eventFields.map(([key, label, help]) => {
        const value = fields[key], limit = LIMITS[key], over = value.length > limit;
        return <label className="field" key={key}><span className="field-label">{label}<small className={over ? "over" : ""}>{value.length}/{limit}</small></span><span className="field-help">{help}</span>
          {limit > 64 ? <textarea rows={3} value={value} onChange={(event) => onField(key, event.target.value)} aria-invalid={over}/> : <input value={value} onChange={(event) => onField(key, event.target.value)} aria-invalid={over}/>}
        </label>;
      })}
      {(flags.length > 0 || priced) && <ul className="event-flags" aria-label="Review notes">
        {priced && <li>Apple rejects in-app event metadata that includes specific prices.</li>}
        {flags.map((flag) => <li key={flag}>{flag}</li>)}
      </ul>}
    </section>
    <aside className="preview event-preview" aria-label="Illustrative event card">
      <p className="eyebrow">Illustrative event card</p>
      <div className="event-card">
        <div className="event-card__media" aria-hidden="true"/>
        <p className="event-card__badge">{badge.toUpperCase()}</p>
        <strong>{fields.appleEventName || "Event name"}</strong>
        <p>{fields.appleEventShort || "A short description of what's happening."}</p>
      </div>
      <p className="fine-print">Card media is 16:9 landscape; the details page uses 9:16 portrait. Check final art in App Store Connect.</p>
    </aside>
  </div>;
}
