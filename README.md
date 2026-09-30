# OWL Sessions

Thirty, forty-five or sixty minutes of exercise from a library of seventeen
moves, each shown as a clip under a timer and a rep count, with a minute of
rest between blocks. It runs in a browser tab: no account, no upload.

It is the muscle tool of the OWL framework (Optimal Wealth and Longevity),
beside [OWL Planner](https://github.com/Collegica/owl-planner) for money. The
method behind it is in
[A Session You Can Keep](https://www.collegica.org/aging-well/exercise-sessions/).

**Next:** an AI coach that builds today's session from a check-in — built
here in the open, one pull request per lesson of a Collegica course.

## Run it

Node 22, nothing to install.

```bash
npm start          # http://localhost:8000/
npm test           # the plans, the library, and the embedding contract
```

`?start=30` (or `45`, `60`) opens straight into a session; `&at=N` jumps to
step N.

## What's here

| Path | What it is |
|---|---|
| `src/app.js` | The `<owl-sessions>` element: the screen, the clock, the sounds |
| `src/timeline.js` | The session as steps, the clock format and the rep count — pure, tested |
| `src/moves.js` | The library: each move's name, family, cue, and tempo (seconds per rep) or `hold` |
| `src/plans.js` | The 30, 45 and 60 minute sessions, as blocks of moves with working seconds |
| `clips/` | One ten-second clip per move, re-encoded for the web (8 MB) |
| `images/rest.jpg` | Shown during the minute of rest |
| `library/` | How the clips were made: the prompts, `fetch.sh`, and a contact sheet per clip |
| `test/timeline.test.mjs` | Every plan lasts exactly its stated length, every move is in the library |

## The clips

The demonstrator is generated, not filmed. Each clip was made from the
prompts in `library/prompts.json` and checked by a person against the
exercise from the contact sheets in `library/sheets/` (two frames a second). A
trainer has not checked them. The details, and the moves that took more
than one try, are in [`library/README.md`](library/README.md).

## On collegica.org

Started from [Collegica/app-template](https://github.com/Collegica/app-template),
so it keeps the same contract: its own path, its own storage names, no
requests to other sites, no page-wide input handlers. A release attaches
`owl-sessions-web.tar.gz`; the site serves the version it pins at
`/apps/owl-sessions/`. Working in this repository with a coding assistant:
see [`AGENTS.md`](AGENTS.md).

## History

Moved on 2026-09-29 from Collegica's private site repository, where it was
built in pull requests #68, #71, #72, #74, #75 and #76 (September 13–14,
2026), the first of them co-authored with Claude. The commits there were
not carried over; this repository starts from the app as it was then.

## License

MIT. See [`LICENSE`](LICENSE).
