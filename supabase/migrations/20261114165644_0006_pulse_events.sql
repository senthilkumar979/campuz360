-- Pulse: events, registrations, attendance
create table public.pulse_events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  location text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int not null check (capacity > 0),
  created_at timestamptz not null default now()
);

create table public.pulse_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.pulse_events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'registered'
    check (status in ('registered', 'waitlisted', 'cancelled', 'attended')),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.pulse_events enable row level security;
alter table public.pulse_registrations enable row level security;

create policy "events_select" on public.pulse_events for select to authenticated using (true);
create policy "events_insert" on public.pulse_events for insert to authenticated
  with check (
    organizer_id = auth.uid()
    and (
      public.has_permission(auth.uid(), 'pulse.organize')
      or public.has_permission(auth.uid(), 'pulse.admin')
    )
  );
create policy "events_update" on public.pulse_events for update to authenticated
  using (
    organizer_id = auth.uid()
    or public.has_permission(auth.uid(), 'pulse.admin')
  );

create policy "regs_select" on public.pulse_registrations for select to authenticated
  using (
    user_id = auth.uid()
    or public.has_permission(auth.uid(), 'pulse.organize')
    or public.has_permission(auth.uid(), 'pulse.admin')
  );
create policy "regs_insert" on public.pulse_registrations for insert to authenticated
  with check (user_id = auth.uid());
create policy "regs_update" on public.pulse_registrations for update to authenticated
  using (
    user_id = auth.uid()
    or public.has_permission(auth.uid(), 'pulse.organize')
    or public.has_permission(auth.uid(), 'pulse.admin')
  );
