import React from "react";
import { INK } from "./Stick";
import { GROUND_Y, H, SEAT_Y, W } from "./Park";

// Cinema at night (ep04), seen from the screen: dark walls and curtains, rows of seats climbing behind the couple with
// a few audience silhouettes, an EXIT sign, the projector beam over their heads. Same world frame as Park
// (feet on GROUND_Y, seats at SEAT_Y). Seats + bucket are separate so the episode draws them before the couple.
export const BUCKET: [number, number] = [540, 1150]; // bottom centre of the popcorn bucket (on the armrest)
export const SHUSHER: [number, number] = [865, 690]; // head of the audience member who shushes

const SeatBack: React.FC<{ x: number; y: number; s: number; fill: string }> = ({ x, y, s, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90,0 L-90,-170 Q-90,-210 -50,-210 L50,-210 Q90,-210 90,-170 L90,0 Z" fill={fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-60,-30 L-60,-170 M0,-30 L0,-180 M60,-30 L60,-170" stroke="#000" strokeWidth={5} opacity={0.18} />
  </g>
);

export const Cinema: React.FC<{ t: number; glow: number }> = ({ t, glow }) => (
  <g>
    <defs>
      <linearGradient id="cwall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a1426" />
        <stop offset="1" stopColor="#2b1f3a" />
      </linearGradient>
      <linearGradient id="cbeam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfe2ff" stopOpacity={0.35} />
        <stop offset="1" stopColor="#cfe2ff" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#cwall)" />
    {/* side curtains */}
    {[0, 1].map((side) => (
      <g key={side} transform={side ? `translate(${W} 0) scale(-1 1)` : undefined}>
        <path d="M0,0 L130,0 Q100,400 140,800 Q110,1100 130,1460 L0,1460 Z" fill="#6b1e2c" stroke={INK} strokeWidth={6} />
        {[30, 70, 105].map((x, i) => (
          <path key={i} d={`M${x},0 Q${x - 18},700 ${x + 6},1460`} stroke="#4c1420" strokeWidth={8} fill="none" />
        ))}
      </g>
    ))}
    {/* projection booth window + beam over the audience */}
    <rect x={500} y={150} width={80} height={46} rx={6} fill="#fff6d8" stroke={INK} strokeWidth={5} />
    <path d="M520,190 L560,190 L1180,1950 L-100,1950 Z" fill="url(#cbeam)" opacity={0.55 + 0.25 * glow} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const ph = (t * 0.08 + i / 6) % 1;
      return <circle key={i} cx={540 + (i - 2.5) * 60 * ph * 3} cy={200 + ph * 1400} r={3} fill="#fff" opacity={0.35 * (1 - ph)} />;
    })}
    {/* EXIT sign */}
    <rect x={850} y={230} width={130} height={56} rx={8} fill="#123b22" stroke={INK} strokeWidth={5} />
    <text x={915} y={270} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={34} fill="#5dff9a">
      EXIT
    </text>
    <ellipse cx={915} cy={258} rx={110} ry={60} fill="#5dff9a" opacity={0.08} />
    {/* back rows with audience silhouettes (heads lit at the rim by the screen) */}
    {[
      { y: 760, s: 0.62, fill: "#4a1a28", heads: [210, 470, SHUSHER[0]] },
      { y: 930, s: 0.8, fill: "#5a1e30", heads: [160, 930] },
    ].map((row, ri) => (
      <g key={ri}>
        {Array.from({ length: 8 }, (_, i) => {
          const x = 70 + i * 135 + (ri % 2) * 50;
          const head = row.heads.find((h) => Math.abs(h - x) < 70);
          return (
            <g key={i}>
              {head !== undefined && (
                <g>
                  <circle cx={x} cy={row.y - 210 * row.s - 50 * row.s} r={68 * row.s} fill="#0e0b16" />
                  <path d={`M${x - 55 * row.s},${row.y - 290 * row.s} A${68 * row.s},${68 * row.s} 0 0 1 ${x + 55 * row.s},${row.y - 290 * row.s}`} stroke="#8fb6ff" strokeWidth={5} fill="none" opacity={0.5 + 0.3 * glow} />
                </g>
              )}
              <SeatBack x={x} y={row.y} s={row.s} fill={row.fill} />
            </g>
          );
        })}
      </g>
    ))}
    {/* floor + aisle lights */}
    <rect y={GROUND_Y - 30} width={W} height={H - GROUND_Y + 30} fill="#1c1426" stroke={INK} strokeWidth={6} />
    {[80, 1000].map((x, i) => (
      <g key={i}>
        {[0, 1, 2].map((j) => (
          <ellipse key={j} cx={x} cy={GROUND_Y + 40 + j * 150} rx={14} ry={6} fill="#ffd66b" opacity={0.8} />
        ))}
      </g>
    ))}
    <path d="M0,1700 L1080,1700" stroke="#2a1f38" strokeWidth={6} />
  </g>
);

