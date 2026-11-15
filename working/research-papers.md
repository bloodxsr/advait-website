# Research Papers

Paper recommendations based on each member's tech stack.

| | |
|---|---|
| Where it shows | A panel inside `/dashboard` (no page of its own) |
| Access | Logged-in users |
| Status | Active (simple first version) |
| Rendering | Server-side matching, Client Component panel |

## How it works (first version)
1. Each member lists their **tech stack** (tags on their profile).
2. Admins maintain a curated list of papers, each with tags.
3. The panel shows papers whose tags overlap with the member's stack, best matches first.

## Proposed API
- `GET /api/papers/recommended` — uses the session user's tech stack.
- `POST /api/papers` — admin adds a paper.

## Data
`Paper` (title, url, tags). See [data-model](data-model.md).

## Open question
Keep a separate `Paper` list, or reuse `Resource` with a `type = paper` field so papers also go through [educational-resources](educational-resources.md) approval? Pulling from an external source such as arXiv is possible later.

## Connected modules

- [user-dashboard](user-dashboard.md) — where recommendations are shown
- [educational-resources](educational-resources.md) — possible shared storage and approval
- [admin-dashboard](admin-dashboard.md) — curating papers
- [data-model](data-model.md) — Paper entity

[← Back to index](README.md)
