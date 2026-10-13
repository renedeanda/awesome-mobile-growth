import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div><p className="brand-line">Built and edited by René DeAnda.</p><p>Independent, practical, and allergic to fake certainty.</p></div>
    <nav aria-label="Footer">
      <Link href="/about/">About</Link>
      <Link href="/apple-platforms/">Launch guides</Link>
      <Link href="/google-play/">Google Play</Link>
      <Link href="/growth/">Growth</Link>
      <Link href="/tools/">Tools</Link>
      <Link href="/ai/">AI skills</Link>
      <Link href="/reference/">Reference</Link>
      <Link href="/updates/">Updates</Link>
      <Link href="/podcasts/">Podcasts</Link>
      <Link href="/privacy/">Privacy</Link>
      <Link href="/feed.xml">Feed</Link>
      <a href="https://github.com/renedeanda/awesome-mobile-growth">GitHub</a>
    </nav>
  </footer>;
}
