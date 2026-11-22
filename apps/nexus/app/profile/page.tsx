import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { Button, Card, Input, Label, ModuleChrome } from '@campuz360/ui';
import { updateProfileAction } from '../actions';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <ModuleChrome title="Nexus" emoji="🔐" color="#00b3ee" homeHref="/nexus" nav={[{ href: '/nexus', label: 'Dashboard' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">My profile</h1>
      <Card>
        <form action={updateProfileAction} className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" name="displayName" defaultValue={profile?.display_name ?? ''} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={profile?.phone ?? ''} />
          </div>
          <p className="text-sm text-mut">Email: {profile?.email ?? user.email}</p>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </ModuleChrome>
  );
}
