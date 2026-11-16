# Database migrations and security

Run migrations with the direct Supabase connection:

```powershell
$env:DIRECT_URL = "<direct connection string>"
npx drizzle-kit migrate
```

`0001_backend_security.sql` creates the persistent login rate-limit table and
enables row-level security on every existing public table while removing direct
Data API access for `anon` and `authenticated`. The application uses the
server-side database owner connection, so existing server queries continue to
work without exposing tables through Supabase's Data API.

Review any future public Data API requirement before adding a policy. Do not
grant broad `anon` or `authenticated` access as a shortcut.
