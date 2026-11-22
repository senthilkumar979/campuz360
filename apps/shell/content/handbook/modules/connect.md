# Connect — announcements & inbox

> [!STATS]
> - **Port** `3003`
> - **basePath** `/connect`
> - **Owns** announcements, inbox, preferences, notify RPC

## Project context

Campuz360 is a Shell-composed set of Next.js MFEs on shared Supabase. **Connect** is the communication hub: other modules should notify users through Connect rather than inventing per-app inboxes. Shell’s notification bell deep-links to `/connect/notifications`.

## What Connect owns

| Concern | Location |
| --- | --- |
| Announcements feed + publish | [`app/page.tsx`](../app/page.tsx) |
| Inbox (mark read / delete) | [`app/notifications/page.tsx`](../app/notifications/page.tsx) |
| Email/channel preferences | [`app/settings/page.tsx`](../app/settings/page.tsx) |
| Schema + `create_notification` | `supabase/migrations/*connect_notifications*` |

## Public routes

| Path | Purpose |
| --- | --- |
| `/connect` | Announcements; publishers create posts with audience |
| `/connect/notifications` | Personal inbox |
| `/connect/settings` | Preference toggles (workflow / announcements / events) |

## Data model (`connect_*`)

| Table / RPC | Role |
| --- | --- |
| `connect_announcements` | Campus or scoped announcements |
| `connect_notifications` | Per-user inbox rows |
| `connect_preferences` | Opt-in/out preferences |
| `create_notification(...)` | Security definer helper for other MFEs |

> [!TIP] Cross-MFE notify
> Flow, Sphere, Pulse, etc. should call `create_notification` (or a documented contract) instead of writing `connect_notifications` directly when possible.

## Permissions

| Key | Meaning |
| --- | --- |
| `connect.access` | Enter Connect / read inbox |
| `connect.announce` | Publish announcements |
| `connect.admin` | Administer Connect |

## Shell integration

- Header bell → `/connect/notifications`
- Dashboard unread count queries `connect_notifications` where `is_read = false`

## Local development

```bash
pnpm --filter @campuz360/connect dev   # http://localhost:3003/connect
# via Shell: http://localhost:3000/connect
```

Optional later: Resend / SMTP for real email (`RESEND_API_KEY` in `.env.example` comments). MVP can stay in-app inbox only.

## Must not

> [!CAUTION] Boundaries
> - No leave approval rules (Flow)
> - No housing inventory (Residence)
> - Keep `create_notification` grants tight (authenticated only; not anon)

## Related reading

- [Data & security](/handbook/security)
- [Feature backlog](/handbook/backlog)
- [Shell](/handbook/module-shell) · [Flow](/handbook/module-flow)
