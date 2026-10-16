"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { duplicates, keywordTokens, utf8Bytes, warnings } from "@/lib/workbench";
import { LIMITS } from "@/lib/platform";
import type { ToolSlug } from "@/lib/tools";

const screenshotGroups = {
  iphone: { label: "iPhone", lines: ["Provide 1–10 screenshots.", "For the current required Dynamic Island medium-display set, Apple accepts 1179 × 2556 or 1206 × 2622 pixels; landscape reverses the dimensions.", "JPEG, JPG, or PNG; no transparency."], href: "https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" },
  ipad: { label: "iPad", lines: ["A 13-inch iPad screenshot is required when the app runs on iPad.", "Provide 1–10 screenshots.", "JPEG, JPG, or PNG; no transparency."], href: "https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" },
  mac: { label: "Mac", lines: ["Provide 1–10 screenshots.", "Accepted examples include 1280 × 800, 1440 × 900, 2560 × 1600, and 2880 × 1800 pixels.", "Show the real Mac experience and keep window and menu-bar details honest."], href: "https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" },
  google: { label: "Google Play", lines: ["Publishing minimum: at least two screenshots across supported device types; up to eight per device type.", "JPEG or 24-bit PNG without alpha; each side 320–3840 pixels; the long side cannot exceed twice the short side.", "Separate recommendation-eligibility guidance asks for at least four screenshots at 1080px or higher in 16:9 landscape or 9:16 portrait."], href: "https://support.google.com/googleplay/android-developer/answer/9866151" },
} as const;
const appleFields = [["appleName", "Name"], ["appleSubtitle", "Subtitle"], ["applePromotional", "Promotional text"], ["appleKeywords", "Keywords"], ["appleDescription", "Description"], ["appleWhatsNew", "What’s New"]] as const;
const googleFields = [["googleName", "App name"], ["googleShort", "Short description"], ["googleFull", "Full description"]] as const;

export function BrowserTool({ tool }: { tool: ToolSlug }) {
  // data-ready marks hydration: typing into the static HTML before React attaches is silently ignored.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <div className="browser-tool" data-testid="browser-tool" data-ready={ready}><ToolBody tool={tool}/></div>;
}

function ToolBody({ tool }: { tool: ToolSlug }) {
  if (tool === "app-store-keyword-field") return <KeywordTool/>;
  if (tool === "metadata-validator") return <MetadataTool/>;
  if (tool === "app-store-screenshot-sizes") return <ScreenshotTool/>;
  return <ExperimentTool/>;
}

function KeywordTool() {
  const [value, setValue] = useState("");
  const bytes = utf8Bytes(value); const repeat = duplicates(value); const tokens = keywordTokens(value);
  const empty = value.split(",").filter((token) => !token.trim()).length - (value.endsWith(",") ? 1 : 0);
  const update = (next: string) => { if (!value && next) trackEvent("tool_started", { tool_id: "app-store-keyword-field" }); setValue(next); };
  return <div className="tool-panel"><div className="sample-row"><p>Try the mechanics with a realistic sample, then replace it with your field.</p><button onClick={() => update("journal,private,notes,daily,reflection,focus,mood,gratitude")}>Load sample</button></div><label className="field"><span className="field-label">Keywords <small className={bytes > 100 ? "over" : ""}>{bytes}/100 bytes</small></span><span className="field-help">Enter the comma-separated field exactly as you intend to submit it.</span><textarea rows={6} value={value} onChange={(event) => update(event.target.value)} placeholder="journaling,private,notes,focus" aria-invalid={bytes > 100}/></label>{tokens.length > 0 && <div className="token-ledger" aria-label="Keyword byte ledger">{tokens.map((token, index) => <span key={`${token}-${index}`}><strong>{token}</strong><small>{utf8Bytes(token)} bytes</small></span>)}</div>}<Result tone={bytes > 100 ? "warn" : "good"} title={bytes > 100 ? `${bytes - 100} bytes over` : `${100 - bytes} bytes available`}><p>{repeat.length ? `Repeated tokens: ${repeat.join(", ")}.` : "No exact duplicate tokens found."}</p>{/\s/.test(value) && <p>Spaces consume bytes. Remove spaces after commas unless a phrase truly needs one.</p>}{empty > 0 && <p>Empty comma slots add no value.</p>}<p>This checks mechanics, not demand or ranking potential. Apple does not publish keyword search volume here.</p></Result></div>;
}

