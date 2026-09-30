import { test } from 'node:test';
import assert from 'node:assert/strict';
import moves from '../src/moves.js';
import plans from '../src/plans.js';
import { timeline, totalSeconds, fmt, reps, REST_SECONDS } from '../src/timeline.js';

test('every plan lasts exactly its stated length, rests included', () => {
  for (const [minutes, plan] of Object.entries(plans)) {
    const total = totalSeconds(timeline(plan, moves));
    assert.equal(total, Number(minutes) * 60,
      `the ${plan.name} plan is ${fmt(total)} long, not ${minutes}:00`);
  }
});

test('every move in every plan is in the library', () => {
  for (const plan of Object.values(plans)) {
    for (const block of plan.blocks) {
      for (const [id] of block.items) assert.ok(moves[id], `${plan.name}, ${block.name}: "${id}" is not in moves.js`);
    }
  }
});

test('one minute of rest between blocks, none before the first or after the last', () => {
  for (const plan of Object.values(plans)) {
    const steps = timeline(plan, moves);
    const rests = steps.filter(s => s.type === 'rest');
    assert.equal(rests.length, plan.blocks.length - 1);
    assert.ok(rests.every(r => r.seconds === REST_SECONDS));
    assert.equal(steps[0].type, 'work');
    assert.equal(steps.at(-1).type, 'work');
    assert.equal(steps.at(-1).next, 'done');
  }
});

test('every move is either timed by tempo or a hold', () => {
  for (const [id, m] of Object.entries(moves)) {
    assert.ok(m.hold === true || m.tempo > 0, `${id}: needs a tempo (seconds per rep) or hold: true`);
    for (const key of ['name', 'family', 'cue']) assert.ok(m[key], `${id}: needs a ${key}`);
  }
});

test('the clock and the rep count', () => {
  assert.equal(fmt(61), '1:01');
  assert.equal(fmt(0.2), '0:01');
  assert.equal(fmt(-3), '0:00');
  assert.deepEqual(reps({ tempo: 4 }, 90, 0), { done: 0, total: 22 });
  assert.deepEqual(reps({ tempo: 4 }, 90, 1000), { done: 22, total: 22 });
});
