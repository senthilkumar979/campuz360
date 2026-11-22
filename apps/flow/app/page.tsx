import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, EmptyState, Input, Label, ModuleChrome } from '@campuz360/ui';
import { submitLeaveAction } from './actions';

export default async function FlowHome({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const { status } = await searchParams;
  const supabase = await createClient();
  let q = supabase.from('flow_requests').select('*').eq('requester_id', user.id).order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data: requests } = await q;

  return (
    <ModuleChrome title="Flow" emoji="🔄" color="#0095c7" homeHref="/flow" nav={[
      { href: '/flow', label: 'My requests' },
      { href: '/flow/tasks', label: 'My tasks' },
    ]}>
      <h1 className="mb-4 text-3xl font-extrabold">Leave requests</h1>
      <Card className="mb-8" accent="#0095c7">
        <h2 className="mb-3 font-bold">Submit leave request</h2>
        <form action={submitLeaveAction} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1"><Label>From</Label><Input name="dateFrom" type="date" required /></div>
          <div className="space-y-1"><Label>To</Label><Input name="dateTo" type="date" required /></div>
          <div className="space-y-1 md:col-span-2"><Label>Reason</Label><Input name="reason" required placeholder="Reason is required" /></div>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
      <div className="mb-4 flex gap-2">
        {['', 'pending', 'completed', 'rejected'].map((s) => (
          <Button key={s || 'all'} asChild size="sm" variant="outline">
            <Link href={s ? `/flow?status=${s}` : '/flow'}>{s || 'all'}</Link>
          </Button>
        ))}
      </div>
      {!requests?.length ? <EmptyState title="All caught up!" description="No requests yet." /> : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{r.date_from} → {r.date_to}</p>
                  <p className="text-sm text-mut">{r.reason}</p>
                </div>
                <Badge>{r.status}</Badge>
              </div>
              <Button asChild size="sm" className="mt-3" variant="ghost">
                <Link href={`/flow/requests/${r.id}`}>History</Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </ModuleChrome>
  );
}
