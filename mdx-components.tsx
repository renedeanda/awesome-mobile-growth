import type { MDXComponents } from "mdx/types";
import { Children, isValidElement, type AnchorHTMLAttributes, type BlockquoteHTMLAttributes, type ReactNode, type TableHTMLAttributes } from "react";
import { Callout, Claim, DirectAnswer, Figure, MetadataLimits, RevisionHistory, SourceList, SpecGrid, WorkbenchLink } from "@/components/ContentBlocks";
import { Checklist } from "@/components/Checklist";
import { AlsoBy, AppPreviewTable, AppleCreativeTable, AppleEventMediaTable, AppleScreenshotTable, AskAI, BeforeAfter, DoToday, Example, GooglePlayGraphicsTable, KeywordField } from "@/components/MdxBlocks";
function ExternalAwareLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) { const external = typeof props.href === "string" && /^https?:\/\//.test(props.href); return <a {...props}>{props.children}{external && <span className="external-mark" aria-hidden="true"> ↗</span>}</a>; }
// Names each scrolling table after its header row, so a page with several tables gets distinct regions.
const textOf = (node: ReactNode): string => typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(textOf).join(" ") : isValidElement<{ children?: ReactNode }>(node) ? textOf(node.props.children) : "";
function ResponsiveTable(props: TableHTMLAttributes<HTMLTableElement>) {
  const header = textOf(Children.toArray(props.children)[0]).replace(/\s+/g, " ").trim();
  return <div className="table-scroll" role="region" aria-label={header ? `Table: ${header}` : "Data table"} tabIndex={0}><table {...props}/></div>;
}
function Quote(props: BlockquoteHTMLAttributes<HTMLQuoteElement>) { return <blockquote className="mdx-quote" {...props}/>; }
const components: MDXComponents = { a: ExternalAwareLink, table: ResponsiveTable, blockquote: Quote, Callout, Claim, DirectAnswer, Figure, MetadataLimits, RevisionHistory, SourceList, SpecGrid, WorkbenchLink, AppPreviewTable, AppleCreativeTable, AppleEventMediaTable, AppleScreenshotTable, AskAI, BeforeAfter, DoToday, Example, GooglePlayGraphicsTable, Checklist, AlsoBy, KeywordField };
export function useMDXComponents(): MDXComponents { return components; }
