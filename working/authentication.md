# Authentication

Handles Join (sign up) and the two login types: **User** and **Admin**.

| | |
|---|---|
| Route | `/login` (toggle or tabs: User \| Admin) |
| Access | Everyone; already logged-in users are redirected |
| Status | Active |
| Rendering | Client Component for the form, server-side validation |

## Flow
1. Visitor opens `/login` from the navbar and picks **User** or **Admin**.
2. Credentials go to `POST /api/auth/login`.
3. **Valid credentials?**
   - No → show an error and let them retry.
   - Yes → create a session that stores the **role**.
4. **Role?**
   - `user` → redirect to `/dashboard` ([user-dashboard](user-dashboard.md)).
   - `admin` → redirect to `/admin` ([admin-dashboard](admin-dashboard.md)).
5. Logout clears the session and returns to `/` ([landing-page](landing-page.md)).

## Rules
- The Admin login only accepts accounts whose role is `admin`; the User login does not grant admin access.
- Join (sign up) always creates a `user`. *Open question:* how are admin accounts created (seeded manually, or promoted by an existing admin)?
- Role checks happen on the server (middleware and Route Handlers), never only in the UI. See [roles-and-permissions](roles-and-permissions.md).

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Join (creates a user) |
| POST | `/api/auth/login` | Login for either type |
| POST | `/api/auth/logout` | End the session |
| GET | `/api/auth/session` | Current user and role |

An auth library such as Auth.js can provide most of this; the stack is not decided yet.

## Security notes
Hash passwords, rate-limit login attempts, use secure cookies, and keep the role in the session, not in anything the user can edit.

## Data
`User` (email, password hash, role). See [data-model](data-model.md).

## Connected modules

- [landing-page](landing-page.md) — Login / Join starts here, logout returns here
- [user-dashboard](user-dashboard.md) — destination for the user role
- [admin-dashboard](admin-dashboard.md) — destination for the admin role
- [roles-and-permissions](roles-and-permissions.md) — what each role may do
- [data-model](data-model.md) — User entity
- [architecture](architecture.md) — middleware and session handling

[← Back to index](README.md)
