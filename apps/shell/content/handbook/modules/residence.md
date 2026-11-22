# Residence — housing & maintenance

> [!STATS]
> - **Port** `3005`
> - **basePath** `/residence`
> - **Owns** buildings, rooms, allocations, maintenance, housing announcements

## Project context

Campuz360 is a Shell-hosted vertical MFE platform on shared Supabase. **Residence** covers on-campus housing operations. Campus-wide news stays in **Connect**; identity stays in **Nexus**.

## What Residence owns

| Concern | Location |
| --- | --- |
| My room, allocations, admin inventory | [`app/page.tsx`](../app/page.tsx) |
| Maintenance tickets | [`app/maintenance/page.tsx`](../app/maintenance/page.tsx) |
| Schema + RLS | `supabase/migrations/*residence_housing*` |

## Public routes

| Path | Purpose |
| --- | --- |
| `/residence` | Resident view (my room, room-change) + admin building/room/allocation tools |
| `/residence/maintenance` | Report issues; staff close/update tickets |

## Data model (`residence_*`)

| Table | Role |
| --- | --- |
| `residence_buildings` / `residence_rooms` | Inventory |
| `residence_allocations` | Who lives where; check-in/out |
| `residence_change_requests` | Room-change workflow |
| `residence_maintenance` | Tickets |
| `residence_announcements` | Housing-scoped alerts (not Connect campus news) |

## Permissions

| Key | Meaning |
| --- | --- |
| `residence.access` | Resident self-service |
| `residence.maintenance` | Staff maintenance queue |
| `residence.admin` | Buildings, rooms, allocations |

## UX notes

> [!STEPS] Resident path
> 1. Sign in (Nexus)
> 2. Open `/residence` to see allocation
> 3. Request a room change if needed
> 4. File maintenance at `/residence/maintenance`

> [!STEPS] Admin path
> 1. Requires `residence.admin`
> 2. Create buildings/rooms
> 3. Allocate residents; check in/out
> 4. Publish housing announcements on the main Residence page

## Local development

```bash
pnpm --filter @campuz360/residence dev   # http://localhost:3005/residence
# via Shell: http://localhost:3000/residence
```

## Must not

> [!CAUTION] Boundaries
> - Do not replace Connect for campus-wide announcements
> - Do not own club membership (Sphere)
> - Keep RLS so residents only see appropriate allocation/maintenance rows

## Related reading

- [Feature backlog](/handbook/backlog)
- [Data & security](/handbook/security)
- [Nexus](/handbook/module-nexus) · [Connect](/handbook/module-connect)
