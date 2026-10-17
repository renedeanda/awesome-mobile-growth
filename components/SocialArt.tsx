// Right-hand illustrations for the social cards. Each takes real site data, so a card shows what the section holds.
import { brand } from "./BrandMark";
import { ink, line, muted, sheet } from "./SocialCard";

const panel = { display: "flex", flexDirection: "column" as const, width: "100%", height: "100%", padding: 26, borderRadius: 28, background: sheet, border: `2px solid ${line}`, boxShadow: "0 18px 40px rgba(23,25,29,.10)" };
const green = "#1f7a4d";

// Drawn glyphs: Satori can only fetch fonts for symbols like ✓ and ★ over the network, which builds can't rely on.
const Check = ({ size, color }: { size: number; color: string }) => <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Star = () => <svg width="15" height="15" viewBox="0 0 24 24"><path d="m12 2.8 2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7z" fill="#d79b1c"/></svg>;
const Magnifier = () => <svg width="20" height="20" viewBox="0 0 24 24"><path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM16 16l5 5" fill="none" stroke="#6b717b" strokeWidth="2.4" strokeLinecap="round"/></svg>;

/** Home: the example App Store search result from the hero. */
export function SearchResultArt({ query, name, subtitle, captions }: { query: string; name: string; subtitle: string; captions: string[] }) {
  return <div style={{ ...panel, gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 14, background: "#ebe8e0", color: muted, fontSize: 19 }}><Magnifier/>{query}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 62, height: 62, borderRadius: 15, background: "#2b2118", color: "#f4c27a", fontSize: 30, fontWeight: 800 }}>R</div>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: 2 }}>
        <span style={{ fontSize: 19, fontWeight: 760 }}>{name}</span>
        <span style={{ fontSize: 16, color: muted }}>{subtitle}</span>
        <div style={{ display: "flex", gap: 2, marginTop: 2 }}>{[0, 1, 2, 3, 4].map((index) => <Star key={index}/>)}</div>
      </div>
      <span style={{ display: "flex", padding: "7px 18px", borderRadius: 999, background: "#e3e0d8", color: brand.blue, fontWeight: 800, fontSize: 17 }}>Get</span>
    </div>
    <div style={{ display: "flex", gap: 10, flexGrow: 1 }}>
      {captions.map((caption, index) => <div key={caption} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: 10, borderRadius: 14, background: ["#2b2118", "#33402f", "#4a3020"][index % 3], color: "#f8f1e4", fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
        <span style={{ display: "flex" }}>{caption}</span>
        <div style={{ display: "flex", height: 54, borderRadius: 8, background: "rgba(248,241,228,.16)" }}/>
      </div>)}
    </div>
  </div>;
}

