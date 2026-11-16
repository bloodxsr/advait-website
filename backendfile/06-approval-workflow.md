# 06 Approval Workflow

Used for educational resources (admin approval required).

## States
`pending` then `approved` or `rejected`.

## Endpoints
- `POST /api/resources` (user): inserts a row with status `pending`.
- `GET /api/admin/resources?status=pending` (admin): the review queue, newest first. Uses the `(status, created_at)` index.
- `PATCH /api/resources/:id/review` (admin): body `{ "decision": "approved" | "rejected", "note": "..." }`.

## Review in one transaction (sketch)
```ts
await db.transaction(async (tx) => {
  const [row] = await tx.update(resources)
    .set({ status: decision, reviewedBy: adminId, reviewNote: note, reviewedAt: new Date() })
    .where(and(eq(resources.id, id), eq(resources.status, "pending")))
    .returning();
  if (!row) throw new Conflict("Already reviewed");      // 409, stops double review
  if (decision === "approved") {
    await tx.insert(pointsEntries).values({
      userId: row.submittedBy, points: 3, reason: "Resource approved",
      sourceType: "resource", sourceId: row.id,
    }).onConflictDoNothing();                             // unique source index
  }
});
revalidateTag("resources"); revalidateTag("leaderboard");
```

## Rules
- Only `approved` rows appear on the public page. Authors see their own rows in any status.
- A reviewed row cannot be reviewed again unless an admin resets it to `pending`.
- Editing an approved resource: decide whether it returns to `pending` (open question).
- The same pattern can be reused for blog posts later by adding a `status` column to `posts`.

## Next

- [07-leaderboard-points](07-leaderboard-points.md): points
- [08-caching-and-performance](08-caching-and-performance.md): revalidation

[Back to index](README.md)
