import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { Captions } from "../stickman/common";
import { SfxCue } from "./sfx";
import { TIMELINE } from "./timeline";
import { ImageScene } from "./ImageScene";
import { D1HeatLoss } from "./D1HeatLoss";
import { D2TrappedAir } from "./D2TrappedAir";
import { D3Conductivity } from "./D3Conductivity";

// Folder in public/ with music.mp3, sfx/*.wav and (optionally) the voiceover.
const ASSETS = "why-igloos";

export type SceneProps = { from: number; dur: number };
type Scene = { c: React.FC<SceneProps>; from: number; sfx?: SfxCue[] };

type ImgOpts = { tag?: string; zoomTo?: number; panX?: number; snow?: boolean; blizzard?: boolean };
const img = (file: string, from: number, o: ImgOpts = {}): Scene => ({
  c: (p) => (
    <ImageScene {...p} src={`${ASSETS}/images/${file}`} tag={o.tag} zoomTo={o.zoomTo ?? 1.1} panX={o.panX ?? 0} snow={o.snow} blizzard={o.blizzard} />
  ),
  from,
});

// STORY scenes (AI-generated photos, public/why-igloos/images/) alternate with DIAGRAM
// scenes (drawn in code). Every start is a timeline cue's startFrame, so the picture always
// changes exactly when a new line of narration/caption begins.
// Fire (weather.tsx) is not used on the STORY photos: its flat layered-vector shape would
// clash against painterly images, so it's saved for flat/vector scenes (e.g. the D* diagrams,
// or a future stickman-style video). Snow/Wind are small/thin enough to blend into any art style.
export const SCENES: Scene[] = [
  img("scene1.png", TIMELINE.cues[0].startFrame, { zoomTo: 1.14, panX: -50, snow: true }), // hook: hunter cutting blocks
  img("scene2.png", TIMELINE.cues[2].startFrame, { tag: "WINTER HUNTING SHELTER", zoomTo: 1.1, panX: 60, snow: true }), // promise + scope
  img("scene3.png", TIMELINE.cues[5].startFrame, { zoomTo: 1.16, panX: 35, blizzard: true }), // flip: snow looks like the enemy
  { c: D1HeatLoss, from: TIMELINE.cues[7].startFrame }, // flip: the real question is heat loss
  { c: D2TrappedAir, from: TIMELINE.cues[12].startFrame }, // principle: snow is mostly trapped air
  img("scene6.png", TIMELINE.cues[15].startFrame, { tag: "LIKE A DOWN JACKET", zoomTo: 1.1, panX: -45, snow: true }), // principle: jacket/window comparison
  { c: D3Conductivity, from: TIMELINE.cues[17].startFrame }, // principle: conductivity contrast
  img("scene8.png", TIMELINE.cues[21].startFrame, { tag: "BODY HEAT WARMS THE DOME", zoomTo: 1.1, panX: 45, snow: true }), // how it works
  img("scene9.png", TIMELINE.cues[26].startFrame, { tag: "AIR THAT CAN'T MOVE", zoomTo: 1.14, panX: -55, snow: true }), // honest limit + outro
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
    <AbsoluteFill style={{ background: "#0a0e14" }}>
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
