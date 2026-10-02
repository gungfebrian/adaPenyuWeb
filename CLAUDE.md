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
- Hero waves use separate scroll depths. Seaweed/coral sway around their bases.
  Bubbles appear beside the hero logo and phone sequence; low waves decorate the footer.
- HeroLogo keeps the button hit area stationary. GSAP idle, Motion hover, and tap
  wiggle use separate inner wrappers. Reduced motion leaves artwork static.
- Ocean and logo loops pause offscreen and in hidden tabs. Mobile parallax is reduced.
- Phones begin stacked behind the centre phone, then separate with native scrolling.
  Read offset geometry rather than transformed rectangles for starting positions.
- Phone hover translates inner wrappers independently from the scroll tween.
- The two Explore buttons remain removed. The original satellite-message turtle
  retains its own artwork, placement, and automatic idle movement.

## Current GitHub / Vercel workflow

The Vercel project is now linked to gungfebrian/adaPenyuWeb, with main as the
production branch and automatic deployments enabled. After an authorized push,
check the Git-triggered Vercel build status and deployed commit before claiming
production is updated. Earlier handover entries about a missing GitHub connection
are historical; read the newest release entry first.
