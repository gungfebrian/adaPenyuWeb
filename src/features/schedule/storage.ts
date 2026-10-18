import { emptySchedule, isScheduleData, type ScheduleData } from "./model";

export class ScheduleConflictError extends Error {
  constructor() {
    super("The saved schedule changed since this tab loaded it.");
    this.name = "ScheduleConflictError";
  }
}

// Replace this adapter with authenticated Supabase queries when tables are ready.
// No local participant list or browser storage should be used as an authorization check.
export function createScheduleStorage(userId: string) {
  const storageKey = `adapenyu-schedule-v1:${userId}`;
  let lastSeen: string | null | undefined;
  return {
  load(): ScheduleData {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      lastSeen = saved;
      return { ...emptySchedule, participants: [], meetings: [] };
    }
    const data: unknown = JSON.parse(saved);
    if (!isScheduleData(data)) throw new Error("The saved schedule is not valid.");
    lastSeen = saved;
    return data;
  },
  save(data: ScheduleData): void {
    const current = window.localStorage.getItem(storageKey);
    if (lastSeen !== undefined && current !== lastSeen) throw new ScheduleConflictError();
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(storageKey, serialized);
    lastSeen = serialized;
  },
  };
}
