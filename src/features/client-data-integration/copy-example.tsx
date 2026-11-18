"use client";

import { useState } from "react";

export function CopyExample({ code, title }: { code: string; title: string }) {
  const [feedback, setFeedback] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setFeedback("Copied");
    } catch {
      setFeedback("Select text to copy");
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Copy ${title.toLowerCase()}`}
        onClick={() => void copy()}
        onBlur={() => setFeedback("")}
        className="min-h-9 cursor-pointer rounded-md border border-white/25 px-2.5 text-xs font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        {feedback || "Copy"}
      </button>
      <span role="status" className="sr-only">{feedback}</span>
    </>
  );
}