// the couple's two seats and the shared armrest
export const Seats: React.FC<{ xs: number[] }> = ({ xs }) => (
  <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
    {xs.map((x, i) => (
      <g key={i}>
        <path d={`M${x - 120},${SEAT_Y + 10} L${x - 120},${SEAT_Y - 330} Q${x - 120},${SEAT_Y - 385} ${x - 65},${SEAT_Y - 385} L${x + 65},${SEAT_Y - 385} Q${x + 120},${SEAT_Y - 385} ${x + 120},${SEAT_Y - 330} L${x + 120},${SEAT_Y + 10} Z`} fill="#a3283d" />
        <path d={`M${x - 80},${SEAT_Y - 40} L${x - 80},${SEAT_Y - 330} M${x},${SEAT_Y - 40} L${x},${SEAT_Y - 340} M${x + 80},${SEAT_Y - 40} L${x + 80},${SEAT_Y - 330}`} stroke="#7d1b2d" strokeWidth={6} />
        <rect x={x - 120} y={SEAT_Y - 6} width={240} height={50} rx={14} fill="#b8324a" />
        <rect x={x - 100} y={SEAT_Y + 44} width={200} height={GROUND_Y - SEAT_Y - 44} fill="#2d2236" />
      </g>
    ))}
    <rect x={BUCKET[0] - 24} y={BUCKET[1]} width={48} height={GROUND_Y - BUCKET[1]} fill="#2d2236" />
    <rect x={BUCKET[0] - 40} y={BUCKET[1] - 6} width={80} height={26} rx={10} fill="#3c2f48" />
  </g>
);

// striped bucket; fill 0..1 is how much popcorn is still on top; tip = rotation (degrees)
export const Bucket: React.FC<{ fill: number; tip: number }> = ({ fill, tip }) => (
  <g transform={`translate(${BUCKET[0]} ${BUCKET[1] - 6}) rotate(${tip})`}>
    {[
      [-46, -110, 0.9],
      [-20, -128, 1],
      [12, -124, 1],
      [40, -108, 0.9],
      [0, -140, 1],
      [-30, -142, 0.8],
      [28, -142, 0.8],
    ].map(([x, y, s], i) => (
      <circle key={i} cx={x} cy={y + (1 - fill) * 40} r={22 * s} fill="#fff4cf" stroke={INK} strokeWidth={4} opacity={fill > 0.1 || i < 3 ? 1 : 0} />
    ))}
    <path d="M-58,-110 L58,-110 L44,0 L-44,0 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[-36, -12, 12, 36].map((x, i) => (
      <path key={i} d={`M${x - 8},-110 L${x + 8},-110 L${x * 0.76 + 6},0 L${x * 0.76 - 6},0 Z`} fill="#e23b3b" />
    ))}
    <path d="M-58,-110 L58,-110 L44,0 L-44,0 Z" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  </g>
);

export const Kernel: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <circle cx={-6} cy={0} r={11} fill="#fff4cf" stroke={INK} strokeWidth={3.5} />
    <circle cx={6} cy={-3} r={10} fill="#fff4cf" stroke={INK} strokeWidth={3.5} />
    <circle cx={1} cy={7} r={9} fill="#ffe08a" stroke={INK} strokeWidth={3.5} />
  </g>
);
