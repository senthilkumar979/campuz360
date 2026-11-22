'use server';

import { revalidatePath } from 'next/cache';
import { communityCreateSchema } from '@campuz360/contracts';
import { createClient, getUser } from '@campuz360/auth/server';

export async function createCommunityAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const parsed = communityCreateSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    isPrivate: formData.get('isPrivate') === 'on',
  });
  if (!parsed.success) return;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('sphere_communities')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description,
      is_private: parsed.data.isPrivate,
      created_by: user.id,
    })
    .select('id')
    .single();
  if (error) return;
  await supabase.from('sphere_memberships').insert({
    community_id: data.id,
    user_id: user.id,
    role: 'moderator',
    status: 'active',
  });
  revalidatePath('/sphere');
  return;
}

export async function joinCommunityAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const communityId = String(formData.get('communityId'));
  const isPrivate = formData.get('isPrivate') === 'true';
  const supabase = await createClient();
  await supabase.from('sphere_memberships').upsert({
    community_id: communityId,
    user_id: user.id,
    role: 'member',
    status: isPrivate ? 'pending' : 'active',
  });
  revalidatePath('/sphere');
  revalidatePath(`/sphere/communities/${communityId}`);
}

export async function decideJoinAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const membershipId = String(formData.get('membershipId'));
  const decision = String(formData.get('decision'));
  const supabase = await createClient();
  await supabase.from('sphere_memberships').update({
    status: decision === 'approve' ? 'active' : 'rejected',
  }).eq('id', membershipId);
  revalidatePath('/sphere');
}

export async function createPostAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const communityId = String(formData.get('communityId'));
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!title || !body) return;
  const supabase = await createClient();
  const { data, error } = await supabase.from('sphere_posts').insert({
    community_id: communityId,
    author_id: user.id,
    title,
    body,
  }).select('id').single();
  if (error) return;

  const { data: members } = await supabase
    .from('sphere_memberships')
    .select('user_id')
    .eq('community_id', communityId)
    .eq('status', 'active');
  for (const m of members ?? []) {
    await supabase.rpc('create_notification', {
      p_user_id: m.user_id,
      p_title: 'New community post',
      p_message: title,
      p_link: `/sphere/communities/${communityId}`,
      p_category: 'system',
    });
  }
  revalidatePath(`/sphere/communities/${communityId}`);
  return;
}

export async function commentAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from('sphere_comments').insert({
    post_id: String(formData.get('postId')),
    author_id: user.id,
    body: String(formData.get('body') ?? ''),
  });
  revalidatePath(`/sphere/communities/${formData.get('communityId')}`);
}

export async function deletePostAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from('sphere_posts').delete().eq('id', String(formData.get('postId')));
  revalidatePath(`/sphere/communities/${formData.get('communityId')}`);
}

export async function reportPostAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from('sphere_reports').insert({
    post_id: String(formData.get('postId')),
    reporter_id: user.id,
    reason: String(formData.get('reason') ?? 'spam'),
  });
}
