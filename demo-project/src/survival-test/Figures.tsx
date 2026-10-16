import React from "react";
import { Actor, headAngle } from "../stickman/stick";
import type { Joints } from "../stickman/stick";
import { SKIN } from "../stickman/cast";
import type { Preset } from "../stickman/cast";
import { interpolate } from "remotion";
import { REST, REST_HIP, blend, groundedRun, smooth } from "./gait";
import type { GaitOpts } from "./gait";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// the survivor: same sober character set as the Agincourt pilot (smaller head, dot eyes), modern jacket
export const SURVIVOR: Preset = {
  hair: "short",
  hairColor: "#2b2118",
  skin: SKIN.light,
  shape: "round",
  head: 0.8,
  eyes: "dot",
  emotion: "worried",
  outfit: "soldier",
  outfitColor: "#5b6b72",
  trim: "#2a2f33",
};

export const STRIDE = 150; // world px per full run cycle: a quick, urgent cadence (about 2 cycles/s at sprint speed)
export const BASE_SCALE = 0.9;

// Backpack hung on the back of the torso (joints from Hero's `held`). It follows the torso lean and has a
// little lag: it rocks against the stride and bounces at twice the stride frequency.
export const Backpack: React.FC<{ j: Joints; s: number; phase: number }> = ({ j, s, phase }) => {
  const [nx, ny] = j.neck;
  const [hx, hy] = j.hip;
  const dx = hx - nx;
  const dy = hy - ny;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // points to the back for a right-facing figure
  const py = ux;
  const lag = Math.sin(phase * Math.PI * 4 + 0.7);
  const cx = nx + ux * len * 0.6 + px * 26 * s;
  const cy = ny + uy * len * 0.6 + py * 26 * s + lag * 1.8 * s;
  const rot = (Math.atan2(uy, ux) * 180) / Math.PI - 90 + Math.sin(phase * Math.PI * 2 + 0.4) * 3.5;
  const w = 34 * s;
  const h = 54 * s;
  const ink = "#1a1a1a";
  return (
    <g>
      <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={9 * s} fill="#6a5a3a" stroke={ink} strokeWidth={4 * s} />
        <rect x={-w / 2 + 3 * s} y={-h / 2 - 7 * s} width={w - 6 * s} height={14 * s} rx={6 * s} fill="#54462b" stroke={ink} strokeWidth={3.5 * s} />
        <rect x={-w / 2 + 5 * s} y={h * 0.08} width={w - 10 * s} height={h * 0.3} rx={4 * s} fill="#54462b" stroke={ink} strokeWidth={3 * s} />
      </g>
      {/* strap over the shoulder */}
      <line x1={nx + ux * 8 * s} y1={ny + uy * 8 * s} x2={cx - px * 8 * s} y2={cy - py * 8 * s - h * 0.2} stroke="#3a2f1c" strokeWidth={4 * s} strokeLinecap="round" />
    </g>
  );
};

// survivor body pose for the run, blended to a standing pose between `settleFrom` and `settleTo`
export const runnerMod = (d: number, s: number, ground: number, settle: number, opts: GaitOpts) => {
  const g = groundedRun(d, s, opts);
  const gaitPose = { ...g.pose };
  const b = smooth(settle);
  const pose = blend(gaitPose, REST, b);
  const hipH = g.hipH + (REST_HIP - g.hipH) * b;
  return { pose, y: ground - hipH * s };
};

// zombie in a tattered business suit: sickly green-grey skin, loose tie, arms stretched out in front

// (generic cartoon zombie, not a copy of any existing game character)

// ---- zombie look: a stylised stickman take on the classic cartoon zombie (big head, bulging eyes, open mouth,
// torn jacket + tie, ragged trousers, big shoes, hunched, hands out). No hats. Own drawing, not a copy of any game art.
const SKINS = ["#8fa387", "#98a98c", "#79b04a", "#8c9f86", "#93a58a"];
const JACKETS = ["#7a5232", "#e2ddcc", "#7a5232", "#6a4a34", "#7f5a38"];
const INK = "#1a1a1a";

type Pt = [number, number];
const mix = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const pl = (pts: Pt[]) => pts.map((v) => v.join(",")).join(" ");

