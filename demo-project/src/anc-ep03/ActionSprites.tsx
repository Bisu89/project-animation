import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SPRITES } from "../anc-ep02/sprites";

// Alesia sprite scenes (sprites reused from episode 2). Cut-out animation from AI-generated pieces: an empty background plate plus pose sprites (all face right, feet at
// the bottom edge, created by scripts/prep_sprites.py). Walking and running swap between two stride poses with a bob,
// fights swap to a thrust / hit / fall pose. Sprite `size` is the height of an upright figure in screen px.
const ASSETS = "anc-ep02/action"; // sprites are shared with episode 2
const BG_ASSETS = "anc-ep03/action";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type SpriteProps = { name: string; x: number; y: number; size: number; flip?: boolean; rot?: number; opacity?: number; squash?: number; tone?: number; shadow?: boolean };

const Sprite: React.FC<SpriteProps> = ({ name, x, y, size, flip, rot = 0, opacity = 1, squash = 1, tone = 1, shadow = true }) => {
  const sp = SPRITES[name];
  if (!sp) return null;
  const k = size / 900;
  const w = sp.w * k;
  const h = sp.h * k;
  return (
    <>
      {shadow && <div style={{ position: "absolute", left: x - w * 0.42, top: y - h * 0.035, width: w * 0.84, height: h * 0.07, borderRadius: "50%", background: "rgba(0,0,0,0.32)", filter: "blur(6px)", opacity }} />}
      <Img
        src={staticFile(`${ASSETS}/${name}.png`)}
        style={{
          position: "absolute",
          left: x - w / 2,
          top: y - h,
          width: w,
          height: h,
          opacity,
          filter: tone !== 1 ? `brightness(${tone})` : undefined,
          transformOrigin: "50% 100%",
          transform: `scaleX(${flip ? -1 : 1}) scaleY(${squash}) rotate(${rot * (flip ? -1 : 1)}deg)`,
        }}
      />
    </>
  );
};

const Bg: React.FC<{ name: string; dx?: number; zoom?: number }> = ({ name, dx = 0, zoom = 1 }) => (
  <Img src={staticFile(`${BG_ASSETS}/${name}.png`)} style={{ position: "absolute", left: dx - 40, top: 0, width: 1960, height: 1080, transform: `scale(${zoom})`, transformOrigin: "50% 80%" }} />
);

// dust puff that grows and fades
const Puff: React.FC<{ x: number; y: number; at: number; f: number; size?: number }> = ({ x, y, at, f, size = 120 }) => {
  const t = f - at;
  if (t < 0 || t > 26) return null;
  const s = interpolate(t, [0, 26], [0.4, 1.5], clamp);
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size * 0.7, width: size, height: size * 0.7, borderRadius: "50%", background: "rgba(215,195,150,0.55)", filter: "blur(10px)", transform: `scale(${s})`, opacity: interpolate(t, [0, 26], [0.75, 0], clamp) }} />;
};

// two-pose walk: swap every `every` frames, small bob
const step = (f: number, phase: number, every: number) => (Math.floor((f + phase) / every) % 2 === 0 ? "a" : "b");
const bob = (f: number, phase: number, every: number, amp: number) => -Math.abs(Math.sin(((f + phase) / every) * Math.PI)) * amp;

