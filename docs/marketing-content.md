# Updating marketing content

Use these source files to update landing-page content without duplicating data in components.

| Content | Source |
| --- | --- |
| Team names, roles, portraits, and profile details | `src/features/marketing/data/team.ts` |
| Identification steps and benefit copy | `src/features/marketing/content.ts` |
| Prototype screen titles, descriptions, and dimensions | `src/features/marketing/data/prototype-screens.ts` |

## Team profiles

Keep each member's preferred spelling and capitalization in `name`. The profile
button, visible name, and dialog all use this value. Set `artwork` to a filename
under `public/images/marketing/` and preserve the image's width-to-height ratio.

Optional fields include `bio`, `memberId`, LinkedIn and Instagram URLs or IDs, and
`extraLinks`. Extra links need both a label and an HTTP or HTTPS URL to appear.
Blank optional text is hidden. Confirm personal details with the member before publishing them.

## Prototype copy and artwork

The shared screen metadata feeds both the benefits presentation and hero popup.
Keep `alt` useful to someone who cannot see the screenshot and retain the source
dimensions when replacing an export. See the [artwork guide](../public/images/marketing/README.md).

Describe planned model behavior as a prototype. Any accuracy claim needs supporting
evaluation evidence; the existing design figure is not a benchmark reproduced by this repository.

## Turtle gallery records and photographs

The public gallery at `/penyuGallery` reads
`src/features/penyu-gallery/data/turtles.json`. Its record types are defined in
`src/features/penyu-gallery/types.ts`; the page and photo credits live in
`src/features/penyu-gallery/penyu-gallery-page.tsx`.

- Keep each turtle's `id` unique and stable: shared profile links use this value.
  Set its display `name`, `firstYear`, `lastYear`, and `primaryPhoto` from the source record.
- Give each sighting its recorded `date` in `YYYY-MM-DD` format and matching
  numeric `year`. The profile opens the first sighting in the array, so preserve
  the intended order. Keep sighting dates unique within each turtle.
- Store available photographs under `photos.left` and `photos.right`. Each photo
  carries its `side`, public `path`, post-ocular scale count (`po`), and `idCodes`.
  Omit an unavailable side; the profile displays a missing-photo message.
- Resolve paths such as `/turtles/Green/Adelotte/2021/Adelotte_2021_L.webp`
  against `public/`. Preserve original photographs and their left/right labels.

The hero derives its turtle count, photograph count, and year range from the
records. Its two featured Calvin photographs are separate image references in
the page component. The route's title and description live in
`src/app/(marketing)/penyuGallery/page.tsx`; update any fixed counts there when
the collection changes.

Retain the existing ReunionTurtles dataset link and Kelonia photo credit when
editing the gallery. Confirm the source's usage terms before adding or replacing
photographs. Run the [gallery checks](manual-ui-checks.md#public-turtle-gallery)
after changing records or image paths.
