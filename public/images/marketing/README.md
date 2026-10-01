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
