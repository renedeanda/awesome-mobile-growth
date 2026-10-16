import type { Evidence } from "../evidence.ts";

export type SectionId = "launch" | "store-page" | "grow" | "learn";
export type Platform = "apple" | "google-play";
export type Source = { label: string; href: string };

export type ArticleSource = {
  section: SectionId;
  slug: string;
  /** Short label used in cards, breadcrumbs and the menu. */
  label: string;
  /** The H1. */
  title: string;
  /** The <title> and social title; written for search. */
  seoTitle: string;
  /** Meta description and lede. */
  description: string;
  /** The "In brief" answer shown under the title. */
  answer: string;
  platforms: Platform[];
  evidence: Evidence[];
  published: string;
  reviewed: string;
  sources: Source[];
  /** Paths of related pages, shown at the end of the article. */
  related: string[];
};
