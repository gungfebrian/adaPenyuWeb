import { Pattern } from "../components/pattern";
import { HeroLogo } from "../components/hero-logo";
import { OceanReef, OceanBubbles } from "../components/ocean-artwork";

export function HeroSection() {
  return (
    <section id="home" data-motion-section aria-labelledby="hero-title" className="relative isolate min-h-svh scroll-mt-0 px-[var(--page-gutter)] pt-28 pb-16 text-ink sm:pt-32 md:pt-[11.1cqw] md:pb-[5.3cqw] min-[120rem]:pt-[max(11.1cqw,14svh)]">
      <Pattern variant="hero" />
      <div className="relative mx-auto max-w-[900px] text-center min-[120rem]:max-w-[1125px]">
        <h1 id="hero-title" className="font-body text-[clamp(2.25rem,4.23vw,4rem)] leading-[1.22] font-medium tracking-[-0.035em] max-md:text-[clamp(30px,8.7vw,36px)] max-md:[&_span]:text-balance min-[120rem]:text-[clamp(4rem,3.125vw,5rem)]">
          <span data-reveal className="block">Every turtle’s story starts</span>
          <span data-reveal className="block">with <strong className="font-bold">recognition</strong></span>
        </h1>
        <p data-reveal className="mx-auto mt-5 max-w-[796px] font-body text-[clamp(1.1rem,2.38vw,2.25rem)] leading-[1.4] max-md:max-w-[32ch] max-md:text-[17px] max-md:leading-relaxed max-md:text-pretty md:mt-7 min-[120rem]:max-w-[995px] min-[120rem]:text-[clamp(2.25rem,1.76vw,2.8125rem)]">AdaPenyu helps <strong className="font-bold">identify individual sea turtles</strong> through their unique facial patterns</p>
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
