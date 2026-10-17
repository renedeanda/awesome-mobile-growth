import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const shortcut = (name: string, url: string, description: string, icon = "/icons/192.png") => ({ name, url, description, icons: [{ src: icon, sizes: "192x192", type: "image/png" }] });

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/", scope: "/", start_url: "/",
    name: "Awesome Mobile Growth", short_name: "Growth",
    description: "Sourced guides, specs and free tools for launching and growing apps on the App Store and Google Play.",
    display: "standalone", background_color: "#f2efe7", theme_color: "#f2efe7",
    categories: ["business", "developer", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      shortcut("Workbench", "/workbench/", "Check name, subtitle and keyword limits"),
      shortcut("Frame studio", "/tools/screenshot-frames/", "Frame screenshots at store sizes", "/icons/frames-192.png"),
      shortcut("Launch checklist", "/launch/checklist/", "Track what’s left before you submit"),
      shortcut("Screenshot sizes", "/screenshot-sizes/", "Pixel sizes for every device"),
    ],
  };
}
