'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { profileUpdateSchema, signInSchema } from '@campuz360/contracts';
import { createClient, getUser } from '@campuz360/auth/server';

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return;
  redirect('/');
}

export async function signUpAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return;

  const displayName = String(formData.get('displayName') ?? '').trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: displayName || undefined } },
  });
  if (error) return;
  redirect('/');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function resetPasswordAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/nexus/login`,
  });
  return;
}

export async function updateProfileAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const parsed = profileUpdateSchema.safeParse({
    displayName: formData.get('displayName'),
    phone: formData.get('phone') || undefined,
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.displayName,
      phone: parsed.data.phone ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);
  if (error) return;
  revalidatePath('/nexus/profile');
  return;
}

export async function assignRoleAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  const { data: allowed } = await supabase.rpc('has_permission', {
    p_user_id: user.id,
    p_permission: 'nexus.admin',
  });
  if (!allowed) return;

  const targetId = String(formData.get('userId'));
  const roleId = String(formData.get('roleId'));
  const moduleScope = String(formData.get('moduleScope') || '') || null;

  const { error } = await supabase.from('user_roles').insert({
    user_id: targetId,
    role_id: roleId,
    module_scope: moduleScope,
  });
  if (error) return;

  await supabase.from('audit_events').insert({
    actor_id: user.id,
    target_id: targetId,
    action: 'role.grant',
    meta: { roleId, moduleScope },
  });
  revalidatePath('/nexus/directory');
  revalidatePath('/nexus/admin/roles');
  return;
}

export async function suspendUserAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  const { data: allowed } = await supabase.rpc('has_permission', {
    p_user_id: user.id,
    p_permission: 'nexus.admin',
  });
  if (!allowed) return;
  const targetId = String(formData.get('userId'));
  const { error } = await supabase.from('profiles').update({ is_active: false }).eq('id', targetId);
  if (error) return;
  await supabase.from('audit_events').insert({
    actor_id: user.id,
    target_id: targetId,
    action: 'user.suspend',
    meta: {},
  });
  revalidatePath('/nexus/directory');
  return;
}
