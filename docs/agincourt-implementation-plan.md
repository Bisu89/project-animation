# Agincourt: implementation plan

Decisions (user): all scenes in stickman style, simple image/art direction; armies as STATIC image layers with only 1-2
animated commanders on top; build and test scene 1 first.

## Repository audit (what exists and is reused)
- Remotion project: `demo-project/` (engine copied to `src/stickman/`). A video = folder `src/<slug>/` + composition in `src/Root.tsx`
  (`scripts/new_video.py`), timeline from a script (`scripts/parse_input.py`), music (`scripts/gen_audio.py`), contact sheets
  (`node stickman-sheet.mjs`), checks (`tsc --noEmit`; the repo has no test suite or linter).
- Reused: `Hero` + presets (`cast.tsx`), `Horse` (`horse.tsx`), `Img` parallax layering pattern from the igloo video, `Captions`,
  `ArrowVolley`/`Rain`/`Water` (`weather.tsx`, for later scenes), `Stage` camera for tactical diagrams.
- Missing, added as the smallest reusable extension: `assets/engine/crowd.tsx` (`Soldier`, `Formation`, `Stakes`).
  Sound: only synthesised music (`gen_audio.py`); no voiceover generation, so narration is a captioned placeholder.

## Large-army approach (3 levels of detail)
1. Far army: `FarLayer`, ~700 tiny silhouettes, rendered once to `public/agincourt/far.png`.
2. Mid army: `MidLayer`, ranks with bows/spears, banners, stakes, 4 mounted knights, rendered once to `mid.png`.
3. Foreground: two live `Hero` commanders with banners.
Layers push in at different rates (1.03 to 1.22) for parallax. Per-frame cost stays small because the crowds are images.
Re-render the layers after editing `src/agincourt/Stills.tsx`:
`npx remotion still AgincourtFar public/agincourt/far.png --image-format=png` (and `AgincourtMid` to `mid.png`).

## Scenes
| # | Scene | Status |
|---|---|---|
| 1 | Two armies face each other (10.9 s) | **built**, `src/agincourt/S01Armies.tsx` |
| 2 | English position, overhead map | todo (code diagram, like the igloo diagrams) |
| 3 | Longbow volley | todo (`ArrowVolley` exists) |
| 4 | Mud and congestion | todo (compressing static crowd + a few live figures) |
| 5 | Close combat, loss of cohesion | todo (small live groups, sparing camera shake) |
| 6 | Aftermath and lesson | todo (wide shot + tactical recap) |

## Reproduce scene 1
```
cd demo-project
npx remotion still AgincourtFar public/agincourt/far.png --image-format=png
npx remotion still AgincourtMid public/agincourt/mid.png --image-format=png
npx remotion render Agincourt out/agincourt-scene1.mp4
```
Narration/timeline: `src/agincourt/timeline.ts` (from `demo-project/agincourt-script.md`, `parse_input.py --wps 3.0 --lead 0.6 --pause 0.3 --gap 0.2 --tail 1.0`).
