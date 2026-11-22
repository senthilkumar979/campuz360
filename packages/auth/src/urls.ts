/**
 * Absolute URL on the Shell origin.
 * Use for `redirect()` / Location when leaving the current MFE so Next.js
 * does not prepend that app's `basePath` (e.g. `/flow` + `/nexus/login`).
 */
export function shellUrl(path: string): string {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export const NEXUS_LOGIN_PATH = '/nexus/login';
export const NEXUS_HOME_PATH = '/nexus';
