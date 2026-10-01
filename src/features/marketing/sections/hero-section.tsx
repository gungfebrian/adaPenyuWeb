import { Pattern } from "../components/pattern";
import { HeroTurtleScene } from "../components/hero-turtle-scene";

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
      <HeroTurtleScene />
    </section>
  );
}
