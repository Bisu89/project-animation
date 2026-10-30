import React from "react";
import { INK } from "./Stick";
import { GROUND_Y, H, SEAT_Y, W } from "./Park";

// Dining room at night (ep03): warm wall lit by a hanging lamp, window onto the city at night, picture frame, plant,
// wooden floor. Same world frame as Park (feet on GROUND_Y, seats at SEAT_Y). Table and chairs are separate so the
// episode can draw them before the couple.
export const TABLE = { x0: 395, x1: 685, top: 1100 };
export const PLATE: [number, number] = [470, 1094];

export const Dining: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <radialGradient id="dglow" cx="0.5" cy="0.38" r="0.6">
        <stop offset="0" stopColor="#ffe7b8" />
        <stop offset="0.55" stopColor="#f0cf9c" />
        <stop offset="1" stopColor="#b98d62" />
      </radialGradient>
      <linearGradient id="dnight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2350" />
        <stop offset="1" stopColor="#3b3f7a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#dglow)" />
    {/* wallpaper stripes */}
    {Array.from({ length: 14 }, (_, i) => (
      <rect key={i} x={i * 80 + 20} y={0} width={14} height={1170} fill="#000" opacity={0.035} />
    ))}
    {/* window */}
    <g>
      <rect x={70} y={300} width={340} height={430} rx={10} fill="url(#dnight)" stroke={INK} strokeWidth={8} />
      <circle cx={330} cy={380} r={36} fill="#fff6d0" />
      <circle cx={345} cy={370} r={32} fill="#252c5e" />
      {[
        [80, 560, 70],
        [150, 520, 60],
        [210, 590, 80],
        [290, 540, 50],
        [340, 600, 62],
      ].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={730 - y} fill="#12173a" />
          {Array.from({ length: 6 }, (_, j) => (
            <rect key={j} x={x + 10 + (j % 2) * (w / 2 - 6)} y={y + 14 + Math.floor(j / 2) * 34} width={12} height={16} fill="#ffd66b" opacity={(i * 7 + j * 3 + Math.floor(t * 0.5)) % 5 === 0 ? 0.25 : 0.85} />
          ))}
        </g>
      ))}
      {[90, 160, 260, 380].map((x, i) => (
        <circle key={i} cx={x} cy={330 + (i % 2) * 40} r={3} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />
      ))}
      <line x1={240} y1={300} x2={240} y2={730} stroke={INK} strokeWidth={8} />
      <line x1={70} y1={515} x2={410} y2={515} stroke={INK} strokeWidth={8} />
      {/* curtains */}
      <path d="M40,270 L130,270 Q110,500 150,760 L40,760 Z" fill="#c4473f" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M440,270 L350,270 Q370,500 330,760 L440,760 Z" fill="#c4473f" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={20} y={252} width={440} height={22} rx={10} fill="#7a4e2c" stroke={INK} strokeWidth={5} />
    </g>
    {/* picture frame */}
    <g>
      <rect x={760} y={380} width={220} height={250} fill="#fff8ec" stroke="#7a4e2c" strokeWidth={16} />
      <path d="M870,560 C800,510 820,450 870,480 C920,450 940,510 870,560 Z" fill="#ff8fa8" stroke={INK} strokeWidth={5} />
    </g>
    {/* hanging lamp */}
    <g>
      <line x1={540} y1={0} x2={540} y2={540} stroke={INK} strokeWidth={5} />
      <ellipse cx={540} cy={660} rx={260} ry={140} fill="#fff3c4" opacity={0.25} />
      <path d="M470,610 L610,610 L580,540 L500,540 Z" fill="#2f6f5e" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={540} cy={612} rx={30} ry={12} fill="#fff3c4" />
    </g>
    {/* wainscot + floor */}
    <rect y={1170} width={W} height={GROUND_Y - 1170 + 20} fill="#9c6b45" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={i * 125 + 15} y={1195} width={95} height={200} rx={6} fill="none" stroke="#7e5233" strokeWidth={5} />
    ))}
    <rect y={GROUND_Y - 40} width={W} height={H - GROUND_Y + 40} fill="#b9814f" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 10 }, (_, i) => (
      <line key={i} x1={0} y1={GROUND_Y + i * 52} x2={W} y2={GROUND_Y + i * 52} stroke="#9a6638" strokeWidth={4} />
    ))}
    {Array.from({ length: 16 }, (_, i) => {
      const row = Math.floor(i / 2);
      const x = ((row * 211 + (i % 2) * 470) % 1080) + 30;
      return <line key={i} x1={x} y1={GROUND_Y + row * 52} x2={x} y2={GROUND_Y + 52 + row * 52} stroke="#9a6638" strokeWidth={4} />;
    })}
    {/* plant in the corner */}
    <g>
      {[-50, -20, 10, 40].map((a, i) => (
        <path key={i} transform={`rotate(${a + Math.sin(t + i) * 2} 1010 1300)`} d="M1010,1300 Q990,1180 1010,1080 Q1040,1190 1010,1300 Z" fill={i % 2 ? "#5aa857" : "#4b9449"} stroke={INK} strokeWidth={5} />
      ))}
      <path d="M960,1300 L1060,1300 L1045,1420 L975,1420 Z" fill="#c96b45" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
  </g>
);

