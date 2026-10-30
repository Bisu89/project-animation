import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP02 from "./ep02.json";
import { Bench, GROUND_Y, H, SEAT_Y, W } from "./Park";
import { Beach } from "./Beach";
import { Emo, INK, Look, Pose, Pt, R, SEATED, STANDING, Stick } from "./Stick";
import { backOut, Captions, clamp01, FONT, FPS, Hook, keys, keysPt, LaughTag, Line, makeWords } from "./common";

// Stick couple, ep02 "Per Leg" (9:16). Beats are in content/stick-couple/README.md; cut times come from the voice
// timings in ep02.json (`python scripts/gen_gag_voice.py ep02 stick-couple`). Set on the seaside boardwalk (Beach.tsx).
const ep = EP02 as unknown as { hook: string; lines: Line[] };
const [L0, L1, L2, L3] = ep.lines;
const WORDS = makeWords(ep.lines);

// ---------- timeline ----------
const T_LICK = 1.0; // she stops licking the ice cream
const T_PANIC = L0.end + 0.06; // music stops, his close-up + thought bubble
const T_MELT = L1.end + 0.15; // wide: she scoots closer, hearts
const T_TWO = L3.start - 0.5; // two-shot for "...per leg."
const T_FREEZE = L3.end + 0.1; // her close-up: shock -> red face, the scoop falls
const T_DROP = T_FREEZE + 0.45;
const T_EXIT = T_FREEZE + 2.1; // wide: he slides away, stands, walks off
const T_STAND = T_EXIT + 0.5;
const T_WALK = T_STAND + 0.35;
const T_LAUGH = T_WALK + 1.0;
const T_END = T_LAUGH + 2.5;
export const DURATION = Math.ceil(T_END * FPS);

const HIP = SEAT_Y - 4;
const STAND_HIP = GROUND_Y - 4 - STANDING.feet[1][1];
const CONE_HAND: Pt = [95, -170]; // her near hand while holding the cone
const G = 3200; // scoop fall, px/s^2
const FALL_TO = GROUND_Y - (HIP + CONE_HAND[1]) - 14; // scoop centre on the ground, in hand-local px
const SCOOP_Y = -62;
const T_LAND = T_DROP + Math.sqrt((2 * (FALL_TO - SCOOP_Y)) / G);

const talkOf = (who: Line["who"], t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};

// ---------- props ----------
const IceCream: React.FC<{ t: number }> = ({ t }) => {
  const falling = t >= T_DROP;
  const landed = t >= T_LAND;
  const dt = t - T_DROP;
  const sy = landed ? FALL_TO : falling ? SCOOP_Y + 0.5 * G * dt * dt : SCOOP_Y;
  const spin = falling && !landed ? dt * 400 : 0;
  return (
    <g>
      <path d="M-26,-38 L26,-38 L0,48 Z" fill="#e8b46a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-17,-38 L8,20 M0,-38 L16,-6 M17,-38 L-8,20 M0,-38 L-16,-6" stroke="#b9823f" strokeWidth={3} />
      {landed ? (
        <g transform={`translate(0 ${FALL_TO + 18})`}>
          <ellipse rx={50 + clamp01((t - T_LAND) / 0.15) * 8} ry={14} fill="#ff9ec4" stroke={INK} strokeWidth={5} />
          <circle cx={-62} cy={-8} r={7} fill="#ff9ec4" stroke={INK} strokeWidth={3} />
          <circle cx={60} cy={-12} r={6} fill="#ff9ec4" stroke={INK} strokeWidth={3} />
        </g>
      ) : (
        <g transform={`translate(0 ${sy}) rotate(${spin})`}>
          <path d="M-34,8 A34,34 0 1 1 34,8 Q26,22 18,12 Q10,30 0,14 Q-12,26 -18,12 Q-26,22 -34,8 Z" fill="#ff9ec4" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-18,-18 Q-8,-28 6,-26" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
          {[
            [-12, -4, "#5cc8ff", 20],
            [10, -14, "#ffe14d", -30],
            [16, 2, "#7be07b", 60],
            [-4, -22, "#ff6f61", 10],
          ].map(([x, y, c, a], i) => (
            <rect key={i} x={(x as number) - 5} y={(y as number) - 2} width={10} height={4} rx={2} fill={c as string} transform={`rotate(${a} ${x} ${y})`} />
          ))}
        </g>
      )}
    </g>
  );
};

const Hearts: React.FC<{ t: number; from: number }> = ({ t, from }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = ((t - from) * 0.6 + i / 3) % 1;
      return (
        <path
          key={i}
          transform={`translate(${-R * 0.6 + i * 70 + Math.sin(ph * 7 + i) * 14} ${-R * 1.25 - ph * 140}) scale(${0.6 + ph * 0.5})`}
          d="M0,10 C-30,-14 -14,-36 0,-20 C14,-36 30,-14 0,10 Z"
          fill="#ff6f91"
          stroke={INK}
          strokeWidth={4}
          opacity={Math.sin(Math.PI * ph)}
        />
      );
    })}
  </g>
);

