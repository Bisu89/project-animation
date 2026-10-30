import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP01 from "./ep01.json";
import { Bench, H, Park, PhoneBack, SEAT_Y, W } from "./Park";
import { Emo, INK, Look, Pose, Pt, R, SEATED, Stick } from "./Stick";
import { backOut, Captions, clamp01, FONT, FPS, Hook, keys, keysPt, LaughTag, Line, makeWords } from "./common";
export { FPS } from "./common";

// Stick couple, ep01 "Face Down" (9:16). Beats are in content/stick-couple/README.md; the cut times below are derived
// from the voice timings in ep01.json (written by `python scripts/gen_gag_voice.py ep01 stick-couple`).
// One world (Park.tsx, 1080x1920): close-ups are camera zooms; the phone screen is its own full-frame shot.
const ep = EP01 as unknown as { hook: string; lines: Line[] };
const [L0, L1, L2, L3] = ep.lines;
const WORDS = makeWords(ep.lines);

// ---------- timeline ----------
const T_FLIP = 0.62; // he notices her looking and flips the phone onto his knee
const T_SCRATCH = L0.end + 0.06; // music stops, punch-in on the boy
const T_GRAB = T_SCRATCH + 1.15; // back to wide: she snatches the phone
const T_PHONE = T_GRAB + 0.62; // phone screen shot
const T_GIRL = L1.start + 0.4; // her teary close-up
const T_BOY = L2.start - 0.1; // his tired close-up
const T_WIDE = L2.end + 0.25; // wide: "Now act surprised."
const T_FREEZE = L3.end + 0.08; // her frozen smile
const T_LAUGH = T_FREEZE + 1.35;
const T_END = T_LAUGH + 2.5;
export const DURATION = Math.ceil(T_END * FPS);

// ---------- the couple ----------
const BOY_X = 345;
const GIRL_X = 735;
const HIP = SEAT_Y - 4;
const KNEE_PHONE: Pt = [440, 1258]; // world spot of the face-down phone on his knee
const toLocal = (cx: number, dir: number, p: Pt): Pt => [(p[0] - cx) * dir, p[1] - HIP];

const talkOf = (who: Line["who"], t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};

