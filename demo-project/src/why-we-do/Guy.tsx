import React from "react";
import { BODY, Face, ik, INK, Look, Pose, Pt, R, skinOf } from "../stick-couple/Stick";

// "Why Do We Do This?" solo lead (working name Benny): same rig family as the stick couple (IK limbs, 3/4 face,
// shared Face/expressions) but his own look: peach skin, curly brown mop, round glasses, orange hoodie, jeans,
// white sneakers. Local coords face right, hip = (0,0), y down; dir = -1 mirrors.

const SKIN = [255, 226, 200];
const SKIN_SHADE = "#efc6a4";
const HAIR = "#4a2e22";
const HAIR_HI = "#7a5140";
export const HOODIE = "#ff8f3a";
const HOODIE_DK = "#e0702a";
const JEANS = "#3d4f7a";
const { NECK, SHOULDER } = BODY;
const ARM = [126, 120];
const LEG = [142, 142];

// a limb drawn as a filled sleeve/trouser leg: ink outline stroke under a colour stroke
const Tube: React.FC<{ pts: Pt[]; w: number; fill: string }> = ({ pts, w, fill }) => {
  const d = pts.map((p) => p.join(",")).join(" ");
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={d} stroke={INK} strokeWidth={w + 12} />
      <polyline points={d} stroke={fill} strokeWidth={w} />
    </g>
  );
};

const Hand: React.FC<{ at: Pt; dir: Pt; point?: boolean; palm?: boolean; thumb?: boolean }> = ({ at, dir, point, palm, thumb }) => {
  const a = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <g transform={`rotate(${a})`}>
        {point && <line x1={0} y1={0} x2={44} y2={0} stroke={INK} strokeWidth={12} strokeLinecap="round" />}
        {palm && [-30, -10, 10, 30].map((k) => <line key={k} x1={0} y1={0} x2={Math.cos((k * Math.PI) / 180) * 36} y2={Math.sin((k * Math.PI) / 180) * 36} stroke={INK} strokeWidth={10} strokeLinecap="round" />)}
      </g>
      {thumb && <line x1={0} y1={-6} x2={-2} y2={-44} stroke={INK} strokeWidth={14} strokeLinecap="round" />}
      <circle r={palm || thumb ? 19 : 17} fill={INK} />
    </g>
  );
};

const Sneaker: React.FC<{ at: Pt }> = ({ at }) => (
  <g transform={`translate(${at[0]} ${at[1]})`}>
    <path d="M-22,-10 Q-20,-22 0,-20 L22,-14 Q46,-8 48,8 L48,14 L-24,14 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <line x1={-22} y1={10} x2={48} y2={10} stroke={INK} strokeWidth={5} />
    <path d="M2,-6 L22,2" stroke="#ff5a4e" strokeWidth={7} strokeLinecap="round" />
  </g>
);

