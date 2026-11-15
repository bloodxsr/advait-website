# User Dashboard

A member's personal space and public profile.

| | |
|---|---|
| Route | `/dashboard` |
| Access | Logged-in users (role `user`) |
| Status | Active |
| Rendering | Client Components (editable sections), data loaded on the server |

## Header
Profile picture, name, year and section, department.

## Sections (tabs)
- **About**
- **Projects** — the member's own projects from [our-projects](our-projects.md)
- **Research work**
- **Certificates**
- **Blog posts** — the member's posts from [hall-of-flames](hall-of-flames.md)

The member can **add, edit and remove** sections, and hide the ones they do not need.

## Other panels
- **Research paper recommendations** based on the member's tech stack ([research-papers](research-papers.md)).
- **Submit** a blog post ([hall-of-flames](hall-of-flames.md)) or recommend an educational resource ([educational-resources](educational-resources.md)).
- Points and rank summary from [leaderboard](leaderboard.md) *(optional)*.

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| GET / PATCH | `/api/users/me` | Read or update profile header |
| GET / POST | `/api/users/me/sections` | List or add sections |
| PATCH / DELETE | `/api/users/me/sections/:id` | Edit or remove a section |

## Data
`User`, `ProfileSection`. See [data-model](data-model.md).

## Open question
Does the leaderboard link to a public member profile page (for example `/members/[id]`) built from these sections?

## Connected modules

- [authentication](authentication.md) — users arrive here after login
- [hall-of-flames](hall-of-flames.md) — Blog posts tab and post submission
- [our-projects](our-projects.md) — Projects tab
- [educational-resources](educational-resources.md) — recommend a resource
- [research-papers](research-papers.md) — recommendation panel
- [leaderboard](leaderboard.md) — points and rank, profile link
- [roles-and-permissions](roles-and-permissions.md) — what a user can do
- [data-model](data-model.md) — User and ProfileSection

[← Back to index](README.md)