// limb segment that tapers from width w0 at p to w1 at q (rounded by the outline stroke)
const Taper: React.FC<{ p: Pt; q: Pt; w0: number; w1: number; fill: string; sw: number }> = ({ p, q, w0, w1, fill, sw }) => {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const pts: Pt[] = [
    [p[0] + (nx * w0) / 2, p[1] + (ny * w0) / 2],
    [q[0] + (nx * w1) / 2, q[1] + (ny * w1) / 2],
    [q[0] - (nx * w1) / 2, q[1] - (ny * w1) / 2],
    [p[0] - (nx * w0) / 2, p[1] - (ny * w0) / 2],
  ];
  return <polygon points={pl(pts)} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />;
};

// Torn brown suit jacket worn open over a dirty shirt with a long red-striped tie, drawn behind the limbs.
// Variant 1 has no jacket: just the shirt and tie.
export const ZombieJacket: React.FC<{ j: Joints; s: number; i: number }> = ({ j, s, i }) => {
  const [nx, ny] = j.neck;
  const [hx, hy] = j.hip;
  const dx = hx - nx;
  const dy = hy - ny;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const at = (along: number, side: number): Pt => [nx + ux * along + px * side, ny + uy * along + py * side];
  const color = JACKETS[i % JACKETS.length];
  const shirtOnly = color === "#e2ddcc";
  const sw = 3 * s;
  const hemAlong = len * 1.3; // the jacket hangs below the hip
  const hem: Pt[] = [];
  const N = 7;
  for (let k = 0; k <= N; k++) {
    const side = 26 * s - (52 * s * k) / N;
    hem.push(at(hemAlong + (k % 2 ? 10 * s : -3 * s) + (((k * 5 + i * 3) % 4) - 1) * 2.5 * s, side));
  }
  const shirtColor = "#d6cfb4";
  const tieEnd = len * 0.92;
  const stripes = [0.22, 0.36, 0.5, 0.64, 0.78].map((t) => at(len * t * 1.0, 0));
  return (
    <g>
      {/* shirt front (visible between the open jacket fronts, or the whole torso for the shirt-only zombie) */}
      <polygon points={pl([at(-3 * s, -14 * s), at(-3 * s, 14 * s), at(len * 1.12, 17 * s), at(len * 1.12, -17 * s)])} fill={shirtColor} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {!shirtOnly && (
        <>
          {/* two jacket fronts, hanging open */}
          <polygon points={pl([at(-4 * s, -26 * s), at(-4 * s, -8 * s), at(len * 0.55, -9 * s), hem[N - 1] ? hem[N - 1] : at(hemAlong, -10 * s), ...hem.slice(Math.floor(N / 2) + 1).reverse(), hem[N], at(len * 0.2, -28 * s)])} fill={color} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
          <polygon points={pl([at(-4 * s, 8 * s), at(-4 * s, 26 * s), at(len * 0.2, 28 * s), ...hem.slice(0, Math.floor(N / 2) + 1).reverse(), at(len * 0.55, 9 * s)])} fill={color} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
          <polyline points={pl([at(-4 * s, -26 * s), at(len * 0.5, -9 * s)])} fill="none" stroke="#3f2a18" strokeWidth={4 * s} strokeLinecap="round" />
          <polyline points={pl([at(-4 * s, 26 * s), at(len * 0.5, 9 * s)])} fill="none" stroke="#3f2a18" strokeWidth={4 * s} strokeLinecap="round" />
        </>
      )}
      {/* long red-striped tie */}
      <polygon points={pl([at(-2 * s, -4 * s), at(-2 * s, 4 * s), at(tieEnd, 7 * s), at(tieEnd + 9 * s, 0), at(tieEnd, -7 * s)])} fill="#b3262b" stroke={INK} strokeWidth={2.2 * s} strokeLinejoin="round" />
      {stripes.map((p, k) => (
        <line key={k} x1={p[0] - px * 5 * s} y1={p[1] - py * 5 * s} x2={p[0] + px * 5 * s} y2={p[1] + py * 5 * s} stroke="#e9e3d3" strokeWidth={2.4 * s} />
      ))}
      <ellipse cx={at(len * 0.5, 14 * s)[0]} cy={at(len * 0.5, 14 * s)[1]} rx={6 * s} ry={4 * s} fill="#2b1b10" opacity={0.35} />
      <ellipse cx={at(len * 0.95, -12 * s)[0]} cy={at(len * 0.95, -12 * s)[1]} rx={7 * s} ry={5 * s} fill="#2b1b10" opacity={0.3} />
      <polyline points={pl([at(len * 0.1, -25 * s), at(len * 0.6, -26 * s), at(len * 1.1, -24 * s)])} fill="none" stroke="#2b1b10" strokeWidth={4 * s} opacity={0.35} strokeLinecap="round" />
      {/* a rip near the pocket */}
      <polyline points={pl([at(len * 0.7, 12 * s), at(len * 0.78, 17 * s), at(len * 0.74, 22 * s)])} fill="none" stroke={INK} strokeWidth={2 * s} strokeLinecap="round" />
    </g>
  );
};

