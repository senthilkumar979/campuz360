# Development rules

These rules apply to every student team and every AI-assisted change.

## Tooling

| Tool | Standard |
| --- | --- |
| Package manager | **pnpm** only |
| Node | **22+** |
| Language | TypeScript strict; avoid `any` |
| UI | Functional React; App Router |
| Validation | Zod in `@campuz360/contracts` (+ app-local when private) |
| Data | Server Components + Server Actions first |

## Code style

- Prefer **named exports**
- Booleans: `isLoading`, `hasError`, `canApprove`
- Keep component/hook files under ~150 lines
- Early returns for auth and validation
- Form Server Actions return `void` (`Promise<void>`)
- Use `packages/auth` — no second Supabase client helper per app

## Git & PR workflow

> [!STEPS] Shipping a change
> 1. **Branch**
>    `<mfe>/<short-desc>` (e.g. `flow/leave-attachments`)
> 2. **Scope**
>    Touch one `apps/<mfe>` when possible
> 3. **Shared packages**
>    Add a **Design note** section in the PR body
> 4. **CI green**
>    typecheck, test, build
> 5. **Owners review**
>    Ask the owning team if you touch their folder

> [!CAUTION]
> Never force-push `main`. Never commit `.env.local` or keys.

### Commit messages

Short, imperative, “why” focused:

- `fix flow: block leave submit without reason`
- `feat nexus: add org membership assignment`

## Definition of Done (story)

- [ ] Acceptance criteria demonstrable
- [ ] Happy path + validation errors work
- [ ] Unauthorized users blocked (UI + server + RLS)
- [ ] Empty/error states handled
- [ ] Types pass; tests updated when needed

## Testing

| Level | Expectation |
| --- | --- |
| Unit | Zod/contracts and pure helpers (Vitest) |
| Integration | Server Actions against local/hosted Supabase |
| E2E | Playwright in `e2e/` — expand per MFE |

## Environments

> [!TABS]
> #### Local
>
> ```bash
> cp .env.example .env.local
> pnpm install
> pnpm dev
> ```
>
> #### Your cloud
>
> Provision **your** Supabase + hosting. Deploy each app with root `apps/<name>`. Set Shell rewrite URLs to remote deployments.

## Handbook docs

- Platform Markdown lives in `docs/`
- Per-module handbooks live in `apps/<mfe>/docs/README.md` (Flowdown)
- Shell renders both at `/handbook` with Flowdown
- After editing either tree, sync the deployable copy (+ `docs/modules/` mirror):

```bash
pnpm handbook:sync
```

## AI-assisted development

Follow [`ai-agents.md`](./ai-agents.md) and root `AGENTS.md`. AI must not invent a new architecture, skip RLS, or hardcode secrets.
