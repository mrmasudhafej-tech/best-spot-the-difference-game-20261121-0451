// Boot and the one loop: input is wired once, the timer advances in
// real time, and the renderer repaints every animation frame. With
// ?shot=<name> the game stages that screenshot scene instead of
// running the loop, paints it twice and sets window.__shotReady.
import { BEST_KEY } from './config.js';
import {
  createGame, startRun, startScene, clickAt, useHint, advanceScene,
  tick, addFlash, SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED,
  SCREEN_SCENE_DONE, SCREEN_ALL_DONE, SCREEN_TIME_UP,
} from './game.js';
import { createRenderer, draw } from './render.js';
import { createInput, panelAt } from './input.js';
import {
  createAudio, unlockAudio, playFound, playMiss, playHint, playWin,
  playTick, playClick,
} from './audio.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const renderer = createRenderer(canvas);
const audio = createAudio();
let game = createGame();
let best = readBest();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

function announce(message) {
  status.textContent = message;
}

function finishScore() {
  if (game.score > best) {
    best = game.score;
    saveBest(best);
  }
}

function handlePanelClick(panel, x, y) {
  unlockAudio(audio);
  const now = performance.now();
  if (game.screen === SCREEN_TITLE) {
    startRun(game);
    announce('Playing Lantern Market. Find 7 differences.');
    return;
  }
  if (game.screen === SCREEN_SCENE_DONE) {
    advanceScene(game);
    return;
  }
  if (game.screen === SCREEN_ALL_DONE) {
    startRun(game);
    announce('A fresh run. Find every difference.');
    return;
  }
  if (game.screen === SCREEN_TIME_UP) {
    startScene(game, game.sceneIndex);
    announce('Try this scene again.');
    return;
  }
  if (game.screen !== SCREEN_PLAY) return;
  const result = clickAt(game, x, y, now);
  addFlash(game, panel, x, y, result, now);
  if (result === 'found') {
    playFound(audio, game.combo);
    announce(`Found: ${game.found.size} found, ${7 - game.found.size} differences still hiding in this scene.`);
    if (game.screen === SCREEN_SCENE_DONE || game.screen === SCREEN_ALL_DONE) {
      playWin(audio);
      finishScore();
    }
  } else if (result === 'miss') {
    playMiss(audio);
    announce('Not a difference. Five seconds lost.');
  } else {
    playClick(audio);
    announce('Already found — that one is marked.');
  }
}

function handleButton(id) {
  unlockAudio(audio);
  const now = performance.now();
  if (id === 'hint') {
    const diff = useHint(game, now);
    if (diff) {
      playHint(audio);
      announce(`Hint: look near ${diff.label}.`);
    }
    return;
  }
  if (id === 'sound') {
    audio.muted = !audio.muted;
    return;
  }
  if (id === 'restart') {
    if (game.screen === SCREEN_TIME_UP) startScene(game, game.sceneIndex);
    else startRun(game);
    announce('A fresh run. Find every difference.');
    return;
  }
  if (id === 'pause') {
    if (game.screen === SCREEN_PLAY) game.screen = SCREEN_PAUSED;
    else if (game.screen === SCREEN_PAUSED) game.screen = SCREEN_PLAY;
  }
}

function handleKey(action) {
  const now = performance.now();
  if (action === 'confirm') {
    if (game.screen === SCREEN_TITLE) {
      startRun(game);
      return;
    }
    if (game.screen === SCREEN_SCENE_DONE) {
      advanceScene(game);
      return;
    }
    if (game.screen === SCREEN_ALL_DONE) {
      startRun(game);
      return;
    }
    if (game.screen === SCREEN_TIME_UP) {
      startScene(game, game.sceneIndex);
      return;
    }
    if (game.screen === SCREEN_PAUSED) {
      game.screen = SCREEN_PLAY;
      return;
    }
    if (game.screen === SCREEN_PLAY) {
      handlePanelClick(game.cursor.panel, game.cursor.x, game.cursor.y);
    }
    return;
  }
  if (action === 'hint') handleButton('hint');
  else if (action === 'sound') handleButton('sound');
  else if (action === 'restart') handleButton('restart');
  else if (action === 'pause') handleButton('pause');
  else if (action === 'next' && game.screen === SCREEN_SCENE_DONE) advanceScene(game);
  void now;
}

createInput(canvas, game, {
  onPanelClick: handlePanelClick,
  onBackground: () => {
    if (game.screen === SCREEN_TITLE) {
      unlockAudio(audio);
      startRun(game);
      announce('Playing Lantern Market. Find 7 differences.');
    } else if (game.screen === SCREEN_SCENE_DONE) {
      advanceScene(game);
    }
  },
  onButton: handleButton,
  onKey: handleKey,
  onHover: () => {},
  onLeave: () => {},
});

function runShot(name) {
  game = stageShot(name, createGame(), performance.now());
  let painted = 0;
  function paint() {
    draw(game, renderer, audio, best, performance.now());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    const ticked = tick(game, dt, now);
    if (ticked && game.screen === SCREEN_PLAY && game.timeLeft <= 10 && game.timeLeft > 0) playTick(audio);
    if (game.screen === SCREEN_TIME_UP) finishScore();
    draw(game, renderer, audio, best, now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (shotName) runShot(shotName);
else runGame();
void panelAt;
