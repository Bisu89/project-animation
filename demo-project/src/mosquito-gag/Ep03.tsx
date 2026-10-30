import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Face, FaceP, faceAt, PALETTE } from "../bedroom-gag/Face";
import { Arm, Hand } from "../bedroom-gag/Primitives";
import { clamp01, smooth } from "../bedroom-gag/config";
import { W, H, SHADE, BLANKET, FACE, LAMP_HAND, ARM_W, HAND_R, lerp, ramp, track, Backdrop, Puffs, AngerMark, Zzz } from "./common";
import { Mosquito, MMood, LegPose, MOODS } from "./Mosquito";

// Ep 3 "Fat mosquito". Act 1: it drinks from his hand, his cheek and his forehead while he swats at nothing, until it is a
// round blood balloon that cannot fly and plops onto the blanket. Act 2: lamp on, he grins, almost slaps it (pictures the
// splatter on his pillow), and flicks it around the room like a rubber ball instead. Twist: on the big last flick it stabs
// his loaded finger, his hand jerks and the finger flicks his own forehead; it rolls off the bed and under it, burps.
// The mosquito wins this one. 9:16, about 27 s. Times are seconds; same world/props as ep 1-2 (common.tsx). No text.
export const FPS = 30;
const T_CLOSE = 2.4;
const T_LAND1 = 2.9; // lands on his hand, drinks
const T_SLAP1 = 4.2; // right hand slaps the left hand, it is gone
const T_LAND2 = 5.3; // cheek
const T_CLAP = 6.9; // clap in the air above his face, miss
const T_RAGE = 7.2;
const T_ENDURE = 8.3; // eyes squeezed shut, teeth gritted, gives up
const T_LAND3 = 8.9; // forehead, the long drink
const T_FULL = 10.3; // unplugs, too heavy to fly
const T_PLOP = 10.85; // drops onto the blanket
const T_LAMP = 11.1;
const T_GRIN = 11.8; // "hehehe"
const T_PALM = 12.3; // raises a palm to slap it ... thought bubble: blood on the pillow
const T_SHAKE = 13.1; // shakes his head, switches to a flick
const F1 = 13.7; // flicks (snap times)
const F2 = 15.1;
const F3 = 16.45;
const T_AIM = 18.4; // the last flick, loaded right under his chin
const T_STAB = 19.6; // it stabs the finger
const T_BONK = 19.88; // hand jerks, finger flicks his own forehead
const T_ROLL = 21.2; // rolls off towards the bed edge
const T_EDGE = 21.9;
const T_DROP = 22.2; // floor
const T_UNDER = 22.7; // rolled under the bed
const T_PEEK = 23.0; // eyes in the dark, burp, giggle
const T_BACK = 24.2; // back on his dazed face
const T_OFF = 25.3; // lamp off, buzzing again
export const DURATION = Math.round(27.3 * FPS);

// spots for this episode (world px)
const L_BASE = [235, 935];
const R_BASE = [440, 960];
const L_REST = [200, 968]; // left hand lying on the blanket in act 1
const REST = [370, 905]; // the fat mosquito lying on the blanket under his chin
const CLOCK = [745, 712];
const SHADE_HIT = [120, 655];
const WINDOW = [410, 480];
const POST = [660, 610]; // right headboard post
const EDGE = [715, 885]; // right edge of the blanket
const FLOOR = [930, 1110]; // bare floor below the slippers
const UNDER = [818, 1122]; // just behind the drape of the blanket
const BED_EDGE = "M600,868 L730,872 L760,930 L795,1000 L835,1100 L870,1200 L915,1300 L1000,1920 L600,1920 Z"; // the blanket drape on the right, hides it
const FOREHEAD = [286, 719];

