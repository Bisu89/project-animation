import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import features from "./features.json";
import featuresPoster from "./features_poster.json";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: SERIF } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: SERIF_I } = loadFont("italic", { weights: ["400"], subsets: ["latin"] });

export const FPS = 30;
export const DURATION = FPS * 600; // 10 minutes; render a short range (--frames=0-899) to preview

// Edited variants (content/xmas-cat-wide/assets_variants.csv) copied to public/xmas-cat-wide/. Flip when the files exist.
const FIRE_PLATE_READY = true;
const CAT_VARIANTS_READY = true;

// Everything is placed in the master's own pixel space (1536 x 1024); the 16:9 window is 1536 x 864 starting at CROP_Y.
const IW = 1536;
const IH = 1024;
const CROP_Y = 70;
const VW = 1536;
const VH = 864;
const SCALE = 1920 / VW;
const SRC = staticFile("xmas-cat-wide/master.png");

// crop boxes on the master (content/xmas-cat-wide/crops.json): the edited variants go back exactly here
const FIRE_BOX = { x: 100, y: 370, w: 450, h: 300 };
const FACE_BOX = { x: 520, y: 600, w: 450, h: 300 };
const TAIL_BOX = { x: 620, y: 640, w: 450, h: 300 };

// smooth pseudo-random flicker, never ticks: a sum of unrelated sines
const flick = (f: number, seed = 0) =>
  0.5 + 0.22 * Math.sin(f * 0.37 + seed) + 0.16 * Math.sin(f * 0.91 + seed * 2.1) + 0.12 * Math.sin(f * 1.7 + seed * 0.7);

// trapezoid envelope in seconds: in over a, hold h, out over b
const pulse = (f: number, t0: number, a: number, h: number, b: number) => {
  const t = f / FPS - t0;
  if (t < 0 || t > a + h + b) return 0;
  const ease = (x: number) => x * x * (3 - 2 * x);
  return t < a ? ease(t / a) : t < a + h ? 1 : ease(1 - (t - a - h) / b);
};

type Feat = { frames: number; bass: number[]; mid: number[]; high: number[]; onset: number[] };
// poster mode reads the playlist's features (scripts/xmas_playlist.py); one pass = one playlist, so the index wraps
const band = (name: "bass" | "mid" | "high" | "onset", f: number, src: Feat = features) => {
  const a = src[name];
  const i = Math.round(f);
  return (src === features ? a[Math.max(0, Math.min(a.length - 1, i))] : a[((i % a.length) + a.length) % a.length]) ?? 0;
};
const POSTER: Feat = featuresPoster;
export const POSTER_FRAMES = POSTER.frames;

// event times for the whole 10 minutes: roughly every `every` seconds, each moved by a fixed random amount
const schedule = (every: number, first: number, seed: string, len = 600) => {
  const out: number[] = [];
  for (let k = 0; first + k * every < len; k++) out.push(first + k * every + (random(`${seed}${k}`) - 0.5) * every * 0.5);
  return out;
};
const EAR_T = schedule(34, 6, "ear");
const EYE_T = schedule(58, 22, "eye");
const TAIL_T = schedule(44, 14, "tail");

// poster mode: the ear twitches and the tail lifts on a strong beat (a local onset peak), at most once per `gap` seconds
const onBeats = (gap: number, first: number, thr: number) => {
  const o = POSTER.onset;
  const out: number[] = [];
  let last = -1e9;
  for (let i = 1; i < o.length - 1; i++) {
    const t = i / FPS;
    if (t >= first && t - last >= gap && o[i] > thr && o[i] >= o[i - 1] && o[i] >= o[i + 1]) {
      out.push(t);
      last = t;
    }
  }
  return out;
};
const P_LEN = POSTER_FRAMES / FPS;
const P_EAR_T = onBeats(32, 20, 1.0);
const P_TAIL_T = onBeats(41, 30, 1.0);
const P_EYE_T = schedule(58, 40, "eye", P_LEN);

const EDGE = 16;
const FEATHER_RECT = {
  WebkitMaskImage: `linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent), linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)`,
  WebkitMaskComposite: "source-in",
  maskImage: `linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent), linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)`,
  maskComposite: "intersect",
} as React.CSSProperties;

