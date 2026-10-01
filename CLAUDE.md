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

## Hero and phone experiment

- HeroTurtleScene replaces the grey prototype tile/CTA with custom SVG water and the
  original turtle. Hero pointer response and the satellite turtle's idle loop are distinct.
- Phones begin stacked behind the centre phone, then separate with native scrolling.
  Read offset geometry, not transformed rectangles, for the starting positions.
- Phone hover translates inner wrappers only. Keep it separate from the scroll tween.
- No Three.js dependency was added. The hero uses the existing brand palette and
  transparent background, with no added blue panel. Explore prototype and Explore
  the catalogue buttons were removed at the owner's request.

## Latest hero decision — supersedes the experiment

Keep the original grey hero box, app icon, wordmark, and dimensions. The owner
rejected the turtle/water replacement: its component and motion were removed.
Do not re-add it. The two Explore buttons remain removed. Phone separation and
the original satellite-message turtle idle loop are retained.
