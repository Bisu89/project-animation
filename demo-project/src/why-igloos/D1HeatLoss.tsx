import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Figure, STAND } from "../stickman/stick";
import { COL, FONT, ease } from "../stickman/fx";
import type { SceneProps } from "./Video";

const BG = "#0b1220";
const CX = 960;
const CY = 560;

// 8 arrows radiating from the body, each from a different point/height and firing a little staggered.
const ARROWS: { dx: number; dy: number; from: number; len: number; delay: number }[] = [
  { dx: 0, dy: -1, from: 150, len: 280, delay: 0 },
  { dx: 0.72, dy: -0.72, from: 120, len: 260, delay: 4 },
  { dx: 1, dy: -0.08, from: 40, len: 240, delay: 8 },
  { dx: 0.6, dy: 0.55, from: 0, len: 220, delay: 12 },
  { dx: -0.72, dy: -0.72, from: 120, len: 260, delay: 4 },
  { dx: -1, dy: -0.08, from: 40, len: 240, delay: 8 },
  { dx: -0.6, dy: 0.55, from: 0, len: 220, delay: 12 },
  { dx: 0.22, dy: -1, from: 160, len: 200, delay: 16 },
];

export const D1HeatLoss: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const pose = { ...STAND, x: CX, y: CY };
  const out = interpolate(f, [dur - 18, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, background: BG, opacity: out }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
          <marker id="heatArrow" markerWidth="9" markerHeight="9" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={COL.orange} />
          </marker>
        </defs>
        <Figure pose={pose} color="#aeb9c4" scale={1.6} face="none" />
        {ARROWS.map((ar, i) => {
          const t = ease(f, 14 + ar.delay, 26 + ar.delay);
          const x1 = CX + ar.dx * ar.from;
          const y1 = CY + ar.dy * ar.from - 120;
          const x2 = CX + ar.dx * (ar.from + ar.len * t);
          const y2 = CY + ar.dy * (ar.from + ar.len * t) - 120;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={COL.orange}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={t}
              markerEnd="url(#heatArrow)"
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 860,
          textAlign: "center",
          fontFamily: FONT.title,
          fontWeight: 900,
          fontSize: 64,
          letterSpacing: 6,
          color: COL.orange,
          opacity: ease(f, 30, 42),
        }}
      >
        HEAT LOSS
      </div>
    </div>
  );
};
