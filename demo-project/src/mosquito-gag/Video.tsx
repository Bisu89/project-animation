import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Face, FaceP, faceAt } from "../bedroom-gag/Face";
import { Arm, Hand } from "../bedroom-gag/Primitives";
import { HusbandHair } from "../bedroom-gag/Hair";
import { clamp01, smooth } from "../bedroom-gag/config";
import { W, H, SHADE, BLANKET, FACE, LAMP_HAND, ARM_W, HAND_R, lerp, ramp, hash, track, Backdrop, Puffs, AngerMark, Zzz } from "./common";
import { Mosquito, MMood, LegPose, moodAt, MOODS } from "./Mosquito";

// Ep 1 "Chili blood". Act 1: he is asleep, the mosquito buzzes; lamp on -> it vanishes, lamp off -> buzzing again, twice,
// until he boils over. Act 2: he eats a fistful of chillies, goes red, fakes sleep; the mosquito dives in, drinks,
// breathes fire, screams and bursts into flames, drops onto the blanket burnt black; he laughs (no longer red) and
// falls asleep. 9:16, about 30 s.
// One world = the bedroom-gag background (comp px); shots are camera moves on it. Times are seconds.
// Sounds in public/mosquito-gag come from scripts/gen_mosquito_sfx.py.
export const FPS = 30;
const T_CLOSE = 2.4; // cut from the wide shot to the close-up on the pillow
const T_WAKE = 4.4; // eyes snap open
const T_ON1 = 5.0;
const T_OFF1 = 6.6;
const T_BACK = 7.1; // buzzing again after the lamp goes off
const T_ON2 = 8.4;
const T_RAGE = 9.2; // he boils over
const T_CHILI = 10.6; // hand brings the chillies
const BITES = [11.3, 11.9, 12.5, 13.1];
const T_OFF2 = 14.2; // lamp off, fake sleep
const T_DIVE = 15.8; // mosquito dives in
const T_SUCK = 16.5;
const T_HOT = 18.4; // chilli blood kicks in
const T_FIRE = 19.6; // fire breath
const T_SCREAM = 20.8;
const T_IGNITE = 21.7;
const T_OUT = 23.2; // flames out, burnt black, falls
const T_LAND = 23.9;
const T_LAUGH = 24.8; // he opens his eyes, the red is gone, laughs
const T_ON3 = 24.3; // lamp on to look at the burnt mosquito
const T_SLEEP = 27.0; // lamp off, back to sleep, smiling
export const DURATION = Math.round(29.5 * FPS);

// spots for this episode (world px)
const CHEEK = [205, 778]; // where the mosquito drinks (left cheek)
const FIRE_AT = [250, 600];

