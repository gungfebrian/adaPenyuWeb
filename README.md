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

The existing .gitignore excludes all Markdown files, including these documents.
They are local documents under the current Git preference.

## Landing page

The supplied Figma composition is implemented at `/`, including the story, three
identification steps, three prototype screens, progress, team, contribution, and
contact sections. The hero preview opens the identification workspace. The logo and navigation share
one floating block with a mobile dialog. Link hovers use a single label and
underline, avoiding duplicate text during transitions.

Motion handles section reveals, small button responses, navigation transitions,
and member profile dialogs. GSAP ScrollTrigger handles the longer story,
identification, and prototype scroll sequences. The story and steps use native sticky positioning so the browser owns scrolling.
The steps use a short hold with direct scroll response; the phone screens reveal during natural scrolling without
pinning, pointer tilt, or a delayed scrub. The story card overlaps the hero
without scaling the page or exposing a background gap. Reduced motion uses static
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
