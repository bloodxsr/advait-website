# Module Template

Use this to add a new module (or to enable [wall-of-builders](wall-of-builders.md)).

## Checklist
1. Add the page under `app/<module>/page.tsx`.
2. Add a link to the menu on the [landing-page](landing-page.md).
3. Add Route Handlers under `app/api/<module>/`.
4. Add `lib/services/<module>.ts` for the logic.
5. Add tables to the [data-model](data-model.md).
6. Add rules to [roles-and-permissions](roles-and-permissions.md).
7. Copy the structure below into a new `<module>.md`, then link it from [README](README.md) and from every module it touches.

## Structure for a module file
```
# Module name
| Route | Access | Status | Rendering |
## Purpose
## How it works / user flow
## Pages
## Proposed API
## Data
## Open questions
## Connected modules
```
Every module file ends with a **Connected modules** list, so no file is left isolated.

## Connected modules

- [architecture](architecture.md) — folder and layer rules
- [wall-of-builders](wall-of-builders.md) — first module to enable with this template
- [data-model](data-model.md) — where tables go
- [roles-and-permissions](roles-and-permissions.md) — where rules go

[← Back to index](README.md)
