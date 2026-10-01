import { Pattern } from "../components/pattern";
import { FigmaImage } from "../components/figma-image";

export function HeroSection() {
  return (
    <section id="home" data-motion-section aria-labelledby="hero-title" className="relative isolate scroll-mt-0 px-6 pt-28 pb-16 text-ink sm:pt-32 md:px-[5.3%] md:pt-[11.1cqw] md:pb-[8.5cqw]">
      <Pattern variant="hero" />
      <div className="relative mx-auto max-w-[900px] text-center">
        <h1 id="hero-title" className="font-body text-[clamp(2.25rem,4.23vw,4rem)] leading-[1.22] font-medium tracking-[-0.035em]">
          <span data-reveal className="block">Every turtle’s story starts</span>
          <span data-reveal className="block">with <strong className="font-bold">recognition</strong></span>
        </h1>
        <p data-reveal className="mx-auto mt-5 max-w-[796px] font-body text-[clamp(1.1rem,2.38vw,2.25rem)] leading-[1.4] md:mt-7">AdaPenyu helps <strong className="font-bold">identify individual sea turtles</strong> through their unique facial patterns</p>
      </div>
      <div data-hero-media className="relative mx-auto mt-9 max-w-[1122px] md:mt-12">
        <div className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-primary/8 bg-surface px-6 py-12 text-primary sm:min-h-[320px] md:aspect-[1122/546] md:py-0">
          <FigmaImage name="app-icon" width={1024} height={1024} className="h-24 w-24 rounded-[25px] shadow-[0_16px_38px_#00263c20] sm:h-28 sm:w-28 md:h-36 md:w-36 md:rounded-[36px]" loading="eager" />
          <FigmaImage name="wordmark" width={251} height={78} className="mt-5 h-auto w-40 sm:w-44 md:w-52" />
        </div>
      </div>
    </section>
  );
}
