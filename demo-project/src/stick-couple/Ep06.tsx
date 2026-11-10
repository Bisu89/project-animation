import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP06 from "./ep06.json";
import { GROUND_Y, H, W } from "./Park";
import { BUS, Bus, BusStop, PUDDLE, ROAD_Y, Rain, StopSign } from "./BusStop";
import { Emo, Hair, INK, Look, Pose, Pt, R, STANDING, Stick } from "./Stick";
import { Captions, clamp01, FPS, Hook, keys, LaughTag, Line, makeWords } from "./common";

// Stick couple, ep06 "A Real Man" (9:16). Beats are in content/stick-couple/README.md; cut times come from the voice
// timings in ep06.json (`python scripts/gen_gag_voice.py ep06 stick-couple`, ElevenLabs via vibi). Rainy bus stop
// (BusStop.tsx); the bus driver is the third voice.
type L = { who: string; text: string; start: number; end: number };
const ep = EP06 as unknown as { hook: string; lines: L[] };
const [L0, L1, L2, L3, L4] = ep.lines;
const WORDS = makeWords(ep.lines as unknown as Line[]);

// ---------- timeline ----------
const T_COAT = L0.end + 0.1; // his jacket flies onto her shoulders
const T_GIVE = L1.start + 0.15; // umbrella handed over
const T_STEP = L1.start + 0.7; // he steps out into the rain
const T_POSE = T_STEP + 0.6; // hero pose
const T_FLASH = L1.end - 0.25; // lightning
const T_HERO = L2.start - 0.15; // her close-up: "my hero!"
const T_BUS = L2.end + 0.15; // wide: the bus pulls in
const BUS_IN = 1.4;
const BUS_FROM = 1310;
const BUS_STOP = 60;
const busInX = (t: number) => BUS_STOP + (BUS_FROM - BUS_STOP) * (1 - clamp01((t - T_BUS) / BUS_IN)) ** 2;
// the front wheel (x + 110) crosses the puddle
const T_SPLASH = T_BUS + BUS_IN * (1 - Math.sqrt((PUDDLE.x - 110 - BUS_STOP) / (BUS_FROM - BUS_STOP)));
const T_WET = T_SPLASH + 0.25;
const T_DRENCH = T_SPLASH + 0.9; // his close-up, dripping; spits water
const T_SPIT = T_DRENCH + 0.5;
const T_BOARD = T_DRENCH + 1.2; // wide: she climbs on, waves
const T_IN = L3.end + 0.1; // she is inside (waves from the window), he dashes to the door
const T_DRIVER = L4.start - 0.25; // driver close-up, palm up
const T_SHUT = L4.end + 0.1; // door shuts in his face
const T_GO = T_SHUT + 0.5; // bus pulls away
const T_SUN = T_GO + 0.9; // rain stops, sun out
const T_LAUGH = T_SUN + 1.4;
const T_END = T_LAUGH + 2.5;
export const DURATION = Math.ceil(T_END * FPS);

const STAND_HIP = GROUND_Y - 4 - STANDING.feet[1][1];
const BOY0 = 640;
const BOY1 = 800;
const GIRL0 = 360;
const DOOR_X = BUS_STOP + 190 + 65;
const BOY_DOOR = DOOR_X + 120;

const talkOf = (who: string, t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};
const walkFeet = (ph: number, stride = 45): [Pt, Pt] => [
  [-22 + Math.sin(ph) * stride, STANDING.feet[0][1] - Math.max(0, Math.cos(ph)) * 22],
  [26 - Math.sin(ph) * stride, STANDING.feet[1][1] - Math.max(0, -Math.cos(ph)) * 22],
];
const handAt = (x: number, hip: number, dir: number, p: Pt, s = 1): Pt => [x + dir * p[0] * s, hip + p[1] * s];
const busX = (t: number) => (t < T_BUS ? BUS_FROM + 400 : t < T_GO ? busInX(t) : BUS_STOP - 1500 * (t - T_GO) ** 2);

