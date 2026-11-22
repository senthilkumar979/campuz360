import { notFound } from 'next/navigation';
import { Badge } from '@campuz360/ui';
import { HandbookMarkdown } from '../../../components/HandbookMarkdown';
import { HANDBOOK_DOCS, getHandbookDoc, readHandbookMarkdown } from '../../../lib/handbook';

export function generateStaticParams() {
  return HANDBOOK_DOCS.filter((doc) => doc.slug !== 'index').map((doc) => ({ slug: doc.slug }));
}

export default async function HandbookDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === 'index') notFound();
  const meta = getHandbookDoc(slug);
  if (!meta) notFound();
  const page = await readHandbookMarkdown(slug);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <header>
        <Badge>Handbook</Badge>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{meta.title}</h1>
        <p className="mt-2 text-mut">{meta.description}</p>
      </header>
      <HandbookMarkdown markdown={page.markdown} />
    </div>
  );
}