// ---------- mosquito ----------
type MState = { x: number; y: number; s: number; flip: number; mood: MMood; legs: LegPose; flap: number; tilt: number; tremble: number; belly: number; squash: number; hidden: boolean };
// flight/roll segments: [t0, t1, x0, y0, s0, x1, y1, s1, arc, roll]
type Seg = [number, number, number, number, number, number, number, number, number, number];
const seg = (t0: number, t1: number, a: number[], b: number[], arc: number, roll = 0): Seg => [t0, t1, a[0], a[1], a[2] ?? 0.5, b[0], b[1], b[2] ?? 0.5, arc, roll];
const R = [...REST, 0.5];
const BOUNCES: Seg[] = [
  // F1: into the clock, back onto the blanket, rolls down to him
  seg(F1, F1 + 0.3, R, [...CLOCK, 0.42], 70), seg(F1 + 0.3, F1 + 0.8, [...CLOCK, 0.42], [560, 885], 130), seg(F1 + 0.8, F1 + 0.92, [560, 885], [540, 885], 22), seg(F1 + 0.92, F1 + 1.35, [540, 885], R, 0, 1),
  // F2: into the lamp shade
  seg(F2, F2 + 0.3, R, [...SHADE_HIT, 0.42], 70), seg(F2 + 0.3, F2 + 0.75, [...SHADE_HIT, 0.42], [215, 882], 110), seg(F2 + 0.75, F2 + 0.85, [215, 882], [232, 884], 20), seg(F2 + 0.85, F2 + 1.2, [232, 884], R, 0, 1),
  // F3: pinball - window, headboard post, clock, blanket
  seg(F3, F3 + 0.25, R, [...WINDOW, 0.36], 40), seg(F3 + 0.25, F3 + 0.5, [...WINDOW, 0.36], [...POST, 0.4], 50), seg(F3 + 0.5, F3 + 0.7, [...POST, 0.4], [...CLOCK, 0.42], 20),
  seg(F3 + 0.7, F3 + 1.15, [...CLOCK, 0.42], [560, 880], 120), seg(F3 + 1.15, F3 + 1.25, [560, 880], [540, 882], 20), seg(F3 + 1.25, F3 + 1.65, [540, 882], R, 0, 1),
  // the end: rolls off the bed, drops to the floor, rolls under the bed
  seg(T_ROLL, T_EDGE, R, EDGE, 0, 1), seg(T_EDGE, T_DROP, EDGE, FLOOR, 40), seg(T_DROP, T_DROP + 0.1, FLOOR, [915, 1112], 14), seg(T_DROP + 0.15, T_UNDER, [915, 1112], UNDER, 0, 1),
];
const HITS = BOUNCES.filter((b, i) => i + 1 < BOUNCES.length && BOUNCES[i + 1][0] === b[1] && !b[9]).map((b) => b[1]);
const segAt = (t: number) => BOUNCES.find((b) => t >= b[0] && t < b[1]);

const mosquitoAt = (t: number): MState => {
  const wob = (a: number) => [Math.sin(t * 5.3) * 7 * a + Math.sin(t * 9.1) * 3 * a, Math.cos(t * 6.4) * 6 * a + Math.sin(t * 11.7) * 2 * a];
  const base: MState = { x: 0, y: 0, s: 0.5, flip: -1, mood: MOODS.sneaky, legs: "dangle", flap: 1, tilt: 0, tremble: 0, belly: 0, squash: 0, hidden: false };
  const fly = (ks: number[][], a = 1) => {
    const [x, y] = track(t, ks);
    const [wx, wy] = wob(a);
    return [x + wx, y + wy];
  };
  // sitting and drinking: wings folded, a gentle pump
  const drink = (x: number, y: number, tilt: number, b0: number, b1: number, t0: number, t1: number): MState => {
    const k = ramp(t, t0 + 0.2, t1);
    return { ...base, x, y, tilt: tilt + Math.sin(t * 7) * 1.5, flap: 0.2, belly: lerp(b0, b1, k), mood: MOODS.bliss, legs: "dangle" };
  };
  const c = T_CLOSE;
  if (t < c) {
    const [x, y] = fly([[0, 560, 540], [1.0, 470, 650], [1.8, 400, 600], [c, 330, 760]]);
    return { ...base, x, y, s: 0.24, flip: 1, mood: MOODS.happy };
  }
  if (t < T_LAND1) {
    const [x, y] = fly([[c, 330, 760], [c + 0.25, 210, 820], [T_LAND1, 148, 885]], 0.4);
    return { ...base, x, y, mood: MOODS.sneaky };
  }
  if (t < T_SLAP1 - 0.15) return drink(148, 885, -30, 0, 0.35, T_LAND1, T_SLAP1 - 0.2);
  if (t < T_LAND2) {
    // zips up just before the slap, giggles above him, then glides to the cheek
    const [x, y] = fly([[T_SLAP1 - 0.15, 148, 885], [T_SLAP1 + 0.05, 230, 640], [T_LAND2 - 0.5, 270, 600], [T_LAND2, 205, 778]], 0.5);
    return { ...base, x, y, belly: 0.35, mood: t < T_LAND2 - 0.5 ? MOODS.laugh : MOODS.sneaky, flip: -1 };
  }
  if (t < T_CLAP - 0.15) return drink(205, 778, -16, 0.35, 0.8, T_LAND2, T_CLAP - 0.2);
  if (t < T_LAND3) {
    const [x, y] = fly([[T_CLAP - 0.15, 205, 778], [T_CLAP + 0.05, 240, 560], [T_ENDURE + 0.1, 280, 560], [T_LAND3 - 0.2, 230, 620], [T_LAND3, 243, 663]], 0.5);
    return { ...base, x, y, belly: 0.8, mood: t < T_ENDURE ? MOODS.laugh : MOODS.sneaky };
  }
  if (t < T_FULL) return drink(243, 663, -40, 0.8, 2, T_LAND3, T_FULL - 0.1);
  if (t < T_PLOP) {
    // unplugs, buzzes furiously, sinks, drops onto the blanket
    const k = clamp01((t - T_FULL) / (T_PLOP - T_FULL));
    const sink = k < 0.55 ? -Math.sin((k / 0.55) * Math.PI) * 25 : 0;
    const fall = smooth(clamp01((k - 0.55) / 0.45));
    return { ...base, x: lerp(243, REST[0], fall) + Math.sin(t * 40) * 3, y: lerp(650 + sink, REST[1], fall * fall), belly: 2, flap: 1, tremble: 1.2, tilt: lerp(-10, 0, fall), mood: MOODS.shock, flip: 1 };
  }
  // the ball part
  const sg = segAt(t);
  const after = t >= T_UNDER;
  const lastHit = HITS.filter((h) => h <= t).pop();
  const squash = lastHit !== undefined && t - lastHit < 0.18 ? 0.35 * (1 - (t - lastHit) / 0.18) : t >= T_PLOP && t < T_PLOP + 0.18 ? 0.3 * (1 - (t - T_PLOP) / 0.18) : 0;
  if (sg) {
    const k = clamp01((t - sg[0]) / (sg[1] - sg[0]));
    const kk = sg[9] ? smooth(k) : k;
    const x = lerp(sg[2], sg[5], kk);
    const y = lerp(sg[3], sg[6], kk) - Math.sin(Math.PI * k) * sg[8];
    const s = lerp(sg[4], sg[7], kk);
    // spin in the air, roll on the blanket (tilt = distance / radius)
    const spin = sg[9] ? ((sg[5] - sg[2]) * kk) / 0.8 : k * 540 * Math.sign(sg[5] - sg[2] || 1);
    return { ...base, x, y, s, belly: 2, flip: 1, flap: 0, legs: "stiff", tilt: spin, mood: t > F1 + 0.3 ? MOODS.dizzy : MOODS.shock, squash };
  }
  if (t < F1) {
    // lying on the blanket, legs flailing, can't get up
    const scared = t > T_PALM;
    return { ...base, x: REST[0], y: REST[1], flip: 1, belly: 2, flap: 0.35, tremble: scared ? 0.8 : 0.4, tilt: 8, mood: scared ? MOODS.scared : MOODS.flat, squash };
  }
  if (t < T_ROLL && t >= F3 + 1.65) {
    // the last flick: trembling, eyes shut, then the stab into his loaded finger
    const stab = ramp(t, T_STAB - 0.08, T_STAB) * (1 - ramp(t, T_STAB + 0.25, T_STAB + 0.5));
    const shut = t > T_STAB - 0.6;
    const mood: MMood = t > T_STAB + 0.5 ? MOODS.sneaky : shut ? MOODS.hide : MOODS.scared;
    return { ...base, x: REST[0] - stab * 14, y: REST[1] - stab * 6, flip: 1, belly: 2, flap: 0.3, tremble: t < T_STAB ? 1.3 : 0, tilt: 8 + stab * 14, mood };
  }
  if (!after) return { ...base, x: REST[0], y: REST[1], flip: 1, belly: 2, flap: 0.3, tilt: 8, mood: t > F2 ? MOODS.dizzy : MOODS.flat, squash, tremble: 0.3 };
  // under the bed: a pair of eyes peeking out of the dark
  const peek = ramp(t, T_PEEK, T_PEEK + 0.3) * (1 - ramp(t, T_BACK + 0.4, T_BACK + 0.7));
  const burp = t > T_PEEK + 0.3 && t < T_PEEK + 0.85;
  return { ...base, x: UNDER[0] + peek * 18, y: UNDER[1], flip: -1, belly: 2, flap: 0, tilt: 0, mood: burp ? { ...MOODS.happy, mouth: "oh", eyeOpen: 0.4 } : t > T_PEEK + 0.9 ? MOODS.laugh : MOODS.sneaky };
};

