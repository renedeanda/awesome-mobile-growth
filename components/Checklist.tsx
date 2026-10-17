"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { countdownLabel, isIsoDate, localToday, schedule, toIcs } from "@/lib/countdown";
import { formatDate } from "@/lib/site";

export type ChecklistGroup = { title: string; when?: string; startDaysBefore?: number; items: Array<{ id: string; text: string; store?: "Apple" | "Google Play" }> };

const STORAGE_KEY = "amg-launch-checklist.v1";
const DATE_KEY = "amg-launch-date.v1";

const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, value: string | null) => { try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); } catch { /* storage blocked: keep in memory */ } };

// Ticks and the launch date are kept in this browser only. The list renders fully without storage.
export function Checklist({ groups }: { groups: ChecklistGroup[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [launch, setLaunch] = useState("");
  const [today, setToday] = useState("");
  const [ready, setReady] = useState(false);
  // Announces a phase the moment its last box is ticked; nothing about it is stored.
  const [finished, setFinished] = useState("");

  useEffect(() => {
    try { setDone(JSON.parse(read(STORAGE_KEY) ?? "{}")); } catch { setDone({}); }
    const saved = read(DATE_KEY);
    if (saved && isIsoDate(saved)) setLaunch(saved);
    setToday(localToday());
    setReady(true);
  }, []);

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    write(STORAGE_KEY, JSON.stringify(next));
    setDone(next);
    const group = groups.find((candidate) => candidate.items.some((item) => item.id === id));
    setFinished(next[id] && group?.items.every((item) => next[item.id]) ? group.title : "");
  };
  const reset = () => { setDone({}); write(STORAGE_KEY, null); };
  const changeLaunch = (value: string) => { setLaunch(value); write(DATE_KEY, isIsoDate(value) ? value : null); };

  const phases = groups.filter((group) => group.startDaysBefore !== undefined).map((group) => ({ title: group.title, startDaysBefore: group.startDaysBefore! }));
  const dated = launch && today && isIsoDate(launch) ? schedule(phases, launch, today) : [];
  const phaseFor = (title: string) => dated.find((phase) => phase.title === title);
  const downloadCalendar = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([toIcs(phases, launch)], { type: "text/calendar" }));
    a.download = "launch-checklist.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const complete = groups.reduce((sum, group) => sum + group.items.filter((item) => done[item.id]).length, 0);

  return <div className="checklist" data-ready={ready}>
    {phases.length > 0 && <div className="countdown">
      <label className="field"><span className="field-label">Launch date</span><input type="date" value={launch} onChange={(event) => changeLaunch(event.target.value)}/></label>
      {dated.length > 0 && <p className="countdown__label" aria-live="polite"><strong>{countdownLabel(launch, today)}</strong>{dated.some((phase) => phase.current) && <> · now: {dated.filter((phase) => phase.current).map((phase) => phase.title).join(" and ")}</>}</p>}
      {dated.length > 0 && <button type="button" className="text-button" onClick={downloadCalendar}>Add phases to calendar (.ics)</button>}
    </div>}
    <div className="checklist__progress" aria-live="polite">
      <span><strong>{complete}</strong> of {total} done</span>
      <span className="checklist__bar" aria-hidden="true"><i style={{ width: `${total ? (complete / total) * 100 : 0}%` }}/></span>
      <button type="button" className="text-button" onClick={reset}>Reset</button>
    </div>
    {groups.map((group) => {
      const phase = phaseFor(group.title);
      const groupDone = group.items.every((item) => done[item.id]);
      return <section key={group.title} className={`checklist__group${phase?.current ? " checklist__group--current" : ""}${groupDone ? " checklist__group--done" : ""}${finished === group.title ? " checklist__group--just-done" : ""}`}>
        <h3>{groupDone && <span className="checklist__check" aria-hidden="true">✓</span>}{group.title}{group.when && <small>{group.when}{phase && <> · {phase.upcoming ? "starts" : "started"} {formatDate(phase.start)}</>}{phase?.current && <span className="checklist__now">Now</span>}</small>}</h3>
        <ul>{group.items.map((item) => <li key={item.id}>
          <label><input type="checkbox" checked={Boolean(done[item.id])} onChange={() => toggle(item.id)}/><span>{item.text}{item.store && <em>{item.store}</em>}</span></label>
        </li>)}</ul>
      </section>;
    })}
    <p className="sr-only" aria-live="polite">{finished ? `${finished}: phase done.` : ""}</p>
    {total > 0 && complete === total && <aside className="checklist__ready" aria-label="Ready to submit">
      <p className="eyebrow">All {total} done</p>
      <h3>Ready to submit.</h3>
      <p>Run one last pass on the review requirements, then look at your listing the way a searcher will.</p>
      <div className="checklist__ready-links"><Link className="button" href="/launch/requirements/">Review requirements</Link><Link className="button-secondary" href="/workbench/">Preview the store page</Link></div>
    </aside>}
    <p className="table-source">Your ticks and launch date are saved in this browser only.</p>
  </div>;
}