export const ZombieDress: React.FC<{ j: Joints; s: number; i: number }> = ({ j, s, i }) => {
  const skin = SKINS[i % SKINS.length];
  const jacket = JACKETS[i % JACKETS.length];
  const sleeve = jacket === "#e2ddcc" ? "#d6cfb4" : jacket;
  const r = 46 * s;
  const [hx, hy] = j.headC;
  const ang = headAngle(j);
  const jeans = "#33507f";
  const sw = 2.6 * s;
  const sh: Pt = mix(j.hip, j.neck, 0.92);
  const arm = (elbow: Pt, hand: Pt) => {
    const cuff = mix(elbow, hand, 0.62);
    return (
      <g>
        <Taper p={sh} q={elbow} w0={19 * s} w1={15 * s} fill={sleeve} sw={sw} />
        <Taper p={elbow} q={cuff} w0={15 * s} w1={13 * s} fill={sleeve} sw={sw} />
        <Taper p={cuff} q={hand} w0={9.5 * s} w1={8 * s} fill={skin} sw={sw} />
        <ellipse cx={hand[0] + 3 * s} cy={hand[1]} rx={9 * s} ry={7 * s} fill={skin} stroke={INK} strokeWidth={sw} />
        {[-5, 0, 5].map((k) => (
          <path key={k} d={`M${hand[0] + 8 * s},${hand[1] + k * s} q${8 * s},${(k - 2) * s} ${10 * s},${(k + 3) * s}`} fill="none" stroke={INK} strokeWidth={3.2 * s} strokeLinecap="round" />
        ))}
      </g>
    );
  };
  const leg = (knee: Pt, foot: Pt) => {
    const mid = mix(knee, foot, 0.55);
    const kneeTear = mix(knee, mid, 0.1);
    return (
      <g>
        <Taper p={j.hip} q={knee} w0={21 * s} w1={16 * s} fill={jeans} sw={sw} />
        <Taper p={knee} q={mid} w0={16 * s} w1={15 * s} fill={jeans} sw={sw} />
        {/* torn knee patch and ragged hem */}
        <polyline points={pl([[kneeTear[0] - 6 * s, kneeTear[1] - 2 * s], [kneeTear[0], kneeTear[1] + 4 * s], [kneeTear[0] + 6 * s, kneeTear[1] - 1 * s]])} fill="none" stroke={INK} strokeWidth={2 * s} strokeLinejoin="round" />
        <polyline points={pl([[mid[0] - 9 * s, mid[1]], [mid[0] - 4 * s, mid[1] + 7 * s], [mid[0], mid[1] + 1 * s], [mid[0] + 4 * s, mid[1] + 8 * s], [mid[0] + 9 * s, mid[1] + 1 * s]])} fill="none" stroke={INK} strokeWidth={2.2 * s} strokeLinejoin="round" />
        <Taper p={mid} q={foot} w0={8 * s} w1={7 * s} fill={skin} sw={sw} />
        <path
          d={`M${foot[0] - 9 * s},${foot[1] - 7 * s} Q${foot[0] + 6 * s},${foot[1] - 12 * s} ${foot[0] + 24 * s},${foot[1] + 2 * s} Q${foot[0] + 22 * s},${foot[1] + 9 * s} ${foot[0] + 8 * s},${foot[1] + 9 * s} L${foot[0] - 10 * s},${foot[1] + 9 * s} Z`}
          fill="#4a2f1d"
          stroke={INK}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </g>
    );
  };
  // egg-shaped skull, heavier jaw
  const skull = `M0,${-r} C${r * 0.98},${-r * 1.02} ${r * 1.08},${r * 0.2} ${r * 0.78},${r * 0.74} C${r * 0.5},${r * 1.12} ${-r * 0.4},${r * 1.14} ${-r * 0.74},${r * 0.7} C${-r * 1.06},${r * 0.2} ${-r * 0.98},${-r * 1.0} 0,${-r} Z`;
  return (
    <g>
      {leg(j.lKnee, j.lFoot)}
      {leg(j.rKnee, j.rFoot)}
      {arm(j.lElbow, j.lHand)}
      {arm(j.rElbow, j.rHand)}
      <g transform={`translate(${hx} ${hy}) rotate(${ang}) translate(${9 * s} ${12 * s})`}>
        <ellipse cx={-r * 0.98} cy={r * 0.12} rx={r * 0.13} ry={r * 0.2} fill={skin} stroke={INK} strokeWidth={r * 0.05} />
        <path d={skull} fill={skin} stroke={INK} strokeWidth={r * 0.07} strokeLinejoin="round" />
        <path d={`M${-r * 0.62},${-r * 0.7} Q${-r * 1.02},${r * 0.2} ${-r * 0.5},${r * 0.92} Q${-r * 0.82},${r * 0.1} ${-r * 0.62},${-r * 0.7} Z`} fill="#2a3a2a" opacity={0.28} />
        <ellipse cx={r * 0.18} cy={-r * 0.66} rx={r * 0.3} ry={r * 0.12} fill="#ffffff" opacity={0.16} />
        <path d={`M${r * 0.5},${r * 0.62} Q${r * 0.76},${r * 0.42} ${r * 0.86},${r * 0.1}`} fill="none" stroke="#2a3a2a" strokeWidth={r * 0.05} opacity={0.35} strokeLinecap="round" />
        <path d={`M${-r * 0.2},${-r * 0.98} q${-r * 0.1},${-r * 0.35} ${r * 0.12},${-r * 0.5} M${r * 0.1},${-r * 1.0} q${r * 0.02},${-r * 0.4} ${r * 0.28},${-r * 0.42} M${r * 0.35},${-r * 0.9} q${r * 0.18},${-r * 0.25} ${r * 0.32},${-r * 0.2}`} fill="none" stroke={INK} strokeWidth={r * 0.06} strokeLinecap="round" />
        <g transform={`translate(${r * 0.12} 0)`}>
          <ellipse cx={-r * 0.34} cy={-r * 0.14} rx={r * 0.28} ry={r * 0.31} fill="#f4f0cf" stroke={INK} strokeWidth={r * 0.05} />
          <ellipse cx={r * 0.38} cy={-r * 0.1} rx={r * 0.21} ry={r * 0.24} fill="#f4f0cf" stroke={INK} strokeWidth={r * 0.05} />
          <circle cx={-r * 0.26} cy={-r * 0.1} r={r * 0.1} fill={INK} />
          <circle cx={r * 0.44} cy={-r * 0.07} r={r * 0.088} fill={INK} />
          <path d={`M${-r * 0.6},${-r * 0.52} Q${-r * 0.3},${-r * 0.5} ${-r * 0.06},${-r * 0.36} M${r * 0.16},${-r * 0.34} Q${r * 0.42},${-r * 0.5} ${r * 0.64},${-r * 0.44}`} fill="none" stroke={INK} strokeWidth={r * 0.07} strokeLinecap="round" />
          <path d={`M${-r * 0.55},${r * 0.2} q${r * 0.2},${r * 0.1} ${r * 0.4},${r * 0.04} M${r * 0.18},${r * 0.14} q${r * 0.2},${r * 0.06} ${r * 0.38},${-r * 0.02}`} fill="none" stroke={INK} strokeWidth={r * 0.035} strokeLinecap="round" opacity={0.7} />
          <path d={`M${r * 0.04},${r * 0.08} l${r * 0.14},${r * 0.2} l${-r * 0.2},${r * 0.02}`} fill="none" stroke={INK} strokeWidth={r * 0.05} strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M${-r * 0.36},${r * 0.5} Q${-r * 0.1},${r * 0.38} ${r * 0.1},${r * 0.46} Q${r * 0.3},${r * 0.4} ${r * 0.4},${r * 0.52} Q${r * 0.1},${r * 0.86} ${-r * 0.36},${r * 0.5} Z`} fill="#4a1f1f" stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />
          <polygon points={`${-r * 0.26},${r * 0.45} ${-r * 0.17},${r * 0.58} ${-r * 0.08},${r * 0.44}`} fill="#f2efe6" />
          <polygon points={`${r * 0.08},${r * 0.45} ${r * 0.17},${r * 0.6} ${r * 0.26},${r * 0.45}`} fill="#f2efe6" />
          <polyline points={`${r * 0.46},${r * 0.05} ${r * 0.62},${r * 0.28}`} fill="none" stroke={INK} strokeWidth={r * 0.04} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

// dark infected silhouette: plain Actor (small built-in head), lurching run: leaning, arms reaching forward.
// When it reaches the shutter it settles into pounding with both arms overhead.
export const Pursuer: React.FC<{ f: number; i: number; xAt: (f: number) => number; fa: number; ground: (x: number) => number; scale: (x: number) => number }> = ({ f, i, xAt, fa, ground, scale }) => {
  // position comes from the scene (so it can plan arrival times); distance walked drives the feet
  const x = xAt(f);
  const d = x - xAt(0);
  const s = scale(x);
  const g = ground(x);
  const arrive = smooth((f - fa) / 8);
  const run = groundedRun(d, s, { stride: 215, lean: 24, lift: 22 });
  const reach = { ...run.pose, la1: 78 + Math.sin(d * 0.04 + i) * 8, ra1: 84 + Math.cos(d * 0.04 + i) * 8, la2: -12, ra2: -10 };
  // banging on the shutter: arms alternate between raised and lowered, out of step between figures
  const bang = (ph: number) => 105 + 45 * Math.sin(f * 0.55 + ph);
  const pound = { ...REST, la1: -bang(i * 1.7 + Math.PI), la2: -20, ra1: bang(i * 1.7), ra2: -20, lean: 6 };
  const pose = blend(reach, pound, arrive);
  const hipH = run.hipH + (REST_HIP - run.hipH) * arrive;
  return (
    <Actor
      f={f}
      keys={[{ f: 0, p: {} }]}
      color={SKINS[i % SKINS.length]}
      scale={s}
      facing={1}
      headless
      trails={false}
      mod={(t, p) => ({ ...p, ...pose, x, y: g - hipH * s })}
      behind={(j) => <ZombieJacket j={j} s={s} i={i} />}
    >
      {(j) => <ZombieDress j={j} s={s} i={i} />}
    </Actor>
  );
};

// small grey figure far away, running the same way (a ground-locked gait at its own scale)
export const DistantRunner: React.FC<{ f: number; x: number; ground: number; scale: number; color?: string }> = ({ f, x, ground, scale, color = "#6c7580" }) => {
  const d = x;
  const run = groundedRun(d, scale, { stride: 175 * (scale / BASE_SCALE), lean: 12, lift: 20 });
  return (
    <Actor
      f={f}
      keys={[{ f: 0, p: {} }]}
      color={color}
      scale={scale}
      facing={1}
      face="none"
      trails={false}
      mod={(t, p) => ({ ...p, ...run.pose, x, y: ground - run.hipH * scale })}
    />
  );
};

export const lerp = (f: number, a: number[], b: number[]) => interpolate(f, a, b, clamp);

// shambling zombie on the ground-locked gait: slow short stride, forward lean that sways, head tilted,
// arms stretched out in front. `d` is the distance walked (drives the feet, so they never slide).
export const Zombie: React.FC<{ f: number; i: number; x: number; ground: number; scale: number; d: number; stride?: number; lean?: number; tilt?: number; lift?: number }> = ({
  f,
  i,
  x,
  ground,
  scale,
  d,
  stride = 120,
  lean = 14,
  tilt = 14,
  lift = 10,
}) => {
  const run = groundedRun(d, scale, { stride, lean, lift, arm: 8 });
  const cyc = (d / stride) * Math.PI * 2;
  const pose = {
    ...run.pose,
    lean: lean + Math.sin(cyc + i) * 4,
    head: tilt + Math.sin(cyc * 0.5 + i * 2) * 6,
    la1: 80 + Math.sin(cyc + i) * 7,
    la2: -14,
    ra1: 88 + Math.cos(cyc + i) * 7,
    ra2: -10,
  };
  return (
    <Actor
      f={f}
      keys={[{ f: 0, p: {} }]}
      color={SKINS[i % SKINS.length]}
      scale={scale}
      facing={1}
      headless
      trails={false}
      mod={(t, p) => ({ ...p, ...pose, x, y: ground - run.hipH * scale })}
      behind={(j) => <ZombieJacket j={j} s={scale} i={i} />}
    >
      {(j) => <ZombieDress j={j} s={scale} i={i} />}
    </Actor>
  );
};
