// Launch countdown: turns a launch date into a start date for each checklist phase.
// Dates are calendar days (YYYY-MM-DD) so time zones never shift a phase by one day.

export type Phase = { title: string; startDaysBefore: number };

const DAY = 86_400_000;
const parse = (iso: string) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
export const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parse(value));
export const addDays = (iso: string, days: number) => new Date(parse(iso) + days * DAY).toISOString().slice(0, 10);
export const daysBetween = (from: string, to: string) => Math.round((parse(to) - parse(from)) / DAY);
export const localToday = (now = new Date()) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

export function schedule(phases: Phase[], launch: string, today: string) {
  const dated = phases.map((phase) => ({ ...phase, start: addDays(launch, -phase.startDaysBefore) }));
  // The current phase is the one that started most recently; phases sharing a start run together.
  const started = dated.filter((phase) => phase.start <= today);
  const latest = started.length ? started[started.length - 1].start : undefined;
  return dated.map((phase) => ({ ...phase, current: phase.start === latest, upcoming: phase.start > today }));
}

export function countdownLabel(launch: string, today: string) {
  const days = daysBetween(today, launch);
  if (days > 1) return `${days} days to launch`;
  if (days === 1) return "Launch is tomorrow";
  if (days === 0) return "Launch day";
  return `Launched ${-days} day${days === -1 ? "" : "s"} ago`;
}

const icsDate = (iso: string) => iso.replaceAll("-", "");
const icsText = (text: string) => text.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");

/** An all-day calendar event for each phase start and for launch day. */
export function toIcs(phases: Phase[], launch: string, app = "your app") {
  const stamp = `${icsDate(launch)}T000000Z`;
  const event = (date: string, summary: string, id: string) => ["BEGIN:VEVENT", `UID:${id}-${icsDate(launch)}@mobile.productbuilder.net`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDate(date)}`, `DTEND;VALUE=DATE:${icsDate(addDays(date, 1))}`, `SUMMARY:${icsText(summary)}`, "URL:https://mobile.productbuilder.net/launch/checklist/", "END:VEVENT"];
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Mobile Growth//Launch checklist//EN", "CALSCALE:GREGORIAN",
    ...phases.flatMap((phase, index) => event(addDays(launch, -phase.startDaysBefore), `${phase.title}: start (${app} launch)`, `phase-${index}`)),
    ...event(launch, `Launch day: ${app}`, "launch"), "END:VCALENDAR"];
  return lines.join("\r\n") + "\r\n";
}
