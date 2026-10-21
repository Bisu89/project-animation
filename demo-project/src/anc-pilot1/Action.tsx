import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Hero, SKIN } from "../stickman/cast";
import type { Preset } from "../stickman/cast";
import { fall, walkTo } from "../stickman/moves";
import type { MoveFn } from "../stickman/moves";
import { At } from "../stickman/props";
import { COL, Dust } from "../stickman/fx";
import { ArrowVolley, Wind } from "../stickman/weather";

// Animated scenes for the pilot: our own vector soldiers (engine Hero = big head, thin limbs, thick ink outline)
// on a layered pine-forest backdrop. Greeks = bronze helmet + red tunic + round shield, Persians = blue/gold, no helmet.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const INK = COL.ink;

// ---------- characters ----------
const GREEK = (i: number): Preset => ({
  hair: "helmet",
  hairColor: "#a9741f",
  skin: [SKIN.light, SKIN.olive, SKIN.tan][i % 3],
  shape: (["round", "square", "oval"] as const)[i % 3],
  outfit: "soldier",
  outfitColor: "#b3262e",
  trim: "#6b1a1f",
  emotion: "stern",
});
const PERSIAN = (i: number): Preset => ({
  hair: (["short", "bun", "ponytail"] as const)[i % 3],
  hairColor: "#1b1b1b",
  skin: [SKIN.olive, SKIN.tan, SKIN.brown][i % 3],
  shape: (["round", "oval", "square"] as const)[i % 3],
  outfit: "soldier",
  outfitColor: ["#2c5aa0", "#6a3f8f", "#2c5aa0"][i % 3],
  trim: "#d8a93c",
  emotion: "angry",
});
// the nations of the empire: one look each
const NATIONS: Preset[] = [
  { hair: "short", hairColor: "#1b1b1b", skin: SKIN.olive, shape: "round", outfit: "soldier", outfitColor: "#2c5aa0", trim: "#d8a93c", emotion: "neutral" }, // Persian
  { hair: "bun", hairColor: "#1b1b1b", skin: SKIN.tan, shape: "oval", outfit: "soldier", outfitColor: "#efe7d2", trim: "#b8863b", emotion: "neutral" }, // Egyptian
  { hair: "bun", hairColor: "#2a1a0a", skin: SKIN.brown, shape: "round", outfit: "soldier", outfitColor: "#f2efe6", trim: "#b3262e", emotion: "neutral" }, // Indian
  { hair: "afro", hairColor: "#1b1b1b", skin: SKIN.dark, shape: "round", outfit: "soldier", outfitColor: "#b8863b", trim: "#5a3a1e", emotion: "neutral" }, // Ethiopian
  { hair: "ponytail", hairColor: "#6a4a2a", skin: SKIN.light, shape: "square", outfit: "soldier", outfitColor: "#7a5232", trim: "#3a2a1a", emotion: "neutral" }, // Scythian
];

