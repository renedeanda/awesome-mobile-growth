"use client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { EventDraft } from "./EventDraft";
import { StorePreview } from "./StorePreview";
import { LIMITS, WorkbenchData, duplicates, emptyWorkbench, migrateWorkbench, parseLocaleBundle, toMarkdown, utf8Bytes, warnings } from "@/lib/workbench";

const STORAGE = "awesome-mobile-growth-workbench.v3";
const LEGACY_STORAGE = ["awesome-mobile-growth-workbench.v2", "awesome-mobile-growth-workbench.v1"];
const fields = [
  ["appleName", "App name", "The distinctive name people see in the store.", LIMITS.appleName, false],
  ["appleSubtitle", "Subtitle", "One clear use or benefit, in plain words.", LIMITS.appleSubtitle, false],
  ["applePromotional", "Promotional text", "A timely message above the description; not a ranking field.", LIMITS.applePromotional, false],
  ["appleKeywords", "Keywords", "Comma-separated, no spaces; this meter counts UTF-8 bytes.", LIMITS.appleKeywords, true],
  ["appleDescription", "Description", "Lead with the app, the audience, and a concrete outcome.", LIMITS.appleDescription, false],
  ["appleWhatsNew", "What’s New", "Tell people what changed and why it matters.", LIMITS.appleWhatsNew, false],
] as const;
const googleFields = [
  ["googleName", "App name", LIMITS.googleName], ["googleShort", "Short description", LIMITS.googleShort], ["googleFull", "Full description", LIMITS.googleFull]
] as const;

type Tab = "preview" | "brief" | "apple" | "event" | "google" | "planning";
const tabs: Array<[Tab, string]> = [["preview", "Store preview"], ["brief", "Product brief"], ["apple", "Apple"], ["event", "In-app event"], ["google", "Google Play"], ["planning", "Plan & learn"]];

function download(name: string, content: string, type: string) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }

