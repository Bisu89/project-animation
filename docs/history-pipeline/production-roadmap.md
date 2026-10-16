# Agincourt pilot — production roadmap (Checkpoint 1 output, for Checkpoint 2 execution)

Target: 60–90 s, six scenes, documentary tone (see `repository-audit.md` §D for what that means in
terms of which engine primitives to use/avoid). Scene 1 already exists and already renders; scenes
2–6 are planned here but **not implemented** in this checkpoint, per the stop condition.

Everything here reuses components verified in `repository-audit.md`. No new engine files are proposed.

## Running time budget

| # | Scene | Length (actual, Checkpoint 2) | Status |
|---|---|---|---|
| 1 | Two armies face each other | 10.4 s | **Built** (`S01Armies.tsx`) |
| 2 | English defensive formation (overhead/tactical) | 14.2 s | **Built** (`S02Map.tsx`) |
| 3 | English longbow volley | 8.3 s | **Built** (`S03Volley.tsx`) |
| 4 | French advance, mud and congestion | 9.7 s | **Built** (`S04Advance.tsx`) |
| 5 | Close combat and formation breakdown | 11.5 s | **Built** (`S05Combat.tsx`) |
| 6 | Aftermath and tactical lesson | 15.9 s | **Built** (`S06Aftermath.tsx`) |

Total 70.0 s (2100 frames @ 30 fps), inside the 60–90 s brief, driven by the full six-scene narration
in `demo-project/agincourt-script.md` (regenerated via `parse_input.py`, see
`docs/history-pipeline/checkpoint-log.md` for the exact command). Rendered output:
`demo-project/out/agincourt-full.mp4` (23 MB); contact sheet: `demo-project/out/agincourt-full-sheet.png`.
`check_render.py` reports duration 70.02 s vs. timeline 70.0 s (Δ 0.02 s), peak -3.7 dBFS, 0 clipped
samples.

**Bugs found by actually viewing rendered frames, and fixed in this checkpoint** (not caught by
`tsc`/file listing — see the method in "Render verification plan" below, which is exactly how these
were found):
- `S03Volley`: the new `Bow` prop (`props.tsx`) was first held at `r={-78}`, which laid the stave
  almost horizontal through the archers' faces. Fixed to `r={0}` (a longbow stays vertical regardless
  of arm angle) with a small forward offset and `s={0.62}`.
- `S04Advance`: the 5 converging walkers' end-x values were within 80px of each other, so by the time
  they finished "converging" their `Hero` bodies fully overlapped into an unreadable pile of stacked
  heads. Fixed by spreading the end positions further apart (~290px total) and adding a per-walker
  `dy`/`scale` offset so they read as a staggered, layered crowd instead of a flat stack.
- `S06Aftermath`: the three fading-in "lesson" lines, first placed at `top:760`, had their third line
  hidden behind the burned-in caption pill (which starts around y≈870 once a two-line caption is
  showing). Moved the block up to `top:690` and tightened its line height so all three clear the
  caption with margin.

## Scene 1 — Two armies face each other (built, reused as-is)

- **Narrative purpose**: establish place, date, and the size mismatch between the armies, before any
  action.
- **Components used**: `Formation`/`Stakes` (crowd.tsx, baked to PNG), `Hero` (cast.tsx) ×2 foreground
  commanders, `Banner` (Stills.tsx), plain `FONT.title` caption — no `Slam`/`Burst`.
- **Background assets**: `public/agincourt/far.png`, `public/agincourt/mid.png` (already rendered).
- **Foreground animated characters**: 2 `Hero`s (English/French), gentle idle arm sway only.
- **Camera**: CSS-scale push-in per depth layer (`Layer`, 1.03–1.22×) over the scene duration; no pan.
- **Audio**: `music.mp3` (already present in `public/agincourt/`), narration slot (currently empty —
  see `agincourt-narration.md`).
- **Known risk realized/resolved**: none outstanding — this scene already renders correctly
  (`demo-project/out/agincourt-scene1.mp4`).
- **Fallback**: n/a, already working.

## Scene 2 — English defensive formation (tactical map)

- **Narrative purpose**: show *why* the English chose this ground — narrow front between woods,
  stakes planted, archers on the flanks — before the fighting starts. This is the "map/diagram" beat
  the brief asks for.
