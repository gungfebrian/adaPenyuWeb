"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { CopyExample } from "./copy-example";
import type { ResponseSample } from "./reference";

export function ResponseExamples({ samples }: { samples: ResponseSample[] }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const current = samples[selected];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const previous = (index - 1 + samples.length) % samples.length;
    const next = (index + 1) % samples.length;
    const destination: Record<string, number> = { ArrowLeft: previous, ArrowRight: next, Home: 0, End: samples.length - 1 };
    if (!Object.hasOwn(destination, event.key)) return;
    event.preventDefault();
    const target = destination[event.key];
    setSelected(target);
    document.getElementById(`${id}-tab-${samples[target].status}`)?.focus();
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-primary/15 bg-banner text-white shadow-sm">
      <div className="flex min-h-13 items-center justify-between gap-2 px-4 py-2">
        <h3 className="text-sm font-semibold">Response examples</h3>
        {current.copyable && <CopyExample key={current.status} code={current.code} title="response example" />}
      </div>
      <div role="tablist" aria-label="Response status" className="flex max-w-full gap-1 overflow-x-auto border-y border-white/15 px-3">
        {samples.map(({ status }, index) => (
          <button
            key={status}
            type="button"
            id={`${id}-tab-${status}`}
            role="tab"
            aria-selected={index === selected}
            aria-controls={`${id}-response`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            className="min-h-10 cursor-pointer border-b-2 border-transparent px-2.5 font-mono text-xs font-semibold text-white/75 hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-300 aria-selected:border-sky-300 aria-selected:text-white"
          >
            {status}
          </button>
        ))}
      </div>
      <div id={`${id}-response`} role="tabpanel" aria-labelledby={`${id}-tab-${current.status}`}>
        <div className="px-4 pt-3 font-mono text-xs text-white/75">{current.label}</div>
        <pre tabIndex={0} className="max-h-[21rem] overflow-auto px-4 py-3 font-mono text-xs leading-relaxed text-sky-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-300"><code>{current.code}</code></pre>
      </div>
    </div>
  );
}
