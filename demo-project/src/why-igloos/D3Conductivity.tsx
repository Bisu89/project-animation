import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COL, FONT, ease } from "../stickman/fx";
import type { SceneProps } from "./Video";

const BG = "#0b1220";
const BLOCK_W = 560;
const BLOCK_H = 420;
const SNOW_X = 260;
const ICE_X = 1100;
const TOP = 280;
const START = 40; // local frame heat-flow animation begins
const PASSES_ICE = 7; // many fast passes vs one slow pass: suggests "~70x faster"

export const D3Conductivity: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 18, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blocksIn = ease(f, 0, 16);
  const span = Math.max(1, dur - 60 - START);
  const snowT = interpolate(f, [START, dur - 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iceRaw = f < START ? 0 : (((f - START) / span) * PASSES_ICE) % 1;
  const iceT = f < START ? 0 : f > dur - 60 ? 1 : iceRaw;

  const block = (x: number, label: string, fill: string, dotT: number, dotColor: string, caption: string) => (
    <>
      <rect x={x} y={TOP} width={BLOCK_W * blocksIn} height={BLOCK_H} rx={20} fill={fill} stroke={COL.paper} strokeWidth={5} opacity={blocksIn} />
      <circle cx={x + 30 + (BLOCK_W - 60) * dotT} cy={TOP + BLOCK_H / 2} r={16} fill={dotColor} opacity={f > START ? 1 : 0} />
      <text x={x + BLOCK_W / 2} y={TOP - 30} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={54} letterSpacing={4} fill={COL.paper} opacity={blocksIn}>
        {label}
      </text>
      <text
        x={x + BLOCK_W / 2}
        y={TOP + BLOCK_H + 60}
        textAnchor="middle"
        fontFamily={FONT.title}
        fontWeight={700}
        fontSize={32}
        fill={dotColor}
        opacity={ease(f, dur - 90, dur - 70)}
      >
        {caption}
      </text>
    </>
  );

  return (
    <div style={{ position: "absolute", inset: 0, background: BG, opacity: out }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        {block(SNOW_X, "SNOW", "#2a3a52", snowT, COL.orange, "SNOW ≈ STILL AIR")}
        {block(ICE_X, "ICE", "#1c4a63", iceT, COL.red, "ICE ≈ 70× FASTER")}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          textAlign: "center",
          fontFamily: FONT.body,
          fontWeight: 700,
          fontSize: 30,
          color: "#c9d2db",
          opacity: ease(f, dur - 60, dur - 40),
        }}
      >
        same thickness, very different heat flow
      </div>
    </div>
  );
};
