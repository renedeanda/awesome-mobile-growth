// Content audit: guide structure, voice, public-repository hygiene and read-time accuracy.
// Runs after `npm run build` (the read-time check reads the exported HTML in out/).
import fs from "node:fs";
import path from "node:path";

const bad = [];
const walk = (dir, test, found = []) => {
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, test, found);
    else if (test(entry.name)) found.push(file);
  }
  return found;
};

// 1. Every guide is substantive, has sections and a loader.
const sections = ["launch", "store-page", "grow", "learn"];
const loaders = fs.readFileSync("lib/articles/loaders.ts", "utf8");
for (const section of sections) {
  for (const file of walk(path.join("content", section), (name) => name.endsWith(".mdx"))) {
    const text = fs.readFileSync(file, "utf8");
    const key = `${section}/${path.basename(file, ".mdx")}`;
    if (text.length < 1500) bad.push(`${file}: thin (${text.length} characters)`);
    if ((text.match(/^## /gm) ?? []).length < 3) bad.push(`${file}: needs at least three ## sections`);
    if (!loaders.includes(`"${key}"`)) bad.push(`${file}: missing from lib/articles/loaders.ts`);
  }
}

// 2. Voice: phrases banned by docs/EDITORIAL.md, across every public text source.
const BANNED = ["product truth", "truthful promise", "honest promise", "fake precision", "invented certainty", "evidence-aware", "operating desk", "field lab", "field manual", "working desk", "launch desk", "decision-focused", "decision-ready", "visual argument", "earned moment", "game-changer", "unlock the power", "ever-evolving", "in today’s", "in today's", "seamless", "leverage", "delve", "elevate your", "empower", "holistic", "synergy", "cutting-edge", "best-in-class", "world-class", "supercharge", "worth noting", "honest caveat", "let’s dive", "let's dive", "dive into", "in conclusion", "allergic to", "—not"];
const publicFiles = ["app", "components", "content", "lib", "skills"].flatMap((dir) => walk(dir, (name) => /\.(?:mdx?|tsx?)$/.test(name) && !/\.test\.ts$/.test(name)));
for (const file of publicFiles) {
  const text = fs.readFileSync(file, "utf8").toLowerCase();
  for (const phrase of BANNED) {
    const at = text.indexOf(phrase);
    if (at >= 0) bad.push(`${file}:${text.slice(0, at).split("\n").length}: banned phrase "${phrase}" (see docs/EDITORIAL.md#voice)`);
  }
}

// 3. Public-repository hygiene (see AGENTS.md).
const allowedRoot = new Set(["AGENTS.md", "CODE_OF_CONDUCT.md", "CONTRIBUTING.md", "README.md", "SECURITY.md"]);
for (const file of fs.readdirSync(".").filter((name) => name.endsWith(".md"))) if (!allowedRoot.has(file)) bad.push(`${file}: unexpected root Markdown; publish useful material as a guide or keep maintainer notes outside the repository`);
for (const file of fs.readdirSync("docs").filter((name) => name.endsWith(".md"))) if (file !== "EDITORIAL.md") bad.push(`docs/${file}: unexpected public documentation; keep only visitor or contributor value`);
const readme = fs.readFileSync("README.md", "utf8");
if (/^## After deployment$/m.test(readme) || /owner-only/i.test(readme)) bad.push("README.md: contains maintainer-only operations; report those privately instead of publishing them");
if (/NEXT_PUBLIC_(?:GOOGLE|BING|SITE)_VERIFICATION/.test(fs.readFileSync("app/layout.tsx", "utf8") + fs.readFileSync(".env.example", "utf8"))) bad.push("Site verification tokens do not belong in public runtime environment variables");
const forbidden = [/\/Users\/renedeanda/i, /iBootstrap/i, /agent-memory/i];
for (const file of [...publicFiles, ...walk("docs", (name) => name.endsWith(".md"))]) {
  const text = fs.readFileSync(file, "utf8");
  if (forbidden.some((pattern) => pattern.test(text))) bad.push(`${file}: private repository or local-machine detail`);
}

// 4. Read-time labels must match the rendered page (220 wpm, generous tolerance for headers and cards).
for (const file of walk("out", (name) => name === "index.html")) {
  const html = fs.readFileSync(file, "utf8");
  const label = html.match(/class="article-meta__facts"><span>(\d+) min read/);
  const main = html.match(/<main[\s\S]*?<\/main>/);
  if (!label || !main) continue;
  const words = main[0].replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const expected = words / 220;
  const shown = Number(label[1]);
  if (shown > expected * 1.5 + 1 || shown < expected * 0.5 - 1) bad.push(`${file}: shows ${shown} min read but has ~${words} words (~${Math.max(1, Math.round(expected))} min)`);
}

if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log(`Content audit passed: ${publicFiles.length} public files, voice rules and read times.`);
