# PRODUCTION WORKFLOW — 100 Days: Zombie Survival

> **FORMAT UPDATE (owner decision, 2026-10-16):** the series is now made mainly from **AI pictures with smooth zoom/pan, narration, subtitles and light motion**
> (rain, wind, dust, flicker), not full stickman animation. Wherever this document says "animation", "L0-L3" or "grounded gait", read it as
> **"picture plan + camera move + light fx"**. Pipeline: `PRODUCTION_WORKFLOW.md` section 2b. The vector animation code stays as an optional library.


Everything here is taken from the repository as it actually behaves (`SKILL.md`, `demo-project/package.json`, `scripts/*.py`, `HANDOFF.md`) and from the two prototypes
built so far. Legend: **[VERIFIED]** I ran or read it; **[PROPOSAL]** a suggested convention.

## 0. Facts about the repository [VERIFIED]
- The only Remotion project is `demo-project/` (Remotion 4.0.535, React 19, TypeScript). Output: 1920x1080, 30 fps (compositions in `src/Root.tsx`).
- The engine's source of truth is `assets/engine/`; the project copy is `demo-project/src/stickman/`. After editing the engine run
  `python scripts/setup_project.py --dir demo-project --update-engine --no-install`.
- A video = folder `demo-project/src/<slug>/` (`Video.tsx`, `timeline.ts/json`, `cues.ts`, `sfx.ts`, scene files) + `demo-project/public/<slug>/` (music, sfx, voice) + a composition registered in `src/Root.tsx`. `scripts/new_video.py` does the folder and the registration.
- No test suite or linter: validation is `npx tsc --noEmit`, a contact sheet, a render, and `check_render.py`.
- Videos, music and sfx (`*.mp4 *.wav *.mp3`) are git-ignored. Do not push videos (owner preference).
- Python is 3.9 (`python`, not `python3`). Prefer the Write tool for helper scripts instead of long shell heredocs.

## 1. Folder conventions [PROPOSAL following existing patterns]
- Series documents: `docs/series/100-days-zombie-survival/` (this folder).
- Episode narration and scene tables: `content/<slug>/script.md` and `content/<slug>/scenes.csv` (same format as `content/why-igloos/`).
- Slug pattern: `zs-ep01` ... `zs-ep07`; composition id = PascalCase of the slug (`ZsEp01`). Reusable code shared across episodes (survivor, zombies, locations, gait) goes in a shared folder (for example `src/zs-shared/`) once a second episode needs it; today it lives in `src/survival-test/` (`gait.ts`, `Figures.tsx`, `World.tsx`).

## 2b. Picture pipeline (current, verified on Episode 1)
1. `content/<slug>/script.md` (paragraphs). 2. `python scripts/gen_voice.py --script content/<slug>/script.md --out demo-project/public/<slug> --timeline-out demo-project/src/<slug> --rate=-4% --para-pause 0.9`.
3. Write `content/<slug>/prompts.txt` (one line per picture: `fx | description`; the number of lines = number of scenes printed by step 4) and keep the shared style in `content/zs-style.txt`.
4. `python scripts/build_scenes.py --slug <slug> --target 9` -> `content/<slug>/scenes.csv` (prompts for the AI image tool) + `src/<slug>/scenes.ts`.
5. `python scripts/make_placeholders.py --slug <slug>`; the owner generates pictures and saves them as `demo-project/public/<slug>/images/sceneNN.png`.
6. Copy `src/zs-ep01/Video.tsx` + `KenBurns.tsx` into the new episode folder (scaffold with `scripts/new_video.py` first), set `ASSETS`, then `npx remotion render <Id> out/<slug>.mp4`. Subtitles and voice are on by default.
(The older animation steps below remain valid for animated scenes.)

## 2. Steps for one episode (animation version)
1. **Check continuity.** Read the episode's row in `EPISODE_OUTLINE.md` and the previous end-of-day row in `SURVIVAL_STATE.md`; run the checklist at the end of `WORLD_RULES.md`.
2. **Write narration** (first person, ~1,200-1,500 words for 8-10 min): `content/<slug>/script.md`, paragraphs = scenes, `# Title` lines become chapter cards. No new facts that are not in these docs.
3. **Scaffold:** `python scripts/new_video.py --project demo-project --slug zs-ep01 --seconds <n>` (creates `src/zs-ep01/`, `public/zs-ep01/`, registers `ZsEp01`).
4. **Voice and timeline** [VERIFIED for the voice script, tested on a 4-sentence sample]:
   `python scripts/gen_voice.py --script content/zs-ep01/script.md --out demo-project/public/zs-ep01 --timeline-out demo-project/src/zs-ep01`
   writes `voice.wav`, `voice.srt` and `timeline.ts/json` from the real audio timings (needs `edge-tts>=7.3.1` and ffmpeg; the free service needs network). Re-running re-synthesises only changed sentences. Alternative without voice: `python scripts/parse_input.py --script ... --out demo-project/src/zs-ep01 --wps 2.6`.
