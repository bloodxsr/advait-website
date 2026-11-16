# 11 Supabase Setup

## 1. Create the project
- Pick the **region closest to your Vercel region** (this matters most for speed).
- Set a strong database password and store it in a password manager.

## 2. Connection strings
In the dashboard, open **Connect** and copy:
- the **transaction pooler** string (port 6543) into `DATABASE_URL`;
- the **direct** (or session pooler) string (port 5432) into `DIRECT_URL`, used only for migrations.

## 3. Lock down the public API (important)
Supabase exposes tables over a public REST API using the anon key. Tables created through migrations are **not** protected by default. Run [supabase-extras.sql](supabase-extras.sql) in the SQL editor: it turns on row level security for every table and removes access for the `anon` and `authenticated` roles. Your server connects as the database owner through `DATABASE_URL`, so it is unaffected. You can also turn off the Data API in project settings, since this app does not use it.

## 4. Create the storage bucket
- Name `media`, public, 5 MB limit, allowed types `image/jpeg, image/png, image/webp`.

## 5. Keys
- `SUPABASE_SERVICE_ROLE_KEY` (a secret key on newer projects): server only.
- Anon or publishable key: safe for the browser.

## 6. Code

`drizzle.config.ts`
```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DIRECT_URL! },
});
```

`lib/db.ts` (the pooler needs prepared statements off)
```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client);
```

`lib/storage.ts` (server only)
```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
export async function signUpload(key: string) {
  const { data, error } = await supabase.storage.from("media").createSignedUploadUrl(key);
  if (error) throw error;
  const { data: pub } = supabase.storage.from("media").getPublicUrl(key);
  return { path: data.path, token: data.token, publicUrl: pub.publicUrl };
}
```

Browser upload (uses the anon key)
```ts
await supabaseBrowser.storage.from("media").uploadToSignedUrl(path, token, file);
```

`next.config.ts`
```ts
images: { remotePatterns: [{ protocol: "https", hostname: "<project-ref>.supabase.co",
  pathname: "/storage/v1/object/public/media/**" }] }
```

## 7. Seed
Run [seed.sql](seed.sql) for the five divisions. Create the first admin with a script that hashes the password and inserts a user with `role = 'admin'`. Do not expose admin signup.

These snippets are sketches. Check the current Supabase, Drizzle and Next.js docs for exact option names in your versions.

## Next

- [12-launch-checklist](12-launch-checklist.md): final checks
- [09-deployment](09-deployment.md): Vercel and environment variables

[Back to index](README.md)
