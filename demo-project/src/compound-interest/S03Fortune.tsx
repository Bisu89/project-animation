import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Actor, P, SNAP, groundY } from "../stickman/stick";
import { Burst, Caption, COL, Dust, FONT, Slam, countUp, fmt } from "../stickman/fx";
import { Stage } from "../stickman/common";
import { At, Coin, GoldBar } from "../stickman/props";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S03_SFX: SfxCue[] = [
  [0, "riser", 0.5],
  [20, "gold", 0.6],
  [45, "gold", 0.6],
  [70, "kaching", 0.8],
  [108, "stinger", 0.9],
  [112, "horn", 0.5],
];

const GY = groundY(1.2);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const popScale = (f: number, at: number) => (f < at ? 0 : interpolate(f - at, [0, 6, 10], [0, 1.15, 1], { extrapolateRight: "clamp" }));

export const S03Fortune: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const amount = countUp(f, 10, 95, 5000, 150);
  const jumpY = f > 105 ? -Math.abs(Math.sin((f - 105) * 0.5)) * 40 * Math.exp(-(f - 105) * 0.08) : 0;

  return (
    <Stage
      hits={[108]}
      power={24}
      svg={
        <>
          {[
            { at: 20, x: 1120, y: GY - 20 },
            { at: 32, x: 1280, y: GY - 10 },
            { at: 45, x: 1440, y: GY - 20 },
          ].map((g, i) => {
            const s = popScale(f, g.at);
            if (s <= 0) return null;
            return (
              <At key={i} x={g.x} y={g.y} s={s}>
                <GoldBar />
              </At>
            );
          })}
          {[70, 78].map((at, i) => {
            const s = popScale(f, at);
            if (s <= 0) return null;
            return (
              <At key={i} x={1200 + i * 160} y={GY - 100} s={s * 0.8}>
                <Coin sym="$" />
              </At>
            );
          })}
          <Dust x={1280} y={GY + 40} at={20} f={f} spread={260} />
          <Burst x={960} y={340} at={108} f={f} size={300} color={COL.orange} />
          <Actor
            f={f}
            color={COL.orange}
            scale={1.2}
            base={{ x: 860, y: GY }}
            keys={[
              { f: 0, p: { ...P.cheer } },
              { f: 105, p: { ...P.cheer }, e: SNAP },
            ]}
            mod={(t, p) => ({ ...p, y: p.y + jumpY })}
          />
        </>
      }
      html={
        <>
          <Caption f={f} at={6} y={960}>
            Theo thời gian, số tiền nhỏ phát triển thành một gia tài lớn.
          </Caption>
          <div
            style={{
              position: "absolute",
              left: 1280,
              top: 220,
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
          <Slam f={f} at={108} x={960} y={430} size={100} color={COL.orange} font={FONT.comic} out={dur - 20}>
            GIA TÀI LỚN!
          </Slam>
        </>
      }
    />
  );
};
