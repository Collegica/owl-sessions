# Instructions for coding assistants

This repository is one Collegica app, started from
[Collegica/app-template](https://github.com/Collegica/app-template). It runs in
a browser tab with no build step and no dependencies, on its own and inside a
page on collegica.org. Read this before changing anything.

## Commands

| Command | What it does |
|---|---|
| `npm start` | Serve the app at http://localhost:8000/ |
| `npm test` | The embedding contract and unit tests. Run before every commit |
| `npm run build -- <tag>` | The release bundle, `dist/<slug>-web.tar.gz` |
| `npm run rename -- <slug> "<Title>"` | Once, when the template becomes a new app |

There is no npm install: Node 22's built-ins are all it uses. Don't add a
dependency or a bundler without the owner asking for one.

## Layout

| Path | What it is |
|---|---|
| `app.json` | The app's slug, title, description, privacy line, the other sites it talks to (`origins`), and how it is embedded |
| `src/app.js` | The app: a custom element named for the slug |
| `src/collegica.js` | Shared helpers from the template: `CollegicaApp`, `storage()`, `databaseName()`, `baseStyles`. Change it only to fix it, and say so in the pull request |
| `src/tokens.css` | Collegica's colour and type tokens, light and dark, for the standalone page only |
| `index.html` | The standalone page: loads the tokens, places the element, registers the service worker |
| `manifest.webmanifest`, `sw.js`, `icon.svg` | Install to a home screen and work offline |
| `scripts/bundle.mjs` | The list of paths that ship. A new file or folder the app needs must be added here |
| `test/` | `contract.test.mjs` (the rules below) and unit tests |

## The contract

Many apps share collegica.org. `npm test` enforces these; don't weaken a test
to make it pass.

1. **The element's name is the slug** in `app.json`, and it renders into its
   shadow root. Style it with the `--cg-*` tokens so it follows the site's
   light and dark themes.
2. **Relative paths only.** On the site the app lives in `/apps/<slug>/app/`;
   a path starting with `/` points outside it.
3. **No requests to other sites** unless the origin is listed in
   `app.json` `origins` and the `privacy` line says what is sent there. The
   default promise is "Nothing leaves the tab."
4. **Storage through `storage(slug)`** (keys under `collegica:<slug>:`) or an
   IndexedDB database named `databaseName(slug)`. Never touch
   `localStorage`, `sessionStorage` or `indexedDB` directly.
5. **No page-wide keyboard, wheel or touch handlers.** Attach them to the
   element or its shadow root. A window-level handler that cancels Tab or
   scrolling breaks the whole site.
6. **Accessible and small-screen first:** real buttons and labels, visible
   focus, works with the keyboard, readable at 320 px wide, in light and dark.

## Working here

- Small pull requests, one change each, with a message saying what changed
  and why. The history is read by learners.
- Run `npm test` and open the app with `npm start` before calling anything
  done; say what you checked in the browser.
- Put what the user may see or keep behind a clear control: anything the app
  stores should be exportable (`store.dump()`) and deletable (`store.clear()`).
- Don't add analytics, trackers, fonts or scripts from other sites.

## Releasing

Publish a GitHub release with a `vMAJOR.MINOR.PATCH` tag. The release
workflow runs the tests, builds the bundle and attaches it. The app goes live
on collegica.org only when the site's `website/apps.yml` pins that tag, which
is a separate pull request in the site's repository.
