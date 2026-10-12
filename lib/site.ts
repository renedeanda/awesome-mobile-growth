export const site = {
  name: "Awesome Mobile Growth",
  shortName: "AMG",
  origin: "https://mobile.productbuilder.net",
  description: "A practical, evidence-aware field guide and private-by-default ASO workbench for people building better mobile products.",
  author: "René DeAnda",
  github: "https://github.com/renedeanda/awesome-mobile-growth",
  reviewed: "October 11, 2026",
};

export function absolute(path = "/") { return new URL(path, site.origin).toString(); }
