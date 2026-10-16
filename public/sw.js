// Offline support. Pages are network-first so visitors always get the latest guide when online;
// the last copy of each page they read is kept for offline use. Hashed build assets are cache-first.
const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const OFFLINE = "/offline/";
const PRECACHE = ["/", OFFLINE, "/launch/checklist/", "/workbench/", "/screenshot-sizes/", "/search-index.json"];
const MAX_PAGES = 80;

// A cached page is only usable offline with its scripts and styles, so precaching a page also
// caches every build asset its HTML references.
const assetsIn = (html) => [...new Set(html.match(/\/_next\/static\/[^"'\s)\\]+/g) ?? [])];

async function precache() {
  const pages = await caches.open(PAGES);
  await pages.addAll(PRECACHE);
  const html = await Promise.all(PRECACHE.filter((path) => path.endsWith("/")).map(async (path) => (await pages.match(path))?.text() ?? ""));
  await (await caches.open(ASSETS)).addAll([...new Set(html.flatMap(assetsIn))]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== PAGES && key !== ASSETS).map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});

// Drops the oldest pages beyond MAX_PAGES; the precached pages always stay.
async function trim(cache) {
  const keys = (await cache.keys()).filter((key) => !PRECACHE.includes(new URL(key.url).pathname));
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_PAGES)).map((key) => cache.delete(key)));
}

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") { await cache.put(request, response.clone()); trim(cache); }
    return response;
  } catch {
    return (await cache.match(request, { ignoreSearch: request.mode === "navigate" })) ?? (request.mode === "navigate" ? cache.match(OFFLINE) : Response.error());
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_next/static/")) event.respondWith(cacheFirst(request));
  // Link prefetches (?_rsc) are left to the network: caching them would fill the cache with pages nobody opened.
  // Offline, a failed prefetch makes Next fall back to a full navigation, which is served from the cache.
  else if (request.mode === "navigate" || url.pathname === "/search-index.json") event.respondWith(networkFirst(request));
});
