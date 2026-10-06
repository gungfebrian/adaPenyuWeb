import { emptySchedule, isScheduleData, type ScheduleData } from "./model";

// Replace this adapter with authenticated Supabase queries when tables are ready.
// No local participant list or browser storage should be used as an authorization check.
export function createScheduleStorage(userId: string) {
  const storageKey = `adapenyu-schedule-v1:${userId}`;
  return {
  load(): ScheduleData {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return { ...emptySchedule, participants: [], meetings: [] };
    const data: unknown = JSON.parse(saved);
    if (!isScheduleData(data)) throw new Error("The saved schedule is not valid.");
    return data;
  },
  save(data: ScheduleData): void {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  },
  };
}