// ---------- props ----------
// umbrella held at (0,0): shaft up, canopy `open` 0 (furled) .. 1
const CANOPY = 270;
const SHAFT = 260;
const Umbrella: React.FC<{ open: number; tilt?: number }> = ({ open, tilt = 0 }) => {
  const w = 30 + (CANOPY - 30) * open;
  const h = 40 + 110 * open;
  return (
    <g transform={`rotate(${tilt})`}>
      <path d="M0,0 L0,30 Q0,52 -20,52 Q-34,52 -34,38" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={-SHAFT - 40} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${-w},${-SHAFT} Q${-w * 0.9},${-SHAFT - h} 0,${-SHAFT - h * 1.05} Q${w * 0.9},${-SHAFT - h} ${w},${-SHAFT} Q${w * 0.66},${-SHAFT - 26 * open} ${w / 3},${-SHAFT} Q0,${-SHAFT - 26 * open} ${-w / 3},${-SHAFT} Q${-w * 0.66},${-SHAFT - 26 * open} ${-w},${-SHAFT} Z`} fill="#e8354a" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {open > 0.5 && <path d={`M${-w / 3},${-SHAFT} Q${-w * 0.25},${-SHAFT - h * 0.8} 0,${-SHAFT - h * 1.05} M${w / 3},${-SHAFT} Q${w * 0.25},${-SHAFT - h * 0.8} 0,${-SHAFT - h * 1.05}`} stroke="#b51f33" strokeWidth={5} fill="none" />}
    </g>
  );
};

// jacket draped over the torso (body-local coords, drawn after the figure)
const Jacket: React.FC<{ x: number; hip: number; dir: number; rot?: number; s?: number }> = ({ x, hip, dir, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${hip}) scale(${dir * s} ${s}) rotate(${rot} 0 -160)`}>
    <path d="M-64,-252 Q0,-272 64,-252 L86,-72 Q0,-56 -86,-72 Z" fill="#3f6fc4" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-30,-262 L0,-212 L30,-262" fill="#2d5299" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <line x1={0} y1={-212} x2={0} y2={-62} stroke="#cfd4e0" strokeWidth={5} />
    <rect x={-70} y={-150} width={30} height={22} rx={5} fill="#2d5299" stroke={INK} strokeWidth={3} />
  </g>
);

const Hearts: React.FC<{ t: number; from: number }> = ({ t, from }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = ((t - from) * 0.6 + i / 3) % 1;
      return <path key={i} transform={`translate(${-R * 0.6 + i * 70 + Math.sin(ph * 7 + i) * 14} ${-R * 1.25 - ph * 140}) scale(${0.6 + ph * 0.5})`} d="M0,10 C-30,-14 -14,-36 0,-20 C14,-36 30,-14 0,10 Z" fill="#ff6f91" stroke={INK} strokeWidth={4} opacity={Math.sin(Math.PI * ph)} />;
    })}
  </g>
);

const Leaf = () => (
  <g transform={`translate(${R * 0.15} ${-R * 0.98}) rotate(-25)`}>
    <path d="M0,0 Q-34,-26 -60,0 Q-34,26 0,0 Z" fill="#7bb446" stroke={INK} strokeWidth={4} />
    <line x1={0} y1={0} x2={-56} y2={0} stroke="#4f7d2a" strokeWidth={3} />
  </g>
);

const Spit: React.FC<{ k: number }> = ({ k }) => (
  <g>
    {Array.from({ length: 7 }, (_, i) => {
      const u = k * 1.4 - i * 0.08;
      if (u <= 0 || u > 1) return null;
      return <circle key={i} cx={R * 0.45 + u * 190} cy={R * 0.45 - u * 120 + u * u * 190} r={10 - i} fill="#8fd3ff" stroke={INK} strokeWidth={3} />;
    })}
  </g>
);

const Drips: React.FC<{ t: number; x: number; hip: number }> = ({ t, x, hip }) => (
  <g>
    {Array.from({ length: 6 }, (_, i) => {
      const ph = (t * 1.6 + i / 6) % 1;
      const dx = [-80, -40, 60, 95, -10, 30][i];
      return <path key={i} d={`M${x + dx},${hip - 300 + i * 40 + ph * 260} q-8,14 0,20 q8,-6 0,-20`} fill="#8fd3ff" stroke={INK} strokeWidth={3} opacity={1 - ph} />;
    })}
  </g>
);