// curly mop: a bumpy cap from the back of the head over the top to the front, fringe curls over the brow
const curlyPath = (() => {
  const pt = (deg: number, r: number) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
  const a0 = 150;
  const a1 = 338;
  const n = 9;
  const [sx, sy] = pt(a0, R * 1.0);
  let d = `M${sx.toFixed(1)},${sy.toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const [x, y] = pt(a0 + ((a1 - a0) * i) / n, R * (i === n ? 1.0 : 1.1));
    d += ` A${R * 0.24},${R * 0.24} 0 0 1 ${x.toFixed(1)},${y.toFixed(1)}`;
  }
  // fringe back toward the back of the head: three curls hanging over the forehead
  d += ` Q${R * 0.78},${-R * 0.42} ${R * 0.6},${-R * 0.5}`;
  d += ` A${R * 0.13},${R * 0.13} 0 0 1 ${R * 0.36},${-R * 0.52}`;
  d += ` A${R * 0.13},${R * 0.13} 0 0 1 ${R * 0.1},${-R * 0.55}`;
  d += ` A${R * 0.13},${R * 0.13} 0 0 1 ${-R * 0.16},${-R * 0.55}`;
  d += ` Q${-R * 0.55},${-R * 0.42} ${-R * 0.72},${-R * 0.1}`;
  d += ` Q${-R * 0.8},${R * 0.25} ${sx.toFixed(1)},${sy.toFixed(1)} Z`;
  return d;
})();

const Hair: React.FC = () => (
  <g>
    <path d={curlyPath} fill={HAIR} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {[
      [-0.55, -0.62],
      [-0.1, -0.86],
      [0.38, -0.8],
      [-0.82, -0.18],
    ].map(([x, y], i) => (
      <path key={i} d={`M${R * x},${R * y} a${R * 0.1},${R * 0.1} 0 1 1 ${R * 0.16},${R * 0.02}`} stroke={HAIR_HI} strokeWidth={6} fill="none" strokeLinecap="round" />
    ))}
  </g>
);

// round glasses around the shared face's eye positions
const EYES: Pt[] = [
  [R * 0.06, -R * 0.06],
  [R * 0.52, -R * 0.06],
];
const Glasses: React.FC<{ glint: number }> = ({ glint }) => {
  const rx = R * 0.215;
  const ry = R * 0.27;
  return (
    <g>
      <path d={`M${EYES[0][0] - rx},${EYES[0][1] - R * 0.04} L${-R * 0.78},${-R * 0.1}`} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d={`M${EYES[0][0] + rx - 2},${EYES[0][1] - R * 0.06} Q${R * 0.29},${-R * 0.16} ${EYES[1][0] - rx + 2},${EYES[1][1] - R * 0.06}`} stroke={INK} strokeWidth={7} fill="none" />
      {EYES.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#cfeaff" opacity={0.18} />
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={8} />
          {glint > 0 && (
            <g opacity={glint}>
              <ellipse cx={x} cy={y} rx={rx - 4} ry={ry - 4} fill="#eaf6ff" />
              <path d={`M${x - rx * 0.6},${y + ry * 0.25} L${x - rx * 0.05},${y - ry * 0.55} M${x - rx * 0.15},${y + ry * 0.5} L${x + rx * 0.35},${y - ry * 0.2}`} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
    </g>
  );
};

export const Guy: React.FC<{
  x: number;
  hip: number;
  dir: 1 | -1;
  scale?: number;
  pose: Pose;
  look: Look;
  glint?: number; // white glare on the lenses (blank stares, dramatic beats)
  held?: React.ReactNode; // drawn at the near hand
  heldFar?: React.ReactNode; // drawn at the far hand (behind the body)
  headExtras?: React.ReactNode;
  pocket?: React.ReactNode; // drawn behind the front pocket (torso-local), e.g. a phone sticking out
}> = ({ x, hip, dir, scale = 1, pose, look, glint = 0, held, heldFar, headExtras, pocket }) => {
  const { near, far, feet, lean = 0, tilt = 0, bob = 0, point, palm, thumb } = pose;
  const sh: Pt = [0, -SHOULDER];
  const rl = (-lean * Math.PI) / 180;
  const un = (p: Pt): Pt => [p[0] * Math.cos(rl) - p[1] * Math.sin(rl), p[0] * Math.sin(rl) + p[1] * Math.cos(rl)];
  const [ne, nh] = ik(sh, un(near), ARM[0], ARM[1], 1);
  const [fe, fh] = ik(sh, un(far), ARM[0], ARM[1], 1);
  const [fk, ff] = ik([0, 0], feet[0], LEG[0], LEG[1], -1);
  const [nk, nf] = ik([0, 0], feet[1], LEG[0], LEG[1], -1);
  const headY = -NECK - R * 0.92 + bob;
  const red = look.red ?? 0;
  const sick = look.sick ?? 0;
  const clip = `gh-${x | 0}-${hip | 0}`;
  // sleeve ends a little before the hand so a dark cuff + hand show
  const cuff = (e: Pt, h: Pt): Pt => [h[0] + (e[0] - h[0]) * 0.16, h[1] + (e[1] - h[1]) * 0.16];
  return (
    <g transform={`translate(${x} ${hip}) scale(${dir * scale} ${scale})`}>
      {/* legs (jeans) + sneakers, under the hoodie hem */}
      <Tube pts={[[-6, -10], fk, ff]} w={30} fill={JEANS} />
      <Sneaker at={ff} />
      <Tube pts={[[8, -10], nk, nf]} w={30} fill={JEANS} />
      <Sneaker at={nf} />
      <g transform={`rotate(${lean} 0 0)`}>
        {/* far arm behind the body */}
        <Tube pts={[sh, fe, cuff(fe, fh)]} w={30} fill={HOODIE_DK} />
        <Hand at={fh} dir={[fh[0] - fe[0], fh[1] - fe[1]]} />
        {heldFar && <g transform={`translate(${fh[0]} ${fh[1]})`}>{heldFar}</g>}
        {/* hood behind the neck */}
        <ellipse cx={-40} cy={-NECK + 22} rx={58} ry={34} fill={HOODIE_DK} stroke={INK} strokeWidth={7} />
        {/* torso */}
        <path
          d={`M-58,${-SHOULDER - 22} Q0,${-SHOULDER - 40} 58,${-SHOULDER - 22} Q78,${-SHOULDER + 40} 72,-6 Q70,18 50,20 L-50,20 Q-72,18 -72,-6 Q-80,${-SHOULDER + 40} -58,${-SHOULDER - 22} Z`}
          fill={HOODIE}
          stroke={INK}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {pocket}
        <path d={`M-36,-70 L36,-70 Q46,-20 52,0 L-52,0 Q-46,-20 -36,-70 Z`} fill={HOODIE_DK} stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={0.9} />
        <path d={`M-62,6 L62,6`} stroke={INK} strokeWidth={5} />
        <path d={`M14,${-SHOULDER - 22} l-4,70 M36,${-SHOULDER - 20} l4,62`} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        <circle cx={10} cy={-SHOULDER + 50} r={6} fill="#fff" />
        <circle cx={40} cy={-SHOULDER + 44} r={6} fill="#fff" />
        <Tube pts={[[0, -NECK + 6], [0, -SHOULDER - 24]]} w={8} fill={SKIN_SHADE} />
        {/* head */}
        <g transform={`rotate(${tilt} 0 ${-NECK})`}>
          <g transform={`translate(0 ${headY})`}>
            {/* ear */}
            <ellipse cx={-R * 0.62} cy={R * 0.05} rx={R * 0.17} ry={R * 0.22} fill={skinOf(red, sick, SKIN)} stroke={INK} strokeWidth={7} />
            <clipPath id={clip}>
              <circle r={R} />
            </clipPath>
            <g clipPath={`url(#${clip})`}>
              <circle r={R} fill={red > 0 || sick > 0 ? skinOf(Math.min(1, red * 1.25), Math.min(1, sick * 1.25), SKIN) : SKIN_SHADE} />
              <circle r={R * 0.97} cx={R * 0.13} cy={-R * 0.1} fill={skinOf(red, sick, SKIN)} />
            </g>
            <circle r={R} fill="none" stroke={INK} strokeWidth={9} />
            <ellipse cx={-R * 0.62} cy={R * 0.05} rx={R * 0.07} ry={R * 0.1} fill={SKIN_SHADE} />
            <Face look={look} girl={false} base={SKIN} />
            <path d={`M${R * 0.3},${R * 0.1} q${R * 0.1},${R * 0.1} ${R * 0.02},${R * 0.17}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
            <Glasses glint={glint} />
            <Hair />
            {headExtras}
          </g>
        </g>
        {/* near arm over everything */}
        <Tube pts={[sh, ne, cuff(ne, nh)]} w={30} fill={HOODIE} />
        {held && <g transform={`translate(${nh[0]} ${nh[1]})`}>{held}</g>}
        <Hand at={nh} dir={[nh[0] - ne[0], nh[1] - ne[1]]} point={point} palm={palm} thumb={thumb} />
      </g>
    </g>
  );
};

// a phone held upright in the hand (screen facing the viewer); light = flashlight beam on
export const Phone: React.FC<{ rot?: number; glow?: number }> = ({ rot = -10, glow = 0 }) => (
  <g transform={`rotate(${rot}) translate(-6 -70)`}>
    <rect x={-26} y={-44} width={52} height={92} rx={10} fill="#2a2f3a" stroke={INK} strokeWidth={6} />
    <rect x={-19} y={-34} width={38} height={70} rx={5} fill="#6fa8ff" />
    {<path d="M-12,-20 L12,-20 M-12,-8 L6,-8" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />}
  </g>
);
