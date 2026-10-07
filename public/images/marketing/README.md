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

## Prototype screenshot contexts

| Context | Below 768px | At 768px and above |
| --- | --- | --- |
| Benefits section | Native swipe carousel with manual controls | Three-phone scroll fan |
| Hero app-icon popup | Compact carousel, starting at the first screen | All three screens side by side |

Both contexts use the same screen metadata and supplied SVGs. The popup is assembled
in `prototype-gallery.tsx`; its native dialog handles modal focus, while the logo
component restores trigger focus after dismissal. Keep screenshot proportions intact
when adjusting the surrounding layout.

## Adding artwork

Use descriptive filenames and retain the source SVG's `viewBox` and aspect ratio.
Register phone artwork in `data/prototype-screens.ts` so both responsive presentations
use the same dimensions and accessible description. Give meaningful images useful
alt text; keep purely decorative ocean layers hidden from assistive technology.

An SVG containing an embedded bitmap still has raster resolution and payload costs.
Keep source exports intact and optimize derived assets separately when needed.

Browser and Apple touch icons are cropped exports of the original dark PNG in
`public/Logo`, served from versioned `public/icons/adapenyu-*-v3.png` URLs. The fallback
`public/favicon.ico` contains the same AdaPenyu artwork. Legacy generated icon routes
have been removed; the website's source logos are unchanged.
