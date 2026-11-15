# Hall of Flames

Blogs, posts and other content created by club members, organised by subtopics.

| | |
|---|---|
| Routes | `/hall-of-flames`, `/hall-of-flames/[slug]`, `/hall-of-flames/new` |
| Access | Reading: everyone (assumed). Writing: logged-in users |
| Status | Active |
| Rendering | Server Components for list and post pages, Client Component for the editor |

## How it works
1. A member writes a post (from the editor or the Blog posts tab of [user-dashboard](user-dashboard.md)).
2. They pick a **subtopic** so posts are easy to tell apart.
3. The post appears on `/hall-of-flames`, where visitors can filter by subtopic.
4. The author can edit or delete their own posts; an admin can moderate any post.

## Pages
- **List**: post cards, subtopic filter chips, search *(optional)*.
- **Post page**: title, author, subtopic, date, content.
- **Editor**: title, subtopic, body.

## Relationship with Educational Resources
[educational-resources](educational-resources.md) is similar in layout but **requires admin approval**, and is reached from this area. Posts here are not approval-gated unless you decide so (see [content-approval](content-approval.md)).

## Proposed API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/posts?subtopic=` | List posts |
| POST | `/api/posts` | Create (user) |
| PATCH / DELETE | `/api/posts/:id` | Edit or delete (author or admin) |
| GET | `/api/subtopics` | List subtopics |

## Data
`Post`, `Subtopic`. See [data-model](data-model.md).

## Points
Publishing a post can award points ([leaderboard](leaderboard.md), rule still to be decided).

## Connected modules

- [user-dashboard](user-dashboard.md) — Blog posts tab and authoring
- [educational-resources](educational-resources.md) — sibling module, approval-gated
- [admin-dashboard](admin-dashboard.md) — moderation
- [leaderboard](leaderboard.md) — posts can award points
- [content-approval](content-approval.md) — optional approval for posts
- [data-model](data-model.md) — Post and Subtopic
- [landing-page](landing-page.md) — menu entry

[← Back to index](README.md)
