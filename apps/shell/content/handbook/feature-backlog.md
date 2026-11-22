# Feature backlog map

Maps the product plan to code. Full story text lives in the MentorBridge HTML plan; this file tells students **where to implement**.

> [!TIP] Module handbooks
> Each MFE also has a Flowdown self-doc at `apps/<mfe>/docs/README.md`, browsable in Shell as `/handbook/module-*` after `pnpm handbook:sync`.

> [!NOTE]
> Stretch / optional items (workflow designer, Teams webhooks, blog CMS, Connect analytics) stay **out of MVP DoD**.

## Shell — `apps/shell`

| Feature | Primary location |
| --- | --- |
| Global layout & nav | `components/ShellLayout.tsx` |
| Auth gate / sign-out | `app/page.tsx`, `app/actions.ts` |
| Dashboard tiles | `app/page.tsx` |
| Handbook (Flowdown) | `app/handbook/*`, `lib/handbook.ts` |
| Global search | `app/search/page.tsx` |
| Notifications bell | header → `/connect/notifications` |
| 404 | `app/not-found.tsx` |
| PWA / offline | `app/manifest.ts`, `public/offline.html` |

## Nexus — `apps/nexus`

| Feature | Location |
| --- | --- |
| Sign-in / sign-up / reset | `app/login/page.tsx`, `app/actions.ts` |
| Profile | `app/profile/page.tsx` |
| Directory | `app/directory/page.tsx` |
| Roles / orgs / audit | `app/admin/*` |
| Schema | `supabase/migrations/*nexus_identity*` |

## Flow — `apps/flow`

| Feature | Location |
| --- | --- |
| Leave submit + list | `app/page.tsx`, `app/actions.ts` |
| Approver tasks | `app/tasks/page.tsx` |
| History | `app/requests/[id]/page.tsx` |
| Schema | `supabase/migrations/*flow_requests*` |

## Connect — `apps/connect`

| Feature | Location |
| --- | --- |
| Announcements | `app/page.tsx` |
| Inbox | `app/notifications/page.tsx` |
| Preferences | `app/settings/page.tsx` |
| Schema | `supabase/migrations/*connect_notifications*` |

## Sphere / Residence / Pulse

| MFE | Key routes | Schema prefix |
| --- | --- | --- |
| Sphere | `app/page.tsx`, `app/communities/[id]/page.tsx` | `sphere_*` |
| Residence | `app/page.tsx`, `app/maintenance/page.tsx` | `residence_*` |
| Pulse | `app/page.tsx`, `app/events/[id]/page.tsx`, `app/calendar/page.tsx` | `pulse_*` |

## Shared contracts

| Concern | File |
| --- | --- |
| Module catalog | `packages/contracts/src/modules.ts` |
| Permission keys | `packages/contracts/src/permissions.ts` |
| Zod schemas | `packages/contracts/src/schemas.ts` |
