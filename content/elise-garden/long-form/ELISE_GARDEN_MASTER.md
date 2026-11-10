# ELISE GARDEN — MASTER PRODUCTION BRIEF v1.0

> Workflow correction — 2026-11-06 (takes precedence over older tooling instructions):
> Claude owns creative direction, storyboard, keyframe/Muse prompts and continuity.
> The user manually generates video in Muse AI with explicit reference images on every request.
> Codex owns asset/manifest intake, media validation, Remotion editing, narration/audio/music and final rendering.
> No video-generation API, no other video-generation provider, no automated Muse submission.
> Pilot handoff: `episodes/EP01/PILOT_8_SHOTS.md`; expected files: `episodes/EP01/media/muse/SHxxx_nn.mp4`.

> Paste this file into the repository root. Both Claude Code and Codex must read it before working. Language for collaboration: Vietnamese. Audience-facing titles, sparse narration, and on-screen text: English.

## 0. YOUR MISSION
You are building a **repeatable AI-assisted long-form video production system** for **Elise Garden**, not merely generating one screenplay or a collection of disconnected prompts.

Series: **Elise Garden — Growing My Own Food**. Format: 16:9 YouTube long-form, target 10–15 minutes per episode. Style: **Realistic Gardening + Cinematic Cozy Garden**. Sparse, natural English narration; gardening and cooking ASMR; warm but restrained cinematic visuals. The garden and Elise are recurring characters/assets. The garden evolves cumulatively across episodes.

**Episode 01:** *I Turned an Overgrown Backyard Into My First Vegetable Garden*. Target timeline **12:00 / 720 seconds**. In-story time: Day 1 clearing and preparing; Day 2 building, filling, sowing; Day 3 morning inspection. Outcome: exactly **two completed raised beds**, planted with radish, lettuce and pak choi; **no instant harvest**. Ending: Elise checks the soil and looks at her newly established garden. A simple evening meal can use pre-existing/purchased ingredients, not newly planted crops.

## 1. RESPONSIBILITIES AND COLLABORATION
**Claude Code — Creative Director / Story Editor:** series bible, episode beat sheet, audience retention, shot descriptions, shot-to-shot visual continuity, prompts for image and image-to-video, sparse narration, sound design cues, review for plausible horticulture and believable physical actions.

**Codex — Technical Director / Pipeline Engineer:** inspect repository and available tooling before changes; propose architecture, schemas, validators, asset registry, continuity tracking, generation queue/manifests, Remotion timeline, media ingestion, deterministic builds, reports and QA. Implement only after requirements and environment are understood.

**Shared rules:** Both use the SAME canonical data files. Never keep conflicting copies of shot timing, garden state, or character description. Use structured files as source of truth and derive Markdown views from them if practical. Write concise Vietnamese explanations of choices and assumptions. Clearly distinguish completed work from placeholders, mock outputs, and external AI generation not yet run.

## 2. HARD CREATIVE CONSTRAINTS
1. Elise is an adult recurring woman; use the **user's approved reference images** for identity. Never invent a replacement face. If references are unavailable, mark `BLOCKED_REFERENCE` and request them.
2. Lock the cottage, fence, entrance, paths, bed dimensions, camera anchor points and compass orientation. No flipping the garden between shots.
3. Season is **early spring in a temperate English-cottage-inspired fictional setting**. Weather, light, vegetation and planting should match season and scene time.
4. Gardening must be physically plausible. Show weed removal, measuring, cutting, assembling, positioning frames, preparing soil, sowing at seed-packet depth, watering and labeling. No teleporting props, miraculous plant growth or unrealistic harvest.
5. The cinematic quality comes from lighting, composition, natural motion and sound, NOT exaggerated fantasy effects or constant slow motion.
6. Minimize narration (roughly 90–130 English words for EP01). No vague motivational clichés or repetitive dialogue. Most scenes rely on natural sound.
7. The final video must remain engaging: visible progress every 30–60 seconds, varied shot scales, coherent tasks, clear before/after payoff. No filler to hit runtime.
8. Be transparent that AI-generated scenes are a reconstruction; do not represent them as footage of real gardening.
9. Do not generate large numbers of expensive clips or use paid APIs without explicit user approval and a budget estimate.
10. Validate any food preservation/safety instruction rather than inventing safe processing times or shelf-life.

## 3. CANONICAL GARDEN MASTER
Approximate plot: **12 m × 16 m**, cottage to the north/northwest, garden entrance to the south. From the entrance looking toward the cottage: BED-01 on the LEFT, BED-02 on the RIGHT. Six planned bed positions total, but only the first two are built in EP01. Each completed bed is **1.2 m × 2.4 m**. Cottage: cream plaster walls, brown tiled roof, moss-green wooden door. Weathered wooden perimeter fence. Future outdoor kitchen beside cottage, future greenhouse northeast, future climbing trellis on east side; these do **not** yet exist in EP01.

