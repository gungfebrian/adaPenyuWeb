"use client";

import { prototypeScreens } from "../data/prototype-screens";
import { FigmaImage } from "./figma-image";

/** Native scroll snapping keeps touch swipes independent of the page animation. */
export function PhoneCarousel() {
  return (
    <div className="relative mt-8 md:hidden">
      <div data-phone-carousel aria-label="AdaPenyu prototype screens" aria-roledescription="carousel" role="region" className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[8%] [scroll-padding-inline:8%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {prototypeScreens.map((screen, index) => (
          <figure key={screen.name} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${prototypeScreens.length}: ${screen.title}`} className="flex w-[84%] shrink-0 snap-center flex-col items-center">
            <div className="flex h-[min(118vw,540px)] w-full items-center justify-center">
              <FigmaImage name={screen.name} width={screen.width} height={screen.height} alt={screen.alt} sizes="(max-width: 767px) 68vw, 1px" className="h-full w-auto max-w-full object-contain" />
            </div>
            <figcaption className="mt-4 text-center text-base font-medium text-primary">{screen.title}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-center text-sm text-secondary">Swipe to explore the prototype</p>
    </div>
  );
}
