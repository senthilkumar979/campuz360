# Campuz360 documentation

This handbook is the **source of truth** for architecture, design, and team rules. Humans and AI tools (Cursor, Antigravity, Claude Code, Copilot, …) must follow it.

> [!STATS]
> - **7** microfrontends
> - **1** shared Supabase project
> - **0** Module Federation

> [!TIP] Read in the app
> Open **Handbook** in the Shell (`/handbook`) for styled callouts, steps, and tabs. The same files remain readable as plain Markdown on GitHub.

## Documents

| Document | Purpose |
| --- | --- |
| [Architecture](./architecture.md) | System shape, MFE composition, data ownership |
| [MFE boundaries](./mfe-boundaries.md) | What each app owns / must not own |
| [Design system](./design-system.md) | Brand, UI tokens, layout rules |
| [Development rules](./development-rules.md) | Code style, PRs, folders, DoD |
| [Data & security](./data-and-security.md) | Supabase, RLS, secrets, audits |
| [Student onboarding](./student-onboarding.md) | First-week checklist for each trio |
| [AI agents](./ai-agents.md) | How to use AI tools safely on this repo |
| [Feature backlog map](./feature-backlog.md) | Where HTML plan stories map in the codebase |

## Module handbooks

Canonical copies live in each app at `apps/<mfe>/docs/README.md` (also mirrored under [`modules/`](./modules/) after `pnpm handbook:sync`). In Shell they appear as `/handbook/module-*`.

| Module | Doc |
| --- | --- |
| Shell | [modules/shell.md](./modules/shell.md) · [`apps/shell/docs`](../apps/shell/docs/README.md) |
| Nexus | [modules/nexus.md](./modules/nexus.md) · [`apps/nexus/docs`](../apps/nexus/docs/README.md) |
| Flow | [modules/flow.md](./modules/flow.md) · [`apps/flow/docs`](../apps/flow/docs/README.md) |
| Connect | [modules/connect.md](./modules/connect.md) · [`apps/connect/docs`](../apps/connect/docs/README.md) |
| Sphere | [modules/sphere.md](./modules/sphere.md) · [`apps/sphere/docs`](../apps/sphere/docs/README.md) |
| Residence | [modules/residence.md](./modules/residence.md) · [`apps/residence/docs`](../apps/residence/docs/README.md) |
| Pulse | [modules/pulse.md](./modules/pulse.md) · [`apps/pulse/docs`](../apps/pulse/docs/README.md) |

## Also read

- Root [`README.md`](../README.md) — setup commands
- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — PR entry point
- [`SECURITY.md`](../SECURITY.md) — security checklist
- [`.cursor/rules/`](../.cursor/rules/) — Cursor rules
- [`AGENTS.md`](../AGENTS.md) — short rules for any coding agent
- [`CLAUDE.md`](../CLAUDE.md) — Claude Code pointer

> [!IMPORTANT] Cloud accounts
> Mentors and students use **their own** Supabase and hosting accounts. Never commit project IDs, tokens, or `.env.local`.
