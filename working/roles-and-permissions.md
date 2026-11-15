# Roles and Permissions

Three roles: **Visitor** (not logged in), **User** (member), **Admin**.

| Action | Visitor | User | Admin |
|---|:--:|:--:|:--:|
| Browse landing, projects, news, events | Yes | Yes | Yes |
| Read Hall of Flames and resources | Yes | Yes | Yes |
| View leaderboard, search members | Yes | Yes | Yes |
| Edit own dashboard sections | - | Yes | - |
| Write posts, recommend resources | - | Yes | - |
| Approve / reject resources | - | - | Yes |
| Create / edit events, news, links | - | - | Yes |
| Manage members and points | - | - | Yes |

*Assumption:* public pages need no login. Adjust the table if some pages should be members-only.

## How it is enforced
1. `middleware.ts` checks the session: `/dashboard/*` needs `user`, `/admin/*` needs `admin`, otherwise redirect to `/login`.
2. Every Route Handler re-checks the role and ownership (for example, only the author edits their post).
3. The UI hides actions a role cannot use, but this is a convenience, not security.

See [architecture](architecture.md) and [authentication](authentication.md).

## Connected modules

- [authentication](authentication.md) — where the role is set
- [architecture](architecture.md) — middleware and handlers
- [admin-dashboard](admin-dashboard.md) — admin-only actions
- [user-dashboard](user-dashboard.md) — user-only actions
- [content-approval](content-approval.md) — review permission

[← Back to index](README.md)
