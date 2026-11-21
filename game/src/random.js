// A tiny deterministic random generator (mulberry32). Decorative
// details such as stars and sparkles are drawn from a seed that is
// reset for every panel, so both pictures twinkle in exactly the
// same places and only the real differences differ.
export function createRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function range(random, min, max) {
  return min + random() * (max - min);
}

export function pick(random, items) {
  return items[Math.floor(random() * items.length)];
}