5. **Scene plan:** list scenes with the cue range, location, level (L0-L3), characters, props, camera beats and sfx (see `VISUAL_STYLE_GUIDE.md`). Start scenes from the timeline: `from: cueStart(i)` in `Video.tsx`; use `beat()` for anything tied to a word.
6. **Build scenes** as `src/zs-ep01/Sxx<Name>.tsx` reusing the shared components. Put timing constants and camera keys at the top of the scene file (as in `survival-test/S01Chase.tsx`) so the beats can be read and tuned.
7. **Type-check:** `cd demo-project && npx tsc --noEmit` (fails on unused imports and variables).
8. **Contact sheet before any render:** `node stickman-sheet.mjs <CompId> out/<name>.png <frames...>` and look at the image (entrances, scale, overlaps, clipping, captions). Frames are separate arguments.
9. **Audio:** `python scripts/gen_audio.py --out demo-project/public/<slug> --plan "tense:<s>,..."` (music plan seconds must add up to the video length; add `--no-sfx` to leave existing sfx).
10. **Render:** `cd demo-project && npx remotion render <CompId> out/<name>.mp4` (long renders: run in the background). With voice: add `--props='{"voice":"voice.wav"}'`.
11. **Inspect real frames** around every story beat (not just first and last): `ffmpeg -i out/<name>.mp4 -vf "select='eq(n,N)+eq(n,M)'" -vsync 0 out/f_%02d.png`, then view them.
12. **Validate:** `python scripts/check_render.py out/<name>.mp4 --timeline src/<slug>/timeline.json` (duration vs timeline, audio peak/clipping) and `ffprobe` for width/height/fps/frames (expect 1920x1080, 30 fps).
13. **Update `SURVIVAL_STATE.md`** with the produced values (change the row from provisional to produced) and `HANDOFF.md` with what changed.
14. **Commit and push** source only (the repo has the remote `project-animation`; the owner asked for push after finished work, never videos).

## 3. Animation checks for chase/action scenes [VERIFIED method]
- Foot sliding: use `groundedRun`; measure stance-foot slide with the real `solve()` (compile `gait.ts` + `stick.tsx` with `tsc` and run a small node script; see `docs/survival-test.md` for the result: 0.02-0.03 px/frame).
- Teleporting: the largest frame-to-frame hip jump must be about the travel speed plus bounce (8-9 px at speed 8.2). Scale steps per frame below about 0.01.
- Entrances/doors: record the world-space boundary (for example door line x = 2740, floor y = 884) and check that the body and backpack are fully inside before a barrier closes.
- Camera: check frames at the start, middle, approach and final beat after every camera change.

## 4. What already exists
| Item | State |
|---|---|
| `SurvivalTest` (12 s, mall chase) and `ZombieWalk` (10 s) | **Technical tests only**, not episodes. Render with `npx remotion render SurvivalTest out/survival-test.mp4`. The chase shows zombies at near-sprint speed, which conflicts with `WORLD_RULES.md` (see that file). |
| Reusable pieces | `gait.ts` (run/walk gait), `Figures.tsx` (survivor preset, backpack, zombies, distant runners), `World.tsx` (street, mall front, grille). |
| Voice | `scripts/gen_voice.py` (edge-tts). |
| Episode 1 animatic (first 30-60 s) | not built; recommended next step. |
Nothing in this folder means any episode of the series has been produced.

## 5. Known workflow quirks [VERIFIED, from HANDOFF.md]
- `faster-whisper` crashes on this machine: do not use `align_voice.py`; `gen_voice.py` gives exact timings instead.
- `npx remotion still` renders transparent PNG layers for static crowds (Agincourt pipeline).
- The auto-mode classifier may block `git push`; if blocked, stop and ask the owner.
- Remotion licence: free for individuals and for-profit organisations up to 3 employees; check before commercial scale (https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
