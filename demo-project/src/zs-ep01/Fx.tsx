import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../stickman/fx";
import { VOICE_ENV } from "./voiceenv";
import { cueEnd, cueStart } from "./cues";

// ---------------------------------------------------------------------------------------------
// Effect tokens, written in content/zs-ep01/prompts.txt (before the "|") and stored in scenes.ts.
// Coordinates are fractions of the picture (0..1, x right, y down); radii are fractions of the width.
//
//  light / screen        lamp:x,y,r[,mode]            warm street lamp / ceiling light (default mode flicker)
//                        screen:x,y,r[,#color]        pulsing phone-screen glow (default cold blue)
//                        glow:x,y,r,#color,mode[,a]   any coloured light.  modes: flicker pulse blink fail on
//  living picture        breath:x,y,w,h[,amp]         a region swells slowly like a chest breathing
//                        sway:x,y,w,h[,amp]           a region drifts side to side (curtain, hair, strap)
//                        talk:x,y,w,h,a[-b]           mouth opens with the voice during sentences a..b of the scene
//  whole frame           torch:x,y,r[,dim]            dark room lit by a wandering flashlight
//                        heart:bpm                    red vignette pulses + heartbeat sound
//                        alarm:#color,hz              flashing emergency light
//                        fog:#color,opacity           drifting fog / smoke      dust  wind  rain  flicker
//                        hand  still                  stronger / no hand-held camera sway
//  interface cards       card:alert@k  card:chat@k  card:evac@k  card:nosignal@k   (k = sentence index inside the scene)
// ---------------------------------------------------------------------------------------------
export type FxTok = { name: string; a: string[]; at: number };

export const parseFx = (s: string): FxTok[] =>
  s
    .split(/\s+/)
    .filter((t) => t && t !== "none")
    .map((t0) => {
      let t = t0;
      let at = 0;
      const m = t.match(/@(\d+)$/);
      if (m) {
        at = +m[1];
        t = t.slice(0, t.length - m[0].length);
      }
      const p = t.split(/:(.+)/);
      return { name: p[0], a: p[1] ? p[1].split(",") : [], at };
    });

const num = (s: string | undefined, d: number) => (s === undefined || s === "" || isNaN(+s) ? d : +s);
const rnd = (n: number) => {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};
const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return `rgba(${parseInt(v.slice(0, 2), 16)},${parseInt(v.slice(2, 4), 16)},${parseInt(v.slice(4, 6), 16)},${Math.max(0, Math.min(1, a))})`;
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1920;
const H = 1080;

// Switches (owner feedback 2026-10-19: the shaking picture and the red screen were unpleasant, so both are off)
export const FX_SHAKE = false; // hand-held sway + camera knocks
export const FX_RED = false; // full-screen red flash (alarm) and red heartbeat vignette / zoom pulse

export const has = (toks: FxTok[], name: string) => toks.filter((t) => t.name === name);

// brightness 0..1 of a light over time
const lightLevel = (mode: string, f: number, seed: number, dur: number) => {
  switch (mode) {
    case "pulse":
      return 0.55 + 0.45 * Math.sin((f / 30) * 2 * Math.PI * 0.9);
    case "blink":
      return Math.floor(f / (30 / 2.8)) % 2 === 0 ? 1 : 0.04;
    case "on":
      return 1;
    case "fail": {
      // flickers more and more, then dies
      const k = Math.min(1, f / (dur * 0.85));
      return rnd(Math.floor(f / 2) + seed) > 0.12 + 0.85 * k ? 0.95 * (1 - k * 0.5) : k > 0.97 ? 0 : 0.06;
    }
    default: {
      const b = Math.floor(f / 3);
      return rnd(b + seed) > 0.9 ? 0.1 : 0.7 + 0.3 * rnd(b + seed + 99);
    }
  }
};

// ---------------------------------------------------------------- heartbeat (shared by picture + sound)
export const heartAmt = (f: number, bpm: number) => {
  const p = 1800 / bpm;
  const ph = f % p;
  const lub = Math.exp(-ph / 4);
  const dub = ph >= 9 ? 0.6 * Math.exp(-(ph - 9) / 4) : 0;
  return Math.min(1, lub + dub);
};

