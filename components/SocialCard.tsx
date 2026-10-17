// 1200 × 630 social cards, rendered by Satori at build time. Satori needs display:flex on every element with
// more than one child, and inline styles only.
import type { ReactNode } from "react";
import { BrandMark, brand } from "./BrandMark";

export const ink = "#17191d", muted = "#5d636d", line = "#d6d2c8", paper = "#f2efe7", sheet = "#fbfaf6";

type Props = {
  desk: string;
  title: string;
  description: string;
  trail: string[];
  /** The right-hand illustration, drawn from the section's own data. */
  art?: ReactNode;
  /** ISO date the facts on the card were checked. */
  checked?: string;
};

const month = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();

export function SocialCard({ desk, title, description, trail, art, checked = "2026-10-16" }: Props) {
  const long = title.length > 38;
  return <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "54px 64px 50px", background: paper, color: ink, fontFamily: "Geist" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <BrandMark size={56}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 760, letterSpacing: -0.5 }}>Mobile Growth</span>
          <span style={{ fontSize: 16, fontFamily: "Geist Mono", letterSpacing: 2.5, color: brand.blue }}>{desk}</span>
        </div>
      </div>
      <span style={{ display: "flex", padding: "8px 14px", border: `1.5px solid ${line}`, borderRadius: 999, color: muted, fontFamily: "Geist Mono", fontSize: 15, letterSpacing: 1 }}>CHECKED {month(checked)}</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: art ? 640 : 1030 }}>
        <div style={{ display: "flex", fontSize: art ? (title.length > 52 ? 50 : long ? 56 : 64) : 72, lineHeight: 1.02, letterSpacing: -2.5, fontWeight: 800 }}>{title}</div>
        <div style={{ display: "flex", color: muted, fontSize: 25, lineHeight: 1.3 }}>{description}</div>
      </div>
      {art && <div style={{ display: "flex", width: 400, height: 340, flexShrink: 0 }}>{art}</div>}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `2px solid ${line}`, fontSize: 20 }}>
      <div style={{ display: "flex", gap: 26 }}>{trail.map((item) => <span key={item} style={{ display: "flex" }}>{item}</span>)}</div>
      <span style={{ display: "flex", color: brand.blue, fontWeight: 760 }}>mobile.productbuilder.net</span>
    </div>
  </div>;
}
