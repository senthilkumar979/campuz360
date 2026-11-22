import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, Input, ModuleChrome } from '@campuz360/ui';
import {
  allocateAction,
  buildingAnnouncementAction,
  checkInAction,
  checkOutAction,
  createBuildingAction,
  roomChangeAction,
  setRoomStatusAction,
} from './actions';

export default async function ResidenceHome() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const isAdmin = await userHasPermission(user.id, 'residence.admin');
  const supabase = await createClient();
  const { data: buildings } = await supabase.from('residence_buildings').select('*, residence_rooms(*, residence_allocations(*))');
  const { data: myAlloc } = await supabase
    .from('residence_allocations')
    .select('*, residence_rooms(*, residence_buildings(name))')
    .eq('resident_id', user.id)
    .is('checked_out_at', null)
    .maybeSingle();
  const { data: profiles } = await supabase.from('profiles').select('id, display_name').limit(50);
  const { data: announcements } = await supabase.from('residence_announcements').select('*').order('created_at', { ascending: false }).limit(5);

  return (
    <ModuleChrome title="Residence" emoji="🏠" color="#0284c7" homeHref="/residence" nav={[{ href: '/residence/maintenance', label: 'Maintenance' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Housing</h1>
      <Card className="mb-6" accent="#0284c7">
        <h2 className="font-bold">Your room</h2>
        {myAlloc ? (
          <p className="mt-2">Assigned Room: {myAlloc.residence_rooms?.residence_buildings?.name} – {myAlloc.residence_rooms?.room_number}</p>
        ) : (
          <p className="mt-2 text-mut">No active assignment</p>
        )}
        <form action={roomChangeAction} className="mt-3 flex gap-2">
          <Input name="reason" placeholder="Request room change reason" required />
          <Button type="submit" size="sm">Request room change</Button>
        </form>
      </Card>
      {(announcements ?? []).length ? (
        <Card className="mb-6">
          <h2 className="mb-2 font-bold">Building alerts</h2>
          {(announcements ?? []).map((a) => (
            <div key={a.id} className="mb-2"><b>{a.title}</b><p className="text-sm text-mut">{a.content}</p></div>
          ))}
        </Card>
      ) : null}
      {isAdmin ? (
        <>
          <Card className="mb-6">
            <form action={createBuildingAction} className="flex flex-wrap gap-2">
              <Input name="name" placeholder="Building name" required />
              <Input name="rooms" type="number" placeholder="Room count" defaultValue={10} />
              <Button type="submit">Add building</Button>
            </form>
          </Card>
          {(buildings ?? []).map((b: any) => (
            <Card key={b.id} className="mb-4">
              <h2 className="mb-3 text-xl font-bold">{b.name}</h2>
              <form action={buildingAnnouncementAction} className="mb-4 flex flex-wrap gap-2">
                <input type="hidden" name="buildingId" value={b.id} />
                <Input name="title" placeholder="Alert title" required />
                <Input name="content" placeholder="Message" required />
                <Button type="submit" size="sm" variant="outline">Announce</Button>
              </form>
              <div className="grid gap-2 md:grid-cols-2">
                {(b.residence_rooms ?? []).map((r: any) => (
                  <div key={r.id} className="rounded-xl border border-line p-3">
                    <div className="flex items-center justify-between">
                      <b>Room {r.room_number}</b>
                      <Badge>{r.status}</Badge>
                    </div>
                    <p className="text-xs text-mut">Capacity {r.capacity} · Allocated {r.residence_allocations?.length ?? 0}</p>
                    <form action={setRoomStatusAction} className="mt-2 flex gap-2">
                      <input type="hidden" name="roomId" value={r.id} />
                      <select name="status" className="rounded-lg border border-line px-2 text-sm">
                        <option value="available">available</option>
                        <option value="maintenance">maintenance</option>
                        <option value="occupied">occupied</option>
                      </select>
                      <Button size="sm" variant="outline">Set</Button>
                    </form>
                    <form action={allocateAction} className="mt-2 flex gap-2">
                      <input type="hidden" name="roomId" value={r.id} />
                      <select name="residentId" className="rounded-lg border border-line px-2 text-sm">
                        {(profiles ?? []).map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
                      </select>
                      <Button size="sm">Assign</Button>
                    </form>
                    {(r.residence_allocations ?? []).filter((a: any) => !a.checked_out_at).map((a: any) => (
                      <div key={a.id} className="mt-2 flex gap-2">
                        <form action={checkInAction}><input type="hidden" name="allocationId" value={a.id} /><Button size="sm" variant="outline">Check in</Button></form>
                        <form action={checkOutAction}><input type="hidden" name="allocationId" value={a.id} /><Button size="sm" variant="danger">Check out</Button></form>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </>
      ) : null}
    </ModuleChrome>
  );
}
