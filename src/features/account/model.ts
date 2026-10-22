export type AccountActionKind = "reset-password" | "accept-invitation" | "confirm-email";

export type AccountLinkRejectionReason =
  | "malformed_url"
  | "invalid_scheme"
  | "embedded_credentials"
  | "untrusted_host"
  | "invalid_port"
  | "unsupported_path"
  | "missing_token"
  | "duplicate_token"
  | "empty_token"
  | "token_too_long"
  | "malformed_token";

export interface AccountActionSpec {
  kind: AccountActionKind;
  path: `/account/${AccountActionKind}`;
  endpoint: `/api/v1/auth/${string}`;
  requiresPassword: boolean;
  revokesAccountSessions: boolean;
}

export const OFFICIAL_WEBSITE_URL = "https://www.adapenyu.com";
export const EMAIL_ACTION_BASE_URL = "https://www.adapenyu.com/account";
export const TRUSTED_ACCOUNT_HOST = "www.adapenyu.com";
export const MAX_ACTION_TOKEN_LENGTH = 200;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const DEDUPLICATION_WINDOW_MS = 5000;

export const ACCOUNT_ACTION_SPECS: Record<AccountActionKind, AccountActionSpec> = {
  "reset-password": {
    kind: "reset-password",
    path: "/account/reset-password",
    endpoint: "/api/v1/auth/reset-password",
    requiresPassword: true,
    revokesAccountSessions: true,
  },
  "accept-invitation": {
    kind: "accept-invitation",
    path: "/account/accept-invitation",
    endpoint: "/api/v1/auth/invitations/accept",
    requiresPassword: true,
    revokesAccountSessions: false,
  },
  "confirm-email": {
    kind: "confirm-email",
    path: "/account/confirm-email",
    endpoint: "/api/v1/auth/confirm-email",
    requiresPassword: false,
    revokesAccountSessions: true,
  },
};

const PATH_TO_ACTION: Record<string, AccountActionKind> = {
  "/account/reset-password": "reset-password",
  "/account/accept-invitation": "accept-invitation",
  "/account/confirm-email": "confirm-email",
};

export function normalizeAccountActionPath(rawPathname: string): AccountActionKind | null {
  if (typeof rawPathname !== "string" || rawPathname.length === 0) return null;
  if (rawPathname.includes("//") || rawPathname.includes("\\")) return null;
  const normalized =
    rawPathname.length > 1 && rawPathname.endsWith("/")
      ? rawPathname.slice(0, -1)
      : rawPathname;
  return PATH_TO_ACTION[normalized] ?? null;
}

export type TokenExtractionResult =
  | { ok: true; token: string }
  | { ok: false; reason: AccountLinkRejectionReason; message: string };

export function extractAccountActionToken(rawQueryOrSearch: string): TokenExtractionResult {
  const query = rawQueryOrSearch.startsWith("?")
    ? rawQueryOrSearch.slice(1)
    : rawQueryOrSearch;

  if (!query) {
    return {
      ok: false,
      reason: "missing_token",
      message:
        "This account link is missing its verification token. Please open the exact link from your email or request a new one.",
    };
  }

  const rawSegments = query.split("&").filter((part) => part.length > 0);
  let rawTokenKeyCount = 0;
  for (const segment of rawSegments) {
    const eqIndex = segment.indexOf("=");
    const rawKey = eqIndex === -1 ? segment : segment.slice(0, eqIndex);
    let decodedKey = rawKey;
    try {
      decodedKey = decodeURIComponent(rawKey.replace(/\+/g, " "));
    } catch {
      return {
        ok: false,
        reason: "malformed_token",
        message: "This account link contains a malformed query parameter.",
      };
    }
    if (decodedKey === "token") {
      rawTokenKeyCount += 1;
      if (eqIndex === -1) {
        return {
          ok: false,
          reason: "empty_token",
          message: "This account link token is empty. Please request a new email link.",
        };
      }
      const rawValue = segment.slice(eqIndex + 1);
      if (rawValue.includes("+")) {
        return {
          ok: false,
          reason: "malformed_token",
          message: "This account link token contains invalid whitespace encoding.",
        };
      }
    }
  }

  const params = new URLSearchParams(query);
  const tokenValues = params.getAll("token");
  const tokenCount = Math.max(rawTokenKeyCount, tokenValues.length);

  if (tokenCount === 0) {
    return {
      ok: false,
      reason: "missing_token",
      message:
        "This account link is missing its verification token. Please open the exact link from your email or request a new one.",
    };
  }

  if (tokenCount > 1) {
    return {
      ok: false,
      reason: "duplicate_token",
      message:
        "This account link contains multiple token parameters and cannot be processed safely.",
    };
  }

  const token = tokenValues[0] ?? "";
  if (token.length === 0) {
    return {
      ok: false,
      reason: "empty_token",
      message: "This account link token is empty. Please request a new email link.",
    };
  }

  if (token.length > MAX_ACTION_TOKEN_LENGTH) {
    return {
      ok: false,
      reason: "token_too_long",
      message: "This account link token exceeds the maximum allowed length of 200 characters.",
    };
  }

  if (/[\s\u0000-\u001F\u007F]/.test(token)) {
    return {
      ok: false,
      reason: "malformed_token",
      message: "This account link token contains invalid characters. Please request a new email link.",
    };
  }

  return { ok: true, token };
}

