# 01 Stack and Setup

Final choice: **Next.js + Supabase** (Postgres and Storage) with Auth.js for login.

## The stack
| Part | Choice | Why |
|---|---|---|
| App and API | Next.js (App Router), Route Handlers | One codebase for pages and API |
| Database | Supabase Postgres | Relational data, joins, transactions, table editor for admins |
| Images | Supabase Storage (public bucket, CDN) | Same dashboard as the database |
| ORM | Drizzle | Light, typed, fine on serverless |
| Auth | Auth.js (Credentials, JWT sessions) | User and admin login, role in the token. Supabase Auth is not used |
| Validation | Zod | One schema for checks and types |
| Passwords | argon2 or bcrypt in Node route handlers only | Never in middleware (edge) |
| Hosting | Vercel, same region as the Supabase project | Lowest latency |

## Folder layout
```
app/api/<module>/route.ts   thin handlers: auth check, parse input, call a service
lib/db.ts                   Drizzle client (pooled Supabase connection)
lib/auth.ts                 Auth.js config
lib/storage.ts              Supabase Storage signed upload helper
lib/services/<module>.ts    business logic and queries
lib/validators/<module>.ts  Zod schemas
db/schema.ts                Drizzle schema
db/migrations/              generated SQL
middleware.ts               session and role guard
scripts/seed.ts             divisions and the first admin
```

## Setup
Follow [11-supabase-setup](11-supabase-setup.md) step by step, then [10-build-order](10-build-order.md).

## Next

- [11-supabase-setup](11-supabase-setup.md): project, keys, bucket, security, code
- [02-database-schema](02-database-schema.md): tables and indexes

[Back to index](README.md)
