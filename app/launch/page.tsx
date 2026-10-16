import type { Metadata } from "next";
import Link from "next/link";
import { SectionHub } from "@/components/SectionHub";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Launch an app on the App Store and Google Play", description: "Step-by-step launch guides for iPhone, iPad, Mac and Android: store records, required screenshots, review, release and the first two weeks.", path: "/launch/", imagePath: "/launch/opengraph-image", imageAlt: "Launch guides for iPhone, iPad, Mac and Google Play" });

export default function LaunchHub() {
  return <SectionHub section="launch" eyebrow="Launch" title="Ship your app without launch-week surprises." intro="Pick your platform. Each guide covers the store record, the required screenshot sizes, testing, review and what to watch in the first two weeks, with links to Apple and Google's own pages.">
    <section className="hub-panel" aria-labelledby="launch-timeline">
      <h2 id="launch-timeline">Start three weeks out</h2>
      <ol className="timeline">
        <li><strong>3 weeks</strong><span>Create the store records. New Google Play personal accounts need a 14-day closed test with 12 testers before Production unlocks.</span></li>
        <li><strong>2 weeks</strong><span>Answer privacy, data safety and rating questionnaires. Write the subtitle or short description first.</span></li>
        <li><strong>1 week</strong><span>Capture screenshots from the release build. Test purchases and a fresh install on real devices.</span></li>
        <li><strong>Launch</strong><span>Submit with clear review notes. Apple reviews 90% of submissions within 48 hours; approved apps can take up to 24 hours to appear.</span></li>
      </ol>
      <p><Link className="text-link" href="/launch/checklist/">Use the interactive launch checklist →</Link></p>
    </section>
  </SectionHub>;
}
