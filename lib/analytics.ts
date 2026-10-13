export type AnalyticsProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function cleanPath(value: string) {
  const path = value.split(/[?#]/, 1)[0] || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function pageContext(pathname: string) {
  const pagePath = cleanPath(pathname);
  const section = pagePath.split("/").filter(Boolean)[0] ?? "home";
  return { page_path: pagePath, content_area: section };
}

export function sanitizedDestination(href: string, origin = "https://mobile.productbuilder.net") {
  try {
    const url = new URL(href, origin);
    const site = new URL(origin);
    if (!/^https?:$/.test(url.protocol) || url.origin === site.origin) return null;
    return { destination_host: url.hostname.replace(/^www\./, ""), destination_path: cleanPath(url.pathname) };
  } catch {
    return null;
  }
}

/** Analytics is optional and must never interrupt a visitor action. */
export function trackEvent(name: string, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  if (!/^[a-z][a-z0-9_]{0,39}$/.test(name)) return false;
  const clean = Object.fromEntries(Object.entries({ ...pageContext(window.location.pathname), ...properties })
    .filter(([key, value]) => /^[a-z][a-z0-9_]{0,39}$/.test(key) && value !== undefined && (typeof value !== "number" || Number.isFinite(value)))
    .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]));
  try {
    window.gtag("event", name, clean);
    return true;
  } catch {
    return false;
  }
}
