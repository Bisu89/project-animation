import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { CUP_HALF, FPS, GRIP, L1, L2, SHOULDER, T, TABLE_Y, V, attached, blinkAt, cupAt, ease, handAt, ik2 } from "./motion";

// PLACEHOLDER ART: every layer is a flat vector shape standing in for a cut-out picture of the same name.
// The layer list and pivots are in content/camp-demo/assets_action.csv. Layer order (back to front):
// sky, hills, ground, tent (+flap), tree + leaves, table, stool/legs, torso, head, cup, steam, arm, hand.
const W = 1920;
const H = 1080;
const INK = "#2a1d1a";
const SKIN = "#e3a982";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const sway = (t: number, period: number, phase: number, amp: number) => Math.sin((t / period) * 2 * Math.PI + phase) * amp;

// A gust now and then makes the foliage and tent cloth move more, but each part keeps its own period and phase.
const gust = (t: number) => 0.55 + 0.45 * Math.sin((t / 6.3) * Math.PI * 2 + 0.7) ** 2;

const Tent: React.FC<{ t: number }> = ({ t }) => {
  const g = gust(t);
  const flap = sway(t, 3.7, 0.4, 2.2 * g) + sway(t, 1.9, 2.0, 0.6 * g); // door flap angle (deg)
  const hem = sway(t, 4.6, 1.3, 7 * g); // loose hem of the cloth (px)
  return (
    <g>
      <polygon points="150,800 480,330 810,800" fill="#c8693a" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <polygon points="480,330 810,800 560,800" fill="#a85127" />
      <g transform={`rotate(${flap} 480 340)`}>
        <polygon points="480,360 395,800 565,800" fill="#6b2e1c" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d={`M395,800 Q480,${780 + hem} 565,800`} fill="none" stroke={INK} strokeWidth="4" />
      </g>
      <path d={`M150,800 Q${230 + hem * 0.4},${790 - hem * 0.5} 310,800`} fill="#c8693a" stroke={INK} strokeWidth="4" />
      <line x1="480" y1="330" x2="480" y2="290" stroke={INK} strokeWidth="6" />
    </g>
  );
};

const Tree: React.FC<{ t: number }> = ({ t }) => {
  const g = gust(t);
  const clusters = [
    { x: 1560, y: 330, r: 120, per: 4.3, ph: 0.2, amp: 2.2 },
    { x: 1700, y: 400, r: 105, per: 5.6, ph: 2.1, amp: 1.7 },
    { x: 1480, y: 450, r: 95, per: 3.4, ph: 4.0, amp: 2.6 },
    { x: 1640, y: 270, r: 90, per: 6.2, ph: 1.0, amp: 1.4 },
  ];
  return (
    <g>
      <rect x="1600" y="400" width="44" height="400" fill="#4a2f22" stroke={INK} strokeWidth="5" />
      {clusters.map((c, i) => (
        <g key={i} transform={`rotate(${sway(t, c.per, c.ph, c.amp * g)} 1620 430)`}>
          <circle cx={c.x} cy={c.y} r={c.r} fill={["#3f6b3a", "#4d7c42", "#365d34", "#58884a"][i]} stroke={INK} strokeWidth="5" />
          {[0, 1, 2, 3, 4].map((k) => {
            const lx = c.x + (random(`leaf${i}${k}x`) - 0.5) * c.r * 1.2;
            const ly = c.y + (random(`leaf${i}${k}y`) - 0.5) * c.r * 1.2;
            return <ellipse key={k} cx={lx} cy={ly} rx="16" ry="8" transform={`rotate(${sway(t, 2.4 + k * 0.5, k * 1.7 + i, 14)} ${lx} ${ly})`} fill="#7aa85c" />;
          })}
        </g>
      ))}
    </g>
  );
};