- **Required existing components**: `Stage` (common.tsx, for camera+paper), a flat top-down SVG
  diagram built from simple shapes (same technique as `demo-project/src/why-igloos/D1HeatLoss.tsx`
  etc. — the repo already has a working precedent for code-drawn explainer diagrams, reused here
  instead of inventing a new diagram system), `Caption`/`Card` for labels, `Stakes` (crowd.tsx) drawn
  small and schematically to mark the stake line on the map.
- **Background/static assets**: none new — this is a live-drawn vector diagram, not a photo-style
  still.
- **Foreground animated characters**: none (or, optionally, small schematic blocks standing in for
  "archers"/"men-at-arms"/"cavalry," not full `Hero`s).
- **Camera**: slow `Stage cam` zoom from the whole map to the narrow point between the woods, to sell
  "this is why the front was so tight."
- **Audio**: a calmer music cue (`gen_audio.py` style `mystery` or `hope`, per `animation-style.md`'s
  style list) since this is exposition, not action; a `page`/`tick`-style SFX on each label pop-in,
  reusing the existing SFX set (`public/agincourt/sfx/`).
- **Known technical risks**: none engine-side — this is the lowest-risk scene in the pilot, since it
  reuses the already-proven diagram pattern from `why-igloos` almost unchanged.
- **Fallback**: if the top-down map reads as cluttered, simplify to two rectangles (armies) + a funnel
  shape (the woods narrowing the front) + the stake line, dropping the mounted-knight icons.

## Scene 3 — English longbow volley

- **Narrative purpose**: the archers loose on the advancing French — the pilot's first real "action"
  beat.
- **Required existing components**: `ArrowVolley` (weather.tsx, verified in `repository-audit.md` §C —
  reused with no modification), a small line of archer `Hero`s (`stance=P.pointR`, same pattern as
  the existing `horse-demo/Scenes.tsx` `ArrowRain` scene), `Stage` for camera.
- **One small new addition required**: `repository-audit.md` §C found, by viewing an actual rendered
  frame of the existing `ArrowRain` demo, that its archers hold no visible bow (no `Bow` prop exists
  in `props.tsx`). Add a simple `Bow` component to `props.tsx` (same style as `Sword`/`Lance`: flat
  fill, `stroke={COL.ink} strokeWidth={6}`, centered on the grip) and pass it via `Hero`'s `held` prop
  before building this scene — archers are the entire subject of scene 3, so they should visibly carry
  one.
- **Background assets**: either the existing `mid.png` English rank (reused) or a tighter, new still
  rendered the same way (`npx remotion still`) if a closer archer line is wanted — decide once scene
  2's map establishes the archer position, so the two scenes agree on geography.
- **Foreground animated characters**: 2–4 archer `Hero`s, bow-draw pose held, no full draw-and-release
  animation needed (the pose library has no bow-draw key yet — see `stick.tsx`'s `P` object; `pointR`
  is the closest existing pose and is what the existing `ArrowRain` demo already uses).
- **Camera**: a short, tight shot on the archers, cut to a wider shot of the volley's arc landing
  near/on the French formation PNG.
- **Audio**: `whoosh`/`whoosh_long` SFX (already in `public/agincourt/sfx/`) timed to the loose, a
  low "horn" or drum hit under the volley.
- **Known technical risks**: `ArrowVolley`'s continuous-loop behavior (see audit §C) needs the scene's
  `Sequence` length chosen deliberately — too long and it reads as endless rain rather than a single
  volley, too short and arrows barely get airborne. Budget ~45–60 frames (1.5–2 s) per "loose" if the
  brief wants a discrete volley read, or let it run the full scene for a sustained-barrage read.
- **Fallback**: if timing the "single volley" read is awkward, default to the sustained-barrage
  reading (close to what the component already does by default) and let narration carry the "they
  loosed volley after volley" framing instead of a single dramatic release.

## Scene 4 — French advance, mud and congestion

- **Narrative purpose**: the French knights and men-at-arms advance across the narrow, sodden field
  and jam up — the tactical turning point the narration needs to explain.
