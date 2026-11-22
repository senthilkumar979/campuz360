#!/usr/bin/env node
import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modules = ['shell', 'nexus', 'flow', 'connect', 'sphere', 'residence', 'pulse'];

const handbookDir = path.join(root, 'apps/shell/content/handbook');
const handbookModulesDir = path.join(handbookDir, 'modules');
const docsModulesDir = path.join(root, 'docs/modules');

mkdirSync(handbookModulesDir, { recursive: true });
mkdirSync(docsModulesDir, { recursive: true });

for (const file of readdirSync(path.join(root, 'docs'))) {
  if (!file.endsWith('.md')) continue;
  copyFileSync(path.join(root, 'docs', file), path.join(handbookDir, file));
}

for (const name of modules) {
  const src = path.join(root, 'apps', name, 'docs', 'README.md');
  copyFileSync(src, path.join(handbookModulesDir, `${name}.md`));
  copyFileSync(src, path.join(docsModulesDir, `${name}.md`));
}

console.log(
  `Synced platform docs + ${modules.length} module docs → apps/shell/content/handbook and docs/modules`,
);
