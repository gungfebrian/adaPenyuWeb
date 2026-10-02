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
    // 100vw includes the scrollbar on desktop. Use the actual page width so
    // full-bleed chapters and their gutters stay aligned with the fixed header.
    const sizeScenes = () => root.style.setProperty("--scene-width", `${document.documentElement.clientWidth}px`);
    sizeScenes();
    const sceneObserver = new ResizeObserver(sizeScenes);
    sceneObserver.observe(document.documentElement);
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px) and (min-height: 720px)",
      wide: "(min-width: 1024px)",
      pointer: "(hover: hover) and (pointer: fine)",
    }, context => {
      const { motion: permitted, desktop, wide, pointer } = context.conditions ?? {};
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
            timeline.from(beat, { y: 40, opacity: 0, duration: 0.65, ease: "power3.out", force3D: false }, at + 0.2);
          });
          timeline.to({}, { duration: 0.55 });
          const turtle = story.querySelector("[data-story-swim]");
          if (turtle) timeline.to(turtle, { x: 48, y: -18, rotation: -5, duration: timeline.duration(), ease: "none", force3D: false }, 0);
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
            if (copy) timeline.from(copy, { y: 28, opacity: 0, duration: 0.6, ease: "power3.out", force3D: false }, at + 0.15);
            if (arrow) timeline.from(arrow, { scaleY: 0, opacity: 0, duration: 0.4, ease: "power2.out" }, at + 0.6);
          });
          timeline.to({}, { duration: 0.08 });
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

      const prototype = root.querySelector<HTMLElement>("[data-prototype-sequence]");
      if (prototype) {
        const phones = [...prototype.querySelectorAll<HTMLElement>("[data-phone]")];
        const centre = phones[1];
        const sides = phones.filter((_, index) => index !== 1);
        if (centre) {
          // Offset-based layout reads exclude transforms, even after refresh.
          // Side screens start hidden behind the taller centre phone, then fan out.
          gsap.fromTo(sides, {
            x: (_index, phone: HTMLElement) => centre.offsetLeft + centre.offsetWidth / 2 - phone.offsetLeft - phone.offsetWidth / 2,
            y: (_index, phone: HTMLElement) => centre.offsetTop - phone.offsetTop,
            scale: 0.92,
          }, {
            x: 0, y: 0, scale: 1, ease: "none", force3D: false,
            scrollTrigger: { trigger: prototype, start: "top 90%", end: desktop ? "top 20%" : "top 45%", scrub: true, invalidateOnRefresh: true },
          });
        }
      }

      // Round the next sheet without overlapping and hiding the hero reef.
      const storyFrame = root.querySelector<HTMLElement>('[data-scene-anchor="our-project"]');
      const storySheet = storyFrame?.querySelector<HTMLElement>("[data-scene-sheet]");
      if (storyFrame && storySheet) gsap.fromTo(storySheet, { borderRadius: "48px 48px 0px 0px" }, {
        borderRadius: "0px 0px 0px 0px", ease: "none",
        scrollTrigger: { trigger: storyFrame, start: "top 85%", end: "top top", scrub: true },
      });

      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach(layer => {
        const section = layer.closest("[data-motion-section]");
        if (!section) return;
        const travel = Number(layer.dataset.parallax) * (section.id === "home" ? (wide ? 3 : 0.6) : (desktop ? 1.5 : 0.35));
        gsap.fromTo(layer, { y: -travel / 2 }, { y: travel / 2, force3D: false, ease: "none", scrollTrigger: { trigger: section.closest("[data-scroll-stage]") ?? section, start: "top bottom", end: "bottom top", scrub: true } });
      });
      root.querySelectorAll<HTMLElement>("[data-artwork-reveal]").forEach(artwork => {
        gsap.from(artwork, { y: desktop ? 32 : 18, opacity: 0, duration: 0.85, ease: "power3.out", force3D: false, clearProps: "transform,opacity", scrollTrigger: { trigger: artwork, start: "top 90%", once: true } });
      });
      // All decorative loops share one observer and one document listener.
      const observedLoops = new Map<Element, Set<gsap.core.Animation>>();
      const visibleWrappers = new Set<Element>();
      const syncLoops = () => observedLoops.forEach((loops, wrapper) => loops.forEach(loop => {
        if (visibleWrappers.has(wrapper) && !document.hidden) loop.resume(); else loop.pause();
      }));
      const loopObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) visibleWrappers.add(entry.target); else visibleWrappers.delete(entry.target); });
        syncLoops();
      });
      document.addEventListener("visibilitychange", syncLoops);
      cleanup.push(() => { loopObserver.disconnect(); document.removeEventListener("visibilitychange", syncLoops); });
      const pauseOutside = (loop: gsap.core.Animation, wrapper: Element) => {
        let loops = observedLoops.get(wrapper);
        if (!loops) { loops = new Set(); observedLoops.set(wrapper, loops); loopObserver.observe(wrapper); }
        loops.add(loop);
      };
      root.querySelectorAll<HTMLElement>('[data-idle="turtle"], [data-idle="story-turtle"], [data-idle="emblem"], [data-idle="logo"], [data-idle="step-mark"]').forEach(artwork => {
        const storyTurtle = artwork.dataset.idle === "story-turtle";
        const swimming = artwork.dataset.idle === "turtle";
        const step = artwork.dataset.idle === "step-mark";
        const float = gsap.fromTo(artwork,
          { x: storyTurtle ? -6 : swimming ? -2 : 0, y: storyTurtle ? 4 : swimming ? 2 : 0, rotation: storyTurtle ? -2 : swimming ? -1.2 : step ? -0.6 : -1 },
          { x: storyTurtle ? 8 : swimming ? 2 : 0, y: storyTurtle ? -7 : swimming ? -9 : step ? -2 : -5, rotation: swimming || storyTurtle ? 1.8 : step ? 0.6 : 1, duration: storyTurtle ? 4.2 : swimming ? 3 : step ? 5 : 4, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true, force3D: false },
        );
        // Observe the wrapper, so idle motion never moves its own trigger.
        pauseOutside(float, artwork.parentElement ?? artwork);
      });
      const heroMedia = root.querySelector("[data-hero-media]");
      const hero = root.querySelector("#home");
      // Hero depth also works on short laptop windows; only story pinning needs
      // the taller viewport. Each layer moves independently with native scroll.
      if (heroMedia && hero && wide) gsap.to(heroMedia, { y: -64, force3D: false, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      root.querySelectorAll<HTMLElement>("[data-ocean-depth]").forEach(layer => {
        const section = layer.closest("[data-motion-section]");
        if (!section) return;
        const depth = Number(layer.dataset.oceanDepth) * (section === hero ? (wide ? 1.75 : 0.45) : (desktop ? 1 : 0.3));
        // The front wave lifts while its SVG fill extends below the baseline,
        // joining the next chapter without cropping a moving wave at the seam.
        const seabed = layer.hasAttribute("data-ocean-seabed");
        gsap.fromTo(layer, { y: seabed ? 0 : -depth / 2 }, { y: seabed ? -depth / 2 : depth / 2, force3D: false, ease: "none", scrollTrigger: { trigger: section.closest("[data-scroll-stage]") ?? section, start: section === hero ? "top top" : "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
      });
      root.querySelectorAll<SVGElement>("[data-ocean-sway]").forEach(artwork => {
        gsap.set(artwork, { svgOrigin: artwork.dataset.oceanPivot });
        const order = Number(artwork.dataset.oceanSway ?? 0);
        const angle = (order % 2 ? 1 : -1) * (desktop ? 1.3 : 0.5);
        const loop = gsap.fromTo(artwork, { rotation: -angle }, { rotation: angle, duration: 3.5 + order % 4 * 0.65, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true, force3D: false });
        pauseOutside(loop, artwork.parentElement ?? artwork);
      });
      root.querySelectorAll<HTMLElement>("[data-chapter-sway]").forEach(plant => {
        const order = Number(plant.dataset.chapterSway);
        const angle = (desktop ? 1.2 : 0.45) * (order % 2 ? 1 : -1);
        const loop = gsap.fromTo(plant, { rotation: -angle }, { rotation: angle, duration: 4.5 + order * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true, force3D: false });
        pauseOutside(loop, plant.parentElement ?? plant);
      });
      root.querySelectorAll<SVGElement>("[data-ocean-bubble]").forEach(artwork => {
        const order = Number(artwork.dataset.oceanBubble);
        const duration = 5.5 + order * 0.35;
        const travel = desktop ? 90 : 52;
        const loop = gsap.timeline({ repeat: -1, paused: true });
        loop.fromTo(artwork, { y: 18, x: -3, opacity: 0 }, { y: -travel, x: 3 + order % 3 * 3, duration, ease: "none", force3D: false }, 0)
          .to(artwork, { opacity: 1, duration: 0.7 }, 0)
          .to(artwork, { opacity: 0, duration: 1.1 }, duration - 1.1);
        loop.time(order / 8 * duration);
        pauseOutside(loop, artwork.parentElement?.parentElement ?? artwork);
      });
      root.querySelectorAll<SVGElement>("[data-bubble-response]").forEach(artwork => {
        gsap.set(artwork, { svgOrigin: artwork.dataset.oceanPivot });
      });
      root.querySelectorAll<HTMLElement>("[data-ocean-current]").forEach(artwork => {
        const order = Number(artwork.dataset.oceanCurrent);
        const travel = (desktop ? 8 : 3) * (order % 2 ? 1 : -1);
        const loop = gsap.fromTo(artwork, { x: -travel }, { x: travel, duration: 6 + order, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true, force3D: false });
        pauseOutside(loop, artwork.parentElement ?? artwork);
      });

      root.querySelectorAll<HTMLElement>("[data-match-sequence]").forEach(sequence => {
        gsap.fromTo(sequence.querySelectorAll("[data-match-photo]"), {
          x: index => index === 0 ? -24 : 24, y: 12, scale: 0.94, opacity: 0,
        }, { x: 0, y: 0, scale: 1, opacity: 1, force3D: false, ease: "none",
          scrollTrigger: { trigger: sequence, start: "top 90%", end: "top 65%", scrub: true, invalidateOnRefresh: true },
        });
      });

      const heroBubbles = hero?.querySelectorAll<SVGElement>("[data-bubble-response]");
      if (heroBubbles?.length) {
        const ripple = gsap.timeline({ paused: true })
          .to(heroBubbles, { scale: 1.25, duration: 0.24, stagger: 0.025, ease: "power2.out" })
          .to(heroBubbles, { scale: 1, duration: 0.8, stagger: 0.025, ease: "sine.out" }, 0.32);
        const respond = () => { ripple.restart(); };
        window.addEventListener("adapenyu:logo-respond", respond);
        cleanup.push(() => window.removeEventListener("adapenyu:logo-respond", respond));
      }

      if (pointer && desktop) {
        root.querySelectorAll<HTMLElement>("[data-ocean-bubbles]").forEach(field => {
          const section = field.closest<HTMLElement>("[data-motion-section]");
          if (!section) return;
          const responses = [...field.querySelectorAll<SVGElement>("[data-bubble-response]")].map((bubble, index) => ({
            x: gsap.quickTo(bubble, "x", { duration: 0.8, ease: "power2.out" }),
            y: gsap.quickTo(bubble, "y", { duration: 0.8, ease: "power2.out" }),
            depth: 5 + index % 3 * 3,
          }));
          const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            const bounds = section.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            responses.forEach(response => { response.x(x * response.depth); response.y(y * response.depth); });
          };
          const reset = () => responses.forEach(response => { response.x(0); response.y(0); });
          section.addEventListener("pointermove", move); section.addEventListener("pointerleave", reset);
          cleanup.push(() => { section.removeEventListener("pointermove", move); section.removeEventListener("pointerleave", reset); });
        });
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
      mounted = false; version++; curtainAnimation?.stop(); media.revert(); sceneObserver.disconnect();
      root.style.removeProperty("--scene-width");
      document.removeEventListener("click", click, true); window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore);
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
