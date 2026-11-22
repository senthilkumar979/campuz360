'use server';

import { revalidatePath } from 'next/cache';
import { maintenanceRequestSchema } from '@campuz360/contracts';
import { createClient, getUser } from '@campuz360/auth/server';

export async function createBuildingAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const name = String(formData.get('name') ?? '').trim();
  const rooms = Number(formData.get('rooms') ?? 0);
  const supabase = await createClient();
  const { data, error } = await supabase.from('residence_buildings').insert({ name }).select('id').single();
  if (error) return;
  if (rooms > 0) {
    const rows = Array.from({ length: rooms }, (_, i) => ({
      building_id: data.id,
      room_number: String(i + 1).padStart(3, '0'),
      capacity: 1,
    }));
    await supabase.from('residence_rooms').insert(rows);
  }
  revalidatePath('/residence');
  return;
}

export async function setRoomStatusAction(formData: FormData) {
  const supabase = await createClient();
  await supabase.from('residence_rooms').update({ status: String(formData.get('status')) }).eq('id', String(formData.get('roomId')));
  revalidatePath('/residence');
}

export async function allocateAction(formData: FormData) {
  const supabase = await createClient();
  const roomId = String(formData.get('roomId'));
  const residentId = String(formData.get('residentId'));
  const { data: room } = await supabase.from('residence_rooms').select('*, residence_allocations(count)').eq('id', roomId).single();
  const occupied = room?.residence_allocations?.[0]?.count ?? 0;
  if (occupied >= (room?.capacity ?? 0) || room?.status === 'maintenance') {
    return;
  }
  await supabase.from('residence_allocations').insert({ room_id: roomId, resident_id: residentId });
  await supabase.from('residence_rooms').update({ status: 'occupied' }).eq('id', roomId);
  revalidatePath('/residence');
  return;
}

export async function checkInAction(formData: FormData) {
  const supabase = await createClient();
  await supabase.from('residence_allocations').update({ checked_in_at: new Date().toISOString() }).eq('id', String(formData.get('allocationId')));
  revalidatePath('/residence');
}

export async function checkOutAction(formData: FormData) {
  const supabase = await createClient();
  const allocationId = String(formData.get('allocationId'));
  const { data: alloc } = await supabase.from('residence_allocations').select('*').eq('id', allocationId).single();
  await supabase.from('residence_allocations').update({ checked_out_at: new Date().toISOString(), end_date: new Date().toISOString().slice(0, 10) }).eq('id', allocationId);
  if (alloc) await supabase.from('residence_rooms').update({ status: 'available' }).eq('id', alloc.room_id);
  revalidatePath('/residence');
}

export async function reportMaintenanceAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const parsed = maintenanceRequestSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
  });
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from('residence_maintenance').insert({ resident_id: user.id, ...parsed.data });
  revalidatePath('/residence/maintenance');
  return;
}

export async function closeTicketAction(formData: FormData) {
  const supabase = await createClient();
  await supabase.from('residence_maintenance').update({ status: 'closed', closed_at: new Date().toISOString() }).eq('id', String(formData.get('id')));
  revalidatePath('/residence/maintenance');
}

export async function roomChangeAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from('residence_change_requests').insert({
    resident_id: user.id,
    reason: String(formData.get('reason') ?? ''),
  });
  revalidatePath('/residence');
}

export async function buildingAnnouncementAction(formData: FormData) {
  const user = await getUser();
  if (!user) return;
  const supabase = await createClient();
  await supabase.from('residence_announcements').insert({
    building_id: String(formData.get('buildingId')),
    author_id: user.id,
    title: String(formData.get('title')),
    content: String(formData.get('content')),
  });
  revalidatePath('/residence');
}
