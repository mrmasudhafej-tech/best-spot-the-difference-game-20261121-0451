// Game state and rules: one run is all three scenes in order.
// A difference counts wherever it is clicked — left or right panel —
// and is then marked on both. Wrong clicks cost time and break the
// combo; hints pulse one unfound difference for a few seconds.
import { SCENES, HIT_RADIUS } from './config.js';
import { SCENE_DIFFS } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_SCENE_DONE = 'sceneDone';
export const SCREEN_ALL_DONE = 'allDone';
export const SCREEN_TIME_UP = 'timeUp';

export function createGame() {
  return {
    screen: SCREEN_TITLE,
    sceneIndex: 0,
    found: new Set(),
    score: 0,
    totalFound: 0,
    combo: 0,
    bestCombo: 0,
    misses: 0,
    hintsLeft: SCENES[0].hints,
    timeLeft: SCENES[0].time,
    hint: null, // { diffIndex, until }
    flashes: [], // { panel, x, y, kind, until }
    floaters: [], // { x, y, text, color, until }
    cursor: { panel: 0, x: 300, y: 236 },
    hover: null, // { panel, x, y }
    elapsed: 0,
    sceneBonus: 0,
    lastTickSecond: -1,
  };
}

export function sceneDiffs(game) {
  return SCENE_DIFFS[game.sceneIndex];
}

export function foundCount(game) {
  return game.found.size;
}

export function remainingCount(game) {
  return sceneDiffs(game).length - game.found.size;
}

export function startRun(game) {
  game.sceneIndex = 0;
  game.score = 0;
  game.totalFound = 0;
  game.combo = 0;
  game.bestCombo = 0;
  game.misses = 0;
  startScene(game, 0);
}

export function startScene(game, index) {
  game.sceneIndex = index;
  game.found = new Set();
  game.combo = 0;
  game.hintsLeft = SCENES[index].hints;
  game.timeLeft = SCENES[index].time;
  game.hint = null;
  game.flashes = [];
  game.floaters = [];
  game.screen = SCREEN_PLAY;
  game.lastTickSecond = -1;
}

export function nearestDiff(game, panelX, panelY) {
  let best = null;
  let bestDistance = Infinity;
  const diffs = sceneDiffs(game);
  for (let i = 0; i < diffs.length; i += 1) {
    const diff = diffs[i];
    const distance = Math.hypot(diff.x - panelX, diff.y - panelY);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = { index: i, diff, distance };
    }
  }
  return best;
}

// Returns 'found' | 'already' | 'miss'. `now` is milliseconds.
export function clickAt(game, panelX, panelY, now) {
  const near = nearestDiff(game, panelX, panelY);
  if (near && near.distance <= HIT_RADIUS) {
    if (game.found.has(near.index)) return 'already';
    game.found.add(near.index);
    game.totalFound += 1;
    game.combo += 1;
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    const points = 100 + (game.combo - 1) * 25;
    game.score += points;
    game.floaters.push({
      x: near.diff.x, y: near.diff.y - 30, text: `+${points}`,
      color: '#ffd23f', until: now + 1100,
    });
    if (game.found.size === sceneDiffs(game).length) {
      game.sceneBonus = Math.round(game.timeLeft) * 5;
      game.score += game.sceneBonus;
      game.screen = game.sceneIndex === SCENES.length - 1 ? SCREEN_ALL_DONE : SCREEN_SCENE_DONE;
    }
    return 'found';
  }
  game.combo = 0;
  game.misses += 1;
  game.timeLeft = Math.max(0, game.timeLeft - 5);
  game.floaters.push({
    x: panelX, y: panelY - 18, text: '-5s', color: '#ff5d5d', until: now + 900,
  });
  return 'miss';
}

export function useHint(game, now) {
  if (game.hintsLeft <= 0 || game.screen !== SCREEN_PLAY) return null;
  const unfound = sceneDiffs(game).map((diff, i) => i).filter((i) => !game.found.has(i));
  if (unfound.length === 0) return null;
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - 25);
  game.combo = 0;
  const index = unfound[0];
  game.hint = { diffIndex: index, until: now + 3200 };
  return sceneDiffs(game)[index];
}

export function advanceScene(game) {
  if (game.sceneIndex + 1 < SCENES.length) startScene(game, game.sceneIndex + 1);
  else game.screen = SCREEN_ALL_DONE;
}

// Advances the clock; returns true on the second the timer ticks.
export function tick(game, dt, now) {
  game.elapsed += dt;
  if (game.screen !== SCREEN_PLAY) return false;
  game.timeLeft -= dt;
  const whole = Math.ceil(game.timeLeft);
  const ticked = whole !== game.lastTickSecond;
  game.lastTickSecond = whole;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = SCREEN_TIME_UP;
  }
  game.flashes = game.flashes.filter((f) => f.until > now);
  game.floaters = game.floaters.filter((f) => f.until > now);
  if (game.hint && game.hint.until <= now) game.hint = null;
  return ticked;
}

export function addFlash(game, panel, x, y, kind, now) {
  game.flashes.push({ panel, x, y, kind, until: now + 650 });
}
