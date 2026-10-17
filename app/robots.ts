import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

// Agents that search or fetch pages to answer someone's question are welcome: the site is static,
// every claim is sourced, and /llms.txt plus /llms-full.txt give them a clean index.
const answerAgents = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, { userAgent: answerAgents, allow: "/" }],
    sitemap: absolute("/sitemap.xml"),
    host: "mobile.productbuilder.net",
  };
}
