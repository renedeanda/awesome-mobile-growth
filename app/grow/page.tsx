import type { Metadata } from "next";
import Link from "next/link";
import { SectionHub } from "@/components/SectionHub";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Grow your app after the install", description: "Onboarding, subscriptions, ratings, web-to-app funnels, paid and organic, App Store Connect analytics and choosing growth tools.", path: "/grow/", imagePath: "/grow/opengraph-image", imageAlt: "Growth guides for mobile apps" });

const stages = [
  ["Discover", "Do the right people see the app?"],
  ["Decide", "Do they install after looking?"],
  ["Activate", "Do they reach the first useful moment?"],
  ["Pay", "Do they pay, if you charge?"],
  ["Retain", "Do they come back?"],
  ["Refer", "Do they rate, review and share?"],
] as const;

export default function GrowHub() {
  return <SectionHub section="grow" eyebrow="Grow" title="Grow after the install." intro="A store page gets the install. These guides cover what happens next: the first minute in the app, the paywall, ratings, the funnel from the web, and the numbers that connect them.">
    <section className="hub-panel" aria-labelledby="stages-heading">
      <h2 id="stages-heading">Find the stage that's holding you back</h2>
      <ol className="timeline">{stages.map(([stage, question]) => <li key={stage}><strong>{stage}</strong><span>{question}</span></li>)}</ol>
      <p><Link className="text-link" href="/grow/growth-loop/">Pick one metric for each stage →</Link></p>
    </section>
  </SectionHub>;
}
