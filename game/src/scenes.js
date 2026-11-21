// The three scenes, drawn procedurally on canvas — no image files,
// so both panels are painted by the same code and can only differ
// where a difference says so. Each painter receives `right`: false
// for the left picture, true for the right one. Every difference is
// one clearly-named branch, and DIFFS lists its centre and radius
// in panel-local coordinates for hit-testing and markers.
import { createRandom, range } from './random.js';

function circle(ctx, x, y, radius, fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function lantern(ctx, x, y, color, lit) {
  ctx.fillStyle = '#5b3a1e';
  ctx.fillRect(x - 1, y - 34, 2, 10);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 20, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - 6, y - 8, 6, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a5a1e';
  ctx.fillRect(x - 8, y - 30, 16, 5);
  ctx.fillRect(x - 8, y + 25, 16, 5);
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 4, x, y, 52);
    glow.addColorStop(0, 'rgba(255,220,120,0.55)');
    glow.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 52, 0, Math.PI * 2);
    ctx.fill();
  }
}

function stringLights(ctx, random, y) {
  ctx.strokeStyle = '#3a2a4a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y - 26);
  ctx.quadraticCurveTo(300, y + 34, 600, y - 26);
  ctx.stroke();
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12;
    const x = t * 600;
    const ly = y - 26 + 60 * 4 * t * (1 - t) * 0.9;
    const colors = ['#ffd23f', '#ff5d5d', '#2ec4b6', '#ff9f1c'];
    circle(ctx, x, ly + 8, 6, colors[i % colors.length]);
  }
  void random;
}

function stars(ctx, random, count, maxY) {
  for (let i = 0; i < count; i += 1) {
    const x = range(random, 8, 592);
    const y = range(random, 8, maxY);
    const r = range(random, 1, 2.6);
    circle(ctx, x, y, r, 'rgba(255,255,240,0.9)');
  }
}

// --- Scene 1: Lantern Market -------------------------------------------
function paintMarket(ctx, right) {
  const random = createRandom(101);
  const sky = ctx.createLinearGradient(0, 0, 0, 472);
  sky.addColorStop(0, '#3b2a5e');
  sky.addColorStop(0.55, '#c65d7b');
  sky.addColorStop(1, '#f4a259');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 472);
  stars(ctx, random, 26, 120);
  // DIFF 1: the moon — crescent on the left, full on the right.
  if (right) {
    circle(ctx, 516, 52, 30, '#fff3c4');
    circle(ctx, 516, 52, 26, 'rgba(255,243,196,0.25)');
  } else {
    circle(ctx, 516, 52, 30, '#fff3c4');
    circle(ctx, 530, 44, 26, '#4a3566');
  }
  // Rooftops and bunting.
  ctx.fillStyle = '#2e2140';
  ctx.beginPath();
  ctx.moveTo(0, 150); ctx.lineTo(120, 110); ctx.lineTo(240, 150); ctx.lineTo(240, 190);
  ctx.lineTo(0, 190); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(360, 150); ctx.lineTo(480, 108); ctx.lineTo(600, 150); ctx.lineTo(600, 190);
  ctx.lineTo(360, 190); ctx.closePath(); ctx.fill();
  stringLights(ctx, random, 96);
  // DIFF 5: a bird on the wire — present on the right only.
  if (right) {
    ctx.fillStyle = '#241a2e';
    ellipse(ctx, 428, 74, 10, 6, '#241a2e');
    circle(ctx, 436, 68, 4, '#241a2e');
    ctx.strokeStyle = '#241a2e';
    ctx.beginPath(); ctx.moveTo(428, 80); ctx.lineTo(424, 86); ctx.moveTo(432, 80); ctx.lineTo(436, 86); ctx.stroke();
  }
  // Stalls.
  drawStall(ctx, 30, 210, 170, '#e4572e', 'FRUIT');
  drawStall(ctx, 215, 200, 170, '#7b2d8b', 'LANTERNS');
  drawStall(ctx, 400, 210, 170, '#2a9d8f', 'FLOWERS');
  // DIFF 4: the fruit sign shows an apple on the left, an orange on the right.
  circle(ctx, 168, 252, 11, right ? '#ff9f1c' : '#e63946');
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath(); ctx.ellipse(171, 240, 7, 4, -0.5, 0, Math.PI * 2); ctx.fill();
  // DIFF 2: the middle lantern is red on the left, teal on the right.
  lantern(ctx, 300, 176, right ? '#2ec4b6' : '#ff4d4d', true);
  lantern(ctx, 252, 182, '#ffb703', true);
  lantern(ctx, 348, 182, '#ff70a6', true);
  // DIFF 7: the middle awning loses a stripe on the right.
  ctx.fillStyle = '#fff7e6';
  if (!right) ctx.fillRect(268, 200, 18, 26);
  // Crates, pots and the ground.
  rect(ctx, 0, 380, 600, 92, '#6b4226');
  rect(ctx, 0, 380, 600, 8, '#8a5a33');
  drawCrate(ctx, 52, 336, 'apples');
  drawCrate(ctx, 452, 336, 'flowers');
  // DIFF 6: the flower pot gains a tall sunflower on the right.
  if (right) {
    ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(492, 330); ctx.lineTo(492, 288); ctx.stroke();
    circle(ctx, 492, 278, 14, '#ffb703');
    circle(ctx, 492, 278, 6, '#6b4226');
  }
  // DIFF 3: the market cat sits on a crate on the left only.
  if (!right) drawCat(ctx, 128, 368);
  // Shoppers.
  drawPerson(ctx, 210, 400, '#ffd23f', '#3a86ff');
  drawPerson(ctx, 330, 406, '#ff70a6', '#2ec4b6');
  drawPerson(ctx, 540, 404, '#f4a259', '#7b2d8b');
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 448, 600, 24);
}