// ---------- held gear ----------
const Spear: React.FC<{ len?: number }> = ({ len = 250 }) => (
  <g>
    <rect x={-3.5} y={-len} width={7} height={len + 70} rx={3} fill="#8a6a3a" stroke={INK} strokeWidth={4} />
    <path d={`M-8,${-len + 2} L0,${-len - 36} L8,${-len + 2} Z`} fill="#d9d9d9" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
const Hoplon: React.FC<{ color?: string; wicker?: boolean }> = ({ color = "#b3262e", wicker }) => (
  <g>
    <circle r={58} fill={wicker ? "#b08a4e" : color} stroke={INK} strokeWidth={5} />
    <circle r={44} fill="none" stroke={wicker ? "#7a5a2e" : "#d8a93c"} strokeWidth={5} />
    {wicker ? (
      <path d="M-40,-20 L40,-20 M-46,0 L46,0 M-40,20 L40,20 M-20,-40 L-20,40 M0,-46 L0,46 M20,-40 L20,40" stroke="#7a5a2e" strokeWidth={4} />
    ) : (
      <circle r={12} fill="#d8a93c" stroke={INK} strokeWidth={4} />
    )}
  </g>
);

// ---------- backdrop ----------
type Tone = { sky: [string, string]; sun?: string; far: string; mid: string; near: string; ground: [string, string] };
export const TONES: Record<string, Tone> = {
  dawn: { sky: ["#7f8e98", "#d5c4a2"], sun: "#f3e2b8", far: "#6d7c78", mid: "#4a5d52", near: "#2f4138", ground: ["#7a6b4c", "#4f4430"] },
  day: { sky: ["#9fb9c4", "#e7d3a0"], sun: "#fff1c4", far: "#7f9a8a", mid: "#5d7a63", near: "#3b5642", ground: ["#b79a60", "#8a7344"] },
};

const Pines: React.FC<{ seed: string; base: number; hMin: number; hMax: number; step: number; color: string; x0?: number; x1?: number }> = ({ seed, base, hMin, hMax, step, color, x0 = -100, x1 = 2020 }) => {
  const out: React.ReactNode[] = [];
  for (let x = x0, k = 0; x < x1; x += step * (0.7 + random(seed + "s" + k) * 0.6), k++) {
    const h = hMin + random(seed + k) * (hMax - hMin);
    const w = h * 0.34;
    out.push(<path key={k} d={`M${x},${base} L${x - w},${base} L${x - w * 0.55},${base - h * 0.4} L${x - w * 0.8},${base - h * 0.4} L${x - w * 0.3},${base - h * 0.75} L${x - w * 0.5},${base - h * 0.75} L${x},${base - h} L${x + w * 0.5},${base - h * 0.75} L${x + w * 0.3},${base - h * 0.75} L${x + w * 0.8},${base - h * 0.4} L${x + w * 0.55},${base - h * 0.4} L${x + w},${base} Z`} fill={color} />);
  }
  return <g>{out}</g>;
};

export const Backdrop: React.FC<{ tone: keyof typeof TONES; cliff?: boolean; sea?: boolean; pan?: number }> = ({ tone, cliff, sea, pan = 0 }) => {
  const t = TONES[tone];
  return (
    <g>
      <defs>
        <linearGradient id={"sky" + tone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.sky[0]} />
          <stop offset="1" stopColor={t.sky[1]} />
        </linearGradient>
        <linearGradient id={"gr" + tone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.ground[0]} />
          <stop offset="1" stopColor={t.ground[1]} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#sky${tone})`} />
      {t.sun && <circle cx={1320} cy={380} r={150} fill={t.sun} opacity={0.35} />}
      <g transform={`translate(${-pan * 0.15} 0)`}>
        <path d="M-100,720 Q300,560 700,690 T1500,660 T2100,700 L2100,860 L-100,860 Z" fill={t.far} />
        <Pines seed="far" base={760} hMin={90} hMax={170} step={34} color={t.far} />
      </g>
      {sea && <rect x={0} y={700} width={1920} height={120} fill="#5f86a0" opacity={0.85} />}
      <g transform={`translate(${-pan * 0.4} 0)`}>
        <Pines seed="mid" base={812} hMin={170} hMax={290} step={52} color={t.mid} />
      </g>
      {cliff && (
        <path d="M-60,860 L-60,150 Q120,120 250,230 Q420,330 480,520 Q560,700 700,860 Z" fill="#5a4f45" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      )}
      <g transform={`translate(${-pan * 0.75} 0)`}>
        <Pines seed="near" base={850} hMin={260} hMax={420} step={190} color={t.near} x0={-200} x1={2200} />
      </g>
      <rect x={0} y={826} width={1920} height={254} fill={`url(#gr${tone})`} />
      <path d="M0,826 L1920,826" stroke={INK} strokeWidth={5} opacity={0.55} />
      {Array.from({ length: 26 }, (_, i) => (
        <ellipse key={i} cx={random("pb" + i) * 1920} cy={880 + random("pc" + i) * 170} rx={26 + random("pd" + i) * 44} ry={7 + random("pe" + i) * 9} fill="#00000022" />
      ))}
    </g>
  );
};

// sway of a distant dust haze; used to give still frames a little life
const Frame: React.FC<{ children: React.ReactNode; zoom: [number, number]; panX?: [number, number] }> = ({ children, zoom, panX = [0, 0] }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 240], zoom, clamp);
  const x = interpolate(f, [0, 240], panX, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1b1d22" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", overflow: "visible" }}>
        <g transform={`translate(${960 + x} 860) scale(${z}) translate(-960 -860)`}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Scene A: the Greek army walks away, a few Spartans stay ----------
