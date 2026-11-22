'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MODULES } from '@campuz360/contracts';
import { Logo, cn } from '@campuz360/ui';

export interface ShellLayoutProps {
  children: React.ReactNode;
  email?: string | null;
  permissions: string[];
  unreadCount?: number;
}

export function ShellLayout({ children, email, permissions, unreadCount = 0 }: ShellLayoutProps) {
  const [open, setOpen] = useState(false);
  const links = MODULES.filter((m) => permissions.includes(m.permission));

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-ink text-white transition md:static md:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center gap-2 px-4 py-5 font-extrabold">
            <Logo size={28} /> Campuz360
          </div>
          <nav className="space-y-1 px-3">
            <Link className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10" href="/">
              Dashboard
            </Link>
            <Link
              className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
              href="/handbook"
            >
              Handbook
            </Link>
            {links.map((m) => (
              <a
                key={m.id}
                className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
                href={m.path}
              >
                {m.emoji} {m.name}
              </a>
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur">
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-1 text-sm font-semibold md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              Menu
            </button>
            <form action="/search" className="hidden flex-1 md:block">
              <input
                name="q"
                placeholder="Search communities, events…"
                className="h-10 w-full max-w-md rounded-xl border border-line px-3 text-sm"
              />
            </form>
            <a
              href="/connect/notifications"
              className="relative rounded-xl border border-line px-3 py-2 text-sm font-semibold"
            >
              🔔
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 text-[10px] text-white">
                  {unreadCount}
                </span>
              ) : null}
            </a>
            <span className="hidden text-sm text-mut sm:inline">{email}</span>
          </header>
          <main className="flex-1 px-4 py-8">{children}</main>
          <footer className="border-t border-line px-4 py-4 text-sm text-mut">
            Campuz360 · A MentorBridge initiative
          </footer>
        </div>
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
