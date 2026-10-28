import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP01 from "./ep01.json";

// Classroom gag shorts: a smart-aleck student (white head) and a teacher (red head) in one fixed classroom, one dialogue
// line per beat, yellow captions, a laugh tag at the end. All art is SVG; the lines/timings come from <ep>.json
// (written by scripts/gen_gag_voice.py), so a new episode = a new JSON + `python scripts/gen_gag_voice.py <ep>`.
// "Life" comes from code, not from video AI: eased pose keyframes with overshoot, head bob/tilt while talking,
// anticipation before every big move, pupils that track the other character, a rising-anger value (not a face swap),
// secondary motion (tie, steam, sweat) and camera punches on the punchline.
export const FPS = 30;
const W = 1080;
const H = 1920;
const FLOOR = 1580;
const INK = "#111";
// Set to a file in public/ (e.g. "classroom-gag/bg_classroom.png", 1080x1920, made with ChatGPT) to replace the drawn classroom.
const BG_IMAGE = "";

type Emo = "blank" | "smug" | "grin" | "dawn" | "angry" | "scared";
type Who = "student" | "teacher";
type Line = { who: Who; text: string; start: number; end: number; student: Emo; teacher: Emo };
type Ep = { lines: Line[]; laughAt: number; total: number };

export const DURATION = Math.ceil(EP01.total * FPS);

// ---------- motion helpers ----------
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const backOut = (x: number) => {
  const c = 1.9;
  const k = clamp01(x) - 1;
  return 1 + (c + 1) * k * k * k + c * k * k;
};
// piecewise keyframes [time, value]: eased between keys, held before the first and after the last
const keys = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], smooth((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
  }
  return ks[ks.length - 1][1];
};
// like keys() but the move into each key overshoots and settles (for snappy gestures)
const snap = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], backOut((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
  }
  return ks[ks.length - 1][1];
};
const mixHex = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(lerp(v, y[i], k)).toString(16).padStart(2, "0")).join("");
};

// ---------- classroom ----------
const Classroom: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="#e9e3d6" />
    <rect y={FLOOR - 120} width={W} height={H - FLOOR + 120} fill="#d9d4cb" />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={i * 110 - 60} y1={FLOOR - 120} x2={i * 160 - 380} y2={H} stroke="#c9c3b8" strokeWidth={4} />
    ))}
    <line x1={0} y1={FLOOR - 120} x2={W} y2={FLOOR - 120} stroke="#bdb6a8" strokeWidth={6} />
    <polygon points="90,0 330,0 290,60 130,60" fill="#fbfaf5" stroke="#bdb6a8" strokeWidth={4} />
    <polygon points="760,0 1000,0 960,60 800,60" fill="#fbfaf5" stroke="#bdb6a8" strokeWidth={4} />
    <rect x={150} y={230} width={820} height={420} rx={10} fill="#3d5a47" stroke="#b9a584" strokeWidth={14} />
    <rect x={150} y={640} width={820} height={22} fill="#b9a584" />
    <rect x={640} y={620} width={90} height={16} rx={4} fill="#f4f1e8" />
    <rect x={150} y={150} width={820} height={34} rx={6} fill="#d8d2c4" stroke="#9a9384" strokeWidth={3} />
    <rect x={8} y={290} width={90} height={110} rx={8} fill="#7b7f86" stroke={INK} strokeWidth={4} />
    <rect x={20} y={470} width={120} height={190} fill="#f6f3ea" stroke="#bdb6a8" strokeWidth={3} />
    <circle cx={60} cy={880} r={58} fill="#7fb6d6" stroke={INK} strokeWidth={4} />
    <rect x={40} y={940} width={40} height={30} fill="#8a6a45" />
    <rect x={0} y={960} width={260} height={30} fill="#b07a45" />
    <rect x={20} y={990} width={14} height={FLOOR - 990} fill="#4d4b49" />
    <rect x={720} y={930} width={360} height={36} fill="#b07a45" />
    <rect x={740} y={966} width={20} height={FLOOR - 966 - 70} fill="#4d4b49" />
    <rect x={720} y={760} width={90} height={170} fill="#d8c9a8" stroke="#8a7a58" strokeWidth={3} />
    <rect x={820} y={820} width={110} height={110} fill="#c9d6c6" stroke="#8a9a88" strokeWidth={3} />
    <rect x={1012} y={1050} width={16} height={FLOOR - 1050} fill="#4d4b49" />
    <rect x={910} y={1050} width={150} height={20} rx={6} fill="#a8a29a" />
  </g>
);

