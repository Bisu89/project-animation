import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import type { Box, CozyConfig, Events, Features, RainCfg, SnowCfg, SteamCfg } from "./types";

const { fontFamily: SERIF } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: SERIF_I } = loadFont("italic", { weights: ["400"], subsets: ["latin"] });

export const FPS = 30;

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

// event times for a creature patch: a fixed list, or "about every N seconds" with a fixed random offset per event
const eventTimes = (e: Events, seconds: number): number[] => {
  if ("times" in e) return e.times;
  const out: number[] = [];
  for (let k = 0; e.first + k * e.every < seconds + e.every; k++) out.push(e.first + k * e.every + (random(`${e.seed}${k}`) - 0.5) * e.every * (e.jitter ?? 0.5));
  return out;
};

const EDGE = 16;
const FEATHER_RECT = {
  WebkitMaskImage: `linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent), linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)`,
  WebkitMaskComposite: "source-in",
  maskImage: `linear-gradient(to right, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent), linear-gradient(to bottom, transparent, #000 ${EDGE}px, #000 calc(100% - ${EDGE}px), transparent)`,
  maskComposite: "intersect",
} as React.CSSProperties;

const Patch: React.FC<{ box: Box; src: string; opacity: number }> = ({ box, src, opacity }) =>
  opacity <= 0.001 ? null : <img src={staticFile(src)} width={box.w} height={box.h} style={{ position: "absolute", left: box.x, top: box.y, opacity, ...FEATHER_RECT }} />;

const Snow: React.FC<{ f: number; cfg: SnowCfg }> = ({ f, cfg }) => {
  const { rect } = cfg;
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, overflow: "hidden", borderRadius: cfg.shape === "ellipse" ? "50%" : undefined }}>
      {Array.from({ length: cfg.count }, (_, i) => {
        const depth = random(`d${i}`); // 0 far, 1 near
        const size = 1.2 + depth * 3.3;
        const speed = 0.35 + depth * 1.1;
        const y = ((random(`y${i}`) * (rect.h + 40) + f * speed * 1.5) % (rect.h + 40)) - 20;
        const x = (random(`x${i}`) * rect.w + Math.sin(f * 0.02 + i) * (6 + depth * 10) - f * 0.1 * (0.4 + depth) + rect.w * 4000) % rect.w;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: "#fff", opacity: 0.35 + depth * 0.5, filter: depth > 0.7 ? "blur(0.8px)" : undefined }} />;
      })}
    </div>
  );
};

// rain: thin slanted streaks (near ones longer, brighter, faster) and a few slow drops that slide down the glass
const Rain: React.FC<{ f: number; cfg: RainCfg }> = ({ f, cfg }) => {
  const { rect } = cfg;
  const lean = cfg.lean ?? 0.18;
  const len = cfg.length ?? 38;
  const spd = cfg.speed ?? 1;
  const alpha = cfg.opacity ?? 0.5;
  return (
    <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, overflow: "hidden", borderRadius: cfg.shape === "ellipse" ? "50%" : undefined }}>
      <svg width={rect.w} height={rect.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: cfg.count }, (_, i) => {
          const depth = random(`rd${i}`);
          const l = len * (0.4 + depth * 0.9);
          const span = rect.h + l + 40;
          const y = ((random(`ry${i}`) * span + f * spd * (14 + depth * 22)) % span) - l;
          const x = random(`rx${i}`) * (rect.w + rect.h * lean) - y * lean;
          return <line key={i} x1={x} y1={y} x2={x - l * lean} y2={y + l} stroke="#cfe0ff" strokeWidth={0.8 + depth * 1.4} strokeLinecap="round" opacity={alpha * (0.35 + depth * 0.65)} />;
        })}
      </svg>
      {Array.from({ length: cfg.drops ?? 0 }, (_, i) => {
        const span = rect.h * 1.3;
        const t = (random(`gy${i}`) * span + f * (0.25 + random(`gs${i}`) * 0.55)) % span;
        const x = random(`gx${i}`) * rect.w + Math.sin(t * 0.05 + i) * 2.5;
        const r = 1.6 + random(`gr${i}`) * 2.2;
        return <div key={i} style={{ position: "absolute", left: x, top: t - 10, width: r, height: r * 2.2, borderRadius: "50%", background: "rgba(215,230,255,0.55)", boxShadow: "0 0 3px rgba(255,255,255,0.45)", opacity: 0.7 }} />;
      })}
    </div>
  );
};

