import { CodeFile } from "./CodeFile";

export function SkillViewer({ source }: { source: string }) {
  return <div className="skill-source">
    <div><p className="eyebrow">Canonical source</p><h2>The complete skill file</h2><p>Copy it into your agent's skills folder, or read it here first. Nothing in it calls a network service.</p></div>
    <CodeFile label="SKILL.md" text={source} collapseAfter={28} copyLabel="Copy SKILL.md"/>
  </div>;
}