// Steam is emitted from the cup rim. Each puff keeps the rim position of the moment it was born,
// so when the cup is lifted the plume trails behind it.
const Steam: React.FC<{ t: number }> = ({ t }) => {
  const N = 9;
  const LIFE = 3.2; // seconds
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: N }, (_, i) => {
        const off = (i / N) * LIFE + random(`st${i}`) * 0.2;
        const tt = t + off;
        const born = tt - (tt % LIFE); // start of this puff's current life
        const age = (tt - born) / LIFE; // 0..1
        const tb = t - age * LIFE; // time it was emitted (may be before 0)
        const cup = cupAt(Math.max(0, tb));
        const rim: V = { x: cup.c.x + (random(`sx${i}${Math.floor(born)}`) - 0.5) * 36, y: cup.c.y - CUP_HALF.h - 6 };
        const x = rim.x + sway(age * LIFE, 1.6, i * 1.3, 10 + age * 24) + age * 26; // drifts right as it climbs
        const y = rim.y - age * 190;
        const r = 12 + age * 30;
        const o = Math.sin(Math.PI * Math.min(1, age * 1.15)) * 0.36 * (1 - age * 0.35);
        return <circle key={i} cx={x} cy={y} r={r} fill="#fff4e0" opacity={Math.max(0, o)} style={{ filter: `blur(${4 + age * 6}px)` }} />;
      })}
    </g>
  );
};

