import { Logo } from './Logo';
import { cn } from '../lib/cn';

export interface ModuleChromeProps {
  title: string;
  emoji: string;
  color: string;
  /** Module root (e.g. `/nexus`). */
  homeHref?: string;
  /** Shell dashboard. Prefer absolute Shell origin when MFEs run on their own ports. */
  platformHref?: string;
  nav?: { href: string; label: string }[];
  children: React.ReactNode;
  className?: string;
}

function defaultPlatformHref() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return origin && origin.length > 0 ? origin : '/';
}

export const ModuleChrome = ({
  title,
  emoji,
  color,
  homeHref = '/',
  platformHref = defaultPlatformHref(),
  nav = [],
  children,
  className,
}: ModuleChromeProps) => (
  <div className={cn('min-h-screen bg-bg', className)}>
    <header className="border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <a href={homeHref} className="flex items-center gap-2 font-extrabold">
          <Logo size={28} />
          <span>
            {emoji} {title}
          </span>
        </a>
        <nav className="ml-auto flex flex-wrap items-center gap-3 text-sm font-semibold text-mut">
          <a href={platformHref} className="text-ink hover:text-blue">
            Home
          </a>
          {nav.map((item) => (
            <a key={`${item.href}-${item.label}`} href={item.href} className="hover:text-blue">
              {item.label}
            </a>
          ))}
        </nav>
        <span className="hidden h-2 w-2 rounded-full sm:block" style={{ background: color }} />
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
  </div>
);
