import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, Input, ModuleChrome } from '@campuz360/ui';
import { cancelRegistrationAction, markAttendedAction, registerAction, updateLocationAction } from '../../actions';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const { id } = await params;
  const canOrganize = await userHasPermission(user.id, 'pulse.organize') || await userHasPermission(user.id, 'pulse.admin');
  const supabase = await createClient();
  const { data: event } = await supabase.from('pulse_events').select('*').eq('id', id).single();
  const { data: regs } = await supabase.from('pulse_registrations').select('*, profiles:user_id(display_name)').eq('event_id', id);
  const mine = (regs ?? []).find((r) => r.user_id === user.id);

  return (
    <ModuleChrome title="Pulse" emoji="🎟️" color="#0369a1" homeHref="/pulse" nav={[{ href: '/pulse', label: 'Events' }]}>
      <h1 className="mb-2 text-3xl font-extrabold">{event?.title}</h1>
      <p className="text-mut">{event?.description}</p>
      <p className="mt-2 text-sm">{event?.location} · {event ? new Date(event.starts_at).toLocaleString() : ''}</p>
      <div className="mt-4 flex gap-2">
        {mine && mine.status !== 'cancelled' ? (
          <>
            <Badge>{mine.status}</Badge>
            <form action={cancelRegistrationAction}><input type="hidden" name="eventId" value={id} /><Button size="sm" variant="danger">Cancel registration</Button></form>
          </>
        ) : (
          <form action={registerAction}><input type="hidden" name="eventId" value={id} /><Button size="sm">Register</Button></form>
        )}
      </div>
      {canOrganize ? (
        <Card className="mt-6">
          <form action={updateLocationAction} className="flex gap-2">
            <input type="hidden" name="eventId" value={id} />
            <Input name="location" defaultValue={event?.location ?? ''} required />
            <Button type="submit">Update location</Button>
          </form>
          <h2 className="mb-2 mt-6 font-bold">Attendees</h2>
          {(regs ?? []).map((r: any) => (
            <div key={r.id} className="mb-2 flex items-center gap-2">
              <span>{r.profiles?.display_name}</span>
              <Badge>{r.status}</Badge>
              {r.status === 'registered' ? (
                <form action={markAttendedAction}>
                  <input type="hidden" name="registrationId" value={r.id} />
                  <input type="hidden" name="eventId" value={id} />
                  <Button size="sm" variant="outline">Attended</Button>
                </form>
              ) : null}
            </div>
          ))}
        </Card>
      ) : null}
    </ModuleChrome>
  );
}
