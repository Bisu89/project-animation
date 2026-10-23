import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import type { BedRule, SfxEvent } from "./sfxplan";

// Music (ducked under the narrator), looping ambience beds over ranges of scenes, and one-shot effects.
// Effects live in public/anc-sfx/sfx/<name>.wav (python scripts/gen_anc_sfx.py); music in public/<slug>/music.mp3.
const SFX_DIR = "anc-sfx/sfx";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Soundtrack: React.FC<{
  slug: string;
  music: number;
  sfx: number;
  duration: number;
  cues: { startFrame: number; endFrame: number }[];
  events: SfxEvent[];
  beds: BedRule[];
  starts: number[];
  ends: number[];
  voice: boolean;
}> = ({ slug, music, sfx, duration, cues, events, beds, starts, ends, voice }) => {
  const duck = (f: number) => {
    let g = 1;
    for (const c of cues) {
      if (f < c.startFrame - 10) break;
      g = Math.min(g, interpolate(f, [c.startFrame - 8, c.startFrame, c.endFrame, c.endFrame + 10], [1, 0.32, 0.32, 1], clamp));
    }
    return g;
  };
  return (
    <>
      {music > 0 && (
        <Audio src={staticFile(`${slug}/music.mp3`)} volume={(f) => music * (voice ? duck(f) : 1) * interpolate(f, [0, 20, duration - 60, duration], [0, 1, 1, 0], clamp)} />
      )}
      {sfx > 0 &&
        beds.map((b, k) => {
          const from = starts[b.scenes[0] - 1];
          const to = ends[Math.min(b.scenes[1], ends.length) - 1];
          const dur = to - from;
          return (
            <Sequence key={"bed" + k} from={from} durationInFrames={dur}>
              <Audio src={staticFile(`${SFX_DIR}/${b.sfx}.wav`)} loop volume={(f) => b.vol * sfx * interpolate(f, [0, 30, dur - 30, dur], [0, 1, 1, 0], clamp)} />
            </Sequence>
          );
        })}
      {sfx > 0 &&
        events.map((e, k) => (
          <Sequence key={"sfx" + k} from={e.frame} durationInFrames={240}>
            <Audio src={staticFile(`${SFX_DIR}/${e.name}.wav`)} volume={e.vol * sfx} />
          </Sequence>
        ))}
    </>
  );
};
