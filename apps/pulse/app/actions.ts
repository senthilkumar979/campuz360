'use server';

import { revalidatePath } from 'next/cache';
import { eventCreateSchema } from '@campuz360/contracts';
import { createClient, getUser } from '@campuz360/auth/server';

export async function createEventAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const parsed = eventCreateSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
    startsAt: formData.get('startsAt'),
    endsAt: formData.get('endsAt'),
    capacity: Number(formData.get('capacity')),
  });
  if (!parsed.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from('pulse_events').insert({
    organizer_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    location: parsed.data.location,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt,
    capacity: parsed.data.capacity,
  });
  if (error) return;
  revalidatePath('/pulse');
  return;
}

export async function registerAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const eventId = String(formData.get('eventId'));
  const supabase = await createClient();
  const { data: event } = await supabase.from('pulse_events').select('*, pulse_registrations(count)').eq('id', eventId).single();
  const count = event?.pulse_registrations?.[0]?.count ?? 0;
  const status = count >= (event?.capacity ?? 0) ? 'waitlisted' : 'registered';
  const { error } = await supabase.from('pulse_registrations').upsert({
    event_id: eventId,
    user_id: user.id,
    status,
  });
  if (error) return;
  await supabase.rpc('create_notification', {
    p_user_id: user.id,
    p_title: status === 'registered' ? 'You are registered' : 'Waitlisted',
    p_message: `Event: ${event?.title}`,
    p_link: `/pulse/events/${eventId}`,
    p_category: 'events',
  });
  revalidatePath('/pulse');
  revalidatePath(`/pulse/events/${eventId}`);
  return;
}

export async function cancelRegistrationAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from('pulse_registrations').update({ status: 'cancelled' }).eq('event_id', String(formData.get('eventId'))).eq('user_id', user.id);
  revalidatePath('/pulse');
}

export async function markAttendedAction(formData: FormData) {
  const supabase = await createClient();
  await supabase.from('pulse_registrations').update({ status: 'attended' }).eq('id', String(formData.get('registrationId')));
  revalidatePath(`/pulse/events/${formData.get('eventId')}`);
}

export async function updateLocationAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const eventId = String(formData.get('eventId'));
  const location = String(formData.get('location'));
  const supabase = await createClient();
  await supabase.from('pulse_events').update({ location }).eq('id', eventId);
  const { data: regs } = await supabase.from('pulse_registrations').select('user_id').eq('event_id', eventId).neq('status', 'cancelled');
  for (const r of regs ?? []) {
    await supabase.rpc('create_notification', {
      p_user_id: r.user_id,
      p_title: 'Event location changed',
      p_message: `New location: ${location}`,
      p_link: `/pulse/events/${eventId}`,
      p_category: 'events',
    });
  }
  revalidatePath(`/pulse/events/${eventId}`);
}
