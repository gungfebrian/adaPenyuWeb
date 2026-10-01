"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { Button, buttonClasses } from "@/components/ui/button";

const navigation = [
  { label: "Home", href: "#home", detail: "Overview", artwork: "app-icon" },
  { label: "Our Project", href: "#our-project", detail: "Turtle identification", artwork: "banner-turtle" },
  { label: "About Us", href: "#about-us", detail: "Team and collaboration", artwork: "team-mayun" },
  { label: "FAQ", href: "#faq", detail: "Common questions", artwork: null },
] as const;

function NavigationLabel({ children }: { children: string }) {
  return <span className="relative block py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 group-hover/link:after:scale-x-100 group-focus-visible/link:after:scale-x-100 motion-reduce:after:transition-none">{children}</span>;
}

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const closingRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    let frame = 0;
    let settleTimer = 0;
    const update = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const middle = 48;
      const dark = [...document.querySelectorAll('[data-header-theme="dark"]')].some(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= middle && rect.bottom > middle;
      });
      header.dataset.theme = dark ? "dark" : "light";
      const compact = window.scrollY > Math.min(320, innerHeight * 0.35);
      header.dataset.compact = String(compact);
      if (navRef.current) navRef.current.inert = compact;
      const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')];
      const current = sections.filter(section => section.getBoundingClientRect().top <= 100).at(-1)?.id ?? "home";
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
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("adapenyu:navigated", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame); clearTimeout(settleTimer);
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
    <header ref={headerRef} className="group/header pointer-events-none fixed top-0 left-1/2 z-100 w-full max-w-[1512px] -translate-x-1/2 px-5 pt-4 sm:px-8 lg:px-[5.3%] lg:pt-6">
      <div className="flex items-center justify-between gap-4">
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-paper p-1.5 pl-4 text-primary shadow-[0_4px_20px_#00263c08] lg:gap-5">
          <Link ref={brandRef} href="#home" aria-label="AdaPenyu home" className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
            <Image src="/images/marketing/wordmark.svg" alt="" width={251} height={78} unoptimized preload className="h-auto w-[112px] sm:w-[125px]" />
          </Link>
          <div className="flex items-center">
            <nav ref={navRef} aria-label="Main navigation" className="hidden max-w-[450px] items-center gap-5 overflow-hidden pr-4 pl-3 opacity-100 transition-[max-width,opacity,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[compact=true]/header:pointer-events-none group-data-[compact=true]/header:max-w-0 group-data-[compact=true]/header:px-0 group-data-[compact=true]/header:opacity-0 motion-reduce:transition-none lg:flex">
              {navigation.map(item => <Link key={item.href} href={item.href} className="group/link flex min-h-11 shrink-0 items-center rounded-md text-sm font-medium aria-[current=location]:font-semibold focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"><NavigationLabel>{item.label}</NavigationLabel></Link>)}
            </nav>
            <button ref={menuButtonRef} type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={isMenuOpen} aria-controls={menuId} onClick={() => { dialogRef.current?.showModal(); setIsMenuOpen(true); }} className="group flex size-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-primary/8 focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 8h14M5 16h14" className="origin-center transition-transform duration-300 motion-safe:group-hover:scale-x-75" /></svg>
            </button>
          </div>
        </div>
        <Link href="#contact" className="group/link pointer-events-auto hidden min-h-12 items-center gap-3 rounded-2xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-secondary group-data-[theme=dark]/header:bg-white group-data-[theme=dark]/header:text-primary group-data-[theme=dark]/header:hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary group-data-[theme=dark]/header:focus-visible:outline-white sm:inline-flex"><NavigationLabel>Get Involved</NavigationLabel><span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5">↗</span></Link>
      </div>
      <dialog ref={dialogRef} id={menuId} aria-labelledby={`${menuId}-title`} className="pointer-events-auto fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-4 text-primary backdrop:bg-primary/25 backdrop:backdrop-blur-sm sm:p-8 lg:p-0" onClick={event => { if (event.target === event.currentTarget) void closeMenu(); }} onCancel={event => { event.preventDefault(); void closeMenu(); }} onClose={() => { setIsMenuOpen(false); menuButtonRef.current?.focus({ preventScroll: true }); }}>
        <motion.div ref={panelRef} initial={false} animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen || reduceMotion ? 0 : -12 }} transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[560px] rounded-[20px] bg-paper p-5 shadow-[0_20px_70px_#00263c20] sm:p-6 lg:mt-[96px] lg:ml-[max(5.3vw,calc((100vw-1512px)/2+80px))]">
          <div className="mb-5 flex items-center justify-between gap-4"><h2 id={`${menuId}-title`} className="font-body text-lg font-semibold">Explore AdaPenyu</h2><Button variant="secondary" className="px-3" onClick={closeMenu} aria-label="Close navigation"><span aria-hidden="true">×</span></Button></div>
          <nav aria-label="Expanded navigation" className="grid">
            {navigation.map((item, index) => <motion.div key={item.href} initial={false} animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen || reduceMotion ? 0 : 12 }} transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion || !isMenuOpen ? 0 : 0.06 + index * 0.055 }}><Link data-menu-item href={item.href} onClick={() => void closeMenu()} className="group/link grid min-h-20 grid-cols-[56px_1fr_auto] items-center gap-4 rounded-md border-b border-primary/10 py-3 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-secondary">
              {item.artwork ? <Image src={`/images/marketing/${item.artwork}.svg`} alt="" width={56} height={56} unoptimized className="size-14 rounded-xl object-contain transition-transform duration-300 motion-safe:group-hover/link:rotate-[-6deg] motion-safe:group-hover/link:scale-105" /> : <span aria-hidden="true" className="grid size-14 place-items-center rounded-xl bg-surface font-display text-3xl">?</span>}
              <span><span className="block font-body text-xl font-medium"><NavigationLabel>{item.label}</NavigationLabel></span><span className="block text-xs text-secondary">{item.detail}</span></span>
              <span aria-hidden="true" className="mr-2 transition-transform duration-300 motion-safe:group-hover/link:translate-x-1">↗</span>
            </Link></motion.div>)}
            <Link data-menu-item href="#contact" onClick={() => void closeMenu()} className={buttonClasses("primary", "mt-5 w-full")}>Get Involved <span aria-hidden="true">↗</span></Link>
          </nav>
        </motion.div>
      </dialog>
    </header>
  );
}
