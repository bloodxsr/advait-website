# Leaderboard

Ranks members by points and lets visitors search the member list.

| | |
|---|---|
| Route | `/leaderboard` |
| Access | Reading: everyone (assumed) |
| Status | Active (points rule still to be decided) |
| Rendering | Server Component list, Client Component search bar |

## Page
- **Search bar**: search by tools, tech or year across the listed members.
- **Member rows**: member info, points, and the number of projects worked on.
- Click a row to open the member's profile (see the open question in [user-dashboard](user-dashboard.md)).

## Points: open item
The sketch asks for a method and metric for **automatic** point assignment based on each person's contribution. Points are stored as a ledger (`PointsEntry`) so any rule can be applied or changed later.

**Proposed starting rule (edit freely):**
| Contribution | Source module | Example points |
|---|---|---|
| Project worked on | [our-projects](our-projects.md) | 10 per project (more for open source) |
| Blog post published | [hall-of-flames](hall-of-flames.md) | 5 per post |
| Resource approved | [educational-resources](educational-resources.md) | 3 per resource |
| Manual adjustment | [admin-dashboard](admin-dashboard.md) | set by admin |

Flow: member contributes → rule awards points → ledger updates → leaderboard re-ranks (recalculate when rules change).

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/leaderboard?q=&year=&tech=` | Ranked, filtered list |
| POST | `/api/points` | Award or adjust points (system or admin) |

## Data
`PointsEntry`, plus `User` and `Project` counts. See [data-model](data-model.md).

## Connected modules

- [our-projects](our-projects.md) — projects worked on, points source
- [hall-of-flames](hall-of-flames.md) — points source
- [educational-resources](educational-resources.md) — points source
- [user-dashboard](user-dashboard.md) — member profile and rank
- [admin-dashboard](admin-dashboard.md) — manual points
- [wall-of-builders](wall-of-builders.md) — future page that links to leaderboards
- [data-model](data-model.md) — PointsEntry

[← Back to index](README.md)
