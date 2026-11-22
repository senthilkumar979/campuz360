import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Card, ModuleChrome } from '@campuz360/ui';

export default async function CalendarPage() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const supabase = await createClient();
  const { data: events } = await supabase.from('pulse_events').select('id, title, starts_at').order('starts_at');
  const byDay = new Map<string, { id: string; title: string }[]>();
  for (const e of events ?? []) {
    const day = new Date(e.starts_at).toISOString().slice(0, 10);
    const list = byDay.get(day) ?? [];
    list.push({ id: e.id, title: e.title });
    byDay.set(day, list);
  }

  return (
    <ModuleChrome title="Pulse" emoji="🎟️" color="#0369a1" homeHref="/pulse" nav={[{ href: '/pulse', label: 'Events' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Event calendar</h1>
      <div className="space-y-3">
        {[...byDay.entries()].map(([day, items]) => (
          <Card key={day}>
            <h2 className="font-bold">{day}</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {items.map((i) => (
                <li key={i.id}><Link className="text-blue" href={`/pulse/events/${i.id}`}>{i.title}</Link></li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