// ---------- the mosquito's whole performance ----------
type MState = { x: number; y: number; s: number; flip: number; mood: MMood; legs: LegPose; flap: number; tilt: number; tremble: number; hidden: boolean; streak: number; belly: number; heat: number; char: number; burning: number };
const burnPath = (t: number) => {
  // panicked zigzag while on fire
  const k = clamp01((t - T_IGNITE) / (T_OUT - T_IGNITE));
  return [FIRE_AT[0] + Math.sin(k * 9) * 90 + k * 40, FIRE_AT[1] + Math.sin(k * 13) * 50 + k * 60];
};
const mosquitoAt = (t: number): MState => {
  const wob = (a: number) => [Math.sin(t * 5.3) * 7 * a + Math.sin(t * 9.1) * 3 * a, Math.cos(t * 6.4) * 6 * a + Math.sin(t * 11.7) * 2 * a];
  const base: MState = { x: 0, y: 0, s: 0.5, flip: -1, mood: MOODS.sneaky, legs: "dangle", flap: 1, tilt: 0, tremble: 0, hidden: false, streak: 0, belly: 0, heat: 0, char: 0, burning: 0 };
  const zip = (t0: number, from: number[]) => {
    const k = smooth(clamp01((t - t0) / 0.18));
    return { ...base, x: lerp(from[0], 90, k), y: lerp(from[1], 655, k), mood: MOODS.shock, streak: k < 1 ? 1 : 0, hidden: k >= 1 };
  };
  const c = T_CLOSE;
  if (t < c) {
    const [x, y] = track(t, [[0, 560, 540], [1.0, 470, 650], [1.8, 400, 600], [c, 380, 690]]);
    const [wx, wy] = wob(1);
    return { ...base, x: x + wx, y: y + wy, s: 0.24, flip: 1, mood: MOODS.happy };
  }
  if (t < T_ON1) {
    const [x, y] = track(t, [[c, 520, 560], [c + 0.8, 420, 610], [c + 1.4, 270, 575], [c + 1.9, 190, 690], [T_ON1, 195, 720]]);
    const [wx, wy] = wob(1 - ramp(t, c + 1.8, c + 2.2) * 0.6);
    return { ...base, x: x + wx, y: y + wy, flip: t < c + 1.6 ? 1 : -1, mood: moodAt(t, [[0, "happy"], [c + 1.8, "sneaky"]]), legs: t > c + 1.9 ? "rub" : "dangle" };
  }
  if (t < T_BACK) return zip(T_ON1, [195, 720]);
  if (t < T_ON2) {
    const [x, y] = track(t, [[T_BACK, 92, 655], [T_BACK + 0.4, 130, 650], [T_BACK + 0.7, 150, 645], [T_ON2, 200, 705]]);
    const [wx, wy] = wob(t > T_BACK + 0.7 ? 0.8 : 0.15);
    return { ...base, x: x + wx, y: y + wy, mood: moodAt(t, [[0, "sneaky"], [T_BACK + 0.7, "happy"]]), legs: t > T_BACK + 0.8 ? "rub" : "dangle" };
  }
  if (t < T_DIVE) return zip(T_ON2, [200, 705]);
  if (t < T_SUCK) {
    // dive from behind the shade onto the cheek
    const [x, y] = track(t, [[T_DIVE, 92, 655], [T_DIVE + 0.3, 140, 630], [T_SUCK, CHEEK[0], CHEEK[1]]]);
    return { ...base, x, y, mood: MOODS.happy };
  }
  if (t < T_HOT + 0.7) {
    const belly = ramp(t, T_SUCK + 0.2, T_HOT - 0.2);
    const heat = ramp(t, T_HOT, T_HOT + 0.7);
    return { ...base, x: CHEEK[0], y: CHEEK[1], tilt: -16, flap: 0.25, belly, heat, mood: t < T_HOT ? MOODS.bliss : MOODS.burn, tremble: heat * 1.5 };
  }
  if (t < T_IGNITE) {
    // shoot up, breathe fire, scream
    const up = ramp(t, T_HOT + 0.7, T_FIRE);
    const recoil = t >= T_FIRE && t < T_SCREAM ? Math.sin((t - T_FIRE) * 30) * 3 - (t - T_FIRE) * 20 : 0;
    const [wx, wy] = wob(t >= T_SCREAM ? 1.6 : 0.3);
    return { ...base, x: lerp(CHEEK[0], FIRE_AT[0], up) + recoil + wx, y: lerp(CHEEK[1], FIRE_AT[1], up) + wy, belly: 1, heat: 1, mood: MOODS.burn, tremble: 1.5 };
  }
  if (t < T_OUT) {
    const [x, y] = burnPath(t);
    const k = clamp01((t - T_IGNITE) / (T_OUT - T_IGNITE));
    return { ...base, x, y, belly: 1 - k * 0.5, heat: 1, char: k * 0.8, mood: MOODS.burn, burning: 1, flip: Math.cos(k * 9) > 0 ? -1 : 1, tremble: 1 };
  }
  // burnt black: drops like a stone, flips belly-up on the blanket
  const [x0, y0] = burnPath(T_OUT);
  const k = clamp01((t - T_OUT) / (T_LAND - T_OUT));
  const bounce = t > T_LAND && t < T_LAND + 0.3 ? -Math.sin(((t - T_LAND) / 0.3) * Math.PI) * 18 : 0;
  return { ...base, x: lerp(x0, 420, k), y: lerp(y0, 905, k * k) + bounce, char: 1, belly: 0.5, legs: "stiff", flap: 0, tilt: lerp(0, 180, smooth(k)), mood: MOODS.flat, tremble: t > T_LAND + 0.4 ? 0.15 : 0 };
};

const buzzVol = (t: number) => {
  if (t < T_CLOSE) return 0.15 + 0.07 * t;
  if (t < T_ON1) return lerp(0.5, 0.95, ramp(t, T_CLOSE, T_WAKE));
  if (t < T_BACK) return 0;
  if (t < T_ON2) return lerp(0.3, 0.85, ramp(t, T_BACK, T_ON2 - 0.2));
  if (t < T_DIVE) return 0;
  if (t < T_SUCK) return 0.9;
  if (t < T_HOT + 0.7) return 0;
  if (t < T_OUT) return 0.7;
  return 0;
};

