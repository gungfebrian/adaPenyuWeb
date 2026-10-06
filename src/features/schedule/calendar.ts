import type { Meeting } from "./model";

export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dateFromKey(key: string) {
  return new Date(`${key}T12:00:00`);
}
export function monthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  first.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index));
}
export function dayMeetings(meetings: Meeting[], day: string, showCancelled = false) {
  const start = new Date(`${day}T00:00:00`);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  return meetings.filter(m => (showCancelled || m.status === "scheduled") && Date.parse(m.startsAt) < end.getTime() && Date.parse(m.startsAt) + m.duration * 60_000 > start.getTime()).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
export function meetingPosition(meeting: Meeting, day: string) {
  const start = new Date(meeting.startsAt);
  const end = new Date(start.getTime() + meeting.duration * 60_000);
  const from = localDate(start) < day ? 0 : start.getHours() * 60 + start.getMinutes();
  const to = localDate(end) > day ? 1440 : end.getHours() * 60 + end.getMinutes();
  return { top: from / 60 * 72, height: Math.max(26, (to - from) / 60 * 72 - 2) };
}
