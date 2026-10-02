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
- Phone previews that separate as you scroll, member profile dialogs, and an animated FAQ.
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
│   ├── (workspace)/        Turtle catalogue and identification prototype
│   └── api/                Re-identification endpoint placeholder
├── features/
│   ├── marketing/          Sections, artwork, content, and scroll sequences
│   ├── turtles/            Turtle types, UI, and repository interface
│   └── re-identification/  Upload UI, match types, and model service interface
├── components/             Shared UI and motion helpers
└── lib/                    Motion settings, brand icons, and site configuration
public/images/              Supplied SVG artwork and ocean-layer metadata
```

**Motion** handles interface transitions. **GSAP ScrollTrigger** handles coordinated
scroll sequences and ocean depth. Separate wrappers keep idle animation independent
from scroll movement; decorative loops pause offscreen and in hidden tabs.

Domain types and server adapter interfaces keep future storage and model integration
separate from the presentation layer. GitHub pushes to `main` deploy through Vercel.

## Run locally

Requires Node.js 20.9+ and pnpm.

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

## Project status

The public website and frontend interactions are implemented. The turtle workspace
is a prototype: uploads, model inference, persistence, and identity review await
integration. The API currently returns `501`; the contact form saves a local draft.
The displayed accuracy figure comes from the supplied prototype design, rather
than an independently reproduced benchmark in this repository.

Maintained by [Gung](https://github.com/gungfebrian).
