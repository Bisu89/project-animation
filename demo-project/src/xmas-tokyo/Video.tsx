import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import features from "../xmas-cat-wide/features_poster.json";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: SERIF } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: SERIF_I } = loadFont("italic", { weights: ["400"], subsets: ["latin"] });

// Tokyo lo-fi Christmas poster (the "Chill Rap" layout: one poster over a living scene for the whole video).
// The scene moves with the music: neon on the bass, street lights on the highs, room lights on the mids, the cat's ear
// and the girl's eyes on strong beats. One pass = one playlist (scripts/xmas_playlist.py, shared with xmas-cat-wide),
// picture only: scripts/xmas_long.py joins the passes and mixes the playlist under them.
export const FPS = 30;
type Feat = { frames: number; bass: number[]; mid: number[]; high: number[]; onset: number[] };
const F: Feat = features;
export const PASS_FRAMES = F.frames;
const P_LEN = PASS_FRAMES / FPS;

// master pixel space (content/xmas-tokyo/master.png, 1536 x 1024); the 16:9 window is 1536 x 864 from CROP_Y
const IW = 1536;
const IH = 1024;
const CROP_Y = 80;
const VW = 1536;
const VH = 864;
const SCALE = 1920 / VW;
const SRC = staticFile("xmas-tokyo/master.png");
const FLOAT_MAP = staticFile("xmas-tokyo/float_map.png"); // R = G = 128 + 127 * weight (1 head and hands, 0 hips), B = 128

// crop boxes (content/xmas-tokyo/crops.json): edited variants go back exactly here
const FACE = { x: 330, y: 240, w: 300, h: 200 };
const STREET = { x: 870, y: 280, w: 630, h: 420 };
const ROOM = { x: 0, y: 60, w: 340, h: 510 };
const CAT = { x: 760, y: 640, w: 360, h: 240 };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// trapezoid envelope in seconds: in over a, hold h, out over b
const pulse = (t: number, t0: number, a: number, h: number, b: number) => {
  const u = t - t0;
  if (u < 0 || u > a + h + b) return 0;
  const ease = (x: number) => x * x * (3 - 2 * x);
  return u < a ? ease(u / a) : u < a + h ? 1 : ease(1 - (u - a - h) / b);
};
const maxOf = (t: number, times: number[], a: number, h: number, b: number) => times.reduce((m, t0) => Math.max(m, pulse(t, t0, a, h, b)), 0);

// the index wraps: the 2 s tail of a pass reads the start of the playlist, as the next pass will
const band = (name: "bass" | "mid" | "high" | "onset", f: number) => {
  const a = F[name];
  return a[((Math.round(f) % a.length) + a.length) % a.length] ?? 0;
};

