// Checks every external link in the built site.
// Apple serves missing help pages with HTTP 200 and a "Page Not Found" title,
// so a status-code check alone misses them; this audit reads the title too.
// Official Apple/Google pages fail on any soft or hard 404; other sites fail only on a hard 404/410,
// because many block automated requests (403, 429) while working fine for people.
import fs from "node:fs";
import path from "node:path";

const OFFICIAL_HOSTS = ["developer.apple.com", "support.google.com", "developer.android.com", "firebase.google.com", "play.google.com"];
const NOT_FOUND_TITLE = /page not found|404|not found|can.t be found/i;
const CONCURRENCY = 6;

const files = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) walk(full);
  else if (entry.name.endsWith(".html")) files.push(full);
});
if (!fs.existsSync("out")) { console.error("Run `npm run build` first: out/ is missing."); process.exit(1); }
walk("out");

const pagesByUrl = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const [, raw] of html.matchAll(/href="(https:\/\/[^"]+)"/g)) {
    const url = raw.replace(/&amp;/g, "&").split("#")[0];
    if (!pagesByUrl.has(url)) pagesByUrl.set(url, new Set());
    pagesByUrl.get(url).add(path.relative("out", file));
  }
}

async function check(url) {
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "awesome-mobile-growth-link-audit" } });
    if (response.status === 404 || response.status === 410) return { url, problem: `HTTP ${response.status}` };
    if (!response.ok) return { url, warning: `HTTP ${response.status}` };
    const title = (await response.text()).match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
    if (NOT_FOUND_TITLE.test(title)) return OFFICIAL_HOSTS.includes(new URL(url).hostname) ? { url, problem: `soft 404 ("${title}")` } : { url, warning: `title looks like a 404 ("${title}")` };
    return { url };
  } catch (error) {
    return { url, warning: `unreachable (${error.cause?.code ?? error.name})` };
  }
}

const urls = [...pagesByUrl.keys()];
const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) results.push(...await Promise.all(urls.slice(i, i + CONCURRENCY).map(check)));

const problems = results.filter((r) => r.problem);
const warnings = results.filter((r) => r.warning);
for (const r of warnings) console.warn(`warn  ${r.warning}  ${r.url}`);
for (const r of problems) console.error(`FAIL  ${r.problem}  ${r.url}\n      used on: ${[...pagesByUrl.get(r.url)].slice(0, 5).join(", ")}`);
if (problems.length) process.exit(1);
console.log(`External link audit passed: ${urls.length} external links checked${warnings.length ? `, ${warnings.length} could not be reached` : ""}.`);
