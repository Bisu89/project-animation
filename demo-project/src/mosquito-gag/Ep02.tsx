import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Face, FaceP, faceAt } from "../bedroom-gag/Face";
import { Arm, Hand } from "../bedroom-gag/Primitives";
import { clamp01, smooth } from "../bedroom-gag/config";
import { W, H, SHADE, BLANKET, FACE, LAMP_HAND, ARM_W, HAND_R, lerp, ramp, hash, track, Backdrop, Puffs, AngerMark, Zzz } from "./common";
import { Mosquito, MMood, LegPose, MOODS } from "./Mosquito";

// Ep 2 "Karaoke". Act 1: the buzzing in his ear is the mosquito singing karaoke into a tiny mic. Lamp on -> it vanishes;
// lamp off -> mic feedback and it sings louder; he boils over. Act 2: he grins, lights the mosquito coil and fakes sleep.
// It comes back to sing, chokes on the smoke (the music warps), gets dizzy; he snatches the mic and bellows
// "LA! LA! LA-LAAA!" into its face until it drops dead on the floor; he goes back to sleep. 9:16, about 26 s.
// Times are seconds; same world/props as ep 1 (common.tsx). No on-screen text, no Vietnamese words (English channel).
export const FPS = 30;
const T_CLOSE = 2.6;
const T_SING1 = 3.0; // karaoke in his ear
const T_WAKE = 5.5; // eyes snap open
const T_LAMP1 = 6.0; // lamp on -> it vanishes behind the shade
const T_OFF1 = 7.8;
const T_BACK1 = 8.3; // comes back
const T_FEED = 8.6; // mic feedback, sings louder
const T_RAGE = 10.0; // he jolts up furious, it vanishes again
const T_GRIN = 11.5; // stops shouting, sly grin
const T_LAMP2 = 12.2;
const T_FLICK = 13.2; // lighter at the coil
const T_LIT = 13.5;
const T_OFF2 = 14.6; // lamp off, fake sleep
const T_SING2 = 15.2; // comes back to sing
const T_COUGH = 16.2; // smoke: coughing, the music warps
const T_DIZZY = 17.0;
const T_SNATCH = 18.0; // he grabs the mic, music stops
const T_BELLOW = 18.6; // "LA! LA! LA-LAAA!" (bellow.wav, 2.9 s)
const SYLL = [0, 0.55, 1.1, 1.5].map((d) => T_BELLOW + d); // bass hit on each syllable
const T_FALL = 21.5; // drops to the floor
const T_FLOOR = 22.4;
const T_BED = 23.7; // back to him: lies down, sleeps
export const DURATION = Math.round(26.3 * FPS);

// spots for this episode (world px)
const COIL = [100, 790]; // centre of the mosquito coil on the nightstand
const EMBER = [134, 790]; // its burning outer tip
const SING = [185, 570]; // where the mosquito hovers while singing (above the lamp shade, left of his face)
const S_SING = 0.7; // closer to camera while it performs
const HIDE = [90, 655]; // behind the lamp shade
const FLOOR = [895, 1098]; // bare floor just below the slippers, right of the bed
const L_BASE = [235, 935];

