# Existing test coverage

Use this map to find the regression checks relevant to an account action, scheduler,
backup, or session change.

| Test file | Checks |
| --- | --- |
| `tests/account-actions.test.mjs` | Universal Link validation, single-token constraints, cold-start/foreground/session-restoration coordinator & deduplication, signed-in session confirmation, untrimmed password policy, public API calls without bearer credentials, `204`/`400`/`409`/`422`/network handling, duplicate-submit prevention, URL token scrubbing, log redaction, and AASA response |
| `tests/calendar.test.mjs` | Six-week month grids, local date round trips, overnight meetings, end boundaries, and cancellations |
| `tests/schedule-backup.test.mjs` | Versioned export without account IDs, backup round trips, and rejection of malformed files, unsupported versions, unsafe links, duplicate IDs, and disconnected participants |
| `tests/schedule.test.mjs` | HTTPS meeting links, overlaps, editing, cancellation, restored data validation, and participant labels |
| `tests/schedule-storage.test.mjs` | Account-specific storage, retained anonymous preview data, and rejection of corrupt saved data |
| `tests/supabase-session.test.mjs` | Verified session handling, refreshed cookies, redirect cache headers, and protected calendar/meeting routes |

## Running the suite

The existing tests use Node's test runner. Use Node.js 22.18 or newer within the
project's pinned Node 22 major, with dependencies installed:

```bash
node --test tests/*.test.mjs
```

Run an individual file when investigating a failure:

```bash
node --test tests/schedule-storage.test.mjs
```

The storage tests simulate local storage and the session tests mock the Supabase
client. They do not prove that a real Google sign-in or deployment works. Use the
[manual UI checklist](manual-ui-checks.md) to review browser behavior, and record
fresh results when reporting validation.

## Account-action coverage limits

The account tests exercise TypeScript link parsing, request coordination, and
response helpers with synthetic tokens. The Universal Link cases describe the
expected account flow; they do not launch a signed iOS app or test Apple's link
association on a device. API response cases use simulated responses and do not
consume real password-reset, invitation, or confirmation tokens.

When changing account links, report Node suite results separately from browser
form checks, backend integration checks, and physical-device Universal Link
checks. Use the [account email-action checklist](manual-ui-checks.md#account-email-actions-and-ios-universal-links)
for the browser and device steps. A passing suite does not establish that a
production API or installed app accepts the links.

## Gallery coverage

The current Node suite has no gallery-specific tests. Lint, typecheck, and build
check the gallery's code, but do not exercise its search, mystery mode, profile
dialog, or shared URLs in a browser. Use the
[public turtle gallery checklist](manual-ui-checks.md#public-turtle-gallery)
when changing gallery records, photographs, or interactions.
