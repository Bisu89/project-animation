import React from "react";
import { INK } from "./Stick";
import { GROUND_Y, H, SEAT_Y, W } from "./Park";

// Living room in the evening (ep05): door on the left wall, wall calendar, framed photo, floor lamp, sofa in the middle,
// TV on a low stand to the right (plays a little shoot-'em-up), rug on the wooden floor. Same world frame as Park
// (feet on GROUND_Y, seat cushion top at SEAT_Y). The door is split so the episode can draw its panel in front of a
// figure walking out (`DoorPanel`) or behind one walking in.
export const DOOR = { x0: 30, x1: 262, top: 585 };
export const DOOR_MID = (DOOR.x0 + DOOR.x1) / 2;
export const TV = { x0: 815, x1: 1065, y0: 950, y1: 1150 };
export const CAL = { x: 600, y: 470 }; // calendar centre

export const LivingRoom: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <radialGradient id="lglow" cx="0.55" cy="0.42" r="0.65">
        <stop offset="0" stopColor="#f3e2c4" />
        <stop offset="0.55" stopColor="#b9c9c0" />
        <stop offset="1" stopColor="#6f8a8e" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#lglow)" />
    {/* wallpaper dots */}
    {Array.from({ length: 60 }, (_, i) => (
      <circle key={i} cx={((i * 137) % 1080) + 20} cy={((i * 263) % 1100) + 40} r={6} fill="#fff" opacity={0.25} />
    ))}
    {/* skirting + floor */}
    <rect y={GROUND_Y - 60} width={W} height={24} fill="#f4efe6" stroke={INK} strokeWidth={5} />
    <rect y={GROUND_Y - 36} width={W} height={H - GROUND_Y + 36} fill="#c48d5a" stroke={INK} strokeWidth={6} />
    {Array.from({ length: 10 }, (_, i) => (
      <line key={i} x1={0} y1={GROUND_Y + 20 + i * 52} x2={W} y2={GROUND_Y + 20 + i * 52} stroke="#a8743f" strokeWidth={4} />
    ))}
    {/* rug */}
    <ellipse cx={560} cy={GROUND_Y + 70} rx={420} ry={70} fill="#e97f6b" stroke={INK} strokeWidth={6} />
    <ellipse cx={560} cy={GROUND_Y + 70} rx={340} ry={48} fill="none" stroke="#fff3e0" strokeWidth={8} strokeDasharray="20 16" />
    {/* framed photo (heart) */}
    <g>
      <rect x={330} y={380} width={150} height={180} fill="#fff8ec" stroke="#6b4a2e" strokeWidth={12} />
      <circle cx={380} cy={455} r={22} fill="#24242c" />
      <circle cx={432} cy={455} r={22} fill="#24242c" />
      <path d="M406,520 C380,500 386,482 406,494 C426,482 432,500 406,520 Z" fill="#ff8fa8" />
    </g>
    {/* calendar */}
    <Calendar />
    {/* clock */}
    <g transform="translate(900 420)">
      <circle r={62} fill="#fff" stroke={INK} strokeWidth={7} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} transform={`rotate(${i * 30})`} x1={0} y1={-48} x2={0} y2={-56} stroke={INK} strokeWidth={4} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-30} stroke={INK} strokeWidth={7} strokeLinecap="round" transform="rotate(240)" />
      <line x1={0} y1={0} x2={0} y2={-46} stroke={INK} strokeWidth={4} strokeLinecap="round" transform={`rotate(${t * 36})`} />
      <circle r={6} fill={INK} />
    </g>
    {/* doorway (dark) + frame */}
    <rect x={DOOR.x0} y={DOOR.top} width={DOOR.x1 - DOOR.x0} height={GROUND_Y - 36 - DOOR.top} fill="#3a3340" />
    <rect x={DOOR.x0 - 16} y={DOOR.top - 16} width={DOOR.x1 - DOOR.x0 + 32} height={GROUND_Y - 36 - DOOR.top + 16} fill="none" stroke="#f4efe6" strokeWidth={22} />
    <rect x={DOOR.x0 - 27} y={DOOR.top - 27} width={DOOR.x1 - DOOR.x0 + 54} height={GROUND_Y - 36 - DOOR.top + 27} fill="none" stroke={INK} strokeWidth={5} />
    {/* floor lamp */}
    <g>
      <ellipse cx={760} cy={760} rx={330} ry={300} fill="#ffd98a" opacity={0.22} />
      <ellipse cx={760} cy={720} rx={150} ry={120} fill="#fff6c8" opacity={0.35} />
      <line x1={760} y1={760} x2={760} y2={GROUND_Y - 20} stroke={INK} strokeWidth={10} />
      <ellipse cx={760} cy={GROUND_Y - 16} rx={50} ry={12} fill="#3a3f4b" stroke={INK} strokeWidth={5} />
      <path d="M700,770 L820,770 L795,670 L725,670 Z" fill="#ffd36b" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
    {/* plant by the TV */}
    <g>
      {[-40, -12, 16, 44].map((a, i) => (
        <path key={i} transform={`rotate(${a + Math.sin(t + i) * 2} 1030 1270)`} d="M1030,1270 Q1012,1160 1030,1070 Q1056,1170 1030,1270 Z" fill={i % 2 ? "#5aa857" : "#4b9449"} stroke={INK} strokeWidth={5} />
      ))}
    </g>
  </g>
);

const Calendar: React.FC = () => (
  <g transform={`translate(${CAL.x} ${CAL.y})`}>
    <rect x={-80} y={-100} width={160} height={200} rx={8} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={-80} y={-100} width={160} height={48} rx={8} fill="#e2574c" stroke={INK} strokeWidth={6} />
    <text x={0} y={-64} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={30} fill="#fff">
      NOV
    </text>
    {Array.from({ length: 30 }, (_, i) => (
      <rect key={i} x={-66 + (i % 6) * 22} y={-38 + Math.floor(i / 6) * 26} width={14} height={14} rx={2} fill="#dfe3ea" />
    ))}
    <circle cx={0} cy={-104} r={7} fill={INK} />
  </g>
);

