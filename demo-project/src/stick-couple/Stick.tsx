import React from "react";

// Stick-couple rig: a clean stick body (round caps, black hands and shoes) under a big white head with a 3/4 face.
// Everything is drawn facing right in local coords (hip = 0,0, y down) and mirrored with dir = -1.
// Limbs are two-bone IK chains: the caller gives hand/foot targets, the rig finds elbows and knees.

export const INK = "#1d1d24";
const SKIN = "#ffffff";
const RED = [255, 112, 96];
// skin colour for a given redness (white -> angry red) and sickness (white -> green)
const SICK = [178, 222, 150];
const skinOf = (red: number, sick = 0) =>
  red > 0 || sick > 0 ? `rgb(${RED.map((c, i) => Math.round(Math.max(0, 255 + (c - 255) * red + (SICK[i] - 255) * sick))).join(",")})` : SKIN;
const SHADE = "#e6e9f0";
export const R = 120; // head radius
const NECK = 270; // hip -> top of neck
const SHOULDER = 235;
const ARM = [126, 120];
const LEG = [142, 142];

export type Emo = "neutral" | "happy" | "suspicious" | "nervous" | "shock" | "moved" | "tired" | "awkward" | "laugh" | "angry";
export type Hair = "spiky" | "bob" | "none";
export type Pt = [number, number];
export type Pose = {
  near: Pt; // hand targets (local); near arm is drawn over the body
  far: Pt;
  feet: [Pt, Pt]; // far foot, near foot
  lean?: number; // upper body rotation about the hip, degrees (+ = forward)
  tilt?: number; // head tilt about the neck
  bob?: number; // head offset (px, + = down)
  point?: boolean; // near hand points (index finger along the forearm)
  palm?: boolean; // near hand shows an open palm
  thumb?: boolean; // near hand gives a thumbs-up
};
export type Look = {
  emo: Emo;
  talk?: number; // 0..1 mouth opening
  blink?: boolean;
  gaze?: Pt; // pupil offset, -1..1 (x forward, y down)
  blush?: number;
  sweat?: number;
  tears?: number;
  red?: number; // 0..1 face flushes red (anger)
  sick?: number; // 0..1 face turns green (disgust)
  t: number;
};

// two-bone IK: joint between a (root) and b (target); side = +1 bends to the right of travel, -1 to the left
export const ik = (a: Pt, b: Pt, l1: number, l2: number, side: number): [Pt, Pt] => {
  let dx = b[0] - a[0];
  let dy = b[1] - a[1];
  const d0 = Math.hypot(dx, dy) || 1;
  const d = Math.min(d0, (l1 + l2) * 0.999);
  dx /= d0;
  dy /= d0;
  const end: Pt = [a[0] + dx * d, a[1] + dy * d];
  const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  return [[a[0] + dx * along + -dy * h * side, a[1] + dy * along + dx * h * side], end];
};

const Bone: React.FC<{ pts: Pt[]; w?: number }> = ({ pts, w = 15 }) => (
  <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);

// ---------- hair ----------
const HairBack: React.FC<{ hair: Hair }> = ({ hair }) =>
  hair === "bob" ? (
    <path
      d={`M${R * 1.0},${R * 0.8} Q${R * 1.22},${-R * 0.25} ${R * 0.75},${-R * 0.88} Q${R * 0.05},${-R * 1.32} ${-R * 0.65},${-R * 0.98} Q${-R * 1.32},${-R * 0.45} ${-R * 1.2},${R * 0.86} Q${-R * 0.95},${R * 0.98} ${-R * 0.62},${R * 0.84} L${R * 0.7},${R * 0.84} Z`}
      fill="#24242c"
      stroke={INK}
      strokeWidth={8}
      strokeLinejoin="round"
    />
  ) : null;

