import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Apple App Store launch guides for iPhone, iPad, and Mac";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 70px", background: "#101114", color: "#f3f0e8", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", gap: 16, alignItems: "center" }}><div style={{ display: "flex", width: 58, height: 58, borderRadius: 14, alignItems: "center", justifyContent: "center", background: "#83aaff", color: "#101114", fontWeight: 800 }}>AMG</div><span style={{ fontSize: 20, fontFamily: "monospace", letterSpacing: 2 }}>APPLE LAUNCH DESK</span></div><span style={{ color: "#a6acb7", fontFamily: "monospace", fontSize: 17 }}>OCT 2026</span></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}><div style={{ display: "flex", maxWidth: 1000, fontSize: 76, lineHeight: .98, letterSpacing: -4, fontWeight: 780 }}>One ecosystem. Three very different launches.</div><div style={{ display: "flex", maxWidth: 900, color: "#a6acb7", fontSize: 28 }}>Current launch and ASO guides for iPhone, iPad, Mac, and Universal Purchase.</div></div>
    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 22, borderTop: "2px solid #32353c", fontSize: 22 }}><div style={{ display: "flex", gap: 34 }}><span>iPhone</span><span>iPad</span><span>Mac</span><span>Universal Purchase</span></div><span style={{ color: "#ff8968" }}>mobile.productbuilder.net</span></div>
  </div>, size);
}
