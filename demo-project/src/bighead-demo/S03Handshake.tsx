import React from "react";
import { useCurrentFrame } from "remotion";
import { Actor, P, SMOOTH, addPose, groundY, headAngle, walkCycle } from "../stickman/stick";
import type { Pose } from "../stickman/stick";
import { BigHead, talkCycle } from "../stickman/bighead";
import { Outfit } from "../stickman/outfit";
import { COL, FONT, Slam } from "../stickman/fx";
import { Stage } from "../stickman/common";
import { Snowfall } from "../stickman/weather";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S03_SFX: SfxCue[] = [[62, "clink", 0.7]];

const GY = groundY(1.5);
// walk while approaching (frames 0-55), hold still once the handshake pose kicks in
const walkIn = (t: number, p: Pose) => (t < 55 ? addPose(p, walkCycle(t, 0.3)) : p);

export const S03Handshake: React.FC<SceneProps> = ({ dur }) => {
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
            keys={[
              { f: 0, p: { x: 700 } },
              { f: 55, p: { x: 800 }, e: SMOOTH },
              { f: 62, p: { ...P.handshake } },
            ]}
            mod={walkIn}
            behind={(j) => <Outfit j={j} scale={1.5} type="samurai" />}
          >
            {(j) => (
              <BigHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} r={82} hair="kabuto" emotion="happy" talk={talkCycle(f)} blink={f % 75 < 4} />
            )}
          </Actor>
          <Actor
            f={f}
            headless
            color={COL.ink}
            scale={1.5}
            facing={-1}
            base={{ x: 1220, y: GY }}
            keys={[
              { f: 0, p: { x: 1220 } },
              { f: 55, p: { x: 1120 }, e: SMOOTH },
              { f: 62, p: { ...P.handshake } },
            ]}
            mod={walkIn}
            behind={(j) => <Outfit j={j} scale={1.5} type="soldier" />}
          >
            {(j) => <BigHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} r={82} hair="helmet" emotion="happy" blink={f % 85 < 4} />}
          </Actor>
        </>
      }
      html={
        <Slam f={f} at={95} x={960} y={250} size={70} color={COL.orange} font={FONT.title} weight={900} spacing={4} out={dur - 20}>
          BIGHEAD CHARACTERS
        </Slam>
      }
    />
  );
};
