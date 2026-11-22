import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Badge, Button, Card, EmptyState, ModuleChrome } from '@campuz360/ui';
import { deleteNotificationAction, markReadAction } from '../actions';

export default async function InboxPage() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('connect_notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <ModuleChrome title="Connect" emoji="📣" color="#33c2f1" homeHref="/connect" nav={[{ href: '/connect', label: 'Announcements' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Notifications</h1>
      {!items?.length ? <EmptyState title="Inbox zero" description="You are all caught up." /> : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id} className={n.is_read ? 'opacity-70' : ''}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {!n.is_read ? <Badge tone="accent">Unread</Badge> : null}
                  <h2 className="font-bold">{n.title}</h2>
                  <p className="text-sm">{n.message}</p>
                </div>
                <div className="flex gap-2">
                  {!n.is_read ? (
                    <form action={markReadAction}><input type="hidden" name="id" value={n.id} /><Button size="sm" variant="outline">Mark read</Button></form>
                  ) : null}
                  <form action={deleteNotificationAction}><input type="hidden" name="id" value={n.id} /><Button size="sm" variant="danger">Delete</Button></form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ModuleChrome>
  );
}
