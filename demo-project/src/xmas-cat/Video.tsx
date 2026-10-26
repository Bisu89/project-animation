import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: SERIF } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: SERIF_I } = loadFont("italic", { weights: ["400"], subsets: ["latin"] });

export const FPS = 30;
export const DURATION = FPS * 40;

// Everything is placed in the picture's own pixel space (941 x 1672); the whole stage is scaled to 1080 x 1920.
const IW = 941;
const IH = 1672;
const SCALE = 1920 / IH;
const SRC = staticFile("xmas-cat/master.png");

// crop boxes on the master (content/xmas-cat/crops.json): the edited variants go back exactly here
const FIRE_BOX = { x: 0, y: 450, w: 450, h: 300 };
const FACE_BOX = { x: 110, y: 950, w: 450, h: 300 };
const TAIL_BOX = { x: 450, y: 1100, w: 450, h: 300 };

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

const Snow: React.FC<{ f: number }> = ({ f }) => {
  // flakes only inside the window glass: x 520..941, y 0..560
  const w = IW - 520;
  return (
    <div style={{ position: "absolute", left: 520, top: 0, width: w, height: 560, overflow: "hidden" }}>
      {Array.from({ length: 70 }, (_, i) => {
        const depth = random(`d${i}`); // 0 far, 1 near
        const size = 1.2 + depth * 3.4;
        const speed = 0.35 + depth * 1.1;
        const y = ((random(`y${i}`) * 600 + f * speed * 1.6) % 600) - 20;
        const x = (random(`x${i}`) * w + Math.sin(f * 0.02 + i) * (6 + depth * 10) - f * 0.12 * (0.4 + depth) + w * 3) % w;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: "#fff", opacity: 0.35 + depth * 0.5, filter: depth > 0.7 ? "blur(0.8px)" : undefined }} />;
      })}
    </div>
  );
};

// cocoa steam: soft puffs rise off the cup; the column snakes with sine waves travelling upward (continuous in time),
// and a fixed (non-scrolling) noise bends the shape a little, so nothing steps or jumps from frame to frame
const Steam: React.FC<{ f: number }> = ({ f }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={IW} height={IH}>
    <defs>
      <filter id="st" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="5" />
      </filter>
    </defs>
    <g filter="url(#st)">
      {Array.from({ length: 70 }, (_, i) => {
        const life = 170;
        const age = ((f * 0.8 + i * (life / 70)) % life) / life; // 0..1, wraps while invisible
        const breathe = 0.78 + 0.22 * Math.sin(f * 0.03 + i);
        const amp = 8 + age * 34;
        const snake = amp * Math.sin(age * 7.5 - f * 0.045) + amp * 0.45 * Math.sin(age * 15 - f * 0.08 + 1.3);
        const x = 812 + (random(`sx${i}`) - 0.5) * 34 * (0.4 + age) + snake + age * age * 26;
        const y = 748 - age * 250;
        const fadeIn = Math.min(1, age / 0.12);
        const fadeOut = Math.pow(1 - age, 1.4);
        return <circle key={i} cx={x} cy={y} r={11 + age * 32} fill="#fff6e8" opacity={0.62 * breathe * fadeIn * fadeOut} />;
      })}
    </g>
  </svg>
);

