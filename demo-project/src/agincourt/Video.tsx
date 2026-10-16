import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COL } from "../stickman/fx";
import { Captions, ChapterCard } from "../stickman/common";
import { CARD, SfxCue } from "./sfx";
import { TIMELINE } from "./timeline";
import { cueStart } from "./cues";
import { S01Armies } from "./S01Armies";
import { S02Map } from "./S02Map";
import { S03Volley } from "./S03Volley";
import { S04Advance } from "./S04Advance";
import { S05Combat } from "./S05Combat";
import { S06Aftermath } from "./S06Aftermath";

// Folder in public/ with music.mp3, sfx/*.wav and (optionally) the voiceover.
const ASSETS = "agincourt";

export type SceneProps = { from: number; dur: number };
type Scene = { c: React.FC<SceneProps>; from: number; sfx?: SfxCue[] };

// restrained cut: a short dip to black at the start/end of a scene instead of a hard cut
const DipFade: React.FC<{ dur: number; fadeIn: boolean; fadeOut: boolean }> = ({ dur, fadeIn, fadeOut }) => {
  const f = useCurrentFrame();
  const a = fadeIn ? interpolate(f, [0, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const b = fadeOut ? interpolate(f, [dur - 10, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const o = Math.max(a, b);
  return o > 0 ? <AbsoluteFill style={{ background: "#0d0d0d", opacity: o, pointerEvents: "none" }} /> : null;
};

const chapter = (n: string, title: string, sub: string, from: number): Scene => ({
  c: ({ dur }) => <ChapterCard n={n} title={title} sub={sub} dur={dur} />,
  from,
  sfx: CARD,
});

// Each scene lasts until the next one starts.
// WITH a voiceover: start scenes on timeline frames (a cue's startFrame) so the picture
// stays in sync with the voice. WITHOUT a voiceover: pick the starts freely (pacing is
// set by the animation and the on-screen text) and set DURATION below.
export const SCENES: Scene[] = [
  { c: S01Armies, from: 0 },
  { c: S02Map, from: cueStart(3) },
  { c: S03Volley, from: cueStart(6), sfx: [[4, "horn", 0.35], [62, "swish", 0.45], [74, "swish", 0.3], [162, "swish", 0.45], [174, "swish", 0.3]] },
  { c: S04Advance, from: cueStart(8) },
  { c: S05Combat, from: cueStart(10), sfx: [[52, "clink", 0.4], [80, "clink", 0.3], [118, "clink", 0.35], [160, "clink", 0.3], [214, "thud", 0.5]] },
  { c: S06Aftermath, from: cueStart(13) },
];

// With a voiceover this must stay = the narration length. Without one, use the end of the last scene.
export const DURATION = TIMELINE.durationInFrames;

export type VideoProps = {
  music: number; // music volume (0-1)
  sfx: number; // sound-effects volume (0-1)
  voice: string; // voiceover file name inside public/<ASSETS>/ ("" = none)
  captions: boolean; // burn the narration in as subtitles
};

// music ducking: lower the music while the narrator speaks
const duck = (f: number) => {
  let g = 1;
  for (const c of TIMELINE.cues) {
    if (f < c.startFrame - 10) break;
    g = Math.min(
      g,
      interpolate(f, [c.startFrame - 8, c.startFrame, c.endFrame, c.endFrame + 10], [1, 0.4, 0.4, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  return g;
};

export const Video: React.FC<VideoProps> = ({ music, sfx, voice, captions }) => {
  return (
    <AbsoluteFill style={{ background: COL.paper }}>
      <Audio
        src={staticFile(`${ASSETS}/music.mp3`)}
        volume={(f) =>
          music *
          (voice ? duck(f) : 1) *
          interpolate(f, [0, 10, DURATION - 45, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      {voice && <Audio src={staticFile(`${ASSETS}/${voice}`)} />}
      {SCENES.map(({ c: C, from, sfx: cues }, i) => {
        const dur = (SCENES[i + 1]?.from ?? DURATION) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <C from={from} dur={dur} />
            <DipFade dur={dur} fadeIn={i > 0} fadeOut={i < SCENES.length - 1} />
            {cues?.map(([f, name, v = 1], k) => (
              <Sequence key={k} from={f} layout="none">
                {/* eslint-disable-next-line @remotion/volume-callback -- constant per-effect volume */}
                <Audio src={staticFile(`${ASSETS}/sfx/${name}.wav`)} volume={v * sfx} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      {captions && <Captions cues={TIMELINE.cues} />}
    </AbsoluteFill>
  );
};

// keep the helper referenced until the first chapter is added
export const _chapter = chapter;
