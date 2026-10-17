import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { utf8Bytes } from "./workbench.ts";

// Keyword examples are measured by <KeywordField>; this keeps every example a valid Apple field.
const files = fs.readdirSync("content", { recursive: true }).map(String).filter((file) => file.endsWith(".mdx")).map((file) => path.join("content", file));
const examples = files.flatMap((file) => [...fs.readFileSync(file, "utf8").matchAll(/<KeywordField value="([^"]+)"/g)].map((match) => ({ file, value: match[1] })));

describe("keyword field examples", () => {
  it("exist", () => assert.ok(examples.length >= 2));
  for (const { file, value } of examples) it(`${file}: fits Apple's 100 bytes`, () => assert.ok(utf8Bytes(value) <= 100, `${utf8Bytes(value)} bytes`));
  it("keep the guide's numbers", () => assert.deepEqual(examples.map(({ value }) => utf8Bytes(value)), [88, 86]));
});
