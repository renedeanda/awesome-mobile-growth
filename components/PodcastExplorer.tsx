"use client";

import { useEffect, useMemo, useState } from "react";
import { podcasts, podcastTopics } from "@/lib/podcasts";

export function PodcastExplorer() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const results = useMemo(() => podcasts.filter((podcast) => {
    const haystack = `${podcast.name} ${podcast.publisher} ${podcast.description} ${podcast.bestFor} ${podcast.topics.join(" ")}`.toLowerCase();
    return (topic === "all" || podcast.topics.includes(topic)) && haystack.includes(query.trim().toLowerCase());
  }), [query, topic]);

  return <div className="podcast-explorer" data-ready={ready}>
    <div className="filter-bar" aria-label="Filter podcasts">
      <label><span>Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ASO, subscriptions, creative…" /></label>
      <label><span>Topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">All topics</option>{podcastTopics.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <p aria-live="polite">{results.length} of {podcasts.length}</p>
    </div>
    <div className="podcast-grid">
      {results.map((podcast) => <article className="podcast-card" key={podcast.slug}>
        <p className="eyebrow">{podcast.publisher}</p><h2><a href={podcast.href}>{podcast.name} ↗</a></h2>
        <p>{podcast.description}</p><p><strong>Best for:</strong> {podcast.bestFor}</p><p className="fine-print">{podcast.cadenceNote} · checked {podcast.latestChecked}</p>
        {podcast.episodes?.length ? <div className="episode-picks"><h3>Start here</h3>{podcast.episodes.map(episode => <div key={episode.href}><a href={episode.href}><strong>{episode.title} ↗</strong></a><small>{episode.published}</small><p>{episode.why}</p></div>)}</div> : null}
        <div className="tag-row">{podcast.topics.map((item) => <span key={item}>{item}</span>)}</div>
      </article>)}
    </div>
    {!results.length && <div className="empty-state"><h2>No exact match.</h2><p>Try a broader term or select all topics.</p></div>}
  </div>;
}
