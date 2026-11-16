# 10 Build Order

Work top to bottom. Each phase ends with something you can test.

- [ ] **0. Setup:** repo, Supabase project, Vercel project, environment variables ([11](11-supabase-setup.md)).
- [ ] **1. Schema and security:** run [schema.sql](schema.sql), then [supabase-extras.sql](supabase-extras.sql), then [seed.sql](seed.sql).
- [ ] **2. Auth:** register, login (user and admin), session, middleware guard ([03](03-auth-and-roles.md)).
- [ ] **3. Public reads:** events, projects, posts, members, divisions, social links ([04](04-api-routes.md)).
- [ ] **4. User writes:** profile and sections, posts, projects, resource submissions.
- [ ] **5. Image uploads:** `media` bucket, sign endpoint, avatar, then post and event images ([05](05-image-uploads.md)).
- [ ] **6. Admin:** approval queue and review, events and news, social links ([06](06-approval-workflow.md)).
- [ ] **7. Points and leaderboard:** awards in transactions, view, search ([07](07-leaderboard-points.md)).
- [ ] **8. Speed:** caching tags, index check, rate limits ([08](08-caching-and-performance.md)).
- [ ] **9. Launch:** deploy and run the [12-launch-checklist](12-launch-checklist.md).

## Definition of done
A member can join, log in, edit a profile with an avatar, publish a post and recommend a resource. An admin can approve it and see points move on the leaderboard. Public pages load from cache and no table is reachable through the Supabase public API.

## Next

- [01-stack-and-setup](01-stack-and-setup.md): back to the start

[Back to index](README.md)
