import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP03 from "./ep03.json";
import { GROUND_Y, H, SEAT_Y, W } from "./Park";
import { Dining, Furniture, PLATE } from "./Dining";
import { Dog, DogMode } from "./Dog";
import { Emo, INK, Look, Pose, Pt, R, SEATED, STANDING, Stick } from "./Stick";
import { Captions, clamp01, FPS, Hook, keys, keysPt, LaughTag, Line, makeWords } from "./common";

// Stick couple, ep03 "Best I've Ever Had" (9:16). Beats are in content/stick-couple/README.md; cut times come from the
// voice timings in ep03.json (`python scripts/gen_gag_voice.py ep03 stick-couple`). Set in a dining room at night
// (Dining.tsx); the puppy (Dog.tsx) sits under the table.
const ep = EP03 as unknown as { hook: string; lines: Line[] };
const [L0, L1, L2, L3, L4] = ep.lines;
const WORDS = makeWords(ep.lines);

// ---------- timeline ----------
const T_BITE = L0.end + 0.1; // his close-up: first bite, face goes green
const T_ASK = L1.start - 0.25; // her close-up, chin on hands: "Is it good?"
const T_LIE = L2.start - 0.15; // his close-up: forced grin + thumbs-up
const T_YAY = L3.start - 0.1; // wide: she claps
const T_UP = L3.end + 0.05; // she stands, turns to the kitchen
const T_GO = T_UP + 0.3;
const T_SNEAK = T_GO + 0.25; // he takes the plate down under the table
const T_DOG = T_SNEAK + 0.55; // close-up under the table: sniff, then the pity look
const T_PITY = T_DOG + 1.1;
const T_RETURN = T_DOG + 2.0; // plate goes back up
const T_BACK = T_DOG + 2.4; // wide: she comes back with the pot
const T_POUR = T_BACK + 0.8;
const T_STARE = L4.end + 0.15; // his dead stare into the camera
const T_LAUGH = T_STARE + 1.5;
const T_END = T_LAUGH + 2.5;
export const DURATION = Math.ceil(T_END * FPS);

const HIP = SEAT_Y - 4;
const STAND_HIP = GROUND_Y - 4 - STANDING.feet[1][1];
const BOY_X = 300;
const GIRL_X = 780;
const DOG_X = 470;

const talkOf = (who: Line["who"], t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};
const walkFeet = (ph: number): [Pt, Pt] => [
  [-22 + Math.sin(ph) * 45, STANDING.feet[0][1] - Math.max(0, Math.cos(ph)) * 22],
  [26 - Math.sin(ph) * 45, STANDING.feet[1][1] - Math.max(0, -Math.cos(ph)) * 22],
];
const mixFeet = (a: [Pt, Pt], b: [Pt, Pt], k: number): [Pt, Pt] => [
  [a[0][0] + (b[0][0] - a[0][0]) * k, a[0][1] + (b[0][1] - a[0][1]) * k],
  [a[1][0] + (b[1][0] - a[1][0]) * k, a[1][1] + (b[1][1] - a[1][1]) * k],
];

// ---------- props ----------
// burnt food on a plate (plate centre at 0,0), with dark smoke; h = height of the heap
const Food: React.FC<{ t: number; h: number }> = ({ t, h }) => (
  <g>
    <ellipse cx={0} cy={0} rx={74} ry={15} fill="#fff" stroke={INK} strokeWidth={5} />
    <path d={`M-56,-2 Q-58,${-h * 0.8} -18,${-h} Q8,${-h * 1.15} 30,${-h * 0.9} Q60,${-h * 0.6} 56,-2 Z`} fill="#3b2a22" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[
      [-28, 0.5],
      [6, 0.75],
      [30, 0.45],
      [-8, 0.3],
    ].map(([x, k], i) => (
      <circle key={i} cx={x} cy={-h * k} r={7} fill={i % 2 ? "#5d7a2f" : "#1d1410"} />
    ))}
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.8 + i / 3) % 1;
      return <circle key={i} cx={(i - 1) * 22 + Math.sin(ph * 6 + i) * 12} cy={-h - 10 - ph * 120} r={10 + ph * 20} fill="#5b5b62" opacity={(1 - ph) * 0.55} />;
    })}
  </g>
);

