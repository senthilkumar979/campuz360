# Design system

Campuz360 brand and UI rules. Implement visuals through `@campuz360/ui` and shared Tailwind tokens — do not invent a parallel design language per MFE.

## Brand tokens

Defined in [`packages/config/tailwind-preset.css`](../packages/config/tailwind-preset.css) and applied via `@campuz360/ui/globals.css`.

| Token | Value | Role |
| --- | --- | --- |
| Primary | `#00b3ee` | Brand, primary buttons, focus ring, logo |
| Primary dark | `#0095c7` | Hover, links (`blue` alias) |
| Primary light | `#33c2f1` | Gradients / highlights (`sky` alias) |
| Ink | `#0f172a` | Primary text, Shell sidebar |
| Mut | `#64748b` | Secondary text |
| BG | `#f4fafd` | Page background |
| Card | `#ffffff` | Surfaces |
| Line | `#d7e8f0` | Borders |
| Success | `#16a34a` | Positive states |
| Warn | `#d97706` | Warnings |
| Danger | `#e11d48` | Destructive actions |

> [!IMPORTANT] Single source of truth
> Change colors only in `tailwind-preset.css` (+ Logo SVG if needed). Do not hardcode old MentorBridge blues/pinks in new UI.

## Typography

- **Font family (whole app):**  
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- Set on `body` in `@campuz360/ui/globals.css` and as `--font-sans`
- **Paragraphs (`p`):** `font-size: 12px` (global base)
- Headings remain larger via utility classes (`text-3xl`, etc.)

## Components

Import from `@campuz360/ui`:

- `Button` — `primary` | `ghost` | `outline` | `danger`
- `Card` — optional `accent` (prefer `#00b3ee` or module color from `@campuz360/contracts`)
- `Badge`, `Input`, `Label`, `EmptyState`, `Logo`, `ModuleChrome`

## Layout patterns

> [!TABS]
> #### Shell
>
> - Sidebar uses `bg-ink`
> - Primary CTAs use `Button` primary (`#00b3ee`)
> - Handbook at `/handbook`
>
> #### Remote MFEs
>
> - Wrap pages in `ModuleChrome`
> - Module accent colors come from `MODULES` in contracts (primary-family)

## What not to do

> [!WARNING] Design anti-patterns
> - Loading Google fonts that override the system stack
> - Reintroducing Plus Jakarta Sans or random brand palettes
> - Hardcoding `#18a0e8` / `#ec4899` from the old theme
