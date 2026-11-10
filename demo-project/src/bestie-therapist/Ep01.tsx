import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP01 from "./ep01.json";
import { H, SEAT_Y, W } from "../stick-couple/Park";
import { INK } from "../stick-couple/Stick";
import { backOut, Captions, clamp01, FONT, FPS, LaughTag, Line, lerp, makeWords } from "../stick-couple/common";
import { Chair, Office, OfficeDefs } from "./Office";
import { Beanie, Bestie, BigEmo, Cap } from "./Bestie";

// Bestie-therapist ep01 "Best Friend Is Also My Therapist" (9:16). Phase-1 clone of a reference reel, redrawn from
// close study of its actual frames (scratchpad/analyze/orig-*.png while building this): counselor's office, Theo
// (grey beanie, brown fringe, cyan eyes, teal shirt) plays therapist, Mia (maroon cap, tan skin, brown eyes, red
// shirt) answers the first question with an over-the-top "YEEEES!". Story beat (owner's correction, 2026-11-09,
// round 4): from Mia's "YEEEES!" onward both of them keep laughing right through "Are you always tired?" — but
// the laugh is not one flat unbroken loop; it breathes, and it cuts out HARD and FAST for Mia's second "Focus.
// Focus!" (a real, quick snap-stop, not a slow blend or a mock-stern hold), then snaps straight back into
// laughing for Theo's "...Yeeeees." reply and on to the end card. Reference-specific visual details kept close to
// the original: FOCUS is plain black text low over the floor (not on top of the characters), the big YEEEES is
// hollow outline text behind the heads, the pinned line is a YELLOW box (not the shared white Hook from
// stick-couple/common). Beats + voice timing:
// content/bestie-therapist/ep01.json (`python scripts/gen_gag_voice.py ep01 bestie-therapist`, ElevenLabs via
// vibi). Office.tsx has the background, Bestie.tsx the big-head rig (redrawn by Codex from the reference stills —
// see scratchpad notes for that pass).
const ep = EP01 as unknown as { hook: string; laughAt: number; total: number; lines: Line[] };
const [L0, L1, L2, , L4] = ep.lines;
const WORDS = makeWords(ep.lines);

// ---------- timeline ----------
// "Focus. Focus." is said as two distinct beats; punch the on-screen FOCUS card twice to match (no word-level
// timestamps from the TTS, so these are fractions of the line's length).
const T_FOCUS1A = L0.start + (L0.end - L0.start) * 0.4;
const T_FOCUS1B = L0.start + (L0.end - L0.start) * 0.74;
const T_YEEEES1 = L2.start; // Mia's first scream — laughter starts here and runs unbroken to the end card
const T_FOCUS2A = L4.start + (L4.end - L4.start) * 0.08;
const T_FOCUS2B = L4.start + (L4.end - L4.start) * 0.56;
const T_SNAP_START = T_FOCUS2A - 0.15; // laughter cuts out HARD and fast for the second "Focus. Focus!"
const T_SNAP_END = T_FOCUS2B + 0.3; // then they're straight back to laughing — no slow fade either way
const T_LAUGH = ep.laughAt;
const T_END = ep.total;
export const DURATION = Math.ceil(T_END * FPS);

const HIP = SEAT_Y - 30;
const THEO_X = 320;
const MIA_X = 770;
const FOCUS_WIN = 0.52;
const YEEEES_WIN = 1.0;

const talkOf = (who: Line["who"], t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};
const within = (t: number, from: number, win: number) => t >= from && t < from + win;

// ---------- props ----------
const Notepad: React.FC = () => (
  <g>
    <rect x={-30} y={-62} width={60} height={82} rx={6} fill="#f3e4cf" stroke={INK} strokeWidth={5} />
    <line x1={-18} y1={-44} x2={18} y2={-44} stroke="#b89c77" strokeWidth={4} />
    <line x1={-18} y1={-30} x2={18} y2={-30} stroke="#b89c77" strokeWidth={4} />
    <line x1={-18} y1={-16} x2={6} y2={-16} stroke="#b89c77" strokeWidth={4} />
    <line x1={20} y1={-72} x2={38} y2={-96} stroke="#e23348" strokeWidth={9} strokeLinecap="round" />
  </g>
);

