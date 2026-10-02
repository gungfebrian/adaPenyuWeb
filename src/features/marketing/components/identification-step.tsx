import { FigmaImage } from "./figma-image";

type IdentificationStepProps = { number: string; title: string; description: string; isLast: boolean };

export function IdentificationStep({ number, title, description, isLast }: IdentificationStepProps) {
  return (
    <li data-step className="group relative grid min-h-28 grid-cols-[56px_minmax(0,1fr)] gap-4 text-on-primary md:min-h-[10.412cqw] md:grid-cols-[10.412cqw_1fr] md:gap-[0.2646cqw] md:first:mb-[3.6706cqw] md:[&:nth-child(2)]:mb-[4.8657cqw] lg:[@media(min-height:720px)]:min-h-0 lg:[@media(min-height:720px)]:grid-cols-[min(10.4cqw,14vh)_1fr] lg:[@media(min-height:720px)]:gap-[1.3cqw] lg:[@media(min-height:720px)]:first:mb-0 lg:[@media(min-height:720px)]:[&:nth-child(2)]:mb-0">
      <span data-step-circle aria-hidden="true" className="relative grid h-14 place-items-center font-display text-xl leading-none font-semibold md:h-[10.2851cqw] md:text-[clamp(25px,2.7778cqw,42px)] lg:[@media(min-height:720px)]:h-[min(10.4cqw,14vh)]">
        <span data-idle="step-mark" className="absolute inset-0 [mask-image:url('/images/marketing/step-circle.svg')] [mask-size:100%_100%] [mask-repeat:no-repeat]"><FigmaImage name="step-circle-white-fill" width={158} height={156} className="h-full w-full" /></span>
        <span className="relative text-white transition-transform duration-300 motion-safe:group-hover:scale-110">{number}</span>
      </span>
      <div data-step-copy className="min-w-0 pt-2 md:pt-[2.7778cqw] lg:[@media(min-height:720px)]:pt-[3vh]">
        <h3 className="font-display text-[clamp(22px,6.1vw,26px)] leading-[1.2] font-semibold md:text-[clamp(25px,2.7778cqw,42px)] md:leading-[1.88095] lg:[@media(min-height:720px)]:leading-[1.35]">{title}</h3>
        <p className={`mt-2 font-detail text-base leading-relaxed font-medium text-white md:mt-0 md:text-[clamp(17px,1.6534cqw,25px)] md:leading-[1.32] ${number === "01" ? "md:max-w-[26.3889cqw]" : "md:max-w-[32.3413cqw]"}`}>{description}</p>
      </div>
      {!isLast && <span data-step-arrow aria-hidden="true" className="absolute top-16 left-5 h-10 w-4 origin-top md:top-[9.6561cqw] md:left-[3.9683cqw] md:h-[6.8989cqw] md:w-[3.3069cqw] lg:[@media(min-height:720px)]:top-[13vh] lg:[@media(min-height:720px)]:left-[5.5vh] lg:[@media(min-height:720px)]:h-[8vh] lg:[@media(min-height:720px)]:w-[3vh]"><FigmaImage name="step-arrow-white" width={50} height={105} className="h-full w-full" /></span>}
    </li>
  );
}
