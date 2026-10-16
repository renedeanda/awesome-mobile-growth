"use client";

import { useEffect, useState } from "react";

export type ChecklistGroup = { title: string; when?: string; items: Array<{ id: string; text: string; store?: "Apple" | "Google Play" }> };

const STORAGE_KEY = "amg-launch-checklist.v1";

// Ticks are kept in this browser only. The list renders fully without storage.
export function Checklist({ groups }: { groups: ChecklistGroup[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")); } catch { setDone({}); }
    setReady(true);
  }, []);

  const toggle = (id: string) => setDone((current) => {
    const next = { ...current, [id]: !current[id] };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage blocked: keep in memory */ }
    return next;
  });
  const reset = () => { setDone({}); try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } };

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const complete = groups.reduce((sum, group) => sum + group.items.filter((item) => done[item.id]).length, 0);

  return <div className="checklist" data-ready={ready}>
    <div className="checklist__progress" aria-live="polite">
      <span><strong>{complete}</strong> of {total} done</span>
      <span className="checklist__bar" aria-hidden="true"><i style={{ width: `${total ? (complete / total) * 100 : 0}%` }}/></span>
      <button type="button" className="text-button" onClick={reset}>Reset</button>
    </div>
    {groups.map((group) => <section key={group.title} className="checklist__group">
      <h3>{group.title}{group.when && <small>{group.when}</small>}</h3>
      <ul>{group.items.map((item) => <li key={item.id}>
        <label><input type="checkbox" checked={Boolean(done[item.id])} onChange={() => toggle(item.id)}/><span>{item.text}{item.store && <em>{item.store}</em>}</span></label>
      </li>)}</ul>
    </section>)}
    <p className="table-source">Your ticks are saved in this browser only.</p>
  </div>;
}
