import React from "react";
import { INK } from "../stick-couple/Stick";
import { GROUND_Y, H, SEAT_Y, W } from "../stick-couple/Park";

// Counselor's office for bestie-therapist ep01, redrawn from the reference reel's actual background: warm pinkish
// wall, a softly out-of-focus bookshelf behind a brick pilaster (blurred, like a shallow depth of field), a teal
// window with white mullions and a tree outside, flat pink floor with a soft shadow under the chairs, two small dark
// triangle shapes (hanging plant/lamp silhouettes) peeking in at the very top corners. World = stick-couple's frame
// (W=1080 H=1920, GROUND_Y/SEAT_Y from Park.tsx).
const BOOK_COLORS = ["#2b3a66", "#7a2335", "#2b3a66", "#c9a227", "#2b3a66", "#7a2335"];

export const Office: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={W} height={H} fill="#e3c3ab" />
    {/* out-of-focus bookshelf, upper left, behind the pilaster */}
    <g filter="url(#officeBlur)">
      <Bookshelf />
    </g>
    {/* brick pilaster between shelf and window */}
    <g>
      <rect x={610} y={0} width={110} height={760} fill="#e8d7c5" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={610 + ((i % 2) * 55 - 20)} y={i * 54} width={95} height={40} rx={4} fill="none" stroke="#d2bba3" strokeWidth={4} />
      ))}
    </g>
    {/* window, upper right */}
    <g>
      <rect x={720} y={190} width={320} height={470} rx={10} fill="#79cfc2" stroke={INK} strokeWidth={10} />
      <line x1={880} y1={190} x2={880} y2={660} stroke="#fff" strokeWidth={14} />
      <line x1={720} y1={425} x2={1040} y2={425} stroke="#fff" strokeWidth={14} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={960 + (i % 2) * 30} cy={260 + i * 26 + Math.sin(t * 0.5 + i) * 5} r={34 - i * 2} fill="#b8cf4e" opacity={0.9} />
      ))}
      <line x1={960} y1={330} x2={960} y2={520} stroke="#8c6a3f" strokeWidth={10} />
      <rect x={720} y={190} width={320} height={470} rx={10} fill="none" stroke={INK} strokeWidth={10} />
    </g>
    {/* small hanging decor silhouettes, top corners */}
    <path d="M60,0 L130,0 L95,70 Z" fill="#2b3550" />
    <path d="M960,0 L1030,0 L995,66 Z" fill="#2b3550" />
    {/* skirting + floor */}
    <rect y={GROUND_Y - 40} width={W} height={18} fill="#fff" stroke={INK} strokeWidth={4} />
    <rect y={GROUND_Y - 22} width={W} height={H - GROUND_Y + 22} fill="#f8cdd9" stroke={INK} strokeWidth={6} />
    <ellipse cx={540} cy={GROUND_Y + 150} rx={460} ry={90} fill="#f0aac2" opacity={0.65} />
    {/* small plant pot bottom right, by the window */}
    <g transform="translate(990 1400)">
      <path d="M-40,0 L40,0 L28,70 L-28,70 Z" fill="#c9733a" stroke={INK} strokeWidth={6} />
      {[-18, 0, 20].map((a, i) => (
        <path key={i} transform={`rotate(${a})`} d="M0,0 Q-16,-90 0,-150 Q16,-90 0,0 Z" fill={i % 2 ? "#6fae4a" : "#5e9c3f"} stroke={INK} strokeWidth={4} />
      ))}
    </g>
  </g>
);

const Bookshelf: React.FC = () => (
  <g>
    <rect x={-40} y={60} width={660} height={560} fill="#c9a384" stroke={INK} strokeWidth={8} />
    {[0, 1, 2].map((row) => (
      <g key={row}>
        <rect x={-40} y={60 + row * 185} width={660} height={16} fill="#a5805f" />
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={-20 + i * 46} y={72 + row * 185} width={34} height={160} fill={BOOK_COLORS[(i + row) % BOOK_COLORS.length]} />
        ))}
      </g>
    ))}
    <rect x={-40} y={600} width={660} height={16} fill="#a5805f" />
  </g>
);

// same blue tulip/egg chair for both seats, thin angled wooden legs
export const Chair: React.FC<{ cx: number }> = ({ cx }) => (
  <g stroke={INK} strokeWidth={9} strokeLinejoin="round">
    <path d={`M${cx - 150},${SEAT_Y - 20} Q${cx - 170},${SEAT_Y - 340} ${cx},${SEAT_Y - 360} Q${cx + 170},${SEAT_Y - 340} ${cx + 150},${SEAT_Y - 20} Q${cx + 160},${SEAT_Y + 40} ${cx},${SEAT_Y + 50} Q${cx - 160},${SEAT_Y + 40} ${cx - 150},${SEAT_Y - 20} Z`} fill="#3f7bb0" />
    <path d={`M${cx - 150},${SEAT_Y - 20} Q${cx - 170},${SEAT_Y - 340} ${cx},${SEAT_Y - 360} Q${cx + 170},${SEAT_Y - 340} ${cx + 150},${SEAT_Y - 20}`} fill="none" stroke="#2c5a85" strokeWidth={10} opacity={0.5} />
    {[cx - 100, cx - 34, cx + 34, cx + 100].map((x, i) => (
      <line key={i} x1={cx} y1={SEAT_Y + 10} x2={x} y2={GROUND_Y - 6} stroke="#b9875a" strokeWidth={13} strokeLinecap="round" />
    ))}
  </g>
);

export const OfficeDefs: React.FC = () => (
  <defs>
    <filter id="officeBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
  </defs>
);