// puddle wave thrown up by the bus wheel
const Wave: React.FC<{ t: number }> = ({ t }) => {
  const k = (t - T_SPLASH) / 0.55;
  if (k < 0 || k > 1.6) return null;
  const rise = Math.sin(Math.PI * Math.min(1, k));
  const top = ROAD_Y - 760 * rise;
  const crestX = 900 - 170 * Math.min(1, k);
  return (
    <g opacity={k < 1 ? 0.92 : 0.92 * (1.6 - k) / 0.6}>
      {k < 1.05 && (
        <path d={`M${PUDDLE.x + 90},${ROAD_Y + 10} Q${PUDDLE.x + 40},${top + 120} ${crestX},${top} Q${crestX - 140},${top + 60} ${crestX - 160},${top + 260} Q${crestX - 60},${top + 200} ${PUDDLE.x - 90},${ROAD_Y + 10} Z`} fill="#6fb3e8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      )}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI;
        const d = 140 + (i % 4) * 60;
        const u = Math.max(0, k - 0.3);
        return <circle key={i} cx={crestX - 40 - Math.cos(a) * d * (0.4 + u)} cy={top + 40 - Math.sin(a) * 90 + u * u * 900} r={12 + (i % 3) * 5} fill="#9fd3ee" stroke={INK} strokeWidth={3} />;
      })}
    </g>
  );
};

