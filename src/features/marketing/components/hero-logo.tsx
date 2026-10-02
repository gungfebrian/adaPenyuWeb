"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { FigmaImage } from "./figma-image";

export function HeroLogo() {
  const reducedMotion = useReducedMotion();
  const artworkRef = useRef<HTMLSpanElement>(null);
  const responseRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => () => responseRef.current?.stop(), []);

  function respond() {
    if (reducedMotion !== false || !artworkRef.current) return;
    window.dispatchEvent(new Event("adapenyu:logo-respond"));
    responseRef.current?.stop();
    responseRef.current = animate(artworkRef.current,
      { rotate: [0, -7, 5, -2, 0] },
      { duration: 0.6, ease: "easeInOut" },
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <motion.button type="button" tabIndex={0} aria-label="Animate AdaPenyu logo" onClick={respond}
        whileHover={reducedMotion === false ? "hover" : undefined}
        whileTap={reducedMotion === false ? "tap" : undefined}
        className="block h-28 w-28 cursor-pointer rounded-[25px] border-0 bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-6 sm:h-32 sm:w-32 md:h-40 md:w-40 md:rounded-[36px] min-[120rem]:h-[200px] min-[120rem]:w-[200px]">
        <div data-idle="logo">
          <motion.span className="block" variants={{ hover: { scale: 1.06, y: -4 }, tap: { scale: 0.96 } }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <span ref={artworkRef} className="block">
              <FigmaImage name="app-icon" width={1024} height={1024} loading="eager" className="h-28 w-28 rounded-[25px] shadow-[0_16px_38px_#00263c20] sm:h-32 sm:w-32 md:h-40 md:w-40 md:rounded-[36px] min-[120rem]:h-[200px] min-[120rem]:w-[200px]" />
            </span>
          </motion.span>
        </div>
      </motion.button>
      <FigmaImage name="wordmark" width={251} height={78} className="mt-6 h-auto w-40 sm:w-44 md:w-52 min-[120rem]:w-[260px]" />
    </div>
  );
}
