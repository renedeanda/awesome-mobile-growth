import type { Metadata } from "next";
import { PodcastExplorer } from "@/components/PodcastExplorer";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Best mobile growth podcasts", description: "An actively reviewed guide to thoughtful podcasts about ASO, subscriptions, app marketing, acquisition, and mobile product growth.", path: "/podcasts/" });

export default function PodcastsPage() { return <>
  <header className="index-head"><p className="eyebrow">Listen with a notebook</p><h1>Mobile growth podcasts worth your attention.</h1><p>A maintained listening shelf for app builders—not a directory. Start with a current problem, capture one decision, and verify any platform claim before changing the product.</p></header>
  <section className="section compact-section"><div className="editorial-note"><strong>Selection rule</strong><p>Ongoing shows need a recent, useful episode when reviewed. A seasonal show can remain when its archive still earns attention. Inclusion is editorial and unpaid; reported results belong to the guest and are not universal benchmarks.</p></div></section>
  <section className="section"><PodcastExplorer /></section>
  </>; }
