# Survival animation test (12 s)

Render: `cd demo-project && npx remotion render SurvivalTest out/survival-test.mp4`
Sheet: `node stickman-sheet.mjs SurvivalTest out/survival-test-sheet.png 30 100 170 230 262 280 310 335 350 359`
Output verified: 1920x1080, 30 fps, 360 frames, 12.0 s, audio peak -3.7 dBFS, 0 clipped samples.

## New files (all under demo-project/ unless noted)
- `src/survival-test/gait.ts`: ground-locked run (phase from distance, two-bone IK, stance foot pinned). Measured with the real `solve()`: mean stance-foot slide 0.03 px/frame (engine `runCycle`: 0.7 at best stride, 11 at a typical one).
- `src/survival-test/Figures.tsx`: survivor preset, `Backpack` (follows torso, lags), `Pursuer` silhouettes, `DistantRunner`.
- `src/survival-test/World.tsx`: sky, parallax skylines, street, mall front, roller `Shutter`.
- `src/survival-test/S01Chase.tsx`: the scene; `Video.tsx`, `Root.tsx` (registered by `new_video.py`), `timeline.ts`, `cues.ts`, `sfx.ts` from the template; the template example scene was deleted.
- `public/survival-test/` music + sfx from `gen_audio.py --plan "tense:12"` (git-ignored).
- Engine untouched.

## Review
Works: readable run left to right, backpack rocking with the stride, pursuers closing from the left, distant runners in the far layer, parallax camera that stops as the door comes into view, shutter starting to close as he arrives, slam + pursuers banging, final push-in.
Limits: the survivor is hidden by the shutter at the end (no shot of him inside); pursuers bunch into a scrum at the door; the entrance depth change is a small diagonal and scale cut, not true 3D; no footstep sounds; one idle() bob (1.6 px) from Hero is still applied.
Next primitive: a reusable `Door`/`Shutter` with open-close state plus a "look back" turn (smooth head-and-torso turn instead of an instant flip), then a flashlight beam.
