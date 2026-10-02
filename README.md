# AdaPenyuWeb

A Next.js and TypeScript scaffold for turtle photo re-identification.

## Status

The home page implements the supplied AdaPenyu Figma landing design with local
artwork, shared brand colors, reusable buttons, and a responsive menu. The turtle
workspace provides typed contracts and placeholder pages. Uploads, inference, persistence, and identity review are not connected.
The placeholder POST endpoint returns HTTP 501.

This scaffold extends the existing Next.js 16.3.8 and Tailwind CSS 4 project.

## Local setup

Use Node.js 20.9 or newer. From this folder:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

The available checks are:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Keep `pnpm-lock.yaml` in version control when updating dependencies.

## Where to start

- [design.md](design.md): folder map, architecture decisions, and developer boundaries.
- [docs/stakeholder-overview.md](docs/stakeholder-overview.md): plain-language scope and proposed workflow.
- [CLAUDE.md](CLAUDE.md): local guidance for coding assistants.
- `src/app`: pages and API entry points.
- `src/features`: turtle records and re-identification components and types.

Markdown files are ignored by default. Already tracked documentation remains tracked.
`handover.md` and `handoverpriv.md` are explicitly ignored local progress notes;
they are not included in commits or deployments.

## Landing page

The supplied Figma composition is implemented at `/`, including the story, three
identification steps, three prototype screens, progress, team, contribution, and
contact sections. The hero uses the original app icon and wordmark without the grey box, framed by the supplied layered ocean reef. The Explore prototype link is removed. The logo and navigation share
one floating block with a mobile dialog. Link hovers use a single label and
underline, avoiding duplicate text during transitions.

Motion handles section reveals, small button responses, navigation transitions,
and member profile dialogs. GSAP ScrollTrigger handles the longer story,
identification, and prototype scroll sequences. The story and steps use native sticky positioning so the browser owns scrolling.
The steps use a short hold with direct scroll response. Phone screens start stacked
behind the centre phone, then separate into the three original positions during
natural scrolling, with an independent cursor-hover lift. There is no phone pinning
or delayed scrub. The story sheet follows the full-height hero without covering its reef. Its rounded
corners settle as it enters the viewport, without scaling the page or exposing a background gap. Reduced motion uses static
content. Styling uses Tailwind utilities; global CSS contains Tailwind configuration
and theme tokens.

Contact saves and restores a local draft; it does not send email. App screens and
the >90% figure are supplied design content; inference is not connected or
independently measured.

- `src/app/(marketing)`: landing route and brand fonts.
- `src/app/(workspace)`: existing turtle workspace pages and layout.
- `src/features/marketing/sections`: section components styled with Tailwind utilities.
- `src/features/marketing/components`: adaptive header, scene wrapper, profile dialogs, contact form, and artwork helpers.
- `src/features/marketing/motion`: feature-specific GSAP sequences and chapter navigation.
- `src/features/marketing/data/team.ts`: supplied member details; optional bios, LinkedIn URLs, and member IDs appear only when populated.
- `src/components/motion`: reusable Motion reveals and button response.
- `src/features/marketing/landing-page.tsx`: assembles the story chapters.
- `src/app/globals.css`: Tailwind theme colors and typography tokens.
- `src/components/ui/button.tsx`: reusable primary and secondary buttons.
- `public/images/marketing`: SVG components; the background patterns contain traced vector paths, while bitmap artwork is embedded in SVG containers.
- `design-assets/marketing-originals`: preserved legacy source artwork, outside the public bundle.

## Frontend audit progress — 2026-10-01

This pass incorporates the owner's visual audit corrections. Production is served at https://ada-penyu-web.vercel.app. GitHub main is the
automatic production-deployment branch.

- The compact desktop navbar expands on pointer hover and keyboard focus.
- Its background, logo, and single rendered labels split white/navy at section boundaries.
- Identification steps use brand navy headings and blue body copy.
- Member portraits have no arrow badges; names and profile titles use DM Sans.
- Pointer focus restored after a profile closes has no outline. Keyboard focus stays visible.
- FAQ uses the supplied screenshot's rounded rows, real answers, and a contact shortcut.
- The original banner turtle and its original placement are preserved. It floats while
  visible without any cursor-hover effect; offscreen and hidden-tab loops pause.
- Only artwork2 is added beside the team heading, using separate reveal and idle
  wrappers. Artwork1 and artwork3 placements were reverted at the owner's request.
  All PNG sources remain unchanged; citizens-turtle.svg embeds artwork2 and is
  not traced vector artwork.
- Motion is disabled for reduced-motion preferences; text does not receive 3D tilt.

For the complete local progress, fixes, limitations, and next steps, read
`handover.md`. Operational continuation details are in `handoverpriv.md`.

### Remaining product work

