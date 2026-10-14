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