function MetadataTool() {
  const [platform, setPlatform] = useState<"apple"|"google">("apple"); const [values, setValues] = useState<Record<string,string>>({}); const [baseline, setBaseline] = useState<Record<string,string>>({}); const [compare, setCompare] = useState(false);
  const fields = platform === "apple" ? appleFields : googleFields;
  const findings = useMemo(() => [...new Set(Object.values(values).flatMap(warnings))], [values]);
  const changed = fields.filter(([key]) => (baseline[key] ?? "") !== (values[key] ?? "")).map(([, label]) => label);
  const update = (key: string, value: string, current = false) => { if (!Object.values(values).some(Boolean) && !current) trackEvent("tool_started", { tool_id: "metadata-validator", platform }); (current ? setBaseline : setValues)(state => ({ ...state, [key]: value })); };
  return <div className="tool-panel"><div className="segmented" role="group" aria-label="Store"><button aria-pressed={platform === "apple"} onClick={()=>setPlatform("apple")}>Apple</button><button aria-pressed={platform === "google"} onClick={()=>setPlatform("google")}>Google Play</button></div><label className="compare-toggle"><input type="checkbox" checked={compare} onChange={event => setCompare(event.target.checked)}/> Compare with current listing</label><div className={`tool-fields ${compare ? "tool-fields--compare" : ""}`}>{fields.map(([key,label]) => { const value=values[key] ?? ""; const current=baseline[key] ?? ""; const count=key === "appleKeywords" ? utf8Bytes(value) : value.length; const limit=LIMITS[key]; const control=(fieldValue:string,onChange:(value:string)=>void,currentField=false)=>limit > 200 ? <textarea aria-label={`${currentField ? "Current " : ""}${label}`} rows={key.includes("Description") || key.includes("Full") ? 10 : 5} value={fieldValue} onChange={event=>onChange(event.target.value)} aria-invalid={!currentField && count>limit}/> : <input aria-label={`${currentField ? "Current " : ""}${label}`} value={fieldValue} onChange={event=>onChange(event.target.value)} aria-invalid={!currentField && count>limit}/>; return <div className="comparison-field" key={key}>{compare && <label className="field"><span className="field-label">Current {label}</span>{control(current,value=>update(key,value,true),true)}</label>}<label className="field"><span className="field-label">{compare ? "Proposed " : ""}{label}<small className={count > limit ? "over" : ""}>{count}/{limit}{key === "appleKeywords" ? " bytes" : ""}</small></span>{control(value,value=>update(key,value))}</label></div>})}</div><Result tone="neutral" title={compare ? `${changed.length} field${changed.length === 1 ? "" : "s"} changed` : "Editorial review"}><p>{compare && changed.length ? changed.join(", ") : "Passing a limit is not the same as explaining the product clearly. Read the visible fields together."}</p>{findings.map((finding)=><p key={finding}>{finding}</p>)}</Result></div>;
}

