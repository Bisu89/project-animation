# Repository audit — history-pipeline Checkpoint 1

Scope: verify, from source, what the engine can actually do for a serious battle-documentary pilot
(Agincourt 1415). Every claim below was checked by opening the named file; where a claim could not
be checked directly (no network, no running render), it is marked **unverified / assumption**.

This audit builds on work already done in-repo under `docs/agincourt-*.md` and `demo-project/src/agincourt/`
(scene 1 of the six-scene Agincourt video already exists and already renders — see §E). This checkpoint
re-verifies those claims from source rather than trusting the earlier docs at face value, and adds the
license/tone verification the earlier docs didn't do.

## A. What was inspected

Read directly, in full: `assets/engine/crowd.tsx`, `assets/engine/horse.tsx`, `assets/engine/weather.tsx`,
`assets/engine/fx.tsx`, `assets/engine/common.tsx`, `assets/engine/stick.tsx`, `assets/engine/cast.tsx`,
`assets/engine/moves.ts`, `assets/engine/props.tsx`, `references/engine-api.md`, `references/animation-style.md`,
`references/pitfalls.md`, `README.md`, `LICENSE`, `demo-project/package.json`, `demo-project/tsconfig.json`,
`demo-project/src/Root.tsx`, `demo-project/src/agincourt/{S01Armies,Stills,Video}.tsx`,
`demo-project/src/horse-demo/Scenes.tsx`, `docs/agincourt-{implementation-plan,historical-notes,narration}.md`.
Ran directly: `git log`, `ls demo-project/out`, `python scripts/check_render.py --help`,
`python scripts/new_video.py --help`, `python scripts/parse_input.py --help`, a `WebFetch` of Remotion's
license text, and two `WebSearch` queries on Agincourt troop/casualty numbers (see
`agincourt-historical-notes.md`). Files found by listing the tree first (`find`), not assumed by name.

**Also done, specifically to avoid the trap of "the code looks right so it must render right"**: used
`ffmpeg -vf select='eq(n,N)'` to pull real decoded frames out of three already-rendered videos
(`agincourt-scene1.mp4`, `horse-demo.mp4` at its `HorseGallop`/`HorseClash`/`ArrowRain` scene ranges)
and opened `demo-project/public/agincourt/mid.png` directly, then viewed all of them as images. Every
claim in §B and §C below that says "confirmed by viewing a frame" means exactly that — a real frame
from a real render was opened and looked at during this checkpoint, not inferred from source code or
from a file's size/timestamp. See `checkpoint-log.md` for the render-verification method to repeat in
Checkpoint 2.

## B. Crowd rendering — `assets/engine/crowd.tsx`

**Verified APIs** (full source read):
- `Soldier({ x, y, s?, facing?, gear?: "bow"|"spear"|"sword"|"none", patch?, plume?, mounted? })` —
  draws one stick soldier as a handful of SVG `path`/`rect`/`circle` elements: body+head line art,
  a colored tabard rectangle (`patch`), an optional plume stroke, and gear-specific extra strokes
  (spear shaft, sword, or bow+string). `mounted` drops the leg strokes (crowd.tsx:19,22,25) so the
  figure sits correctly on a `Horse` saddle.
- `Formation({ x, y, cols, rows, dx, dy, s?, falloff?, facing, mix, patch, plume?, seed?, jitter? })` —
  places `cols × rows` soldiers in ranks receding upward from the front rank; each rank is scaled by
  `falloff^rank` (crowd.tsx:69); gear is chosen per-soldier by `pick()` from a `{bow,spear,sword}`
  ratio (`mix`); position/scale/gear/plume all use Remotion's seeded `random(key)` keyed on
  `` `${seed}-${row}-${col}x|y|s|g|p` `` (crowd.tsx:72-85), so **the same `seed` always reproduces the
  same formation** — this is genuinely deterministic, not just documented as such.
- `Stakes({ x, y, n, dx, dy?, s?, lean?, seed? })` — a row of leaning sharpened stakes, also
  seed-deterministic.

