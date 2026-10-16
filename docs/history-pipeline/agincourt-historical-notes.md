# Agincourt 1415 — historical notes (source-verified, Checkpoint 1)

This supersedes `docs/agincourt-historical-notes.md` for numerical claims: that earlier file was
written from general knowledge with an explicit note that nothing in it had been checked against a
source (no network access at the time). This checkpoint had `WebSearch`/`WebFetch` available and used
them — every numeric claim below carries the real URL that was actually opened, per the brief's
requirement. Where a search turned up conflicting numbers (which it did), both are kept with their
sources rather than silently picking one.

## Research workflow used (and recommended for Checkpoint 2)

1. For every scene that will say or caption a specific number (troop size, casualties, dates), run at
   least one `WebSearch` before writing the line, and prefer a second search against a different,
   more primary-leaning source when the first result's figures look like tertiary paraphrase.
2. Keep three buckets per claim: **established fact** (dates, location, broad outcome — multiple
   independent sources agree), **estimate/disputed** (anything with a number attached — always keep
   as a range or attribute it to a named historian), **creative staging** (anything the pilot draws or
   shows that is not a historical claim at all — lighting, exact soldier count on screen, banner
   designs). Never let a creative-staging choice leak into narration as if it were a fact.
3. Record the exact URL next to the number, not just the search query — a future editor must be able
   to click through and check it themselves.
4. Do not invent a source or claim one was consulted when it wasn't; this file states which two
   `WebSearch` queries were actually run and lists exactly what came back, including the ambiguity.

## Established facts (multiple sources agree)

- Fought 25 October 1415, near Agincourt in northern France, during the Hundred Years' War, with
  Henry V's English/Welsh army marching toward Calais after the siege of Harfleur.
- The French army was larger than the English army; by how much is disputed (see below).
- French losses were substantially heavier than English losses, in both killed and captured — this
  direction of the result is not in dispute across any source found, only the magnitude.

## Numeric claims — every one sourced, with the disagreement kept visible

**Troop strength** (searched: *"Battle of Agincourt 1415 troop numbers English French estimates
casualties historian Anne Curry"*, `WebSearch`, 2026-10-16):
- Historian Anne Curry's revisionist count, from pay/enrollment records (not chronicle guesses): English
  army **~8,000–9,000**, French army **~12,000** — a much less lopsided ratio than the traditional
  story. Source: [The Register, "Agincourt recount" (2009)](https://www.theregister.com/2009/10/26/agincourt_recount/)
  and [University of Sheffield, "The Battle of Agincourt"](https://newhistories.sites.sheffield.ac.uk/volumes/2009-10/volume-1/issue-1-conflict/the-battle-of-agincourt),
  both reporting Curry's figures from Kew and Bibliothèque Nationale records.
- Traditional/chronicle figures are far larger on the French side: contemporary chronicler Jean de
  Waurin claimed the French outnumbered the English six to one, and figures of **15,000–25,000**
  French are commonly repeated. Source: same two links above (they report this as the older, now-
  disputed tradition, not as fact).
- **Use in narration/captions**: state the English army as "around 8,000–9,000, tired and far from
  home" and the French army as "larger — estimates range from about 12,000 to as high as 25,000,
  depending on the source," and attribute the lower, more recent figure to modern archival research
  (Curry) rather than presenting either number as settled. Do not state a single precise number for
  either side.

**Casualties** (searched: *"Battle of Agincourt Britannica casualties French dead English losses
numbers"*, `WebSearch`, 2026-10-16):
- English dead: commonly cited as up to about **600 killed** (with roughly 112 identifiable by name).
  Source: [Wikipedia, "Battle of Agincourt"](https://en.wikipedia.org/wiki/Battle_of_Agincourt).
- French dead: commonly cited as roughly **6,000 killed**, most of them French nobility, plus
  **700–2,200 captured**. Source: same [Wikipedia](https://en.wikipedia.org/wiki/Battle_of_Agincourt)
  entry.
- A lower figure for English dead ("only 400 men") and a much higher figure for French dead (up to
  10,000, plus a separate claim of ~2,000 prisoners later executed on Henry's order) also turned up,
  from less careful secondary sources (a local-news history column and a listicle site respectively).
  These are **not used** for the pilot — they are noted here only so a future editor does not
  re-discover and accidentally cite them as if they were new. The order of execution of prisoners
  *is* a real, separately-attested event in the battle's history (chronicled independently of the
  death-toll dispute), but the "~2,000" figure for it is from the same weak source and should be
  re-checked against Curry or Barker before it goes in narration.
- **Use in narration/captions**: "the French dead are usually put at several thousand — several times
  the English losses, which were far lighter," without committing to either side's precise count, and
  cite Wikipedia's range internally in production notes, not on screen.

## Disputed or uncertain — keep out of authoritative narration, or explicitly label as disputed

- The exact ratio between the two armies (anywhere from roughly 1.5:1 to 3:1 depending on which
  historian's figures are used — see above).
- Exact deployment details: depth of the French lines, where cavalry wings stood, exactly where the
  archers and their stakes were placed relative to the line.
- The precise start time of the battle and how long the armies faced off before fighting began.
- The relative *causal* weight of mud, the narrow field, archery, and French command decisions —
  historians disagree on which mattered most; do not credit longbows or mud alone as "the reason"
  England won.

## Creative staging used in the pilot — explicitly not factual claims

- Dawn light, haze, and a low sun are atmosphere only (the historical start time is disputed, per above).
- Armies are drawn as dense, visually uniform blocks of generic stick soldiers (via `Formation`,
  `crowd.tsx`) — the real armies were not uniformly equipped, and the stick-figure count on screen
  (~700 in the far layer, ~100+4 mounted knights in the mid layer, per the repository audit) is a
  *staging* choice for visual density, not a claim about actual troop counts.
- Heraldic colors are simplified/symbolic (red cross on white for English, blue with gold marks for
  French, per `Stills.tsx`'s `Banner` component) rather than a researched reproduction of period
  heraldry; soldiers are anonymous generic figures, and the two foreground commander `Hero`s in scene
  1 are unlabeled and unnamed — consistent with the engine's existing house rule (`animation-style.md`)
  that real historical people are shown only as labeled generic figures, never a likeness.
- Stakes' number, spacing, and exact placement in front of the English line (`Stakes` in
  `MidLayer`) are illustrative, not a reconstruction of a specific documented layout.

## Sources to consult further before publishing (not yet opened in this checkpoint)

- Anne Curry, *Agincourt: A New History* (2005) — the primary modern revisionist source for troop
  numbers; this checkpoint only read secondary reporting of her figures (The Register, Sheffield),
  not the book itself.
- Juliet Barker, *Agincourt: The King, the Campaign, the Battle* (2005).
- Contemporary chronicles (*Gesta Henrici Quinti*; French chroniclers Monstrelet and Wavrin/Waurin) —
  useful as the source of the *traditional*, larger numbers, to explain on screen why two very
  different troop-count traditions exist.
- Wikipedia's own citations on the "Battle of Agincourt" page (not independently traced in this pass) —
  before publishing, pull the citation attached to the 600/6,000/700–2,200 figures used above, so the
  pilot can cite a named historian rather than "Wikipedia" if it wants a more citable source.
