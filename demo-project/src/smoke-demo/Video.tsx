import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import features from "./features.json";

export const FPS = 30;
export const START_SEC = 118; // where in the song the clip starts (energy rises here)
export const DURATION = FPS * 14;

const W = 1920;
const H = 1080;
const MUG = { x: 760, y: 800 }; // centre of the coffee surface
const LIFE = 6 * FPS; // a puff lives 6 s
const PER_FRAME = 2;

const at = (arr: number[], i: number) => arr[Math.max(0, Math.min(arr.length - 1, i))] ?? 0;

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const base = START_SEC * FPS;
  const now = base + frame;

  const puffs: React.ReactNode[] = [];
  for (let age = 0; age < LIFE; age++) {
    const bf = now - age; // song frame at which this puff was born
    if (bf < 0) break;
    const bass = at(features.bass, bf);
    const mid = at(features.mid, bf);
    const high = at(features.high, bf);
    const on = at(features.onset, bf);
    for (let k = 0; k < PER_FRAME; k++) {
      const seed = bf * 7 + k;
      const ph = random(`p${seed}`) * Math.PI * 2;
      const jit = random(`j${seed}`) - 0.5;
      const s = age / FPS; // seconds since birth
      const t = age / LIFE;
      // the column leans and curls: highs make it wobble wider, bass makes it fatter and brighter
      const wob = (0.5 + high * 1.6) * 34 * Math.pow(s, 0.85) * Math.sin(s * 1.7 + ph * 0.3 + bf * 0.01);
      const drift = jit * (24 + 40 * bass) * s + 22 * s * s * Math.sin(bf * 0.004);
      const x = MUG.x + wob + drift + jit * 18;
      const y = MUG.y - 120 * s - 16 * s * s;
      const r = (16 + bass * 20 + on * 12) * (1 + s * 0.85);
      const energy = 0.45 * bass + 0.4 * mid + 0.4 * on;
      const alpha = (0.035 + 0.16 * Math.min(1, energy)) * Math.pow(1 - t, 1.6) * Math.min(1, s * 5);
      if (alpha < 0.004) continue;
      puffs.push(<circle key={`${age}-${k}`} cx={x} cy={y} r={r} fill="#efe3d1" opacity={alpha} />);
    }
  }

  const mid = at(features.mid, now);
  const bass = at(features.bass, now);
  const glow = 0.55 + 0.35 * mid;
  const lampX = 1500 + Math.sin(frame / 90) * 6;
  const fade = interpolate(frame, [0, 20, DURATION - 30, DURATION], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: "#0d0a10" }}>
      <Audio src={staticFile("smoke-demo/jazz10.mp3")} startFrom={base} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ opacity: fade }}>
        <defs>
          <radialGradient id="lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffb55a" stopOpacity="0.85" />
            <stop offset="0.4" stopColor="#c4672a" stopOpacity="0.28" />
            <stop offset="1" stopColor="#2a1020" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141226" />
            <stop offset="0.75" stopColor="#2a1a26" />
            <stop offset="1" stopColor="#120c10" />
          </linearGradient>
          <linearGradient id="mug" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a2e34" />
            <stop offset="0.35" stopColor="#d9c7b0" />
            <stop offset="1" stopColor="#6b5448" />
          </linearGradient>
          <radialGradient id="vig" cx="50%" cy="55%" r="75%">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
          {/* wisps: displace the soft puffs with turbulence, then blur once for the whole column */}
          <filter id="wisp" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency={`0.006 ${0.012 + bass * 0.003}`} numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={90 + 50 * bass} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="9" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#wall)" />
        <ellipse cx={lampX} cy={330} rx={620} ry={560} fill="url(#lamp)" opacity={glow} />
        {/* bokeh: each dot breathes with a different band */}
        {Array.from({ length: 16 }, (_, i) => {
          const band = i % 3 === 0 ? bass : i % 3 === 1 ? mid : at(features.high, now);
          const bx = 980 + random(`bx${i}`) * 900;
          const by = 120 + random(`by${i}`) * 520;
          return <circle key={i} cx={bx} cy={by} r={10 + random(`br${i}`) * 26} fill="#ffcf8a" opacity={0.05 + 0.2 * band * random(`bo${i}`)} />;
        })}

        {/* table */}
        <rect x={0} y={MUG.y + 80} width={W} height={H - MUG.y - 80} fill="#1b1015" />
        <rect x={0} y={MUG.y + 80} width={W} height={5} fill="#3d2a2a" />
        <ellipse cx={MUG.x} cy={MUG.y + 92} rx={170} ry={16} fill="#000" opacity={0.5} />

        {/* mug */}
        <path d={`M ${MUG.x - 105} ${MUG.y} L ${MUG.x - 95} ${MUG.y + 86} Q ${MUG.x} ${MUG.y + 104} ${MUG.x + 95} ${MUG.y + 86} L ${MUG.x + 105} ${MUG.y} Z`} fill="url(#mug)" />
        <path d={`M ${MUG.x + 102} ${MUG.y + 16} q 62 4 52 38 q -8 26 -58 22`} fill="none" stroke="#a88e78" strokeWidth={14} strokeLinecap="round" />
        <ellipse cx={MUG.x} cy={MUG.y} rx={105} ry={22} fill="#e5d6c2" />
        <ellipse cx={MUG.x} cy={MUG.y + 2} rx={92} ry={17} fill="#2a150d" />
        <ellipse cx={MUG.x - 18} cy={MUG.y - 2} rx={38} ry={6} fill="#6b3a1e" opacity={0.6 + 0.3 * mid} />

        <g filter="url(#wisp)">{puffs}</g>
        <rect width={W} height={H} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};
