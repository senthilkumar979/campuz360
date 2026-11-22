import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Permission } from '@campuz360/contracts';
import { getSupabaseEnv, hasSupabaseEnv } from './env';

export { hasSupabaseEnv };

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — middleware will refresh sessions.
        }
      },
    },
  });
}

export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_user_permissions', { p_user_id: userId });
  if (error || !data) return [];
  return data as Permission[];
}

export async function userHasPermission(userId: string, permission: Permission) {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}
