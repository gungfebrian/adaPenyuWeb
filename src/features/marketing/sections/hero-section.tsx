import { Pattern } from "../components/pattern";
import { HeroLogo } from "../components/hero-logo";
import { OceanReef, OceanBubbles } from "../components/ocean-artwork";

export function HeroSection() {
  return (
    <section id="home" data-motion-section aria-labelledby="hero-title" className="relative isolate scroll-mt-0 px-6 pt-28 pb-16 text-ink sm:pt-32 md:px-[5.3%] md:pt-[11.1cqw] md:pb-[5.3cqw]">
      <Pattern variant="hero" />
      <div className="relative mx-auto max-w-[900px] text-center">
        <h1 id="hero-title" className="font-body text-[clamp(2.25rem,4.23vw,4rem)] leading-[1.22] font-medium tracking-[-0.035em]">
          <span data-reveal className="block">Every turtle’s story starts</span>
          <span data-reveal className="block">with <strong className="font-bold">recognition</strong></span>
        </h1>
        <p data-reveal className="mx-auto mt-5 max-w-[796px] font-body text-[clamp(1.1rem,2.38vw,2.25rem)] leading-[1.4] md:mt-7">AdaPenyu helps <strong className="font-bold">identify individual sea turtles</strong> through their unique facial patterns</p>
      </div>
      <div data-hero-media className="relative z-1 mx-auto mt-9 flex min-h-[280px] max-w-[1122px] items-start justify-center pt-6 pb-12 sm:min-h-[300px] sm:pt-8 md:mt-12 md:min-h-[300px] md:pt-8 md:pb-6">
        <HeroLogo />
      </div>
      <OceanBubbles className="bottom-24 left-0 sm:bottom-32 sm:left-[8%]" />
      <OceanBubbles className="right-0 bottom-32 -scale-x-100 sm:right-[8%] sm:bottom-44" />
      <OceanReef />
    </section>
  );
}
