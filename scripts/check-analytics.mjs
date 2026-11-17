// Runs before every build. Analytics is optional, so a bad or missing ID never fails the build, but on a
// production build (Vercel, or a Cloudflare Workers build of the production branch) it says so plainly instead of
// shipping a site that silently records nothing.
import { isPreviewBuild } from "./lib/build-env.mjs";

const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const production = process.env.VERCEL_ENV === "production" || (Boolean(process.env.WORKERS_CI_BRANCH) && !isPreviewBuild());

if (!id) {
  if (production) console.warn("⚠ Analytics off: NEXT_PUBLIC_GA_MEASUREMENT_ID is not set for Production. Add the Mobile Growth GA4 property's ID as a production build variable and redeploy.");
} else if (!/^G-[A-Z0-9]+$/.test(id)) {
  console.warn(`⚠ Analytics off: NEXT_PUBLIC_GA_MEASUREMENT_ID "${id}" is not a GA4 measurement ID (G-…).`);
} else if (production) {
  console.log(`Analytics: GA4 ${id}. It should be Mobile Growth's own property, not productbuilder.net's.`);
}
