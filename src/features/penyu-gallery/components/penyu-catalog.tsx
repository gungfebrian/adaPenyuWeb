"use client";
/* eslint-disable @next/next/no-img-element -- preserve the original WebP facial profiles in /public/turtles */

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { GalleryTurtle } from "../types";

const FILTER_CHANGE_EVENT = "penyu-gallery:filters-change";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary";

function subscribeToSearch(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_CHANGE_EVENT, onChange);
  };
}

function getSearchSnapshot() {
  return window.location.search;
}

function getServerSearchSnapshot() {
  return "";
}

function updateSearch(patch: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(patch)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    return;
  }
  window.history.replaceState(window.history.state, "", next);
  window.dispatchEvent(new Event(FILTER_CHANGE_EVENT));
}

function GalleryIcon({
  name,
  className = "size-5",
}: {
  name: "search" | "close" | "previous" | "next" | "eye" | "hidden" | "check";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {name === "search" && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>}
      {name === "close" && <path d="m6 6 12 12M6 18 18 6" />}
      {name === "previous" && <path d="m11 5-7 7 7 7M4 12h16" />}
      {name === "next" && <path d="m13 5 7 7-7 7M4 12h16" />}
      {name === "eye" && <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>}
      {name === "hidden" && <><path d="m3 3 18 18M10.5 5.1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.3 4.2M6.3 6.3A20 20 0 0 0 2 12s3.5 7 10 7a11 11 0 0 0 5.7-1.7M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>}
      {name === "check" && <path d="m5 12 4 4L19 6" />}
    </svg>
  );
}

function turtleNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function PenyuCatalog({ turtles }: { turtles: GalleryTurtle[] }) {
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const query = params.get("q") ?? "";
  const requestedYear = params.get("year");
  const requestedTurtle = params.get("turtle");
  const [mysteryMode, setMysteryMode] = useState(true);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());
  const [sightingSelection, setSightingSelection] = useState<{
    turtleId: string;
    index: number;
  } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const years = useMemo(
    () => [...new Set(turtles.flatMap((turtle) => turtle.sightings.map((s) => s.year)))].sort((a, b) => b - a),
    [turtles],
  );
  const year = years.some((item) => String(item) === requestedYear)
    ? requestedYear!
    : "All";
  const indices = useMemo(
    () => new Map(turtles.map((turtle, index) => [turtle.id, index])),
    [turtles],
  );
  const selected = turtles.find((turtle) => turtle.id === requestedTurtle) ?? null;
  const hasSelection = selected !== null;
  const sightingIndex = selected && sightingSelection?.turtleId === selected.id
    ? sightingSelection.index
    : 0;
  const activeSighting = selected?.sightings[sightingIndex] ?? selected?.sightings[0];

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return turtles.filter((turtle) =>
      (!term || turtle.name.toLowerCase().includes(term)) &&
      (year === "All" || turtle.sightings.some((sighting) => String(sighting.year) === year)),
    );
  }, [query, turtles, year]);
  // A shared profile may be outside the link's filters. Keep it viewable and
  // use the complete archive for navigation in that case.
  const navigationTurtles = selected && !filtered.some((turtle) => turtle.id === selected.id)
    ? turtles
    : filtered;
  const selectedPosition = navigationTurtles.findIndex((turtle) => turtle.id === selected?.id);
  const revealedCount = mysteryMode
    ? filtered.filter((turtle) => revealedIds.has(turtle.id)).length
    : filtered.length;
  const selectedRevealed = selected ? !mysteryMode || revealedIds.has(selected.id) : false;
  const selectedLabel = selected
    ? selectedRevealed ? selected.name : `Turtle ${turtleNumber(indices.get(selected.id) ?? 0)}`
    : "Turtle profile";

  useEffect(() => {
    const invalid: Record<string, null> = {};
    if (requestedYear !== null && year === "All") invalid.year = null;
    if (requestedTurtle !== null && !selected) invalid.turtle = null;
    if (Object.keys(invalid).length) updateSearch(invalid);
  }, [requestedYear, requestedTurtle, selected, year]);

  // Opening and closing are independent of which turtle is selected. The native
  // dialog keeps the page inert and restores the original opener after browsing.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!hasSelection || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [hasSelection]);

  function openTurtle(id: string) {
    setSightingSelection(null);
    updateSearch({ turtle: id });
  }

  function closeTurtle() {
    updateSearch({ turtle: null });
  }

  function revealTurtle(id: string) {
    setRevealedIds((current) => new Set(current).add(id));
  }

  function toggleMysteryMode() {
    if (!mysteryMode) setRevealedIds(new Set());
    setMysteryMode(!mysteryMode);
  }

  function moveSelection(direction: number) {
    if (navigationTurtles.length < 2 || selectedPosition < 0) return;
    const next = (selectedPosition + direction + navigationTurtles.length) % navigationTurtles.length;
    openTurtle(navigationTurtles[next].id);
  }

  function resetFilters() {
    updateSearch({ q: null, year: null });
  }

  return (
    <>
      <section
        id="penyu-catalog"
        aria-labelledby="penyu-catalog-title"
        className="scroll-mt-28 px-[var(--page-gutter)] pt-8 pb-20 sm:pt-12 sm:pb-28"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-detail text-[11px] font-semibold tracking-[0.16em] text-secondary uppercase">The collection</p>
              <h2 id="penyu-catalog-title" className="mt-3 font-body text-3xl font-semibold tracking-[-0.035em] text-primary sm:text-4xl">Find a familiar face.</h2>
            </div>
            <p className="max-w-xs font-detail text-sm leading-relaxed text-secondary">Look closely. The scales around each eye tell a different story.</p>
          </div>

          <div className="mt-7 grid gap-3 border-y border-primary/10 bg-surface/70 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-primary/10 bg-paper px-4 text-secondary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary">
              <GalleryIcon name="search" />
              <span className="sr-only">Search turtles by name</span>
              <input
                type="search"
                value={query}
                onChange={(event) => updateSearch({ q: event.target.value || null })}
                placeholder="Search a turtle by name"
                className="w-full min-w-0 bg-transparent py-3 font-body text-base text-primary placeholder:text-secondary focus:outline-none sm:text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              {query && <button type="button" onClick={() => updateSearch({ q: null })} aria-label="Clear search" className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-md hover:bg-surface ${focusRing}`}><GalleryIcon name="close" className="size-4" /></button>}
            </label>

            <label className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-primary/10 bg-paper px-4 font-body text-sm text-primary">
              <span className="text-secondary">Observed in</span>
              <select
                value={year}
                onChange={(event) => updateSearch({ year: event.target.value === "All" ? null : event.target.value })}
                className={`min-h-11 cursor-pointer bg-paper pr-1 font-medium ${focusRing}`}
              >
                <option value="All">All years</option>
                {years.map((item) => <option key={item} value={String(item)}>{item}</option>)}
              </select>
            </label>

            <button
              type="button"
              aria-pressed={mysteryMode}
              aria-describedby="mystery-mode-description"
              onClick={toggleMysteryMode}
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 font-body text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${mysteryMode ? "border-primary bg-primary text-white hover:bg-banner" : "border-primary/15 bg-paper text-primary hover:bg-surface"}`}
            >
              <span className="flex items-center gap-2.5"><GalleryIcon name={mysteryMode ? "hidden" : "eye"} />Mystery mode</span>
              <span className={`text-xs ${mysteryMode ? "text-white/75" : "text-secondary"}`}>{mysteryMode ? "On" : "Off"}</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2 font-detail text-xs leading-relaxed text-secondary sm:text-sm">
            <p id="mystery-mode-description">{mysteryMode ? "Names are hidden. Make a guess, then reveal an identity." : "Names are visible. Turn on mystery mode for a fresh challenge."}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p role="status" aria-live="polite" aria-atomic="true"><span className="font-semibold text-primary">{filtered.length}</span> {filtered.length === 1 ? "turtle" : "turtles"}{mysteryMode && <> · {revealedCount} names revealed</>}</p>
              {(query || year !== "All") && <button type="button" onClick={resetFilters} className={`min-h-11 cursor-pointer font-semibold text-primary underline underline-offset-4 hover:text-secondary ${focusRing}`}>Reset filters</button>}
            </div>
          </div>

          {filtered.length ? (
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-11">
              {filtered.map((turtle) => {
                const isRevealed = !mysteryMode || revealedIds.has(turtle.id);
                const number = turtleNumber(indices.get(turtle.id) ?? 0);
                const title = isRevealed ? turtle.name : `Turtle ${number}`;
                return (
                  <article key={turtle.id} data-turtle-card={turtle.id} className="group/card min-w-0">
                    <button
                      type="button"
                      onClick={() => openTurtle(turtle.id)}
                      aria-label={`${title}, open photo profile`}
                      className={`group/open block w-full cursor-pointer rounded-2xl text-left ${focusRing}`}
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-banner">
                        <img src={turtle.primaryPhoto} alt={`${title}, green sea turtle facial profile`} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                        <span className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-full bg-paper text-primary transition-colors group-hover/open:bg-primary group-hover/open:text-white motion-reduce:transition-none"><GalleryIcon name="next" className="size-4" /></span>
                      </span>
                      <span className="mt-4 flex items-start justify-between gap-3">
                        <strong className="font-body text-[23px] leading-tight font-semibold tracking-[-0.025em] text-primary group-hover/open:text-secondary">{title}</strong>
                        <span className="pt-1 font-detail text-[11px] tracking-wider text-secondary tabular-nums">{number}</span>
                      </span>
                      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-detail text-xs leading-relaxed text-secondary"><span>{turtle.firstYear}–{turtle.lastYear}</span><span>{turtle.sightings.length} sightings</span></span>
                    </button>
                    {mysteryMode && (
                      <div className="mt-3 border-t border-primary/10 pt-2">
                        <button
                          type="button"
                          aria-disabled={isRevealed}
                          aria-label={isRevealed ? `${turtle.name}, name revealed` : "Reveal name"}
                          onClick={() => { if (!isRevealed) revealTurtle(turtle.id); }}
                          className={`flex min-h-11 items-center gap-2 rounded-sm font-body text-sm font-medium ${focusRing} ${isRevealed ? "cursor-default text-secondary" : "cursor-pointer text-primary hover:text-secondary"}`}
                        >
                          <GalleryIcon name={isRevealed ? "check" : "eye"} className="size-4" />
                          {isRevealed ? "Name revealed" : "Reveal name"}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-surface px-6 py-16 text-center">
              <GalleryIcon name="search" className="mx-auto size-8 text-secondary" />
              <h3 className="mt-5 font-body text-2xl font-semibold tracking-tight text-primary">No familiar faces here yet.</h3>
              <p className="mt-2 font-detail text-sm leading-relaxed text-secondary">Try a different name or explore another year.</p>
              <button type="button" onClick={resetFilters} className={`mt-6 min-h-11 cursor-pointer rounded-xl bg-primary px-5 py-3 font-body text-sm font-medium text-white hover:bg-banner ${focusRing}`}>View all turtles</button>
            </div>
          )}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="penyu-dialog-title"
        aria-describedby="penyu-dialog-description"
        onCancel={(event) => { event.preventDefault(); closeTurtle(); }}
        onClose={(event) => {
          // A queued close event from effect cleanup may arrive after reopening.
          if (!event.currentTarget.open) closeTurtle();
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeTurtle();
        }}
        onKeyDown={(event) => {
          if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
          if ((event.target as HTMLElement).closest("input, textarea, select, summary, [contenteditable='true']")) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            moveSelection(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[1040px] overflow-y-auto overscroll-contain rounded-2xl border-0 bg-paper p-0 text-primary shadow-[0_24px_100px_#00263c55] backdrop:bg-primary/70 backdrop:backdrop-blur-sm sm:rounded-3xl"
      >
        {selected && activeSighting && <>
          <header className="sticky top-0 z-10 border-b border-primary/10 bg-paper px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-detail text-[10px] font-semibold tracking-[0.14em] text-secondary uppercase sm:text-[11px]">Green sea turtle · Profile {turtleNumber(indices.get(selected.id) ?? 0)}</p>
                <h2 id="penyu-dialog-title" className="mt-2 font-body text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-3xl">{selectedLabel}</h2>
              </div>
              <button ref={closeRef} type="button" onClick={closeTurtle} aria-label="Close turtle profile" className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-surface text-primary hover:bg-primary hover:text-white ${focusRing}`}><GalleryIcon name="close" /></button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p id="penyu-dialog-description" className="font-detail text-xs text-secondary">{selected.sightings.length} sightings · {selected.firstYear}–{selected.lastYear}</p>
                {mysteryMode && (
                  <button
                    type="button"
                    aria-disabled={selectedRevealed}
                    aria-label={selectedRevealed ? `${selected.name}, name revealed` : "Reveal name"}
                    onClick={() => { if (!selectedRevealed) revealTurtle(selected.id); }}
                    className={`flex min-h-11 items-center gap-2 rounded-md font-body text-xs font-semibold ${focusRing} ${selectedRevealed ? "cursor-default text-secondary" : "cursor-pointer text-primary hover:text-secondary"}`}
                  >
                    <GalleryIcon name={selectedRevealed ? "check" : "eye"} className="size-4" />
                    {selectedRevealed ? "Name revealed" : "Reveal name"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => moveSelection(-1)} disabled={navigationTurtles.length < 2} aria-label="Previous turtle" className={`grid size-11 cursor-pointer place-items-center rounded-full border border-primary/15 hover:bg-surface disabled:cursor-default disabled:opacity-35 ${focusRing}`}><GalleryIcon name="previous" className="size-4" /></button>
                <span className="min-w-14 text-center font-detail text-xs text-secondary tabular-nums">{selectedPosition + 1} / {navigationTurtles.length}</span>
                <button type="button" onClick={() => moveSelection(1)} disabled={navigationTurtles.length < 2} aria-label="Next turtle" className={`grid size-11 cursor-pointer place-items-center rounded-full border border-primary/15 hover:bg-surface disabled:cursor-default disabled:opacity-35 ${focusRing}`}><GalleryIcon name="next" className="size-4" /></button>
              </div>
            </div>
          </header>

          <div className="px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">
            <div role="group" aria-label="Choose a sighting" className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="mr-2 shrink-0 font-detail text-xs font-medium text-secondary">Sightings</span>
              {selected.sightings.map((sighting, index) => <button key={sighting.date} type="button" aria-pressed={index === sightingIndex} onClick={() => setSightingSelection({ turtleId: selected.id, index })} className={`min-h-11 shrink-0 cursor-pointer rounded-lg px-3.5 py-2 font-body text-xs font-medium ${focusRing} ${index === sightingIndex ? "bg-primary text-white" : "bg-surface text-secondary hover:text-primary"}`}>{formatDate(sighting.date)}</button>)}
            </div>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {(["left", "right"] as const).map((side) => {
                const photo = activeSighting.photos[side];
                return <article key={side}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-body text-sm font-semibold capitalize">{side} facial profile</h3>
                    <span className="font-detail text-xs text-secondary" aria-label={photo ? `${photo.po} post-ocular scales` : "Post-ocular scale count unavailable"}>PO {photo?.po ?? "—"}</span>
                  </div>
                  <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-banner">
                    {photo ? <img src={photo.path} alt={`${selectedLabel}, ${side} facial profile on ${formatDate(activeSighting.date)}`} decoding="async" className="h-full w-full object-contain" /> : <p className="font-detail text-sm text-white/75">No {side} profile recorded</p>}
                  </div>
                  {photo && <details className="mt-3 border-b border-primary/10 pb-3 font-detail text-xs text-secondary"><summary className={`cursor-pointer rounded-sm py-1.5 font-medium ${focusRing}`}>Scale identification codes ({photo.idCodes.length})</summary><p className="mt-2 leading-loose text-primary">{photo.idCodes.join(" · ")}</p></details>}
                </article>;
              })}
            </div>
            <p className="mt-5 font-detail text-xs leading-relaxed text-secondary">PO counts the post-ocular scales behind the eye. Compare the same side across sightings to follow an individual turtle.</p>
          </div>
        </>}
      </dialog>
    </>
  );
}
