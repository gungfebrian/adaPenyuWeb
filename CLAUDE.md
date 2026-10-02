@AGENTS.md

# AdaPenyuWeb development guide

Follow applicable AGENTS.md instructions.

## Current scope

This is a scaffold for turtle photo re-identification. Preserve explicit placeholder
states until real integrations are requested. Do not manufacture turtle records,
model results, or confidence values.

## Structure

- Keep route files in src/app small.
- Keep feature components, types, and server contracts in src/features/<feature>.
- Put reusable UI in src/components and shared configuration in src/lib.
- Use .tsx for JSX and .ts for types, configuration, and server code.
- Import application modules through @/*.
- Prefer direct imports over broad barrel exports.
- Components are Server Components by default; add "use client" where interaction
  or browser APIs require it.
- Keep persistence and model adapters inside server/ modules with server-only.
- Extend the existing feature folders before adding abstractions.

## Checks

Use pnpm lint and pnpm build for requested implementation checks. Use pnpm typecheck
when a separate type check is needed. Do not add or run tests unless requested.
Do not claim checks passed without running them.

See design.md and docs/stakeholder-overview.md for the planned boundaries.

## Marketing implementation and handover

- Preserve the Figma composition and original banner-turtle.svg placement.
- The original turtle floats gently on its own, with no cursor-hover effect.
  Do not replace it with artwork1. Artwork1 and artwork3 placements were rejected;
  only artwork2 is used beside the team heading.
- PNG additions are embedded unchanged in descriptive SVG containers. Only the
  background patterns are traced vector paths; do not describe raster containers as vectors.
- Keep text out of pointer 3D tilt. Reveal wrappers and idle wrappers own separate transforms.
- Idle loops pause offscreen and when the document is hidden, and respect reduced motion.
- Keep portraits plain. Suppress only pointer-return outlines after dialog close;
  keyboard focus, Escape, focus restoration, and native dialog behavior remain available.
- Keep navbar labels single-rendered; boundary paint must not add duplicate visible text.
- Style using Tailwind utilities and existing tokens. Do not add custom CSS files.
- Read ignored handover.md and handoverpriv.md for local progress and continuation details.
  Neither file belongs in Git. Existing tracked Markdown remains tracked.
- Source publication and Vercel deployment are separate steps. Check the local
  handover for current release state; do not claim a GitHub push is a deployment.

## Current hero and ocean artwork — 2026-10-02

The owner explicitly requested removing the grey hero box in favor of the original
app icon and wordmark with the supplied ocean-reef.svg artwork. This supersedes
prior instructions to preserve the grey box. Do not restore the rejected homemade
HeroTurtleScene or change the supplied ocean palette.

- OceanReef assembles cropped SVGs from public/images/Screen/detached-ocean-elements
  using positions.json. Keep the source positions, paths, gradients, and colors.
- Keep the original hero typography, spacing, logo dimensions, and reef height.
  The owner rejected compressing the composition to fit shorter viewports.
  Omit hero reef orders 9–11, 20, and 22–25; retain 21-right-coral.svg as the
  single large right coral. Preserve the source files.
- Hero waves use separate scroll depths. Seaweed/coral sway around their bases.
  Bubbles appear beside the hero logo and phone sequence. Footer waves are retained
  as source assets but are no longer rendered per the owner's latest correction.
- HeroLogo keeps the button hit area stationary. GSAP idle, Motion hover, and tap
  wiggle use separate inner wrappers. Reduced motion leaves artwork static.
- Ocean and logo loops pause offscreen and in hidden tabs. Mobile parallax is reduced.
- Phones begin stacked behind the centre phone, then separate with native scrolling.
  Read offset geometry rather than transformed rectangles for starting positions.
- Phone hover translates inner wrappers independently from the scroll tween.
- The two Explore buttons remain removed. The original satellite-message turtle
  retains its own artwork, placement, and automatic idle movement.
- The story and steps keep a #133045 base matching the hero's frontmost wave.
  The latest owner request adds ChapterOcean ambience from the flat detached
  artwork; this supersedes the earlier solid-only background correction.
  Original story-pattern and deep-ocean SVGs remain unused.
- The frontmost hero wave owns a separate upward scroll layer and an SVG fill
  extending below its baseline. Keep the 1px overlap to avoid fractional seams.
- Hero parallax uses the width breakpoint independently of the 720px height
  requirement for story pinning. Keep original hero typography/layout dimensions.
- Contact and footer keep the original accuracy-pattern SVG static: no added
  OceanCurrents/OceanReef layers or background parallax. Footer follows the latest
  screenshot: logo, © 2026 AdaPenyu. All rights reserved., and a plain mailto link
  to adapenyu@gmail.com. No footer navigation links or extra decorative elements.

## Current GitHub / Vercel workflow

The Vercel project is now linked to gungfebrian/adaPenyuWeb, with main as the
production branch and automatic deployments enabled. After an authorized push,
check the Git-triggered Vercel build status and deployed commit before claiming
production is updated. Earlier handover entries about a missing GitHub connection
are historical; read the newest release entry first.

## Latest motion audit — full hero and other chapters

- Hero minimum height is 100svh. Do not restore the negative story margin: it covered
  48–80px of the reef. Story sheet corner rounding remains, with an ocean-colored backdrop.
- SVG animation pivots use data-ocean-pivot and GSAP svgOrigin in source coordinates.
  Pixel transformOrigin offsets are local to the element and previously doubled the
  coordinates of right-side coral. Keep plants anchored and bubble scale centered.
- Individual bubbles rise/fade on separate outer groups; pointer response and logo
  ripple use inner groups. Current bands remain behind the complement message;
  story/steps now have the owner-requested ChapterOcean ambience; contact/footer
  retain the original static pattern.
- Step circles own a tiny idle wrapper separately from the number and scroll reveal.
  Progress photos have outer scroll wrappers and inner pointer tilt wrappers.
- Decorative loops share one IntersectionObserver and one visibilitychange listener.
  Keep reduced-motion cleanup and offscreen/hidden-tab pausing.
- Lottie MCP has no connected Creator tab. No Lottie player was added; effects use GSAP.


## Latest revision and continuation — 2026-10-02

- Read docs/AGENT_HANDOVER.md first for the newest local continuation state. Older
  progress entries are history and may describe reverted experiments. This new
  Markdown handover is ignored under the existing *.md rule.
- The owner requested colors/responsiveness first; the full revised second/third
  Figma composition is a later phase. Third-screen steps now have a #133045
  background and white/off-white artwork/copy. Do not mark the new left-stacked
  “Three / steps / only” composition implemented: it is still pending.
- Do not change the complement section headed “Turtle ID does NOT replace tags or
  satellites”. Its markup and existing visual design are preserved in this pass.
- StoryScene backgrounds span the available document width; inherited cqw sizing
  remains capped by the 1512px marketing container. LandingMotion owns --scene-width
  through one ResizeObserver, using clientWidth to avoid scrollbar-induced offsets.
- --page-gutter is clamp(24px,5.3vw,80px). Keep shared outer gutters consistent;
  narrower team/FAQ/contact reading widths remain deliberate.
- Hero laptop dimensions are retained. Only >=120rem (1920px at default root size)
  gets the larger capped hero typography/icon/wordmark and tall-screen top spacing.
  Keep breakpoint units consistent with Tailwind's rem breakpoints.
- The desktop step list is flex-1 with three grid rows; row minimum heights must not
  push the last step below the viewport. Tablet copy uses 25px/17px minimum sizes.
- step-circle-white-fill.svg is a rectangular white fill, not a new circle path;
  it is masked with the original step-circle.svg alpha silhouette.
- step-arrow-white.svg is the supplied alpha-mask SVG. hero-frontmost-wave.svg is
  a separate supplied-wave copy with the #133045 fill. Preserve all original assets.
- Only the selected Secondpages SVG silhouettes listed under the latest ambient
  phase are used. Preserve the rest of that owner-added pack; do not stage it
  with unrelated changes.
- Current Figma MCP access hit the Starter call limit. Use the owner-provided
  screenshots/exports listed in the handover until access is available again.


## Latest page 2 change — 2026-10-02

- The owner explicitly requested replacing the SVG story heading with a normal
  font. StorySection now renders real HTML text in the existing DynaPuff display
  font, with 36–64px responsive sizing. Preserve story-title.svg as source; it is
  no longer displayed in that heading. This supersedes earlier SVG-title guidance.
- The new story turtle reuses banner-turtle.svg. It does not replace or modify the
  existing turtle at the tags/satellites/benefits boundary.
- data-story-swim is the desktop scroll-transform wrapper; data-idle="story-turtle"
  is its inner idle-transform wrapper. Keep transform ownership separate.
- The inner loop swims gently on its own, using the existing visibility observer
  and reduced-motion cleanup. Do not turn it into cursor-only hover animation.
- The original complement banner remains unchanged. No new assets, custom CSS,
  animation packages, or owner Secondpages files are needed for this change.


## Latest pages 2/3 ambient phase — 2026-10-02

- The owner requested ambience first, then rejected the densely shaded coral and
  rocks in favor of artwork matching the hero. Do not restore the 40-path tonal
  scenery from the initial preview. The central story/steps redesign is still pending.
- ChapterOcean uses detached-ocean-elements/More reef contours 09/10/11, the
  existing 04-seaweed-left and 05-coral-right plant silhouettes, and the existing
  flat 03-wave-divider collection. More/08-wave-divider-low.svg is not rendered.
- Selected Secondpages shapes: seaweed/21-left-distant-kelp.svg,
  seaweed/22-right-distant-kelp.svg, coral/13-small-distant-left-coral-01.svg,
  coral/15-small-distant-right-coral-01.svg. They are single solid-color paths.
- Keep the original shape proportions, SVG paths, and palette. Wide reef contours
  stretch in a dedicated SVG wrapper without object-cover cropping their crests.
- Plants sway around source-coordinate bottom pivots through data-ocean-sway.
  The four simple background silhouettes use data-chapter-sway wrappers; their
  outer data-ocean-depth wrappers own scroll parallax independently.
- Reuse LandingMotion's shared observer and visibility listener. Mobile movement
  is reduced, hidden/offscreen loops pause, and reduced motion is static.
- Both chapter frames/sheets use bg-banner, preventing fractional white seams.
  Ambient top/bottom masking blends into that base; scenery stays behind text.
- Hero, original turtle artwork, current copy/steps, and complement banner remain
  unchanged. No dependency or custom CSS was added.
