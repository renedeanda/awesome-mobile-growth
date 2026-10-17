"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./CopyButton";

/**
 * A code or file listing styled as a dark terminal card in both themes: a bar with the file name,
 * line count and a copy button, then the text. Long files collapse behind a fade once the page is
 * interactive; without JavaScript the full text stays visible.
 */
export function CodeFile({ label, text, shell = false, collapseAfter, copyLabel = "Copy" }: { label: string; text: string; shell?: boolean; collapseAfter?: number; copyLabel?: string }) {
  const lines = text.replace(/\n$/, "").split("\n");
  const long = collapseAfter !== undefined && lines.length > collapseAfter;
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { if (long) setCollapsed(true); }, [long]);
  return <figure className="code-file" data-collapsed={collapsed || undefined}>
    <figcaption className="code-file__bar">
      <span className="code-file__dots" aria-hidden="true"><i/><i/><i/></span>
      <span className="code-file__name">{label}</span>
      <span className="code-file__meta">{lines.length} line{lines.length === 1 ? "" : "s"}</span>
      <CopyButton text={text} label={copyLabel}/>
    </figcaption>
    <div className="code-file__body">
      <pre><code>{shell ? lines.map((line, index) => <span key={index} className="code-file__line code-file__line--shell">{line}{"\n"}</span>) : text}</code></pre>
    </div>
    {long && <button type="button" className="code-file__toggle" aria-expanded={!collapsed} onClick={() => setCollapsed((value) => !value)}>{collapsed ? `Show all ${lines.length} lines` : "Collapse"}</button>}
  </figure>;
}
