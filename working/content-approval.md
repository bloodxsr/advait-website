# Content Approval Workflow

The cycle used when members submit something that an admin must approve. Today it applies to [educational-resources](educational-resources.md).

## States
`pending` → `approved` (published) or `rejected` (returned to the member).

## Steps
1. Member submits the item (title, link, tags).
2. Status is set to **pending**.
3. Admin reviews it in the [admin-dashboard](admin-dashboard.md).
4. **Approve** → status `approved`, item appears on the public page, points may be awarded ([leaderboard](leaderboard.md)).
5. **Reject** → status `rejected`, a note explains why, the member can revise and resubmit.

## Rules
- Only `approved` items are public.
- Authors see their own items in any status.
- Only admins can change status; the server verifies the role ([roles-and-permissions](roles-and-permissions.md)).
- Every review stores who reviewed it and when.

## Open questions
- If a member edits an approved item, does it go back to `pending`?
- Should blog posts in [hall-of-flames](hall-of-flames.md) use the same workflow?

## Proposed API
`PATCH /api/resources/:id/review` with `{ "decision": "approved" | "rejected", "note": "..." }`.

## Connected modules

- [educational-resources](educational-resources.md) — the module that uses it today
- [admin-dashboard](admin-dashboard.md) — where reviewing happens
- [hall-of-flames](hall-of-flames.md) — possible future use
- [roles-and-permissions](roles-and-permissions.md) — who may review
- [data-model](data-model.md) — status fields

[← Back to index](README.md)