const Fork: React.FC<{ bite: boolean }> = ({ bite }) => (
  <g>
    <line x1={0} y1={0} x2={-30} y2={-30} stroke="#9aa0ad" strokeWidth={7} strokeLinecap="round" />
    <path d="M-30,-30 l-6,-14 M-30,-30 l-12,-8 M-30,-30 l-14,-2" stroke="#9aa0ad" strokeWidth={4} strokeLinecap="round" />
    {bite && <circle cx={-38} cy={-38} r={11} fill="#3b2a22" stroke={INK} strokeWidth={3} />}
  </g>
);

const Pot: React.FC<{ tilt: number }> = ({ tilt }) => (
  <g transform={`rotate(${tilt} 10 -20)`}>
    <rect x={-60} y={-70} width={150} height={100} rx={18} fill="#6c7484" stroke={INK} strokeWidth={6} />
    <ellipse cx={15} cy={-70} rx={75} ry={14} fill="#3b2a22" stroke={INK} strokeWidth={6} />
    <rect x={-84} y={-58} width={28} height={14} rx={6} fill="#3a3f4b" stroke={INK} strokeWidth={4} />
    <rect x={86} y={-58} width={28} height={14} rx={6} fill="#3a3f4b" stroke={INK} strokeWidth={4} />
    <path d="M-40,-40 L60,-40" stroke="#8f98aa" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Sparkles: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const k = Math.abs(Math.sin(t * 4 + i * 2));
      const [x, y] = [[-R * 1.1, -R * 0.9], [R * 1.15, -R * 0.6], [R * 0.2, -R * 1.35]][i];
      return <path key={i} transform={`translate(${x} ${y}) scale(${0.5 + k * 0.6})`} d="M0,-20 L5,-5 L20,0 L5,5 L0,20 L-5,5 L-20,0 L-5,-5 Z" fill="#ffd84d" stroke={INK} strokeWidth={3} />;
    })}
  </g>
);

