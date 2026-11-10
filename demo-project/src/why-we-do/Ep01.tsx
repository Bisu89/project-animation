import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP from "./ep01.json";
import { INK, Look, Pose, Pt, STANDING } from "../stick-couple/Stick";
import { clamp01, FPS, Hook, lerp, smooth } from "../stick-couple/common";
import { Guy, Phone } from "./Guy";

// Why Do We Do This? ep01 "When you lose your phone": he hunts for the phone he is holding the whole time,
// lights the search with its own flashlight, freezes, stares at us, pockets it... and starts again.
const W = 1080;
const H = 1920;
const L = EP.lines;
export const DURATION = Math.ceil(EP.total * FPS);

// beats (s); the voice lines are at L[i].start
const T = {
  panic: L[0].start, // 1.1 "where's my phone?"
  grab1: 2.85,
  fling1: 3.4,
  turn: 3.7,
  grab2: 3.8,
  fling2: 4.2,
  kneel: 4.75,
  lampOff: 5.95, // the floor lamp flickers and dies
  raise: 6.35,
  click: 6.5,
  freeze: 9.5,
  stare: 11.2,
  stand: 13.5,
  loop: L[3].start, // 14.7 "where's my phone?" again
  end: EP.total,
};
const STAND_HIP = 1300;
const KNEEL_HIP = 1440;
const KNEEL: [Pt, Pt] = [
  [-150, 138],
  [-118, 142],
];
const PILLOWS = [
  { x: 742, y: 978, rot: 9, c: "#4fb3a4" },
  { x: 452, y: 980, rot: -8, c: "#ff7a6b" },
];

const talking = (t: number) => {
  const ln = L.find((l) => t >= l.start && t <= l.end);
  return ln ? 0.35 + 0.35 * Math.abs(Math.sin(t * 17)) + 0.2 * Math.abs(Math.sin(t * 29)) : 0;
};

type State = { x: number; hip: number; dir: 1 | -1; pose: Pose; look: Look; glint: number; phoneRot: number; inHand: boolean; holding: number | null };

