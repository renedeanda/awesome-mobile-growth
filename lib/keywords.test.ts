import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { packKeywords, words } from "./keywords.ts";

describe("keyword packer", () => {
  it("splits phrases into lowercase words in order", () => assert.deepEqual(words("Mood Tracker, daily-journal\nCafé"), ["mood", "tracker", "daily-journal", "café"]));
  it("drops words already in the name or subtitle", () => {
    const packed = packKeywords("journal, mood tracker", "Daybook: Private Journal");
    assert.equal(packed.field, "mood,tracker");
    assert.deepEqual(packed.skipped, [{ word: "journal", reason: "in-name" }]);
  });
  it("skips plurals of words it has, and the word app", () => {
    const packed = packKeywords("photo photos app apps boxes box glass", "");
    assert.deepEqual(packed.used, ["photo", "boxes", "box", "glass"]);
    assert.deepEqual(packed.skipped.map(({ word, reason }) => `${word}:${reason}`), ["photos:plural", "app:filler", "apps:filler"]);
  });
  it("drops repeats", () => assert.deepEqual(packKeywords("focus, focus timer", "").skipped, [{ word: "focus", reason: "repeat" }]));
  it("never exceeds the byte limit and keeps trying shorter words", () => {
    const packed = packKeywords("abcdefgh, abcdefghijkl, ab", "", 12);
    assert.equal(packed.field, "abcdefgh,ab");
    assert.equal(packed.bytes, 11);
    assert.deepEqual(packed.skipped, [{ word: "abcdefghijkl", reason: "no-room" }]);
  });
  it("counts bytes, not characters", () => assert.equal(packKeywords("日記,気分", "").bytes, 13));
});
