import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, Input, Label, ModuleChrome } from '@campuz360/ui';
import { createEventAction, registerAction } from './actions';

export default async function PulseHome({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const canOrganize = await userHasPermission(user.id, 'pulse.organize') || await userHasPermission(user.id, 'pulse.admin');
  const { q } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from('pulse_events').select('*, pulse_registrations(count)').order('starts_at');
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  const { data: events } = await query;

  return (
    <ModuleChrome title="Pulse" emoji="🎟️" color="#0369a1" homeHref="/pulse" nav={[{ href: '/pulse/calendar', label: 'Calendar' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Events</h1>
      <form className="mb-4 flex gap-2"><Input name="q" defaultValue={q} placeholder="Search events" /><Button type="submit" variant="outline">Search</Button></form>
      {canOrganize ? (
        <Card className="mb-6" accent="#0369a1">
          <form action={createEventAction} className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2"><Label>Title</Label><Input name="title" required /></div>
            <div className="space-y-1 md:col-span-2"><Label>Description</Label><Input name="description" required /></div>
            <div className="space-y-1"><Label>Location</Label><Input name="location" required /></div>
            <div className="space-y-1"><Label>Capacity</Label><Input name="capacity" type="number" defaultValue={50} required /></div>
            <div className="space-y-1"><Label>Starts</Label><Input name="startsAt" type="datetime-local" required /></div>
            <div className="space-y-1"><Label>Ends</Label><Input name="endsAt" type="datetime-local" required /></div>
            <Button type="submit">Create event</Button>
          </form>
        </Card>
      ) : null}
      <div className="space-y-3">
        {(events ?? []).map((e: any) => {
          const count = e.pulse_registrations?.[0]?.count ?? 0;
          const full = count >= e.capacity;
          return (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold">{e.title}</h2>
                  <p className="text-sm text-mut">{new Date(e.starts_at).toLocaleString()} · {e.location}</p>
                  <Badge className="mt-2">{count}/{e.capacity}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline"><Link href={`/pulse/events/${e.id}`}>Details</Link></Button>
                  <form action={registerAction}>
                    <input type="hidden" name="eventId" value={e.id} />
                    <Button type="submit" size="sm">{full ? 'Join waiting list' : 'Register'}</Button>
                  </form>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </ModuleChrome>
  );
}
