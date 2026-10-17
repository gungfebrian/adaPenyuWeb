import { isScheduleData, type ScheduleData } from "./model";

export const scheduleBackupFormat = "adapenyu-schedule-backup";

/** A portable copy of the local schedule without the signed-in account ID. */
export function createScheduleBackup(schedule: ScheduleData, exportedAt = new Date().toISOString()): string {
  if (!isScheduleData(schedule)) throw new Error("The current schedule is not valid.");
  return JSON.stringify({ format: scheduleBackupFormat, exportedAt, schedule }, null, 2);
}

export function parseScheduleBackup(content: string): ScheduleData {
  let value: unknown;
  try { value = JSON.parse(content); }
  catch { throw new Error("The selected file is not valid JSON."); }
  if (!value || typeof value !== "object") throw new Error("The selected file is not an AdaPenyu backup.");
  const backup = value as Record<string, unknown>;
  if (backup.format !== scheduleBackupFormat || !isScheduleData(backup.schedule)) {
    throw new Error("The selected file is not a supported AdaPenyu schedule backup.");
  }
  return backup.schedule;
}
