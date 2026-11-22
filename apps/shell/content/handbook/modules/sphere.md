# Sphere — communities & collaboration

> [!STATS]
> - **Port** `3004`
> - **basePath** `/sphere`
> - **Owns** communities, posts, comments, moderation, membership

## Project context

Campuz360 modules are independently deployable Next.js apps behind Shell. **Sphere** is the social / clubs layer. Calendar **events** belong to **Pulse** — Sphere may link or discuss them but must not become the events source of truth.

## What Sphere owns

| Concern | Location |
| --- | --- |
| Community list / create / join | [`app/page.tsx`](../app/page.tsx) |
| Community detail, posts, moderation | [`app/communities/[id]/page.tsx`](../app/communities) |
| Schema + RLS | `supabase/migrations/*sphere_communities*` |

## Public routes

| Path | Purpose |
| --- | --- |
| `/sphere` | Search/list communities; create; request/join |
| `/sphere/communities/[id]` | Feed, comments, join approvals, moderate |

Shell global search queries `sphere_communities` when the user has `sphere.access`.

## Data model (`sphere_*`)

| Table | Role |
| --- | --- |
| `sphere_communities` | Club / community metadata (public vs private) |
| `sphere_memberships` | Members + pending join requests |
| `sphere_posts` / `sphere_comments` | Discussion |
| `sphere_reports` | Moderation reports |

## Permissions

| Key | Meaning |
| --- | --- |
| `sphere.access` | Browse / join / post (per RLS) |
| `sphere.moderate` | Delete posts/comments, handle reports, approve joins |
| `sphere.admin` | Broad Sphere admin |

## UX notes

> [!TABS]
> #### Members
>
> - Discover communities
> - Join public or request private
> - Post and comment inside a community
>
> #### Moderators
>
> - Approve private join requests
> - Remove content / act on reports
> - Prefer notifying users via Connect when actions matter

Wrap pages with `ModuleChrome` (accent `#0ea5a4`). Unauthenticated users redirect to Nexus login.

## Local development

```bash
pnpm --filter @campuz360/sphere dev   # http://localhost:3004/sphere
# via Shell: http://localhost:3000/sphere
```

## Must not

> [!CAUTION] Boundaries
> - Do not own canonical event schedules (Pulse)
> - Do not store campus-wide news as announcements (Connect)
> - Do not duplicate profiles — use Nexus `profiles` ids

## Related reading

- [MFE boundaries](/handbook/boundaries)
- [Feature backlog](/handbook/backlog)
- [Pulse](/handbook/module-pulse) · [Connect](/handbook/module-connect)