const buzzVol = (t: number) => {
  if (t < T_CLOSE) return 0.15 + 0.07 * t;
  if (t < T_LAND1) return 0.6;
  if (t < T_SLAP1 - 0.15) return 0;
  if (t < T_LAND2) return 0.65;
  if (t < T_CLAP - 0.15) return 0;
  if (t < T_LAND3) return 0.65;
  if (t < T_FULL) return 0;
  if (t < T_PLOP) return 0.9; // straining, can't lift off
  if (t < T_OFF + 0.4) return 0;
  return 0.1 + 0.4 * ramp(t, T_OFF + 0.4, DURATION / FPS);
};

// ---------- props ----------
// a fist with the flicking finger: load 1 = finger curled and held by the thumb, 0 = snapped straight out (dir = +1 right, -1 left)
const FlickHand: React.FC<{ x: number; y: number; dir: number; load: number; shake: number; f: number }> = ({ x, y, dir, load, shake, f }) => {
  const jx = Math.sin(f * 2.7) * shake * 3;
  const jy = Math.cos(f * 3.3) * shake * 2;
  const r = HAND_R;
  const bx = x + jx + dir * r * 0.55;
  const by = y + jy - r * 0.2;
  const tipX = lerp(bx + dir * r * 1.5, bx + dir * r * 0.45, load);
  const tipY = lerp(by, by - r * 0.85, load);
  const midX = lerp(bx + dir * r * 0.8, bx + dir * r * 0.95, load);
  const midY = lerp(by, by - r * 0.55, load);
  return (
    <g>
      <ellipse cx={x + jx} cy={y + jy} rx={r * 0.85} ry={r * 0.75} fill={PALETTE.ink} />
      <path d={`M${bx},${by} Q${midX},${midY} ${tipX},${tipY}`} stroke={PALETTE.ink} strokeWidth={r * 0.42} fill="none" strokeLinecap="round" />
      {/* thumb pinning the fingertip while loaded */}
      <circle cx={lerp(x + jx + dir * r * 0.5, tipX - dir * r * 0.05, load)} cy={lerp(y + jy - r * 0.55, tipY + r * 0.12, load)} r={r * 0.24} fill={PALETTE.ink} />
    </g>
  );
};

