import React from "react";
import { AbsoluteFill } from "remotion";

export const HORIZON = 520;

// Shared battlefield backdrop (sky, wooded flanks, ploughed field) so every Agincourt scene sits in
// the same place. Defaults reproduce scene 1's original dawn look exactly; `overcast` greys the sky
// and sun out for the wet scenes. `mud` darkens the ground and adds puddles.
export const Backdrop: React.FC<{ id?: string; overcast?: boolean; mud?: boolean }> = ({ id = "bd", overcast = false, mud = false }) => {
  const sky = overcast ? ["#8f979e", "#bdb8a4"] : ["#bcc8d8", "#f3e3c8"];
  const soil = mud ? ["#6f5f3e", "#3f3320"] : ["#9a8a64", "#6a5a3c"];
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky[0]} />
            <stop offset="1" stopColor={sky[1]} />
          </linearGradient>
          <linearGradient id={`${id}-soil`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={soil[0]} />
            <stop offset="1" stopColor={soil[1]} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={HORIZON + 4} fill={`url(#${id}-sky)`} />
        {!overcast && <circle cx={960} cy={HORIZON - 20} r={90} fill="#fbe8c0" opacity={0.7} />}
        <path d={`M0,${HORIZON} L0,${HORIZON - 70} Q120,${HORIZON - 110} 220,${HORIZON - 60} Q300,${HORIZON - 40} 360,${HORIZON} Z`} fill={overcast ? "#4b5646" : "#4a5a3f"} />
        <path d={`M1920,${HORIZON} L1920,${HORIZON - 80} Q1800,${HORIZON - 120} 1700,${HORIZON - 70} Q1620,${HORIZON - 40} 1560,${HORIZON} Z`} fill={overcast ? "#4b5646" : "#4a5a3f"} />
        <rect x={0} y={HORIZON} width={1920} height={1080 - HORIZON} fill={`url(#${id}-soil)`} />
        {Array.from({ length: 16 }).map((_, i) => {
          const t = i / 15;
          const y = HORIZON + 10 + t * t * 520;
          return <line key={i} x1={0} y1={y} x2={1920} y2={y} stroke="#4a3c24" strokeWidth={1 + t * 5} opacity={0.18} />;
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={260 + i * 280} cy={700 + (i % 3) * 90} rx={70 + (i % 2) * 40} ry={9 + (i % 2) * 4} fill="#8fa3b0" opacity={mud ? 0.5 : 0.35} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// translucent mud patches over a stretch of ground (x0..x1), drawn on top of the backdrop
export const MudPatch: React.FC<{ x0: number; x1: number }> = ({ x0, x1 }) => (
  <g>
    {Array.from({ length: 14 }).map((_, i) => {
      const t = i / 13;
      const cx = x0 + (x1 - x0) * ((i * 0.618) % 1);
      const cy = 740 + ((i * 7) % 5) * 52 + t * 20;
      return <ellipse key={i} cx={cx} cy={cy} rx={90 + (i % 4) * 34} ry={14 + (i % 3) * 5} fill="#2e2515" opacity={0.5} />;
    })}
    {Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={`w${i}`} cx={x0 + ((i * 0.37 + 0.1) % 1) * (x1 - x0)} cy={770 + (i % 3) * 70} rx={46} ry={7} fill="#9fb0b8" opacity={0.45} />
    ))}
  </g>
);
