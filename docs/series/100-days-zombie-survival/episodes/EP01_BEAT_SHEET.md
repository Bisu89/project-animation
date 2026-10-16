# EP01 — Day 1 — beat sheet (detail of `EPISODE_OUTLINE.md`)

Status: **PLAN, awaiting owner approval.** Scene names and order **[CONFIRMED]** (production brief). Content of each scene **[PROPOSAL]**.
Narration: `content/zs-ep01/script.md` (draft). Ledger in/out: `SURVIVAL_STATE.md` (Day 1). Target 8-10 min (about 1,200-1,400 words).
Levels: L0 static + camera, L1 idle/walk, L2 grounded run/actions, L3 environmental animation.
Zombie speed: at most 60% of the survivor's sprint in every shot (WORLD_RULES).

| # | Scene | Time | Level | What happens (visual) | Narration beats | New assets / reuse | Sfx |
|---|---|---|---|---|---|---|---|
| 1 | The Clock Starts | 0:00-1:20 | L3 (street panic), L1 | Dawn city; from the apartment window: people running, cars stopped, a few distant zombies. Phone shows the alert and "next update in 24 h". He packs the backpack (water, two bars, flashlight, phone) and leaves. | the alert, the clock, ordinary morning turning wrong, why he leaves | apartment interior + window, alert UI, street block (reuse `World.tsx` street), crowd silhouettes (static PNG + a few live) | alarm tone, car horns, distant shouts |
| 2 | The First Mistake | 1:20-2:50 | L2 | He runs with the crowd into a shopping mall; crowd chokes the entrance; inside he grabs water and cans from a kiosk; noise everywhere. | following the crowd, why the mall feels safe, the cost (noise, no exits checked) | mall entrance + interior (reuse `MallFront` idea), grounded run (`gait.ts`) | crowd roar, glass, PA chime |
| 3 | The Trap | 2:50-4:30 | L2/L3 | Panic on the upper level; crowd pours into a stairwell; his backpack snags on the railing; he tears free (palm scraped); finds a "STAFF ONLY" maintenance exit and gets out onto a loading dock. | the surge, the snag, the choice to cut free, the quiet outside | stairwell with railing + snag animation (new), maintenance door (door with open/close state, new) | crush, metal clang, door latch |
| 4 | Three Rules | 4:30-5:45 | L0/L1 | Behind a dumpster he types three rules into the phone (battery -2%); watches a street from cover; shows zombies drifting toward an alarm. | the three rules, what the street taught him | phone UI close-up, loading dock set, drifting zombie group (L3 light) | distant alarm, wind |
| 5 | The Wrong House | 5:45-6:50 | L3 | Afternoon. A suburban house with a splintered door frame; the handle turns slowly from inside; a shadow crosses the upstairs window. He backs away without a sound. | the "easy" shelter, the signs, rule 3 in action | house front, door handle animation (new), window shadow (new) | handle creak, low drone |
| 6 | The Last Hour | 6:50-8:00 | L1/L0 | Dusk. He scouts three options: parking garage (many entrances), apartment block (stairwell memory), small utility building (one steel door + a rear service hatch). Picks the third. | criteria for a shelter, the choice | three location plates (reuse street + new utility building), simple map inset | wind, footsteps |
| 7 | The First Night | 8:00-9:30 | L3 | Inside, dark. Flashlight on briefly; sounds outside; the steel door shakes; light off; he retreats to the rear hatch and waits; the sounds fade. | the night, noise discipline, fear, what he does not do | utility interior, flashlight beam (new), shaking door (door state), zombie hands/silhouette at the door | scrape, knocks, heartbeat-like low pulse |
| 8 | Day Two | 9:30-10:00 | L2/L1 | Dawn. Phone buzzes: automated evacuation broadcast (River Crossing Bridge, cut-off 12:00). He counts supplies and starts walking. | the message, the decision, the road | broadcast UI, dawn grade, walk (grounded gait) | phone buzz, birds, footsteps |

Ledger: in = water 1.0 L, food 2, phone 85%, light 8 h, health 100, fatigue 1. Out = water 1.2 L, food 3, phone 62%, light 6 h, health 92, fatigue 7.
Open creative points: the exact words of the alert and the broadcast; whether he keeps the rules on his phone or on paper (default phone).
Animation priorities from the brief: scenes 1, 2, 3, 5, 7, 8. Static control shots: 4, 6.
