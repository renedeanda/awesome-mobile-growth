"use client";
import { useMemo, useState } from "react";
import { duplicates, utf8Bytes, warnings } from "@/lib/workbench";
import type { ToolSlug } from "@/lib/tools";

const metadataLimits = { appleName: 30, appleSubtitle: 30, applePromotional: 170, appleKeywords: 100, googleName: 30, googleShort: 80, googleFull: 4000 } as const;
const screenshotGroups = {
  iphone: { label: "iPhone", lines: ["Provide 1–10 screenshots.", "Current medium-display examples: 1179 × 2556 or 1206 × 2622 pixels; landscape reverses the dimensions.", "JPEG, JPG, or PNG; no transparency."], href: "https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" },
  ipad: { label: "iPad", lines: ["A 13-inch iPad screenshot is required when the app runs on iPad.", "Provide 1–10 screenshots.", "JPEG, JPG, or PNG; no transparency."], href: "https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" },
  mac: { label: "Mac", lines: ["Provide 1–10 screenshots.", "Accepted examples: 1280 × 800, 1440 × 900, 2560 × 1600, or 2880 × 1800 pixels.", "Show the real Mac experience and keep menu-bar or window details honest."], href: "https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" },
  google: { label: "Google Play", lines: ["At least 2 screenshots across supported device types are needed to publish; up to 8 per device type.", "JPEG or 24-bit PNG without alpha; each side 320–3840 pixels; the long side cannot exceed twice the short side.", "For recommendation eligibility, apps should provide at least 4 screenshots at 1080px or higher in 16:9 landscape or 9:16 portrait."], href: "https://support.google.com/googleplay/android-developer/answer/9866151" },
} as const;

export function BrowserTool({ tool }: { tool: ToolSlug }) {
  if (tool === "app-store-keyword-field") return <KeywordTool/>;
  if (tool === "metadata-validator") return <MetadataTool/>;
  if (tool === "app-store-screenshot-sizes") return <ScreenshotTool/>;
  return <ExperimentTool/>;
}

function KeywordTool() {
  const [value, setValue] = useState(""); const bytes = utf8Bytes(value); const repeat = duplicates(value);
  const empty = value.split(",").filter((token) => !token.trim()).length - (value.endsWith(",") ? 1 : 0);
  return <div className="tool-panel"><label className="field"><span className="field-label">Keywords <small className={bytes > 100 ? "over" : ""}>{bytes}/100 bytes</small></span><span className="field-help">Enter the comma-separated field exactly as you intend to submit it.</span><textarea rows={6} value={value} onChange={(event) => setValue(event.target.value)} placeholder="journaling,private,notes,focus" aria-invalid={bytes > 100}/></label><Result tone={bytes > 100 ? "warn" : "good"} title={bytes > 100 ? `${bytes - 100} bytes over` : `${100 - bytes} bytes available`}><p>{repeat.length ? `Repeated tokens: ${repeat.join(", ")}.` : "No exact duplicate tokens found."}</p>{/\s/.test(value) && <p>Spaces consume bytes. Remove spaces after commas unless a phrase truly needs one.</p>}{empty > 0 && <p>Empty comma slots add no value.</p>}<p>This checks mechanics, not demand or ranking potential. Apple does not publish keyword search volume here.</p></Result></div>;
}

function MetadataTool() {
  const [platform, setPlatform] = useState<"apple"|"google">("apple"); const [values, setValues] = useState<Record<string,string>>({});
  const fields = platform === "apple" ? [["appleName","Name"],["appleSubtitle","Subtitle"],["applePromotional","Promotional text"],["appleKeywords","Keywords"]] as const : [["googleName","App name"],["googleShort","Short description"],["googleFull","Full description"]] as const;
  const findings = useMemo(() => [...new Set(Object.values(values).flatMap(warnings))], [values]);
  return <div className="tool-panel"><div className="segmented" role="group" aria-label="Store"><button aria-pressed={platform === "apple"} onClick={()=>setPlatform("apple")}>Apple</button><button aria-pressed={platform === "google"} onClick={()=>setPlatform("google")}>Google Play</button></div><div className="tool-fields">{fields.map(([key,label]) => { const value=values[key] ?? ""; const count=key === "appleKeywords" ? utf8Bytes(value) : value.length; const limit=metadataLimits[key]; return <label className="field" key={key}><span className="field-label">{label}<small className={count > limit ? "over" : ""}>{count}/{limit}{key === "appleKeywords" ? " bytes" : ""}</small></span>{limit > 200 ? <textarea rows={10} value={value} onChange={e=>setValues({...values,[key]:e.target.value})} aria-invalid={count>limit}/> : <input value={value} onChange={e=>setValues({...values,[key]:e.target.value})} aria-invalid={count>limit}/>}</label>})}</div><Result tone="neutral" title="Editorial review"><p>Passing a limit is not the same as earning a tap. Read the fields together: distinctive product, clear audience, concrete outcome, defensible proof.</p>{findings.map((finding)=><p key={finding}>{finding}</p>)}</Result></div>;
}

function ScreenshotTool() {
  const [choice,setChoice]=useState<keyof typeof screenshotGroups>("iphone"); const group=screenshotGroups[choice];
  return <div className="tool-panel"><label className="field"><span className="field-label">Placement</span><select value={choice} onChange={e=>setChoice(e.target.value as keyof typeof screenshotGroups)}>{Object.entries(screenshotGroups).map(([key,value])=><option value={key} key={key}>{value.label}</option>)}</select></label><Result tone="neutral" title={group.label}>{group.lines.map(line=><p key={line}>{line}</p>)}<p><a href={group.href}>Verify in the official specification ↗</a></p></Result><p className="tool-caveat">Specifications change and App Store Connect can show additional compatible sizes. Confirm the live requirement before delivery.</p></div>;
}

function ExperimentTool() {
  const [values,setValues]=useState({decision:"",hypothesis:"",change:"",measure:"",guardrail:"",duration:"",learning:""});
  const fields = [["decision","Decision this test should unlock"],["hypothesis","Because / therefore hypothesis"],["change","One controlled change"],["measure","Primary measure"],["guardrail","Quality guardrail"],["duration","Stopping rule or observation window"],["learning","What each outcome would teach us"]] as const;
  const brief = `# Store experiment brief\n\n${fields.map(([key,label])=>`## ${label}\n\n${values[key]}`).join("\n\n")}\n`;
  return <div className="tool-panel"><div className="tool-fields">{fields.map(([key,label])=><label className="field" key={key}><span className="field-label">{label}</span><textarea rows={3} value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value})}/></label>)}</div><button className="button" onClick={()=>navigator.clipboard.writeText(brief)}>Copy brief</button><p className="tool-caveat">Keep the changed variable legible. Record the decision before looking at the result.</p></div>;
}

function Result({title,tone,children}:{title:string;tone:"good"|"warn"|"neutral";children:React.ReactNode}) { return <aside className={`tool-result tool-result--${tone}`} aria-live="polite"><p className="eyebrow">Result</p><h2>{title}</h2>{children}</aside> }