// ---------- the scene ----------
const Scene: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  // --- girl ---
  const seated = t < T_UP;
  const away = t >= T_GO + 0.9 && t < T_BACK;
  const standK = clamp01((t - T_UP) / 0.3);
  let girlX = GIRL_X;
  let girlHip = HIP;
  let girlDir: 1 | -1 = -1;
  let girlFeet: [Pt, Pt] = SEATED.feet;
  let girlNear: Pt = [60, -150];
  let girlFar: Pt = [45, -140];
  let girlLean = 0;
  let held: React.ReactNode;
  let potTilt = 0;
  if (t < T_UP) {
    girlNear = keysPt(t, [
      [0, [150, -150]],
      [0.9, [150, -150]],
      [1.2, [62, -160]],
      [T_ASK, [62, -160]],
      [T_ASK + 0.2, [55, -258]],
      [T_YAY, [55, -258]],
      [T_YAY + 0.15, [80, -170]],
    ]);
    girlFar = keysPt(t, [
      [1.0, [40, -130]],
      [1.2, [45, -150]],
      [T_ASK, [45, -150]],
      [T_ASK + 0.2, [38, -250]],
      [T_YAY, [38, -250]],
      [T_YAY + 0.15, [50, -165]],
    ]);
    if (t >= T_YAY && t < T_YAY + 1.0) girlNear = [62 + Math.abs(Math.sin((t - T_YAY) * 15)) * 30, -170];
    girlLean = t >= T_ASK && t < T_YAY ? 8 : 0;
  } else if (t < T_BACK) {
    girlHip = HIP + (STAND_HIP - HIP) * standK;
    girlFeet = mixFeet(SEATED.feet, STANDING.feet, standK);
    girlDir = t >= T_UP + 0.18 ? 1 : -1;
    if (t >= T_GO) {
      girlX = GIRL_X + (t - T_GO) * 560;
      girlFeet = walkFeet((t - T_GO) * 11);
    }
    girlNear = [25 + Math.sin((t - T_GO) * 11) * 30, -20];
    girlFar = [20 - Math.sin((t - T_GO) * 11) * 30, -20];
  } else {
    const arrive = T_BACK + 0.75;
    girlHip = STAND_HIP;
    girlX = 640 + Math.max(0, arrive - t) * 700;
    girlFeet = t < arrive ? walkFeet((t - T_BACK) * 11) : STANDING.feet;
    // carries the pot in, holds it over his plate, then pulls it back to her chest once it is empty
    const back = clamp01((t - (T_POUR + 1.4)) / 0.3);
    girlNear = [120 - back * 100, -185 + back * 70];
    girlFar = [96 - back * 90, -178 + back * 70];
    potTilt = keys(t, [
      [T_POUR, 0],
      [T_POUR + 0.3, 58],
      [T_POUR + 1.1, 58],
      [T_POUR + 1.4, 0],
    ]);
    held = (
      <g transform="translate(10 -6)">
        <Pot tilt={potTilt} />
      </g>
    );
  }
  const girlPose: Pose = { near: girlNear, far: girlFar, feet: girlFeet, lean: girlLean, tilt: t >= T_ASK && t < T_YAY ? -8 : 0, bob: Math.sin(t * 2.2 + 1) * 2, palm: t < 1.0 };
  const girlLook: Look = {
    emo: "happy",
    talk: talkOf("girl", t, f),
    blink: f % 113 > 109,
    gaze: t >= T_GO && t < T_BACK ? [0.8, 0] : [0.8, 0.1],
    blush: t >= T_ASK && t < T_YAY ? 1 : 0.4,
    t,
  };

  // --- boy ---
  const plateUp = t < T_SNEAK + 0.25 || t >= T_RETURN + 0.3; // plate sits on the table
  const sick = keys(t, [
    [T_BITE + 0.6, 0],
    [T_BITE + 1.6, 1],
    [T_LIE + 1.2, 1],
    [T_LIE + 2.2, 0.6],
    [T_POUR, 0.6],
    [T_POUR + 0.8, 1],
  ]);
  const boyNear = keysPt(t, [
    [0, [110, -130]],
    [T_BITE, [110, -130]],
    [T_BITE + 0.2, [165, -142]],
    [T_BITE + 0.55, [85, -292]],
    [T_BITE + 1.5, [85, -292]],
    [T_ASK, [110, -130]],
    [T_LIE + 0.15, [110, -130]],
    [T_LIE + 0.4, [125, -250]],
    [L2.end + 0.3, [125, -250]],
    [L2.end + 0.6, [110, -130]],
    [T_SNEAK, [110, -130]],
    [T_SNEAK + 0.25, [165, -142]],
    [T_SNEAK + 0.55, [70, -62]],
    [T_RETURN, [70, -62]],
    [T_RETURN + 0.3, [165, -142]],
    [T_RETURN + 0.5, [110, -130]],
  ]);
  let boyEmo: Emo = "happy";
  if (t >= T_BITE + 0.4) boyEmo = "nervous";
  if (t >= T_LIE) boyEmo = "awkward";
  if (t >= T_UP + 0.2) boyEmo = "nervous";
  if (t >= T_DOG + 0.4) boyEmo = "tired";
  if (t >= T_BACK) boyEmo = "neutral";
  if (t >= T_POUR + 0.2) boyEmo = "shock";
  if (t >= T_STARE) boyEmo = "tired";
  const boyPose: Pose = {
    near: boyNear,
    far: [70, -128],
    ...SEATED,
    lean: t >= T_SNEAK && t < T_RETURN + 0.3 ? 10 : 0,
    tilt: t >= T_DOG && t < T_BACK ? 8 : 0,
    bob: Math.sin(t * 2.2) * 2 + (t >= T_BITE + 0.55 && t < T_ASK ? Math.abs(Math.sin(t * 9)) * 3 : 0),
    thumb: t >= T_LIE + 0.3 && t < L2.end + 0.3,
  };
  const boyLook: Look = {
    emo: boyEmo,
    talk: t >= T_BITE + 0.55 && t < T_ASK ? 0 : talkOf("boy", t, f),
    blink: f % 97 > 93 && boyEmo !== "awkward",
    gaze: t >= T_STARE ? [-0.15, 0.05] : t >= T_DOG && t < T_BACK ? [0.4, 1] : t >= T_POUR ? [0.3, 0.8] : [0.8, 0],
    sick,
    tears: t >= T_BITE + 0.9 && t < T_LIE ? 0.7 : t >= T_STARE ? 0.4 : 0,
    sweat: (t >= T_BITE + 0.8 && t < T_YAY + 0.5) || (t >= T_UP && t < T_BACK) ? 1 : 0,
    t,
  };
  const mound = keys(t, [
    [T_POUR + 0.25, 34],
    [T_POUR + 1.1, 170],
  ]);
  const boyHeld = !plateUp ? (
    <g transform="translate(26 -4)">
      <Food t={t} h={34} />
    </g>
  ) : t >= T_BITE && t < T_ASK ? (
    <Fork bite={t < T_BITE + 0.6} />
  ) : undefined;

  // --- dog ---
  const dogMode: DogMode = t >= T_PITY ? "pity" : t >= T_DOG + 0.1 ? "sniff" : "idle";
  const sniffK = clamp01((t - T_DOG) / 0.3);
  const dogHead: [number, number] = dogMode === "sniff" ? [14 * sniffK, -40 * sniffK] : dogMode === "pity" ? [10, -12] : [0, 0];
  const paw = keys(t, [
    [T_PITY + 0.3, 0],
    [T_PITY + 0.6, 1],
    [T_BACK + 0.2, 1],
    [T_BACK + 0.6, 0],
  ]);

  return (
    <g>
      <Furniture t={t} boyX={BOY_X} girlX={GIRL_X} girlSeated={seated} />
      {plateUp && (
        <g transform={`translate(${PLATE[0]} ${PLATE[1]})`}>
          <Food t={t} h={mound} />
        </g>
      )}
      {t >= T_POUR + 0.2 && t < T_POUR + 1.1 && (
        <g>
          <path d={`M452,1000 Q458,${1040} 466,${PLATE[1] - mound + 10}`} stroke="#3b2a22" strokeWidth={22} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={456 + i * 4} cy={1000 + (((t * 3 + i / 3) % 1) * (PLATE[1] - mound - 990))} r={13} fill="#3b2a22" />
          ))}
        </g>
      )}
      {!away && <Stick x={girlX} hip={girlHip} dir={girlDir} hair="bob" girl pose={girlPose} look={girlLook} held={held} headExtras={t >= T_ASK && t < T_YAY + 1 ? <Sparkles t={t} /> : undefined} />}
      <Stick x={BOY_X} hip={HIP} dir={1} hair="spiky" pose={boyPose} look={boyLook} held={boyHeld} />
      <Dog x={DOG_X} y={GROUND_Y} dir={-1} t={t} mode={dogMode} head={dogHead} tilt={dogMode === "pity" ? -16 : dogMode === "sniff" ? -22 * sniffK : 0} look={dogMode === "pity" ? [0.4, -1] : [0.5, 0]} paw={paw} pawTo={[42, -142]} />
    </g>
  );
};

