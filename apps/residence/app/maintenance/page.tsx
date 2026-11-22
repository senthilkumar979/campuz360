import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, Input, Label, ModuleChrome } from '@campuz360/ui';
import { closeTicketAction, reportMaintenanceAction } from '../actions';

export default async function MaintenancePage() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const isStaff = await userHasPermission(user.id, 'residence.maintenance') || await userHasPermission(user.id, 'residence.admin');
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from('residence_maintenance')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <ModuleChrome title="Residence" emoji="🏠" color="#0284c7" homeHref="/residence" nav={[{ href: '/residence', label: 'Housing' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Maintenance</h1>
      <Card className="mb-6">
        <form action={reportMaintenanceAction} className="space-y-3">
          <div className="space-y-1"><Label>Title</Label><Input name="title" required /></div>
          <div className="space-y-1"><Label>Location</Label><Input name="location" required placeholder="Room 101" /></div>
          <div className="space-y-1"><Label>Description</Label><Input name="description" required /></div>
          <Button type="submit">Report issue</Button>
        </form>
      </Card>
      <div className="space-y-3">
        {(tickets ?? []).filter((t) => isStaff || t.resident_id === user.id).map((t) => (
          <Card key={t.id}>
            <div className="flex justify-between gap-2">
              <div>
                <h2 className="font-bold">{t.title}</h2>
                <p className="text-sm text-mut">{t.location}</p>
                <p>{t.description}</p>
              </div>
              <Badge>{t.status}</Badge>
            </div>
            {isStaff && t.status !== 'closed' ? (
              <form action={closeTicketAction} className="mt-3">
                <input type="hidden" name="id" value={t.id} />
                <Button size="sm">Close ticket</Button>
              </form>
            ) : null}
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
