"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
};

const springOptions = { stiffness: 280, damping: 26, mass: 0.45 };
const maxOffset = 6;

/** Adds a small pointer response around an existing link or button without changing its semantics. */
export function MagneticButton({ children, className }: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  function reset() {
    x.set(0);
    y.set(0);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      shouldReduceMotion !== false ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      reset();
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;

    let offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    let offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    const magnitude = Math.hypot(offsetX, offsetY);

    if (magnitude > 1) {
      offsetX /= magnitude;
      offsetY /= magnitude;
    }

    x.set(offsetX * maxOffset);
    y.set(offsetY * maxOffset);
  }

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onFocusCapture={reset}
      onBlurCapture={reset}
    >
      {children}
    </motion.div>
  );
}
