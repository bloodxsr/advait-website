# 12 Launch Checklist

## Security
- [ ] [supabase-extras.sql](supabase-extras.sql) applied; the anon key cannot read or write any table.
- [ ] Service role key is only in server environment variables.
- [ ] Admin signup does not exist; only the seeded admin can promote others.
- [ ] Passwords hashed; login is rate-limited.
- [ ] Every Route Handler checks role and ownership.
- [ ] Rendered markdown is sanitized.
- [ ] Image URLs saved by users must start with your bucket URL.

## Functionality (test each as visitor, user and admin)
- [ ] Join, log in (user and admin), log out.
- [ ] Edit profile, add and remove sections, upload an avatar.
- [ ] Publish a post with a cover image; filter by subtopic.
- [ ] Recommend a resource; admin approves; it appears; points are awarded once.
- [ ] Reject a resource; the member sees the note.
- [ ] Create an event with a picture; it shows on Events and the landing page.
- [ ] Leaderboard search by tech and year.

## Performance
- [ ] Vercel and Supabase in the same region.
- [ ] `DATABASE_URL` uses the transaction pooler.
- [ ] Public pages cached; writes revalidate the right tags.
- [ ] Busiest queries checked with `EXPLAIN ANALYZE`.

## Operations
- [ ] Backups confirmed on your plan, one restore tested.
- [ ] Project will not pause from inactivity (check plan).
- [ ] Custom domain and HTTPS working.
- [ ] A second person has access to Vercel and Supabase.

## Next

- [10-build-order](10-build-order.md): what was built, in order

[Back to index](README.md)
