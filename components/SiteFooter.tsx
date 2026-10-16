import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer__about">
      <p className="brand-line">Built and edited by René DeAnda.</p>
      <p>Independent and unpaid. Store rules link to Apple and Google; opinions are labeled.</p>
      <p className="also-by">Also by the author: <a href="https://www.productbuilder.net/">Product Builder</a>, a guide to AI tools, models and coding agents for people building products.</p>
    </div>
    <nav aria-label="Footer">
      <Link href="/launch/">Launch</Link>
      <Link href="/store-page/">Store page</Link>
      <Link href="/grow/">Grow</Link>
      <Link href="/tools/">Tools</Link>
      <Link href="/changes/">Changes</Link>
      <Link href="/learn/">Learn</Link>
      <Link href="/about/">About</Link>
      <Link href="/privacy/">Privacy</Link>
      <a href="/feed.xml">RSS</a>
      <a href="https://github.com/renedeanda/awesome-mobile-growth">GitHub</a>
    </nav>
  </footer>;
}
