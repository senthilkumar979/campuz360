# Nexus — identity & access

> [!STATS]
> - **Port** `3001`
> - **basePath** `/nexus`
> - **Owns** auth UX, profiles, roles, orgs, directory, audit

## Project context

Campuz360 is seven Next.js vertical MFEs composed by **Shell rewrites** (not Module Federation), sharing one **Supabase** Auth + Postgres + RLS project. Nexus is the **identity spine**: every other module trusts Nexus roles/permissions rather than inventing its own user tables.

> [!IMPORTANT] Who signs users in
> Password signup, sign-in, and reset live here. Shell and other MFEs only consume the session.

## What Nexus owns

| Concern | Location |
| --- | --- |
| Login / signup / reset | [`app/login/page.tsx`](../app/login/page.tsx), [`app/actions.ts`](../app/actions.ts) |
| Identity dashboard | [`app/page.tsx`](../app/page.tsx) |
| Profile | [`app/profile/page.tsx`](../app/profile/page.tsx) |
| Directory + grant/suspend | [`app/directory/page.tsx`](../app/directory/page.tsx) |
| Roles / orgs / audit admin | [`app/admin/*`](../app/admin) |
| Schema + RLS | [`supabase/migrations/*nexus_identity*`](../../../supabase/migrations) |

## Public routes (via Shell)

| Path | Purpose |
| --- | --- |
| `/nexus` | Dashboard — counts, module access cards |
| `/nexus/login` | Sign in, create account, forgot password |
| `/nexus/profile` | Display name + phone |
| `/nexus/directory` | Search users; admins grant roles / suspend |
| `/nexus/admin/roles` | Role → permission matrix (read) |
| `/nexus/admin/orgs` | Org units + membership assign |
| `/nexus/admin/audit` | Sensitive action log |

> [!NOTE] basePath
> Inside the Nexus app, `redirect('/login')` becomes `/nexus/login`. Cross-MFE redirects must use absolute Shell URLs (`shellUrl` from `@campuz360/auth`).

## Data model (prefix: identity tables)

| Table | Role |
| --- | --- |
| `profiles` | 1:1 with `auth.users`; `is_active` for suspension |
| `roles` / `permissions` / `role_permissions` | RBAC catalog |
| `user_roles` | Grants (optional `module_scope`, `org_unit_id`) |
| `org_units` / `org_memberships` | Campus structure |
| `audit_events` | Grants, suspensions, etc. |
| Storage bucket `avatars` | Ready for avatar uploads (UI may still be thin) |

On signup, trigger `handle_new_user` creates a profile and assigns the default **`user`** role (module access + leave submit).

## Permissions Nexus cares about

| Key | Meaning |
| --- | --- |
| `nexus.access` | Enter Nexus |
| `nexus.admin` | Roles, orgs, directory admin actions |
| `nexus.audit` | View audit log |

Default roles: `user`, `module_admin`, `platform_admin` (see migration seed + `@campuz360/contracts` `ROLE_KEYS`).

> [!WARNING] First admin
> There is no automatic `platform_admin` for the first signup. Promote a user in Supabase SQL/Studio, then use Directory to grant further roles.

## Auth rules

> [!STEPS] Server authorization
> 1. `getUser()` from `@campuz360/auth/server` (validates JWT via Supabase)
> 2. Check `userHasPermission` / `has_permission` RPC — **never** authorize from `user_metadata`
> 3. Rely on RLS for table access
> 4. Audit sensitive writes into `audit_events`

## Local development

```bash
pnpm --filter @campuz360/nexus dev   # http://localhost:3001/nexus
# or via Shell rewrite:
# http://localhost:3000/nexus
```

Requires `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see root `.env.example`).

## Must not

> [!CAUTION] Boundaries
> - No leave / announcement / community / housing / event tables
> - No Module Federation
> - Never ship `service_role` to the client

## Related reading

- [Architecture](/handbook/architecture)
- [Data & security](/handbook/security)
- [MFE boundaries](/handbook/boundaries)
- Host: [Shell](/handbook/module-shell)
