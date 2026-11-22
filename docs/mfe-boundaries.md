# MFE boundaries

Each trio owns one app folder. Crossing boundaries requires a short design note in the PR and review from the owning team.

> [!CAUTION] Public repo = social ownership
> There is no branch protection. Discipline replaces locks: stay in your folder.

## Ownership matrix

| MFE | Owns | Depends on | Must not own |
| --- | --- | --- | --- |
| **Shell** | Layout, nav, handbook, dashboard, search UI, 404/offline/PWA, rewrites | Nexus session + permissions; counts from Flow/Connect | Domain tables |
| **Nexus** | Auth UX, profiles, roles, orgs, directory, audit | Supabase Auth | Workflow / event / community data |
| **Flow** | Requests, approvals, history, tasks | Nexus permissions; Connect notify RPC | User directory, announcements |
| **Connect** | Announcements, inbox, preferences, notify RPC | Nexus permissions | Leave rules, housing |
| **Sphere** | Communities, posts, moderation | Nexus; Connect for notify | Events as source of truth |
| **Residence** | Buildings, rooms, allocations, maintenance | Nexus; Connect optional | Campus-wide news |
| **Pulse** | Events, registration, attendance, calendar | Nexus; Connect notify | Club membership |

## Table prefixes

| Prefix / tables | Owner |
| --- | --- |
| `profiles`, `roles`, `permissions`, `user_roles`, `org_*`, `audit_events` | Nexus |
| `flow_*` | Flow |
| `connect_*` | Connect |
| `sphere_*` | Sphere |
| `residence_*` | Residence |
| `pulse_*` | Pulse |

> [!TIP] Migrations
> `supabase migration new <domain>_<change>` — keep SQL focused on one domain.

## Permission keys

Canonical list: [`packages/contracts/src/permissions.ts`](../packages/contracts/src/permissions.ts).

- Add a key only with Nexus + consuming MFE agreement
- Seed in a Nexus migration and attach to roles intentionally
- Check with `userHasPermission` / `has_permission` on the server

## Routes

| App | `basePath` | Examples |
| --- | --- | --- |
| Shell | _(none)_ | `/`, `/search`, `/handbook` |
| Nexus | `/nexus` | `/nexus/login`, `/nexus/directory` |
| Flow | `/flow` | `/flow`, `/flow/tasks` |
| Connect | `/connect` | `/connect/notifications` |
| Sphere | `/sphere` | `/sphere/communities/[id]` |
| Residence | `/residence` | `/residence/maintenance` |
| Pulse | `/pulse` | `/pulse/events/[id]` |

Cross-MFE links use absolute paths (`href="/flow"`), never relative imports across apps.

## Shared packages

| Package | Who may change | Rule |
| --- | --- | --- |
| `@campuz360/ui` | Any team, mentor review preferred | Prefer additive APIs |
| `@campuz360/auth` | Mentor + Nexus lead | Announce breaking session changes |
| `@campuz360/contracts` | Any team with design note | Treat as a public contract |
| `@campuz360/config` | Mentor | Rare changes |

> [!TABS]
> #### Local
>
> `pnpm dev` runs all apps; Shell rewrites to localhost ports.
>
> #### Production
>
> Each app deploys separately; Shell env points remotes at those URLs. Students configure their own hosting.
