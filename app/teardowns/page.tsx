import type { Metadata } from "next";
import { FieldCards } from "@/components/FieldPages";
import { teardownEntries } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export const metadata: Metadata = pageMetadata({ title: "App Store listing teardowns", description: "Public-evidence app listing analyses that separate observable facts, interpretations, unknowns, and testable ideas.", path: "/teardowns/" });
export default function TeardownsPage() { return <><header className="index-head"><p className="eyebrow">Public listing anatomy</p><h1>Observe carefully. Infer modestly.</h1><p>These are dated analyses of public store and web surfaces—not private audits, rankings, or claims about what caused an app to grow.</p></header><div className="editorial-note"><p className="micro-label">Method</p><p>Every teardown separates what anyone can observe from interpretation, missing information, and a hypothesis another team could test. Trademarks belong to their owners.</p></div><FieldCards entries={teardownEntries} base="/teardowns/"/></>; }
