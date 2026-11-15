# Social Network

A simple page linking to the club's social accounts.

| | |
|---|---|
| Route | `/social` |
| Access | Everyone |
| Status | Active |
| Rendering | Server Component |

## How it works
- Shows a list of platform buttons or cards that link out.
- Admins edit the links in the [admin-dashboard](admin-dashboard.md).
- Links can also be reused in the footer of the [landing-page](landing-page.md).

## Proposed API
- `GET /api/links`
- `PUT /api/links` (admin)

## Data
`SocialLink` (platform, url). See [data-model](data-model.md).

## Connected modules

- [admin-dashboard](admin-dashboard.md) — edit the links
- [landing-page](landing-page.md) — menu entry and footer
- [news-events](news-events.md) — sibling simple-navigation page
- [data-model](data-model.md) — SocialLink entity

[← Back to index](README.md)
