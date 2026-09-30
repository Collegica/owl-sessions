// What ships in a release: these paths, and nothing else. The build copies
// them; the contract tests check them. Add a path here when the app gains one.

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const BUNDLE = ['index.html', 'manifest.webmanifest', 'sw.js', 'icon.svg', 'app.json', 'src'];

/** Every file in the bundle, as paths relative to the repository root. */
export function bundleFiles() {
  const out = [];
  const walk = rel => {
    const abs = join(ROOT, rel);
    if (statSync(abs).isDirectory()) {
      for (const name of readdirSync(abs).sort()) walk(join(rel, name));
    } else {
      out.push(rel);
    }
  };
  BUNDLE.forEach(walk);
  return out;
}

export const app = () => JSON.parse(readFileSync(join(ROOT, 'app.json'), 'utf8'));
