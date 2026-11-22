-- Harden SECURITY DEFINER RPC exposure (advisor: anon/authenticated executable).
-- Triggers run as owner; clients must not call handle_new_user via PostgREST.

revoke execute on function public.handle_new_user() from public, anon, authenticated;

revoke execute on function public.get_user_permissions(uuid) from public, anon;
grant execute on function public.get_user_permissions(uuid) to authenticated;

revoke execute on function public.has_permission(uuid, text) from public, anon;
grant execute on function public.has_permission(uuid, text) to authenticated;

revoke execute on function public.create_notification(uuid, text, text, text, text) from public, anon;
grant execute on function public.create_notification(uuid, text, text, text, text) to authenticated;
