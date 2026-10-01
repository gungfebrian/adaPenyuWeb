"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useReducedMotion } from "motion/react";

import { motionDuration, motionEasing } from "@/lib/motion";
import { team, type TeamMember } from "../data/team";

export function TeamProfiles() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openedWithKeyboardRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedMember || !dialog) return;
    if (!dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [selectedMember]);

  function openProfile(member: TeamMember, trigger: HTMLButtonElement, withKeyboard: boolean) {
    triggerRef.current = trigger;
    openedWithKeyboardRef.current = withKeyboard;
    setSelectedMember(member);
  }

  async function closeProfile() {
    if (closingRef.current) return;
    closingRef.current = true;
    if (panelRef.current && !shouldReduceMotion) await animate(panelRef.current, { opacity: 0, y: 12, scale: 0.98 }, { duration: 0.18, ease: motionEasing.smooth });
    dialogRef.current?.close();
    closingRef.current = false;
  }

  function restoreFocus() {
    setSelectedMember(null);
    const trigger = triggerRef.current;
    if (trigger) {
      // A modal can make a pointer-returned focus look like keyboard focus.
      trigger.dataset.pointerReturn = String(!openedWithKeyboardRef.current);
      trigger.focus({ preventScroll: true });
    }
    triggerRef.current = null;
  }

  return (
    <>
      <ul data-stagger className="mx-auto mt-12 grid max-w-5xl list-none grid-cols-2 gap-x-5 gap-y-10 p-0 sm:grid-cols-3 sm:gap-x-8 md:mt-16 md:grid-cols-5 md:gap-x-6">
        {team.map((member) => (
          <li key={member.name} data-stagger-item className="text-center">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-controls="team-profile-dialog"
              aria-label={`View ${member.name}, ${member.role}`}
              onClick={(event) => openProfile(member, event.currentTarget, event.detail === 0)}
              onKeyDown={(event) => { delete event.currentTarget.dataset.pointerReturn; }}
              onBlur={(event) => { delete event.currentTarget.dataset.pointerReturn; }}
              className="group relative mx-auto block cursor-pointer w-full max-w-[218px] border-0 bg-transparent text-center outline-none focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-secondary focus-visible:outline-offset-4 data-[pointer-return=true]:focus-visible:outline-none"
            >
              <span className="relative block">
                <Image
                  src={`/images/marketing/${member.artwork}`}
                  alt=""
                  aria-hidden="true"
                  width={member.width}
                  height={member.height}
                  unoptimized
                  sizes="(max-width: 639px) 42vw, (max-width: 767px) 28vw, 218px"
                  className="mx-auto h-auto w-full transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none"
                />
              </span>
              <span className="mt-4 block font-body text-lg font-semibold leading-tight text-primary md:text-xl">
                {member.name}
              </span>
              <span className="mt-1 block font-body text-sm leading-snug text-secondary md:text-base">
                {member.role}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        id="team-profile-dialog"
        aria-labelledby="team-profile-title"
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-start justify-center overflow-y-auto bg-transparent p-4 py-6 text-primary backdrop:bg-primary/40 open:flex sm:items-center sm:p-8"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProfile();
        }}
        onCancel={(event) => { event.preventDefault(); void closeProfile(); }}
        onClose={restoreFocus}
      >
        {selectedMember && (
          <motion.div
            ref={panelRef}
            initial={shouldReduceMotion === false ? { opacity: 0, y: 16, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: motionDuration.smooth, ease: motionEasing.entrance }}
            className="relative my-auto grid w-full max-w-2xl gap-6 rounded-[28px] bg-paper p-6 shadow-2xl sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:gap-8 sm:p-9"
          >
            <button
              type="button"
              autoFocus
              onClick={closeProfile}
              aria-label={`Close ${selectedMember.name} profile`}
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-surface font-body text-xl text-primary transition-colors hover:bg-primary/10 focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-secondary focus-visible:outline-offset-2 motion-reduce:transition-none"
            >
              <span aria-hidden="true">×</span>
            </button>

            <Image
              src={`/images/marketing/${selectedMember.artwork}`}
              alt=""
              aria-hidden="true"
              width={selectedMember.width}
              height={selectedMember.height}
              unoptimized
              className="mx-auto h-auto w-full max-w-[260px] sm:max-w-none"
            />

            <div className="pr-10 sm:pr-4">
              <p className="font-detail text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                AdaPenyu team
              </p>
              <h2 id="team-profile-title" className="mt-3 font-body text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                {selectedMember.name}
              </h2>
              <p className="mt-2 font-detail text-lg text-secondary">{selectedMember.role}</p>
              {selectedMember.bio && (
                <p className="mt-5 font-detail leading-relaxed text-secondary">{selectedMember.bio}</p>
              )}
              {selectedMember.memberId && (
                <p className="mt-4 font-detail text-sm text-secondary">Member ID: {selectedMember.memberId}</p>
              )}
              {selectedMember.linkedin && (
                <a
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-sm font-detail text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-4"
                >
                  LinkedIn profile
                </a>
              )}
            </div>
          </motion.div>
        )}
      </dialog>
    </>
  );
}