const HairFront: React.FC<{ hair: Hair }> = ({ hair }) => {
  if (hair === "spiky")
    return (
      <g>
        <path
          d={`M${R * 0.96},${-R * 0.3} L${R * 1.06},${-R * 0.78} L${R * 0.72},${-R * 0.72} L${R * 0.66},${-R * 1.16} L${R * 0.3},${-R * 0.9} L${R * 0.06},${-R * 1.28} L${-R * 0.2},${-R * 0.94} L${-R * 0.62},${-R * 1.14} L${-R * 0.66},${-R * 0.76} L${-R * 1.06},${-R * 0.72} L${-R * 0.98},${-R * 0.26} Q${-R * 0.5},${-R * 0.6} ${0},${-R * 0.56} Q${R * 0.5},${-R * 0.6} ${R * 0.96},${-R * 0.3} Z`}
          fill="#24242c"
          stroke={INK}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        <path d={`M${-R * 0.45},${-R * 0.82} Q${-R * 0.1},${-R * 0.98} ${R * 0.3},${-R * 0.8}`} stroke="#5a5a6a" strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    );
  if (hair === "bob")
    return (
      <g>
        <path
          d={`M${R * 0.97},${-R * 0.28} Q${R * 0.72},${-R * 0.64} ${R * 0.32},${-R * 0.5} Q${R * 0.06},${-R * 0.7} ${-R * 0.3},${-R * 0.56} Q${-R * 0.72},${-R * 0.44} ${-R * 1.0},${-R * 0.12} A${R * 1.04},${R * 1.04} 0 0 1 ${R * 0.97},${-R * 0.28} Z`}
          fill="#24242c"
          stroke={INK}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        <path d={`M${-R * 0.55},${-R * 0.82} Q${-R * 0.1},${-R * 1.0} ${R * 0.35},${-R * 0.86}`} stroke="#5a5a6a" strokeWidth={7} fill="none" strokeLinecap="round" />
        {/* hair clip */}
        <g transform={`translate(${R * 0.62} ${-R * 0.74}) rotate(28)`}>
          <path d="M0,0 L-22,-14 L-22,14 Z M0,0 L22,-14 L22,14 Z" fill="#ff7aa2" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <circle r={7} fill="#ff7aa2" stroke={INK} strokeWidth={5} />
        </g>
      </g>
    );
  return null;
};

// ---------- face ----------
const EYES: Pt[] = [
  [R * 0.06, -R * 0.06],
  [R * 0.52, -R * 0.06],
];
const MOUTH: Pt = [R * 0.33, R * 0.45];

