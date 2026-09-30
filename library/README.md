# OWL Sessions — the exercise library and the player

**Status:** the record of how the clips were made. The app is this repository; the clips it plays are in `../clips/` (re-encoded, 8 MB for seventeen).
**Article:** [A Session You Can Keep](https://www.collegica.org/aging-well/exercise-sessions/).
**Precedent:** [OWL Planner](https://github.com/Collegica/owl-planner) — a browser tab, nothing uploaded.
**Research:** [the five-model comparison](https://github.com/Collegica/collegica-code/tree/main/docs/research/2026-09-13-exercise-sessions) the clips came out of.

The muscle tool of the OWL framework, beside OWL Planner for money: it
builds a 30, 45 or 60 minute session from a library of exercise clips,
shows each move with a timer and a rep count, and puts one minute of rest
between blocks. Everything runs in the page; nothing is uploaded.

The player, moves and plans are in `../src/`.

## The clips

Seventeen exercises, one 10-second clip each, generated through HiggsField
on 2026-09-13 from the prompts in `prompts.json`, written to the
`exercise-videos` skill's template: fourteen with Wan 3.0 (720p, silent,
"thinking" on) and the three standing clips Wan kept cropping with Kling
v3.0 (pro, 1:1, sound off). Twenty-nine generations in all, 17.5 credits
each, 507.5 credits; the dead bug came from the five-model comparison in
`docs/2026-09-13-exercise-sessions/clips/`. `fetch.sh` downloads a result
and writes its contact sheet; the sheets in `sheets/` are the
verification record, sampled at two frames a second; the MP4s stay on
disk and out of git. Form was judged by an editor from the sheets, not by
a trainer. Files with a suffix (`-v1`, `-v2`, `-4x3`, `-16x9`, `-wan`) are
attempts not used.

| Clip | Frame | Verdict |
|---|---|---|
| dead-bug | 16:9 | Correct: tabletop start, opposite arm and leg, sides alternate |
| bird-dog | 16:9 | Correct and clean |
| side-plank | 16:9 | Correct: forearm under shoulder, straight line, steady hold |
| front-plank | 16:9 | Correct: steady hold, straight line |
| glute-bridge | 16:9 | Correct |
| cat-camel | 16:9 | Correct: smooth rounding and sinking, hands and knees still |
| suitcase-carry | 16:9 | Correct, whole body in frame |
| single-arm-row | 16:9 | Correct: knee and hand on the bench, flat back, elbow to the hip |
| jog-in-place | 16:9 | Correct, whole body in frame |
| skater-hops | 4:3 | Correct: side-to-side hops landing on one foot, whole body in frame |
| kettlebell-swing | 4:3 | Correct: hinge, flat back, bell floats to chest height, whole body in frame |
| pallof-press | 4:3 | Correct: band anchored to a post, press out and back, torso square, whole body in frame |
| half-kneeling-press | 4:3 | Correct on the second attempt (side view); the first, a front view, rendered a blurred face |
| goblet-squat | 4:3 | Correct; the 4:3 frame fixed the head crop the two 16:9 attempts had |
| kettlebell-deadlift | 1:1, Kling | Correct, whole body in frame; the three Wan attempts (16:9, 16:9, 4:3) all cropped the head |
| march-in-place | 1:1, Kling | Correct, whole body in frame; the three Wan attempts all cropped the head |
| step-ups | 1:1, Kling | Correct, whole body in frame even on top of the step; both Wan attempts cropped the head |

Dropped: **McGill curl-up**. Both attempts produced a crunch with the hands
behind the head and both knees bent, however plainly the prompt said
otherwise. The sheets are kept; the move is out of the library and the
plans until a reference-video route is tried.

## What the run taught

- **Wan 3.0 frames floor work well and standing work too tight.** Every
  mat clip kept the whole body in frame. Standing exercises from a "hip
  height" camera in 16:9 cut the head at the top. A 4:3 frame fixed the
  goblet squat and framed the swing, the Pallof press, the skater hops and
  the press cleanly, but did not fix the deadlift (side view), the march
  (three-quarter front) or the step-ups, where the step raises the person.
  Kling v3.0 in a square frame framed all three whole on the first try,
  with the same prompts. So the library is mixed: Wan for the mat and for
  the standing moves it framed, Kling for the three it did not; the player
  letterboxes, so the frames can differ.
- **Substitution is the failure that survives correction.** The curl-up
  came back as a crunch twice, the second time with the prompt saying
  "not a crunch, hands never behind the head". When a model has a strong
  prior for a similar, better-known exercise, a second text attempt does
  not move it; a reference video would.
- **Front views can lose the face.** The first press, a three-quarter
  front view, rendered a smeared face; the side-view retake was clean. For
  moves where the face is close to the camera, prefer a side view.
- **Seven concurrent Wan jobs hit a rate limit** (`429
  rate_limit_reached`); five or six at a time is safe. A submission can
  come back as a preset recommendation instead of a job; resubmitting with
  `declined_preset_id` set to that preset's id submits the literal prompt.
- **Batches take longer per clip than a single job.** One clip alone
  returned in about two minutes; six or seven at once took five to six.

## Files

- The app is this repository (see `../README.md`); `?start=30` opens
  straight into a session.
- `prompts.json`, `fetch.sh` — how the clips were made. The job ids that
  map each clip to its generation stay in Collegica's private repository.
- `videos/` (gitignored), `sheets/` — the clips and their contact sheets;
  `-v1` and `-v2` suffixes are the attempts not used.
