import { LIMITS } from "./platform.ts";
export { LIMITS } from "./platform.ts";
export type ListingFields = Record<keyof typeof LIMITS | "appleDescription" | "appleWhatsNew", string>;
export const emptyFields: ListingFields = { appleName: "", appleSubtitle: "", applePromotional: "", appleKeywords: "", appleDescription: "", appleWhatsNew: "", googleName: "", googleShort: "", googleFull: "" };
export type StrategyBrief = { product: string; audience: string; job: string; promise: string; proof: string; exclusions: string };
export type WorkbenchData = { version: 2; updatedAt: string; brief: StrategyBrief; fields: ListingFields; keywordMap: string; screenshotPlan: string; experimentLog: string; launchRetro: string };
const emptyBrief: StrategyBrief = { product: "", audience: "", job: "", promise: "", proof: "", exclusions: "" };
export const emptyWorkbench = (): WorkbenchData => ({ version: 2, updatedAt: new Date().toISOString(), brief: { ...emptyBrief }, fields: { ...emptyFields }, keywordMap: "", screenshotPlan: "", experimentLog: "", launchRetro: "" });
export function migrateWorkbench(input: unknown): WorkbenchData {
  const fresh = emptyWorkbench();
  if (!input || typeof input !== "object") return fresh;
  const source = input as Partial<WorkbenchData> & { version?: number };
  return { ...fresh, ...source, version: 2, updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : fresh.updatedAt, brief: { ...emptyBrief, ...(source.brief ?? {}) }, fields: { ...emptyFields, ...(source.fields ?? {}) } };
}
export const utf8Bytes = (value: string) => new TextEncoder().encode(value).length;
export const keywordTokens = (value: string) => value.split(",").map((v) => v.trim().toLocaleLowerCase()).filter(Boolean);
export const duplicates = (value: string) => { const seen = new Set<string>(); return [...new Set(keywordTokens(value).filter((t) => seen.has(t) || !seen.add(t)))]; };
export const warnings = (value: string) => {
  const patterns = [
    [/\b(best|#1|number one|leading|perfect|guaranteed)\b/i, "Avoid unverifiable superlatives or guarantees."],
    [/\b(StoreKit|SwiftData|CoreData|TelemetryDeck|framework|API)\b/i, "Public copy should describe customer value, not implementation details."],
    [/\b(free|discount|sale|cheapest|price)\b/i, "Review price language carefully; availability and pricing can change."],
    [/\p{Extended_Pictographic}/u, "Emoji can distract or trigger policy concerns in some metadata fields."],
  ] as const;
  return patterns.filter(([pattern]) => pattern.test(value)).map(([, message]) => message);
};
export function parseLocaleBundle(input: unknown): Partial<ListingFields> {
  if (!input || typeof input !== "object") throw new Error("That file does not contain a metadata object.");
  const root = input as Record<string, unknown>;
  const candidate = (root.localizations && typeof root.localizations === "object" ? Object.values(root.localizations as Record<string, unknown>)[0] : root) as Record<string, unknown>;
  const value = (...keys: string[]) => { for (const key of keys) if (typeof candidate[key] === "string") return candidate[key] as string; return ""; };
  return { appleName: value("name", "appName"), appleSubtitle: value("subtitle"), applePromotional: value("promotionalText", "promotional_text"), appleDescription: value("description"), appleKeywords: value("keywords"), appleWhatsNew: value("whatsNew", "whats_new") };
}
export function toMarkdown(data: WorkbenchData) {
  const f = data.fields;
  return `# ASO working brief\n\n_Exported ${data.updatedAt.slice(0, 10)} from Awesome Mobile Growth._\n\n## Product strategy\n\n- **Product:** ${data.brief.product}\n- **Audience:** ${data.brief.audience}\n- **Job to be done:** ${data.brief.job}\n- **Promise:** ${data.brief.promise}\n- **Proof:** ${data.brief.proof}\n- **Not for:** ${data.brief.exclusions}\n\n## Apple metadata\n\n- **Name:** ${f.appleName}\n- **Subtitle:** ${f.appleSubtitle}\n- **Promotional text:** ${f.applePromotional}\n- **Keywords:** ${f.appleKeywords}\n\n### Description\n\n${f.appleDescription}\n\n### What’s New\n\n${f.appleWhatsNew}\n\n## Google Play metadata\n\n- **App name:** ${f.googleName}\n- **Short description:** ${f.googleShort}\n\n### Full description\n\n${f.googleFull}\n\n## Keyword map\n\n${data.keywordMap}\n\n## Screenshot plan\n\n${data.screenshotPlan}\n\n## Experiment log\n\n${data.experimentLog}\n\n## Launch retrospective\n\n${data.launchRetro}\n`;
}