// strong beats (local onset peaks), at most one per `gap` seconds
const onBeats = (gap: number, first: number, thr: number) => {
  const o = F.onset;
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

// the loudest moments: peaks of the 4 s average of bass + mid, at least `gap` seconds apart, strongest first
const loudPeaks = (gap: number, count: number) => {
  const w = 4 * FPS;
  const n = F.bass.length;
  const avg: number[] = [];
  let s = 0;
  for (let i = 0; i < n; i++) {
    s += F.bass[i] + F.mid[i] - (i >= w ? F.bass[i - w] + F.mid[i - w] : 0);
    avg.push(s / Math.min(i + 1, w));
  }
  const order = avg.map((v, i) => [v, i]).sort((p, q) => q[0] - p[0]);
  const out: number[] = [];
  for (const [, i] of order) {
    const t = i / FPS - 4; // the window ends at i: start the smile when the loud part starts
    if (t > 20 && t < P_LEN - 8 && out.every((u) => Math.abs(u - t) >= gap)) out.push(t);
    if (out.length >= count) break;
  }
  return out;
};

const EAR_T = onBeats(32, 20, 1.0);
const SMILE_T = loudPeaks(90, Math.max(1, Math.round(P_LEN / 150)));
// blinks every 4-7 s, skipped while she smiles
const BLINK_T = (() => {
  const out: number[] = [];
  for (let t = 3, k = 0; t < P_LEN; k++, t += 4 + random(`bl${k}`) * 3) {
    if (SMILE_T.every((s) => t < s - 1 || t > s + 6)) out.push(t);
  }
  return out;
})();

const EDGE = 14;
const FEATHER = {
  WebkitMaskImage: `linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent), linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)`,
  WebkitMaskComposite: "source-in",
  maskImage: `linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent), linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)`,
  maskComposite: "intersect",
} as React.CSSProperties;

type Box = { x: number; y: number; w: number; h: number };
const Patch: React.FC<{ box: Box; name: string; opacity: number }> = ({ box, name, opacity }) =>
  opacity <= 0.001 ? null : (
    <img src={staticFile(`xmas-tokyo/${name}.png`)} width={box.w} height={box.h} style={{ position: "absolute", left: box.x, top: box.y, opacity, ...FEATHER }} />
  );

// The girl "floats": her upper body sways and nods while her hips stay put. A smooth warp (two SVG displacements driven
// by float_map.png) rather than a moved copy, so there is no doubled outline. Content moves by (dx, dy) * weight.
const FloatFilter: React.FC<{ dx: number; dy: number }> = ({ dx, dy }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="float" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x={0} y={0} width={IW} height={IH} colorInterpolationFilters="sRGB">
        <feImage href={FLOAT_MAP} x={0} y={0} width={IW} height={IH} preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={-2 * dx} xChannelSelector="R" yChannelSelector="B" result="sway" />
        <feDisplacementMap in="sway" in2="map" scale={-2 * dy} xChannelSelector="B" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

// a part of the master that breathes: scaled a hair from its bottom line, soft-edged so the background stays put
const Breathe: React.FC<{ box: Box; ox: number; oy: number; s: number; children?: React.ReactNode }> = ({ box, ox, oy, s, children }) => (
  <div style={{ position: "absolute", inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: `scaleY(${s}) scaleX(${1 + (s - 1) * 0.4})` }}>
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", WebkitMaskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)", maskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)" }}>
      <img src={SRC} width={IW} height={IH} style={{ position: "absolute", left: -box.x, top: -box.y }} />
    </div>
    {children}
  </div>
);

// snow, only where the outside shows: the sky and street right of the girl, and the strip above her head
const SNOW_AREAS: Box[] = [
  { x: 670, y: 0, w: 830, h: 700 },
  { x: 355, y: 0, w: 315, h: 195 },
];
const Snow: React.FC<{ f: number }> = ({ f }) => (
  <>
    {SNOW_AREAS.map((A, a) => (
      <div key={a} style={{ position: "absolute", left: A.x, top: A.y, width: A.w, height: A.h, overflow: "hidden" }}>
        {Array.from({ length: Math.round((A.w * A.h) / 6000) }, (_, i) => {
          const depth = random(`d${a}-${i}`);
          const size = 1.2 + depth * 3;
          const speed = 0.3 + depth * 0.9;
          const y = ((random(`y${a}-${i}`) * (A.h + 40) + f * speed * 1.4) % (A.h + 40)) - 20;
          const x = (random(`x${a}-${i}`) * A.w + Math.sin(f * 0.02 + i) * (5 + depth * 9) - f * 0.08 * (0.4 + depth) + A.w * 4000) % A.w;
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: "#f4f6ff", opacity: 0.3 + depth * 0.5 }} />;
        })}
      </div>
    ))}
  </>
);

