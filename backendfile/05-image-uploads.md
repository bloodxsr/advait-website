# 05 Image Uploads (Supabase Storage)

Images never pass through your database or serverless functions. The browser uploads straight to Supabase Storage with a short-lived signed upload URL.

## Flow
1. **Ask:** client calls `POST /api/uploads/sign` with `{ kind, contentType, size }`.
2. **Check:** the server verifies login, `kind` (`avatar`, `post-cover`, `event`) and the caller's role (`event` needs an admin).
3. **Sign:** the server builds the object key, calls `createSignedUploadUrl(key)` with the **service role key**, and returns `{ path, token, publicUrl }`.
4. **Upload:** the browser calls `uploadToSignedUrl(path, token, file)`.
5. **Save:** the client sends `publicUrl` with the normal API call (profile update, post, event).
6. **Serve:** pages use `next/image`; allow the Supabase host in `images.remotePatterns`.

## Bucket settings (set once)
- Bucket name `media`, **public** (read through the CDN).
- File size limit 5 MB and allowed types `image/jpeg, image/png, image/webp`, set in the bucket settings so the limit is enforced by Supabase, not only by your code.

## Keys
`avatars/{userId}/{uuid}.webp`, `posts/{userId}/{uuid}.webp`, `events/{uuid}.webp`

When saving a URL, check that it starts with your bucket's public URL and, for avatars and posts, with the caller's own prefix. This stops people attaching someone else's image.

## Rules
- The service role key stays on the server. Never put it in a `NEXT_PUBLIC_` variable.
- The browser only needs the public (anon / publishable) key to run `uploadToSignedUrl`.
- Orphan files (uploaded but never saved) can be cleaned up later with a scheduled job.

Code samples are in [11-supabase-setup](11-supabase-setup.md).

## Next

- [11-supabase-setup](11-supabase-setup.md): storage helper code
- [06-approval-workflow](06-approval-workflow.md): admin review

[Back to index](README.md)
