# AGENTS.md — Campuz360

Instructions for AI coding agents (Cursor, Antigravity, Claude Code, Copilot, etc.).

## Project

Campuz360 is a **pnpm + Turborepo** monorepo of **seven vertical Next.js MFEs** composed by Shell rewrites (not Module Federation). Backend is **one Supabase project** (Auth + Postgres + RLS). Hosting and Supabase are configured by the cohort on **their own accounts**.

## Read first

- `docs/architecture.md`
- `docs/mfe-boundaries.md`
- `docs/design-system.md`
- `docs/development-rules.md`
- `docs/data-and-security.md`
- Preview docs in Shell at `/handbook` (Flowdown-rendered)

## Non-negotiables

1. Keep route-based MFEs with `basePath` + Shell rewrites.
2. Change only the owning `apps/<mfe>/` unless the user explicitly asks for shared work.
3. Use `@campuz360/ui`, `@campuz360/auth`, `@campuz360/contracts` — do not fork them silently.
4. Enable RLS on every new public table; never ship `service_role` to the client.
5. Authorize with `getUser` + permissions RPC / RLS — not `user_metadata`.
6. Follow brand tokens (primary `#00b3ee`, system font stack, `p` at 12px) — no alternate palettes or Google fonts.
7. Server Actions used as form `action` must return `void`.
8. Do not commit `.env.local` or secrets.
9. Prefer small, reviewable diffs aligned to a user story’s acceptance criteria.
10. Update docs if you intentionally change architecture.

## Commands

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## Where to put work

| Kind of change | Location |
| --- | --- |
| Feature UI / actions | `apps/<mfe>/` |
| Shared component | `packages/ui` |
| Zod / permissions / module list | `packages/contracts` |
| Auth helpers | `packages/auth` |
| SQL | `supabase/migrations/` with domain prefix |