Locked environmental states:
- `S0_BEFORE`: overgrown plot, no beds.
- `S1_CLEARED`: weeds removed and positions marked, no frames.
- `S2_FRAMES`: two wooden frames installed, no added soil.
- `S3_SOIL_READY`: two beds filled/prepared, no seeds planted.
- `S4_PLANTED`: seeds sown, labels present, no visible sprouts.
- `S5_NEXT_MORNING`: same planted beds, next morning lighting, no visible sprouts.

Fixed camera anchors: `CAM_A_ENTRANCE`, `CAM_B_PORCH`, `CAM_C_EAST_FENCE`, `CAM_D_GARDEN_SIDE`. For each, record lens, height, orientation, visible landmarks, and example reference frame. If master images do not yet exist, produce precise prompts and an approval checklist rather than pretending they are locked.

## 4. EP01 STORY STRUCTURE — EXACT 720s
| Sequence | Time | Duration | Content |
|---|---|---:|---|
| SQ01 | 00:00–00:35 | 35s | Cold open: finished two beds; visual promise, title |
| SQ02 | 00:35–01:40 | 65s | Overgrown garden, inspection, measuring |
| SQ03 | 01:40–03:15 | 95s | Clear weeds, roots, stones, debris |
| SQ04 | 03:15–04:45 | 90s | Measure, cut and assemble wooden frames |
| SQ05 | 04:45–06:05 | 80s | Position, level and align the two beds |
| SQ06 | 06:05–07:30 | 85s | Prepare soil and finished compost |
| SQ07 | 07:30–09:00 | 90s | Sow radish, lettuce, pak choi; label beds |
| SQ08 | 09:00–10:05 | 65s | Water gently, tidy, before/after reveal |
| SQ09 | 10:05–11:20 | 75s | Simple evening meal, quiet cottage atmosphere |
| SQ10 | 11:20–12:00 | 40s | Next morning inspection and closing image |

**Critical timing note:** Shot lengths are EDIT TIMELINE durations, not necessarily one AI video generation each. A 12-second shot may use multiple short generated clips, clean still motion, or carefully edited cutaways. No frozen frames stretched to fill time.

## 5. PILOT FIRST: EIGHT SHOTS
Produce a production-ready **pilot package** for these eight IDs before full 80-shot production:
- `SH009`: entrance wide — garden BEFORE (S0)
- `SH018`: Elise removing weeds (S0→S1)
- `SH024`: same camera before/after cleaned area (S1)
- `SH030`: drilling and screwing wood frame (S1)
- `SH040`: two completed frames in garden (S2)
- `SH048`: prepared soil in two beds (S3)
- `SH052`: sowing radish seeds (S3→S4)
- `SH079`: Elise in finished garden next morning (S5)

For each pilot shot deliver: ID, sequence, edit duration, story day/time, state before/after, camera anchor, subject and props, frame composition, image keyframe prompt, image-to-video prompt, negative constraints, audio/Foley, reference dependencies, estimated generation cost, continuity checklist and acceptance criteria. Include a **contact sheet plan** and a **test edit** of pilot clips. Do not claim actual images/videos have been generated unless files exist.

## 6. DATA CONTRACT — SOURCE OF TRUTH
Design structured schemas (JSON or TypeScript/Zod) for:
- `series.json`: creative rules, format, narrative style, visual rules.
- `garden_layout.json`: immutable geometry, landmarks, camera anchors.
- `garden_state.json`: chronological scene states and changes.
- `characters/elise.json`: identity reference paths, outfits, scale, prohibited drift.
- `assets.json`: asset ID, type, canonical path, status, reference, checksum if available, rights notes.
- `episodes/EP01/episode.json`: premise, beats, timing, days, dependencies.
- `episodes/EP01/shots.json`: shot IDs, sequence IDs, edit start/end, source type, generation prompts, state, props, audio, dependencies, status.
- `episodes/EP01/narration.json`: timecoded voice cues, exact text, delivery.
- `episodes/EP01/qa_report.json`: validation results, unresolved issues, approval gates.

Minimum shot fields: `id`, `sequenceId`, `startFrame`, `durationFrames`, `day`, `timeOfDay`, `gardenStateBefore`, `gardenStateAfter`, `cameraId`, `description`, `sourceType`, `assetRefs`, `promptImage`, `promptVideo`, `negativePrompt`, `audioCues`, `status`, `qaChecks`. Prefer frame-based timing at a fixed FPS; ensure the entire episode equals **exactly 720 seconds** with no unintended overlaps or gaps. Use stable IDs.

