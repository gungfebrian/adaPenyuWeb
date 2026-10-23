"use client";
/* eslint-disable @next/next/no-img-element -- source images are pre-sized original WebP crops in /public/turtles */

import { useEffect, useMemo, useRef, useState } from "react";
import { Pattern } from "@/features/marketing/components/pattern";
import { Button } from "@/components/ui/button";
import type { GalleryTurtle } from "../types";

function initialFilters(): {
  query: string;
  year: string;
  turtle: string | null;
} {
  if (typeof window === "undefined") {
    return { query: "", year: "All", turtle: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    year: params.get("year") ?? "All",
    turtle: params.get("turtle"),
  };
}

export function PenyuCatalog({ turtles }: { turtles: GalleryTurtle[] }) {
  const initial = useMemo(() => initialFilters(), []);
  const [query, setQuery] = useState(initial.query);
  const [year, setYear] = useState(initial.year);
  const [selectedId, setSelectedId] = useState<string | null>(initial.turtle);
  const [sightingIndex, setSightingIndex] = useState(0);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());

  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  const years = useMemo(
    () =>
      [...new Set(turtles.flatMap((t) => t.sightings.map((s) => s.year)))].sort(
        (a, b) => b - a,
      ),
    [turtles],
  );

  const filtered = useMemo(
    () =>
      turtles.filter((turtle) => {
        const term = query.trim().toLowerCase();
        const matchesQuery =
          !term || turtle.name.toLowerCase().includes(term);
        const matchesYear =
          year === "All" ||
          turtle.sightings.some((sighting) => String(sighting.year) === year);
        return matchesQuery && matchesYear;
      }),
    [query, turtles, year],
  );

  const selected = useMemo(
    () => turtles.find((turtle) => turtle.id === selectedId) ?? null,
    [selectedId, turtles],
  );
  const activeSighting =
    selected?.sightings[sightingIndex] ?? selected?.sightings[0];

  const allFilteredRevealed =
    filtered.length > 0 &&
    filtered.every((turtle) => revealedIds.has(turtle.id));

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (year !== "All") params.set("year", year);
    if (selectedId) params.set("turtle", selectedId);
    window.history.replaceState(
      null,
      "",
      params.size ? `?${params}` : window.location.pathname,
    );
  }, [query, year, selectedId]);

  function openTurtle(id: string) {
    setSightingIndex(0);
    setSelectedId(id);
  }

  function revealTurtle(id: string) {
    setRevealedIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  function toggleRevealAll() {
    setRevealedIds((current) => {
      if (allFilteredRevealed) {
        const next = new Set(current);
        for (const turtle of filtered) {
          next.delete(turtle.id);
        }
        return next;
      }
      const next = new Set(current);
      for (const turtle of filtered) {
        next.add(turtle.id);
      }
      return next;
    });
  }

  function moveSelection(direction: number) {
    if (!selectedId || filtered.length < 2) return;
    const current = filtered.findIndex((turtle) => turtle.id === selectedId);
    if (current === -1) return;
    const next = (current + direction + filtered.length) % filtered.length;
    setSightingIndex(0);
    setSelectedId(filtered[next].id);
  }

  function resetFilters() {
    setQuery("");
    setYear("All");
  }

  useEffect(() => {
    if (!selected) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedId(null);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
      }
      if (event.key === "Tab") {
        const focusable = [
          ...(dialogRef.current?.querySelectorAll<HTMLElement>(
            "button, summary, [href], input, select, [tabindex]:not([tabindex='-1'])",
          ) ?? []),
        ].filter((element) => !element.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus({ preventScroll: true });
    };
    // moveSelection intentionally reads the current filtered collection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, filtered]);

  const selectedPosition = selected
    ? filtered.findIndex((t) => t.id === selected.id)
    : -1;

  return (
    <>
      <section
        id="penyu-catalog"
        aria-label="Penyu facial profile catalog"
        className="relative px-[var(--page-gutter)] pt-4 pb-20 sm:pb-24"
      >
        <div className="mx-auto w-full max-w-[1352px]">
          {/* Filter Panel */}
          <div
            data-header-theme="dark"
            className="relative isolate overflow-hidden rounded-[24px] bg-banner p-5 text-white shadow-[0_20px_54px_#00263c1c] sm:rounded-[32px] sm:p-7"
          >
            <Pattern variant="accuracy" parallax={false} />
            <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              {/* Search Input */}
              <label className="relative flex min-h-12 items-center rounded-2xl border border-white/15 bg-white/95 px-4 text-primary shadow-xs focus-within:outline-solid focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white">
                <span className="sr-only">Search turtles by name</span>
                <span
                  aria-hidden="true"
                  className="mr-3 font-body text-lg text-secondary select-none"
                >
                  ⌕
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by turtle name…"
                  className="w-full min-w-0 bg-transparent font-detail text-sm font-medium text-primary placeholder:text-secondary/70 focus:outline-none sm:text-base"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="ml-2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface font-body text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    ×
                  </button>
                )}
              </label>

              {/* Species Pill + Year Filter + Reveal Toggle */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-4 py-2 font-body text-sm font-semibold text-primary shadow-xs">
                  <span>Green turtles</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-detail text-xs font-bold text-primary">
                    {turtles.length}
                  </span>
                </span>

                <label className="inline-flex min-h-12 items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 font-detail text-xs font-semibold tracking-wide text-white/90 uppercase backdrop-blur-xs">
                  <span>Observed in</span>
                  <select
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    className="min-h-9 cursor-pointer rounded-xl bg-white px-3 py-1 font-body text-sm font-semibold text-primary normal-case focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <option value="All">All</option>
                    {years.map((item) => (
                      <option key={item} value={String(item)}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={toggleRevealAll}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border border-white/20 bg-white/12 px-4 py-2.5 font-body text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-white hover:text-primary focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span aria-hidden="true">
                    {allFilteredRevealed ? "◌" : "✦"}
                  </span>
                  {allFilteredRevealed ? "Mystery mode" : "Reveal all names"}
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 px-1">
            <p className="font-detail text-base text-secondary">
              <strong className="font-display text-lg font-medium text-primary">
                {filtered.length}
              </strong>{" "}
              {filtered.length === 1 ? "turtle" : "turtles"} in view
              {revealedIds.size > 0 && (
                <span className="ml-2 text-sm text-secondary/80">
                  · {revealedIds.size} revealed
                </span>
              )}
            </p>
            {(query || year !== "All") && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl bg-surface px-4 py-2 font-body text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Turtle Grid */}
          {filtered.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((turtle) => {
                const isRevealed = revealedIds.has(turtle.id);
                return (
                  <article
                    key={turtle.id}
                    data-turtle-card={turtle.id}
                    className="group/card flex flex-col justify-between rounded-[24px] border border-primary/10 bg-paper p-3.5 shadow-[0_12px_32px_#00263c0d] transition-all duration-200 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-[0_20px_44px_#00263c18] motion-reduce:transition-none"
                  >
                    <button
                      type="button"
                      onClick={() => openTurtle(turtle.id)}
                      aria-label={`${isRevealed ? turtle.name : "Mystery turtle"}, open photo profile`}
                      className="group/open block w-full cursor-pointer text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                    >
                      <span className="relative block aspect-[1.08] w-full overflow-hidden rounded-[18px] bg-banner">
                        <img
                          src={turtle.primaryPhoto}
                          alt={`${isRevealed ? turtle.name : "Mystery"}, ${turtle.species.toLowerCase()} turtle profile`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover/open:scale-[1.03] motion-reduce:transition-none"
                        />
                        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-paper/95 px-3 py-1 font-detail text-[11px] font-bold tracking-wide text-primary uppercase shadow-sm backdrop-blur-xs">
                          {turtle.species}
                        </span>
                        {!isRevealed && (
                          <span
                            aria-hidden="true"
                            className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-2xl border border-white/30 bg-banner/90 font-display text-2xl font-bold text-white shadow-md backdrop-blur-xs"
                          >
                            ?
                          </span>
                        )}
                        <span
                          aria-hidden="true"
                          className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1.5 font-body text-xs font-semibold text-white opacity-0 shadow-sm backdrop-blur-xs transition-opacity duration-200 group-hover/open:opacity-100 group-focus-visible/open:opacity-100"
                        >
                          View profile ↗
                        </span>
                      </span>

                      <span className="mt-4 block px-1.5">
                        <strong className="block font-display text-xl leading-snug font-medium text-primary">
                          {isRevealed ? turtle.name : "Mystery turtle"}
                        </strong>
                        <span className="mt-1.5 flex flex-wrap items-center justify-between gap-2 font-detail text-xs font-semibold text-secondary">
                          <span>
                            {turtle.firstYear}—{turtle.lastYear}
                          </span>
                          <span>
                            {turtle.sightings.length} documented encounters
                          </span>
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => revealTurtle(turtle.id)}
                      disabled={isRevealed}
                      aria-live="polite"
                      className={`mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-body text-xs font-semibold tracking-wide uppercase transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                        isRevealed
                          ? "cursor-default bg-[#dceef5] text-primary"
                          : "bg-surface text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <span aria-hidden="true">{isRevealed ? "✓" : "✦"}</span>
                      {isRevealed ? "Name revealed" : "Reveal name"}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-dashed border-primary/20 bg-surface/70 px-6 py-14 text-center">
              <p
                aria-hidden="true"
                className="font-display text-4xl text-secondary"
              >
                ◌
              </p>
              <h2 className="mt-3 font-display text-2xl font-medium text-primary">
                No turtles surfaced
              </h2>
              <p className="mx-auto mt-2 max-w-md font-detail text-sm leading-relaxed text-secondary">
                Try another turtle name or observation year.
              </p>
              <div className="mt-6">
                <Button variant="primary" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Profile Comparison Modal */}
      {selected && activeSighting && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
          className="fixed inset-0 z-120 flex items-start justify-center overflow-y-auto bg-primary/65 p-4 py-8 backdrop-blur-xs sm:items-center sm:p-6"
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="penyu-dialog-title"
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/15 bg-paper text-primary shadow-[0_28px_80px_#00263c55]"
          >
            {/* Dialog Header */}
            <header className="relative isolate overflow-hidden bg-banner px-6 py-5 text-white sm:px-8 sm:py-6">
              <Pattern variant="accuracy" parallax={false} />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-detail text-xs font-bold tracking-wider text-white uppercase">
                    {selected.species} turtle
                  </span>
                  <h2
                    id="penyu-dialog-title"
                    className="mt-2.5 font-display text-2xl font-medium sm:text-4xl"
                  >
                    {revealedIds.has(selected.id)
                      ? selected.name
                      : "Mystery turtle"}
                  </h2>
                  <p className="mt-1 font-detail text-sm text-white/80">
                    {selected.sightings.length} encounters ·{" "}
                    {selected.firstYear}—{selected.lastYear}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {!revealedIds.has(selected.id) && (
                    <button
                      type="button"
                      onClick={() => revealTurtle(selected.id)}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 font-body text-xs font-semibold tracking-wide text-primary uppercase shadow-xs transition-colors hover:bg-surface focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span aria-hidden="true">✦</span>
                      Reveal name
                    </button>
                  )}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Close turtle profile"
                    className="grid size-11 cursor-pointer place-items-center rounded-full bg-white/12 font-body text-xl text-white transition-colors hover:bg-white/25 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Sighting Date Picker */}
            <div className="border-b border-primary/10 bg-surface px-6 py-3.5 sm:px-8">
              <div
                role="group"
                aria-label="Choose a sighting"
                className="flex flex-wrap items-center gap-2"
              >
                <span className="mr-1 font-detail text-xs font-semibold tracking-wide text-secondary uppercase">
                  Sightings:
                </span>
                {selected.sightings.map((sighting, index) => {
                  const isActive = index === sightingIndex;
                  return (
                    <button
                      type="button"
                      key={sighting.date}
                      onClick={() => setSightingIndex(index)}
                      aria-pressed={isActive}
                      className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 font-body text-xs font-semibold transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                        isActive
                          ? "bg-primary text-white shadow-xs"
                          : "bg-paper text-primary hover:bg-primary/10"
                      }`}
                    >
                      <strong className="font-bold">{sighting.year}</strong>
                      <span className={isActive ? "text-white/80" : "text-secondary"}>
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(`${sighting.date}T12:00:00`))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left / Right Facial Profile Comparison */}
            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
              {(["left", "right"] as const).map((side) => {
                const photo = activeSighting.photos[side];
                const displayName = revealedIds.has(selected.id)
                  ? selected.name
                  : "Mystery turtle";
                return (
                  <article
                    key={side}
                    className="flex flex-col rounded-2xl border border-primary/10 bg-surface p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2 font-detail text-xs font-bold tracking-wider text-primary uppercase">
                      <span>{side} profile</span>
                      <span className="rounded-full bg-paper px-2.5 py-1 text-secondary">
                        PO {photo?.po ?? "—"}
                      </span>
                    </div>

                    {photo ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-banner">
                        <img
                          src={photo.path}
                          alt={`${displayName}, ${side} profile photographed in ${activeSighting.year}`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-dashed border-primary/20 bg-paper font-detail text-sm text-secondary">
                        No {side} profile
                      </div>
                    )}

                    {photo && (
                      <details className="mt-3 rounded-xl bg-paper px-3.5 py-2.5 font-detail text-xs text-primary">
                        <summary className="cursor-pointer font-semibold text-secondary select-none">
                          Identification codes{" "}
                          <span className="ml-1 rounded-full bg-surface px-2 py-0.5 font-bold text-primary">
                            {photo.idCodes.length}
                          </span>
                        </summary>
                        <p className="mt-2 leading-relaxed font-medium text-primary">
                          {photo.idCodes.join(" · ")}
                        </p>
                      </details>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Dialog Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-primary/10 bg-surface px-6 py-4 sm:px-8">
              <p className="font-detail text-xs font-medium text-secondary sm:text-sm">
                Observed{" "}
                {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
                  new Date(`${activeSighting.date}T12:00:00`),
                )}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => moveSelection(-1)}
                  disabled={filtered.length < 2}
                  aria-label="Previous turtle"
                  className="grid size-10 cursor-pointer place-items-center rounded-xl border border-primary/15 bg-paper font-body text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>
                <span className="font-detail text-xs font-semibold text-secondary tabular-nums sm:text-sm">
                  {selectedPosition + 1} / {filtered.length}
                </span>
                <button
                  type="button"
                  onClick={() => moveSelection(1)}
                  disabled={filtered.length < 2}
                  aria-label="Next turtle"
                  className="grid size-10 cursor-pointer place-items-center rounded-xl border border-primary/15 bg-paper font-body text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
