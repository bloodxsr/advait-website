# ADVAIT Collective

ADVAIT is the Next.js platform for the **Association of Developers and Visionaries in AI & Tech**. It provides a public collective website, member dashboard, publishing workflow, approval system, events and gallery experience, research archive, project registry, resources library, leaderboard, and admin portal.

## Features

- Public project, team, resource, leaderboard, Hall of Flames, and Social pages
- Custom credentials authentication with HTTP-only session cookies
- Member registration and division selection
- Member profile and section editing
- Project, resource, and technical essay submission with admin approval
- Signed Supabase Storage uploads
- Event, news, photo, gallery, and Social link publishing
- Database-backed points and approval workflows
- Server-validated user and admin permissions
- Responsive CSS Modules with distinct public, Social, dashboard, and admin themes

## Stack

- Next.js 16 App Router and React
- TypeScript
- Drizzle ORM and Supabase Postgres
- Supabase Storage
- Custom JWT sessions with `jose`
- `bcryptjs` password hashing
- Zod request validation
- CSS Modules
- Vitest contract tests

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/projects` | Project registry |
| `/team` | Collective team and divisions |
| `/hall-of-builders` | Builder leaderboard |
| `/hall-of-flames` | Research and technical essays |
| `/resources` | Educational resources |
| `/leaderboard` | Contribution leaderboard |
| `/events` | Events, news, galleries, and Social channels |
| `/social` | Redirects to the Social section |
| `/login` | Sign in and Join/Register |
| `/dashboard` | Authenticated member workspace |
| `/dashboard/edit` | Member profile editor |
| `/publish` | Member submissions and admin publishing |
| `/admin` | Admin command portal |

## Project structure

```text
app/
  api/               Route handlers
  admin/             Admin portal
  dashboard/         Member dashboard and profile editor
  events/            Social, events, news, and gallery page
  publish/           Unified publishing/submission page
  login/             Sign-in and registration gateway
components/          Shared layout and UI components
db/
  migrations/        Database and security migrations
  schema.ts          Drizzle database schema
lib/
  auth.ts            Session creation and role guards
  db.ts              Database connection
  storage.ts         Server-side Supabase Storage helpers
  client-upload.ts   Browser signed-upload helper
  services/          Database business logic
  validators/        Zod input schemas
tests/               Vitest contract tests
checkpoints/         Architecture documentation
backendfile/          Backend implementation guides
```

## Local setup

Requirements:

- Node.js 20 or newer
- npm
- A Supabase project

Install dependencies:

```powershell
npm install
```

Create a local `.env` file using [`.env.example`](./.env.example).

Start development:

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

The server and browser require:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase transaction pooler connection, port `6543` |
| `DIRECT_URL` | Direct/session pooler connection used for migrations |
| `AUTH_SECRET` | Secret used to sign and verify JWT session cookies |
| `AUTH_URL` | Application/auth URL |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase Storage key |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase Storage key |

Never commit `.env`, service-role keys, database passwords, or other secrets.

## Database setup

The project uses the Drizzle schema in [`db/schema.ts`](./db/schema.ts).

Use the direct connection for migrations:

```powershell
$env:DIRECT_URL = "<supabase-direct-connection>"
npx drizzle-kit migrate
```

Database setup and security notes are documented in [`db/README.md`](./db/README.md).

The migration in [`db/migrations/0001_backend_security.sql`](./db/migrations/0001_backend_security.sql):

- Creates the persistent login rate-limit table
- Enables Row Level Security
- Revokes direct table access from Supabase `anon` and `authenticated` roles

The application uses the server-side database connection and does not rely on Supabase public table REST access.

## Supabase Storage

Create a public Supabase Storage bucket named `media`.

Recommended settings:

- Public reads enabled
- Maximum file size: 5 MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

Uploads use the server-created signed URL flow:

1. The browser requests `/api/uploads/sign`
2. The server validates authentication, role, kind, MIME type, and size
3. The browser uploads directly to Supabase Storage
4. The public URL is saved with the published record

Object keys are organized by user and content type:

```text
avatars/<userId>/<uuid>.<ext>
posts/<userId>/<uuid>.<ext>
events/<uuid>.<ext>
social/<userId>/<uuid>.<ext>
```

## Authentication and permissions

Authentication uses an HTTP-only `advait_session` cookie containing a signed JWT. Every privileged route rechecks the database role rather than relying only on the token or visible UI controls.

| Capability | Public | Member | Admin |
|---|---:|---:|---:|
| Browse public pages | Yes | Yes | Yes |
| Edit own profile | No | Yes | Yes |
| Submit a project/resource/essay | No | Yes, pending review | Direct publish |
| Publish events or news | No | No | Yes |
| Publish photo or gallery posts | No | No | Yes |
| Moderate Social posts | No | No | Yes |
| Approve submissions | No | No | Yes |
| Award points | No | No | Yes |
| Access Admin Portal | No | No | Yes |

Protected dashboard and admin pages are guarded by `proxy.ts`. API routes also enforce authentication and role checks.

## Scripts

```powershell
npm run dev       # Start the Next.js development server
npm run build     # Create a production build
npm run start     # Serve a production build
npm run lint      # Run ESLint
npm test          # Run Vitest contract tests
```

## API overview

Public routes include:

- `GET /api/events`
- `GET /api/social-posts`
- `GET /api/social-links`
- `GET /api/projects`
- `GET /api/resources`
- `GET /api/posts`
- `GET /api/divisions`
- `GET /api/leaderboard`

Authentication routes include:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Admin and member mutation routes include approval, profile, publishing, upload, points, event, project, resource, and Social moderation endpoints under `/api`.

## Deployment

Deploy the repository through Vercel or another Next.js-compatible host.

Before deploying:

1. Add every required environment variable.
2. Configure the Supabase Storage bucket.
3. Run the database migration against `DIRECT_URL`.
4. Apply and verify Supabase RLS/security settings.
5. Add the Supabase Storage host to Next.js image configuration if remote images are rendered through `next/image`.
6. Run `npm test`, `npm run lint`, and `npm run build`.
7. Keep service-role credentials server-only.

## Documentation

- [`checkpoints/PROJECT_ARCHITECTURE_AND_MODULES.md`](./checkpoints/PROJECT_ARCHITECTURE_AND_MODULES.md) - architecture and module audit
- [`backendfile/`](./backendfile/) - backend implementation guides
- [`db/README.md`](./db/README.md) - database migration and security notes

