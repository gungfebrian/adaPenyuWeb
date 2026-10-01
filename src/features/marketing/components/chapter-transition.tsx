import { FigmaImage } from "./figma-image";

/** Outside the container so the transition always covers the viewport. */
export function ChapterTransition() {
  return <div data-chapter-curtain aria-hidden="true" className="pointer-events-none fixed inset-0 z-90 flex flex-col items-center justify-center gap-6 bg-banner text-white [transform:translateY(100%)]">
    <FigmaImage name="footer-wordmark" width={129} height={40} className="h-10 w-auto" />
    <span data-chapter-label className="font-body text-sm tracking-[0.08em]" />
  </div>;
}