**Density/perspective**: fully configurable via `cols/rows/dx/dy/s/falloff` — nothing hardcoded.
No built-in "camera perspective" (no vanishing-point projection); depth is faked by shrinking later
ranks (`falloff`) and, at the scene level, by scaling whole PNG layers at different rates (see below).

**Static rendering — confirmed working, not just documented, and confirmed by actually looking at the
pixels (not just file sizes/timestamps)**: `demo-project/src/Root.tsx:81-82` registers two 1-frame
compositions, `AgincourtFar` and `AgincourtMid`, each rendering `FarLayer`/`MidLayer` from
`demo-project/src/agincourt/Stills.tsx`. The PNGs they produce already exist on disk at
`demo-project/public/agincourt/far.png` and `mid.png`, and `demo-project/src/agincourt/S01Armies.tsx:
63,69` loads them with `<Img src={staticFile(...)}>`. This checkpoint opened `mid.png` directly
(not just listed it) and it genuinely shows the described content: two visually distinct ranks of
soldiers (red-tabard English on the left under the St George banner, blue/gold French on the right
under the fleur-de-lis banner), plus the 4 static mounted knights at the right edge of the French
side — background outside the figures is empty/transparent (no sky or ground painted into the PNG
itself), consistent with `Stills.tsx`'s `Frame` wrapper having no background `<rect>`.