// steam: puffs rise off a cup; the column snakes with sine waves travelling upward (continuous in time), and a fixed
// (non-scrolling) noise bends the shape a little, so nothing steps or jumps from frame to frame
const Steam: React.FC<{ f: number; cfg: SteamCfg; w: number; h: number }> = ({ f, cfg, w, h }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={w} height={h}>
    <defs>
      <filter id="cz-steam" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={cfg.displace} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="4.5" />
      </filter>
    </defs>
    <g filter="url(#cz-steam)">
      {Array.from({ length: cfg.count }, (_, i) => {
        const age = ((f * 0.8 + i * (cfg.life / cfg.count)) % cfg.life) / cfg.life; // 0..1, wraps while invisible
        const breathe = 0.78 + 0.22 * Math.sin(f * 0.03 + i);
        const amp = cfg.amp0 + age * cfg.ampGrow;
        const snake = amp * Math.sin(age * 7.5 - f * 0.045) + amp * 0.45 * Math.sin(age * 15 - f * 0.08 + 1.3);
        const x = cfg.x + (random(`sx${i}`) - 0.5) * cfg.spread * (0.4 + age) + snake + age * age * cfg.drift;
        const y = cfg.y - age * cfg.rise;
        return <circle key={i} cx={x} cy={y} r={cfg.r0 + age * cfg.rGrow} fill="#fff6e8" opacity={cfg.opacity * breathe * Math.min(1, age / 0.12) * Math.pow(1 - age, 1.4)} />;
      })}
    </g>
  </svg>
);

const asList = <T,>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

const band = (features: Features | undefined, name: keyof Features, f: number) => {
  const a = features?.[name];
  return a ? a[Math.max(0, Math.min(a.length - 1, Math.round(f)))] ?? 0 : 0;
};

const Lights: React.FC<{ f: number; cfg: NonNullable<CozyConfig["lights"]>; features?: Features }> = ({ f, cfg, features }) => {
  const pts: [number, number][] = [];
  cfg.regions.forEach((r) => {
    const start = pts.length;
    for (let j = 0; j < r.count; j++) {
      const i = start + j; // one running index across regions keeps each bulb's random seed stable
      if (r.type === "tree") {
        const v = random(`ty${i}`);
        let x = r.axisX + (random(`tx${i}`) * 2 - 1) * (r.halfTop + v * (r.halfBottom - r.halfTop)) - r.skew * (1 - v);
        if (r.clampX !== undefined && x > r.clampX) x = r.clampX - random(`tc${i}`) * 40;
        pts.push([x, r.topY + v * r.height]);
      } else {
        const x = r.from[0] + random(`gx${i}`) * (r.to[0] - r.from[0]);
        const u = (x - r.from[0]) / (r.to[0] - r.from[0]);
        pts.push([x, r.from[1] + u * (r.to[1] - r.from[1]) + Math.sin(x / r.waveLen) * r.wave + random(`gy${i}`) * r.jitter]);
      }
    }
  });
  const half = cfg.size / 2;
  return (
    <>
      {pts.map(([x, y], i) => {
        // each bulb listens to one band (bass / mid / high) on top of its own slow twinkle
        const tw = 0.5 + 0.5 * Math.sin(f * (0.05 + random(`tf${i}`) * 0.09) + i * 3);
        const m = cfg.react > 0 ? band(features, (["bass", "mid", "high"] as const)[i % 3], f + (i % 5)) : 0;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x - half, top: y - half, width: cfg.size, height: cfg.size, borderRadius: "50%", background: "radial-gradient(#fff3c4 0%, rgba(255,200,100,0.55) 35%, rgba(255,180,80,0) 70%)", opacity: Math.min(1, cfg.base + cfg.twinkle * tw + cfg.react * m), transform: cfg.react > 0 ? `scale(${0.85 + 0.5 * m})` : undefined, mixBlendMode: "screen" }}
          />
        );
      })}
    </>
  );
};

