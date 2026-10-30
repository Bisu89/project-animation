import React from "react";
import { INK } from "./Stick";

// The park, drawn in code (flat illustration, soft colours, ink outlines): sky, drifting clouds, far city, trees,
// lamp post, path, and the bench the couple sits on. World = 1080x1920; the bench seat top is at SEAT_Y.
export const W = 1080;
export const H = 1920;
export const SEAT_Y = 1240;
export const GROUND_Y = 1445;

const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.92}>
    <ellipse cx={0} cy={0} rx={90} ry={38} />
    <ellipse cx={-55} cy={8} rx={60} ry={30} />
    <ellipse cx={60} cy={6} rx={65} ry={32} />
    <ellipse cx={10} cy={-28} rx={55} ry={36} />
  </g>
);

const Tree: React.FC<{ x: number; y: number; s: number; tone: number; t: number }> = ({ x, y, s, tone, t }) => {
  const g = ["#7cc36a", "#6cb35c", "#8fd07a"][tone];
  const d = ["#5a9c4c", "#4f8f43", "#6db35d"][tone];
  const sway = Math.sin(t * 0.9 + x) * 1.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22,0 L-16,-260 Q0,-300 16,-260 L22,0 Z" fill="#9a6b45" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-6,-170 Q-50,-220 -80,-230 M8,-200 Q50,-250 70,-262" stroke="#9a6b45" strokeWidth={14} strokeLinecap="round" fill="none" />
      <g transform={`rotate(${sway} 0 -260)`}>
        {[
          [0, -390, 150],
          [-120, -300, 105],
          [120, -310, 110],
          [-70, -470, 110],
          [80, -460, 115],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={g} stroke={INK} strokeWidth={6} />
        ))}
        {[
          [0, -390, 150],
          [-120, -300, 105],
          [120, -310, 110],
          [-70, -470, 110],
          [80, -460, 115],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r - 3} fill={g} />
        ))}
        {[
          [-40, -330],
          [60, -380],
          [-90, -430],
          [100, -290],
          [10, -470],
        ].map(([cx, cy], i) => (
          <path key={i} d={`M${cx - 18},${cy} q18,-16 36,0`} stroke={d} strokeWidth={7} fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};

export const Park: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fd0f0" />
        <stop offset="1" stopColor="#e4f5fb" />
      </linearGradient>
      <linearGradient id="path" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ecdcbd" />
        <stop offset="1" stopColor="#f3e7cf" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#sky)" />
    <Cloud x={((180 + t * 9) % 1400) - 160} y={300} s={1.1} />
    <Cloud x={((820 + t * 6) % 1400) - 160} y={470} s={0.8} />
    <Cloud x={((520 + t * 4) % 1400) - 160} y={170} s={0.6} />
    {/* far city */}
    <g fill="#c6dce8">
      {[
        [0, 760, 120],
        [110, 700, 90],
        [190, 790, 140],
        [320, 730, 80],
        [690, 720, 110],
        [790, 650, 85],
        [870, 760, 130],
        [990, 700, 90],
      ].map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={1000 - y} />
      ))}
    </g>
    {/* hedge band and lawn */}
    <path d={`M0,930 Q140,880 280,925 Q420,870 560,920 Q720,875 860,925 Q980,885 1080,915 L1080,1080 L0,1080 Z`} fill="#8bc979" stroke={INK} strokeWidth={6} />
    <rect y={1000} width={W} height={H - 1000} fill="#a6d98d" />
    <Tree x={110} y={1040} s={1.15} tone={0} t={t} />
    <Tree x={560} y={985} s={0.62} tone={2} t={t} />
    <Tree x={990} y={1060} s={1.25} tone={1} t={t} />
    {/* lamp post */}
    <g>
      <rect x={866} y={660} width={16} height={460} fill="#4a5060" stroke={INK} strokeWidth={5} />
      <path d="M848,670 L900,670 L912,620 L836,620 Z" fill="#fff3bf" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M830,620 L918,620 L874,585 Z" fill="#4a5060" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
    {/* path */}
    <path d={`M0,1120 Q540,1090 1080,1120 L1080,1620 Q540,1660 0,1620 Z`} fill="url(#path)" stroke="#c9b48c" strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <ellipse key={i} cx={90 + i * 190} cy={1560 + (i % 2) * 22} rx={26} ry={8} fill="#d8c49c" />
    ))}
    {/* foreground grass tufts */}
    {Array.from({ length: 14 }, (_, i) => {
      const x = 30 + i * 78;
      const y = 1700 + (i % 3) * 40;
      return <path key={i} d={`M${x - 16},${y} q6,-30 10,-40 q2,22 6,40 q6,-26 14,-34 q-2,22 -2,34`} fill="#7cbf68" stroke="#5e9e4e" strokeWidth={3} />;
    })}
    <ellipse cx={540} cy={GROUND_Y + 8} rx={400} ry={26} fill="#000" opacity={0.08} />
  </g>
);

// bench: backrest behind the couple; legs and seat edge are part of the same group (the couple is drawn on top)
export const Bench: React.FC = () => (
  <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
    {[
      [210, SEAT_Y - 10],
      [870, SEAT_Y - 10],
    ].map(([x, y], i) => (
      <g key={i}>
        <rect x={x - 9} y={y - 210} width={18} height={210} fill="#4a5060" />
        <path d={`M${x - 12},${y} L${x - 30},${GROUND_Y} L${x - 4},${GROUND_Y} L${x + 8},${y + 30} L${x + 22},${GROUND_Y} L${x + 46},${GROUND_Y} L${x + 20},${y} Z`} fill="#4a5060" />
      </g>
    ))}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={170} y={SEAT_Y - 205 + i * 56} width={740} height={40} rx={10} fill={i % 2 ? "#c98a4b" : "#d39657"} />
    ))}
    <rect x={150} y={SEAT_Y - 6} width={780} height={34} rx={10} fill="#d39657" />
    <rect x={160} y={SEAT_Y + 28} width={760} height={22} rx={8} fill="#b07338" />
  </g>
);

// a phone seen from the back (face down / held up): dark body, camera bump, soft highlight
export const PhoneBack: React.FC<{ w?: number; h?: number; rot?: number }> = ({ w = 56, h = 104, rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#2e3140" stroke={INK} strokeWidth={5} />
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={20} height={26} rx={6} fill="#454a5c" />
    <circle cx={-w / 2 + 18} cy={-h / 2 + 16} r={4} fill="#11131a" />
    <circle cx={-w / 2 + 18} cy={-h / 2 + 27} r={4} fill="#11131a" />
    <path d={`M${w / 2 - 10},${-h / 2 + 14} L${w / 2 - 10},${h / 2 - 20}`} stroke="#5a6075" strokeWidth={4} strokeLinecap="round" />
  </g>
);
