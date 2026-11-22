import Link from 'next/link';
import { MODULES } from '@campuz360/contracts';
import { createClient, getUser, getUserPermissions, hasSupabaseEnv } from '@campuz360/auth/server';
import { Badge, Button, Card, EmptyState } from '@campuz360/ui';
import { ShellLayout } from '../components/ShellLayout';
import { shellSignOut } from './actions';

export default async function HomePage() {
  const configured = hasSupabaseEnv();
  const user = configured ? await getUser() : null;
  const permissions = user ? await getUserPermissions(user.id) : [];
  let unread = 0;
  let pendingApprovals = 0;

  if (user) {
    const supabase = await createClient();
    const { count } = await supabase
      .from('connect_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    unread = count ?? 0;
    const { count: pending } = await supabase
      .from('flow_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    pendingApprovals = pending ?? 0;
  }

  const tiles = MODULES.filter((m) => !user || permissions.includes(m.permission));

  return (
    <ShellLayout email={user?.email} permissions={user ? permissions : MODULES.map((m) => m.permission)} unreadCount={unread}>
      <section className="mb-10 overflow-hidden rounded-[28px] bg-ink px-6 py-12 text-white md:px-10">
        <Badge className="bg-white/15 text-white">A MentorBridge initiative</Badge>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">
          One platform.{' '}
          <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
            Connected campus experiences.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[#b6d4e2]">
          Seven independently deployable microfrontends for identity, workflows, communication,
          community, housing and events.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {user ? (
            <form action={shellSignOut}>
              <Button type="submit" variant="ghost" className="border-white/30 text-white hover:bg-white/10">
                Sign out
              </Button>
            </form>
          ) : (
            <Button asChild>
              <Link href="/nexus/login">Sign in with Nexus</Link>
            </Button>
          )}
          <Button asChild variant="ghost" className="border-white/30 text-white hover:bg-white/10">
            <a href="#modules">See the modules</a>
          </Button>
          <Button asChild variant="ghost" className="border-white/30 text-white hover:bg-white/10">
            <Link href="/handbook">Open handbook</Link>
          </Button>
        </div>
      </section>

      {user ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card accent="#0095c7">
            <p className="text-sm text-mut">Pending approvals</p>
            <b className="text-3xl">{pendingApprovals}</b>
          </Card>
          <Card accent="#33c2f1">
            <p className="text-sm text-mut">Unread notifications</p>
            <b className="text-3xl">{unread}</b>
          </Card>
        </div>
      ) : null}

      {!configured ? (
        <EmptyState
          className="mb-8"
          title="Supabase not configured"
          description="Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL / ANON_KEY (or start Docker + supabase start)."
        />
      ) : null}

      <section id="modules">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight">Available modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((m) => (
            <Card key={m.id} accent={m.color}>
              <div className="mb-2 text-2xl">{m.emoji}</div>
              <h3 className="text-xl font-bold">{m.name}</h3>
              <p className="mt-2 text-sm text-mut">{m.description}</p>
              <Button asChild className="mt-4" size="sm">
                <a href={m.path}>Enter</a>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </ShellLayout>
  );
}
