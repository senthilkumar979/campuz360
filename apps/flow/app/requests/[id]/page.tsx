import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Card, ModuleChrome } from '@campuz360/ui';

export default async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const { id } = await params;
  const supabase = await createClient();
  const { data: req } = await supabase.from('flow_requests').select('*').eq('id', id).single();
  const { data: history } = await supabase
    .from('flow_approval_events')
    .select('*, profiles:actor_id(display_name)')
    .eq('request_id', id)
    .order('created_at');

  return (
    <ModuleChrome title="Flow" emoji="🔄" color="#0095c7" homeHref="/flow" nav={[{ href: '/flow', label: 'Back' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Request history</h1>
      <Card className="mb-4">
        <p className="font-bold">{req?.date_from} → {req?.date_to}</p>
        <p className="text-mut">{req?.reason}</p>
        <p className="mt-2 text-sm">Status: {req?.status}</p>
      </Card>
      <div className="space-y-2">
        {(history ?? []).map((h: any) => (
          <Card key={h.id}>
            <p className="font-semibold">{h.action} · {h.stage}</p>
            <p className="text-sm text-mut">{h.profiles?.display_name} · {new Date(h.created_at).toLocaleString()}</p>
            {h.comment ? <p className="text-sm">{h.comment}</p> : null}
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