const Patch: React.FC<{ box: { x: number; y: number; w: number; h: number }; src: string; opacity: number }> = ({ box, src, opacity }) =>
  opacity <= 0.001 ? null : (
    <img src={staticFile(src)} width={box.w} height={box.h} style={{ position: "absolute", left: box.x, top: box.y, opacity, ...FEATHER_RECT }} />
  );

// window glass: x 995..1460, y 100..545
const WIN = { x: 995, y: 100, w: 465, h: 445 };
const Snow: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, overflow: "hidden" }}>
    {Array.from({ length: 80 }, (_, i) => {
      const depth = random(`d${i}`); // 0 far, 1 near
      const size = 1.2 + depth * 3.2;
      const speed = 0.35 + depth * 1.1;
      const y = ((random(`y${i}`) * (WIN.h + 40) + f * speed * 1.5) % (WIN.h + 40)) - 20;
      const x = (random(`x${i}`) * WIN.w + Math.sin(f * 0.02 + i) * (6 + depth * 10) - f * 0.1 * (0.4 + depth) + WIN.w * 4000) % WIN.w;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: "#fff", opacity: 0.35 + depth * 0.5, filter: depth > 0.7 ? "blur(0.8px)" : undefined }} />;
    })}
  </div>
);

// cocoa steam: puffs rise off the mug; the column snakes with sine waves travelling upward (continuous in time),
// a fixed (non-scrolling) noise bends the shape a little, so nothing steps or jumps from frame to frame
const MUG = { x: 1393, y: 604 };
const Steam: React.FC<{ f: number }> = ({ f }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={IW} height={IH}>
    <defs>
      <filter id="st" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="4" />
      </filter>
    </defs>
    <g filter="url(#st)">
      {Array.from({ length: 60 }, (_, i) => {
        const life = 170;
        const age = ((f * 0.8 + i * (life / 60)) % life) / life;
        const breathe = 0.78 + 0.22 * Math.sin(f * 0.03 + i);
        const amp = 6 + age * 26;
        const snake = amp * Math.sin(age * 7.5 - f * 0.045) + amp * 0.45 * Math.sin(age * 15 - f * 0.08 + 1.3);
        const x = MUG.x + (random(`sx${i}`) - 0.5) * 24 * (0.4 + age) + snake + age * age * 20;
        const y = MUG.y - age * 170;
        const fadeIn = Math.min(1, age / 0.12);
        const fadeOut = Math.pow(1 - age, 1.4);
        return <circle key={i} cx={x} cy={y} r={8 + age * 24} fill="#fff6e8" opacity={0.62 * breathe * fadeIn * fadeOut} />;
      })}
    </g>
  </svg>
);

const Lights: React.FC<{ f: number; src: Feat; gain: number }> = ({ f, src, gain }) => (
  <>
    {Array.from({ length: 60 }, (_, i) => {
      let x: number;
      let y: number;
      if (i < 34) {
        // right-hand tree: a triangle whose axis sits at x~1475 and widens downward
        const v = random(`ty${i}`);
        y = 150 + v * 420;
        x = 1475 + (random(`tx${i}`) * 2 - 1) * (25 + v * 120);
        if (x > 1530) x = 1530 - random(`tc${i}`) * 40;
      } else {
        // mantel garland, curving down toward the right
        x = 10 + random(`gx${i}`) * 590;
        y = 80 + (x / 590) * 150 + Math.sin(x / 55) * 14 + random(`gy${i}`) * 26;
      }
      // each bulb listens to one band (bass / mid / high) and brightens with it, on top of its own slow twinkle
      const tw = 0.5 + 0.5 * Math.sin(f * (0.05 + random(`tf${i}`) * 0.09) + i * 3);
      const m = band((['bass', 'mid', 'high'] as const)[i % 3], f + (i % 5), src);
      return (
        <div
          key={i}
          style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: "50%", background: "radial-gradient(#fff3c4 0%, rgba(255,200,100,0.55) 35%, rgba(255,180,80,0) 70%)", opacity: Math.min(1, 0.06 + 0.3 * tw + 0.5 * gain * m), transform: `scale(${0.85 + 0.5 * gain * m})`, mixBlendMode: "screen" }}
        />
      );
    })}
    {/* candles in the lanterns: each breathes on its own rhythm */}
    {[[190, 72], [518, 158], [705, 440], [1520, 668]].map(([x, y], i) => (
      <div key={i} style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: "50%", mixBlendMode: "screen", opacity: Math.min(1, 0.2 + 0.35 * flick(f, 10 + i * 3) + gain * (0.4 * band("mid", f, src) + 0.25 * band("onset", f, src))), background: "radial-gradient(rgba(255,210,120,0.9) 0%, rgba(255,150,50,0.3) 45%, rgba(255,150,50,0) 72%)" }} />
    ))}
  </>
);