// Procedural fire over the logs: teardrop tongues that grow, lean and shrink on their own rhythms, bent by a fixed noise
// and lightly blurred; plus embers that rise and die. Gradients start nearly transparent so the flames grow out of the logs.
const Flames: React.FC<{ f: number; cfg: NonNullable<CozyConfig["fire"]> }> = ({ f, cfg }) => {
  const { area, base } = cfg;
  const tongue = (t: [number, number, number], i: number, scale: number, fill: string) => {
    const h = t[2] * scale * (0.72 + 0.55 * flick(f * 0.9, i * 2.3));
    const lean = Math.sin(f * 0.11 + i * 1.7) * 11 + Math.sin(f * 0.27 + i) * 5;
    const w = t[1] * (0.85 + 0.3 * flick(f, i + 7)) * (scale > 0.9 ? 1 : 0.55);
    const x = t[0] + Math.sin(f * 0.07 + i * 2) * 3;
    return (
      <path
        key={`${i}-${scale}`}
        d={`M ${x - w} ${base} C ${x - w * 1.1} ${base - h * 0.4}, ${x + lean * 0.4 - w * 0.3} ${base - h * 0.72}, ${x + lean} ${base - h} C ${x + lean * 0.4 + w * 0.3} ${base - h * 0.68}, ${x + w * 1.1} ${base - h * 0.4}, ${x + w} ${base} Z`}
        fill={fill}
      />
    );
  };
  const mask = cfg.mask === "right" ? "linear-gradient(to right, #000 78%, transparent)" : "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)";
  return (
    <div style={{ position: "absolute", left: area.x, top: area.y, width: area.w, height: area.h, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}>
      <svg width={area.w} height={area.h} viewBox={`${area.x} ${area.y} ${area.w} ${area.h}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="cz-fl" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb13a" stopOpacity="0.1" />
            <stop offset="0.22" stopColor="#ff9a22" stopOpacity="0.9" />
            <stop offset="0.7" stopColor="#f0581a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#c23a10" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cz-core" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffe9a0" stopOpacity="0.1" />
            <stop offset="0.45" stopColor="#ffd45e" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffbd4a" stopOpacity="0" />
          </linearGradient>
          <filter id="cz-lick" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.07" numOctaves="2" seed="8" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="15" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="1.1" />
          </filter>
        </defs>
        <g filter="url(#cz-lick)">
          {cfg.tongues.map((t, i) => tongue(t, i, 1, "url(#cz-fl)"))}
          {cfg.tongues.map((t, i) => tongue(t, i, 0.5, "url(#cz-core)"))}
        </g>
        {Array.from({ length: cfg.embers.count }, (_, i) => {
          const period = 50 + random(`ep${i}`) * 60;
          const age = ((f + random(`eo${i}`) * period) % period) / period;
          const x = cfg.embers.x0 + random(`ex${i}`) * cfg.embers.w + Math.sin(age * 6 + i) * 14 + age * 20;
          const y = base - 30 - age * (140 + random(`eh${i}`) * 130);
          return <circle key={i} cx={x} cy={y} r={1 + random(`er${i}`) * 1.6} fill="#ffb347" opacity={Math.sin(age * Math.PI) * 0.9} />;
        })}
      </svg>
    </div>
  );
};

const GLOW = {
  big: { blend: "screen" as const, shape: "50%", bg: "radial-gradient(circle, rgba(255,150,60,1) 0%, rgba(230,90,20,0.45) 40%, rgba(230,90,20,0) 70%)" },
  soft: { blend: "soft-light" as const, shape: "50%", bg: "radial-gradient(ellipse, rgba(255,170,80,1) 0%, rgba(255,140,50,0) 70%)" },
};

// Reels overlay: a short title at the start and a "full video on YouTube" card at the end. Kept inside the safe area
// (Reels UI covers roughly the top 150 px and the bottom 280 px of a 1080 x 1920 frame).
const ReelOverlay: React.FC<{ f: number; total: number; cfg: NonNullable<CozyConfig["reel"]> }> = ({ f, total, cfg }) => {
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
        <div style={{ fontFamily: SERIF_I, fontSize: 40 }}>{cfg.kicker}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.05, marginTop: 8 }}>{cfg.title}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(6,2,2,0) 55%, rgba(6,2,2,0.7) 100%)", opacity: card }} />
      <div style={{ ...base, top: 1360, opacity: card, transform: `translateY(${(1 - card) * 14}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, lineHeight: 1.1 }}>{cfg.cta[0]}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 66, lineHeight: 1.1 }}>{cfg.cta[1]}</div>
        <div style={{ fontFamily: SERIF_I, fontSize: 36, marginTop: 14 }}>{cfg.ctaSmall}</div>
      </div>
    </>
  );
};

