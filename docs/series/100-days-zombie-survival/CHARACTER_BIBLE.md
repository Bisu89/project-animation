# CHARACTER BIBLE — 100 Days: Zombie Survival

Legend: **[CONFIRMED]** decided by the series owner or already true in the repository; **[PROPOSAL]** suggested, needs approval.

## 1. SURVIVOR-001 (protagonist)

### Identity
- Code name `SURVIVOR-001`; an ordinary person; carries a **small backpack**. [CONFIRMED]
- Name, age, profession, family, home: **not defined**. Keep anonymous in Days 1-7. [PROPOSAL: leave open on purpose so later seasons can reveal it through action]
- Gender: not stated in the series decisions. The existing character files use no gendered detail; narration should use "I". [PROPOSAL: keep unspecified in narration]

### Visual design [CONFIRMED where it matches the repository, `demo-project/src/survival-test/Figures.tsx`]
- Stickman body (plain ink limbs), `BigHead` with `head: 0.8` (20% smaller than the engine default), dot eyes, stern/worried resting face.
- Short dark-brown hair (`#2b2118`), light skin, slate jacket (`#5b6b72`, trim `#2a2f33`), brown backpack (`#6a5a3a`) with a strap and top flap.
- Silhouette: slightly hunched when tired, upright when confident; the backpack is the identifying shape. Colour/limb colour is never used to tell characters apart.
- Items with planned visual assets: backpack, phone, flashlight (from the production brief). [CONFIRMED as planned assets; not yet built except the backpack]

### Personality (Days 1-7) [PROPOSAL]
- Cautious, observant, practical; talks himself through problems (this is what the narration voices).
- Not a fighter: avoids confrontation, uses doors, distance and silence. Does not hunt zombies.
- Flaw that drives mistakes early: wants to do the "normal" thing (go where people go, follow official instructions). Flaw that remains: reluctance to trust.

### Limitations (hard rules) [CONFIRMED in spirit: "ordinary person", "no superhuman" applies to the survivor too]
- Ordinary stamina: can sprint briefly, cannot outrun a group for long, needs rest, water and food every day.
- No combat training, no medical training, no mechanical expertise beyond what he learns on screen.
- One backpack of carrying capacity; weight matters (a heavy find forces dropping something).
- Injuries heal slowly and affect speed (see `SURVIVAL_STATE.md` health/fatigue).

### Growth stages (shown by action, not narration) [PROPOSAL]
| Stage | Days | Observable behaviours |
|---|---|---|
| 1 Reactive | 1-2 | Runs toward crowds and exits; opens doors without checking; wastes light and battery |
| 2 Rule-maker | 3-4 | Writes and follows rules; checks exits first; rations; panics when the rules are tested |
| 3 Planner | 5-6 | Plans a route, a time limit and a retreat before leaving; tests another person before trusting |
| 4 Partner | 7 | Shares a rule set, divides tasks, accepts a trade-off for a safer base |
Growth never removes the limitations above.

### The "Three Rules" (Episode 1, scene 4) [CONFIRMED that the survivor writes three rules; content is a PROPOSAL]
1. Noise draws them: stay quiet.
2. Never enter a place without a second way out.
3. Do not stay anywhere you cannot leave in under a minute.
Later episodes may break or refine a rule; changes must be shown as a decision (and recorded in `SURVIVAL_STATE.md` knowledge).

## 2. THE STRANGER (first supporting character)
- First appears on **Day 6 (Episode 6)**. Not before; at most an indirect trace (a note, tracks, a moved object) on Day 5. [CONFIRMED for Day 6; trace is a PROPOSAL]
- Name: unknown to the survivor and the audience until the survivor is told. Until then always referred to as "the stranger". [PROPOSAL]
- Role: first relationship; tests the survivor's reluctance to trust and offers a shared shelter plan in Episode 7. [PROPOSAL, matches the confirmed arc "meeting another survivor, establishing a temporary shelter"]
- Traits [PROPOSAL]: guarded, economical with words, practical knowledge (water, doors, noise discipline), **also an ordinary person** (same zombie limits, can be hurt, makes a mistake).
- Backstory: **none decided**; reveal at most a small, concrete fact in Episode 6-7 (for example a skill or an item), nothing about the outbreak. Any larger backstory must be approved first.
- Visual [PROPOSAL]: clearly different silhouette from SURVIVOR-001 (taller proportions, long coat, no backpack but a rolled bag), same stickman style and head size rules.
- Relationship states: Unknown -> Wary -> Tested -> Conditional trust (end of Episode 7). Do not go beyond "conditional trust" in this arc.

## 3. Zombies as characters
Zombies are not characters; they have no names, plans or personalities. Rules are in `WORLD_RULES.md`. Visual rules are in `VISUAL_STYLE_GUIDE.md`.

## 4. Continuity rules for characters
1. A character's items, injuries and knowledge persist until a scene shows them changing. The authority is `SURVIVAL_STATE.md`.
2. SURVIVOR-001 never has information he has not obtained on screen (the evacuation message, the shelter location, the stranger's existence).
3. The backpack is on his back in every shot unless a scene deliberately shows it off (hung on a railing in Episode 1 scene 3, set down in a shelter). An empty-handed shot needs a reason.
4. Wounds are visible: a scraped palm (Episode 1) must be visible on later close-ups until healed per the ledger. [PROPOSAL for the specific wound]
5. The narration voice is the same person throughout, a little more precise each episode (no sudden competence).
