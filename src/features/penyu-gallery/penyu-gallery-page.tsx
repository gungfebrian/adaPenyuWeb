import Image from "next/image";
import Link from "next/link";
import { FigmaImage } from "@/features/marketing/components/figma-image";
import { OceanBubbles } from "@/features/marketing/components/ocean-artwork";
import { Pattern } from "@/features/marketing/components/pattern";
import { PenyuCatalog } from "./components/penyu-catalog";
import turtlesData from "./data/turtles.json";
import type { GalleryTurtle } from "./types";

export function PenyuGalleryPage() {
  const turtles = turtlesData as GalleryTurtle[];
  const photoCount = turtles.reduce(
    (count, turtle) =>
      count +
      turtle.sightings.reduce(
        (total, sighting) => total + Object.keys(sighting.photos).length,
        0,
      ),
    0,
  );
  const allYears = turtles.flatMap((turtle) => [
    turtle.firstYear,
    turtle.lastYear,
  ]);
  const yearSpan = Math.max(...allYears) - Math.min(...allYears) + 1;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-paper outline-none [&_section]:outline-none"
    >
      {/* Hero Section */}
      <section
        id="gallery-hero"
        aria-labelledby="penyu-gallery-title"
        className="relative isolate overflow-hidden px-[var(--page-gutter)] pt-28 pb-10 text-primary sm:pt-32 sm:pb-12 lg:pt-36"
      >
        <Pattern variant="hero" parallax={false} />
        <OceanBubbles className="bottom-12 left-0 opacity-60 sm:left-[4%]" />
        <OceanBubbles className="right-0 bottom-16 -scale-x-100 opacity-60 sm:right-[4%]" />

        <div className="relative mx-auto w-full max-w-[1352px]">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            {/* Hero Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 font-detail text-xs font-semibold tracking-wider text-secondary uppercase">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-primary"
                />
                Penyu Gallery · Turtle Identity Challenge
              </span>

              <h1
                id="penyu-gallery-title"
                className="mt-5 font-body text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.14] font-semibold tracking-[-0.035em] text-primary"
              >
                <span className="block">Who’s that</span>
                <span className="mt-1 block font-display font-medium text-secondary">
                  Turtle?
                </span>
              </h1>

              <p className="mt-5 max-w-2xl font-detail text-base leading-relaxed text-secondary sm:text-lg">
                Study the shell and facial scale patterns across documented
                sightings. Make your guess—then hit reveal to meet the green sea
                turtle behind the profile!
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#penyu-catalog"
                  className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                >
                  Explore {turtles.length} turtles
                  <span aria-hidden="true">↓</span>
                </a>
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-surface px-5 py-3 font-body text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                >
                  Back to story
                </Link>
              </div>
            </div>

            {/* AdaPenyu Ocean Mystery Card */}
            <div
              data-header-theme="dark"
              className="relative isolate overflow-hidden rounded-[28px] bg-banner p-6 text-white shadow-[0_24px_64px_#00263c22] sm:p-8"
            >
              <Pattern variant="accuracy" parallax={false} />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative flex w-full max-w-[280px] items-center justify-center py-2">
                  <FigmaImage
                    name="banner-turtle"
                    width={437}
                    height={310}
                    className="h-auto w-full drop-shadow-[0_14px_24px_rgba(0,0,0,0.28)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -bottom-1 grid size-14 rotate-6 place-items-center rounded-2xl border-2 border-white/30 bg-primary font-display text-3xl font-bold text-white shadow-lg"
                  >
                    ?
                  </span>
                </div>
                <p className="mt-4 font-display text-xl font-medium text-white">
                  Every face pattern is unique
                </p>
                <p className="mt-1.5 max-w-sm font-detail text-xs leading-relaxed text-white/80 sm:text-sm">
                  Compare left and right facial profiles, post-ocular scale
                  counts, and identification codes across years of sightings.
                </p>
              </div>
            </div>
          </div>

          {/* Archive Statistics */}
          <dl
            aria-label="Archive statistics"
            className="mt-8 grid grid-cols-1 gap-3.5 sm:mt-10 sm:grid-cols-3 sm:gap-5"
          >
            <div className="rounded-[22px] border border-primary/10 bg-surface/85 p-5 backdrop-blur-xs">
              <dt className="font-display text-3xl font-medium text-primary sm:text-4xl">
                {turtles.length}
              </dt>
              <dd className="mt-1.5 font-detail text-xs font-semibold text-secondary sm:text-sm">
                Green sea turtles to guess
              </dd>
            </div>

            <div className="rounded-[22px] border border-primary/10 bg-surface/85 p-5 backdrop-blur-xs">
              <dt className="font-display text-3xl font-medium text-primary sm:text-4xl">
                {photoCount}
              </dt>
              <dd className="mt-1.5 font-detail text-xs font-semibold text-secondary sm:text-sm">
                Original profile photographs
              </dd>
            </div>

            <div className="rounded-[22px] border border-primary/10 bg-surface/85 p-5 backdrop-blur-xs">
              <dt className="font-display text-3xl font-medium text-primary sm:text-4xl">
                {yearSpan}
              </dt>
              <dd className="mt-1.5 font-detail text-xs font-semibold text-secondary sm:text-sm">
                Years of observations (2007–2024)
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Interactive Catalog */}
      <PenyuCatalog turtles={turtles} />

      {/* Footer */}
      <footer
        data-header-theme="dark"
        className="relative isolate overflow-hidden bg-banner px-[var(--page-gutter)] py-9 text-white [overflow-anchor:none] sm:py-12"
      >
        <Pattern variant="accuracy" parallax={false} />
        <div className="relative mx-auto grid w-full max-w-[1440px] gap-5 font-body text-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 md:gap-14">
          <Link
            href="/"
            aria-label="AdaPenyu home"
            className="inline-flex min-h-11 w-fit items-center rounded-lg focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Image
              src="/images/marketing/wordmark.svg"
              alt="AdaPenyu"
              width={251}
              height={78}
              unoptimized
              className="h-auto w-24 brightness-0 invert"
            />
          </Link>
          <p>© 2026 AdaPenyu. All rights reserved.</p>
          <a
            href="mailto:adapenyu@gmail.com"
            className="inline-flex min-h-11 w-fit items-center rounded-sm hover:underline hover:underline-offset-4 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            adapenyu@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
