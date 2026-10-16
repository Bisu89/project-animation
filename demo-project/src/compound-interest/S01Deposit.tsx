import React from "react";
import { useCurrentFrame } from "remotion";
import { Actor, P, SMOOTH, groundY } from "../stickman/stick";
import { Burst, Caption, COL, FONT, countUp, fmt } from "../stickman/fx";
import { Stage } from "../stickman/common";
import { At, Bank, Bill } from "../stickman/props";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

export const S01_SFX: SfxCue[] = [
  [58, "thud", 0.6],
  [60, "kaching", 0.9],
  [64, "ding", 0.6],
];

const GY = groundY(1.15);

export const S01Deposit: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const billOpacity = f < 56 ? 1 : Math.max(0, 1 - (f - 56) / 6);
  const amount = countUp(f, 60, 85, 100);

  return (
    <Stage
      hits={[60]}
      power={14}
      svg={
        <>
          <At x={1280} y={GY} s={1.3}>
            <Bank label="NGÂN HÀNG" />
          </At>
          <Burst x={1280} y={GY - 40} at={60} f={f} size={160} color={COL.gold} />
          <Actor
            f={f}
            color={COL.orange}
            scale={1.15}
            base={{ x: 860, y: GY }}
            keys={[
              { f: 0, p: { ...P.carry } },
              { f: 40, p: { ...P.carry } },
              { f: 56, p: { lean: 18, ra1: 70, ra2: 10, la1: -70, la2: -10 }, e: SMOOTH },
              { f: 66, p: { lean: 0, ra1: 18, ra2: -8, la1: -18, la2: 8, ll1: -12, ll2: 4, rl1: 12, rl2: -4 } },
            ]}
          >
            {(j) =>
              billOpacity > 0 ? (
                <At x={(j.lHand[0] + j.rHand[0]) / 2} y={(j.lHand[1] + j.rHand[1]) / 2} s={0.9} o={billOpacity}>
                  <Bill />
                </At>
              ) : null
            }
          </Actor>
        </>
      }
      html={
        <>
          <Caption f={f} at={6} y={960}>
            Bạn gửi một trăm đô la vào ngân hàng.
          </Caption>
          {f >= 60 && (
            <div
              style={{
                position: "absolute",
                left: 1280,
                top: 300,
                transform: "translate(-50%,-50%)",
                fontFamily: FONT.title,
                fontWeight: 900,
                fontSize: 90,
                color: COL.green,
              }}
            >
              ${fmt(amount)}
            </div>
          )}
        </>
      }
    />
  );
};
