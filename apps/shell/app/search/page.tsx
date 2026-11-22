import { createClient, getUser, getUserPermissions, hasSupabaseEnv } from '@campuz360/auth/server';
import { Badge, Card, EmptyState } from '@campuz360/ui';
import { ShellLayout } from '../../components/ShellLayout';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const configured = hasSupabaseEnv();
  const user = configured ? await getUser() : null;
  const permissions = user ? await getUserPermissions(user.id) : [];

  const communities: { id: string; name: string }[] = [];
  const events: { id: string; title: string }[] = [];

  if (user && q) {
    const supabase = await createClient();
    if (permissions.includes('sphere.access')) {
      const { data } = await supabase
        .from('sphere_communities')
        .select('id, name')
        .ilike('name', `%${q}%`)
        .limit(10);
      communities.push(...(data ?? []));
    }
    if (permissions.includes('pulse.access')) {
      const { data } = await supabase
        .from('pulse_events')
        .select('id, title')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(10);
      events.push(...(data ?? []));
    }
  }

  return (
    <ShellLayout email={user?.email} permissions={permissions} unreadCount={0}>
      <h1 className="mb-4 text-3xl font-extrabold">Search results</h1>
      <p className="mb-6 text-mut">Query: {q || '(empty)'}</p>
      {!q ? <EmptyState title="Enter a search term" /> : null}
      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 font-bold">
            <Badge>Sphere</Badge> Communities
          </h2>
          {communities.map((c) => (
            <Card key={c.id} className="mb-2">
              <a href={`/sphere/communities/${c.id}`}>{c.name}</a>
            </Card>
          ))}
          {!communities.length ? <p className="text-sm text-mut">No communities</p> : null}
        </section>
        <section>
          <h2 className="mb-2 font-bold">
            <Badge tone="accent">Pulse</Badge> Events
          </h2>
          {events.map((e) => (
            <Card key={e.id} className="mb-2">
              <a href={`/pulse/events/${e.id}`}>{e.title}</a>
            </Card>
          ))}
          {!events.length ? <p className="text-sm text-mut">No events</p> : null}
        </section>
      </div>
    </ShellLayout>
  );
}