// ---------- mosquito ----------
type MState = { x: number; y: number; s: number; flip: number; mood: MMood; legs: LegPose; flap: number; tilt: number; tremble: number; mic: boolean; hidden: boolean; streak: number };
const beatOn = (t: number, a: number, beat: number) => Math.sin(((t - a) / beat) * Math.PI * 2) > -0.2;
const mosquitoAt = (t: number): MState => {
  const wob = (a: number) => [Math.sin(t * 5.3) * 7 * a + Math.sin(t * 9.1) * 3 * a, Math.cos(t * 6.4) * 6 * a + Math.sin(t * 11.7) * 2 * a];
  const base: MState = { x: 0, y: 0, s: 0.5, flip: -1, mood: MOODS.happy, legs: "sing", flap: 1, tilt: 0, tremble: 0, mic: true, hidden: false, streak: 0 };
  // singing: eyes shut in rapture, mouth on the beat, swaying, mic in hand
  const singer = (t0: number, loud: number): MState => {
    const [wx, wy] = wob(0.25);
    return { ...base, s: S_SING, x: SING[0] + Math.sin(t * 2.6) * 10 * loud + wx, y: SING[1] - Math.abs(Math.sin(t * 5.2)) * 6 * loud + wy, mood: { ...MOODS.bliss, eyeOpen: 0.05, mouth: beatOn(t, t0, 0.2) ? "oh" : "smile" }, flap: 0.8 };
  };
  // zip behind the lamp shade (shrinking to fit behind it)
  const zip = (t0: number, s0: number): MState => {
    const k = smooth(clamp01((t - t0) / 0.18));
    return { ...base, s: lerp(s0, 0.45, k), x: lerp(SING[0], HIDE[0], k), y: lerp(SING[1], HIDE[1], k), mood: MOODS.shock, streak: k < 1 ? 1 : 0, hidden: k >= 1 };
  };
  // fly out from behind the shade to the singing spot
  const comeBack = (t0: number, t1: number): MState => {
    const k = smooth(clamp01((t - t0) / (t1 - t0)));
    return { ...base, s: lerp(0.45, S_SING, k), x: lerp(HIDE[0], SING[0], k), y: lerp(HIDE[1], SING[1], k), mood: MOODS.sneaky };
  };
  const c = T_CLOSE;
  if (t < c) {
    const [x, y] = track(t, [[0, 560, 540], [1.0, 470, 650], [1.8, 400, 600], [c, 380, 690]]);
    const [wx, wy] = wob(1);
    return { ...base, x: x + wx, y: y + wy, s: 0.24, flip: 1 };
  }
  if (t < T_SING1) {
    const k = smooth(clamp01((t - c) / (T_SING1 - c)));
    return { ...base, s: lerp(0.5, S_SING, k), x: lerp(330, SING[0], k), y: lerp(560, SING[1], k), mood: MOODS.sneaky };
  }
  if (t < T_LAMP1) return singer(T_SING1, 1);
  if (t < T_BACK1) return zip(T_LAMP1, S_SING);
  if (t < T_FEED) return comeBack(T_BACK1, T_FEED);
  if (t < T_RAGE) return singer(T_FEED, 1.6);
  if (t < T_SING2 - 0.3) return zip(T_RAGE, S_SING);
  if (t < T_SING2) return comeBack(T_SING2 - 0.3, T_SING2);
  if (t < T_COUGH) return singer(T_SING2, 1);
  if (t < T_SNATCH) {
    // smoke: coughing, staggering, then dizzy with the mic sagging
    const cough = [T_COUGH, T_COUGH + 0.5].some((a) => t > a && t < a + 0.3);
    const dz = ramp(t, T_DIZZY, T_DIZZY + 0.3);
    const [wx, wy] = wob(0.6 + dz);
    const mood: MMood = t < T_DIZZY ? { ...MOODS.shock, mouth: cough ? "oh" : "wobble", eyeOpen: cough ? 0.3 : 1 } : MOODS.dizzy;
    return { ...base, s: S_SING, x: SING[0] + wx + Math.sin(t * 3) * 14 * dz, y: SING[1] + wy + dz * 12 + (cough ? -5 : 0), mood, tremble: cough ? 1.2 : 0, tilt: Math.sin(t * 3) * 10 * dz, flap: lerp(0.8, 0.5, dz) };
  }
  if (t < T_FALL) {
    // the bellow: holds its head, eyes rolled up, reeling back and forth on every syllable
    const reel = Math.sin((t - T_BELLOW) * 4.2);
    const mood: MMood = t < T_BELLOW ? MOODS.shock : { ...MOODS.shock, py: -1, eyeScale: 1.35, mouth: "wobble" };
    return { ...base, s: S_SING, x: SING[0] - 10 + reel * 28, y: SING[1] + 18 + Math.abs(reel) * 8, mood, legs: t < T_BELLOW ? "stiff" : "cover", mic: false, tremble: t < T_BELLOW ? 0.3 : 1.4, tilt: reel * 12, flap: 0.6 };
  }
  // the last "LAAA" blows it away over his face in an arc; it drops onto the floor by the slippers, on its back: X eyes, legs up
  const k = clamp01((t - T_FALL) / (T_FLOOR - T_FALL));
  const bounce = t > T_FLOOR && t < T_FLOOR + 0.25 ? -Math.sin(((t - T_FLOOR) / 0.25) * Math.PI) * 14 : 0;
  const arc = -Math.sin(Math.PI * Math.min(1, k * 1.3)) * 160;
  return { ...base, s: lerp(S_SING, 0.55, k), x: lerp(SING[0] - 10, FLOOR[0], k), y: lerp(SING[1] + 18, FLOOR[1], k * k) + arc * (1 - k) + bounce, mood: k < 1 ? MOODS.dizzy : MOODS.dead, legs: "stiff", mic: false, flap: 0, tilt: lerp(0, 180, smooth(k)) };
};

