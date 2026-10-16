# WORLD RULES — 100 Days: Zombie Survival

Legend: **[CONFIRMED]** decided by the series owner or true in the repository; **[PROPOSAL]** suggested, needs approval.
These rules exist to prevent plot inconsistencies. A script that needs to break one must first change this file.

## 1. Zombie rules for Episodes 1-7

### Confirmed (series decisions)
1. **No superhuman speed.** A zombie never moves faster than an ordinary person can run. [CONFIRMED]
2. **No unlimited strength.** A zombie can push, grab and bang on a door, but a sturdy door, a lock or a barricade holds for a limited time, and a single zombie can be pushed off or out-pulled. [CONFIRMED]
3. **No complex planning.** Zombies do not open locked doors by cleverness, set traps, use tools, coordinate or flank. [CONFIRMED]
4. **No special zombie variants** in Episodes 1-7: no runners, crawlers, giants, spitters, armoured or "alpha" types. [CONFIRMED]
   Cosmetic variety (clothes, skin tone, hair) is allowed because it changes nothing in how they behave. [PROPOSAL for the cosmetic carve-out]

### Proposed behaviour model (needed to write scenes; please approve or change)
- **Movement [PROPOSAL]:** they shamble at roughly a fast human walk. A lurching jog is allowed only for a few seconds when a target is very close; they cannot sustain a run, so a healthy person can pull away by running.
- **Senses [PROPOSAL]:** drawn by noise first, movement second, light third. Sight range is short in low light; hearing is the main sense. Silence plus distance makes a person "disappear" to them.
- **Memory [PROPOSAL]:** none. Out of sight and earshot, a zombie drifts back to wandering. A group follows a noise, not a leader.
- **Doors and obstacles [PROPOSAL]:** they cannot climb ladders or open a closed (even unlocked) door by turning a handle; they push it open if it is not latched. Glass breaks under sustained crowd pressure. A rolling grille or locked metal door holds against a few of them.
- **Numbers [PROPOSAL]:** danger scales with crowd size, not with a single zombie's ability. One zombie is a manageable threat; a crowd is lethal because it blocks exits.
- **Infection [UNRESOLVED]:** the mechanism and timeline are not decided. Do not state them in Days 1-7. If a bite must appear, the story treats it as a severe, ambiguous wound (no explanation).

### Conflict found in the current animation tests (must be resolved in production)
The 12-second `SurvivalTest` clip shows zombies keeping pace with a sprinting survivor and shuffling in at about the same speed as him. That reads as a zombie moving at
human sprint speed, which is the edge of rule 1 and contradicts the proposed "cannot sustain a run" model. Resolution options for the next production task:
(a) slow the zombies in the animation (pace about 55-65% of the survivor's sprint) and let the gap grow, or (b) approve a rule that a *freshly noticed* chase can match a jogging
human for a few seconds. Option (a) is recommended. Until decided, treat the test clip as a technical test, not canon.

## 2. World constraints [PROPOSAL unless stated]
- **Time frame:** the story starts on the morning of the outbreak (Day 1) in an unnamed modern city. The exact place is not named in Days 1-7.
- **Communications:** phone networks degrade. Day 1: patchy; from Day 2: no calls, intermittent automated broadcasts. The evacuation message of Day 2 is a one-way broadcast, not a conversation.
- **Power and utilities:** mains power is unreliable from Day 2 and gone for practical purposes by Day 4; tap water works on Day 1-2 and fails around Day 3 (so water becomes scarce). [PROPOSAL]
- **No heroic infrastructure:** no helicopters rescuing the survivor, no military convoy that solves a problem in Days 1-7. Authorities exist only as a broadcast and abandoned checkpoints.
- **Other people:** many are dead or fled on Day 1. Living survivors are rare and wary. Hostile human characters are not part of this arc. [PROPOSAL]
- **Geography:** a city with a river and a bridge about a day's walk away (the bridge in Episode 2), a mall, residential streets and small service buildings. Exact map not drawn. [CONFIRMED that a mall, a stairwell, a house, a small utility building and a distant bridge are part of Episode 1; the rest is PROPOSAL]
- **Day/night:** nights are dark; light and noise are costly. Day length is realistic.

## 3. Resource scarcity
Quantities are **provisional units** (see `SURVIVAL_STATE.md` for the ledger):
- **Water:** about 1.0-1.5 L/day is the minimum to stay functional; below 0.5 L/day, fatigue rises and health falls. [PROPOSAL]
- **Food:** counted in "meals" (one modest meal ~ one can or two snack bars); one meal/day keeps health stable, zero meals for a day lowers health. [PROPOSAL]
- **Phone battery:** percentage; with the network gone it is used only for light, the clock, notes and the broadcast. No charging until a power source is found (not in Days 1-7 unless the ledger says so). [PROPOSAL]
- **Flashlight:** hours of light left. Every minute of light at night is a risk (rule: light draws them). [PROPOSAL]
- **Health:** 0-100 scale in the ledger, described in words in scripts. Injuries (scrape, blister, twisted ankle) lower it and slow movement. [PROPOSAL]
- **Fatigue:** 0-10 scale; 7+ causes mistakes (the story may use this as a cause, not as an excuse for plot convenience). [PROPOSAL]
- **Carrying capacity:** one small backpack; a major find forces leaving something behind.

## 4. Shelter trade-offs [PROPOSAL]
| Shelter type | Pros | Cons |
|---|---|---|
| Small utility building (Episode 1 night) | single door + rear exit, no windows, quiet | no water, cold, cramped, one threatened entrance |
| Ordinary house | beds, supplies | windows, many entrances, signs of previous occupants (Episode 1 scene 5: "the wrong house") |
| Large public building (mall, school) | lots of supplies | crowds, many exits that cannot be watched |
| Upper floor of a residential building | height, one stairwell to control | trapped if the stairwell is lost; no water |
A shelter is judged on: number of entrances, a second exit, noise, water access, visibility from outside, and escape time. These are the criteria behind "the three rules".

## 5. Consistency checklist for any script (run before approving an episode)
1. Does the episode start from the previous row of `SURVIVAL_STATE.md`? 2. Does any zombie do something forbidden in section 1?
3. Does the survivor know anything he has not learned on screen? 4. Does a resource change without an on-screen cause?
5. Is a new location, item, character or ability marked [PROPOSAL] and added here first? 6. Is `THE STRANGER` absent before Day 6?
