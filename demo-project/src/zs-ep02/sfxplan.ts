import { TIMELINE } from "./timeline";
import RULES_JSON from "./sfxrules.json";

// Sound effects are placed on narration SENTENCES (regex on the sentence text), so a re-recorded voice re-times them.
// Edit sfxrules.json, check with: python scripts/check_sfx_rules.py zs-ep01
type Rule = { re: string; sfx: string; vol: number; at?: number; shake?: number };
type BedRule = { scenes: number[]; sfx: string; vol: number };

export type SfxEvent = { frame: number; name: string; vol: number; shake: number };

const rules = (RULES_JSON as { rules: Rule[] }).rules.map((r) => ({ ...r, rx: new RegExp(r.re, "i") }));

export const SFX_EVENTS: SfxEvent[] = [];
TIMELINE.cues.forEach((c) => {
  rules.forEach((r) => {
    if (r.rx.test(c.text)) SFX_EVENTS.push({ frame: c.startFrame + Math.round((r.at ?? 0) * TIMELINE.fps), name: r.sfx, vol: r.vol, shake: r.shake ?? 0 });
  });
});

// camera knocks: [global frame, strength]
export const HITS: [number, number][] = SFX_EVENTS.filter((e) => e.shake > 0).map((e) => [e.frame, e.shake] as [number, number]);

export const BEDS: BedRule[] = (RULES_JSON as { beds: BedRule[] }).beds;