// door panel hinged on the left; open 0 = shut, 1 = swung out toward the viewer
export const DoorPanel: React.FC<{ open: number; shake?: number }> = ({ open, shake = 0 }) => {
  const { x0, x1, top } = DOOR;
  const bottom = GROUND_Y - 36;
  const w = (x1 - x0) * (1 - 0.82 * open);
  const k = 40 * open; // the free edge comes toward us: taller in perspective
  return (
    <g transform={`translate(${shake} 0)`}>
      <path d={`M${x0},${top} L${x0 + w},${top - k} L${x0 + w},${bottom + k * 0.5} L${x0},${bottom} Z`} fill="#b06a3b" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {open < 0.5 && (
        <g>
          <rect x={x0 + w * 0.15} y={top + 60} width={w * 0.7} height={260} rx={8} fill="none" stroke="#8c5229" strokeWidth={6} />
          <rect x={x0 + w * 0.15} y={top + 400} width={w * 0.7} height={300} rx={8} fill="none" stroke="#8c5229" strokeWidth={6} />
          <circle cx={x0 + w * 0.86} cy={top + 370} r={13} fill="#ffd36b" stroke={INK} strokeWidth={4} />
        </g>
      )}
    </g>
  );
};

// sofa: back + arms are drawn behind the sitters, the seat cushion front too (legs hang over it)
export const Sofa: React.FC<{ x0?: number; x1?: number }> = ({ x0 = 300, x1 = 800 }) => (
  <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
    <rect x={x0} y={SEAT_Y - 250} width={x1 - x0} height={260} rx={40} fill="#5b7fc7" />
    {[0, 1].map((i) => (
      <rect key={i} x={x0 + 30 + i * ((x1 - x0 - 60) / 2)} y={SEAT_Y - 225} width={(x1 - x0 - 60) / 2 - 8} height={200} rx={34} fill="#6d90d6" />
    ))}
    <rect x={x0 - 40} y={SEAT_Y - 4} width={x1 - x0 + 80} height={70} rx={22} fill="#6d90d6" />
    <rect x={x0 - 60} y={SEAT_Y - 120} width={80} height={200} rx={30} fill="#4e70b5" />
    <rect x={x1 - 20} y={SEAT_Y - 120} width={80} height={200} rx={30} fill="#4e70b5" />
    <rect x={x0 - 40} y={SEAT_Y + 60} width={x1 - x0 + 80} height={60} rx={14} fill="#4e70b5" />
    {[x0 - 20, x1 + 10].map((x, i) => (
      <rect key={i} x={x} y={SEAT_Y + 118} width={22} height={GROUND_Y - SEAT_Y - 140} fill="#6b4a2e" />
    ))}
  </g>
);

// TV on a low stand, playing a simple shooter: a ship on the left zaps bobbing blobs
export const Telly: React.FC<{ t: number }> = ({ t }) => {
  const { x0, x1, y0, y1 } = TV;
  const sx = x0 + 40;
  const sy = (y0 + y1) / 2 + Math.sin(t * 3) * 40;
  return (
    <g>
      <ellipse cx={(x0 + x1) / 2} cy={(y0 + y1) / 2} rx={240} ry={190} fill="#9ad8ff" opacity={0.18 + 0.05 * Math.sin(t * 9)} />
      <rect x={x0 + 10} y={1250} width={x1 - x0 - 20} height={GROUND_Y - 30 - 1250} rx={10} fill="#6b4a2e" stroke={INK} strokeWidth={6} />
      <line x1={x0 + 30} y1={1320} x2={x1 - 30} y2={1320} stroke="#4f3520" strokeWidth={6} />
      <rect x={(x0 + x1) / 2 - 20} y={y1} width={40} height={100} fill="#2b2d36" stroke={INK} strokeWidth={5} />
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={14} fill="#1c2340" stroke={INK} strokeWidth={10} />
      <clipPath id="tvclip">
        <rect x={x0 + 8} y={y0 + 8} width={x1 - x0 - 16} height={y1 - y0 - 16} />
      </clipPath>
      <g clipPath="url(#tvclip)">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={x1 - (((t * 120 + i * 53) % (x1 - x0)) | 0)} cy={y0 + 15 + ((i * 37) % (y1 - y0 - 30))} r={2.5} fill="#fff" opacity={0.7} />
        ))}
        {[0, 1, 2].map((i) => {
          const bx = x1 - 40 - i * 55;
          const by = y0 + 50 + i * 50 + Math.sin(t * 4 + i * 2) * 18;
          return <circle key={i} cx={bx} cy={by} r={15} fill={["#ff6f91", "#ffd84d", "#7be07b"][i]} />;
        })}
        {[0, 1, 2].map((i) => {
          const ph = (t * 2.2 + i / 3) % 1;
          return <rect key={i} x={sx + 20 + ph * (x1 - x0 - 100)} y={sy - 3} width={18} height={6} rx={3} fill="#ffe14d" />;
        })}
        <path d={`M${sx - 18},${sy - 14} L${sx + 20},${sy} L${sx - 18},${sy + 14} L${sx - 10},${sy} Z`} fill="#bfe6ff" />
        <text x={x0 + 18} y={y0 + 34} fontFamily="Arial, sans-serif" fontWeight={900} fontSize={20} fill="#fff">
          {`SCORE ${("000" + Math.floor(t * 7) * 10).slice(-4)}`}
        </text>
      </g>
    </g>
  );
};