const benny = (t: number): State => {
  const shake = (a: number) => Math.sin(t * 47) * a;
  const pat = (ph: number) => -40 + 26 * Math.abs(Math.sin(t * 13 + ph));
  const talk = talking(t);
  // 1. pats his pockets, phone in hand the whole time
  if (t < T.panic) {
    return { x: 620, hip: STAND_HIP, dir: 1, pose: { near: [52, pat(0)], far: [18, pat(1.6)], ...STANDING, lean: 4, tilt: 6 }, look: { emo: t < 0.6 ? "neutral" : "nervous", gaze: [0.3, 0.9], sweat: clamp01((t - 0.6) / 0.4), t }, glint: 0, phoneRot: -12, inHand: true, holding: null };
  }
  // 2. panic, both hands up (phone still in one of them)
  if (t < T.grab1) {
    const k = smooth(clamp01((t - T.panic) / 0.18));
    return {
      x: 620 + shake(4),
      hip: STAND_HIP,
      dir: 1,
      pose: { near: [lerp(52, 128, k), lerp(-30, -420, k)], far: [lerp(18, 82, k), lerp(-30, -400, k)], ...STANDING, lean: -5, palm: false },
      look: { emo: "shock", talk, sweat: 1, gaze: [Math.sin(t * 5) > 0 ? -0.8 : 0.9, 0.5], t }, // eyes dart around the room, never at his hand
      glint: 0,
      phoneRot: -12,
      inHand: true,
      holding: null,
    };
  }
  // 3. grabs the first pillow (far hand) and flings it
  if (t < T.turn) {
    const reach = smooth(clamp01((t - T.grab1) / 0.4));
    const fl = smooth(clamp01((t - T.fling1) / 0.18));
    const far: Pt = t < T.fling1 ? [lerp(82, 178, reach), lerp(-400, -292, reach)] : [lerp(178, 40, fl), lerp(-292, -470, fl)];
    return { x: lerp(620, 562, smooth(clamp01((t - T.grab1) / 0.3))), hip: STAND_HIP, dir: 1, pose: { near: [60, -60], far, ...STANDING, lean: t < T.fling1 ? 8 : -6 }, look: { emo: "nervous", sweat: 1, gaze: [0.6, -0.2], talk, t }, glint: 0, phoneRot: -12, inHand: true, holding: t >= T.grab1 + 0.38 && t < T.fling1 + 0.08 ? 0 : null };
  }
  // 4. turns, grabs the second pillow, flings it the other way
  if (t < T.kneel) {
    const reach = smooth(clamp01((t - T.grab2) / 0.35));
    const fl = smooth(clamp01((t - T.fling2) / 0.18));
    const far: Pt = t < T.fling2 ? [lerp(30, 186, reach), lerp(-60, -292, reach)] : [lerp(186, 40, fl), lerp(-292, -470, fl)];
    return { x: lerp(562, 640, smooth(clamp01((t - T.turn) / 0.25))), hip: STAND_HIP, dir: -1, pose: { near: [60, -60], far, ...STANDING, lean: t < T.fling2 ? 10 : -6 }, look: { emo: "nervous", sweat: 1, gaze: [0.6, -0.2], talk, t }, glint: 0, phoneRot: -12, inHand: true, holding: t >= T.grab2 + 0.33 && t < T.fling2 + 0.08 ? 1 : null };
  }
  // 5. drops to his knees in front of the coffee table and peeks under it
  if (t < T.freeze) {
    const k = smooth(clamp01((t - T.kneel) / 0.3));
    const up = smooth(clamp01((t - T.raise) / 0.25)); // raises the phone as a torch
    const sweep = t > T.click ? Math.sin((t - T.click) * 2.6) : 0;
    const feet: [Pt, Pt] = [
      [lerp(STANDING.feet[0][0], KNEEL[0][0], k), lerp(STANDING.feet[0][1], KNEEL[0][1], k)],
      [lerp(STANDING.feet[1][0], KNEEL[1][0], k), lerp(STANDING.feet[1][1], KNEEL[1][1], k)],
    ];
    return {
      x: lerp(640, 575, k) - 45 * smooth(clamp01((t - 7.0) / 2.6)),
      hip: lerp(STAND_HIP, KNEEL_HIP, k),
      dir: -1,
      pose: {
        near: [lerp(lerp(60, 120, k), 178, up), lerp(lerp(-60, 128, k), -100 + sweep * 18, up)],
        far: [lerp(30, 160, k), lerp(-60, 134, k)],
        feet,
        lean: lerp(0, 38 - up * 8, k) + (t > 7.0 ? Math.sin(t * 9) * 2 : 0),
        tilt: lerp(0, 14, k) - (t > T.lampOff && t < T.click ? 24 : 0),
      },
      look:
        t > T.lampOff && t < T.click
          ? { emo: "tired", gaze: [0.2, -1], t } // looks up at the dead lamp: of course
          : { emo: t > T.click ? (t > 8.3 ? "angry" : "focused") : "nervous", red: t > T.click ? 0.45 * clamp01((t - 7.6) / 1.6) : 0, sweat: t > T.click ? 0.6 : 1, gaze: [0.8, 0.5], talk, t },
      glint: 0,
      phoneRot: lerp(-12, 92 + sweep * 6, up),
      inHand: true,
      holding: null,
    };
  }
  // 6. the realisation (camera on the phone), then 7. the stare at us
  if (t < T.stand) {
    const stare = t >= T.stare;
    const blink = stare && [11.6, 11.82].some((b) => t > b && t < b + 0.09);
    const glance = t > 12.0 && t < 12.55; // eyes drop to the phone
    const grin = t >= 12.55;
    return {
      x: 575,
      hip: KNEEL_HIP,
      dir: -1,
      pose: { near: stare ? [128, -125] : [178, -100], far: [160, 134], feet: KNEEL, lean: stare ? 6 : 30, tilt: stare ? -4 : 14 },
      look: { emo: grin ? "awkward" : stare ? "blank" : "focused", gaze: glance ? [0.7, 1] : stare ? [-0.15, 0] : [0.8, 0.5], blink, sweat: grin ? 1 : 0, t },
      glint: grin ? smooth(clamp01((t - 12.9) / 0.2)) : 0,
      phoneRot: stare ? 4 : 92,
      inHand: true,
      holding: null,
    };
  }
  // 8. stands, pockets the phone, turns, two steps... and pats his pockets again
  const k = smooth(clamp01((t - T.stand) / 0.3));
  const pocketed = t > T.stand + 0.38;
  const walk = clamp01((t - (T.stand + 0.5)) / 0.4);
  const stepPh = walk > 0 && walk < 1 ? Math.sin(walk * Math.PI * 2) : 0;
  const loop = t >= T.loop;
  const hands = loop ? smooth(clamp01((t - T.loop - 0.35) / 0.15)) : 0;
  const feetStand: [Pt, Pt] = [
    [STANDING.feet[0][0] + stepPh * 34, STANDING.feet[0][1] - Math.max(0, stepPh) * 22],
    [STANDING.feet[1][0] - stepPh * 34, STANDING.feet[1][1] - Math.max(0, -stepPh) * 22],
  ];
  const feet: [Pt, Pt] = [
    [lerp(KNEEL[0][0], feetStand[0][0], k), lerp(KNEEL[0][1], feetStand[0][1], k)],
    [lerp(KNEEL[1][0], feetStand[1][0], k), lerp(KNEEL[1][1], feetStand[1][1], k)],
  ];
  const near: Pt = !pocketed ? [lerp(128, 24, k), lerp(-125, -92, k)] : loop ? [lerp(52, 128, hands), lerp(pat(0), -420, hands)] : [52, pat(0)];
  const far: Pt = loop ? [lerp(18, 82, hands), lerp(pat(1.6), -400, hands)] : [lerp(160, 18, k), lerp(134, -40, k)];
  return {
    x: lerp(575, 620, k) + walk * 90 + (loop && hands > 0 ? shake(4) : 0),
    hip: lerp(KNEEL_HIP, STAND_HIP, k) - Math.abs(stepPh) * 6,
    dir: t < T.stand + 0.45 ? -1 : 1,
    pose: { near, far, feet, lean: lerp(6, loop ? -5 : 4, k), tilt: loop ? 0 : 6 },
    look: { emo: loop ? (hands > 0.5 ? "shock" : "nervous") : t < T.stand + 0.5 ? "blank" : "neutral", gaze: loop ? [0, 0] : [0.3, 0.9], sweat: loop ? 1 : 0, talk: talking(t), t },
    glint: 0,
    phoneRot: -12,
    inHand: !pocketed,
    holding: null,
  };
};

