import { redirect } from 'next/navigation';
import { createClient, getUser, userHasPermission } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Button, Card, Input, Label, ModuleChrome } from '@campuz360/ui';
import { publishAnnouncementAction } from './actions';

export default async function ConnectHome() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const canAnnounce = await userHasPermission(user.id, 'connect.announce') || await userHasPermission(user.id, 'connect.admin');
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from('connect_announcements')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(20);

  return (
    <ModuleChrome title="Connect" emoji="📣" color="#33c2f1" homeHref="/connect" nav={[
      { href: '/connect/notifications', label: 'Inbox' },
      { href: '/connect/settings', label: 'Preferences' },
    ]}>
      <h1 className="mb-4 text-3xl font-extrabold">Announcements</h1>
      {canAnnounce ? (
        <Card className="mb-6" accent="#33c2f1">
          <form action={publishAnnouncementAction} className="space-y-3">
            <div className="space-y-1"><Label>Title</Label><Input name="title" required /></div>
            <div className="space-y-1"><Label>Content</Label><Input name="content" required /></div>
            <div className="space-y-1">
              <Label>Audience</Label>
              <select name="audience" className="h-10 w-full rounded-xl border border-line px-3 text-sm">
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <Button type="submit">Publish</Button>
          </form>
        </Card>
      ) : null}
      <div className="space-y-3">
        {(announcements ?? []).map((a) => (
          <Card key={a.id}>
            <h2 className="font-bold">{a.title}</h2>
            <p className="text-sm text-mut">{new Date(a.published_at).toLocaleString()}</p>
            <p className="mt-2">{a.content}</p>
          </Card>
        ))}
      </div>
    </ModuleChrome>
  );
}