type Frame = { message: string; proof: string; capture: string; risk: string };
const emptyFrame = (): Frame => ({ message: "", proof: "", capture: "", risk: "" });
function ScreenshotTool() {
  const [choice,setChoice]=useState<keyof typeof screenshotGroups>("iphone"); const [frames,setFrames]=useState<Frame[]>([emptyFrame(),emptyFrame(),emptyFrame()]); const group=screenshotGroups[choice];
  const update=(index:number,key:keyof Frame,value:string)=>{ if (!frames.some(frame=>Object.values(frame).some(Boolean)) && value) trackEvent("tool_started", { tool_id:"app-store-screenshot-sizes", platform:choice }); setFrames(items=>items.map((item,i)=>i===index?{...item,[key]:value}:item)); };
  const brief=`# ${group.label} screenshot storyboard\n\n${frames.map((frame,index)=>`## Frame ${index+1}\n- Message: ${frame.message}\n- Product proof: ${frame.proof}\n- Capture needed: ${frame.capture}\n- Locale or crop risk: ${frame.risk}`).join("\n\n")}`;
  const copy=async()=>{await navigator.clipboard.writeText(brief);trackEvent("tool_completed",{tool_id:"app-store-screenshot-sizes",format:"markdown"});};
  return <div className="tool-panel"><label className="field"><span className="field-label">Placement</span><select value={choice} onChange={event=>setChoice(event.target.value as keyof typeof screenshotGroups)}>{Object.entries(screenshotGroups).map(([key,value])=><option value={key} key={key}>{value.label}</option>)}</select></label><Result tone="neutral" title={`${group.label} delivery check`}>{group.lines.map(line=><p key={line}>{line}</p>)}<p><a href={group.href}>Verify in the official specification ↗</a></p></Result><div className="storyboard"><div className="storyboard-head"><div><p className="eyebrow">Storyboard</p><h2>Give every frame a job.</h2></div><button onClick={()=>setFrames(items=>[...items,emptyFrame()])}>Add frame</button></div>{frames.map((frame,index)=><fieldset key={index}><legend>Frame {index+1}</legend><label>Message<input value={frame.message} onChange={event=>update(index,"message",event.target.value)} placeholder="The one idea someone should understand"/></label><label>Visible product proof<input value={frame.proof} onChange={event=>update(index,"proof",event.target.value)} placeholder="The real screen or state that proves it"/></label><label>Capture needed<input value={frame.capture} onChange={event=>update(index,"capture",event.target.value)} placeholder="Device, state, data, or interaction"/></label><label>Locale or crop risk<input value={frame.risk} onChange={event=>update(index,"risk",event.target.value)} placeholder="Text expansion, safe area, or edge content"/></label></fieldset>)}</div><button className="button" onClick={copy}>Copy storyboard</button><p className="tool-caveat">Specifications change and store consoles can show additional compatible sizes. Confirm the live requirement before delivery.</p></div>;
}

function ExperimentTool() {
  const blank={decision:"",hypothesis:"",audience:"",change:"",measure:"",guardrail:"",confounders:"",duration:"",learning:""};
  const sample={decision:"Should the first screenshot lead with the outcome or the interface?",hypothesis:"Because new visitors may not recognize the category from UI alone, leading with the outcome will increase first-time download conversion without reducing activation.",audience:"US iPhone visitors on the default product page",change:"Screenshot one only: outcome-led message versus interface-led message",measure:"Apple’s first-time-download conversion rate for the test",guardrail:"Activation to first completed task",confounders:"No pricing, campaign, featuring, or onboarding changes during the observation window",duration:"Run until App Store Connect reports a decision or likely inconclusive result; record intervening releases",learning:"If outcome wins, carry the message into acquisition. If interface wins, examine category familiarity. If inconclusive, test a stronger contrast."};
  const [values,setValues]=useState(blank);
  const fields = [["decision","Decision this test should unlock"],["hypothesis","Because / therefore hypothesis"],["audience","Audience and placement"],["change","One controlled change"],["measure","Primary measure and denominator"],["guardrail","Quality guardrail"],["confounders","Known confounders"],["duration","Stopping rule or observation window"],["learning","What each outcome would teach us"]] as const;
  const brief = `# Store experiment brief\n\n${fields.map(([key,label])=>`## ${label}\n\n${values[key]}`).join("\n\n")}\n`;
  const update=(key:keyof typeof blank,value:string)=>{if(!Object.values(values).some(Boolean)&&value)trackEvent("tool_started",{tool_id:"experiment-brief"});setValues(state=>({...state,[key]:value}));};
  const copy=async()=>{await navigator.clipboard.writeText(brief);trackEvent("tool_completed",{tool_id:"experiment-brief",format:"markdown"});};
  return <div className="tool-panel"><div className="sample-row"><p>Start blank or inspect a completed App Store screenshot test.</p><button onClick={()=>setValues(sample)}>Load example</button></div><div className="tool-fields">{fields.map(([key,label])=><label className="field" key={key}><span className="field-label">{label}</span><textarea rows={3} value={values[key]} onChange={event=>update(key,event.target.value)}/></label>)}</div><button className="button" onClick={copy}>Copy brief</button><p className="tool-caveat">Record the decision before seeing the result. Keep inconclusive outcomes; they are part of the evidence.</p></div>;
}

function Result({title,tone,children}:{title:string;tone:"good"|"warn"|"neutral";children:React.ReactNode}) { return <aside className={`tool-result tool-result--${tone}`} aria-live="polite"><p className="eyebrow">Result</p><h2>{title}</h2>{children}</aside> }
