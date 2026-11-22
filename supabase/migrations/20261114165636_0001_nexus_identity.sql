-- Nexus: identity, RBAC, orgs, audit
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  email text,
  phone text,
  avatar_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text
);

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.org_units (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.org_units (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role_id uuid not null references public.roles (id) on delete cascade,
  org_unit_id uuid references public.org_units (id) on delete cascade,
  module_scope text,
  created_at timestamptz not null default now(),
  unique (user_id, role_id, org_unit_id, module_scope)
);

create table public.org_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  org_unit_id uuid not null references public.org_units (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, org_unit_id)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  target_id uuid references public.profiles (id) on delete set null,
  action text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email
  );
  insert into public.user_roles (user_id, role_id)
  select new.id, r.id from public.roles r where r.key = 'user';
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.get_user_permissions(p_user_id uuid)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(array_agg(distinct p.key), '{}'::text[])
  from public.user_roles ur
  join public.role_permissions rp on rp.role_id = ur.role_id
  join public.permissions p on p.id = rp.permission_id
  join public.profiles pr on pr.id = ur.user_id
  where ur.user_id = p_user_id and pr.is_active = true;
$$;

create or replace function public.has_permission(p_user_id uuid, p_permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_permission = any(public.get_user_permissions(p_user_id));
$$;

insert into public.roles (key, name, description) values
  ('user', 'User', 'Default campus user'),
  ('module_admin', 'Module Admin', 'Administer a specific module'),
  ('platform_admin', 'Platform Admin', 'Full platform administration');

insert into public.permissions (key, description) values
  ('nexus.access', 'Access Nexus'),
  ('nexus.admin', 'Administer Nexus'),
  ('nexus.audit', 'View audit logs'),
  ('flow.access', 'Access Flow'),
  ('flow.leave.submit', 'Submit leave requests'),
  ('flow.leave.approve', 'Approve leave requests'),
  ('flow.admin', 'Administer Flow'),
  ('connect.access', 'Access Connect'),
  ('connect.announce', 'Publish announcements'),
  ('connect.admin', 'Administer Connect'),
  ('sphere.access', 'Access Sphere'),
  ('sphere.moderate', 'Moderate communities'),
  ('sphere.admin', 'Administer Sphere'),
  ('residence.access', 'Access Residence'),
  ('residence.admin', 'Administer Residence'),
  ('residence.maintenance', 'Handle maintenance tickets'),
  ('pulse.access', 'Access Pulse'),
  ('pulse.organize', 'Organize events'),
  ('pulse.admin', 'Administer Pulse');

-- Default user role: module access + submit leave
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key = 'user'
  and p.key in (
    'nexus.access', 'flow.access', 'flow.leave.submit',
    'connect.access', 'sphere.access', 'residence.access', 'pulse.access'
  );

-- Platform admin: all permissions
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key = 'platform_admin';

-- Module admin: broad module permissions (scoped in app layer via module_scope)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key = 'module_admin'
  and p.key in (
    'nexus.access', 'flow.access', 'flow.leave.approve', 'flow.admin',
    'connect.access', 'connect.announce', 'connect.admin',
    'sphere.access', 'sphere.moderate', 'sphere.admin',
    'residence.access', 'residence.admin', 'residence.maintenance',
    'pulse.access', 'pulse.organize', 'pulse.admin'
  );

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.org_units enable row level security;
alter table public.user_roles enable row level security;
alter table public.org_memberships enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.has_permission(auth.uid(), 'nexus.admin'))
  with check (id = auth.uid() or public.has_permission(auth.uid(), 'nexus.admin'));

create policy "roles_select_authenticated"
  on public.roles for select to authenticated using (true);

create policy "permissions_select_authenticated"
  on public.permissions for select to authenticated using (true);

create policy "role_permissions_select_authenticated"
  on public.role_permissions for select to authenticated using (true);

create policy "org_units_select_authenticated"
  on public.org_units for select to authenticated using (true);

create policy "org_units_admin_write"
  on public.org_units for all to authenticated
  using (public.has_permission(auth.uid(), 'nexus.admin'))
  with check (public.has_permission(auth.uid(), 'nexus.admin'));

create policy "user_roles_select_authenticated"
  on public.user_roles for select to authenticated using (true);

create policy "user_roles_admin_write"
  on public.user_roles for all to authenticated
  using (public.has_permission(auth.uid(), 'nexus.admin'))
  with check (public.has_permission(auth.uid(), 'nexus.admin'));

create policy "org_memberships_select_authenticated"
  on public.org_memberships for select to authenticated using (true);

create policy "org_memberships_admin_write"
  on public.org_memberships for all to authenticated
  using (public.has_permission(auth.uid(), 'nexus.admin'))
  with check (public.has_permission(auth.uid(), 'nexus.admin'));

create policy "audit_select_privileged"
  on public.audit_events for select to authenticated
  using (public.has_permission(auth.uid(), 'nexus.audit') or public.has_permission(auth.uid(), 'nexus.admin'));

create policy "audit_insert_authenticated"
  on public.audit_events for insert to authenticated
  with check (actor_id = auth.uid() or public.has_permission(auth.uid(), 'nexus.admin'));

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;

create policy "avatar_select_own_or_admin"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.has_permission(auth.uid(), 'nexus.admin'))
  );

create policy "avatar_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatar_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

grant usage on schema public to authenticated;
grant select on all tables in schema public to authenticated;
grant execute on function public.get_user_permissions(uuid) to authenticated;
grant execute on function public.has_permission(uuid, text) to authenticated;
