import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { Dust, shakeAt } from "../stickman/fx";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";
import { Backpack, DistantRunner, Pursuer, STRIDE, SURVIVOR } from "./Figures";
import { REST, REST_HIP, blend, groundedRun, smooth } from "./gait";
import { DOOR_CX, DOOR_X0, FLOOR, FarSkyline, MallFront, MidSkyline, Shutter, Sky, Street } from "./World";

// 12 s chase, one continuous scene. Beats (30 fps):
//   0-40   danger appears: the nearest zombie shambles in from the left, he glances back and reacts
//   40-70  he bolts (accelerates to full speed); camera pushes in
//   70-206 he runs for the mall with the lead zombie ~230 px behind him
//   196-234 he crosses the door line into the entrance (depth: ground 930 -> 868, scale 1.0 -> 0.82) and is
//          fully inside while the grille is still above his head
//   215-290 the grille comes down BEHIND him; slams at 290, the lead zombies reach it as it lands
//   290-360 he is safe inside, catching his breath; zombies bang on the bars outside
// Everything is a pure function of the frame (no timers, no randomness).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const V = 8.2; // full running speed, px/frame
const START = 40; // frame he starts running
const ACC = 30; // frames to reach full speed
const ARRIVE = 206; // frame he reaches the door line (world x = DOOR_X0)
const DECEL = 48; // frames to settle inside (rest point is 195 px past the door line, in the light on the right)
const SHUT = 290; // frame the grille lands
const X0 = DOOR_X0 - V * (ACC / 2 + ARRIVE - (START + ACC)); // start position so that he reaches DOOR_X0 at ARRIVE

const survX = (f: number) => {
  if (f < START) return X0;
  if (f < START + ACC) return X0 + V * ((f - START) * (f - START)) / (2 * ACC);
  if (f <= ARRIVE) return X0 + V * (ACC / 2 + f - START - ACC);
  const t = Math.min(f - ARRIVE, DECEL);
  return DOOR_X0 + V * (t - (t * t) / (2 * DECEL));
};
const camX = (f: number) => Math.max(0, Math.min(1500, survX(f) - 560));

// same scale for him and the lead zombie in a continuous shot; the only scale/depth change is the entrance crossing
const BASE = 1.0;
const INSIDE_GROUND = FLOOR - 16;
const inside = (f: number) => smooth((f - 196) / 38);
const groundAt = (x: number, off = 0) => interpolate(x, [2300, 2740], [930 + off * 4, FLOOR + 14 + off * 5], clamp);
const scaleAt = (x: number, k = 1) => interpolate(x, [2300, 2740], [BASE * k, 0.86 * k], clamp);

// zombies: shamble in (v0), run (v), then bunch up and slow (vs) near the door; they cannot pass `target`
const F1 = 60;
const F2 = 205;
type Z = { x0: number; v0: number; v: number; vs: number; target: number; off: number; k: number };
const ZOMBIES: Z[] = [
  { x0: 1040, v0: 4.5, v: 8.5, vs: 3.6, target: 2770, off: 0, k: 1.0 },
  { x0: 810, v0: 4.5, v: 8.4, vs: 5.2, target: 2830, off: 2, k: 0.97 },
  { x0: 560, v0: 4.5, v: 8.5, vs: 5.0, target: 2715, off: -1, k: 1.02 },
  { x0: 300, v0: 4.4, v: 8.4, vs: 5.0, target: 2860, off: 3, k: 0.96 },
  { x0: 40, v0: 4.5, v: 8.5, vs: 5.0, target: 2690, off: 1, k: 1.0 },
];
const zx = (z: Z) => (f: number) => Math.min(z.x0 + z.v0 * Math.min(f, F1) + z.v * Math.max(0, Math.min(f, F2) - F1) + z.vs * Math.max(0, f - F2), z.target);
const arrival = (xAt: (f: number) => number, target: number) => {
  for (let f = 0; f < 480; f++) if (xAt(f) >= target - 0.01) return f;
  return 9999;
};
const ZPLAN = ZOMBIES.map((z) => {
  const xAt = zx(z);
  return { z, xAt, fa: arrival(xAt, z.target) };
});

// distant fleeing figures in the mid layer: different sizes, speeds and tones, uneven gaps
const FLEEING = [
  { x: 1200, v: 6.2, s: 0.46, c: "#6c7580" },
  { x: 1520, v: 7.4, s: 0.4, c: "#7a838d" },
  { x: 1830, v: 5.6, s: 0.5, c: "#66707b" },
  { x: 2400, v: 6.8, s: 0.43, c: "#737c86" },
];

// the grille starts down while he crosses and lands behind him; its bottom stays well above his head until he is inside
const shutterP = (f: number) => interpolate(f, [215, 236, 262, 284, SHUT, SHUT + 6, SHUT + 14], [0, 0.2, 0.5, 0.88, 1, 0.985, 1], clamp);