function drawStall(ctx, x, y, w, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + 26); ctx.lineTo(x + w, y + 26); ctx.lineTo(x + w, y);
  ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 4; i += 1) ctx.fillRect(x + 8 + i * 42, y + 2, 20, 24);
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(x + 6, y + 26, w - 12, 96);
  ctx.fillStyle = '#fff7e6';
  ctx.font = 'bold 15px Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + 46);
  ctx.fillStyle = '#f4e1c1';
  ctx.fillRect(x + 14, y + 58, w - 28, 8);
}

function drawCrate(ctx, x, y, kind) {
  ctx.fillStyle = '#a67c52';
  ctx.fillRect(x, y, 64, 44);
  ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
  ctx.strokeRect(x, y, 64, 44);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 64, y + 44); ctx.moveTo(x + 64, y); ctx.lineTo(x, y + 44); ctx.stroke();
  const colors = kind === 'apples' ? ['#e63946', '#ff9f1c'] : ['#ff70a6', '#ffd23f', '#c77dff'];
  for (let i = 0; i < 5; i += 1) circle(ctx, x + 12 + (i % 3) * 20, y + 12 + Math.floor(i / 3) * 18, 7, colors[i % colors.length]);
}

function drawCat(ctx, x, y) {
  ctx.fillStyle = '#2b2b3a';
  ellipse(ctx, x, y, 22, 13, '#2b2b3a');
  circle(ctx, x + 16, y - 16, 11, '#2b2b3a');
  ctx.beginPath();
  ctx.moveTo(x + 8, y - 24); ctx.lineTo(x + 11, y - 34); ctx.lineTo(x + 15, y - 25);
  ctx.moveTo(x + 19, y - 25); ctx.lineTo(x + 23, y - 34); ctx.lineTo(x + 25, y - 24);
  ctx.fill();
  ctx.strokeStyle = '#2b2b3a'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x - 20, y + 4); ctx.quadraticCurveTo(x - 34, y - 8, x - 26, y - 20); ctx.stroke();
  circle(ctx, x + 20, y - 17, 2, '#ffd23f');
}

