# Data & security

## Principles

> [!STATS]
> - **RLS** on every public table
> - **getUser()** on the server
> - **Never** `service_role` in the browser

1. Default deny with RLS; add explicit policies.
2. Verify the user with `getUser()` — not client-only guesses.
3. Authorize with DB roles/permissions — never editable `user_metadata`.
4. Least privilege for keys and RPCs.
5. Audit sensitive Nexus actions into `audit_events`.

## Schema ownership

See [MFE boundaries](./mfe-boundaries.md). Do not create another team’s tables without transferring ownership.

## Auth

- Provider: Supabase Auth (email/password for MVP)
- Helpers: `@campuz360/auth/server`, `/client`, `/middleware`
- Password reset and signup live in **Nexus**

### Promote a platform admin

```sql
insert into public.user_roles (user_id, role_id)
select '<USER_UUID>', id from public.roles where key = 'platform_admin'
on conflict do nothing;
```

## Permissions RPC

- `get_user_permissions(p_user_id uuid) → text[]`
- `has_permission(p_user_id uuid, p_permission text) → boolean`

Prefer TypeScript wrappers in `@campuz360/auth/server`.

## Notifications

```sql
create_notification(p_user_id, p_title, p_message, p_link, p_category)
```

Respect `connect_preferences`. Email providers stay server-side only.

## Secrets

| Secret | Where | Client? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Hosting + `.env.local` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Hosting + `.env.local` | Yes (RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server / mentor tooling | **Never** |
| SMTP / Resend | Connect server env | **Never** |

> [!WARNING]
> If a key was committed by mistake, rotate it immediately and purge from git history with mentor help.

## Migration rules

> [!STEPS] Safe SQL change
> 1. **Create migration**
>    `supabase migration new <domain>_<change>`
> 2. **One domain**
>    Prefer focused migrations
> 3. **RLS same PR**
>    Enable policies with the table
> 4. **Grant execute carefully**
>    Only when `authenticated` should call an RPC
> 5. **Run advisors**
>    After applying to a hosted project

## Threat notes

> [!CAUTION] Common student mistakes
> - Hiding a button is not authorization
> - Directory leaks (emails/roles to non-admins)
> - XSS via unsanitized post HTML
> - IDOR by trusting client-supplied ids without RLS