// ---------------------------------------------------------------- layers that live ON the picture (move with the zoom/pan)
const Glow: React.FC<{ x: number; y: number; r: number; color: string; mode: string; alpha: number; f: number; dur: number; seed: number }> = ({ x, y, r, color, mode, alpha, f, dur, seed }) => {
  const k = lightLevel(mode, f, seed, dur);
  const size = r * W * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: x * W - size / 2,
        top: y * H - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hexA(color, alpha * k)} 0%, ${hexA(color, alpha * k * 0.45)} 35%, ${hexA(color, 0)} 70%)`,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const imgStyle: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover" };

const Region: React.FC<{ src: string; kind: string; x: number; y: number; w: number; h: number; amp: number; f: number }> = ({ src, kind, x, y, w, h, amp, f }) => {
  const mask = `radial-gradient(ellipse ${w * 50}% ${h * 50}% at ${x * 100}% ${y * 100}%, #000 55%, transparent 100%)`;
  const s = Math.sin((f / 30) * 2 * Math.PI * (kind === "breath" ? 0.27 : 0.2));
  const tf =
    kind === "breath"
      ? `translateY(${-1.4 * amp * s}px) scale(${1 + 0.012 * amp * s})`
      : `translateX(${6 * amp * s}px) rotate(${0.35 * amp * s}deg)`;
  return (
    <Img
      src={src}
      style={{ ...imgStyle, WebkitMaskImage: mask, maskImage: mask, transform: tf, transformOrigin: `${x * 100}% ${(y + h / 2) * 100}%` }}
    />
  );
};

const Mouth: React.FC<{ x: number; y: number; w: number; h: number; a: number; b: number; g: number; firstCue: number }> = ({ x, y, w, h, a, b, g, firstCue }) => {
  const from = cueStart(firstCue + a);
  const to = cueEnd(firstCue + b);
  if (g < from || g > to) return null;
  const e = VOICE_ENV[g] ?? 0;
  const open = Math.min(1, e * 1.15);
  const hh = Math.max(2, h * H * open);
  return (
    <div
      style={{
        position: "absolute",
        left: x * W - (w * W) / 2,
        top: y * H - hh / 2,
        width: w * W,
        height: hh,
        borderRadius: "50%",
        background: "#2b0c10",
        boxShadow: "0 0 0 2px #140506",
        opacity: open < 0.12 ? 0 : 1,
      }}
    />
  );
};

