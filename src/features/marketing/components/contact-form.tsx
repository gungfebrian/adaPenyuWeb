"use client";

import { useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/button";

type ContactDraft = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

const storageKey = "adapenyu-contact-draft";

const emptyDraft: ContactDraft = {
  name: "",
  email: "",
  organization: "",
  message: "",
};

function isContactDraft(value: unknown): value is ContactDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Record<string, unknown>;
  return (
    typeof draft.name === "string" &&
    typeof draft.email === "string" &&
    typeof draft.organization === "string" &&
    typeof draft.message === "string"
  );
}

const fieldClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-white/20 bg-secondary px-4 py-3 font-detail text-base text-white placeholder:text-white/60 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2";

export function ContactForm() {
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [status, setStatus] = useState("");

  function restoreDraft() {
    try {
      const savedDraft = localStorage.getItem(storageKey);
      if (!savedDraft) { setStatus("No saved draft was found on this device."); return; }

      const parsed: unknown = JSON.parse(savedDraft);
      if (isContactDraft(parsed)) {
        setDraft(parsed);
        setStatus("Saved draft restored from this device. It has not been sent.");
      }
    } catch {
      setStatus("A saved draft could not be read from this device.");
    }
  }

  function updateField(field: keyof ContactDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setStatus("");
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setStatus("Draft saved on this device. It has not been sent.");
    } catch {
      setStatus("This browser could not save the draft. It has not been sent.");
    }
  }

  return (
    <form className="grid gap-5" onSubmit={saveDraft}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="font-detail text-sm font-semibold text-white">
            Name <span aria-hidden="true">*</span>
            <span className="sr-only"> required</span>
          </label>
          <input
            autoComplete="name"
            className={fieldClassName}
            id="contact-name"
            name="name"
            onChange={(event) => updateField("name", event.currentTarget.value)}
            required
            value={draft.name}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="font-detail text-sm font-semibold text-white">
            Email <span aria-hidden="true">*</span>
            <span className="sr-only"> required</span>
          </label>
          <input
            autoComplete="email"
            className={fieldClassName}
            id="contact-email"
            name="email"
            onChange={(event) => updateField("email", event.currentTarget.value)}
            required
            type="email"
            value={draft.email}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-organization" className="font-detail text-sm font-semibold text-white">
          Organization
        </label>
        <input
          autoComplete="organization"
          className={fieldClassName}
          id="contact-organization"
          name="organization"
          onChange={(event) => updateField("organization", event.currentTarget.value)}
          value={draft.organization}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="font-detail text-sm font-semibold text-white">
          Message <span aria-hidden="true">*</span>
          <span className="sr-only"> required</span>
        </label>
        <textarea
          className={`${fieldClassName} min-h-36 resize-y`}
          id="contact-message"
          name="message"
          onChange={(event) => updateField("message", event.currentTarget.value)}
          required
          rows={5}
          value={draft.message}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-draft-note" className="font-detail text-sm leading-relaxed text-white/75">
          This form saves a draft on your device. It does not send a message.
        </p>
        <button
          type="submit"
          className={buttonClasses("secondary", "shrink-0 bg-white hover:bg-white/85 hover:text-primary focus-visible:outline-white")}
        >
          Save draft <span aria-hidden="true">↗</span>
        </button>
      </div>
      <button type="button" onClick={restoreDraft} className="w-fit cursor-pointer rounded-md font-detail text-sm text-white/80 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4">Restore saved draft</button>
      <p className="min-h-6 font-detail text-sm font-medium text-white" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
