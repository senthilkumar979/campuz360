# Flow — leave & approvals

> [!STATS]
> - **Port** `3002`
> - **basePath** `/flow`
> - **Owns** leave requests, approval tasks, request history

## Project context

Campuz360 modules are separate Next.js apps composed by Shell rewrites over one Supabase project. **Flow** is the workflow MFE for campus leave (and the pattern for multi-stage approvals). Identity always comes from **Nexus**; notifications should go through **Connect** RPCs when notifying approvers.

## What Flow owns

| Concern | Location |
| --- | --- |
| Submit + list my requests | [`app/page.tsx`](../app/page.tsx), [`app/actions.ts`](../app/actions.ts) |
| Approver task queue | [`app/tasks/page.tsx`](../app/tasks/page.tsx) |
| Request detail / history | [`app/requests/[id]/page.tsx`](../app/requests) |
| Schema + RLS | `supabase/migrations/*flow_requests*` |

## Public routes

| Path | Purpose |
| --- | --- |
| `/flow` | Submit leave; filter own requests by status |
| `/flow/tasks` | Pending items for approvers (`flow.leave.approve` / `flow.admin`) |
| `/flow/requests/[id]` | Single request timeline / decision history |

Unauthenticated users are redirected to Nexus login via `shellUrl(NEXUS_LOGIN_PATH)`.

## Data model (`flow_*`)

| Table | Role |
| --- | --- |
| `flow_requests` | Leave (or similar) requests: requester, dates, status, rationale |
| `flow_approval_events` | Decision trail (approve / reject + comments) |

Statuses typically include `pending`, approved, and rejected (see UI filters and Zod schemas in `@campuz360/contracts`).

## Permissions

| Key | Meaning |
| --- | --- |
| `flow.access` | Enter Flow |
| `flow.leave.submit` | Create leave requests |
| `flow.leave.approve` | Act on the tasks queue |
| `flow.admin` | Broad Flow administration |

Default `user` role includes `flow.access` + `flow.leave.submit`. Approvers need an explicit grant (e.g. `module_admin` or a custom grant).

## UX pattern

> [!STEPS] Happy path
> 1. Student opens `/flow`, submits leave
> 2. Row appears in their list as `pending`
> 3. Approver opens `/flow/tasks`, decides with optional comment
> 4. Event written to `flow_approval_events`; status updates
> 5. (Optional) Connect `create_notification` informs the requester

Pages wrap content in `ModuleChrome` with accent `#0095c7` and a **Home** link back to Shell.

## Local development

```bash
pnpm --filter @campuz360/flow dev   # http://localhost:3002/flow
# via Shell: http://localhost:3000/flow
```

## Must not

> [!CAUTION] Boundaries
> - Do not own user directory or profiles
> - Do not publish campus-wide announcements (Connect)
> - Do not add Module Federation remotes

## Related reading

- [Feature backlog](/handbook/backlog) — Flow section
- [MFE boundaries](/handbook/boundaries)
- Identity: [Nexus](/handbook/module-nexus) · Comms: [Connect](/handbook/module-connect)
