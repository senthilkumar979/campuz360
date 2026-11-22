import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { hasSupabaseEnv } from './env';

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

interface SessionRequest {
  cookies: {
    getAll: () => { name: string; value: string }[];
    set: (name: string, value: string) => void;
  };
}

export async function updateSession(request: SessionRequest) {
  // Cast avoids duplicate Next.js type-graph conflicts across the monorepo.
  let response = NextResponse.next({ request: request as never });

  if (!hasSupabaseEnv()) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: request as never });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