// camera: z = zoom, (cx, cy) = world point at the centre of the frame
type Cam = { z: number; cx: number; cy: number };
const camAt = (t: number, s: State): Cam => {
  const head: Pt = [s.x + s.dir * 40, s.hip - 400];
  if (t < T.panic) return { z: 1, cx: 540, cy: 960 };
  if (t < T.grab1) {
    const k = smooth(clamp01((t - T.panic) / 0.12)); // punch in on the panic
    return { z: lerp(1, 1.4, k), cx: lerp(540, head[0], k), cy: lerp(960, head[1] + 120, k) };
  }
  if (t < T.click) return { z: 1, cx: 540, cy: 960 };
  if (t < T.freeze) {
    const k = smooth(clamp01((t - T.click) / 1.2));
    return { z: lerp(1, 1.2, k), cx: lerp(540, 470, k), cy: lerp(960, 1180, k) };
  }
  if (t < T.stare) {
    const k = smooth(clamp01((t - T.freeze - 0.15) / 1.3)); // slow push onto the phone in his hand
    return { z: lerp(1.2, 2.5, k), cx: lerp(470, 345, k), cy: lerp(1180, 1300, k) };
  }
  if (t < T.stand) {
    const k = (t - T.stare) / (T.stand - T.stare);
    return { z: lerp(2.1, 2.35, k), cx: 520, cy: 1080 };
  }
  if (t < T.loop) return { z: 1, cx: 540, cy: 960 };
  const k = smooth(clamp01((t - T.loop - 0.35) / 0.12));
  const k2 = smooth(clamp01((t - (T.end - 1.0)) / 0.8));
  return { z: lerp(1, 1.4, k) + k2 * 0.5, cx: lerp(540, head[0], k), cy: lerp(960, head[1] + 120 - k2 * 60, k) };
};
const clampCam = ({ z, cx, cy }: Cam): Cam => ({ z, cx: Math.max(W / 2 / z, Math.min(W - W / 2 / z, cx)), cy: Math.max(H / 2 / z, Math.min(H - H / 2 / z, cy)) });

