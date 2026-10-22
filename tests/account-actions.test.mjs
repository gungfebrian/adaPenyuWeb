import test from "node:test";
import assert from "node:assert/strict";
import {
  APPLE_APP_SITE_ASSOCIATION,
  XCODE_SIGNING_CONFIG,
  createAasaResponse,
} from "../src/features/account/aasa.ts";
import {
  clearBrowserTokenMemory,
  consumeBrowserLocationToken,
  createAccountActionCoordinator,
   inspectAccountPassword,
  parseAccountActionLink,
  redactAccountActionText,
  resolveAccountApiBaseUrl,
  sanitizeUrlForAnalytics,
} from "../src/features/account/model.ts";

const SYNTHETIC_TOKEN_RESET = "syn_reset_tok_01HZX9A8B7C6D5E4F3G2H1J0K9";
const SYNTHETIC_TOKEN_INVITE = "syn_invite_tok_01HZX9A8B7C6D5E4F3G2H1J0K8";
const SYNTHETIC_TOKEN_CONFIRM = "syn_confirm_tok_01HZX9A8B7C6D5E4F3G2H1J0K7";
const SYNTHETIC_API_BASE = "https://api.example.test";

test("accepts valid HTTPS Universal Links for all three supported account actions and opaque 200-char tokens", () => {
  const maxOpaqueToken = "T".repeat(190) + "-_~.~12345";
  assert.equal(maxOpaqueToken.length, 200);

  const cases = [
    {
      url: `https://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      kind: "reset-password",
      path: "/account/reset-password",
      endpoint: "/api/v1/auth/reset-password",
      token: SYNTHETIC_TOKEN_RESET,
    },
    {
      url: `https://www.adapenyu.com/account/accept-invitation/?token=${SYNTHETIC_TOKEN_INVITE}`,
      kind: "accept-invitation",
      path: "/account/accept-invitation",
      endpoint: "/api/v1/auth/invitations/accept",
      token: SYNTHETIC_TOKEN_INVITE,
    },
    {
      url: `https://WWW.ADAPENYU.COM:443/account/confirm-email?token=${maxOpaqueToken}`,
      kind: "confirm-email",
      path: "/account/confirm-email",
      endpoint: "/api/v1/auth/confirm-email",
      token: maxOpaqueToken,
    },
  ];

  for (const item of cases) {
    const result = parseAccountActionLink(item.url);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.link.kind, item.kind);
      assert.equal(result.link.path, item.path);
      assert.equal(result.link.endpoint, item.endpoint);
      assert.equal(result.link.token, item.token);
      // Redacted representations must never expose the raw token
      assert.equal(result.link.toString().includes(item.token), false);
      assert.equal(JSON.stringify(result.link).includes(item.token), false);
    }
  }
});

test("rejects non-HTTPS schemes, untrusted hosts, embedded credentials, non-443 ports, and unsupported paths", () => {
  const rejected = [
    [
      `http://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "invalid_scheme",
    ],
    [
      `adapenyu://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "invalid_scheme",
    ],
    [
      `https://adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "untrusted_host",
    ],
    [
      `https://api.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "untrusted_host",
    ],
    [
      `https://www.adapenyu.com.evil.example/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "untrusted_host",
    ],
    [
      `https://user:pass@www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "embedded_credentials",
    ],
    [
      `https://www.adapenyu.com:8443/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "invalid_port",
    ],
    [
      `https://www.adapenyu.com/account/unknown-action?token=${SYNTHETIC_TOKEN_RESET}`,
      "unsupported_path",
    ],
    [
      `https://www.adapenyu.com/account//reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      "unsupported_path",
    ],
    [
      `https://www.adapenyu.com/account/reset-password/extra?token=${SYNTHETIC_TOKEN_RESET}`,
      "unsupported_path",
    ],
    ["/account/reset-password?token=relative", "malformed_url"],
  ];

  for (const [rawUrl, expectedReason] of rejected) {
    const result = parseAccountActionLink(rawUrl);
    assert.equal(result.ok, false, `Expected ${rawUrl} to be rejected`);
    if (!result.ok) {
      assert.equal(result.reason, expectedReason);
    }
  }
});

