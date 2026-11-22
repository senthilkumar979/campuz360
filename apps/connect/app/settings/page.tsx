import { redirect } from 'next/navigation';
import { createClient, getUser } from '@campuz360/auth/server';
import { shellUrl, NEXUS_LOGIN_PATH } from '@campuz360/auth';
import { Button, Card, ModuleChrome } from '@campuz360/ui';
import { savePrefsAction } from '../actions';

export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect(shellUrl(NEXUS_LOGIN_PATH));
  const supabase = await createClient();
  const { data: prefs } = await supabase.from('connect_preferences').select('*').eq('user_id', user.id).maybeSingle();

  const fields = [
    ['email_workflow', 'Email · Workflow', prefs?.email_workflow ?? true],
    ['email_announcements', 'Email · Announcements', prefs?.email_announcements ?? true],
    ['email_events', 'Email · Events', prefs?.email_events ?? true],
    ['inapp_workflow', 'In-app · Workflow', prefs?.inapp_workflow ?? true],
    ['inapp_announcements', 'In-app · Announcements', prefs?.inapp_announcements ?? true],
    ['inapp_events', 'In-app · Events', prefs?.inapp_events ?? true],
  ] as const;

  return (
    <ModuleChrome title="Connect" emoji="📣" color="#33c2f1" homeHref="/connect" nav={[{ href: '/connect/notifications', label: 'Inbox' }]}>
      <h1 className="mb-4 text-3xl font-extrabold">Notification preferences</h1>
      <Card>
        <form action={savePrefsAction} className="space-y-3">
          {fields.map(([name, label, checked]) => (
            <label key={name} className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" name={name} defaultChecked={Boolean(checked)} />
              {label}
            </label>
          ))}
          <Button type="submit">Save preferences</Button>
        </form>
      </Card>
    </ModuleChrome>
  );
}
