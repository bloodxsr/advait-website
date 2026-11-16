# 08 Caching and Performance

Database choice matters less than these steps.

## 1. Place things close together
Run the Next.js functions and the Postgres database in the **same region**. A cross-region hop costs more than any query.

## 2. Pool connections
Use the Supabase **transaction pooler** string (port 6543) with `prepare: false`. Serverless functions open many short connections.

## 3. Cache public pages
| Page | Strategy |
|---|---|
| Landing, Divisions, Team, Social | static, revalidate rarely |
| Hall of Flames, Projects, Resources, Events | cached, revalidate by tag when a write happens |
| Leaderboard | 30 to 60 second cache or tag revalidation |
| Dashboard, Admin | live queries, per user, no shared cache |

Tags: `posts`, `projects`, `resources`, `events`, `leaderboard`, `members`. Writes call `revalidateTag`. Check the docs for your Next.js version, since the caching API changes between releases.

## 4. Query hygiene
- Index every column you filter or sort on (already in [schema.sql](schema.sql)).
- Select only needed columns; do not load `body_md` for list pages.
- Avoid N+1 queries: fetch authors with a join.
- Paginate everything with cursors.

## 5. Images
Serve from a CDN and use `next/image` with proper widths.

## 6. Measure
Turn on slow query logging in Postgres and look at `EXPLAIN ANALYZE` for the two or three busiest queries (posts list, leaderboard, resources queue).

## Optional
A Redis cache (for example Upstash) is only worth adding if the leaderboard or rate limiting becomes a bottleneck. At club scale it is usually unnecessary.

## Next

- [09-deployment](09-deployment.md): environment and hosting
- [10-build-order](10-build-order.md): what to build first

[Back to index](README.md)
