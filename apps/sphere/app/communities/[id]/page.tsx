import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Button, Card, Input, ModuleChrome } from '@campuz360/ui';
import { commentAction, createPostAction, decideJoinAction, deletePostAction, reportPostAction } from '../../actions';

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const { id } = await params;
  const supabase = await createClient();
  const { data: community } = await supabase.from('sphere_communities').select('*').eq('id', id).single();
  const { data: posts } = await supabase.from('sphere_posts').select('*, sphere_comments(*), profiles:author_id(display_name)').eq('community_id', id).order('created_at', { ascending: false });
  const { data: pending } = await supabase.from('sphere_memberships').select('*, profiles:user_id(display_name)').eq('community_id', id).eq('status', 'pending');

  return (
    <ModuleChrome title="Sphere" emoji="🌐" color="#0ea5a4" homeHref="/sphere" nav={[{ href: '/sphere', label: 'Communities' }]}>
      <h1 className="mb-2 text-3xl font-extrabold">{community?.name}</h1>
      <p className="mb-6 text-mut">{community?.description}</p>
      {(pending ?? []).length ? (
        <Card className="mb-6">
          <h2 className="mb-2 font-bold">Join requests</h2>
          {(pending ?? []).map((m: any) => (
            <form key={m.id} action={decideJoinAction} className="mb-2 flex items-center gap-2">
              <span>{m.profiles?.display_name}</span>
              <input type="hidden" name="membershipId" value={m.id} />
              <Button name="decision" value="approve" size="sm">Approve</Button>
              <Button name="decision" value="reject" size="sm" variant="danger">Decline</Button>
            </form>
          ))}
        </Card>
      ) : null}
      <Card className="mb-6">
        <form action={createPostAction} className="space-y-2">
          <input type="hidden" name="communityId" value={id} />
          <Input name="title" placeholder="Post title" required />
          <Input name="body" placeholder="Share an update" required />
          <Button type="submit">New post</Button>
        </form>
      </Card>
      <div className="space-y-4">
        {(posts ?? []).map((p: any) => (
          <Card key={p.id}>
            <h2 className="font-bold">{p.title}</h2>
            <p className="text-sm text-mut">{p.profiles?.display_name} · {new Date(p.created_at).toLocaleString()}</p>
            <p className="mt-2">{p.body}</p>
            <div className="mt-2 flex gap-2">
              <form action={deletePostAction}>
                <input type="hidden" name="postId" value={p.id} />
                <input type="hidden" name="communityId" value={id} />
                <Button size="sm" variant="danger">Delete</Button>
              </form>
              <form action={reportPostAction}>
                <input type="hidden" name="postId" value={p.id} />
                <input type="hidden" name="reason" value="spam" />
                <Button size="sm" variant="outline">Report</Button>
              </form>
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-3">
              {(p.sphere_comments ?? []).map((c: any) => (
                <p key={c.id} className="text-sm"><b>{c.author_id.slice(0, 6)}</b>: {c.body}</p>
              ))}
              <form action={commentAction} className="flex gap-2">
                <input type="hidden" name="postId" value={p.id} />
                <input type="hidden" name="communityId" value={id} />
                <Input name="body" placeholder="Add a comment" required />
                <Button type="submit" size="sm">Comment</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
