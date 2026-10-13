"use client";
import { useState } from "react";
export function SkillViewer({source}:{source:string}){
  const [notice,setNotice]=useState("");
  const copy=async()=>{await navigator.clipboard.writeText(source);setNotice("Copied the complete SKILL.md.");};
  return <div className="skill-source"><div><div><p className="eyebrow">Canonical source</p><h2>The complete skill file</h2></div><button className="button-secondary" onClick={copy}>Copy SKILL.md</button></div>{notice&&<p role="status" className="notice">{notice}</p>}<details><summary>Read the raw SKILL.md</summary><pre><code>{source}</code></pre></details></div>
}
