import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";

const source = path.resolve("skills/app-store-growth");
const outputDir = path.resolve("public/downloads");
const output = path.join(outputDir, "app-store-growth-v1.0.0.tgz");
const files = [];
function walk(dir) { for (const item of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, item.name); if (item.isDirectory()) walk(file); else files.push(file); } }
function octal(value, length) { return `${value.toString(8).padStart(length - 1, "0")}\0`; }
function header(name, size) {
  const block = Buffer.alloc(512); const write = (value, offset, length) => block.write(value, offset, Math.min(length, Buffer.byteLength(value)), "utf8");
  write(name, 0, 100); write("0000755\0", 100, 8); write("0000000\0", 108, 8); write("0000000\0", 116, 8); write(octal(size, 12), 124, 12); write(octal(0, 12), 136, 12); block.fill(32, 148, 156); block[156] = "0".charCodeAt(0); write("ustar\0", 257, 6); write("00", 263, 2); const sum = block.reduce((total, byte) => total + byte, 0); write(`${sum.toString(8).padStart(6, "0")}\0 `, 148, 8); return block;
}
walk(source);
const parts = [];
for (const file of files.sort()) { const body = fs.readFileSync(file); const name = `app-store-growth/${path.relative(source, file).split(path.sep).join("/")}`; parts.push(header(name, body.length), body, Buffer.alloc((512 - body.length % 512) % 512)); }
parts.push(Buffer.alloc(1024)); fs.mkdirSync(outputDir, { recursive: true }); const archive = zlib.gzipSync(Buffer.concat(parts), { level: 9, mtime: 0 }); fs.writeFileSync(output, archive); fs.writeFileSync(`${output}.sha256`, `${crypto.createHash("sha256").update(archive).digest("hex")}  ${path.basename(output)}\n`); console.log(`Built ${path.relative(process.cwd(), output)} (${files.length} files).`);
