// The session as a list of steps: every move in every block, with one minute
// of rest between blocks. Pure functions, so the rules can be tested without
// a browser (test/timeline.test.mjs).

export const REST_SECONDS = 60;

/** Steps for a plan: { type: 'work' | 'rest', seconds, block, next, move? }. */
export function timeline(plan, moves) {
  const steps = [];
  plan.blocks.forEach((block, i) => {
    if (i > 0) {
      steps.push({ type: 'rest', seconds: REST_SECONDS, block: block.name, next: moves[block.items[0][0]].name });
    }
    block.items.forEach(([id, seconds], j) => {
      const following = block.items[j + 1];
      const next = following ? moves[following[0]].name : (plan.blocks[i + 1] ? 'one minute of rest' : 'done');
      steps.push({ type: 'work', move: id, seconds, block: block.name, next });
    });
  });
  return steps;
}

/** Total length of a list of steps, in seconds. */
export const totalSeconds = steps => steps.reduce((sum, s) => sum + s.seconds, 0);

/** Seconds as m:ss, rounded up, never negative. */
export function fmt(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** The rep count shown for a move that has a tempo (seconds per rep). */
export function reps(move, seconds, elapsed) {
  const total = Math.floor(seconds / move.tempo);
  return { done: Math.min(total, Math.floor(elapsed / move.tempo)), total };
}