const Torch: React.FC<{ x: number; y: number; r: number; dim: number; f: number }> = ({ x, y, r, dim, f }) => {
  const cx = (x + 0.012 * Math.sin(f / 11) + 0.006 * Math.sin(f / 4.7)) * W;
  const cy = (y + 0.01 * Math.sin(f / 13)) * H;
  const rr = r * W * (1 + 0.02 * Math.sin(f / 7));
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(circle ${rr}px at ${cx}px ${cy}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 28%, rgba(3,4,10,${dim}) 100%)` }} />
      <div
        style={{
          position: "absolute",
          left: cx - rr * 0.8,
          top: cy - rr * 0.8,
          width: rr * 1.6,
          height: rr * 1.6,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,240,205,0.16) 0%, rgba(255,240,205,0) 70%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
};

export const ImageFx: React.FC<{ toks: FxTok[]; src: string; f: number; g: number; dur: number; firstCue: number; seed: number; debug?: boolean }> = ({ toks, src, f, g, dur, firstCue, seed, debug }) => (
  <>
    {toks.map((t, i) => {
      const k = seed * 7 + i * 31;
      if (t.name === "lamp") return <Glow key={i} x={num(t.a[0], 0.5)} y={num(t.a[1], 0.3)} r={num(t.a[2], 0.15)} color="#ffcf7a" mode={t.a[3] || "flicker"} alpha={0.85} f={f} dur={dur} seed={k} />;
      if (t.name === "screen") return <Glow key={i} x={num(t.a[0], 0.5)} y={num(t.a[1], 0.6)} r={num(t.a[2], 0.12)} color={t.a[3] || "#8fb8ff"} mode="pulse" alpha={0.7} f={f} dur={dur} seed={k} />;
      if (t.name === "glow") return <Glow key={i} x={num(t.a[0], 0.5)} y={num(t.a[1], 0.5)} r={num(t.a[2], 0.15)} color={t.a[3] || "#ffffff"} mode={t.a[4] || "flicker"} alpha={num(t.a[5], 0.8)} f={f} dur={dur} seed={k} />;
      if (t.name === "breath" || t.name === "sway") return <Region key={i} src={src} kind={t.name} x={num(t.a[0], 0.5)} y={num(t.a[1], 0.5)} w={num(t.a[2], 0.2)} h={num(t.a[3], 0.2)} amp={num(t.a[4], 1)} f={f} />;
      if (t.name === "talk") {
        const r = (t.a[4] || "0").split("-");
        return <Mouth key={i} x={num(t.a[0], 0.5)} y={num(t.a[1], 0.5)} w={num(t.a[2], 0.05)} h={num(t.a[3], 0.03)} a={+r[0]} b={r.length > 1 ? +r[1] : +r[0]} g={g} firstCue={firstCue} />;
      }
      if (t.name === "torch") return <Torch key={i} x={num(t.a[0], 0.5)} y={num(t.a[1], 0.5)} r={num(t.a[2], 0.3)} dim={num(t.a[3], 0.82)} f={f} />;
      return null;
    })}
    {debug &&
      toks.map((t, i) => {
        if (["lamp", "screen", "glow", "torch"].indexOf(t.name) >= 0) {
          const r = num(t.a[2], 0.15) * W;
          return <div key={"d" + i} style={{ position: "absolute", left: num(t.a[0], 0.5) * W - r, top: num(t.a[1], 0.5) * H - r, width: 2 * r, height: 2 * r, border: "3px dashed #0f0", borderRadius: "50%", color: "#0f0", fontSize: 28 }}>{t.name}</div>;
        }
        if (["breath", "sway", "talk"].indexOf(t.name) >= 0) {
          const w = num(t.a[2], 0.2) * W;
          const h = num(t.a[3], 0.2) * H;
          return <div key={"d" + i} style={{ position: "absolute", left: num(t.a[0], 0.5) * W - w / 2, top: num(t.a[1], 0.5) * H - h / 2, width: w, height: h, border: "3px dashed #f0f", color: "#f0f", fontSize: 28 }}>{t.name}</div>;
        }
        return null;
      })}
  </>
);

// ---------------------------------------------------------------- hand-held camera + hits (rendered by KenBurns as an extra translate)
export const shakeOffset = (g: number, hits: [number, number][], hand: number) => {
  if (!FX_SHAKE) return [0, 0];
  let dx = hand * (1.3 * Math.sin(g / 47) + 0.8 * Math.sin(g / 19 + 1.0));
  let dy = hand * (1.0 * Math.sin(g / 53 + 2.0) + 0.6 * Math.sin(g / 23));
  for (let i = 0; i < hits.length; i++) {
    const d = g - hits[i][0];
    if (d >= 0 && d < 22) {
      const a = hits[i][1] * Math.exp(-d / 6);
      dx += a * Math.sin(d * 2.7 + i);
      dy += a * 0.7 * Math.cos(d * 3.3 + i * 2);
    }
  }
  return [dx, dy];
};

// ---------------------------------------------------------------- whole-frame overlays
const Fog: React.FC<{ f: number; color: string; opacity: number }> = ({ f, color, opacity }) => (
  <>
    {[0, 1, 2].map((i) => {
      const speed = 0.35 + i * 0.22;
      const w = 1500 + i * 300;
      const x = ((f * speed + i * 640) % (W + w)) - w;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: 330 + i * 150 + 25 * Math.sin(f / 90 + i),
            width: w,
            height: 460,
            background: `radial-gradient(ellipse at center, ${hexA(color, opacity)} 0%, ${hexA(color, 0)} 70%)`,
          }}
        />
      );
    })}
  </>
);

export const ScreenFx: React.FC<{ toks: FxTok[]; f: number; dur: number }> = ({ toks, f, dur }) => {
  const heart = has(toks, "heart")[0];
  const alarm = has(toks, "alarm")[0];
  const fog = has(toks, "fog")[0];
  const bpm = heart ? num(heart.a[0], 80) : 80;
  const beats: number[] = [];
  if (heart) {
    const p = 1800 / bpm;
    for (let k = 0; k * p < dur - 6; k++) beats.push(Math.round(k * p));
  }
  const a = heart ? heartAmt(f, bpm) : 0;
  const al = alarm ? 0.5 + 0.5 * Math.sin((f / 30) * 2 * Math.PI * num(alarm.a[1], 1.1)) : 0;
  return (
    <>
      {fog && <Fog f={f} color={fog.a[0] || "#9aa4b4"} opacity={num(fog.a[1], 0.22)} />}
      {FX_RED && heart && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(90,0,0,0) 52%, rgba(120,0,0,${0.16 + 0.4 * a}) 100%)` }} />}
      {FX_RED && alarm && <AbsoluteFill style={{ background: hexA(alarm.a[0] || "#ff1a1a", 0.05 + 0.16 * al), mixBlendMode: "screen" }} />}
      {beats.map((b) => (
        <Sequence key={b} from={b} durationInFrames={30}>
          <Audio src={staticFile("zs-ep01/sfx/heart.wav")} volume={0.32 + 0.12 * Math.min(1, bpm / 100)} />
        </Sequence>
      ))}
    </>
  );
};

