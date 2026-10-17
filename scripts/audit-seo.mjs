import fs from "node:fs";
import path from "node:path";

if (!fs.existsSync("out")) {
  console.error("Build out/ first.");
  process.exit(1);
}

const html = [];
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
  const file = path.join(directory, entry.name);
  entry.isDirectory() ? walk(file) : entry.name.endsWith(".html") && html.push(file);
});
walk("out");

const errors = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const meta = (source, key, attribute = "name") => source.match(new RegExp(`<meta ${attribute}="${key}" content="([^"]+)"`))?.[1];

for (const file of html) {
  const source = fs.readFileSync(file, "utf8");
  if (file.endsWith("404.html") || file.includes(`${path.sep}404${path.sep}`) || file.includes(`${path.sep}_not-found${path.sep}`)) {
    if (!/noindex/.test(source)) errors.push(`${file}: 404 must be noindex`);
    continue;
  }
  // Utility pages that opt out of indexing (the offline fallback) need no search metadata.
  if (/<meta name="robots" content="noindex/.test(source)) continue;

  const title = source.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = meta(source, "description");
  const canonical = source.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1 = (source.match(/<h1/g) || []).length;

  if (h1 !== 1) errors.push(`${file}: expected one h1, got ${h1}`);
  if (!title) errors.push(`${file}: missing title`);
  if (!description) errors.push(`${file}: missing meta description`);
  if (!canonical?.startsWith("https://mobile.productbuilder.net/")) errors.push(`${file}: missing production canonical`);
  if (!meta(source, "og:title", "property")) errors.push(`${file}: missing og:title`);
  if (!meta(source, "og:description", "property")) errors.push(`${file}: missing og:description`);
  if (!meta(source, "og:image", "property")) errors.push(`${file}: missing og:image`);
  if (!meta(source, "og:image:alt", "property")) errors.push(`${file}: missing og:image:alt`);
  // Every social card must be a file in the export, as a 1200 × 630 PNG.
  const image = meta(source, "og:image", "property");
  if (image?.startsWith("https://mobile.productbuilder.net/")) {
    const card = path.join("out", new URL(image).pathname);
    if (!fs.existsSync(card)) errors.push(`${file}: og:image ${image} is not in out/`);
    else {
      const png = fs.readFileSync(card);
      if (png.readUInt32BE(0) !== 0x89504e47 || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) errors.push(`${file}: og:image ${image} is not a 1200 × 630 PNG`);
    }
  }
  const bare = (url) => url?.split("?")[0];
  if (image && bare(meta(source, "twitter:image")) !== bare(image)) errors.push(`${file}: twitter:image doesn't match og:image`);
  if (!meta(source, "twitter:card")) errors.push(`${file}: missing twitter:card`);
  if (!source.includes('type="application/ld+json"')) errors.push(`${file}: missing structured data`);
  if (!source.includes('<html lang="en"')) errors.push(`${file}: missing document language`);

  // Search results show about 60–70 characters of a title and 150–170 of a description.
  const visible = (text) => text.replace(/&#x27;|&#39;|&quot;|&amp;|&lt;|&gt;/g, "_").length;
  if (title && visible(title) > 70 && !file.includes("404")) errors.push(`${file}: title is ${visible(title)} characters (keep it to 70)`);
  if (description && visible(description) > 160) errors.push(`${file}: description is ${visible(description)} characters (keep it to 160)`);

  if (title) {
    if (seenTitles.has(title)) errors.push(`${file}: duplicate title also used by ${seenTitles.get(title)}`);
    seenTitles.set(title, file);
  }
  if (description) {
    if (seenDescriptions.has(description)) errors.push(`${file}: duplicate description also used by ${seenDescriptions.get(description)}`);
    seenDescriptions.set(description, file);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`SEO audit passed: ${html.length} HTML pages with unique metadata, social cards, canonicals, and structured data.`);
