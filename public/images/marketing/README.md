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
- hero-frontmost-wave.svg: derived copy of detached layer 13. Its solid fill is
  #133045 and its closure extends to y400 without the y300 crop. The original
  crest is preserved, preventing clipped valleys and gaps during scroll parallax.
- hero-foreground-wave.svg: derived copy of layer 12 with the original crest,
  y400 closure, and gradient ending at #133045. Extending this second foreground
  layer prevents lighter rear waves showing between the two foreground crests.
  Both detached source files stay unchanged.

The current phase changes colors and responsive proportions. It does not yet
implement the revised left-stacked third-screen title/composition. story-title.svg
is preserved as source; the latest story heading uses real DynaPuff HTML text.


## Story heading and turtle — 2026-10-02

The owner requested real-font text on page 2. story-title.svg is preserved but no
longer rendered in StorySection; that heading uses the site's DynaPuff display font.
The story's swimming turtle reuses banner-turtle.svg unchanged. It is an original
raster illustration embedded in an SVG, not a new vector reconstruction. Body
movement uses separate idle and desktop-scroll wrappers; flippers are not redrawn.


## Latest deep-ocean ambient assets — 2026-10-02

ChapterOcean renders pages 2/3 using flatter supplied artwork rather than the
initial densely shaded coral, seaweed, rocks, and wave preview.

- `Screen/detached-ocean-elements/More/09-distant-reef-layer.svg`,
  `10-middle-reef-layer.svg`, and `11-foreground-reef-layer.svg`: original one-path
  contours with restrained two-stop blue gradients. They contain no raster data.
- Existing detached `04-seaweed-left` and `05-coral-right` plant files: the same
  simple silhouettes/palette as the hero, assembled using original bounds.
- The original `03-wave-divider` and 40-path `More/08-wave-divider-low.svg` are
  preserved but are not rendered after the owner's latest deep-floor reference.
  `steps-seabed.svg` uses the supplied foreground crest and y400 closure. Its
  gradient runs #133045 → #0c2434; the complement then fades to #051320. This
  replaces the rejected abrupt solid-black contour and the blue divider.
- Selected `Screen/Secondpages` silhouettes: seaweed 21/22 and coral 13/15, all
  single solid-color vector paths. These four remain in the story chapter.
- Steps reuses the original hero plant beds at different widths, with
  additional Secondpages coral 14/16/40. The hand-shaped 19/20 preview was rejected;
  these large shapes are not rendered or included in this release. All three new
  selected sources are solid-color paths; source bytes are preserved.
- Existing currents and bubbles helpers supply restrained background motion.

Source SVGs are unchanged. Background contours stretch; plant proportions remain
intact. Source-coordinate plant pivots prevent detached bases during animation.
The untracked `marketing/ocean-chapters` draft pack is unused and is not part of
this release. Preserve owner source packs and avoid staging unused files.

## Logo sharpness — latest evening audit

Footer now references wordmark.svg, whose original embedded PNG is 1600×498,
instead of footer-wordmark.svg's 258×80 bitmap. Tailwind brightness/invert keeps
the footer wordmark white; its displayed size and original shape are preserved.
src/app/icon.svg embeds the original 1024px dark iOS app logo unchanged and
replaces the generic favicon. These are SVG containers, not vector tracings.
