// <owl-sessions>: a session of exercise, each move shown as a clip under a
// timer and a rep count, with a minute of rest between blocks.
//
// Clips and images are resolved against this module's URL, not the page's,
// so the same element works full-screen at /apps/owl-sessions/app/ and placed
// in the site's page at /apps/owl-sessions/.

import { CollegicaApp, baseStyles } from './collegica.js';
import moves from './moves.js';
import plans from './plans.js';
import { timeline, totalSeconds, fmt, reps } from './timeline.js';

const asset = path => new URL(`../${path}`, import.meta.url).href;
const clip = id => asset(`clips/${id}.mp4`);

const styles = `
  ${baseStyles}
  :host { --rest: #2F6F4F; container-type: inline-size; }
  .bar { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: center; padding: 0 0 1rem; border-bottom: 1px solid var(--cg-line, #E2E5EE); margin-bottom: 1.25rem; }
  .title { font-family: var(--cg-serif, Georgia, serif); font-weight: 400; font-size: 1.9rem; line-height: 1; color: var(--cg-brand, #3A4366); margin: 0 auto 0 0; letter-spacing: -.02em; }
  .bar label { color: var(--cg-text-muted, #4C5782); font-size: .95rem; }
  select, button { font: inherit; padding: .45rem .8rem; border: 1px solid var(--cg-brand, #3A4366); border-radius: 6px; background: var(--cg-surface, #FBFAF7); color: var(--cg-brand, #3A4366); }
  button { font-weight: 400; }
  button.primary { background: var(--cg-btn-bg, #3A4366); color: var(--cg-btn-fg, #FBFAF7); }
  .session { display: inline-flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
  .main { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 1.5rem; }
  @container (max-width: 52rem) { .main { grid-template-columns: 1fr; } }
  .stage { position: relative; aspect-ratio: 16 / 9; background: var(--cg-surface-2, #F4F2ED); border: 1px solid var(--cg-line, #E2E5EE); border-radius: 10px; overflow: hidden; }
  .stage video, .stage .rest { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .stage video { object-fit: contain; background: var(--cg-surface-2, #F4F2ED); }
  .stage .rest { object-fit: cover; }
  .badge { position: absolute; left: .75rem; top: .75rem; font-size: .72rem; letter-spacing: .18em; text-transform: uppercase; background: var(--cg-surface, #FBFAF7); color: var(--cg-brand, #3A4366); padding: .3rem .6rem; border-radius: 4px; font-weight: 600; }
  .panel { display: flex; flex-direction: column; gap: .6rem; }
  .preview { display: block; color: var(--cg-text-muted, #4C5782); font-size: .95rem; }
  .preview select { margin-left: .4rem; max-width: 100%; }
  .block { font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: var(--cg-accent-text, #8F5410); font-weight: 600; }
  .name { font: 400 clamp(2.2rem, 5vw, 3.4rem)/1 var(--cg-serif, Georgia, serif); color: var(--cg-brand, #3A4366); letter-spacing: -.02em; }
  .cue { color: var(--cg-text-muted, #4C5782); max-width: 34rem; }
  .timer { font-size: clamp(3rem, 9vw, 5.5rem); font-weight: 600; line-height: 1; font-variant-numeric: tabular-nums; margin-top: .5rem; }
  .reps { font-size: 1.25rem; font-weight: 600; }
  .next { color: var(--cg-text-muted, #4C5782); }
  .progress { display: flex; gap: 2px; height: 10px; margin-top: auto; }
  .progress i { display: block; background: var(--cg-line, #E2E5EE); border-radius: 2px; }
  .progress i.rest { background: #cfe3d8; }
  .progress i.done { background: var(--cg-brand, #3A4366); }
  .progress i.rest.done { background: var(--rest); }
  .progress i.now { outline: 2px solid var(--cg-accent, #C97B1E); outline-offset: 1px; }
  :host([resting]) .stage { background: #E6F0EA; }
  :host([resting]) .stage video { display: none; }
  :host([resting]) .name { color: var(--rest); }
  :host([running]) .idle, :host(:not([running])) .run { display: none; }
  .foot { padding: 1rem 0 0; color: var(--cg-text-muted, #4C5782); font-size: .85rem; border-top: 1px solid var(--cg-line, #E2E5EE); margin-top: 1.5rem; }
  .foot a { color: inherit; }
`;