/** Launch: the checklist phases with their real item counts. */
export function ChecklistArt({ phases, done }: { phases: Array<{ title: string; when: string; count: number }>; done: number }) {
  return <div style={{ ...panel, gap: 4, justifyContent: "center", padding: "18px 24px" }}>
    {phases.map((phase, index) => {
      const checked = index < done;
      return <div key={phase.title} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderBottom: index < phases.length - 1 ? `1.5px solid ${line}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 9, border: `2.5px solid ${checked ? green : "#b9b5ab"}`, background: checked ? green : "transparent" }}>{checked && <Check size={20} color="white"/>}</div>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <span style={{ fontSize: 20, fontWeight: 760, color: checked ? muted : ink, textDecoration: checked ? "line-through" : "none" }}>{phase.title}</span>
          <span style={{ fontSize: 14, color: muted, fontFamily: "Geist Mono" }}>{phase.when.toUpperCase()}</span>
        </div>
        <span style={{ fontSize: 16, color: muted, fontFamily: "Geist Mono" }}>{phase.count} items</span>
      </div>;
    })}
  </div>;
}

/** Store page: an Apple keyword field measured against its 100-byte limit. */
export function KeywordArt({ value, bytes, terms, limit = 100 }: { value: string; bytes: number; terms: number; limit?: number }) {
  return <div style={{ ...panel, gap: 18, justifyContent: "center", background: "#14161a", border: "2px solid #2a2d33" }}>
    <span style={{ fontSize: 14, color: "#8b93a1", fontFamily: "Geist Mono", letterSpacing: 2 }}>KEYWORDS</span>
    <div style={{ display: "flex", flexWrap: "wrap", fontSize: 19, lineHeight: 1.45, color: "#e8e3d6", fontFamily: "Geist Mono" }}>
      {value.split(",").map((term, index, all) => <span key={`${term}-${index}`} style={{ display: "flex" }}>{term}{index < all.length - 1 ? "," : ""}</span>)}
    </div>
    <div style={{ display: "flex", height: 14, borderRadius: 999, background: "#2a2d33" }}>
      <div style={{ display: "flex", width: `${Math.min(100, bytes / limit * 100)}%`, height: 14, borderRadius: 999, background: "#5fd39a" }}/>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: "#b9c0cc", fontFamily: "Geist Mono" }}>
      <span>{bytes}/{limit} bytes</span><span>{terms} terms</span>
    </div>
  </div>;
}

/** Tools: a framed phone screenshot, as the frame studio exports it. */
export function PhoneFrameArt({ caption, size }: { caption: string; size: string }) {
  return <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", gap: 26 }}>
    <div style={{ display: "flex", padding: 10, borderRadius: 38, background: "#1b1d22", boxShadow: "0 20px 44px rgba(23,25,29,.25)" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 150, height: 310, padding: "26px 16px 18px", borderRadius: 29, background: "linear-gradient(160deg, #1557d6, #5b8cff 60%, #ff7651)" }}>
        <span style={{ display: "flex", color: "white", fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{caption}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[1, 0.7, 0.85].map((width, index) => <div key={index} style={{ display: "flex", width: `${width * 100}%`, height: 16, borderRadius: 6, background: "rgba(255,255,255,.35)" }}/>)}
        </div>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 14, color: muted, fontFamily: "Geist Mono", letterSpacing: 1.5 }}>EXPORT</span>
      <span style={{ fontSize: 24, fontWeight: 800 }}>{size}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: green, fontWeight: 700 }}><Check size={18} color={green}/>App Store size</div>
    </div>
  </div>;
}

/** Changes: the latest dated platform changes. */
export function TimelineArt({ items }: { items: Array<{ when: string; store: string; title: string; upcoming: boolean }> }) {
  return <div style={{ ...panel, justifyContent: "center", gap: 0 }}>
    {items.map((item, index) => <div key={item.title} style={{ display: "flex", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18 }}>
        <div style={{ display: "flex", width: 16, height: 16, marginTop: 5, borderRadius: 99, background: item.upcoming ? brand.coral : brand.blue }}/>
        {index < items.length - 1 && <div style={{ display: "flex", width: 2.5, flexGrow: 1, background: line }}/>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingBottom: index < items.length - 1 ? 18 : 0 }}>
        <span style={{ fontSize: 14, color: item.upcoming ? "#b8431f" : muted, fontFamily: "Geist Mono", letterSpacing: 1 }}>{item.when.toUpperCase()} · {item.store.toUpperCase()}</span>
        <span style={{ display: "flex", fontSize: 18, fontWeight: 740, lineHeight: 1.2 }}>{item.title}</span>
      </div>
    </div>)}
  </div>;
}

/** Grow: the acquisition funnel, named with the metrics glossary's own terms. */
export function FunnelArt({ steps }: { steps: string[] }) {
  const widths = [100, 74, 50, 30];
  return <div style={{ ...panel, justifyContent: "center", gap: 12 }}>
    {steps.map((step, index) => <div key={step} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: index === steps.length - 1 ? green : ink }}>{step}</span>
      <div style={{ display: "flex", width: `${widths[index % widths.length]}%`, height: 24, borderRadius: 8, background: index === steps.length - 1 ? green : brand.blue, opacity: 1 - index * 0.14 }}/>
    </div>)}
  </div>;
}

/** Learn: one glossary entry with Apple's definition. */
export function GlossaryArt({ term, definition, where }: { term: string; definition: string; where: string }) {
  const short = definition.length > 150 ? `${definition.slice(0, definition.lastIndexOf(" ", 147))}…` : definition;
  return <div style={{ ...panel, justifyContent: "center", gap: 14 }}>
    <span style={{ fontSize: 14, color: brand.blue, fontFamily: "Geist Mono", letterSpacing: 2 }}>METRIC</span>
    <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{term}</span>
    <div style={{ display: "flex", fontSize: 18, lineHeight: 1.4, color: ink }}>{short}</div>
    <span style={{ fontSize: 14, color: muted, fontFamily: "Geist Mono" }}>{where}</span>
  </div>;
}

/** Screenshot sizes: every accepted size drawn to the same scale, largest first. */
export function SizesArt({ sizes, status, radius }: { sizes: Array<[number, number]>; status: string; radius: number }) {
  const shown = [...sizes].sort((a, b) => b[0] * b[1] - a[0] * a[1]).slice(0, 4);
  // Fit the tallest outline to 200 px and the row, with its gaps and labels, to the panel width.
  const gap = 14, label = 70, room = 340 - gap * (shown.length - 1);
  let scale = 200 / Math.max(...shown.map(([, h]) => h));
  while (shown.reduce((sum, [w]) => sum + Math.max(w * scale, label), 0) > room) scale *= 0.95;
  const required = status.startsWith("Required");
  return <div style={{ ...panel, justifyContent: "space-between", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap, flexGrow: 1 }}>
      {shown.map(([w, h], index) => <div key={`${w}x${h}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: Math.max(Math.round(w * scale), label) }}>
        <div style={{ display: "flex", width: Math.round(w * scale), height: Math.round(h * scale), borderRadius: Math.max(4, Math.round(Math.min(w, h) * scale * radius)), border: `3px solid ${index === 0 ? brand.blue : "#9aa3b2"}`, background: index === 0 ? "rgba(21,87,214,.08)" : "transparent" }}/>
        <span style={{ fontSize: 14, color: muted, fontFamily: "Geist Mono" }}>{w}×{h}</span>
      </div>)}
    </div>
    <span style={{ display: "flex", alignSelf: "center", padding: "6px 14px", borderRadius: 999, background: required ? "#fbe3d9" : "#e7e4dc", color: required ? "#a33a18" : muted, fontSize: 16, fontWeight: 760 }}>{status}</span>
  </div>;
}