// ---------- props ----------

const Chili: React.FC<{ x: number; y: number; rot: number; s?: number }> = ({ x, y, rot, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0,0 C12,-8 44,-6 66,14 C71,19 64,23 57,19 C38,9 15,10 0,9 Z" fill="#d8231f" stroke="#141317" strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M10,-1 C26,-4 44,0 56,9" stroke="#ff7a6a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    <path d="M2,-2 Q-6,-4 -12,-12 M-2,0 L4,8 L-4,8 Z" stroke="#2f7a26" strokeWidth={4} fill="#3f8a2e" strokeLinecap="round" />
  </g>
);

// a flickering flame tongue standing on (x, y)
const tongue = (x: number, y: number, w: number, h: number, wob: number) =>
  `M${x - w},${y} Q${x - w * 1.1},${y - h * 0.45} ${x + wob},${y - h} Q${x + w * 1.1},${y - h * 0.45} ${x + w},${y} Q${x},${y + w * 0.7} ${x - w},${y} Z`;

const FireBreath: React.FC<{ x: number; y: number; dir: number; len: number; f: number }> = ({ x, y, dir, len, f }) => {
  const cone = (l: number, w: number) => {
    const pts = Array.from({ length: 9 }, (_, i) => {
      const k = i / 8;
      const j = (hash(f * 3 + i) - 0.5) * w * 0.5;
      return `${x + dir * l * (0.15 + 0.85 * k)},${y - w * k - j}`;
    });
    const back = Array.from({ length: 9 }, (_, i) => {
      const k = 1 - i / 8;
      const j = (hash(f * 5 + i + 20) - 0.5) * w * 0.5;
      return `${x + dir * l * (0.15 + 0.85 * k)},${y + w * k + j}`;
    });
    return `M${x},${y} L${pts.join(" L")} Q${x + dir * l * 1.08},${y} ${back.join(" L")} Z`;
  };
  return (
    <g>
      <path d={cone(len, 55)} fill="#e33a1c" opacity={0.85} />
      <path d={cone(len * 0.82, 38)} fill="#ff8f1f" />
      <path d={cone(len * 0.55, 20)} fill="#ffe36b" />
      {[0, 1, 2, 3, 4].map((i) => {
        const k = (f * 0.07 + i / 5) % 1;
        return <circle key={i} cx={x + dir * len * (0.6 + k * 0.6)} cy={y + (hash(i * 7 + Math.floor(f / 3)) - 0.5) * 80 - k * 20} r={3 + (1 - k) * 4} fill="#ffd25a" opacity={1 - k} />;
      })}
    </g>
  );
};

const BodyFlames: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g>
    {[[-50, -30, 18, 70], [-15, -25, 22, 90], [20, -20, 20, 80], [55, -5, 16, 62], [90, 5, 13, 50], [-40, 10, 14, 45]].map(([dx, dy, w, h], i) => {
      const fl = 0.75 + 0.35 * hash(f + i * 13);
      const wob = (hash(f * 2 + i) - 0.5) * w * 1.4;
      const px = x + dx * s;
      const py = y + dy * s;
      return (
        <g key={i}>
          <path d={tongue(px, py, w * s, h * s * fl, wob * s)} fill="#ff6a1a" opacity={0.92} />
          <path d={tongue(px, py, w * s * 0.55, h * s * fl * 0.6, wob * s * 0.6)} fill="#ffe36b" />
        </g>
      );
    })}
  </g>
);

// cartoon anger mark: four red curved ticks around a point

