# Our Projects

Advait's projects, each with a GitHub link, grouped by type and subtopic.

| | |
|---|---|
| Route | `/projects` (optional detail page `/projects/[id]`) |
| Access | Reading: everyone (assumed). Adding: logged-in users |
| Status | Active |
| Rendering | Server Components, with filters |

## Sections
1. **Open source projects** — Advait's complete, community-based open source projects.
2. **Individual projects** — built by one member.
3. **Group projects** — built by a team.

Every project shows its title, short description, **GitHub link**, subtopic tags and members.

## How it works
- A member adds a project (type, description, GitHub URL, subtopic, collaborators).
- The page lists projects by section; visitors filter by subtopic.
- Each member's projects also appear on their [user-dashboard](user-dashboard.md) Projects tab.
- The number of projects a member worked on feeds the [leaderboard](leaderboard.md).

## Optional GitHub integration
Use the GitHub API to show stars, contributors or recent commits. This is external and optional; the module works with plain links.

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/projects?type=&subtopic=` | List projects |
| POST | `/api/projects` | Add a project |
| PATCH / DELETE | `/api/projects/:id` | Edit or remove (owner or admin) |

## Data
`Project` (type: `open_source` \| `individual` \| `group`). See [data-model](data-model.md).

## Open question
Who may add open source projects: any member, or only admins?

## Connected modules

- [user-dashboard](user-dashboard.md) — Projects tab shows a member's projects
- [leaderboard](leaderboard.md) — project count feeds ranking
- [wall-of-builders](wall-of-builders.md) — future home of open source contributions
- [admin-dashboard](admin-dashboard.md) — management
- [data-model](data-model.md) — Project entity
- [landing-page](landing-page.md) — menu entry

[← Back to index](README.md)