// steam off the mug: puffs rising in a column that snakes with upward-travelling sine waves (continuous, never steps)
const MUG = { x: 618, y: 478 };
const Steam: React.FC<{ f: number }> = ({ f }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={IW} height={IH}>
    <defs>
      <filter id="st" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="3" />
      </filter>
    </defs>
    <g filter="url(#st)">
      {Array.from({ length: 40 }, (_, i) => {
        const life = 150;
        const age = ((f * 0.8 + i * (life / 40)) % life) / life;
        const amp = 4 + age * 16;
        const snake = amp * Math.sin(age * 7.5 - f * 0.045) + amp * 0.45 * Math.sin(age * 15 - f * 0.08 + 1.3);
        const x = MUG.x + (random(`sx${i}`) - 0.5) * 14 * (0.4 + age) + snake + age * 14;
        const y = MUG.y - age * 120;
        return <circle key={i} cx={x} cy={y} r={5 + age * 15} fill="#fffaf0" opacity={0.5 * Math.min(1, age / 0.12) * Math.pow(1 - age, 1.4)} />;
      })}
    </g>
  </svg>
);

const Grain: React.FC<{ f: number; amount: number; w?: number; h?: number }> = ({ f, amount, w = VW, h = VH }) => (
  <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "overlay", opacity: amount, pointerEvents: "none" }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={w} height={h} filter="url(#grain)" />
  </svg>
);

const Barcode: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 58, height: 76, background: "#f3ead6", padding: "6px 5px", display: "flex", gap: 1.5, alignItems: "stretch", borderRadius: 2 }}>
    {Array.from({ length: 20 }, (_, i) => (
      <div key={i} style={{ width: 1 + Math.floor(random(`bc${i}`) * 3), background: "#1a1210" }} />
    ))}
  </div>
);

// ---------------------------------------------------------------------------------------------------------------
// Opening (same beats as xmas-cat-wide, our own wording):
//   A 0.0-5.6 dim sepia scene in a film frame + headline; G 5.4-6.6 RGB glitch + shake; Z 6.0-7.8 zoom streaks;
//   R 7.8-9.4 zoom back, the poster slams in and then stays for the whole pass.
// ---------------------------------------------------------------------------------------------------------------
const INTRO_END = 9.6;
const introFx = (t: number, f: number) => {
  if (t >= INTRO_END) return { scale: 1, blur: 0, color: "", dx: 0, dy: 0, ghost: 0 };
  const sepia = (1 - ramp(t, 7.6, 9.2)) * 0.55;
  const dark = 0.62 + 0.38 * ramp(t, 7.4, 9.0);
  const zoomOut = easeInOut(ramp(t, 6.0, 7.8));
  const zoomBack = easeOut(ramp(t, 7.8, 9.4));
  const base = 1 + 0.05 * ramp(t, 0, 5.6);
  const peak = 2.3;
  const scale = t < 7.8 ? base + (peak - base) * zoomOut : peak + (1 - peak) * zoomBack;
  const blur = t < 7.8 ? 5 * zoomOut : 5 * (1 - zoomBack);
  const glitch = t > 5.4 && t < 6.6;
  const dx = glitch ? (random(`gx${f}`) - 0.5) * 22 : 0;
  const dy = glitch ? (random(`gy${f}`) - 0.5) * 8 : 0;
  const ghost = Math.sin(Math.PI * ramp(t, 6.2, 9.2));
  const bright = glitch && random(`gb${f}`) > 0.6 ? 1.35 : 1;
  return { scale, blur, color: `sepia(${sepia}) brightness(${dark * bright}) saturate(${0.75 + 0.25 * ramp(t, 7.6, 9.2)})`, dx, dy, ghost };
};