// ---------- video ----------
export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const m = mosquitoAt(t);

  // lamp: on/off with a 2-frame fade and a short warm flash when it comes on
  const on = Math.max(
    ramp(t, T_ON1, T_ON1 + 0.07) * (1 - ramp(t, T_OFF1, T_OFF1 + 0.07)),
    ramp(t, T_ON2, T_ON2 + 0.07) * (1 - ramp(t, T_OFF2, T_OFF2 + 0.07)),
    ramp(t, T_ON3, T_ON3 + 0.07) * (1 - ramp(t, T_SLEEP, T_SLEEP + 0.07)),
  );
  const flash = [T_ON1, T_ON2, T_ON3].reduce((acc, a) => acc + (t >= a ? Math.exp(-(t - a) * 9) : 0), 0);
  const breathing = t >= T_FIRE && t < T_SCREAM;
  const fireGlow = (breathing ? 1 : m.burning) * (0.75 + 0.25 * hash(Math.floor(f / 2)));

  // camera: wide push, then the pillow close-up; punch in on the rage and the chilli eating
  const clickShake = [T_ON1, T_OFF1, T_ON2, T_OFF2, T_ON3, T_SLEEP].reduce((acc, a) => acc + (t >= a && t < a + 0.2 ? 1 - (t - a) / 0.2 : 0), 0) + (breathing ? 0.8 : 0) + (t >= T_RAGE && t < T_RAGE + 0.5 ? 1.5 * (1 - (t - T_RAGE) / 0.5) : 0) + (t >= T_LAUGH && t < T_SLEEP ? 0.35 : 0);
  // [t, cx, cy, zoom] framing keys, eased in between
  const camKeys = [
    [T_CLOSE, 265, 800, 2.1], [T_RAGE - 0.05, 265, 800, 2.14], [T_RAGE + 0.3, 300, 770, 2.6], [T_CHILI, 300, 772, 2.7],
    [T_CHILI + 0.6, 300, 790, 2.4], [T_OFF2, 300, 790, 2.45], [T_OFF2 + 0.8, 265, 800, 2.1], [T_SUCK, 260, 800, 2.12],
    [T_HOT, 230, 770, 2.8], [T_HOT + 1.0, 255, 745, 2.25], [T_OUT, 275, 745, 2.2], [T_LAUGH, 295, 790, 2.35], [T_SLEEP + 2, 290, 790, 2.5],
  ];
  const camAt = (): number[] => {
    if (t <= camKeys[0][0]) return camKeys[0].slice(1);
    for (let i = 1; i < camKeys.length; i++) {
      if (t <= camKeys[i][0]) {
        const k = smooth((t - camKeys[i - 1][0]) / (camKeys[i][0] - camKeys[i - 1][0]));
        return [1, 2, 3].map((j) => lerp(camKeys[i - 1][j], camKeys[i][j], k));
      }
    }
    return camKeys[camKeys.length - 1].slice(1);
  };
  const [ccx, ccy, cz] = camAt();
  let cam = { cx: ccx, cy: ccy, z: cz };
  if (t < T_CLOSE) cam = { cx: lerp(540, 470, t / T_CLOSE), cy: lerp(960, 900, t / T_CLOSE), z: 1 + 0.12 * (t / T_CLOSE) };
  const shx = Math.sin(f * 41) * 4 * clickShake;
  const shy = Math.cos(f * 37) * 3 * clickShake;
  const camT = `translate(${W / 2 - cam.cx * cam.z + shx} ${H / 2 - cam.cy * cam.z + shy}) scale(${cam.z})`;
  const blur = t < T_CLOSE ? 0 : 1.4;

  // husband
  const rage = t >= T_RAGE && t < T_CHILI;
  const eating = t >= T_CHILI && t < T_OFF2 - 0.3;
  const chew = eating && t > BITES[0] - 0.1 ? Math.abs(Math.sin(t * 11)) : 0;
  const red = ramp(t, BITES[0] + 0.1, BITES[3] + 0.3) * (1 - 0.25 * ramp(t, T_OFF2, T_OFF2 + 1)) * (1 - ramp(t, T_LAND, T_LAUGH + 0.4));
  const laughing = t >= T_LAUGH && t < T_SLEEP;
  let p: FaceP = faceAt(t, [[0, "sleep"], [T_WAKE, "glare"], [T_RAGE, "angry"], [T_CHILI, "glare"], [T_OFF2 - 0.3, "scheme"], [T_OFF2 + 0.3, "sleep"], [T_FIRE - 0.4, "grin"], [T_SLEEP, "sleep"]], 0.1);
  if (t < T_WAKE) p = { ...p, mouth: "oh", open: 0.15 + 0.25 * Math.max(0, Math.sin(t * 3)) };
  else if (t < T_RAGE) {
    let px = clamp01((m.x - FACE.x) / 300 + 0.5) * 2 - 1;
    let py = clamp01((m.y - FACE.y) / 300 + 0.5) * 2 - 1;
    if (m.hidden) {
      px = Math.sin(t * 6) > 0 ? 0.85 : -0.85;
      py = 0;
    }
    p = { ...p, px, py, tilt: t > T_ON2 ? 1 : 0.8 };
  } else if (rage) p = { ...p, mouth: "shout", open: 0.6 + 0.3 * Math.sin(t * 18), eyeScale: 1.1 };
  else if (eating) p = { ...p, eyeOpen: 0.35, tilt: -0.5, mouth: "frown", px: 0, py: 0.4 };
  else if (t >= T_OFF2 + 0.3 && t < T_FIRE - 0.4) p = { ...p, mouth: "smirk" };
  else if (laughing) {
    // belly laugh: eyes squeezed, brows up, mouth pumping open, head bobbing
    const ha = Math.abs(Math.sin((t - T_LAUGH) * 13));
    p = { ...p, eyeOpen: 0, brow: 0.9, tilt: -0.3, px: 0, py: 0, mouth: "shout", open: 0.3 + 0.6 * ha };
  } else if (t >= T_FIRE - 0.4 && t < T_LAUGH) {
    const px = clamp01((m.x - FACE.x) / 300 + 0.5) * 2 - 1;
    const py = clamp01((m.y - FACE.y) / 300 + 0.5) * 2 - 1;
    p = { ...p, px, py };
  } else if (t >= T_SLEEP) p = { ...p, mouth: "smile" };
  const blood = t >= T_WAKE && t < T_LAUGH ? clamp01((t - T_WAKE) / 0.15) * (1 - ramp(t, T_IGNITE - 0.3, T_IGNITE + 0.3)) : 0; // bloodshot until the mosquito catches fire
  const shake = rage ? Math.sin(f * 2.3) * 5 : 0;
  const fx = FACE.x + shake;
  const fy = FACE.y - (laughing ? Math.abs(Math.sin((t - T_LAUGH) * 6.5)) * 10 : 0);

  // hands: lamp switch (left), chillies (right)
  const reach = Math.max(
    ramp(t, T_ON1 - 0.4, T_ON1) * (1 - ramp(t, T_OFF1 + 0.15, T_OFF1 + 0.6)),
    ramp(t, T_ON2 - 0.4, T_ON2) * (1 - ramp(t, T_ON2 + 0.2, T_ON2 + 0.65)),
    ramp(t, T_OFF2 - 0.4, T_OFF2) * (1 - ramp(t, T_OFF2 + 0.15, T_OFF2 + 0.6)),
    ramp(t, T_ON3 - 0.4, T_ON3) * (1 - ramp(t, T_ON3 + 0.2, T_ON3 + 0.6)),
    ramp(t, T_SLEEP - 0.4, T_SLEEP) * (1 - ramp(t, T_SLEEP + 0.15, T_SLEEP + 0.6)),
  );
  const hand = [lerp(225, LAMP_HAND[0], reach), lerp(930, LAMP_HAND[1], reach)];
  const lift = ramp(t, T_CHILI, T_CHILI + 0.45) * (1 - ramp(t, BITES[3] + 0.2, BITES[3] + 0.7));
  const bite = (b: number) => (t > b && t < b + 0.2 ? Math.sin(((t - b) / 0.2) * Math.PI) : 0);
  const chiliHand = [lerp(440, 352, lift) - BITES.reduce((a, b) => a + bite(b) * 14, 0), lerp(980, 838, lift)];
  const left = BITES.filter((b) => t < b).length; // chillies still in the hand

  const dark = 1 - on;
  const charFilter = `brightness(${lerp(1, 0.55, dark) + flash * 0.15 + fireGlow * 0.3}) saturate(${lerp(1, 0.8, dark)})`;

  const mq = (
    <g>
      {m.streak > 0 && <path d={`M${m.x},${m.y} L${m.x + 160},${m.y + 50}`} stroke="rgba(255,255,255,0.5)" strokeWidth={10} strokeLinecap="round" />}
      {!m.hidden && (
        <g style={{ filter: "drop-shadow(0 0 2px rgba(200,215,255,0.7))" }}>
          <Mosquito x={m.x} y={m.y} s={m.s} f={f} flip={m.flip} mood={m.mood} legs={m.legs} flap={m.flap} tilt={m.tilt} tremble={m.tremble} belly={m.belly} heat={m.heat} char={m.char} id="m" />
        </g>
      )}
      {m.burning > 0 && <BodyFlames x={m.x} y={m.y + 12} s={m.s * 1.7} f={f} />}
      {breathing && <FireBreath x={m.x + 62 * m.s} y={m.y + 12 * m.s} dir={1} len={lerp(60, 330, ramp(t, T_FIRE, T_FIRE + 0.2))} f={f} />}
    </g>
  );

  return (
    <AbsoluteFill style={{ background: "#0b1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <defs>
          <filter id="bgblur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
          <clipPath id="shade"><path d={SHADE} /></clipPath>
          <clipPath id="blanket"><path d={BLANKET} /></clipPath>
          <clipPath id="facedisc"><circle cx={fx} cy={fy} r={FACE.r * 0.97} /></clipPath>
          <radialGradient id="warm">
            <stop offset="0" stopColor="#ffb04a" stopOpacity={0.85} />
            <stop offset="1" stopColor="#ffb04a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={camT}>
          <Backdrop on={on} blur={blur} />
          <g style={{ filter: charFilter }}>
            <Face x={fx} y={fy} r={FACE.r} hair="husband" p={p} talk={chew} tilt={-6} id="hz" blood={blood} happyEyes={laughing} />
            {/* tears while the chillies burn */}
            {red > 0.3 && t < T_OFF2 &&
              [-1, 1].map((s) => (
                <g key={s}>
                  <path d={`M${fx + s * 41},${FACE.y + 10} Q${fx + s * 46},${FACE.y + 50} ${fx + s * 44},${FACE.y + 95}`} stroke="#8fd3ff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
                  <circle cx={fx + s * 46} cy={FACE.y + 30 + ((t * 120 + s * 20) % 70)} r={5} fill="#bfe6ff" />
                </g>
              ))}
          </g>
          {/* chilli flush: plain (not darkened) red over the face so it reads as glowing red even with the lamp off */}
          {red > 0 && <circle cx={fx} cy={fy} r={FACE.r} fill="#ff3b2b" opacity={red * 0.42} clipPath="url(#facedisc)" />}
          {red > 0 && <g style={{ filter: charFilter }} transform={`translate(${fx} ${fy}) rotate(-6)`}><HusbandHair r={FACE.r} /></g>}
          <g clipPath="url(#blanket)"><Backdrop on={on} blur={blur} /></g>
          <g style={{ filter: charFilter }}>
            {reach > 0.01 && (
              <g>
                <Arm w={ARM_W} pts={[[235, 935], [lerp(232, 175, reach), lerp(925, 860, reach)], hand]} />
                <Hand x={hand[0]} y={hand[1]} r={HAND_R} flip={-1} />
              </g>
            )}
            {lift > 0.01 && (
              <g>
                {Array.from({ length: left }, (_, i) => (
                  <Chili key={i} x={chiliHand[0] - 4} y={chiliHand[1] - 8} rot={200 + (i - (left - 1) / 2) * 16} s={1.3} />
                ))}
                <Arm w={ARM_W} pts={[[440, 960], [lerp(445, 410, lift), lerp(950, 880, lift)], chiliHand]} />
                <Hand x={chiliHand[0]} y={chiliHand[1]} r={HAND_R} />
              </g>
            )}
            {mq}
          </g>
          {/* the shade drawn again over the mosquito, so it can hide behind it */}
          <g clipPath="url(#shade)"><Backdrop on={on} blur={blur} /></g>
          {(t < T_WAKE || t > T_SLEEP + 0.4) && <Zzz t={t} x={FACE.x + 40} y={FACE.y - 40} />}
          {rage && <AngerMark x={fx + 62} y={FACE.y - 70} s={1 + 0.15 * Math.sin(t * 20)} />}
          {(rage || (red > 0.6 && t < T_OFF2 + 0.6)) && <Puffs t={t} x={fx} y={FACE.y - FACE.r - 10} k={rage ? 1 : (red - 0.6) * 2.5} />}
          {t > T_OUT && <Puffs t={t} x={m.x} y={m.y - 10} k={1 - ramp(t, T_LAND + 0.4, 20)} color="#6a6670" size={0.5} />}
          {flash > 0.02 && <circle cx={90} cy={660} r={420} fill="url(#warm)" opacity={flash * 0.6} />}
          {fireGlow > 0 && (
            <g style={{ mixBlendMode: "screen" }}>
              <circle cx={m.x + (breathing ? 140 : 0)} cy={m.y} r={breathing ? 360 : 260} fill="url(#warm)" opacity={fireGlow * 0.55} />
            </g>
          )}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,8,25,0.5) 100%)", pointerEvents: "none" }} />

      <Audio src={staticFile("mosquito-gag/crickets.wav")} volume={0.35} />
      <Audio src={staticFile("mosquito-gag/buzz.wav")} volume={(fr) => buzzVol(fr / FPS)} />
      {[[0.3, 0.55], [2.2, 0.55], [T_OFF2 + 0.7, 0.4], [T_SLEEP + 0.6, 0.5]].map(([a, v]) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/snore.wav")} volume={v} /></Sequence>
      ))}
      {[T_ON1, T_OFF1, T_ON2, T_OFF2, T_ON3, T_SLEEP].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/click.wav")} volume={0.8} /></Sequence>
      ))}
      {[T_ON1, T_ON2, T_DIVE].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/whoosh.wav")} volume={0.5} /></Sequence>
      ))}
      <Sequence from={Math.round(T_RAGE * FPS)}><Audio src={staticFile("mosquito-gag/hiss.wav")} volume={0.35} /></Sequence>
      {BITES.map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/crunch.wav")} volume={0.8} /></Sequence>
      ))}
      <Sequence from={Math.round((BITES[3] + 0.3) * FPS)}><Audio src={staticFile("mosquito-gag/hiss.wav")} volume={0.25} /></Sequence>
      {[T_SUCK + 0.5, T_SUCK + 1.0, T_SUCK + 1.5].map((a) => (
        <Sequence key={a} from={Math.round(a * FPS)}><Audio src={staticFile("mosquito-gag/gulp.wav")} volume={0.7} /></Sequence>
      ))}
      <Sequence from={Math.round(T_HOT * FPS)}><Audio src={staticFile("mosquito-gag/kettle.wav")} volume={0.6} /></Sequence>
      <Sequence from={Math.round(T_FIRE * FPS)}><Audio src={staticFile("mosquito-gag/roar.wav")} volume={0.85} /></Sequence>
      <Sequence from={Math.round(T_SCREAM * FPS)}><Audio src={staticFile("mosquito-gag/scream.wav")} volume={0.7} /></Sequence>
      <Sequence from={Math.round(T_IGNITE * FPS)}><Audio src={staticFile("mosquito-gag/roar.wav")} volume={0.5} /></Sequence>
      <Sequence from={Math.round((T_IGNITE + 0.2) * FPS)} durationInFrames={Math.round((T_OUT - T_IGNITE) * FPS)}>
        <Audio src={staticFile("mosquito-gag/crackle.wav")} volume={0.7} loop />
      </Sequence>
      <Sequence from={Math.round(T_OUT * FPS)}><Audio src={staticFile("mosquito-gag/poof.wav")} volume={0.6} /></Sequence>
      <Sequence from={Math.round(T_LAND * FPS)}><Audio src={staticFile("mosquito-gag/thud.wav")} volume={0.7} /></Sequence>
      <Sequence from={Math.round(T_LAUGH * FPS)}><Audio src={staticFile("mosquito-gag/haha.wav")} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};

// design sheet: moods, leg poses and states side by side, for checking the mosquito drawing
export const MosquitoSheet: React.FC = () => {
  const f = useCurrentFrame();
  const cells: [keyof typeof MOODS, LegPose, number, number, number, number, boolean][] = [
    ["beg", "sing", 1, 0, 0, 0, true], ["beg", "pray", 1, 0, 0, 0, false], ["dizzy", "dangle", 0.6, 0, 0, 0, false],
    ["laugh", "dangle", 1, 1, 0, 0, false], ["burn", "dangle", 1, 1, 1, 0, false], ["flat", "stiff", 0, 0.5, 0, 1, false],
  ];
  return (
    <AbsoluteFill style={{ background: "#39405e" }}>
      <svg width={W} height={H}>
        {cells.map(([mood, legs, flap, belly, heat, char, mic], i) => (
          <Mosquito key={i} x={330 + (i % 2) * 470} y={300 + Math.floor(i / 2) * 600} s={1.45} f={f} mood={MOODS[mood]} legs={legs} flap={flap} flip={i % 2 ? -1 : 1} belly={belly} heat={heat} char={char} mic={mic} id={`s${i}`} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
