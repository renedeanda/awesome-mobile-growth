import type { Metadata } from "next";

export const site = {
  name: "Awesome Mobile Growth",
  shortName: "AMG",
  origin: "https://mobile.productbuilder.net",
  description: "Evidence-aware App Store Optimization, Apple and Google Play launch guides, free browser-local tools, mobile growth strategy, and an open AI skill.",
  author: "René DeAnda",
  github: "https://github.com/renedeanda/awesome-mobile-growth",
  reviewed: "October 12, 2026",
};

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

export function absolute(path = "/") { return new URL(path, site.origin).toString(); }

const socialImage = {
  url: absolute("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: `${site.name} — a practical, evidence-aware ASO field guide`,
  type: "image/png",
};

export function pageMetadata({ title, description, path, type = "website", imagePath, imageAlt }: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imagePath?: string;
  imageAlt?: string;
}): Metadata {
  const image = imagePath ? { ...socialImage, url: absolute(imagePath), alt: imageAlt ?? socialImage.alt } : socialImage;
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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}
