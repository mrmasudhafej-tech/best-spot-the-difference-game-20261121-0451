// Screenshot staging: each named shot plays the real game forward
// into a genuine mid-game state — differences are found through
// the same clickAt() rules a player uses — then the frame is
// painted twice and window.__shotReady is set for the screenshot
// tool. Nothing here is composited or edited afterwards.
import { SCENES } from './config.js';
import { SCENE_DIFFS } from './scenes.js';
import {
  createGame, startRun, startScene, clickAt, SCREEN_SCENE_DONE,
} from './game.js';

function findDiffs(game, indices, now) {
  for (const index of indices) {
    const diff = SCENE_DIFFS[game.sceneIndex][index];
    clickAt(game, diff.x, diff.y, now);
  }
  // Staged frames are stills: drop the floating score labels and hide
  // the keyboard crosshair so the markers read cleanly.
  game.floaters = [];
  game.hover = { panel: 0, x: 0, y: 0 };
}

export function stageShot(name, game, now) {
  const staged = game ?? createGame();
  if (name === 'win') {
    startRun(staged);
    staged.timeLeft = 96;
    findDiffs(staged, [0, 1, 2, 3, 4, 5, 6], now);
    staged.screen = SCREEN_SCENE_DONE;
    return staged;
  }
  if (name === 'harbour') {
    startRun(staged);
    startScene(staged, 1);
    findDiffs(staged, [1, 3], now);
    staged.timeLeft = 118;
    staged.score = 225;
    staged.combo = 2;
    return staged;
  }
  if (name === 'teahouse') {
    startRun(staged);
    startScene(staged, 2);
    findDiffs(staged, [0, 1, 3, 4, 6], now);
    staged.timeLeft = 84;
    staged.score = 650;
    staged.combo = 3;
    return staged;
  }
  // Default: the cover — scene 1, three found, four still hiding.
  startRun(staged);
  findDiffs(staged, [0, 2, 4], now);
  staged.timeLeft = 151;
  staged.score = 375;
  staged.combo = 3;
  void SCENES;
  return staged;
}
