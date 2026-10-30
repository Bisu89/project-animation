import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP04 from "./ep04.json";
import { H, SEAT_Y, W } from "./Park";
import { Bucket, BUCKET, Cinema, Kernel, Seats, SHUSHER } from "./Cinema";
import { Emo, INK, Look, Pose, Pt, R, SEATED, Stick } from "./Stick";
import { backOut, Captions, clamp01, FONT, FPS, Hook, LaughTag, Line, makeWords } from "./common";

// Stick couple, ep04 "Just Hold My Hand" (9:16). Beats are in content/stick-couple/README.md; cut times come from the
// voice timings in ep04.json (`python scripts/gen_gag_voice.py ep04 stick-couple`). Set in a cinema (Cinema.tsx); the
// horror film on the screen is its own full-frame shot (MovieShot).
const ep = EP04 as unknown as { hook: string; lines: Line[] };
const [, L1, L2, L3, L4] = ep.lines;
const WORDS = makeWords(ep.lines);

// ---------- timeline ----------
const T_SCARY = L1.end + 0.3; // the film: dark corridor, a door creaks open
const T_TENSE = T_SCARY + 1.5; // two-shot: he is terrified, she is bored
const T_BOO = T_TENSE + 1.2; // the film: ghost jump-scare
const T_JUMP = T_BOO + 0.5; // wide: he is in her lap, popcorn raining down
const T_LAUNCH = T_BOO + 0.05; // popcorn leaves the bucket
const T_CATCH = T_JUMP + 1.3; // a kernel lands in her mouth
const T_LAUGH = L4.end + 0.7;
const T_END = T_LAUGH + 2.5;
export const DURATION = Math.ceil(T_END * FPS);

const HIP = SEAT_Y - 4;
const BOY_X = 380;
const GIRL_X = 700;
const LAP: Pt = [605, 1172]; // where he lands: sitting on her thighs, facing her
const MOUTH: Pt = [660, 905]; // her mouth (world) while she looks up
const G = 1500;

const talkOf = (who: Line["who"], t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};
const hash = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
// kernel 0 is aimed at her mouth; the rest scatter
const KERNELS = Array.from({ length: 22 }, (_, i) => {
  const dt = T_CATCH - T_LAUNCH;
  if (i === 0) return { vx: (MOUTH[0] - BUCKET[0]) / dt, vy: (MOUTH[1] - (BUCKET[1] - 130) - 0.5 * G * dt * dt) / dt, spin: 300 };
  return { vx: (hash(i) - 0.5) * 700, vy: -900 - hash(i + 40) * 500, spin: (hash(i + 80) - 0.5) * 900 };
});

