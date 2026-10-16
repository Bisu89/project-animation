# Checkpoint time log

No existing time-logging mechanism was found in the repository (checked `scripts/` for a logger —
none exists; `HANDOFF.md` is a state summary, not a timestamped log). Per the brief's instruction not
to build a new analytics system just to measure development time, this is a plain Markdown log,
phase start/end timestamps where they could be captured directly (via the shell's `date` command),
and an honest note where they could not.

| Phase | Start | End | Notes |
|---|---|---|---|
| Checkpoint 1 audit, part 1 (source/docs read) | Not captured at the start of the task (no timer was started before work began) | 2026-10-16 03:45:57 UTC (captured via `date -u`, mid-audit, immediately before writing the first draft of the output docs) | Single continuous session: repo tree listing → read `HANDOFF.md` → read all engine source files (`crowd.tsx`, `horse.tsx`, `weather.tsx`, `fx.tsx`, `common.tsx`, `stick.tsx`, `cast.tsx`, `moves.ts`, `props.tsx`) → read existing Agincourt docs/scene code → read `package.json`/`LICENSE`/`tsconfig.json`/`Root.tsx` → ran `git log`, `ls demo-project/out`, three `--help` checks → `WebFetch` on Remotion's license → two `WebSearch` queries on Agincourt numbers → wrote the first draft of the four output docs. |
| Checkpoint 1 audit, part 2 (render/frame verification) | Immediately after part 1, same session | Completed same session (no separate timestamp captured for this part specifically — see note below) | User feedback asked for real render/frame evidence, not just source reading, for the crowd/horse/arrow claims. Extracted real decoded frames with `ffmpeg -vf select` from `agincourt-scene1.mp4` (3 frames) and `horse-demo.mp4` (4 frames covering `HorseGallop`/`HorseClash`, plus 2 more from the `ArrowRain` range), and opened `public/agincourt/mid.png` directly. Viewing these frames confirmed the crowd/parallax/transparency claims and the arrow-arc/arrowhead-orientation claim, and surfaced one real gap source-reading had missed: the `ArrowRain` archers hold no `Bow` prop (none exists in `props.tsx`). Updated `repository-audit.md` and `production-roadmap.md` with these confirmed findings and a repeatable render-verification method for Checkpoint 2. |

| Checkpoint 2 (implement all 6 scenes, render, contact sheet, fix bugs) | 2026-10-16, same day as Checkpoint 1 (no separate start timestamp captured) | 2026-10-16 (completed same session) | Added `Bow` to `props.tsx` + synced via `setup_project.py --update-engine`; wrote the full 6-scene narration (`agincourt-script.md`) and regenerated the timeline (`parse_input.py`); built `S02Map.tsx`...`S06Aftermath.tsx`; regenerated `music.mp3` for the new 70s length (`gen_audio.py`); wired all 6 scenes into `Video.tsx` with `cueStart()`-based timing; `tsc --noEmit` clean; rendered `out/agincourt-full.mp4` (2100 frames); extracted and viewed real frames per scene (not just file existence), which found and led to fixing 3 visible bugs (bad `Bow` rotation, overlapping convergent walkers, a lesson line hidden behind the caption pill — see `production-roadmap.md`'s scene table for details); re-rendered after each fix; generated a real contact sheet (`node stickman-sheet.mjs Agincourt out/agincourt-full-sheet.png ...`, 11 frames across all 6 scenes) and ran `check_render.py` (duration Δ 0.02s, 0 clipped samples). |

## How to log Checkpoint 2

Capture a timestamp (`date -u +"%Y-%m-%d %H:%M:%S UTC"` in Bash, or the equivalent in PowerShell) at
the start and end of each numbered step in `production-roadmap.md`'s "Implementation sequence," and
append a row to the table above per step — e.g.:

| Phase | Start | End | Notes |
|---|---|---|---|
| Step 1: full narration written | | | |
| Step 2: timeline regenerated | | | |
| Step 3: scene 2 (map) built | | | |
| Step 4: scene 3 (arrow volley) built | | | |
| Step 5: contact sheet + tsc check (scenes 2–3) | | | |
| Step 6: scene 4 (mud/congestion) built | | | |
| Step 7: scene 5 (close combat) built | | | |
| Step 8: scene 6 (aftermath) built | | | |
| Step 9: full render + check_render.py | | | |
| Step 10: voiceover re-time (if recorded) | | | |

This is intentionally just a table in a file, not a script or dashboard — consistent with the brief's
instruction to use the smallest mechanism that works.