This checkpoint also extracted three real frames (not stills, actual decoded video frames via
`ffmpeg -vf select`) from the rendered `demo-project/out/agincourt-scene1.mp4` and viewed them. They
show, correctly composited: the far/mid PNG crowd layers sitting behind two live foreground `Hero`
commanders, the sky/field `Backdrop`, the `Fog` band between the layers, the swaying banners, the
title card fading in/out, and (on the captioned frame) the burned-in caption pill with the scene-1
narration text — i.e. the entire layered composition renders correctly end-to-end, confirmed by
pixels, not inferred from the file existing. One real cosmetic issue surfaced by actually looking:
the two foreground commanders' faces read a bit like they're wearing glasses (an artifact of the
`shape: "square"` `BigHead` combined with its eye circles) and the English commander's `Outfit
type="soldier"` torso renders as a slightly asymmetric white/red block at this zoom — neither breaks
the scene, but both are worth a look in Checkpoint 2 if commanders get a closer shot.

The composed video **has already been rendered**: `demo-project/out/agincourt-scene1.mp4` exists (6.9 MB,
timestamped 2026-10-15 14:42 from `ls -la`). So the full still→PNG→parallax-layer→render pipeline is
not hypothetical; it already ran successfully once, for this exact pilot, and this checkpoint verified
that by watching actual decoded frames, not just the file's existence.

**Separate English/French formations — already implemented, not just possible**:
`Stills.tsx:45-50` (`FarLayer`) and `Stills.tsx:53-71` (`MidLayer`) each call `Formation` twice with
different `x`, `facing` (1 vs -1), `patch` (`ENG` red vs `FR` blue), `mix`, and `seed` — e.g. far
English: 26×11 cols×rows at scale 0.2; far French: 32×13 at scale 0.2 (≈286 + 416 ≈ 700 silhouettes,
matching crowd.tsx's own comment "cheap stickmen for armies"). `MidLayer` additionally places 4
mounted French knights (`Horse` + `Soldier mounted gear="spear"`, `amp=0` i.e. standing still) as a
static background group — i.e. the repo already demonstrates mounted soldiers *in the static crowd
layer*, which is a materially lower-risk use of `horse.tsx` than live animated mounted combat (§C).

**Integration as a layer — confirmed, with a caveat**: `S01Armies.tsx`'s `Layer` component
(lines 51-53) wraps each depth band (backdrop, far PNG, fog, mid PNG, live foreground) in an
`AbsoluteFill` that CSS-`scale()`s from the frame center over the scene's duration — a cheap
"push-in" parallax, not true multi-plane scrolling. This reads fine at the rates used (1.03 to 1.22)
over a ~11 s scene; it was not tested over a much longer or faster camera move.

**Limitations found (verified) or to verify (flagged honestly)**:
- *Verified*: per-frame cost of the crowds is zero in the final render — they are static `<Img>`
  elements, not live `Formation` calls, once baked. This is the entire point of the design and it
  demonstrably works (the render above includes ~700+ background soldiers at normal render time).
- *Verified*: the composition dimensions for the stills (`AgincourtFar`/`AgincourtMid`, 1920×1080,
  `Root.tsx:81-82`) match the main `Agincourt` composition exactly, so no scale mismatch on import.
- *Verified this pass*: opened `demo-project/public/agincourt/mid.png` directly and confirmed only
  the soldier/banner/horse shapes are painted — the rest of the frame is empty, matching `Frame`
  having no background `<rect>`. Combined with the actual rendered video frames (above), which show
  the sky/field `Backdrop` correctly showing through behind the crowd silhouettes with no visible
  white/black box around them, this is now **confirmed, not just plausible**: `remotion still
  --image-format=png` does preserve real transparency for this composition.
- *Verified limitation*: `Formation`'s depth is a flat scale falloff per rank, not a true projection —
  fine for the "distant block of identical troops" look this pilot wants, unsuitable if a future scene
  needs soldiers to walk *through* the formation in depth.

**Conclusion**: `crowd.tsx` + the existing `Stills.tsx`/`S01Armies.tsx` already meet every requirement
in the task brief (static layers, deterministic, separate armies, parallax integration). **No new
crowd engine is needed.** This was previously implemented (per `HANDOFF.md`, during the current
session before this checkpoint) and is reused as-is.

## C. Horse and arrow capabilities

### `assets/engine/horse.tsx` — `<Horse>`

**Verified from source**: props `f x ground? scale? facing? speed? amp? rear? coat? mane? cloth? trim?`
plus a `children: (sd: Saddle) => ReactNode` render-prop. `amp` (0 = standing, 1 = full gallop) and
`rear` (0 = normal, 1 = fully reared) are continuous blends computed with `lerp()` against the gallop
sine cycle (horse.tsx:51-54) — they are meant to be *animated* (eased 0→1 etc.) by the caller, not
just set statically, though `MidLayer`'s background knights use `amp=0` (static) deliberately.
`rideGround(sd, heroScale)` and the `Saddle { x, y, tilt, s }` the component hands back to its
children are a real, working seat for a `Hero` — confirmed by actual working usage, not just by the
doc comment at the top of the file:
- `demo-project/src/horse-demo/Scenes.tsx` — `HorseGallop` (one galloping rider, `amp` fixed at full
  speed), `HorseClash` (two riders charging, rearing on impact, with a `Burst` at the lance contact).
- `demo-project/src/agincourt/Stills.tsx:65-69` — 4 static mounted knights in the background layer.
- Rendered output exists: `demo-project/out/horse-demo.mp4` (3.9 MB). This checkpoint extracted and
  viewed 4 real decoded frames from it (`ffmpeg -vf select`, not stills): one mid-gallop (the lance-
  carrying rider at full stride, mane/tail flowing, caparison visible, `SpeedLines` behind), and two
  from the rearing clash (`HorseClash`) a few frames apart. All read correctly at a glance — the
  gallop cycle is legible as a gallop, the rear-up pose is legible as a rear, the lance and sword are
  held and oriented correctly, and the `Burst` at the lance/sword contact is exactly as restrained as
  `animation-style.md`'s "reserve it for the decisive moment" rule intends. The documented far-leg
  z-order issue (next paragraph) was **not clearly visible in these specific sampled frames** — it may
  only show up at certain points in the gait cycle or at a closer zoom; Checkpoint 2 should sample
  more frames across a full stride before deciding it's a non-issue.

**What is implemented vs. prototype-grade** (both the engine doc and `HANDOFF.md` call this a
prototype; this audit confirms the specific gaps, not just the label):
- One gait: `horse.tsx:51-54` uses the *same* sinusoidal offsets for every value of `speed`/`amp` —
  there is no distinct walk/trot/canter pattern, only one stride shape scaled by amplitude. Fine for
  "gallop" and "standing," not for a realistic slow walk.
- Z-order: the far-side rider's leg is drawn by `Hero`/`Figure` on top of the horse body (this is a
  draw-order limitation in how a `Hero` is composited inside `Horse`'s `children` callback, not a bug
  in `Horse` itself — `Horse` only darkens the far leg's *color* (`darken(coat)`, horse.tsx:91), it
  does not actually layer the rider behind the horse's near legs).
- A fallen rider (the `fall` move from `moves.ts`) floats slightly above the ground when ridden,
  because `BigHead`-equipped `Hero`s keep the hip slightly raised even "lying down" — a body-pose
  issue inherited from `moves.ts:fall`, independent of the horse.
- Tail/neck curve shapes are first-pass hand-tuned Bézier paths (horse.tsx:102-103, 117-126), not a
  concern for a documentary (they read fine at normal zoom in the existing renders) but not refined.

**Recommendation for the pilot**: reuse `Horse` as-is for (a) static mounted knights in the crowd
layer (already done, zero new risk) and (b) short, tightly-framed live inserts — a charge, a clash,
a rear — exactly like the existing `HorseClash`/`HorseGallop` demos, which already render correctly.
**Postpone** anything that needs a sustained, readable walk gait or a long two-rider melee with
visible far-leg crossing — the gait and z-order gaps would show. For scene 5 ("close combat, loss of
cohesion"), prefer brief, camera-tight mounted-charge beats (reusing the proven `HorseClash` pattern)
over a prolonged mounted dogfight.

### `assets/engine/weather.tsx` — `<ArrowVolley>`

**Verified signature** (weather.tsx:287-297): `ArrowVolley({ f, from: {x,y}, to: {x,y}, seed?, count?
= 28, life? = 46, arc? = 260, spread? = 90, color? })`. Each of `count` arrows follows a parabolic
lob from near `from` to a scattered point near `to` (`spread` randomizes the landing point, `arc`
sets lob height), with its own random phase so arrows are continuously in flight, wrapping every
`life` frames (`wrap(f + r0*life, life) / life`, weather.tsx:303) — **this is a continuous, looping
barrage by design, not a single discrete volley**. Each arrow's facing is derived from the parabola's
instantaneous velocity (lines 310-314), so arrowheads correctly point along the flight path, and each
arrow fades in/out at the start/end of its own flight (line 316) rather than popping.

**Verified working, by pixels, not just by code**: `demo-project/src/horse-demo/Scenes.tsx:91-106`
(`ArrowRain` scene) places 4 archer `Hero`s and one `ArrowVolley f={f} from={{x:880,y:700}}
to={{x:1500,y:820}}` call with default props, inside the already-rendered
`demo-project/out/horse-demo.mp4`. This checkpoint extracted two real decoded frames from that
scene's time range (frames 300–420 of the composition, per `horse-demo/Video.tsx:28`) and viewed
them: the arc of arrows is clearly visible and clearly arcing (not a straight line), each arrowhead
visibly points along its direction of travel (confirming the velocity-vector-orientation code at
weather.tsx:310-314 actually works visually, not just algebraically), and the arrows fade correctly
at the front and tail of the volley rather than popping in/out. No modification to the component was
needed to get a readable "arrows flying from the English line toward the French line" effect.

**One real gap found only by looking at the frame, not by reading the code**: the 4 archer `Hero`s in
this scene hold **no visible bow** — `Scenes.tsx`'s `ArrowRain` gives them `stance={P.pointR}` and no
`held` prop, so they read as generic soldiers pointing, and the "archer" identity is carried entirely
by the arrows themselves, not by anything in their hands. Checking `props.tsx` (already read in full
for §B) confirms there is **no `Bow` component** in the engine at all — `crowd.tsx`'s `Soldier` draws
a simple bow curve inline for the static crowd (crowd.tsx:28) but `Hero`/`props.tsx` has nothing
equivalent for a live foreground archer. For Agincourt scene 3, where archers are the entire point of
the scene, this is worth a small addition (a simple `Bow` prop in `props.tsx`, matching `Sword`/
`Lance`'s style) rather than shipping archers who are only identifiable as archers because arrows
happen to be flying nearby. This is a small, scoped addition to an existing file, not a new engine
module.

**Can it represent an English longbow volley without modification?** Yes, with scene-level staging
rather than code changes: because `f` is local to whatever `<Sequence>` the scene lives in, wrapping
`ArrowVolley` in a `Sequence` only as long as roughly one flight (`life` ≈ 46 frames ≈ 1.5 s at 30 fps)
makes it read as "one volley," since very few arrows get to loop a second time before the sequence
ends. For a *sustained* barrage (more historically apt — longbowmen kept shooting, not one single
flight), simply give it a longer `Sequence`/longer dwell and it reads as continuous rain — which is
what the default behavior already produces. Either reading is achievable by choosing the scene's
on-screen duration, not by touching `weather.tsx`.

**Limitations (verified)**: single `from`→`to` pair per call (multiple firing points/rows need
multiple `ArrowVolley` instances, which is trivial but should be budgeted for scene 3); no collision
with a `Formation` — arrows do not actually "hit" rendered soldiers, they just terminate at `to`,
so the sense of impact has to come from camera cut + `Burst`/`Dust`/SFX timed at the arrows' expected
landing frame, staged by the scene author, not the component.

**No claim of production-readiness for either component is made here** — both are reused as-is
because they are already proven in a rendered output, not because they are polished.

## D. Visual tone — comic effects vs. documentary restraint

**Verified**: `assets/engine/fx.tsx` defines `FONT = { comic: "Bangers", title: "'Barlow Condensed'",
body: "Inter" }` (fx.tsx:11-15, loaded via `@remotion/google-fonts`). `Slam`'s *default* font is
`FONT.comic` (fx.tsx:170). `Burst` (impact starburst), `Dust` (landing puffs), `SpeedLines` (comic
action-burst lines), `WordBlock`/`Stamp`/`Card` (common.tsx) are all built for the existing
cartoon-explainer house style — confirmed by `references/animation-style.md`, whose stated goal is
explicitly "the energy of classic stick-figure action animation" with principles like "impacts get
the full treatment… big ones also get a slam word" and gag-driven scene recipes (spinning debt
towers, a hero punching cards into place, etc.). This is a different register from a history
documentary and the mismatch is real, not assumed.

**Good news, also verified**: the existing Agincourt scene 1 *already made the right calls* without
being told to — `S01Armies.tsx` does **not** use `Slam`, `Burst`, `WordBlock`, or comic font anywhere;
its title card is a plain fading `<div>` in `FONT.title` (S01Armies.tsx:102-104), and its only "effect"
is a soft `Fog` gradient div and gentle banner sway. This is a working precedent for the tone this
checkpoint should lock in, not a new design.

**Recommendation (decision, not just options)**:
- **Reuse as-is, no new dependency needed**: `FONT.title` (Barlow Condensed, serious sans, already
  used for titles/chapter cards/captions) and `FONT.body` (Inter, already used for captions) cover
  documentary titles and captions; `Caption`/`Captions` (pill captions, burned-in subtitles),
  `ChapterCard`, `Paper`/`Stage` (backgrounds/camera, `tint` is already parametrized so a parchment/
  sepia palette needs no code change), and all of `weather.tsx`'s ambient effects (`Rain`, `Wind`,
  `Snowfall`, `Water`) — these read as naturalistic weather, not comic.
- **Reuse, but reserved for genuinely dramatic beats only, at most once or twice in the whole pilot**:
  `Burst` (already used exactly this way for the lance/sword clash in `HorseClash`) and `Stage`'s
  `hits`/camera-shake — fine for *the* decisive contact of a scene, wrong if used on every hit.
  `ArrowVolley`/`Sparks` are naturalistic action, not comic, and can be used more freely.
- **Avoid for this pilot**: `FONT.comic` (Bangers) — if `Slam` is used at all for a title, pass
  `font={FONT.title}` explicitly rather than taking the default; `SpeedLines` (reads as a comic
  "whoosh," used in the unrelated `HorseGallop` demo, not appropriate here); `WordBlock`, `Stamp`,
  `Card`, and the exaggerated gag poses (`cheer`, `shrug`, `facepalm`) belong to the explainer-comedy
  line of the engine and should not appear in the history pilot.
- No new font or asset dependency is needed to hit a documentary tone; this is a matter of which
  existing primitives get used, confirmed by the fact that `S01Armies.tsx` already got it right.

## E. Production and licensing environment

**Remotion/toolchain versions** (read directly from `demo-project/package.json`): `remotion`,
`@remotion/cli`, `@remotion/bundler`, `@remotion/renderer`, `@remotion/google-fonts` are all pinned to
**4.0.535**; `react`/`react-dom` **19.3.1**; `typescript` `^5.9.3`.

**Commands** (verified either by reading `package.json`/`tsconfig.json` or by actually running
`--help`):
- Render: `npx remotion render <CompositionId> out/<file>.mp4` (also wrapped as `npm run render` in
  `package.json`, which requires the composition id as an extra arg). Already used successfully for
  `agincourt-scene1.mp4`, `horse-demo.mp4`, `cast-demo.mp4`, etc. — all present in `demo-project/out`.
- Still frame (for the crowd PNGs): `npx remotion still <CompositionId> <path> --image-format=png`.
- Dev preview: `npm run dev` → `remotion studio`.
- Type-check: `npx tsc --noEmit` (the project's own `noEmit: true` in `tsconfig.json` plus
  `noUnusedLocals: true` — unused imports fail this check, per `references/pitfalls.md`). `npm run
  lint` just runs bare `tsc`, which is effectively the same check since `noEmit` is set globally in
  `tsconfig.json`, not on the CLI invocation.
- Contact sheets: `node stickman-sheet.mjs <CompId> out/x.png <frame> <frame> ...` (frames are
  separate args).
- Render validation: `python scripts/check_render.py <video> [--timeline TIMELINE] [--hits HITS]`
  (confirmed via its own `--help`; it is the project's only render-correctness tool).
- **No test suite and no linter (ESLint) exist in this repository** — confirmed by the absence of any
  test runner or ESLint dependency in `package.json`, and stated explicitly in the project's own
  `docs/agincourt-implementation-plan.md`. "Validation" for this project means: `tsc --noEmit`, a
  contact sheet, a render, and `check_render.py` — there is nothing else to run.
- No separate "build" step: for a Remotion project of this shape, `render`/`still` *is* the build
  output; there is no bundle-only build target in `package.json`.

**Project structure/conventions** (verified from `Root.tsx` + the file tree): one folder
`src/<slug>/` per video containing `Video.tsx` (a `SCENES` array of `{c, from, sfx}`, a `DURATION`
export, `VideoProps = {music, sfx, voice, captions}`, and automatic music-ducking under the voice —
all read directly in `agincourt/Video.tsx`), `cues.ts`, `sfx.ts`, `timeline.ts`/`timeline.json`
(machine-generated by `scripts/parse_input.py`), and an optional `voiceover.srt`; the composition is
registered by hand in `src/Root.tsx`; static assets (music, SFX, images) live in `public/<slug>/`.

**License files found**: repo-root `LICENSE` = MIT, "Copyright (c) 2026 nispa" (read directly, exact
text). `README.md` states Remotion's own license terms in one sentence ("free for individuals and
small companies; larger organisations need a company license") with a link to
`https://www.remotion.dev/license` — **this was the repo's own existing, previously-unverified claim**.

