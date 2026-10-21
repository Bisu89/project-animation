import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";

// Shared kit for top-down "map" diagrams (used by every episode's Diagrams.tsx).
// Top-down "map" scenes in the series palette: sand paper, red Greek blocks, blue Persian dots, paper label cards.
// One component per diagram; `stage` picks what is shown (several narration scenes reuse one diagram).
export const { fontFamily: SERIF } = loadFont();
export const INK = "#1b1b22";
export const RED = "#b3262e";
export const BLUE = "#2c5aa0";
export const GOLD = "#d8a93c";
export const SAND = "#dcc9a0";
export const SEA = "#8fb3c4";
export const LAND = "#c9b27c";
export const ROCK = "#6f5f4e";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number) => {
  const t = interpolate(f, [a, b], [0, 1], clamp);
  return t * t * (3 - 2 * t);
};

export const Paper: React.FC<{ children: React.ReactNode; slow?: number }> = ({ children, slow = 1 }) => {
  const f = useCurrentFrame();
  const z = 1 + (f / 400) * 0.04 * slow;
  return (
    <AbsoluteFill style={{ background: SAND, overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.16 0" />
          </filter>
          <radialGradient id="vig" cx="50%" cy="50%" r="75%">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#2a1c0c" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <g style={{ transform: `scale(${z})`, transformOrigin: "50% 50%" }}>{children}</g>
        <rect width={1920} height={1080} filter="url(#grain)" />
        <rect width={1920} height={1080} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Card: React.FC<{ x: number; y: number; text: string; at: number; f: number; size?: number; to?: [number, number]; align?: "start" | "middle" }> = ({ x, y, text, at, f, size = 32, to, align = "middle" }) => {
  const o = ease(f, at, at + 12);
  const w = text.length * size * 0.68 + 46;
  const h = size * 1.7;
  const x0 = align === "middle" ? x - w / 2 : x;
  return (
    <g opacity={o} transform={`translate(0 ${(1 - o) * 14})`}>
      {to && <line x1={x0 + w / 2} y1={y + h / 2} x2={to[0]} y2={to[1]} stroke="#6b4f36" strokeWidth={3} />}
      {to && <circle cx={to[0]} cy={to[1]} r={6} fill="#6b4f36" />}
      <rect x={x0 + 3} y={y + 4} width={w} height={h} rx={7} fill="#00000040" />
      <rect x={x0} y={y} width={w} height={h} rx={7} fill="#efe3c8" stroke="#6b4f36" strokeWidth={3} />
      <text x={x0 + w / 2} y={y + h * 0.68} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} fill="#2a2118" letterSpacing={size * 0.04}>
        {text}
      </text>
    </g>
  );
};

export const Unit: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <rect x={x - 10 * s} y={y - 13 * s} width={20 * s} height={26 * s} rx={4 * s} fill={RED} stroke={INK} strokeWidth={2.5} opacity={o} />
);
export const Dot: React.FC<{ x: number; y: number; c?: string; r?: number; o?: number }> = ({ x, y, c = BLUE, r = 7, o = 1 }) => <circle cx={x} cy={y} r={r} fill={c} stroke={INK} strokeWidth={1.6} opacity={o} />;

export const bez = (p: number[][], t: number) => {
  const u = 1 - t;
  return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
};

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; p: number; w?: number }> = ({ x1, y1, x2, y2, color, p, w = 16 }) => {
  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d: number) => x - Math.cos(a + d) * 40;
  const hy = (d: number) => y - Math.sin(a + d) * 40;
  return (
    <g opacity={Math.min(1, p * 4)}>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${x},${y} L${hx(0.5)},${hy(0.5)} L${hx(-0.5)},${hy(-0.5)} Z`} fill={color} stroke={color} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

export const Ship: React.FC<{ x: number; y: number; c: string; r?: number; s?: number }> = ({ x, y, c, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-34,0 Q-30,12 0,12 Q30,12 38,-2 L28,-8 L-30,-8 Z" fill={c} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <line x1={-26} y1={-8} x2={-26} y2={-26} stroke={INK} strokeWidth={3} />
    <path d="M-26,-26 L-6,-18 L-26,-10 Z" fill="#efe3c8" stroke={INK} strokeWidth={2} />
  </g>
);

