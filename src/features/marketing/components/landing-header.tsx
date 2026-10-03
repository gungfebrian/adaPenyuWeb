"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Pattern } from "./pattern";
import { MobileNavigationPanel } from "./mobile-navigation-panel";

const navigation = [
  { label: "Home", href: "#home", detail: "Every story starts here" },
  { label: "Our Project", href: "#our-project", detail: "Recognising turtles through photographs" },
  { label: "About Us", href: "#about-us", detail: "Meet the Citizens of the Sea" },
  { label: "FAQ", href: "#faq", detail: "Your questions, answered" },
] as const;

function NavigationLabel({ children, adaptive = false }: { children: string; adaptive?: boolean }) {
  return <span data-nav-paint={adaptive ? "ink" : undefined} className={`relative block py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--nav-solid,currentColor)] after:transition-transform after:duration-200 group-hover/link:after:scale-x-100 group-focus-visible/link:after:scale-x-100 motion-reduce:after:transition-none ${adaptive ? "bg-clip-text text-transparent [background-image:var(--nav-paint,linear-gradient(white,white))]" : ""}`}>{children}</span>;
}

/** Hard gradient stops follow the section edge without cloning visible text. */
function boundaryPaint(top: number, height: number, bands: { top: number; bottom: number }[], base: string, inverse: string) {
  const intervals = bands.map(band => [Math.max(0, band.top - top), Math.min(height, band.bottom - top)])
    .filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  for (const interval of intervals) {
    const previous = merged.at(-1);
    if (previous && interval[0] <= previous[1]) previous[1] = Math.max(previous[1], interval[1]);
    else merged.push(interval);
  }
  const stops = [`${base} 0px`];
  for (const [start, end] of merged) stops.push(`${base} ${start}px`, `${inverse} ${start}px`, `${inverse} ${end}px`, `${base} ${end}px`);
  stops.push(`${base} ${height}px`);
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const closingRef = useRef(false);
  const hoveringRef = useRef(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const refreshHeaderRef = useRef<(() => void) | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const mobileMenuId = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (desktop.matches) {
        const focusedInside = mobilePanelRef.current?.contains(document.activeElement);
        setIsMobileMenuOpen(false);
        if (focusedInside) menuButtonRef.current?.focus({ preventScroll: true });
      } else if (dialogRef.current?.open) dialogRef.current.close();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => { refreshHeaderRef.current?.(); }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!mobilePanelRef.current?.contains(target) && !blockRef.current?.contains(target)) setIsMobileMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsMobileMenuOpen(false);
      mobileButtonRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let frame = 0;
    let settleTimer = 0;
    const update = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const darkBands = [...document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]')].map(section => section.getBoundingClientRect());
      const paints = [...header.querySelectorAll<HTMLElement>("[data-nav-paint]")].map(element => ({ element, rect: element.getBoundingClientRect() }));
      // Finish geometry reads before changing styles during a scroll frame.
      const current = [...document.querySelectorAll<HTMLElement>('main section[id]')]
        .map(section => ({ id: section.id, top: section.getBoundingClientRect().top }))
        .filter(section => section.top <= 100).at(-1)?.id ?? "home";
      const compact = window.scrollY > Math.min(320, innerHeight * 0.35);
      const expanded = !compact || hoveringRef.current || !!blockRef.current?.contains(document.activeElement);
      header.dataset.expanded = String(expanded);
      if (navRef.current) navRef.current.inert = !expanded;
      for (const { element, rect } of paints) {
        const bands = darkBands.filter(band => band.left < rect.right && band.right > rect.left);
        const surface = element.dataset.navPaint === "surface";
        const base = surface ? "#00263c" : "#ffffff";
        const inverse = surface ? "#ffffff" : "#00263c";
        element.style.setProperty("--nav-paint", boundaryPaint(rect.top, rect.height, bands, base, inverse));
        const darkAtBottom = bands.some(band => band.top <= rect.bottom - 1 && band.bottom > rect.bottom - 1);
        element.style.setProperty("--nav-solid", darkAtBottom ? inverse : base);
        if (surface) {
          const darkAtCenter = bands.some(band => band.top <= rect.top + rect.height / 2 && band.bottom > rect.top + rect.height / 2);
          element.style.setProperty("--nav-focus", darkAtCenter ? "#00263c" : "#ffffff");
          element.style.setProperty("--nav-hover", darkAtCenter ? "#00263c12" : "#ffffff18");
        }
      }
      const target = current === "faq" ? "#faq" : ["about-us", "where-we-come-from", "contribute", "contact"].includes(current) ? "#about-us" : current === "home" ? "#home" : "#our-project";
      header.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute("href") === target) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(update, 600);
    };
    refreshHeaderRef.current = schedule;
    const observer = new ResizeObserver(schedule);
    if (blockRef.current) observer.observe(blockRef.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("adapenyu:navigated", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame); clearTimeout(settleTimer);
      observer.disconnect();
      refreshHeaderRef.current = null;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("adapenyu:navigated", schedule);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMenuOpen]);

  const closeMenu = async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (panelRef.current && !reduceMotion) await animate(panelRef.current, { opacity: 0, y: -8 }, { duration: 0.16 });
    dialogRef.current?.close();
    closingRef.current = false;
  };

  return (
    <header ref={headerRef} className="group/header pointer-events-none fixed top-0 left-1/2 z-100 w-full max-w-[1512px] -translate-x-1/2 px-[var(--page-gutter)] pt-4 lg:pt-6">
      <div className="flex items-center justify-center gap-4 md:justify-between">
        <div ref={blockRef} data-nav-paint="surface" onPointerEnter={event => { if (event.pointerType === "mouse") { hoveringRef.current = true; refreshHeaderRef.current?.(); } }} onPointerLeave={() => { hoveringRef.current = false; refreshHeaderRef.current?.(); }} onFocusCapture={() => refreshHeaderRef.current?.()} onBlurCapture={() => refreshHeaderRef.current?.()} className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-primary p-1.5 pl-4 text-white shadow-[0_4px_20px_#00263c08] [background-image:var(--nav-paint)] lg:gap-5">
          <Link ref={brandRef} href="#home" aria-label="AdaPenyu home" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--nav-focus,currentColor)]">
            <span aria-hidden="true" data-nav-paint="ink" className="block aspect-[251/78] w-[112px] bg-white [background-image:var(--nav-paint)] [mask-image:url('/images/marketing/wordmark.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] sm:w-[125px]" />
          </Link>
          <div className="flex items-center">
            <nav ref={navRef} aria-label="Main navigation" className="hidden max-w-[450px] items-center gap-5 overflow-hidden pr-4 pl-3 opacity-100 transition-[max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[expanded=false]/header:pointer-events-none group-data-[expanded=false]/header:max-w-0 group-data-[expanded=false]/header:px-0 group-data-[expanded=false]/header:opacity-0 motion-reduce:transition-none lg:flex">
              {navigation.map(item => <Link key={item.href} href={item.href} className="group/link flex min-h-11 shrink-0 items-center rounded-md text-sm font-medium aria-[current=location]:font-semibold focus-visible:outline-2 focus-visible:[outline-color:var(--nav-focus,currentColor)] focus-visible:outline-offset-2"><NavigationLabel adaptive>{item.label}</NavigationLabel></Link>)}
            </nav>
            <button ref={menuButtonRef} type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={isMenuOpen} aria-controls={menuId} onClick={() => { dialogRef.current?.showModal(); setIsMenuOpen(true); }} className="group hidden size-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[var(--nav-hover)] focus-visible:outline-2 focus-visible:[outline-color:var(--nav-focus,currentColor)] focus-visible:outline-offset-2 md:flex">
              <span aria-hidden="true" data-nav-paint="ink" className="size-5 bg-white [background-image:var(--nav-paint)] [mask-image:url('/icons/nav-menu.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
            </button>
            <button ref={mobileButtonRef} type="button" aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={isMobileMenuOpen} aria-controls={mobileMenuId} onClick={() => setIsMobileMenuOpen(open => !open)} className="flex size-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-[var(--nav-hover)] focus-visible:outline-2 focus-visible:[outline-color:var(--nav-focus,currentColor)] focus-visible:outline-offset-2 md:hidden">
              <span aria-hidden="true" data-nav-paint="ink" className={`size-5 bg-white [background-image:var(--nav-paint)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${isMobileMenuOpen ? "[mask-image:url('/icons/nav-close.svg')]" : "[mask-image:url('/icons/nav-menu.svg')]"}`} />
            </button>
          </div>
        </div>
        <Link href="#contact" data-nav-paint="surface" className="group/link pointer-events-auto hidden min-h-12 items-center gap-3 rounded-2xl bg-primary px-5 text-sm font-medium text-white [background-image:var(--nav-paint)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary md:inline-flex"><NavigationLabel adaptive>Get Involved</NavigationLabel><span aria-hidden="true" data-nav-paint="ink" className="bg-clip-text text-transparent [background-image:var(--nav-paint)]">↗</span></Link>
      </div>
      <AnimatePresence initial={false}>
      {isMobileMenuOpen && <MobileNavigationPanel panelRef={mobilePanelRef} id={mobileMenuId}>
          <Pattern variant="accuracy" parallax={false} />
          <nav aria-label="Mobile navigation" className="relative grid gap-1">
            {navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="group/link flex min-h-12 items-center rounded-xl px-4 font-display text-2xl transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 aria-[current=location]:bg-white/10"><NavigationLabel>{item.label}</NavigationLabel></Link>)}
            <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className={buttonClasses("secondary", "mt-2 w-full bg-white text-primary hover:bg-white/90 focus-visible:outline-white")}>Get Involved</Link>
          </nav>
      </MobileNavigationPanel>}
      </AnimatePresence>
      <dialog ref={dialogRef} id={menuId} aria-labelledby={`${menuId}-title`} className="pointer-events-auto fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-transparent p-4 text-primary backdrop:bg-primary/25 backdrop:backdrop-blur-sm sm:p-8 lg:p-0" onClick={event => { if (event.target === event.currentTarget) void closeMenu(); }} onCancel={event => { event.preventDefault(); void closeMenu(); }} onClose={() => { setIsMenuOpen(false); (window.matchMedia("(min-width: 768px)").matches ? menuButtonRef : mobileButtonRef).current?.focus({ preventScroll: true }); }}>
        <motion.div ref={panelRef} initial={false} animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen || reduceMotion ? 0 : -12 }} transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} className="relative isolate mx-auto w-full max-w-[560px] overflow-hidden rounded-[24px] bg-banner p-5 text-white shadow-[0_20px_70px_#00263c20] sm:p-8 lg:mt-[96px] lg:ml-[max(5.3vw,calc((100vw-1512px)/2+80px))]">
          <Pattern variant="accuracy" parallax={false} />
          <div className="relative mb-4 flex items-center justify-between gap-4 sm:mb-6"><h2 id={`${menuId}-title`} className="font-body text-base font-medium text-white/80">Explore AdaPenyu</h2><Button variant="secondary" className="size-11 rounded-full bg-white/10 p-0 text-white hover:bg-white/20 hover:text-white focus-visible:outline-white" onClick={closeMenu} aria-label="Close navigation"><span aria-hidden="true">×</span></Button></div>
          <nav aria-label="Expanded navigation" className="relative grid gap-1">
            {navigation.map((item, index) => <motion.div key={item.href} initial={false} animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen || reduceMotion ? 0 : 12 }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion || !isMenuOpen ? 0 : 0.06 + index * 0.055 }}><Link data-menu-item href={item.href} onClick={() => void closeMenu()} className="group/link block min-h-20 rounded-xl px-3 py-3 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 aria-[current=location]:bg-white/10 sm:py-4">
              <span className="block font-display text-[clamp(26px,7.7vw,30px)] font-medium leading-tight sm:text-[34px]">{item.label}</span>
              <span className="mt-1.5 block font-body text-sm leading-5 text-white/75 sm:mt-2 sm:leading-relaxed">{item.detail}</span>
            </Link></motion.div>)}
            <Link data-menu-item href="#contact" onClick={() => void closeMenu()} className={buttonClasses("secondary", "mt-4 w-full bg-white text-primary hover:bg-white/90 focus-visible:outline-white sm:mt-6")}>Get Involved</Link>
          </nav>
        </motion.div>
      </dialog>
    </header>
  );
}