const Face: React.FC<{ look: Look; girl: boolean }> = ({ look, girl }) => {
  const skin = skinOf(look.red ?? 0, look.sick ?? 0);
  const { emo, talk = 0, blink = false, gaze = [0, 0], blush = 0, sweat = 0, tears = 0, t } = look;
  const rx = R * 0.15;
  const ry = R * (emo === "shock" || emo === "awkward" ? 0.24 : 0.2);
  const lid = blink ? 1 : emo === "tired" ? 0.52 : emo === "suspicious" ? 0.38 : emo === "angry" ? 0.22 : 0;
  const pr = R * (emo === "moved" ? 0.115 : emo === "shock" || emo === "awkward" || emo === "angry" ? 0.055 : 0.085);
  // brows: raise (+ = up) and inner-end drop (+ = angry, - = worried)
  const brow: Record<Emo, [number, number]> = {
    neutral: [0, 0],
    happy: [0.3, -0.1],
    suspicious: [-0.3, 0.55],
    nervous: [0.4, -0.6],
    shock: [1.0, -0.2],
    moved: [0.5, -0.75],
    tired: [-0.35, -0.15],
    awkward: [0.9, -0.35],
    laugh: [0.5, -0.3],
    angry: [-0.4, 1.5],
  };
  const [raise, inner] = brow[emo];
  const shut = emo === "laugh" || (emo === "happy" && talk < 0.05);
  const cx = (EYES[0][0] + EYES[1][0]) / 2;
  return (
    <g>
      {blush > 0 &&
        [EYES[0][0] - R * 0.08, EYES[1][0] + R * 0.12].map((x, i) => (
          <ellipse key={i} cx={x} cy={R * 0.24} rx={R * 0.16} ry={R * 0.08} fill="#ff8fa8" opacity={0.55 * blush} />
        ))}
      {EYES.map(([x, y], i) => {
        const innerSide = x < cx ? 1 : -1; // which end of this brow points at the nose
        const by = y - ry - R * 0.13 - raise * R * 0.1;
        const drop = inner * R * 0.09;
        const bx0 = x - rx * 1.15;
        const bx1 = x + rx * 1.15;
        const y0 = by + (innerSide === -1 ? drop : -drop * 0.3);
        const y1 = by + (innerSide === 1 ? drop : -drop * 0.3);
        return (
          <g key={i}>
            {shut ? (
              <path d={`M${x - rx},${y + R * 0.03} Q${x},${y - R * 0.14} ${x + rx},${y + R * 0.03}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
            ) : lid >= 1 ? (
              <path d={`M${x - rx},${y} Q${x},${y + R * 0.05} ${x + rx},${y}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
            ) : (
              <g>
                <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={5.5} />
                {emo === "moved" && <path d={`M${x - rx * 0.92},${y + ry * 0.35} Q${x},${y + ry * (0.5 + 0.08 * Math.sin(t * 9))} ${x + rx * 0.92},${y + ry * 0.35} A${rx},${ry} 0 0 1 ${x - rx * 0.92},${y + ry * 0.35} Z`} fill="#bfe6ff" />}
                <circle cx={x + gaze[0] * rx * 0.45} cy={y + gaze[1] * ry * 0.4 + ry * 0.05} r={pr} fill={INK} />
                <circle cx={x + gaze[0] * rx * 0.45 + pr * 0.4} cy={y + gaze[1] * ry * 0.4 - pr * 0.35} r={Math.max(3.5, pr * 0.32)} fill="#fff" />
                {emo === "moved" && <circle cx={x + gaze[0] * rx * 0.45 - pr * 0.35} cy={y + gaze[1] * ry * 0.4 + pr * 0.4} r={pr * 0.16} fill="#fff" />}
                {lid > 0 && (
                  <g>
                    <rect x={x - rx * 1.25} y={y - ry * 1.4} width={rx * 2.5} height={ry * (0.4 + lid * 1.6)} fill={skin} />
                    <line x1={x - rx * 1.05} y1={y - ry + lid * ry * 1.6} x2={x + rx * 1.05} y2={y - ry + lid * ry * 1.6} stroke={INK} strokeWidth={6} strokeLinecap="round" />
                  </g>
                )}
                {emo === "tired" && <path d={`M${x - rx * 0.8},${y + ry * 1.25} Q${x},${y + ry * 1.6} ${x + rx * 0.8},${y + ry * 1.25}`} stroke="#9aa0b4" strokeWidth={5} fill="none" strokeLinecap="round" />}
              </g>
            )}
            {girl && !shut && lid < 1 && <path d={`M${x + rx * 0.75},${y - ry * 0.75} l${R * 0.07},${-R * 0.06} M${x + rx * 0.95},${y - ry * 0.35} l${R * 0.08},${-R * 0.02}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
            <path d={`M${bx0},${y0} Q${x},${by - R * 0.05} ${bx1},${y1}`} stroke={INK} strokeWidth={girl ? 6 : 8} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      <Mouth emo={emo} talk={talk} t={t} />
      {tears > 0 &&
        EYES.map(([x, y], i) => {
          const ph = (t * 1.1 + i * 0.5) % 1;
          return (
            <g key={i} opacity={tears}>
              <path d={`M${x - R * 0.02},${y + R * 0.2} q${-R * 0.04},${R * 0.25} 0,${R * 0.5}`} stroke="#7cc8f5" strokeWidth={9} fill="none" strokeLinecap="round" />
              <path d={`M${x - R * 0.02},${y + R * (0.25 + ph * 0.5)} q-9,16 0,22 q9,-6 0,-22`} fill="#7cc8f5" opacity={1 - ph} />
            </g>
          );
        })}
      {sweat > 0 &&
        [0, 1].map((i) => {
          const ph = (t * 0.9 + i * 0.5) % 1;
          return <path key={i} d={`M${-R * 0.55 - i * 30},${-R * 0.55 + ph * 120} q-14,24 0,34 q14,-10 0,-34`} fill="#8fd3ff" stroke={INK} strokeWidth={4} opacity={sweat * (1 - ph * 0.8)} />;
        })}
    </g>
  );
};

const Mouth: React.FC<{ emo: Emo; talk: number; t: number }> = ({ emo, talk, t }) => {
  const [x, y] = MOUTH;
  const w = R * 0.42;
  const sw = 7;
  if (emo === "laugh") {
    return (
      <g>
        <path d={`M${x - w * 0.65},${y - R * 0.06} Q${x},${y - R * 0.1} ${x + w * 0.65},${y - R * 0.06} Q${x + w * 0.5},${y + R * 0.38} ${x},${y + R * 0.4} Q${x - w * 0.5},${y + R * 0.38} ${x - w * 0.65},${y - R * 0.06} Z`} fill="#6b1f2a" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M${x - w * 0.3},${y + R * 0.3} Q${x},${y + R * 0.14} ${x + w * 0.3},${y + R * 0.3} Q${x},${y + R * 0.38} ${x - w * 0.3},${y + R * 0.3}`} fill="#ff7b8e" />
      </g>
    );
  }
  if (emo === "angry") {
    // clenched teeth, corners pulled down
    const h = R * 0.17;
    return (
      <g>
        <path d={`M${x - w * 0.6},${y + h * 0.75} Q${x},${y - h * 0.65} ${x + w * 0.6},${y + h * 0.75} Q${x},${y + h * 0.35} ${x - w * 0.6},${y + h * 0.75} Z`} fill="#fff" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
        {[-0.3, 0, 0.3].map((k) => (
          <line key={k} x1={x + k * w} y1={y - h * 0.2} x2={x + k * w} y2={y + h * 0.65} stroke={INK} strokeWidth={3.5} />
        ))}
      </g>
    );
  }
  if (emo === "awkward") {
    const h = R * 0.2;
    return (
      <g>
        <rect x={x - w * 0.72} y={y - h * 0.4} width={w * 1.44} height={h} rx={h * 0.45} fill="#fff" stroke={INK} strokeWidth={sw} />
        <line x1={x - w * 0.66} y1={y + h * 0.1} x2={x + w * 0.66} y2={y + h * 0.1} stroke={INK} strokeWidth={4} />
        {[-0.4, -0.13, 0.13, 0.4].map((k) => (
          <line key={k} x1={x + k * w * 1.44} y1={y - h * 0.35} x2={x + k * w * 1.44} y2={y + h * 0.55} stroke={INK} strokeWidth={3.5} />
        ))}
      </g>
    );
  }
  if (talk > 0.06 || emo === "shock") {
    const o = emo === "shock" ? Math.max(0.8, talk) : talk;
    const hw = w * (0.32 + 0.12 * o);
    const smile = emo === "happy" || emo === "moved" ? R * 0.06 : 0;
    return (
      <g>
        <path d={`M${x - hw},${y - smile} Q${x},${y + R * (0.06 + 0.3 * o)} ${x + hw},${y - smile} Q${x},${y - R * 0.06} ${x - hw},${y - smile} Z`} fill="#6b1f2a" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
        {o > 0.4 && <ellipse cx={x} cy={y + R * (0.02 + 0.2 * o)} rx={hw * 0.45} ry={R * 0.04 * o} fill="#ff7b8e" />}
      </g>
    );
  }
  if (emo === "nervous") {
    const p = Array.from({ length: 7 }, (_, i) => {
      const k = i / 6;
      return `${x - w * 0.5 + k * w},${y + R * 0.03 + Math.sin(k * Math.PI * 3 + t * 8) * R * 0.03}`;
    });
    return <polyline points={p.join(" ")} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  }
  const curve: Partial<Record<Emo, number>> = { happy: 0.16, moved: 0.1, suspicious: -0.02, tired: -0.05, neutral: 0.05 };
  const c = (curve[emo] ?? 0) * R;
  const skew = emo === "suspicious" ? R * 0.06 : 0;
  return <path d={`M${x - w * 0.42},${y + skew} Q${x},${y + c * 2} ${x + w * 0.42},${y - skew}`} stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round" />;
};

// ---------- hands ----------
const Hand: React.FC<{ at: Pt; dir: Pt; point?: boolean; palm?: boolean; thumb?: boolean }> = ({ at, dir, point, palm, thumb }) => {
  const a = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <g transform={`rotate(${a})`}>
        {point && <line x1={0} y1={0} x2={40} y2={0} stroke={INK} strokeWidth={11} strokeLinecap="round" />}
        {palm && [-28, -8, 12, 32].map((k) => <line key={k} x1={0} y1={0} x2={Math.cos((k * Math.PI) / 180) * 34} y2={Math.sin((k * Math.PI) / 180) * 34} stroke={INK} strokeWidth={9} strokeLinecap="round" />)}
      </g>
      {/* thumbs-up: the thumb points straight up whatever the forearm angle */}
      {thumb && <line x1={0} y1={-6} x2={-2} y2={-42} stroke={INK} strokeWidth={13} strokeLinecap="round" />}
      <circle r={palm || thumb ? 18 : 15} fill={INK} />
    </g>
  );
};

// ---------- the figure ----------
export const Stick: React.FC<{
  x: number;
  hip: number; // hip height in world px
  dir: 1 | -1;
  scale?: number;
  hair: Hair;
  girl?: boolean;
  pose: Pose;
  look: Look;
  held?: React.ReactNode; // drawn at the near hand (local coords, mirrored with the body)
  headExtras?: React.ReactNode; // drawn in head-local coords on top of the face
}> = ({ x, hip, dir, scale = 1, hair, girl = false, pose, look, held, headExtras }) => {
  const { near, far, feet, lean = 0, tilt = 0, bob = 0, point, palm, thumb } = pose;
  const sh: Pt = [0, -SHOULDER];
  // targets are given in the un-leaned frame; rotate them into the torso frame so hands stay where they were aimed
  const rl = (-lean * Math.PI) / 180;
  const un = (p: Pt): Pt => [p[0] * Math.cos(rl) - p[1] * Math.sin(rl), p[0] * Math.sin(rl) + p[1] * Math.cos(rl)];
  const nearL = un(near);
  const farL = un(far);
  const [ne, nh] = ik(sh, nearL, ARM[0], ARM[1], 1);
  const [fe, fh] = ik(sh, farL, ARM[0], ARM[1], 1);
  const [fk, ff] = ik([0, 0], feet[0], LEG[0], LEG[1], -1);
  const [nk, nf] = ik([0, 0], feet[1], LEG[0], LEG[1], -1);
  const headY = -NECK - R * 0.92 + bob;
  return (
    <g transform={`translate(${x} ${hip}) scale(${dir * scale} ${scale})`}>
      {/* far leg + shoe */}
      <Bone pts={[[0, 0], fk, ff]} />
      <ellipse cx={ff[0] + 14} cy={ff[1] + 4} rx={30} ry={13} fill={INK} />
      <g transform={`rotate(${lean} 0 0)`}>
        <Bone pts={[sh, fe, fh]} />
        <Hand at={fh} dir={[fh[0] - fe[0], fh[1] - fe[1]]} />
        <Bone pts={[[0, 0], [0, -NECK]]} w={16} />
      </g>
      {/* near leg + shoe */}
      <Bone pts={[[0, 0], nk, nf]} />
      <ellipse cx={nf[0] + 14} cy={nf[1] + 4} rx={30} ry={13} fill={INK} />
      <g transform={`rotate(${lean} 0 0)`}>
        <g transform={`rotate(${tilt} 0 ${-NECK})`}>
          <g transform={`translate(0 ${headY})`}>
            <HairBack hair={hair} />
            <clipPath id={`hc-${girl ? "g" : "b"}-${x | 0}`}>
              <circle r={R} />
            </clipPath>
            {/* soft shade on the back/bottom of the head: shade disc with a white disc pushed toward the face */}
            <g clipPath={`url(#hc-${girl ? "g" : "b"}-${x | 0})`}>
              <circle r={R} fill={(look.red ?? 0) > 0 || (look.sick ?? 0) > 0 ? skinOf(Math.min(1, (look.red ?? 0) * 1.25), Math.min(1, (look.sick ?? 0) * 1.25)) : SHADE} />
              <circle r={R * 0.97} cx={R * 0.13} cy={-R * 0.1} fill={skinOf(look.red ?? 0, look.sick ?? 0)} />
            </g>
            <circle r={R} fill="none" stroke={INK} strokeWidth={9} />
            <Face look={look} girl={girl} />
            <HairFront hair={hair} />
            {headExtras}
          </g>
        </g>
        <Bone pts={[sh, ne, nh]} />
        {held && <g transform={`translate(${nh[0]} ${nh[1]})`}>{held}</g>}
        <Hand at={nh} dir={[nh[0] - ne[0], nh[1] - ne[1]]} point={point} palm={palm} thumb={thumb} />
      </g>
    </g>
  );
};

export const SEATED: { feet: [Pt, Pt] } = { feet: [[92, 205], [112, 200]] };
export const STANDING: { feet: [Pt, Pt] } = { feet: [[-22, 282], [26, 282]] };
export const BODY = { NECK, SHOULDER, headY: -NECK - R * 0.92 };
