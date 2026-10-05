"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prototypeScreens } from "../data/prototype-screens";
import { FigmaImage } from "./figma-image";

/** Native scroll snapping keeps touch swipes independent of the page animation. */
export function PhoneCarousel({ compact = false }: { compact?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track?.clientWidth) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    const slides = [...track.children] as HTMLElement[];
    const closest = slides.reduce((best, slide, index) =>
      Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre) < Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - centre) ? index : best, 0);
    activeRef.current = closest;
    setActive(closest);
  }, []);
  const onScroll = () => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => { frameRef.current = 0; syncActive(); });
  };
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  const goTo = useCallback((index: number, instant = false) => {
    const track = trackRef.current;
    const slide = track?.children[Math.max(0, Math.min(index, prototypeScreens.length - 1))] as HTMLElement | undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (track?.clientWidth && slide) track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: reduceMotion || instant ? "instant" : "smooth" });
  }, []);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => goTo(activeRef.current, true));
    });
    observer.observe(track);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [goTo]);

  return (
    <div className={`relative md:hidden ${compact ? "mt-2" : "mt-8"}`}>
      <div ref={trackRef} onScroll={onScroll} tabIndex={0} onKeyDown={event => {
        const next = event.key === "ArrowRight" ? active + 1 : event.key === "ArrowLeft" ? active - 1 : event.key === "Home" ? 0 : event.key === "End" ? prototypeScreens.length - 1 : null;
        if (next !== null) { event.preventDefault(); goTo(next); }
      }} data-phone-carousel aria-label="AdaPenyu prototype screens" aria-roledescription="carousel" role="region" className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-xl px-[8%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [scroll-padding-inline:8%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prototypeScreens.map((screen, index) => (
          <figure key={screen.name} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${prototypeScreens.length}: ${screen.title}`} className="flex w-full shrink-0 snap-center flex-col items-center">
            <div className={`flex w-full items-center justify-center ${compact ? "h-[min(55dvh,460px)]" : "h-[min(145vw,590px)]"}`}>
              <FigmaImage name={screen.name} width={screen.width} height={screen.height} alt={screen.alt} sizes="(max-width: 767px) 68vw, 1px" className="h-full w-full object-contain" />
            </div>
            <figcaption className="mt-4 text-center text-base font-medium text-primary">{screen.title}</figcaption>
          </figure>
        ))}
      </div>
      <p aria-live="polite" aria-atomic="true" className="mt-4 text-center text-sm text-secondary">{active + 1} / {prototypeScreens.length} · {prototypeScreens[active].title}</p>
      <div className="mt-2 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous prototype screen" disabled={active === 0} onClick={() => goTo(active - 1)} className="flex size-11 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none"><span aria-hidden="true">←</span></button>
        <div className="flex items-center">
          {prototypeScreens.map((screen, index) => <button key={screen.name} type="button" aria-label={`Show ${screen.title}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)} className="group/dot flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className={`h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none ${active === index ? "w-5 bg-primary" : "w-2 bg-primary/25 group-hover/dot:bg-primary/60"}`} /></button>)}
        </div>
        <button type="button" aria-label="Next prototype screen" disabled={active === prototypeScreens.length - 1} onClick={() => goTo(active + 1)} className="flex size-11 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none"><span aria-hidden="true">→</span></button>
      </div>
      <p className="mt-3 text-center text-sm text-secondary">Swipe to explore the prototype</p>
    </div>
  );
}
