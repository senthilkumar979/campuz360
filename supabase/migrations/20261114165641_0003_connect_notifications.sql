-- Connect: announcements, notifications, preferences
create table public.connect_announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null,
  audience text not null default 'all',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.connect_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text not null,
  link text,
  category text not null default 'system'
    check (category in ('workflow', 'announcements', 'events', 'system')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.connect_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  email_workflow boolean not null default true,
  email_announcements boolean not null default true,
  email_events boolean not null default true,
  inapp_workflow boolean not null default true,
  inapp_announcements boolean not null default true,
  inapp_events boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.connect_announcements enable row level security;
alter table public.connect_notifications enable row level security;
alter table public.connect_preferences enable row level security;

create policy "announcements_select"
  on public.connect_announcements for select to authenticated using (true);

create policy "announcements_insert"
  on public.connect_announcements for insert to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.has_permission(auth.uid(), 'connect.announce')
      or public.has_permission(auth.uid(), 'connect.admin')
    )
  );

create policy "notifications_select_own"
  on public.connect_notifications for select to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.connect_notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_delete_own"
  on public.connect_notifications for delete to authenticated
  using (user_id = auth.uid());

create policy "notifications_insert_authenticated"
  on public.connect_notifications for insert to authenticated
  with check (true);

create policy "prefs_select_own"
  on public.connect_preferences for select to authenticated
  using (user_id = auth.uid());

create policy "prefs_upsert_own"
  on public.connect_preferences for insert to authenticated
  with check (user_id = auth.uid());

create policy "prefs_update_own"
  on public.connect_preferences for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_link text default null,
  p_category text default 'system'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  nid uuid;
  prefs public.connect_preferences%rowtype;
  allow_inapp boolean := true;
begin
  select * into prefs from public.connect_preferences where user_id = p_user_id;
  if found then
    if p_category = 'workflow' then allow_inapp := prefs.inapp_workflow;
    elsif p_category = 'announcements' then allow_inapp := prefs.inapp_announcements;
    elsif p_category = 'events' then allow_inapp := prefs.inapp_events;
    end if;
  end if;

  if not allow_inapp then
    return null;
  end if;

  insert into public.connect_notifications (user_id, title, message, link, category)
  values (p_user_id, p_title, p_message, p_link, p_category)
  returning id into nid;
  return nid;
end;
$$;

grant execute on function public.create_notification(uuid, text, text, text, text) to authenticated;