const Pillow: React.FC<{ c: string }> = ({ c }) => (
  <g>
    <path d="M-62,-52 Q0,-40 62,-52 Q52,0 62,52 Q0,40 -62,52 Q-52,0 -62,-52 Z" fill={c} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M-40,-30 Q0,-22 40,-30" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.45} />
  </g>
);

// where each pillow is when it is not in his hand
const pillowAt = (i: number, t: number): { x: number; y: number; rot: number } | null => {
  const p = PILLOWS[i];
  const [release, from, to, spin] = i === 0 ? [T.fling1 + 0.08, [600, 840], [1350, 260], 520] : [T.fling2 + 0.08, [600, 840], [-300, 330], -520];
  if (t < (i === 0 ? T.grab1 + 0.38 : T.grab2 + 0.33)) return { x: p.x, y: p.y, rot: p.rot };
  if (t < release) return null;
  const k = (t - release) / 0.55;
  if (k > 1) return null;
  return { x: lerp(from[0], to[0], k), y: lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 120, rot: p.rot + spin * k };
};

const Beam: React.FC<{ t: number; s: State }> = ({ t, s }) => {
  // phone torch in world coords: origin at the phone's top end, pointing under the coffee table
  const o: Pt = [s.x - 292, s.hip - 100]; // near hand at (178,-100) mirrored + phone length (rot 92)
  const sweep = Math.sin((t - T.click) * 2.6);
  const a = Math.PI + 0.12 + sweep * 0.16;
  const len = 520;
  const spread = 0.24;
  const p1: Pt = [o[0] + Math.cos(a - spread) * len, o[1] + Math.sin(a - spread) * len];
  const p2: Pt = [o[0] + Math.cos(a + spread) * len, o[1] + Math.sin(a + spread) * len];
  const spot: Pt = [o[0] + Math.cos(a) * len * 0.8, o[1] + Math.sin(a) * len * 0.8];
  return (
    <svg width={W} height={H} style={{ position: "absolute", mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id="beam" x1={o[0]} y1={o[1]} x2={spot[0]} y2={spot[1]} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff7d0" stopOpacity={0.95} />
          <stop offset="1" stopColor="#fff7d0" stopOpacity={0.25} />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#fff7d0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#fff7d0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <polygon points={[o, p1, p2].map((p) => p.join(",")).join(" ")} fill="url(#beam)" />
      <ellipse cx={spot[0]} cy={spot[1]} rx={110} ry={70} fill="url(#glow)" />
      <circle cx={o[0]} cy={o[1]} r={70} fill="url(#glow)" />
    </svg>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 1 }) => (
  <Sequence from={Math.round(at * FPS)}>
    <Audio src={staticFile(`why-we-do/ep01/${src}`)} volume={volume} />
  </Sequence>
);

export const Ep01: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const s = benny(t);
  const cam = clampCam(camAt(t, s));
  // room goes dark while he searches by torchlight; a little light comes back on his face for the stare
  const flick = (t0: number, seq: number[]) => seq[Math.min(seq.length - 1, Math.floor((t - t0) / 0.06))];
  const dark =
    t < T.lampOff ? 0
    : t < T.lampOff + 0.36 ? flick(T.lampOff, [0.45, 0, 0.5, 0.1, 0.55, 0.62])
    : t < T.stare ? 0.62
    : t < T.stand ? 0.28
    : t < T.stand + 0.36 ? flick(T.stand, [0.28, 0, 0.3, 0.05, 0.2, 0])
    : 0;
  const torch = t >= T.click && t < T.stand;
  const scene = (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {[0, 1].map((i) => {
        const p = pillowAt(i, t);
        return p ? (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`}>
            <Pillow c={PILLOWS[i].c} />
          </g>
        ) : null;
      })}
      <Guy
        x={s.x}
        hip={s.hip}
        dir={s.dir}
        pose={s.pose}
        look={s.look}
        glint={s.glint}
        held={s.inHand ? <Phone rot={s.phoneRot} glow={torch ? 1 : 0} /> : undefined}
        heldFar={s.holding !== null ? <g transform="translate(0 -30)"><Pillow c={PILLOWS[s.holding].c} /></g> : undefined}
        pocket={!s.inHand ? <g transform="translate(14 -92) rotate(8)"><rect x={-22} y={-30} width={44} height={70} rx={8} fill="#2a2f3a" stroke={INK} strokeWidth={6} /><rect x={-15} y={-23} width={30} height={40} rx={4} fill="#6fa8ff" /></g> : undefined}
      />
    </svg>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: W, height: H, transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)` }}>
        <Img src={staticFile("why-we-do/ep01/bg.png")} style={{ position: "absolute", width: W, height: H, objectFit: "cover" }} />
        {scene}
        {dark > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(8,12,34,${dark})` }} />}
        {torch && t < T.stare && <Beam t={t} s={s} />}
      </div>
      <Hook t={t} text={EP.hook} />

      <Sequence durationInFrames={Math.round(T.freeze * FPS)}>
        <Audio src={staticFile("why-we-do/ep01/music.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={Math.round(T.loop * FPS)}>
        <Audio src={staticFile("why-we-do/ep01/music.wav")} volume={0.3} />
      </Sequence>
      {L.map((l, i) => (
        <Sfx key={i} at={l.start} src={`voice_${i}.mp3`} />
      ))}
      <Sfx at={0.25} src="pop.wav" volume={0.25} />
      <Sfx at={0.55} src="pop.wav" volume={0.25} />
      <Sfx at={T.grab1 - 0.15} src="gulp.wav" volume={0.7} />
      <Sfx at={T.fling1} src="whoosh.wav" volume={0.8} />
      <Sfx at={T.fling2} src="whoosh.wav" volume={0.8} />
      <Sfx at={T.kneel + 0.25} src="thud.wav" volume={0.6} />
      <Sfx at={T.lampOff} src="hiss.wav" volume={0.35} />
      <Sfx at={T.lampOff + 0.3} src="click.wav" volume={0.5} />
      <Sfx at={T.click} src="click.wav" />
      <Sfx at={T.stand} src="click.wav" volume={0.5} />
      <Sfx at={T.freeze} src="scratch.wav" volume={0.8} />
      <Sfx at={T.freeze + 0.5} src="ding.wav" volume={0.6} />
      <Sfx at={T.stand} src="whoosh.wav" volume={0.5} />
      <Sfx at={T.stand + 0.4} src="pop.wav" volume={0.3} />
      <Sfx at={T.loop + 0.35} src="gulp.wav" volume={0.5} />
    </AbsoluteFill>
  );
};
