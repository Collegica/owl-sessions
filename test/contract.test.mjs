// The embedding contract: what every Collegica app promises so that many of
// them can share collegica.org. These tests read the shipped files; they fail
// with a message saying which rule broke and where.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, bundleFiles, app } from '../scripts/bundle.mjs';

const meta = app();
const read = rel => readFileSync(join(ROOT, rel), 'utf8');
const textFiles = bundleFiles().filter(f => /\.(html|js|mjs|css|json|webmanifest|svg)$/.test(f));
const sources = bundleFiles().filter(f => /\.(js|mjs)$/.test(f));

test('app.json describes the app', () => {
  assert.match(meta.slug, /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/, 'slug: lowercase words joined by hyphens, at least one hyphen');
  for (const key of ['title', 'description', 'privacy']) {
    assert.ok(typeof meta[key] === 'string' && meta[key].trim(), `app.json needs a "${key}"`);
  }
  assert.ok(['component', 'frame'].includes(meta.embed), 'embed is "component" or "frame"');
  assert.ok(Array.isArray(meta.origins), 'origins lists the other sites the app talks to ([] if none)');
});

test('the custom element is named for the slug', () => {
  assert.match(read('src/app.js'), new RegExp(`customElements\\.define\\(\\s*['"]${meta.slug}['"]`),
    `src/app.js must define <${meta.slug}>`);
  assert.match(read('index.html'), new RegExp(`<${meta.slug}[\\s>]`), `index.html must place <${meta.slug}>`);
});

test('every path stays inside the app\'s folder', () => {
  // Root-relative references ("/x") would point outside /apps/<slug>/app/.
  const rootRelative = /(?:src|href|action)\s*=\s*["']\/(?!\/)|url\(\s*["']?\/(?!\/)|(?:fetch|import)\(\s*["'`]\/(?!\/)|from\s+["']\/(?!\/)/;
  for (const f of textFiles) {
    assert.doesNotMatch(read(f), rootRelative, `${f}: use a relative path, not one starting with "/"`);
  }
  const manifest = JSON.parse(read('manifest.webmanifest'));
  for (const key of ['id', 'start_url', 'scope']) {
    assert.equal(manifest[key], './', `manifest.webmanifest: ${key} must be "./"`);
  }
});

test('no requests to other sites, unless declared in app.json "origins"', () => {
  const allowed = new Set(meta.origins);
  const urls = [
    /(['"`])(https?:\/\/[^'"`\s]+)\1/g,                          // string literals
    /(?:src|href|action)\s*=\s*(["'])(https?:\/\/[^"']+)\1/g,    // HTML attributes
    /url\(\s*(["']?)(https?:\/\/[^"')]+)\1\s*\)/g,               // CSS
  ];
  for (const f of textFiles) {
    const text = read(f);
    for (const re of urls) {
      for (const [, , url] of text.matchAll(re)) {
        const origin = new URL(url).origin;
        if (origin === 'http://www.w3.org') continue; // XML namespaces, not requests
        assert.ok(allowed.has(origin), `${f}: ${url} — add ${origin} to "origins" in app.json, and say why in "privacy"`);
      }
    }
  }
});

test('storage goes through storage() so apps cannot read each other\'s', () => {
  for (const f of sources.filter(f => f !== 'src/collegica.js')) {
    assert.doesNotMatch(read(f), /\b(localStorage|sessionStorage|indexedDB)\b/,
      `${f}: use storage(slug) or databaseName(slug) from collegica.js`);
  }
});

test('no page-wide keyboard, wheel or touch handlers', () => {
  // An app shares the page: a window-level handler that cancels Tab or
  // scrolling breaks the whole site. Listen on the element or its shadow root.
  const pageWide = /\b(window|document|document\.body|globalThis)\s*\.\s*addEventListener\(\s*['"](keydown|keypress|keyup|wheel|mousewheel|touchstart|touchmove|touchend)['"]/;
  for (const f of sources) {
    assert.doesNotMatch(read(f), pageWide, `${f}: attach input handlers to the element, not the page`);
  }
});
