-- Flow: leave / workflow requests
create table public.flow_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'leave',
  date_from date not null,
  date_to date not null,
  reason text not null,
  status text not null default 'pending'
    check (status in ('pending', 'advisor_approved', 'completed', 'rejected')),
  current_stage text not null default 'advisor'
    check (current_stage in ('advisor', 'registrar', 'done')),
  attachment_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.flow_approval_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.flow_requests (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  action text not null check (action in ('submit', 'approve', 'reject')),
  stage text not null,
  comment text,
  created_at timestamptz not null default now()
);

alter table public.flow_requests enable row level security;
alter table public.flow_approval_events enable row level security;

create policy "flow_requests_select"
  on public.flow_requests for select to authenticated
  using (
    requester_id = auth.uid()
    or public.has_permission(auth.uid(), 'flow.leave.approve')
    or public.has_permission(auth.uid(), 'flow.admin')
  );

create policy "flow_requests_insert"
  on public.flow_requests for insert to authenticated
  with check (
    requester_id = auth.uid()
    and public.has_permission(auth.uid(), 'flow.leave.submit')
  );

create policy "flow_requests_update_approvers"
  on public.flow_requests for update to authenticated
  using (
    public.has_permission(auth.uid(), 'flow.leave.approve')
    or public.has_permission(auth.uid(), 'flow.admin')
    or requester_id = auth.uid()
  );

create policy "flow_events_select"
  on public.flow_approval_events for select to authenticated
  using (
    exists (
      select 1 from public.flow_requests r
      where r.id = request_id
        and (
          r.requester_id = auth.uid()
          or public.has_permission(auth.uid(), 'flow.leave.approve')
          or public.has_permission(auth.uid(), 'flow.admin')
        )
    )
  );

create policy "flow_events_insert"
  on public.flow_approval_events for insert to authenticated
  with check (actor_id = auth.uid());
