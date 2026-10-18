import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { emptySchedule, isScheduleData } from "../src/features/schedule/model.ts";

function createStorageEnvironment(saved = new Map()) {
  const source = readFileSync(new URL("../src/features/schedule/storage.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const compiledModule = { exports: {} };
  runInNewContext(compiled, {
    exports: compiledModule.exports,
    require: () => ({ emptySchedule, isScheduleData }),
    window: { localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) } },
  });
  return { createScheduleStorage: compiledModule.exports.createScheduleStorage, saved };
}

test("separates accounts and leaves anonymous preview data unassigned", () => {
  const legacy = JSON.stringify({ ...emptySchedule, participants: [{ id: "legacy", name: "Old preview", title: "Dr." }] });
  const { createScheduleStorage, saved } = createStorageEnvironment(new Map([["adapenyu-schedule-v1", legacy]]));
  const first = createScheduleStorage("user-a");
  const second = createScheduleStorage("user-b");
  first.save({ ...emptySchedule, participants: [{ id: "p1", name: "First account", title: "Professor" }] });
  assert.equal(first.load().participants[0].name, "First account");
  assert.equal(second.load().participants.length, 0);
  assert.equal(saved.get("adapenyu-schedule-v1"), legacy);
});
test("rejects corrupted account storage without replacing the original", () => {
  const { createScheduleStorage, saved } = createStorageEnvironment(new Map([["adapenyu-schedule-v1:user-a", "corrupt"]]));
  assert.throws(() => createScheduleStorage("user-a").load());
  assert.equal(saved.get("adapenyu-schedule-v1:user-a"), "corrupt");
});

test("an older tab cannot overwrite changes saved by another tab", () => {
  const { createScheduleStorage, saved } = createStorageEnvironment();
  const firstTab = createScheduleStorage("user-a");
  const secondTab = createScheduleStorage("user-a");
  firstTab.load();
  secondTab.load();
  const latest = { ...emptySchedule, participants: [{ id: "p1", name: "Ayu", title: "Dr." }] };
  firstTab.save(latest);

  assert.throws(() => secondTab.save(emptySchedule), { name: "ScheduleConflictError" });
  assert.deepEqual(JSON.parse(saved.get("adapenyu-schedule-v1:user-a")), latest);

  secondTab.load();
  secondTab.save({ ...latest, participants: [...latest.participants, { id: "p2", name: "Budi", title: "Friend" }] });
  assert.equal(firstTab.load().participants.length, 2);
});
