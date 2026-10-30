import React from "react";
import { INK } from "./Stick";
import { GROUND_Y, H, W } from "./Park";

// Seaside promenade (ep02): warm afternoon sky, sun, moving sea, sand, a palm, gulls, and a plank boardwalk where the
// bench stands. Same world frame as Park (1080x1920, feet on GROUND_Y) so the couple and Bench drop straight in.
const HORIZON = 900;

const Palm: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const sway = Math.sin(t * 0.8) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-18,0 Q-10,-200 40,-420 L62,-414 Q14,-200 18,0 Z" fill="#b07a4a" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${-12 + i * 2},${-40 - i * 64} l${i % 2 ? 22 : -4},-8`} stroke="#8a5a34" strokeWidth={5} strokeLinecap="round" />
      ))}
      <g transform={`translate(52 -418) rotate(${sway})`}>
        {[-160, -120, -60, -20, 20].map((a, i) => (
          <path
            key={i}
            transform={`rotate(${a})`}
            d="M0,0 Q90,-40 190,10 Q120,0 100,20 Q70,10 50,24 Q30,12 0,0 Z"
            fill={i % 2 ? "#5fb85a" : "#4fa64c"}
            stroke={INK}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        ))}
        <circle cx={-6} cy={14} r={16} fill="#8a5a34" stroke={INK} strokeWidth={5} />
        <circle cx={16} cy={18} r={15} fill="#7a4e2c" stroke={INK} strokeWidth={5} />
      </g>
    </g>
  );
};

const Gull: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const flap = Math.sin(t * 7) * 10;
  return <path d={`M${x - 30},${y + flap * 0.4} Q${x - 14},${y - 14 - flap} ${x},${y} Q${x + 14},${y - 14 - flap} ${x + 30},${y + flap * 0.4}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
};

export const Beach: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fc6ee" />
        <stop offset="0.7" stopColor="#ffd9b0" />
        <stop offset="1" stopColor="#ffc59a" />
      </linearGradient>
      <linearGradient id="bsea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3aa6c9" />
        <stop offset="1" stopColor="#6fd0e0" />
      </linearGradient>
    </defs>
    <rect width={W} height={HORIZON} fill="url(#bsky)" />
    <circle cx={780} cy={600} r={110} fill="#fff1b8" opacity={0.55} />
    <circle cx={780} cy={600} r={80} fill="#ffe27a" stroke="#f5b942" strokeWidth={6} />
    {[
      [((150 + t * 8) % 1400) - 160, 280, 1],
      [((700 + t * 5) % 1400) - 160, 420, 0.7],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.9}>
        <ellipse rx={90} ry={34} />
        <ellipse cx={-55} cy={8} rx={55} ry={26} />
        <ellipse cx={58} cy={6} rx={60} ry={28} />
        <ellipse cx={8} cy={-24} rx={50} ry={32} />
      </g>
    ))}
    <Gull x={((300 + t * 60) % 1300) - 100} y={360 + Math.sin(t * 1.3) * 12} t={t} />
    <Gull x={((420 + t * 60) % 1300) - 100} y={410 + Math.sin(t * 1.3 + 1) * 12} t={t + 0.3} />
    {/* sea with drifting wave lines and sun glitter */}
    <rect y={HORIZON} width={W} height={260} fill="url(#bsea)" />
    <line x1={0} y1={HORIZON} x2={W} y2={HORIZON} stroke="#2c86a6" strokeWidth={4} />
    {Array.from({ length: 12 }, (_, i) => {
      const row = i % 4;
      const y = HORIZON + 30 + row * 55;
      const x = ((i * 233 + t * (20 + row * 12)) % 1300) - 110;
      return <path key={i} d={`M${x},${y} q20,-12 40,0 q20,12 40,0`} stroke="#d8f4fb" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />;
    })}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={740 + i * 22 - 40} y={HORIZON + 14 + i * 26} width={90 - i * 12} height={6} rx={3} fill="#fff6c9" opacity={0.5 + 0.4 * Math.sin(t * 4 + i)} />
    ))}
    {/* surf line and sand */}
    <path d={`M0,1150 Q135,${1132 + Math.sin(t * 1.6) * 8} 270,1150 T540,1150 T810,1150 T1080,1150 L1080,1190 L0,1190 Z`} fill="#fff" opacity={0.85} />
    <rect y={1170} width={W} height={H - 1170} fill="#f3d9a4" />
    <Palm x={70} y={1200} s={1.25} t={t} />
    <Palm x={1010} y={1180} s={1.0} t={t + 1} />
    {/* boardwalk planks */}
    <rect y={1230} width={W} height={400} fill="#c8935e" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={0} y1={1230 + i * 50} x2={W} y2={1230 + i * 50} stroke="#a8743f" strokeWidth={5} />
    ))}
    {Array.from({ length: 18 }, (_, i) => {
      const row = Math.floor(i / 2);
      const x = ((row * 157 + (i % 2) * 520) % 1080) + 40;
      return <line key={i} x1={x} y1={1230 + row * 50} x2={x} y2={1280 + row * 50} stroke="#a8743f" strokeWidth={5} />;
    })}
    {/* sand in front, with a shell and a starfish */}
    <path d="M0,1630 L1080,1630 L1080,1920 L0,1920 Z" fill="#f3d9a4" stroke={INK} strokeWidth={6} />
    <path d="M150,1760 l10,-28 l10,28 l28,4 l-22,16 l8,28 l-24,-16 l-24,16 l8,-28 l-22,-16 Z" fill="#ff8a65" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M880,1800 q30,-50 60,0 Z" fill="#ffe0e6" stroke={INK} strokeWidth={4} />
    <ellipse cx={540} cy={GROUND_Y + 8} rx={400} ry={26} fill="#000" opacity={0.1} />
  </g>
);