// ---------- yellow pinned caption (the reference uses yellow, not the shared white Hook) ----------
const HookYellow: React.FC<{ t: number; text: string }> = ({ t, text }) => (
  <div style={{ position: "absolute", top: 60, left: 50, right: 50, display: "flex", justifyContent: "center", transform: `scale(${backOut(t / 0.3)})` }}>
    <div style={{ background: "#ffe14d", border: `7px solid ${INK}`, borderRadius: 16, padding: "18px 30px", fontFamily: FONT, fontSize: 52, lineHeight: 1.15, color: INK, textAlign: "center", fontStyle: "italic" }}>{text}</div>
  </div>
);

// ---------- "FOCUS" (plain, low over the floor) + "YEEEES!" (hollow outline, behind the heads) ----------
const FocusText: React.FC<{ t: number; from: number }> = ({ t, from }) => {
  const k = t - from;
  if (k < 0 || k > FOCUS_WIN) return null;
  const scale = lerp(1.8, 1, backOut(clamp01(k / 0.14)));
  const op = k < FOCUS_WIN - 0.12 ? 1 : 1 - (k - (FOCUS_WIN - 0.12)) / 0.12;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1490, textAlign: "center", pointerEvents: "none" }}>
      <span style={{ display: "inline-block", fontFamily: FONT, fontSize: 128, color: INK, WebkitTextStroke: "6px #fff", paintOrder: "stroke fill", opacity: op, transform: `scale(${scale})` }}>FOCUS</span>
    </div>
  );
};

const YeeeesText: React.FC<{ t: number; from: number; f: number }> = ({ t, from, f }) => {
  const k = t - from;
  if (k < 0 || k > YEEEES_WIN) return null;
  const scale = lerp(0.4, 1.08, backOut(clamp01(k / 0.2))) - (k > 0.2 ? 0.08 * clamp01((k - 0.2) / 0.6) : 0);
  const shakeX = k < 0.7 ? Math.sin(f * 2.3) * 9 * (1 - k / 0.7) : 0;
  const rot = Math.sin(f * 1.7) * 4;
  const op = k > 0.82 ? 1 - (k - 0.82) / 0.18 : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", pointerEvents: "none", opacity: op }}>
      <span style={{ display: "inline-block", fontFamily: FONT, fontSize: 182, color: "transparent", WebkitTextStroke: `13px ${INK}`, paintOrder: "stroke fill", transform: `translateX(${shakeX}px) rotate(${rot}deg) scale(${scale})` }}>
        YEEEES!
      </span>
    </div>
  );
};

