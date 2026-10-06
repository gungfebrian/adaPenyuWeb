import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const compiledModule = { exports: {} };
const source = readFileSync(new URL("../src/features/schedule/calendar.ts", import.meta.url), "utf8");
runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: compiledModule.exports, Date });
const { localDate, dateFromKey, monthDays, dayMeetings, meetingPosition } = compiledModule.exports;
const makeMeeting = (startsAt, duration = 30, status = "scheduled") => ({ id: startsAt, title: "Test", participants: [], startsAt, duration, status });

test("month grid has 42 consecutive dates, aligned to Sunday, across year boundaries", () => {
  const days = monthDays(new Date(2026, 11, 1));
  assert.equal(days.length, 42);
  assert.equal(days[0].getDay(), 0);
  assert.equal(localDate(days[0]), "2026-11-29");
  assert.equal(localDate(days[41]), "2027-01-09");
  assert.equal(localDate(monthDays(new Date(2028, 1, 1)).find(d => localDate(d) === "2028-02-29")), "2028-02-29");
});
test("date keys round-trip as local dates without UTC shifting", () => {
  for (const key of ["2026-10-06", "2027-01-01", "2028-02-29"]) assert.equal(localDate(dateFromKey(key)), key);
});
test("day view includes overnight meetings and excludes exact end boundaries and cancellations", () => {
  const overnight = makeMeeting(new Date(2026, 9, 6, 23, 30).toISOString(), 90);
  const endsAtMidnight = makeMeeting(new Date(2026, 9, 6, 23, 30).toISOString(), 30);
  const cancelled = makeMeeting(new Date(2026, 9, 7, 9).toISOString(), 30, "cancelled");
  assert.equal(dayMeetings([overnight, endsAtMidnight, cancelled], "2026-10-07").length, 1);
  assert.equal(dayMeetings([overnight, cancelled], "2026-10-07", true).length, 2);
  const position = meetingPosition(overnight, "2026-10-07");
  assert.equal(position.top, 0);
  assert.equal(position.height, 70);
});
