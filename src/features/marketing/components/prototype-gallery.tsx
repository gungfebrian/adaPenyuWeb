"use client";

import { useEffect, useId, type RefObject } from "react";
import { prototypeScreens } from "../data/prototype-screens";
import { FigmaImage } from "./figma-image";
import { PhoneCarousel } from "./phone-carousel";

export function PrototypeGallery({ dialogRef, open, onClose }: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={onClose} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }} className="fixed inset-0 z-110 m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[1100px] overflow-y-auto overscroll-contain rounded-3xl bg-paper p-5 text-primary backdrop:bg-primary/65 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id={titleId} className="font-display text-2xl md:text-3xl">Inside AdaPenyu</h2><p className="mt-2 text-sm text-secondary">Three screens from our app prototype.</p></div>
        <button type="button" aria-label="Close app screenshots" onClick={() => dialogRef.current?.close()} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/5 text-2xl hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">×</button>
      </div>
      <PhoneCarousel compact />
      <div className="mt-6 hidden grid-cols-3 items-start gap-6 md:grid">
        {prototypeScreens.map(screen => <figure key={screen.name} className="min-w-0 text-center"><FigmaImage name={screen.name} width={screen.width} height={screen.height} alt={screen.alt} className="mx-auto h-[min(60dvh,590px)] w-full object-contain" sizes="30vw" /><figcaption className="mt-3 font-medium">{screen.title}</figcaption></figure>)}
      </div>
    </dialog>
  );
}
