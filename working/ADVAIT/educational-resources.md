# Educational Resources

Learning resources recommended by members and **approved by an admin** before anyone else sees them.

| | |
|---|---|
| Route | `/resources` |
| Access | Reading approved items: everyone (assumed). Recommending: logged-in users. Approving: admin |
| Status | Active |
| Rendering | Server Component list, Client Component for the recommend form |

## How it works
1. A member recommends a resource (title, link, short description, tags).
2. It is saved with status **pending** and is visible only to its author and admins.
3. An admin reviews it in the [admin-dashboard](admin-dashboard.md).
4. **Approved** → shown on `/resources`. **Rejected** → returned to the member with a note.

The full state machine is in [content-approval](content-approval.md).

## Page
List of approved resources with tag filters. Similar to [hall-of-flames](hall-of-flames.md) in look and feel.

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/resources` | Approved items (plus the caller's own pending items) |
| POST | `/api/resources` | Recommend a resource (user) |
| PATCH | `/api/resources/:id/review` | Approve or reject (admin) |

## Data
`Resource` with `status`: `pending` \| `approved` \| `rejected`. See [data-model](data-model.md).

## Points
An approved resource can award points to its submitter ([leaderboard](leaderboard.md), rule to be decided).

## Connected modules

- [content-approval](content-approval.md) — the approval workflow in detail
- [admin-dashboard](admin-dashboard.md) — where approvals happen
- [hall-of-flames](hall-of-flames.md) — sibling module
- [research-papers](research-papers.md) — papers can reuse the resource type
- [user-dashboard](user-dashboard.md) — recommend from the dashboard
- [leaderboard](leaderboard.md) — approved items can award points
- [data-model](data-model.md) — Resource entity

[← Back to index](README.md)
