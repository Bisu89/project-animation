# EPISODE OUTLINE — Days 1-7

> **FORMAT UPDATE (owner decision, 2026-10-16):** the series is now made mainly from **AI pictures with smooth zoom/pan, narration, subtitles and light motion**
> (rain, wind, dust, flicker), not full stickman animation. Wherever this document says "animation", "L0-L3" or "grounded gait", read it as
> **"picture plan + camera move + light fx"**. Pipeline: `PRODUCTION_WORKFLOW.md` section 2b. The vector animation code stays as an optional library.


Legend: **[CONFIRMED]** from the series owner's brief; **[PROPOSAL]** my suggestion. **No episode has been written as a full script or produced.**
Only outlines exist here. Episode 1's eight-scene structure and its animation priorities come from the production brief; everything else is a proposal.
Numbers refer to `SURVIVAL_STATE.md` (provisional). Rules: `WORLD_RULES.md`. Animation levels L0-L3: `VISUAL_STYLE_GUIDE.md`.
Target length 8-10 minutes per episode, decided by the actual narration timing.

---

## Episode 1 — Day 1: "I Had 24 Hours to Survive the First Night of a Zombie Apocalypse" (working title)
Eight scenes **[CONFIRMED structure]**; content of each scene follows the brief, details are [PROPOSAL].
- **Hook:** "The alert said stay calm. Nobody on the street was calm." The clock starts: 24 hours until the next broadcast.
- **Current situation:** morning, apartment, outbreak beginning; water 1.0 L, food 2, phone 85%, light 8 h, health 100, fatigue 1.
- **Main objective:** get through the first day and night alive. [PROPOSAL]
- **Obstacle:** panic, crowds, his own bad assumptions (the mall will be safe; official crowds mean safety).
- **Turning point:** the stairwell trap in the mall (scene 3): his backpack catches on a railing; he escapes through a maintenance exit and sees that crowds, not individual zombies, are the real danger.
- **Consequence:** he loses the mall, scrapes his palm (health 92), and must find shelter before dark with fatigue 7.
- **Character change (shown):** from following the crowd, to one lesson learned the hard way: noise draws them (first rule, demonstrated scene 4, confirmed by two bracketing events scene 7: a dropped bottle draws them to the door, breaking glass elsewhere pulls them away). No other rule yet.
- **Scenes (brief order, REVISED 2026-10-19 after owner rewrite):** 1 The Clock Starts (apartment, a bleeding neighbour at a door across the hall, escape down the service stairwell) / 2 The First Mistake (a stranger points him to the mall; a guard is letting people in) / 3 The Trap (dangerous stairwell, backpack caught on a railing, escape through a maintenance exit) / 4 After the Mall (REPLACES 'Three Things I Know': no written list; he watches, from hiding, two walking figures turn toward a car alarm and then the mall's fire alarm — the 'noise draws them' observation is shown directly, not listed) / 5 The Wrong House (he walks in and calls 'hello?', something moves upstairs, he flees) / 6 A Place for the Night (RENAMED from 'The Last Hour': a locked garage, a smoky stairwell; the utility building is the last place left, not a clever choice) / 7 The First Night (a dropped water bottle draws them to the door; turning the flashlight on/off changes nothing, proving it was never about the light; distant breaking glass pulls them away: first rule confirmed by two clean before/after events) / 8 Day Two (an evacuation message, no stated travel time to the bridge — kept deliberately vague, see note below).
- **Picture plan [PROPOSAL, replaces animation priorities]:** 47 pictures (see `content/zs-ep01/scenes.csv`; scene boundaries will shift slightly after the 2026-10-19 rewrite, rebuild with `build_scenes.py` before generating new prompts). Strongest moves/fx: street panic (slow push-in + dust), mall funnel (push-in), stairwell snag (close-up, flicker), house door handle (flicker close-up) and window shadow (slow zoom), night door (flicker + shake-free zoom), dawn road (zoom-out). Old animation notes:  L2/L3 for the opening street panic; the run into the mall (the existing `SurvivalTest` is a prototype of this beat, see `PRODUCTION_WORKFLOW.md`); the crowded stairwell with the backpack caught on the railing; the suspicious house (door handle moving, a shadow crossing the upstairs window); the night climax (flashlight beam, shaking entrance door, retreat to the rear exit); the final dawn walk toward the bridge. L0/L1 for narration-heavy moments (scouting three shelters).
- **Ending:** he survives the night, the zombies drift away at dawn (they have no memory), a broadcast says to reach the river bridge, and he starts walking. Water 1.2 L, food 0 (REVISED: all food eaten on screen by end of scene 7), phone unspecified %, light 6 h, health 92, fatigue 7.
- **Continuity out:** one rule (be quiet); knows the utility building; has heard the evacuation message (location + cut-off time, but not how far away it is — the distance/travel time to the bridge is deliberately NOT stated in Ep1, so Episode 2 is free to make the journey take as long as it needs to).
- **Note (owner rewrite, 2026-10-19):** the "three observations" list-on-phone device (previously scene 4) is dropped for Episode 1; the family/sibling subplot drafted in this rewrite was also dropped by the owner ("khó duy trì vì đây là sinh tồn một mình") — SURVIVOR-001 stays unspecified-gender/no-named-family per `CHARACTER_BIBLE.md`. If a later episode still wants an explicit written-rules device, reintroduce it there instead of backfilling Ep1.

## Episode 2 — Day 2: the bridge (WRITTEN 2026-10-20, ~2400 words ≈ 14 min, awaiting owner approval: `content/zs-ep02/script.md`, `script.vi.md`)
- **Hook:** the first written rule, then a message he cannot check.
- **Beats (12 chapters):** 1 The List (rule 1 typed, phone silenced, hand rewrapped, palm swollen and stiff, scab splits again at dusk; no infection imagery) / 2 The Road (11 km sign, listens 10 s at every corner) / 3 Watching Them (observes one wander: reacts to sound, no memory) / 4 The Empty Shelves (looted corner store, only mints) / 5 The Overpass (a line of cars all pointing at the river: he was one of many) / 6 The Alarm (old 3) (a crowd around a car alarm; he takes the back streets, -40 min) / 4 Thirst (one sip per half hour, blister) / 5 The Approach (a single road between a wall and a fence; checkpoint abandoned; bridge choked; 11:41, nobody to receive him) / 6 Twelve O'Clock (the checkpoint speaker fires at noon with a recorded "this evacuation point is now closed", the bridge crowd turns and walks into the funnel; he runs out) / 7 Rule Two (never go into a place without a second way out; the message stays unexplained) / 8 The Long Way Back (ankle twisted on rubble, silent) / 9 Dusk (back at the utility building: a few mouthfuls of water, no food, phone at half, "afraid of the arithmetic").
- **Ledger out:** water ~0.1 L, food 0, phone ~50%, health ~85 (swollen hand, blister, twisted ankle), fatigue 7. **Rule 2 earned.** The evacuation question stays unresolved (the loudspeaker is automatic, not proof either way).
- **Continuity:** the bridge is a dead end; distance 11 km; the utility building is still home; THE STRANGER is absent.

## Episode 3 — Day 3: water (WRITTEN 2026-10-20, awaiting owner approval: `content/zs-ep03/script.md`, `script.vi.md`)
- **Hook:** thirst arithmetic, then dry taps.
- **Beats:** 1 The Arithmetic (empty bottle, headache, "three days is a warning") / 2 The Taps (pumps stopped with the power; puddles are not an option) / 3 Where Water Waits (toilet tanks, a water heater holds ~150 L) / 4 Two Ways Out (circles a small clinic, waits for three zombies to drift off after a distant shutter bang, wedges the side door open) / 5 The Closet (finds the heater and a toolbox; the valve triggers pipe hammer; wraps the valve in his jacket and opens it slowly; no flashlight) / 6 One More Bottle (four bottles; stays ~25 min out of greed) / 7 Glass (zombies return to the lobby doors; glass cracks and falls; he leaves with three bottles via the side door) / 8 The Rule (rule 3: do not stay anywhere you cannot leave in under a minute) / 9 Evening (water solved, hunger is next; decides to stay in tomorrow).
- **Ledger out:** water ~1.5 L (3 bottles) after drinking his fill, food 0, health ~83, fatigue 7. **Rule 3 earned.**

## Episode 4 — Day 4: fear [PROPOSAL]
- **Hook:** "I did not leave the room on the fourth day. That was also a decision."
- **Situation:** hungry, tired, scared; stays inside the utility building; water 0.7 L, food 0, fatigue 7.
- **Objective:** survive without making noise while the street outside is busy.
- **Obstacle:** zombies pass/linger near the building; his own fear (second-guessing the rules, imagined sounds).
- **Turning point:** a long night with a real threat at the entrance (a single zombie testing the door) that he handles by silence and leaving the door alone, not by fighting.
- **Consequence:** the threat leaves; he rations to 0.3 L and decides that staying still will kill him as surely as leaving. Health 78.
- **Character change:** moves from reacting to deciding; accepts a calculated risk (explore tomorrow) over passive fear.
- **Picture plan:** mostly still rooms, slow zooms, a door-handle flicker. Old notes: mostly L0/L1 (static compositions, a few stylised insets); environmental L3 beat of shadows and a door handle (reuses Episode 1's door/shadow assets).
- **Ending:** a written plan on the wall (time limit, route, retreat) for the next day.
- **Continuity out:** hungry and weak; has a plan.

## Episode 5 — Day 5: exploration [PROPOSAL]
- **Hook:** "I gave myself two hours and one route."
- **Situation:** health 78, food 0, water 0.3 L; leaves with a plan to forage within about 2 km.
- **Objective:** find food and water, return before dark.
- **Obstacle:** a small shop/pharmacy block with a handful of zombies and several entrances.
- **Turning point:** he finds food and a bandage kit, and a fresh trace of another living person (a note or marked door), not the stranger himself.
- **Consequence:** food 2, water 0.5 L, health 80; the trace creates a new goal and a new risk.
- **Character change:** executes a plan under pressure and returns on time; a first small act of curiosity toward another person.
- **Picture plan:** map insert + street stills. Old notes: the planned route (L2 grounded movement through streets, camera beats), a stealth sequence past a group (L3), a map/route insert (L0).
- **Ending:** back at the shelter before dusk, staring at the trace.
- **Continuity out:** a trace (location noted); no contact yet.

## Episode 6 — Day 6: THE STRANGER [PROPOSAL, with the confirmed fact that the stranger first appears here]
- **Hook:** "I was not alone. Someone had been watching."
- **Situation:** follows the trace; water 0.5 L, food 2.
- **Objective:** find out who left the trace without being seen or caught.
- **Obstacle:** the stranger is as guarded as he is; a misunderstanding in the dark; a nearby group is drawn by a noise.
- **Turning point:** the stranger helps him get out of a bad spot instead of leaving him (a concrete, small act), and then asks for something in return.
- **Consequence:** a conditional trade of water and food (+1.0 L, +2 meals) and the stranger's single concrete fact; relationship "Wary".
- **Character change:** takes a risk on trust, but keeps his own rules (does not tell the stranger where the shelter is).
- **Picture plan:** first picture with two characters (stranger design is new). Old notes: the first two-character animation (the stranger design is new: see Visual Style Guide), a tense stand-off using small acting (L1/L2), a street escape (L2).
- **Ending:** the stranger proposes a better building. He says nothing about the outbreak.
- **Continuity out:** the stranger exists; an offer is open; the survivor's shelter location is still private.

## Episode 7 — Day 7: the temporary shelter [PROPOSAL]
- **Hook:** "A week ago I did not know how to hold a door. Now I had to decide who held it with me."
- **Situation:** water 0.7 L, food 2; follows the stranger to a larger building; fatigue 6.
- **Objective:** set up a temporary shelter with two exits and a shared rule set.
- **Obstacle:** the building has an unresolved threat inside/near it (zombies in a lower floor or yard) and a conflict over a rule (noise, light).
- **Turning point:** they clear the approach without fighting (using noise away from the entrance) and decide to stay; the survivor's rules become shared rules.
- **Consequence:** a water cache (+2.3 L), + 3 meals; the utility building is abandoned. Water 2.0 L, food 3, health 87, fatigue 5; relationship "Conditional trust".
- **Character change:** from solo survivor to partner who shares and divides tasks; his rules are now taught, not just followed.
- **Picture plan:** base-setup stills, night-watch, wide shelter shot. Old notes: a base-setup montage (L1 with camera moves), a quiet night-watch scene (L0/L1), a wide shot of the new shelter (L0).
- **Ending (arc close):** the first calm night, then a distant sound that is not a zombie (a broadcast, an engine) - an open hook for Day 8+. Keep it unresolved.
- **Continuity out:** temporary shelter; a partner; a new unexplained signal.

---

## Cross-episode continuity checks
- Rules are earned one at a time: rule 1 (Ep 1 night), rule 2 (Ep 2 bridge), rule 3 (Ep 3 roof). Later episodes test them.
- The scraped palm (Ep 1) is visible until about Day 3 (see health). The ankle strain (Ep 2) fades by Day 4.
- Phone battery only falls; it is never recharged in this arc.
- The evacuation broadcast (Ep 1 end, Ep 2) must not be explained until a later arc.
- The stranger appears first in Ep 6 (a trace is allowed in Ep 5).