export interface ParsedAccountActionLink {
  kind: AccountActionKind;
  path: `/account/${AccountActionKind}`;
  endpoint: `/api/v1/auth/${string}`;
  token: string;
  redactedUrl: string;
  toString(): string;
  toJSON(): { kind: AccountActionKind; path: string; endpoint: string; token: "[REDACTED]" };
}

export type ParseAccountActionLinkResult =
  | { ok: true; link: ParsedAccountActionLink }
  | { ok: false; reason: AccountLinkRejectionReason; message: string };

export function parseAccountActionLink(rawUrl: string): ParseAccountActionLinkResult {
  if (typeof rawUrl !== "string" || rawUrl.length === 0 || /^\s|\s$/.test(rawUrl)) {
    return {
      ok: false,
      reason: "malformed_url",
      message: "The account action link is malformed.",
    };
  }

  // Reject scheme-relative URLs or missing authority
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawUrl)) {
    return {
      ok: false,
      reason: "malformed_url",
      message: "The account action link must be a complete URL.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return {
      ok: false,
      reason: "malformed_url",
      message: "The account action link could not be parsed.",
    };
  }

  if (parsed.protocol !== "https:") {
    return {
      ok: false,
      reason: "invalid_scheme",
      message: "Account action links must use HTTPS.",
    };
  }

  if (parsed.username !== "" || parsed.password !== "") {
    return {
      ok: false,
      reason: "embedded_credentials",
      message: "Account action links must not contain embedded credentials.",
    };
  }

  if (parsed.hostname.toLowerCase() !== TRUSTED_ACCOUNT_HOST) {
    return {
      ok: false,
      reason: "untrusted_host",
      message: "Account action links must use the official www.adapenyu.com host.",
    };
  }

  if (parsed.port !== "" && parsed.port !== "443") {
    return {
      ok: false,
      reason: "invalid_port",
      message: "Account action links must use the standard HTTPS port.",
    };
  }

  const kind = normalizeAccountActionPath(parsed.pathname);
  if (!kind) {
    return {
      ok: false,
      reason: "unsupported_path",
      message: "This account action path is not supported.",
    };
  }

  const tokenResult = extractAccountActionToken(parsed.search);
  if (!tokenResult.ok) {
    return tokenResult;
  }

  const spec = ACCOUNT_ACTION_SPECS[kind];
  const redactedUrl = `${OFFICIAL_WEBSITE_URL}${spec.path}?token=[REDACTED]`;

  const link: ParsedAccountActionLink = {
    kind,
    path: spec.path,
    endpoint: spec.endpoint,
    token: tokenResult.token,
    redactedUrl,
    toString() {
      return redactedUrl;
    },
    toJSON() {
      return {
        kind,
        path: spec.path,
        endpoint: spec.endpoint,
        token: "[REDACTED]",
      };
    },
  };

  return { ok: true, link };
}

