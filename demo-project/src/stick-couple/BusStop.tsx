import React from "react";
import { INK } from "./Stick";
import { GROUND_Y, H, W } from "./Park";

// Rainy bus stop (ep06): grey sky that clears to blue (`sun` 0..1), city blocks, a road behind the sidewalk with a
// puddle at the kerb, bus-stop sign pole. Same world frame as Park (feet on GROUND_Y). The bus drives along the road,
// drawn behind the couple; rain is drawn on top of everything except under the umbrella.
export const ROAD_Y = 1395; // where the bus wheels touch the road
export const PUDDLE = { x: 930, y: ROAD_Y + 6, rx: 95, ry: 14 };

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((c, i) => Math.round(c + (pb[i] - c) * k)).join(",")})`;
};

export const BusStop: React.FC<{ t: number; sun: number; splashK: number }> = ({ t, sun, splashK }) => (
  <g>
    <rect width={W} height={H} fill={mix("#8e9aab", "#8fd3ff", sun)} />
    <rect width={W} height={700} fill={mix("#6f7b8e", "#5bbcf5", sun)} opacity={0.6} />
    {/* sun breaking through */}
    {sun > 0 && (
      <g opacity={sun} transform={`translate(860 260)`}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} transform={`rotate(${i * 30 + t * 20})`} x1={0} y1={-110} x2={0} y2={-150} stroke="#ffd84d" strokeWidth={12} strokeLinecap="round" />
        ))}
        <circle r={85} fill="#ffe36b" stroke={INK} strokeWidth={6} />
      </g>
    )}
    {/* clouds */}
    {[
      [160, 210, 1.2],
      [560, 150, 1.5],
      [930, 230, 1.1],
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x + Math.sin(t * 0.3 + i) * 20 - sun * (i === 2 ? 300 : 0)} ${y}) scale(${s})`} opacity={1 - sun * 0.5}>
        <path d="M-120,30 Q-130,-30 -60,-30 Q-40,-80 20,-60 Q80,-90 110,-30 Q160,-20 140,30 Z" fill={mix("#5d6678", "#ffffff", sun)} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>
    ))}
    {/* city blocks */}
    {[
      [0, 760, 190, "#6b7487"],
      [180, 640, 210, "#7a8396"],
      [380, 720, 170, "#646d80"],
      [540, 600, 230, "#737c90"],
      [760, 700, 180, "#677084"],
      [930, 650, 170, "#7d8699"],
    ].map(([x, y, w, c], i) => (
      <g key={i}>
        <rect x={x as number} y={y as number} width={w as number} height={ROAD_Y - (y as number)} fill={mix(c as string, "#b9c6dc", sun * 0.6)} stroke={INK} strokeWidth={5} />
        {Array.from({ length: 8 }, (_, j) => (
          <rect key={j} x={(x as number) + 24 + (j % 2) * ((w as number) / 2 - 10)} y={(y as number) + 30 + Math.floor(j / 2) * 80} width={36} height={46} rx={4} fill={(i + j) % 3 === 0 ? "#ffd66b" : "#4a5263"} opacity={0.85} />
        ))}
      </g>
    ))}
    {/* road (behind the sidewalk) */}
    <rect y={1240} width={W} height={ROAD_Y - 1240 + 30} fill={mix("#4b4f5a", "#5d616c", sun)} />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={i * 200 + 30} y={1300} width={110} height={12} rx={6} fill="#e8e3c8" opacity={0.7} />
    ))}
    {/* puddle */}
    <ellipse cx={PUDDLE.x} cy={PUDDLE.y} rx={PUDDLE.rx * (1 - splashK * 0.6)} ry={PUDDLE.ry * (1 - splashK * 0.6)} fill="#7fa6c9" stroke={INK} strokeWidth={4} opacity={1 - sun * 0.3} />
    {/* kerb + sidewalk */}
    <rect y={ROAD_Y + 18} width={W} height={26} fill="#c9ccd3" stroke={INK} strokeWidth={5} />
    <rect y={ROAD_Y + 44} width={W} height={H - ROAD_Y} fill={mix("#a7acb6", "#cfd3da", sun)} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 7 }, (_, i) => (
      <line key={i} x1={i * 170 + 60} y1={ROAD_Y + 44} x2={i * 170 + 20} y2={H} stroke="#8d929d" strokeWidth={4} />
    ))}
  </g>
);

