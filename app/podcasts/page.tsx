import type { Metadata } from "next";
import { PodcastExplorer } from "@/components/PodcastExplorer";

export const metadata: Metadata = { title: "Best mobile growth podcasts", description: "An actively reviewed guide to thoughtful podcasts about ASO, subscriptions, app marketing, acquisition, and mobile product growth.", alternates: { canonical: "/podcasts/" } };

export default function PodcastsPage() { return <>
  <header className="index-head"><p className="eyebrow">Listen with a notebook</p><h1>Mobile growth podcasts worth your attention.</h1><p>A small, actively reviewed collection for app builders. Ongoing shows need recent episodes; an exceptional seasonal show needs a durable archive. Every selection should help someone make better mobile decisions.</p></header>
  <section className="section compact-section"><div className="editorial-note"><strong>Selection rule</strong><p>Ongoing shows published within roughly 120 days when reviewed on October 11, 2026. A clearly labeled seasonal show may stay when its archive remains unusually useful. Inclusion is editorial, unpaid, and never guaranteed.</p></div></section>
  <section className="section"><PodcastExplorer /></section>
  </>; }