const buzzVol = (t: number) => {
  if (t < T_CLOSE) return 0.15 + 0.07 * t;
  if (t < T_SING1) return 0.5;
  if (t < T_FALL) return 0.1; // wings under the singing
  return 0;
};

// ---------- props ----------
const Coil: React.FC<{ lit: number; t: number }> = ({ lit, t }) => {
  // flat green spiral seen from above at an angle, on a little tin stand
  const pts = Array.from({ length: 90 }, (_, i) => {
    const a = i * 0.19;
    const r = 6 + (i / 89) * 28;
    return `${i ? "L" : "M"}${(COIL[0] + Math.cos(a) * r).toFixed(1)},${(COIL[1] + Math.sin(a) * r * 0.42).toFixed(1)}`;
  }).join(" ");
  return (
    <g>
      <ellipse cx={COIL[0]} cy={COIL[1] + 6} rx={40} ry={12} fill="#7c7f86" stroke="#2a2b2f" strokeWidth={2.5} />
      <path d={pts} stroke="#1f3a1d" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={pts} stroke="#4f8a46" strokeWidth={4.2} fill="none" strokeLinecap="round" />
      {lit > 0 && (
        <g opacity={lit}>
          <circle cx={EMBER[0]} cy={EMBER[1]} r={9 + Math.sin(t * 9) * 1.5} fill="#ff7a1a" opacity={0.45} />
          <circle cx={EMBER[0]} cy={EMBER[1]} r={4} fill="#ffd27a" />
        </g>
      )}
    </g>
  );
};

