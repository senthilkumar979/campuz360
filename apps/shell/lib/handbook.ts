import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface HandbookDoc {
  slug: string;
  title: string;
  description: string;
  file: string;
}

export const HANDBOOK_DOCS: HandbookDoc[] = [
  {
    slug: 'index',
    title: 'Handbook home',
    description: 'Index of all Campuz360 student and agent docs.',
    file: 'README.md',
  },
  {
    slug: 'onboarding',
    title: 'Student onboarding',
    description: 'Day-0 checklist and first-week goals for each trio.',
    file: 'student-onboarding.md',
  },
  {
    slug: 'architecture',
    title: 'Architecture',
    description: 'Vertical MFEs, Shell rewrites, auth, and delivery order.',
    file: 'architecture.md',
  },
  {
    slug: 'boundaries',
    title: 'MFE boundaries',
    description: 'Ownership matrix, table prefixes, and shared packages.',
    file: 'mfe-boundaries.md',
  },
  {
    slug: 'design',
    title: 'Design system',
    description: 'Brand tokens, components, and layout rules.',
    file: 'design-system.md',
  },
  {
    slug: 'rules',
    title: 'Development rules',
    description: 'Tooling, git workflow, DoD, and testing expectations.',
    file: 'development-rules.md',
  },
  {
    slug: 'security',
    title: 'Data & security',
    description: 'RLS, secrets, migrations, and common pitfalls.',
    file: 'data-and-security.md',
  },
  {
    slug: 'ai-agents',
    title: 'AI agents',
    description: 'Cursor, Antigravity, and other AI coding tools.',
    file: 'ai-agents.md',
  },
  {
    slug: 'backlog',
    title: 'Feature backlog map',
    description: 'Where product-plan stories live in the codebase.',
    file: 'feature-backlog.md',
  },
  {
    slug: 'module-shell',
    title: 'Module · Shell',
    description: 'Host app: layout, rewrites, handbook, dashboard, search.',
    file: 'modules/shell.md',
  },
  {
    slug: 'module-nexus',
    title: 'Module · Nexus',
    description: 'Identity, auth UX, roles, orgs, directory, audit.',
    file: 'modules/nexus.md',
  },
  {
    slug: 'module-flow',
    title: 'Module · Flow',
    description: 'Leave requests, approvals, and request history.',
    file: 'modules/flow.md',
  },
  {
    slug: 'module-connect',
    title: 'Module · Connect',
    description: 'Announcements, inbox, preferences, notify RPC.',
    file: 'modules/connect.md',
  },
  {
    slug: 'module-sphere',
    title: 'Module · Sphere',
    description: 'Communities, posts, comments, and moderation.',
    file: 'modules/sphere.md',
  },
  {
    slug: 'module-residence',
    title: 'Module · Residence',
    description: 'Housing inventory, allocations, and maintenance.',
    file: 'modules/residence.md',
  },
  {
    slug: 'module-pulse',
    title: 'Module · Pulse',
    description: 'Events, registration, attendance, and calendar.',
    file: 'modules/pulse.md',
  },
];

function docsCandidates() {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'content', 'handbook'),
    path.join(cwd, 'docs'),
    path.join(cwd, '..', '..', 'docs'),
    path.join(cwd, '..', 'docs'),
  ];
}

export async function resolveDocsDir() {
  for (const dir of docsCandidates()) {
    try {
      await fs.access(path.join(dir, 'README.md'));
      return dir;
    } catch {
      // try next
    }
  }
  throw new Error('Could not find docs/ or content/handbook. Keep docs next to the monorepo root.');
}

export function getHandbookDoc(slug: string) {
  return HANDBOOK_DOCS.find((doc) => doc.slug === slug) ?? null;
}

export async function readHandbookMarkdown(slug: string) {
  const doc = getHandbookDoc(slug);
  if (!doc) return null;
  const dir = await resolveDocsDir();
  const fullPath = path.join(dir, doc.file);
  const markdown = await fs.readFile(fullPath, 'utf8');
  return { doc, markdown, fullPath };
}
