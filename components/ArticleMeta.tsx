import type { ReactNode } from "react";
import { Evidence } from "@/components/Evidence";
import type { Evidence as EvidenceType } from "@/lib/content";
import { formatDate } from "@/lib/site";

// One line under every article title: evidence chips, then read time and the date sources were last checked.
export function ArticleMeta({ evidence, reading, checked, children }: { evidence?: EvidenceType[]; reading: string; checked: string; children?: ReactNode }) {
  return <div className="article-meta">
    {evidence?.length ? <Evidence kinds={evidence}/> : null}
    <p className="article-meta__facts"><span>{reading}</span><span>Checked <time dateTime={checked}>{formatDate(checked)}</time></span>{children}</p>
  </div>;
}
