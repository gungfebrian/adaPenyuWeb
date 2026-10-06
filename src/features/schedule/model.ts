export type Participant = { id: string; name: string; title: "Professor" | "Dr." | "Friend" };
export function participantLabel(person: Participant) {
  return person.title === "Friend" ? person.name : `${person.title} ${person.name}`;
}
export type Meeting = {
  id: string;
  title: string;
  participants: Participant[];
  startsAt: string;
  duration: number;
  timeZone: string;
  link: string;
  notes: string;
  status: "scheduled" | "cancelled";
};
export type ScheduleData = { version: 1; participants: Participant[]; meetings: Meeting[] };
export const emptySchedule: ScheduleData = { version: 1, participants: [], meetings: [] };

function isParticipant(value: unknown): value is Participant {
  if (!value || typeof value !== "object") return false;
  const p = value as Participant;
  return typeof p.id === "string" && typeof p.name === "string" && p.name.trim().length > 0 && (p.title === "Professor" || p.title === "Dr." || p.title === "Friend");
}
export function isSafeMeetingLink(link: string): boolean {
  try { const url = new URL(link); return url.protocol === "https:" && !!url.hostname; } catch { return false; }
}
export function isScheduleData(value: unknown): value is ScheduleData {
  if (!value || typeof value !== "object") return false;
  const data = value as ScheduleData;
  return data.version === 1 && Array.isArray(data.participants) && data.participants.every(isParticipant) && Array.isArray(data.meetings) && data.meetings.every(m => {
    if (!m || typeof m !== "object") return false;
    return typeof m.id === "string" && typeof m.title === "string" && Array.isArray(m.participants) && m.participants.length > 0 && m.participants.every(isParticipant) && typeof m.startsAt === "string" && Number.isFinite(Date.parse(m.startsAt)) && Number.isInteger(m.duration) && m.duration >= 15 && m.duration <= 240 && typeof m.timeZone === "string" && typeof m.link === "string" && isSafeMeetingLink(m.link) && typeof m.notes === "string" && (m.status === "scheduled" || m.status === "cancelled");
  });
}
export function hasMeetingConflict(meetings: Meeting[], startsAt: string, duration: number, editingId?: string): boolean {
  const start = Date.parse(startsAt);
  const end = start + duration * 60_000;
  // This is one organizer's agenda: any overlapping meeting is a conflict.
  return meetings.some(m => m.id !== editingId && m.status === "scheduled" && start < Date.parse(m.startsAt) + m.duration * 60_000 && end > Date.parse(m.startsAt));
}
