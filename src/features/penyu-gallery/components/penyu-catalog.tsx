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
  name: "search" | "close" | "previous" | "next" | "eye" | "hidden" | "check" | "chevron";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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
      {name === "chevron" && <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

function turtleNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatYearRange(firstYear: number, lastYear: number) {
  return firstYear === lastYear ? String(firstYear) : `${firstYear}–${lastYear}`;
}

function formatSightingCount(count: number) {
  return `${count} ${count === 1 ? "sighting" : "sightings"}`;
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
        className="scroll-mt-24 bg-paper px-[var(--page-gutter)] pt-6 pb-16 sm:pt-10 sm:pb-24"
      >
        <div className="mx-auto w-full max-w-[1352px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-detail text-base font-medium text-secondary sm:text-lg">
                The collection
              </p>
              <h2
                id="penyu-catalog-title"
                className="mt-2 font-display text-[32px] leading-[1.2] font-medium text-secondary sm:text-[42px]"
              >
                Find a familiar face
              </h2>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="font-detail text-sm text-secondary"
            >
              <span className="font-semibold text-primary tabular-nums">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "turtle" : "turtles"}
              {mysteryMode && (
                <>
                  {" "}· <span className="tabular-nums">{revealedCount}</span> revealed
                </>
              )}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-h-12 w-full items-center gap-3 rounded-2xl bg-surface px-4 text-secondary transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary sm:max-w-sm">
              <GalleryIcon name="search" className="size-4 shrink-0" />
              <span className="sr-only">Search turtles by name</span>
              <input
                type="search"
                value={query}
                onChange={(event) => updateSearch({ q: event.target.value || null })}
                placeholder="Search turtles by name"
                className="w-full min-w-0 bg-transparent py-3 font-body text-sm text-primary placeholder:text-secondary/80 focus:outline-none sm:text-base [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => updateSearch({ q: null })}
                  aria-label="Clear search"
                  className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-primary/10 ${focusRing}`}
                >
                  <GalleryIcon name="close" className="size-4" />
                </button>
              )}
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              <label className="relative inline-flex min-h-12 items-center rounded-2xl bg-surface px-4 font-body text-sm font-medium text-primary transition-colors hover:bg-primary/8 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary">
                <span className="sr-only">Filter by sighting year</span>
                <span aria-hidden="true" className="mr-2 font-detail text-xs text-secondary">Year</span>
                <select
                  value={year}
                  onChange={(event) => updateSearch({ year: event.target.value === "All" ? null : event.target.value })}
                  className="min-h-11 cursor-pointer appearance-none bg-transparent pr-6 font-body text-sm font-semibold text-primary focus:outline-none"
                >
                  <option value="All">All years</option>
                  {years.map((item) => (
                    <option key={item} value={String(item)}>{item}</option>
                  ))}
                </select>
                <GalleryIcon name="chevron" className="pointer-events-none absolute right-3.5 size-4 text-secondary" />
              </label>

              <button
                type="button"
                aria-pressed={mysteryMode}
                aria-describedby="mystery-mode-description"
                onClick={toggleMysteryMode}
                className={`inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-2xl px-4 font-body text-sm font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                  mysteryMode
                    ? "bg-primary text-white hover:bg-banner"
                    : "bg-surface text-primary hover:bg-primary/8"
                }`}
              >
                <GalleryIcon name={mysteryMode ? "hidden" : "eye"} className="size-4" />
                <span>Mystery mode</span>
                <span className={`font-detail text-xs ${mysteryMode ? "text-white/75" : "text-secondary"}`}>
                  {mysteryMode ? "On" : "Off"}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-detail text-sm text-secondary">
            <p id="mystery-mode-description">
              {mysteryMode
                ? "Names are hidden — study the scales behind the eye, then tap Reveal to check."
                : "Names are visible. Switch on mystery mode to test your eye."}
            </p>
            {(query || year !== "All") && (
              <button
                type="button"
                onClick={resetFilters}
                className={`min-h-10 cursor-pointer font-body text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:text-secondary hover:decoration-secondary ${focusRing}`}
              >
                Reset filters
              </button>
            )}
          </div>

          {filtered.length ? (
            <ul className="mt-8 grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 min-[480px]:grid-cols-2 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((turtle, visibleIndex) => {
                const isRevealed = !mysteryMode || revealedIds.has(turtle.id);
                const number = turtleNumber(indices.get(turtle.id) ?? 0);
                const title = isRevealed ? turtle.name : `Turtle ${number}`;
                return (
                  <li key={turtle.id} data-turtle-card={turtle.id} className="min-w-0">
                    <article className="group/card flex flex-col">
                      <button
                        type="button"
                        onClick={() => openTurtle(turtle.id)}
                        aria-label={`${title}, open photo profile`}
                        className={`block w-full cursor-pointer rounded-[20px] text-left ${focusRing}`}
                      >
                        <span className="relative block aspect-[6/5] overflow-hidden rounded-[20px] bg-surface shadow-[0_8px_24px_#00263c0d] transition-shadow duration-300 group-hover/card:shadow-[0_14px_34px_#00263c1a] motion-reduce:transition-none">
                          <img
                            src={turtle.primaryPhoto}
                            alt={`${title}, green sea turtle facial profile`}
                            loading={visibleIndex < 8 ? "eager" : "lazy"}
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04] motion-reduce:transition-none"
                          />
                        </span>
                      </button>

                      <div className="mt-3.5 flex items-start justify-between gap-2 px-0.5">
                        <button
                          type="button"
                          onClick={() => openTurtle(turtle.id)}
                          className={`min-w-0 flex-1 cursor-pointer rounded-md text-left ${focusRing}`}
                        >
                          <strong className="block truncate font-body text-base leading-snug font-semibold text-primary transition-colors group-hover/card:text-secondary sm:text-lg">
                            {title}
                          </strong>
                          <span className="mt-0.5 block font-detail text-xs leading-relaxed text-secondary sm:text-sm">
                            {formatYearRange(turtle.firstYear, turtle.lastYear)} ·{" "}
                            {formatSightingCount(turtle.sightings.length)}
                          </span>
                        </button>

                        {mysteryMode && (
                          <button
                            type="button"
                            aria-disabled={isRevealed}
                            aria-label={isRevealed ? `${turtle.name}, name revealed` : `Reveal name for Turtle ${number}`}
                            onClick={() => { if (!isRevealed) revealTurtle(turtle.id); }}
                            className={`mt-0.5 inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 font-body text-xs font-medium transition-colors motion-reduce:transition-none ${focusRing} ${
                              isRevealed
                                ? "cursor-default bg-transparent px-1.5 text-secondary/75"
                                : "cursor-pointer bg-surface text-primary hover:bg-primary hover:text-white"
                            }`}
                          >
                            {isRevealed ? (
                              <>
                                <GalleryIcon name="check" className="size-3.5" />
                                <span className="sr-only sm:not-sr-only">Revealed</span>
                              </>
                            ) : (
                              <span>Reveal</span>
                            )}
                          </button>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8 rounded-[24px] bg-surface px-6 py-16 text-center">
              <GalleryIcon name="search" className="mx-auto size-8 text-secondary" />
              <h3 className="mt-4 font-display text-2xl font-medium text-primary">
                No matching turtles found
              </h3>
              <p className="mt-2 font-detail text-sm leading-relaxed text-secondary">
                Try another name or clear the year filter.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className={`mt-6 min-h-11 cursor-pointer rounded-2xl bg-primary px-6 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-banner ${focusRing}`}
              >
                Show all turtles
              </button>
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
          if (!event.currentTarget.open) closeTurtle();
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            closeTurtle();
          }
        }}
        onKeyDown={(event) => {
          if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
          if ((event.target as HTMLElement).closest("input, textarea, select, summary, [contenteditable='true']")) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            moveSelection(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[1000px] overflow-y-auto overscroll-contain rounded-[24px] border-0 bg-paper p-0 text-primary shadow-[0_24px_100px_#00263c45] backdrop:bg-primary/55 backdrop:backdrop-blur-sm sm:rounded-[28px]"
      >
        {selected && activeSighting && (
          <>
            <header className="sticky top-0 z-10 border-b border-primary/8 bg-paper/95 px-5 py-4 backdrop-blur-sm sm:px-7 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-detail text-xs font-medium text-secondary sm:text-sm">
                    Green sea turtle · #{turtleNumber(indices.get(selected.id) ?? 0)}
                  </p>
                  <h2
                    id="penyu-dialog-title"
                    className="mt-1 font-display text-2xl leading-tight font-medium text-primary sm:text-3xl"
                  >
                    {selectedLabel}
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeTurtle}
                  aria-label="Close turtle profile"
                  className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-surface text-primary transition-colors hover:bg-primary/10 ${focusRing}`}
                >
                  <GalleryIcon name="close" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p id="penyu-dialog-description" className="font-detail text-xs text-secondary sm:text-sm">
                    {formatSightingCount(selected.sightings.length)} ·{" "}
                    {formatYearRange(selected.firstYear, selected.lastYear)}
                  </p>
                  {mysteryMode && (
                    <button
                      type="button"
                      aria-disabled={selectedRevealed}
                      aria-label={selectedRevealed ? `${selected.name}, name revealed` : "Reveal name"}
                      onClick={() => { if (!selectedRevealed) revealTurtle(selected.id); }}
                      className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl px-3 font-body text-xs font-medium transition-colors ${focusRing} ${
                        selectedRevealed
                          ? "cursor-default bg-surface/70 text-secondary"
                          : "cursor-pointer bg-primary text-white hover:bg-banner"
                      }`}
                    >
                      <GalleryIcon name={selectedRevealed ? "check" : "eye"} className="size-3.5" />
                      {selectedRevealed ? "Name revealed" : "Reveal name"}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveSelection(-1)}
                    disabled={navigationTurtles.length < 2}
                    aria-label="Previous turtle"
                    className={`grid size-10 cursor-pointer place-items-center rounded-full bg-surface text-primary transition-colors hover:bg-primary/10 disabled:cursor-default disabled:opacity-35 ${focusRing}`}
                  >
                    <GalleryIcon name="previous" className="size-4" />
                  </button>
                  <span className="min-w-14 text-center font-detail text-xs text-secondary tabular-nums">
                    {selectedPosition + 1} / {navigationTurtles.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => moveSelection(1)}
                    disabled={navigationTurtles.length < 2}
                    aria-label="Next turtle"
                    className={`grid size-10 cursor-pointer place-items-center rounded-full bg-surface text-primary transition-colors hover:bg-primary/10 disabled:cursor-default disabled:opacity-35 ${focusRing}`}
                  >
                    <GalleryIcon name="next" className="size-4" />
                  </button>
                </div>
              </div>
            </header>

            <div className="px-5 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">
              <div role="group" aria-label="Choose a sighting" className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="mr-1 shrink-0 font-detail text-xs font-medium text-secondary">
                  Sightings
                </span>
                {selected.sightings.map((sighting, index) => (
                  <button
                    key={sighting.date}
                    type="button"
                    aria-pressed={index === sightingIndex}
                    onClick={() => setSightingSelection({ turtleId: selected.id, index })}
                    className={`min-h-10 shrink-0 cursor-pointer rounded-full px-4 font-body text-xs font-medium transition-colors ${focusRing} ${
                      index === sightingIndex
                        ? "bg-primary text-white"
                        : "bg-surface text-secondary hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {formatDate(sighting.date)}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {(["left", "right"] as const).map((side) => {
                  const photo = activeSighting.photos[side];
                  return (
                    <article key={side}>
                      <div className="mb-2.5 flex items-center justify-between gap-3">
                        <h3 className="font-body text-sm font-semibold capitalize text-primary">
                          {side} facial profile
                        </h3>
                        <span
                          className="font-detail text-xs text-secondary"
                          aria-label={photo ? `${photo.po} post-ocular scales` : "Post-ocular scale count unavailable"}
                        >
                          PO {photo?.po ?? "—"}
                        </span>
                      </div>
                      <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-[20px] bg-banner">
                        {photo ? (
                          <img
                            src={photo.path}
                            alt={`${selectedLabel}, ${side} facial profile on ${formatDate(activeSighting.date)}`}
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <p className="font-detail text-sm text-white/75">
                            No {side} profile recorded
                          </p>
                        )}
                      </div>
                      {photo && (
                        <details className="mt-3 rounded-2xl bg-surface px-4 py-2.5 font-detail text-xs text-secondary">
                          <summary className={`cursor-pointer rounded-sm py-1 font-medium text-primary ${focusRing}`}>
                            Scale identification codes ({photo.idCodes.length})
                          </summary>
                          <p className="mt-2 leading-loose text-secondary">
                            {photo.idCodes.join(" · ")}
                          </p>
                        </details>
                      )}
                    </article>
                  );
                })}
              </div>

              <p className="mt-5 font-detail text-xs leading-relaxed text-secondary">
                PO counts the post-ocular scales behind the eye. Compare the same side across
                sightings to follow an individual turtle.
              </p>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
