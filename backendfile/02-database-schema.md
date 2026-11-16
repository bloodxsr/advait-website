# 02 Database Schema

The full, runnable SQL is in [schema.sql](schema.sql). Summary:

| Table | Purpose | Key indexes |
|---|---|---|
| `divisions` | RED, OPS, EVED, Creatives, GameVeda | unique `slug` |
| `users` | members and admins, role, tech stack, division | unique `lower(email)`, `division_id` |
| `profile_sections` | About, Projects, Research work, Certificates, Blog posts | `(user_id, position)` |
| `subtopics` | categories for posts and projects | unique `(scope, name)` |
| `posts` | Hall of Flames, markdown body | unique `slug`, `(subtopic_id, created_at desc)` |
| `projects`, `project_members` | open source, individual, group, GitHub link | `(type, created_at desc)` |
| `resources` | educational resources with approval status | `(status, created_at desc)`, GIN on `tags` |
| `papers` | research paper list | GIN on `tags` |
| `events` | events and news with image | `(kind, starts_at)` |
| `social_links` | club social links | unique `platform` |
| `points_entries` | points ledger | `(user_id)`, unique per source |
| `leaderboard` (view) | points and project count per member | none, cache the result |

## Rules
- Every foreign key has an index on the child column.
- Images are stored as URLs only. The files live in object storage ([05-image-uploads](05-image-uploads.md)).
- Blog bodies are markdown text. Sanitize when rendering, not when storing.
- `resources.status` is an enum: `pending`, `approved`, `rejected`. Public queries always filter on `approved`.
- Points are never edited. Add a new row to correct a mistake. The unique source index stops the same contribution awarding points twice.
- Run [supabase-extras.sql](supabase-extras.sql) after the schema so the tables are not reachable through Supabase's public API.
- Divisions and the leader / division lead flags were added to match the final frontend (Team and Divisions pages).

## Next

- [schema.](schema.sql): the SQL
- [03-auth-and-roles](03-auth-and-roles.md): who may read and write what

[Back to index](README.md)