test("rejects missing, empty, duplicate, whitespace, control-character, and >200-char token parameters", () => {
  const overlongToken = "x".repeat(201);
  const cases = [
    ["https://www.adapenyu.com/account/reset-password", "missing_token"],
    ["https://www.adapenyu.com/account/reset-password?other=1", "missing_token"],
    ["https://www.adapenyu.com/account/reset-password?token=", "empty_token"],
    ["https://www.adapenyu.com/account/reset-password?token", "empty_token"],
    [
      "https://www.adapenyu.com/account/reset-password?token=tok1&token=tok2",
      "duplicate_token",
    ],
    [
      "https://www.adapenyu.com/account/reset-password?token=tok1&token=",
      "duplicate_token",
    ],
    [
      `https://www.adapenyu.com/account/reset-password?token=${overlongToken}`,
      "token_too_long",
    ],
    [
      "https://www.adapenyu.com/account/reset-password?token=has%20space",
      "malformed_token",
    ],
    [
      "https://www.adapenyu.com/account/reset-password?token=has+plus",
      "malformed_token",
    ],
    [
      "https://www.adapenyu.com/account/reset-password?token=has%0Anewline",
      "malformed_token",
    ],
  ];

  for (const [rawUrl, expectedReason] of cases) {
    const result = parseAccountActionLink(rawUrl);
    assert.equal(result.ok, false, `Expected ${rawUrl} to fail with ${expectedReason}`);
    if (!result.ok) {
      assert.equal(result.reason, expectedReason);
    }
  }
});

test("keeps API server URL configurable and separate from www.adapenyu.com, and never lets links change it", () => {
  assert.equal(resolveAccountApiBaseUrl("https://api.adapenyu.com/"), "https://api.adapenyu.com");
  assert.equal(resolveAccountApiBaseUrl("http://127.0.0.1:8000/"), "http://127.0.0.1:8000");
  assert.equal(resolveAccountApiBaseUrl("https://www.adapenyu.com"), null);
  assert.equal(resolveAccountApiBaseUrl("https://adapenyu.com"), null);
  assert.equal(resolveAccountApiBaseUrl("ftp://api.adapenyu.com"), null);

  const coordinator = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
  });

  coordinator.deliverColdStartLink(
    `https://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}&api_base_url=https://evil.example.test&server=https://evil.example.test`,
  );

  assert.equal(coordinator.getSnapshot().apiBaseUrl, SYNTHETIC_API_BASE);
});

test("supports cold-start, foreground, session restoration, and deduplicates repeated link delivery without auto-submitting", () => {
  let currentTime = 1_000;
  let fetchCount = 0;

  const coordinator = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    restoringSession: true,
    now: () => currentTime,
    fetchImpl: async () => {
      fetchCount += 1;
      return { status: 204 };
    },
  });

  // 1. Cold-start link arrives while session restoration is in progress
  const coldUrl = `https://www.adapenyu.com/account/accept-invitation?token=${SYNTHETIC_TOKEN_INVITE}`;
  const coldDelivery = coordinator.deliverColdStartLink(coldUrl);
  assert.equal(coldDelivery.accepted, true);
  assert.equal(coldDelivery.deduplicated, false);
  assert.equal(coordinator.getSnapshot().phase, "restoring_session");
  assert.equal(fetchCount, 0);

  // 2. Duplicate delivery within deduplication window is deduplicated
  currentTime += 1_500;
  const duplicateDelivery = coordinator.deliverForegroundLink(coldUrl);
  assert.equal(duplicateDelivery.accepted, true);
  assert.equal(duplicateDelivery.deduplicated, true);

  // 3. Session restoration finishes (no active user) -> displays screen in ready state without auto-submitting
  coordinator.completeSessionRestoration({ isSignedIn: false });
  const snapAfterRestore = coordinator.getSnapshot();
  assert.equal(snapAfterRestore.phase, "ready");
  assert.equal(snapAfterRestore.activeAction, "accept-invitation");
  assert.equal(snapAfterRestore.hasTokenInMemory, true);
  assert.equal(fetchCount, 0);

  // 4. Foreground delivery of the same active link while screen is open is deduplicated even after window
  currentTime += 10_000;
  const activeDuplicate = coordinator.deliverForegroundLink(coldUrl);
  assert.equal(activeDuplicate.accepted, true);
  assert.equal(activeDuplicate.deduplicated, true);

  // 5. Foreground delivery of a different action link switches screen without auto-submitting
  const confirmUrl = `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`;
  const switchDelivery = coordinator.deliverForegroundLink(confirmUrl);
  assert.equal(switchDelivery.accepted, true);
  assert.equal(switchDelivery.deduplicated, false);
  assert.equal(coordinator.getSnapshot().activeAction, "confirm-email");
  assert.equal(coordinator.getSnapshot().phase, "ready");
  assert.equal(fetchCount, 0);
});

