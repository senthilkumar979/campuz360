import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { Button, Card, Input, ModuleChrome } from '@campuz360/ui';

async function createOrgAction(formData: FormData) {
  'use server';
  const user = await getUser();
  if (!user || !(await userHasPermission(user.id, 'nexus.admin'))) return;
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  const supabase = await createClient();
  await supabase.from('org_units').insert({ name });
  revalidatePath('/nexus/admin/orgs');
}

async function assignMemberAction(formData: FormData) {
  'use server';
  const user = await getUser();
  if (!user || !(await userHasPermission(user.id, 'nexus.admin'))) return;
  const supabase = await createClient();
  await supabase.from('org_memberships').insert({
    user_id: String(formData.get('userId')),
    org_unit_id: String(formData.get('orgId')),
  });
  revalidatePath('/nexus/admin/orgs');
}

export default async function OrgsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!(await userHasPermission(user.id, 'nexus.admin'))) redirect('/');
  const supabase = await createClient();
  const { data: orgs } = await supabase.from('org_units').select('*, org_memberships(count)').order('name');
  const { data: profiles } = await supabase.from('profiles').select('id, display_name').order('display_name').limit(50);

  return (
    <ModuleChrome title="Nexus" emoji="🔐" color="#00b3ee" homeHref="/nexus" nav={[{ href: '/nexus', label: 'Dashboard' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Organizational units</h1>
      <Card className="mb-6">
        <form action={createOrgAction} className="flex gap-2">
          <Input name="name" placeholder="New unit name" required />
          <Button type="submit">Add unit</Button>
        </form>
      </Card>
      <div className="space-y-3">
        {(orgs ?? []).map((org: any) => (
          <Card key={org.id}>
            <p className="font-bold">{org.name}</p>
            <form action={assignMemberAction} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="orgId" value={org.id} />
              <select name="userId" className="rounded-xl border border-line px-2 text-sm">
                {(profiles ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.display_name}</option>
                ))}
              </select>
              <Button type="submit" size="sm" variant="outline">Assign member</Button>
            </form>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
