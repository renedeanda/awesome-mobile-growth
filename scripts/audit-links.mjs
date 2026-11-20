// Internal link audit: every internal href in the export resolves, and every redirect in public/_redirects
// points at a page that exists without chaining through another redirect.
import fs from "node:fs";
import path from "node:path";

const files = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => { const file = path.join(dir, entry.name); entry.isDirectory() ? walk(file) : entry.name.endsWith(".html") && files.push(file); });
walk("out");
const exists = (href) => { const clean = href === "/" ? "index.html" : href.replace(/^\//, ""); return fs.existsSync(clean.endsWith("/") ? path.join("out", clean, "index.html") : path.join("out", clean)); };

const missing = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    if (href.startsWith("/_next")) continue;
    if (!exists(href)) missing.push(`${file}: ${href}`);
  }
}

const redirects = fs.readFileSync("public/_redirects", "utf8").split("\n").filter((line) => line.trim() && !line.startsWith("#")).map((line) => { const [source, destination] = line.trim().split(/\s+/); return { source, destination }; });
const sources = new Set(redirects.map(({ source }) => source));
for (const { source, destination } of redirects) {
  if (!exists(destination)) missing.push(`_redirects: ${source} → ${destination} (destination missing)`);
  if (sources.has(destination) || sources.has(destination.replace(/\/$/, ""))) missing.push(`_redirects: ${source} → ${destination} (chains into another redirect)`);
  if (exists(source.endsWith("/") ? source : `${source}/`)) missing.push(`_redirects: ${source} still exists as a page, so the redirect hides it`);
}

if (missing.length) { console.error(missing.join("\n")); process.exit(1); }
console.log(`Internal link audit passed: ${files.length} pages, ${redirects.length} redirects.`);
