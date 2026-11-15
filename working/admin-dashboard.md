# Admin Dashboard

Control panel for club admins.

| | |
|---|---|
| Route | `/admin` |
| Access | Role `admin` only |
| Status | Active |
| Rendering | Client Components for tables and forms, server-side data |

## What admins can do
| Area | Action | Module |
|---|---|---|
| Resources | Approve or reject recommended resources | [educational-resources](educational-resources.md), [content-approval](content-approval.md) |
| Events and news | Create, edit, delete, upload pictures | [news-events](news-events.md) |
| Social links | Update the club's links | [social-network](social-network.md) |
| Members and points | View members, adjust points | [leaderboard](leaderboard.md) |
| Posts | Moderate blog posts and subtopics | [hall-of-flames](hall-of-flames.md) |
| Papers | Curate the research paper list | [research-papers](research-papers.md) |

## Layout suggestion
Sidebar with one entry per area above; the **Approvals** entry shows a pending count.

## Proposed API (admin only)
- `PATCH /api/resources/:id/review`
- `POST /api/events`, `PATCH /api/events/:id`, `DELETE /api/events/:id`
- `PUT /api/links`
- `GET /api/users`, `POST /api/points`
- `DELETE /api/posts/:id`

All of these must verify the admin role on the server. See [roles-and-permissions](roles-and-permissions.md).

## Connected modules

- [authentication](authentication.md) — admin login leads here
- [content-approval](content-approval.md) — the approval queue
- [educational-resources](educational-resources.md) — approve or reject
- [news-events](news-events.md) — manage events and news
- [social-network](social-network.md) — manage links
- [leaderboard](leaderboard.md) — members and points
- [hall-of-flames](hall-of-flames.md) — moderation
- [research-papers](research-papers.md) — curate papers
- [roles-and-permissions](roles-and-permissions.md) — admin rights

[← Back to index](README.md)