test("requires explicit confirmation before leaving an existing signed-in session and never auto-signs out", async () => {
  let signOutCalls = 0;
  let apiCalls = 0;

  const coordinator = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    isSignedIn: true,
    signedInEmail: "ranger.synthetic@example.test",
    onSignOutCurrentSession: () => {
      signOutCalls += 1;
    },
    fetchImpl: async () => {
      apiCalls += 1;
      return { status: 204 };
    },
  });

  // Opening a link while signed in displays the session confirmation gate without signing out
  coordinator.deliverForegroundLink(
    `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`,
  );

  const initialSnap = coordinator.getSnapshot();
  assert.equal(initialSnap.phase, "confirm_leave_session");
  assert.equal(initialSnap.isSignedIn, true);
  assert.equal(initialSnap.requiresSessionConfirmation, true);
  assert.equal(signOutCalls, 0);
  assert.equal(apiCalls, 0);

  // Attempting to submit before confirming leaving the session is blocked
  const blockedSubmit = await coordinator.submit();
  assert.equal(blockedSubmit, null);
  assert.equal(apiCalls, 0);

  // User chooses to keep current session -> stays signed in and clears action token from memory
  coordinator.keepCurrentSession();
  const keptSnap = coordinator.getSnapshot();
  assert.equal(keptSnap.phase, "cancelled");
  assert.equal(keptSnap.isSignedIn, true);
  assert.equal(keptSnap.hasTokenInMemory, false);
  assert.equal(signOutCalls, 0);

  // Opening the link again and explicitly confirming leaving the current session
  coordinator.deliverForegroundLink(
    `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`,
  );
  assert.equal(coordinator.getSnapshot().phase, "confirm_leave_session");

  await coordinator.confirmLeaveCurrentSession();
  const unlockedSnap = coordinator.getSnapshot();
  assert.equal(signOutCalls, 1);
  assert.equal(unlockedSnap.isSignedIn, false);
  assert.equal(unlockedSnap.phase, "ready");
  assert.equal(unlockedSnap.hasTokenInMemory, true);
  assert.equal(apiCalls, 0);
});

test("enforces password policy (8-128 chars, letter, number, non-whitespace symbol, exact match) and never trims", () => {
  // Valid standard password
  assert.equal(inspectAccountPassword("Turtle#2026", "Turtle#2026").isValid, true);

  // Leading and trailing spaces are preserved and never trimmed
  assert.equal(inspectAccountPassword("  Turtle#2026  ", "  Turtle#2026  ").isValid, true);
  assert.equal(inspectAccountPassword("  Turtle#2026  ", "Turtle#2026").isValid, false);

  // Space alone does NOT count as a non-whitespace symbol
  const spaceOnlySymbol = inspectAccountPassword("Turtle 2026", "Turtle 2026");
  assert.equal(spaceOnlySymbol.symbolOk, false);
  assert.equal(spaceOnlySymbol.isValid, false);

  // Too short (<8) and too long (>128)
  assert.equal(inspectAccountPassword("Tu#1234", "Tu#1234").isValid, false);
  const max128 = "A1!" + "a".repeat(125);
  assert.equal(max128.length, 128);
  assert.equal(inspectAccountPassword(max128, max128).isValid, true);
  const over128 = max128 + "b";
  assert.equal(inspectAccountPassword(over128, over128).isValid, false);

  // Missing letter or missing number
  assert.equal(inspectAccountPassword("12345678!", "12345678!").letterOk, false);
  assert.equal(inspectAccountPassword("TurtlePass!", "TurtlePass!").numberOk, false);
});

