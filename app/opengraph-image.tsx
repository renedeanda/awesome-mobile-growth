import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Awesome Mobile Growth — an evidence-aware ASO field guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 70px", background: "#f2efe7", color: "#17191d", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", width: 60, height: 60, borderRadius: 14, background: "#1557d6", color: "white", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 19 }}>AMG</div>
        <div style={{ display: "flex", fontFamily: "monospace", fontWeight: 700, fontSize: 19, letterSpacing: 2, color: "#1557d6" }}>AWESOME MOBILE GROWTH</div>
      </div>
      <div style={{ display: "flex", fontFamily: "monospace", fontSize: 17, color: "#626872" }}>FIELD GUIDE · OCT 2026</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", maxWidth: 940, fontWeight: 760, fontSize: 78, lineHeight: .98, letterSpacing: -4 }}>Make the store page earn its place.</div>
      <div style={{ display: "flex", maxWidth: 800, color: "#626872", fontSize: 27, lineHeight: 1.3 }}>Official sources, practical judgment, and a private workbench for better ASO decisions.</div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22, borderTop: "2px solid #d3d0c8", fontSize: 21 }}>
      <div style={{ display: "flex", gap: 30 }}><span>Intent</span><span>Promise</span><span>Proof</span><span>Learning</span></div>
      <span style={{ color: "#d55232", fontWeight: 750 }}>mobile.productbuilder.net</span>
    </div>
  </div>, size);
}
