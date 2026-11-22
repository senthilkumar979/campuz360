import Link from 'next/link';
import { Logo } from '@campuz360/ui';
import { HANDBOOK_DOCS } from '../../lib/handbook';
import './handbook.css';

export default function HandbookLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <Logo size={28} />
            Campuz360
          </Link>
          <span className="text-mut">/</span>
          <Link href="/handbook" className="font-semibold text-blue">
            Handbook
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <nav className="h-fit rounded-2xl border border-line bg-card p-4 lg:sticky lg:top-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-mut">Contents</p>
          <ul className="space-y-1 text-sm font-semibold">
            {HANDBOOK_DOCS.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={doc.slug === 'index' ? '/handbook' : `/handbook/${doc.slug}`}
                  className="block rounded-lg px-2 py-1.5 text-ink hover:bg-[#e6f7fd] hover:text-blue"
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
