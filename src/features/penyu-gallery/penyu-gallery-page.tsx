import Image from "next/image";
import Link from "next/link";
import { FigmaImage } from "@/features/marketing/components/figma-image";
import { Pattern } from "@/features/marketing/components/pattern";
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
        className="relative isolate overflow-hidden px-[var(--page-gutter)] pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32"
      >
        <div className="absolute inset-0 -z-10 opacity-35">
          <Pattern variant="hero" parallax={false} />
        </div>
        <div className="mx-auto max-w-[1280px]">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-3 font-detail text-xs text-secondary sm:mb-4">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Penyu Gallery</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-paper/80 px-3.5 py-2 font-detail text-xs font-semibold tracking-[0.12em] text-secondary uppercase">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
                Réunion · Green sea turtles
              </p>
              <h1 id="penyu-gallery-title" className="mt-6 font-body text-[clamp(3.25rem,6vw,5.5rem)] leading-[1.04] font-medium tracking-[-0.055em]">
                Every face<br />
                has a <span className="font-display tracking-[-0.045em] text-secondary">story.</span>
              </h1>
              <p className="mt-6 max-w-[390px] font-detail text-base leading-relaxed text-secondary sm:text-lg">
                Look closer at Réunion’s green sea turtles. Follow their facial
                patterns and discover who’s behind each face.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a href="#penyu-catalog" className="inline-flex min-h-12 items-center gap-5 rounded-full bg-primary px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
                  Explore gallery
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5"><path d="M12 4v16m-6-6 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a href="#gallery-photo-credits" className="inline-flex min-h-11 items-center rounded-sm font-detail text-xs font-medium text-secondary underline decoration-primary/25 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
                  Photo credits
                </a>
              </div>

              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-primary/15 pt-5 sm:mt-10 sm:gap-6 sm:pt-6">
                {[
                  [String(turtles.length).padStart(2, "0"), "Individual turtles"],
                  [String(photoCount), "Original photographs"],
                  [firstYear + "–" + lastYear, "Years of sightings"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-detail text-xs leading-relaxed text-secondary">{label}</dt>
                    <dd className="mt-2 font-body text-xl font-medium tracking-tight tabular-nums sm:text-2xl">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-[600px] pb-5 sm:pb-7">
              <div className="relative isolate overflow-hidden rounded-[28px] bg-banner p-4 text-white sm:rounded-[36px] sm:p-6">
                <div className="absolute inset-0 -z-10 opacity-30"><Pattern variant="accuracy" parallax={false} /></div>
                <div className="mb-5 flex items-center justify-between gap-4 font-detail text-xs">
                  <span className="tracking-[0.14em] uppercase">A study in patterns</span>
                  <span className="rounded-full border border-white/30 px-3 py-1.5">2021</span>
                </div>
                <figure>
                  <div className="grid grid-cols-[1.35fr_1fr] items-end gap-3 sm:gap-4">
                    <div className="overflow-hidden rounded-[20px] border border-white/15 bg-primary">
                      <Image
                        src="/turtles/Green/Calvin/2021/Calvin_2021_L.webp"
                        alt="The left facial profile of a green sea turtle, showing its eye and scale patterns."
                        width={616}
                        height={592}
                        preload
                        unoptimized
                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 310px, 52vw"
                        className="aspect-[4/5] h-auto w-full object-contain"
                      />
                    </div>
                    <div className="pb-7 sm:pb-10">
                      <p className="mb-3 font-detail text-xs text-white/85">One turtle.<br />Two perspectives.</p>
                      <div className="overflow-hidden rounded-[18px] border border-white/15 bg-primary">
                        <Image
                          src="/turtles/Green/Calvin/2021/Calvin_2021_R.webp"
                          alt="The same green sea turtle photographed from its right side."
                          width={800}
                          height={755}
                          unoptimized
                          sizes="(min-width: 640px) 230px, 38vw"
                          className="aspect-[4/5] h-auto w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <figcaption className="mt-5 border-t border-white/20 pt-4 font-detail text-xs leading-relaxed text-white/85">
                    Left &amp; right facial profiles · Original photographs
                  </figcaption>
                </figure>
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute -right-3 -bottom-4 w-24 rotate-12 sm:-right-5 sm:w-32">
                <FigmaImage name="banner-turtle" width={437} height={310} className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PenyuCatalog turtles={turtles} />

      <aside id="gallery-photo-credits" aria-labelledby="gallery-credits-heading" className="scroll-mt-28 border-t border-primary/10 bg-surface px-[var(--page-gutter)] py-9 sm:py-12">
        <div className="mx-auto grid max-w-[1280px] gap-4 sm:grid-cols-[1fr_2fr] sm:gap-12">
          <h2 id="gallery-credits-heading" className="font-body text-base font-semibold">Behind the photographs</h2>
          <div className="max-w-2xl font-detail text-sm leading-relaxed text-secondary">
            <p>
              This selection of {turtles.length} green sea turtle profiles and {photoCount} photographs comes from ReunionTurtles, shared by WildlifeDatasets on Kaggle.
              Photographs © Kelonia, Réunion. The dataset lists Claire Jean as the owner’s contact. Photo use is subject to the dataset’s usage terms.
            </p>
            <a href="https://www.kaggle.com/datasets/wildlifedatasets/reunionturtles" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-primary underline underline-offset-4 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
              Dataset &amp; usage terms
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4"><path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </aside>

      <footer data-header-theme="dark" className="relative isolate overflow-hidden bg-banner px-[var(--page-gutter)] py-8 text-white sm:py-10">
        <Pattern variant="accuracy" parallax={false} />
        <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-8 gap-y-5 font-detail text-xs">
          <Link href="/" aria-label="AdaPenyu home" className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <FigmaImage name="footer-wordmark" alt="AdaPenyu" width={129} height={40} className="h-auto w-28" />
          </Link>
          <p className="text-white/80">© 2026 AdaPenyu. Website design and interface.</p>
          <a href="mailto:adapenyu@gmail.com" className="inline-flex min-h-11 items-center rounded-sm hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">adapenyu@gmail.com</a>
        </div>
      </footer>
    </main>
  );
}
