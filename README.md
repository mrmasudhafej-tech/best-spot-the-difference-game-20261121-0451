# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mrmasudhafej-tech/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mrmasudhafej-tech/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Lantern Market — Spot the Difference**: an original, offline spot-the-difference game that runs in a desktop browser from static files. Two near-identical pictures sit side by side; click a difference on either one to ring it on both. Three hand-drawn procedural scenes — Lantern Market (7 differences), Harbour Dawn (7) and Starlight Tea House (8) — with rising difficulty, a countdown timer, limited hints that pulse an unfound difference, combo scoring, time bonuses, keyboard play (arrows + Enter, H for hint), and synthesised WebAudio sounds. No image, sound or font files, no network requests: every scene is painted by the game's own canvas code.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. Click a difference on either picture, or move the crosshair with the arrow keys and press Enter. A wrong click costs 5 seconds; H spends a hint.

## Layout

- `game/` — the playable game: `index.html` plus `src/` modules with one job each (`config`, `scenes`, `game`, `render`, `input`, `audio`, `shots`, `main`, `random`).
- `screenshots/` — 4 real renders of the game's own code, staged through its `?shot=` scenes.
- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=5867rntm&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
