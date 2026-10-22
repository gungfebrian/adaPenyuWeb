# Manual UI checks

Use this checklist after an interactive or visual change. Record browser, viewport,
route, and result for each check you perform. These are review steps, not recorded test results.

## Public landing page

- Check a narrow mobile viewport and a desktop viewport for clipped text, overlapping
  artwork, and horizontal page overflow.
- Open the mobile menu with the keyboard. Close it with Escape and confirm focus
  returns to its button; select a chapter and check the landing position.
- Open the hero screenshot popup, close it, and reopen it. Check that it starts at
  the first screen and that closing returns focus to the app icon.
- On mobile, swipe the phone carousel and use its controls. With the carousel
  focused, check Left/Right and Home/End navigation.
- Open a team profile and verify its name, role, and optional links. Close with
  Escape and confirm keyboard focus returns to the selected portrait button.
- Enable reduced motion in the device or browser settings and reload. Confirm
  content remains readable and decorative movement is static.

## Authenticated scheduler

Use a test account and disposable meetings. Follow the [sign-in setup](../README.md#enable-google-sign-in) first.

- Signed out, open `/schedule` and `/meetings`; confirm each leads to login.
- Signed in, create a meeting and find it on both routes. Refresh and confirm it remains.
- Try an overlapping meeting, then an adjacent slot. Check that only the overlap is rejected.
- Edit, cancel, and delete a meeting. Check the most recent deletion's Undo action.
- Sign out and back into the same account in the same browser; confirm its schedule returns.
- Download a backup and verify that its JSON contains the saved meetings and participants.
- Restore that backup in a disposable test account. Confirm that the preview lists the
  replacement count, cancelling keeps current data, and confirming replaces it.
- Try an unrelated or malformed JSON file; confirm the saved schedule stays intact.
- Try a backup with duplicate meeting IDs or a meeting participant missing from the
  participant list; confirm restore is rejected and the saved schedule stays intact.
- Open the same schedule in two tabs. Save a change in one, then try to save stale
  changes in the other; confirm the second tab asks for a reload and keeps the first change.

Check with a second test account when reviewing account isolation. Local meeting
data is browser-specific, so another browser is not expected to contain the same schedule.

## Account email actions and iOS Universal Links

- Request `/.well-known/apple-app-site-association` and verify it returns HTTP `200`,
  `Content-Type: application/json`, no redirect, and matches only `/account/reset-password`,
  `/account/accept-invitation`, and `/account/confirm-email`.
- Open `/account/reset-password?token=synthetic_test_token`, `/account/accept-invitation?token=synthetic_test_token`,
  and `/account/confirm-email?token=synthetic_test_token`. Verify that `?token=...` is
  immediately removed from the browser address bar and that no network request is sent
  until the submit button is pressed.
- Open `/account/reset-password` without a token or with duplicate `?token=a&token=b`
  parameters; confirm the form is disabled and displays recovery guidance.
- While signed in, open `/account/confirm-email?token=synthetic_test_token`; confirm
  the page asks for explicit confirmation before leaving the active session.
- On a physical iOS device with a signed build (`applinks:www.adapenyu.com`), tap each of
  the three `https://www.adapenyu.com/account/*?token=...` links from Mail or Notes to
  verify Universal Link routing into the AdaPenyu app.
