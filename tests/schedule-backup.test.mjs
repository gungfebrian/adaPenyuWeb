import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { emptySchedule, isScheduleData } from "../src/features/schedule/model.ts";

const source = readFileSync(new URL("../src/features/schedule/backup.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const backupModule = { exports: {} };
runInNewContext(compiled, {
  exports: backupModule.exports,
  require: () => ({ isScheduleData }),
  Date,
  JSON,
  Error,
});
const { createScheduleBackup, parseScheduleBackup, scheduleBackupFormat } = backupModule.exports;

test("exports a versioned, portable schedule without an account identifier", () => {
  const schedule = {
    ...emptySchedule,
    participants: [{ id: "p1", name: "Dr. Ayu", title: "Dr." }],
    meetings: [{
      id: "m1", title: "Field review", participants: [{ id: "p1", name: "Dr. Ayu", title: "Dr." }],
      startsAt: "2026-10-20T02:00:00.000Z", duration: 30, timeZone: "Asia/Makassar",
      link: "https://meet.example.com/field", notes: "Discuss photos", status: "scheduled",
    }],
  };
  const backup = JSON.parse(createScheduleBackup(schedule, "2026-10-17T00:00:00.000Z"));
  assert.equal(backup.format, scheduleBackupFormat);
  assert.equal(backup.exportedAt, "2026-10-17T00:00:00.000Z");
  assert.deepEqual(backup.schedule, schedule);
  assert.equal("userId" in backup, false);
});

test("refuses to export an invalid schedule", () => {
  assert.throws(() => createScheduleBackup({ ...emptySchedule, version: 99 }));
});

test("restores a valid backup and rejects unrelated or corrupted files", () => {
  const exported = createScheduleBackup(emptySchedule, "2026-10-17T00:00:00.000Z");
  assert.deepEqual(JSON.parse(JSON.stringify(parseScheduleBackup(exported))), emptySchedule);
  assert.throws(() => parseScheduleBackup("not JSON"));
  assert.throws(() => parseScheduleBackup(JSON.stringify({ format: "other", schedule: emptySchedule })));
  assert.throws(() => parseScheduleBackup(JSON.stringify({ format: scheduleBackupFormat, schedule: { ...emptySchedule, version: 2 } })));
  const unsafe = {
    ...emptySchedule,
    meetings: [{
      id: "unsafe", title: "Unsafe link", participants: [{ id: "p1", name: "Ayu", title: "Dr." }],
      startsAt: "2026-10-20T02:00:00.000Z", duration: 30, timeZone: "Asia/Makassar",
      link: "javascript:alert(1)", notes: "", status: "scheduled",
    }],
  };
  assert.throws(() => parseScheduleBackup(JSON.stringify({ format: scheduleBackupFormat, schedule: unsafe })));
});

test("rejects duplicate or disconnected records before replacing the local schedule", () => {
  const person = { id: "p1", name: "Ayu", title: "Dr." };
  const meeting = {
    id: "m1", title: "Field review", participants: [person],
    startsAt: "2026-10-20T02:00:00.000Z", duration: 30, timeZone: "Asia/Makassar",
    link: "https://meet.example.com/field", notes: "", status: "scheduled",
  };
  const invalidSchedules = [
    { ...emptySchedule, participants: [person, person], meetings: [meeting] },
    { ...emptySchedule, participants: [person], meetings: [meeting, meeting] },
    { ...emptySchedule, participants: [person], meetings: [{ ...meeting, participants: [person, person] }] },
    { ...emptySchedule, participants: [], meetings: [meeting] },
    { ...emptySchedule, participants: [{ ...person, id: " " }], meetings: [] },
  ];
  for (const schedule of invalidSchedules) {
    assert.throws(() => parseScheduleBackup(JSON.stringify({ format: scheduleBackupFormat, schedule })));
    assert.throws(() => createScheduleBackup(schedule));
  }
});