class OwlSessions extends CollegicaApp {
  render() {
    const lengths = Object.entries(plans).map(([k, p]) => `<option value="${k}">${p.name}</option>`).join('');
    this.root.innerHTML = `
      <style>${styles}</style>
      <div class="bar">
        <span class="title" role="heading" aria-level="2">OWL Sessions</span>
        <span class="session idle">
          <label>Length <select id="length">${lengths}</select></label>
          <button id="start" class="primary">Start</button>
        </span>
        <span class="session run"><button id="pause">Pause</button><button id="skip">Skip</button><button id="stop">Stop</button></span>
      </div>
      <div class="main">
        <div class="stage">
          <video id="clip" muted loop playsinline autoplay preload="auto"></video>
          <img id="rest" class="rest" alt="A glass of water on a stool beside the mat" hidden>
          <span id="badge" class="badge"></span>
        </div>
        <div class="panel">
          <label class="preview idle">Preview a move <select id="preview"></select></label>
          <span id="block" class="block"></span>
          <span id="name" class="name"></span>
          <span id="cue" class="cue"></span>
          <span id="timer" class="timer" role="timer"></span>
          <span id="reps" class="reps"></span>
          <span id="next" class="next" aria-live="polite"></span>
          <div id="progress" class="progress" aria-hidden="true"></div>
        </div>
      </div>
      <p class="foot">Everything runs in this page: no account, no upload. Blocks are separated by one
        minute of rest. The clips show the movement, not a standard to hit: stop when form goes, not when
        the timer says. The demonstrator is generated; the form was checked by a person, not a trainer.
        The method is in <a href="https://www.collegica.org/aging-well/exercise-sessions/">A Session You Can Keep</a>.</p>`;

    const $ = id => this.root.getElementById(id);
    this.$ = $;
    this.video = $('clip');
    this.restImg = $('rest');
    this.restImg.src = asset('images/rest.jpg');
    this.steps = [];
    this.idx = -1;
    this.running = false;
    this.paused = false;
    this.previewMove = 'dead-bug';

    $('start').onclick = () => this.start($('length').value);
    $('pause').onclick = () => this.togglePause();
    $('skip').onclick = () => { if (this.running) this.goto(this.idx + 1); };
    $('stop').onclick = () => this.stop();

    const sel = $('preview');
    for (const [id, m] of Object.entries(moves)) sel.append(new Option(`${m.name} — ${m.family}`, id));
    sel.value = this.previewMove;
    sel.onchange = () => { this.previewMove = sel.value; if (!this.running) this.show(this.previewMove); };
    this.show(this.previewMove);
    $('block').textContent = 'Preview';

    this.frame = requestAnimationFrame(t => this.tick(t));

    // ?start=30 opens straight into a session; &at=N jumps to step N.
    const q = new URLSearchParams(location.search);
    if (plans[q.get('start')]) {
      $('length').value = q.get('start');
      this.start(q.get('start'));
      const at = parseInt(q.get('at') || '0', 10);
      if (at > 0 && at < this.steps.length) this.goto(at);
    }
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.frame);
    this.audio?.close();
  }

  beep(frequency = 660, ms = 120) {
    const ac = this.audio;
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = frequency; g.gain.value = 0.08;
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + ms / 1000);
  }

  show(id) {
    const m = moves[id];
    const src = clip(id);
    if (this.video.src !== src) { this.video.src = src; this.video.play().catch(() => {}); }
    this.$('badge').textContent = m.family;
    this.$('name').textContent = m.name;
    this.$('cue').textContent = m.cue;
  }

  start(length) {
    // Sound needs a user gesture; create the audio context on the first Start.
    if (!this.audio && window.AudioContext) this.audio = new AudioContext();
    if (this.audio?.state === 'suspended') this.audio.resume();
    this.steps = timeline(plans[length], moves);
    this.running = true;
    this.paused = false;
    this.toggleAttribute('running', true);
    this.goto(0);
  }

  goto(i) {
    const $ = this.$;
    this.idx = i;
    this.stepStart = performance.now();
    if (i >= this.steps.length) { this.finish(); return; }
    const st = this.steps[i];
    $('block').textContent = st.block;
    if (st.type === 'rest') {
      $('name').textContent = 'Rest';
      $('cue').textContent = `Drink some water. Next: ${st.next}.`;
      $('reps').textContent = '';
      $('badge').textContent = 'One minute';
      this.restImg.hidden = false;
      this.video.pause();
      this.toggleAttribute('resting', true);
      this.beep(440, 200);
    } else {
      this.restImg.hidden = true;
      this.show(st.move);
      this.video.play().catch(() => {});
      this.toggleAttribute('resting', false);
      this.beep(660, 120);
    }
    $('next').textContent = st.next ? `Next: ${st.next}` : '';
    this.drawProgress();
  }

  drawProgress() {
    const total = totalSeconds(this.steps);
    this.$('progress').innerHTML = this.steps.map((s, i) => {
      const cls = s.type + (i < this.idx ? ' done' : i === this.idx ? ' now' : '');
      const title = s.type === 'rest' ? 'Rest' : moves[s.move].name;
      return `<i class="${cls}" style="width:${s.seconds / total * 100}%" title="${title}"></i>`;
    }).join('');
  }

  finish() {
    const $ = this.$;
    this.running = false;
    this.toggleAttribute('running', false);
    this.toggleAttribute('resting', false);
    this.restImg.hidden = true;
    $('name').textContent = 'Done';
    $('cue').textContent = 'That is the session. Write down what was easy and what was not.';
    $('reps').textContent = '';
    $('timer').textContent = '0:00';
    $('next').textContent = '';
    this.beep(880, 300);
  }

  togglePause() {
    if (!this.running) return;
    this.paused = !this.paused;
    this.$('pause').textContent = this.paused ? 'Resume' : 'Pause';
    if (this.paused) {
      this.pausedAt = performance.now();
      this.video.pause();
    } else {
      this.stepStart += performance.now() - this.pausedAt;
      this.video.play().catch(() => {});
    }
  }

  stop() {
    const $ = this.$;
    this.running = false;
    this.paused = false;
    this.toggleAttribute('running', false);
    this.toggleAttribute('resting', false);
    this.restImg.hidden = true;
    this.show(this.previewMove);
    this.video.play().catch(() => {});
    $('block').textContent = 'Preview';
    for (const id of ['reps', 'timer', 'next']) $(id).textContent = '';
    $('progress').innerHTML = '';
    $('pause').textContent = 'Pause';
  }

  tick(now) {
    this.frame = requestAnimationFrame(t => this.tick(t));
    if (!this.running || this.paused) return;
    const st = this.steps[this.idx];
    const elapsed = (now - this.stepStart) / 1000;
    const left = st.seconds - elapsed;
    this.$('timer').textContent = fmt(left);
    if (st.type === 'work') {
      const m = moves[st.move];
      if (m.hold) {
        this.$('reps').textContent = `${fmt(left)} to go`;
      } else {
        const r = reps(m, st.seconds, elapsed);
        this.$('reps').textContent = `${r.done} of ${r.total} reps`;
      }
    }
    if (left <= 3 && left > 2.9) this.beep(520, 80);
    if (left <= 0) this.goto(this.idx + 1);
  }
}

customElements.define('owl-sessions', OwlSessions);
