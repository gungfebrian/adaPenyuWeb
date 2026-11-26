import Image from "next/image";
import { buttonClasses } from "@/components/ui/button";
import { FigmaImage } from "@/features/marketing/components/figma-image";
import { OceanBubbles } from "@/features/marketing/components/ocean-artwork";
import { Pattern } from "@/features/marketing/components/pattern";
import { MarketingFooter } from "@/features/marketing/sections/community-section";
import { PenyuCatalog } from "./components/penyu-catalog";
import turtlesData from "./data/turtles.json";
import type { GalleryTurtle } from "./types";

export function PenyuGalleryPage() {
  const turtles = turtlesData as GalleryTurtle[];
  const photoCount = turtles.reduce(
    (total, turtle) => total + turtle.sightings.reduce(
      (count, sighting) => count + Object.keys(sighting.photos).length, 0,
    ), 0,
  );
  const firstYear = Math.min(...turtles.map((turtle) => turtle.firstYear));
  const lastYear = Math.max(...turtles.map((turtle) => turtle.lastYear));

  return (
    <main id="main-content" tabIndex={-1} className="bg-paper text-primary outline-none">
      <section
        id="gallery-hero"
        aria-labelledby="penyu-gallery-title"
        className="relative isolate overflow-hidden px-[var(--page-gutter)] pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20"
      >
        <Pattern variant="hero" parallax={false} />
        <OceanBubbles className="-left-10 bottom-8 opacity-35 sm:left-[2%]" />
        <OceanBubbles className="-right-10 top-24 -scale-x-100 opacity-30 sm:right-[2%]" />

        <div className="relative mx-auto grid w-full max-w-[1352px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="min-w-0 max-w-xl">
            <p className="font-detail text-base font-medium text-secondary sm:text-lg">
              Penyu Gallery
            </p>
            <h1
              id="penyu-gallery-title"
              className="mt-4 font-display text-[clamp(36px,5vw,62px)] leading-[1.12] font-medium tracking-[-0.02em] text-primary"
            >
              Every face has<br />
              its own story
            </h1>
            <p className="mt-5 max-w-[44ch] font-body text-base leading-relaxed text-secondary sm:text-lg">
              Explore {turtles.length} green sea turtles photographed in Réunion between{" "}
              {firstYear} and {lastYear}. Study the facial scales behind each eye to
              recognise returning individuals.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#penyu-catalog"
                className={buttonClasses("primary", "rounded-2xl")}
              >
                Explore the gallery <span aria-hidden="true">↓</span>
              </a>
              <a
                href="#gallery-photo-credits"
                className="inline-flex min-h-11 items-center rounded-sm font-detail text-sm font-medium text-secondary underline decoration-primary/25 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
              >
                Photo credits
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-[640px] pb-5 sm:pb-6 lg:mx-0 lg:ml-auto">
            <div className="relative isolate overflow-hidden rounded-[24px] bg-banner p-5 text-white shadow-[0_24px_64px_#00263c20] sm:rounded-[36px] sm:p-7">
              <Pattern variant="accuracy" parallax={false} />
              <div className="relative">
                <p className="font-detail text-sm font-medium text-white/75">
                  One turtle, two perspectives
                </p>
                <p className="mt-1 font-display text-xl font-medium text-white sm:text-2xl">
                  Calvin · 2021
                </p>
              </div>
              <figure className="relative mt-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="overflow-hidden rounded-[18px] bg-primary/40 ring-1 ring-white/15">
                      <Image
                        src="/turtles/Green/Calvin/2021/Calvin_2021_L.webp"
                        alt="The left facial profile of a green sea turtle named Calvin, showing its eye and scale patterns."
                        width={616}
                        height={592}
                        preload
                        unoptimized
                        sizes="(min-width: 1024px) 280px, 44vw"
                        className="aspect-[5/4] h-auto w-full object-cover"
                      />
                    </div>
                    <p className="mt-2.5 font-detail text-xs text-white/75">Left profile</p>
                  </div>
                  <div>
                    <div className="overflow-hidden rounded-[18px] bg-primary/40 ring-1 ring-white/15">
                      <Image
                        src="/turtles/Green/Calvin/2021/Calvin_2021_R.webp"
                        alt="The right facial profile of the same green sea turtle named Calvin."
                        width={800}
                        height={755}
                        unoptimized
                        sizes="(min-width: 1024px) 280px, 44vw"
                        className="aspect-[5/4] h-auto w-full object-cover"
                      />
                    </div>
                    <p className="mt-2.5 font-detail text-xs text-white/75">Right profile</p>
                  </div>
                </div>
                <figcaption className="mt-4 border-t border-white/15 pt-4 font-detail text-xs leading-relaxed text-white/80">
                  {turtles.length} individuals · {photoCount} original photographs from Réunion
                </figcaption>
              </figure>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 -bottom-4 w-24 rotate-12 sm:-right-5 sm:w-32"
            >
              <FigmaImage name="banner-turtle" width={437} height={310} className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <PenyuCatalog turtles={turtles} />

      <aside
        id="gallery-photo-credits"
        aria-labelledby="gallery-credits-heading"
        className="scroll-mt-28 bg-paper px-[var(--page-gutter)] pt-4 pb-16 sm:pb-20"
      >
        <div className="mx-auto grid w-full max-w-[1352px] gap-4 rounded-[24px] bg-surface px-6 py-7 sm:grid-cols-[0.85fr_1.5fr] sm:gap-10 sm:rounded-[28px] sm:px-9 sm:py-8">
          <div>
            <p className="font-detail text-sm font-medium text-secondary">Photo credits</p>
            <h2
              id="gallery-credits-heading"
              className="mt-1.5 font-display text-2xl font-medium text-primary"
            >
              Behind the photographs
            </h2>
          </div>
          <div className="max-w-2xl font-detail text-sm leading-relaxed text-secondary">
            <p>
              This selection of {turtles.length} green sea turtle profiles and {photoCount} photographs
              comes from ReunionTurtles, shared by WildlifeDatasets on Kaggle. Photographs © Kelonia,
              Réunion. The dataset lists Claire Jean as the owner’s contact. Photo use is subject to
              the dataset’s usage terms.
            </p>
            <a
              href="https://www.kaggle.com/datasets/wildlifedatasets/reunionturtles"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-sm font-body text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-secondary hover:decoration-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              Dataset &amp; usage terms <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </aside>

      <MarketingFooter homeHref="/" />
    </main>
  );
}
