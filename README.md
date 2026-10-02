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
- `src/features/marketing/data/team.ts`: supplied member details; nullable bios, member IDs, LinkedIn/Instagram URLs or handles, and extra links appear only when populated.
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
- Identification steps use white artwork and copy on the revised ocean background.
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
`handover.md`. Operational continuation details are in `handoverpriv.md`. The newest standalone agent handover is `docs/AGENT_HANDOVER.md` (local and ignored).

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
positions.json to preserve composition, paths, gradients, and colors. Wave/reef
groups scroll at different depths; individual seaweed and coral sway slightly.
Supplied bubbles float beside the hero and phone sequence. Low-wave footer source
assets remain available, but the footer uses its original static pattern. Mobile
uses less parallax; all new motion is disabled for
reduced motion. Idle loops pause offscreen and while the document is hidden.

Source artwork lives in public/images/Screen; rendering is in
src/features/marketing/components/ocean-artwork.tsx and hero-logo.tsx. Styling uses
Tailwind, with SVG canvas positions derived from the supplied asset metadata.
No new animation package or custom CSS was introduced.

The owner retained the original hero typography, spacing, logo dimensions, and reef
height after rejecting the shorter-viewport sizing experiment. The marked small
coral and distant reef fragments are omitted from the hero; the single large right
coral remains. Source SVG files are preserved.