const Cup: React.FC<{ t: number }> = ({ t }) => {
  const { c, a } = cupAt(t);
  return (
    <g transform={`translate(${c.x} ${c.y}) rotate(${a})`}>
      <path d={`M${-CUP_HALF.w},${-CUP_HALF.h} L${CUP_HALF.w},${-CUP_HALF.h} L${CUP_HALF.w - 8},${CUP_HALF.h} L${-CUP_HALF.w + 8},${CUP_HALF.h} Z`} fill="#e9e1d0" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx="0" cy={-CUP_HALF.h} rx={CUP_HALF.w} ry="9" fill="#5a3a22" stroke={INK} strokeWidth="4" />
      <path d={`M${-CUP_HALF.w + 2},-22 C${GRIP.x - 26},-30 ${GRIP.x - 26},24 ${-CUP_HALF.w + 6},22`} fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d={`M${-CUP_HALF.w + 2},-22 C${GRIP.x - 26},-30 ${GRIP.x - 26},24 ${-CUP_HALF.w + 6},22`} fill="none" stroke="#e9e1d0" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
};

// Soft contact shadow under the cup: it stays on the table and fades/shrinks as the cup rises.
const CupShadow: React.FC<{ t: number }> = ({ t }) => {
  const { c } = cupAt(t);
  const lift = Math.max(0, TABLE_Y - (c.y + CUP_HALF.h));
  const k = Math.max(0.35, 1 - lift / 260);
  return <ellipse cx={1030} cy={TABLE_Y + 2} rx={52 * k + 4} ry={8 * k + 1} fill="#000" opacity={0.28 * k} />;
};

const Person: React.FC<{ t: number }> = ({ t }) => {
  const breath = Math.sin((t / 4.4) * Math.PI * 2 + 0.3);
  const blink = blinkAt(t);
  const target = handAt(t);
  const { elbow, hand } = ik2(SHOULDER, target, L1, L2, 1);
  const closed = t >= T.close && t < T.open;
  const sh = { x: SHOULDER.x, y: SHOULDER.y + breath * 1.2 };
  return (
    <g>
      {/* legs and stool */}
      <rect x="650" y="760" width="110" height="40" fill="#5a4636" />
      <path d="M690,735 L860,735 L868,805" fill="none" stroke="#2f3b57" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M690,735 L860,735 L868,805" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      {/* torso breathes: a hair of vertical scale around the hips */}
      <g transform={`translate(0 ${breath * -1.2}) translate(700 735) scale(1 ${1 + breath * 0.008}) translate(-700 -735)`}>
        <path d="M672,735 C660,640 672,560 705,520 C740,545 750,640 740,735 Z" fill="#6a8f6a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        {/* head */}
        <g transform={`translate(0 ${breath * -0.8})`}>
          <rect x="702" y="482" width="26" height="36" fill={SKIN} />
          <circle cx="716" cy="438" r="55" fill={SKIN} stroke={INK} strokeWidth="5" />
          <path d="M662,430 C662,375 725,372 772,420 C752,410 700,400 668,455 Z" fill="#3a2a22" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="744" cy="440" rx="6" ry={Math.max(0.8, 7 * (1 - blink))} fill={INK} />
          <path d="M738,466 Q750,472 760,464" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      {/* arm: upper arm in a sleeve, forearm bare, hand last so it sits in front of the handle */}
      <line x1={sh.x} y1={sh.y} x2={elbow.x} y2={elbow.y} stroke={INK} strokeWidth="46" strokeLinecap="round" />
      <line x1={sh.x} y1={sh.y} x2={elbow.x} y2={elbow.y} stroke="#6a8f6a" strokeWidth="38" strokeLinecap="round" />
      <line x1={elbow.x} y1={elbow.y} x2={hand.x} y2={hand.y} stroke={INK} strokeWidth="34" strokeLinecap="round" />
      <line x1={elbow.x} y1={elbow.y} x2={hand.x} y2={hand.y} stroke={SKIN} strokeWidth="26" strokeLinecap="round" />
      <circle cx={hand.x} cy={hand.y} r={closed ? 20 : 23} fill={SKIN} stroke={INK} strokeWidth="4" />
      {closed ? <path d={`M${hand.x - 4},${hand.y - 16} L${hand.x + 6},${hand.y - 16} M${hand.x - 4},${hand.y + 2} L${hand.x + 8},${hand.y + 2} M${hand.x - 4},${hand.y + 15} L${hand.x + 6},${hand.y + 15}`} stroke={INK} strokeWidth="3" strokeLinecap="round" /> : <path d={`M${hand.x + 6},${hand.y - 14} q16,4 12,14 q-4,10 -12,8`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
    </g>
  );
};

export const CampScene: React.FC<{ showLabel?: boolean }> = ({ showLabel = true }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  // very slow push-in with a little drift; no shake
  const p = ease.inOutSine(interpolate(t, [0, 10], [0, 1], clamp));
  const cam = `translate(${W / 2} ${H / 2}) scale(${1 + 0.035 * p}) translate(${-W / 2 - 18 * p} ${-H / 2 + 6 * p})`;
  return (
    <AbsoluteFill style={{ background: "#2a1f33" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b2f5c" />
            <stop offset="0.55" stopColor="#c46a5a" />
            <stop offset="1" stopColor="#f0a35a" />
          </linearGradient>
          <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#120a1a" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <g transform={cam}>
          <rect x="-100" y="-100" width={W + 200} height="1000" fill="url(#sky)" />
          <circle cx="1180" cy="610" r="90" fill="#ffd9a0" opacity="0.8" />
          <path d="M-100,700 Q300,560 700,690 T1500,650 T2100,700 L2100,820 L-100,820 Z" fill="#6a4c6a" />
          <rect x="-100" y="800" width={W + 200} height="400" fill="#4b5a3c" />
          <rect x="-100" y="800" width={W + 200} height="10" fill="#3a4630" />
          <Tent t={t} />
          <Tree t={t} />
          {/* table */}
          <rect x="880" y={TABLE_Y} width="300" height="16" fill="#8a6a46" stroke={INK} strokeWidth="5" />
          <rect x="905" y={TABLE_Y + 16} width="16" height={800 - TABLE_Y - 16} fill="#6e5236" stroke={INK} strokeWidth="4" />
          <rect x="1140" y={TABLE_Y + 16} width="16" height={800 - TABLE_Y - 16} fill="#6e5236" stroke={INK} strokeWidth="4" />
          <CupShadow t={t} />
          <Person t={t} />
          <Cup t={t} />
          <Steam t={t} />
          {/* hand again over the cup: draw the hand region once more so fingers cover the handle */}
          <HandOver t={t} />
        </g>
        <rect width={W} height={H} fill="url(#vig)" />
        {showLabel && (
          <text x="36" y={H - 34} fill="#fff" opacity="0.7" fontSize="26" fontFamily="sans-serif">
            PLACEHOLDER ART (flat vector layers) — timing and contact test
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// The hand has to cover the cup handle while holding; the arm is drawn before the cup so the cup can sit behind the
// palm but in front of the sleeve, so the hand alone is drawn again after the cup.
const HandOver: React.FC<{ t: number }> = ({ t }) => {
  const target = handAt(t);
  const { hand } = ik2(SHOULDER, target, L1, L2, 1);
  const closed = t >= T.close && t < T.open;
  if (!closed && !attached(t)) {
    return <circle cx={hand.x} cy={hand.y} r="23" fill={SKIN} stroke={INK} strokeWidth="4" />;
  }
  return (
    <g>
      <circle cx={hand.x} cy={hand.y} r="20" fill={SKIN} stroke={INK} strokeWidth="4" />
      <path d={`M${hand.x - 4},${hand.y - 16} L${hand.x + 6},${hand.y - 16} M${hand.x - 4},${hand.y + 2} L${hand.x + 8},${hand.y + 2} M${hand.x - 4},${hand.y + 15} L${hand.x + 6},${hand.y + 15}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
};
