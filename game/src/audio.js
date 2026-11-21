// All sound is synthesised with WebAudio — no audio files, no
// network. Short tones: a rising chime for a find (higher with the
// combo), a dull thud for a miss, a soft ping for a hint and a
// little fanfare when a scene is cleared.
export function createAudio() {
  return { context: null, muted: false };
}

function ensureContext(audio) {
  if (audio.context) {
    if (audio.context.state === 'suspended') void audio.context.resume();
    return audio.context;
  }
  const Ctor = window.AudioContext ?? window.webkitAudioContext;
  if (!Ctor) return null;
  audio.context = new Ctor();
  return audio.context;
}

function tone(audio, frequency, start, duration, type, volume) {
  const ctx = ensureContext(audio);
  if (!ctx || audio.muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export function unlockAudio(audio) {
  ensureContext(audio);
}

export function playFound(audio, combo) {
  const base = 520 + Math.min(combo, 8) * 60;
  tone(audio, base, 0, 0.18, 'sine', 0.16);
  tone(audio, base * 1.5, 0.08, 0.22, 'sine', 0.14);
}

export function playMiss(audio) {
  tone(audio, 130, 0, 0.2, 'triangle', 0.14);
  tone(audio, 90, 0.05, 0.22, 'triangle', 0.12);
}

export function playHint(audio) {
  tone(audio, 880, 0, 0.3, 'sine', 0.1);
}

export function playWin(audio) {
  [523, 659, 784, 1047].forEach((f, i) => tone(audio, f, i * 0.11, 0.28, 'sine', 0.15));
}

export function playTick(audio) {
  tone(audio, 980, 0, 0.07, 'square', 0.05);
}

export function playClick(audio) {
  tone(audio, 660, 0, 0.08, 'sine', 0.08);
}
