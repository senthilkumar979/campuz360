import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { Card, EmptyState, ModuleChrome } from '@campuz360/ui';

export default async function AuditPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  const canAudit =
    (await userHasPermission(user.id, 'nexus.audit')) ||
    (await userHasPermission(user.id, 'nexus.admin'));
  if (!canAudit) redirect('/');

  const supabase = await createClient();
  const { data: events } = await supabase
    .from('audit_events')
    .select('id, action, created_at, actor_id, target_id, meta')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <ModuleChrome title="Nexus" emoji="🔐" color="#00b3ee" homeHref="/nexus" nav={[{ href: '/nexus', label: 'Dashboard' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Access audit</h1>
      {!events?.length ? (
        <EmptyState title="No audit events yet" description="Role grants and suspensions will appear here." />
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <Card key={e.id}>
              <p className="font-semibold">{e.action}</p>
              <p className="text-sm text-mut">{new Date(e.created_at).toLocaleString()}</p>
              <p className="text-xs text-mut">actor {e.actor_id} → target {e.target_id}</p>
            </Card>
          ))}
        </div>
      )}
    </ModuleChrome>
  );
}