// anger: steam puffs off the top of the head + a throbbing vein mark
const Steam: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g opacity={k}>
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 1.5 + i / 4) % 1;
      const side = i % 2 ? 1 : -1;
      return <circle key={i} cx={side * (R * 0.55 + ph * 60)} cy={-R * 0.95 - ph * 150} r={16 + ph * 26} fill="#fff" stroke="#c8c8d0" strokeWidth={4} opacity={1 - ph} />;
    })}
    <g transform={`translate(${-R * 0.5} ${-R * 0.45}) scale(${1 + Math.sin(t * 14) * 0.1})`} stroke="#d0202a" strokeWidth={7} strokeLinecap="round" fill="none">
      {[0, 90, 180, 270].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M5,-17 Q4,-6 17,-5" />
      ))}
    </g>
  </g>
);

const Bubble: React.FC<{ t: number }> = ({ t }) => {
  const k = t - T_PANIC;
  if (k < 0.15) return null;
  const nums = [
    ["60?", 0.25, 0.55],
    ["55?", 0.62, 0.92],
    ["50?", 0.99, 1.29],
  ] as const;
  const final = t >= L1.start - 0.1;
  const cur = final ? null : nums.filter(([, at]) => k >= at).pop();
  const pop = (at: number) => backOut((k - at) / 0.2);
  const [bx, by] = [560, 540];
  return (
    <g transform={`translate(${bx} ${by}) scale(${backOut((k - 0.15) / 0.25)})`}>
      {[
        [-92, 175, 14],
        [-70, 140, 22],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth={6} />
      ))}
      <path d="M-120,40 Q-150,-20 -100,-60 Q-90,-120 -20,-112 Q30,-150 80,-110 Q150,-110 140,-40 Q180,20 120,70 Q100,120 30,100 Q-30,130 -70,95 Q-140,100 -120,40 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {cur && (
        <g transform={`scale(${pop(cur[1])})`}>
          <text y={30} textAnchor="middle" fontFamily={FONT} fontSize={96} fill={INK}>
            {cur[0]}
          </text>
          {k >= cur[2] && <path d={`M-80,${-30 + 0} L80,40 M80,-30 L-80,40`} stroke="#e0202a" strokeWidth={14} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={200 * (1 - clamp01((k - cur[2]) / 0.08))} />}
        </g>
      )}
      {final && (
        <g transform={`scale(${pop(L1.start - 0.1 - T_PANIC)})`}>
          <text y={30} textAnchor="middle" fontFamily={FONT} fontSize={96} fill="#2a9d55">
            45?
          </text>
        </g>
      )}
    </g>
  );
};

