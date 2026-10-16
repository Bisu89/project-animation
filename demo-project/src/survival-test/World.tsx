import React from "react";
import { COL, FONT } from "../stickman/fx";
import { Skyline } from "../stickman/props";

export const DOOR_X0 = 2740;
export const DOOR_X1 = 3000;
export const DOOR_CX = (DOOR_X0 + DOOR_X1) / 2;
export const DOOR_TOP = 500;
export const FLOOR = 884; // facade base / doorway floor; the chase runs on the sidewalk in front of it

// sky + two skyline layers; the caller moves each layer by its own parallax factor
export const Sky: React.FC = () => (
  <>
    <defs>
      <linearGradient id="sv-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4c5663" />
        <stop offset="0.7" stopColor="#a39a8c" />
        <stop offset="1" stopColor="#c4b49d" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#sv-sky)" />
  </>
);

export const FarSkyline: React.FC = () => (
  <g transform="translate(0 -196)">
    <Skyline seed={3} tint="#8c95a0" count={16} minH={240} maxH={470} width={3000} />
  </g>
);

export const MidSkyline: React.FC = () => (
  <g transform="translate(0 -196)">
    <Skyline seed={7} tint="#67707c" count={12} minH={290} maxH={540} width={3600} windows />
  </g>
);

// sidewalk, kerb, road, lamp posts: world coordinates
export const Street: React.FC = () => (
  <g>
    <rect x={-300} y={FLOOR} width={4400} height={104} fill="#a9abad" />
    {Array.from({ length: 30 }).map((_, i) => (
      <line key={i} x1={-300 + i * 150} y1={FLOOR} x2={-300 + i * 150} y2={FLOOR + 104} stroke="#8f9295" strokeWidth={2} />
    ))}
    <rect x={-300} y={FLOOR + 100} width={4400} height={10} fill="#7d8083" />
    <rect x={-300} y={FLOOR + 110} width={4400} height={1080 - FLOOR - 110} fill="#3b4046" />
    {Array.from({ length: 22 }).map((_, i) => (
      <rect key={i} x={-200 + i * 190} y={1030} width={96} height={8} fill="#8b8f93" opacity={0.8} />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={`c${i}`} x={1750 + i * 34} y={FLOOR + 112} width={20} height={1080 - FLOOR - 112} fill="#b4b6b8" opacity={0.7} />
    ))}
    {[260, 900, 1540, 2180].map((x) => (
      <g key={x}>
        <rect x={x - 5} y={FLOOR - 330} width={10} height={330} fill="#2c3036" />
        <rect x={x - 5} y={FLOOR - 336} width={70} height={9} fill="#2c3036" />
        <rect x={x + 44} y={FLOOR - 330} width={26} height={12} rx={4} fill="#d8cfa8" opacity={0.85} />
      </g>
    ))}
  </g>
);

// the mall front: glass bays, a sign over a wide doorway whose interior is dark and warm at the floor
export const MallFront: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="sv-inside" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f1318" />
        <stop offset="1" stopColor="#2a2a26" />
      </linearGradient>
    </defs>
    <rect x={2450} y={410} width={1200} height={FLOOR - 410} fill="#7a838e" />
    <rect x={2450} y={410} width={1200} height={22} fill="#59616b" />
    {[2490, 3040, 3260, 3480].map((x, i) => (
      <g key={x}>
        <rect x={x} y={540} width={i === 0 ? 200 : 180} height={300} fill="#262d35" stroke="#59616b" strokeWidth={6} />
        <polygon points={`${x + 20},540 ${x + 70},540 ${x + 20},640`} fill="#3a434d" opacity={0.7} />
      </g>
    ))}
    <rect x={DOOR_X0 - 20} y={DOOR_TOP - 20} width={DOOR_X1 - DOOR_X0 + 40} height={FLOOR - DOOR_TOP + 20} fill="#4f5762" />
    <rect x={DOOR_X0} y={DOOR_TOP} width={DOOR_X1 - DOOR_X0} height={FLOOR - DOOR_TOP} fill="url(#sv-inside)" />
    <ellipse cx={DOOR_CX} cy={FLOOR - 6} rx={120} ry={14} fill="#c7a86a" opacity={0.28} />
    <rect x={DOOR_X0 - 40} y={438} width={DOOR_X1 - DOOR_X0 + 80} height={46} fill="#2f353d" />
    <text x={DOOR_CX} y={473} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} letterSpacing={8} fill="#d9d4c4">
      CENTRAL MALL
    </text>
  </g>
);

// roller shutter coming down in the doorway: `p` 0 = open, 1 = shut
export const Shutter: React.FC<{ p: number }> = ({ p }) => {
  const bottom = DOOR_TOP + (FLOOR - DOOR_TOP) * p;
  return (
    <g>
      <rect x={DOOR_X0 - 14} y={DOOR_TOP - 22} width={DOOR_X1 - DOOR_X0 + 28} height={24} fill="#3d444d" />
      {p > 0.002 && (
        <>
          <rect x={DOOR_X0} y={DOOR_TOP} width={DOOR_X1 - DOOR_X0} height={bottom - DOOR_TOP} fill="#9097a0" />
          {Array.from({ length: Math.floor((bottom - DOOR_TOP) / 14) }).map((_, i) => (
            <line key={i} x1={DOOR_X0} y1={DOOR_TOP + 14 * (i + 1)} x2={DOOR_X1} y2={DOOR_TOP + 14 * (i + 1)} stroke="#6f767f" strokeWidth={2} />
          ))}
          <rect x={DOOR_X0} y={bottom - 10} width={DOOR_X1 - DOOR_X0} height={10} fill="#474e57" stroke={COL.ink} strokeWidth={2} />
        </>
      )}
    </g>
  );
};
