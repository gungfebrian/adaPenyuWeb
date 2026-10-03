"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prototypeScreens } from "../data/prototype-screens";
import { FigmaImage } from "./figma-image";

/** Native scroll snapping keeps touch swipes independent of the page animation. */
export function PhoneCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const centre = track.scrollLeft + track.clientWidth / 2;
    const slides = [...track.children] as HTMLElement[];
    const closest = slides.reduce((best, slide, index) =>
      Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre) < Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - centre) ? index : best, 0);
    setActive(closest);
  }, []);
  const onScroll = () => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => { frameRef.current = 0; syncActive(); });
  };
  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return (
    <div className="relative mt-8 md:hidden">
      <div ref={trackRef} onScroll={onScroll} data-phone-carousel aria-label="AdaPenyu prototype screens" aria-roledescription="carousel" role="region" className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8%] [scroll-padding-inline:8%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prototypeScreens.map((screen, index) => (
          <figure key={screen.name} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${prototypeScreens.length}: ${screen.title}`} className="flex w-[84%] shrink-0 snap-center flex-col items-center">
            <div className="flex h-[min(118vw,540px)] w-full items-center justify-center">
              <FigmaImage name={screen.name} width={screen.width} height={screen.height} alt={screen.alt} sizes="(max-width: 767px) 68vw, 1px" className="h-full w-auto max-w-full object-contain" />
            </div>
            <figcaption className="mt-4 text-center text-base font-medium text-primary">{screen.title}</figcaption>
          </figure>
        ))}
      </div>
      <p aria-live="polite" aria-atomic="true" className="mt-4 text-center text-sm text-secondary">{active + 1} / {prototypeScreens.length} · {prototypeScreens[active].title}</p>
      <p className="mt-3 text-center text-sm text-secondary">Swipe to explore the prototype</p>
    </div>
  );
}
