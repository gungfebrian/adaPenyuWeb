import { FigmaImage } from "./figma-image";

/** Brand-colored SVG currents sit directly on the original hero pattern. */
export function HeroTurtleScene() {
  return (
    <div data-hero-media className="relative mx-auto mt-9 max-w-[1122px] md:mt-12">
      <div data-hero-ocean aria-hidden="true" className="relative isolate min-h-[280px] overflow-hidden sm:min-h-[340px] md:aspect-[1122/546]">
        <svg viewBox="0 0 1122 546" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full text-secondary/10" fill="none" stroke="currentColor" strokeWidth="2">
          <path data-hero-wave d="M-160 215C50 80 210 80 440 180S790 270 1280 70" />
          <path data-hero-wave d="M-160 350C90 175 295 205 530 315S970 405 1280 215" />
          <path data-hero-wave d="M-160 490C130 340 340 345 615 450S1040 500 1280 360" />
        </svg>
        <svg viewBox="0 0 1122 546" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full text-secondary/15" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="552" cy="320" rx="202" ry="68" />
          <ellipse cx="552" cy="320" rx="252" ry="88" opacity="0.5" />
        </svg>
        <div className="absolute top-[43%] left-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2 sm:w-[270px] md:w-[34%] md:max-w-[380px]">
          <div data-idle="hero-turtle">
            <div data-hero-turtle-pointer>
              <FigmaImage name="banner-turtle" width={437} height={310} loading="eager" className="h-auto w-full" />
            </div>
          </div>
        </div>
        <FigmaImage name="wordmark" width={251} height={78} className="pointer-events-none absolute bottom-6 left-1/2 h-auto w-32 -translate-x-1/2 opacity-80 sm:bottom-8 sm:w-40" />
      </div>
    </div>
  );
}
