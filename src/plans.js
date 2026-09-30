// A session is blocks of exercises with a one-minute rest between blocks.
// Seconds are working time; the rep count on screen comes from the move's tempo.
// Durations add up to the session length including the rests.
const core = (a, b) => [["dead-bug", a], ["bird-dog", a], ["side-plank", b], ["front-plank", b], ["glute-bridge", b]];
const core2 = (a, b) => [["dead-bug", a], ["pallof-press", a], ["side-plank", b], ["glute-bridge", b], ["bird-dog", a]];
export default {
  "30": { name: "30 minutes", blocks: [
    { name: "Warm-up",   items: [["cat-camel", 60], ["march-in-place", 60], ["jog-in-place", 60]] },
    { name: "Core",      items: [...core(90, 60), ["side-plank", 60], ["front-plank", 60], ["pallof-press", 60]] },
    { name: "Strength",  items: [["goblet-squat", 80], ["kettlebell-deadlift", 80], ["kettlebell-swing", 60], ["half-kneeling-press", 80], ["single-arm-row", 80]] },
    { name: "Aerobic",   items: [["jog-in-place", 100], ["step-ups", 100], ["skater-hops", 40], ["jog-in-place", 60]] },
    { name: "Cool-down", items: [["cat-camel", 60], ["march-in-place", 40], ["glute-bridge", 60]] },
  ] },
  "45": { name: "45 minutes", blocks: [
    { name: "Warm-up",   items: [["cat-camel", 60], ["march-in-place", 90], ["jog-in-place", 90]] },
    { name: "Core",      items: [...core(90, 60), ...core2(90, 60), ["side-plank", 30]] },
    { name: "Strength",  items: [["goblet-squat", 90], ["kettlebell-deadlift", 90], ["kettlebell-swing", 60], ["half-kneeling-press", 90], ["single-arm-row", 90], ["suitcase-carry", 90], ["goblet-squat", 90]] },
    { name: "Aerobic",   items: [["jog-in-place", 120], ["step-ups", 120], ["skater-hops", 60], ["jog-in-place", 120], ["step-ups", 60], ["march-in-place", 60]] },
    { name: "Cool-down", items: [["cat-camel", 90], ["march-in-place", 90], ["glute-bridge", 60], ["dead-bug", 60]] },
  ] },
  "60": { name: "60 minutes", blocks: [
    { name: "Warm-up",   items: [["cat-camel", 90], ["march-in-place", 90], ["jog-in-place", 120]] },
    { name: "Core",      items: [...core(90, 60), ...core2(90, 60), ...core(90, 50)] },
    { name: "Strength",  items: [["goblet-squat", 100], ["kettlebell-deadlift", 100], ["kettlebell-swing", 60], ["half-kneeling-press", 100], ["single-arm-row", 100], ["suitcase-carry", 90], ["goblet-squat", 100], ["kettlebell-deadlift", 100], ["kettlebell-swing", 60], ["half-kneeling-press", 90]] },
    { name: "Aerobic",   items: [["jog-in-place", 150], ["step-ups", 120], ["skater-hops", 60], ["jog-in-place", 150], ["step-ups", 120], ["skater-hops", 60], ["march-in-place", 60]] },
    { name: "Cool-down", items: [["cat-camel", 90], ["march-in-place", 120], ["glute-bridge", 90], ["dead-bug", 60]] },
  ] },
};
