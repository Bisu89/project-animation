import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { Dust, shakeAt } from "../stickman/fx";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";
import { BASE_SCALE, Backpack, DistantRunner, Pursuer, STRIDE, SURVIVOR, runnerMod } from "./Figures";
import { DOOR_CX, DOOR_X0, FLOOR, FarSkyline, MallFront, MidSkyline, Shutter, Sky, Street } from "./World";

// 12 s test: a survivor sprints along the sidewalk toward the mall entrance with infected silhouettes
// behind him; the shutter starts coming down as he reaches the door, he slips in, it slams shut and the
// first silhouettes hit it. Everything is a pure function of the frame (no timers, no randomness).
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const V = 9.69; // survivor world speed, px/frame
const X0 = 200;
const ARRIVE = 262; // frame he reaches the doorway threshold
const DECEL = 27; // frames to settle inside
const SHUT = 331; // frame the shutter lands

const survX = (f: number) => {
  if (f <= ARRIVE) return X0 + V * f;
  const t = Math.min(f - ARRIVE, DECEL);
  return DOOR_X0 + V * (t - (t * t) / (2 * DECEL));
};
const camX = (f: number) => Math.max(0, Math.min(1500, survX(f) - 560));

// he and the pursuers drift from the sidewalk toward the doorway as they close in (a little depth)
const groundAt = (x: number, off = 0) => interpolate(x, [2300, 2740], [930 + off * 3, FLOOR + 14 + off * 5], clamp);
const scaleAt = (x: number) => interpolate(x, [2300, 2740], [BASE_SCALE, 0.8], clamp);
const survGround = (x: number) => interpolate(x, [2300, 2870], [930, FLOOR + 2], clamp);
const survScale = (x: number) => interpolate(x, [2300, 2870], [BASE_SCALE, 0.78], clamp);

const PURSUERS = [
  { x0: -220, v: 10.0, target: 2790, off: 0 },
  { x0: -330, v: 9.9, target: 2870, off: 1 },
  { x0: -470, v: 9.8, target: 2950, off: 2 },
  { x0: -560, v: 10.0, target: 3010, off: 0 },
  { x0: -700, v: 9.9, target: 2700, off: 1 },
];

const shutterP = (f: number) => interpolate(f, [232, 262, 300, 328, SHUT, SHUT + 7, SHUT + 15], [0, 0.34, 0.62, 0.97, 1, 0.985, 1], clamp);

export const S01_SFX: SfxCue[] = [
  [180, "riser", 0.3],
  [232, "chains", 0.5],
  [SHUT, "slam", 0.9],
  [SHUT + 8, "thud", 0.5],
  [SHUT + 16, "thud", 0.45],
  [SHUT + 23, "thud", 0.5],
];

export const S01Chase: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const cam = camX(f);
  const sx = survX(f);
  const d = sx - X0;
  const gs = survGround(sx);
  const ss = survScale(sx);
  const settle = (f - 268) / 24;
  const { pose, y } = runnerMod(d, ss, gs, settle, { stride: STRIDE });
  const zoom = interpolate(f, [248, 360], [1, 1.1], clamp);
  const shake = shakeAt(f, [SHUT], 7, 10);

  return (
    <AbsoluteFill style={{ background: "#4c5663", overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <g transform={`translate(${shake.x} ${shake.y}) translate(1370 640) scale(${zoom}) translate(-1370 -640)`}>
          <Sky />
          <g transform={`translate(${-cam * 0.25} 0)`}>
            <FarSkyline />
          </g>
          <g transform={`translate(${-cam * 0.55} 0)`}>
            <MidSkyline />
            {[0, 1, 2].map((i) => (
              <DistantRunner key={i} f={f} x={1100 + i * 140 + 6.5 * f} ground={FLOOR - 12} scale={0.45} />
            ))}
          </g>
          <g transform={`translate(${-cam} 0)`}>
            <Street />
            <MallFront />

            {/* survivor: Hero (head, jacket) on the ground-locked gait, backpack on the back */}
            <Hero
              f={f}
              who={SURVIVOR}
              x={sx}
              ground={gs}
              scale={ss}
              facing={1}
              seed={2}
              mod={(t, p) => ({ ...p, ...pose, y })}
              held={(j) => <Backpack j={j} s={ss} phase={d / STRIDE} />}
            />

            <Shutter p={shutterP(f)} />

            {PURSUERS.map((z, i) => (
              <Pursuer key={i} f={f} i={i} x0={z.x0} v={z.v} target={z.target} ground={(x) => groundAt(x, z.off)} scale={scaleAt} />
            ))}
            <Dust x={DOOR_CX} y={FLOOR + 10} at={SHUT} f={f} spread={150} />
          </g>
        </g>
      </svg>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(8,10,14,0.22), rgba(8,10,14,0) 30%, rgba(8,10,14,0) 70%, rgba(8,10,14,0.3))", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
