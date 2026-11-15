# News and Events

Club events and news, each with a short description and a picture.

| | |
|---|---|
| Route | `/news` |
| Access | Reading: everyone. Managing: admin |
| Status | Active |
| Rendering | Server Components |

## Page
Cards with a picture, title, date and a short description. Split into **Upcoming** and **Past** (older items can be hidden after a set number of days).

## How it works
- Admins create and edit events and news in the [admin-dashboard](admin-dashboard.md), uploading a picture to object storage.
- The newest items appear as a preview on the [landing-page](landing-page.md).
- This is simple navigation: no member input, no approval.

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/events?kind=&when=` | List events or news |
| POST | `/api/events` | Create (admin) |
| PATCH / DELETE | `/api/events/:id` | Edit or delete (admin) |

## Data
`Event` (kind: `event` \| `news`, imageUrl). See [data-model](data-model.md).

## Connected modules

- [landing-page](landing-page.md) — shows the latest items
- [admin-dashboard](admin-dashboard.md) — create and edit
- [social-network](social-network.md) — sibling simple-navigation page
- [data-model](data-model.md) — Event entity

[← Back to index](README.md)