export const CozyScene: React.FC<{ config: CozyConfig; features?: Features; total: number; reel?: boolean }> = ({ config: c, features, total, reel = false }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const seconds = total / FPS;
  const crop = c.view.crop ?? { x: 0, y: 0, w: c.master.w, h: c.master.h };
  const [outW, outH] = c.view.out;
  const S = Math.max(outW / crop.w, outH / crop.h);
  const asset = (name: string) => `${c.assets}/${name}`;
  const SRC = staticFile(asset("master.png"));

  // camera
  const z = c.camera.zoom;
  const k = z.mode === "linear" ? interpolate(f, [0, total], [z.from, z.to]) : z.base + z.amp * Math.sin((2 * Math.PI * t) / z.period + z.phase);
  const o = c.camera.origin;
  const origin: [number, number] =
    o.mode === "linear"
      ? [interpolate(f, [0, total], [o.from[0], o.to[0]]), interpolate(f, [0, total], [o.from[1], o.to[1]])]
      : [o.center[0] + o.swing[0] * Math.sin((2 * Math.PI * t) / o.periods[0] + o.phase[0]), o.center[1] + o.swing[1] * Math.sin((2 * Math.PI * t) / o.periods[1] + o.phase[1])];
  const fade = interpolate(f, [0, c.camera.fade[0], total - c.camera.fade[1], total], [0, 1, 1, 0]);

  const fire = flick(f, 1);
  const fire2 = flick(f, 4);
  const br = c.creature?.breath;
  const breath = br ? 1 + br.amp * Math.sin(t * br.speed) : 1;
  const vig = c.vignette;

  return (
    <AbsoluteFill style={{ background: "#120a08", overflow: "hidden" }}>
      {c.audio?.ambience && <Audio src={staticFile(asset(c.audio.ambience.file))} volume={c.audio.ambience.volume} />}
      {c.audio?.music && (
        <Audio
          src={staticFile(asset(c.audio.music.file))}
          volume={(fr) => c.audio!.music!.volume * interpolate(fr, [0, c.audio!.music!.fadeIn, total - c.audio!.music!.fadeOut, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      )}
      <div style={{ position: "absolute", left: (outW - crop.w * S) / 2, top: (outH - crop.h * S) / 2, width: crop.w, height: crop.h, overflow: "hidden", transformOrigin: "0 0", transform: `scale(${S})` }}>
        <div style={{ position: "absolute", left: -crop.x, top: -crop.y, width: c.master.w, height: c.master.h }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${origin[0]}px ${origin[1]}px`, transform: `scale(${k})`, opacity: fade }}>
            <img src={SRC} width={c.master.w} height={c.master.h} style={{ position: "absolute", left: 0, top: 0 }} />

            {c.fire && c.fire.enabled !== false && c.fire.plate && <Patch box={c.fire.plate.box} src={asset(c.fire.plate.src)} opacity={1} />}
            {c.fire && c.fire.enabled !== false && <Flames f={f} cfg={c.fire} />}

            {/* the creature: one group that breathes (scaled a hair from its belly line); small edited crops fade in over the same pixels */}
            {c.creature && br && (
              <div style={{ position: "absolute", inset: 0, transformOrigin: `${br.origin[0]}px ${br.origin[1]}px`, transform: `scaleY(${breath}) scaleX(${1 + (breath - 1) * 0.4})` }}>
                <div style={{ position: "absolute", left: br.body.x, top: br.body.y, width: br.body.w, height: br.body.h, overflow: "hidden", WebkitMaskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)", maskImage: "radial-gradient(ellipse 48% 50% at 50% 55%, #000 62%, transparent 100%)" }}>
                  <img src={SRC} width={c.master.w} height={c.master.h} style={{ position: "absolute", left: -br.body.x, top: -br.body.y }} />
                </div>
                {c.creature.patches.filter((p) => p.enabled !== false).map((p) => (
                  <Patch key={p.id} box={p.box} src={asset(p.src)} opacity={eventTimes(p.events, seconds).reduce((m, t0) => Math.max(m, pulse(f, t0, p.env[0], p.env[1], p.env[2])), 0)} />
                ))}
              </div>
            )}

            {asList(c.snow).map((sn, i) => <Snow key={i} f={f} cfg={sn} />)}
            {asList(c.rain).map((rn, i) => <Rain key={i} f={f} cfg={rn} />)}
            {asList(c.steam).map((st, i) => <Steam key={i} f={f} cfg={st} w={c.master.w} h={c.master.h} />)}
            {c.lights && <Lights f={f} cfg={c.lights} features={features} />}
            {c.candles &&
              c.candles.points.map(([x, y], i) => (
                <div
                  key={i}
                  style={{ position: "absolute", left: x - c.candles!.size / 2, top: y - c.candles!.size / 2, width: c.candles!.size, height: c.candles!.size, borderRadius: "50%", mixBlendMode: "screen", opacity: Math.min(1, c.candles!.base + c.candles!.flick * flick(f, 10 + i * 3) + c.candles!.mid * band(features, "mid", f) + c.candles!.onset * band(features, "onset", f)), background: "radial-gradient(rgba(255,210,120,0.9) 0%, rgba(255,150,50,0.3) 45%, rgba(255,150,50,0) 72%)" }}
                />
              ))}

            {/* firelight: breathes over the floor, the creature and the nearby wall */}
            {c.glows?.map((g, i) => (
              <div key={i} style={{ position: "absolute", left: g.box.x, top: g.box.y, width: g.box.w, height: g.box.h, borderRadius: GLOW[g.kind].shape, mixBlendMode: GLOW[g.kind].blend, opacity: g.base + g.amp * (g.driver === "fire" ? fire : fire2), backgroundImage: GLOW[g.kind].bg }} />
            ))}
          </div>
        </div>
        {vig && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${vig.at[0]}% ${vig.at[1]}%, rgba(0,0,0,0) ${vig.from}%, rgba(8,3,2,${vig.alpha}) 100%)`, pointerEvents: "none" }} />}
      </div>
      {reel && c.reel && <ReelOverlay f={f} total={total} cfg={c.reel} />}
    </AbsoluteFill>
  );
};