const Couple: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  // --- boy ---
  const boyEmo: Emo = t < L0.end ? (t < T_FLIP ? "happy" : "neutral") : t < T_GRAB + 0.1 ? "nervous" : t < T_GRAB + 0.6 ? "shock" : t < T_WIDE ? "tired" : "neutral";
  const dart = t >= T_SCRATCH && t < T_GRAB ? (Math.sin(t * 9) > 0 ? 1 : -0.9) : 0;
  const boyGaze: Pt = t < T_FLIP ? [0.6, 0.9] : dart !== 0 ? [dart, 0] : t < L0.start ? [0.9, 0.1] : [0.8, 0];
  const boyNear = keysPt(t, [
    [0, [95, -150]],
    [T_FLIP, [95, -150]],
    [T_FLIP + 0.18, [102, 12]],
    [T_GRAB - 0.05, [102, 12]],
    [T_GRAB + 0.15, [150, -170]],
    [T_GRAB + 0.7, [150, -170]],
    [T_GRAB + 1.0, [80, -20]],
    [L3.start - 0.25, [80, -20]],
    [L3.start + 0.1, [165, -170]],
    [L3.end + 0.3, [165, -170]],
  ]);
  const boyPose: Pose = {
    near: boyNear,
    far: [45, -25],
    ...SEATED,
    lean: t < T_FLIP ? 6 : t >= T_SCRATCH && t < T_GRAB ? -3 : 0,
    tilt: t >= T_BOY && t < T_WIDE ? 5 : t < T_FLIP ? 6 : 0,
    bob: Math.sin(t * 2.2) * 2,
    palm: (t >= T_GRAB && t < T_GRAB + 0.8) || (t >= L3.start && t < L3.end + 0.4),
  };
  const boyLook: Look = {
    emo: boyEmo,
    talk: talkOf("boy", t, f),
    blink: f % 97 > 93 && boyEmo !== "nervous",
    gaze: boyGaze,
    sweat: t >= T_SCRATCH && t < T_GRAB + 0.7 ? 1 : 0,
    t,
  };
  const boyHolds = t < T_FLIP + 0.12;

  // --- girl ---
  const frozen = t >= T_FREEZE;
  const girlEmo: Emo = t < 0.45 ? "happy" : t < T_GRAB ? "suspicious" : t < T_GIRL - 0.3 ? "shock" : frozen ? "awkward" : "moved";
  const reach = toLocal(GIRL_X, -1, KNEE_PHONE);
  const girlNear = keysPt(t, [
    [0, [70, -25]],
    [L0.start + 0.3, [70, -25]],
    [L0.start + 0.6, [215, -10]],
    [L0.end, [215, -10]],
    [L0.end + 0.3, [70, -25]],
    [T_GRAB + 0.02, [70, -25]],
    [T_GRAB + 0.2, [reach[0] - 8, reach[1] - 8]],
    [T_GRAB + 0.3, [reach[0] - 8, reach[1] - 8]],
    [T_GRAB + 0.58, [92, -175]],
    [T_GIRL - 0.1, [92, -175]],
    [T_GIRL, [62, -150]],
  ]);
  const girlPose: Pose = {
    near: girlNear,
    far: t >= T_GIRL ? [40, -145] : [40, -25],
    ...SEATED,
    lean: keys(t, [
      [T_GRAB, 0],
      [T_GRAB + 0.18, 30],
      [T_GRAB + 0.3, 30],
      [T_GRAB + 0.55, 0],
    ]),
    tilt: t < T_GRAB ? (t > L0.start ? -6 : 0) : frozen ? 0 : -4,
    bob: frozen ? 0 : Math.sin(t * 2.2 + 1) * 2,
    point: t >= L0.start + 0.5 && t < L0.end,
  };
  const girlLook: Look = {
    emo: girlEmo,
    talk: talkOf("girl", t, f),
    blink: f % 113 > 109 && !frozen && girlEmo !== "moved",
    gaze: t < 0.45 ? [0.6, 0.2] : t < L0.start ? [0.7, 0.9] : t < T_GRAB + 0.55 ? [0.8, 0.2] : t < T_GIRL ? [0.2, 0.9] : [0.8, 0],
    blush: t >= T_GIRL && !frozen ? 1 : 0,
    tears: t >= T_GIRL ? clamp01((t - T_GIRL) / 0.6) * (frozen ? 0.6 : 1) : 0,
    sweat: frozen ? 1 : 0,
    t,
  };
  const girlHolds = t >= T_GRAB + 0.24;
  const hearts =
    t >= T_GIRL && t < T_FREEZE
      ? [0, 1, 2].map((i) => {
          const ph = ((t - T_GIRL) * 0.6 + i / 3) % 1;
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
        })
      : null;

  return (
    <g>
      {!boyHolds && !girlHolds && <g transform={`translate(${KNEE_PHONE[0]} ${KNEE_PHONE[1]}) scale(0.9 0.75) rotate(-66)`}><PhoneBack /></g>}
      <Stick x={BOY_X} hip={HIP} dir={1} hair="spiky" pose={boyPose} look={boyLook} held={boyHolds ? <g transform="translate(14 -44)"><PhoneBack /></g> : undefined} />
      <Stick x={GIRL_X} hip={HIP} dir={-1} hair="bob" girl pose={girlPose} look={girlLook} held={girlHolds ? <g transform="translate(16 -40)"><PhoneBack /></g> : undefined} headExtras={hearts} />
    </g>
  );
};

