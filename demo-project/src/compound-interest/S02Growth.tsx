import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, addPose, groundY, idle } from "../stickman/stick";
import { Caption, COL, FONT, countUp, fmt } from "../stickman/fx";
import { Stage } from "../stickman/common";
import { At, Coin } from "../stickman/props";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S02_SFX: SfxCue[] = [
  [10, "pop", 0.6],
  [35, "pop", 0.6],
  [60, "pop", 0.6],
  [66, "gold", 0.7],
];

const GY = groundY(1.1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const popScale = (f: number, at: number) => (f < at ? 0 : interpolate(f - at, [0, 6, 10], [0, 1.15, 1], { extrapolateRight: "clamp" }));

export const S02Growth: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const amount = countUp(f, 20, 100, 150, 100);

  return (
    <Stage
      svg={
        <>
          {[10, 35, 60].map((at, i) => {
            const s = popScale(f, at);
            if (s <= 0) return null;
            return (
              <At key={i} x={1280} y={GY - 60 - i * 70} s={s * 0.9}>
                <Coin sym="$" />
              </At>
            );
          })}
          <Actor
            f={f}
            color={COL.orange}
            scale={1.15}
            base={{ x: 860, y: GY }}
            keys={[{ f: 0, p: { ...P.cheer } }]}
            mod={(t, p) => addPose(p, idle(t, 2))}
          />
        </>
      }
      html={
        <>
          <Caption f={f} at={6} y={960}>
            Mỗi năm, tiền lãi lại tiếp tục sinh thêm lãi.
          </Caption>
          <div
            style={{
              position: "absolute",
              left: 1280,
              top: 260,
              transform: "translate(-50%,-50%)",
              fontFamily: FONT.title,
              fontWeight: 900,
              fontSize: 90,
              color: COL.green,
              opacity: interpolate(f, [0, 10], [0, 1], clamp),
            }}
          >
            ${fmt(amount)}
          </div>
        </>
      }
    />
  );
};
