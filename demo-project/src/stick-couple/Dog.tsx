import React from "react";
import { INK } from "./Stick";

// A small sitting puppy (beige, brown ears and eye patch, red collar), drawn facing right in local coords
// (floor = 0) and mirrored with dir. mode: idle (panting, tail wag), sniff (head reaches to `head` offset, nose
// twitches), pity (big glossy eyes, brows up, ears drooping, looks up). `paw` 0..1 lifts the near front paw to `pawTo`.
export type DogMode = "idle" | "sniff" | "pity";
const FUR = "#f6e7cc";
const EAR = "#a0703f";

export const Dog: React.FC<{
  x: number;
  y: number;
  dir: 1 | -1;
  t: number;
  mode: DogMode;
  head?: [number, number]; // head offset (local px)
  tilt?: number;
  paw?: number;
  pawTo?: [number, number]; // local target of the lifted paw
  look?: [number, number]; // pupil offset -1..1
  scale?: number;
}> = ({ x, y, dir, t, mode, head = [0, 0], tilt = 0, paw = 0, pawTo = [70, -150], look = [0.4, 0], scale = 1 }) => {
  const wag = Math.sin(t * (mode === "pity" ? 4 : 14)) * (mode === "pity" ? 6 : 18);
  const pant = mode === "idle" ? Math.sin(t * 12) * 3 : 0;
  const sniffBob = mode === "sniff" ? Math.sin(t * 30) * 2.5 : 0;
  const hx = 25 + head[0];
  const hy = -150 + head[1] + pant * 0.5;
  const pity = mode === "pity";
  const droop = pity ? 22 : 0;
  const pawEnd: [number, number] = [38 + (pawTo[0] - 38) * paw, -8 + (pawTo[1] + 8) * paw];
  const er = pity ? 15 : 10;
  const leg = (a: [number, number], b: [number, number]) => (
    <g>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={30} strokeLinecap="round" />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={FUR} strokeWidth={18} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * scale} ${scale})`}>
      <ellipse cx={0} cy={4} rx={80} ry={12} fill="#000" opacity={0.15} />
      {/* tail */}
      <path transform={`rotate(${wag} -50 -40)`} d="M-50,-40 Q-95,-60 -92,-110" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path transform={`rotate(${wag} -50 -40)`} d="M-50,-40 Q-95,-60 -92,-110" stroke={FUR} strokeWidth={11} fill="none" strokeLinecap="round" />
      {/* far front leg, body, haunch */}
      {leg([18, -80], [22, -8])}
      <ellipse cx={-5} cy={-68} rx={55} ry={68} fill={FUR} stroke={INK} strokeWidth={6} />
      <ellipse cx={-22} cy={-28} rx={40} ry={28} fill={FUR} stroke={INK} strokeWidth={6} />
      <ellipse cx={8} cy={-6} rx={26} ry={10} fill={FUR} stroke={INK} strokeWidth={5} />
      {/* near front leg (can lift) */}
      {leg([34, -80], pawEnd)}
      <circle cx={pawEnd[0]} cy={pawEnd[1]} r={13} fill={FUR} stroke={INK} strokeWidth={5} />
      {/* collar */}
      <path d="M-10,-122 Q25,-104 60,-122" stroke="#d9343a" strokeWidth={14} fill="none" strokeLinecap="round" />
      <circle cx={30} cy={-106} r={9} fill="#ffd34d" stroke={INK} strokeWidth={4} />
      {/* head */}
      <g transform={`translate(${hx + sniffBob} ${hy}) rotate(${tilt})`}>
        <path transform={`rotate(${20 + droop})`} d="M-40,-40 Q-80,-10 -62,48 Q-40,58 -30,20 Z" fill={EAR} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <circle r={62} fill={FUR} stroke={INK} strokeWidth={6} />
        <ellipse cx={-6} cy={-16} rx={24} ry={20} fill="#c9935a" opacity={0.75} />
        <ellipse cx={40} cy={22} rx={34} ry={25} fill="#fffaf0" stroke={INK} strokeWidth={5} />
        <ellipse cx={68 + (mode === "sniff" ? Math.sin(t * 40) * 2 : 0)} cy={12} rx={13} ry={10} fill={INK} />
        <circle cx={71} cy={8} r={3} fill="#fff" />
        {pity ? (
          <path d="M34,40 Q46,34 58,40" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
        ) : mode === "idle" ? (
          <g>
            <path d="M30,38 Q44,48 58,38" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={`M38,42 Q44,${66 + pant} 52,42 Z`} fill="#ff7b8e" stroke={INK} strokeWidth={4} />
          </g>
        ) : (
          <path d="M34,38 L56,38" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        )}
        {[
          [-4, -14],
          [30, -16],
        ].map(([ex, ey], i) => (
          <g key={i}>
            {pity && <circle cx={ex} cy={ey} r={er + 4} fill="#fff" stroke={INK} strokeWidth={4} />}
            {mode === "sniff" ? (
              <path d={`M${ex - 9},${ey} Q${ex},${ey + 6} ${ex + 9},${ey}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
            ) : (
              <g>
                <circle cx={ex + look[0] * 3} cy={ey + look[1] * 3} r={er} fill={INK} />
                <circle cx={ex + look[0] * 3 + er * 0.35} cy={ey + look[1] * 3 - er * 0.35} r={er * 0.35} fill="#fff" />
                {pity && <circle cx={ex + look[0] * 3 - er * 0.35} cy={ey + look[1] * 3 + er * 0.35} r={er * 0.18} fill="#fff" />}
              </g>
            )}
            {pity && <path d={`M${ex - 14},${ey - 22 - (i === 0 ? 0 : 6)} L${ex + 12},${ey - 22 - (i === 0 ? 6 : 0)}`} stroke={INK} strokeWidth={5} strokeLinecap="round" transform={`rotate(${i === 0 ? 14 : -14} ${ex} ${ey - 24})`} />}
          </g>
        ))}
        <path transform={`rotate(${-10 - droop * 0.6} 30 -50)`} d="M10,-52 Q50,-80 62,-30 Q48,-24 30,-40 Z" fill={EAR} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </g>
  );
};
