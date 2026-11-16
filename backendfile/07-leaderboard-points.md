# 07 Leaderboard and Points

## Ledger
Every award is a row in `points_entries`. A member's score is the sum of their rows. Corrections are new rows (negative points), never edits.

## Starting rule (edit freely)
| Event | Points |
|---|---|
| Joins a project | 10 (more for open source if you want) |
| Publishes a post | 5 |
| Resource approved | 3 |
| Admin adjustment | any value with a reason |

Each award happens inside the same transaction as the action that earns it, using `source_type` and `source_id` so it cannot be awarded twice.

## Reading the leaderboard
`GET /api/leaderboard?q=&year=&tech=&cursor=` reads the `leaderboard` view, ordered by points then name. Filters:
- `year`: equals the member's year.
- `tech`: `tech_stack @> ARRAY['react']` (uses the GIN index).
- `q`: name `ILIKE`, or the tech filter above.

## Speed
- Cache the response for 30 to 60 seconds, or revalidate the `leaderboard` tag after any points insert.
- If the club grows large, turn the view into a **materialized view** and refresh it every few minutes or after awards.
- Page with a cursor on `(points, id)`.

## Next

- [08-caching-and-performance](08-caching-and-performance.md): caching
- [04-api-routes](04-api-routes.md): the leaderboard endpoint

[Back to index](README.md)
