import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { Captions } from "../stickman/common";
import { TIMELINE } from "./timeline";
import { cueStart } from "./cues";
import { SCENE_SPECS } from "./scenes";
import { VISUALS } from "./visuals";
import { KenBurns } from "./KenBurns";
import { Soundtrack } from "../anc-lib/Soundtrack";
import { BEDS, SFX_EVENTS } from "./sfxplan";
import { DIAGRAMS } from "./Diagrams";
import { EngineFade } from "../anc-pilot1/Action";
import { ACTION } from "./ActionSprites";

// Thermopylae, episode 1. One visual per narration block (scenes.csv + visuals.ts): AI pictures with a slow camera move,
// sprite animation for the action scenes, SVG diagrams for the explanations. Narration + burned-in subtitles. No music yet.
const { fontFamily: SERIF } = loadFont();
const ASSETS = "anc-ep03";
const OVERLAP = 12;

export type VideoProps = { music: number; sfx: number; voice: string; captions: boolean; debug?: boolean };

export const DURATION = TIMELINE.durationInFrames;

const starts = SCENE_SPECS.map((s, i) => (i === 0 ? 0 : cueStart(s.firstCue) - Math.floor(OVERLAP / 2)));
const endOf = (i: number) => (i + 1 < SCENE_SPECS.length ? starts[i + 1] + OVERLAP : DURATION);


const ChapterTitle: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 14, 100, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 58, opacity: o }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 54, letterSpacing: 8, color: "#f3ead3", textTransform: "uppercase", textShadow: "0 3px 12px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)" }}>{text}</div>
    </AbsoluteFill>
  );
};

export const Video: React.FC<VideoProps> = ({ music, sfx, voice, captions }) => {
  return (
    <AbsoluteFill style={{ background: "#07090c" }}>
      {voice && <Audio src={staticFile(`${ASSETS}/${voice}`)} />}
      <Soundtrack slug={ASSETS} music={music} sfx={sfx} duration={DURATION} cues={TIMELINE.cues} events={SFX_EVENTS} beds={BEDS} starts={starts} ends={SCENE_SPECS.map((_, i) => endOf(i))} voice={!!voice} />

      {SCENE_SPECS.map((s, i) => {
        const from = starts[i];
        const dur = endOf(i) - from;
        const v = VISUALS[s.i];
        const fade = i === 0 ? 1 : OVERLAP;
        let body: React.ReactNode;
        if (v.kind === "act") {
          body = <EngineFade dur={dur} fade={fade} comp={ACTION[v.key]} />;
        } else if (v.kind === "diag") {
          const Dg = DIAGRAMS[v.key];
          const Wrap: React.FC = () => <Dg stage={v.stage} />;
          body = <EngineFade dur={dur} fade={fade} comp={Wrap} />;
        } else {
          const src = `${ASSETS}/images/${v.file}`;
          body = <KenBurns src={src} dur={dur} motion={s.motion} fx={s.fx} fade={fade} seed={s.image} n={s.i} from={from} firstCue={s.firstCue} hits={[]} />;
        }
        return (
          <Sequence key={s.i} from={from} durationInFrames={dur}>
            {body}
          </Sequence>
        );
      })}

      {SCENE_SPECS.map((s, i) =>
        i > 0 && SCENE_SPECS[i - 1].chapter !== s.chapter ? (
          <Sequence key={"ch" + i} from={starts[i] + 10} durationInFrames={120}>
            <ChapterTitle text={s.chapter} />
          </Sequence>
        ) : null
      )}

      {captions && <Captions cues={TIMELINE.cues} bottom={70} size={44} />}
    </AbsoluteFill>
  );
};
