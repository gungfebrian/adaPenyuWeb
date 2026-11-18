# Manual UI checks

Use this checklist after an interactive or visual change. Record browser, viewport,
route, and result for each check you perform. These are review steps, not recorded test results.

## Page metadata and crawler responses

Use the [metadata source map](marketing-content.md#page-metadata-and-crawler-settings)
to compare the rendered output with the intended configuration.

- Open `/`, `/penyuGallery`, and `/docs/client-data-integration`. Check each
  browser title and inspect the response HTML for its description. The gallery
  description should match the collection counts when records change.
- On `/`, check the canonical link, Open Graph tags, and Twitter preview tags.
  Confirm `/og-preview.png` loads and its actual dimensions match the homepage's
  declared image dimensions. Report social-platform preview checks separately;
  inspecting HTML does not verify a platform's cached preview.
- Request `/sitemap.xml`. Confirm it lists the production homepage,
  `/penyuGallery`, and `/docs/client-data-integration`. Check the guide’s canonical
  URL and confirm the sitemap excludes the `/penyu-gallery` alias and account-action URLs.
- Request `/robots.txt`. Check the sitemap URL and the `/api/`, `/auth/`, and
  `/account/` exclusions against `src/app/robots.ts`.
- Request `/account/confirm-email` without a token and check the response header
  `X-Robots-Tag: noindex, nofollow`. Record which environment served the response;
  a local check does not establish the deployed configuration.

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

### Client data integration guide

- Open **Docs** from the desktop header, expanded menu, and mobile menu.
  Confirm the guide opens while signed out and the menu fits at 1024px.
- In **Manage access**, check the screenshot’s alt text, the redacted key
  prefix and issue time, and the full-size screenshot link.
- Request `/llms.txt` and follow its Markdown guide link. Check the response
  content type, the HTML guide’s alternate link and discovery header, and
  compare the curl and JSON examples in both formats.
- From **API reference**, open a list endpoint, a photo download, and an owner
  key operation. Check the method, authentication header, parameters, status
  codes, expandable schema fields, and request and response examples against
  the linked OpenAPI document.

### Contact drafts

Use disposable contact details and leave any opened email draft unsent.

- Submit with required fields empty or an invalid email address; check that the
  browser prevents submission. Organization should remain optional.
- Enter a message containing `&`, `?`, and line breaks, then choose **Open email
  to send**. Check the recipient, subject, and decoded message in the email app.
  The website should ask you to send it there, without claiming delivery.
- Choose **Save draft**, reload, and confirm the fields start empty. Choose
  **Restore saved draft** and compare all four fields with the saved text.
- Choose **Delete saved draft** and confirm the current text remains visible.
  Reload and try restoring again; check the message that no saved draft was found.
- If browser storage is blocked, try saving and restoring. Check that readable
  status messages explain the failure and that the form remains usable.

## Public turtle gallery

- Open `/penyuGallery` while signed out. Check both a narrow mobile viewport and
  a desktop viewport for readable controls, uncropped profile photos, and overflow.
  Confirm `/penyu-gallery` redirects to `/penyuGallery`.
- Search for a known turtle, then combine the search with a sighting year. Check
  the result count and use **Reset filters** to restore the collection.
- Search for a name that is absent. Check the empty state and use **View all
  turtles** to recover.
- With mystery mode on, reveal a name on a card and confirm its profile shows the
  same name. Turn mystery mode off and back on; check that revealed names reset.
- Open a profile with the keyboard. Check that focus starts on its close button,
  Tab stays inside the dialog, and Escape closes it and restores the opener's focus.
- Use the previous/next controls and Left/Right arrow keys. Check that navigation
  follows the filtered results and wraps at either end; with one result, both
  navigation buttons should be disabled.
- Switch between dated sightings and compare both facial profiles, scale counts,
  and expandable identification codes. Check that changing turtles starts at its
  first sighting.
- Copy a filtered URL with a profile open and reload it. Confirm the search, year,
  and profile return, while mystery mode starts with names hidden.
- Open `/penyuGallery?year=invalid&turtle=missing`. Confirm the gallery removes
  the invalid parameters and remains usable.
- Open `/penyuGallery?q=Calvin&turtle=green-adelotte`. Confirm the linked Adelotte
  profile remains viewable even though it is outside the Calvin search results.
- Follow **Photo credits** and check that the ownership text and dataset usage
  link remain available. Repeat the controls check with reduced motion enabled.

### Gallery layout review

- At mobile, tablet, and desktop widths, check the hero heading, year badge,
  paired photographs, and decorative turtle for overlap. Both facial profiles
  should remain fully visible inside their frames.
- Check that **Explore gallery** reaches the collection heading and **Photo
  credits** reaches **Behind the photographs**, with neither target hidden under
  the navigation bar.
- Compare the hero's turtle count, photograph count, and sighting year range with
  `src/features/penyu-gallery/data/turtles.json`. The collection heading should
  show the same total turtle count even while search results are filtered.
- At narrow widths, check that the search field, year selector, and mystery-mode
  button fit without horizontal scrolling. Check visible keyboard focus on each
  control and on both hero links.
- At the bottom of the page, check that the home wordmark and contact email remain
  readable and usable when the footer wraps onto multiple lines.

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
