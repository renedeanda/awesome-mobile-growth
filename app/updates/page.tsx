import type { Metadata } from "next";
import { FieldCards } from "@/components/FieldPages";
import { updates } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";
export const metadata: Metadata = pageMetadata({ title: "App Store and Google Play updates", description: "Decision-focused briefings on platform changes that materially affect mobile app launches, listings, creative, and measurement.", path: "/updates/" });
export default function UpdatesPage() { return <><header className="index-head"><p className="eyebrow">Platform changes</p><h1>Only the updates that change the work.</h1><p>Effective-now, announced, upcoming, and deprecated guidance—linked to primary sources and the evergreen pages it affects.</p></header><FieldCards entries={updates} base="/updates/"/></>; }
