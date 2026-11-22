# Pulse — events & calendar

> [!STATS]
> - **Port** `3006`
> - **basePath** `/pulse`
> - **Owns** events, registration, attendance, calendar

## Project context

Campuz360 modules are Next.js apps composed by Shell rewrites on one Supabase project. **Pulse** is the events system of record. Club discussion belongs in **Sphere**; broadcast digests may use **Connect**.

## What Pulse owns

| Concern | Location |
| --- | --- |
| Event list / create / register | [`app/page.tsx`](../app/page.tsx) |
| Event detail + attendance | [`app/events/[id]/page.tsx`](../app/events) |
| Day-grouped calendar | [`app/calendar/page.tsx`](../app/calendar/page.tsx) |
| Schema + RLS | `supabase/migrations/*pulse_events*` |

## Public routes

| Path | Purpose |
| --- | --- |
| `/pulse` | Search/list events; organizers create |
| `/pulse/events/[id]` | Detail, register/waitlist, attendance tools |
| `/pulse/calendar` | Events grouped by day |

Shell global search includes `pulse_events` for users with `pulse.access`.

## Data model (`pulse_*`)

| Table | Role |
| --- | --- |
| `pulse_events` | Title, description, schedule, location, capacity |
| `pulse_registrations` | Attendee / waitlist / attendance flags |

## Permissions

| Key | Meaning |
| --- | --- |
| `pulse.access` | Browse, register |
| `pulse.organize` | Create/update events |
| `pulse.admin` | Broad Pulse administration |

## UX notes

> [!TABS]
> #### Attendees
>
> - Discover events and register
> - Waitlist when capacity is full
> - View calendar for planning
>
> #### Organizers
>
> - Need `pulse.organize` (or admin)
> - Create events with location/time
> - Manage registrations / attendance on the detail page
> - Prefer Connect notifications for reminders

`ModuleChrome` accent is `#0369a1`. Auth gate redirects to Nexus via `shellUrl`.

## Local development

```bash
pnpm --filter @campuz360/pulse dev   # http://localhost:3006/pulse
# via Shell: http://localhost:3000/pulse
```

## Must not

> [!CAUTION] Boundaries
> - Do not own club membership graphs (Sphere)
> - Do not duplicate identity (Nexus profiles)
> - Stretch analytics / Teams webhooks stay out of MVP DoD

## Related reading

- [Feature backlog](/handbook/backlog)
- [MFE boundaries](/handbook/boundaries)
- [Sphere](/handbook/module-sphere) · [Shell](/handbook/module-shell)
