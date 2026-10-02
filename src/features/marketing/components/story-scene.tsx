import type { ReactNode } from "react";

const layers = ["z-0", "z-10", "z-20", "z-30", "z-40", "z-50"] as const;

/** Stable frames support precise navigation while their inner sheets animate. */
export function StoryScene({ children, layer = 0, anchor }: { children: ReactNode; layer?: 0 | 1 | 2 | 3 | 4 | 5; anchor?: string }) {
  return (
    <div data-scene data-scene-anchor={anchor} data-scene-first={layer === 0 ? "true" : undefined} className={`relative left-1/2 w-[var(--scene-width,100vw)] -translate-x-1/2 ${layers[layer]} ${anchor === "our-project" ? "bg-banner" : ""}`}>
      <div data-scene-sheet className={`origin-top ${anchor === "our-project" ? "bg-banner rounded-t-[28px] lg:rounded-t-[48px] [&>div]:rounded-t-[inherit] [&_[data-story-pin]]:rounded-t-[inherit] [&>div>section:first-child]:rounded-t-[inherit]" : "bg-paper"}`}>{children}</div>
    </div>
  );
}
