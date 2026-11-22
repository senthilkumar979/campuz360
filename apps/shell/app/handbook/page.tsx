import { Badge, Card } from '@campuz360/ui';
import { HandbookMarkdown } from '../../components/HandbookMarkdown';
import { HANDBOOK_DOCS, readHandbookMarkdown } from '../../lib/handbook';
import Link from 'next/link';

export default async function HandbookHomePage() {
  const page = await readHandbookMarkdown('index');

  return (
    <div className="space-y-8">
      <header className="rounded-[24px] bg-ink px-6 py-10 text-white">
        <Badge className="bg-white/15 text-white">Student handbook</Badge>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Campuz360 docs</h1>
        <p className="mt-3 max-w-2xl text-[#b6d4e2]">
          Architecture, boundaries, design, security, and AI-agent rules — rendered with Flowdown
          so callouts, steps, and tabs stay readable.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {HANDBOOK_DOCS.filter((d) => d.slug !== 'index').map((doc) => (
          <Card key={doc.slug} accent="#00b3ee">
            <h2 className="text-lg font-bold">
              <Link className="hover:text-blue" href={`/handbook/${doc.slug}`}>
                {doc.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-mut">{doc.description}</p>
          </Card>
        ))}
      </div>

      {page ? <HandbookMarkdown markdown={page.markdown} /> : null}
    </div>
  );
}
