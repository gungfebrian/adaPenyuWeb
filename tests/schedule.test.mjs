import test from "node:test";
import assert from "node:assert/strict";
import { emptySchedule, hasMeetingConflict, isSafeMeetingLink, isScheduleData, participantLabel } from "../src/features/schedule/model.ts";

const participant = { id: "p1", name: "Researcher", title: "Professor" };
const meeting = { id: "m1", title: "Discussion", participants: [participant], startsAt: "2026-10-10T02:00:00.000Z", duration: 30, timeZone: "Asia/Makassar", link: "https://meet.google.com/abc-defg-hij", notes: "", status: "scheduled" };

test("meeting URLs require HTTPS and reject executable links", () => {
  assert.equal(isSafeMeetingLink(meeting.link), true);
  for (const link of ["javascript:alert(1)", "data:text/html,test", "http://example.com", "meet.google.com/abc", ""]) assert.equal(isSafeMeetingLink(link), false);
});
test("overlaps include enclosing meetings but allow adjacent slots", () => {
  assert.equal(hasMeetingConflict([meeting], "2026-10-10T02:15:00Z", 30), true);
  assert.equal(hasMeetingConflict([meeting], "2026-10-10T01:45:00Z", 60), true);
  assert.equal(hasMeetingConflict([meeting], "2026-10-10T02:30:00Z", 30), false);
  assert.equal(hasMeetingConflict([meeting], "2026-10-10T01:30:00Z", 30), false);
});
test("editing excludes itself and cancellations release the slot", () => {
  assert.equal(hasMeetingConflict([meeting], meeting.startsAt, 30, meeting.id), false);
  assert.equal(hasMeetingConflict([{ ...meeting, status: "cancelled" }], meeting.startsAt, 30), false);
});
test("validates restored schedules before displaying or overwriting them", () => {
  assert.equal(isScheduleData(emptySchedule), true);
  const data = { version: 1, participants: [participant], meetings: [meeting] };
  assert.equal(isScheduleData(JSON.parse(JSON.stringify(data))), true);
  for (const patch of [{ link: "javascript:alert(1)" }, { startsAt: "invalid" }, { duration: -1 }, { participants: [] }, { status: "unknown" }]) assert.equal(isScheduleData({ ...data, meetings: [{ ...meeting, ...patch }] }), false);
  assert.equal(isScheduleData(null), false);
  assert.equal(isScheduleData({ ...data, version: 2 }), false);
});


test("friends can be restored from saved schedules without requiring a professional title", () => {
  const friend = { id: "friend1", name: "Alex", title: "Friend" };
  const data = { version: 1, participants: [friend], meetings: [{ ...meeting, participants: [friend] }] };
  assert.equal(isScheduleData(JSON.parse(JSON.stringify(data))), true);
  assert.equal(participantLabel(friend), "Alex");
  assert.equal(participantLabel(participant), "Professor Researcher");
  assert.equal(isScheduleData({ ...data, participants: [{ ...friend, title: "unknown" }] }), false);
});
