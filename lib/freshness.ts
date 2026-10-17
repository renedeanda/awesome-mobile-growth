// Dates that must not quietly go stale. The weekly CI run executes the tests that use these, so a change
// still marked "Upcoming" after its date, or a review older than the window, shows up as a failing build.
type Dated = { slug: string; date: string; status: string };

const days = (from: string, to: string) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;

/** Changes still marked Upcoming although their effective date has passed. */
export const overdueUpcoming = (items: Dated[], today: string) => items.filter((item) => item.status === "Upcoming" && item.date <= today);

/** Entries whose last check is older than `maxDays`. */
export const staleChecks = (items: Array<{ label: string; checked: string }>, today: string, maxDays = 180) =>
  items.filter((item) => days(item.checked, today) > maxDays);
