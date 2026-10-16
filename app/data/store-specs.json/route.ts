import { appleCreativeAssets, appleScreenshotClasses, appleScreenshotRules, appleScreenshotSource, appleCreativeSource, googleGraphicsSource, googlePlayGraphics, specsChecked } from "@/lib/storeSpecs";
import { platformRules } from "@/lib/platform";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    schemaVersion: 2,
    checked: specsChecked,
    disclaimer: "Check the linked official page before delivery; store requirements change.",
    metadata: Object.values(platformRules).map(({ platform, label, limit, unit, source }) => ({ platform, field: label, limit, unit, source })),
    apple: { screenshots: { rules: appleScreenshotRules, classes: appleScreenshotClasses, source: appleScreenshotSource }, creativeAssets: { items: appleCreativeAssets, source: appleCreativeSource } },
    googlePlay: { graphics: googlePlayGraphics, source: googleGraphicsSource },
  });
}
