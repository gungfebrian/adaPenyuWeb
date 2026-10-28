<div align="center">

<img src="public/Logo/Icon-iOS-Default-1024x1024@1x.png" alt="AdaPenyu" width="88" />

# AdaPenyu

**Every turtle’s story starts with recognition.**

An ocean-inspired website introducing photo-based sea turtle identification.

[**Visit www.adapenyu.com**](https://www.adapenyu.com)

![Next.js](https://img.shields.io/badge/Next.js-16-00263c?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-30526b?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-133045?style=flat-square&logo=tailwindcss&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-13-30526b?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3-133045?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Git_deployments-00263c?style=flat-square&logo=vercel&logoColor=white)

</div>

![AdaPenyu website preview](docs/images/adapenyu-desktop.png)

## The experience

The site follows a turtle’s story: the identification problem, how facial patterns
can help, the prototype, and the people behind it.

- Layered ocean artwork, swimming turtles, coral sway, and scroll reveals.
- Desktop story sequences with native sticky scrolling; a linear composition on mobile.
- Phone previews that separate as you scroll on larger screens; a swipeable carousel
  with buttons and keyboard controls below 768px.
- A centred mobile navbar with an animated dropdown, member profile dialogs,
  and an animated FAQ.
- Tap the hero's AdaPenyu app icon to open the three original prototype screenshots.
  The popup offers a phone carousel on mobile and a three-screen view on larger displays.
- Keyboard navigation, visible focus states, and a static alternative for reduced motion.

## Design language

The visual system pairs a clean reading layout with playful marine illustrations.
Depth comes from overlapping SVG layers and gradual color changes.

| Color | Role |
| --- | --- |
| `#00263C` | Brand navy, navigation, primary actions |
| `#30526B` | Supporting text and blue accents |
| `#133045` | Deep ocean chapters |
| `#051320` | Ocean floor |
| `#FFFFFF` / `#F3F4F5` | Open space and quiet surfaces |

**Typography:** DM Sans for body and navigation, Manrope for supporting copy,
and DynaPuff for expressive headings. Tailwind utilities define responsive layouts;
shared theme tokens live in `globals.css`.

## Architecture

```text
src/
├── app/
│   ├── (marketing)/        Landing route and brand fonts
│   ├── (workspace)/        Turtle prototypes, login, calendar, and meetings
│   ├── auth/               OAuth callback and code exchange
│   └── api/                Re-identification endpoint placeholder
├── features/
│   ├── marketing/          Sections, artwork, content, and scroll sequences
│   ├── auth/               Google sign-in and sign-out actions
│   ├── schedule/           Calendar, meeting editor, and local storage adapter
│   ├── turtles/            Turtle types, UI, and repository interface
│   └── re-identification/  Upload UI, match types, and model service interface
├── components/             Shared UI and motion helpers
├── utils/supabase/          Browser/server clients and session refresh
├── proxy.ts                Session refresh on protected workspace routes
└── lib/                    Motion settings and site configuration
public/images/              Supplied SVG artwork and ocean-layer metadata
public/icons/               Versioned AdaPenyu browser and touch icons
```

**Motion** handles interface transitions. **GSAP ScrollTrigger** handles coordinated
scroll sequences and ocean depth. Separate wrappers keep idle animation independent
from scroll movement; decorative loops pause offscreen and in hidden tabs.

Domain types and server adapter interfaces keep future storage and model integration
separate from the presentation layer. GitHub pushes to `main` deploy through Vercel.

### Mobile interaction guide

Open the centred navigation button to reveal the chapter links. Escape closes the
dropdown and returns focus to the button; selecting a chapter moves to that section.

The phone carousel supports swiping, previous/next buttons, and direct slide selection.
With the carousel focused, use Left/Right to change slides or Home/End to reach the
first/last screen. It never advances automatically and respects reduced motion.
The hero screenshot popup starts at the first screen each time it opens. Escape or
the close button dismisses it and returns focus to the app icon.

## Run locally

Requires Node.js 22 and pnpm 10.34.6 (pinned in `package.json`).

```bash
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Available checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Deployment

Pushes to `main` trigger the connected Vercel production build. The package manager
and Node major are pinned in `package.json`.

When adding a dependency, use `pnpm add` and commit both `package.json` and
`pnpm-lock.yaml`. Before publishing, the dependency installation should also work
with `pnpm install --frozen-lockfile`. An `ERR_PNPM_OUTDATED_LOCKFILE` failure means
the manifest and lockfile need to be synchronized and committed together.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the
Vercel environments that serve the authenticated workspace. Deploy again after
changing these values so the browser bundle receives the updated configuration.

## Project status

| Route | Purpose | Current access / state |
| --- | --- | --- |
| `/` | Ocean story and prototype presentation | Public |
| `/penyuGallery` | Turtle photo gallery with filters and profile details | Public; `/penyu-gallery` redirects here |
| `/login` | Google sign-in and post-action sign-in notices | Signed-in visitors return to the calendar |
| `/account/reset-password` | Account password reset email-action fallback | Public; requires one-time email token |
| `/account/accept-invitation` | Ranger invitation & owner setup email-action fallback | Public; requires one-time email token |
| `/account/confirm-email` | Account email confirmation fallback | Public; requires one-time email token |
| `/.well-known/apple-app-site-association` | iOS Universal Links association manifest | Public JSON (`200 OK`, no extension) |
| `/schedule` | Calendar and meeting editor | Verified sign-in required |
| `/meetings` | Searchable meeting list | Verified sign-in required |
| `/identify` | Photo identification preview | Upload and matching are not connected |
| `/turtles` | Turtle catalogue preview | Data source is not connected |

The public website and frontend interactions are implemented. The turtle workspace
is a prototype: uploads, model inference, persistence, and identity review await
integration. The API currently returns `501`; the contact form opens an email draft
in the visitor's email app and offers optional local draft storage with a delete action.
The marketing page does not publish an accuracy figure until the model has a
documented, independently reproducible evaluation.

### Account email actions and iOS Universal Links

The website hosts the iOS Universal Links association file at
`https://www.adapenyu.com/.well-known/apple-app-site-association` (`HTTP 200`,
`Content-Type: application/json`, no filename extension, no redirects) for
`7Y44BM6QU8.com.ADA.ADA-Penyu` and `35SGY39Y8Z.com.ADA.ADA-Penyu`, restricted to:

- `/account/reset-password` → `POST /api/v1/auth/reset-password`
- `/account/accept-invitation` → `POST /api/v1/auth/invitations/accept`
- `/account/confirm-email` → `POST /api/v1/auth/confirm-email`

Set `NEXT_PUBLIC_API_BASE_URL` in each web environment (kept separate from
`https://www.adapenyu.com`) and `AUTH_ACTION_BASE_URL=https://www.adapenyu.com/account`
on the backend API. Each `/account/*` page reads `?token=...` into memory, scrubs it
immediately from the browser URL via `history.replaceState`, serves `Cache-Control: no-store`
and `Referrer-Policy: no-referrer`, requires explicit submission without bearer
credentials, prompts before leaving an active signed-in session, and directs users
to sign in after `204 No Content` without automatic authentication.

Maintained by [Gung](https://github.com/gungfebrian).

## Contributor guides

- [Preparing a change](CONTRIBUTING.md)
- [Updating marketing content](docs/marketing-content.md)
- [Manual UI checks](docs/manual-ui-checks.md)
- [Existing test coverage](docs/test-coverage.md)

## Turtle gallery

Open `/penyuGallery` to browse the public photo collection. Search by turtle name
and filter by sighting year; **Reset filters** restores the full collection.
Mystery mode starts with names hidden. Use **Reveal name** on a card or inside its
profile, or turn mystery mode off to show every name. Turning it back on clears
the revealed names.

Open a card to compare left and right facial profiles across its dated sightings.
The profile includes post-ocular scale counts and expandable identification codes.
Use the previous/next buttons or Left/Right arrow keys to browse turtles, and
Escape to close the profile.

Search, year, and the open profile are stored in the URL as `q`, `year`, and
`turtle`, so you can copy the current link. Mystery mode, revealed names, and the
selected sighting reset on reload. Photo ownership and the dataset usage link
appear under **Photo credits** on the gallery page.

## Meeting scheduler

Visit `/schedule` or choose **Calendar** in the site navigation. Google login is required.
The navbar has two sections: **Calendar** (`/schedule`) and **Meetings** (`/meetings`).
Meetings shows the same account’s saved meetings as cards with dates, times,
participants, status, and video-call links. Search by title, person, or notes;
sort by date (oldest/newest) or title (A–Z). Filter by All, Upcoming, Past, or
Cancelled, and use Reset to clear the search, filter, and sort. Open
details to edit, cancel, or delete a meeting without leaving the list. Both routes
require verified login.

The calendar opens in month view. Click a date to see its hourly timeline, then
click a half-hour slot to add a meeting. A compact inspector holds the title,
participants, duration, and existing HTTPS video-call link. Add professors,
doctors, or friends inside the inspector, and select one or more participants.

Click a meeting to edit it, open its call link, cancel it, or delete it. Deletion
requires confirmation and offers Undo for the most recent deletion while you stay on the page.
Undo rejects a restored scheduled meeting if its time has since been occupied. The toolbar switches
between month and day, navigates dates, and returns to today. Cancelled meetings
can be shown with the sidebar checkbox or mobile footer control. The interface
uses AdaPenyu’s light ocean identity: DM Sans, a navy wordmark/navigation bar,
the existing organic background pattern, and pale blue calendar surfaces. The
calendar stays light in either device appearance and stacks on mobile. Overlapping
meetings in the organizer’s agenda are rejected. Dates use the device timezone;
timestamps remain UTC. Arrow keys navigate calendar dates; Escape closes details.

This is a local preview. Data is saved under `adapenyu-schedule-v1:<user-id>` in this browser’s
local storage, using a separate key for each verified account. Existing anonymous
preview data is retained but is not automatically assigned to a signed-in user.
It does not send invitations, check participant calendar availability, or create
Google Meet links.

### Data continuity

- Each account's meetings are stored in this browser, not synchronized across devices.
- Signing out does not delete the saved schedule; signing back into the same account
  in the same browser restores it.
- Clearing the site's browser storage removes its local meeting data. Download a
  JSON backup from the calendar or meeting list before clearing browser data;
  the file contains meeting links, notes, and participant names, so keep it private.
- Restore a backup from the calendar or meeting list to replace the local schedule
  for the currently signed-in account. Validation checks record IDs and meeting
  participants before asking for confirmation. It does not sync with other browsers.
- The preview has no server backup or account sync.

Supabase browser/server clients live in `src/utils/supabase/`. Next.js 16's
`src/proxy.ts` refreshes sessions on auth and schedule routes; the schedule page
also verifies claims on the server. Sign-in uses Google's OAuth flow with a PKCE
code exchange at `/auth/callback`. Sign-out uses a server action. The public
landing page does not require login.

### Enable Google sign-in

1. Copy `.env.example` to `.env.local` and replace both placeholders with your
   Supabase project URL and publishable key. `.env.local` is ignored by Git and
   is not included when cloning this repository.
2. In Supabase **Authentication → Sign In / Providers → Google**, enable Google
   and enter the Google OAuth client ID and secret.
3. In Google Cloud, add your Supabase project's authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`.
4. In Supabase **Authentication → URL Configuration**, add
   `http://localhost:3000/auth/callback` and your deployed site's `/auth/callback`
   URL to the redirect allowlist. Set the Site URL to the deployed site.
5. Set the two public environment variables in the hosting environment as well.
   Restart the dev server after environment changes.

The login page checks Google provider availability and disables sign-in while the
provider is unavailable. No Google secret belongs in a `NEXT_PUBLIC_` variable.

Meeting data still needs database integration. Replace
`src/features/schedule/storage.ts` with authenticated Supabase queries once the
tables exist, and protect all rows with owner-based RLS. Browser storage provides
local previews, not a database authorization boundary. Calendar/Meet creation and
attendee invitations require separate Google API permissions beyond sign-in.
The sample `todos` query was not added because this app has no `todos` feature.

Run scheduler validation checks with Node.js 22.18+:

```bash
node --test tests/*.test.mjs
```