// ---------------------------------------------------------------- interface cards (real text: AI pictures cannot spell)
const cardAnim = (f: number, start: number) => interpolate(f, [start, start + 8], [0, 1], clamp);

const AlertCard: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const p = cardAnim(f, start);
  if (f < start) return null;
  const vib = 0;
  return (
    <div style={{ position: "absolute", top: 70, left: W / 2 - 400, width: 800, opacity: p, transform: `translate(${vib}px, ${(1 - p) * -40}px)`, fontFamily: FONT.body, boxShadow: "0 12px 40px rgba(0,0,0,0.6)", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ background: "#c4161c", color: "#fff", fontWeight: 900, fontSize: 34, letterSpacing: 4, padding: "14px 26px", display: "flex", alignItems: "center" }}>
        <span style={{ width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderBottom: "28px solid #fff", marginRight: 18, display: "inline-block" }} />
        EMERGENCY ALERT
      </div>
      <div style={{ background: "rgba(24,24,28,0.94)", color: "#f2f2f2", fontSize: 31, fontWeight: 600, lineHeight: 1.35, padding: "18px 26px" }}>
        Stay inside. Lock your doors.
        <br />
        Wait for the next update.
      </div>
    </div>
  );
};

const CHAT = [
  { who: "Unit 12", text: "What is going on out there??" },
  { who: "Unit 7", text: "Do NOT go outside." },
  { who: "Unit 3", text: "[ video removed ]" },
];

