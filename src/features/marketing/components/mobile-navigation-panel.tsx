"use client";

import type { ReactNode, RefObject } from "react";
import { motion, useIsPresent, useReducedMotion } from "motion/react";

export function MobileNavigationPanel({ id, panelRef, children }: {
  id: string;
  panelRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const present = useIsPresent();
  const reduceMotion = useReducedMotion();
  return (
    <div ref={panelRef} id={id} inert={!present} aria-hidden={!present || undefined} className="pointer-events-auto absolute top-full left-1/2 mt-3 w-[calc(100%-2*var(--page-gutter))] max-w-[360px] -translate-x-1/2 md:hidden">
      <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : -8, scale: reduceMotion ? 1 : 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -6, scale: reduceMotion ? 1 : 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative isolate origin-top overflow-hidden rounded-2xl bg-banner p-3 text-white shadow-[0_16px_40px_#00263c20]">
        {children}
      </motion.div>
    </div>
  );
}
