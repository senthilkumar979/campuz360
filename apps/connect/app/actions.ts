'use server';

import { revalidatePath } from 'next/cache';
import { announcementSchema } from '@campuz360/contracts';
import { createClient, getUser } from '@campuz360/auth/server';

export async function publishAnnouncementAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const parsed = announcementSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    audience: formData.get('audience') || 'all',
  });
  if (!parsed.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from('connect_announcements').insert({
    author_id: user.id,
    ...parsed.data,
  });
  if (error) return;

  const { data: profiles } = await supabase.from('profiles').select('id').eq('is_active', true).limit(200);
  for (const p of profiles ?? []) {
    await supabase.rpc('create_notification', {
      p_user_id: p.id,
      p_title: parsed.data.title,
      p_message: parsed.data.content.slice(0, 180),
      p_link: '/connect',
      p_category: 'announcements',
    });
  }
  revalidatePath('/connect');
  return;
}

export async function markReadAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const id = String(formData.get('id'));
  const supabase = await createClient();
  await supabase.from('connect_notifications').update({ is_read: true }).eq('id', id).eq('user_id', user.id);
  revalidatePath('/connect/notifications');
}

export async function deleteNotificationAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const id = String(formData.get('id'));
  const supabase = await createClient();
  await supabase.from('connect_notifications').delete().eq('id', id).eq('user_id', user.id);
  revalidatePath('/connect/notifications');
}

export async function savePrefsAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  const payload = {
    user_id: user.id,
    email_workflow: formData.get('email_workflow') === 'on',
    email_announcements: formData.get('email_announcements') === 'on',
    email_events: formData.get('email_events') === 'on',
    inapp_workflow: formData.get('inapp_workflow') === 'on',
    inapp_announcements: formData.get('inapp_announcements') === 'on',
    inapp_events: formData.get('inapp_events') === 'on',
    updated_at: new Date().toISOString(),
  };
  await supabase.from('connect_preferences').upsert(payload);
  revalidatePath('/connect/settings');
}
