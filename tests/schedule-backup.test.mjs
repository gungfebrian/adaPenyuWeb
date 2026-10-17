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
const { createScheduleBackup, scheduleBackupFormat } = backupModule.exports;

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
