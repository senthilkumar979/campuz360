# Campuz360

One campus platform · seven independently deployable **Next.js microfrontends** · shared **Supabase** backend.

A MentorBridge teaching product. Students develop in a **public monorepo** with **folder ownership** (no required branch protection).

## Documentation (start here)

| Doc | Why |
| --- | --- |
| [docs/README.md](./docs/README.md) | Handbook index (also `/handbook` in Shell) |
| [docs/student-onboarding.md](./docs/student-onboarding.md) | First-week checklist |
| [docs/architecture.md](./docs/architecture.md) | System design |
| [docs/mfe-boundaries.md](./docs/mfe-boundaries.md) | What each team owns |
| [docs/design-system.md](./docs/design-system.md) | Brand & UI |
| [docs/development-rules.md](./docs/development-rules.md) | Code & PR rules |
| [docs/data-and-security.md](./docs/data-and-security.md) | RLS & secrets |
| [docs/ai-agents.md](./docs/ai-agents.md) | Cursor / Antigravity / other AI tools |
| [AGENTS.md](./AGENTS.md) | Short rules every coding agent must load |
| [SECURITY.md](./SECURITY.md) | Security checklist |

## Apps

| App | Path | Port | Folder |
| --- | --- | --- | --- |
| Shell (host) | `/` | 3000 | `apps/shell` |
| Nexus | `/nexus` | 3001 | `apps/nexus` |
| Flow | `/flow` | 3002 | `apps/flow` |
| Connect | `/connect` | 3003 | `apps/connect` |
| Sphere | `/sphere` | 3004 | `apps/sphere` |
| Residence | `/residence` | 3005 | `apps/residence` |
| Pulse | `/pulse` | 3006 | `apps/pulse` |

Shared packages: `packages/ui`, `packages/auth`, `packages/contracts`, `packages/config`.

## Stack

Next.js · React · TypeScript · Tailwind CSS · Radix · Supabase (PostgreSQL + Auth + RLS) · pnpm · Turborepo

Composition: **vertical / multi-zone** (Shell HTTP rewrites). Not Module Federation.

## Cloud accounts

Mentors and students use **their own** Supabase and hosting accounts (for example Vercel Hobby).

- Do **not** commit project IDs, tokens, or `.env.local`
- Copy [`.env.example`](./.env.example) → `.env.local`
- Deploy each app with root directory `apps/<name>` and set Shell rewrite URLs to the remote deployments
- Apply SQL from `supabase/migrations/` to your Supabase project (`supabase db push` or SQL editor)

## Local setup

```bash
pnpm install
cp .env.example .env.local   # add your Supabase URL + anon key
pnpm dev                     # all apps; Shell at http://localhost:3000
```

Optional local database (Docker required):

```bash
supabase start
supabase db reset
```

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run all apps |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript across workspace |
| `pnpm test` | Unit tests |
| `pnpm lint` | Lint apps |

## Ownership (public GitHub)

- Each trio owns `apps/<mfe>/` and matching migration prefixes
- Branches: `<mfe>/<short-desc>`
- Soft reviewer hints: [`.github/CODEOWNERS`](./.github/CODEOWNERS) (not enforced)
- Shared package PRs need a short design note

## Promote a platform admin

After signup, in your Supabase SQL editor:

```sql
insert into public.user_roles (user_id, role_id)
select '<USER_UUID>', id from public.roles where key = 'platform_admin';
```
