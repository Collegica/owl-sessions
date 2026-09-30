# App template

The starting point for every [Collegica](https://www.collegica.org) app: a
small tool that runs in a browser tab, on its own or inside a page on
collegica.org, with nothing uploaded.

The example app is a tally that remembers its count. Replace it with yours.

## Start an app

1. On GitHub, **Use this template** → create `Collegica/<slug>` (or your own
   copy under your account).
2. Rename it, once:

   ```bash
   npm run rename -- my-app "My App"
   ```

   The slug is the app's name everywhere: the custom element `<my-app>`, the
   path `/apps/my-app/` on collegica.org, the storage prefix
   `collegica:my-app:` and the release file `my-app-web.tar.gz`. It must
   contain a hyphen, because custom element names do.
3. Write the app in `src/app.js`, and fill in `app.json`: the description, and
   the privacy line that tells people where their data goes.

## Run and test

Node 22, nothing to install.

```bash
npm start          # http://localhost:8000/
npm test           # the embedding contract and the unit tests
npm run build      # dist/<slug>-web.tar.gz
```

## How it fits on collegica.org

The site's `website/apps.yml` pins each app's release. On every deploy the
site downloads that release and unpacks it into `/apps/<slug>/app/`:

| Address | What it is |
|---|---|
| `/apps/<slug>/` | A page on the site: navigation, the article around the app, and the app itself placed as `<slug>` from `app/src/app.js` |
| `/apps/<slug>/app/` | This repository's `index.html`: the app full-screen, which is what installs to a phone's home screen and works offline |

The app inherits the site's colours and dark mode through the `--cg-*` CSS
custom properties; standalone, `src/tokens.css` supplies the same ones.

## The contract

`npm test` checks that the app keeps to the rules that let many apps share one
site: its element is named for its slug, its paths are relative, it talks to
no other site unless `app.json` declares it, it stores data only under its own
name, and it adds no page-wide keyboard, wheel or touch handlers. The details,
and how to work in this repository with a coding assistant, are in
[`AGENTS.md`](AGENTS.md).

## Release

Publish a GitHub release tagged `vMAJOR.MINOR.PATCH`. The release workflow
tests, builds and attaches `<slug>-web.tar.gz`. It goes live on collegica.org
when the site pins the new tag.

## Known gaps

- **iPhone home-screen icon.** iOS ignores SVG icons in the manifest. Add a
  180 × 180 PNG and `<link rel="apple-touch-icon" href="icon-180.png">` to
  `index.html` (and to `BUNDLE` in `scripts/bundle.mjs`).
- **No browser tests yet.** The contract is checked by reading the files;
  nothing yet clicks through the app in a real browser in CI.

## License

MIT. See [`LICENSE`](LICENSE).
