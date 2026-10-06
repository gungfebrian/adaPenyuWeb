"use client";

import { useRef, type KeyboardEvent } from "react";
import type { Meeting } from "./model";
import { dayMeetings, localDate, monthDays } from "./calendar";

export function MonthCalendar({ month, selectedDay, today, meetings, compact = false, showCancelled, onSelect, onMeeting }: {
  month: Date; selectedDay: string; today: string; meetings: Meeting[]; compact?: boolean; showCancelled: boolean;
  onSelect: (day: string) => void; onMeeting: (meeting: Meeting) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const days = monthDays(month);
  function move(event: KeyboardEvent<HTMLButtonElement>, day: Date) {
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -day.getDay(), End: 6 - day.getDay() };
    if (!(event.key in offsets)) return;
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate() + offsets[event.key]);
    const button = ref.current?.querySelector<HTMLButtonElement>(`button[data-date="${localDate(next)}"]`);
    if (button) { event.preventDefault(); button.focus(); }
  }
  return <div ref={ref} className={compact ? "mini-calendar" : "month-calendar"}>
    <div className="calendar-weekdays" aria-hidden="true">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{compact ? d[0] : d}</span>)}</div>
    <div className="calendar-days">
      {days.map(day => {
        const key = localDate(day);
        const events = dayMeetings(meetings, key, showCancelled);
        const outside = day.getMonth() !== month.getMonth();
        return <div key={key} className={`calendar-cell ${outside ? "outside-month" : ""} ${key === selectedDay ? "selected-cell" : ""}`}>
          <button type="button" className="calendar-date" data-date={key} data-today={key === today} aria-current={key === today ? "date" : undefined} aria-pressed={key === selectedDay} aria-label={day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} onKeyDown={e => move(e, day)} onClick={() => onSelect(key)}>
            <span>{day.getDate()}</span>
            {events.length > 0 && <i className="date-dot" aria-hidden="true" />}
          </button>
          {!compact && <div className="month-events">{events.slice(0, 3).map(m => <button key={m.id} type="button" className={`month-event ${m.status === "cancelled" ? "cancelled-event" : ""}`} onClick={() => onMeeting(m)} aria-label={`Open ${m.title}`}><span className="event-time">{new Date(m.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span><span>{m.title}</span></button>)}{events.length > 3 && <button type="button" className="more-events" onClick={() => onSelect(key)}>+{events.length - 3} more</button>}</div>}
        </div>;
      })}
    </div>
  </div>;
}
