import type { Metadata } from "next";
import { FieldCards } from "@/components/FieldPages";
import { referenceEntries } from "@/lib/fieldLab";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "App Store and Google Play metrics reference", description: "Exact definitions, formulas, limits, common misreads, and primary sources for the store metrics and fields mobile teams use.", path: "/reference/" });

export default function ReferencePage() { return <><header className="index-head"><p className="eyebrow">Metrics & fields</p><h1>Ordinary words. Exact platform meanings.</h1><p>Short, sourced references for the terms that shape store decisions. Each entry explains what the platform counts, what people commonly misread, and what the number can actually help you decide.</p></header><FieldCards entries={referenceEntries} base="/reference/"/></>; }
