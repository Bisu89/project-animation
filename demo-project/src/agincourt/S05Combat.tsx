import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import type { Preset } from "../stickman/cast";
import { fall, walkTo } from "../stickman/moves";
import type { MoveFn } from "../stickman/moves";
import { At, Sword } from "../stickman/props";
import { Dust, FONT, ease } from "../stickman/fx";
import { Backdrop } from "./Field";
import { EN_MAA, FR_MAA } from "./Roles";
import type { SceneProps } from "./Video";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ORIGIN = "960px 840px";

// Three small vignettes on three ground lanes, spread across the field so they never stack:
// back-left a duel, centre a pressed line (two men deep each side), front-right a duel that ends with a
// French fall. Before ~50 the French walk into contact; ~50-190 they push; after ~190 the French line breaks.
type Fighter = { who: Preset; x: number; ground: number; scale: number; facing: 1 | -1; seed: number; moves?: MoveFn[]; push: number; advance?: number; phase: number; free: number; flipAt?: number };

const LEFT = { g: 824, s: 0.74, cx: 620 };
const MID = { g: 846, s: 0.82, cx: 970 };
const RIGHT = { g: 868, s: 0.92, cx: 1330 };

// English hold the line and edge forward once the French start to give way
const E = (lane: { g: number; s: number }, x: number, seed: number, phase: number): Fighter => ({ who: EN_MAA, x, ground: lane.g, scale: lane.s, facing: 1, seed, push: 7, advance: 34, phase, free: 9999 });
// French walk into contact by frame 50, push, then `after` (a retreat or a fall) from frame `free`
const F = (lane: { g: number; s: number }, x0: number, xc: number, seed: number, phase: number, free: number, after: MoveFn[] = [], flipAt?: number): Fighter => ({
  who: FR_MAA,
  x: x0,
  ground: lane.g,
  scale: lane.s,
  facing: -1,
  seed,
  push: free > 0 ? 9 : 0,
  phase,
  free,
  flipAt,
  moves: [...(xc !== x0 ? [walkTo(0, 50, xc)] : []), ...after],
});

const FIGHTERS: Fighter[] = [
  // back-left duel: the French man backs off late
  E(LEFT, LEFT.cx - 80, 1, 0),
  F(LEFT, LEFT.cx + 700, LEFT.cx + 80, 2, 1.3, 235, [walkTo(235, 300, LEFT.cx + 360)], 235),
  // centre: two deep each side, the second ranks pushing on the first
  E(MID, MID.cx - 175, 3, 0.8),
  E(MID, MID.cx - 82, 4, 0),
  F(MID, MID.cx + 760, MID.cx + 82, 5, 1.9, 9999),
  F(MID, MID.cx + 850, MID.cx + 175, 6, 0.4, 215, [walkTo(215, 275, MID.cx + 470)], 215),
  // front-right duel: the French man goes down
  E(RIGHT, RIGHT.cx - 84, 7, 2.2),
  F(RIGHT, RIGHT.cx + 650, RIGHT.cx + 84, 8, 0.6, 205, [fall(210)]),
  // rear ranks drifting away
  F({ g: 806, s: 0.62 }, 1520, 1520, 9, 0, 0, [walkTo(165, 235, 1790)], 165),
  F({ g: 812, s: 0.62 }, 1640, 1640, 10, 0, 0, [walkTo(180, 250, 1880)], 180),
];

const Layer: React.FC<{ z: number; children: React.ReactNode }> = ({ z, children }) => <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: ORIGIN }}>{children}</AbsoluteFill>;

export const S05Combat: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 40, 150, 346], [1, 1, 1.26, 1.3], clamp);
  const zFar = 1 + (z - 1) * 0.35;
  const zMid = 1 + (z - 1) * 0.6;
  // draw order: far lanes first
  const order = [...FIGHTERS].sort((a, b) => a.ground - b.ground);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#8f979e" }}>
      <Layer z={zFar}>
        <Backdrop id="s5" overcast mud />
      </Layer>
      <Layer z={zMid}>
        <Img src={staticFile("agincourt/far.png")} style={{ opacity: 0.9 }} />
        <Img src={staticFile("agincourt/mid.png")} style={{ opacity: 0.9 }} />
      </Layer>
      <Layer z={z}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", overflow: "visible" }}>
          {order.map((a, i) => (
            <Hero
              key={i}
              f={f}
              who={a.who}
              x={a.x}
              ground={a.ground}
              scale={a.scale}
              facing={a.facing}
              seed={a.seed}
              moves={a.moves}
              mod={(t, p) => {
                if (t < 56 || t >= a.free || a.push === 0) return p;
                // braced stance: knees bent apart, leaning into the push; the line sways back and forth
                const sway = Math.sin(t * 0.16 + a.phase) * a.push * ease(t, 50, 80);
                const adv = (a.advance ?? 0) * interpolate(t, [190, 300], [0, 1], clamp);
                const dir = a.facing;
                return {
                  ...p,
                  x: p.x + dir * (sway * 0.6 + adv),
                  lean: 12 + Math.sin(t * 0.16 + a.phase) * 3,
                  ll1: -26,
                  ll2: 14,
                  rl1: 24,
                  rl2: 14,
                  ra1: 62,
                  ra2: 6,
                  la1: 32,
                  la2: -30,
                };
              }}
              held={(j) => (
                <At x={j.rHand[0]} y={j.rHand[1]} s={a.scale * 0.75} r={(a.flipAt !== undefined && f >= a.flipAt ? -a.facing : a.facing) * 62}>
                  <Sword />
                </At>
              )}
            />
          ))}
          <Dust x={RIGHT.cx + 84} y={RIGHT.g} at={226} f={f} spread={70} />
        </svg>
      </Layer>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 70,
          textAlign: "center",
          fontFamily: FONT.title,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: 4,
          color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          opacity: ease(f, 6, 24),
        }}
      >
        THE LINES MEET
      </div>
    </AbsoluteFill>
  );
};