// ---------- the film on the screen ----------
const MovieShot: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const boo = t >= T_BOO;
  const k = t - T_SCARY;
  const open = clamp01((k - 0.3) / 1.1);
  const push = 1 + k * 0.05;
  const b = t - T_BOO;
  const shake = boo ? Math.exp(-b * 6) * 24 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <g transform={`translate(${Math.sin(f * 3) * shake} ${Math.cos(f * 2.3) * shake})`}>
          {!boo ? (
            <g transform={`translate(540 960) scale(${push}) translate(-540 -960)`}>
              {/* corridor in one-point perspective */}
              <rect x={0} y={480} width={W} height={960} fill="#0f1a17" />
              <path d="M0,480 L420,830 L420,1110 L0,1440 Z" fill="#1b2a25" />
              <path d="M1080,480 L660,830 L660,1110 L1080,1440 Z" fill="#17241f" />
              <path d="M0,480 L1080,480 L660,830 L420,830 Z" fill="#0b1210" />
              <path d="M0,1440 L1080,1440 L660,1110 L420,1110 Z" fill="#141f1b" />
              {[0.25, 0.5, 0.75].map((s, i) => (
                <path key={i} d={`M${420 * s},${480 + 350 * s} L${420 * s},${1440 - 330 * s}`} stroke="#0a110e" strokeWidth={6} />
              ))}
              {/* the door: dark panel swings open on a bright, cold gap */}
              <rect x={470} y={870} width={140} height={240} fill="#dfe9ff" />
              <rect x={470} y={870} width={140 * (1 - open * 0.55)} height={240} fill="#2a1d14" stroke="#000" strokeWidth={4} />
              <circle cx={470 + 140 * (1 - open * 0.55) - 16} cy={995} r={6} fill="#8a6a3a" />
              <path d={`M${610 - 140 * open * 0.55},1110 L${560 - open * 200},1440 L${700 + open * 60},1440 L610,1110 Z`} fill="#dfe9ff" opacity={0.25 * open} />
            </g>
          ) : (
            <g>
              <rect x={0} y={480} width={W} height={960} fill="#05080a" />
              <g transform={`translate(540 960) scale(${0.4 + backOut(b / 0.18) * 0.75})`}>
                {/* original cartoon ghost */}
                <path d="M-300,260 L-300,-60 Q-300,-380 0,-380 Q300,-380 300,-60 L300,260 L230,200 L160,260 L80,200 L0,260 L-80,200 L-160,260 L-230,200 Z" fill="#f4f6ff" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
                <ellipse cx={-110} cy={-120} rx={60} ry={80} fill="#0a0a12" />
                <ellipse cx={110} cy={-120} rx={60} ry={80} fill="#0a0a12" />
                <circle cx={-95} cy={-140} r={14} fill="#ff3b3b" />
                <circle cx={125} cy={-140} r={14} fill="#ff3b3b" />
                <ellipse cx={0} cy={90} rx={110} ry={130} fill="#0a0a12" />
              </g>
              <text x={540} y={1360} textAnchor="middle" fontFamily={FONT} fontSize={170} fill="#ff2a2a" stroke="#000" strokeWidth={10} paintOrder="stroke" transform={`rotate(-6 540 1360)`}>
                BOO!
              </text>
            </g>
          )}
          {/* letterbox, grain, scratches */}
          <rect x={0} y={0} width={W} height={480} fill="#000" />
          <rect x={0} y={1440} width={W} height={480} fill="#000" />
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={hash(i + f * 7) * W} y={480 + hash(i * 3 + f) * 960} width={3} height={3} fill="#fff" opacity={0.25} />
          ))}
          {hash(f) > 0.7 && <line x1={hash(f + 1) * W} y1={480} x2={hash(f + 1) * W + 6} y2={1440} stroke="#fff" strokeWidth={2} opacity={0.2} />}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: boo ? Math.exp(-b * 10) * 0.9 : 0 }} />
    </AbsoluteFill>
  );
};

// ---------- the couple ----------
const FrightHair: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[-60, -30, 0, 30, 60].map((a, i) => (
      <path key={i} transform={`rotate(${a + Math.sin(t * 50 + i) * 4})`} d={`M-14,${-R * 0.9} L0,${-R * 1.65} L14,${-R * 0.9} Z`} fill="#24242c" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    ))}
  </g>
);

