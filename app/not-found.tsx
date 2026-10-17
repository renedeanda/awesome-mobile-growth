import type { Metadata } from "next";
import { NotFoundSuggestions } from "@/components/NotFoundSuggestions";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return <header className="index-head">
    <p className="eyebrow">404 · Off the map</p>
    <h1>That page didn’t make the release.</h1>
    <p>The link may be old or mistyped. These are the closest pages we have.</p>
    <NotFoundSuggestions/>
  </header>;
}