/** Shortens card text: to the last whole sentence when that keeps at least half, otherwise at a word, never after a comma. */
export function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  if (sentence >= max / 2) return cut.slice(0, sentence + 1).replace(/;$/, ".");
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

/** Guides and changes: the page's own action list, so a shared link previews what the reader will do. */
export function StepsArt({ heading, steps }: { heading: string; steps: string[] }) {
  const shown = steps.slice(0, 3);
  return <div style={{ ...panel, justifyContent: "center", gap: 14, padding: "22px 26px" }}>
    <span style={{ fontSize: 14, color: green, fontFamily: "Geist Mono", letterSpacing: 2 }}>{heading}</span>
    {shown.map((step, index) => <div key={step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, flexShrink: 0, borderRadius: 999, background: index === 0 ? green : "transparent", border: `2.5px solid ${index === 0 ? green : "#b9b5ab"}`, color: index === 0 ? "white" : muted, fontSize: 15, fontWeight: 800 }}>{index + 1}</span>
      <span style={{ display: "flex", fontSize: 18, lineHeight: 1.3, color: ink }}>{clip(step, steps.length > 3 ? 64 : 72)}</span>
    </div>)}
    {steps.length > shown.length && <span style={{ fontSize: 14, color: muted, fontFamily: "Geist Mono" }}>+{steps.length - shown.length} MORE ON THE PAGE</span>}
  </div>;
}