- **Required existing components**: `Formation` re-rendered as a *moving* still is not possible (it's
  baked to PNG); instead, reuse a handful of live `Hero`/mounted `Horse` instances moving slowly
  forward over a static background (same layering idea as scene 1, but with 3–6 live figures instead
  of 2), `Rain`/`Wind` (weather.tsx, already verified as naturalistic, documentary-safe ambient
  effects) for the "wet, miserable field" read, and a visual device for congestion — e.g. figures
  slowing/bunching via staggered `walkTo` end-x values that converge, rather than literal physics.
- **Background assets**: a new still, rendered the same way as `far.png`/`mid.png`, showing the French
  formation mid-advance and visibly denser/bunched near the English end of the field (same
  `Formation` component, tighter `dx`/`dy` near the front to suggest congestion).
- **Foreground animated characters**: 3–6 live `Hero`/`Horse` figures walking/wading forward at
  different speeds so they visibly converge and crowd each other — the one genuinely new piece of
  staging in this scene (not a new component, just new `walkTo` timings on existing moves).
- **Camera**: a slow lateral pan (`Stage cam.x`) following the advance, slight camera shake only if a
  figure stumbles (reserved, per the tone rules in the audit — do not shake continuously for "mud").
- **Audio**: `Rain`'s ambient sound, a `tense`-style music cue, mud/squelch read is carried by the
  narration and visual staggering, not by a literal sound effect that doesn't exist in the current
  SFX set — do not invent a new SFX asset for this (the SFX set is fixed/synthesized; check
  `public/agincourt/sfx/` for the closest existing match, e.g. a soft `thud`, before assuming a new
  sound is needed).
- **Known technical risks**: this is the scene with the most *new* staging (nobody has built a
  "crowd visibly bunching up" beat with this engine yet) even though every component is proven
  individually. The risk is choreography/timing, not the engine.
- **Fallback**: if staggered `walkTo` convergence doesn't read clearly at a glance, fall back to a
  simpler device — a wide shot of the dense French `Formation` still, static, with a `Caption`
  stating the congestion ("thousands crowded into a few hundred metres of mud") rather than animating
  it.

## Scene 5 — Close combat and formation breakdown

- **Narrative purpose**: the lines meet, the French formation disintegrates — the pilot's most
  visually demanding beat and its highest-risk scene.
- **Required existing components**: a small number of live `Hero`s in close melee poses (`punchR`,
  `kickR`, `fall` from `moves.ts`), optionally 1 short mounted `Horse` charge/clash insert reusing the
  proven `HorseClash` pattern (audit §C) — **not** a prolonged multi-rider melee.
- **Background assets**: a third static still (or reuse `mid.png` at a tighter crop) showing the
  French formation already visually broken (gaps in the ranks) behind the live foreground fighters —
  i.e. the "formation breakdown" is mostly told by the *background* art, not by animating hundreds of
  figures breaking rank live.
- **Foreground animated characters**: 4–6 live `Hero`s in short, staggered combat beats (not a
  simultaneous mob fight — stagger the hits in time so each is readable), one short `HorseClash`-style
  insert if a cavalry moment is wanted.
- **Camera**: tight cuts between 2–3 small combat vignettes rather than one continuous wide shot —
  easier to keep each beat legible and keeps the live-character count per shot low.
- **Audio**: `impact`/`punch`/`clink` SFX (already in the SFX set) on each hit, sparing camera shake
  (`Stage hits`) on only the single biggest contact in the scene, per the audit's tone guidance.
- **Known technical risks**: this is where the horse's gait/z-order limitations (audit §C) and the
  general "don't animate a mob" cost concern are most likely to bite. Keep any mounted insert brief
  and tightly framed; keep the live fighter count per shot small (≤6) and stagger their actions in
  time so they are never all moving at once.
- **Fallback**: if a live melee reads as chaotic or the horse insert looks wrong at this shot size,
  drop to 2–3 vignettes of individual duels (no mounted insert) over the broken-formation still, and
  let narration + the visibly gapped background formation carry "the French lines collapsed into a
  crush" without a full-blown animated battle.

## Scene 6 — Aftermath and tactical lesson

- **Narrative purpose**: wide shot of the field after the battle, then the tactical takeaway (why the
  smaller army won) — the "lesson" beat.
