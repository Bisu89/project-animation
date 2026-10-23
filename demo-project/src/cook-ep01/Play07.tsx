import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import SPRITES from "./sprites.json"; // written by scripts/cook_sprites.py

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number) => t * t * (3 - 2 * t);
const FPS = 30;
type Sz = { w: number; h: number };
const sz = (n: string) => (SPRITES as Record<string, Sz>)[n];

// Scene 7: rice is poured from a tipped bowl into the wok while the spatula starts to mix.
// Coordinates are on the 1080x1920 frame; tune BOWL/WOK after the real pictures are in.
const WOK = { x: 560, y: 1200, rx: 300 }; // where the grains land
// The bowl picture is already tipped about 45 degrees: a = 0 is the pouring pose, positive turns it upright (clockwise).
const BOWL = { w: 700, from: { x: 1150, y: 150, a: 38 }, pour: { x: 699, y: 803, a: 0 }, to: { x: 1150, y: 150, a: 38 } };
const LIP = { x: -0.255, y: 0.28 }; // rice pours from here, as a fraction of the bowl width from its centre
const SPAT = { w: 600, x: 890, y: 1120 };
const POUR_FROM = 12; // frames
const POUR_TO = 46;
const N_GRAINS = 70;

const Sprite: React.FC<{ name: string; x: number; y: number; w: number; a?: number; o?: number }> = ({ name, x, y, w, a = 0, o = 1 }) => {
  const s = sz(name);
  if (!s) return null;
  const h = (w * s.h) / s.w;
  return <Img src={staticFile(`cook-ep01/sprites/${name}.png`)} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${a}deg)`, opacity: o }} />;
};

export const Play07: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  // bowl swings in, tips, holds while pouring, then leaves
  const inT = ease(interpolate(f, [0, 12], [0, 1], clamp));
  const outT = ease(interpolate(f, [POUR_TO + 4, POUR_TO + 18], [0, 1], clamp));
  const mix = (p: number, q: number, t: number) => p + (q - p) * t;
  const b0 = BOWL.from, b1 = BOWL.pour, b2 = BOWL.to;
  const bx = mix(mix(b0.x, b1.x, inT), b2.x, outT);
  const by = mix(mix(b0.y, b1.y, inT), b2.y, outT);
  const ba = mix(mix(b0.a, b1.a, inT), b2.a, outT);

  // lip of the bowl in frame coordinates (offset in the bowl's own frame, rotated with it)
  const rad = (ba * Math.PI) / 180;
  const lx = bx + Math.cos(rad) * LIP.x * BOWL.w - Math.sin(rad) * LIP.y * BOWL.w;
  const ly = by + Math.sin(rad) * LIP.x * BOWL.w + Math.cos(rad) * LIP.y * BOWL.w;

  const grains = Array.from({ length: N_GRAINS }, (_, i) => {
    const r = (k: string) => random(`g7-${i}-${k}`);
    const born = POUR_FROM + (i / N_GRAINS) * (POUR_TO - POUR_FROM);
    const age = (f - born) / FPS;
    if (age < 0) return null;
    const x0 = lx + (r("x") - 0.5) * 50;
    const vx = (r("vx") - 0.5) * 120;
    const landY = WOK.y - 40 + r("ly") * 120;
    const y = ly + 180 * age + 0.5 * 2600 * age * age;
    const x = x0 + vx * age + Math.sin(age * 18 + r("p") * 6) * 4;
    const landed = y >= landY;
    const tl = landed ? (f - (born + Math.sqrt((2 * (landY - ly)) / 2600) * FPS)) : 0;
    const o = landed ? interpolate(tl, [0, 14, 26], [1, 1, 0], clamp) : 1;
    return { i, x: landed ? Math.min(Math.max(x, WOK.x - WOK.rx), WOK.x + WOK.rx) : x, y: Math.min(y, landY), o, rot: r("r") * 180, big: 0.8 + r("s") * 0.5 };
  });

  // spatula nudges the rice once it has landed
  const stir = interpolate(f, [POUR_FROM + 14, POUR_TO + 6], [0, 1], clamp);
  const sa = -8 + Math.sin(f * 0.35) * 9 * stir;
  const sx = SPAT.x - Math.sin(f * 0.35) * 40 * stir;

  const hasBg = !!sz("s07_bg");
  return (
    <AbsoluteFill>
      <Img src={staticFile(hasBg ? "cook-ep01/sprites/s07_bg.png" : "cook-ep01/images/s07.png")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <Sprite name="s07_spatula" x={sx} y={SPAT.y} w={SPAT.w} a={sa} />
      {grains.map((g) => {
        if (!g) return null;
        const has = !!sz("s07_grain");
        return has ? (
          <Sprite key={g.i} name="s07_grain" x={g.x} y={g.y} w={28 * g.big} a={g.rot} o={g.o} />
        ) : (
          <div key={g.i} style={{ position: "absolute", left: g.x - 9, top: g.y - 4, width: 18 * g.big, height: 8 * g.big, borderRadius: "50%", background: "#fffdf4", boxShadow: "0 0 3px rgba(80,50,10,0.6)", transform: `rotate(${g.rot}deg)`, opacity: g.o }} />
        );
      })}
      <Sprite name="s07_bowl" x={bx} y={by} w={BOWL.w} a={ba} />
    </AbsoluteFill>
  );
};
