export type OceanChapter = "story" | "steps";

/** Owner-supplied contours: simple paths rather than tonal illustration traces. */
export const chapterReefs = [
  { file: "09-distant-reef-layer", width: 3080, height: 628, depth: 10, position: "h-[clamp(100px,22svh,280px)] opacity-60" },
  { file: "10-middle-reef-layer", width: 3080, height: 552, depth: 18, position: "h-[clamp(80px,18svh,230px)] opacity-80" },
  { file: "11-foreground-reef-layer", width: 3080, height: 170, depth: 28, position: "h-[clamp(40px,7svh,90px)]" },
] as const;

export const chapterSilhouettes = [
  { file: "seaweed/21-left-distant-kelp", width: 57, height: 304, position: "left-4 bottom-8 w-[clamp(24px,3vw,48px)] opacity-60" },
  { file: "seaweed/22-right-distant-kelp", width: 55, height: 320, position: "right-4 bottom-8 w-[clamp(24px,3vw,48px)] opacity-60" },
  { file: "coral/13-small-distant-left-coral-01", width: 62, height: 85, position: "left-[5%] bottom-9 w-[clamp(42px,5vw,78px)] opacity-70" },
  { file: "coral/15-small-distant-right-coral-01", width: 80, height: 80, position: "right-[5%] bottom-9 w-[clamp(45px,6vw,90px)] opacity-70" },
] as const;

/** Small additional branches distinguish steps without replacing the original beds. */
export const stepCorals = [
  { file: "coral/14-small-distant-left-coral-02", width: 49, height: 56, depth: 12, position: "left-[13%] bottom-14 w-[clamp(30px,4vw,60px)] opacity-45" },
  { file: "coral/16-small-distant-right-coral-02", width: 57, height: 82, depth: 12, position: "right-[14%] bottom-16 w-[clamp(32px,4vw,68px)] opacity-45" },
  { file: "coral/40-small-seabed-coral", width: 50, height: 45, depth: 18, position: "left-[22%] bottom-12 w-[clamp(24px,3vw,46px)] opacity-85" },
  { file: "coral/40-small-seabed-coral", width: 50, height: 45, depth: 18, position: "right-[23%] bottom-14 w-[clamp(22px,3vw,42px)] -scale-x-100 opacity-75" },
] as const;
