// Scaffold a new guide: npm run content:new -- --section store-page --slug your-slug
import fs from "node:fs";
const arg = (name) => { const index = process.argv.indexOf(`--${name}`); return index >= 0 ? process.argv[index + 1] : ""; };
const section = arg("section"), slug = arg("slug");
if (!["launch", "store-page", "grow", "learn"].includes(section) || !/^[a-z0-9-]+$/.test(slug)) { console.error("Usage: npm run content:new -- --section launch|store-page|grow|learn --slug your-slug"); process.exit(1); }
const file = `content/${section}/${slug}.mdx`;
if (fs.existsSync(file)) { console.error(`${file} exists`); process.exit(1); }
fs.writeFileSync(file, "## The answer first\n\nSay what to do, then why.\n\n## The details\n\nLimits, sizes, screen paths and a worked example.\n\n<DoToday>\n\n1. One thing the reader can finish today.\n\n</DoToday>\n");
console.log(`Created ${file}. Add its entry to lib/articles/ and its loader to lib/articles/loaders.ts (see docs/EDITORIAL.md#voice).`);
