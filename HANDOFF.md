# HANDOFF: where the work stands (read this first after a session clear)

Last updated: 2026-10-16. Repo: `C:\Users\hoavx\Desktop\stickman-video`. Everything up to the survival work is committed and pushed
(see section 0). The older sections below (1-8) describe the earlier sessions and are still accurate unless section 0 says otherwise.

**Rule (2026-10-29): after every finished render, delete the intermediate files (test stills, contact sheets, frame dumps, draft mp4s); details in `CLAUDE.md`.**

## ELISE WILD tập 01 — tình trạng cuối ngày 2026-11-03 (đọc phần này trước nếu làm tiếp Elise Wild)

Tập dài 16:9 "Page 1: The Waterfall Pool", làm hoàn toàn bằng video AI (ảnh GPT → clip Muse, ghép ffmpeg), quy trình trong
`docs/muse-video-pipeline.md` (đọc mục "Bài học Elise Wild"). Kịch bản: `content/elise-wild/ep01-waterfall-pool/KICH-BAN.md`
(chủ dự án đã duyệt toàn bộ mô tả mới ngày 2026-11-03: không có người bạn, không có lều bạt, mái dột thì hứng bằng cốc
của bà, nhóm lửa bằng bật lửa, củi nhặt đời thường). Mỗi phân đoạn một thư mục, ảnh/clip không commit (CSV thì có).

| Phân đoạn | Thư mục | Tình trạng |
|---|---|---|
| Mở đầu + 1 + 2 (0:00–2:06) | `test-p1/` | XONG, `video/final.mp4` 2:08 (clip bếp đã thay bằng `anh-ba.mp4`) |
| 3 Lều chữ A | `p3-leu/` | XONG, 17 clip, `final.mp4` 2:23 (đã bỏ C33 lều bạt) |
| 4 Nước | `p4-nuoc/` | XONG, 24 s (thứ tự: lọc qua khăn → đậy nắp → nồi/xô cạnh bếp) |
| 5 Lửa | `p5-lua/` | XONG, 58 s (C37 dùng ảnh `ew1-501b-...`, không ba lô) |
| 6 Trà và bữa tối (C47–C58) | `p6-bua-toi/` | 12/12 ảnh đạt; **Muse đang gen lúc kết thúc phiên**. Mai: xem `video/`, nếu thiếu clip hoặc chưa có `final.mp4` thì chạy lại `python muse_auto.py auto --dir "<...>/p6-bua-toi"` (tool bỏ qua clip đã có), rồi xem contact sheet |
| 7 Mưa (C59–C65), 8 Trang 1968 (C66–C71), 9 Thư (C72–C77), 10 Sáng (C78–C82) | chưa có | Nội dung đã duyệt trong KICH-BAN.md. Làm như p6: viết CSV (`gen-anh.csv` cột `stt,ten_file,ty_le,gui_kem,prompt`; `gen-video.csv` cột `stt,doan,luu_tai,khung_dau,khung_cuoi,anh_tham_chieu,prompt,am_thanh,dung_giay,che_do,cat_tu,cat_den`), xem CSV của `p6-bua-toi/` làm mẫu |

Cách làm đã chốt với chủ dự án:
- Duyệt nội dung phân đoạn trước. Gen ảnh, **tự xem từng ảnh**; ảnh nào đạt thì gửi Muse luôn (`run --csv ... --only <stt>`),
  không chờ đủ bộ. Ảnh tham chiếu chung (Elise `ew1-A-elise-wild.png`, lều `ew1-317-leu-xong.png`, bếp...) chép từ thư mục
  phân đoạn trước sang `anh/` của phân đoạn mới.
- Ảnh đã gửi Muse mà gen lại thì **đổi tên file**. Mọi prompt có Elise ghi rõ trang phục, "no backpack", "bare arms"; ghi giờ
  và mây (tối dần, mưa 18:30, dột 20:00, đêm, sáng sương).