// chair backrests sit behind each sitter; seat and legs too (the couple is drawn on top)
const Chair: React.FC<{ x: number; dir: 1 | -1 }> = ({ x, dir }) => {
  const back = x - dir * 70;
  return (
    <g stroke={INK} strokeWidth={6} strokeLinejoin="round" fill="#8a5a34">
      <rect x={back - 12} y={SEAT_Y - 290} width={24} height={290} rx={8} />
      <rect x={back - 12 - (dir > 0 ? 0 : 0)} y={SEAT_Y - 300} width={24} height={30} rx={8} fill="#a06a3e" />
      <rect x={Math.min(back, x + dir * 70) - 10} y={SEAT_Y - 4} width={160} height={26} rx={8} fill="#a06a3e" />
      <rect x={back - 10} y={SEAT_Y + 20} width={20} height={GROUND_Y - SEAT_Y - 20} />
      <rect x={x + dir * 70 - 10} y={SEAT_Y + 20} width={20} height={GROUND_Y - SEAT_Y - 20} />
    </g>
  );
};

export const Furniture: React.FC<{ t: number; boyX: number; girlX: number; girlSeated: boolean }> = ({ t, boyX, girlX, girlSeated }) => {
  const { x0, x1, top } = TABLE;
  const flick = (i: number) => 1 + Math.sin(t * 13 + i * 2) * 0.12 + Math.sin(t * 7.3 + i) * 0.08;
  return (
    <g>
      <Chair x={boyX} dir={1} />
      {girlSeated ? <Chair x={girlX} dir={-1} /> : <Chair x={780} dir={-1} />}
      {/* table legs, top and cloth */}
      <rect x={x0 + 20} y={top} width={22} height={GROUND_Y - top} fill="#6e4426" stroke={INK} strokeWidth={6} />
      <rect x={x1 - 42} y={top} width={22} height={GROUND_Y - top} fill="#6e4426" stroke={INK} strokeWidth={6} />
      <path
        d={`M${x0 - 10},${top} L${x1 + 10},${top} L${x1 + 18},${top + 120} Q${x1 - 20},${top + 140} ${(x0 + x1) / 2 + 60},${top + 122} Q${(x0 + x1) / 2},${top + 140} ${(x0 + x1) / 2 - 60},${top + 122} Q${x0 + 20},${top + 140} ${x0 - 18},${top + 120} Z`}
        fill="#fbf7ef"
        stroke={INK}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d={`M${x0 - 14},${top + 90} L${x1 + 14},${top + 90}`} stroke="#d9534f" strokeWidth={10} />
      {/* candles */}
      {[575, 610].map((x, i) => (
        <g key={i}>
          <rect x={x - 9} y={top - 70 + i * 14} width={18} height={70 - i * 14} rx={4} fill="#fff6e6" stroke={INK} strokeWidth={4} />
          <ellipse cx={x} cy={top - 70 + i * 14} rx={36} ry={44} fill="#ffd66b" opacity={0.18 * flick(i)} />
          <path transform={`translate(${x} ${top - 74 + i * 14}) scale(1 ${flick(i)})`} d="M0,0 Q-9,-12 0,-30 Q9,-12 0,0 Z" fill="#ffb238" stroke="#e07a1f" strokeWidth={3} />
        </g>
      ))}
      <ellipse cx={640} cy={top - 4} rx={44} ry={10} fill="#fff" stroke={INK} strokeWidth={4} />
    </g>
  );
};
