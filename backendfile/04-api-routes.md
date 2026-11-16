# 04 API Routes

All handlers follow the same steps: check session, validate input with Zod, call a service, return JSON. Errors use the status codes `400` (bad input), `401` (not logged in), `403` (wrong role), `404`, `409` (conflict), `429` (rate limit).

| Module | Method and path | Access | Notes |
|---|---|---|---|
| auth | `POST /api/auth/register` | public | creates a user |
| auth | `POST /api/auth/login`, `logout`, `GET /session` | public | via Auth.js |
| users | `GET, PATCH /api/users/me` | user | profile header |
| users | `GET, POST /api/users/me/sections`, `PATCH, DELETE /:id` | user | profile sections |
| users | `GET /api/members?division=` | public | Team page |
| posts | `GET /api/posts?subtopic=&cursor=` | public | cursor pagination |
| posts | `POST /api/posts` | user | slug generated from title |
| posts | `PATCH, DELETE /api/posts/:id` | author or admin | |
| projects | `GET /api/projects?type=&subtopic=&division=` | public | |
| projects | `POST, PATCH, DELETE /api/projects` | user (owner) or admin | |
| resources | `GET /api/resources` | public | approved only, plus the caller's own pending |
| resources | `POST /api/resources` | user | status starts as `pending` |
| resources | `PATCH /api/resources/:id/review` | admin | see [06-approval-workflow](06-approval-workflow.md) |
| events | `GET /api/events?kind=&when=` | public | |
| events | `POST, PATCH, DELETE /api/events` | admin | |
| leaderboard | `GET /api/leaderboard?q=&year=&tech=&cursor=` | public | cached, see [07-leaderboard-points](07-leaderboard-points.md) |
| uploads | `POST /api/uploads/sign` | user | see [05-image-uploads](05-image-uploads.md) |
| admin | `GET /api/admin/stats`, `POST /api/points` | admin | |

## Rules
- Use **cursor pagination** (created_at and id), not offset, for posts and the leaderboard.
- Select only the columns the page needs. Never return `password_hash`.
- Public `GET` routes are cacheable; writes revalidate the matching tag ([08-caching-and-performance](08-caching-and-performance.md)).

## Handler shape (sketch)
```ts
export async function POST(req: Request) {
  const session = await requireRole("user");          // 401 / 403
  const input = createPostSchema.parse(await req.json()); // 400
  const post = await postService.create(session.userId, input);
  revalidateTag("posts");
  return Response.json(post, { status: 201 });
}
```

## Next

- [05-image-uploads](05-image-uploads.md): image upload flow
- [06-approval-workflow](06-approval-workflow.md): review endpoint

[Back to index](README.md)
