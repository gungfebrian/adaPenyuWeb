import { FigmaImage } from "../components/figma-image";
import { Pattern } from "../components/pattern";
import { OceanCurrents } from "../components/ocean-artwork";

const arrows = {
  first: "lg:[@media(min-height:720px)]:top-[34%] lg:[@media(min-height:720px)]:left-[40.4%] lg:[@media(min-height:720px)]:h-[min(15.1cqw,21vh)] lg:[@media(min-height:720px)]:w-[15.25cqw]",
  second: "lg:[@media(min-height:720px)]:top-[58%] lg:[@media(min-height:720px)]:left-[58.4%] lg:[@media(min-height:720px)]:h-[7.34cqw] lg:[@media(min-height:720px)]:w-[7.54cqw]",
  third: "lg:[@media(min-height:720px)]:top-[76%] lg:[@media(min-height:720px)]:left-[39.35%] lg:[@media(min-height:720px)]:h-[9.68cqw] lg:[@media(min-height:720px)]:w-[9.82cqw]",
} as const;

function StoryArrow({ variant, mobile = false }: { variant: keyof typeof arrows; mobile?: boolean }) {
  return <div aria-hidden="true" data-story-arrow={mobile ? undefined : variant} className={`pointer-events-none absolute items-center justify-center ${mobile ? "-top-20 right-2 flex h-16 w-20 lg:[@media(min-height:720px)]:hidden" : `hidden lg:[@media(min-height:720px)]:flex ${arrows[variant]}`}`}>
    <FigmaImage name={`story-arrow-${variant}`} width={variant === "first" ? 231 : variant === "second" ? 114 : 148} height={variant === "first" ? 228 : variant === "second" ? 111 : 146} className="h-full w-full" />
  </div>;
}

export function StorySection() {
  return <div data-scroll-stage><section id="our-project" data-story-pin data-header-theme="dark" data-motion-section aria-labelledby="story-title" className="relative min-h-svh scroll-mt-0 bg-banner px-6 pt-28 pb-14 text-white lg:[@media(min-height:720px)]:h-svh lg:[@media(min-height:720px)]:p-0">
    <Pattern variant="story" />
    <OceanCurrents />
    <div className="relative flex flex-col lg:[@media(min-height:720px)]:h-full">
      <div data-story-opening className="lg:[@media(min-height:720px)]:absolute lg:[@media(min-height:720px)]:top-[14%] lg:[@media(min-height:720px)]:left-[5.3%] lg:[@media(min-height:720px)]:w-[42.33%]">
        <p className="font-detail text-lg font-medium lg:[@media(min-height:720px)]:text-[clamp(20px,1.98cqw,30px)]">The Story Behind It</p>
        <h2 id="story-title" className="mt-5 lg:[@media(min-height:720px)]:mt-5"><span className="sr-only">Turtles are being traded illegally</span><FigmaImage name="story-title" width={640} height={200} className="h-auto w-full max-w-[640px]" /></h2>
      </div>
      <div data-story-beat className="relative mt-[90px] w-full lg:[@media(min-height:720px)]:absolute lg:[@media(min-height:720px)]:top-[41%] lg:[@media(min-height:720px)]:right-[11%] lg:[@media(min-height:720px)]:mt-0 lg:[@media(min-height:720px)]:w-[43.5%] lg:[@media(min-height:720px)]:text-right">
        <StoryArrow variant="first" mobile />
        <h3 className="font-display text-[clamp(26px,2.78cqw,42px)] leading-[1.12] font-medium">Traded as individuals,<br className="hidden lg:[@media(min-height:720px)]:block" /> counted as a species.</h3>
        <p className="mt-4 font-detail text-[17px] leading-[1.4] font-medium lg:[@media(min-height:720px)]:mt-5 lg:[@media(min-height:720px)]:text-[clamp(18px,1.65cqw,25px)]">Without individual identification,<br className="hidden lg:[@media(min-height:720px)]:block" /> we can’t trace where a turtle came from</p>
      </div>
      <div data-story-beat className="relative mt-[90px] w-full lg:[@media(min-height:720px)]:absolute lg:[@media(min-height:720px)]:top-[65%] lg:[@media(min-height:720px)]:left-[18.2%] lg:[@media(min-height:720px)]:mt-0 lg:[@media(min-height:720px)]:w-[45%]">
        <StoryArrow variant="second" mobile />
        <h3 className="font-display text-[clamp(26px,2.78cqw,42px)] leading-[1.12] font-medium">Flipper tags fall off</h3>
        <p className="mt-4 font-detail text-[17px] leading-[1.4] font-medium lg:[@media(min-height:720px)]:mt-3 lg:[@media(min-height:720px)]:text-[clamp(18px,1.65cqw,25px)]">Require handling and can fall off</p>
      </div>
      <div data-story-beat className="relative mt-[90px] w-full lg:[@media(min-height:720px)]:absolute lg:[@media(min-height:720px)]:top-[82%] lg:[@media(min-height:720px)]:left-[56%] lg:[@media(min-height:720px)]:mt-0 lg:[@media(min-height:720px)]:w-[30%] lg:[@media(min-height:720px)]:text-right">
        <StoryArrow variant="third" mobile />
        <h3 className="font-display text-[clamp(26px,2.78cqw,42px)] leading-[1.12] font-medium">Satellite tracking<br /> is also expensive</h3>
      </div>
    </div>
    <StoryArrow variant="first" /><StoryArrow variant="second" /><StoryArrow variant="third" />
  </section></div>;
}
