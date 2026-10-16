# VISUAL STYLE GUIDE — 100 Days: Zombie Survival

> **FORMAT UPDATE (owner decision, 2026-10-16):** the series is now made mainly from **AI pictures with smooth zoom/pan, narration, subtitles and light motion**
> (rain, wind, dust, flicker), not full stickman animation. Wherever this document says "animation", "L0-L3" or "grounded gait", read it as
> **"picture plan + camera move + light fx"**. Pipeline: `PRODUCTION_WORKFLOW.md` section 2b. The vector animation code stays as an optional library.


Legend: **[CONFIRMED]** = already true in the repository code or brief (file named); **[PROPOSAL]** = suggestion.
Values below were read from `demo-project/src/survival-test/*` and `demo-project/src/stickman/*` (engine copy of `assets/engine/`).

## 1. Look and tone [CONFIRMED direction]
2D stickman animation, serious survival-documentary tone, flat simple backgrounds, controlled camera and parallax, purposeful character actions.
Avoid: oversized heads, exaggerated faces, comic fonts (`FONT.comic`/Bangers), comic bursts/speed lines (`Burst`, `SpeedLines`), unnecessary effects.
Allowed sparingly: a single dust puff or small camera shake at one decisive impact (the shutter slam in `SurvivalTest` uses `Dust` + `shakeAt`, power 8).

## 2. Character proportions and silhouette
- **Body [CONFIRMED]:** engine stick body; limbs are plain ink (`#1a1a1a`), stroke 12 x scale; torso 78, upper arm 40, forearm 38, thigh 48, shin 46 (unscaled units, `stick.tsx`). Identify people by headwear, clothing and silhouette, never by limb colour.
- **Heads [CONFIRMED]:** `BigHead` with `head: 0.8` (radius = 55 x scale x 0.8), dot eyes (`eyes: "dot"`), resting emotion `stern`/`worried`.
- **Scale [CONFIRMED]:** SURVIVOR-001 is scale 1.0 in running shots (0.82-0.86 when moving into depth near a door). Nearby zombies use 0.96-1.02 in the same shot so they read as the same kind of body. Distant figures 0.4-0.5.
- **SURVIVOR-001 silhouette [CONFIRMED in `Figures.tsx`]:** brown backpack on the back (`#6a5a3a`, top flap, strap), slate jacket (`#5b6b72`), short dark hair (`#2b2118`). The backpack must stay attached to the torso with small lag only (rotation about +/-3.5 deg, vertical lag about 1.8 x scale).
- **THE STRANGER [PROPOSAL]:** taller proportions, long dark-olive coat, rolled bag instead of a backpack, no hat so that he is never confused with a zombie; same head-size rule.
- **Zombies [CONFIRMED look in `Figures.tsx`]:** own vector drawing: egg-shaped skull, bulging yellowish eyes, open mouth with teeth, hunched, arms stretched forward, torn brown open jacket (or shirt only), red-striped tie, ragged jeans, brown shoes. Skins `#8fa387 #98a98c #79b04a #8c9f86 #93a58a`; jackets `#7a5232 #e2ddcc #6a4a34 #7f5a38`. No hats/cones/buckets. Cosmetic variety only; **no behaviour variants in Episodes 1-7** (no crawler, no missing-arm "special" type) per `WORLD_RULES.md`. [CONFIRMED: no hats; PROPOSAL: shirt-only and bright-green-head are cosmetic only]
- The zombie art is not a copy of any game character; keep it that way for a monetised YouTube channel.

## 3. Palette [CONFIRMED values from `World.tsx` unless marked]
| Use | Colour |
|---|---|
| Ink / outlines | `#1a1a1a` |
| Sky (dusk-grey gradient) | `#4c5663` -> `#a39a8c` -> `#c4b49d` |
| Far / mid skyline | `#8c95a0` / `#67707c` (lit windows `#f2c96d`, low opacity) |
| Sidewalk / kerb / road | `#a9abad` / `#7d8083` / `#3b4046` |
| Mall facade, glass, sign | `#7a838e`, `#262d35`, `#2f353d` (text `#d9d4c4`) |
| Grille bars / rails | `#8d95a0` / `#6f767f` |
| Interior / warm lamp | `#0f1318`->`#2a2a26` / `#e6d9a8` |
| Zombie skin / jeans / shoes | see section 2 / `#33507f` / `#4a2f1d` |
Rules: muted, desaturated city; the only saturated colours are the zombie head variants and small warm lights. Night scenes (Episode 1 scene 7, 4) use the same set darkened with a vignette. [PROPOSAL for night grading]
Fonts: `FONT.title` (Barlow Condensed) for signs/titles, `FONT.body` (Inter) for captions. No comic font.

