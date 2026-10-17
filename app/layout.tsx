import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ServiceWorker } from "@/components/ServiceWorker";
import { site, absolute } from "@/lib/site";
import { PLATFORM_SCRIPT } from "@/lib/platformDetect";
import "./globals.css";

const image = {
  url: absolute("/opengraph-image"), width: 1200, height: 630,
  alt: `${site.name}: App Store and Google Play guides`, type: "image/png",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#101114" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: `${site.name}: App Store and Google Play launch and ASO guides`, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.author, url: "https://productbuilder.net" }],
  creator: site.author,
  alternates: { canonical: "/", types: { "application/atom+xml": "/feed.xml" } },
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  openGraph: { type: "website", title: site.name, description: site.description, url: site.origin, siteName: site.name, images: [image] },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: [image.url] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.origin, description: site.description, publisher: { "@id": `${site.origin}/#publisher` } },
    { "@context": "https://schema.org", "@type": "Person", "@id": `${site.origin}/#publisher`, name: site.author, url: "https://productbuilder.net", sameAs: [site.github] },
  ];
  // The pre-paint script sets data-platform on <html>, so React must not treat it as a mismatch.
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: PLATFORM_SCRIPT }}/></head><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <a className="skip" href="#main">Skip to content</a><SiteHeader/><main id="main" className="page">{children}</main><SiteFooter/><GoogleAnalytics/><ServiceWorker/>
  </body></html>;
}