// The poster sits around the girl: the title over the open sky right of her head, tags low in the corners.
const TITLE_X = 640; // the sky band: x 640..1360, y 0..200 of the 16:9 window
const TITLE_W = 720;
const Poster: React.FC<{ t: number; f: number; beat: number }> = ({ t, f, beat }) => {
  const base: React.CSSProperties = { position: "absolute", color: "#ffeccb", fontFamily: SERIF, fontWeight: 700 };
  const glow = "0 0 14px rgba(255,170,90,0.5), 0 2px 8px rgba(0,0,0,0.7)";

  const aIn = ramp(t, 0.5, 1.8);
  const a = aIn * (1 - ramp(t, 6.6, 6.9));
  const glitching = t > 5.4 && t < 6.6;
  const jx = glitching ? (random(`jx${f}`) - 0.5) * 18 : 0;
  const jy = glitching ? (random(`jy${f}`) - 0.5) * 6 : 0;
  const headline = (color: string, transform: string, key: string, blend?: React.CSSProperties["mixBlendMode"]) => (
    <div key={key} style={{ position: "absolute", inset: 0, mixBlendMode: blend, transform, color }}>
      <div style={{ position: "absolute", left: 0, width: VW, textAlign: "center", top: 330, fontFamily: SERIF_I, fontSize: 40 }}>Lost in the snow.</div>
      <div style={{ position: "absolute", left: 0, width: VW, textAlign: "center", top: 380, fontFamily: SERIF, fontWeight: 900, fontSize: 80 }}>Tokyo Christmas Lo-fi</div>
    </div>
  );

  const p = ramp(t, 8.3, 9.3);
  const slam = 1 + 0.14 * (1 - easeOut(ramp(t, 8.3, 9.1)));
  const flash = t > 8.25 && t < 8.6 ? 0.5 * (1 - ramp(t, 8.25, 8.6)) : 0;
  const tag: React.CSSProperties = { ...base, fontSize: 20, lineHeight: 1.3, letterSpacing: 1.5, textShadow: glow };

  return (
    <>
      {a > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, opacity: a * (1 - ramp(t, 6.0, 6.9)) }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(4,6,14,0.25) 40%, rgba(4,6,14,0.8) 100%)" }} />
            <div style={{ position: "absolute", inset: 14, border: "2px solid rgba(255,232,194,0.35)", borderRadius: 10 }} />
            <div style={{ ...base, left: 0, width: VW, textAlign: "center", top: 34, fontSize: 15, letterSpacing: 7 }}>TOKYO · WINTER 2026</div>
            <div style={{ ...base, left: 70, bottom: 64, fontSize: 15, lineHeight: 1.5, fontWeight: 400, fontFamily: SERIF_I, opacity: 0.85 }}>The city is quiet tonight.<br />Stay a little longer.<br />Let the snow fall.</div>
            <div style={{ ...base, right: 70, bottom: 64, fontSize: 15, fontWeight: 400, fontFamily: SERIF_I, opacity: 0.85 }}>Thank you for finding me.</div>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: a, textShadow: glow }}>
            {glitching && headline("#ff2d6f", `translate(${jx - 8 - random(`r${f}`) * 8}px, ${jy + 2}px)`, "r", "screen")}
            {glitching && headline("#16e8ff", `translate(${jx + 8 + random(`c${f}`) * 8}px, ${jy - 2}px)`, "c", "screen")}
            {headline("#ffe8c2", `translate(${jx}px, ${jy + (1 - aIn) * 14}px)`, "m")}
          </div>
        </>
      )}

      <div style={{ position: "absolute", inset: 0, opacity: p }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(3,5,14,0.42) 0%, rgba(3,5,14,0) 30%, rgba(3,5,14,0) 76%, rgba(3,5,14,0.5) 100%)" }} />
        <div style={{ ...base, left: TITLE_X, width: TITLE_W, textAlign: "center", top: 34, fontSize: 15, letterSpacing: 6, textShadow: glow }}>Cozy Christmas Vibes</div>
        <div style={{ ...base, left: TITLE_X - 40, width: TITLE_W + 80, textAlign: "center", top: 52, fontFamily: SERIF, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: 2, color: "#fdebc8", textShadow: `0 0 ${24 + 30 * beat}px rgba(255,170,90,${0.5 + 0.35 * beat}), 0 4px 14px rgba(0,0,0,0.55)`, transform: `scale(${slam})`, transformOrigin: "50% 40%" }}>CHRISTMAS</div>
        <div style={{ ...base, left: TITLE_X, width: TITLE_W, textAlign: "center", top: 176, fontFamily: SERIF_I, fontWeight: 400, fontSize: 30, letterSpacing: 3, textShadow: glow }}>in Tokyo</div>
        <div style={{ ...tag, left: 70, top: 690 }}>SNOWY NIGHTS,<br />I NEED THIS.</div>
        <div style={{ ...tag, right: 110, top: 690, textAlign: "right" }}>TOKYO LO-FI · JAZZ<br />STUDY · SLEEP · RELAX</div>
        <div style={{ ...base, left: 0, width: VW, textAlign: "center", top: 752, fontFamily: SERIF, fontWeight: 900, fontSize: 76, letterSpacing: 8, color: "#f6dcaa", opacity: 0.94, textShadow: `0 0 ${20 + 24 * beat}px rgba(255,150,60,${0.45 + 0.3 * beat}), 0 3px 10px rgba(0,0,0,0.7)` }}>COZY LO-FI</div>
        <Barcode x={VW - 96} y={VH - 112} />
        <svg width={VW} height={VH} style={{ position: "absolute", left: 0, top: 0 }}>
          <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
          </filter>
          <path fillRule="evenodd" filter="url(#rough)" fill="#e9dcc2" fillOpacity="0.92" d={`M0 0H${VW}V${VH}H0Z M20 20V${VH - 20}H${VW - 20}V20Z`} />
        </svg>
      </div>
      {flash > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,236,200,${flash})` }} />}
    </>
  );
};

// a small Subscribe pill that slides up for a few seconds once per pass
const Subscribe: React.FC<{ t: number }> = ({ t }) => {
  const v = pulse(t, 45, 0.6, 5, 0.6);
  if (v <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: VH - 104 + (1 - v) * 24, opacity: v, display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 14px", borderRadius: 24, background: "rgba(200,30,30,0.92)", color: "#fff", fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: 2, boxShadow: "0 3px 12px rgba(0,0,0,0.45)" }}>
      <svg width={18} height={18} viewBox="0 0 24 24"><path fill="#fff" d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" /></svg>
      SUBSCRIBE
    </div>
  );
};

// every periodic motion uses a period that divides the pass, so joined passes line up
const per = (p: number) => P_LEN / Math.max(1, Math.round(P_LEN / p));

// The living scene in master pixels. f drives time-based motion (snow, breath, sway); fm is the playlist frame the
// music features are read at (the short starts in the middle of the playlist). ghost: the intro's zoom streaks.
const Scene: React.FC<{ f: number; fm: number; ghost?: number }> = ({ f, fm, ghost = 0 }) => {
  const t = f / FPS;
  const tm = fm / FPS;

  // music -> light: each plate is the "lights off" picture, shown more when that band is quiet
  const neonOff = 0.7 * clamp01(1 - 1.3 * band("bass", fm));
  const streetOff = 0.65 * clamp01(1.15 - 1.3 * band("high", fm + 2)); // the high band sits around 0.5: start lower to be seen
  const roomOff = 0.5 * clamp01(1 - 1.3 * band("mid", fm + 1));

  const blink = maxOf(tm, BLINK_T, 0.05, 0.08, 0.07);
  const smile = maxOf(tm, SMILE_T, 0.8, 3.5, 0.9);
  const ear = maxOf(tm, EAR_T, 0.2, 0.35, 0.3);
  const breathGirl = 1 + 0.004 * Math.sin(t * 1.3);
  const breathCat = 1 + 0.008 * Math.sin(t * 1.55 + 1);
  // floating: a slow sideways sway, a slow bob, and a small nod down on the (smoothed) bass
  let bs = 0;
  for (let i = 0; i < 6; i++) bs += band("bass", fm - i) / 6;
  const swayX = 2.6 * Math.sin((2 * Math.PI * t) / per(7.3));
  const swayY = 1.6 * Math.sin((2 * Math.PI * t) / per(4.6) + 1) + 2.4 * bs;

  return (
    <>
      <FloatFilter dx={swayX} dy={swayY} />
      <Img src={FLOAT_MAP} style={{ display: "none" }} />
      <div style={{ position: "absolute", inset: 0, filter: "url(#float)" }}>
        <img src={SRC} width={IW} height={IH} style={{ position: "absolute", left: 0, top: 0 }} />
        {ghost > 0.01 && [1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
          <img key={j} src={SRC} width={IW} height={IH} style={{ position: "absolute", left: 0, top: 0, transformOrigin: "768px 500px", transform: `scale(${1 + 0.13 * j * ghost})`, opacity: (0.55 * ghost) / (1 + j * 0.18), mixBlendMode: "screen" }} />
        ))}

        <Patch box={STREET} name="street_lights_off" opacity={streetOff} />
        <Patch box={STREET} name="neon_off" opacity={neonOff} />
        <Patch box={ROOM} name="room_lights_off" opacity={roomOff} />
        <Snow f={f} />

        <Breathe box={{ x: 190, y: 190, w: 660, h: 720 }} ox={520} oy={900} s={breathGirl}>
          <Patch box={FACE} name="face_smile" opacity={smile} />
          <Patch box={FACE} name="face_blink" opacity={blink * (1 - smile)} />
        </Breathe>
        <Breathe box={{ x: 800, y: 690, w: 400, h: 230 }} ox={990} oy={900} s={breathCat}>
          <Patch box={CAT} name="cat_ear" opacity={ear} />
        </Breathe>
        <Steam f={f} />
      </div>
    </>
  );
};

// loop: a later pass of the long version (no intro, no fade-in)
export const Video: React.FC<{ loop?: boolean }> = ({ loop = false }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ti = loop ? INTRO_END + 1 : t;
  const fx = introFx(ti, f);
  const fade = loop ? 1 : interpolate(f, [0, 60], [0, 1], { extrapolateRight: "clamp" });

  // camera: a slow breath of zoom
  const k = 1.02 + 0.02 * Math.sin((2 * Math.PI * t) / per(150) - 1.2);
  const originX = 760 + 140 * Math.sin((2 * Math.PI * t) / per(200) + 0.5);
  const originY = 540 + 50 * Math.sin((2 * Math.PI * t) / per(120));

  return (
    <AbsoluteFill style={{ background: "#0b0d16", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, overflow: "hidden", transformOrigin: "0 0", transform: `scale(${SCALE})` }}>
        <div style={{ position: "absolute", left: 0, top: -CROP_Y, width: IW, height: IH }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${originX}px ${originY + CROP_Y}px`, transform: `translate(${fx.dx}px, ${fx.dy}px) scale(${k * fx.scale})`, opacity: fade, filter: [fx.blur > 0.05 ? `blur(${fx.blur}px)` : "", fx.color].join(" ").trim() || undefined }}>
            <Scene f={f} fm={f} ghost={fx.ghost} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 58%, rgba(3,4,10,0.45) 100%)", pointerEvents: "none" }} />
        <Poster t={ti} f={f} beat={band("bass", f)} />
        <Grain f={f} amount={ti < INTRO_END - 1 ? 0.5 : Math.max(0.16, 0.5 * (INTRO_END - ti))} />
        <Subscribe t={t} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Vertical short (YouTube Shorts / Reels), 1080 x 1920. A 9:16 window of the master (576 x 1024) starts on the girl and