function drawPerson(ctx, x, y, top, bottom) {
  circle(ctx, x, y - 42, 11, '#f2c29b');
  ctx.fillStyle = '#3a2a1e';
  ctx.beginPath(); ctx.arc(x, y - 46, 11, Math.PI, 0); ctx.fill();
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 30); ctx.quadraticCurveTo(x, y - 38, x + 14, y - 30);
  ctx.lineTo(x + 12, y + 6); ctx.lineTo(x - 12, y + 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = bottom;
  ctx.fillRect(x - 11, y + 6, 9, 26);
  ctx.fillRect(x + 2, y + 6, 9, 26);
}

export const MARKET_DIFFS = [
  { id: 'moon', label: 'The moon', x: 516, y: 52, r: 34 },
  { id: 'lantern', label: 'The middle lantern', x: 300, y: 176, r: 32 },
  { id: 'cat', label: 'The market cat', x: 128, y: 360, r: 34 },
  { id: 'sign-fruit', label: 'The fruit on the sign', x: 168, y: 250, r: 26 },
  { id: 'bird', label: 'The bird on the wire', x: 430, y: 72, r: 26 },
  { id: 'sunflower', label: 'The tall sunflower', x: 492, y: 290, r: 32 },
  { id: 'awning', label: 'The awning stripe', x: 277, y: 213, r: 24 },
];

