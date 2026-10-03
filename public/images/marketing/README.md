# Marketing artwork

Local artwork used by the AdaPenyu landing page. Source files are retained so the
website can preserve the supplied composition, colors, and illustration style.

## Collections

- `hero-pattern.svg` and `benefits-pattern.svg`: traced background vector paths.
- `accuracy-pattern.svg`: the blue pattern used by progress, contribution, contact,
  the navigation dialog, and footer.
- `app-icon.svg`, `wordmark.svg`, portraits, and prototype screens: SVG containers
  that preserve supplied raster artwork. They are not all vector paths.
- `hero-foreground-wave.svg` and `hero-frontmost-wave.svg`: extended foreground
  fills that keep the hero and story joined during parallax.
- `steps-seabed.svg`: the original reef crest with an ocean-depth gradient.
- `step-circle.svg`, circle fill, and step arrows: identification sequence artwork.

## Rendering

`src/features/marketing/components/figma-image.tsx` provides the local image wrapper.
Ocean layers are assembled in `ocean-artwork.tsx` and `chapter-ocean.tsx`, using
source coordinates from `Screen/detached-ocean-elements/positions.json`.

Broad reef contours come from `Screen/detached-ocean-elements/More`. Selected small
coral and seaweed silhouettes come from `Screen/Secondpages`; unused source packs
remain available but are not automatically rendered.

Scroll depth belongs to an outer wrapper. Sway and idle movement belong to a
separate inner wrapper, with pivots at the original plant bases. Mobile compositions
use smaller movement and a natural reading order. Reduced motion renders static art.

The three original phone SVGs share their intrinsic dimensions through
`data/prototype-screens.ts`. Below 768px, `phone-carousel.tsx` displays them in a
native horizontal scroll-snap track with manual controls and no autoplay. At 768px
and above, the original GSAP phone fan remains. The mobile navigation dropdown uses
the existing accuracy pattern and custom menu/close SVG masks; it adds no new artwork
or carousel dependency.

Browser and Apple touch icons are generated from the original dark PNG in
`public/Logo`, with a tighter crop. The website's source logos are unchanged.