// Procedural fire over the logs: teardrop tongues that grow, lean and shrink on their own rhythms, pushed around by
// a fixed noise, then lightly blurred; plus embers that rise and die.
const FLAME_BASE = 612;
const TONGUES = Array.from({ length: 9 }, (_, i) => ({ x: 192 + i * 16, w: 11 + (i % 3) * 2, h: [95, 135, 175, 210, 230, 200, 165, 125, 85][i] }));
const FIRE_AREA = { x: 150, y: 380, w: 270, h: 290 };
const Flames: React.FC<{ f: number; pump: number }> = ({ f, pump }) => {
  const tongue = (t: (typeof TONGUES)[number], i: number, scale: number, fill: string) => {
    const h = t.h * scale * (0.72 + 0.55 * flick(f * 0.9, i * 2.3)) * (1 + 0.22 * pump);
    const lean = Math.sin(f * 0.11 + i * 1.7) * 11 + Math.sin(f * 0.27 + i) * 5;
    const w = t.w * (0.85 + 0.3 * flick(f, i + 7)) * (scale > 0.9 ? 1 : 0.55);
    const x = t.x + Math.sin(f * 0.07 + i * 2) * 3;
    const y = FLAME_BASE;
    return (
      <path
        key={`${i}-${scale}`}
        d={`M ${x - w} ${y} C ${x - w * 1.1} ${y - h * 0.4}, ${x + lean * 0.4 - w * 0.3} ${y - h * 0.72}, ${x + lean} ${y - h} C ${x + lean * 0.4 + w * 0.3} ${y - h * 0.68}, ${x + w * 1.1} ${y - h * 0.4}, ${x + w} ${y} Z`}
        fill={fill}
      />
    );
  };
  return (
    <div style={{ position: "absolute", left: FIRE_AREA.x, top: FIRE_AREA.y, width: FIRE_AREA.w, height: FIRE_AREA.h, overflow: "hidden", WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)", maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)" }}>
      <svg width={FIRE_AREA.w} height={FIRE_AREA.h} viewBox={`${FIRE_AREA.x} ${FIRE_AREA.y} ${FIRE_AREA.w} ${FIRE_AREA.h}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb13a" stopOpacity="0.1" />
            <stop offset="0.22" stopColor="#ff9a22" stopOpacity="0.9" />
            <stop offset="0.7" stopColor="#f0581a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#c23a10" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="core" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffe9a0" stopOpacity="0.1" />
            <stop offset="0.45" stopColor="#ffd45e" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffbd4a" stopOpacity="0" />
          </linearGradient>
          <filter id="lick" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.07" numOctaves="2" seed="8" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="15" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="1.1" />
          </filter>
        </defs>
        <g filter="url(#lick)">
          {TONGUES.map((t, i) => tongue(t, i, 1, "url(#fl)"))}
          {TONGUES.map((t, i) => tongue(t, i, 0.5, "url(#core)"))}
        </g>
        {Array.from({ length: 18 }, (_, i) => {
          const period = 50 + random(`ep${i}`) * 60;
          const age = ((f + random(`eo${i}`) * period) % period) / period;
          const x = 195 + random(`ex${i}`) * 130 + Math.sin(age * 6 + i) * 14 + age * 20;
          const y = FLAME_BASE - 30 - age * (140 + random(`eh${i}`) * 130);
          return <circle key={i} cx={x} cy={y} r={1 + random(`er${i}`) * 1.6} fill="#ffb347" opacity={Math.sin(age * Math.PI) * 0.9} />;
        })}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Opening (modelled on a vintage "poster" title sequence; all wording and art here are our own):
//   A  0.0-5.6  dim, sepia scene in a film frame with small credit lines and a headline
//   G  5.4-6.6  headline glitches (RGB split) while the picture shakes
//   Z  6.0-7.8  zoom-out streaks toward the centre (stacked ghost copies) with blur
//   R  7.8-9.4  the zoom reverses, picture clears, the poster slams in (big title, corner tags, paper border, barcode)
//   H  9.4-13.6 poster holds; O 13.6-15.6 poster dissolves, the clean scene remains
// ---------------------------------------------------------------------------------------------------------------
const INTRO_END = 15.6;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const introFx = (t: number, f: number) => {
  if (t >= INTRO_END) return { scale: 1, blur: 0, color: "", dx: 0, dy: 0, ghost: 0 };
  const sepia = (1 - ramp(t, 7.6, 9.2)) * 0.55;
  const dark = 0.62 + 0.38 * ramp(t, 7.4, 9.0);
  const zoomOut = easeInOut(ramp(t, 6.0, 7.8)); // 0 -> 1
  const zoomBack = easeOut(ramp(t, 7.8, 9.4)); // 0 -> 1
  const base = 1 + 0.05 * ramp(t, 0, 5.6); // slow push during A
  const peak = 2.3;
  const scale = t < 7.8 ? base + (peak - base) * zoomOut : peak + (1 - peak) * zoomBack;
  const blur = t < 7.8 ? 5 * zoomOut : 5 * (1 - zoomBack);
  const glitch = t > 5.4 && t < 6.6 ? 1 : 0;
  const dx = glitch ? (random(`gx${f}`) - 0.5) * 22 : 0;
  const dy = glitch ? (random(`gy${f}`) - 0.5) * 8 : 0;
  const ghost = Math.sin(Math.PI * ramp(t, 6.2, 9.2)); // streak copies fade in and out
  const bright = glitch && random(`gb${f}`) > 0.6 ? 1.35 : 1;
  const color = `sepia(${sepia}) brightness(${dark * bright}) saturate(${0.75 + 0.25 * ramp(t, 7.6, 9.2)})`;
  return { scale, blur, color, dx, dy, ghost };
};

const Grain: React.FC<{ f: number; amount: number }> = ({ f, amount }) => (
  <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "overlay", opacity: amount, pointerEvents: "none" }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={VW} height={VH} filter="url(#grain)" />
  </svg>
);

const Barcode: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 58, height: 76, background: "#f3ead6", padding: "6px 5px", display: "flex", gap: 1.5, alignItems: "stretch", borderRadius: 2 }}>
    {Array.from({ length: 20 }, (_, i) => (
      <div key={i} style={{ width: 1 + Math.floor(random(`bc${i}`) * 3), background: "#1a1210" }} />
    ))}
  </div>
);

// a small Subscribe pill that slides up for a few seconds (poster mode, once per 10-minute pass)
const Subscribe: React.FC<{ t: number }> = ({ t }) => {
  const v = pulse(t * FPS, 45, 0.6, 5, 0.6);
  if (v <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: VH - 104 + (1 - v) * 24, opacity: v, display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 14px", borderRadius: 24, background: "rgba(200,30,30,0.92)", color: "#fff", fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: 2, boxShadow: "0 3px 12px rgba(0,0,0,0.45)" }}>
      <svg width={18} height={18} viewBox="0 0 24 24"><path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" /></svg>
      SUBSCRIBE
    </div>
  );
};

// hold: the poster never dissolves (the "Chill Rap" layout: one poster over the living scene for the whole video)
const Intro: React.FC<{ t: number; f: number; hold: boolean; beat: number }> = ({ t, f, hold, beat }) => {
  if (t > INTRO_END && !hold) return null;
  const sansBase: React.CSSProperties = { position: "absolute", color: "#ffe8c2", fontFamily: SERIF, fontWeight: 700 };
  const glow = "0 0 16px rgba(255,170,70,0.5), 0 2px 8px rgba(0,0,0,0.65)";

  // ---- A + G: headline over the dim scene
  const aIn = ramp(t, 0.5, 1.8);
  const a = aIn * (1 - ramp(t, 6.6, 6.9));
  const glitching = t > 5.4 && t < 6.6;
  const jx = glitching ? (random(`jx${f}`) - 0.5) * 18 : 0;
  const jy = glitching ? (random(`jy${f}`) - 0.5) * 6 : 0;
  const headline = (color: string, transform: string, key: string, blend?: React.CSSProperties["mixBlendMode"]) => (
    <div key={key} style={{ position: "absolute", inset: 0, mixBlendMode: blend, transform, color }}>
      <div style={{ position: "absolute", left: 0, width: VW, textAlign: "center", top: 300, fontFamily: SERIF_I, fontSize: 40 }}>Lost in the warmth.</div>
      <div style={{ position: "absolute", left: 0, width: VW, textAlign: "center", top: 350, fontFamily: SERIF, fontWeight: 900, fontSize: 84 }}>Cozy Christmas Jazz</div>
    </div>
  );

  // ---- poster
  const p = ramp(t, 8.3, 9.3) * (hold ? 1 : 1 - ramp(t, 13.6, 15.6));
  const slam = 1 + 0.14 * (1 - easeOut(ramp(t, 8.3, 9.1)));
  const tag: React.CSSProperties = { ...sansBase, fontSize: 21, lineHeight: 1.25, letterSpacing: 1.5, textShadow: glow, color: "#ffeccb" };
  const flash = t > 8.25 ? Math.max(0, 0.5 * (1 - ramp(t, 8.25, 8.6))) : 0;

  return (
    <>
      {/* A: film frame, tint and credits */}
      <div style={{ position: "absolute", inset: 0, opacity: a * (1 - ramp(t, 6.0, 6.9)) }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(8,3,2,0.25) 40%, rgba(8,3,2,0.8) 100%)" }} />
        <div style={{ position: "absolute", inset: 14, border: "2px solid rgba(255,232,194,0.35)", borderRadius: 10 }} />
        <div style={{ ...sansBase, left: 0, width: VW, textAlign: "center", top: 34, fontSize: 15, letterSpacing: 7 }}>XMAS COZY · 2026</div>
        <div style={{ ...sansBase, left: 70, bottom: 64, fontSize: 15, lineHeight: 1.5, fontWeight: 400, fontFamily: SERIF_I, opacity: 0.85 }}>You did good today.<br />Warm up by the fire.<br />Let the rhythm take over.</div>
        <div style={{ ...sansBase, right: 70, bottom: 64, fontSize: 15, fontWeight: 400, fontFamily: SERIF_I, opacity: 0.85 }}>Thank you for finding me.</div>
      </div>
      {/* headline, with an RGB split while glitching */}
      <div style={{ position: "absolute", inset: 0, opacity: a, textShadow: glow }}>
        {glitching && headline("#ff2d6f", `translate(${jx - 8 - random(`r${f}`) * 8}px, ${jy + 2}px)`, "r", "screen")}
        {glitching && headline("#16e8ff", `translate(${jx + 8 + random(`c${f}`) * 8}px, ${jy - 2}px)`, "c", "screen")}
        {headline("#ffe8c2", `translate(${jx}px, ${jy + (1 - aIn) * 14}px)`, "m")}
      </div>

      {/* poster */}
      <div style={{ position: "absolute", inset: 0, opacity: p }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(6,2,2,0.5) 0%, rgba(6,2,2,0.05) 38%, rgba(6,2,2,0.05) 70%, rgba(6,2,2,0.55) 100%)" }} />
        <div style={{ ...sansBase, left: 0, width: VW, textAlign: "center", top: 42, fontSize: 16, letterSpacing: 6, textShadow: glow }}>Cozy Christmas Vibes</div>
        <div style={{ ...sansBase, left: 0, width: VW, textAlign: "center", top: 62, fontFamily: SERIF, fontWeight: 900, fontSize: 218, lineHeight: 1, letterSpacing: 2, color: "#fdebc8", textShadow: `0 0 ${30 + 34 * beat}px rgba(255,160,60,${0.6 + 0.3 * beat}), 0 4px 14px rgba(0,0,0,0.5)`, transform: `scale(${slam})`, transformOrigin: "50% 40%" }}>CHRISTMAS</div>
        <div style={{ ...tag, left: 70, top: 640 }}>WINTER NIGHTS,<br />I NEED THIS.</div>
        <div style={{ ...tag, right: 70, top: 640, textAlign: "right" }}>COZY FIREPLACE JAZZ<br />SLEEPING CAT VIBE</div>
        <div style={{ ...sansBase, left: 0, width: VW, textAlign: "center", top: 706, fontFamily: SERIF, fontWeight: 900, fontSize: 104, letterSpacing: 6, opacity: 0.92, color: "#f6dcaa", textShadow: `0 0 ${24 + 26 * beat}px rgba(255,150,50,${0.55 + 0.3 * beat}), 0 3px 10px rgba(0,0,0,0.6)` }}>COZY JAZZ</div>
        <Barcode x={VW - 96} y={VH - 112} />
        {/* worn paper border: a cream frame whose inner edge is roughened by noise */}
        <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0 }}>
          <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          </filter>
          <path fillRule="evenodd" filter="url(#rough)" fill="#e9dcc2" fillOpacity="0.92" d={`M0 0H${VW}V${VH}H0Z M20 20V${VH - 20}H${VW - 20}V20Z`} />
        </svg>
      </div>

      <Grain f={f} amount={t < INTRO_END - 1 ? 0.5 : Math.max(hold ? 0.16 : 0, 0.5 * (INTRO_END - t))} />
      {flash > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,236,200,${flash})` }} />}
    </>
  );
};

