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
        className="relative isolate overflow-hidden px-[var(--page-gutter)] pt-24 pb-12 sm:pt-28 sm:pb-16"
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

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
            <div>
              <p className="font-detail text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
                A closer look beneath the surface
              </p>
              <h1 id="penyu-gallery-title" className="mt-5 font-body text-[clamp(3rem,5.8vw,5.25rem)] leading-[1.06] font-medium tracking-[-0.055em]">
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
                    <dt className="font-body text-lg font-medium tracking-tight sm:text-2xl">{value}</dt>
                    <dd className="mt-1 font-detail text-[11px] leading-relaxed text-secondary sm:text-xs">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-[90%] max-w-[380px] pt-3 pb-12 pl-12 sm:w-full sm:max-w-[550px] sm:pl-16 lg:pl-12">
              <div aria-hidden="true" className="absolute inset-x-3 inset-y-10 -z-10 rounded-[50%] bg-surface" />
              <figure className="relative ml-auto w-[92%] rotate-3 rounded-[26px] border border-primary/10 bg-paper p-2.5 shadow-[0_14px_36px_#00263c12] sm:p-3">
                <Image
                  src="/turtles/Green/Calvin/2021/Calvin_2021_L.webp"
                  alt="The left facial profile of a green sea turtle, showing its eye and scale patterns."
                  width={616}
                  height={592}
                  preload
                  unoptimized
                  sizes="(min-width: 1024px) 440px, (min-width: 640px) 420px, 72vw"
                  className="h-auto w-full rounded-[18px]"
                />
                <figcaption className="flex items-center justify-between gap-3 px-2 pt-3 pb-1 font-detail text-[11px] text-secondary sm:text-xs">
                  <span>Left facial profile</span><span>2021</span>
                </figcaption>
              </figure>
              <figure className="absolute bottom-0 left-0 w-[43%] -rotate-6 rounded-[20px] border border-primary/10 bg-paper p-2 shadow-[0_10px_28px_#00263c18]">
                <Image
                  src="/turtles/Green/Calvin/2021/Calvin_2021_R.webp"
                  alt="The same green sea turtle photographed from its right side."
                  width={800}
                  height={755}
                  unoptimized
                  sizes="(min-width: 640px) 230px, 38vw"
                  className="aspect-square w-full rounded-[13px] object-contain bg-banner"
                />
                <figcaption className="px-1 pt-2 pb-0.5 font-detail text-[11px] text-secondary sm:text-xs">A different perspective.</figcaption>
              </figure>
              <div aria-hidden="true" className="absolute -top-2 -right-1 w-[80px] rotate-12 sm:-right-2 sm:w-[110px]">
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
