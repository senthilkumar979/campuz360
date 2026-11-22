import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, Input, Label, ModuleChrome } from '@campuz360/ui';
import { createCommunityAction, joinCommunityAction } from './actions';

export default async function SphereHome({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const { q } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from('sphere_communities').select('*, sphere_memberships(count)').order('created_at', { ascending: false });
  if (q) query = query.ilike('name', `%${q}%`);
  const { data: communities } = await query;

  return (
    <ModuleChrome title="Sphere" emoji="🌐" color="#0ea5a4" homeHref="/sphere">
      <h1 className="mb-4 text-3xl font-extrabold">Communities</h1>
      <form className="mb-4 flex gap-2"><Input name="q" placeholder="Search communities" defaultValue={q} /><Button type="submit" variant="outline">Search</Button></form>
      <Card className="mb-6" accent="#0ea5a4">
        <form action={createCommunityAction} className="space-y-3">
          <div className="space-y-1"><Label>Name</Label><Input name="name" required /></div>
          <div className="space-y-1"><Label>Description</Label><Input name="description" /></div>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isPrivate" /> Private</label>
          <Button type="submit">Create community</Button>
        </form>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {(communities ?? []).map((c: any) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">{c.name}</h2>
              <Badge>Members: {c.sphere_memberships?.[0]?.count ?? 0}</Badge>
            </div>
            <p className="text-sm text-mut">{c.description}</p>
            {c.is_private ? <Badge tone="warn">Private</Badge> : <Badge tone="success">Public</Badge>}
            <div className="mt-3 flex gap-2">
              <Button asChild size="sm"><Link href={`/sphere/communities/${c.id}`}>Open</Link></Button>
              <form action={joinCommunityAction}>
                <input type="hidden" name="communityId" value={c.id} />
                <input type="hidden" name="isPrivate" value={String(c.is_private)} />
                <Button type="submit" size="sm" variant="outline">{c.is_private ? 'Request to join' : 'Join'}</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