test("sends public API requests without bearer credentials and handles 204 empty responses by showing login without auto-auth", async () => {
  const requests = [];
  const untrimmedPassword = "  ValidPass#2026  ";

  const scenarios = [
    {
      url: `https://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
      expectedEndpoint: `${SYNTHETIC_API_BASE}/api/v1/auth/reset-password`,
      expectedBody: {
        token: SYNTHETIC_TOKEN_RESET,
        new_password: untrimmedPassword,
        confirm_password: untrimmedPassword,
      },
      requiresPassword: true,
      revokesSessions: true,
    },
    {
      url: `https://www.adapenyu.com/account/accept-invitation?token=${SYNTHETIC_TOKEN_INVITE}`,
      expectedEndpoint: `${SYNTHETIC_API_BASE}/api/v1/auth/invitations/accept`,
      expectedBody: {
        token: SYNTHETIC_TOKEN_INVITE,
        new_password: untrimmedPassword,
        confirm_password: untrimmedPassword,
      },
      requiresPassword: true,
      revokesSessions: false,
    },
    {
      url: `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`,
      expectedEndpoint: `${SYNTHETIC_API_BASE}/api/v1/auth/confirm-email`,
      expectedBody: {
        token: SYNTHETIC_TOKEN_CONFIRM,
      },
      requiresPassword: false,
      revokesSessions: true,
    },
  ];

  for (const scenario of scenarios) {
    const coordinator = createAccountActionCoordinator({
      apiBaseUrl: SYNTHETIC_API_BASE,
      fetchImpl: async (input, init) => {
        requests.push({ input, init });
        return {
          status: 204,
          json: async () => {
            throw new Error("204 No Content has an empty body and must not be parsed as JSON");
          },
        };
      },
    });

    coordinator.deliverColdStartLink(scenario.url);
    if (scenario.requiresPassword) {
      coordinator.setPasswords(untrimmedPassword, untrimmedPassword);
    }

    const outcome = await coordinator.submit();
    assert.equal(outcome?.status, "success_204");

    const lastRequest = requests.at(-1);
    assert.equal(lastRequest.input, scenario.expectedEndpoint);
    assert.equal(lastRequest.init.method, "POST");
    assert.equal(lastRequest.init.credentials, "omit");
    assert.equal(lastRequest.init.cache, "no-store");
    assert.equal(lastRequest.init.referrerPolicy, "no-referrer");
    assert.equal("Authorization" in lastRequest.init.headers, false);
    assert.equal("authorization" in lastRequest.init.headers, false);
    assert.deepEqual(JSON.parse(lastRequest.init.body), scenario.expectedBody);

    const snap = coordinator.getSnapshot();
    assert.equal(snap.phase, "completed_login");
    assert.equal(snap.showLoginWithoutAutoAuth, true);
    assert.equal(snap.isSignedIn, false);
    assert.equal(snap.revokedAccountSessions, scenario.revokesSessions);
    assert.equal(snap.hasTokenInMemory, false);
    assert.equal(snap.hasPasswordsInMemory, false);
  }
});

test("handles 400, 409, 422, network errors, and 5xx responses with single-use safety and no auto-retry", async () => {
  // 1. 400 terminal invalid/expired/used token clears memory and blocks retry
  let calls400 = 0;
  const coord400 = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    fetchImpl: async () => {
      calls400 += 1;
      return { status: 400, json: async () => ({ detail: "Token has expired." }) };
    },
  });
  coord400.deliverForegroundLink(
    `https://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
  );
  coord400.setPasswords("Synthetic#123", "Synthetic#123");
  const res400 = await coord400.submit();
  assert.equal(res400?.status, "invalid_token_400");
  assert.equal(coord400.getSnapshot().phase, "terminal_error");
  assert.equal(coord400.getSnapshot().hasTokenInMemory, false);
  assert.equal(coord400.getSnapshot().hasPasswordsInMemory, false);
  assert.equal(await coord400.submit(), null);
  assert.equal(calls400, 1);

  // 2. 409 email conflict during confirm-email clears memory and blocks retry
  let calls409 = 0;
  const coord409 = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    fetchImpl: async () => {
      calls409 += 1;
      return { status: 409, json: async () => ({ detail: "Email already in use." }) };
    },
  });
  coord409.deliverForegroundLink(
    `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`,
  );
  const res409 = await coord409.submit();
  assert.equal(res409?.status, "email_conflict_409");
  assert.equal(coord409.getSnapshot().phase, "terminal_error");
  assert.equal(coord409.getSnapshot().hasTokenInMemory, false);
  assert.equal(await coord409.submit(), null);
  assert.equal(calls409, 1);

  // 3. 422 validation error preserves token so the user can fix password input and submit again
  let status422Or204 = 422;
  const coord422 = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    fetchImpl: async () => {
      if (status422Or204 === 422) {
        return {
          status: 422,
          json: async () => ({ detail: [{ msg: "Password rejected by server policy." }] }),
        };
      }
      return { status: 204 };
    },
  });
  coord422.deliverForegroundLink(
    `https://www.adapenyu.com/account/accept-invitation?token=${SYNTHETIC_TOKEN_INVITE}`,
  );
  coord422.setPasswords("ValidPass#1", "ValidPass#1");
  const res422 = await coord422.submit();
  assert.equal(res422?.status, "validation_error_422");
  assert.equal(coord422.getSnapshot().phase, "validation_error");
  assert.equal(coord422.getSnapshot().hasTokenInMemory, true);

  status422Or204 = 204;
  coord422.setPasswords("BetterPass#2026", "BetterPass#2026");
  const resRetryAfter422 = await coord422.submit();
  assert.equal(resRetryAfter422?.status, "success_204");
  assert.equal(coord422.getSnapshot().hasTokenInMemory, false);

  // 4. Network error never auto-retries single-use token and advises checking login first
  let networkAttempts = 0;
  const coordNet = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    fetchImpl: async () => {
      networkAttempts += 1;
      throw new Error("Socket hang up after request sent");
    },
  });
  coordNet.deliverForegroundLink(
    `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`,
  );
  const resNet = await coordNet.submit();
  assert.equal(resNet?.status, "ambiguous_failure");
  assert.equal(networkAttempts, 1);
  assert.equal(coordNet.getSnapshot().phase, "ambiguous_error");
  assert.equal(coordNet.getSnapshot().hasTokenInMemory, false);
  assert.match(coordNet.getSnapshot().recoveryGuidance ?? "", /single-use/i);
  assert.equal(await coordNet.submit(), null);
  assert.equal(networkAttempts, 1);
});

