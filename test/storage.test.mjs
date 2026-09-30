import { test } from 'node:test';
import assert from 'node:assert/strict';

// collegica.js defines a class extending HTMLElement; give Node a stand-in so
// the module loads. The storage helpers don't touch the DOM.
globalThis.HTMLElement ??= class {};
const { storage, databaseName } = await import('../src/collegica.js');

/** A minimal Storage: own enumerable keys, like the browser's. */
function fakeStorage(initial = {}) {
  const s = { ...initial };
  Object.defineProperties(s, {
    getItem: { value: k => (Object.hasOwn(s, k) ? s[k] : null) },
    setItem: { value: (k, v) => { s[k] = String(v); } },
    removeItem: { value: k => { delete s[k]; } },
  });
  return s;
}

test('keys live under the app\'s own prefix', () => {
  const backing = fakeStorage();
  storage('owl-sessions', backing).set('count', 3);
  assert.deepEqual(Object.keys(backing), ['collegica:owl-sessions:count']);
  assert.equal(storage('owl-sessions', backing).get('count'), 3);
});

test('one app cannot see or clear another\'s data', () => {
  const backing = fakeStorage({ 'collegica:other-app:secret': '"x"', unrelated: '1' });
  const mine = storage('owl-sessions', backing);
  mine.set('a', 1);
  assert.deepEqual(mine.keys(), ['a']);
  assert.equal(mine.get('secret'), undefined);
  mine.clear();
  assert.deepEqual(Object.keys(backing).sort(), ['collegica:other-app:secret', 'unrelated']);
});

test('dump() exports everything the app stored', () => {
  const mine = storage('owl-sessions', fakeStorage());
  mine.set('a', 1);
  mine.set('b', { c: [2] });
  assert.deepEqual(mine.dump(), { a: 1, b: { c: [2] } });
});

test('blocked or broken storage reads as empty and never throws', () => {
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  const s = storage('owl-sessions', broken);
  assert.equal(s.get('count', 0), 0);
  s.set('count', 1);
  s.clear();
  assert.deepEqual(s.keys(), []);
  assert.equal(storage('x-y', fakeStorage({ 'collegica:x-y:bad': '{' })).get('bad', 'fallback'), 'fallback');
});

test('database names follow the same rule', () => {
  assert.equal(databaseName('owl-sessions'), 'collegica-owl-sessions');
});
