import { BenefitCard } from "../components/benefit-card";
import { benefits } from "../content";
import { FigmaImage } from "../components/figma-image";
import { Pattern } from "../components/pattern";
import { OceanBubbles } from "../components/ocean-artwork";
import { PhoneCarousel } from "../components/phone-carousel";
import { prototypeScreens } from "../data/prototype-screens";

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
      <div data-stagger className="relative mt-[26px] grid grid-cols-1 gap-4 md:mt-[1.3709cqw] md:ml-[3.1085cqw] md:grid-cols-[26.1905cqw_27.9762cqw_34.9868cqw] md:gap-0">
        {benefits.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
      </div>
      <PhoneCarousel />
      <div data-prototype-sequence className="relative mx-auto hidden md:mt-[4cqw] md:block md:w-[66.1376cqw] md:max-w-[1000px]">
      <div className="relative flex items-start justify-between gap-[4%]">
        {prototypeScreens.map((screen, index) => (
          <figure data-phone key={screen.name} className={`group/phone shrink-0 origin-top ${index === 1 ? "z-2" : "z-1"} ${screen.position}`}>
            <div className="transition-transform duration-300 ease-out motion-safe:[@media(hover:hover)]:group-hover/phone:-translate-y-2 motion-reduce:transition-none">
              <FigmaImage name={screen.name} width={screen.width} height={screen.height} alt={screen.alt} sizes="23vw" className="h-auto w-full" />
            </div>
          </figure>
        ))}
      </div>
      </div>
      </div>
    </section>
  );
}