// smoke from the ember: soft blurred wisps curling up and drifting towards (tx, ty)
const Smoke: React.FC<{ t: number; k: number; tx: number; ty: number }> = ({ t, k, tx, ty }) => (
  <g filter="url(#smokeblur)">
    {[0, 1].map((w) => {
      const pts = Array.from({ length: 24 }, (_, i) => {
        const u = i / 23;
        const x = lerp(EMBER[0], tx, u) + Math.sin(u * 8 - t * 2.2 + w * 2) * 16 * u;
        const y = lerp(EMBER[1] - 6, ty, Math.sqrt(u)) + Math.cos(u * 6 - t * 1.8 + w) * 8 * u;
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      return <path key={w} d={pts} stroke="#e4e7ec" strokeWidth={w ? 14 : 7} strokeLinecap="round" fill="none" opacity={k * (w ? 0.28 : 0.55)} />;
    })}
    {Array.from({ length: 8 }, (_, i) => {
      const u = (t * 0.3 + i / 8) % 1;
      return <circle key={i} cx={lerp(EMBER[0], tx, u) + Math.sin(u * 8 - t * 2.2) * 16 * u} cy={lerp(EMBER[1] - 6, ty, Math.sqrt(u))} r={8 + u * 26} fill="#dfe3e8" opacity={k * 0.22 * Math.sin(Math.PI * u)} />;
    })}
  </g>
);

const Lighter: React.FC<{ x: number; y: number; flame: number; t: number }> = ({ x, y, flame, t }) => (
  <g>
    <rect x={x - 9} y={y - 52} width={18} height={40} rx={4} fill="#d8343a" stroke="#141317" strokeWidth={2.5} />
    <rect x={x - 9} y={y - 60} width={18} height={10} rx={2} fill="#b9bcc3" stroke="#141317" strokeWidth={2} />
    {flame > 0 && (
      <g opacity={flame}>
        <path d={`M${x - 6},${y - 62} Q${x - 8},${y - 78} ${x + Math.sin(t * 13) * 2},${y - 92} Q${x + 8},${y - 78} ${x + 6},${y - 62} Z`} fill="#ff9a2a" />
        <path d={`M${x - 3},${y - 63} Q${x - 4},${y - 72} ${x},${y - 80} Q${x + 4},${y - 72} ${x + 3},${y - 63} Z`} fill="#ffe680" />
      </g>
    )}
  </g>
);

// the mosquito's tiny mic as a loose object, here held in his huge fist (drawn 3.6x so it reads)
const Mic: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(3.6)`}>
    <line x1={0} y1={0} x2={0} y2={13} stroke="#1b1b1f" strokeWidth={3} strokeLinecap="round" />
    <circle cx={0} cy={-3} r={4.2} fill="#8a8d96" stroke="#141317" strokeWidth={1.2} />
  </g>
);

// music notes popping out of the mic while it sings
const Notes: React.FC<{ t: number; x: number; y: number; k: number }> = ({ t, x, y, k }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.8 + i / 3) % 1;
      const nx = x + 30 + ph * 90 + Math.sin(ph * 7 + i) * 10;
      const ny = y - 10 - ph * 70;
      return (
        <g key={i} opacity={k * Math.sin(Math.PI * ph)} transform={`translate(${nx} ${ny}) scale(${0.8 + ph * 0.6})`}>
          <ellipse cx={0} cy={8} rx={6} ry={4.5} fill="#fff3a0" stroke="#141317" strokeWidth={1.5} transform="rotate(-20 0 8)" />
          <path d="M5,6 L5,-14 Q12,-12 14,-6" stroke="#141317" strokeWidth={2} fill="none" />
        </g>
      );
    })}
  </g>
);

// ---------- video ----------
export const Ep02: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const m = mosquitoAt(t);

  const on = Math.max(ramp(t, T_LAMP1, T_LAMP1 + 0.07) * (1 - ramp(t, T_OFF1, T_OFF1 + 0.07)), ramp(t, T_LAMP2, T_LAMP2 + 0.07) * (1 - ramp(t, T_OFF2, T_OFF2 + 0.07)));
  const flash = [T_LAMP1, T_LAMP2].reduce((acc, a) => acc + (t >= a ? Math.exp(-(t - a) * 9) : 0), 0);
  const lit = ramp(t, T_LIT, T_LIT + 0.3);
  const bellowing = t >= T_BELLOW && t < T_FALL;
  const bass = SYLL.reduce((a, b) => a + (t >= b && t < b + 0.45 ? 1 - (t - b) / 0.45 : 0), 0);

  // camera: eased framing keys (wide shot before T_CLOSE)
  const camKeys = [
    [T_CLOSE, 265, 800, 2.1], [T_SING1, 230, 735, 2.35], [T_LAMP1, 235, 740, 2.35], [T_OFF1 + 0.3, 255, 770, 2.2], [T_FEED + 0.2, 225, 725, 2.45],
    [T_RAGE, 240, 740, 2.4], [T_RAGE + 0.25, 300, 770, 2.6], [T_GRIN, 300, 772, 2.7], [T_FLICK - 0.4, 200, 790, 2.4], [T_LIT + 0.4, 200, 790, 2.45],
    [T_OFF2 + 0.3, 250, 760, 2.2], [T_SING2 + 0.3, 220, 725, 2.4], [T_SNATCH, 215, 720, 2.5], [T_BELLOW + 0.2, 230, 735, 2.35],
    [T_FALL, 260, 730, 2.3], [T_FLOOR, 855, 1020, 2.4], [T_BED - 0.2, 858, 1028, 2.45], [T_BED + 0.6, 285, 790, 2.4], [DURATION / FPS, 290, 790, 2.5],
  ];
  let cam = { cx: lerp(540, 470, t / T_CLOSE), cy: lerp(960, 900, t / T_CLOSE), z: 1 + 0.12 * (t / T_CLOSE) };
  if (t >= T_CLOSE) {
    const v = track(t, camKeys.map((k) => [k[0], k[1], k[2]]));
    cam = { cx: v[0], cy: v[1], z: track(t, camKeys.map((k) => [k[0], k[3], 0]))[0] };
  }
  const shakeK = [T_LAMP1, T_OFF1, T_LAMP2, T_OFF2].reduce((acc, a) => acc + (t >= a && t < a + 0.2 ? 1 - (t - a) / 0.2 : 0), 0) + (t >= T_RAGE && t < T_RAGE + 0.5 ? 1.6 * (1 - (t - T_RAGE) / 0.5) : 0) + bass * 3.5 + (t >= T_FEED && t < T_FEED + 0.4 ? 0.8 : 0);
  const camT = `translate(${W / 2 - cam.cx * cam.z + Math.sin(f * 41) * 4 * shakeK} ${H / 2 - cam.cy * cam.z + Math.cos(f * 37) * 3 * shakeK}) scale(${cam.z})`;
  const blur = t < T_CLOSE ? 0 : 1.4;

  // husband's face
  const look = (x: number, y: number) => ({ px: clamp01((x - FACE.x) / 300 + 0.5) * 2 - 1, py: clamp01((y - FACE.y) / 300 + 0.5) * 2 - 1 });
  const rage = t >= T_RAGE + 0.25 && t < T_GRIN;
  let p: FaceP = faceAt(t, [[0, "sleep"], [T_WAKE, "glare"], [T_OFF1 + 0.2, "sleep"], [T_RAGE, "shock"], [T_RAGE + 0.25, "angry"], [T_GRIN, "scheme"], [T_OFF2 + 0.2, "sleep"], [T_SNATCH - 0.1, "grin"], [T_BED + 0.4, "sleep"]], 0.12);
  const annoyed = (k: number): Partial<FaceP> => ({ mouth: "frown", tilt: 0.4 + k * 0.6 + (Math.sin(t * 23) > 0.6 ? 0.3 * k : 0), brow: -0.2 });
  if (t < T_SING1) p = { ...p, mouth: "oh", open: 0.15 + 0.25 * Math.max(0, Math.sin(t * 3)) };
  else if (t < T_WAKE) p = { ...p, ...annoyed(ramp(t, T_SING1, T_WAKE)) };
  else if (t < T_OFF1 + 0.2) p = { ...p, ...(m.hidden ? { px: Math.sin(t * 6) > 0 ? 0.85 : -0.85, py: 0 } : look(m.x, m.y)) };
  else if (t < T_RAGE) p = { ...p, ...annoyed(t > T_FEED ? 1 : 0.5) };
  else if (rage) p = { ...p, mouth: "shout", open: 0.6 + 0.3 * Math.sin(t * 18) };
  else if (t < T_OFF2 + 0.2) p = { ...p, ...(t > T_LAMP2 + 0.3 ? { px: -0.85, py: 0.5 } : {}), mouth: "smirk" };
  else if (t < T_SNATCH - 0.1) p = { ...p, mouth: "smirk" };
  else if (bellowing) {
    // belting it out: eyes squeezed shut, mouth wide on each syllable
    const loud = SYLL.reduce((a, b) => a + (t >= b && t < b + 0.5 ? 1 : 0), 0);
    p = { ...p, eyeOpen: 0, brow: 0.6, tilt: 0.4, mouth: "shout", open: 0.4 + 0.5 * Math.min(1, loud) };
  } else if (t < T_BED + 0.4) p = { ...p, ...look(FLOOR[0], FLOOR[1]) };
  else p = { ...p, mouth: "smile" };
  const blood = t >= T_WAKE && t < T_SNATCH ? clamp01((t - T_WAKE) / 0.15) * (t > T_OFF1 + 0.2 && t < T_RAGE ? 0 : 1) : 0;
  const shake = rage ? Math.sin(f * 2.3) * 5 : 0;
  const fx = FACE.x + shake;
  const fy = FACE.y - (t >= T_SNATCH - 0.2 && t < T_FALL ? 12 * ramp(t, T_SNATCH - 0.2, T_SNATCH) : 0);

  // left hand: lamp switch, lighter at the coil, then snatching the mic and holding it to the mosquito's face
  const lampReach = Math.max(...[T_LAMP1, T_OFF1, T_LAMP2, T_OFF2].map((a) => ramp(t, a - 0.4, a) * (1 - ramp(t, a + 0.15, a + 0.55))));
  const coilReach = ramp(t, T_FLICK - 0.5, T_FLICK - 0.1) * (1 - ramp(t, T_LIT + 0.2, T_LIT + 0.6));
  const micReach = ramp(t, T_SNATCH - 0.25, T_SNATCH) * (1 - ramp(t, T_FALL + 0.2, T_FALL + 0.7));
  const coilHand = [EMBER[0] + 4, EMBER[1] + 78]; // fist below the ember so the lighter flame touches it
  const micHold = bellowing ? [m.x - 10, m.y + 110] : [SING[0] - 10, SING[1] + 110]; // fist under the mosquito, mic pointing up at it
  const lighterFlame = ramp(t, T_FLICK, T_FLICK + 0.05) * (1 - ramp(t, T_LIT + 0.2, T_LIT + 0.3));
  const from = [L_BASE[0] - 10, L_BASE[1] - 5];
  let lHand: number[] | null = null;
  if (lampReach > 0.01) lHand = [lerp(from[0], LAMP_HAND[0], lampReach), lerp(from[1], LAMP_HAND[1], lampReach)];
  else if (coilReach > 0.01) lHand = [lerp(from[0], coilHand[0], coilReach), lerp(from[1], coilHand[1], coilReach)];
  else if (micReach > 0.01) lHand = [lerp(from[0], micHold[0], micReach), lerp(from[1], micHold[1], micReach)];

  const dark = 1 - on;
  const charFilter = `brightness(${lerp(1, 0.6, dark) + flash * 0.15 + lit * 0.12}) saturate(${lerp(1, 0.8, dark)})`;
  const notesK = (t >= T_SING1 && t < T_LAMP1) || (t >= T_FEED && t < T_RAGE) || (t >= T_SING2 && t < T_COUGH) ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: "#0b1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <defs>
          <filter id="bgblur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
          <filter id="smokeblur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={4} />
          </filter>
          <clipPath id="shade"><path d={SHADE} /></clipPath>
          <clipPath id="blanket"><path d={BLANKET} /></clipPath>
          <radialGradient id="warm">
            <stop offset="0" stopColor="#ffb04a" stopOpacity={0.85} />
            <stop offset="1" stopColor="#ffb04a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={camT}>
          <Backdrop on={on} blur={blur} />
          <g style={{ filter: charFilter }}>
            <Coil lit={lit} t={t} />
            <Face x={fx} y={fy} r={FACE.r} hair="husband" p={p} tilt={-6} id="hz" blood={blood} />
          </g>
          <g clipPath="url(#blanket)"><Backdrop on={on} blur={blur} /></g>
          <g style={{ filter: charFilter }}>
            {lit > 0 && <Smoke t={t} k={lit * (1 - ramp(t, T_BED, DURATION / FPS))} tx={t < T_FALL ? m.x : 200} ty={t < T_FALL ? m.y : 540} />}
            {m.streak > 0 && <path d={`M${m.x},${m.y} L${m.x + 160},${m.y + 50}`} stroke="rgba(255,255,255,0.5)" strokeWidth={10} strokeLinecap="round" />}
            {!m.hidden && (
              <g style={{ filter: "drop-shadow(0 0 2px rgba(200,215,255,0.7))" }}>
                <Mosquito x={m.x} y={m.y} s={m.s} f={f} flip={m.flip} mood={m.mood} legs={m.legs} flap={m.flap} tilt={m.tilt} tremble={m.tremble} mic={m.mic} id="m" />
              </g>
            )}
            {notesK > 0 && <Notes t={t} x={m.x} y={m.y} k={notesK} />}
            {lHand && (
              <g>
                <Arm w={ARM_W} pts={[L_BASE, [(L_BASE[0] + lHand[0]) / 2 - 20, (L_BASE[1] + lHand[1]) / 2 + 20], lHand]} />
                {coilReach > 0.01 && <Lighter x={lHand[0]} y={lHand[1] - 10} flame={lighterFlame} t={t} />}
                {micReach > 0.01 && t >= T_SNATCH && <Mic x={lHand[0] + 4} y={lHand[1] - HAND_R * 0.75} rot={8} />}
                <Hand x={lHand[0]} y={lHand[1]} r={HAND_R} flip={-1} />
              </g>
            )}
          </g>
          {/* the shade drawn again over the mosquito, so it can vanish behind it */}
          <g clipPath="url(#shade)"><Backdrop on={on} blur={blur} /></g>
          {(t < T_SING1 || t > T_BED + 0.6) && <Zzz t={t} x={FACE.x + 40} y={FACE.y - 40} />}
          {rage && <AngerMark x={fx + 62} y={fy - 70} s={1 + 0.15 * Math.sin(t * 20)} />}
          {rage && <Puffs t={t} x={fx} y={fy - FACE.r - 10} k={1} />}
          {flash > 0.02 && <circle cx={90} cy={660} r={420} fill="url(#warm)" opacity={flash * 0.6} />}
          {lit > 0 && <circle cx={EMBER[0]} cy={EMBER[1]} r={60} fill="url(#warm)" opacity={lit * (0.35 + 0.1 * hash(Math.floor(f / 3)))} />}
          {/* bass shockwave rings around the mic on each syllable */}
          {bellowing && lHand && SYLL.map((b) => (t >= b && t < b + 0.45 ? <circle key={b} cx={lHand![0]} cy={lHand![1] - 40} r={30 + (t - b) * 420} fill="none" stroke="#ffffff" strokeWidth={6} opacity={0.5 * (1 - (t - b) / 0.45)} /> : null))}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,8,25,0.5) 100%)", pointerEvents: "none" }} />

      <Audio src={staticFile("mosquito-gag/crickets.wav")} volume={0.35} />
      <Audio src={staticFile("mosquito-gag/buzz.wav")} volume={(fr) => buzzVol(fr / FPS)} />
      {[[0.3, 0.55], [T_BED + 0.8, 0.5]].map(([a, v]) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/snore.wav")} volume={v} /></Sequence>
      ))}
      {/* karaoke: first verse (cut by the lamp), louder after the feedback (cut by his rage), once more until the smoke */}
      <Sequence from={Math.round(T_SING1 * FPS)} durationInFrames={Math.round((T_LAMP1 - T_SING1) * FPS)}>
        <Audio src={staticFile("mosquito-gag/karaoke.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={Math.round(T_FEED * FPS)}><Audio src={staticFile("mosquito-gag/feedback.wav")} volume={0.55} /></Sequence>
      <Sequence from={Math.round((T_FEED + 0.15) * FPS)} durationInFrames={Math.round((T_RAGE - T_FEED - 0.15) * FPS)}>
        <Audio src={staticFile("mosquito-gag/karaoke.wav")} volume={0.95} />
      </Sequence>
      <Sequence from={Math.round(T_SING2 * FPS)} durationInFrames={Math.round((T_COUGH - T_SING2) * FPS)}>
        <Audio src={staticFile("mosquito-gag/karaoke.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={Math.round(T_COUGH * FPS)} durationInFrames={Math.round((T_SNATCH - T_COUGH) * FPS)}>
        <Audio src={staticFile("mosquito-gag/karaoke_warp.wav")} volume={0.6} />
      </Sequence>
      {[T_COUGH, T_COUGH + 0.5].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/cough.wav")} volume={0.65} /></Sequence>
      ))}
      {[T_LAMP1, T_OFF1, T_LAMP2, T_OFF2].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/click.wav")} volume={0.8} /></Sequence>
      ))}
      {[T_LAMP1, T_RAGE, T_SNATCH].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/whoosh.wav")} volume={0.5} /></Sequence>
      ))}
      <Sequence from={Math.round(T_RAGE * FPS)}><Audio src={staticFile("mosquito-gag/hiss.wav")} volume={0.35} /></Sequence>
      <Sequence from={Math.round(T_GRIN * FPS)} durationInFrames={Math.round(1.3 * FPS)}><Audio src={staticFile("mosquito-gag/haha.wav")} volume={0.45} /></Sequence>
      <Sequence from={Math.round(T_FLICK * FPS)}><Audio src={staticFile("mosquito-gag/lighter.wav")} volume={0.8} /></Sequence>
      <Sequence from={Math.round(T_LIT * FPS)}><Audio src={staticFile("mosquito-gag/hiss.wav")} volume={0.2} /></Sequence>
      <Sequence from={Math.round(T_BELLOW * FPS)}><Audio src={staticFile("mosquito-gag/bellow.wav")} volume={0.95} /></Sequence>
      <Sequence from={Math.round(T_FLOOR * FPS)}><Audio src={staticFile("mosquito-gag/thud.wav")} volume={0.7} /></Sequence>
    </AbsoluteFill>
  );
};
