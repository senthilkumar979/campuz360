-- Sphere: communities, membership, posts, comments, reports
create table public.sphere_communities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_private boolean not null default false,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.sphere_memberships (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.sphere_communities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'moderator')),
  status text not null default 'active' check (status in ('active', 'pending', 'rejected')),
  created_at timestamptz not null default now(),
  unique (community_id, user_id)
);

create table public.sphere_posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.sphere_communities (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.sphere_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.sphere_posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.sphere_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.sphere_posts (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.sphere_communities enable row level security;
alter table public.sphere_memberships enable row level security;
alter table public.sphere_posts enable row level security;
alter table public.sphere_comments enable row level security;
alter table public.sphere_reports enable row level security;

create policy "communities_select"
  on public.sphere_communities for select to authenticated using (true);

create policy "communities_insert"
  on public.sphere_communities for insert to authenticated
  with check (created_by = auth.uid() and public.has_permission(auth.uid(), 'sphere.access'));

create policy "communities_update_mods"
  on public.sphere_communities for update to authenticated
  using (
    created_by = auth.uid()
    or public.has_permission(auth.uid(), 'sphere.admin')
    or exists (
      select 1 from public.sphere_memberships m
      where m.community_id = id and m.user_id = auth.uid() and m.role = 'moderator' and m.status = 'active'
    )
  );

create policy "memberships_select"
  on public.sphere_memberships for select to authenticated using (true);

create policy "memberships_insert"
  on public.sphere_memberships for insert to authenticated
  with check (user_id = auth.uid() or public.has_permission(auth.uid(), 'sphere.moderate'));

create policy "memberships_update_mods"
  on public.sphere_memberships for update to authenticated
  using (
    public.has_permission(auth.uid(), 'sphere.moderate')
    or public.has_permission(auth.uid(), 'sphere.admin')
    or exists (
      select 1 from public.sphere_memberships m
      where m.community_id = community_id and m.user_id = auth.uid() and m.role = 'moderator' and m.status = 'active'
    )
  );

create policy "posts_select"
  on public.sphere_posts for select to authenticated
  using (
    exists (
      select 1 from public.sphere_communities c
      where c.id = community_id
        and (
          not c.is_private
          or exists (
            select 1 from public.sphere_memberships m
            where m.community_id = c.id and m.user_id = auth.uid() and m.status = 'active'
          )
        )
    )
  );

create policy "posts_insert"
  on public.sphere_posts for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.sphere_memberships m
      where m.community_id = community_id and m.user_id = auth.uid() and m.status = 'active'
    )
  );

create policy "posts_delete_mods"
  on public.sphere_posts for delete to authenticated
  using (
    author_id = auth.uid()
    or public.has_permission(auth.uid(), 'sphere.moderate')
    or exists (
      select 1 from public.sphere_memberships m
      where m.community_id = community_id and m.user_id = auth.uid() and m.role = 'moderator' and m.status = 'active'
    )
  );

create policy "comments_select"
  on public.sphere_comments for select to authenticated using (true);

create policy "comments_insert"
  on public.sphere_comments for insert to authenticated
  with check (author_id = auth.uid());

create policy "comments_delete_mods"
  on public.sphere_comments for delete to authenticated
  using (
    author_id = auth.uid()
    or public.has_permission(auth.uid(), 'sphere.moderate')
  );

create policy "reports_insert"
  on public.sphere_reports for insert to authenticated
  with check (reporter_id = auth.uid());

create policy "reports_select_mods"
  on public.sphere_reports for select to authenticated
  using (public.has_permission(auth.uid(), 'sphere.moderate') or public.has_permission(auth.uid(), 'sphere.admin'));