// drifts right to the cat and the neon street. The music is the liveliest 40 s of the playlist (SHORT_START: highest
// 40 s average of bass + mid, away from track changes); the picture reads the features from there and the soundtrack
// is cut from the same place (ffmpeg -ss SHORT_START on playlist.wav). Text stays out of the Shorts/Reels UI
// (top ~150 px, bottom ~300 px).
// ---------------------------------------------------------------------------------------------------------------
export const SHORT_FRAMES = 40 * FPS;
export const SHORT_START = 988; // seconds into the playlist (jazz 2)
const SW = 576;
const SS = 1920 / IH;
const OW = 1080;
const OH = 1920;

export const Short: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fm = f + SHORT_START * FPS;
  const beat = band("bass", fm);
  const x0 = 230 + 370 * easeInOut(ramp(t, 2, 36)); // girl -> cat and street
  const fade = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const title = easeOut(ramp(t, 0.2, 0.9));
  const end = ramp(t, 34.5, 35.3);
  const base: React.CSSProperties = { position: "absolute", left: 0, width: OW, textAlign: "center", color: "#ffeccb", fontFamily: SERIF, fontWeight: 700 };
  const glow = "0 0 14px rgba(255,170,90,0.5), 0 2px 8px rgba(0,0,0,0.75)";

  return (
    <AbsoluteFill style={{ background: "#0b0d16", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: IH, overflow: "hidden", transformOrigin: "0 0", transform: `scale(${SS})`, opacity: fade }}>
        <div style={{ position: "absolute", left: -x0, top: 0, width: IW, height: IH }}>
          <Scene f={f} fm={fm} />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(3,5,14,0.5) 0%, rgba(3,5,14,0) 22%, rgba(3,5,14,0) 70%, rgba(3,5,14,0.45) 100%)" }} />

      <div style={{ position: "absolute", inset: 0, opacity: title * (1 - end) }}>
        <div style={{ ...base, top: 170, fontSize: 24, letterSpacing: 8, textShadow: glow }}>Cozy Christmas Vibes</div>
        <div style={{ ...base, top: 204, fontWeight: 900, fontSize: 146, lineHeight: 1, color: "#fdebc8", transform: `scale(${1 + 0.12 * (1 - title)})`, textShadow: `0 0 ${26 + 30 * beat}px rgba(255,170,90,${0.5 + 0.35 * beat}), 0 4px 14px rgba(0,0,0,0.6)` }}>CHRISTMAS</div>
        <div style={{ ...base, top: 372, fontFamily: SERIF_I, fontWeight: 400, fontSize: 44, letterSpacing: 4, textShadow: glow }}>in Tokyo</div>
        <div style={{ ...base, top: 1440, fontWeight: 900, fontSize: 92, letterSpacing: 8, color: "#f6dcaa", opacity: 0.94, textShadow: `0 0 ${20 + 24 * beat}px rgba(255,150,60,${0.45 + 0.3 * beat}), 0 3px 10px rgba(0,0,0,0.75)` }}>COZY LO-FI</div>
        <div style={{ ...base, top: 1548, fontSize: 26, letterSpacing: 3, textShadow: glow }}>jazz · snow · study · sleep</div>
      </div>

      {end > 0 && (
        <div style={{ position: "absolute", left: 90, width: OW - 180, top: 760, padding: "40px 30px", borderRadius: 18, background: `rgba(8,10,20,${0.72 * end})`, border: `2px solid rgba(255,232,194,${0.5 * end})`, opacity: end, textAlign: "center" }}>
          <div style={{ color: "#fdebc8", fontFamily: SERIF, fontWeight: 900, fontSize: 64, lineHeight: 1.1, textShadow: glow }}>Full 3-hour version<br />on YouTube</div>
          <div style={{ marginTop: 22, color: "#ffeccb", fontFamily: SERIF_I, fontSize: 34 }}>link in the first comment</div>
        </div>
      )}

      {/* worn paper border, as on the long video's poster */}
      <svg width={OW} height={OH} style={{ position: "absolute", left: 0, top: 0 }}>
        <filter id="rough-s" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
        </filter>
        <path fillRule="evenodd" filter="url(#rough-s)" fill="#e9dcc2" fillOpacity="0.92" d={`M0 0H${OW}V${OH}H0Z M22 22V${OH - 22}H${OW - 22}V22Z`} />
      </svg>
      <Grain f={f} amount={0.16} w={OW} h={OH} />
    </AbsoluteFill>
  );
};
