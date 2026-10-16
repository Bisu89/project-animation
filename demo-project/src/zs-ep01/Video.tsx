import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { Captions } from "../stickman/common";
import { TIMELINE } from "./timeline";
import { cueStart } from "./cues";
import { SCENE_SPECS } from "./scenes";
import { KenBurns } from "./KenBurns";

// Image-driven episode: one picture per narration block (public/<ASSETS>/images/sceneNN.png, listed in
// content/<slug>/scenes.csv), a smooth zoom/pan per picture, light ambient fx, the narrator and burned-in
// subtitles. Scenes start on narration cues, so a re-recorded voice re-times everything.
const ASSETS = "zs-ep01";
const OVERLAP = 12; // frames of cross-dissolve between pictures

export type VideoProps = {
  music: number; // music volume (0-1)
  sfx: number; // kept for the shared props shape
  voice: string; // narration file inside public/<ASSETS>/ ("" = none)
  captions: boolean; // burn the narration in as subtitles
};

export const DURATION = TIMELINE.durationInFrames;

const starts = SCENE_SPECS.map((s, i) => (i === 0 ? 0 : cueStart(s.firstCue) - Math.floor(OVERLAP / 2)));

// music ducking: lower the music while the narrator speaks
const duck = (f: number) => {
  let g = 1;
  for (const c of TIMELINE.cues) {
    if (f < c.startFrame - 10) break;
    g = Math.min(g, interpolate(f, [c.startFrame - 8, c.startFrame, c.endFrame, c.endFrame + 10], [1, 0.3, 0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  return g;
};

export const Video: React.FC<VideoProps> = ({ music, voice, captions }) => {
  return (
    <AbsoluteFill style={{ background: "#07090c" }}>
      <Audio
        src={staticFile(`${ASSETS}/music.mp3`)}
        volume={(f) => music * (voice ? duck(f) : 1) * interpolate(f, [0, 20, DURATION - 60, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {voice && <Audio src={staticFile(`${ASSETS}/${voice}`)} />}
      {SCENE_SPECS.map((s, i) => {
        const from = starts[i];
        const end = i + 1 < SCENE_SPECS.length ? starts[i + 1] + OVERLAP : DURATION;
        const dur = end - from;
        return (
          <Sequence key={s.i} from={from} durationInFrames={dur}>
            <KenBurns src={`${ASSETS}/images/${s.image}`} dur={dur} motion={s.motion} fx={s.fx} fade={i === 0 ? 1 : OVERLAP} seed={s.image} />
          </Sequence>
        );
      })}
      {captions && <Captions cues={TIMELINE.cues} bottom={70} size={44} />}
    </AbsoluteFill>
  );
};