// ---------- the scene (almost static, both seated the whole time) ----------
const Scene: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const sayingFocus1 = within(t, T_FOCUS1A - 0.05, FOCUS_WIN + 0.3);
  // Laughing runs from Mia's first "YEEEES!" through the question and after — but cuts out HARD and fast
  // for the second "Focus. Focus!" (a real stop, not a blend), then snaps straight back into laughing.
  const snap = t >= T_SNAP_START && t < T_SNAP_END;
  const laughingAll = t >= T_YEEEES1 && t < T_LAUGH && !snap;
  // a light "breathing" envelope so a long laugh doesn't read as one frozen looping animation
  const breathe = 0.75 + 0.25 * Math.sin(t * 2.4);

  let bEmo: BigEmo = "neutral";
  if (sayingFocus1) bEmo = "focus";
  else if (t >= L1.start && t < L1.end + 0.3) bEmo = "talk";
  else if (snap) bEmo = "annoyed"; // caught off guard, laugh snapped off
  else if (laughingAll) bEmo = "laugh";
  const bArm = t >= L1.start && t < L1.end ? 0.4 : 0;
  const bLook = { emo: bEmo, talk: talkOf("boy", t, f), blink: f % 101 > 97 && !sayingFocus1 && !laughingAll && !snap, tears: laughingAll ? 0.6 * breathe : 0, gaze: [0.4, 0] as [number, number] };
  const bPose = {
    bob: laughingAll ? Math.abs(Math.sin(t * 16)) * 11 * breathe : snap ? 0 : Math.sin(t * 2.1) * 3,
    tilt: laughingAll ? Math.sin(t * 15) * 9 * breathe : snap ? 6 : Math.sin(t * 2.3) * 2,
    armRaised: bArm,
    legCross: 0.4,
  };

  let gEmo: BigEmo = "neutral";
  if (snap) gEmo = "focus"; // hard, fast stop to say it — not a mock-stern hold, just a quick snap
  else if (laughingAll) gEmo = "laugh";
  else if (t >= L0.start) gEmo = "talk";
  const gLook = { emo: gEmo, talk: talkOf("girl", t, f), blink: f % 109 > 105 && !laughingAll && !snap, tears: laughingAll ? 0.7 * breathe : 0, gaze: [-0.4, 0] as [number, number] };
  const gPose = {
    bob: laughingAll ? Math.abs(Math.sin(t * 16)) * 12 * breathe : snap ? 0 : Math.sin(t * 2.4 + 1) * 3,
    tilt: laughingAll ? Math.sin(t * 15) * 10 * breathe : snap ? -6 : 0,
    armRaised: laughingAll ? 0.5 + Math.sin(t * 16) * 0.2 * breathe : snap ? 0.75 : 0.05,
    legCross: -0.4,
  };

  return (
    <g>
      <Bestie x={THEO_X} hip={HIP} dir={1} skin="#f3c9a8" iris="#2bb3a3" shirt="#1fb8cf" hat={<Beanie />} fringe held={<Notepad />} pose={bPose} look={bLook} />
      <Bestie x={MIA_X} hip={HIP} dir={-1} skin="#d98a52" iris="#5a3420" shirt="#e23348" hat={<Cap dir={1} />} pose={gPose} look={gLook} />
    </g>
  );
};

// ---------- camera ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  const punch = (from: number, amp: number) => (t >= from ? amp * Math.exp(-(t - from) * 9) : 0);
  const shake = (from: number) => (t >= from && t < from + 0.6 ? Math.sin((t - from) * 40) * 9 * (1 - (t - from) / 0.6) : 0);
  return {
    cx: 545 + shake(T_YEEEES1) + shake(T_SNAP_START),
    cy: 980,
    z: 1.0 + punch(T_FOCUS1A, 0.06) + punch(T_FOCUS1B, 0.08) + punch(T_FOCUS2A, 0.06) + punch(T_FOCUS2B, 0.08) + punch(T_YEEEES1, 0.07),
  };
};

// ---------- video ----------
export const Ep01: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const effectActive = within(t, T_FOCUS1A - 0.05, FOCUS_WIN + 0.35) || within(t, T_FOCUS2A - 0.05, FOCUS_WIN + 0.35) || within(t, T_YEEEES1, YEEEES_WIN);
  const S = (at: number, src: string, volume = 1, dur?: number) => (
    <Sequence from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined}>
      <Audio src={staticFile(`bestie-therapist/ep01/${src}`)} volume={volume} />
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t >= T_LAUGH ? (
        <LaughTag t={t - T_LAUGH} f={f} />
      ) : (
        <AbsoluteFill style={{ background: "#e3c3ab" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
            <OfficeDefs />
            <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
              <Office t={t} />
              <Chair cx={THEO_X} />
              <Chair cx={MIA_X} />
              <Scene t={t} f={f} />
            </g>
          </svg>
        </AbsoluteFill>
      )}
      {t < T_LAUGH && <HookYellow t={t} text={ep.hook} />}
      {t < T_LAUGH && !effectActive && <Captions t={t} words={WORDS} />}
      {t < T_LAUGH && <FocusText t={t} from={T_FOCUS1A} />}
      {t < T_LAUGH && <FocusText t={t} from={T_FOCUS1B} />}
      {t < T_LAUGH && <FocusText t={t} from={T_FOCUS2A} />}
      {t < T_LAUGH && <FocusText t={t} from={T_FOCUS2B} />}
      {t < T_LAUGH && <YeeeesText t={t} from={T_YEEEES1} f={f} />}
      {S(0, "music.wav", 0.12, T_LAUGH)}
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`))}
      {S(T_FOCUS1B, "ding.wav", 0.35)}
      {S(T_FOCUS2B, "ding.wav", 0.35)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