const Lights: React.FC<{ f: number }> = ({ f }) => (
  <>
    {Array.from({ length: 46 }, (_, i) => {
      // points inside the tree (a triangle, apex ~430,215, base ~340..610 at y 680) and along the mantel garland
      let x: number;
      let y: number;
      if (i < 34) {
        const v = random(`ty${i}`);
        y = 230 + v * 450;
        x = 462 + (random(`tx${i}`) * 2 - 1) * (15 + v * 125) - 10 * (1 - v);
      } else {
        x = 10 + random(`gx${i}`) * 330;
        y = 150 + (x / 330) * 40 + random(`gy${i}`) * 25;
      }
      const tw = 0.5 + 0.5 * Math.sin(f * (0.05 + random(`tf${i}`) * 0.09) + i * 3);
      return (
        <div
          key={i}
          style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(#fff3c4 0%, rgba(255,200,100,0.55) 35%, rgba(255,180,80,0) 70%)", opacity: 0.1 + 0.55 * tw, mixBlendMode: "screen" }}
        />
      );
    })}
  </>
);

// Procedural fire over the logs: teardrop tongues that grow, lean and shrink on their own rhythms,
// pushed around by scrolling noise, then blurred; plus embers that rise and die.
const FLAME_BASE = 692;
const TONGUES = [
  { x: 10, w: 12, h: 120 },
  { x: 26, w: 15, h: 170 },
  { x: 42, w: 16, h: 215 },
  { x: 58, w: 17, h: 190 },
  { x: 74, w: 18, h: 235 },
  { x: 90, w: 16, h: 175 },
  { x: 106, w: 15, h: 150 },
  { x: 122, w: 12, h: 105 },
];
const Flames: React.FC<{ f: number }> = ({ f }) => {
  const tongue = (t: (typeof TONGUES)[number], i: number, scale: number, fill: string) => {
    const h = t.h * scale * (0.72 + 0.55 * flick(f * 0.9, i * 2.3));
    const lean = Math.sin(f * 0.11 + i * 1.7) * 12 + Math.sin(f * 0.27 + i) * 5;
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
    <div style={{ position: "absolute", left: 0, top: 430, width: 205, height: 300, overflow: "hidden", WebkitMaskImage: "linear-gradient(to right, #000 78%, transparent)", maskImage: "linear-gradient(to right, #000 78%, transparent)" }}>
      <svg width={205} height={300} viewBox="0 430 205 300" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffcf5a" stopOpacity="0.55" />
            <stop offset="0.25" stopColor="#ffa426" stopOpacity="0.95" />
            <stop offset="0.7" stopColor="#f0581a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#c23a10" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="core" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fff0b0" stopOpacity="0.45" />
            <stop offset="0.5" stopColor="#ffe27a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffbd4a" stopOpacity="0" />
          </linearGradient>
          <filter id="lick" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.07" numOctaves="2" seed="8" result="n" />
            <feOffset in="n" dy={(f * 3.6) % 200} result="n2" />
            <feDisplacementMap in="SourceGraphic" in2="n2" scale="15" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="1.1" />
          </filter>
        </defs>
        <g filter="url(#lick)">
          {TONGUES.map((t, i) => tongue(t, i, 1, "url(#fl)"))}
          {TONGUES.map((t, i) => tongue(t, i, 0.5, "url(#core)"))}
        </g>
        {/* embers: each loops on its own period, rises, drifts and fades */}
        {Array.from({ length: 16 }, (_, i) => {
          const period = 50 + random(`ep${i}`) * 60;
          const age = ((f + random(`eo${i}`) * period) % period) / period;
          const x = 10 + random(`ex${i}`) * 120 + Math.sin(age * 6 + i) * 14 + age * 20;
          const y = FLAME_BASE - 30 - age * (140 + random(`eh${i}`) * 130);
          return <circle key={i} cx={x} cy={y} r={1 + random(`er${i}`) * 1.6} fill="#ffb347" opacity={Math.sin(age * Math.PI) * 0.9} />;
        })}
      </svg>
    </div>
  );
};

// Reels overlay: a short title at the start and a "full video on YouTube" card at the end. Kept inside the safe area
// (Reels UI covers roughly the top 150 px and the bottom 280 px of a 1080 x 1920 frame).
const ReelOverlay: React.FC<{ f: number; total: number }> = ({ f, total }) => {
  const t = f / FPS;
  const end = total / FPS;
  const inOut = (a: number, b: number, c: number, d: number) => interpolate(t, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = "0 0 18px rgba(255,170,70,0.55), 0 2px 10px rgba(0,0,0,0.7)";
  const base: React.CSSProperties = { position: "absolute", left: 0, width: 1080, textAlign: "center", color: "#ffe8c2", textShadow: glow };
  const title = inOut(0.6, 1.6, 4.2, 5.2);
  const card = inOut(end - 6.5, end - 5.5, end - 1.4, end - 0.6);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(6,2,2,0.45), rgba(6,2,2,0) 30%)", opacity: title }} />
      <div style={{ ...base, top: 230, opacity: title, transform: `translateY(${(1 - title) * 14}px)` }}>
        <div style={{ fontFamily: SERIF_I, fontSize: 40 }}>a quiet night by the fire</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.05, marginTop: 8 }}>Cozy Christmas Jazz</div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(6,2,2,0) 55%, rgba(6,2,2,0.7) 100%)", opacity: card }} />
      <div style={{ ...base, top: 1360, opacity: card, transform: `translateY(${(1 - card) * 14}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, lineHeight: 1.1 }}>Full 10-minute version</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, lineHeight: 1.1 }}>on YouTube</div>
        <div style={{ fontFamily: SERIF_I, fontSize: 36, marginTop: 14 }}>link in the first comment</div>
      </div>
    </>
  );
};

export const Video: React.FC<{ total?: number; reel?: boolean }> = ({ total = DURATION, reel = false }) => {
  const f = useCurrentFrame();
  const fire = flick(f, 1);
  const fire2 = flick(f, 4);
  // slow push toward the cat's face
  const k = interpolate(f, [0, total], [1, 1.13]);
  const originX = interpolate(f, [0, total], [50, 36]);
  const breath = 1 + 0.009 * Math.sin((f / FPS) * 1.55);
  const fade = interpolate(f, [0, 20, total - 45, total], [0, 1, 1, 0]);

  const ear = Math.max(pulse(f, 4.0, 0.2, 0.35, 0.3), pulse(f, 19.5, 0.2, 0.3, 0.3), pulse(f, 33.0, 0.2, 0.35, 0.3), pulse(f, 42.5, 0.2, 0.3, 0.3));
  const eyes = Math.max(pulse(f, 9.0, 0.8, 0.5, 0.8), pulse(f, 27.0, 0.8, 0.4, 0.8), pulse(f, 38.3, 0.8, 0.5, 0.8));
  const tail = Math.max(pulse(f, 13.5, 1.0, 0.4, 1.0), pulse(f, 23.0, 1.0, 0.3, 1.0), pulse(f, 36.0, 0.9, 0.3, 0.9));

  return (
    <AbsoluteFill style={{ background: "#120a08", overflow: "hidden" }}>
      <Audio src={staticFile("xmas-cat/ambience.wav")} volume={0.55} />
      <Audio src={staticFile("xmas-cat/music.mp3")} volume={(fr) => 0.8 * interpolate(fr, [0, 60, total - 90, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <div style={{ position: "absolute", left: (1080 - IW * SCALE) / 2, top: 0, width: IW, height: IH, transformOrigin: "0 0", transform: `scale(${SCALE})` }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${originX}% 66%`, transform: `scale(${k})`, opacity: fade }}>
          <img src={SRC} width={IW} height={IH} style={{ position: "absolute", left: 0, top: 0 }} />

          {/* fireplace without flames: logs and embers only */}
          <Patch box={FIRE_BOX} src="xmas-cat/fire_plate.png" opacity={1} />
          <Flames f={f} />

          {/* the cat: one group that breathes (scaled a hair from its belly line); ear, eyes and tail swap in over the same pixels */}
          <div style={{ position: "absolute", inset: 0, transformOrigin: "510px 1326px", transform: `scaleY(${breath}) scaleX(${1 + (breath - 1) * 0.4})` }}>
            <div style={{ position: "absolute", left: 60, top: 900, width: 880, height: 500, overflow: "hidden", WebkitMaskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)", maskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)" }}>
              <img src={SRC} width={IW} height={IH} style={{ position: "absolute", left: -60, top: -900 }} />
            </div>
            <Patch box={FACE_BOX} src="xmas-cat/ear_turn.png" opacity={ear} />
            <Patch box={FACE_BOX} src="xmas-cat/eyes_half.png" opacity={eyes} />
            <Patch box={TAIL_BOX} src="xmas-cat/tail_lift.png" opacity={tail} />
          </div>

          <Snow f={f} />
          <Steam f={f} />
          <Lights f={f} />

          {/* firelight: breathes over the floor, the cat and the nearby wall */}
          <div style={{ position: "absolute", left: -380, top: 330, width: 1100, height: 1100, borderRadius: "50%", mixBlendMode: "screen", opacity: 0.1 + 0.2 * fire, backgroundImage: "radial-gradient(circle, rgba(255,150,60,1) 0%, rgba(230,90,20,0.45) 40%, rgba(230,90,20,0) 70%)" }} />
          <div style={{ position: "absolute", left: 40, top: 960, width: 760, height: 420, borderRadius: "50%", mixBlendMode: "soft-light", opacity: 0.25 + 0.4 * fire2, backgroundImage: "radial-gradient(ellipse, rgba(255,170,80,1) 0%, rgba(255,140,50,0) 70%)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(8,3,2,0.55) 100%)", pointerEvents: "none" }} />
      </div>
      {reel && <ReelOverlay f={f} total={total} />}
    </AbsoluteFill>
  );
};