- Clip lỗi đuôi thì cắt (`dung_giay`, `cat_tu`, `cat_den`) rồi `python ghep.py --csv ...`, không tốn lượt gen.
- **Không lồng giọng tạm**; lời dẫn (giọng Elise + giọng bà) và chữ đè làm một lần khi có key ElevenLabs. Ghi chú: lúc lồng
  tiếng, câu *"Water before any fire..."* đọc ở đầu phân đoạn 4.
- Muse: tài khoản mới (trợ lý tên "Marley") trong `muse-auto/chrome-profile` cổng 9334, side chat trong
  `content/elise-wild/muse-chat.json`. Elise DIY/Talent dùng `chrome-profile-2` cổng 9335 (phiên khác), **không đụng vào DIY**.
  Mỗi series chỉ một lượt Muse một lúc. Không xóa thư mục `chrome-profile*`.
- Lỗi nhỏ đã chấp nhận: C18 Elise lùi hơi xa, C24 áo hơi ngả xám khi cận, C37 không ngoái nhìn lều, C41 chỉ giữ 2,8 s.
- Còn dọn khi chốt: `test-p1/video/final-longtieng.mp4` (bản lồng giọng tạm), các `*.lan1.mp4` và `video/qa/` của p6.
- Bước cuối (sau phân đoạn 10): ghép các `final.mp4` theo thứ tự + giọng ElevenLabs + chữ đè + nhãn AI.

## 0. LATEST STATE (2026-10-16) — read this section first

