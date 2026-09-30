// Turn the template into your app, once, right after "Use this template":
//
//   npm run rename -- owl-sessions "OWL Sessions"
//
// The slug is the app's name everywhere: the custom element's tag, its path on
// collegica.org (/apps/<slug>/), its storage prefix and its release file. A
// custom element's name must contain a hyphen, so the slug must too.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, app } from './bundle.mjs';

const [slug, title] = process.argv.slice(2);
if (!slug || !title || !/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(slug)) {
  console.error('usage: npm run rename -- <slug-with-a-hyphen> "<Title>"');
  process.exit(1);
}

const from = app();
const FILES = ['app.json', 'package.json', 'index.html', 'manifest.webmanifest', 'sw.js', 'src/app.js', 'README.md'];

for (const rel of FILES) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, 'utf8');
  const next = text.split(from.slug).join(slug).split(from.title).join(title);
  if (next !== text) {
    writeFileSync(path, next);
    console.log(`updated ${rel}`);
  }
}
console.log(`\nNow ${title} (${slug}). Update the description and privacy line in app.json.`);