// ---------- the scene ----------
const Scene: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const bx = busX(t);
  const doorOpen = keys(t, [
    [T_BUS + BUS_IN - 0.05, 0],
    [T_BUS + BUS_IN + 0.25, 1],
    [T_SHUT, 1],
    [T_SHUT + 0.25, 0],
  ]);
  const wet = t >= T_WET;
  const inside = t >= T_IN;

  // --- girl ---
  let gx = GIRL0;
  let gHip = STAND_HIP;
  let gDir: 1 | -1 = 1;
  let gFeet: [Pt, Pt] = STANDING.feet;
  const shiver = t < T_COAT + 0.4 ? Math.sin(t * 60) * 3 : 0;
  let gNear: Pt = [-6 + shiver, -152];
  let gFar: Pt = [40, -162];
  let gEmo: Emo = t < T_COAT + 0.3 ? "nervous" : "happy";
  let umbOpen = 1;
  let gHasUmb = t >= T_GIVE + 0.3;
  let gPalm = false;
  if (gHasUmb) gNear = [100, -300];
  if (t >= T_HERO && t < T_BUS) gEmo = "moved";
  if (t >= T_BOARD) {
    // walk to the door, furl the umbrella, step up, wave
    const k = clamp01((t - T_BOARD) / 0.35);
    gDir = t < T_BOARD + 0.4 ? -1 : 1;
    gx = GIRL0 + (DOOR_X - GIRL0) * k;
    gFeet = k < 1 ? walkFeet((t - T_BOARD) * 12) : STANDING.feet;
    gHip = STAND_HIP - 34 * clamp01((t - T_BOARD - 0.35) / 0.15);
    umbOpen = 1 - clamp01((t - T_BOARD) / 0.25);
    gHasUmb = false;
    gNear = t >= T_BOARD + 0.45 ? [80 + Math.sin(t * 12) * 30, -300] : [60, -60];
    gFar = [30, -40];
    gPalm = t >= T_BOARD + 0.45;
    gEmo = "happy";
  }
  const gLook: Look = {
    emo: gEmo,
    talk: talkOf("girl", t, f),
    blink: f % 113 > 109,
    gaze: t < T_COAT ? [0.5, 0.2] : t >= T_STEP && t < T_BOARD ? [0.9, 0] : [0.8, 0],
    blush: (t >= T_COAT + 0.4 && t < T_BUS) ? 1 : 0,
    tears: 0,
    t,
  };
  const gPose: Pose = { near: gNear, far: gFar, feet: gFeet, bob: Math.sin(t * 2.2 + 1) * 2 + shiver * 0.6, tilt: t >= T_HERO && t < T_BUS ? -8 : 0, palm: gPalm };

  // --- boy ---
  let bx0 = BOY0;
  let bDir: 1 | -1 = -1;
  let bFeet: [Pt, Pt] = STANDING.feet;
  let bNear: Pt = [100, -300];
  let bFar: Pt = [40, -60];
  let bLean = 0;
  let bTilt = 0;
  let bEmo: Emo = "neutral";
  let bGaze: Pt = [0.8, 0];
  let bPalm = false;
  const hair: Hair = wet ? "wet" : "spiky";
  if (t >= T_COAT) bEmo = "happy";
  if (t >= T_GIVE) {
    bNear = [62, -122];
    bFar = [55, -126];
  }
  if (t >= T_STEP && t < T_POSE) {
    const k = (t - T_STEP) / 0.6;
    bx0 = BOY0 + (BOY1 - BOY0) * k;
    bDir = 1;
    bFeet = walkFeet((t - T_STEP) * 11);
    bNear = [30 + Math.sin((t - T_STEP) * 11) * 30, -20];
    bFar = [20 - Math.sin((t - T_STEP) * 11) * 30, -20];
  } else if (t >= T_POSE) {
    bx0 = BOY1;
    bLean = -6;
    bTilt = -8;
    bGaze = [0.6, -0.4];
    bNear = [70, -440]; // fist to the sky
    bFar = [38, -28]; // other fist on the hip
  }
  if (wet) {
    bEmo = t >= T_SPIT + 0.6 ? "tired" : "shock";
    bLean = 0;
    bTilt = 0;
    bNear = [75, -45];
    bFar = [65, -45];
    bGaze = [-0.1, 0];
  }
  if (t >= T_BOARD) {
    bEmo = t >= L3.start ? "happy" : "tired";
    bGaze = [0.8, 0];
  }
  if (t >= T_IN) {
    // dash to the door
    const k = clamp01((t - T_IN) / 0.45);
    bx0 = BOY1 + (BOY_DOOR - BOY1) * k;
    bFeet = k < 1 ? walkFeet((t - T_IN) * 18, 60) : STANDING.feet;
    bLean = k < 1 ? 16 : 4;
    bEmo = "nervous";
    bNear = k < 1 ? [40 + Math.sin((t - T_IN) * 18) * 50, -40] : [120, -190];
    bPalm = k >= 1;
  }
  if (t >= T_SHUT) {
    bEmo = "tired";
    bNear = [60, -40];
    bPalm = false;
    bLean = 0;
    bGaze = t >= T_SUN ? [0.3, -1] : [-0.6, 0];
  }
  const bLook: Look = {
    emo: bEmo,
    talk: talkOf("boy", t, f),
    blink: f % 97 > 93 && bEmo !== "shock",
    gaze: bGaze,
    sweat: t >= T_IN && t < T_SHUT ? 1 : 0,
    t,
  };
  const bPose: Pose = { near: bNear, far: bFar, feet: bFeet, lean: bLean, tilt: bTilt, bob: Math.sin(t * 2.2) * 2, palm: bPalm };
  const bExtras = (
    <g>
      {wet && <Leaf />}
      {t >= T_SPIT && t < T_SPIT + 0.7 && <Spit k={(t - T_SPIT) / 0.6} />}
    </g>
  );

  // --- jacket + umbrella ---
  const ck = clamp01((t - T_COAT) / 0.45);
  const jacket =
    ck <= 0 ? (
      <Jacket x={BOY0} hip={STAND_HIP} dir={-1} />
    ) : ck >= 1 ? (
      !inside && t < T_BOARD + 0.4 ? <Jacket x={gx} hip={gHip} dir={gDir} s={1.05} /> : t >= T_BOARD + 0.4 && !inside ? <Jacket x={gx} hip={gHip} dir={gDir} s={1.05} /> : null
    ) : (
      <Jacket x={BOY0 + (GIRL0 - BOY0) * ck} hip={STAND_HIP - Math.sin(Math.PI * ck) * 160} dir={ck < 0.5 ? -1 : 1} rot={ck * 360} />
    );
  const holder = t < T_GIVE ? handAt(BOY0, STAND_HIP, -1, [100, -300]) : t < T_GIVE + 0.3 ? null : handAt(gx, gHip, gDir, gNear);
  const umbAt: Pt | null = t >= T_GIVE && t < T_GIVE + 0.3 ? (() => {
    const a = handAt(BOY0, STAND_HIP, -1, [100, -300]);
    const b = handAt(GIRL0, STAND_HIP, 1, [100, -300]);
    const k = (t - T_GIVE) / 0.3;
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - Math.sin(Math.PI * k) * 30] as Pt;
  })() : holder;
  const umbrella = !inside && (gHasUmb || t < T_BOARD) && umbOpen > 0.05 && umbAt ? (
    <g transform={`translate(${umbAt[0]} ${umbAt[1]})`}>
      <Umbrella open={umbOpen} />
    </g>
  ) : null;

  // windows: driver (always while the bus is in shot) and her, once she is inside
  const winClip = (id: string, x: number, w: number, h = BUS.winBot - BUS.winTop) => (
    <clipPath id={id}>
      <rect x={x} y={BUS.winTop} width={w} height={h} rx={14} />
    </clipPath>
  );
  const driverTalk = talkOf("other", t, f);
  const windows = (
    <g>
      {winClip("drv", bx + 20, 150, BUS.winBot - BUS.winTop + 60)}
      <g clipPath="url(#drv)">
        <Stick
          x={bx + 92}
          hip={945}
          dir={1}
          scale={0.75}
          hair="none"
          pose={{ near: t >= T_DRIVER && t < T_SHUT + 0.3 ? [95, -330] : [90, -150], far: [80, -150], ...STANDING, palm: t >= T_DRIVER && t < T_SHUT + 0.3 }}
          look={{ emo: t >= T_DRIVER ? "tired" : "neutral", talk: driverTalk, gaze: [0.9, 0], blink: f % 89 > 85, t }}
          headExtras={
            <g>
              <path d={`M${-R * 0.95},${-R * 0.45} Q0,${-R * 1.35} ${R * 0.95},${-R * 0.45} Z`} fill="#2f80d1" stroke={INK} strokeWidth={7} />
              <path d={`M${R * 0.4},${-R * 0.5} L${R * 1.35},${-R * 0.42} L${R * 0.9},${-R * 0.3} Z`} fill="#1f5c9c" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            </g>
          }
        />
      </g>
      {inside && (
        <g>
          {winClip("pax", bx + 340, 150)}
          <g clipPath="url(#pax)">
            <Stick x={bx + 420} hip={930} dir={1} scale={0.72} hair="bob" girl pose={{ near: [70 + Math.sin(t * 12) * 30, -320], far: [40, -150], ...STANDING, palm: true }} look={{ emo: "happy", gaze: [0.8, 0.2], t }} />
            <Jacket x={bx + 420} hip={930} dir={1} s={0.75} />
          </g>
        </g>
      )}
    </g>
  );

  return (
    <g>
      <Bus x={bx} door={doorOpen} t={t} moving={t >= T_GO ? 1 : t >= T_BUS && t < T_BUS + BUS_IN ? 0.6 : 0}>
        {windows}
      </Bus>
      <StopSign x={1000} />
      {umbrella}
      {!inside && <Stick x={gx} hip={gHip} dir={gDir} hair="bob" girl pose={gPose} look={gLook} headExtras={t >= T_HERO && t < T_BUS ? <Hearts t={t} from={T_HERO} /> : undefined} />}
      {jacket}
      <Stick x={bx0} hip={STAND_HIP} dir={bDir} hair={hair} pose={bPose} look={bLook} headExtras={bExtras} />
      {wet && <Drips t={t} x={bx0} hip={STAND_HIP} />}
      <Wave t={t} />
    </g>
  );
};

