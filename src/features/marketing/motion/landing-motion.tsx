"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { observeReveals } from "@/components/motion/reveal";
import { motionEasing } from "@/lib/motion";

const chapterLabels: Record<string, string> = { home: "Home", "our-project": "Our Project", "how-it-works": "How it works", "about-us": "About Us", contact: "Get Involved", faq: "FAQ" };

/** Motion owns UI transitions; GSAP owns the multi-stage scroll timelines. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px) and (min-height: 720px)",
      pointer: "(hover: hover) and (pointer: fine)",
    }, context => {
      const { motion: permitted, desktop, pointer } = context.conditions ?? {};
      if (!permitted) return;
      const cleanup: (() => void)[] = [observeReveals(root, desktop ? 32 : 18)];

      // Native sticky keeps each chapter attached to browser scrolling. GSAP
      // sequences the artwork without moving a large pinned DOM tree per frame.
      const prepareStage = (section: HTMLElement, distance: number) => {
        const stage = section.closest<HTMLElement>("[data-scroll-stage]");
        if (!stage) return section;
        gsap.set(stage, { height: `${(1 + distance) * 100}svh` });
        gsap.set(section, { position: "sticky", top: 0, height: "100svh" });
        return stage;
      };
      if (desktop) {
        const story = root.querySelector<HTMLElement>("[data-story-pin]");
        if (story) {
          const stage = prepareStage(story, 1.25);
          const beats = [...story.querySelectorAll<HTMLElement>("[data-story-beat]")];
          const arrows = [...story.querySelectorAll<HTMLElement>("[data-story-arrow]")];
          const timeline = gsap.timeline({
            scrollTrigger: { id: "chapter-our-project", trigger: stage, start: "top top", end: () => `+=${innerHeight * 1.25}`, scrub: true, invalidateOnRefresh: true },
          });
          timeline.to({}, { duration: 0.25 });
          beats.forEach((beat, index) => {
            const at = 0.25 + index * 1.15;
            if (arrows[index]) timeline.from(arrows[index], { scale: 0.65, opacity: 0, duration: 0.45, ease: "power2.out" }, at);
            timeline.from(beat, { y: 40, opacity: 0, duration: 0.65, ease: "power3.out" }, at + 0.2);
          });
          timeline.to({}, { duration: 0.55 });
          timeline.scrollTrigger?.refresh();
        }
        const steps = root.querySelector<HTMLElement>("[data-steps-pin]");
        if (steps) {
          const stage = prepareStage(steps, 0.65);
          const timeline = gsap.timeline({
            scrollTrigger: { id: "chapter-how-it-works", trigger: stage, start: "top top", end: () => `+=${innerHeight * 0.65}`, scrub: true, invalidateOnRefresh: true },
          });
          timeline.to({}, { duration: 0.15 });
          steps.querySelectorAll<HTMLElement>("[data-step]").forEach((step, index) => {
            const at = 0.15 + index * 1.1;
            const circle = step.querySelector("[data-step-circle]");
            const copy = step.querySelector("[data-step-copy]");
            const arrow = step.querySelector("[data-step-arrow]");
            if (circle) timeline.from(circle, { scale: 0.55, opacity: 0, duration: 0.5, ease: "back.out(1.4)" }, at);
            if (copy) timeline.from(copy, { y: 28, opacity: 0, duration: 0.6, ease: "power3.out" }, at + 0.15);
            if (arrow) timeline.from(arrow, { scaleY: 0, opacity: 0, duration: 0.4, ease: "power2.out" }, at + 0.6);
          });
          timeline.to({}, { duration: 0.08 });
          timeline.scrollTrigger?.refresh();
        }
        const prototype = root.querySelector<HTMLElement>("[data-prototype-sequence]");
        if (prototype) {
          const phones = [...prototype.querySelectorAll<HTMLElement>("[data-phone]")];
          // Reveal the three screens during normal scrolling. Holding and
          // rotating the full screenshot group made this chapter feel heavy.
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: prototype, start: "top 85%", end: "top 25%", scrub: true, invalidateOnRefresh: true },
          });
          timeline.from(phones, { y: 48, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", force3D: false, snap: { y: 1 } });
          timeline.scrollTrigger?.refresh();
        }
      } else {
        // Touch layouts retain their natural reading order without long pinned panels.
        root.querySelectorAll<HTMLElement>("[data-story-beat]").forEach(beat => {
          gsap.from(beat, { y: 18, opacity: 0, duration: 0.65, clearProps: "transform,opacity", scrollTrigger: { trigger: beat, start: "top 85%", once: true } });
        });
        root.querySelectorAll<HTMLElement>("[data-step]").forEach(step => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 78%", once: true }, defaults: { clearProps: "transform,opacity" } });
          const circle = step.querySelector("[data-step-circle]");
          const copy = step.querySelector("[data-step-copy]");
          const arrow = step.querySelector("[data-step-arrow]");
          if (circle) timeline.from(circle, { scale: 0.6, opacity: 0, duration: 0.55, ease: "back.out(1.4)" });
          if (copy) timeline.from(copy, { y: 18, opacity: 0, duration: 0.6 }, 0.15);
          if (arrow) timeline.from(arrow, { scaleY: 0, opacity: 0, duration: 0.4 }, 0.6);
        });
      }

      // The story card sits directly over the preceding artwork. Its frame stays
      // full width: scaling the page would expose an empty canvas at its edges.
      const storyFrame = root.querySelector<HTMLElement>('[data-scene-anchor="our-project"]');
      const storySheet = storyFrame?.querySelector<HTMLElement>("[data-scene-sheet]");
      if (storyFrame && storySheet) gsap.fromTo(storySheet, { borderRadius: "48px 48px 0px 0px" }, {
        borderRadius: "0px 0px 0px 0px", ease: "none",
        scrollTrigger: { trigger: storyFrame, start: "top 85%", end: "top top", scrub: true },
      });

      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach(layer => {
        const section = layer.closest("[data-motion-section]");
        if (!section) return;
        const travel = Number(layer.dataset.parallax) * (desktop ? 1.5 : 0.35);
        gsap.fromTo(layer, { y: -travel / 2 }, { y: travel / 2, ease: "none", scrollTrigger: { trigger: section.closest("[data-scroll-stage]") ?? section, start: "top bottom", end: "bottom top", scrub: true } });
      });
      const heroMedia = root.querySelector("[data-hero-media]");
      const hero = root.querySelector("#home");
      if (heroMedia && hero && desktop) gsap.to(heroMedia, { y: -48, rotationX: 6, scale: 0.94, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

      if (pointer && desktop) {
        root.querySelectorAll<HTMLElement>("[data-tilt]").forEach(card => {
          const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3.out" });
          const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3.out" });
          const move = (event: PointerEvent) => { const b = card.getBoundingClientRect(); rotateX(-((event.clientY - b.top) / b.height - 0.5) * 6); rotateY(((event.clientX - b.left) / b.width - 0.5) * 6); };
          const reset = () => { rotateX(0); rotateY(0); };
          card.addEventListener("pointermove", move); card.addEventListener("pointerleave", reset);
          cleanup.push(() => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", reset); });
        });
      }
      const refresh = () => ScrollTrigger.refresh();
      const onDetailsToggle = (event: Event) => {
        if (event.target instanceof HTMLDetailsElement) refresh();
      };
      root.addEventListener("toggle", onDetailsToggle, true);
      cleanup.push(() => root.removeEventListener("toggle", onDetailsToggle, true));
      // Every artwork has reserved dimensions. Loading an image does not change
      // layout, so it must not restart all scroll calculations mid-sequence.
      let active = true;
      document.fonts.ready.then(() => { if (active) refresh(); });
      const frame = requestAnimationFrame(refresh);
      return () => { active = false; cancelAnimationFrame(frame); cleanup.forEach(dispose => dispose()); };
    }, root);

    let version = 0;
    let curtainAnimation: ReturnType<typeof animate> | undefined;
    const position = (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      const pin = ScrollTrigger.getById(`chapter-${id}`);
      const frame = [...root.querySelectorAll<HTMLElement>("[data-scene-anchor]")].find(scene => scene.dataset.sceneAnchor === id);
      const top = pin ? pin.start + 1 : window.scrollY + (frame ?? target).getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      ScrollTrigger.update();
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      window.dispatchEvent(new Event("adapenyu:navigated"));
    };
    const navigate = async (id: string, historyEntry = true, transition = true) => {
      const target = document.getElementById(id);
      if (!target) return;
      const currentVersion = ++version;
      curtainAnimation?.stop();
      const curtain = document.querySelector<HTMLElement>("[data-chapter-curtain]");
      const label = curtain?.querySelector<HTMLElement>("[data-chapter-label]");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (curtain && transition && !reduced) {
        if (label) label.textContent = chapterLabels[id] ?? "AdaPenyu";
        curtainAnimation = animate(curtain, { y: ["100%", "0%"] }, { duration: 0.38, ease: motionEasing.entrance });
        await curtainAnimation;
        if (currentVersion !== version) return;
      }
      position(id);
      if (historyEntry) history.pushState(null, "", `#${id}`);
      if (curtain && transition && !reduced) {
        curtainAnimation = animate(curtain, { y: ["0%", "-100%"] }, { duration: 0.46, ease: motionEasing.entrance });
        await curtainAnimation;
      }
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const id = link?.hash.slice(1);
      if (!id || !chapterLabels[id]) return;
      event.preventDefault();
      void navigate(id);
    };
    const restore = () => { const id = location.hash.slice(1); if (chapterLabels[id]) void navigate(id, false, false); };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    let mounted = true;
    document.fonts.ready.then(() => { if (mounted && location.hash) restore(); });
    return () => {
      mounted = false; version++; curtainAnimation?.stop(); media.revert();
      document.removeEventListener("click", click, true); window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore);
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
