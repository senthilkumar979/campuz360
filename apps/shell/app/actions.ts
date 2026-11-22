'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@campuz360/auth/server';

export async function shellSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
