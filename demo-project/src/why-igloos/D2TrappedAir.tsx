import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COL, FONT, ease } from "../stickman/fx";
import type { SceneProps } from "./Video";

const BG = "#0b1220";

// Hand-placed grains so there is obvious empty space ("trapped air") between them.
const GRAINS: { x: number; y: number; r: number; delay: number }[] = [
  { x: 740, y: 360, r: 46, delay: 0 },
  { x: 900, y: 320, r: 34, delay: 2 },
  { x: 1060, y: 380, r: 50, delay: 4 },
  { x: 1220, y: 340, r: 32, delay: 6 },
  { x: 650, y: 520, r: 38, delay: 3 },
  { x: 1180, y: 540, r: 44, delay: 7 },
  { x: 820, y: 600, r: 30, delay: 9 },
  { x: 1000, y: 620, r: 40, delay: 5 },
  { x: 1300, y: 480, r: 36, delay: 10 },
  { x: 700, y: 700, r: 44, delay: 11 },
  { x: 950, y: 740, r: 32, delay: 8 },
  { x: 1140, y: 700, r: 38, delay: 12 },
  { x: 1280, y: 650, r: 28, delay: 13 },
  { x: 580, y: 420, r: 30, delay: 14 },
];

export const D2TrappedAir: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [dur - 18, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const box = ease(f, 0, 14);

  return (
    <div style={{ position: "absolute", inset: 0, background: BG, opacity: out }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <rect
          x={520}
          y={220}
          width={840 * box}
          height={600}
          rx={24}
          fill="#152033"
          stroke={COL.paper}
          strokeWidth={5}
          opacity={box}
        />
        {GRAINS.map((g, i) => {
          const t = ease(f, 18 + g.delay, 30 + g.delay, 0, 1);
          return <circle key={i} cx={g.x} cy={g.y} r={g.r * t} fill="#dfefff" stroke="#9fc3dd" strokeWidth={3} opacity={t} />;
        })}
        {/* label pointing at an empty gap: trapped air */}
        <g opacity={ease(f, 44, 56)}>
          <line x1={1160} y1={400} x2={1030} y2={460} stroke={COL.orange} strokeWidth={5} />
          <circle cx={1030} cy={460} r={8} fill={COL.orange} />
        </g>
        {/* label pointing at a grain: ice crystals */}
        <g opacity={ease(f, 58, 70)}>
          <line x1={600} y1={620} x2={700} y2={700} stroke={COL.blue} strokeWidth={5} />
          <circle cx={700} cy={700} r={8} fill={COL.blue} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 330,
          fontFamily: FONT.title,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 2,
          color: COL.orange,
          textShadow: "0 2px 10px rgba(0,0,0,0.7)",
          opacity: ease(f, 44, 56),
        }}
      >
        TRAPPED AIR
      </div>
      <div
        style={{
          position: "absolute",
          left: 420,
          top: 740,
          fontFamily: FONT.title,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 2,
          color: COL.blue,
          textShadow: "0 2px 10px rgba(0,0,0,0.7)",
          opacity: ease(f, 58, 70),
        }}
      >
        ICE CRYSTALS
      </div>
    </div>
  );
};
