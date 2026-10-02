import { IdentificationStep } from "../components/identification-step";
import { identificationSteps } from "../content";
import { FigmaImage } from "../components/figma-image";
import { OceanCurrents } from "../components/ocean-artwork";

export function HowItWorksSection() {
  return (
    <>
      <div data-scroll-stage><section id="how-it-works" data-steps-pin data-motion-section aria-labelledby="how-title" className="relative min-h-svh scroll-mt-0 text-primary px-6 pt-28 pb-16 lg:[@media(min-height:720px)]:px-0 lg:[@media(min-height:720px)]:pt-[max(100px,9vh)] lg:[@media(min-height:720px)]:pb-8">
        <p data-reveal className="font-detail text-lg leading-[1.209] font-medium text-secondary md:ml-[5.6217cqw] md:text-[1.9841cqw]">How AdaPenyu works?</p>
        <h2 id="how-title" data-reveal className="mt-4 md:mt-[0.7275cqw] md:ml-[3.836cqw]">
          <span className="sr-only">Three steps only</span>
          <FigmaImage name="steps-title" width={698} height={101} className="h-auto w-full max-w-[698px] md:w-[46.164cqw] md:max-w-none" />
        </h2>
        <ol className="mt-9 grid w-full list-none gap-[46px] p-0 md:mt-[3.3069cqw] md:ml-[28.5053cqw] md:w-[44.8413cqw] md:gap-0 lg:[@media(min-height:720px)]:mt-[3vh]">
          {identificationSteps.map((step, index) => <IdentificationStep key={step.number} {...step} isLast={index === identificationSteps.length - 1} />)}
        </ol>
      </section></div>
      <section data-header-theme="dark" data-motion-section aria-labelledby="complement-title" className="relative z-1 bg-banner px-6 pt-11 pb-[70px] text-center text-white md:min-h-[22.3545cqw] md:px-0 md:pt-[4.2989cqw] md:pb-12">
        <OceanCurrents />
        <h2 id="complement-title" data-reveal className="relative font-display text-[26px] leading-[1.3] font-medium md:text-[2.7778cqw] md:leading-[1.85]">Turtle ID does NOT replace tags or satellites</h2>
        <p data-reveal className="relative mx-auto mt-[22px] max-w-[560px] font-detail text-[19px] leading-[1.5] font-medium md:mt-[1.6534cqw] md:max-w-[47.8836cqw] md:text-[2.1164cqw] md:leading-[1.22]">It complements them with something every turtle is already wearing</p>
      </section>
    </>
  );
}
