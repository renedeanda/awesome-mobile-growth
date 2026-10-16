import type { Metadata } from "next";
import { PodcastExplorer } from "@/components/PodcastExplorer";
import { podcasts } from "@/lib/podcasts";
import { formatDate, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Mobile growth podcasts worth your time", description: "A short, maintained list of podcasts about app launches, ASO, subscriptions, user acquisition and mobile growth, with the episodes to start with.", path: "/learn/podcasts/", imagePath: "/learn/opengraph-image" });

const lastChecked = podcasts.map((podcast) => podcast.latestChecked).sort().at(-1) ?? "";

export default function PodcastsPage() {
  return <>
    <header className="index-head"><p className="eyebrow">Learn · Podcasts</p><h1>Mobile growth podcasts worth your time.</h1><p>{podcasts.length} shows about launches, subscriptions, ASO and user acquisition, each with the episodes to start with. Filter by topic, listen with a question in mind, and check any platform claim before you act on it.</p></header>
    <section className="section compact-section"><div className="editorial-note"><strong>How shows are chosen</strong><p>A show stays on the list if it has published a useful episode recently or its archive still earns a listen. Inclusion is unpaid. Results mentioned by guests are their own, not benchmarks. Last checked {formatDate(lastChecked)}.</p></div></section>
    <section className="section"><PodcastExplorer/></section>
  </>;
}
