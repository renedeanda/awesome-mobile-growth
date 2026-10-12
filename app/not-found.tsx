import type { Metadata } from "next"; import Link from "next/link";
export const metadata:Metadata={title:"Page not found",robots:{index:false,follow:false}};
export default function NotFound(){return <header className="index-head"><p className="eyebrow">404 · Off the map</p><h1>That page didn’t make the release.</h1><p>Try the field guide, the checklist, or the workbench.</p><div className="actions"><Link className="button" href="/">Return home</Link><Link className="button-secondary" href="/workbench/">Open workbench</Link></div></header>}
