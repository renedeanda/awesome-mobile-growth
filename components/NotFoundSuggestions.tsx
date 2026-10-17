"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { searchableQuery, suggestPages, wordsFromPath } from "@/lib/notFound";
import type { SearchEntry } from "@/lib/search";
import { loadIndex, openSearchEvent } from "./SearchDialog";

/** Reads the broken URL and offers the closest pages, plus search already filled in with its words. */
export function NotFoundSuggestions() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchEntry[] | null>(null);
  useEffect(() => {
    const words = wordsFromPath(location.pathname);
    setQuery(words.join(" "));
    if (!words.length) { setSuggestions([]); return; }
    loadIndex().then((index) => { setSuggestions(suggestPages(index, location.pathname)); setQuery(searchableQuery(index, location.pathname)); }, () => setSuggestions([]));
  }, []);

  return <section className="not-found" aria-label="Pages you might have meant" data-ready={suggestions ? "" : undefined}>
    {suggestions && suggestions.length > 0 && <>
      <h2>Did you mean</h2>
      <ul className="not-found__list">
        {suggestions.map((entry) => <li key={entry.path}>
          <Link href={entry.path}><small>{entry.kind}</small><span>{entry.title}</span></Link>
        </li>)}
      </ul>
    </>}
    <div className="actions">
      <button type="button" className="button" onClick={() => document.dispatchEvent(new CustomEvent(openSearchEvent, { detail: query }))}>Search{query ? ` for “${query}”` : " the site"}</button>
      <Link className="button-secondary" href="/">Return home</Link>
    </div>
  </section>;
}