## 4. Backgrounds and reuse [CONFIRMED mechanism, PROPOSAL assignments]
- Reusable pieces exist in `survival-test/World.tsx`: `Sky`, `FarSkyline`, `MidSkyline` (parallax layers), `Street`, `MallFront`, `Shutter` (see-through grille).
- Build each new location as one reusable component (a street block, a stairwell, a house front, a utility building, a bridge) and reuse across episodes by changing only camera and props. Every location gets a fixed "ground line" y (sidewalk lane 930, door floor 884) so characters can be placed consistently.
- Static crowd or distant-army style PNG layers (`crowd.tsx` + `npx remotion still`) can be reused for zombie hordes in wide shots. [PROPOSAL; the Agincourt pilot proves the pipeline]
- Do not use Fire (flat vector) on photo-like backgrounds; Rain/Snow/Wind blend fine (from `HANDOFF.md`).

## 5. Camera principles [CONFIRMED in `S01Chase.tsx`]
- Wide shot to establish geography, closer tracking shot for action, pull back to show the story beat, slow push-in on the final image.
- Camera moves are keyed with ease-in-out (`keyed()` in the scene) and are deliberate: no accidental scale jumps; character scale is constant inside a continuous shot.
- Parallax: far skyline 0.25, mid skyline 0.55, world 1.0 of the camera offset. Keep background movement consistent with the camera and the character speed.
- Cuts: dip to black over 10 frames at scene boundaries (see `agincourt/Video.tsx` `DipFade`); no wipes. [PROPOSAL to reuse]
- Frame everything with a clear foreground threat/safe space relationship (nearest zombie visible in the close shot; survivor visible even behind bars).

## 6. Animation levels (choose per scene to control production time) [PROPOSAL framework, matches the production brief]
| Level | What moves | Use for | Cost |
|---|---|---|---|
| L0 | Static composition, camera pan/zoom, parallax | establishing shots, narration-heavy moments | lowest |
| L1 | + idle/breathing, simple walk, a few eased poses (`Hero`, `moves.ts`) | calm scenes, dialogue-free acting | low |
| L2 | + ground-locked run/walk (`gait.ts`), turning, reaching, stumbling, backpack lag | chases, escapes, stealth walks | medium |
| L3 | + dedicated environmental animation (door, grille, shadow, flashlight beam, falling debris) | suspense and action peaks | highest |
Prioritised L2/L3 scenes: Episode 1 scenes 1, 2, 3, 5, 7, 8 (see `EPISODE_OUTLINE.md`).
Gaps still to build (not built yet): door with open/close state, flashlight beam, stairs/railing with the backpack snag, smooth turn-around (facing flips instantly today), footstep sound effects.

## 7. Movement rules [CONFIRMED]
- Use `groundedRun` (distance-driven phase, pinned stance foot) for any body that travels; the engine's `runCycle`/`walkCycle` slide on the ground (measured 0.7-11 px/frame vs 0.02 for `groundedRun`).
- Positions are pure functions of the frame: no timers, no random per-frame motion; render must be repeatable.
- Zombies shamble with a short stride, forward lean and hands out; speed is limited by `WORLD_RULES.md` (see the conflict note there about the current test).
- Output: 1920x1080, 30 fps (all compositions in `demo-project/src/Root.tsx`).
- Violence stays off-body: threat by silhouettes, doors, bars, shadows and sound.

## 8. Visual continuity checklist
Same survivor design and backpack in every shot; the wound or injury per ledger is visible; the time of day matches the ledger; the same location uses the same component and ground line; no hat on any zombie; the stranger never appears before Episode 6.
