# Data Model

The database technology is not decided yet; this is the logical model. Fields are proposals.

| Entity | Main fields | Used by |
|---|---|---|
| `User` | id, name, email, passwordHash, role (`user`\|`admin`), year, section, department, avatarUrl, techStack[] | [authentication](authentication.md), [user-dashboard](user-dashboard.md) |
| `ProfileSection` | id, userId, type (`about`\|`projects`\|`research`\|`certificates`\|`blog`), title, content, order, visible | [user-dashboard](user-dashboard.md) |
| `Subtopic` | id, name, scope (`post`\|`project`) | [hall-of-flames](hall-of-flames.md), [our-projects](our-projects.md) |
| `Post` | id, authorId, title, body, subtopicId, createdAt, updatedAt | [hall-of-flames](hall-of-flames.md) |
| `Project` | id, title, description, type (`open_source`\|`individual`\|`group`), githubUrl, subtopicId, memberIds[] | [our-projects](our-projects.md) |
| `Resource` | id, title, link, description, tags[], status, submittedBy, reviewedBy, reviewNote | [educational-resources](educational-resources.md), [content-approval](content-approval.md) |
| `Paper` | id, title, url, tags[] | [research-papers](research-papers.md) |
| `Event` | id, kind (`event`\|`news`), title, description, imageUrl, date | [news-events](news-events.md) |
| `SocialLink` | id, platform, url | [social-network](social-network.md) |
| `PointsEntry` | id, userId, reason, sourceType, sourceId, points, createdAt | [leaderboard](leaderboard.md) |

## Relationships
- A `User` has many `ProfileSection`, `Post`, `Resource`, `PointsEntry`.
- A `Project` has many member `User`s.
- `Post` and `Project` each belong to one `Subtopic`.
- A leaderboard score is the sum of a user's `PointsEntry` rows.

## External and storage
Object storage holds profile pictures and event images. The GitHub API is optional, for project details.

## Connected modules

- [architecture](architecture.md) — how the data is reached
- [roles-and-permissions](roles-and-permissions.md) — who can read or write what
- [content-approval](content-approval.md) — status fields

[← Back to index](README.md)
