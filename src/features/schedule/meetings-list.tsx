"use client";

import Link from "next/link";
import { useState } from "react";
import { participantLabel, type Meeting } from "./model";

export function MeetingsList({ meetings, now, onOpen }: { meetings: Meeting[]; now: number; onOpen: (meeting: Meeting) => void }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("date-asc");
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = meetings.filter(m => {
    const ended = Date.parse(m.startsAt) + m.duration * 60_000 <= now;
    const matchesStatus = filter === "all" || (filter === "cancelled" ? m.status === "cancelled" : m.status === "scheduled" && (filter === "past" ? ended : !ended));
    const text = [m.title, m.notes, ...m.participants.map(participantLabel)].join(" ").toLocaleLowerCase();
    return matchesStatus && words.every(word => text.includes(word));
  }).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title, undefined, { sensitivity: "base" }) : (Date.parse(a.startsAt) - Date.parse(b.startsAt)) * (sort === "date-desc" ? -1 : 1));
  function reset() { setQuery(""); setFilter("all"); setSort("date-asc"); }

  return <div className="meetings-list-view">
    <div className="meeting-list-filters" role="group" aria-label="Filter meetings">{["all", "upcoming", "past", "cancelled"].map(f => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === "all" ? "All meetings" : f[0].toUpperCase() + f.slice(1)}</button>)}</div>
    <div className="meeting-search-sort">
      <label htmlFor="meeting-search">Search meetings<input id="meeting-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, person, or notes" maxLength={200} /></label>
      <label htmlFor="meeting-sort">Sort by<select aria-label="Sort by" id="meeting-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="date-asc">Date: oldest first</option><option value="date-desc">Date: newest first</option><option value="title">Title: A–Z</option></select></label>
    </div>
    <div className="meeting-results"><p role="status" aria-live="polite">{visible.length} of {meetings.length} meeting{meetings.length === 1 ? "" : "s"}</p>{(query || filter !== "all" || sort !== "date-asc") && <button type="button" onClick={reset}>Reset</button>}</div>
    {visible.length === 0 ? <div className="meetings-empty"><h3>{meetings.length === 0 ? "No meetings yet." : query.trim() ? "No matching meetings." : `No ${filter} meetings.`}</h3><p>{meetings.length === 0 ? "Choose a date and time in your calendar to arrange your first meeting." : "Try another search or status filter."}</p>{meetings.length === 0 ? <Link href="/schedule" className="quiet-button">Open calendar</Link> : <button type="button" className="quiet-button" onClick={reset}>Show all meetings</button>}</div> : <ul className="meeting-rows">{visible.map(m => {
      const date = new Date(m.startsAt);
      const end = new Date(date.getTime() + m.duration * 60_000);
      const status = m.status === "cancelled" ? "Cancelled" : end.getTime() <= now ? "Past" : date.getTime() <= now ? "In progress" : "Upcoming";
      return <li key={m.id} className="meeting-row">
        <div className="meeting-row-date"><time dateTime={m.startsAt}>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time><span>{date.toLocaleDateString("en-US", { weekday: "long" })} · {date.getFullYear()}</span></div>
        <div className="meeting-row-details"><h3><button type="button" onClick={() => onOpen(m)} aria-label={`Open ${m.title}`}>{m.title}</button></h3><p className="meeting-row-time">{date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} – {end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {m.duration} min</p><p>{m.participants.map(participantLabel).join(", ")}</p>{m.notes && <p className="meeting-row-notes">{m.notes}</p>}</div>
        <div className="meeting-row-actions"><span className={`meeting-status ${m.status === "cancelled" ? "is-cancelled" : ""}`}>{status}</span>{m.status !== "cancelled" && <a className="quiet-button" href={m.link} target="_blank" rel="noopener noreferrer" aria-label={`Open video call for ${m.title}`}>Open call</a>}<button type="button" className="meeting-details-button" aria-label={`View details for ${m.title}`} onClick={() => onOpen(m)}>Details</button></div>
      </li>;
    })}</ul>}
  </div>;
}
