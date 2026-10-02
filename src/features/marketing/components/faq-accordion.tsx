"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { motionEasing } from "@/lib/motion";

type FaqItem = { question: string; answer: string };

function FaqRow({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div data-stagger-item data-open={open} className="group rounded-2xl bg-surface sm:rounded-[20px]">
      <h3 className="rounded-[inherit]">
        <button
          id={`${id}-question`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={() => setOpen((current) => !current)}
          className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-5 rounded-[inherit] px-5 py-4 text-left font-body text-base font-medium motion-safe:transition-colors hover:bg-primary/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 active:bg-primary/5 sm:px-6"
        >
          <span>{question}</span>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4 group-data-[open=true]:rotate-45 motion-safe:transition-transform motion-safe:duration-300">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </span>
        </button>
      </h3>
      <motion.div
        id={`${id}-answer`}
        role="region"
        aria-labelledby={`${id}-question`}
        aria-hidden={!open}
        inert={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: motionEasing.smooth }}
        className="overflow-hidden"
      >
        <p className="max-w-[64ch] px-5 pb-5 font-body leading-relaxed text-secondary sm:px-6">{answer}</p>
      </motion.div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <div data-stagger className="mt-8 grid gap-4 sm:mt-10">
      {items.map((item) => <FaqRow key={item.question} {...item} />)}
    </div>
  );
}
