'use client';

import { Markdown } from '@localix-ai/flowdown';
import '@localix-ai/flowdown/styles.css';

export interface HandbookMarkdownProps {
  markdown: string;
}

export const HandbookMarkdown = ({ markdown }: HandbookMarkdownProps) => (
  <article className="handbook-md max-w-none text-ink">
    <Markdown>{markdown}</Markdown>
  </article>
);