// thought bubble: his pillow splattered with blood
const Bubble: React.FC<{ k: number }> = ({ k }) => (
  <g opacity={k} transform={`translate(150 590) scale(${0.6 + 0.4 * k})`}>
    <circle cx={88} cy={110} r={9} fill="#fff" stroke={PALETTE.ink} strokeWidth={2.5} />
    <circle cx={62} cy={78} r={14} fill="#fff" stroke={PALETTE.ink} strokeWidth={2.5} />
    <path d="M-70,-10 Q-82,-50 -40,-58 Q-30,-92 10,-80 Q40,-100 66,-72 Q100,-70 92,-34 Q112,-6 84,14 Q80,46 40,40 Q14,62 -14,44 Q-56,52 -60,22 Q-92,14 -70,-10 Z" fill="#fff" stroke={PALETTE.ink} strokeWidth={3} />
    <rect x={-50} y={-42} width={110} height={62} rx={22} fill="#f3f0e8" stroke={PALETTE.ink} strokeWidth={2.5} />
    <path d="M-2,-26 Q14,-34 18,-18 Q36,-20 30,-4 Q44,6 26,10 Q24,26 8,16 Q-6,28 -10,12 Q-30,12 -20,-2 Q-34,-16 -14,-18 Q-14,-34 -2,-26 Z" fill="#c4202c" />
    {[[-30, -30, 5], [40, -28, 4], [44, 14, 5], [-34, 10, 4]].map(([cx, cy, r]) => <circle key={cx} cx={cx} cy={cy} r={r} fill="#c4202c" />)}
  </g>
);

