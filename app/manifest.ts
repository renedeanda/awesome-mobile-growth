import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Awesome Mobile Growth", short_name: "AMG",
    description: "Sourced guides, specs and free tools for launching and growing apps on the App Store and Google Play.",
    start_url: "/", display: "standalone", background_color: "#f2efe7", theme_color: "#1557d6",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
