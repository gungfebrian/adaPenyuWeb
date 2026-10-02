import { BenefitCard } from "../components/benefit-card";
import { benefits } from "../content";
import { FigmaImage } from "../components/figma-image";
import { Pattern } from "../components/pattern";
import { OceanBubbles } from "../components/ocean-artwork";

const screens = [
  { name: "app-photo", width: 272, height: 590, alt: "Turtle photo capture in the AdaPenyu prototype", position: "mt-[4%] w-[27.2%]" },
  { name: "app-catalogue", width: 348, height: 691, alt: "Shared turtle catalogue in the AdaPenyu prototype", position: "w-[34.8%]" },
  { name: "app-record", width: 275, height: 590, alt: "Individual turtle record and body condition history", position: "mt-[4%] w-[27.5%]" },
] as const;

export function BenefitsSection() {
  return (
    <section data-motion-section aria-labelledby="benefits-title" className="relative px-[var(--page-gutter)] pt-[76px] pb-16 text-primary md:px-0 md:pt-[6.6138cqw] md:pb-[6.6138cqw]">
      <Pattern variant="benefits" />
      <OceanBubbles className="bottom-[12%] -left-8 opacity-40 md:left-[1%]" />
      <OceanBubbles className="-right-8 bottom-[24%] -scale-x-100 opacity-40 md:right-[1%]" />
      <div aria-hidden="true" data-parallax="-44" data-parallax-rotate="10" className="pointer-events-none absolute -top-[71px] right-[-22px] z-2 h-32 w-[180px] md:-top-[10.3cqw] md:right-[-5.1%] md:h-[20.5129cqw] md:w-[28.9056cqw]">
        <div data-idle="turtle" className="h-full w-full"><FigmaImage name="banner-turtle" width={437} height={310} className="h-full w-full" /></div>
      </div>
      <div className="relative mx-auto w-full max-w-[1512px]">
      <h2 id="benefits-title" data-reveal className="relative font-detail text-lg leading-[1.209] font-medium text-secondary md:ml-[5.291cqw] md:text-[1.9841cqw]">What it does?</h2>
      <div data-stagger className="relative mt-[26px] grid grid-cols-1 gap-7 md:mt-[1.3709cqw] md:ml-[3.1085cqw] md:grid-cols-[26.1905cqw_27.9762cqw_34.9868cqw] md:gap-0">
        {benefits.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
      </div>
      <div data-prototype-sequence className="relative mx-auto mt-12 max-w-[1000px] md:mt-[4cqw] md:w-[66.1376cqw]">
      <div className="flex items-start justify-between gap-[4%]">
        {screens.map((screen, index) => (
          <figure data-phone key={screen.name} className={`group/phone relative shrink-0 origin-top ${index === 1 ? "z-2" : "z-1"} ${screen.position}`}>
            <div className="transition-transform duration-300 ease-out motion-safe:[@media(hover:hover)]:group-hover/phone:-translate-y-2 motion-reduce:transition-none">
              <FigmaImage name={screen.name} width={screen.width} height={screen.height} alt={screen.alt} sizes="(max-width: 767px) 30vw, 23vw" className="h-auto w-full" />
            </div>
          </figure>
        ))}
      </div>
      </div>
      </div>
    </section>
  );
}
