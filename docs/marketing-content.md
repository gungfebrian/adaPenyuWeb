# Updating marketing content

Use these source files to update landing-page content without duplicating data in components.

| Content | Source |
| --- | --- |
| Team names, roles, portraits, and profile details | `src/features/marketing/data/team.ts` |
| Identification steps and benefit copy | `src/features/marketing/content.ts` |
| Prototype screen titles, descriptions, and dimensions | `src/features/marketing/data/prototype-screens.ts` |

## Page metadata and crawler settings

Use these sources when changing browser titles, search descriptions, or shared
link previews. Visible page copy and metadata have separate definitions.

| Content | Source |
| --- | --- |
| Site name, production URL, and shared description | `src/lib/config/site.ts` |
| Default title, title template, metadata base URL, and browser/touch icons | `src/app/layout.tsx` |
| Homepage title, description, canonical link, Open Graph, and Twitter preview | `src/app/(marketing)/page.tsx` |
| Gallery title and description | `src/app/(marketing)/penyuGallery/page.tsx` |
| Client data integration guide and metadata | `src/app/(marketing)/docs/client-data-integration/page.tsx` |
| Shared guide copy and API response examples | `src/features/client-data-integration/guide.ts` |
| Public sitemap entries | `src/app/sitemap.ts` |
| Crawler rules and sitemap location | `src/app/robots.ts` |

The homepage references `public/og-preview.png` in both social preview definitions.
When replacing it, keep the declared dimensions and alternative text aligned with
the image. Review the homepage's title and description alongside the shared
`siteConfig` values; some strings are defined directly in the page.

The sitemap lists the homepage, `/penyuGallery`, and
`/docs/client-data-integration`. Keep the redirect alias `/penyu-gallery` out
of the sitemap. Crawler rules disallow `/api/`, `/auth/`,
and `/account/`; account pages also receive `X-Robots-Tag: noindex, nofollow` from
`next.config.ts`. These settings describe crawler behavior; route access is
handled separately by the application.

Follow the [metadata checks](manual-ui-checks.md#page-metadata-and-crawler-responses)
after changing these files or the preview image.

Edit the shared integration guide when the API instructions or response
examples change. The HTML guide and `/docs/client-data-integration.md` use the
same content. The site’s `/llms.txt` points agents to the Markdown guide.

The endpoint reference uses the FastAPI contracts in the backend checkout.
After a backend contract change, use its Python environment to run
`python scripts/export-integration-openapi.py <backend-checkout>` from this
repository, then review the generated OpenAPI diff and the example payloads in
`src/features/client-data-integration/examples.json`.

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

## Contact form copy and drafts

The contact fields, recipient, email subject, and status messages live in
`src/features/marketing/components/contact-form.tsx`. Submission opens a `mailto:`
draft addressed to `adapenyu@gmail.com`; the visitor sends it from their email
app. Keep the button and confirmation copy clear about that step, since opening
the draft does not confirm delivery.

**Save draft** stores the name, email, organization, and message under
`adapenyu-contact-draft` in this browser's local storage. Restoration requires
**Restore saved draft**; the form does not restore automatically on page load.
**Delete saved draft** removes the saved record while leaving the current fields
visible. Keep the four string fields compatible with existing saved drafts when
editing this component, or handle older draft shapes explicitly.

After changing the form, follow the [contact draft checks](manual-ui-checks.md#contact-drafts).

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

### Gallery presentation sources

| Change | Source |
| --- | --- |
| Hero copy, featured photo pair, statistics, credits, and footer | `src/features/penyu-gallery/penyu-gallery-page.tsx` |
| Collection heading, search, year filter, mystery mode, cards, and profile dialog | `src/features/penyu-gallery/components/penyu-catalog.tsx` |
| Browser title and search description | `src/app/(marketing)/penyuGallery/page.tsx` |

The featured pair currently shows Calvin's left and right profiles from 2021.
If you replace it, update both image paths, alternative text, source dimensions,
and the visible year badge together. Keep the pair from the same turtle and
sighting so the caption remains accurate. Preserve `object-contain` when adjusting
the frames so facial scale patterns remain visible.

The **Explore gallery** and **Photo credits** links target `penyu-catalog` and
`gallery-photo-credits`. Keep those IDs aligned with their links when moving sections.