// ---------- the phone screen ----------
const Check: React.FC<{ on: number }> = ({ on }) => (
  <svg width={44} height={44} viewBox="0 0 44 44" style={{ flexShrink: 0 }}>
    <rect x={3} y={3} width={38} height={38} rx={10} fill={on > 0 ? "#3ccf7a" : "#fff"} stroke="#3a3350" strokeWidth={4} />
    {on > 0 && <path d="M11,23 L19,31 L33,14" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - on)} />}
  </svg>
);
const PLAN = ["Book her favourite restaurant", "Necklace she looked at 47 times", "Learn to bake a cake (try #9)", "Act normal"];
const PhoneShot: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const k = t - T_PHONE;
  const lift = backOut(k / 0.35);
  const light = clamp01((k - 0.1) / 0.15);
  return (
    <AbsoluteFill style={{ background: "#9fd28b", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", filter: "blur(14px)", transform: "scale(1.7)", transformOrigin: "50% 40%" }}>
        <Park t={t} />
      </svg>
      <AbsoluteFill style={{ background: "rgba(255,255,255,0.15)" }} />
      <div
        style={{
          position: "absolute",
          left: 270,
          top: 330,
          width: 560,
          height: 1120,
          borderRadius: 70,
          background: "#1d1d24",
          padding: 22,
          boxSizing: "border-box",
          transform: `translate(${Math.sin(f * 0.7) * 3}px, ${(1 - lift) * 500 + Math.cos(f * 0.5) * 3}px) rotate(${-3 + Math.sin(t * 2) * 0.8}deg)`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", position: "relative", background: `linear-gradient(170deg, #ffc2d4, #c7b5ff)`, fontFamily: FONT, color: "#3a3350" }}>
          <AbsoluteFill style={{ background: "#0d0d12", opacity: 1 - light }} />
          <div style={{ position: "absolute", top: 18, left: "50%", width: 130, height: 34, marginLeft: -65, borderRadius: 20, background: "#1d1d24" }} />
          <div style={{ opacity: light, padding: "80px 34px 0" }}>
            <div style={{ textAlign: "center", fontSize: 120, lineHeight: 1, color: "#fff", textShadow: "0 3px 10px rgba(80,40,120,0.3)" }}>9:41</div>
            <div style={{ textAlign: "center", fontSize: 32, color: "#fff", marginTop: 4 }}>Tuesday, June 10</div>
            <div style={{ marginTop: 36, background: "rgba(255,255,255,0.88)", borderRadius: 34, padding: "22px 20px", textAlign: "center", transform: `scale(${backOut((k - 0.15) / 0.3)})` }}>
              <div style={{ fontSize: 96, lineHeight: 1, color: "#ff4f86" }}>3 DAYS</div>
              <div style={{ fontSize: 38, marginTop: 6 }}>until HER birthday 🎂</div>
            </div>
            <div style={{ marginTop: 26, background: "rgba(255,255,255,0.88)", borderRadius: 34, padding: "18px 22px" }}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>Secret plan 🤫</div>
              {PLAN.map((p, i) => {
                const at = 0.5 + i * 0.28;
                const on = i < 3 ? clamp01((k - at) / 0.15) : 0;
                const show = clamp01((k - at + 0.15) / 0.12);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, lineHeight: 1.15, margin: "10px 0", opacity: show, transform: `translateX(${(1 - show) * 30}px)` }}>
                    <Check on={on} />
                    <span style={{ textDecoration: on >= 1 ? "line-through" : "none", textDecorationThickness: 3 }}>{p}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* her hand and thumb holding the phone */}
      <svg width={W} height={H} style={{ position: "absolute", transform: `translateY(${(1 - lift) * 500}px)` }}>
        <line x1={150} y1={1920} x2={330} y2={1330} stroke={INK} strokeWidth={34} strokeLinecap="round" />
        <circle cx={330} cy={1330} r={46} fill={INK} />
        <line x1={330} y1={1330} x2={300} y2={1240} stroke={INK} strokeWidth={26} strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- camera ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  const punch = (from: number, amp: number) => amp * Math.exp(-(t - from) * 9);
  if (t < T_SCRATCH) return { cx: 540, cy: 1010, z: 1.12 + t * 0.006 };
  if (t < T_GRAB) return { cx: 380, cy: 900, z: 1.75 + punch(T_SCRATCH, 0.25) + (t - T_SCRATCH) * 0.04 };
  if (t < T_GIRL) return { cx: 540, cy: 1010, z: 1.14 };
  if (t < T_BOY) return { cx: 710, cy: 900, z: 1.7 + (t - T_GIRL) * 0.05 };
  if (t < T_WIDE) return { cx: 370, cy: 880, z: 1.9 + punch(T_BOY, 0.3) + (t - T_BOY) * 0.03 };
  return { cx: 550, cy: 1010, z: 1.12 + clamp01((t - T_FREEZE) / 0.4) * 0.12 + (t - T_WIDE) * 0.008 };
};

// ---------- video ----------
export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const S = (at: number, src: string, volume = 1) => (
    <Sequence from={Math.round(at * FPS)}>
      <Audio src={staticFile(`stick-couple/ep01/${src}`)} volume={volume} />
    </Sequence>
  );
  let pic: React.ReactNode;
  if (t >= T_LAUGH) pic = <LaughTag t={t - T_LAUGH} f={f} />;
  else if (t >= T_PHONE && t < T_GIRL) pic = <PhoneShot t={t} f={f} />;
  else
    pic = (
      <AbsoluteFill style={{ background: "#a6d98d" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
          <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
            <Park t={t} />
            <Bench />
            <Couple t={t} f={f} />
          </g>
        </svg>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(30,40,60,0.18) 100%)" }} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {pic}
      {t < T_LAUGH && <Hook t={t} text={ep.hook} />}
      {t < T_LAUGH && <Captions t={t} words={WORDS} />}
      <Sequence durationInFrames={Math.round(T_SCRATCH * FPS)}>
        <Audio src={staticFile("stick-couple/ep01/music.wav")} volume={0.18} />
      </Sequence>
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`))}
      {S(T_SCRATCH, "scratch.wav", 0.5)}
      {S(T_SCRATCH + 0.45, "gulp.wav", 0.7)}
      {S(T_GRAB + 0.05, "grab.wav", 0.5)}
      {S(T_PHONE + 0.1, "ding.wav", 0.45)}
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>{S(T_PHONE + 0.5 + i * 0.28, "pop.wav", 0.25)}</React.Fragment>
      ))}
      {S(T_BOY, "whoosh.wav", 0.3)}
      {S(T_FREEZE, "freeze.wav", 0.5)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
