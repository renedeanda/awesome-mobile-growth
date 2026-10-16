import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "You’re offline", robots: { index: false, follow: false } };

export default function Offline() {
  return <header className="index-head">
    <p className="eyebrow">Offline</p>
    <h1>You’re offline.</h1>
    <p>This page hasn’t been saved on this device yet. Pages you have opened before still work without a connection, and so do the <Link href="/launch/checklist/">launch checklist</Link>, the <Link href="/workbench/">Workbench</Link> and the <Link href="/screenshot-sizes/">screenshot sizes</Link>.</p>
  </header>;
}
