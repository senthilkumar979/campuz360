# Security checklist (Campuz360)

Use with [docs/data-and-security.md](./docs/data-and-security.md).

- [ ] RLS enabled on every `public` table (see `supabase/migrations`)
- [ ] No `service_role` key in client bundles or `NEXT_PUBLIC_*`
- [ ] Authorization uses `has_permission` / verified `getUser()`, never `user_metadata`
- [ ] Role grants and suspensions write `audit_events`
- [ ] Avatar storage policies require own-folder path
- [ ] Cross-MFE notifications go through `create_notification` RPC (respects preferences)
- [ ] `.env.local` and hosting secrets stay out of git
- [ ] After linking a hosted Supabase project, run security advisors

Report suspected issues to the MentorBridge mentor for your cohort — do not open public issues that include secrets or personal student data.