// --- Scene 2: Harbour Dawn ----------------------------------------------
function paintHarbour(ctx, right) {
  const random = createRandom(202);
  const sky = ctx.createLinearGradient(0, 0, 0, 472);
  sky.addColorStop(0, '#7ec8e3');
  sky.addColorStop(0.5, '#f6d9a0');
  sky.addColorStop(1, '#f4a259');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 472);
  circle(ctx, 96, 66, 30, '#fff3c4');
  // DIFF 3: three gulls on the left, two on the right.
  drawGull(ctx, 300, 62);
  drawGull(ctx, 352, 84);
  if (!right) drawGull(ctx, 404, 58);
  // Distant headland, houses and the lighthouse.
  ctx.fillStyle = '#5a7d5a';
  ctx.beginPath();
  ctx.moveTo(0, 210); ctx.quadraticCurveTo(120, 150, 260, 208); ctx.lineTo(0, 220); ctx.closePath(); ctx.fill();
  drawHouse(ctx, 60, 168, '#fff7e6');
  drawHouse(ctx, 128, 176, '#ffd9a0');
  // DIFF 6: the cottage window glows on the right only.
  rect(ctx, 76, 182, 16, 14, right ? '#ffd23f' : '#4a3a52');
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(500, 96); ctx.lineTo(524, 96); ctx.lineTo(524, 210); ctx.lineTo(500, 210); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff7e6';
  ctx.fillRect(496, 82, 32, 16);
  ctx.fillStyle = '#2b1b3d';
  ctx.beginPath(); ctx.moveTo(494, 82); ctx.lineTo(512, 62); ctx.lineTo(530, 82); ctx.closePath(); ctx.fill();
  // DIFF 1: the lighthouse beam shines on the right only.
  if (right) {
    ctx.fillStyle = 'rgba(255,240,170,0.45)';
    ctx.beginPath();
    ctx.moveTo(500, 90); ctx.lineTo(300, 60); ctx.lineTo(300, 118); ctx.closePath(); ctx.fill();
    circle(ctx, 512, 90, 7, '#fff3c4');
  }
  // Sea.
  const sea = ctx.createLinearGradient(0, 210, 0, 472);
  sea.addColorStop(0, '#2a7f9e');
  sea.addColorStop(1, '#175e7a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 210, 600, 262);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i += 1) {
    const y = 236 + i * 28;
    ctx.beginPath();
    ctx.moveTo(range(random, 0, 120), y);
    ctx.quadraticCurveTo(300, y + 6, range(random, 480, 600), y);
    ctx.stroke();
  }
  // DIFF 4: the buoy is striped red on the left, plain yellow on the right.
  drawBuoy(ctx, 150, 268, right);
  // Boats.
  drawBoat(ctx, 220, 300, '#e63946', right);
  drawBoat(ctx, 400, 340, '#2a9d8f', false);
  // DIFF 2: the red boat's sail is white on the left, yellow on the right.
  // (handled inside drawBoat via the `right` flag for the first boat)
  // Quay, fisherman and crates.
  rect(ctx, 0, 396, 600, 76, '#8a6b4a');
  rect(ctx, 0, 396, 600, 6, '#a98a5f');
  drawFisherman(ctx, 96, 396);
  // DIFF 5: a fish sticks out of the bucket on the right only.
  if (right) {
    ctx.fillStyle = '#c0c8d0';
    ctx.beginPath();
    ctx.ellipse(150, 424, 14, 7, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(162, 420); ctx.lineTo(172, 414); ctx.lineTo(170, 424); ctx.closePath(); ctx.fill();
    circle(ctx, 141, 421, 2, '#241a2e');
  }
  drawCrate(ctx, 470, 404, 'apples');
  // DIFF 7: a coil of rope on the quay — present on the left only.
  if (!right) {
    ctx.strokeStyle = '#e9c46a'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(300, 432, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(300, 432, 8, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 452, 600, 20);
}

function drawGull(ctx, x, y) {
  ctx.strokeStyle = '#3a3a4a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x - 5, y - 7, x, y);
  ctx.quadraticCurveTo(x + 5, y - 7, x + 12, y);
  ctx.stroke();
}

function drawHouse(ctx, x, y, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, 52, 40);
  ctx.fillStyle = '#8a4a2e';
  ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 26, y - 20); ctx.lineTo(x + 58, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a3a52';
  ctx.fillRect(x + 20, y + 18, 12, 22);
}

function drawBuoy(ctx, x, y, plain) {
  ctx.fillStyle = plain ? '#ffd23f' : '#e63946';
  ctx.beginPath(); ctx.moveTo(x - 12, y + 12); ctx.lineTo(x + 12, y + 12); ctx.lineTo(x + 8, y - 10); ctx.lineTo(x - 8, y - 10); ctx.closePath(); ctx.fill();
  if (!plain) { ctx.fillStyle = '#fff7e6'; ctx.fillRect(x - 10, y - 2, 20, 6); }
  ctx.fillStyle = '#241a2e';
  ctx.fillRect(x - 2, y - 20, 4, 10);
  circle(ctx, x, y - 22, 4, '#ffd23f');
}

function drawBoat(ctx, x, y, hull, sailYellow) {
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(x - 46, y); ctx.lineTo(x + 46, y); ctx.lineTo(x + 32, y + 20); ctx.lineTo(x - 32, y + 20); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 58); ctx.stroke();
  ctx.fillStyle = sailYellow ? '#ffd23f' : '#fff7e6';
  ctx.beginPath(); ctx.moveTo(x + 4, y - 56); ctx.lineTo(x + 4, y - 8); ctx.lineTo(x + 38, y - 8); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff7e6';
  ctx.beginPath(); ctx.moveTo(x - 4, y - 50); ctx.lineTo(x - 4, y - 10); ctx.lineTo(x - 28, y - 10); ctx.closePath(); ctx.fill();
}

function drawFisherman(ctx, x, y) {
  circle(ctx, x, y - 40, 11, '#f2c29b');
  ctx.fillStyle = '#e9c46a';
  ctx.beginPath(); ctx.ellipse(x, y - 48, 18, 6, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - 8, y - 56, 16, 9);
  ctx.fillStyle = '#2a9d8f';
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 28); ctx.lineTo(x + 13, y - 28); ctx.lineTo(x + 10, y + 2); ctx.lineTo(x - 10, y + 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + 12, y - 20); ctx.lineTo(x + 52, y - 66); ctx.stroke();
  ctx.strokeStyle = '#3a3a4a'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x + 52, y - 66); ctx.lineTo(x + 52, y - 6); ctx.stroke();
  ctx.fillStyle = '#6b4226';
  ctx.beginPath(); ctx.moveTo(x + 34, y - 6); ctx.lineTo(x + 62, y - 6); ctx.lineTo(x + 58, y + 22); ctx.lineTo(x + 38, y + 22); ctx.closePath(); ctx.fill();
}

