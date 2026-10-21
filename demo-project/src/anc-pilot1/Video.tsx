import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { Captions } from "../stickman/common";
import { TIMELINE } from "./timeline";
import { cueStart } from "./cues";
import { SCENE_SPECS } from "./scenes";
import { KenBurns } from "./KenBurns";
import { EngineFade } from "./Action";
import { ACTION_SCENES } from "./ActionSprites";
import { BEDS, HITS, SFX_EVENTS } from "./sfxplan";

// Image-driven episode: one picture per narration block (public/<ASSETS>/images/sceneNN.png, listed in
// content/<slug>/scenes.csv), a smooth zoom/pan per picture, living-picture effects (Fx.tsx), sound effects placed on
// narration sentences (sfxrules.json), the narrator and burned-in subtitles.
// Scenes start on narration cues, so a re-recorded voice re-times everything.
const ASSETS = "anc-pilot1";
const OVERLAP = 12; // frames of cross-dissolve between pictures

export type SceneProps = { from: number; dur: number };

export type VideoProps = {
  music: number; // music volume (0-1)
  sfx: number; // sound-effect volume (0-1)
  voice: string; // narration file inside public/<ASSETS>/ ("" = none)
  captions: boolean; // burn the narration in as subtitles
  engine?: boolean; // use the animated vector scenes (Action.tsx) instead of pictures for scenes 1, 4, 10
  debug?: boolean; // draw the effect regions on the pictures (for placing coordinates)
};

export const DURATION = TIMELINE.durationInFrames;

const starts = SCENE_SPECS.map((s, i) => (i === 0 ? 0 : cueStart(s.firstCue) - Math.floor(OVERLAP / 2)));
const endOf = (i: number) => (i + 1 < SCENE_SPECS.length ? starts[i + 1] + OVERLAP : DURATION);

// music ducking: lower the music while the narrator speaks
const duck = (f: number) => {
  let g = 1;
  for (const c of TIMELINE.cues) {
    if (f < c.startFrame - 10) break;
    g = Math.min(g, interpolate(f, [c.startFrame - 8, c.startFrame, c.endFrame, c.endFrame + 10], [1, 0.3, 0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  return g;
};

export const Video: React.FC<VideoProps> = ({ music, sfx, voice, captions, debug, engine }) => {
  return (
    <AbsoluteFill style={{ background: "#07090c" }}>
      <Audio
        src={staticFile(`${ASSETS}/music.mp3`)}
        volume={(f) => music * (voice ? duck(f) : 1) * interpolate(f, [0, 20, DURATION - 60, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {voice && <Audio src={staticFile(`${ASSETS}/${voice}`)} />}

      {/* looping ambience beds over ranges of scenes */}
      {BEDS.map((b, k) => {
        const from = starts[b.scenes[0] - 1];
        const to = endOf(Math.min(b.scenes[1], SCENE_SPECS.length) - 1);
        const dur = to - from;
        return (
          <Sequence key={"bed" + k} from={from} durationInFrames={dur}>
            <Audio
              src={staticFile(`${ASSETS}/sfx/${b.sfx}.wav`)}
              loop
              volume={(f) => b.vol * sfx * interpolate(f, [0, 30, dur - 30, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          </Sequence>
        );
      })}

      {/* the pictures */}
      {SCENE_SPECS.map((s, i) => {
        const from = starts[i];
        const dur = endOf(i) - from;
        return (
          <Sequence key={s.i} from={from} durationInFrames={dur}>
            {engine && ACTION_SCENES[s.i] ? (
              <EngineFade dur={dur} fade={i === 0 ? 1 : OVERLAP} comp={ACTION_SCENES[s.i]} />
            ) : (
            <KenBurns src={`${ASSETS}/images/${s.image}`} dur={dur} motion={s.motion} fx={s.fx} fade={i === 0 ? 1 : OVERLAP} seed={s.image} n={s.i} from={from} firstCue={s.firstCue} hits={HITS} debug={debug} />
            )}
          </Sequence>
        );
      })}

      {/* sound effects on narration sentences */}
      {SFX_EVENTS.map((e, k) => (
        <Sequence key={"sfx" + k} from={e.frame} durationInFrames={240}>
          <Audio src={staticFile(`${ASSETS}/sfx/${e.name}.wav`)} volume={e.vol * sfx} />
        </Sequence>
      ))}

      {captions && <Captions cues={TIMELINE.cues} bottom={70} size={44} />}
    </AbsoluteFill>
  );
};

