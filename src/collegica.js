// Shared by every Collegica app. Copied in by the template; keep it small.
//
// A Collegica app is a custom element whose tag name is its slug. It renders
// into a shadow root, so its styles never leak into the page around it, while
// the page's --cg-* tokens (light and dark) still reach it: custom properties
// inherit through the shadow boundary. On collegica.org the site defines the
// tokens; standalone, src/tokens.css does.
//
// Every app on collegica.org shares one origin, so storage goes through
// storage() below, which keeps each app's keys under its own name. The
// contract tests fail if src/ touches localStorage or indexedDB directly.

/** Key-value storage under `collegica:<slug>:`. Values are JSON. Never throws:
 *  private windows and blocked site data read as empty. */
export function storage(slug, backing = globalThis.localStorage) {
  const prefix = `collegica:${slug}:`;
  const safe = (f, fallback) => {
    try { return f(); } catch { return fallback; }
  };
  const own = () => safe(() => Object.keys(backing).filter(k => k.startsWith(prefix)), []);

  return {
    get(key, fallback = undefined) {
      const raw = safe(() => backing.getItem(prefix + key), null);
      if (raw === null) return fallback;
      return safe(() => JSON.parse(raw), fallback);
    },
    set(key, value) {
      safe(() => backing.setItem(prefix + key, JSON.stringify(value)));
    },
    remove(key) {
      safe(() => backing.removeItem(prefix + key));
    },
    keys() {
      return own().map(k => k.slice(prefix.length));
    },
    /** Everything this app stored, as one object — for an export button. */
    dump() {
      return Object.fromEntries(this.keys().map(k => [k, this.get(k)]));
    },
    /** Delete everything this app stored, and nothing else. */
    clear() {
      for (const k of own()) safe(() => backing.removeItem(k));
    },
  };
}

/** The IndexedDB name for an app that needs more than key-value storage. */
export const databaseName = slug => `collegica-${slug}`;

/** Styles every app starts from. Tokens fall back to the paper palette. */
export const baseStyles = `
  :host {
    display: block;
    color: var(--cg-text, #1E2333);
    font: inherit;
    line-height: 1.5;
  }
  :host([hidden]) { display: none; }
  * { box-sizing: border-box; }
  h1, h2, h3 { font-family: var(--cg-serif, Georgia, serif); font-weight: 400; color: var(--cg-brand, #3A4366); margin: 0 0 .5em; }
  button {
    font: inherit; font-weight: 600; cursor: pointer;
    padding: .6rem 1.1rem; border-radius: 0;
    border: 1px solid var(--cg-brand, #3A4366);
    background: var(--cg-surface, #FBFAF7); color: var(--cg-brand, #3A4366);
  }
  button.primary { background: var(--cg-btn-bg, #3A4366); color: var(--cg-btn-fg, #FBFAF7); }
  button:focus-visible { outline: 2px solid var(--cg-accent, #C97B1E); outline-offset: 2px; }
  .muted { color: var(--cg-text-muted, #4C5782); }
`;

/** Base class: a shadow root, the app's storage, and render() on connect. */
export class CollegicaApp extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.store = storage(this.localName);
  }
  connectedCallback() {
    this.render();
  }
  /** Subclasses draw into this.root. */
  render() {}
}
