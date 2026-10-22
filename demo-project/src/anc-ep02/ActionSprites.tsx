import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SPRITES } from "./sprites";

// Cannae sprite scenes. Cut-out animation from AI-generated pieces: an empty background plate plus pose sprites (all face right, feet at
// the bottom edge, created by scripts/prep_sprites.py). Walking and running swap between two stride poses with a bob,
// fights swap to a thrust / hit / fall pose. Sprite `size` is the height of an upright figure in screen px.
const ASSETS = "anc-ep02/action";
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

// ---------- march: the Roman column leaves camp ----------
export const SceneMarch: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { y: 790, size: 300, n: 12, gap: 150, v: 2.3 },
    { y: 880, size: 380, n: 10, gap: 185, v: 2.9 },
    { y: 980, size: 470, n: 8, gap: 230, v: 3.5 },
  ];
  const all: { x0: number; y: number; size: number; v: number; ph: number }[] = [];
  rows.forEach((r, ri) => Array.from({ length: r.n }, (_, i) => all.push({ x0: -150 + i * r.gap + ri * 50, y: r.y, size: r.size, v: r.v, ph: i * 3 + ri })));
  return (
    <Stage zoom={[1.0, 1.06]}>
      <Bg name="bg_plain_day" dx={-f * 0.3} />
      {all.map((w, i) => (
        <Sprite key={i} name={`r_walk_${step(f, w.ph, 11)}`} x={w.x0 + f * w.v + 140} y={w.y + bob(f, w.ph, 11, 8)} size={w.size} />
      ))}
    </Stage>
  );
};

// ---------- march2: Hannibal's mixed army ----------
export const SceneMarch2: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { y: 800, size: 300, n: 11, gap: 160, v: 2.4 },
    { y: 890, size: 380, n: 9, gap: 200, v: 3.0 },
    { y: 990, size: 470, n: 7, gap: 250, v: 3.6 },
  ];
  const all: { x0: number; y: number; size: number; v: number; kind: string; ph: number }[] = [];
  rows.forEach((r, ri) => Array.from({ length: r.n }, (_, i) => all.push({ x0: -120 + i * r.gap + ri * 45, y: r.y, size: r.size, v: r.v, kind: (i + ri) % 3 === 0 ? "c" : "l", ph: i * 3 + ri })));
  return (
    <Stage zoom={[1.0, 1.06]}>
      <Bg name="bg_plain_day" dx={-f * 0.3} />
      {all.map((w, i) => (
        <Sprite key={i} name={w.kind === "l" ? `l_walk_${step(f, w.ph, 11)}` : `c_run_${step(f, w.ph, 9)}`} x={w.x0 + f * w.v + 140} y={w.y + bob(f, w.ph, w.kind === "l" ? 11 : 9, 8)} size={w.size} />
      ))}
    </Stage>
  );
};

// ---------- advance: the Romans push the Gallic centre back ----------
const PUSH = [70, 150, 230];
export const SceneAdvance: React.FC = () => {
  const f = useCurrentFrame();
  const thrust = PUSH.some((c) => f >= c && f < c + 9);
  const romans = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 360 + i * 110 + f * 1.1, y: 900 + (i % 2) * 28 }));
  const gauls = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 940 + i * 120 + f * 1.1 + Math.min(1, f / 60) * 40, y: 905 + (i % 2) * 26 }));
  return (
    <Stage zoom={[1.0, 1.08]} origin="960px 820px">
      <Bg name="bg_plain_dust" />
      {gauls.map((g, i) => (
        <Sprite key={"g" + i} name={`c_walk_${step(f, i * 2, 14)}`} x={g.x} y={g.y + bob(f, i * 2, 14, 5)} size={500} flip />
      ))}
      {romans.map((r, i) => (
        <Sprite key={"r" + i} name={thrust ? "r_thrust" : "r_idle"} x={r.x + (thrust ? 12 : 0)} y={r.y} size={500} squash={1 + Math.sin(f / 8 + i) * 0.006} />
      ))}
      {PUSH.map((c) => (
        <Puff key={c} x={900 + c * 1.1} y={940} at={c + 2} f={f} size={160} />
      ))}
    </Stage>
  );
};

// ---------- flank: the Libyans close in on both sides ----------
export const SceneFlank: React.FC = () => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / 90);
  const thrust = f >= 90 && Math.floor((f - 90) / 12) % 2 === 0;
  const romans = [0, 1, 2, 3, 4].map((i) => ({ x: 800 + i * 70 - t * 40 + (i % 2) * 6, y: 920 + (i % 3) * 20 }));
  return (
    <Stage zoom={[1.0, 1.08]}>
      <Bg name="bg_plain_dust" />
      {[0, 1, 2].map((i) => (
        <Sprite key={"ll" + i} name={f < 90 ? `l_walk_${step(f, i * 3, 10)}` : thrust ? "l_thrust" : "l_walk_a"} x={-200 + i * 150 + t * 560} y={930 + (i % 2) * 22} size={480} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sprite key={"lr" + i} name={f < 90 ? `l_walk_${step(f, i * 3, 10)}` : thrust ? "l_thrust" : "l_walk_a"} x={2100 - i * 150 - t * 560} y={930 + (i % 2) * 22} size={480} flip />
      ))}
      {romans.map((r, i) => (
        <Sprite key={"rr" + i} name="r_idle" x={r.x} y={r.y} size={480} flip={i % 2 === 1} squash={1 + Math.sin(f / 7 + i) * 0.008} />
      ))}
      <Puff x={560} y={960} at={92} f={f} size={150} />
      <Puff x={1360} y={960} at={92} f={f} size={150} />
    </Stage>
  );
};

export const ACTION: Record<string, React.FC> = { march: SceneMarch, march2: SceneMarch2, advance: SceneAdvance, flank: SceneFlank };