The second section, The Story Behind It, now uses one solid ocean color (#133045)
matching the hero's frontmost wave. That wave extends below its baseline and moves
upward independently to keep the transition continuous; the story's top shadow and
pattern/current overlays are removed. The original story-pattern and supplied
deep-ocean-background.svg remain available after the earlier background preview.
Hero parallax is more visible and stays active at full strength in shorter laptop
windows, while story pinning still requires a taller viewport. Hero sizing remains
as originally designed; reduced motion disables the scroll effects.

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

The supplied current bands remain behind the complement message. Step-circle
artwork moves independently from its number and reveal wrapper; comparison photos
enter as the progress scene comes into view. Contact and footer keep the original
static pattern, with the added current/wave/plant layers removed per the owner.
All loops share one visibility observer, pause offscreen/hidden, and disappear from
the motion setup under reduced motion. No dependencies or custom CSS were added.

LottieFiles MCP was attempted but reported no connected Creator tab; the website
uses the existing SVG assets and GSAP runtime for these effects.

## Contact and footer — original artwork restored, 2026-10-02

Contact retains its original layout and pattern without added ocean layers or
background parallax. The footer follows the supplied reference: AdaPenyu logo,
© 2026 AdaPenyu. All rights reserved., and adapenyu@gmail.com as a plain email link.
It uses the original static pattern and a single desktop row that stacks on mobile.


## Revised ocean chapters and responsive canvas — 2026-10-02

The supplied second/third-screen revision is being implemented in phases. This
release applies the revised #133045 ocean background and white/off-white step
artwork/copy, enlarges the existing story SVG heading, and fixes responsive sizing.
The new left-stacked “Three / steps / only” layout remains the next design phase.
The “Turtle ID does NOT replace tags or satellites” section retains its existing
markup, artwork, typography, and placement.

Section backgrounds span the available page width. Their reading/composition
canvas remains capped at 1512px, keeping container-unit typography bounded.
LandingMotion measures the available document width to exclude desktop scrollbars.
Shared outer gutters use clamp(24px, 5.3vw, 80px), including the navbar, hero,
community sections, progress, and footer. The latest audit aligns community and
FAQ containers with progress; paragraph widths remain limited for reading.

Hero sizing below 1920px remains unchanged. At 1920px and wider, headline/body
sizes grow within caps of 80px/45px, the app icon is 200px, and the wordmark is 260px.
The tall-screen top spacing grows with viewport height. The reef remains full bleed.
The desktop step list shares the available viewport height across three rows, with
minimum readable tablet font sizes instead of shrinking below the mobile sizes.

The new step-circle white fill and arrow are unchanged owner-provided SVG exports.
The circle fill is masked with the existing hand-drawn circle silhouette. A separate
frontmost-wave copy matches the revised ocean color; original source SVGs remain.

This release passed pnpm lint and pnpm typecheck. Manual browser review covered
390×844, 768×1024, 1440×720, and 2560×1440, including visible step copy, the short
viewport's final step, full-width backgrounds, and large-screen hero gutters.
These spot checks are not a claim of testing every browser or device. Read
`docs/AGENT_HANDOVER.md` for the release hashes, deployment state, constraints,
source references, and prioritized remaining work.


## Page 2 — real heading text and swimming turtle, 2026-10-02

The story heading now uses the existing DynaPuff display font as real HTML text,
matching the other section headings. The original story-title.svg remains preserved
as source artwork but is no longer rendered on page 2. The original banner-turtle
artwork is reused beneath the heading, with a gentle automatic swimming loop and
a separate desktop scroll drift. Motion pauses offscreen/hidden and becomes static
under reduced motion. The existing tags/satellites banner is unchanged.


## Latest pages 2/3 ambience — 2026-10-02

The story and three-step chapters now use layered deep-ocean scenery. This
supersedes the earlier solid-only story background. The owner preferred the
hero's simpler silhouettes over the densely shaded coral/rock preview.

- Muted reef contours come from the newly supplied detached `More` collection.
- Seaweed and coral reuse the hero's original SVG silhouettes; four restrained
  solid-color silhouettes come from `Screen/Secondpages`.
- Soft currents and bubbles reuse the existing ocean helpers. The steps end in
  the original three flat wave layers, rather than the tonal traced wave.
- Separate wrappers own scroll depth and gentle plant sway. Mobile movement is
  reduced; offscreen/hidden-tab loops pause; reduced motion keeps the scene static.
- Ocean-colored chapter frames and faded artwork edges prevent white seams.

This phase adds background ambience. The main story/steps illustration layout
remains a separate design phase. The hero, current content, original turtle, and
“Turtle ID does NOT replace tags or satellites” banner are preserved.
Styling uses Tailwind; no dependency or custom CSS was added.

Lint and TypeScript checks passed. Browser review covered 390×844, 1440×720,
1440×900, and 2560×1440, plus reduced motion. No automated tests were added/run.
Physical-device performance measurements remain outside this review.

## Latest visual audit — 2026-10-02, evening

- Hero foreground waves join page 2 in the same #133045 blue. Extended SVG fills
  prevent lighter rear waves from showing as thin strips during parallax.
- Story/steps share a continuous ocean backdrop; padded coral viewBoxes avoid clipping,
  and plant/current movement is more visible. The story turtle is larger, darker,
  fully opaque, and on the right, retaining its automatic swim.
- The latest coral adjustment moves both chapters' beds to the outside edges and
  lowers their bases into the reef. More visible automatic sway keeps the original shapes.
- The latest reference sets the bottom to navy-black (#051320). The seabed fades
  from ocean blue to #0c2434, then the banner fades toward #051320; the solid-black
  jump was removed. A continuous SVG reef contour joins the two; the blue step
  divider is replaced. Page 3 reuses page 2's preferred coral shapes with varied
  sizing and a few additional small branches. The hand-shaped preview was removed.
  Banner wording and original turtle are preserved.
- Community, Academy, contribution, contact, and FAQ share 1352px containers and
  40–64px section spacing. The Academy divider is removed; FAQ keeps shared heading
  clearance and a minimum viewport scene with the footer at the bottom for direct navigation.
- The phone wrapper shadow is removed; the supplied transparent phone artwork,
  scroll separation, and independent hover lift remain.
- FAQ answers open/close with a 0.3-second height/opacity transition and accessible
  keyboard controls. Reduced motion opens immediately; scroll position stays stable.
- Optional member details accept null/empty values without printing placeholders.
  LinkedIn/Instagram support full URLs or IDs; additional labeled HTTP(S) links
  are supported. Current member details remain exactly as supplied.
- The browser icon uses the owner's dark AdaPenyu logo. The footer uses the larger
  original wordmark SVG for sharpness. These supplied logo SVGs embed raster artwork.

Lint and TypeScript checks passed. Manual review covered phone, short laptop,
desktop, and wide-desktop layouts, keyboard FAQ operation, and reduced motion.
No dependency, custom CSS, or automated tests were added. The full reference
story/steps illustration composition and real backend integrations remain pending.
