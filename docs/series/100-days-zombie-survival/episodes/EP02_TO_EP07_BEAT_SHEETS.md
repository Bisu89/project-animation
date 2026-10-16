# EP02-EP07 — beat sheets (detail of `EPISODE_OUTLINE.md`)

Status: **PLAN, awaiting owner approval, one episode at a time.** Everything here is **[PROPOSAL]** unless it repeats a confirmed fact (stranger first appears Day 6; no zombie variants/superspeed).
Each episode ~8-10 min. Ledger numbers are the provisional values of `SURVIVAL_STATE.md`. L0-L3 as in the style guide.

## EP02 — Day 2: the bridge (water 1.2 -> 0.2, food 3 -> 1, health 88)
1. Morning road (L2): walking toward the river, parked cars, a sign with the distance.
2. A bad shortcut (L2): a crowd drawn by noise; he leaves it instead of joining (rule 1).
3. The approach (L0/L1): wide shot of the bridge; blocked lanes, no evacuation visible.
4. Close look (L3): abandoned checkpoint, a dead broadcast speaker, zombies thick at the entrance.
5. Decision (L1): he reads the cut-off time on his phone; it passed an hour ago; he turns back.
6. The long way back (L2): thirst, blisters; a car-lined street used as cover.
7. Dusk (L1): reaches the utility building; counts water 0.2 L; first real fear of running out.
New assets: bridge set, checkpoint props, car clutter. Ledger out: water 0.2, food 1, phone 50%, health 88, fatigue 6.

## EP03 — Day 3: water (water 0.2 -> 0.7, food 1 -> 0)
1. Dry taps (L1): the tap spits air; mains failed. 2. Where water might be (L0): map insert, two candidate buildings.
3. Small office block (L2): quiet floors, a locked pantry. 4. The tank (L3): roof/basement tank with stored water; every clang carries.
5. The noise cost (L3): zombies drift toward the sound across a courtyard. 6. Carrying 1.5 L out (L2): slow, careful gait; leaves the heavy items.
7. Evening (L1): eats his last meal; hears the street. New assets: tank room, courtyard, slow-careful gait variant. Out: water 0.7, food 0, phone 44%, light 5.5 h, health 85, fatigue 7.

## EP04 — Day 4: fear (water 0.7 -> 0.3, health 78)
1. Staying in (L0): the day as a series of still frames of one room, a pencil rule count. 2. Rationing a sip (L1).
3. The street outside (L3): a slow crowd passes; he freezes. 4. Doubts (L1): reads the Three Rules and breaks none.
5. Night (L3): a single zombie tests the door; he stays silent; it leaves. 6. Plan (L0): writes the next day's plan (route, time limit, retreat).
Mostly L0/L1 to control production time; reuse door/shadow assets from Ep1. Out: water 0.3, food 0, phone 40%, light 4.5 h, health 78, fatigue 8.

## EP05 — Day 5: exploration (food 0 -> 2, water 0.3 -> 0.5, health 80)
1. Leaving on schedule (L2). 2. The planned route (L0 map insert + L2 walking). 3. A small shop/pharmacy block (L3): several entrances, a few zombies.
4. Stealth past them (L2): noise discipline, a thrown object as a distraction (a zombie follows noise, not a plan). 5. Finds food, bandage kit, a street map (L1).
6. A trace of another living person (L1): a fresh mark on a door / a note, not the stranger. 7. Back before dusk (L2). Out: water 0.5, food 2, phone 36%, health 80, fatigue 8.

## EP06 — Day 6: THE STRANGER (water 0.5 -> 0.7, food 2 -> 2)
1. Following the trace (L2). 2. Being watched (L3): small signs (a moved object, a shadow). 3. The meeting (L1/L2): first two-character scene, wary, no names.
4. A noise in the dark (L3): a group drawn toward them; the stranger's small act of help. 5. The trade (L1): 1.0 L water and 2 meals for a favour; the survivor does not reveal his shelter.
6. The offer (L0/L1): the stranger knows a better building. New assets: THE STRANGER design (long coat, rolled bag), two-character staging. Out: water 0.7, food 2, health 84, fatigue 6, relationship Wary.

## EP07 — Day 7: the temporary shelter (water 0.7 -> 2.0, food 2 -> 3)
1. The walk to the new building (L2, two characters). 2. Assessing it (L1): entrances, second exit, water cache.
3. Clearing the approach without fighting (L3): noise away from the entrance. 4. Setting rules together (L1): his Three Rules become shared rules; one disagreement.
5. Setup montage (L0/L1). 6. First calm night (L0): watch rotation. 7. A distant non-zombie sound (L0): engine or broadcast, unresolved. Out: water 2.0, food 3, phone 30%, light 3 h, health 87, fatigue 5, relationship Conditional trust.

Common production rule for every episode: write `content/<slug>/script.md`, run `scripts/gen_voice.py`, build scenes from shared components, contact sheet, render, inspect frames, update `SURVIVAL_STATE.md`.
