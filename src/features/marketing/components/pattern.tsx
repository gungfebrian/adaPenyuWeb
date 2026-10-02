import { FigmaImage } from "./figma-image";

type PatternVariant = "hero" | "story" | "benefits" | "accuracy";
const variants = {
  hero: { name: "hero-pattern", width: 1512, height: 1635 },
  story: { name: "story-pattern", width: 1512, height: 1107 },
  benefits: { name: "benefits-pattern", width: 1512, height: 1313 },
  accuracy: { name: "accuracy-pattern", width: 1369, height: 430 },
} as const;

export function Pattern({ variant, parallax = true }: { variant: PatternVariant; parallax?: boolean }) {
  const artwork = variants[variant];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div data-parallax={parallax ? (variant === "hero" || variant === "benefits" ? "20" : "-24") : undefined} className="absolute -inset-y-5 inset-x-0">
        <FigmaImage {...artwork} loading={variant === "hero" ? "eager" : "lazy"} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