export const SceneWalkAway: React.FC = () => {
  const f = useCurrentFrame();
  const walkers = Array.from({ length: 10 }, (_, i) => ({
    x0: 760 + i * 190 + (i % 3) * 40,
    lane: [850, 874, 838][i % 3],
    s: [1.0, 1.08, 0.94][i % 3],
  }));
  const order = [...walkers].sort((a, b) => a.lane - b.lane);
  return (
    <Frame zoom={[1.0, 1.08]} panX={[0, -40]}>
      <Backdrop tone="dawn" cliff sea pan={f * 0.4} />
      {order.map((w, i) => (
        <Hero key={i} f={f} who={GREEK(i)} x={w.x0} ground={w.lane} scale={w.s} facing={-1} seed={i + 1} emotion="worried" moves={[walkTo(0, 240, w.x0 - 760)]}
          held={(j) => (
            <>
              <At x={j.lHand[0]} y={j.lHand[1]} s={w.s * 0.7}><Hoplon /></At>
              <At x={j.rHand[0]} y={j.rHand[1]} s={w.s * 0.8} r={-8}><Spear /></At>
            </>
          )}
        />
      ))}
      {/* the ones who stay, in front */}
      {[0, 1, 2].map((i) => (
        <Hero key={"s" + i} f={f} who={{ ...GREEK(i + 4), emotion: "stern" }} x={1400 + i * 170} ground={880} scale={1.2} facing={-1} seed={20 + i}
          held={(j) => (
            <>
              <At x={j.lHand[0]} y={j.lHand[1]} s={0.85}><Hoplon /></At>
              <At x={j.rHand[0]} y={j.rHand[1]} s={0.95} r={-4}><Spear /></At>
            </>
          )}
        />
      ))}
      <Wind f={f} seed="w3" count={34} angle={84} speed={1.2} color="#ffffff" opacity={0.16} />
    </Frame>
  );
};

