// Mouse, touch and keyboard input. Mouse clicks map to panel-local
// coordinates; the keyboard drives a crosshair that mirrors across
// both panels (Enter/Space clicks, arrows move it, Shift moves fast).
// Buttons are canvas-drawn, so input also reports footer-button
// clicks by their rectangles, defined here in one place.
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_Y,
  PANEL_WIDTH, PANEL_HEIGHT, FOOTER_Y, CURSOR_STEP, CURSOR_FAST_STEP,
} from './config.js';

export const BUTTONS = [
  { id: 'hint', label: 'Hint (H)', x: 24, y: FOOTER_Y, w: 150, h: 44 },
  { id: 'pause', label: 'Pause (P)', x: 186, y: FOOTER_Y, w: 150, h: 44 },
  { id: 'sound', label: 'Sound (M)', x: 348, y: FOOTER_Y, w: 150, h: 44 },
  { id: 'restart', label: 'Restart (R)', x: 510, y: FOOTER_Y, w: 150, h: 44 },
];

export function panelAt(canvasX, canvasY) {
  if (canvasY < PANEL_Y || canvasY > PANEL_Y + PANEL_HEIGHT) return null;
  if (canvasX >= PANEL_LEFT_X && canvasX <= PANEL_LEFT_X + PANEL_WIDTH) {
    return { panel: 0, x: canvasX - PANEL_LEFT_X, y: canvasY - PANEL_Y };
  }
  if (canvasX >= PANEL_RIGHT_X && canvasX <= PANEL_RIGHT_X + PANEL_WIDTH) {
    return { panel: 1, x: canvasX - PANEL_RIGHT_X, y: canvasY - PANEL_Y };
  }
  return null;
}

export function buttonAt(canvasX, canvasY) {
  return BUTTONS.find((b) => canvasX >= b.x && canvasX <= b.x + b.w && canvasY >= b.y && canvasY <= b.y + b.h) ?? null;
}

function toCanvas(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  };
}

// `handlers`: { onPanelClick(panel, x, y), onButton(id), onKey(action),
// onHover(panel, x, y), onLeave() }. Actions: confirm, pause, hint,
// sound, restart, next, move(dx, dy).
export function createInput(canvas, game, handlers) {
  function press(event) {
    const point = toCanvas(canvas, event);
    const button = buttonAt(point.x, point.y);
    if (button) {
      handlers.onButton(button.id);
      return;
    }
    const hit = panelAt(point.x, point.y);
    if (hit) handlers.onPanelClick(hit.panel, hit.x, hit.y);
    else if (handlers.onBackground) handlers.onBackground();
  }

  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    press(event);
  });
  canvas.addEventListener('pointermove', (event) => {
    const point = toCanvas(canvas, event);
    const hit = panelAt(point.x, point.y);
    if (hit) {
      game.hover = { panel: hit.panel, x: hit.x, y: hit.y };
      game.cursor = { panel: hit.panel, x: hit.x, y: hit.y };
      handlers.onHover(hit.panel, hit.x, hit.y);
    } else {
      game.hover = null;
    }
  });
  canvas.addEventListener('pointerleave', () => {
    game.hover = null;
    handlers.onLeave();
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat && !event.key.startsWith('Arrow')) return;
    const step = event.shiftKey ? CURSOR_FAST_STEP : CURSOR_STEP;
    const cursor = game.cursor;
    const move = (dx, dy) => {
      cursor.x = Math.min(PANEL_WIDTH, Math.max(0, cursor.x + dx));
      cursor.y = Math.min(PANEL_HEIGHT, Math.max(0, cursor.y + dy));
      handlers.onKey('move', { dx, dy });
    };
    switch (event.key) {
      case 'ArrowLeft': event.preventDefault(); move(-step, 0); break;
      case 'ArrowRight': event.preventDefault(); move(step, 0); break;
      case 'ArrowUp': event.preventDefault(); move(0, -step); break;
      case 'ArrowDown': event.preventDefault(); move(0, step, 0); break;
      case 'Tab':
        event.preventDefault();
        cursor.panel = cursor.panel === 0 ? 1 : 0;
        handlers.onKey('move', { dx: 0, dy: 0 });
        break;
      case 'Enter':
      case ' ': event.preventDefault(); handlers.onKey('confirm'); break;
      case 'h': case 'H': handlers.onKey('hint'); break;
      case 'p': case 'P': case 'Escape': handlers.onKey('pause'); break;
      case 'm': case 'M': handlers.onKey('sound'); break;
      case 'r': case 'R': handlers.onKey('restart'); break;
      case 'n': case 'N': handlers.onKey('next'); break;
      default: break;
    }
  });
  void CANVAS_HEIGHT;
}
