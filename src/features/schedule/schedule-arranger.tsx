"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { emptySchedule, hasMeetingConflict, isSafeMeetingLink, participantLabel, type Meeting, type Participant, type ScheduleData } from "./model";
import { createScheduleStorage } from "./storage";
import { dateFromKey, dayMeetings, localDate, meetingPosition } from "./calendar";
import { MonthCalendar } from "./month-calendar";
import { MeetingsList } from "./meetings-list";
import Link from "next/link";
import "./schedule.css";

const blankDraft = { title: "", participantIds: [] as string[], date: "", time: "09:00", duration: "30", link: "", notes: "" };
type Draft = typeof blankDraft;
const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`;
function Icon({ name }: { name: "plus" | "left" | "right" | "close" | "calendar" | "list" }) {
  const paths = { list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01", plus: "M12 5v14M5 12h14", left: "m14 6-6 6 6 6", right: "m10 6 6 6-6 6", close: "m6 6 12 12M18 6 6 18", calendar: "M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export function ScheduleArranger({ userId, initialView = "month" }: { userId: string; initialView?: "month" | "meetings" }) {
  const storage = useMemo(() => createScheduleStorage(userId), [userId]);
  const [data, setData] = useState<ScheduleData>(emptySchedule);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [now, setNow] = useState(0);
  const [selectedDay, setSelectedDay] = useState("");
  const [month, setMonth] = useState<Date>();
  const [view, setView] = useState<"month" | "day" | "meetings">(initialView);
  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [editingId, setEditingId] = useState<string>();
  const [name, setName] = useState("");
  const [personTitle, setPersonTitle] = useState<Participant["title"]>("Professor");
  const [showCancelled, setShowCancelled] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<Meeting>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const timelineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const newMeetingRef = useRef<HTMLButtonElement>(null);
  const editingMeeting = data.meetings.find(m => m.id === editingId);
  const today = now ? localDate(new Date(now)) : "";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setData(storage.load()); } catch { setLoadFailed(true); setError("Your saved calendar could not be read. Reload to try again; your saved data has been kept."); }
      const date = new Date();
      setNow(date.getTime()); setSelectedDay(localDate(date));
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone); setLoaded(true);
    });
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); };
  }, [storage]);

  useEffect(() => {
    if (view !== "day") return;
    const frame = window.requestAnimationFrame(() => {
      if (timelineRef.current) timelineRef.current.scrollTop = 8 * 72;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view, selectedDay]);

  useEffect(() => {
    if (!showEditor) return;
    const frame = window.requestAnimationFrame(() => {
      if (window.innerWidth < 1100) editorRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      titleRef.current?.focus({ preventScroll: true });
    });
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowEditor(false); setConfirmCancel(false);
        window.requestAnimationFrame(() => {
          if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus({ preventScroll: true });
          else newMeetingRef.current?.focus({ preventScroll: true });
        });
      }
    }
    window.addEventListener("keydown", escape);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("keydown", escape); };
  }, [showEditor, editingId]);

  function persist(next: ScheduleData, success: string) {
    try { storage.save(next); setData(next); setMessage(success); setError(""); return true; }
    catch { setError("Changes couldn’t be saved. Allow browser storage, then try again."); setMessage(""); return false; }
  }
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(d => ({ ...d, [key]: value })); setError("");
  }
  function selectDay(day: string) {
    setSelectedDay(day); const date = dateFromKey(day);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); setView(initialView === "meetings" ? "meetings" : "day");
    setShowEditor(false); setConfirmCancel(false); setError("");
  }
  function navigate(direction: number) {
    if (!month) return;
    if (view === "month") setMonth(new Date(month.getFullYear(), month.getMonth() + direction, 1));
    else { const date = dateFromKey(selectedDay); date.setDate(date.getDate() + direction); selectDay(localDate(date)); }
  }
  function beginMeeting(time = "09:00") {
    if (!loaded || loadFailed) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    setDraft({ ...blankDraft, date: selectedDay, time });
    setEditingId(undefined); setConfirmCancel(false); setConfirmDelete(false); setShowEditor(true); setError(""); setMessage("");
  }
  function edit(meeting: Meeting) {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const start = new Date(meeting.startsAt);
    setSelectedDay(localDate(start)); setMonth(new Date(start.getFullYear(), start.getMonth(), 1)); setView(initialView === "meetings" ? "meetings" : "day");
    setDraft({ title: meeting.title, participantIds: meeting.participants.map(p => p.id), date: localDate(start), time: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`, duration: String(meeting.duration), link: meeting.link, notes: meeting.notes });
    setEditingId(meeting.id); setShowEditor(true); setConfirmCancel(false); setConfirmDelete(false); setError("");
  }
  function deleteMeeting() {
    if (!editingMeeting) return;
    if (persist({ ...data, meetings: data.meetings.filter(m => m.id !== editingMeeting.id) }, `Deleted “${editingMeeting.title}”.`)) {
      setLastDeleted(editingMeeting); setShowEditor(false); setEditingId(undefined); setConfirmDelete(false);
    }
  }
  function undoDelete() {
    if (!lastDeleted) return;
    if (lastDeleted.status === "scheduled" && hasMeetingConflict(data.meetings, lastDeleted.startsAt, lastDeleted.duration)) {
      setError("That time is now occupied. Move the overlapping meeting before restoring this one."); return;
    }
    if (persist({ ...data, meetings: [...data.meetings, lastDeleted] }, "Meeting restored.")) {
      selectDay(localDate(new Date(lastDeleted.startsAt))); if (lastDeleted.status === "cancelled") setShowCancelled(true); setLastDeleted(undefined);
    }
  }
  function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const clean = name.trim();
    if (!clean) return;
    const existing = data.participants.find(p => p.name.toLowerCase() === clean.toLowerCase() && p.title === personTitle);
    if (existing) { setError("This person is already in your list. Select their name below."); return; }
    const person: Participant = { id: crypto.randomUUID(), name: clean, title: personTitle };
    if (persist({ ...data, participants: [...data.participants, person] }, "Person added.")) {
      setDraft(d => ({ ...d, participantIds: [...d.participantIds, person.id] })); setName("");
    }
  }
  function saveMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) { setError("Add a meeting title."); return; }
    if (!draft.participantIds.length) { setError("Choose at least one person."); return; }
    const start = new Date(`${draft.date}T${draft.time}`);
    if (!Number.isFinite(start.getTime()) || localDate(start) !== draft.date || `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}` !== draft.time || start.getTime() <= Date.now()) { setError("Choose a valid date and time in the future."); return; }
    if (!isSafeMeetingLink(draft.link.trim())) { setError("Paste a full HTTPS meeting link."); return; }
    if (hasMeetingConflict(data.meetings, start.toISOString(), Number(draft.duration), editingId)) { setError("Another meeting overlaps this time. Choose a different time."); return; }
    const meeting: Meeting = { id: editingId ?? crypto.randomUUID(), title: draft.title.trim(), participants: data.participants.filter(p => draft.participantIds.includes(p.id)), startsAt: start.toISOString(), duration: Number(draft.duration), timeZone, link: draft.link.trim(), notes: draft.notes.trim(), status: "scheduled" };
    const next = { ...data, meetings: editingId ? data.meetings.map(m => m.id === editingId ? meeting : m) : [...data.meetings, meeting] };
    if (persist(next, editingId ? "Meeting updated." : "Meeting added. Share the link to invite your participants.")) {
      selectDay(draft.date); setDraft(blankDraft); setEditingId(undefined);
    }
  }
  const events = selectedDay ? dayMeetings(data.meetings, selectedDay, showCancelled) : [];
  const selectedDate = selectedDay ? dateFromKey(selectedDay) : undefined;
  const selectedIsPast = selectedDay < today;
  const monthLabel = month?.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return <section className={`schedule-calendar ${showEditor ? "with-editor" : ""}`} aria-label={initialView === "meetings" ? "Meeting list" : "Meeting calendar"}>
    <aside className="calendar-sidebar">
      <div className="sidebar-title"><Icon name={initialView === "meetings" ? "list" : "calendar"} /><h1>{initialView === "meetings" ? "Meetings" : "Calendar"}</h1></div>
      <p className="sidebar-description">Your meetings, in one place.</p>
      <nav className="schedule-sidebar-nav" aria-label="Schedule navigation"><Link className="calendar-list" href="/schedule" aria-current={initialView === "month" ? "page" : undefined}><Icon name="calendar" />Calendar</Link><Link className="calendar-list" href="/meetings" aria-current={initialView === "meetings" ? "page" : undefined}><Icon name="list" />Meetings<span>{data.meetings.length}</span></Link></nav>
      {view !== "meetings" && <label className="cancelled-toggle"><input type="checkbox" checked={showCancelled} onChange={e => setShowCancelled(e.target.checked)} />Show cancelled</label>}
      {month && view !== "meetings" && <div className="sidebar-month"><div className="mini-month-heading"><button type="button" className="icon-button" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><Icon name="left" /></button><span>{monthLabel}</span><button type="button" className="icon-button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><Icon name="right" /></button></div><MonthCalendar compact month={month} selectedDay={selectedDay} today={today} meetings={data.meetings} showCancelled={showCancelled} onSelect={selectDay} onMeeting={edit} /></div>}
      <div className="calendar-local-note"><p>Saved on this device</p><span>Account sync and invitations aren’t connected yet.</span></div>
    </aside>
    <div className="calendar-main">
      <header className="calendar-toolbar">
        <button ref={newMeetingRef} type="button" className="icon-button new-event-button" aria-label="New meeting" onClick={() => beginMeeting()} disabled={!loaded || loadFailed}><Icon name="plus" /></button>
        {view !== "meetings" && <><div className="view-control" role="group" aria-label="Calendar view">{(["day", "month"] as const).map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => { setView(v); setShowEditor(false); }}>{v === "day" ? "Day" : "Month"}</button>)}</div>
        <div className="calendar-navigation"><button type="button" className="icon-button" aria-label={view === "month" ? "Previous calendar month" : "Previous day"} onClick={() => navigate(-1)}><Icon name="left" /></button><button type="button" className="today-button" onClick={() => { const date = new Date(); setSelectedDay(localDate(date)); setMonth(new Date(date.getFullYear(), date.getMonth(), 1)); setShowEditor(false); }}>Today</button><button type="button" className="icon-button" aria-label={view === "month" ? "Next calendar month" : "Next day"} onClick={() => navigate(1)}><Icon name="right" /></button></div></>}
      </header>
      <div className="calendar-heading"><h2 aria-live="polite">{view === "meetings" ? "Your meetings" : view === "month" ? monthLabel || "Calendar" : selectedDate?.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</h2><p>{view === "meetings" ? "Every conversation you’ve arranged, in one list." : view === "month" ? "Select a date to see its times." : `${selectedDate?.toLocaleDateString("en-US", { weekday: "long" })} · Click a time to add a meeting.`}</p></div>
      <div className="calendar-feedback" aria-live="polite">{!showEditor && error ? <p role="alert">{error}</p> : <p role="status">{message || (!loaded ? "Loading calendar…" : "")}</p>}{lastDeleted && <button type="button" className="undo-delete" onClick={undoDelete}>Undo last deletion</button>}</div>
      {!loaded ? <div className="calendar-loading">Loading your meetings…</div> : view === "meetings" ? <MeetingsList meetings={data.meetings} now={now} onOpen={edit} /> : view === "month" && month ? <MonthCalendar month={month} selectedDay={selectedDay} today={today} meetings={data.meetings} showCancelled={showCancelled} onSelect={selectDay} onMeeting={edit} /> : <>{events.some(m => m.status === "cancelled") && <div className="cancelled-day-events" aria-label="Cancelled meetings">{events.filter(m => m.status === "cancelled").map(m => <button key={m.id} type="button" className="quiet-button" aria-label={`Open ${m.title}`} onClick={() => edit(m)}>Cancelled · {m.title}</button>)}</div>}<div className="day-scroll" ref={timelineRef} aria-label="Day schedule">
        <div className="day-timeline">
          {Array.from({ length: 24 }, (_, hour) => <div key={hour} className="timeline-hour"><span className="hour-label">{hourLabel(hour)}</span><div className="hour-slots">{[0, 30].map(minute => {
            const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
            const past = selectedIsPast || new Date(`${selectedDay}T${time}`).getTime() <= now;
            return <button key={minute} type="button" disabled={past || loadFailed} className="time-slot" aria-label={`Add meeting at ${time}`} onClick={() => beginMeeting(time)}><span>{time}</span></button>;
          })}</div></div>)}
          <div className="timeline-events">{events.filter(m => m.status === "scheduled").map(m => { const position = meetingPosition(m, selectedDay); return <button key={m.id} type="button" className={`timeline-event ${m.status === "cancelled" ? "cancelled-event" : ""}`} style={position} aria-label={`Open ${m.title}`} onClick={() => edit(m)}><strong>{m.title}</strong>{position.height > 42 && <span>{new Date(m.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {m.participants.map(participantLabel).join(", ")}</span>}</button>; })}</div>
          {selectedDay === today && <div className="current-time-line" style={{ top: (new Date(now).getHours() * 60 + new Date(now).getMinutes()) / 60 * 72 }} aria-hidden="true"><span /></div>}
        </div>
      </div></>}
      <footer className="calendar-footer"><span>{timeZone || "Device timezone"} · On this device</span><span>{view === "meetings" ? `${data.meetings.length} saved meeting${data.meetings.length === 1 ? "" : "s"}` : view === "day" ? `${events.length} meeting${events.length === 1 ? "" : "s"}` : "Click a date to get started"}</span>{view !== "meetings" && <button type="button" className="mobile-cancelled-toggle" aria-pressed={showCancelled} onClick={() => setShowCancelled(value => !value)}>{showCancelled ? "Hide cancelled" : "Show cancelled"}</button>}</footer>
    </div>
    {showEditor && <aside className="meeting-inspector" ref={editorRef} aria-label="Meeting details">
      <div className="inspector-heading"><h2>{editingId ? "Meeting details" : "New meeting"}</h2><button type="button" className="icon-button" aria-label="Close meeting details" onClick={() => { setShowEditor(false); setConfirmCancel(false); }}><Icon name="close" /></button></div>
      {editingMeeting?.status === "cancelled" ? <div className="cancelled-details"><h3>{editingMeeting.title}</h3><p>This meeting was cancelled.</p><p>{draft.date} · {draft.time}</p><p>{editingMeeting.participants.map(participantLabel).join(", ")}</p></div> : <>
        <form id="meeting-form" className="meeting-form" onSubmit={saveMeeting}>
          <fieldset disabled={loadFailed}>
            <label htmlFor="meeting-title">Title<input ref={titleRef} id="meeting-title" required maxLength={160} value={draft.title} onChange={e => update("title", e.target.value)} placeholder="Meeting title" /></label>
            <div className="editor-date-time"><label htmlFor="meeting-date">Date<input type="date" id="meeting-date" required min={today} value={draft.date} onChange={e => update("date", e.target.value)} /></label><label htmlFor="meeting-time">Time<input type="time" id="meeting-time" required value={draft.time} onChange={e => update("time", e.target.value)} /></label></div>
            <label htmlFor="meeting-duration">Duration<select id="meeting-duration" value={draft.duration} onChange={e => update("duration", e.target.value)}>{[15, 30, 45, 60, 90, 120, 180, 240].map(n => <option key={n} value={n}>{n} minutes</option>)}</select></label>
            <label htmlFor="meeting-link">Video call link<input id="meeting-link" type="url" required maxLength={2048} value={draft.link} onChange={e => update("link", e.target.value)} placeholder="https://meet.google.com/…" /></label>
            <fieldset className="participant-field"><legend>Participants</legend>{!data.participants.length ? <p>Add a professor, doctor, or friend below.</p> : <div className="participant-choices">{data.participants.map(p => <label key={p.id}><input type="checkbox" checked={draft.participantIds.includes(p.id)} onChange={e => update("participantIds", e.target.checked ? [...draft.participantIds, p.id] : draft.participantIds.filter(id => id !== p.id))} /><span>{participantLabel(p)}</span></label>)}</div>}</fieldset>
            <label htmlFor="meeting-notes">Notes <span>(optional)</span><textarea id="meeting-notes" rows={2} maxLength={2000} value={draft.notes} onChange={e => update("notes", e.target.value)} placeholder="What would you like to discuss?" /></label>
          </fieldset>
        </form>
        <details className="add-person" open={data.participants.length === 0}><summary>Add a person</summary><form onSubmit={addPerson}><div className="person-fields"><label htmlFor="person-title">Role<select id="person-title" value={personTitle} onChange={e => setPersonTitle(e.target.value as Participant["title"])}><option>Professor</option><option>Dr.</option><option>Friend</option></select></label><label htmlFor="person-name">Name<input id="person-name" required maxLength={100} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} /></label></div><button type="submit" className="quiet-button" disabled={loadFailed}>Add person</button></form></details>
        <div className="inspector-actions"><button type="submit" form="meeting-form" className="save-meeting" disabled={loadFailed}>{editingId ? "Save changes" : "Add meeting"}</button>{editingMeeting && <a href={editingMeeting.link} target="_blank" rel="noopener noreferrer" className="quiet-button">Open video call</a>}</div>
        {editingMeeting && <div className="cancel-meeting">{confirmCancel ? <><p>Cancel this meeting? Participants won’t be notified.</p><button type="button" className="quiet-button" onClick={() => { if (persist({ ...data, meetings: data.meetings.map(m => m.id === editingId ? { ...m, status: "cancelled" } : m) }, "Meeting cancelled.")) { setShowEditor(false); setConfirmCancel(false); } }}>Yes, cancel meeting</button><button type="button" className="quiet-button" onClick={() => setConfirmCancel(false)}>Keep meeting</button></> : <button type="button" className="cancel-button" onClick={() => { setConfirmCancel(true); setConfirmDelete(false); }}>Cancel meeting</button>}</div>}
      </>}
      {error && <p role="alert" className="editor-error">{error}</p>}
      {editingMeeting && <div className="delete-meeting">{confirmDelete ? <><p>Delete this meeting from your calendar? You can undo the last deletion before leaving this page.</p><div><button type="button" className="quiet-button" onClick={deleteMeeting}>Yes, delete meeting</button><button type="button" className="quiet-button" onClick={() => setConfirmDelete(false)}>Keep meeting</button></div></> : <button type="button" className="delete-button" onClick={() => { setConfirmDelete(true); setConfirmCancel(false); }}>Delete meeting</button>}</div>}
    </aside>}
  </section>;
}