const ChatCard: React.FC<{ f: number; starts: number[] }> = ({ f, starts }) => (
  <div style={{ position: "absolute", top: 60, right: 70, width: 560, fontFamily: FONT.body }}>
    {CHAT.map((c, i) => {
      const st = starts[i] ?? starts[starts.length - 1];
      if (f < st) return null;
      const p = cardAnim(f, st);
      return (
        <div key={i} style={{ marginBottom: 14, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
          <div style={{ color: "#9aa3b2", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{c.who}</div>
          <div style={{ background: "rgba(34,38,48,0.92)", color: "#fff", fontSize: 30, fontWeight: 600, padding: "12px 20px", borderRadius: "18px 18px 18px 4px", display: "inline-block" }}>{c.text}</div>
        </div>
      );
    })}
  </div>
);

const EvacCard: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const p = cardAnim(f, start);
  if (f < start) return null;
  return (
    <div style={{ position: "absolute", top: 70, left: W / 2 - 430, width: 860, opacity: p, transform: `translateY(${(1 - p) * -40}px)`, fontFamily: FONT.body, background: "rgba(22,26,34,0.95)", borderLeft: "10px solid #e0a030", borderRadius: 16, padding: "18px 28px", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
      <div style={{ color: "#e0a030", fontSize: 26, fontWeight: 800, letterSpacing: 3, marginBottom: 6 }}>AUTOMATED MESSAGE</div>
      <div style={{ color: "#fff", fontSize: 36, fontWeight: 800, lineHeight: 1.25 }}>EVACUATION POINT</div>
      <div style={{ color: "#e9edf4", fontSize: 31, fontWeight: 600, lineHeight: 1.35 }}>River Crossing Bridge, north bank</div>
      <div style={{ color: "#ff8a7a", fontSize: 31, fontWeight: 700, lineHeight: 1.35 }}>Receiving until 12:00 noon</div>
    </div>
  );
};

const NOTES: Record<string, string> = { note1: "Rule one: Noise attracts them.", note2: "Rule two: Find another way out before going farther in.", note3: "Rule three: Don't stay anywhere you can't leave in under a minute." };

// a plain note typed into the phone (Episode 2 onward: the survivor writes his rules down)
const NoteCard: React.FC<{ f: number; start: number; text: string }> = ({ f, start, text }) => {
  const p = cardAnim(f, start);
  if (f < start) return null;
  return (
    <div style={{ position: "absolute", top: 70, left: W / 2 - 430, width: 860, opacity: p, transform: `translateY(${(1 - p) * -30}px)`, fontFamily: FONT.body, background: "rgba(28,28,32,0.93)", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 34px rgba(0,0,0,0.55)" }}>
      <div style={{ background: "#d9a521", color: "#1a1a1a", fontSize: 24, fontWeight: 800, letterSpacing: 3, padding: "8px 24px" }}>NOTES</div>
      <div style={{ color: "#fff", fontSize: 36, fontWeight: 700, lineHeight: 1.3, padding: "18px 24px" }}>{text}</div>
    </div>
  );
};

const NoSignalCard: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const p = cardAnim(f, start);
  if (f < start) return null;
  return (
    <div style={{ position: "absolute", top: 60, right: 70, opacity: p, fontFamily: FONT.body, background: "rgba(18,20,26,0.88)", color: "#e6e8ee", fontSize: 30, fontWeight: 700, letterSpacing: 2, padding: "12px 22px", borderRadius: 12, display: "flex", alignItems: "center" }}>
      <span style={{ display: "inline-flex", alignItems: "flex-end", height: 28, marginRight: 14 }}>
        {[10, 15, 21, 28].map((h, i) => (
          <span key={i} style={{ width: 6, height: h, marginRight: 4, background: "#5a5f6b" }} />
        ))}
      </span>
      NO SERVICE
    </div>
  );
};

export const Cards: React.FC<{ toks: FxTok[]; f: number; sceneFrom: number; firstCue: number }> = ({ toks, f, sceneFrom, firstCue }) => {
  const at = (k: number) => cueStart(firstCue + k) - sceneFrom;
  const cards = has(toks, "card");
  return (
    <>
      {cards.map((c, i) => {
        const kind = c.a[0];
        if (kind === "alert") return <AlertCard key={i} f={f} start={at(c.at)} />;
        if (kind === "chat") return <ChatCard key={i} f={f} starts={[at(c.at), at(c.at + 1), at(c.at + 2)]} />;
        if (kind === "evac") return <EvacCard key={i} f={f} start={at(c.at)} />;
        if (kind === "nosignal") return <NoSignalCard key={i} f={f} start={at(c.at)} />;
        if (NOTES[kind]) return <NoteCard key={i} f={f} start={at(c.at)} text={NOTES[kind]} />;
        return null;
      })}
    </>
  );
};

// ---------------------------------------------------------------- chapter time stamp ("DAY 1 · 06:02")
const HUD: Record<string, [string, string]> = {
  "1": ["06:02", "DAY 1"],
  "2": ["07:25", "DAY 1"],
  "3": ["07:50", "DAY 1"],
  "4": ["08:40", "DAY 1"],
  "5": ["15:30", "DAY 1"],
  "6": ["18:45", "DAY 1"],
  "7": ["22:40", "DAY 1"],
  "8": ["05:50", "DAY 2"],
};

export const ChapterHud: React.FC<{ chapter: string }> = ({ chapter }) => {
  const f = useCurrentFrame();
  const key = chapter.split(".")[0].trim();
  const h = HUD[key];
  if (!h) return null;
  const title = chapter.replace(/^\d+\.\s*/, "").toUpperCase();
  const o = interpolate(f, [8, 24, 120, 144], [0, 1, 1, 0], clamp);
  const slide = interpolate(f, [8, 30], [-30, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, top: 56, opacity: o, transform: `translateX(${slide}px)`, fontFamily: FONT.body, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.9)", borderLeft: "6px solid #c4161c", paddingLeft: 18 }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 5, color: "#d6d9e0" }}>{h[1]} · {title}</div>
      <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: 3, lineHeight: 1.05 }}>{h[0]}</div>
    </div>
  );
};