- **Required existing components**: a static wide-shot still (new render, or the scene-1 `far.png`/
  `mid.png` pair recomposed at a quieter framing — e.g. remove the live foreground `Hero`s, keep the
  backgrounds, maybe grade them darker/duller), `Card`/`Caption` for the 2–3 tactical-lesson bullet
  points (narrow front, stakes, longbow volume of fire, mud/congestion — each already flagged in
  `agincourt-historical-notes.md` as "disputed relative weight," so the on-screen lesson text must
  hedge appropriately, e.g. "several factors combined" rather than crediting one cause).
- **Background assets**: reuse/relight existing stills if possible rather than rendering new ones —
  decide once scenes 1–5 are built and the tone of "aftermath" relative to "battle" is clear.
- **Foreground animated characters**: none, or a single slow camera move over the static field —
  this should be the calmest scene in the pilot.
- **Camera**: slow zoom-out (`Stage cam.z` toward a wider view), no shake.
- **Audio**: a `finale`-style music cue (slow, no drums, per `animation-style.md`'s style list),
  no action SFX.
- **Known technical risks**: none engine-side; the only risk is factual — make sure the on-screen
  "lesson" text matches the hedged, multi-causal framing in `agincourt-historical-notes.md` and does
  not accidentally state a disputed cause as settled fact.
- **Fallback**: if a new wide-aftermath still isn't rendered in time, a plain `Paper`/`ChapterCard`-style
  text-only closing scene (as several existing demo videos already do) is an acceptable minimum.

## Render verification plan (not just "finish the code and docs")

Checkpoint 1 established the method, used on scenes/components that already existed, and it must be
repeated for every new scene in Checkpoint 2 — a scene is not "done" when `tsc --noEmit` passes and
the code looks right; it is done when a real rendered frame has actually been looked at.

**Method** (exactly what this checkpoint did, to be repeated per scene):
1. Render (or re-render) the composition: `npx remotion render Agincourt out/agincourt-full.mp4`.
2. Pull 2–4 real decoded frames from the parts of the video that changed, with
   `ffmpeg -y -i out/agincourt-full.mp4 -vf "select='eq(n,N1)+eq(n,N2)+eq(n,N3)'" -vsync 0 out/check_%02d.png`
   (pick frame numbers from the scene's known `from`/`dur` in `Video.tsx`'s `SCENES`, not guesses) —
   this is cheap and fast (sub-second per extraction in this checkpoint) and avoids a full contact
   sheet when only one new scene needs a look.
3. **Open and actually view each extracted frame** (not just confirm the file exists) and check, per
   scene, against its own plan above:
   - Scene 2 (map): are the two armies, the woods, and the narrow gap all legible at a glance? Do the
     labels sit clear of the geometry?
   - Scene 3 (volley): do the archers visibly hold the new `Bow` prop? Does the arrow arc read as
     "from English line toward French line," not a random scatter? Do arrowheads point the right way?
   - Scene 4 (mud/advance): do the live figures visibly converge/bunch, or does it read as several
     independent walk-ins? Is the new background still visibly denser near the English end?
   - Scene 5 (combat): is each of the 2–3 vignettes legible on its own frame (not a blur of
     overlapping limbs)? If a `HorseClash`-style insert is used, sample frames across a full stride —
     Checkpoint 1 could not confirm or rule out the far-leg z-order issue (audit §C) from the frames it
     happened to sample, so Checkpoint 2 must check this specifically, across more of the gait cycle,
     before deciding whether it's visible enough to matter at the pilot's shot sizes.
   - Scene 6 (aftermath): does the on-screen lesson text fit the frame without crowding; does the wide
     shot actually read as "after," not identical to scene 1?
4. For the still/PNG layers specifically, open the rendered PNG directly (as this checkpoint did for
   `mid.png`) and confirm the background is genuinely transparent before trusting it as a parallax
   layer, rather than assuming `remotion still` preserved alpha.
5. Only after step 3 passes for a scene, run `python scripts/check_render.py out/agincourt-full.mp4
   --timeline demo-project/src/agincourt/timeline.json` for the numeric checks (duration match, no
   clipped audio) that a frame-by-frame look can't catch.
6. Log the scene and what was actually checked in `checkpoint-log.md`, not just "rendered OK."

This is deliberately lightweight (no new tooling, `ffmpeg` is already present per `HANDOFF.md`) but it
is a real visual check, not a proxy for one — file existence, file size, and a passing type-check are
all necessary but none of them are sufficient on their own, which is exactly what this checkpoint's
own audit found (the missing `Bow` prop and the odd commander-outfit rendering in scene 1 were both
invisible to `tsc`/file-listing and only showed up once a frame was actually opened).

## Implementation sequence for Checkpoint 2

1. Write/approve the full six-scene narration (extends `agincourt-narration.md`, currently scene-1-only)
   using only the hedged numeric framing from `agincourt-historical-notes.md` — do this **before**
   building scenes 2–6, since scene length and camera timing should be anchored to the narration
   (`cueStart`/`beat`, per `references/pitfalls.md`'s timing guidance), not to arbitrary frame counts.
2. Run `scripts/parse_input.py --script <agincourt-script.md> --out demo-project/src/agincourt/timeline
   --wps 3.0 --lead 0.6 --pause 0.3 --gap 0.2 --tail 1.0` (same invocation already used for scene 1,
   per `docs/agincourt-implementation-plan.md`) to regenerate `timeline.ts`/`timeline.json` and
   `voiceover.srt` for the full six-scene script.
3. Build scene 2 (tactical map) first — lowest risk, reuses the `why-igloos` diagram pattern exactly.
4. Build scene 3 (arrow volley) — reuses `ArrowVolley` + the `ArrowRain` pattern from `horse-demo`
   almost unchanged; decide the single-volley-vs-barrage timing (see above) while building it.
5. Render a contact sheet for scenes 2–3 (`node stickman-sheet.mjs Agincourt out/agincourt-s23.png
   <frames>`) and run `npx tsc --noEmit` before moving on, per the project's standard check sequence.
6. Build scene 4 (mud/congestion) — render its new static still first
   (`npx remotion still AgincourtFrenchAdvance public/agincourt/french-advance.png --image-format=png`,
   registering that composition in `Root.tsx` the same way `AgincourtFar`/`AgincourtMid` are
   registered), then the live foreground figures.
7. Build scene 5 (close combat) last among the action scenes — it carries the most risk (audit §C) and
   benefits from scenes 2–4 already having settled the pilot's pacing and tone.
8. Build scene 6 (aftermath/lesson), cross-checking its on-screen text against
   `agincourt-historical-notes.md` line by line before locking it.
9. Full render: `npx remotion render Agincourt out/agincourt-full.mp4`, then
   `python scripts/check_render.py out/agincourt-full.mp4 --timeline demo-project/src/agincourt/timeline.json`.
10. If a voiceover is recorded at any point, re-time with `scripts/align_voice.py` (per
    `references/pitfalls.md`'s guidance to anchor to cue indices, not hardcoded frames) and re-run the
    render + check.

## Exact commands planned for Checkpoint 2 (for reference)

```bash
cd demo-project

# 1. Regenerate the full-script timeline (after the 6-scene narration is written)
python ../scripts/parse_input.py --script agincourt-script.md --out src/agincourt/timeline \
  --wps 3.0 --lead 0.6 --pause 0.3 --gap 0.2 --tail 1.0

# 2. New static crowd/background stills (one per new scene that needs one), each registered
#    as a 1-frame Composition in src/Root.tsx first, same pattern as AgincourtFar/AgincourtMid
npx remotion still AgincourtFrenchAdvance public/agincourt/french-advance.png --image-format=png
npx remotion still AgincourtBroken public/agincourt/broken.png --image-format=png
npx remotion still AgincourtAftermath public/agincourt/aftermath.png --image-format=png

# 3. Type-check after every scene file is added/edited
npx tsc --noEmit

# 4. Contact sheet per new scene before a full render
node stickman-sheet.mjs Agincourt out/agincourt-check.png 30 300 600 900 1200

# 5. Full render + validation
npx remotion render Agincourt out/agincourt-full.mp4
python ../scripts/check_render.py out/agincourt-full.mp4 --timeline src/agincourt/timeline.json

# 6. (only once a voiceover exists) re-time and re-render
python ../scripts/align_voice.py --audio public/agincourt/voice.wav ...   # exact flags per --help
npx remotion render Agincourt out/agincourt-full.mp4
```

Do not treat this as a license-eligibility decision for the finished video — re-check
`repository-audit.md` §E's licensing caveat against `remotion.pro/license` directly once Checkpoint 2
is ready to publish anything commercially.
