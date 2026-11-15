# Landing Page

The public front door of the Advait club website.

| | |
|---|---|
| Route | `/` (`app/page.tsx`) |
| Access | Everyone (no login) |
| Status | Active |
| Rendering | Server Component (events preview is fetched on the server) |

## Purpose
Introduce the club and send visitors to the right place: browse features, or log in / join.

## Sections
1. **Club name** — logo and symbol.
2. **Vision** — what the club stands for.
3. **Events** — upcoming ones and news (a short preview, full list lives in [news-events](news-events.md)).
4. **Members info** — leader and division leaders.
5. **Contact us** — contact details.

## Navbar and menu
- Club name (home), **Events**, **Login / Join**, and a **Menu** button.
- The menu opens **More Information**: Hall of Flames, Our Projects, Leaderboard, Social Network, News.
- Wall of Builders stays out of the menu until it is enabled (see [wall-of-builders](wall-of-builders.md)).

## User flow
Visitor lands on `/` → reads sections → opens a menu page, or clicks Login / Join → [authentication](authentication.md).

## Data it reads
- Latest upcoming events / news (`Event`, see [data-model](data-model.md)).
- Members info (leader, division leaders). *Open question:* store in the database (a club-role field on `User`) or in a small config file?

## Proposed API
- `GET /api/events?limit=3` (or call the service directly from the Server Component).

## Connected modules

- [authentication](authentication.md) — Login / Join button leads here
- [news-events](news-events.md) — supplies the events and news preview
- [hall-of-flames](hall-of-flames.md) — menu link
- [our-projects](our-projects.md) — menu link
- [leaderboard](leaderboard.md) — menu link
- [social-network](social-network.md) — menu link
- [wall-of-builders](wall-of-builders.md) — hidden menu entry, skipped for now
- [architecture](architecture.md) — route and rendering conventions

[← Back to index](README.md)
