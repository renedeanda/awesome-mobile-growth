import type { Metadata } from "next";

export const site = {
  name: "Awesome Mobile Growth",
  shortName: "AMG",
  origin: "https://mobile.productbuilder.net",
  description: "A practical, evidence-aware field guide and private-by-default ASO workbench for people building better mobile products.",
  author: "René DeAnda",
  github: "https://github.com/renedeanda/awesome-mobile-growth",
  reviewed: "October 12, 2026",
};

export function absolute(path = "/") { return new URL(path, site.origin).toString(); }

const socialImage = {
  url: absolute("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: `${site.name} — a practical, evidence-aware ASO field guide`,
  type: "image/png",
};

export function pageMetadata({ title, description, path, type = "website" }: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const socialTitle = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: socialTitle,
      description,
      url: absolute(path),
      siteName: site.name,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage.url],
    },
  };
}
