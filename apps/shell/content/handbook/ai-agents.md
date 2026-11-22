# AI agents (Cursor, Antigravity, and others)

Campuz360 is designed so **any** coding agent follows the same architecture. Humans remain responsible for merges and demos.

## Required context

> [!STEPS] Start every AI session
> 1. **Load `AGENTS.md`**
> 2. **Read architecture + boundaries**
> 3. **Open your backlog section**
> 4. **Respect `.cursor/rules`**
>    Cursor applies these automatically; other tools need `AGENTS.md` + `docs/` pasted or linked.

## Hard constraints

> [!IMPORTANT] Agents must not
> - Switch to Module Federation or a new auth vendor without mentor doc updates
> - Create tables outside their domain prefix
> - Put secrets in source or markdown examples
> - Disable RLS “to make the demo work”
> - Rewrite `@campuz360/auth` without a design note
> - Redesign the brand with random purple/cream themes

Do:

- Prefer editing `apps/<your-mfe>/` only
- Reuse `@campuz360/ui` and brand tokens
- Keep Server Actions form-compatible (`Promise<void>`)
- Match existing App Router + `actions.ts` patterns

## Prompt template

```text
You are working in the Campuz360 monorepo.
Read AGENTS.md and docs/mfe-boundaries.md.
I own apps/<mfe> only.
Implement user story: "<paste story + acceptance criteria>".
Follow docs/design-system.md and do not change other MFEs.
Add/adjust RLS in supabase/migrations if you add tables.
```

## Human review checklist

- [ ] Diff stays in agreed folders
- [ ] No surprise dependencies
- [ ] Permissions checked server-side
- [ ] UI uses shared primitives / tokens
- [ ] Acceptance criteria still testable manually

> [!TIP] Handbook in Shell
> After changing docs, preview them at `/handbook` — Flowdown renders callouts, steps, tabs, and Mermaid.