export const S01_SFX: SfxCue[] = [
  [150, "riser", 0.3],
  [215, "chains", 0.55],
  [SHUT, "slam", 0.95],
  [SHUT + 8, "thud", 0.5],
  [SHUT + 16, "thud", 0.45],
  [SHUT + 23, "thud", 0.5],
];

// piecewise value with ease-in-out between keys: deliberate holds and moves instead of constant drift
const keyed = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [a, va] = keys[i - 1];
      const [b, vb] = keys[i];
      return va + (vb - va) * smooth((f - a) / (b - a));
    }
  }
  return keys[keys.length - 1][1];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const TIRED = { ...REST, lean: 24, la1: 35, ra1: 35, la2: 15, ra2: 15 };

export const S01Chase: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const cam = camX(f);
  const sx = survX(f);
  const d = sx - X0;
  const ins = inside(f);
  const gs = lerp(930, INSIDE_GROUND, ins);
  const ss = lerp(BASE, 0.82, ins);
  const phase = d / STRIDE;

  // body: standing -> running -> standing and tired. The gait is ground-locked (phase from distance).
  const g = groundedRun(d, ss, { stride: STRIDE, lean: 14, arm: 50 });
  const toRun = smooth((f - START) / 14);
  const toTired = smooth((f - (ARRIVE + 20)) / 32);
  const standPose = blend(g.pose, REST, 1 - toRun);
  const pose = blend(standPose, TIRED, toTired);
  const hipH = lerp(lerp(REST_HIP, g.hipH, toRun), 88, toTired);
  const breath = Math.sin(f * 0.3) * 2.5 * toTired;
  const y = gs - hipH * ss;

  // glance back when the zombie appears (frames ~12-34)
  const glance = smooth((f - 12) / 6) * (1 - smooth((f - 30) / 8));

  // ---- camera: wide on the street -> push in on the run -> pull back to the entrance -> slow push on the grille
  const survPt = { x: sx - cam, y: gs - 90 };
  const doorPt = { x: DOOR_CX + 20 - cam, y: 700 };
  const u = keyed(f, [[0, 0], [170, 0], [232, 1], [360, 1]]); // focus moves from him to the entrance
  const w = keyed(f, [[0, 0], [40, 0], [95, 1], [360, 1]]); // 0 = wide, untouched frame; 1 = framed shots
  const z = keyed(f, [[0, 1.0], [40, 1.0], [95, 1.45], [170, 1.45], [232, 1.1], [290, 1.2], [360, 1.32]]);
  const Px = lerp(survPt.x, doorPt.x, u);
  const Py = lerp(survPt.y, doorPt.y, u);
  const bob = Math.sin(phase * Math.PI * 4) * 2 * w * toRun * (1 - toTired); // the camera rides the run, lightly
  const Tx = lerp(Px, lerp(720, 1100, u), w);
  const Ty = lerp(Py, lerp(700, 640, u), w) + bob;
  const shake = shakeAt(f, [SHUT], 8, 10);

  return (
    <AbsoluteFill style={{ background: "#4c5663", overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", overflow: "visible" }}>
        <g transform={`translate(${shake.x} ${shake.y}) translate(${Tx} ${Ty}) scale(${z}) translate(${-Px} ${-Py})`}>
          <Sky />
          <g transform={`translate(${-cam * 0.25} 0)`}>
            <FarSkyline />
          </g>
          <g transform={`translate(${-cam * 0.55} 0)`}>
            <MidSkyline />
            {FLEEING.map((r, i) => (
              <DistantRunner key={i} f={f} x={r.x + r.v * f} ground={FLOOR - 12} scale={r.s} color={r.c} />
            ))}
          </g>
          <g transform={`translate(${-cam} 0)`}>
            <Street />
            <MallFront />

            {/* survivor: drawn before the grille so the grille bars sit in front of him once he is inside */}
            <Hero
              f={f}
              who={SURVIVOR}
              x={sx}
              ground={gs}
              scale={ss}
              facing={1}
              seed={2}
              emotion="worried"
              mod={(t, p) => ({ ...p, ...pose, lean: (pose.lean ?? 0) + breath, head: -18 * glance, y })}
              held={(j) => <Backpack j={j} s={ss} phase={phase} />}
            />

            <Shutter p={shutterP(f)} />

            {ZPLAN.map(({ z: zz, xAt, fa }, i) => (
              <Pursuer key={i} f={f} i={i} xAt={xAt} fa={fa} ground={(x) => groundAt(x, zz.off)} scale={(x) => scaleAt(x, zz.k)} />
            ))}
            <Dust x={DOOR_CX} y={FLOOR + 10} at={SHUT} f={f} spread={150} />
          </g>
        </g>
      </svg>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(8,10,14,0.22), rgba(8,10,14,0) 30%, rgba(8,10,14,0) 70%, rgba(8,10,14,0.3))", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
