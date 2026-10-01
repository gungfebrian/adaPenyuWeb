import { animate, inView, stagger, type AnimationPlaybackControlsWithThen } from "motion";

import { motionDuration, motionEasing, motionStagger } from "@/lib/motion";

type InlineMotionState = {
  opacity: string;
  transform: string;
};

function isPinned(element: Element) {
  return element.closest("[data-story-pin], [data-steps-pin]") !== null;
}

function snapshotInlineStyles(elements: HTMLElement[]) {
  return new Map(
    elements.map((element) => [
      element,
      { opacity: element.style.opacity, transform: element.style.transform },
    ] as const),
  );
}

function restoreInlineStyles(styles: Map<HTMLElement, InlineMotionState>) {
  styles.forEach(({ opacity, transform }, element) => {
    element.style.opacity = opacity;
    element.style.transform = transform;
  });
}

/** Adds one-time entrance motion without hiding server-rendered content before observation. */
export function observeReveals(root: HTMLElement, distance = 24) {
  let active = true;
  const observers: (() => void)[] = [];
  const controls = new Set<AnimationPlaybackControlsWithThen>();
  const originalStyles = new Map<HTMLElement, InlineMotionState>();
  const staggeredElements = new Set<HTMLElement>();

  function play(elements: HTMLElement[], delay?: ReturnType<typeof stagger>) {
    if (!active || elements.length === 0) return;

    const styles = snapshotInlineStyles(elements);
    styles.forEach((style, element) => originalStyles.set(element, style));

    const control = animate(
      elements,
      { opacity: [0.2, 1], y: [distance, 0] },
      {
        duration: motionDuration.reveal,
        ease: motionEasing.entrance,
        delay,
      },
    );
    controls.add(control);
    void control.then(() => {
      controls.delete(control);
      restoreInlineStyles(styles);
    });
  }

  function observe(target: HTMLElement, elements: HTMLElement[], delay?: ReturnType<typeof stagger>) {
    let hasPlayed = false;
    observers.push(
      inView(
        target,
        () => {
          if (hasPlayed || !active) return;
          hasPlayed = true;
          play(elements, delay);
        },
        { amount: 0.12 },
      ),
    );
  }

  const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-stagger]"));
  groups.forEach((group) => {
    if (isPinned(group)) return;

    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-stagger-item]"))
      .filter((item) => !isPinned(item) && item.closest("[data-stagger]") === group);
    const targets = items.length > 0 ? items : [group];
    targets.forEach((item) => staggeredElements.add(item));
    observe(group, targets, targets.length > 1 ? stagger(motionStagger) : undefined);
  });

  const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  reveals.forEach((element) => {
    if (isPinned(element) || element.matches("[data-stagger]")) return;

    let ancestor: HTMLElement | null = element;
    while (ancestor && ancestor !== root) {
      if (staggeredElements.has(ancestor)) return;
      ancestor = ancestor.parentElement;
    }

    observe(element, [element]);
  });

  return () => {
    active = false;
    observers.forEach((stop) => stop());
    controls.forEach((control) => control.stop());
    restoreInlineStyles(originalStyles);
    controls.clear();
  };
}
