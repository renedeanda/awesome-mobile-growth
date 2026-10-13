import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: { root: process.cwd() },
};

const withMDX = createMDX({ extension: /\.mdx?$/, options: { remarkPlugins: ["remark-gfm"], rehypePlugins: ["rehype-slug"] } });
export default withMDX(nextConfig);