// ---------- the couple ----------
const Couple: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  // --- girl ---
  const girlX = keys(t, [
    [T_MELT, 735],
    [T_MELT + 0.35, 655],
  ]);
  const angry = t >= T_FREEZE + 0.35;
  const red = keys(t, [
    [T_FREEZE + 0.35, 0],
    [T_FREEZE + 1.2, 1],
  ]);
  const girlEmo: Emo = t >= T_FREEZE ? (angry ? "angry" : "shock") : "happy";
  const lick = t < T_LICK ? Math.abs(Math.sin(t * Math.PI * 2.2)) : 0;
  const girlPose: Pose = {
    near: t < T_LICK ? [lerp2(72, 92, lick), lerp2(-238, -200, lick)] : keysPt(t, [[T_LICK, [72, -230]], [T_LICK + 0.3, CONE_HAND]]),
    far: t >= T_MELT && t < T_FREEZE ? [62, -150] : [40, -25],
    ...SEATED,
    lean: t >= T_MELT && t < T_FREEZE ? keys(t, [[T_MELT, 0], [T_MELT + 0.35, 10]]) : 0,
    tilt: t >= T_MELT && t < T_FREEZE ? keys(t, [[T_MELT, 0], [T_MELT + 0.35, -12]]) : t < T_LICK ? 4 : -4,
    bob: angry ? Math.sin(t * 40) * 2 : Math.sin(t * 2.2 + 1) * 2,
  };
  const girlLook: Look = {
    emo: girlEmo,
    talk: Math.max(talkOf("girl", t, f), t < T_LICK ? 0.25 * lick : 0),
    blink: f % 113 > 109 && t < T_FREEZE,
    gaze: t < T_LICK ? [0.2, 0.7] : [0.8, 0],
    blush: t >= T_MELT && t < T_FREEZE ? 1 : 0,
    red,
    t,
  };
  const girlHead = (
    <g>
      {t >= T_MELT && t < T_FREEZE && <Hearts t={t} from={T_MELT} />}
      {red > 0 && <Steam t={t} k={red} />}
    </g>
  );

  // --- boy ---
  const panic = t >= T_PANIC && t < T_MELT;
  const leaving = t >= T_EXIT;
  const boyEmo: Emo = panic ? "nervous" : leaving ? "nervous" : t >= T_MELT ? "happy" : "neutral";
  const dart = panic && t < L1.start ? (Math.sin(t * 9) > 0 ? 1 : -0.9) : 0;
  const slide = keys(t, [
    [T_EXIT + 0.1, 345],
    [T_STAND, 230],
  ]);
  const stand = clamp01((t - T_STAND) / 0.3);
  const walking = t >= T_WALK;
  const wt = t - T_WALK;
  const boyX = walking ? 230 - wt * 520 : slide;
  const ph = wt * 11;
  const stepFeet: [Pt, Pt] = [
    [-22 + Math.sin(ph) * 45, STANDING.feet[0][1] - Math.max(0, Math.cos(ph)) * 22],
    [26 - Math.sin(ph) * 45, STANDING.feet[1][1] - Math.max(0, -Math.cos(ph)) * 22],
  ];
  const seatFeet = SEATED.feet;
  const feet: [Pt, Pt] = walking
    ? stepFeet
    : [
        [seatFeet[0][0] + (STANDING.feet[0][0] - seatFeet[0][0]) * stand, seatFeet[0][1] + (STANDING.feet[0][1] - seatFeet[0][1]) * stand],
        [seatFeet[1][0] + (STANDING.feet[1][0] - seatFeet[1][0]) * stand, seatFeet[1][1] + (STANDING.feet[1][1] - seatFeet[1][1]) * stand],
      ];
  const boyHip = HIP + (STAND_HIP - HIP) * stand;
  const swing = walking ? Math.sin(ph) * 40 : 0;
  const boyPose: Pose = {
    near: walking ? [30 + swing, -20] : t >= L3.start - 0.2 && t < T_FREEZE ? [125, -120] : [70, -25],
    far: walking ? [20 - swing, -20] : [45, -25],
    feet,
    lean: walking ? 10 : panic ? -3 : 0,
    tilt: t >= T_MELT && t < T_FREEZE ? 4 : 0,
    bob: walking ? Math.abs(Math.cos(ph)) * -6 : Math.sin(t * 2.2) * 2,
    palm: t >= L3.start - 0.2 && t < T_FREEZE,
  };
  const boyLook: Look = {
    emo: boyEmo,
    talk: talkOf("boy", t, f),
    blink: f % 97 > 93 && !panic,
    gaze: dart !== 0 ? [dart, 0] : leaving ? [-0.6, 0] : [0.8, 0],
    sweat: panic || leaving ? 1 : 0,
    t,
  };
  const boyDir = t >= T_STAND + 0.15 ? -1 : 1;

  return (
    <g>
      <Stick x={girlX} hip={HIP} dir={-1} hair="bob" girl pose={girlPose} look={girlLook} held={<g transform="translate(0 -6)"><IceCream t={t} /></g>} headExtras={girlHead} />
      <Stick x={boyX} hip={boyHip} dir={boyDir} hair="spiky" pose={boyPose} look={boyLook} />
      {panic && <Bubble t={t} />}
    </g>
  );
};
const lerp2 = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- camera ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  const punch = (from: number, amp: number) => amp * Math.exp(-(t - from) * 9);
  if (t < T_PANIC) return { cx: 540, cy: 1010, z: 1.12 + t * 0.006 };
  if (t < T_MELT) return { cx: 420, cy: 800, z: 1.55 + punch(T_PANIC, 0.25) + (t - T_PANIC) * 0.03 };
  if (t < T_TWO) return { cx: 540, cy: 1010, z: 1.12 };
  if (t < T_FREEZE) return { cx: 470, cy: 930, z: 1.35 + (t - T_TWO) * 0.03 };
  if (t < T_EXIT) return { cx: 620, cy: 960, z: 1.7 + punch(T_FREEZE, 0.2) + clamp01((t - T_FREEZE) / 2) * 0.2 };
  return { cx: 540, cy: 1010, z: 1.12 };
};

// ---------- video ----------
export const Ep02: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const S = (at: number, src: string, volume = 1, dur?: number) => (
    <Sequence from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined}>
      <Audio src={staticFile(`stick-couple/ep02/${src}`)} volume={volume} />
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t >= T_LAUGH ? (
        <LaughTag t={t - T_LAUGH} f={f} />
      ) : (
        <AbsoluteFill style={{ background: "#f3d9a4" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
            <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
              <Beach t={t} />
              <Bench />
              <Couple t={t} f={f} />
            </g>
          </svg>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(30,40,60,0.18) 100%)" }} />
        </AbsoluteFill>
      )}
      {t < T_LAUGH && <Hook t={t} text={ep.hook} />}
      {t < T_LAUGH && <Captions t={t} words={WORDS} />}
      {S(0, "music.wav", 0.18, T_PANIC)}
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`))}
      {S(T_PANIC, "scratch.wav", 0.5)}
      {S(T_PANIC + 0.2, "ticking.wav", 0.5)}
      {S(L1.start - 0.4, "gulp.wav", 0.7)}
      {S(L2.start, "ding.wav", 0.4)}
      {S(L2.start, "music.wav", 0.15, T_FREEZE - L2.start)}
      {S(T_FREEZE, "freeze.wav", 0.5)}
      {S(T_FREEZE + 0.5, "steam.wav", 0.35)}
      {S(T_LAND, "plop.wav", 0.7)}
      {S(T_WALK, "whoosh.wav", 0.35)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