const Star: React.FC<{ x: number; y: number; r: number; rot: number; color?: string }> = ({ x, y, r, rot, color = "#ffe14a" }) => (
  <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`} d="M0,-1 L.29,-.4 L.95,-.31 L.47,.15 L.59,.81 L0,.5 L-.59,.81 L-.47,.15 L-.95,-.31 L-.29,-.4 Z" fill={color} stroke={PALETTE.ink} strokeWidth={0.12} strokeLinejoin="round" />
);

// spiral eyes painted over his own (dazed)
const DizzyEyes: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const r = FACE.r;
  return (
    <g transform={`translate(${x} ${y}) rotate(-6)`}>
      {[-1, 1].map((s) => {
        const cx = s * r * 0.43;
        const cy = -r * 0.02;
        const er = r * 0.3;
        const d = Array.from({ length: 30 }, (_, j) => {
          const a = j * 0.55;
          const rr = (j / 29) * er * 0.85;
          return `${j ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
        }).join(" ");
        return (
          <g key={s}>
            <circle cx={cx} cy={cy} r={er} fill="#fff" stroke={PALETTE.ink} strokeWidth={r * 0.032} />
            <path d={d} transform={`rotate(${t * 540 * s} ${cx} ${cy})`} stroke={PALETTE.ink} strokeWidth={r * 0.03} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

// ---------- video ----------
export const Ep03: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const m = mosquitoAt(t);

  const on = ramp(t, T_LAMP, T_LAMP + 0.07) * (1 - ramp(t, T_OFF, T_OFF + 0.07));
  const flash = t >= T_LAMP ? Math.exp(-(t - T_LAMP) * 9) : 0;
  const bonked = t >= T_BONK;
  const bump = bonked ? smooth(clamp01((t - T_BONK) / 0.15)) * (1 + 0.08 * Math.sin(t * 9)) : 0;
  const dazed = t >= T_BONK + 0.25;

  // camera: eased framing keys [t, cx, cy, zoom] (wide shot before T_CLOSE)
  const camKeys = [
    [T_CLOSE, 230, 860, 2.2], [T_SLAP1 + 0.3, 235, 850, 2.2], [T_LAND2, 250, 800, 2.35], [T_CLAP, 265, 750, 2.35], [T_RAGE + 0.2, 300, 770, 2.6],
    [T_ENDURE, 290, 760, 2.5], [T_LAND3 + 0.2, 280, 735, 2.7], [T_FULL, 285, 730, 2.95], [T_PLOP, 320, 830, 2.4], [T_LAMP, 250, 800, 2.05],
    [T_GRIN - 0.2, 330, 845, 2.5], [T_PALM + 0.2, 280, 790, 2.25], [T_SHAKE + 0.3, 330, 850, 2.4], [F1, 330, 860, 2.4], [F1 + 0.25, 440, 790, 1.5],
    [F3 - 0.2, 440, 790, 1.5], [F3 + 0.3, 460, 760, 1.45], [F3 + 1.65, 420, 830, 1.6], [T_AIM, 320, 870, 2.4], [T_STAB - 0.1, 320, 880, 3.0],
    [T_BONK + 0.1, 290, 790, 2.6], [T_ROLL, 290, 780, 2.45], [T_EDGE, 680, 950, 2.0], [T_DROP + 0.1, 860, 1060, 2.4], [T_BACK - 0.3, 855, 1075, 2.65],
    [T_BACK + 0.4, 290, 780, 2.4], [DURATION / FPS, 292, 785, 2.55],
  ];
  let cam = { cx: lerp(540, 470, t / T_CLOSE), cy: lerp(960, 900, t / T_CLOSE), z: 1 + 0.12 * (t / T_CLOSE) };
  if (t >= T_CLOSE) {
    const v = track(t, camKeys.map((k) => [k[0], k[1], k[2]]));
    cam = { cx: v[0], cy: v[1], z: track(t, camKeys.map((k) => [k[0], k[3], 0]))[0] };
  }
  const kick = (a: number, d: number, g: number) => (t >= a && t < a + d ? g * (1 - (t - a) / d) : 0);
  const shakeK = kick(T_SLAP1, 0.2, 1.4) + kick(T_CLAP, 0.2, 1.4) + kick(T_RAGE, 0.5, 1.6) + kick(T_PLOP, 0.2, 0.8) + kick(T_LAMP, 0.15, 0.6) + kick(T_BONK, 0.35, 3.2) + kick(T_DROP, 0.2, 0.8) + HITS.reduce((a, h) => a + kick(h, 0.15, 1.6), 0) + kick(T_OFF, 0.15, 0.6);
  const camT = `translate(${W / 2 - cam.cx * cam.z + Math.sin(f * 41) * 4 * shakeK} ${H / 2 - cam.cy * cam.z + Math.cos(f * 37) * 3 * shakeK}) scale(${cam.z})`;
  const blur = t < T_CLOSE ? 0 : t > F1 + 0.2 && t < F3 + 1.6 ? 0.6 : 1.4;

  // his face
  const look = (x: number, y: number) => ({ px: clamp01((x - FACE.x) / 300 + 0.5) * 2 - 1, py: clamp01((y - FACE.y) / 300 + 0.5) * 2 - 1 });
  const rage = t >= T_RAGE && t < T_ENDURE;
  const laughing = [F2, F3].some((a) => t > a && t < a + 1.1);
  let p: FaceP = faceAt(t, [[0, "sleep"], [T_CLAP - 0.1, "shock"], [T_RAGE, "angry"], [T_ENDURE, "sleep"], [T_PLOP, "shock"], [T_LAMP + 0.2, "scheme"], [T_GRIN, "grin"], [T_PALM, "scheme"], [T_SHAKE + 0.3, "grin"], [T_AIM, "scheme"], [T_STAB, "shock"], [T_BONK, "shock"]], 0.12);
  if (t < T_LAND1 + 0.5) p = { ...p, mouth: "oh", open: 0.15 + 0.25 * Math.max(0, Math.sin(t * 3)) };
  else if (t < T_CLAP - 0.1) {
    // asleep but itchy: frowning, mumbling after the slap
    const mum = t > T_SLAP1 + 0.2 && t < T_SLAP1 + 1.1;
    p = { ...p, mouth: mum ? "open" : "frown", open: mum ? 0.15 + 0.15 * Math.abs(Math.sin(t * 14)) : 0, tilt: 0.5, brow: -0.2 };
  } else if (rage) p = { ...p, mouth: "shout", open: 0.6 + 0.3 * Math.sin(t * 18) };
  else if (t < T_FULL) {
    // enduring: eyes squeezed, teeth gritted, a twitch as it drinks
    const twitch = t > T_LAND3 && Math.sin(t * 13) > 0.85;
    p = { ...p, eyeOpen: 0, mouth: "teeth", open: 0.05, tilt: 1, brow: twitch ? -0.6 : -0.3 };
  } else if (t < T_LAMP + 0.2) p = { ...p, ...look(REST[0], REST[1]) };
  else if (t < T_PALM) p = { ...p, ...look(REST[0], REST[1]) };
  else if (t < T_SHAKE + 0.3) p = { ...p, px: -0.8, py: -0.7, mouth: t > T_PALM + 0.4 ? "frown" : "smirk" };
  else if (laughing) p = { ...p, eyeOpen: 0, mouth: "open", open: 0.5 + 0.3 * Math.abs(Math.sin(t * 16)) };
  else if (t < T_AIM) p = { ...p, ...(m.y < 0 ? {} : look(m.x, m.y)) };
  else if (t < T_STAB) p = { ...p, ...look(REST[0], REST[1]), eyeOpen: 0.55, mouth: "smirk" };
  else if (t < T_BONK) p = { ...p, mouth: "oh", open: 1, eyeScale: 1.3 };
  else p = { ...p, mouth: t < T_BONK + 0.25 ? "oh" : "frown", open: 0.6, eyeOpen: 1, brow: 0.6, tilt: -0.4 };
  const blood = rage || (t >= T_CLAP && t < T_ENDURE) ? 1 : 0;
  const shakeHead = t >= T_SHAKE && t < T_SHAKE + 0.3 ? Math.sin((t - T_SHAKE) * 50) * 9 : 0;
  const rageShake = rage ? Math.sin(f * 2.3) * 5 : 0;
  const recoil = kick(T_BONK, 0.3, 1) * 14;
  const fx = FACE.x + shakeHead + rageShake - recoil * 0.3;
  const fy = FACE.y + recoil;

  // hands. left: lying on the blanket in act 1, clap, lamp, palm, flicks 1 & 3, the last flick and its recoil; right: slap, clap, flick 2
  type HandS = { pos: number[]; base: number[]; kind: "mitten" | "flick"; dir: number; load: number; shake: number } | null;
  const go = (a: number[], b: number[], k: number) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const flickHand = (snap: number, at: number[], dir: number, baseHand: number[]): HandS => {
    // arrives 0.3 s before the snap, snaps, holds, goes back
    const inK = ramp(t, snap - 0.45, snap - 0.15);
    const outK = ramp(t, snap + 0.25, snap + 0.6);
    return { pos: go(go(baseHand, at, inK), baseHand, outK), base: baseHand === L_REST ? L_BASE : R_BASE, kind: "flick", dir, load: 1 - ramp(t, snap - 0.03, snap), shake: 0 };
  };
  const FL = [265, 905];
  const FR = [462, 900];
  const FL_RECOIL = [FOREHEAD[0] - HAND_R * 1.95, FOREHEAD[1] + HAND_R * 0.25];
  let lHand: HandS = t < T_LAMP + 0.6 || t > T_ROLL ? { pos: L_REST, base: L_BASE, kind: "mitten", dir: -1, load: 0, shake: 0 } : null;
  let rHand: HandS = null;
  if (t >= T_SLAP1 - 0.25 && t < T_SLAP1 + 0.7) {
    const k = ramp(t, T_SLAP1 - 0.25, T_SLAP1) * (1 - ramp(t, T_SLAP1 + 0.35, T_SLAP1 + 0.7));
    rHand = { pos: go([R_BASE[0], R_BASE[1] - 20], [L_REST[0] + 18, L_REST[1] - 22], k), base: R_BASE, kind: "mitten", dir: 1, load: 0, shake: 0 };
  }
  if (t >= T_CLAP - 0.3 && t < T_CLAP + 0.8) {
    const k = ramp(t, T_CLAP - 0.3, T_CLAP) * (1 - ramp(t, T_CLAP + 0.4, T_CLAP + 0.8));
    rHand = { pos: go([R_BASE[0], R_BASE[1] - 20], [300, 640], k), base: R_BASE, kind: "mitten", dir: 1, load: 0, shake: 0 };
    lHand = { pos: go(L_REST, [212, 646], k), base: L_BASE, kind: "mitten", dir: -1, load: 0, shake: 0 };
  }
  if (t >= T_LAMP - 0.3 && t < T_LAMP + 0.6) {
    const k = ramp(t, T_LAMP - 0.25, T_LAMP) * (1 - ramp(t, T_LAMP + 0.15, T_LAMP + 0.55));
    lHand = { pos: go(L_REST, LAMP_HAND, k), base: L_BASE, kind: "mitten", dir: -1, load: 0, shake: 0 };
  }
  if (t >= T_PALM - 0.2 && t < F1 - 0.45) {
    // open palm raised over it ... then lowered while he shakes his head
    const k = ramp(t, T_PALM - 0.2, T_PALM + 0.1) * (1 - ramp(t, T_SHAKE, T_SHAKE + 0.35));
    lHand = { pos: go(L_REST, [REST[0] + 5, REST[1] - 120], k), base: L_BASE, kind: "mitten", dir: 1, load: 0, shake: t > T_PALM + 0.1 && t < T_SHAKE ? 1 : 0 };
  }
  if (t >= F1 - 0.45 && t < F1 + 0.6) lHand = flickHand(F1, FL, 1, L_REST);
  if (t >= F2 - 0.45 && t < F2 + 0.6) rHand = flickHand(F2, FR, -1, [R_BASE[0] + 10, R_BASE[1] - 10]);
  if (t >= F3 - 0.45 && t < F3 + 0.6) lHand = flickHand(F3, [FL[0], FL[1] + 15], 1, L_REST);
  if (t >= T_AIM - 0.4 && t <= T_ROLL) {
    // the last flick: loaded under his chin, trembling with effort; stabbed -> jerks up, the finger flicks his own forehead
    const inK = ramp(t, T_AIM - 0.4, T_AIM);
    const jerk = ramp(t, T_STAB + 0.04, T_BONK);
    const back = ramp(t, T_BONK + 0.3, T_BONK + 0.8);
    const pos = go(go(go(L_REST, FL, inK), FL_RECOIL, jerk), L_REST, back);
    lHand = { pos, base: L_BASE, kind: back > 0.3 ? "mitten" : "flick", dir: 1, load: 1 - ramp(t, T_BONK - 0.04, T_BONK), shake: t < T_STAB ? ramp(t, T_AIM, T_STAB) * 1.6 : 0 };
  }
  if (t >= T_OFF - 0.3 && t < T_OFF + 0.6) {
    const k = ramp(t, T_OFF - 0.25, T_OFF) * (1 - ramp(t, T_OFF + 0.15, T_OFF + 0.55));
    lHand = { pos: go(L_REST, LAMP_HAND, k), base: L_BASE, kind: "mitten", dir: -1, load: 0, shake: 0 };
  }
  const drawHand = (h: HandS, key: string) =>
    h && (
      <g key={key}>
        <Arm w={ARM_W} pts={[h.base, [(h.base[0] + h.pos[0]) / 2 - 10, (h.base[1] + h.pos[1]) / 2 + (h.base === R_BASE ? 55 : 18)], h.pos]} />
        {h.kind === "flick" ? <FlickHand x={h.pos[0]} y={h.pos[1]} dir={h.dir} load={h.load} shake={h.shake} f={f} /> : <Hand x={h.pos[0] + Math.sin(f * 2.9) * h.shake * 3} y={h.pos[1]} r={HAND_R} flip={h.dir} />}
      </g>
    );

  const dark = 1 - on;
  const charFilter = `brightness(${lerp(1, 0.6, dark) + flash * 0.15}) saturate(${lerp(1, 0.8, dark)})`;
  const squashT = m.squash > 0 ? `translate(${m.x} ${m.y}) scale(${1 + m.squash} ${1 - m.squash}) translate(${-m.x} ${-m.y})` : undefined;
  const impact = HITS.filter((h) => t >= h && t < h + 0.2).map((h) => ({ k: (t - h) / 0.2, at: mosquitoAt(h) }));
  const bubble = ramp(t, T_PALM + 0.15, T_PALM + 0.35) * (1 - ramp(t, T_SHAKE, T_SHAKE + 0.15));
  const stabFlash = t >= T_STAB && t < T_STAB + 0.25 ? 1 - (t - T_STAB) / 0.25 : 0;

  return (
    <AbsoluteFill style={{ background: "#0b1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <defs>
          <filter id="bgblur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
          <clipPath id="blanket"><path d={BLANKET} /></clipPath>
          <clipPath id="shade"><path d={SHADE} /></clipPath>
          <clipPath id="bededge"><path d={BED_EDGE} /></clipPath>
          <radialGradient id="warm">
            <stop offset="0" stopColor="#ffb04a" stopOpacity={0.85} />
            <stop offset="1" stopColor="#ffb04a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={camT}>
          <Backdrop on={on} blur={blur} />
          <g style={{ filter: charFilter }}>
            <Face x={fx} y={fy} r={FACE.r} hair="husband" p={p} tilt={-6} id="hz" blood={blood} happyEyes={laughing} />
            {dazed && <DizzyEyes x={fx} y={fy} t={t} />}
            {bump > 0 && (
              <g transform={`translate(${FOREHEAD[0] + fx - FACE.x} ${FOREHEAD[1] + fy - FACE.y}) scale(${bump})`}>
                <ellipse cx={0} cy={0} rx={26} ry={20} fill="#ff6b6b" stroke={PALETTE.ink} strokeWidth={3} />
                <ellipse cx={-8} cy={-7} rx={7} ry={4} fill="#ffc2c2" />
              </g>
            )}
          </g>
          <g clipPath="url(#blanket)"><Backdrop on={on} blur={blur} /></g>
          <g style={{ filter: charFilter }}>
            {drawHand(lHand, "l")}
            {drawHand(rHand, "r")}
            {!m.hidden && (
              <g transform={squashT} style={{ filter: "drop-shadow(0 0 2px rgba(200,215,255,0.7))" }}>
                <Mosquito x={m.x} y={m.y} s={m.s} f={f} flip={m.flip} mood={m.mood} legs={m.legs} flap={m.flap} tilt={m.tilt} tremble={m.tremble} belly={m.belly} id="m" />
              </g>
            )}
          </g>
          {/* the shade and the side of the bed drawn again over the mosquito */}
          <g clipPath="url(#shade)"><Backdrop on={on} blur={blur} /></g>
          {t >= T_DROP && <g clipPath="url(#bededge)"><Backdrop on={on} blur={blur} /></g>}
          {impact.map(({ k, at }, i) => (
            <g key={i} opacity={1 - k}>
              {[0, 1, 2, 3, 4, 5].map((j) => {
                const a = (j / 6) * Math.PI * 2 + 0.3;
                return <line key={j} x1={at.x + Math.cos(a) * (20 + k * 30)} y1={at.y + Math.sin(a) * (20 + k * 30)} x2={at.x + Math.cos(a) * (40 + k * 50)} y2={at.y + Math.sin(a) * (40 + k * 50)} stroke="#fff6c8" strokeWidth={5} strokeLinecap="round" />;
              })}
            </g>
          ))}
          {stabFlash > 0 && <Star x={FL[0] + HAND_R * 0.8} y={FL[1] - HAND_R * 0.7} r={22 + (1 - stabFlash) * 16} rot={20} color="#fff3a0" />}
          {bonked && t < T_BONK + 0.3 && <Star x={FOREHEAD[0] + fx - FACE.x} y={FOREHEAD[1] + fy - FACE.y - 10} r={40 * (1 - (t - T_BONK) / 0.3) + 10} rot={0} color="#fff3a0" />}
          {dazed && [0, 1, 2].map((i) => {
            const a = t * 4 + (i * Math.PI * 2) / 3;
            return <Star key={i} x={fx + Math.cos(a) * 95} y={fy - FACE.r - 15 + Math.sin(a) * 22} r={13 + 3 * Math.sin(a)} rot={t * 200} />;
          })}
          {bubble > 0 && <Bubble k={bubble} />}
          {t < T_LAND1 + 0.5 && <Zzz t={t} x={FACE.x + 40} y={FACE.y - 40} />}
          {rage && <AngerMark x={fx + 62} y={fy - 70} s={1 + 0.15 * Math.sin(t * 20)} />}
          {rage && <Puffs t={t} x={fx} y={fy - FACE.r - 10} k={1} />}
          {flash > 0.02 && <circle cx={90} cy={660} r={420} fill="url(#warm)" opacity={flash * 0.6} />}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,8,25,0.5) 100%)", pointerEvents: "none" }} />

      <Audio src={staticFile("mosquito-gag/crickets.wav")} volume={0.35} />
      <Audio src={staticFile("mosquito-gag/buzz.wav")} volume={(fr) => buzzVol(fr / FPS)} />
      <Sequence from={Math.round(0.3 * FPS)}><Audio src={staticFile("mosquito-gag/snore.wav")} volume={0.55} /></Sequence>
      {[[T_LAND1 + 0.1, 0.5], [T_LAND2 + 0.1, 0.5], [T_LAND3 + 0.1, 0.6], [T_LAND3 + 1.0, 0.7]].map(([a, v]) => (
        <Sequence key={a} from={Math.round(a * FPS)} durationInFrames={Math.round(1.3 * FPS)}><Audio src={staticFile("mosquito-gag/slurp.wav")} volume={v} /></Sequence>
      ))}
      {[T_SLAP1, T_CLAP].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/slap.wav")} volume={0.75} /></Sequence>
      ))}
      <Sequence from={Math.round((T_SLAP1 + 0.25) * FPS)}><Audio src={staticFile("mosquito-gag/mumble.wav")} volume={0.6} /></Sequence>
      {[T_SLAP1 + 0.2, T_CLAP + 0.2, T_PEEK + 1.0].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/hihi.wav")} volume={0.5} /></Sequence>
      ))}
      <Sequence from={Math.round(T_RAGE * FPS)}><Audio src={staticFile("mosquito-gag/hiss.wav")} volume={0.35} /></Sequence>
      <Sequence from={Math.round(T_RAGE * FPS)}><Audio src={staticFile("mosquito-gag/whoosh.wav")} volume={0.4} /></Sequence>
      {[T_PLOP, T_DROP].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/plop.wav")} volume={0.75} /></Sequence>
      ))}
      {[T_LAMP, T_OFF].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/click.wav")} volume={0.8} /></Sequence>
      ))}
      {[[T_GRIN, 1.3], [F2 + 0.15, 1.0], [F3 + 0.15, 1.2]].map(([a, d]) => (
        <Sequence key={a} from={Math.round(a * FPS)} durationInFrames={Math.round(d * FPS)}><Audio src={staticFile("mosquito-gag/haha.wav")} volume={0.45} /></Sequence>
      ))}
      {[F1, F2, F3].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/flick.wav")} volume={0.9} /></Sequence>
      ))}
      {HITS.map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/boing.wav")} volume={0.55} /></Sequence>
      ))}
      {[F1 + 0.92, F2 + 0.85, F3 + 1.25, T_ROLL, T_DROP + 0.15].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)} durationInFrames={Math.round(0.6 * FPS)}><Audio src={staticFile("mosquito-gag/roll.wav")} volume={0.5} /></Sequence>
      ))}
      <Sequence from={Math.round((T_AIM - 0.1) * FPS)}><Audio src={staticFile("mosquito-gag/stretch.wav")} volume={0.4} /></Sequence>
      <Sequence from={Math.round(T_STAB * FPS)}><Audio src={staticFile("mosquito-gag/stab.wav")} volume={0.6} /></Sequence>
      <Sequence from={Math.round((T_STAB + 0.06) * FPS)}><Audio src={staticFile("mosquito-gag/ow.wav")} volume={0.6} /></Sequence>
      <Sequence from={Math.round(T_BONK * FPS)}><Audio src={staticFile("mosquito-gag/bonk.wav")} volume={0.85} /></Sequence>
      {[T_BONK + 0.2, T_BACK + 0.2].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/twinkle.wav")} volume={0.45} /></Sequence>
      ))}
      <Sequence from={Math.round((T_PEEK + 0.3) * FPS)}><Audio src={staticFile("mosquito-gag/burp.wav")} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};
