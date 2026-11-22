import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, EmptyState, Input, ModuleChrome } from '@campuz360/ui';
import { decideRequestAction } from '../actions';

export default async function TasksPage() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const canApprove = await userHasPermission(user.id, 'flow.leave.approve') || await userHasPermission(user.id, 'flow.admin');
  if (!canApprove) redirect('/');
  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from('flow_requests')
    .select('*, profiles:requester_id(display_name)')
    .in('status', ['pending', 'advisor_approved'])
    .order('created_at', { ascending: true });

  return (
    <ModuleChrome title="Flow" emoji="🔄" color="#0095c7" homeHref="/flow" nav={[{ href: '/flow', label: 'My requests' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Pending approvals</h1>
      {!tasks?.length ? <EmptyState title="No pending tasks" /> : (
        <div className="space-y-3">
          {tasks.map((t: any) => (
            <Card key={t.id}>
              <p className="font-bold">{t.profiles?.display_name ?? 'Student'} · {t.date_from} to {t.date_to}</p>
              <p className="text-sm text-mut">{t.reason}</p>
              <Badge className="mt-2">{t.current_stage}</Badge>
              <form action={decideRequestAction} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="requestId" value={t.id} />
                <Input name="comment" placeholder="Optional comment" className="max-w-xs" />
                <Button name="decision" value="approve" type="submit" size="sm">Approve</Button>
                <Button name="decision" value="reject" type="submit" size="sm" variant="danger">Reject</Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </ModuleChrome>
  );
}
