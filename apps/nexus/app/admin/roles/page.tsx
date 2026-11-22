import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { Badge, Card, ModuleChrome } from '@campuz360/ui';

export default async function RolesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!(await userHasPermission(user.id, 'nexus.admin'))) redirect('/');
  const supabase = await createClient();
  const { data: roles } = await supabase.from('roles').select('id, key, name, description, role_permissions(permissions(key))');

  return (
    <ModuleChrome title="Nexus" emoji="🔐" color="#00b3ee" homeHref="/nexus" nav={[{ href: '/nexus', label: 'Dashboard' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Roles & permissions</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {(roles ?? []).map((role: any) => (
          <Card key={role.id}>
            <h2 className="text-lg font-bold">{role.name}</h2>
            <p className="text-sm text-mut">{role.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(role.role_permissions ?? []).map((rp: any, i: number) => (
                <Badge key={i}>{rp.permissions?.key}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