// ---------- camera ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  const punch = (from: number, amp: number) => amp * Math.exp(-(t - from) * 9);
  const wide = { cx: 540, cy: 1010, z: 1.12 };
  if (t < T_BITE) return { ...wide, z: 1.12 + t * 0.006 };
  if (t < T_ASK) return { cx: 350, cy: 900, z: 1.65 + (t - T_BITE) * 0.04 };
  if (t < T_LIE) return { cx: 740, cy: 900, z: 1.65 + (t - T_ASK) * 0.04 };
  if (t < T_YAY) return { cx: 350, cy: 900, z: 1.75 + punch(T_LIE, 0.2) };
  if (t < T_DOG) return wide;
  if (t < T_BACK) return { cx: 410, cy: 1150, z: 1.8 + (t - T_DOG) * 0.03 };
  if (t < T_STARE) return wide;
  return { cx: 380, cy: 960, z: 1.6 + punch(T_STARE, 0.2) + (t - T_STARE) * 0.05 };
};

// ---------- video ----------
export const Ep03: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const S = (at: number, src: string, volume = 1, dur?: number) => (
    <Sequence from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined}>
      <Audio src={staticFile(`stick-couple/ep03/${src}`)} volume={volume} />
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t >= T_LAUGH ? (
        <LaughTag t={t - T_LAUGH} f={f} />
      ) : (
        <AbsoluteFill style={{ background: "#b9814f" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
            <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
              <Dining t={t} />
              <Scene t={t} f={f} />
            </g>
          </svg>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(40,20,10,0.28) 100%)" }} />
        </AbsoluteFill>
      )}
      {t < T_LAUGH && <Hook t={t} text={ep.hook} />}
      {t < T_LAUGH && <Captions t={t} words={WORDS} />}
      {S(0, "music.wav", 0.16, T_BITE)}
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`))}
      {S(T_BITE + 0.55, "chew.wav", 0.6)}
      {S(L1.end + 0.05, "gulp.wav", 0.7)}
      {S(L3.start, "claps.wav", 0.4)}
      {S(T_YAY, "music.wav", 0.14, T_DOG - T_YAY)}
      {S(T_GO, "whoosh.wav", 0.3)}
      {S(T_DOG + 0.1, "sniff.wav", 0.7)}
      {S(T_PITY + 0.05, "whine.wav", 0.5)}
      {S(T_POUR + 0.15, "pour.wav", 0.7)}
      {S(T_STARE, "freeze.wav", 0.5)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
