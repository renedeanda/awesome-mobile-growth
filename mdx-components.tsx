import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, BlockquoteHTMLAttributes, TableHTMLAttributes } from "react";
import { Callout, Claim, DirectAnswer, Figure, MetadataLimits, RevisionHistory, SourceList, SpecGrid, WorkbenchLink } from "@/components/ContentBlocks";
import { Checklist } from "@/components/Checklist";
import { AlsoBy, AppleCreativeTable, AppleScreenshotTable, AskAI, BeforeAfter, DoToday, Example, GooglePlayGraphicsTable } from "@/components/MdxBlocks";
function ExternalAwareLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) { const external = typeof props.href === "string" && /^https?:\/\//.test(props.href); return <a {...props}>{props.children}{external && <span className="external-mark" aria-hidden="true"> ↗</span>}</a>; }
function ResponsiveTable(props: TableHTMLAttributes<HTMLTableElement>) { return <div className="table-scroll" role="region" aria-label="Scrollable data table" tabIndex={0}><table {...props}/></div>; }
function Quote(props: BlockquoteHTMLAttributes<HTMLQuoteElement>) { return <blockquote className="mdx-quote" {...props}/>; }
const components: MDXComponents = { a: ExternalAwareLink, table: ResponsiveTable, blockquote: Quote, Callout, Claim, DirectAnswer, Figure, MetadataLimits, RevisionHistory, SourceList, SpecGrid, WorkbenchLink, AppleCreativeTable, AppleScreenshotTable, AskAI, BeforeAfter, DoToday, Example, GooglePlayGraphicsTable, Checklist, AlsoBy };
export function useMDXComponents(): MDXComponents { return components; }
