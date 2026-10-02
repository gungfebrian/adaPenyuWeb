# AdaPenyu landing artwork

Source: PenyuTab Figma file `z5H50coFF2jEVsszrxA65y`, page node `1084:1765`.

## SVG files

- `hero-pattern`, `story-pattern`, `benefits-pattern`, `accuracy-pattern`: actual vector paths traced from the two Figma bitmap backgrounds. Each SVG includes its original crop, horizontal flip where applicable, and colors. Light backgrounds include the original 5% opacity.
- `story-title`, `steps-title`, `team-title`: original illustrated headings, cropped to their Figma slots. Text alternatives are in the section headings.
- `story-arrow-first`, `story-arrow-second`, `story-arrow-third`, `step-arrow`, `step-circle`, `banner-turtle`: the original artwork with Figma placement, masking, and rotation baked into the SVG viewport.
- `benefit-shape-left`, `benefit-shape-middle`, `benefit-shape-right`: individual benefit background shapes, including their original mirrored variants.
- `app-photo`, `app-catalogue`, `app-record`: the three original mobile prototype screens.
- `match-photo-left`, `match-photo-right`: the masked, rotated photo layers from the progress comparison.
- `team-mayun`, `team-gung`, `team-abui`, `team-balq`, `team-gabby`, `academy-mark`: original team and academy artwork.
- `wordmark`, `footer-wordmark`: original Figma wordmarks with transparent backgrounds.
- `app-icon`: an SVG container for the supplied app logo in `public/Logo`.

The Figma source uses bitmap artwork for headings, drawings, screenshots, and photography. These SVGs embed that original artwork rather than inventing a replacement. Embedded PNGs are resized and losslessly compressed for their display slots. The three phone screenshots use high-quality WebP inside their SVG containers to reduce transfer and decode cost; their PNG sources are preserved in `design-assets/marketing-originals`. The traced pattern files contain no raster data.

Legacy PNG assets are preserved in `design-assets/marketing-originals`; the landing page references only SVG files. The supplied app logo originals remain in `public/Logo`.

## Owner-supplied additions — 2026-10-01

- `artwork2.png` is embedded unchanged in `citizens-turtle.svg` beside the team heading.
  Its view box preserves its dimensions and transparency; it is not a vector tracing.
- `artwork1.png` and `arwork3.png` are retained as supplied but are not used in the
  landing page: their placements were reverted at the owner's request.
- The original `banner-turtle.svg` remains at the complement/benefits boundary.
  Its scroll parallax and gentle automatic idle float use separate wrappers;
  there is no cursor-hover animation.
- The new team emblem is decorative and hidden on narrow layouts where it would
  compete with the original heading.

## Owner-supplied ocean elements — 2026-10-02

Original ocean-reef.svg and detached SVGs remain unchanged under public/images/Screen.
These are actual vector paths, circles, and gradients. OceanReef uses the supplied
positions.json metadata to rebuild the original reef across independent scroll layers.
Seaweed and coral keep their original shapes and colors while their wrappers sway.
The bubbles collection is used beside the hero and phones; the low-wave-footer
collection remains available as source artwork; the footer uses its original static pattern. No raster tracing or generated substitute artwork
was needed for these assets.


## Revised second/third screen exports — 2026-10-02

Source revision: PenyuTab node 1142:1752. Figma MCP reached the Starter call limit;
the owner supplied screenshots and local exports instead.

- step-circle-white-fill.svg: unchanged Rectangle 271.svg export (158×156). It is
  a white rectangle used behind the existing step-circle.svg alpha mask, preserving
  the original hand-drawn silhouette.
- step-arrow-white.svg: unchanged Mask group.svg export (50×105). Its white fill
  uses the supplied embedded bitmap alpha mask; it is not all vector paths.
- hero-frontmost-wave.svg: copy of detached reef layer 13-frontmost-wave.svg. Only
  its solid fill changes from #0B2E47 to #133045, joining the revised story color.
  The detached source file stays unchanged.

The current phase changes colors and responsive proportions. It does not yet
implement the revised left-stacked third-screen title/composition. The original
story-title.svg is rendered larger; its original illustrated artwork is unchanged.