**Independently verified this checkpoint** (not inferred from the MIT license, per the brief's
instruction): fetched `https://www.remotion.dev/license`, which 307-redirects to
`https://github.com/remotion-dev/remotion/blob/main/LICENSE.md`; that page's actual text states the
**Free License** covers: individuals; a for-profit organization with **up to 3 employees**; non-profit
organizations; and anyone evaluating Remotion pre-commercial-use — and that eligible users may use it
"non-commercially **or commercially** for the purpose of creating videos and images." A paid
**Company License** is required for for-profit organizations above the 3-employee threshold; no
revenue or funding threshold is stated. The license text does not mention YouTube or ad revenue by
name, but a solo individual creator is explicitly within the Free License's commercial-use allowance.
Separately, modifying/reselling Remotion itself (as opposed to using it to produce videos) is
restricted at every tier. **Caveat**: this was read via GitHub's rendering of `LICENSE.md`, the
redirect target, not the live `remotion.dev/license` HTML — re-check `remotion.pro/license` and the
site's FAQ directly before relying on this for a real commercial decision, since terms can change and
this was a single fetch, not a legal review.

**Fonts**: `Bangers`, `Barlow Condensed`, `Inter` are loaded via `@remotion/google-fonts`, i.e. they
are Google Fonts (OFL-licensed, free for commercial use). This is treated as a low-risk, well-known
fact rather than independently re-fetched in this pass — flagged as an assumption, not hard-verified,
per the brief's instruction not to assume licensing without checking, but the risk here is minimal.