export function resolveAccountApiBaseUrl(configuredOrigin?: string | null): string | null {
  const candidate =
    typeof configuredOrigin === "string"
      ? configuredOrigin.trim()
      : typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL
        ? process.env.NEXT_PUBLIC_API_BASE_URL.trim()
        : "";

  if (!candidate) return null;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return null;
  }

  if (parsed.username !== "" || parsed.password !== "" || parsed.search !== "" || parsed.hash !== "") {
    return null;
  }

  // Keep the API server URL strictly separate from the official website URL.
  const host = parsed.hostname.toLowerCase();
  if (host === TRUSTED_ACCOUNT_HOST || host === "adapenyu.com") {
    return null;
  }

  const normalizedPath = parsed.pathname.replace(/\/+$/, "");
  return `${parsed.origin}${normalizedPath}`;
}

export interface PasswordInspection {
  lengthOk: boolean;
  letterOk: boolean;
  numberOk: boolean;
  symbolOk: boolean;
  matchOk: boolean;
  isValid: boolean;
  error: string | null;
}

export function inspectAccountPassword(
  newPassword: string,
  confirmPassword: string,
): PasswordInspection {
  // Never trim passwords: validate exact character sequence including any leading/trailing spaces.
  const lengthOk =
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword.length <= MAX_PASSWORD_LENGTH;
  const letterOk = /\p{L}/u.test(newPassword);
  const numberOk = /\p{Nd}/u.test(newPassword);
  const symbolOk = /[^\p{L}\p{Nd}\s\p{Cc}]/u.test(newPassword);
  const matchOk = newPassword.length > 0 && newPassword === confirmPassword;

  let error: string | null = null;
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    error = "Your new password must be at least 8 characters long.";
  } else if (newPassword.length > MAX_PASSWORD_LENGTH) {
    error = "Your new password must be 128 characters or fewer.";
  } else if (!letterOk || !numberOk || !symbolOk) {
    error =
      "Your password must include at least one letter, one number, and one non-whitespace symbol.";
  } else if (!matchOk) {
    error = "New password and confirmation must match exactly.";
  }

  return {
    lengthOk,
    letterOk,
    numberOk,
    symbolOk,
    matchOk,
    isValid: error === null,
    error,
  };
}

