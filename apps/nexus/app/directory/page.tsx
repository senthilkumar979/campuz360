import { redirect } from 'next/navigation';
import { createClient, getUser, getUserPermissions } from '@campuz360/auth/server';
import { Badge, Button, Card, Input, ModuleChrome } from '@campuz360/ui';
import { assignRoleAction, suspendUserAction } from '../actions';

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getUser();
  if (!user) redirect('/login');
  const { q } = await searchParams;
  const supabase = await createClient();
  const permissions = await getUserPermissions(user.id);
  const isAdmin = permissions.includes('nexus.admin');

  let query = supabase.from('profiles').select('id, display_name, email, is_active').order('display_name').limit(20);
  if (q) query = query.ilike('display_name', `%${q}%`);
  const { data: profiles } = await query;
  const { data: roles } = await supabase.from('roles').select('id, key, name');

  return (
    <ModuleChrome title="Nexus" emoji="🔐" color="#00b3ee" homeHref="/nexus" nav={[{ href: '/nexus', label: 'Dashboard' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">User directory</h1>
      <form className="mb-6 flex gap-2">
        <Input name="q" placeholder="Search by name" defaultValue={q} />
        <Button type="submit" variant="outline">Search</Button>
      </form>
      <div className="space-y-3">
        {(profiles ?? []).map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{p.display_name}</p>
                <p className="text-sm text-mut">{isAdmin ? p.email : 'Public profile'}</p>
                {!p.is_active ? <Badge tone="warn">Suspended</Badge> : null}
              </div>
              {isAdmin ? (
                <div className="flex flex-wrap gap-2">
                  <form action={assignRoleAction} className="flex gap-2">
                    <input type="hidden" name="userId" value={p.id} />
                    <select name="roleId" className="rounded-xl border border-line px-2 text-sm">
                      {(roles ?? []).map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <Input name="moduleScope" placeholder="module scope (optional)" className="w-40" />
                    <Button type="submit" size="sm">Grant role</Button>
                  </form>
                  <form action={suspendUserAction}>
                    <input type="hidden" name="userId" value={p.id} />
                    <Button type="submit" size="sm" variant="danger">Suspend</Button>
                  </form>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
