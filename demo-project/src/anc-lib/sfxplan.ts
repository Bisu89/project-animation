// Sound effects are placed on narration SENTENCES (regex on the sentence text), so a re-recorded voice re-times them.
// Each episode keeps its own sfxrules.json; check it with: python scripts/check_sfx_rules.py <slug>
type Rule = { re: string; sfx: string; vol: number; at?: number };
export type BedRule = { scenes: number[]; sfx: string; vol: number };
export type SfxEvent = { frame: number; name: string; vol: number };
type TimelineLike = { fps: number; cues: { text: string; startFrame: number }[] };

export const buildPlan = (timeline: TimelineLike, json: { rules: Rule[]; beds: BedRule[] }) => {
  const rules = json.rules.map((r) => ({ ...r, rx: new RegExp(r.re, "i") }));
  const events: SfxEvent[] = [];
  timeline.cues.forEach((c) => {
    rules.forEach((r) => {
      if (r.rx.test(c.text)) events.push({ frame: c.startFrame + Math.round((r.at ?? 0) * timeline.fps), name: r.sfx, vol: r.vol });
    });
  });
  return { events, beds: json.beds };
};