export function Workbench() {
  const [data, setData] = useState<WorkbenchData>(emptyWorkbench);
  const [saveLocal, setSaveLocal] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("preview");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE) ?? LEGACY_STORAGE.map(key => localStorage.getItem(key)).find(Boolean);
    if (raw) { try { setData(migrateWorkbench(JSON.parse(raw))); setSaveLocal(true); LEGACY_STORAGE.forEach(key => localStorage.removeItem(key)); } catch {} }
    const params = new URLSearchParams(window.location.search);
    const platform = params.get("platform");
    const template = params.get("template");
    if (params.get("from") === "frames") {
      setTab("preview");
    } else if (template === "screenshots" || template === "experiment") {
      setTab("planning");
      setNotice(template === "screenshots" ? "Screenshot planning is ready." : "The experiment log is ready.");
    } else if (params.get("tab") === "event") {
      setTab("event");
    } else if (platform === "google-play") {
      setTab("google");
      setNotice("Google Play metadata is ready.");
    }
    setHydrated(true);
  }, []);
  useEffect(() => { if (saveLocal) localStorage.setItem(STORAGE, JSON.stringify({ ...data, updatedAt: new Date().toISOString() })); }, [data, saveLocal]);
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (!saveLocal && Object.values(data.fields).some(Boolean)) event.preventDefault(); }; addEventListener("beforeunload", warn); return () => removeEventListener("beforeunload", warn); }, [data, saveLocal]);
  const markStarted = () => { if (!started) { setStarted(true); trackEvent("workbench_started"); } };
  const updateField = (key: keyof WorkbenchData["fields"], value: string) => { markStarted(); setData(d => ({ ...d, fields: { ...d.fields, [key]: value }, updatedAt: new Date().toISOString() })); };
  const allWarnings = useMemo(() => [...new Set(Object.values(data.fields).flatMap(warnings))], [data.fields]);
  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); if ([1, 2, 3].includes(parsed.version) && parsed.fields) setData(migrateWorkbench(parsed)); else setData(d => ({ ...d, fields: { ...d.fields, ...parseLocaleBundle(parsed) } })); markStarted(); trackEvent("workbench_imported"); setNotice("Imported into this browser. Nothing was published."); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not read that file."); } e.target.value = ""; };
  const toggleSave = () => { if (saveLocal) { localStorage.removeItem(STORAGE); setSaveLocal(false); trackEvent("workbench_save_changed", { enabled: false }); setNotice("Local saving is off and the saved draft was deleted."); } else { setSaveLocal(true); trackEvent("workbench_save_changed", { enabled: true }); setNotice("Draft saving is on for this browser."); } };
  const reset = () => { if (!confirm("Clear every field in this browser?")) return; localStorage.removeItem(STORAGE); setData(emptyWorkbench()); setSaveLocal(false); setStarted(false); trackEvent("workbench_reset"); setNotice("Workbench cleared."); };
  const selectTask = (next: Tab, task: string) => { setTab(next); trackEvent("workbench_section_viewed", { section_id: task }); };
  const exportFile = (format: "json" | "markdown") => { trackEvent("workbench_exported", { format }); if (format === "json") download("aso-workbench.json", JSON.stringify(data, null, 2), "application/json"); else download("aso-brief.md", toMarkdown(data), "text/markdown"); };
  return <div className="workbench-shell" data-testid="workbench" data-ready={hydrated}>
    <nav className="workbench-tasks" aria-label="Choose a workflow"><span>What are you doing today?</span><button onClick={() => selectTask("preview", "preview")}>Previewing my store page</button><button onClick={() => selectTask("brief", "launch")}>Planning a launch</button><button onClick={() => selectTask("apple", "metadata")}>Writing metadata</button><button onClick={() => selectTask("planning", "screenshots")}>Storyboarding screenshots</button><button onClick={() => selectTask("planning", "experiment")}>Planning a test</button><button onClick={() => selectTask("planning", "monthly_review")}>Monthly review</button></nav>
    <div className="workbench-toolbar">
      <div className="tabs" role="tablist" aria-label="Workbench sections">{tabs.map(([t, label]) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{label}</button>)}</div>
      <div className="tool-actions"><label className="file-button">Import JSON<input type="file" accept="application/json,.json" onChange={handleImport}/></label><button onClick={() => exportFile("json")}>Export JSON</button><button onClick={() => exportFile("markdown")}>Export Markdown</button></div>
    </div>
    <div className="privacy-strip"><label className="switch"><input type="checkbox" checked={saveLocal} onChange={toggleSave}/><span>Save draft in this browser</span></label><span>Private by default. Your copy never leaves this page.</span><button className="text-button" onClick={reset}>Reset</button></div>
    {notice && <p className="notice" role="status">{notice}</p>}
    {tab === "preview" && <StorePreview fields={data.fields}/>}
    {tab === "brief" && <section className="brief-grid" aria-label="Product brief"><div><p className="eyebrow">Start before keywords</p><h2>Write the facts once.</h2><p>Describe the app here, then check every field and screenshot against it. A specific claim you can show beats a big one you can't.</p></div><div>{([['product','Product','What is it, in plain language?'],['audience','Audience','Who is it genuinely for?'],['job','Job to be done','What progress is that person trying to make?'],['promise','Promise','What concrete outcome can the listing responsibly promise?'],['proof','Proof','What product behavior, screen, result, or trust signal substantiates it?'],['exclusions','Not for','Who or what should the listing avoid attracting?']] as const).map(([key,label,placeholder]) => <label className="field" key={key}><span className="field-label">{label}</span><textarea rows={3} placeholder={placeholder} value={data.brief[key]} onChange={e => { markStarted(); setData(d=>({...d,brief:{...d.brief,[key]:e.target.value},updatedAt:new Date().toISOString()})); }}/></label>)}</div></section>}
    {tab === "apple" && <div className="workbench-grid"><section className="fields" aria-label="Apple metadata fields">{fields.map(([key, label, help, limit, bytes]) => { const value = data.fields[key]; const count = bytes ? utf8Bytes(value) : value.length; const bad = limit !== undefined && count > limit; return <label className="field" key={key}><span className="field-label">{label}{limit && <small className={bad ? "over" : ""}>{count}/{limit}{bytes ? " bytes" : ""}</small>}</span><span className="field-help">{help}</span>{limit && limit <= 170 ? <input value={value} onChange={e => updateField(key, e.target.value)} aria-invalid={bad}/> : <textarea rows={key === "appleDescription" ? 12 : 5} value={value} onChange={e => updateField(key, e.target.value)} aria-invalid={bad}/>}</label>})}</section><Preview name={data.fields.appleName} subtitle={data.fields.appleSubtitle} promo={data.fields.applePromotional} description={data.fields.appleDescription}/></div>}
    {tab === "event" && <EventDraft fields={data.fields} badge={data.eventBadge} onField={updateField} onBadge={(eventBadge) => { markStarted(); setData(d => ({ ...d, eventBadge, updatedAt: new Date().toISOString() })); }}/>}
    {tab === "google" && <div className="workbench-grid"><section className="fields" aria-label="Google Play metadata fields">{googleFields.map(([key, label, limit]) => { const value=data.fields[key]; return <label className="field" key={key}><span className="field-label">{label}<small className={value.length > limit ? "over" : ""}>{value.length}/{limit}</small></span>{limit > 100 ? <textarea rows={14} value={value} onChange={e=>updateField(key,e.target.value)} aria-invalid={value.length > limit}/> : <input value={value} onChange={e=>updateField(key,e.target.value)} aria-invalid={value.length > limit}/>}</label>})}</section><Preview name={data.fields.googleName} subtitle={data.fields.googleShort} description={data.fields.googleFull}/></div>}
    {tab === "planning" && <section className="planning-grid">{([['keywordMap','Keyword map','Intent → phrase → page promise → proof'],['screenshotPlan','Screenshot plan','Frame → message → product evidence → asset status'],['experimentLog','Experiment log','Decision, hypothesis, primary measure, dates, result, next move'],['launchRetro','Launch retrospective','What changed, what we learned, and what deserves another look'],['monthlyReview','Monthly ASO review','Signal → interpretation → decision → owner → review date']] as const).map(([key,label,placeholder]) => <label className="field" key={key}><span className="field-label">{label}</span><textarea rows={9} placeholder={placeholder} value={data[key]} onChange={e => { markStarted(); setData(d=>({...d,[key]:e.target.value,updatedAt:new Date().toISOString()})); }}/></label>)}</section>}
    {(duplicates(data.fields.appleKeywords).length > 0 || allWarnings.length > 0) && <aside className="advisor" aria-label="Metadata review"><p className="eyebrow">Review, don’t obey blindly</p>{duplicates(data.fields.appleKeywords).length > 0 && <p><strong>Duplicate keywords:</strong> {duplicates(data.fields.appleKeywords).join(", ")}</p>}{allWarnings.map(w => <p key={w}>{w}</p>)}</aside>}
  </div>
}
function Preview({name,subtitle,promo,description}:{name:string;subtitle:string;promo?:string;description:string}) { return <aside className="preview"><p className="eyebrow">Illustrative preview</p><div className="phone"><div className="preview-hero"><div className="app-icon">A</div><div><strong>{name || "Your app name"}</strong><p>{subtitle || "A clear, useful subtitle"}</p><button tabIndex={-1}>GET</button></div></div>{promo && <p className="promo">{promo}</p>}<p className="preview-copy">{description || "Your opening sentence should make the product, person, and outcome easy to understand."}</p></div><p className="fine-print">Not a pixel-perfect store replica. Use this to review hierarchy and clarity; verify final assets in the live store tooling.</p></aside> }
