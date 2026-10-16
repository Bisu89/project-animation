# Agincourt visual pass: report

Render: `cd demo-project && npx remotion render Agincourt out/agincourt-full.mp4`; sheet: `node stickman-sheet.mjs Agincourt out/agincourt-full-sheet.png 150 400 810 850 880 1060 1250 1400 1500 1850`.
Before/after: `out/agincourt-full-v1.mp4` / `-sheet-v1.png` vs `out/agincourt-full.mp4` / `-sheet.png`. `check_render.py`: 70.02 s vs 70.0 s, 0 clipped samples.

## Findings
- Glasses look: the engine `helmet` draws a band at eye level (y -0.18r) over white-sclera eyes. Not changed (other demos use it); new headwear sits above the brows.
- White scene 5: it used `Stage`, whose default background is `Paper`. Scenes 3-5 now share `Field.tsx` `Backdrop` (+ `far.png`/`mid.png`).
- Other demos checked pixel-for-pixel (CastDemo, HorseDemo, BigheadDemo): zero diff after the engine changes.

## Changes
- Engine (additive): `kettle`/`bascinet` headwear, `crest`, `eyes:"dot"`, `stern`, preset `head` multiplier, one-shot `ArrowVolley`, `Bow pull`.
- `Roles.tsx`: English archer (kettle, brown), English man-at-arms (bascinet, white/red), French man-at-arms (bascinet, gold plume, blue/gold), commanders. Heads -20%, foreground -27..40%.
- S03: 6 archers in two rows, staggered 100-frame cycle (ready, raise, draw, hold, loose, recover); arrows launched per archer at the release frame toward the French block.
- S04: simulated advance (front ranks slow in mud, rear presses on, no overlap), steps tied to ground covered, overhead inset showing the compression.
- S05: three spaced vignettes on three lanes over the battlefield, push, retreat, one fall; slow push-in, no bursts or shake.
- Dip-to-black cuts; muted woods on the map; SFX re-timed.

## Limitations
- Shields/pollaxes/armour detail not drawn; bow strings cross archers' faces (front view); fallen figure pose is the old `fall`.
- Scene 4 near lane is 7 heroes, deeper ranks are simple `Soldier` stick figures; the left/right armies in scene 5 are static PNG layers.
- No voiceover yet; narration timing unchanged.
