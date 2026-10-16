import React from "react";
import { useCurrentFrame } from "remotion";
import { Actor, P, groundY, headAngle } from "../stickman/stick";
import { BigHead, talkCycle } from "../stickman/bighead";
import { COL } from "../stickman/fx";
import { Stage } from "../stickman/common";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S01_SFX: SfxCue[] = [];

const GY = groundY(1.5);

// one character: fully poseable stick body (Actor, headless) + a BigHead attached at the
// head joint, so the body keeps every existing pose/walk/run while the head gets upgraded.
const Character: React.FC<{
  x: number;
  f: number;
  color: string;
  hair: "bun" | "short" | "ponytail";
  emotion: "worried" | "angry" | "happy";
  talk?: boolean;
  label: string;
}> = ({ x, f, color, hair, emotion, talk, label }) => (
  <Actor
    f={f}
    headless
    color={color}
    scale={1.5}
    base={{ x, y: GY }}
    keys={[
      { f: 0, p: emotion === "angry" ? { ...P.pointR } : emotion === "happy" ? { ...P.cheer } : { ...P.stand } },
    ]}
    mod={(t, p) => ({ ...p, y: p.y + Math.sin(t * 0.08) * 4 })}
  >
    {(j) => (
      <BigHead
        x={j.headC[0]}
        y={j.headC[1]}
        angle={headAngle(j)}
        r={82}
        hair={hair}
        emotion={emotion}
        talk={talk ? talkCycle(f) : 0}
        blink={f % 90 < 4}
        label={label}
      />
    )}
  </Actor>
);

export const S01BigHeadTest: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      svg={
        <>
          <Character x={480} f={f} color={COL.blue} hair="bun" emotion="worried" talk label="BUN / WORRIED" />
          <Character x={960} f={f} color={COL.red} hair="short" emotion="angry" label="SHORT / ANGRY" />
          <Character x={1440} f={f} color={COL.green} hair="ponytail" emotion="happy" talk label="PONYTAIL / HAPPY" />
        </>
      }
    />
  );
};
