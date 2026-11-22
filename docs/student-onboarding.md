# Student onboarding

Welcome to Campuz360 (MentorBridge). You work in a **public monorepo** with **folder ownership**, not private repos or enforced branch protection.

> [!NOTE] Your trio owns one folder
> Pick your `apps/<mfe>` and treat other teams' apps as off-limits unless you coordinate a shared-package change.

## Before coding (day 0)

> [!STEPS] Day 0 setup
> 1. **Install tooling**
>    *Node 22+, pnpm, Git; Docker recommended*
>    Docker is only needed for local `supabase start`.
> 2. **Clone & read**
>    Architecture → boundaries → design → rules → your backlog section.
> 3. **Confirm ownership**
>    Which three people own which `apps/<mfe>` folder?
> 4. **Get env values**
>    Your cohort's Supabase URL + anon key (or local Supabase).
> 5. **Boot the monorepo**

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

> Open Shell at `http://localhost:3000` and the handbook at `/handbook`.

## First-week goals

| Team | First vertical slice |
| --- | --- |
| Nexus | Sign-in + profile update + one admin role grant |
| Shell | Permission-aware nav + dashboard tiles |
| Flow | Submit leave + see status |
| Connect | Inbox list + mark read |
| Sphere | Create community + post |
| Residence | Create building/rooms + one allocation |
| Pulse | Create event + register |

> [!WARNING] Stretch features wait
> Teams/Slack hooks, workflow designer UI, blog CMS, and analytics are **out of MVP** until core stories pass DoD.

## Daily habits

- Stand-up: blockers on **contracts** and **permissions** first
- Pull `main` often; keep branches short-lived
- Demo **acceptance criteria**, not just “code pushed”
- Use the handbook when reviewing AI diffs

## Using AI tools

> [!TABS]
> #### Allowed
>
> - Cursor, Antigravity, Copilot, Claude Code, etc.
> - Point them at `AGENTS.md` + `docs/`
> - Keep changes inside your MFE unless coordinated
>
> #### Required
>
> - Review every diff for RLS, secrets, and boundary violations
> - Explain the change in standup without reading the chat
> - Follow [ai-agents.md](./ai-agents.md)

## Help ladder

1. Your trio + this `docs/` folder / Shell handbook
2. Owning team of a shared package or other MFE
3. Mentor office hours
