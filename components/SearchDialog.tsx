"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { search, type SearchEntry } from "@/lib/search";

let indexRequest: Promise<SearchEntry[]> | undefined;
export const loadIndex = () => indexRequest ??= fetch("/search-index.json").then((response) => response.ok ? response.json() : Promise.reject(new Error(String(response.status)))).catch((error) => { indexRequest = undefined; throw error; });

export const openSearchEvent = "amg:open-search";

const typing = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

export function SearchDialog() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => index ? search(index, query) : [], [index, query]);

  const open = (prefill?: string) => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    if (prefill !== undefined) setQuery(prefill);
    dialog.showModal();
    inputRef.current?.select();
    if (!index) loadIndex().then(setIndex, () => setFailed(true));
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing(event.target))) { event.preventDefault(); open(); }
    };
    // Other components (the 404 page) open search with a query: dispatch openSearchEvent with the query as detail.
    const onRequest = (event: Event) => open((event as CustomEvent<string | undefined>).detail);
    document.addEventListener("keydown", onKey);
    document.addEventListener(openSearchEvent, onRequest);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener(openSearchEvent, onRequest); };
  });

  useEffect(() => setActive(0), [query]);

  const go = (entry: SearchEntry) => { close(); router.push(entry.path); };
  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    else if (event.key === "Enter" && results[active]) { event.preventDefault(); go(results[active]); }
  };

  return <>
    <button type="button" className="search-toggle" onClick={() => open()} aria-haspopup="dialog" aria-label="Search the site">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM16 16l5 5"/></svg>
      <span className="search-toggle__label" aria-hidden="true">Search</span><kbd aria-hidden="true">⌘K</kbd>
    </button>
    <dialog ref={dialogRef} className="search-dialog" aria-label="Site search" onClick={(event) => { if (event.target === dialogRef.current) close(); }}>
      <div className="search-dialog__panel">
        <div className="search-dialog__bar">
          <input ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={onInputKey} placeholder="Search guides, sizes, metrics, changes" aria-label="Search the site" aria-controls="search-results" aria-activedescendant={results[active] ? `search-result-${active}` : undefined} autoComplete="off" enterKeyHint="go"/>
          <button type="button" className="text-button" onClick={close}>Close</button>
        </div>
        <ul id="search-results" className="search-results" role="listbox" aria-label="Results">
          {results.map((entry, position) => <li key={entry.path} id={`search-result-${position}`} role="option" aria-selected={position === active}>
            <Link href={entry.path} onClick={close} onMouseEnter={() => setActive(position)}><small>{entry.kind}</small><strong>{entry.title}</strong><span>{entry.summary}</span></Link>
          </li>)}
        </ul>
        <p className="search-dialog__status" role="status">{failed ? "Search couldn’t load. Check your connection and try again." : !index ? "Loading…" : query.trim() && !results.length ? `Nothing matches “${query.trim()}”. Try fewer words.` : !query.trim() ? "Try “keywords”, “iPhone Duo” or “conversion rate”." : ""}</p>
      </div>
    </dialog>
  </>;
}
