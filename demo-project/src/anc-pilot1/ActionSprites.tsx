import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SPRITES } from "./sprites";

// Cut-out animation from AI-generated pieces: an empty background plate plus pose sprites (all face right, feet at
// the bottom edge, created by scripts/prep_sprites.py). Walking and running swap between two stride poses with a bob,
// fights swap to a thrust / hit / fall pose. Sprite `size` is the height of an upright figure in screen px.
const ASSETS = "anc-pilot1/action";
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
  <Img src={staticFile(`${ASSETS}/${name}.png`)} style={{ position: "absolute", left: dx - 40, top: 0, width: 1960, height: 1080, transform: `scale(${zoom})`, transformOrigin: "50% 80%" }} />
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

// ---------- scene 1: the army walks away, three Spartans stay ----------
export const SceneWalkAway: React.FC = () => {
  const f = useCurrentFrame();
  const lanes = [
    { y: 790, size: 300 },
    { y: 860, size: 370 },
    { y: 940, size: 450 },
  ];
  const walkers = Array.from({ length: 11 }, (_, i) => ({ ...lanes[i % 3], x0: 560 + i * 170 + (i % 2) * 30, ph: i * 3 }));
  walkers.sort((a, b) => a.y - b.y);
  return (
    <Stage zoom={[1.0, 1.07]}>
      <Bg name="bg_pass_dawn" dx={-f * 0.12} />
      {walkers.map((w, i) => (
        <Sprite key={i} name={`g_walk_${step(f, w.ph, 10)}`} x={w.x0 - f * 3.2} y={w.y + bob(f, w.ph, 10, 7)} size={w.size} flip />
      ))}
      {[0, 1, 2].map((i) => (
        <Sprite key={"s" + i} name="g_idle" x={1380 + i * 190} y={1040} size={650 - i * 30} flip squash={1 + Math.sin(f / 22 + i) * 0.008} />
      ))}
    </Stage>
  );
};

// ---------- scene 4: the shield wall holds while Persian waves run in and fall ----------
const C = [60, 112, 164]; // contact frame of each wave
export const SceneShieldWall: React.FC = () => {
  const f = useCurrentFrame();
  const thrusting = C.some((c) => f >= c + 3 && f < c + 12);
  const wall = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 1240 + i * 118 - (i % 2) * 8, y: 905 + (i % 2) * 26, size: 520 }));
  const pers: { wave: number; k: number; y: number; x0: number; xc: number; fall: boolean }[] = [];
  C.forEach((c, w) => [0, 1, 2, 3].forEach((k) => pers.push({ wave: w, k, y: [885, 915, 900, 935][k], x0: -200 - k * 80, xc: 1000 - k * 85 - w * 30, fall: k % 3 !== 2 })));
  pers.sort((a, b) => a.y - b.y);
  const persian = (p: (typeof pers)[number]) => {
    const c = C[p.wave];
    const t = f - c;
    const runStart = c - 52;
    if (f < runStart) return null;
    const speed = (p.xc - p.x0) / 52;
    const hue = [1, 0.92, 1.08, 0.85][p.k]; // slight brightness variation so the wave does not look cloned
    const key = `${p.wave}${p.k}`;
    if (t < 0) {
      const x = p.x0 + speed * (f - runStart);
      return <Sprite key={key} name={`p_run_${step(f, p.k * 2, 5)}`} x={x} y={p.y + bob(f, p.k * 2, 5, 12)} size={480} tone={hue} />;
    }
    if (t < 9) {
      const x = p.xc - t * 6;
      return <Sprite key={key} name="p_hit" x={x} y={p.y} size={480} rot={-6 - t} tone={hue} />;
    }
    const xh = p.xc - 54;
    if (p.fall) {
      return <Sprite key={key} name="p_fall" x={xh - 20} y={p.y + 10} size={480} tone={hue} opacity={interpolate(t, [9, 13], [0, 1], clamp)} squash={interpolate(t, [9, 16], [1.15, 1], clamp)} />;
    }
    const x = xh - (t - 9) * 12;
    return <Sprite key={key} name={`p_run_${step(f, p.k, 5)}`} x={x} y={p.y + bob(f, p.k, 5, 12)} size={480} flip tone={hue} />;
  };
  return (
    <Stage zoom={[1.0, 1.1]} origin="1250px 820px">
      <Bg name="bg_pass_dawn" />
      {pers.map(persian)}
      {wall.map((g, i) => (
        <Sprite key={i} name={thrusting ? "g_thrust" : "g_idle"} x={g.x - (thrusting ? 14 : 0)} y={g.y} size={g.size} flip squash={1 + Math.sin(f / 9 + i) * 0.006} />
      ))}
      {C.map((c) => (
        <Puff key={c} x={960} y={950} at={c + 2} f={f} size={170} />
      ))}
    </Stage>
  );
};

// ---------- scene 10: many nations march ----------
const NATIONS = ["p", "e", "i", "k", "s"];
export const SceneMarch: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { y: 800, size: 300, n: 11, gap: 150, v: 2.4 },
    { y: 890, size: 380, n: 9, gap: 190, v: 3.0 },
    { y: 990, size: 470, n: 8, gap: 230, v: 3.6 },
  ];
  const all: { x0: number; y: number; size: number; v: number; nat: string; ph: number }[] = [];
  rows.forEach((r, ri) => Array.from({ length: r.n }, (_, i) => all.push({ x0: -100 + i * r.gap + ri * 40, y: r.y, size: r.size, v: r.v, nat: NATIONS[(i + ri * 2) % NATIONS.length], ph: i * 3 + ri })));
  return (
    <Stage zoom={[1.0, 1.06]}>
      <Bg name="bg_road_day" dx={-f * 0.35} />
      {all.map((w, i) => (
        <Sprite key={i} name={`${w.nat}_walk_${step(f, w.ph, 11)}`} x={w.x0 + f * w.v + 140} y={w.y + bob(f, w.ph, 11, 8)} size={w.size} />
      ))}
    </Stage>
  );
};

export const ACTION_SCENES: Record<number, React.FC> = { 1: SceneWalkAway, 4: SceneShieldWall, 10: SceneMarch };
