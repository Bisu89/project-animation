# Engine API (src/stickman/)

Coordinates are the composition's pixels (1920×1080 by default). Ground line ≈ y 852–862.
Everything is driven by `f = useCurrentFrame()` (local to the scene's `<Sequence>`).

## Contents
- [stick.tsx: characters](#sticktsx-characters)
- [fx.tsx: text, impacts, camera](#fxtsx-text-impacts-camera)
- [common.tsx: stage and layout](#commontsx-stage-and-layout)
- [props.tsx: objects](#propstsx-objects)
- [weather.tsx: ambient snow, fire, wind](#weathertsx-ambient-snow-fire-wind)
- [bighead.tsx: upgraded expressive head](#bigheadtsx-upgraded-expressive-head)
- [spiderman.tsx: mask head (prototype)](#spidermantsx-mask-head-prototype)
- [outfit.tsx: clothing on the stick body](#outfittsx-clothing-on-the-stick-body)
- [cast.tsx: ready-made characters (Hero)](#casttsx-ready-made-characters-hero)
- [moves.ts: named actions](#movests-named-actions)
- [horse.tsx: horse and rider (prototype)](#horsetsx-horse-and-rider-prototype)
- [Template helpers (per video)](#template-helpers-per-video)

## stick.tsx: characters

**Angles** (degrees): `dir(a) = (sin a, cos a)`, so 0 = down, 90 = right, -90 = left, 180 = up.
Arms are relative to the torso (0 = hanging), forearm/shin relative to the upper limb.
Legs use the vertical reference (leaning the torso does not drag them).

`Pose = { x, y, lean, head, la1, la2, ra1, ra2, ll1, ll2, rl1, rl2, rot }`
- `x, y` hip position · `lean` torso (>0 right) · `head` tilt · `rot` whole body around the hip (flips/falls).
- `STAND` default pose (x 960, y 760, scale 1). `groundY(scale)` = hip y with feet on the ground.

`P` ready poses (spread them into keys): `stand armsUp cheer pointR pointL shrug think crouch punchR kickR carry hold facepalm sit handshake sad shock`.
With `facing={-1}` the figure is mirrored, so `pointR`/`punchR` point the way it faces.

`<Actor f keys color base? scale? facing? accessory? face? label? mod? trails? opacity? draw?>{(j) => …}</Actor>`
- `keys: Key[]` = `{ f, p: Partial<Pose>, e?: easing }`. **Keys are cumulative**: each key inherits
  values from the previous one. Before the first key the first pose holds; after the last key it holds.
  Default easing `SNAP` (fast with overshoot); `SMOOTH` for arcs/flights; `(t) => t` for linear walks.
  When a key spreads a `P.*` pose and also sets a field the pose has (e.g. `head`), put the spread FIRST:
  `{ ...P.shock, head: -25 }`; TypeScript rejects the other order.
- `base` = starting pose overrides (`{ x, y }`).
- `facing` number or `(f) => 1 | -1` (flip mid-action, e.g. after a backflip).
- `accessory`: `tie scarf tophat crown cap glasses none`. `face`: `none eyes angry sad happy`.
- `label` text above the head (names, countries, "YOU").
- `mod(t, pose) => pose` adds procedural motion: `addPose(p, walkCycle(t))`, `addPose(p, runCycle(t, speed))`,
  `addPose(p, idle(t, seed))` (breathing, keeps idle characters alive).
- `trails` (default true) draws ghost smears when the body moves fast.
- `draw` 0→1 draws the figure stroke by stroke (head, torso, arms, legs), for the "cursor draws the hero" open.
- children render prop gets joints `j` (`hip neck headC lElbow lHand rElbow rHand lKnee lFoot rKnee rFoot headR`):
  put held objects at `(j.lHand + j.rHand)/2`, a cursor in the hand, etc.

`<Figure pose …>` is the static version; `solve(pose, scale, facing)` returns joints without drawing
(useful to aim a cursor/prop at a hand before the character exists).

**Upgraded head (bighead.tsx)**: `headless` (on `Actor`/`Figure`) skips the built-in circle
head/face/accessory so a bigger, more expressive head can be attached at the head joint instead —
see below. `headAngle(j)` returns the head's "up" direction in degrees, for orienting it.

## fx.tsx: text, impacts, camera

Fonts (Google Fonts via @remotion/google-fonts): `FONT.comic` (Bangers: impact words),
`FONT.title` (Barlow Condensed 600/800/900: titles, labels), `FONT.body` (Inter: sentences).

Palette `COL`: `paper ink orange blue green red yellow purple grey dollar gold`.
Give each recurring character one colour and keep it all video long (the hero/"you" = orange).

| Component / fn | Use |
|---|---|
| `<Slam f at x y size color font weight rotate out stroke spacing>` | word/title that slams in (scale 3.2→1 + blur). `out` fades it. |
| `<Caption f at out x y size bg color align>` | pill caption sliding up (sentences, sources, numbers) |
| `<Type f at text cps>` | typewriter |
| `<Burst x y at f size color n>` | comic impact star; put it on the contact point at the hit frame |
| `<Dust x y at f spread>` | landing puffs on the ground |
| `<SpeedLines f from to dir>` | horizontal speed lines |
| `<Cursor x y scale pressed>` | the animator's mouse pointer |
| `<Paper tint ground>` | paper background (Stage uses it by default) |
| `<Wipe f dur>` | diagonal black wipe in/out |
| `shakeAt(f, hits, power, len)` | camera shake offsets (Stage does it for you) |
| `ease(f, a, b, from, to, easing)` | clamped interpolate with a snappy default |
| `countUp(f, a, b, to, from)` + `fmt(n)` | counting numbers with dot thousands separator |

## common.tsx: stage and layout

`<Stage hits power svg html under bg cam>`: one scene = paper + an SVG layer (characters, props,
bursts) + an HTML layer (text) sharing one camera shake.
- `hits`: frames where the camera shakes (every big impact); `power` 8 (light) – 30 (huge).
- `cam={{ x, y, z }}`: pan/zoom the SVG world (x/y = world offset, z = zoom around the centre).
  For a "timeline" of stations place them at x = 960 + i·1920 and pan `cam.x` between them;
  zoom out (`z` 0.33) at the end to show all of them at once.
- `bg` replaces the paper (e.g. `<Paper tint="#f3e7cf" />` for a sepia flashback).

| Component / fn | Use |
|---|---|
| `<ChapterCard n title sub dur>` | full-screen chapter card (use as its own scene) |
| `<Card f at x y w n accent size out>` | numbered card (lists, clauses, lessons); `x` = centre, `y` = top |
| `<Stamp f at x y text color size r>` | rubber stamp (TOP SECRET, TIER 1, FAKE…) |
| `<WordBlock x y r text bg color size s>` | SVG word in a box: a *physical* word that falls/bounces/hits |
| `fall(f, at, y0, y1, dur)` | gravity fall with small bounces → y |
| `<Bubble x y w h t tailX tailY>` | speech bubble (t = 0…1 pop scale) with SVG children |
| `<Captions cues bottom size>` | burned-in subtitles from timeline cues (Video does this with `captions: true`) |

## props.tsx: objects

All centred on (0,0); place with `<At x y s r o>`.
`Barrel(label)` oil barrel · `Bill(w, sym, color)` banknote · `GoldBar(label)` · `Coin(sym, color, r)` ·
`Shield(crack 0-1, color)` · `Missile` · `Printer(f)` money printer · `Bank(label, w)` columns building ·
`Box(label)` crate · `Ship` · `Ice(w, h)` ice block · `Chain(x1 y1 x2 y2 t)` growing chain ·
`Flag(colors, label, vertical)`.
New props: draw them in the same style (flat fill + `stroke={COL.ink} strokeWidth={6}`, round joins).

Not `<At>`-based (absolute coordinates, for backdrops/ropes instead of held objects):
- `<WebLine x1 y1 x2 y2 sag opacity color width>` — rope/web line with a slight sag (quadratic curve); fade `opacity` in from 0 while it "shoots" out to its target.
- `<Skyline seed tint count minH maxH width windows>` — deterministic city silhouette (same `seed` always draws the same buildings); two calls at different seed/tint/count/height give a cheap far/near depth read with no actual scrolling. For a scene where a character has to land on a specific roof, hand-place that one building instead (see `src/spiderman-demo/S01WebSwing.tsx`'s `NEAR`/`Building`) rather than relying on Skyline's random layout to line up.

## weather.tsx: ambient snow, fire, wind

Continuous effects, unlike fx.tsx's one-shot `Burst`/`Dust`/`SpeedLines`: every particle is placed
from a seeded random plus the current frame and wraps around, so they read correctly no matter what
local frame a scene starts or ends on (no pop at the cut).

| Component | Use |
|---|---|
| `<Snowfall f seed count area angle speed size color opacity>` | falling snow; `angle` 0 = straight down, lean it 15-25 for a blizzard |
| `<Fire f x y s seed embers>` | layered flickering flame anchored at its base `(x, y)`, with rising embers |
| `<Wind f seed count area angle speed color opacity>` | ambient blowing streaks/dust, softer and looped (vs. `SpeedLines`'s one-shot action burst) |
| `<Rain f seed count area angle speed len color opacity ground>` | slanted rain streaks; pass `ground` (a y) to add splash rings where drops land |
| `<FallingLeaves f seed count area speed wind size colors opacity>` | tumbling, swaying leaves (autumn palette by default) |
| `<Water f area color speed flow lines opacity>` | flowing stream band: wavy highlight dashes slide in the flow direction (`flow` 1 = right, -1 = left); default area is the strip below the ground line |
| `<Sparks f x y seed count spread speed gravity life size>` | flying sparks from a point (forge, clash, campfire) |
| `<ArrowVolley f from to seed count life arc spread color>` | a barrage of arrows lobbed along an arc from `from` to `to` (longbow volley) |

`area = { x, y, w, h }` limits where particles spawn (defaults to the full 1920×1080 frame);
use it to confine snow/wind to part of the frame (e.g. just the sky band above a caption). Give each
instance its own `seed` when a scene uses more than one, so their random patterns don't line up.

## bighead.tsx: upgraded expressive head

A big, detailed, emotive head for the existing poseable stick body (inspired by the "giant head +
thin body" style common on faceless history/explainer channels), instead of the default small
circle head. The body keeps every pose/walk/run/prop the engine already has — only the head
rendering changes. Attach it via `headless` + the children render prop:

```tsx
<Actor f={f} headless color={COL.orange} scale={1.3} keys={[{ f: 0, p: { ...P.pointR } }]}>
  {(j) => (
    <BigHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} r={82}
      hair="bun" emotion="worried" talk={talkCycle(f)} blink={f % 90 < 4} label="YOU" />
  )}
</Actor>
```

| Component / fn | Use |
|---|---|
| `<BigHead x y angle facing r skin hair hairColor emotion talk blink label>` | the head itself; `r` (default 72) is deliberately much bigger than the body's own head |
| `talkCycle(f, speed?)` | 0..1 mouth-openness cycle for a cheap but convincing "talking" bounce; pass it while a cue is speaking, `0` when silent |

`hair`: `bun \| short \| ponytail \| long \| bald \| none \| spiky \| afro \| kabuto \| helmet` (the last two are
headwear: a samurai kabuto and a soldier helmet). `shape`: `round \| oval \| square` (face outline).
`emotion`: `neutral \| angry \| sad \| happy \| shock \| worried \| cry \| smug` (sets eyebrows, mouth, tears, eyelids). Because the head paints in
front of the body (same as the reference style), poses that bring the hands up near head height
(`cheer`, `armsUp`, `facepalm`) get covered — prefer low gestures (`point*`, `carry`, `hold`,
`handshake`, `kick*`, walk/run) with a BigHead. See `src/bighead-test/S01BigHeadTest.tsx` in a
scaffolded project for a working example.

**Recommended body color**: with a BigHead attached, give `Actor`/`Figure` `color={COL.ink}` (plain
black stick body, like the reference style) instead of a per-character accent color — tell characters
apart by hair/headwear and `Outfit` (below) instead of limb color, and use `mod` to apply
`walkCycle`/`runCycle` whenever the body actually moves (a straight x change with no leg-cycle mod
reads as sliding, not walking).

## spiderman.tsx: mask head (prototype)

Drop-in alternative to `BigHead` for masked/helmeted heroes where no skin/hair/mouth shows: a
circular mask with radiating web lines and two big lens-shaped eyes whose tilt/size reacts to
`emotion` (no `talk`/`skin`/`hair` — nothing under the mask to animate):

```tsx
<SpiderHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} r={55 * scale} emotion="angry" blink={f % 90 < 4} />
```

| Prop | Use |
|---|---|
| `<SpiderHead x y angle facing r emotion blink label main web lensColor>` | same slot/shape as `BigHead`; `main`/`web`/`lensColor` override the mask/web-line/eye-lens colours (default red/black/off-white) |

Wired into `cast.tsx` as the `spiderman` preset (`PRESETS.spiderman`, `Preset.mask: "spiderman"` to
roll your own) — `<Hero who="spiderman">` renders this instead of `BigHead`, still on the normal
poseable stick body. Demo: `CastSpiderman` scene in `CastDemo`. Body is plain stick for now (no
red/blue suit yet); `Preset.mask` is a `| "spiderman"` union, built to extend to other masked
characters the same way (own file + one more union member + a branch in `Hero`).

## outfit.tsx: clothing on the stick body

A torso garment anchored to the neck/hip joints (rotates with torso lean, like the `tie` accessory).
The limbs stay plain stick lines drawn on top, so pair it with `behind` — rendered first, under
everything:

```tsx
<Actor f={f} color={COL.ink} keys={...} behind={(j) => <Outfit j={j} type="samurai" />}>
```

| Component | Use |
|---|---|
| `<Outfit j scale type color trim>` | `type`: `samurai` (kimono wrap + sash + shoulder flares) \| `soldier` (jacket + belt) \| `none`. `color` = garment, `trim` = sash/belt accent. |

Pair `type="samurai"` with `<BigHead hair="kabuto">` and `type="soldier"` with `<BigHead hair="helmet">`
for a matching headwear + outfit set.

## cast.tsx: ready-made characters (Hero)

`PRESETS` bundles face shape, hair/headwear, skin tone, outfit and a resting mood under a name:
`hero samurai ronin monk soldier officer villain grandma kid punk hippie lady athlete spiderman`. `<Hero>` assembles
head + black stick body + outfit + moves in one component, so a character is one line:

```tsx
<Hero f={f} who="samurai" x={500} emotion="worried" talking moves={[walkTo(0, 60, 900), bow(66)]} />
```

| Prop | Use |
|---|---|
| `who` | a `PresetName`, or your own `Preset` object `{ hair, hairColor, skin, shape, outfit, outfitColor, trim, scale, emotion, mask }` (`SKIN` has ready tones; `mask: "spiderman"` swaps in `SpiderHead` and ignores hair/skin/shape) |
| `x`, `ground`, `scale`, `facing` | start x, floor y (default 852; use it to place several rows), size (default 1.3), 1 or -1 |
| `emotion` | an `Emotion`, or `(f) => Emotion` to change mood over time |
| `talking` | `true` = mouth flaps; or `(f) => boolean` to follow your cues |
| `moves` | list of moves from moves.ts, in time order |
| `color`, `trails`, `seed` | body stroke (black by default), smear ghosts (off), a number that desynchronises idle breathing/blinking between characters |

Add your own character by adding an entry to `PRESETS` (or passing a `Preset` object inline).

## moves.ts: named actions

Chain ready-made actions instead of hand-writing keyframes. Each takes frames local to the scene;
chain them in time order without overlapping (each one returns to a rest pose when it ends):

| Move | Does |
|---|---|
| `walkTo(from, to, x, run?)` | walks (or runs) to `x` between the two frames, turning to face the way it goes, with a leg cycle that eases in and out |
| `bow(at, dur?)` | bows and straightens |
| `jump(at, h?)` | crouch, jump `h` px, land |
| `fall(at)` | falls backwards and lies down |
| `punch(at)` | wind-up and strike (the hit lands at `at + 10`) |
| `wave(at, dur?)` | raises the arm to the side and waves |
| `pose(at, P.shrug, hold?)` | strikes any `P.*` pose and holds it, then relaxes |
| `turn(at, dir)` | instantly faces left (-1) or right (1) |

`compose(ctx, moves, facing)` merges them into `{ keys, mod, facing }` for use on a bare `Actor`
(`Hero` calls it for you). Moves that end at a new x remember it, so `[walkTo(0, 50, 700), walkTo(60, 110, 300)]` works.

## horse.tsx: horse and rider (prototype)

Side-view horse with a stylised gallop cycle, rearing, an optional caparison, and a saddle callback so
a `Hero` can ride it. Props: `f x ground scale facing speed amp rear coat mane cloth trim`. `amp` 0 = standing,
1 = full gallop (animate it to start/stop); `rear` 0..1 rears up on the hind legs. `children` receives
`sd = { x, y, tilt, s }`, the saddle in world space; give the rider `ground={rideGround(sd, riderScale)}`,
`stance` = a seated pose, and `mod` adding `rot: sd.tilt` so it leans with the horse:

```tsx
<Horse f={f} x={x} ground={880} scale={0.95} cloth="#f2f2f2">
  {(sd) => <Hero f={f} who="officer" x={sd.x} ground={rideGround(sd, 1.05)} scale={1.05} stance={RIDE}
      mod={(t, p) => ({ ...p, rot: p.rot + sd.tilt })}
      held={(j) => <At x={j.rHand[0]} y={j.rHand[1]} r={78}><Lance /></At>} />}
</Horse>
```

`RIDE = { ll1: 75, ll2: -60, rl1: 88, rl2: -65, lean: 6, la1: 28, la2: 38 }` works as the seated stance. Keep two
horses about one body length (~280px) apart so they do not overlap. See `src/horse-demo/Scenes.tsx`. Known rough edges:
one gait pattern for all speeds, the rider's far leg is drawn over the horse, and a fallen rider floats slightly.

## Template helpers (per video)

`src/<slug>/cues.ts`: `cueStart(i)`, `cueEnd(i)`, `cueLen(i)`, `beat(from, i, frac)`.
`src/<slug>/sfx.ts`: `SfxCue = [frame, name, volume]`, `range(from, n, step, name, vol)`, `CARD`.
`src/<slug>/Video.tsx`: `SCENES` (`{ c, from, sfx }`), `chapter(n, title, sub, from)`, `DURATION`,
props `music sfx voice captions`, automatic music ducking under the voice.
Scene components receive `{ from, dur }` (global start frame and length).

## Period-character options (added for the Agincourt pass; all additive, defaults unchanged)

- `BigHead`/`Hero` preset: `hair: "kettle" | "bascinet"` (brimmed kettle hat; bascinet with cheek plates and nasal bar), `crest` (plume colour),
  `eyes: "dot"` (small dark dots, no white: no "glasses" under a helmet), `emotion: "stern"` (flat, slightly furrowed), `head` (size multiplier, 0.8 = 20% smaller).
- `ArrowVolley` one-shot mode: `at` (launch frame) + `stagger` (frames over which launches spread). Omit `at` for the continuous barrage.
- `Bow`: `pull=[x,y]` (local coords) puts the string and nocked arrow at the draw hand; use with `<At s r>` and `j.lHand` from `held`.