**No other third-party license files exist** in the repo (checked the full file listing): no
`NOTICE`/`THIRD_PARTY_LICENSES` file. Sound effects are stated by `README.md` to be synthesized from
scratch by `scripts/gen_audio.py` (no samples), consistent with there being no accompanying sample
license anywhere in the tree.

## Summary: reuse vs. test vs. postpone

| Component | Status |
|---|---|
| `Soldier`/`Formation`/`Stakes` (crowd.tsx) | **Reuse immediately** — deterministic, configurable, already proven end-to-end for exactly this pilot (scene 1 rendered) |
| Static still→PNG→parallax pipeline (`Stills.tsx`, `S01Armies.tsx`'s `Layer`) | **Reuse immediately** — same evidence |
| `ArrowVolley` (weather.tsx) | **Reuse immediately** — confirmed by viewing real decoded frames from `horse-demo.mp4`; only needs a scene-duration choice (not a code change) to read as "one volley" vs. "sustained rain" |
| `Bow` prop for live archer `Hero`s | **Missing — small addition needed** — confirmed by viewing a real frame that the existing `ArrowRain` archers hold nothing; `props.tsx` has `Sword`/`Lance` but no `Bow` |
| `Horse` for *static* mounted knights (crowd layer) | **Reuse immediately** — already in the existing `MidLayer` |
| `Horse` for *brief, tight* live mounted action (charge/clash) | **Small test before adoption** — reuse the proven `HorseClash`/`HorseGallop` pattern, keep shots short and tightly framed to stay inside the gait/z-order limitations |
| `Horse` for sustained walk gait or prolonged visible melee | **Postpone** — gait is one-size, far-leg z-order is wrong |
| PNG alpha-transparency assumption | **Small test before adoption** — open a rendered still and confirm true alpha, or re-render with an explicit background check, before depending on it for more complex compositing |
| Comic primitives (`Slam` default font, `Burst`/`SpeedLines` as default, `WordBlock`/`Stamp`/`Card`, gag poses) | **Avoid** for this pilot's tone, except `Burst`+camera-shake reserved for one decisive contact |
| Documentary primitives (`FONT.title`/`FONT.body`, `Caption`/`Captions`, `ChapterCard`, `Paper` tint, `weather.tsx` ambience) | **Reuse immediately**, already validated by `S01Armies.tsx`'s own restrained choices |