// ---------- camera ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  const punch = (from: number, amp: number) => amp * Math.exp(-(t - from) * 9);
  const wide = { cx: 540, cy: 990, z: 1.1 };
  if (t < L0.start) return { ...wide, z: 1.1 + t * 0.008 };
  if (t < T_COAT) return { cx: 480, cy: 900, z: 1.35 + (t - L0.start) * 0.03 };
  if (t < T_HERO) return { cx: 590, cy: 960, z: 1.12 + (t >= T_POSE ? (t - T_POSE) * 0.04 : 0) };
  if (t < T_BUS) return { cx: 380, cy: 800, z: 1.75 + (t - T_HERO) * 0.03 };
  if (t < T_DRENCH) {
    const sh = t >= T_SPLASH ? Math.sin(t * 60) * 10 * Math.exp(-(t - T_SPLASH) * 5) : 0;
    return { cx: 540 + sh, cy: 990, z: 1.06 };
  }
  if (t < T_BOARD) return { cx: 800, cy: 790, z: 1.75 + punch(T_DRENCH, 0.2) + (t - T_DRENCH) * 0.04 };
  if (t < T_DRIVER) return { cx: 520, cy: 980, z: 1.1 };
  if (t < T_SHUT) return { cx: 250, cy: 730, z: 1.85 + (t - T_DRIVER) * 0.03 };
  return wide;
};

