import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { CodeFile } from "@/components/CodeFile";
import { SkillViewer } from "@/components/SkillViewer";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ title: "App Store Growth skill for AI agents", description: "An open AI agent skill for App Store and Google Play listings: current limits, a review checklist and a validator, with rules against invented data.", path: "/tools/app-store-growth-skill/", imagePath: "/tools/opengraph-image", imageAlt: "App Store Growth skill for AI agents" });

const modes = [
  "Audit an existing listing without changing it",
  "Draft a full metadata set from your product facts",
  "Localize with a native-review step",
  "Turn product screens into a screenshot brief",
  "Plan a store test around a decision",
  "Check launch readiness and list blockers",
];

export default function SkillPage() {
  const source = fs.readFileSync(path.join(process.cwd(), "skills/app-store-growth/SKILL.md"), "utf8");
  return <article className="skill-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/tools/">Tools</Link><span aria-hidden="true">/</span><span>App Store Growth skill</span></nav>
    <header className="skill-hero">
      <div>
        <p className="eyebrow">Open skill · v1.0.0</p>
        <h1>Give an AI agent the store rules, not permission to guess.</h1>
        <p>A skill package for AI coding and writing agents that work on App Store and Google Play listings. It brings the current field limits, a review checklist and a validator script, and tells the agent what it must never invent or change on its own.</p>
        <div className="actions"><a className="button" href="/downloads/app-store-growth-v1.0.0.tgz" download>Download the package</a><a className="button-secondary" href="https://github.com/renedeanda/awesome-mobile-growth/tree/main/skills/app-store-growth">View on GitHub ↗</a></div>
      </div>
      <aside><p className="eyebrow">The agent will refuse to</p><ul><li>Invent search volume or rankings</li><li>Claim features you haven't listed</li><li>Publish to a store console without approval</li><li>Read private data it doesn't need</li><li>Hand back generic copy as final</li></ul></aside>
    </header>
    <section className="section skill-story"><div><p className="eyebrow">Six tasks</p><h2>It loads only what the task needs.</h2></div><ol>{modes.map((mode, index) => <li key={mode}><span>0{index + 1}</span>{mode}</li>)}</ol></section>
    <section className="section skill-install"><div><p className="eyebrow">Install</p><h2>Works with any agent that reads skill folders.</h2><p>Extract the package into your agent's skills directory, or copy the folder from GitHub. It includes the main skill file, focused references, a local listing validator and a review report template.</p></div><CodeFile label="Terminal" shell text={"tar -xzf app-store-growth-v1.0.0.tgz\npython3 app-store-growth/scripts/validate_listing.py listing.json"}/></section>
    <SkillViewer source={source}/>
    <section className="section"><p className="eyebrow">You stay in charge</p><h2>Read it, change it, and approve every store change.</h2><p className="wide-copy">The skill starts read-only, asks before any live store change, and never makes up metrics. For the prompts it is built around, see <Link href="/learn/ai-for-aso/">Use AI for App Store Optimization</Link>.</p><p className="also-by">Also by the author: <a href="https://www.productbuilder.net/learn/agent-skills/">Agent skills, explained</a> on Product Builder.</p></section>
  </article>;
}