const Scene: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const jumped = t >= T_JUMP;
  const tense = t >= T_TENSE && t < T_BOO;

  // --- girl: eats popcorn calmly the whole time ---
  const cycle = ((t + 0.6) % 2.4) / 2.4; // hand: bucket -> mouth -> bucket
  const toMouth = Math.sin(cycle * Math.PI) ** 2;
  const bucketL: Pt = [(BUCKET[0] - GIRL_X) * -1, BUCKET[1] - 130 - HIP];
  const eatHand: Pt = [bucketL[0] + (58 - bucketL[0]) * toMouth, bucketL[1] + (-296 - bucketL[1]) * toMouth];
  const pat = t >= L3.start - 0.2 && t < L3.end + 0.2;
  const hold = t >= L3.end + 0.2;
  let girlNear: Pt = eatHand;
  if (jumped) girlNear = pat ? [215, -420 + Math.abs(Math.sin(t * 9)) * 30] : hold ? [110, -150] : [120, -170];
  const girlPose: Pose = {
    near: girlNear,
    far: jumped ? [60, -120] : [40, -25],
    ...SEATED,
    lean: jumped ? -8 : 0, // she sits back so his head never hides her face
    tilt: jumped && t < T_CATCH + 0.3 ? -10 : 0,
    bob: Math.sin(t * 2.2 + 1) * 2,
  };
  const catching = jumped && t >= T_JUMP + 0.5 && t < T_CATCH;
  const chewing = (!jumped && toMouth > 0.85) || (t >= T_CATCH && t < T_CATCH + 0.8);
  const girlLook: Look = {
    emo: jumped ? "happy" : tense ? "tired" : "neutral",
    talk: Math.max(talkOf("girl", t, f), catching ? 0.6 : 0, chewing ? Math.abs(Math.sin(t * 10)) * 0.25 : 0),
    blink: f % 113 > 109,
    gaze: catching ? [0.3, -1] : pat || hold ? [0.7, 0.6] : [0.15, 0],
    t,
  };

  // --- boy ---
  const scream = t >= L2.start && t < L2.end + 0.2;
  const boyEmo: Emo = jumped ? (scream ? "shock" : "nervous") : tense ? "shock" : t < L1.start ? "happy" : "neutral";
  const nod = t >= L4.start - 0.6 && t < T_LAUGH ? Math.sin(t * 18) * 7 : 0;
  const tremble = jumped || tense ? Math.sin(f * 2.1) * 4 : 0;
  const boyPose: Pose = jumped
    ? {
        near: hold ? [40, -110] : [78, -196],
        far: hold ? [30, -100] : [62, -206],
        feet: [
          [-46, 172 + Math.sin(t * 7) * 6],
          [-14, 182 + Math.sin(t * 7 + 2) * 6],
        ],
        lean: -24,
        tilt: -6 + nod,
        bob: 0,
      }
    : {
        near: tense ? [160, -86] : t < L1.start ? [240, -292] : [70, -25],
        far: tense ? [55, -60] : [60, -25],
        ...SEATED,
        lean: t < L1.start ? -4 : tense ? -6 : 0,
        tilt: tense ? Math.sin(f * 2.3) * 2 : 0,
        bob: Math.sin(t * 2.2) * 2,
      };
  const boyLook: Look = {
    emo: boyEmo,
    talk: talkOf("boy", t, f),
    blink: f % 97 > 93 && !tense && !jumped,
    gaze: jumped ? [0.6, -0.4] : t < L1.start ? [0.8, 0] : [0.1, 0],
    sweat: tense || jumped ? 1 : 0,
    tears: jumped ? 0.5 : 0,
    t,
  };
  const boy = jumped ? (
    <Stick x={LAP[0] + tremble} hip={LAP[1]} dir={1} hair="spiky" pose={boyPose} look={boyLook} headExtras={t < L3.start ? <FrightHair t={t} /> : undefined} />
  ) : (
    <Stick x={BOY_X + tremble * 0.5} hip={HIP} dir={1} hair="spiky" pose={boyPose} look={boyLook} />
  );
  const girl = <Stick x={GIRL_X} hip={HIP} dir={-1} hair="bob" girl pose={girlPose} look={girlLook} held={!jumped && toMouth > 0.3 ? <Kernel x={0} y={-10} r={0} /> : undefined} />;

  // --- popcorn ---
  const dt = t - T_LAUNCH;
  const kernels =
    dt > 0
      ? KERNELS.map((k, i) => {
          if (i === 0 && t >= T_CATCH) return null;
          const x = BUCKET[0] + k.vx * dt;
          const y = BUCKET[1] - 130 + k.vy * dt + 0.5 * G * dt * dt;
          if (y > 1950) return null;
          return <Kernel key={i} x={x} y={y} r={k.spin * dt} />;
        })
      : null;

  // --- the shusher in the back row ---
  const shush = clamp01((t - (L4.start - 0.25)) / 0.2);

  return (
    <g>
      {shush > 0 && (
        <g>
          <circle cx={SHUSHER[0] - 34} cy={SHUSHER[1] + 30} r={14} fill="#0e0b16" stroke="#8fb6ff" strokeWidth={3} />
          <line x1={SHUSHER[0] - 34} y1={SHUSHER[1] + 30} x2={SHUSHER[0] - 34} y2={SHUSHER[1] - 8} stroke="#0e0b16" strokeWidth={10} strokeLinecap="round" />
          <g transform={`translate(${SHUSHER[0] - 90} ${SHUSHER[1] - 120}) scale(${backOut(shush)})`}>
            <path d="M-110,-50 Q-110,-90 -70,-90 L70,-90 Q110,-90 110,-50 L110,10 Q110,40 70,40 L20,40 L40,80 L-10,40 L-70,40 Q-110,40 -110,10 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            <text y={-6} textAnchor="middle" fontFamily={FONT} fontSize={64} fill={INK}>
              Shhh!
            </text>
          </g>
        </g>
      )}
      <Seats xs={[BOY_X, GIRL_X]} />
      {dt > 0 ? (
        <g transform={`translate(${-75} ${1425 - BUCKET[1]})`}>
          <Bucket fill={0.15} tip={-100} />
        </g>
      ) : (
        <Bucket fill={1} tip={0} />
      )}
      {jumped ? (
        <>
          {girl}
          {boy}
        </>
      ) : (
        <>
          {boy}
          {girl}
        </>
      )}
      {kernels}
    </g>
  );
};