export const HARBOUR_DIFFS = [
  { id: 'beam', label: 'The lighthouse beam', x: 400, y: 88, r: 34 },
  { id: 'sail', label: 'The red boat sail', x: 244, y: 268, r: 30 },
  { id: 'gull', label: 'The third gull', x: 404, y: 58, r: 24 },
  { id: 'buoy', label: 'The buoy stripes', x: 150, y: 262, r: 28 },
  { id: 'fish', label: 'The fish in the bucket', x: 152, y: 422, r: 26 },
  { id: 'window', label: 'The lit window', x: 84, y: 189, r: 24 },
  { id: 'rope', label: 'The rope coil', x: 300, y: 432, r: 28 },
];

// --- Scene 3: Starlight Tea House ----------------------------------------
function paintTeaHouse(ctx, right) {
  const random = createRandom(303);
  const sky = ctx.createLinearGradient(0, 0, 0, 472);
  sky.addColorStop(0, '#1b1b3a');
  sky.addColorStop(0.6, '#3b2a5e');
  sky.addColorStop(1, '#6b4a7a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 472);
  stars(ctx, random, 44, 150);
  // DIFF 4: a bright shooting star crosses on the right only.
  if (right) {
    ctx.strokeStyle = 'rgba(255,240,170,0.9)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(424, 34); ctx.lineTo(448, 52); ctx.stroke();
    circle(ctx, 462, 64, 4, '#fff3c4');
    ctx.strokeStyle = 'rgba(255,240,170,0.9)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(462, 52); ctx.lineTo(462, 76); ctx.moveTo(450, 64); ctx.lineTo(474, 64);
    ctx.stroke();
  }
  // Maple tree.
  ctx.fillStyle = '#5b3a1e';
  ctx.fillRect(52, 150, 16, 150);
  ctx.fillStyle = right ? '#e63946' : '#ff6b35';
  for (let i = 0; i < 9; i += 1) {
    circle(ctx, 30 + range(random, 0, 84), 120 + range(random, 0, 70), range(random, 18, 30), right ? '#e63946' : '#ff6b35');
  }
  // DIFF 2 is the maple's colour above: orange-red on the left, deep red on the right.
  // Tea house.
  ctx.fillStyle = '#7a4a2e';
  ctx.fillRect(330, 150, 220, 150);
  ctx.fillStyle = '#2e2140';
  ctx.beginPath(); ctx.moveTo(310, 152); ctx.lineTo(440, 96); ctx.lineTo(570, 152); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(310, 148, 260, 8);
  // DIFF 7: the tea-house window curtain is drawn on the left, open on the right.
  rect(ctx, 366, 186, 52, 56, '#ffd23f');
  if (!right) {
    ctx.fillStyle = '#c65d7b';
    ctx.fillRect(366, 186, 52, 56);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(374, 186, 8, 56);
    ctx.fillRect(398, 186, 8, 56);
  }
  rect(ctx, 466, 186, 52, 56, '#ffd23f');
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(428, 220, 26, 80);
  lantern(ctx, 340, 176, '#ff4d4d', true);
  lantern(ctx, 546, 176, '#ffb703', true);
  // Garden ground, pond and bridge.
  rect(ctx, 0, 300, 600, 172, '#2e5d3a');
  const pond = ctx.createLinearGradient(0, 330, 0, 460);
  pond.addColorStop(0, '#2a7f9e');
  pond.addColorStop(1, '#175e7a');
  ctx.fillStyle = pond;
  ctx.beginPath(); ctx.ellipse(300, 398, 250, 62, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(240, 396, 90, 18, 0, 0, Math.PI * 2); ctx.stroke();
  // DIFF 1: two koi on the left, three on the right.
  drawKoi(ctx, 220, 392, '#ff9f1c');
  drawKoi(ctx, 320, 412, '#fff7e6');
  if (right) drawKoi(ctx, 272, 424, '#ff70a6');
  // DIFF 8: a stepping stone sits in the pond on the right only.
  if (right) ellipse(ctx, 420, 428, 26, 10, '#8a8a9a');
  // Bridge.
  ctx.fillStyle = '#a67c52';
  ctx.beginPath();
  ctx.moveTo(180, 330); ctx.quadraticCurveTo(300, 288, 420, 330);
  ctx.lineTo(420, 352); ctx.quadraticCurveTo(300, 310, 180, 352); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
  for (let i = 0; i < 7; i += 1) {
    const x = 196 + i * 36;
    ctx.beginPath(); ctx.moveTo(x, 322 - Math.sin((i / 6) * Math.PI) * 14); ctx.lineTo(x, 344 - Math.sin((i / 6) * Math.PI) * 14); ctx.stroke();
  }
  // DIFF 5: a small lantern stands on the bridge on the right only.
  if (right) lantern(ctx, 300, 296, '#2ec4b6', true);
  // DIFF 6: a cat watches from the bridge on the left only.
  if (!right) drawCat(ctx, 384, 316);
  // Tea table with teapot.
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(84, 336, 84, 10);
  ctx.fillRect(92, 346, 8, 30);
  ctx.fillRect(152, 346, 8, 30);
  ctx.fillStyle = '#2ec4b6';
  ellipse(ctx, 126, 328, 18, 11, '#2ec4b6');
  ctx.fillRect(118, 312, 16, 8);
  ctx.beginPath(); ctx.moveTo(142, 322); ctx.quadraticCurveTo(156, 320, 152, 332); ctx.strokeStyle = '#2ec4b6'; ctx.lineWidth = 4; ctx.stroke();
  // DIFF 3: steam rises from the teapot on the right only.
  if (right) {
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(126, 306); ctx.quadraticCurveTo(120, 292, 128, 280); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(134, 306); ctx.quadraticCurveTo(140, 292, 132, 278); ctx.stroke();
  }
  circle(ctx, 102, 330, 6, '#fff7e6');
  circle(ctx, 150, 330, 6, '#fff7e6');
  // Fireflies.
  for (let i = 0; i < 10; i += 1) {
    circle(ctx, range(random, 20, 580), range(random, 310, 450), 2.4, 'rgba(220,255,150,0.9)');
  }
}

function drawKoi(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, 18, 7, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 16, y); ctx.lineTo(x + 28, y - 7); ctx.lineTo(x + 28, y + 7); ctx.closePath(); ctx.fill();
  circle(ctx, x - 10, y - 2, 1.8, '#241a2e');
}

export const TEAHOUSE_DIFFS = [
  { id: 'koi', label: 'The third koi', x: 272, y: 424, r: 30 },
  { id: 'maple', label: 'The maple leaves', x: 72, y: 150, r: 40 },
  { id: 'steam', label: 'The teapot steam', x: 130, y: 292, r: 26 },
  { id: 'shooting-star', label: 'The shooting star', x: 462, y: 64, r: 30 },
  { id: 'bridge-lantern', label: 'The bridge lantern', x: 300, y: 296, r: 28 },
  { id: 'bridge-cat', label: 'The cat on the bridge', x: 384, y: 308, r: 30 },
  { id: 'curtain', label: 'The window curtain', x: 392, y: 214, r: 30 },
  { id: 'stone', label: 'The pond stone', x: 420, y: 428, r: 28 },
];

// --- Dispatcher -------------------------------------------------------------
export const SCENE_PAINT = [paintMarket, paintHarbour, paintTeaHouse];
export const SCENE_DIFFS = [MARKET_DIFFS, HARBOUR_DIFFS, TEAHOUSE_DIFFS];
export const SCENE_SEEDS = [101, 202, 303];