Uploads, AI inference, shared catalogue persistence, identity review, authentication,
and contact delivery are not implemented. Member bios, LinkedIn links, and IDs need
real supplied details. The illustrated headings and some artwork remain raster data
inside SVG containers. The design's accuracy figure is not an independently verified result.
Vercel is linked to gungfebrian/adaPenyuWeb, with main as the production branch
and automatic deployments enabled. Production deployment follows authorized pushes to GitHub main.

### Hero and catalogue experiment — 2026-10-02

The grey prototype tile was replaced with HeroTurtleScene: custom SVG water layers,
the original turtle illustration, gentle idle motion, and a small desktop pointer
response. No Three.js dependency was added. The original turtle by the satellite
message retains automatic movement only, with no cursor-hover effect.

Phone screens start as one visible centre phone with the side screens behind it.
Scrolling fans the side screens into their supplied three-screen arrangement.
Hover lifts the inner image wrapper independently. Reduced motion shows all three
screens without animation. Latest lint and production build pass; local review
includes phone stacking/spread, hover, pointer/keyboard dialog close, mobile layout,
and reduced motion. The experiment incorporates owner feedback and is included in this source release.

- Programmatically focused story chapters no longer show a browser outline around
  the full page. This applies to section containers; interactive keyboard controls
  keep their own visible focus styles.

### Final owner corrections

The experimental blue-filled ocean panel was removed. The hero now uses a
transparent stage over the original traced pattern and subtle SVG strokes in the
existing secondary brand color. Both Explore prototype and Explore the catalogue
buttons were removed at the owner's request. Artwork1/artwork3 remain unused;
the original satellite-message turtle retains automatic idle motion only.

GitHub source publication was requested on 2026-10-02. Private/local progress notes
remain ignored. Vercel now follows GitHub main through its repository integration.

## Previous correction — original hero restored (superseded)

The owner requested the original grey hero box. Its app icon, wordmark, dimensions,
and surface color are restored. The experimental turtle/water scene and its motion
code were removed. Explore prototype and Explore the catalogue remain removed,
and the phone separation and original satellite-message turtle's idle loop remain.
This correction supersedes the earlier hero experiment described above.

## GitHub deployment workflow

Vercel project `ada-penyu-web` is linked to `gungfebrian/adaPenyuWeb`. Automatic
deployments are enabled and `main` is the production branch. A push to `main`
triggers a Vercel build and production deployment; other branch pushes use previews.
The repository connection was added after the earlier manual release, so that
older CLI deployment was not proof that the Git integration was working.

The rejected homemade turtle/water hero experiment remains removed. Both Explore buttons remain removed.

## Current hero — supplied ocean artwork, 2026-10-02

The latest owner request removes the grey box and keeps the original app icon and
wordmark. The icon floats gently, lifts on hover, and wiggles when clicked or tapped.
Its button hit area stays stationary while the artwork moves.

The supplied ocean-reef.svg is reconstructed from its detached SVG elements, using
positions.json to preserve composition, paths, gradients, and colors. Four wave/reef
groups scroll at different depths; individual seaweed and coral sway slightly.
Supplied bubbles float beside the hero and phone sequence, and the low-wave collection
adds depth to the footer. Mobile uses less parallax; all new motion is disabled for
reduced motion. Idle loops pause offscreen and while the document is hidden.

Source artwork lives in public/images/Screen; rendering is in
src/features/marketing/components/ocean-artwork.tsx and hero-logo.tsx. Styling uses
Tailwind, with SVG canvas positions derived from the supplied asset metadata.
No new animation package or custom CSS was introduced.

The owner retained the original hero typography, spacing, logo dimensions, and reef
height after rejecting the shorter-viewport sizing experiment. The marked small
coral and distant reef fragments are omitted from the hero; the single large right
coral remains. Source SVG files and the footer composition are preserved.

The second section, The Story Behind It, currently previews the supplied
deep-ocean-background.svg with the existing background parallax and story sequence.
The original story-pattern asset remains available.

The malformed frontend team-member name was restored to its last valid value,
fixing the page compilation error without changing other supplied member details.

## Full-height hero and motion across chapters — 2026-10-02

The hero now has a 100svh minimum height. Removed the next chapter's negative margin,
which had hidden the bottom 48–80px of the reef. The story retains its rounded sheet
transition with a deep-ocean corner backdrop.

Bubbles now rise independently with staggered phases instead of moving as one cluster.
Desktop pointer movement nudges a separate inner wrapper; clicking/tapping the logo
adds a small bubble ripple. Absolute SVG pivots keep coral rooted at its base and
bubble scaling centered on each circle.

The supplied current bands drift behind the story, complement message, and contact
panel. Step-circle artwork moves independently from its number and reveal wrapper;
comparison photos enter as the progress scene comes into view. Footer plants sway.
All loops share one visibility observer, pause offscreen/hidden, and disappear from
the motion setup under reduced motion. No dependencies or custom CSS were added.

LottieFiles MCP was attempted but reported no connected Creator tab; the website
uses the existing SVG assets and GSAP runtime for these effects.
