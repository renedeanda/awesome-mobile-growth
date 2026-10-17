import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, countdownLabel, isIsoDate, schedule, toIcs } from "./countdown.ts";

const phases = [{ title: "Foundation", startDaysBefore: 21 }, { title: "Declarations", startDaysBefore: 21 }, { title: "Store page", startDaysBefore: 14 }, { title: "Launch", startDaysBefore: 7 }, { title: "After launch", startDaysBefore: 0 }];

describe("launch countdown", () => {
  it("adds days across month and year ends", () => { assert.equal(addDays("2026-12-25", 10), "2027-01-04"); assert.equal(addDays("2027-03-01", -1), "2027-02-28"); });
  it("validates dates", () => { assert.ok(isIsoDate("2026-11-02")); assert.ok(!isIsoDate("2026-11")); });
  it("dates each phase and marks every phase sharing the current start", () => {
    const rows = schedule(phases, "2026-11-20", "2026-11-01");
    assert.deepEqual(rows.map((row) => row.start), ["2026-10-30", "2026-10-30", "2026-11-06", "2026-11-13", "2026-11-20"]);
    assert.deepEqual(rows.filter((row) => row.current).map((row) => row.title), ["Foundation", "Declarations"]);
  });
  it("has no current phase before the first one starts", () => assert.ok(schedule(phases, "2026-12-31", "2026-10-16").every((row) => !row.current && row.upcoming)));
  it("labels the countdown", () => {
    assert.equal(countdownLabel("2026-10-20", "2026-10-16"), "4 days to launch");
    assert.equal(countdownLabel("2026-10-16", "2026-10-16"), "Launch day");
    assert.equal(countdownLabel("2026-10-15", "2026-10-16"), "Launched 1 day ago");
  });
  it("writes a calendar with one event per phase plus launch day", () => {
    const ics = toIcs(phases, "2026-11-20", "Daybook, beta");
    assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 6);
    assert.match(ics, /DTSTART;VALUE=DATE:20261030/);
    assert.match(ics, /SUMMARY:Launch day: Daybook\\, beta/);
    assert.ok(ics.includes("\r\n"));
  });
});
