# 03 Auth and Roles

## Login flow
1. `POST /api/auth/register` creates a `user` (never an admin) with a hashed password.
2. Auth.js Credentials provider checks email and password in a Node route handler.
3. The session is a **JWT** (the Credentials provider does not support database sessions). It carries `userId` and `role`.
4. Login page toggle: **User** or **Admin**. The Admin side only accepts accounts whose role is `admin`.

## Where roles are enforced
| Layer | Check |
|---|---|
| `middleware.ts` (edge) | token exists and role matches the path: `/dashboard` needs a user, `/admin` needs an admin |
| Route Handler | re-check the role, then ownership (for example, only the author edits a post) |
| Service | never trusts the UI; receives `userId` and `role` as arguments |

Middleware only verifies the token. It does not hash passwords or query the database.

## Creating the first admin
Do not expose admin signup. Seed one admin with a script, or promote a user by running an update directly in the database. Later admins can be promoted from the Admin Dashboard.

## Security checklist
- Hash passwords with argon2 or bcrypt.
- Rate-limit login (for example 5 attempts per minute per IP and email).
- Secure, httpOnly cookies; set `AUTH_SECRET`.
- Return the same error for "wrong email" and "wrong password".
- Log admin actions (who approved what).

## Next

- [04-api-routes](04-api-routes.md): endpoints
- [06-approval-workflow](06-approval-workflow.md): the admin side

[Back to index](README.md)
