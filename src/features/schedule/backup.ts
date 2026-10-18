import { isScheduleData, type ScheduleData } from "./model";

export const scheduleBackupFormat = "adapenyu-schedule-backup";

function hasConsistentIds(schedule: ScheduleData): boolean {
  const participantIds = schedule.participants.map(person => person.id);
  const meetingIds = schedule.meetings.map(meeting => meeting.id);
  if (participantIds.some(id => !id.trim()) || new Set(participantIds).size !== participantIds.length) return false;
  if (meetingIds.some(id => !id.trim()) || new Set(meetingIds).size !== meetingIds.length) return false;
  const knownParticipants = new Set(participantIds);
  return schedule.meetings.every(meeting => {
    const attendees = meeting.participants.map(person => person.id);
    return attendees.every(id => knownParticipants.has(id)) && new Set(attendees).size === attendees.length;
  });
}

/** A portable copy of the local schedule without the signed-in account ID. */
export function createScheduleBackup(schedule: ScheduleData, exportedAt = new Date().toISOString()): string {
  if (!isScheduleData(schedule) || !hasConsistentIds(schedule)) throw new Error("The current schedule is not valid.");
  return JSON.stringify({ format: scheduleBackupFormat, exportedAt, schedule }, null, 2);
}

export function parseScheduleBackup(content: string): ScheduleData {
  let value: unknown;
  try { value = JSON.parse(content); }
  catch { throw new Error("The selected file is not valid JSON."); }
  if (!value || typeof value !== "object") throw new Error("The selected file is not an AdaPenyu backup.");
  const backup = value as Record<string, unknown>;
  if (backup.format !== scheduleBackupFormat || !isScheduleData(backup.schedule) || !hasConsistentIds(backup.schedule)) {
    throw new Error("The selected file is not a supported AdaPenyu schedule backup.");
  }
  return backup.schedule;
}
