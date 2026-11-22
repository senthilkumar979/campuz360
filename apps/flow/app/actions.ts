'use server';

import { revalidatePath } from 'next/cache';
import { leaveRequestSchema } from '@campuz360/contracts';
import { createClient, getUser } from '@campuz360/auth/server';

export async function submitLeaveAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const parsed = leaveRequestSchema.safeParse({
    dateFrom: formData.get('dateFrom'),
    dateTo: formData.get('dateTo'),
    reason: formData.get('reason'),
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('flow_requests')
    .insert({
      requester_id: user.id,
      date_from: parsed.data.dateFrom,
      date_to: parsed.data.dateTo,
      reason: parsed.data.reason,
      status: 'pending',
      current_stage: 'advisor',
    })
    .select('id')
    .single();
  if (error) return;

  await supabase.from('flow_approval_events').insert({
    request_id: data.id,
    actor_id: user.id,
    action: 'submit',
    stage: 'advisor',
  });

  // Notify users with approve permission (demo: notify all profiles with flow.leave.approve via RPC create_notification for self ack)
  await supabase.rpc('create_notification', {
    p_user_id: user.id,
    p_title: 'Leave request submitted',
    p_message: 'Your leave request is pending advisor approval.',
    p_link: `/flow/requests/${data.id}`,
    p_category: 'workflow',
  });

  revalidatePath('/flow');
  revalidatePath('/flow/tasks');
  return;
}

export async function decideRequestAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const id = String(formData.get('requestId'));
  const decision = String(formData.get('decision'));
  const comment = String(formData.get('comment') ?? '');
  const supabase = await createClient();

  const { data: req } = await supabase.from('flow_requests').select('*').eq('id', id).single();
  if (!req) return;

  if (decision === 'reject') {
    await supabase.from('flow_requests').update({ status: 'rejected', current_stage: 'done' }).eq('id', id);
    await supabase.from('flow_approval_events').insert({
      request_id: id, actor_id: user.id, action: 'reject', stage: req.current_stage, comment,
    });
  } else if (req.current_stage === 'advisor') {
    await supabase.from('flow_requests').update({ status: 'advisor_approved', current_stage: 'registrar' }).eq('id', id);
    await supabase.from('flow_approval_events').insert({
      request_id: id, actor_id: user.id, action: 'approve', stage: 'advisor', comment,
    });
  } else {
    await supabase.from('flow_requests').update({ status: 'completed', current_stage: 'done' }).eq('id', id);
    await supabase.from('flow_approval_events').insert({
      request_id: id, actor_id: user.id, action: 'approve', stage: 'registrar', comment,
    });
  }

  await supabase.rpc('create_notification', {
    p_user_id: req.requester_id,
    p_title: 'Leave request updated',
    p_message: `Your request was ${decision === 'reject' ? 'rejected' : 'approved'}.`,
    p_link: `/flow/requests/${id}`,
    p_category: 'workflow',
  });

  revalidatePath('/flow');
  revalidatePath('/flow/tasks');
  revalidatePath(`/flow/requests/${id}`);
  return;
}