// ---------- Scene B: the shield wall holds, Persians run in and fall ----------
const WAVES = [66, 116, 164]; // frame of contact for each wave
export const SceneShieldWall: React.FC = () => {
  const f = useCurrentFrame();
  const WALL_X = [1170, 1290, 1410, 1530, 1650];
  const thrust = (t: number) => WAVES.reduce((s, c) => s + (t > c + 2 && t < c + 16 ? Math.sin(((t - c - 2) / 14) * Math.PI) : 0), 0);
  const persians: { x0: number; lane: number; wave: number; fate: "fall" | "flee"; i: number }[] = [];
  WAVES.forEach((c, w) => {
    [0, 1, 2, 3].forEach((k) => persians.push({ x0: -100 - k * 34, lane: [840, 864, 852, 876][k], wave: w, fate: k % 3 === 2 ? "flee" : "fall", i: w * 4 + k }));
  });
  const order = [...persians].sort((a, b) => a.lane - b.lane);
  return (
    <Frame zoom={[1.0, 1.1]} panX={[40, -30]}>
      <Backdrop tone="dawn" cliff sea pan={0} />
      {order.map((p) => {
        const c = WAVES[p.wave];
        const run0 = c - 60;
        const xc = 1090 - (p.lane - 840) * 0.4 - (p.i % 4) * 14 - p.wave * 22;
        const moves: MoveFn[] = [walkTo(run0, c, xc, true)];
        if (p.fate === "fall") moves.push(fall(c + 6 + (p.i % 4) * 2));
        else moves.push(walkTo(c + 10, c + 50, xc - 300, true), walkTo(c + 50, c + 80, xc - 700, true));
        return (
          <Hero key={p.i} f={f} who={PERSIAN(p.i)} x={p.x0} ground={p.lane} scale={0.98} facing={1} seed={p.i + 40}
            moves={moves}
            held={(j) => (
              <>
                <At x={j.lHand[0]} y={j.lHand[1]} s={0.62}><Hoplon wicker /></At>
                <At x={j.rHand[0]} y={j.rHand[1]} s={0.7} r={62}><Spear len={170} /></At>
              </>
            )}
          />
        );
      })}
      {WALL_X.map((x, i) => (
        <Hero key={"g" + i} f={f} who={GREEK(i)} x={x} ground={858} scale={1.12} facing={-1} seed={i + 90}
          mod={(t, p) => ({ ...p, lean: 10, ll1: -24, ll2: 12, rl1: 22, rl2: 12, la1: 40, la2: -30, ra1: 66 + thrust(t) * 22, ra2: 6, x: p.x - thrust(t) * 14 })}
          held={(j) => (
            <>
              <At x={j.lHand[0] - 8} y={j.lHand[1] - 6} s={0.95}><Hoplon /></At>
              <At x={j.rHand[0]} y={j.rHand[1]} s={0.95} r={-78 - thrust(f) * 4}><Spear len={230} /></At>
            </>
          )}
        />
      ))}
      {WAVES.map((c) => (
        <Dust key={c} x={1060} y={866} at={c + 2} f={f} spread={90} />
      ))}
      <ArrowVolley f={f} from={{ x: -80, y: 640 }} to={{ x: 1450, y: 840 }} seed="b1" count={16} life={50} arc={300} spread={160} at={20} stagger={10} />
      <ArrowVolley f={f} from={{ x: -80, y: 640 }} to={{ x: 1450, y: 840 }} seed="b2" count={16} life={50} arc={300} spread={160} at={110} stagger={10} />
      <Wind f={f} seed="w5" count={28} angle={84} speed={1.3} color="#ffffff" opacity={0.14} />
    </Frame>
  );
};

// ---------- Scene C: the army of many nations marches ----------
export const SceneMarch: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { lane: 836, s: 0.82, n: 9, gap: 175, off: 40 },
    { lane: 858, s: 0.96, n: 8, gap: 200, off: 140 },
    { lane: 884, s: 1.1, n: 7, gap: 230, off: -60 },
  ];
  const all: { x0: number; lane: number; s: number; k: number }[] = [];
  rows.forEach((r, ri) => Array.from({ length: r.n }, (_, i) => all.push({ x0: r.off + i * r.gap, lane: r.lane, s: r.s, k: i + ri * 2 })));
  const sorted = [...all].sort((a, b) => a.lane - b.lane);
  return (
    <Frame zoom={[1.0, 1.06]} panX={[0, 30]}>
      <Backdrop tone="day" pan={f * 0.5} />
      {sorted.map((w, i) => (
        <Hero key={i} f={f} who={NATIONS[w.k % NATIONS.length]} x={w.x0} ground={w.lane} scale={w.s} facing={1} seed={i + 3} moves={[walkTo(0, 250, w.x0 + 720)]}
          held={(j) => (
            <At x={j.rHand[0]} y={j.rHand[1]} s={w.s * 0.8} r={6}><Spear len={w.k % 2 ? 230 : 200} /></At>
          )}
        />
      ))}
      <Dust x={900} y={880} at={0} f={f} spread={600} />
      <Wind f={f} seed="w7" count={36} angle={84} speed={1} color="#f4e3b0" opacity={0.2} />
    </Frame>
  );
};

export const ENGINE_SCENES: Record<number, React.FC> = { 1: SceneWalkAway, 4: SceneShieldWall, 10: SceneMarch };

// cross-dissolve wrapper so an animated scene blends with the pictures around it like KenBurns does
export const EngineFade: React.FC<{ dur: number; fade: number; comp: React.FC }> = ({ dur, fade, comp: C }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, fade, dur - fade, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <C />
    </AbsoluteFill>
  );
};
