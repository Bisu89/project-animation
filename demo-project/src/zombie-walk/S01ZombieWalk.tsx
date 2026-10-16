import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Zombie } from "../survival-test/Figures";
import { FarSkyline, MidSkyline, Sky, Street } from "../survival-test/World";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

// 10 s test: a small horde shambles along the street. Positions are linear in the frame and the feet are
// driven by the distance walked (ground-locked gait), so there is no foot sliding and nothing is random.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// speed in px/frame, stride in world px per full cycle (about one step per 0.8 s)
const HORDE = [
  { x0: 520, lane: 0, s: 0.78, v: 2.3, stride: 110, lean: 24, tilt: 22 },
  { x0: 760, lane: 0, s: 0.78, v: 2.0, stride: 104, lean: 28, tilt: 30 },
  { x0: 1010, lane: 1, s: 0.88, v: 2.5, stride: 118, lean: 26, tilt: 24 },
  { x0: 300, lane: 1, s: 0.88, v: 2.2, stride: 112, lean: 27, tilt: 20 },
  { x0: 860, lane: 2, s: 0.98, v: 2.6, stride: 124, lean: 25, tilt: 26 },
  { x0: 1230, lane: 2, s: 0.98, v: 2.1, stride: 108, lean: 30, tilt: 32 },
  { x0: 180, lane: 2, s: 0.98, v: 2.4, stride: 120, lean: 24, tilt: 18 },
];
const LANE_Y = [902, 926, 954];

export const S01_SFX: SfxCue[] = [[0, "riser", 0.25]];

export const S01ZombieWalk: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const cam = f * 1.5;
  const fade = interpolate(f, [0, 12], [1, 0], clamp);
  // back lanes first so the near lane draws on top
  const order = HORDE.map((z, i) => ({ ...z, i })).sort((a, b) => a.lane - b.lane);

  return (
    <AbsoluteFill style={{ background: "#4c5663", overflow: "hidden" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <Sky />
        <g transform={`translate(${-cam * 0.25} 0)`}>
          <FarSkyline />
        </g>
        <g transform={`translate(${-cam * 0.55} 0)`}>
          <MidSkyline />
        </g>
        <g transform={`translate(${-cam} 0)`}>
          <Street />
          {order.map((z) => {
            const x = z.x0 + z.v * f;
            return <Zombie key={z.i} f={f} i={z.i} x={x} ground={LANE_Y[z.lane]} scale={z.s} d={x + z.i * 37} stride={z.stride} lean={z.lean} tilt={z.tilt} />;
          })}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(8,10,14,0.22), rgba(8,10,14,0) 30%, rgba(8,10,14,0) 70%, rgba(8,10,14,0.3))", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#0d0d0d", opacity: fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
