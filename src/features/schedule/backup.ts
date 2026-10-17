import { isScheduleData, type ScheduleData } from "./model";

export const scheduleBackupFormat = "adapenyu-schedule-backup";

/** A portable copy of the local schedule without the signed-in account ID. */
export function createScheduleBackup(schedule: ScheduleData, exportedAt = new Date().toISOString()): string {
  if (!isScheduleData(schedule)) throw new Error("The current schedule is not valid.");
  return JSON.stringify({ format: scheduleBackupFormat, exportedAt, schedule }, null, 2);
}
