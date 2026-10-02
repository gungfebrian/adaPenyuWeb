import { FigmaImage } from "../components/figma-image";
import { Pattern } from "../components/pattern";

export function ProgressSection() {
  return (
    <section data-motion-section aria-labelledby="progress-title" className="relative px-[var(--page-gutter)] pt-11 pb-16 md:pt-[4.6958cqw] md:pb-[6.6138cqw]">
      <div className="mx-auto w-full max-w-[1352px]">
      <p data-reveal className="font-detail text-lg leading-[1.209] font-medium text-secondary md:text-[1.9841cqw]">Current progress</p>
      <h2 id="progress-title" data-reveal className="mt-5 font-display text-[clamp(30px,7.8cqw,46px)] leading-[1.3] font-medium text-secondary md:mt-[1.7196cqw] md:text-[4.2328cqw] md:leading-[1.34]">Working prototype<br /> and promising result</h2>
      <div className="relative mt-[30px] grid gap-10 overflow-hidden rounded-[20px] bg-banner px-7 py-10 text-white md:mt-[5.0939cqw] md:ml-[0.3307cqw] md:min-h-[28.4392cqw] md:grid-cols-[1fr_1.15fr] md:items-center md:gap-[5cqw] md:rounded-[1.9841cqw] md:px-[7.2751cqw] md:py-[4cqw]">
        <Pattern variant="accuracy" />
        <p data-reveal className="relative font-detail">
          <strong className="block text-[64px] leading-[1.209] font-bold md:text-[6.6138cqw]">&gt;90%</strong>
          <span className="mt-3 block text-2xl font-semibold md:mt-[0.6614cqw] md:text-[2.6455cqw]">model accuracy</span>
        </p>
        <div data-reveal className="relative">
          <h3 className="font-detail text-xl font-semibold md:text-[1.5873cqw]">Recognising patterns across sightings</h3>
          <p className="mt-3 max-w-lg font-detail text-sm leading-relaxed text-white/90 md:text-[1.1905cqw]">Our prototype compares facial patterns to suggest potential matches for review</p>
          <div data-match-sequence className="mt-6 flex items-center gap-3 md:gap-5" aria-label="Two sightings of turtle facial patterns">
            <div data-match-photo className="w-1/2 -rotate-3"><div data-tilt className="overflow-hidden rounded-xl"><FigmaImage name="match-photo-left" width={255} height={159} alt="A turtle’s facial scales in one sighting" className="h-auto w-full" /></div></div>
            <div data-match-photo className="w-1/2 rotate-3"><div data-tilt className="overflow-hidden rounded-xl"><FigmaImage name="match-photo-right" width={255} height={159} alt="Facial scales photographed in another sighting" className="h-auto w-full" /></div></div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