// ---------- video ----------
export const Ep06: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const sun = clamp01((t - T_SUN) / 0.8);
  const rainK = 1 - clamp01((t - T_SUN) / 0.4);
  const flash = t >= T_FLASH ? Math.max(0, 1 - (t - T_FLASH) / 0.25) * (Math.sin((t - T_FLASH) * 60) > -0.3 ? 1 : 0.3) : 0;
  const splashK = clamp01((t - T_SPLASH) / 0.3);
  // the dry patch under the umbrella (world coords), only while it is open over someone
  const umbX = t < T_GIVE ? BOY0 - 100 : GIRL0 + 100;
  const keep: [number, number, number] | undefined = t < T_BOARD ? [umbX - CANOPY, umbX + CANOPY, STAND_HIP - 300 - SHAFT - 20] : undefined;
  const S = (at: number, src: string, volume = 1, dur?: number) => (
    <Sequence key={`${src}-${at}`} from={Math.round(at * FPS)} durationInFrames={dur ? Math.max(1, Math.round(dur * FPS)) : undefined}>
      <Audio src={staticFile(`stick-couple/ep06/${src}`)} volume={volume} />
    </Sequence>
  );
  const rainEnd = T_SUN + 0.4;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t >= T_LAUGH ? (
        <LaughTag t={t - T_LAUGH} f={f} />
      ) : (
        <AbsoluteFill style={{ background: "#a7acb6" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
            <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
              <BusStop t={t} sun={sun} splashK={splashK} />
              {flash > 0 && <path d="M320,0 L270,180 L330,190 L250,420 L360,160 L300,150 L350,0 Z" fill="#fff6b0" stroke={INK} strokeWidth={4} opacity={flash} />}
              <Scene t={t} f={f} />
              <Rain t={t} k={rainK} keep={keep} />
            </g>
          </svg>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(20,30,50,${0.35 * (1 - sun)}) 100%)` }} />
          {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.7 }} />}
        </AbsoluteFill>
      )}
      {t < T_LAUGH && <Hook t={t} text={ep.hook} />}
      {t < T_LAUGH && <Captions t={t} words={WORDS} />}
      {[0, 8, 16].filter((a) => a < rainEnd).map((a) => S(a, "rain.wav", 0.35, Math.min(8, rainEnd - a)))}
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`))}
      {S(T_COAT, "whoosh.wav", 0.35)}
      {S(T_POSE, "hero.wav", 0.45)}
      {S(T_FLASH, "thunder.wav", 0.7)}
      {S(T_BUS - 0.3, "engine.wav", 0.55)}
      {S(T_SPLASH, "splash.wav", 0.8)}
      {S(T_DRENCH, "freeze.wav", 0.45)}
      {S(T_SPIT, "plop.wav", 0.4)}
      {S(T_BUS + BUS_IN - 0.05, "hiss.wav", 0.5)}
      {S(T_IN, "whoosh.wav", 0.35)}
      {S(T_SHUT, "hiss.wav", 0.6)}
      {S(T_GO, "engine.wav", 0.55)}
      {S(T_SUN + 0.2, "birds.wav", 0.5)}
      {S(T_SUN, "music.wav", 0.12, T_LAUGH - T_SUN)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
