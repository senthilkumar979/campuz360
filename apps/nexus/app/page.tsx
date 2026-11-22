import { MODULES } from '@campuz360/contracts';
import { createClient, getUser, getUserPermissions } from '@campuz360/auth/server';
import { Badge, Button, Card, EmptyState, ModuleChrome } from '@campuz360/ui';
import { redirect } from 'next/navigation';
import { signOutAction } from './actions';

export default async function NexusHome() {
  const user = await getUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const permissions = await getUserPermissions(user.id);
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const isAdmin = permissions.includes('nexus.admin');

  return (
    <ModuleChrome
      title="Nexus"
      emoji="🔐"
      color="#00b3ee"
      homeHref="/nexus"
      nav={[
        { href: '/nexus/profile', label: 'Profile' },
        { href: '/nexus/directory', label: 'Directory' },
        ...(isAdmin
          ? [
              { href: '/nexus/admin/roles', label: 'Roles' },
              { href: '/nexus/admin/orgs', label: 'Orgs' },
              { href: '/nexus/admin/audit', label: 'Audit' },
            ]
          : []),
      ]}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Identity dashboard</h1>
          <p className="text-mut">Signed in as {user.email}</p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card accent="#00b3ee">
          <b className="block text-3xl">{userCount ?? 0}</b>
          <small className="text-mut">Active users</small>
        </Card>
        <Card accent="#00b3ee">
          <b className="block text-3xl">{permissions.length}</b>
          <small className="text-mut">Your permissions</small>
        </Card>
        <Card accent="#33c2f1">
          <b className="block text-3xl">{isAdmin ? 'Admin' : 'User'}</b>
          <small className="text-mut">Access level</small>
        </Card>
      </div>
      <h2 className="mb-3 text-xl font-bold">Module access</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.filter((m) => permissions.includes(m.permission)).map((m) => (
          <Card key={m.id} accent={m.color}>
            <Badge>{m.emoji} {m.name}</Badge>
            <p className="mt-2 text-sm text-mut">{m.description}</p>
            <Button asChild className="mt-4" size="sm">
              {/* Plain <a>: Next Link would prefix Nexus basePath onto other MFE paths */}
              <a href={m.path}>Open</a>
            </Button>
          </Card>
        ))}
      </div>
      {!permissions.length ? (
        <EmptyState className="mt-6" title="All up to date" description="No pending identity approvals." />
      ) : null}
    </ModuleChrome>
  );
}
