-- Residence: buildings, rooms, allocations, maintenance
create table public.residence_buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.residence_rooms (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.residence_buildings (id) on delete cascade,
  room_number text not null,
  capacity int not null default 1 check (capacity > 0),
  status text not null default 'available' check (status in ('available', 'maintenance', 'occupied')),
  created_at timestamptz not null default now(),
  unique (building_id, room_number)
);

create table public.residence_allocations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.residence_rooms (id) on delete cascade,
  resident_id uuid not null references public.profiles (id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.residence_maintenance (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.profiles (id) on delete cascade,
  room_id uuid references public.residence_rooms (id) on delete set null,
  title text not null,
  description text not null,
  location text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table public.residence_announcements (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.residence_buildings (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.residence_change_requests (
  id uuid primary key default gen_random_uuid(),
  resident_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.residence_buildings enable row level security;
alter table public.residence_rooms enable row level security;
alter table public.residence_allocations enable row level security;
alter table public.residence_maintenance enable row level security;
alter table public.residence_announcements enable row level security;
alter table public.residence_change_requests enable row level security;

create policy "buildings_select" on public.residence_buildings for select to authenticated using (true);
create policy "buildings_admin" on public.residence_buildings for all to authenticated
  using (public.has_permission(auth.uid(), 'residence.admin'))
  with check (public.has_permission(auth.uid(), 'residence.admin'));

create policy "rooms_select" on public.residence_rooms for select to authenticated using (true);
create policy "rooms_admin" on public.residence_rooms for all to authenticated
  using (public.has_permission(auth.uid(), 'residence.admin'))
  with check (public.has_permission(auth.uid(), 'residence.admin'));

create policy "alloc_select" on public.residence_allocations for select to authenticated
  using (resident_id = auth.uid() or public.has_permission(auth.uid(), 'residence.admin'));
create policy "alloc_admin" on public.residence_allocations for all to authenticated
  using (public.has_permission(auth.uid(), 'residence.admin'))
  with check (public.has_permission(auth.uid(), 'residence.admin'));

create policy "maint_select" on public.residence_maintenance for select to authenticated
  using (
    resident_id = auth.uid()
    or public.has_permission(auth.uid(), 'residence.maintenance')
    or public.has_permission(auth.uid(), 'residence.admin')
  );
create policy "maint_insert" on public.residence_maintenance for insert to authenticated
  with check (resident_id = auth.uid());
create policy "maint_update_staff" on public.residence_maintenance for update to authenticated
  using (
    public.has_permission(auth.uid(), 'residence.maintenance')
    or public.has_permission(auth.uid(), 'residence.admin')
  );

create policy "res_ann_select" on public.residence_announcements for select to authenticated using (true);
create policy "res_ann_admin" on public.residence_announcements for insert to authenticated
  with check (author_id = auth.uid() and public.has_permission(auth.uid(), 'residence.admin'));

create policy "change_req_select" on public.residence_change_requests for select to authenticated
  using (resident_id = auth.uid() or public.has_permission(auth.uid(), 'residence.admin'));
create policy "change_req_insert" on public.residence_change_requests for insert to authenticated
  with check (resident_id = auth.uid());
