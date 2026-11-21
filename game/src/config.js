// Shared geometry, palette and scene settings for Lantern Market.
// One canvas, two panels: every measurement the painters and the
// hit-testing agree on lives here, so a difference can never drift
// between the left and right pictures.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;
export const HEADER_HEIGHT = 76;
export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 472;
export const PANEL_Y = 92;
export const PANEL_LEFT_X = 24;
export const PANEL_RIGHT_X = 656;
export const FOOTER_Y = 580;

export const COLORS = {
  ink: '#241a2e',
  paper: '#fff7e6',
  header: '#2b1b3d',
  gold: '#ffc93c',
  coral: '#ff5d5d',
  teal: '#2ec4b6',
  panelBorder: '#f5d9a0',
  found: '#ffd23f',
  hint: '#4dd0e1',
};

// One entry per scene: name, time limit, hints and how many
// differences the scene hides. Difficulty rises scene by scene.
export const SCENES = [
  { name: 'Lantern Market', subtitle: 'Dusk at the night market', time: 180, hints: 3, diffs: 7 },
  { name: 'Harbour Dawn', subtitle: 'First light over the boats', time: 150, hints: 3, diffs: 7 },
  { name: 'Starlight Tea House', subtitle: 'A quiet garden after dark', time: 150, hints: 2, diffs: 8 },
];

export const BEST_KEY = 'lantern-market-best';
export const HIT_RADIUS = 36;
export const CURSOR_STEP = 14;
export const CURSOR_FAST_STEP = 44;