// bus-stop sign on the sidewalk (drawn in front of the bus)
export const StopSign: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 9} y={720} width={18} height={GROUND_Y - 720} fill="#5a6275" stroke={INK} strokeWidth={5} />
    <rect x={x - 70} y={620} width={140} height={130} rx={18} fill="#2f80d1" stroke={INK} strokeWidth={6} />
    <text x={x} y={700} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={52} fill="#fff">
      BUS
    </text>
  </g>
);

// side-view city bus, front to the left (x = front edge); door = front door (open 0..1); children drawn in the windows
export const BUS = { len: 1000, top: 420, bottom: 1330, winTop: 520, winBot: 800 };
export const Bus: React.FC<{ x: number; door: number; t: number; moving: number; children?: React.ReactNode }> = ({ x, door, t, moving, children }) => {
  const { len, top, bottom, winTop, winBot } = BUS;
  const shake = moving > 0 ? Math.sin(t * 40) * 2 * moving : 0;
  const dx0 = x + 190;
  const dw = 130;
  return (
    <g transform={`translate(0 ${shake})`}>
      <rect x={x} y={top} width={len} height={bottom - top} rx={44} fill="#f2b632" stroke={INK} strokeWidth={8} />
      <rect x={x} y={bottom - 150} width={len} height={60} fill="#e07a1f" />
      <rect x={x + 30} y={top + 22} width={len - 60} height={46} rx={10} fill="#1d1d24" />
      <text x={x + len / 2} y={top + 58} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={34} fill="#ffb238">
        42 DOWNTOWN
      </text>
      {/* windshield + passenger windows */}
      <rect x={x + 20} y={winTop} width={150} height={winBot - winTop + 60} rx={18} fill="#9fd3ee" stroke={INK} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 340 + i * 165} y={winTop} width={150} height={winBot - winTop} rx={14} fill="#9fd3ee" stroke={INK} strokeWidth={6} />
      ))}
      {children}
      {/* door: dark opening + two glass leaves sliding apart */}
      <rect x={dx0} y={winTop - 20} width={dw} height={bottom - winTop + 10} fill="#2b2d36" stroke={INK} strokeWidth={6} />
      {[0, 1].map((i) => {
        const w = (dw / 2) * (1 - 0.8 * door);
        const lx = i === 0 ? dx0 : dx0 + dw - w;
        return (
          <g key={i}>
            <rect x={lx} y={winTop - 20} width={w} height={bottom - winTop + 10} fill="#d9e4ea" stroke={INK} strokeWidth={5} />
            <rect x={lx + 8} y={winTop} width={Math.max(0, w - 16)} height={260} fill="#9fd3ee" />
          </g>
        );
      })}
      {/* wheels */}
      {[x + 110, x + len - 170].map((wx, i) => (
        <g key={i} transform={`translate(${wx} ${ROAD_Y - 62})`}>
          <circle r={64} fill="#1d1d24" stroke={INK} strokeWidth={6} />
          <circle r={28} fill="#9aa0ad" />
          <line x1={-26} y1={0} x2={26} y2={0} stroke="#5a6275" strokeWidth={8} transform={`rotate(${-x * 0.6})`} />
        </g>
      ))}
      <circle cx={x + 12} cy={bottom - 110} r={18} fill="#fff6c8" stroke={INK} strokeWidth={4} />
    </g>
  );
};

// rain streaks over the whole frame; `keep` (x0, x1, y) leaves a dry area under the umbrella canopy
export const Rain: React.FC<{ t: number; k: number; keep?: [number, number, number] }> = ({ t, k, keep }) => {
  if (k <= 0) return null;
  const drops: React.ReactNode[] = [];
  for (let i = 0; i < 160; i++) {
    const sx = (i * 197) % W;
    const speed = 1700 + ((i * 53) % 400);
    const y = ((t * speed + i * 311) % (H + 200)) - 100;
    const x = sx - (y / H) * 120;
    if (keep && x > keep[0] && x < keep[1] && y > keep[2] && y < GROUND_Y) continue;
    drops.push(<line key={i} x1={x} y1={y} x2={x - 9} y2={y + 46} stroke="#dfeaf6" strokeWidth={4} strokeLinecap="round" opacity={0.75 * k} />);
  }
  return <g>{drops}</g>;
};