// ---------- camera + light ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  if (t < T_TENSE) return { cx: 540, cy: 1000, z: 1.12 + t * 0.006 };
  if (t < T_BOO) return { cx: 540, cy: 930, z: 1.45 + (t - T_TENSE) * 0.1 };
  if (t >= L3.start - 0.3 && t < L3.end + 0.3) return { cx: 520, cy: 960, z: 1.3 };
  return { cx: 540, cy: 1000, z: 1.12 };
};

// ---------- video ----------
export const Ep04: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const onScreen = (t >= T_SCARY && t < T_TENSE) || (t >= T_BOO && t < T_JUMP);
  // the film's light on the audience: a cool flicker, darker while the corridor scene plays, a white flash on the scare
  const glow = 0.5 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.7) + (t >= T_TENSE && t < T_BOO ? -0.25 : 0);
  const flash = t >= T_JUMP ? Math.exp(-(t - T_JUMP) * 5) * 0.5 : 0;
  const S = (at: number, src: string, volume = 1, dur?: number) => (
    <Sequence from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined}>
      <Audio src={staticFile(`stick-couple/ep04/${src}`)} volume={volume} />
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t >= T_LAUGH ? (
        <LaughTag t={t - T_LAUGH} f={f} />
      ) : onScreen ? (
        <MovieShot t={t} f={f} />
      ) : (
        <AbsoluteFill style={{ background: "#1c1426" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
            <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
              <Cinema t={t} glow={glow} />
              <Scene t={t} f={f} />
            </g>
          </svg>
          <AbsoluteFill style={{ background: "#3d6bd6", opacity: 0.1 + 0.05 * glow, mixBlendMode: "multiply" }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(170,200,255,0.12) 30%, rgba(5,5,15,0.32) 100%)" }} />
          <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
        </AbsoluteFill>
      )}
      {t < T_LAUGH && <Hook t={t} text={ep.hook} />}
      {t < T_LAUGH && <Captions t={t} words={WORDS.filter((w) => w.w !== "Shhh!")} />}
      {S(0, "mystery.wav", 0.12, T_SCARY)}
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`, i === 4 ? 0.8 : 1))}
      {S(T_SCARY, "creepy.wav", 0.55, T_BOO - T_SCARY)}
      {S(T_BOO, "boo.wav", 0.7)}
      {S(T_LAUNCH + 0.4, "pops.wav", 0.5)}
      {S(T_CATCH, "gulp.wav", 0.5)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
