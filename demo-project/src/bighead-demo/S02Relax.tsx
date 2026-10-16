import React from "react";
import { useCurrentFrame } from "remotion";
import { Actor, P, groundY, headAngle } from "../stickman/stick";
import { BigHead, talkCycle } from "../stickman/bighead";
import { Outfit } from "../stickman/outfit";
import { COL } from "../stickman/fx";
import { Stage } from "../stickman/common";
import { Snowfall } from "../stickman/weather";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S02_SFX: SfxCue[] = [];

const GY = groundY(1.5);

export const S02Relax: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      svg={
        <>
          <Snowfall f={f} seed="s1" angle={10} count={70} />
          <Actor
            f={f}
            headless
            color={COL.ink}
            scale={1.5}
            facing={1}
            base={{ x: 700, y: GY }}
            keys={[{ f: 0, p: {} }]}
            mod={(t, p) => ({ ...p, y: p.y + Math.sin(t * 0.09 + 2) * 3 })}
            behind={(j) => <Outfit j={j} scale={1.5} type="samurai" />}
          >
            {(j) => <BigHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} r={82} hair="kabuto" emotion="worried" blink={f % 75 < 4} />}
          </Actor>
          <Actor
            f={f}
            headless
            color={COL.ink}
            scale={1.5}
            facing={-1}
            base={{ x: 1220, y: GY }}
            keys={[{ f: 0, p: { ...P.pointL } }]}
            behind={(j) => <Outfit j={j} scale={1.5} type="soldier" />}
          >
            {(j) => (
              <BigHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} r={82} hair="helmet" emotion="happy" talk={talkCycle(f)} blink={f % 80 < 4} />
            )}
          </Actor>
        </>
      }
    />
  );
};