export function redactAccountActionText(input: string): string {
  if (typeof input !== "string" || input.length === 0) return "";
  return input
    .replace(/([?&]token=)[^&\s#"]*/gi, "$1[REDACTED]")
    .replace(
      /("(?:token|new_password|confirm_password|password)"\s*:\s*)"[^"]*"/gi,
      '$1"[REDACTED]"',
    );
}

export function sanitizeUrlForAnalytics(rawUrl: string): string {
  if (typeof rawUrl !== "string" || rawUrl.length === 0) return "";
  try {
    const parsed = new URL(rawUrl, OFFICIAL_WEBSITE_URL);
    if (
      parsed.pathname === "/account" ||
      parsed.pathname.startsWith("/account/")
    ) {
      return `${parsed.origin}${parsed.pathname}`;
    }
    if (parsed.searchParams.has("token")) {
      parsed.searchParams.set("token", "[REDACTED]");
    }
    return parsed.toString();
  } catch {
    return redactAccountActionText(rawUrl);
  }
}

export interface BrowserLocationLike {
  pathname: string;
  search: string;
  hash?: string;
}

export interface BrowserHistoryLike {
  replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

// Private in-memory handoff slot to survive React StrictMode double effect invocation
// on the exact same pathname without persisting to Web Storage, cookies, or globals.
let ephemeralConsumedToken: { pathname: string; result: TokenExtractionResult } | null = null;

export function clearBrowserTokenMemory(): void {
  ephemeralConsumedToken = null;
}

export function consumeBrowserLocationToken(
  locationLike: BrowserLocationLike,
  historyLike: BrowserHistoryLike,
): TokenExtractionResult {
  const rawSearch = locationLike.search ?? "";
  const cleanUrl = `${locationLike.pathname}${locationLike.hash ?? ""}`;

  if (rawSearch.length > 0) {
    const result = extractAccountActionToken(rawSearch);
    historyLike.replaceState(null, "", cleanUrl);
    ephemeralConsumedToken = { pathname: locationLike.pathname, result };
    return result;
  }

  if (ephemeralConsumedToken && ephemeralConsumedToken.pathname === locationLike.pathname) {
    return ephemeralConsumedToken.result;
  }

  return extractAccountActionToken("");
}

export function parseApiErrorDetail(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as { detail?: unknown; message?: unknown };
  if (typeof record.detail === "string" && record.detail.trim().length > 0) {
    return record.detail.trim();
  }
  if (Array.isArray(record.detail)) {
    const messages = record.detail
      .map((item) => {
        if (!item || typeof item !== "object") return "";
        const entry = item as { msg?: unknown; message?: unknown };
        if (typeof entry.msg === "string") return entry.msg.trim();
        if (typeof entry.message === "string") return entry.message.trim();
        return "";
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join(" ");
  }
  if (typeof record.message === "string" && record.message.trim().length > 0) {
    return record.message.trim();
  }
  return null;
}

export type AccountActionSubmissionOutcome =
  | {
      status: "success_204";
      httpStatus: 204;
      showLoginWithoutAutoAuth: true;
      revokedAccountSessions: boolean;
      message: string;
    }
  | {
      status: "invalid_token_400";
      httpStatus: 400;
      terminal: true;
      message: string;
      recoveryGuidance: string;
    }
  | {
      status: "email_conflict_409";
      httpStatus: 409;
      terminal: true;
      message: string;
      recoveryGuidance: string;
    }
  | {
      status: "validation_error_422";
      httpStatus: 422;
      terminal: false;
      message: string;
      recoveryGuidance: string | null;
    }
  | {
      status: "ambiguous_failure";
      httpStatus: number | null;
      terminal: true;
      message: string;
      recoveryGuidance: string;
    };

export type FetchLike = (
  input: string,
  init: RequestInit,
) => Promise<{
  status: number;
  text?: () => Promise<string>;
  json?: () => Promise<unknown>;
}>;

export interface SubmitAccountActionParams {
  apiBaseUrl: string;
  kind: AccountActionKind;
  token: string;
  newPassword?: string;
  confirmPassword?: string;
  fetchImpl?: FetchLike;
}

export async function submitAccountActionRequest(
  params: SubmitAccountActionParams,
): Promise<AccountActionSubmissionOutcome> {
  const resolvedBaseUrl = resolveAccountApiBaseUrl(params.apiBaseUrl);
  if (!resolvedBaseUrl) {
    return {
      status: "ambiguous_failure",
      httpStatus: null,
      terminal: true,
      message: "The AdaPenyu API server URL is not configured or is invalid for this environment.",
      recoveryGuidance:
        "Configure NEXT_PUBLIC_API_BASE_URL to point to the AdaPenyu API server (separate from https://www.adapenyu.com).",
    };
  }

  const spec = ACCOUNT_ACTION_SPECS[params.kind];
  const bodyPayload = spec.requiresPassword
    ? {
        token: params.token,
        new_password: params.newPassword ?? "",
        confirm_password: params.confirmPassword ?? "",
      }
    : {
        token: params.token,
      };

  const fetchFn: FetchLike = params.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);

  try {
    // Public endpoint call: never attach Authorization bearer headers or cookies, and never trigger token refresh.
    const response = await fetchFn(`${resolvedBaseUrl}${spec.endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyPayload),
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });

    if (response.status === 204) {
      const successMessages: Record<AccountActionKind, string> = {
        "reset-password":
          "Your password has been reset and existing sessions for this account have been signed out. Please sign in with your new password.",
        "accept-invitation":
          "Your AdaPenyu account is set up and ready. Please sign in with the password you just created.",
        "confirm-email":
          "Your email address has been confirmed and existing sessions for this account have been signed out. Please sign in to continue.",
      };
      return {
        status: "success_204",
        httpStatus: 204,
        showLoginWithoutAutoAuth: true,
        revokedAccountSessions: spec.revokesAccountSessions,
        message: successMessages[params.kind],
      };
    }

    let parsedBody: unknown = null;
    try {
      if (typeof response.json === "function") {
        parsedBody = await response.json();
      } else if (typeof response.text === "function") {
        const rawText = await response.text();
        parsedBody = rawText ? JSON.parse(rawText) : null;
      }
    } catch {
      parsedBody = null;
    }

    const detail = parseApiErrorDetail(parsedBody);

    if (response.status === 400) {
      return {
        status: "invalid_token_400",
        httpStatus: 400,
        terminal: true,
        message:
          detail ??
          "This link is invalid, expired, has already been used, or is no longer eligible.",
        recoveryGuidance:
          "Single-use email links cannot be reused. Please request a new email link or contact your organisation administrator.",
      };
    }

    if (response.status === 409) {
      return {
        status: "email_conflict_409",
        httpStatus: 409,
        terminal: true,
        message:
          detail ??
          "This email address is already associated with another AdaPenyu account and cannot be confirmed.",
        recoveryGuidance:
          "Sign in with your existing account or contact your organisation administrator to resolve the email conflict.",
      };
    }

    if (response.status === 422) {
      return {
        status: "validation_error_422",
        httpStatus: 422,
        terminal: false,
        message: detail ?? "Please review the password requirements and try again.",
        recoveryGuidance: "Ensure your password meets all requirements and matches the confirmation field exactly.",
      };
    }

    return {
      status: "ambiguous_failure",
      httpStatus: response.status,
      terminal: true,
      message: detail ?? `The server returned an unexpected failure (${response.status}).`,
      recoveryGuidance:
        "Because account email links are single-use, this action may have already succeeded before the response was interrupted. Please try signing in first before requesting a new link.",
    };
  } catch {
    return {
      status: "ambiguous_failure",
      httpStatus: null,
      terminal: true,
      message: "The network connection was interrupted before the server response arrived.",
      recoveryGuidance:
        "Because account email links are single-use, we did not retry automatically and your request may have already succeeded. Please try signing in first before requesting a new link.",
    };
  }
}

export type AccountFlowPhase =
  | "idle"
  | "restoring_session"
  | "confirm_leave_session"
  | "ready"
  | "submitting"
  | "validation_error"
  | "completed_login"
  | "terminal_error"
  | "ambiguous_error"
  | "cancelled";

export interface AccountCoordinatorSnapshot {
  phase: AccountFlowPhase;
  activeAction: AccountActionKind | null;
  activePath: `/account/${AccountActionKind}` | null;
  apiBaseUrl: string;
  isSignedIn: boolean;
  signedInEmail: string | null;
  requiresSessionConfirmation: boolean;
  isSubmitting: boolean;
  hasTokenInMemory: boolean;
  hasPasswordsInMemory: boolean;
  showLoginWithoutAutoAuth: boolean;
  revokedAccountSessions: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  recoveryGuidance: string | null;
  lastRejectedReason: AccountLinkRejectionReason | null;
}

export interface AccountCoordinatorOptions {
  apiBaseUrl: string;
  isSignedIn?: boolean;
  signedInEmail?: string | null;
  restoringSession?: boolean;
  deduplicationWindowMs?: number;
  now?: () => number;
  fetchImpl?: FetchLike;
  onSignOutCurrentSession?: () => Promise<void> | void;
}

export function createAccountActionCoordinator(options: AccountCoordinatorOptions) {
  const configuredApiBaseUrl = resolveAccountApiBaseUrl(options.apiBaseUrl);
  if (!configuredApiBaseUrl) {
    throw new Error("A valid, separate API base URL is required to initialize AccountActionCoordinator.");
  }

  const nowFn = options.now ?? (() => Date.now());
  const dedupWindowMs = options.deduplicationWindowMs ?? DEDUPLICATION_WINDOW_MS;

  let isSignedIn = Boolean(options.isSignedIn);
  let signedInEmail: string | null = options.signedInEmail ?? null;
  let isRestoringSession = Boolean(options.restoringSession);

  // Sensitive values are kept in private closure variables only and cleared on completion or cancellation.
  let activeAction: AccountActionKind | null = null;
  let actionToken: string | null = null;
  let newPassword = "";
  let confirmPassword = "";

  let pendingLinkDuringRestore: ParsedAccountActionLink | null = null;
  let lastDeliveredKey: string | null = null;
  let lastDeliveredAt: number | null = null;

  let phase: AccountFlowPhase = isRestoringSession ? "restoring_session" : "idle";
  let isSubmitting = false;
  let showLoginWithoutAutoAuth = false;
  let revokedAccountSessions = false;
  let statusMessage: string | null = null;
  let errorMessage: string | null = null;
  let recoveryGuidance: string | null = null;
  let lastRejectedReason: AccountLinkRejectionReason | null = null;

  function clearSensitiveMemory() {
    actionToken = null;
    newPassword = "";
    confirmPassword = "";
    pendingLinkDuringRestore = null;
    clearBrowserTokenMemory();
  }

  function applyLinkToScreen(link: ParsedAccountActionLink) {
    activeAction = link.kind;
    actionToken = link.token;
    newPassword = "";
    confirmPassword = "";
    showLoginWithoutAutoAuth = false;
    revokedAccountSessions = false;
    statusMessage = null;
    errorMessage = null;
    recoveryGuidance = null;
    lastRejectedReason = null;

    // Opening a link must only display the appropriate screen and never auto-submit or auto-sign-out.
    phase = isSignedIn ? "confirm_leave_session" : "ready";
  }

  function handleIncomingLink(rawUrl: string): {
    accepted: boolean;
    deduplicated: boolean;
    reason?: AccountLinkRejectionReason;
  } {
    const parsed = parseAccountActionLink(rawUrl);
    if (!parsed.ok) {
      lastRejectedReason = parsed.reason;
      return { accepted: false, deduplicated: false, reason: parsed.reason };
    }

    const { link } = parsed;
    const deliveryKey = `${link.kind}:${link.token}`;
    const timestamp = nowFn();

    const isSameActiveLink =
      activeAction === link.kind &&
      actionToken === link.token &&
      (phase === "ready" ||
        phase === "confirm_leave_session" ||
        phase === "submitting" ||
        phase === "validation_error");

    const isWithinWindow =
      lastDeliveredKey === deliveryKey &&
      lastDeliveredAt !== null &&
      timestamp - lastDeliveredAt < dedupWindowMs;

    if (isSameActiveLink || isWithinWindow) {
      lastDeliveredAt = timestamp;
      return { accepted: true, deduplicated: true };
    }

    lastDeliveredKey = deliveryKey;
    lastDeliveredAt = timestamp;

    if (isRestoringSession) {
      pendingLinkDuringRestore = link;
      activeAction = link.kind;
      phase = "restoring_session";
      return { accepted: true, deduplicated: false };
    }

    applyLinkToScreen(link);
    return { accepted: true, deduplicated: false };
  }

  return {
    deliverColdStartLink(rawUrl: string) {
      return handleIncomingLink(rawUrl);
    },

    deliverForegroundLink(rawUrl: string) {
      return handleIncomingLink(rawUrl);
    },

    beginSessionRestoration() {
      isRestoringSession = true;
      if (phase === "idle") {
        phase = "restoring_session";
      }
    },

    completeSessionRestoration(restored: { isSignedIn: boolean; signedInEmail?: string | null }) {
      isRestoringSession = false;
      isSignedIn = restored.isSignedIn;
      signedInEmail = restored.signedInEmail ?? null;

      if (pendingLinkDuringRestore) {
        const link = pendingLinkDuringRestore;
        pendingLinkDuringRestore = null;
        applyLinkToScreen(link);
      } else if (activeAction && actionToken) {
        phase = isSignedIn ? "confirm_leave_session" : "ready";
      } else {
        phase = "idle";
      }
    },

    async confirmLeaveCurrentSession() {
      if (phase !== "confirm_leave_session") return false;
      if (options.onSignOutCurrentSession) {
        await options.onSignOutCurrentSession();
      }
      isSignedIn = false;
      signedInEmail = null;
      phase = "ready";
      return true;
    },

    keepCurrentSession() {
      clearSensitiveMemory();
      activeAction = null;
      lastDeliveredKey = null;
      lastDeliveredAt = null;
      phase = "cancelled";
    },

    cancel() {
      clearSensitiveMemory();
      activeAction = null;
      lastDeliveredKey = null;
      lastDeliveredAt = null;
      phase = "cancelled";
    },

    setPasswords(nextNewPassword: string, nextConfirmPassword: string) {
      // Never trim passwords.
      newPassword = nextNewPassword;
      confirmPassword = nextConfirmPassword;
    },

    async submit(): Promise<AccountActionSubmissionOutcome | null> {
      // Prevent duplicate submissions or submitting before leaving an active signed-in session.
      if (
        isSubmitting ||
        (phase !== "ready" && phase !== "validation_error") ||
        !activeAction ||
        !actionToken
      ) {
        return null;
      }

      const spec = ACCOUNT_ACTION_SPECS[activeAction];
      if (spec.requiresPassword) {
        const check = inspectAccountPassword(newPassword, confirmPassword);
        if (!check.isValid) {
          phase = "validation_error";
          errorMessage = check.error;
          recoveryGuidance =
            "Passwords must be 8–128 characters and include at least one letter, one number, and one non-whitespace symbol.";
          return {
            status: "validation_error_422",
            httpStatus: 422,
            terminal: false,
            message: check.error ?? "Password validation failed.",
            recoveryGuidance,
          };
        }
      }

      isSubmitting = true;
      phase = "submitting";
      errorMessage = null;
      recoveryGuidance = null;

      const tokenForRequest = actionToken;
      const newPasswordForRequest = newPassword;
      const confirmPasswordForRequest = confirmPassword;

      try {
        const outcome = await submitAccountActionRequest({
          apiBaseUrl: configuredApiBaseUrl,
          kind: activeAction,
          token: tokenForRequest,
          newPassword: newPasswordForRequest,
          confirmPassword: confirmPasswordForRequest,
          fetchImpl: options.fetchImpl,
        });

        if (outcome.status === "success_204") {
          clearSensitiveMemory();
          showLoginWithoutAutoAuth = true;
          revokedAccountSessions = outcome.revokedAccountSessions;
          statusMessage = outcome.message;
          phase = "completed_login";
          return outcome;
        }

        if (outcome.status === "validation_error_422") {
          phase = "validation_error";
          errorMessage = outcome.message;
          recoveryGuidance = outcome.recoveryGuidance;
          return outcome;
        }

        // Terminal (400, 409) or ambiguous (network / 5xx) outcomes wipe sensitive memory and block retries.
        clearSensitiveMemory();
        errorMessage = outcome.message;
        recoveryGuidance = outcome.recoveryGuidance;
        phase = outcome.status === "ambiguous_failure" ? "ambiguous_error" : "terminal_error";
        return outcome;
      } finally {
        isSubmitting = false;
      }
    },

    getSnapshot(): AccountCoordinatorSnapshot {
      return {
        phase,
        activeAction,
        activePath: activeAction ? ACCOUNT_ACTION_SPECS[activeAction].path : null,
        apiBaseUrl: configuredApiBaseUrl,
        isSignedIn,
        signedInEmail,
        requiresSessionConfirmation: phase === "confirm_leave_session",
        isSubmitting,
        hasTokenInMemory: actionToken !== null && actionToken.length > 0,
        hasPasswordsInMemory: newPassword.length > 0 || confirmPassword.length > 0,
        showLoginWithoutAutoAuth,
        revokedAccountSessions,
        statusMessage,
        errorMessage,
        recoveryGuidance,
        lastRejectedReason,
      };
    },
  };
}
