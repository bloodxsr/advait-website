# Architecture (Next.js)

The whole project is built in Next.js using the App Router.

## Layers
1. **Pages** (`app/...`) — Server Components by default; Client Components only where interaction is needed (forms, search, dashboards).
2. **Middleware** (`middleware.ts`) — reads the session and guards `/dashboard` and `/admin`.
3. **Route Handlers** (`app/api/<module>/route.ts`) — one route group per module.
4. **Services** (`lib/services/<module>.ts`) — business logic, so pages and handlers share it.
5. **Data** — a database through an ORM, object storage for images, optional GitHub API.

## Folder map
```
app/
  page.tsx            Landing Page            -> landing-page.md
  login/              Login / Join            -> authentication.md
  dashboard/          User Dashboard          -> user-dashboard.md
  admin/              Admin Dashboard         -> admin-dashboard.md
  hall-of-flames/     Blogs and posts         -> hall-of-flames.md
  projects/           Our Projects            -> our-projects.md
  resources/          Educational Resources   -> educational-resources.md
  leaderboard/        Leaderboard + search    -> leaderboard.md
  news/  social/      News, Social Network    -> news-events.md, social-network.md
  api/                one folder per module
middleware.ts         session check + role guard
lib/                  auth.ts, db.ts, services/
components/           navbar, cards, search bar
```

## Request flow
Browser → `middleware.ts` (role guard) → page (Server Component) or `app/api/...` handler → `lib/services` → database / storage.

## Rules for every module
- Check the role and ownership on the server ([roles-and-permissions](roles-and-permissions.md)).
- Keep logic in `lib/services`, not in components.
- Document the module with [module-template](module-template.md).

Tables and fields: [data-model](data-model.md).

## Connected modules

- [data-model](data-model.md) — tables and fields
- [roles-and-permissions](roles-and-permissions.md) — guards
- [module-template](module-template.md) — how to add a module
- [authentication](authentication.md) — session handling
- [landing-page](landing-page.md) — example of a public page
- [admin-dashboard](admin-dashboard.md) — example of a guarded page

[← Back to index](README.md)
