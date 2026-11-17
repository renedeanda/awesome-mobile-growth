import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { isPreviewBuild } from "./scripts/lib/build-env.mjs";

const nextConfig: NextConfig = {
  output: "export",
  // Preview builds (Vercel or Cloudflare) ship without Google Analytics, so they never count as visits.
  env: {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: isPreviewBuild() ? "" : (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ""),
  },
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: { root: process.cwd() },
};

const withMDX = createMDX({ extension: /\.mdx?$/, options: { remarkPlugins: ["remark-gfm"], rehypePlugins: ["rehype-slug"] } });
export default withMDX(nextConfig);