const Stage: React.FC<{ children: React.ReactNode; zoom: [number, number]; origin?: string }> = ({ children, zoom, origin = "960px 800px" }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 240], zoom, clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#111" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: origin }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- assault: Gauls storm the wall in waves, the Romans hold ----------
const WAVES = [64, 118, 172];
const Assault: React.FC<{ bg: string; dir: 1 | -1 }> = ({ bg, dir }) => {
  const f = useCurrentFrame();
  const thrusting = WAVES.some((c) => f >= c + 3 && f < c + 12);
  const X = (x: number) => (dir === 1 ? x : 1920 - x);
  const wall = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 1240 + i * 118 - (i % 2) * 8, y: 905 + (i % 2) * 26 }));
  const gauls: { wave: number; k: number; y: number; x0: number; xc: number; fall: boolean }[] = [];
  WAVES.forEach((c, w) => [0, 1, 2, 3].forEach((k) => gauls.push({ wave: w, k, y: [885, 915, 900, 935][k], x0: -200 - k * 80, xc: 1000 - k * 85 - w * 30, fall: k % 3 !== 2 })));
  gauls.sort((a, b) => a.y - b.y);
  const gaul = (p: (typeof gauls)[number]) => {
    const c = WAVES[p.wave];
    const t = f - c;
    const runStart = c - 52;
    if (f < runStart) return null;
    const speed = (p.xc - p.x0) / 52;
    const key = `${p.wave}${p.k}`;
    const tone = [1, 0.92, 1.08, 0.86][p.k];
    if (t < 0) return <Sprite key={key} name={`c_run_${step(f, p.k * 2, 5)}`} x={X(p.x0 + speed * (f - runStart))} y={p.y + bob(f, p.k * 2, 5, 12)} size={480} flip={dir === -1} tone={tone} />;
    if (t < 9) return <Sprite key={key} name="c_hit" x={X(p.xc - t * 6)} y={p.y} size={480} rot={-5 - t} flip={dir === -1} tone={tone} />;
    const xh = p.xc - 54;
    if (p.fall) return <Sprite key={key} name="c_fall" x={X(xh - 20)} y={p.y + 10} size={480} flip={dir === -1} tone={tone} opacity={interpolate(t, [9, 13], [0, 1], clamp)} squash={interpolate(t, [9, 16], [1.15, 1], clamp)} />;
    return <Sprite key={key} name={`c_run_${step(f, p.k, 5)}`} x={X(xh - (t - 9) * 12)} y={p.y + bob(f, p.k, 5, 12)} size={480} flip={dir === 1} tone={tone} />;
  };
  return (
    <Stage zoom={[1.0, 1.1]} origin={dir === 1 ? "1250px 820px" : "670px 820px"}>
      <Bg name={bg} />
      {gauls.map(gaul)}
      {wall.map((g, i) => (
        <Sprite key={i} name={thrusting ? "r_thrust" : "r_idle"} x={X(g.x - (thrusting ? 14 : 0))} y={g.y} size={500} flip={dir === 1} squash={1 + Math.sin(f / 9 + i) * 0.006} />
      ))}
      {WAVES.map((c) => (
        <Puff key={c} x={X(1060)} y={950} at={c + 2} f={f} size={170} />
      ))}
    </Stage>
  );
};
export const SceneAssault: React.FC = () => <Assault bg="bg_alesia_wall_night" dir={1} />;
export const SceneAssault2: React.FC = () => <Assault bg="bg_alesia_wall_day" dir={-1} />;

// ---------- reserves: Romans hurry along the wall to the threatened point ----------
export const SceneReserves: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { y: 830, size: 330, n: 9, gap: 170, v: 4.2 },
    { y: 930, size: 430, n: 7, gap: 230, v: 5.0 },
  ];
  const all: { x0: number; y: number; size: number; v: number; ph: number }[] = [];
  rows.forEach((r, ri) => Array.from({ length: r.n }, (_, i) => all.push({ x0: 2100 + i * r.gap + ri * 60, y: r.y, size: r.size, v: r.v, ph: i * 2 + ri })));
  return (
    <Stage zoom={[1.0, 1.06]}>
      <Bg name="bg_alesia_wall_night" />
      {all.map((w, i) => (
        <Sprite key={i} name={`r_walk_${step(f, w.ph, 7)}`} x={w.x0 - f * w.v} y={w.y + bob(f, w.ph, 7, 10)} size={w.size} flip />
      ))}
    </Stage>
  );
};

export const ACTION: Record<string, React.FC> = { assault: SceneAssault, assault2: SceneAssault2, reserves: SceneReserves };
