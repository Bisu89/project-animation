# SERIES BIBLE — 100 Days: Zombie Survival

Status legend used in every document of this folder:
**[CONFIRMED]** = decided by the series owner in conversation or already true in the repository.
**[PROPOSAL]** = my suggestion to make the plan complete; needs approval before it becomes canon.

Where these files live: `docs/series/100-days-zombie-survival/`. The repository already keeps planning docs under `docs/<topic>/`
(for example `docs/history-pipeline/`) and per-video content (narration, scene tables) under `content/<slug>/`
(for example `content/why-igloos/`). So: **series documents here, episode scripts later in `content/<episode-slug>/`.**

Nothing in this folder claims an episode has been produced. The only produced material is a 12-second chase test (`SurvivalTest`)
and a 10-second walk test (`ZombieWalk`); see `PRODUCTION_WORKFLOW.md`.

## 1. Premise [CONFIRMED unless marked]
- An original English-language stickman zombie survival series for an international YouTube audience.
- One ordinary protagonist, `SURVIVOR-001`, carrying a small backpack, who becomes more capable through experience.
- Serious, cinematic, emotionally grounded survival fiction. Not comedy, not horror-spectacle.
- Working series title: *100 Days: Zombie Survival*. Working title of the first episode (from the production brief):
  "I Had 24 Hours to Survive the First Night of a Zombie Apocalypse".
- First story arc: Days 1-7 (seven episodes). Only this arc is planned in detail. No scripts for later days are written.

## 2. Audience and format
- International YouTube audience, English narration. [CONFIRMED]
- Episodes of about 8-10 minutes, **subject to actual narration timing** (about 1,200-1,500 spoken words at a natural 2.4-2.7 words/second;
  `scripts/parse_input.py` and `references/pitfalls.md` use 2.4-2.7 as the natural pace). [CONFIRMED for the target; the word range is derived]
- One episode = one in-story day (Episode N covers Day N). Episode 1 also contains the dawn of Day 2 as its closing beat. [PROPOSAL, follows the 8-scene Episode 1 structure supplied earlier]
- Narration style: first person, past tense ("I had 24 hours..."), spoken by the survivor looking back. [PROPOSAL, implied by the working title]

## 3. Tone and narrative principles
1. **Decisions over explanation.** Growth is shown by what the survivor chooses and does, not by narration saying he has changed. [CONFIRMED]
   Narration states facts and fears; the picture shows the new behaviour (checking a door before entering, rationing, going quiet).
2. **Consistency over spectacle.** Every episode starts from the previous episode's `SURVIVAL_STATE.md` row. Water, food, battery, health,
   fatigue, inventory, relationships, knowledge, location and unresolved threats must agree across episodes. [CONFIRMED]
3. **Limits stay limits.** Zombies obey `WORLD_RULES.md`; the survivor is an ordinary person with ordinary stamina. No lucky rescues that
   cancel a cost. [CONFIRMED in spirit; details in WORLD_RULES]
4. **Every episode costs something.** Each episode ends with a changed ledger (a resource lost, an injury, a relationship shift, a piece of knowledge).
5. **One clear objective per episode**, one obstacle, one turning point, and an ending that makes the next episode necessary. (Format of `EPISODE_OUTLINE.md`.)
6. **Restraint in violence.** The repository guardrail applies: violence stays off-body and non-graphic (`SKILL.md`, Guardrails). Threat is conveyed by
   sound, silhouette, doors, shadows and distance.
7. **Quiet beats are allowed.** Not every minute is a chase; the pilot tests show that static shots with camera movement are cheap and effective for narration-heavy moments.

## 4. Long-term character arc (survivor) [PROPOSAL framed by the confirmed "ordinary person who becomes more capable"]
| Phase | Days | Survivor is | Visible through |
|---|---|---|---|
| Reactive | 1-2 | Improvising, panicked, makes avoidable mistakes | enters a crowded mall, gets trapped, follows an unverified message |
| Methodical | 3-4 | Learns rules, rations, but is afraid | writes rules, checks exits first, stays hidden, hesitates |
| Active | 5-6 | Chooses risk on purpose; accepts help | planned exploration; chooses to trust or test another person |
| Established | 7 | Plans a base with someone else | trade-offs about shelter, shared rules |
Beyond Day 7: not planned here.

## 5. Series rules that protect the story
- No new zombie abilities and no special zombie variants in Episodes 1-7. [CONFIRMED]
- `THE STRANGER` first appears on Day 6 (Episode 6) and not before. [CONFIRMED]
- A new backstory, ability, location or item that is not in these documents must be added here (marked [PROPOSAL]) before it appears in a script.

## 6. What is deliberately undecided (see also the final report of the planning task)
- Real name, age, job and home city of SURVIVOR-001 (kept anonymous; the narration does not need them in Days 1-7).
- Whether the evacuation message heard at dawn of Day 2 is real, outdated or a trap. Episode 2 is written so that either answer can be chosen later.
- How the outbreak started and how infection works (not needed for Days 1-7; do not explain).
- The reason the survivor is alone on Day 1.

## 7. Related documents
`CHARACTER_BIBLE.md`, `WORLD_RULES.md`, `SURVIVAL_STATE.md`, `EPISODE_OUTLINE.md`, `VISUAL_STYLE_GUIDE.md`, `PRODUCTION_WORKFLOW.md`.
