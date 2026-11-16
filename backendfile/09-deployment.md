# 09 Deployment (Vercel + Supabase)

## Environment variables
See [env.example](env.example). Set them in Vercel project settings and in `.env.local`. Never commit them.

| Variable | Used for |
|---|---|
| `DATABASE_URL` | app queries: Supabase **transaction pooler** string (port 6543) |
| `DIRECT_URL` | migrations: direct or session pooler string (port 5432) |
| `AUTH_SECRET`, `AUTH_URL` | Auth.js |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | server only: signed upload URLs |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser: upload to a signed URL |
| `GITHUB_TOKEN` | optional, project stats |

Copy the exact connection strings from the Supabase dashboard (Connect button), since hosts and ports differ by project.

## Steps
1. Push the repo to GitHub and import it into Vercel.
2. Set the Vercel function region to match the Supabase region.
3. Add the environment variables.
4. Run migrations with `DIRECT_URL` (`drizzle-kit migrate`) before each deploy.
5. Run [supabase-extras.sql](supabase-extras.sql) (security) and [seed.sql](seed.sql) (divisions); then create the first admin with the seed script.
6. Add the Supabase host to `images.remotePatterns` in `next.config`.
7. Add the custom domain and HTTPS.

## Safety
- Check your Supabase plan for automated backups and point-in-time recovery, and test a restore once.
- Free projects can pause after a period of inactivity, which makes the first request slow. Check current plan terms and upgrade before the club depends on the site.
- Keep a staging Supabase project (or branch, if your plan has it) for testing migrations.

## Next

- [12-launch-checklist](12-launch-checklist.md): final checks before going live
- [10-build-order](10-build-order.md): order of work

[Back to index](README.md)
