// Build the release bundle: dist/<slug>-web.tar.gz, holding the BUNDLE paths
// and a VERSION file. collegica.org unpacks it into /apps/<slug>/app/.
//
//   npm run build -- v1.2.0     (the release workflow passes the tag)
//   npm run build               (VERSION is "dev")

import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, bundleFiles, app } from './bundle.mjs';

const version = process.argv[2] || 'dev';
const { slug } = app();
const out = join(ROOT, 'dist', `${slug}-web`);

rmSync(join(ROOT, 'dist'), { recursive: true, force: true });
for (const rel of bundleFiles()) {
  mkdirSync(dirname(join(out, rel)), { recursive: true });
  cpSync(join(ROOT, rel), join(out, rel));
}

// The service worker's cache is named for the release, so a new one replaces it.
const sw = join(out, 'sw.js');
writeFileSync(sw, readFileSync(sw, 'utf8').replace('-VERSION`', `-${version}\``));
writeFileSync(join(out, 'VERSION'), `${version}\n`);

const tarball = join(ROOT, 'dist', `${slug}-web.tar.gz`);
execFileSync('tar', ['-C', out, '-czf', tarball, '.']);
console.log(`${slug} ${version}: ${bundleFiles().length} files -> dist/${slug}-web.tar.gz`);
