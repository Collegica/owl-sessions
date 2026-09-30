// The app. Replace this example with yours; keep the define() line's name
// equal to the slug in app.json.
//
// The example is a tally: add, subtract, reset, and it remembers the count
// across visits. It shows the pieces every app uses — the base class, storage
// under the app's own name, the shared styles, and a live region so a screen
// reader hears the change.

import { CollegicaApp, baseStyles } from './collegica.js';

class Tally extends CollegicaApp {
  render() {
    this.root.innerHTML = `
      <style>
        ${baseStyles}
        .count { font: 400 clamp(3rem, 12vw, 5rem)/1 var(--cg-serif, Georgia, serif); color: var(--cg-brand, #3A4366); margin: .25rem 0 1rem; }
        .row { display: flex; flex-wrap: wrap; gap: .5rem; }
      </style>
      <h2>Tally</h2>
      <p class="muted">Counts what you count, and remembers it on this device.</p>
      <p class="count" aria-live="polite"></p>
      <div class="row">
        <button class="primary" data-step="1" aria-label="Add one">+ 1</button>
        <button data-step="-1" aria-label="Subtract one">− 1</button>
        <button data-reset>Reset</button>
      </div>`;

    this.countEl = this.root.querySelector('.count');
    this.root.querySelector('.row').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      this.count = b.hasAttribute('data-reset') ? 0 : this.count + Number(b.dataset.step);
    });
    this.show();
  }

  get count() {
    return this.store.get('count', 0);
  }
  set count(n) {
    this.store.set('count', n);
    this.show();
  }
  show() {
    this.countEl.textContent = String(this.count);
  }
}

customElements.define('app-template', Tally);