### Git / remotes
- `origin` = `nispa/stickman-video` (original skill repo, do not push there). `project-animation` = `https://github.com/Bisu89/project-animation.git`
  (the user's repo; `main` tracks it, plain `git push` goes there). Videos are NOT pushed (`*.mp4/*.wav/*.mp3` are git-ignored; do not force-add them, the user said no).
  `content/samurai-analysis/` (frames from someone else's video) is deliberately not committed.
- A fresh clone has no music/sfx: run `python scripts/gen_audio.py --out demo-project/public/<slug> --plan "tense:12"`.
- Environment: Windows, Git Bash. Network now works (edge-tts, WebFetch). Use the **Write tool for python/js helper files** instead of long bash heredocs
  (a heredoc with backticks/quotes broke the shell twice). `npx tsc --noEmit` before every render; `noUnusedLocals` is on.
- The auto-mode classifier blocked `git push` once; a later push worked after the user asked again. If blocked, stop and tell the user.

### What exists (all under `demo-project/`, composition id -> folder -> render)
| Composition | Folder | What |
|---|---|---|
| `Agincourt` | `src/agincourt/` | 6-scene, 70 s pilot (S01-S06), shared `Field.tsx` backdrop, `Roles.tsx` (archer/men-at-arms/commanders), static crowd PNGs `public/agincourt/far.png, mid.png` (re-render with `npx remotion still AgincourtFar ...`). Docs in `docs/history-pipeline/` (audit, roadmap, historical notes with sourced numbers, `visual-pass-report.md`). |
| `SurvivalTest` | `src/survival-test/` | 12 s chase: survivor runs to a mall, rolling grille closes behind him, zombies bang on it. Reusable files: `gait.ts` (ground-locked run: phase from distance + two-bone IK, measured ~0.02 px/frame foot slide), `Figures.tsx` (SURVIVOR preset, `Backpack`, `Pursuer`, `Zombie`, `ZombieDress`, `ZombieJacket`, `DistantRunner`), `World.tsx` (sky, parallax skylines, street, `MallFront`, see-through `Shutter` grille), `S01Chase.tsx` (timeline: beats and camera keys are all in this file's header comment). |
| `ZombieWalk` | `src/zombie-walk/` | 10 s test of 7 shambling zombies (`Zombie` component). |
Render: `cd demo-project && npx remotion render <Id> out/<name>.mp4`; sheet: `node stickman-sheet.mjs <Id> out/x.png <frames...>`; check: `python ../scripts/check_render.py out/x.mp4`.
Previous renders kept locally for comparison (not in git): `out/survival-test-v1.mp4`, `-v2.mp4`.

### Engine additions this session (assets/engine/, synced to `src/stickman/` with `python scripts/setup_project.py --dir demo-project --update-engine --no-install`)
`BigHead` hair `kettle`/`bascinet`, `crest`, `eyes:"dot"`, emotion `stern`; `Preset.head` (size multiplier), `eyes`, `crest`; `ArrowVolley` one-shot (`at`, `stagger`);
`Bow` (`pull`). All additive: CastDemo/HorseDemo/BigheadDemo re-rendered pixel-identical. Documented in `references/engine-api.md`.

### Voice
`scripts/gen_voice.py` (edge-tts, cloned from AI-Marketing-Factory `backend/app/modules/voice/providers.py`): one request per sentence, spliced with real gaps,
trimmed to the last word, retries, per-sentence cache. `python scripts/gen_voice.py --script s.md --out demo-project/public/<slug> --timeline-out demo-project/src/<slug>`
writes `voice.wav`, `voice.srt` and the timeline (real timings, no whisper needed); render with `--props='{"voice":"voice.wav"}'`. Needs `edge-tts>=7.3.1`
(7.2.8 gave HTTP 403; installed 7.3.1 in the user Python; not yet in `requirements.txt`). SAPI/local TTS was not cloned (pywin32 deadlock issues).

### Decisions / preferences
- The user chats in Vietnamese: reply in Vietnamese, keep video text English for the survival series. Auto mode: act, but they interrupt when a big compound command is wrong; prefer small steps.
- Zombies: the user wants the look of the classic cartoon zombie reference image (big head, bulging eyes, open mouth, brown jacket, tie, jeans, shoes, hunched, arms out) **without the hat variants**.
  It is our own vector drawing (no PNG). We stop short of copying the game's characters exactly (copyright for a YouTube channel); say so if asked to go closer. Not done yet: crawler zombie, missing-arm variant, soft shading.
- Style rules for the history/survival series: serious tone, small heads (`head: 0.8`), dot eyes, no comic fonts/bursts, restrained cuts (dip to black).

### Series documentation (new, 2026-10-16): `docs/series/100-days-zombie-survival/`
SERIES_BIBLE, CHARACTER_BIBLE, WORLD_RULES, SURVIVAL_STATE (numbers are PROPOSALS), EPISODE_OUTLINE (Ep 1-7, outlines only), VISUAL_STYLE_GUIDE, PRODUCTION_WORKFLOW.
Everything is tagged [CONFIRMED]/[PROPOSAL]; read WORLD_RULES + SURVIVAL_STATE before writing any script. **Known conflict:** the SurvivalTest zombies keep pace with a sprinting human, which
strains the confirmed rule "no superhuman speed" (WORLD_RULES section 1): slow the zombies in animation before using that clip as canon.

### Episode work (2026-10-16)
- Beat sheets: `docs/series/100-days-zombie-survival/episodes/`. Draft narration (awaiting owner approval): `content/zs-ep01..05/script.md` (Ep1 1483 words ~9 min; Ep2-5 only 850-1025 words, below the 8-10 min target).
- **Ep1 voice DONE**: `demo-project/public/zs-ep01/voice.wav` + `src/zs-ep01/timeline.ts` (558.8 s, 197 cues, en-US-GuyNeural, rate -4%). `voice.wav` is git-ignored: regenerate with `python scripts/gen_voice.py --script content/zs-ep01/script.md --out demo-project/public/zs-ep01 --timeline-out demo-project/src/zs-ep01 --rate=-4% --para-pause 0.9` (use `--rate=-4%` with an equals sign).
- **Ep1 scene 1 animatic BUILT** (`src/zs-ep01/S01ClockStarts.tsx`, cues 0-28, ~85 s): phone alert + 24:00:00 countdown, window view of the street, packing, leaving. Rendered first 60 s: `out/zs-ep01-animatic.mp4` (1920x1080, 30 fps, no voice mixed yet; render with `--props='{"voice":"voice.wav"}'`). Scenes 2-8 not built (`Video.tsx` has only S01).
  Known issues: window street is small and dark; the survivor stands stiffly (no walk/turn), packing shows no hands; zombies at the window drift at 1.15 px/frame (fine); music is a placeholder `mystery:90`.

### RULE (owner, 2026-10-16): WRITE THE STORY FIRST, THE OWNER APPROVES IT, ONLY THEN MAKE VIDEO. No voice/scenes/prompts/renders for an episode before its script is approved.
Ep1 script was rewritten (Day 1 naive: no rules; rules are earned: rule 1 end Ep1, rule 2 Ep2, rule 3 Ep3). Ep1 voice/timeline in demo-project came from the rewrite but `scenes.csv/scenes.ts/prompts.txt` still match the OLD grouping: regenerate only after approval. Vietnamese versions: `docs/series/100-days-zombie-survival/TOM_TAT_TIENG_VIET.md`, `content/zs-ep01/script.vi.md`.

### NEW FORMAT for the survival series (owner decision, 2026-10-16)
Mainly **pictures with smooth zoom/pan + narration + subtitles + light animation (rain/wind/dust/flicker)**, not full stickman animation. The vector scenes in `survival-test`/`zombie-walk` are kept as a library.
Pipeline (Ep1 done end to end with placeholder pictures): `gen_voice.py` (voice+timeline) -> `scripts/build_scenes.py --slug zs-ep01 --target 9` (groups narration into 47 image scenes, writes `content/zs-ep01/scenes.csv` with one AI prompt per scene and `src/zs-ep01/scenes.ts`; prompts come from `content/zs-ep01/prompts.txt` + `content/zs-style.txt`) -> `scripts/make_placeholders.py --slug zs-ep01` (placeholders; never overwrites) -> the owner generates real pictures with the prompts in scenes.csv and drops them in `demo-project/public/zs-ep01/images/sceneNN.png` -> render `npx remotion render ZsEp01 out/zs-ep01.mp4` (defaults: voice.wav + captions on; `KenBurns.tsx` does the motion; `Video.tsx` starts each picture on its narration cue).
Rendered check: `out/zs-ep01-60s.mp4` (first 60 s, voice + subtitles, placeholders). Owner feedback: the old scene-1 phone alert was far too long/confusing -> now only picture 1 shows the phone.
The old vector animatic scene (`S01ClockStarts.tsx`) was deleted (see git history).

### Open items / next steps
1. **Survival series**: the user's approved English narration (8 scenes: Clock Starts, First Mistake, Trap, Three Rules, Wrong House, Last Hour, First Night, Day Two) has NOT been provided yet. Next: get it, run `gen_voice.py`, then animatic of scenes 1-2. Priority animation scenes: street panic, mall run, stairwell (backpack caught on railing), house door handle + window shadow, night flashlight/door shake, dawn walk to bridge. Gaps in the engine: door with open/close state, flashlight beam, stairs/railing, smooth turn-around (facing flips instantly), footstep sfx.
2. SurvivalTest leftovers: survivor's face is pale under the bars, first two zombies overlap at the grille, survivor never turns to look at them.
3. Agincourt leftovers: no voiceover; scene 5 duels read as one cluster; bow strings cross archers' faces.
4. Add `edge-tts>=7.3.1` to `requirements.txt`; maybe add `renders/` to `.gitignore`.
5. Remotion license (verified 2026-10-16 from github.com/remotion-dev/remotion LICENSE.md): free for individuals and for-profit orgs up to 3 employees; larger companies need a paid license. Re-check before commercial use.


## 1. What this repo is
A Claude Code skill (`SKILL.md`, `README.md`) that makes animated explainer videos with Remotion: stick-figure engine
(`assets/engine/`, copied into projects as `src/stickman/`), scripts (`scripts/*.py`), docs (`references/engine-api.md` is the
one-page engine API, **keep it in sync when adding engine features**). The user chats in Vietnamese (reply in Vietnamese,
keep generated video text in the video's own language). Auto mode: act, don't over-ask.

## 2. Environment quirks (Windows 11, Git Bash + PowerShell)
- Node 20, ffmpeg present, Python 3.9 (`python`, not `python3`). `pip install -r requirements.txt` already done.
- **No outbound network** from the tools (WinError 10013): can't fetch YouTube captions or download models.
- **faster-whisper crashes** (access violation) when loading any model -> local transcription is unavailable. openai-whisper not installed.
  If the user wants transcripts: ask them to paste text, or fix VC++ redistributable / reinstall ctranslate2, then retry `scripts/transcribe_voice.py`.
- The auto-mode classifier blocked repeated "retry with other flags" attempts; don't loop on blocked commands.
- Contact sheets: `node stickman-sheet.mjs <CompId> out/x.png 60 120 200-300:20` (frames are separate args, NOT comma-joined).
  Always `npx tsc --noEmit` first (tsconfig has `noUnusedLocals`; no `flatMap`, lib is es2015).
- Renders run in the background (`npx remotion render <Id> out/<x>.mp4`); `scripts/check_render.py` needs `--timeline` (videos without narration have no timeline.json, use ffprobe instead).
- Sync engine edits into the test project after every change: `python scripts/setup_project.py --dir demo-project --update-engine --no-install`.
- `.gitignore` excludes mp4/mp3/wav/out/sheet*.png (so rendered demos are local only).

## 3. Engine as it stands (`assets/engine/`, documented in `references/engine-api.md`)
| File | What |
|---|---|
| `stick.tsx` | `Actor/Figure` poseable stick body (+ new `headless` prop, `headAngle(j)` export) |
| `fx.tsx`, `common.tsx`, `props.tsx` | original text/impact/camera/stage/props; props.tsx now also has `Sword`, `Lance` |
| `crowd.tsx` | `Soldier`, `Formation`, `Stakes`: cheap stick armies meant for STATIC layers (render a composition to PNG once with `npx remotion still`) |
| `weather.tsx` | `Snowfall, Fire, Wind, Rain, FallingLeaves, Water, Sparks, ArrowVolley` (arrows lobbed along an arc `from` -> `to`) (continuous, seeded, wrap-around; `area` limits spawn region) |
| `bighead.tsx` | `BigHead` big expressive head: hair `bun short ponytail long bald none spiky afro kabuto helmet`, shape `round oval square`, emotions `neutral angry sad happy shock worried cry smug`, `talkCycle(f)` |
| `outfit.tsx` | `Outfit type="samurai"/"soldier"` torso garment, used via Actor's `behind` prop |
| `cast.tsx` | `PRESETS` (13: hero samurai ronin monk soldier officer villain grandma kid punk hippie lady athlete) + `<Hero>` (head+black body+outfit+moves; props `who x ground scale facing emotion talking moves stance mod held label seed`) |
| `moves.ts` | named actions `walkTo bow jump fall punch wave pose turn` + `compose` |
| `horse.tsx` | **NEW, prototype**: `<Horse>` side-view horse, gallop cycle, rear, caparison, saddle callback `(sd: Saddle)`; `rideGround(sd, heroScale)`, `GALLOP`. Props `f x ground scale facing speed amp rear coat mane cloth trim` |
| `spiderman.tsx` | **NEW, prototype**: `<SpiderHead>` masked-hero head (red + black web lines, lens eyes reacting to `emotion`) — drop-in alt to BigHead, no skin/hair/talk. Wired as `cast.tsx` preset `spiderman` (`Preset.mask: "spiderman"`). Body is still plain stick (no suit yet). |

Style decisions the user confirmed/asked for: **stick body black (`COL.ink`)** with BigHead; identify characters by head/outfit not limb colour;
use `walkCycle` whenever the body moves (sliding legs were called out as a bug); head paints over body so avoid hands-near-head poses with BigHead.
Fire (flat vector) clashes with painterly AI photos: use it only on flat scenes. Snow/Wind/Rain blend fine on photos.

## 4. Demo videos (all in `demo-project/`, composition id -> folder `src/<slug>/`, output `out/<slug>.mp4`)
| Composition | What | Notes |
|---|---|---|
| `CompoundInterest` | first stickman demo (VN, bank/coins) | uses original engine |
| `WhyIgloos` | 2:19 explainer "Why Did Some Inuit Hunters Build Shelters Out of Snow?" | 6 user-made AI photos (`public/why-igloos/images/sceneN.png`, N=1,2,3,6,8,9) with Ken Burns + snow/blizzard + 3 code diagrams (`D1HeatLoss D2TrappedAir D3Conductivity`) + burned-in captions + synthesized music. No voiceover yet: when recorded, run `scripts/align_voice.py` (needs a working whisper, see quirks) or give an SRT |
| `BigheadTest` | contact-sheet test of 3 BigHead characters | kept as usage example |
| `BigheadDemo` | 12.7s samurai vs soldier dialogue with snow, walk cycle, handshake | rendered BEFORE the hair-cap fix (hair looks like a band in that mp4) |
| `CastDemo` | 34s: 13 presets, 8 emotions, named moves, rain/leaves/water/fire+sparks, + new `CastSpiderman` scene | current state of cast/moves/weather; contact sheet `out/spiderman-sheet.png` confirms the mask reads well at a glance |
| `Agincourt` | **scene 1 of 6 built (10.9s)**: parallax PNG armies + 2 live commanders + captions + music. Stills compositions `AgincourtFar`/`AgincourtMid` (re-render PNGs after editing `src/agincourt/Stills.tsx`). Out: `out/agincourt-scene1.mp4` | docs in `docs/agincourt-*.md` |
| `HorseDemo` | 14s: rider galloping, two riders charging/meeting/rearing + burst, archers loosing an `ArrowVolley` | horse prototype (saddle moved behind the withers, rider scale 1.05) |
| `SpidermanDemo` | 8.6s: SpiderHead swinging on two web anchors between hand-placed rooftops, title card | first custom-flight-path test (not Hero/moves); `out/spiderman-webswing.mp4` |

Content folders: `content/why-igloos/` (script.md, scenes.csv for image gen, voiceover.srt, timeline.*, user's 1/2/3/6/8/9.png),
`content/samurai-analysis/` (frames/audio extracted from the user's downloaded reference video, no transcript).

## 5. Reference-video analysis (done)
Channel "Bernard Animation" ("Why It Sucks to Be a Samurai in Sengoku Japan"): detailed painted backgrounds, big detailed head on a thin
noodle-like black body, mostly STATIC illustrated panels with cuts (no pan/zoom), a separate flat "host" character for bumpers.
Our take: static AI images + a few animated stick scenes + code diagrams.

## 6. Agincourt 1415 video ("How the Smaller Army Won") — Checkpoint 2 pilot DONE (2026-10-16)

All 6 scenes now exist and render as one video: `demo-project/out/agincourt-full.mp4` (70.0s, 2100
frames @30fps, 23MB), contact sheet `demo-project/out/agincourt-full-sheet.png`. Full audit trail in
`docs/history-pipeline/` (`repository-audit.md`, `production-roadmap.md` has the per-scene build notes
and the 3 visible bugs found+fixed by viewing real frames, `agincourt-historical-notes.md`,
`checkpoint-log.md`). Scene files: `demo-project/src/agincourt/S01Armies.tsx`...`S06Aftermath.tsx`.
New engine piece: `Bow` prop in `props.tsx` (archers had no bow until a rendered-frame check caught it).
Full narration: `demo-project/agincourt-script.md` (regenerated the timeline via `parse_input.py`);
music regenerated for 70s via `gen_audio.py --plan "intro:10.43,mystery:14.17,tense:8.33,tense:9.67,
tense:11.53,finale:15.87"`. `check_render.py`: duration Δ0.02s, 0 clipped samples.
Not done yet: a recorded voiceover (still captions-only), narration pacing review by ear, and any
further visual polish pass beyond the 3 bugs already fixed (e.g. scene 5's three duels read as one
cluster rather than separated vignettes — acceptable but not what the original plan described).

### 6.0 History (pre-Checkpoint-2, for context)
User's plan: AI still images for most scenes + 1-2 animated shots of stick riders on horses fighting. Agreed approach and status:
- DONE: horse prototype + rider mount + lance/sword, gallop and clash scenes render (`HorseDemo`). Horses no longer overlap with the spacing in `HorseClash`.
- DONE too: `ArrowVolley` effect (weather.tsx) + `ArrowRain` scene in HorseDemo; saddle moved back, rider bigger.
- Known horse issues / next polish: far rider leg is drawn over the horse; gallop leg cycle is stylised (same offsets for all gaits, no walk pattern);
  `fall` pose floats because the big head keeps hips raised; tail/neck shapes are first-pass.
- TODO (suggested order): (1) polish horse (rider size/position, optional far-leg hiding, hoof dust via `Sparks`-like puffs); (2) ~~ArrowVolley~~ done (documented);
  (3) write the script (use ranges for troop numbers, they are disputed; mention mud/rain, narrow front, longbows) with the same table format as `content/why-igloos/scenes.csv`
  (scene type STORY=AI image / DIAGRAM=code / ACTION=stick+horse; fixed image style; user generates images and drops them in `content/<slug>/`);
  (4) code diagrams (army sizes, narrowing front, mud) + the 1-2 `ACTION` shots; (5) scaffold with `scripts/new_video.py --slug agincourt`, `parse_input.py`, `gen_audio.py`, render, `check_render.py`.
- Layer 3 of the earlier plan = animals; horse is the first. Tiger/leopard/bear would need a quadruped skin system reusing the horse rig (not started).

### 6b. Decisions for Agincourt (user, 2026-10-15) - scene 1 BUILT; scenes 2-6 todo (see docs/agincourt-implementation-plan.md)
- Source brief: the user's long 6-scene prompt (two armies face each other / English position map / longbow volley / mud + congestion / close combat / aftermath + lesson, 60-90s target). Review agreed it needs the changes below.
- ALL scenes are stickman style (no photo-style AI scenes). Any AI image prompts stay simple (flat, no detail).
- Crowds = STATIC image layers (far/mid armies as stills with parallax) + only 1-2 animated "general"-type stickmen on top. No thousands of live Actors.
- First test = only scene 1 (two armies face each other), not the whole video. Open question to confirm: scene 1 is ~10-12s in the brief; user said "1 minute" for the test, so confirm the intended length.
- Open choice: render the crowd stills from code (consistent style, deterministic) vs AI-generated stills (cheaper, style may drift). Recommendation: code-rendered stills for armies, AI/gradient only for sky/terrain.
- Docs wanted by the brief: docs/agincourt-implementation-plan.md, -historical-notes.md, -narration.md (do historical notes before narration; keep numbers as ranges, "fog/early morning" is staging not fact).

### 6c. STRATEGY SHIFT (user, 2026-10-15) - read before continuing Agincourt
The user realised animation is the hardest and least important part. Priority is the STORY: a gripping narration/script, then AI stills
(Ken Burns) + captions + music, with only a few short animated shots (e.g. arrow volley, a cavalry charge, a tactical-map diagram).
So: stop polishing the full-animation Agincourt scene (the code-drawn crowd scene was judged crude). Keep engine pieces as a library.
Next (proposed, confirm with user): (1) write the Agincourt script in the table format of `content/why-igloos/scenes.csv`
(narration, scene type STORY/DIAGRAM/ACTION, simple image prompt, on-screen text, animation overlay); (2) build a data-driven template
"CSV + images folder -> video" (Ken Burns, captions, music, optional per-scene overlays like Rain/ArrowVolley/Sparks) so new videos need no new code.

## 7. Pending/optional ideas mentioned by the user
- Real voiceover for WhyIgloos (re-time with align_voice.py) and a TTS later.
- Possibly commit the engine additions (ask before committing; commit message style is short imperative; attribution line required by the harness).
- README/SKILL.md do not yet mention weather/bighead/outfit/cast/moves/horse (only `references/engine-api.md` does); update them when the horse is stable.

## 8. NEW DIRECTION (user, 2026-10-15): Spider-Man / Kong / Godzilla stickman fight videos
User asked (casually, "thử làm đi" = "let's just try it") for stickman videos like Spider-Man, or stickman vs Kong/Godzilla.
Answered with the real tradeoff: a hero character reuses the existing cast/outfit/moves system (cheap); a giant kaiju needs a
whole new rig (expensive, like the horse prototype was). User picked the cheap path first and said the body can stay a plain
stick for now — just wanted the head.
- DONE: `spiderman.tsx` (`SpiderHead`) + `cast.tsx` `spiderman` preset, see row above. Verified via contact sheet only
  (`out/spiderman-sheet.png` in demo-project, not committed — mp4/png are gitignored).
- DONE: web-swinging test clip, composition `SpidermanDemo` (`demo-project/src/spiderman-demo/`, scene file
  `S01WebSwing.tsx`, ~8.6s, rendered `demo-project/out/spiderman-webswing.mp4`). Built as a **fully custom flight path**,
  not the ground-based `Hero`/`moves` system: `Actor` directly, with `mod` returning a hand-written pendulum arc
  (`pendulum(anchor, angleDeg)`, `angle = SWEEP*sin(π*(k-0.5))` for natural pendulum easing — slow at the ends, fast at
  the bottom) chained between two web anchors, with short ballistic hops (ease + sine hump) for the jump-off, the
  release/re-shoot gap between swings, and the landing. Added `WebLine` and `Skyline` to `props.tsx` (engine) for this —
  reusable for any future city/rope scene.
  - Gotcha hit and fixed: the web-holding arm (`ra1`) must be set to the **absolute** screen direction toward the anchor
    (`angle + 180 + lean`, in stick.tsx's 0=down/180=up convention — `ref + ra1` is what's absolute, and `ref = -lean`),
    not a fixed torso-relative angle — a fixed `ra1` looks plausible at a glance but visibly stops tracking the anchor
    once the body swings past vertical.
  - Gotcha hit and fixed: `pos.y` from the flight function is the **hip**, not the feet — ledges/landing points must go
    through `groundY(scale, roofY)` (same helper `Hero` uses) or the character sinks into the rooftop.
  - For a scene where the action must land on a specific spot, hand-place that building (see `NEAR`/`Building` in the
    scene file) rather than relying on `Skyline`'s random layout to line up with it; keep `Skyline` itself for pure
    backdrop layers only.
- NOT done / next if the user wants to continue this thread: a red/blue suit (new Outfit type, like samurai/soldier —
  currently body is plain stick), more buildings/longer route, picking an actual video concept/script (not just an
  engine test), and — only if they still want it after seeing the cost — a kaiju/giant-monster rig for Kong/Godzilla
  (new file next to horse.tsx, reusing its quadruped-cycle approach but at a very different scale/proportions).
- Nothing committed yet from this addition either (same as the rest of this session's engine work).