// poster: keep the poster for the whole video (no fade-out: scripts/xmas_long.py joins passes and fades the end).
// loop: a later 10-minute pass of the long version: poster already on, no intro, no fades.
// audio: false when the soundtrack is mixed afterwards by ffmpeg (scripts/xmas_long.py).
export type Props = { poster?: boolean; loop?: boolean; audio?: boolean };

export const Video: React.FC<Props> = ({ poster = false, loop = false, audio = true }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ti = loop ? INTRO_END + 1 : t; // the time the intro sees
  const fire = flick(f, 1);
  const fire2 = flick(f, 4);
  // slow camera: breathes in and out over ~2.5 minutes while the aim drifts between the hearth and the cat.
  // In poster mode every period divides 600 s, so the camera lines up where two 10-minute passes are joined.
  const per = (p: number, plain: number) => (poster ? P_LEN / Math.max(1, Math.round(P_LEN / p)) : plain);
  const k = 1.035 + 0.035 * Math.sin((2 * Math.PI * t) / per(150, 150) - 1.2);
  const originX = 700 + 160 * Math.sin((2 * Math.PI * t) / per(200, 210) + 0.5);
  const originY = 560 + 70 * Math.sin((2 * Math.PI * t) / per(120, 170));
  // music: the playlist's features in poster mode (stronger), the 10-minute mix otherwise
  const src = poster ? POSTER : features;
  const gain = poster ? 1.5 : 1;
  const bass = poster ? band("bass", f, POSTER) : 0;
  const breath = 1 + 0.008 * Math.sin(t * 1.55);
  const fade = loop ? 1 : poster ? interpolate(f, [0, 60], [0, 1], { extrapolateRight: "clamp" }) : interpolate(f, [0, 60, DURATION - 150, DURATION], [0, 1, 1, 0]);
  const fx = introFx(ti, f);

  const maxOf = (times: number[], a: number, h: number, b: number) => times.reduce((m, t0) => Math.max(m, pulse(f, t0, a, h, b)), 0);
  const ear = CAT_VARIANTS_READY ? maxOf(poster ? P_EAR_T : EAR_T, 0.2, 0.35, 0.3) : 0;
  const eyes = CAT_VARIANTS_READY ? maxOf(poster ? P_EYE_T : EYE_T, 0.8, 0.5, 0.8) : 0;
  const tail = CAT_VARIANTS_READY ? maxOf(poster ? P_TAIL_T : TAIL_T, 1.0, 0.4, 1.0) : 0;

  return (
    <AbsoluteFill style={{ background: "#120a08", overflow: "hidden" }}>
      {audio && <Audio src={staticFile("xmas-cat-wide/ambience.wav")} volume={0.5} />}
      {audio && <Audio src={staticFile("xmas-cat-wide/music.mp3")} volume={0.8} />}
      {audio && <Audio src={staticFile("xmas-cat-wide/intro_sfx.wav")} volume={0.7} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, overflow: "hidden", transformOrigin: "0 0", transform: `scale(${SCALE})` }}>
        <div style={{ position: "absolute", left: 0, top: -CROP_Y, width: IW, height: IH }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${originX}px ${originY}px`, transform: `translate(${fx.dx}px, ${fx.dy}px) scale(${k * fx.scale})`, opacity: fade, filter: [fx.blur > 0.05 ? `blur(${fx.blur}px)` : "", fx.color].join(" ").trim() || undefined }}>
            <img src={SRC} width={IW} height={IH} style={{ position: "absolute", left: 0, top: 0 }} />
            {fx.ghost > 0.01 && [1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
              <img key={j} src={SRC} width={IW} height={IH} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "768px 500px", transform: `scale(${1 + 0.13 * j * fx.ghost})`, opacity: 0.55 * fx.ghost / (1 + j * 0.18), mixBlendMode: "screen" }} />
            ))}

            {FIRE_PLATE_READY && <Patch box={FIRE_BOX} src="xmas-cat-wide/fire_plate.png" opacity={1} />}
            {FIRE_PLATE_READY && <Flames f={f} pump={bass} />}

            {/* the cat: one group that breathes (scaled a hair from its belly line); ear, eyes and tail swap in over the same pixels */}
            <div style={{ position: "absolute", inset: 0, transformOrigin: "770px 805px", transform: `scaleY(${breath}) scaleX(${1 + (breath - 1) * 0.4})` }}>
              <div style={{ position: "absolute", left: 490, top: 570, width: 640, height: 360, overflow: "hidden", WebkitMaskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)", maskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)" }}>
                <img src={SRC} width={IW} height={IH} style={{ position: "absolute", left: -490, top: -570 }} />
              </div>
              {CAT_VARIANTS_READY && <Patch box={FACE_BOX} src="xmas-cat-wide/ear_turn.png" opacity={ear} />}
              {CAT_VARIANTS_READY && <Patch box={FACE_BOX} src="xmas-cat-wide/eyes_half.png" opacity={eyes} />}
              {CAT_VARIANTS_READY && <Patch box={TAIL_BOX} src="xmas-cat-wide/tail_lift.png" opacity={tail} />}
            </div>

            <Snow f={f} />
            <Steam f={f} />
            <Lights f={f} src={src} gain={gain} />

            {/* firelight: breathes over the floor, the cat and the nearby wall */}
            <div style={{ position: "absolute", left: -450, top: 100, width: 1400, height: 1000, borderRadius: "50%", mixBlendMode: "screen", opacity: 0.08 + 0.18 * fire + 0.1 * bass, backgroundImage: "radial-gradient(circle, rgba(255,150,60,1) 0%, rgba(230,90,20,0.45) 40%, rgba(230,90,20,0) 70%)" }} />
            <div style={{ position: "absolute", left: 340, top: 600, width: 760, height: 330, borderRadius: "50%", mixBlendMode: "soft-light", opacity: 0.25 + 0.4 * fire2, backgroundImage: "radial-gradient(ellipse, rgba(255,170,80,1) 0%, rgba(255,140,50,0) 70%)" }} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(8,3,2,0.5) 100%)", pointerEvents: "none" }} />
        <Intro t={ti} f={f} hold={poster} beat={bass} />
        {poster && <Subscribe t={t} />}
      </div>
    </AbsoluteFill>
  );
};
