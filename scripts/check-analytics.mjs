// Runs before every build. Analytics is optional, so a bad or missing ID never fails the build, but on a Vercel
// production build it says so plainly instead of shipping a site that silently records nothing.
const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const production = process.env.VERCEL_ENV === "production";

if (!id) {
  if (production) console.warn("⚠ Analytics off: NEXT_PUBLIC_GA_MEASUREMENT_ID is not set for Production. Add the Mobile Growth GA4 property's ID in Vercel and redeploy.");
} else if (!/^G-[A-Z0-9]+$/.test(id)) {
  console.warn(`⚠ Analytics off: NEXT_PUBLIC_GA_MEASUREMENT_ID "${id}" is not a GA4 measurement ID (G-…).`);
} else if (production) {
  console.log(`Analytics: GA4 ${id}. It should be Mobile Growth's own property, not productbuilder.net's.`);
}
