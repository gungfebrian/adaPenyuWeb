"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { leaveCurrentSessionForAccountAction } from "@/features/auth/actions";
import { ACCOUNT_COPY, type SupportedLocale } from "@/features/account/copy";
import {
  ACCOUNT_ACTION_SPECS,
  clearBrowserTokenMemory,
  consumeBrowserLocationToken,
  inspectAccountPassword,
  submitAccountActionRequest,
  type AccountActionKind,
} from "@/features/account/model";

export interface AccountActionScreenProps {
  kind: AccountActionKind;
  initialSession?: {
    isSignedIn: boolean;
    email: string | null;
  };
  apiBaseUrl?: string;
  locale?: SupportedLocale;
}

type ScreenPhase =
  | "initializing"
  | "confirm_leave_session"
  | "ready"
  | "submitting"
  | "completed_login"
  | "terminated_error"
  | "cancelled";

export function AccountActionScreen({
  kind,
  initialSession,
  apiBaseUrl,
  locale = "en",
}: AccountActionScreenProps) {
  const spec = ACCOUNT_ACTION_SPECS[kind];
  const sharedCopy = ACCOUNT_COPY[locale];
  const actionCopy = sharedCopy.actions[kind];

  // Sensitive action token is kept strictly in a private ref in memory and never rendered to the DOM.
  const tokenRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const terminatedRef = useRef(false);

  const [phase, setPhase] = useState<ScreenPhase>(
    initialSession?.isSignedIn ? "confirm_leave_session" : "initializing",
  );
  const [signedInEmail, setSignedInEmail] = useState<string | null>(
    initialSession?.email ?? null,
  );
  const [leavingSession, setLeavingSession] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recoveryGuidance, setRecoveryGuidance] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const passwordCheck = inspectAccountPassword(newPassword, confirmPassword);

  function wipeSensitiveMemory() {
    tokenRef.current = null;
    clearBrowserTokenMemory();
    setNewPassword("");
    setConfirmPassword("");
  }

  useEffect(() => {
    // Synchronously read token into closure memory and remove it from the visible URL.
    const extracted = consumeBrowserLocationToken(window.location, window.history);

    const frame = window.requestAnimationFrame(() => {
      if (!extracted.ok) {
        terminatedRef.current = true;
        tokenRef.current = null;
        clearBrowserTokenMemory();
        setErrorMessage(extracted.message);
        setRecoveryGuidance(
          "Please open the exact link from your email or request a new email link.",
        );
        setPhase("terminated_error");
        return;
      }

      tokenRef.current = extracted.token;
      setPhase(initialSession?.isSignedIn ? "confirm_leave_session" : "ready");
    });

    const handlePageHide = () => {
      tokenRef.current = null;
      clearBrowserTokenMemory();
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [initialSession?.isSignedIn]);

  async function handleConfirmLeaveSession() {
    if (leavingSession) return;
    setLeavingSession(true);
    try {
      await leaveCurrentSessionForAccountAction();
      setSignedInEmail(null);
      setPhase(terminatedRef.current ? "terminated_error" : "ready");
    } finally {
      setLeavingSession(false);
    }
  }

  function handleKeepCurrentSession() {
    terminatedRef.current = true;
    wipeSensitiveMemory();
    setPhase("cancelled");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prevent duplicate submissions and never submit while a signed-in session is still active.
    if (
      submittingRef.current ||
      terminatedRef.current ||
      phase !== "ready" ||
      !tokenRef.current
    ) {
      return;
    }

    setErrorMessage(null);
    setRecoveryGuidance(null);

    if (spec.requiresPassword) {
      // Never trim passwords.
      const check = inspectAccountPassword(newPassword, confirmPassword);
      if (!check.isValid) {
        setErrorMessage(check.error);
        setRecoveryGuidance(sharedCopy.noTrimHint);
        return;
      }
    }

    submittingRef.current = true;
    setPhase("submitting");

    const tokenForRequest = tokenRef.current;
    const rawNewPassword = newPassword;
    const rawConfirmPassword = confirmPassword;

    try {
      const outcome = await submitAccountActionRequest({
        apiBaseUrl: apiBaseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
        kind,
        token: tokenForRequest,
        newPassword: rawNewPassword,
        confirmPassword: rawConfirmPassword,
      });

      if (outcome.status === "success_204") {
        terminatedRef.current = true;
        wipeSensitiveMemory();
        setStatusMessage(actionCopy.loginNotice);
        setPhase("completed_login");
        return;
      }

      if (outcome.status === "validation_error_422") {
        setErrorMessage(outcome.message);
        setRecoveryGuidance(outcome.recoveryGuidance);
        setPhase("ready");
        return;
      }

      // 400, 409, or ambiguous network/server failure: wipe sensitive memory and block retries.
      terminatedRef.current = true;
      wipeSensitiveMemory();
      setErrorMessage(outcome.message);
      setRecoveryGuidance(outcome.recoveryGuidance);
      setPhase("terminated_error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section
      className="mx-auto max-w-xl py-6 sm:py-12"
      data-account-action={kind}
      data-account-phase={phase}
    >
      <div className="rounded-3xl border border-primary/10 bg-paper/95 p-6 shadow-[0_18px_48px_#00263c12] backdrop-blur-xs sm:p-8">
        <span className="inline-flex items-center rounded-full bg-surface px-3.5 py-1.5 font-detail text-xs font-semibold tracking-wide text-secondary uppercase">
          {actionCopy.badge}
        </span>

        <h1 className="mt-4 font-body text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          {actionCopy.title}
        </h1>
        <p className="mt-3 font-detail text-sm leading-relaxed text-primary/80 sm:text-base">
          {actionCopy.subtitle}
        </p>

        {errorMessage && (
          <div
            role="alert"
            data-testid="account-action-error"
            className="mt-6 rounded-2xl border border-[#b42318]/25 bg-[#fef3f2] p-4 text-sm text-[#7a271a]"
          >
            <p className="font-semibold">{errorMessage}</p>
            {recoveryGuidance && (
              <p className="mt-1.5 text-xs leading-relaxed text-[#7a271a]/90">
                {recoveryGuidance}
              </p>
            )}
          </div>
        )}

        {phase === "confirm_leave_session" && (
          <div
            role="region"
            aria-labelledby="active-session-heading"
            data-testid="active-session-gate"
            className="mt-6 rounded-2xl border border-secondary/25 bg-surface p-5"
          >
            <h2
              id="active-session-heading"
              className="font-body text-lg font-semibold text-primary"
            >
              {sharedCopy.activeSessionTitle}
            </h2>
            <p className="mt-2 font-detail text-sm leading-relaxed text-primary/80">
              {sharedCopy.activeSessionBody(signedInEmail)}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmLeaveSession}
                disabled={leavingSession}
                data-testid="confirm-leave-session-button"
              >
                {leavingSession
                  ? sharedCopy.leaveSessionPendingButton
                  : sharedCopy.leaveSessionConfirmButton}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleKeepCurrentSession}
                disabled={leavingSession}
                data-testid="keep-current-session-button"
              >
                {sharedCopy.keepSessionCancelButton}
              </Button>
            </div>
          </div>
        )}

        {phase === "cancelled" && (
          <div
            role="status"
            data-testid="account-action-cancelled"
            className="mt-6 rounded-2xl border border-primary/15 bg-surface p-5"
          >
            <h2 className="font-body text-lg font-semibold text-primary">
              {sharedCopy.cancelledSessionTitle}
            </h2>
            <p className="mt-2 font-detail text-sm leading-relaxed text-primary/80">
              {sharedCopy.cancelledSessionBody}
            </p>
            <div className="mt-5">
              <Link href="/schedule" className={buttonClasses("primary")}>
                {sharedCopy.returnToWorkspaceLabel}
              </Link>
            </div>
          </div>
        )}

        {phase === "completed_login" && (
          <div
            role="status"
            data-testid="account-action-completed-login"
            className="mt-6 rounded-2xl border border-[#067647]/25 bg-[#ecfdf3] p-5 text-[#065f46]"
          >
            <p className="font-body text-base font-semibold">{statusMessage}</p>
            <div className="mt-4 rounded-xl bg-paper/90 p-4 text-primary">
              <h2 className="font-body text-lg font-semibold">
                {sharedCopy.completedHeading}
              </h2>
              <p className="mt-1.5 font-detail text-sm leading-relaxed text-primary/80">
                {sharedCopy.completedSubheading}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/login?notice=${kind}`}
                  className={buttonClasses("primary")}
                  data-testid="continue-to-login-link"
                >
                  {sharedCopy.continueToSignInLabel}
                </Link>
              </div>
            </div>
          </div>
        )}

        {(phase === "ready" || phase === "submitting") && (
          <form
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            className="mt-6 grid gap-5"
            data-testid="account-action-form"
          >
            {spec.requiresPassword ? (
              <>
                <div className="grid gap-2">
                  <label
                    htmlFor="account-new-password"
                    className="font-body text-sm font-semibold text-primary"
                  >
                    {sharedCopy.newPasswordLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="account-new-password"
                      name="new_password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder={sharedCopy.newPasswordPlaceholder}
                      disabled={phase === "submitting"}
                      required
                      className="min-h-11 flex-1 rounded-xl border border-primary/20 bg-paper px-3.5 py-2.5 font-detail text-sm text-primary focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      disabled={phase === "submitting"}
                      className="min-h-11 rounded-xl border border-primary/15 bg-surface px-3.5 font-body text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      {showNewPassword ? sharedCopy.hidePassword : sharedCopy.showPassword}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="account-confirm-password"
                    className="font-body text-sm font-semibold text-primary"
                  >
                    {sharedCopy.confirmPasswordLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="account-confirm-password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder={sharedCopy.confirmPasswordPlaceholder}
                      disabled={phase === "submitting"}
                      required
                      className="min-h-11 flex-1 rounded-xl border border-primary/20 bg-paper px-3.5 py-2.5 font-detail text-sm text-primary focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={phase === "submitting"}
                      className="min-h-11 rounded-xl border border-primary/15 bg-surface px-3.5 font-body text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    >
                      {showConfirmPassword
                        ? sharedCopy.hidePassword
                        : sharedCopy.showPassword}
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-2xl bg-surface p-4"
                  aria-label={sharedCopy.requirementsTitle}
                >
                  <p className="font-body text-xs font-semibold tracking-wide text-secondary uppercase">
                    {sharedCopy.requirementsTitle}
                  </p>
                  <ul className="mt-2.5 grid gap-1.5 font-detail text-xs">
                    <li
                      data-req="length"
                      data-met={passwordCheck.lengthOk ? "true" : "false"}
                      className={
                        passwordCheck.lengthOk
                          ? "font-semibold text-[#065f46]"
                          : "text-primary/75"
                      }
                    >
                      {passwordCheck.lengthOk ? "✓" : "•"} {sharedCopy.reqLength}
                    </li>
                    <li
                      data-req="letter"
                      data-met={passwordCheck.letterOk ? "true" : "false"}
                      className={
                        passwordCheck.letterOk
                          ? "font-semibold text-[#065f46]"
                          : "text-primary/75"
                      }
                    >
                      {passwordCheck.letterOk ? "✓" : "•"} {sharedCopy.reqLetter}
                    </li>
                    <li
                      data-req="number"
                      data-met={passwordCheck.numberOk ? "true" : "false"}
                      className={
                        passwordCheck.numberOk
                          ? "font-semibold text-[#065f46]"
                          : "text-primary/75"
                      }
                    >
                      {passwordCheck.numberOk ? "✓" : "•"} {sharedCopy.reqNumber}
                    </li>
                    <li
                      data-req="symbol"
                      data-met={passwordCheck.symbolOk ? "true" : "false"}
                      className={
                        passwordCheck.symbolOk
                          ? "font-semibold text-[#065f46]"
                          : "text-primary/75"
                      }
                    >
                      {passwordCheck.symbolOk ? "✓" : "•"} {sharedCopy.reqSymbol}
                    </li>
                    <li
                      data-req="match"
                      data-met={passwordCheck.matchOk ? "true" : "false"}
                      className={
                        passwordCheck.matchOk
                          ? "font-semibold text-[#065f46]"
                          : "text-primary/75"
                      }
                    >
                      {passwordCheck.matchOk ? "✓" : "•"} {sharedCopy.reqMatch}
                    </li>
                  </ul>
                  <p className="mt-2.5 font-detail text-[11px] text-primary/65">
                    {sharedCopy.noTrimHint}
                  </p>
                </div>
              </>
            ) : (
              actionCopy.confirmationNotice && (
                <div className="rounded-2xl bg-surface p-4 font-detail text-sm leading-relaxed text-primary/85">
                  {actionCopy.confirmationNotice}
                </div>
              )
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-fit"
              disabled={phase === "submitting"}
              data-testid="account-action-submit"
            >
              {phase === "submitting"
                ? actionCopy.submittingLabel
                : actionCopy.submitLabel}
            </Button>
          </form>
        )}

        <p className="mt-6 border-t border-primary/10 pt-4 font-detail text-xs leading-relaxed text-primary/65">
          {sharedCopy.openInIosAppHint}
        </p>
      </div>
    </section>
  );
}
