import type { Evidence as EvidenceType } from "@/lib/evidence";
const copy: Record<EvidenceType, string> = { official: "Direct platform guidance", observed: "Observed in product work", experiment: "A testable practice", hypothesis: "Needs validation", opinion: "Editorial judgment" };
export function Evidence({ kinds }: { kinds: EvidenceType[] }) { return <div className="evidence" aria-label="Evidence labels">{kinds.map(k => <span key={k} title={copy[k]}>{k}</span>)}</div> }