// ---------- faces ----------
// dir = which way the face looks (+1 right, -1 left); eyes sit toward that side, like a three-quarter view.
// anger 0..1 drives brows, face colour and mouth continuously; lift raises the brows (surprise / the question mark).
const Head: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
  emo: Emo;
  talk: number;
  dir: 1 | -1;
  blink: boolean;
  anger?: number;
  lift?: number;
  gaze?: number; // extra pupil offset, in units of eye radius
}> = ({ cx, cy, r, fill, emo, talk, dir, blink, anger = emo === "angry" ? 1 : 0, lift = 0, gaze = 0 }) => {
  const ex = [cx + dir * r * 0.1, cx + dir * r * 0.62];
  const ey = cy - r * 0.05;
  const er = r * 0.26;
  const mx = cx + dir * r * 0.38;
  const my = cy + r * 0.5;
  const lids = (emo === "smug" || emo === "grin") && anger < 0.2;
  const open = Math.max(talk, emo === "scared" ? 0.8 : 0, anger > 0.6 ? 0.9 : 0, emo === "grin" ? 0.5 : 0);
  const mw = r * lerp(0.4, 0.62, anger);
  const pupil = emo === "scared" ? er * 0.2 : er * lerp(0.38, 0.3, anger);
  const look = (emo === "blank" || emo === "dawn" ? 0.25 : 0) + gaze;
  const browY = ey - er * (lids ? 1.5 : 1.75) - (emo === "scared" ? er * 0.4 : 0) - lift * er * 0.7 + anger * er * 0.25;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={INK} strokeWidth={r * 0.05} />
      {ex.map((x, i) => {
        // angry brows tilt down toward the nose: the eye nearer the face centre line is the inner one
        const inner = i === 0 ? dir : -dir;
        const tilt = r * (0.3 * anger + (lids ? 0.05 : 0));
        return (
          <g key={i}>
            {blink ? (
              <line x1={x - er} y1={ey} x2={x + er} y2={ey} stroke={INK} strokeWidth={r * 0.05} strokeLinecap="round" />
            ) : (
              <>
                <ellipse cx={x} cy={ey} rx={er} ry={(emo === "scared" ? er * 1.25 : er * 1.1) * (1 - anger * 0.12 + lift * 0.1)} fill="#fff" stroke={INK} strokeWidth={r * 0.04} />
                <circle cx={x + dir * er * (0.3 + look)} cy={ey + er * 0.05} r={pupil} fill={INK} />
                {lids && <rect x={x - er * 1.1} y={ey - er * 1.3} width={er * 2.2} height={er * 1.25} fill={fill} />}
                {lids && <line x1={x - er * 1.05} y1={ey - er * 0.05} x2={x + er * 1.05} y2={ey - er * 0.05} stroke={INK} strokeWidth={r * 0.05} strokeLinecap="round" />}
              </>
            )}
            <line x1={x - er * 1.1} y1={browY + inner * tilt * -1} x2={x + er * 1.1} y2={browY + inner * tilt} stroke={INK} strokeWidth={r * 0.06} strokeLinecap="round" />
          </g>
        );
      })}
      {anger > 0.6 ? (
        <path d={`M${mx - mw / 2},${my + r * 0.22} Q${mx},${my - r * 0.22} ${mx + mw / 2},${my + r * 0.22} Q${mx},${my + r * (0.25 + 0.3 * open)} ${mx - mw / 2},${my + r * 0.22} Z`} fill="#7a2e2e" stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />
      ) : open > 0.04 ? (
        <path d={`M${mx - mw / 2},${my} Q${mx},${my + r * 0.5 * open} ${mx + mw / 2},${my} Q${mx},${my - r * 0.05} ${mx - mw / 2},${my} Z`} fill="#7a2e2e" stroke={INK} strokeWidth={r * 0.05} strokeLinejoin="round" />
      ) : (
        <path d={`M${mx - mw / 2},${my + anger * r * 0.1} Q${mx},${my + (lids ? r * 0.1 : -anger * r * 0.12)} ${mx + mw / 2},${my - (lids ? r * 0.1 : 0) + anger * r * 0.1}`} stroke={INK} strokeWidth={r * 0.05} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

// ---------- bodies ----------
// two-bone arm: angles in degrees, 0 = pointing right, 90 = down
const limb = (x0: number, y0: number, a1: number, l1: number, a2: number, l2: number) => {
  const r1 = (a1 * Math.PI) / 180;
  const r2 = (a2 * Math.PI) / 180;
  const ex = x0 + Math.cos(r1) * l1;
  const ey = y0 + Math.sin(r1) * l1;
  return { ex, ey, hx: ex + Math.cos(r2) * l2, hy: ey + Math.sin(r2) * l2 };
};

// two-bone leg by inverse kinematics: the knee bends towards the side the character faces (dir)
const leg = (hx: number, hy: number, fx: number, fy: number, len: number, dir: number) => {
  const dx = fx - hx;
  const dy = fy - hy;
  const d = Math.min(Math.hypot(dx, dy), len * 1.98);
  const h = Math.sqrt(Math.max(0, len * len - (d / 2) * (d / 2)));
  const ux = dx / Math.hypot(dx, dy);
  const uy = dy / Math.hypot(dx, dy);
  let px = -uy;
  let py = ux;
  if (px * dir < 0) {
    px = -px;
    py = -py;
  }
  return { kx: hx + ux * (d / 2) + px * h, ky: hy + uy * (d / 2) + py * h };
};
// a foot that lifts and slams: rises over `dur`, then drops on tImpact (lift is 0 again at the impact)
const stompLift = (t: number, tImpact: number, height = 80, dur = 0.28) => {
  const k = (t - (tImpact - dur)) / dur;
  if (k <= 0 || k >= 1) return 0;
  return height * (k < 0.7 ? smooth(k / 0.7) : 1 - (k - 0.7) / 0.3);
};
const Dust: React.FC<{ x: number; t: number; at: number }> = ({ x, t, at }) => {
  const age = (t - at) / 0.5;
  if (age < 0 || age > 1) return null;
  return (
    <g opacity={1 - age}>
      {[-1, 1].flatMap((s) => [0, 1, 2].map((i) => <circle key={`${s}${i}`} cx={x + s * (50 + age * (90 + i * 40))} cy={FLOOR - 10 - age * (30 + i * 18)} r={16 + age * 26 - i * 3} fill="#efe9dc" stroke="#cfc7b5" strokeWidth={3} />))}
      <path d={`M${x - 110 - age * 60},${FLOOR + 14} l-30,12 M${x + 110 + age * 60},${FLOOR + 14} l30,12`} stroke="#8a8478" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

const Hand: React.FC<{ x: number; y: number }> = ({ x, y }) => <circle cx={x} cy={y} r={20} fill="#fff" stroke={INK} strokeWidth={5} />;
// pointing hand: fist plus an index finger continuing the forearm
const PointHand: React.FC<{ x: number; y: number; ang: number }> = ({ x, y, ang }) => (
  <g>
    <line x1={x} y1={y} x2={x + Math.cos((ang * Math.PI) / 180) * 48} y2={y + Math.sin((ang * Math.PI) / 180) * 48} stroke={INK} strokeWidth={13} strokeLinecap="round" />
    <line x1={x} y1={y} x2={x + Math.cos((ang * Math.PI) / 180) * 46} y2={y + Math.sin((ang * Math.PI) / 180) * 46} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
    <Hand x={x} y={y} />
  </g>
);
const Bone: React.FC<{ pts: number[][]; w?: number }> = ({ pts, w = 9 }) => (
  <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);
const Shadow: React.FC<{ x: number; k?: number }> = ({ x, k = 1 }) => <ellipse cx={x} cy={FLOOR + 6} rx={130 * k} ry={18 * k} fill="#000" opacity={0.13 * k} />;

type Pose = { a: [number, number]; b: [number, number] };
const SCALE = 1.2; // both characters are drawn at this size, scaled about their feet

const Student: React.FC<{ x: number; emo: Emo; talk: number; pose: Pose; dy: number; squash: number; tilt: number; t: number; f: number; blink: boolean; lift: number; fear: number; footL: number; footR: number; pointing: boolean }> = ({ x, emo, talk, pose, dy, squash, tilt, t, f, blink, lift, fear, footL, footR, pointing }) => {
  const bob = talk > 0 ? Math.sin(f * 0.55) * 5 : Math.sin(t * 2) * 2; // head nods with the words, breathes when silent
  const hy = 700 + dy + bob;
  const neckY = hy + 130;
  const hipY = 1215 + dy;
  const sh = neckY + 55;
  const a = limb(x, sh, pose.a[0], 130, pose.a[1], 120);
  const b = limb(x, sh, pose.b[0], 130, pose.b[1], 120);
  const fL = { x: x - 62, y: FLOOR - 25 - footL };
  const fR = { x: x + 62, y: FLOOR - 25 - footR };
  const kL = leg(x, hipY, fL.x, fL.y, 190, 1);
  const kR = leg(x, hipY, fR.x, fR.y, 190, 1);
  const tremble = fear * Math.sin(f * 2.3) * 5;
  return (
    <g transform={`translate(${Math.sin(t * 2.1) * 4 + tremble} 0)`}>
      <Shadow x={x} k={1 - clamp01(-dy / 160) * 0.5} />
      {/* scale, then squash & stretch, both about the feet */}
      <g transform={`translate(${x} ${FLOOR}) scale(${SCALE * (1 + squash * 0.06)} ${SCALE * (1 - squash * 0.08)}) translate(${-x} ${-FLOOR})`}>
        <Bone w={11} pts={[[x, hipY], [kL.kx, kL.ky], [fL.x, fL.y]]} />
        <Bone w={11} pts={[[x, hipY], [kR.kx, kR.ky], [fR.x, fR.y]]} />
        <ellipse cx={fL.x - 6} cy={fL.y + 14} rx={44} ry={15} fill="#222" stroke={INK} strokeWidth={4} />
        <ellipse cx={fR.x + 6} cy={fR.y + 14} rx={44} ry={15} fill="#222" stroke={INK} strokeWidth={4} />
        <Bone w={11} pts={[[x, neckY], [x, hipY]]} />
        <Bone w={10} pts={[[x, sh], [a.ex, a.ey], [a.hx, a.hy]]} />
        <Bone w={10} pts={[[x, sh], [b.ex, b.ey], [b.hx, b.hy]]} />
        {pointing ? <PointHand x={a.hx} y={a.hy} ang={pose.a[1]} /> : <Hand x={a.hx} y={a.hy} />}
        <Hand x={b.hx} y={b.hy} />
        <g transform={`rotate(${tilt} ${x} ${neckY})`}>
          <Head cx={x} cy={hy} r={135} fill="#fdfdfb" emo={emo} talk={talk} dir={1} blink={blink} lift={lift} gaze={0.1 * Math.sin(t * 1.3)} />
          {fear > 0 &&
            [0, 1, 2].map((i) => {
              const age = (t * 1.8 + i / 3) % 1; // sweat drops slide down the temple
              return <path key={i} d={`M${x - 130 - i * 18},${hy - 90 + age * 150} q-10,18 0,26 q10,-8 0,-26`} fill="#7fc8f0" stroke={INK} strokeWidth={3} opacity={fear * (1 - age)} />;
            })}
        </g>
      </g>
    </g>
  );
};

const Teacher: React.FC<{ x: number; emo: Emo; talk: number; arm: [number, number]; arm2: [number, number]; lean: number; headTilt: number; anger: number; shake: number; t: number; f: number; blink: boolean; lift: number; footL: number; footR: number; bounce: number }> = ({ x, emo, talk, arm, arm2, lean, headTilt, anger, shake, t, f, blink, lift, footL, footR, bounce }) => {
  const bob = (talk > 0 ? Math.sin(f * 0.5) * 5 : Math.sin(t * 1.6) * 2) + bounce;
  const hy = 640 + bob;
  const sy = 815 + bounce;
  const hipY = 1240;
  const a = limb(x - 70, sy + 20, arm[0], 150, arm[1], 140);
  const b = limb(x + 70, sy + 20, arm2[0], 130, arm2[1], 120);
  const tieSwing = Math.sin(t * 3 + anger * 4) * (3 + anger * 5) + lean * -0.8;
  const skin = mixHex("#e8442a", "#b81f0c", anger);
  const fL = { x: x - 58, y: FLOOR - 25 - footL };
  const fR = { x: x + 58, y: FLOOR - 25 - footR };
  const kL = leg(x - 40, hipY, fL.x, fL.y, 175, -1);
  const kR = leg(x + 40, hipY, fR.x, fR.y, 175, -1);
  return (
    <g transform={`translate(${Math.sin(t * 1.7 + 1) * 3 + shake} 0)`}>
      <Shadow x={x} />
      <g transform={`translate(${x} ${FLOOR}) scale(${SCALE}) translate(${-x} ${-FLOOR})`}>
        <Bone w={22} pts={[[x - 40, hipY], [kL.kx, kL.ky], [fL.x, fL.y]]} />
        <Bone w={22} pts={[[x + 40, hipY], [kR.kx, kR.ky], [fR.x, fR.y]]} />
        <ellipse cx={fL.x - 4} cy={fL.y + 17} rx={46} ry={16} fill={INK} />
        <ellipse cx={fR.x - 4} cy={fR.y + 17} rx={46} ry={16} fill={INK} />
        {/* upper body leans from the hips: forward (negative, towards the student) when shouting */}
        <g transform={`rotate(${lean} ${x} ${hipY})`}>
          <Bone pts={[[x + 70, sy + 20], [b.ex, b.ey], [b.hx, b.hy]]} />
          <Hand x={b.hx} y={b.hy} />
          <Bone w={22} pts={[[x, hy + 130], [x, sy + 10]]} />
          <path d={`M${x - 85},${sy} h170 v${hipY - sy - 10} h-170 z`} fill="#fbfbf8" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <polygon points={`${x - 28},${sy} ${x},${sy + 55} ${x + 28},${sy}`} fill="#fff" stroke={INK} strokeWidth={5} />
          <g transform={`rotate(${tieSwing} ${x} ${sy + 45})`}>
            <polygon points={`${x - 14},${sy + 45} ${x + 14},${sy + 45} ${x + 20},${sy + 330} ${x},${sy + 365} ${x - 20},${sy + 330}`} fill="#15283f" stroke={INK} strokeWidth={4} />
          </g>
          <Bone pts={[[x - 70, sy + 20], [a.ex, a.ey], [a.hx, a.hy]]} />
          {anger > 0.9 ? <PointHand x={a.hx} y={a.hy} ang={arm[1]} /> : <Hand x={a.hx} y={a.hy} />}
          <g transform={`rotate(${headTilt} ${x} ${hy + 130})`}>
            <Head cx={x} cy={hy} r={150} fill={skin} emo={emo} talk={talk} dir={-1} blink={blink} anger={anger} lift={lift} />
            {anger > 0.3 && (
              <>
                {/* anger vein */}
                <g stroke="#6e0f06" strokeWidth={8} strokeLinecap="round" opacity={clamp01((anger - 0.3) * 2)} transform={`translate(${x + 85} ${hy - 105}) scale(${1 + Math.sin(f * 1.2) * 0.08})`}>
                  <path d="M-18,-6 q12,-8 22,0 M-18,6 q12,8 22,0 M-6,-18 q-8,12 0,22 M6,-18 q8,12 0,22" fill="none" />
                </g>
                {/* steam puffs */}
                {[0, 1, 2].map((i) => {
                  const age = (t * 1.3 + i / 3) % 1;
                  return <circle key={i} cx={x + (i - 1) * 70 + Math.sin(age * 6 + i) * 14} cy={hy - 165 - age * 150} r={20 + age * 26} fill="#fff" stroke="#cfcfcf" strokeWidth={3} opacity={clamp01((anger - 0.4) * 1.6) * (1 - age) * 0.85} />;
                })}
              </>
            )}
          </g>
        </g>
      </g>
    </g>
  );
};

// ---------- captions ----------
// split a line into caption chunks at "and"/"then", timed in proportion to their word counts
const chunks = (text: string, start: number, end: number) => {
  const parts = text.replace(/[.,!?]/g, "").split(/\s+(?=and |then )/);
  const total = parts.reduce((n, p) => n + p.split(/\s+/).length, 0);
  let t = start;
  return parts.map((p) => {
    const d = ((end - start) * p.split(/\s+/).length) / total;
    const c = { text: p, from: t, to: t + d };
    t += d;
    return c;
  });
};

const Caption: React.FC<{ text: string; f: number; from: number; to: number; punch?: boolean }> = ({ text, f, from, to, punch }) => {
  if (f < from * FPS || f > to * FPS + 2) return null;
  const k = (f - from * FPS) / 6;
  const s = lerp(0.6, 1, backOut(k)) * (punch ? 1.18 : 1);
  const jx = punch ? Math.sin(f * 4) * 15 * (1 - clamp01(k / 3)) : 0;
  const words = text.split(" ");
  const mid = Math.ceil(words.length / 2);
  const rows = words.length > 3 ? [words.slice(0, mid).join(" "), words.slice(mid).join(" ")] : [text];
  return (
    <g transform={`translate(${W / 2 + jx} 1330) scale(${s})`}>
      {rows.map((r, i) => (
        <text key={i} y={i * 100} textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} fontSize={92} fill="#ffe800" stroke="#111" strokeWidth={16} paintOrder="stroke" strokeLinejoin="round">
          {r}
        </text>
      ))}
    </g>
  );
};

// ---------- the laugh tag ----------
const Laugh: React.FC<{ t: number }> = ({ t }) => {
  const tear = (t * 1.4) % 1;
  const pop = backOut(t / 0.25);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <rect x={0} y={560} width={W} height={760} fill="#e9e3d6" />
        <g transform={`translate(${W / 2 + Math.sin(t * 38) * 10} ${940 + Math.sin(t * 19) * 14}) rotate(${Math.sin(t * 24) * 6}) scale(${pop})`}>
          <circle r={290} fill="#fdfdfb" stroke={INK} strokeWidth={16} />
          <path d="M-170,-60 q70,-80 140,0" stroke={INK} strokeWidth={18} fill="none" strokeLinecap="round" />
          <path d="M30,-60 q70,-80 140,0" stroke={INK} strokeWidth={18} fill="none" strokeLinecap="round" />
          <path d="M-190,60 Q0,360 190,60 Z" fill="#7a2e2e" stroke={INK} strokeWidth={16} strokeLinejoin="round" />
          <path d="M-120,120 Q0,230 120,120 Q0,150 -120,120" fill="#e87a7a" />
          {[-1, 1].map((s) => (
            <path key={s} d={`M${s * 170},-10 q${s * 40},${60 + tear * 80} ${s * 10},${130 + tear * 80}`} stroke="#4aa3d8" strokeWidth={14} fill="none" strokeLinecap="round" />
          ))}
        </g>
        {["HA", "HA", "HA"].map((s, i) => {
          const k = clamp01((t - 0.25 - i * 0.22) / 0.2);
          return (
            <text key={i} x={80 + i * 330} y={640 + (i % 2) * 600 + Math.sin(t * 12 + i) * 8} fontFamily="'Arial Black', Impact, sans-serif" fontSize={110} fill="#ffe800" stroke="#111" strokeWidth={14} paintOrder="stroke" opacity={k} transform={`rotate(${(i - 1) * 9} ${140 + i * 330} 700)`}>
              {s}
            </text>
          );
        })}
      </svg>
      <div style={{ position: "absolute", right: 90, top: 1380, fontSize: 190, transform: `rotate(${Math.sin(t * 20) * 10}deg)` }}>😂</div>
    </AbsoluteFill>
  );
};

// ---------- video ----------
export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ep = EP01 as unknown as Ep;
  const lines = ep.lines;
  const cur = lines.find((l) => t >= l.start && t <= l.end + 0.05);
  const last = [...lines].reverse().find((l) => t >= l.start) ?? lines[0];
  const [l1, l2, l3, l4] = lines;
  const talk = (who: Who) => (cur && cur.who === who ? Math.max(0, Math.sin(f * 1.15)) ** 1.3 : 0);

  // emotions: the teacher's anger is a continuous value that ramps up through line 3 and peaks on line 4
  const anger = keys(t, [[l2.end, 0], [l3.start + 0.35, 0.15], [l3.end, 0.85], [l4.start, 1]]);
  const tEmo: Emo = anger > 0.5 ? "angry" : last.teacher === "dawn" ? "blank" : last.teacher;
  const sEmo: Emo = last.student;

  // blinks (staggered so the two never blink together)
  const blinkS = f % 84 > 80 && sEmo !== "scared";
  const blinkT = f % 111 > 107 && anger < 0.3;

  // --- student pose: eased keyframes, with a tiny gesture wobble on the hand while he talks ---
  const wob = talk("student") > 0 ? Math.sin(f * 0.4) * 4 : 0;
  const a1 = keys(t, [[0, 100], [l1.start + 0.1, 100], [l1.start + 0.5, -10], [l1.start + 1.2, -10], [l1.start + 1.6, 125], [l1.end, 125], [l2.start, 100], [l3.start - 0.1, 100], [l3.start + 0.25, 40], [l4.start - 0.1, 40], [l4.start + 0.15, 80]]);
  const a2 = keys(t, [[0, 100], [l1.start + 0.1, 100], [l1.start + 0.5, -25], [l1.start + 1.2, -25], [l1.start + 1.6, 205], [l1.end, 205], [l2.start, 100], [l3.start - 0.1, 100], [l3.start + 0.25, -60], [l4.start - 0.1, -60], [l4.start + 0.15, -140]]);
  const b1 = keys(t, [[0, 82], [l3.start - 0.1, 82], [l3.start + 0.25, 60], [l4.start - 0.1, 60], [l4.start + 0.15, 130]]);
  const b2 = keys(t, [[0, 80], [l3.start - 0.1, 80], [l3.start + 0.25, -50], [l4.start - 0.1, -50], [l4.start + 0.15, 200]]);
  const pose: Pose = { a: [a1 + wob, a2], b: [b1, b2] };

  // student: crouch (anticipation) -> jump back -> land
  const crouch = Math.sin(clamp01((t - (l4.start - 0.02)) / 0.12) * Math.PI);
  const jump = clamp01((t - (l4.start + 0.1)) / 0.4);
  const hop = Math.sin(jump * Math.PI) * -90 + crouch * 14;
  const sx = 250 - backOut(jump) * 55;
  const squash = crouch - Math.sin(jump * Math.PI) * 0.8;
  const sTilt = keys(t, [[l1.start, -5], [l1.end, -6], [l2.start, -2], [l3.start, -5], [l4.start, 0], [l4.start + 0.3, 6]]);
  const sLift = (t > l1.end - 0.7 && t < l2.start ? 0.9 : 0) + (t >= l4.start ? clamp01(1 - (t - l4.start) * 4) : 0);
  const fear = clamp01((t - l4.start) / 0.3);

  // --- teacher: nod on "You.", rising tension, wind-up then lunge on the shout ---
  const lean = keys(t, [[0, 0], [l2.start, 0], [l2.start + 0.15, 3], [l3.start + 0.2, 1], [l3.end, -2], [l4.start - 0.2, 4], [l4.start + 0.15, -9], [l4.end, -7]]);
  const headTilt = keys(t, [[0, 0], [l2.start, 0], [l2.start + 0.12, 6], [l2.end + 0.1, 0], [l3.start + 0.3, -3], [l4.start - 0.2, 4], [l4.start + 0.15, -9]]);
  const tA1 = snap(t, [[0, 100], [l4.start - 0.3, 100], [l4.start - 0.1, 85], [l4.start + 0.12, 190]]);
  const tA2 = snap(t, [[0, 85], [l4.start - 0.3, 85], [l4.start - 0.1, 70], [l4.start + 0.12, 185]]);
  const arm2: [number, number] = [keys(t, [[l3.start + 0.2, 95], [l3.end, 112], [l4.start, 125]]), keys(t, [[l3.start + 0.2, 80], [l3.end, -150], [l4.start, -165]]) + (anger > 0.5 ? Math.sin(f * 1.7) * 6 : 0)];
  // stomps: impatient foot-tap while he simmers, then two slams on the shout (dust + shake on each)
  const I1 = l4.start + 0.05;
  const I2 = l4.start + 0.5;
  const tap = t > l3.start + 0.3 && t < l4.start - 0.3 ? 16 * Math.max(0, Math.sin(t * 14)) * clamp01((anger - 0.2) * 2) : 0;
  const tFootL = stompLift(t, I1, 85);
  const tFootR = Math.max(tap, stompLift(t, I2, 85));
  const bounce = (I: number) => (t >= I ? 9 * Math.exp(-(t - I) * 12) * Math.cos((t - I) * 25) : 0);
  const tBounce = bounce(I1) + bounce(I2);
  const sFootR = t >= l2.start && t < l3.start ? 14 * Math.max(0, Math.sin(t * 10)) : 0; // nervous tap while waiting for the answer
  const sJumpLift = Math.max(0, -hop) * 0.9;
  const sPoint = t >= l1.start + 0.5 && t < l1.start + 1.3;
  const rage = anger > 0.5 ? Math.sin(t * 60) * (t >= l4.start ? 5 : 2.5 * anger) : 0;
  const tLift = t >= l2.start && t < l2.start + 0.25 ? 0.7 : 0;

  // --- camera: slow push-in, a punch + shake on the shout, red flash ---
  const since = t - l4.start;
  const punchZ = since >= 0 ? 0.05 * Math.exp(-since * 5) : 0;
  const zoom = 1 + t * 0.002 + punchZ;
  const kick = (I: number, amp: number) => (t >= I && t < I + 0.6 ? amp * Math.exp(-(t - I) * 6) : 0);
  const cs = Math.max(kick(l4.start, 1), kick(I1, 0.8), kick(I2, 0.7));
  const cx = Math.sin(f * 7) * 14 * cs;
  const cy = Math.cos(f * 9) * 10 * cs;
  const flash = since >= 0 ? Math.exp(-since * 14) * 0.22 : 0;

  if (t >= ep.laughAt) return <Laugh t={t - ep.laughAt} />;
  return (
    <AbsoluteFill style={{ background: "#e9e3d6" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", transform: `translate(${cx}px, ${cy}px) scale(${zoom})`, transformOrigin: "50% 60%" }}>
        {BG_IMAGE ? <image href={staticFile(BG_IMAGE)} width={W} height={H} preserveAspectRatio="xMidYMid slice" /> : <Classroom />}
        <Student x={sx} footL={sJumpLift} footR={Math.max(sJumpLift, sFootR)} pointing={sPoint} emo={sEmo} talk={talk("student")} pose={pose} dy={hop} squash={squash} tilt={sTilt} t={t} f={f} blink={blinkS} lift={sLift} fear={fear} />
        <Teacher x={770} arm2={arm2} footL={tFootL} footR={tFootR} bounce={tBounce} emo={tEmo} talk={talk("teacher")} arm={[tA1, tA2]} lean={lean} headTilt={headTilt} anger={anger} shake={rage} t={t} f={f} blink={blinkT} lift={tLift} />
        <Dust x={770 - 70} t={t} at={I1} />
        <Dust x={770 + 70} t={t} at={I2} />
        {lines.flatMap((l, i) => chunks(l.text, l.start, l.end).map((c, j) => <Caption key={`${i}-${j}`} text={c.text} f={f} from={c.from} to={c.to} punch={l === l4} />))}
      </svg>
      <AbsoluteFill style={{ background: "#ff2a00", opacity: flash, mixBlendMode: "multiply" }} />
      {lines.map((l, i) => (
        <Sequence key={i} from={Math.round(l.start * FPS)}>
          <Audio src={staticFile(`classroom-gag/ep01/voice_${i}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={Math.round(l2.start * FPS)}>
        <Audio src={staticFile("classroom-gag/ep01/pop.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={Math.round(I2 * FPS)}>
        <Audio src={staticFile("classroom-gag/ep01/thud.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={Math.round(l4.start * FPS)}>
        <Audio src={staticFile("classroom-gag/ep01/thud.wav")} volume={0.5} />
        <Audio src={staticFile("classroom-gag/ep01/whoosh.wav")} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
