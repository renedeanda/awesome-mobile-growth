import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export const dynamic = "force-static";

// AI assistants and their search crawlers are welcome: the site is static, every claim is sourced,
// and /llms.txt plus /llms-full.txt give them a clean index. Listing them makes the policy explicit.
const aiAgents = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, { userAgent: aiAgents, allow: "/" }],
    sitemap: absolute("/sitemap.xml"),
    host: "mobile.productbuilder.net",
  };
}
