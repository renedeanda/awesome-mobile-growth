"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tools } from "@/lib/tools";
import { SearchDialog } from "./SearchDialog";

type NavLink = { href: string; label: string; note?: string };
type NavGroup = { title: string; links: NavLink[] };

const desktopLinks: NavLink[] = [
  { href: "/launch/", label: "Launch" },
  { href: "/store-page/", label: "Store page" },
  { href: "/grow/", label: "Grow" },
  { href: "/tools/", label: "Tools" },
  { href: "/changes/", label: "Changes" },
  { href: "/learn/", label: "Learn" },
];

const groups: NavGroup[] = [
  { title: "Launch", links: [
    { href: "/launch/iphone/", label: "iPhone" },
    { href: "/launch/ipad/", label: "iPad" },
    { href: "/launch/mac/", label: "Mac App Store" },
    { href: "/launch/google-play/", label: "Google Play" },
    { href: "/launch/checklist/", label: "Launch checklist" },
  ]},
  { title: "Store page", links: [
    { href: "/store-page/metadata/", label: "Name, subtitle and description" },
    { href: "/store-page/keywords/", label: "Keywords" },
    { href: "/store-page/screenshots/", label: "Screenshots" },
    { href: "/screenshot-sizes/", label: "Screenshot sizes by device" },
    { href: "/store-page/creative-assets/", label: "Headers and search assets" },
    { href: "/store-page/localization/", label: "Localization" },
    { href: "/store-page/testing/", label: "Testing" },
  ]},
  { title: "Grow", links: [
    { href: "/grow/onboarding/", label: "Onboarding" },
    { href: "/grow/subscriptions/", label: "Subscriptions" },
    { href: "/grow/ratings-reviews/", label: "Ratings and reviews" },
    { href: "/grow/", label: "All growth guides" },
  ]},
  { title: "Tools", links: [
    { href: "/workbench/", label: "Workbench" },
    { href: "/tools/", label: "All tools", note: `${tools.length} free` },
    { href: "/tools/app-store-growth-skill/", label: "AI agent skill" },
  ]},
  { title: "Learn", links: [
    { href: "/changes/", label: "Platform changes" },
    { href: "/learn/metrics/", label: "Metrics glossary" },
    { href: "/learn/ai-for-aso/", label: "AI for ASO" },
    { href: "/learn/podcasts/", label: "Podcasts" },
    { href: "/learn/resources/", label: "Resources" },
    { href: "/about/", label: "About" },
  ]},
];

const tabs: Array<NavLink & { match: string[] }> = [
  { href: "/launch/", label: "Launch", match: ["/launch/"] },
  { href: "/store-page/", label: "Store page", match: ["/store-page/", "/app-store-optimization/"] },
  { href: "/tools/", label: "Tools", match: ["/tools/", "/workbench/"] },
  { href: "/changes/", label: "Changes", match: ["/changes/"] },
];

const isActive = (pathname: string, href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

function TabIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    Launch: "M12 3c3 2 4.5 5.5 4.5 9.5L12 17l-4.5-4.5C7.5 8.5 9 5 12 3zM9 17l-2 4M15 17l2 4M12 9.5h.01",
    "Store page": "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 7h6M9 11h6M9 15h3",
    Tools: "M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-1-1-3z",
    Changes: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]}/></svg>;
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Focus returns to the menu button only for an explicit close; after navigation it belongs to the new page.
  const returnFocus = useRef(false);
  const close = () => { returnFocus.current = true; setOpen(false); };

  // Close whenever the route changes: the header stays mounted across client navigations.
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const focusable = () => Array.from(sheetRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { close(); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (returnFocus.current) toggle?.focus();
      returnFocus.current = false;
    };
  }, [open]);

  return <>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Awesome Mobile Growth home">
        <span className="brand-mark" aria-hidden="true">AMG</span>
        <span className="brand-name"><span className="brand-name__extra">Awesome </span>Mobile Growth</span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary">
        {desktopLinks.map(item => <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <SearchDialog/>
      <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <span className="sr-only">Open menu</span>
      </button>
    </header>

    <div className="menu-layer" hidden={!open}>
      <button type="button" className="menu-scrim" tabIndex={-1} aria-label="Close menu" onClick={close}/>
      <div ref={sheetRef} id="site-menu" className="menu-sheet" role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="menu-sheet__head">
          <span className="menu-sheet__grabber" aria-hidden="true"/>
          <button type="button" className="menu-close" onClick={close}>Close</button>
        </div>
        <nav className="menu-groups" aria-label="Site sections">
          {groups.map(group => <section key={group.title}>
            <h2>{group.title}</h2>
            <ul>{group.links.map(link => <li key={link.href}>
              <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>
                <span>{link.label}</span>{link.note && <small>{link.note}</small>}
              </Link>
            </li>)}</ul>
          </section>)}
        </nav>
      </div>
    </div>

    <nav className="tab-bar" aria-label="Main sections">
      {tabs.map(tab => {
        const active = tab.match.some(prefix => pathname.startsWith(prefix));
        return <Link key={tab.href} href={tab.href} aria-current={active ? "page" : undefined}><TabIcon name={tab.label}/><span>{tab.label}</span></Link>;
      })}
    </nav>
  </>;
}