test("prevents duplicate concurrent submissions while a request is in flight", async () => {
  let fetchCalls = 0;
  let resolveFetch;

  const coordinator = createAccountActionCoordinator({
    apiBaseUrl: SYNTHETIC_API_BASE,
    fetchImpl: () => {
      fetchCalls += 1;
      return new Promise((resolve) => {
        resolveFetch = () => resolve({ status: 204 });
      });
    },
  });

  coordinator.deliverForegroundLink(
    `https://www.adapenyu.com/account/confirm-email?token=${SYNTHETIC_TOKEN_CONFIRM}`,
  );

  const firstSubmission = coordinator.submit();
  const duplicateSubmission = await coordinator.submit();

  assert.equal(duplicateSubmission, null);
  assert.equal(fetchCalls, 1);

  resolveFetch();
  const firstOutcome = await firstSubmission;
  assert.equal(firstOutcome?.status, "success_204");
  assert.equal(fetchCalls, 1);
});

test("browser fallback scrubs token from visible URL immediately and redacts tokens from logs/analytics", () => {
  clearBrowserTokenMemory();
  let replacedUrl = null;
  const locationMock = {
    pathname: "/account/reset-password",
    search: `?token=${SYNTHETIC_TOKEN_RESET}`,
    hash: "",
  };
  const historyMock = {
    replaceState(_data, _unused, url) {
      replacedUrl = url;
      locationMock.search = "";
    },
  };

  const consumed = consumeBrowserLocationToken(locationMock, historyMock);
  assert.equal(consumed.ok, true);
  if (consumed.ok) {
    assert.equal(consumed.token, SYNTHETIC_TOKEN_RESET);
  }
  assert.equal(replacedUrl, "/account/reset-password");
  assert.equal(locationMock.search, "");

  clearBrowserTokenMemory();

  const rawLog = `GET /account/reset-password?token=${SYNTHETIC_TOKEN_RESET} body={"token":"${SYNTHETIC_TOKEN_RESET}","new_password":"Secret!123","confirm_password":"Secret!123"}`;
  const redacted = redactAccountActionText(rawLog);
  assert.equal(redacted.includes(SYNTHETIC_TOKEN_RESET), false);
  assert.equal(redacted.includes("Secret!123"), false);

  const analyticsUrl = sanitizeUrlForAnalytics(
    `https://www.adapenyu.com/account/reset-password?token=${SYNTHETIC_TOKEN_RESET}`,
  );
  assert.equal(analyticsUrl, "https://www.adapenyu.com/account/reset-password");
});

test("serves apple-app-site-association with HTTP 200, application/json, actual signing IDs, and restricted paths", async () => {
  const response = createAasaResponse();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json");

  const payload = await response.json();
  assert.deepEqual(payload, APPLE_APP_SITE_ASSOCIATION);

  const details = payload.applinks.details[0];
  assert.ok(
    details.appIDs.includes(
      `${XCODE_SIGNING_CONFIG.applicationIdentifierPrefix}.${XCODE_SIGNING_CONFIG.bundleIdentifier}`,
    ),
  );
  assert.deepEqual(
    details.components.map((entry) => entry["/"]),
    [
      "/account/reset-password",
      "/account/accept-invitation",
      "/account/confirm-email",
    ],
  );
});