## 7. TECHNICAL PIPELINE
Inspect the actual repo and ask about existing tooling before installing anything. If Remotion is present, reuse it; otherwise propose the smallest workable TypeScript + Remotion setup. Desired stages:
1. `validate`: schema, exact runtime, missing assets, camera/state consistency, chronological logic.
2. `plan`: generate production manifest, per-shot prompts and dependency order.
3. `ingest`: map real files to stable shot IDs; never fabricate paths.
4. `preview`: assemble low-resolution storyboard animatic with placeholder cards and timecoded narration.
5. `render`: assemble approved video assets and audio with Remotion.
6. `qa`: report missing clips, repeated footage, timing, aspect ratio, crop, state mismatch, abrupt transitions, audio peaks.
7. `release`: final render plus metadata, thumbnail plan, captions and disclosure notes.

Provide example commands only after checking the actual repository scripts. Use dry-run/mocks for generation until credentials and budgets are approved. Ensure rendering is reproducible; never silently replace an approved asset.

## 8. PRODUCTION ASSET REQUIREMENTS
**Character:** approved Elise face; full body front, profile, back; gardening outfit (cream linen shirt, olive trousers, brown boots, gloves); cooking outfit (same base + beige apron); scale reference.

**Environment:** master plan; four fixed camera references; S0/S1/S2/S3/S4/S5 state reference frames; cottage kitchen; porch; storage corner.

**Props:** dark-green wheelbarrow, metal watering can, spade, rake, trowel, tape measure, carpenter pencil, saw, drill, timber, screws, finished compost, seed packets, labels, wicker basket, kitchen utensils.

**Audio:** birds, wind, gravel steps, weed pulling, digging, saw, drill, wood placement, soil pouring, seed packets, watering, washing, knife chopping, simmering, evening ambience, sparse music, voice cues.

All assets need status: `planned | generated | reviewed | approved | rejected`. Use real file paths only when verified.

## 9. EP01 MINIMAL NARRATION (WORKING DRAFT)
- 00:10 — “This little corner had been forgotten for years. I wanted to give it a new beginning.”
- 01:05 — “I decided to start small. Just two beds for my first vegetables.”
- 03:25 — “I chose simple wooden frames. Nothing fancy. Just something I could build myself.”
- 05:35 — “For the first time, I could imagine what this place might become.”
- 06:40 — “Good soil is where everything begins. I mixed in finished compost and prepared the beds for planting.”
- 07:45 — “Radishes, lettuce, and pak choi. Three simple vegetables for my first season.”
- 09:35 — “The seeds are in. Now I just have to take care of them and wait.”
- 11:35 — “The garden is still quiet. But something has already begun.”

Treat timestamps as intended cue starts; fit actual narration with measured voice durations and do not overlap implausibly with important Foley.

## 10. QUALITY GATES
**Gate A — Planning:** Canonical layout, season, story beats and 720-second timeline approved.
**Gate B — Visual references:** Elise identity, four garden camera views, and S0–S5 states approved.
**Gate C — Eight-shot pilot:** Stable identity, physically plausible motion, consistent architecture and props; pilot animatic reviewed.
**Gate D — Full episode:** Shot coverage, narration, audio, state progression, no filler, no false harvest.
**Gate E — Release:** Final duration/aspect ratio, thumbnail, title, description, AI disclosure, copyright-safe music, reproducible render.

If a gate fails, stop and return a precise remediation plan. Do not advance to bulk generation without approval.

## 11. DELIVERABLES IN ORDER
1. `docs/CREATIVE_BRIEF.md` — vision, audience, constraints, narrative promise.
2. `docs/GARDEN_MASTER.md` — immutable layout, fixed cameras, states S0–S5, scene references to create.
3. `docs/EP01_STORYBOARD.md` — 10 sequences, 80 shot descriptions, exact timing, retention purpose and sound.
4. `data/` — canonical schemas and machine-readable shot/asset/continuity data.
5. `episodes/EP01/PILOT_8_SHOTS.md` — fully detailed eight-shot pilot with prompts.
6. `docs/PRODUCTION_PLAN.md` — tools, costs, runbook, risks, QA gates.
7. Code only after inspection: validators, manifests, animatic, Remotion assembly, tests.
8. `docs/STATUS.md` — what exists, what is missing, assumptions, next approval needed.

## 12. FIRST RESPONSE REQUIRED FROM AGENT
First inspect the repository and summarize what already exists. Then produce:
- Architecture proposal (smallest maintainable solution).
- List of assumptions and missing references.
- Exact files to create or modify.
- Eight-shot pilot production plan with acceptance criteria.
- A phased implementation plan with checkpoints and estimated generation workload.

**Do not** immediately generate 80 clips, install unnecessary dependencies, call paid services, or invent completed outputs. If the repository is empty, scaffold the planning/data/validation foundation and prepare a preview with explicit placeholders. Request approval before expensive production.
