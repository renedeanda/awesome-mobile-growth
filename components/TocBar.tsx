"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/articles";

// Sticky "On this page" bar for phones. Shows the section being read and jumps to any other.
export function TocBar({ items }: { items: TocItem[] }) {
  const [current, setCurrent] = useState(items[0]?.label ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // The current section is the last heading that has scrolled above the sticky bars.
    let frame = 0;
    const update = () => {
      frame = 0;
      let label = items[0]?.label ?? "";
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top < 140) label = item.label;
      }
      setCurrent(label);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [items]);

  if (items.length < 3) return null;
  return <details className="toc-bar" ref={detailsRef}>
    <summary><span className="toc-bar__label">On this page</span><span className="toc-bar__current">{current}</span></summary>
    <ol>{items.map((item) => <li key={item.id}><a href={`#${item.id}`} onClick={() => detailsRef.current?.removeAttribute("open")}>{item.label}</a></li>)}</ol>
  </details>;
}
