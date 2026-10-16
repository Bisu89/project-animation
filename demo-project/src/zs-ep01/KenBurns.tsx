import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Rain, Wind } from "../stickman/weather";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep: the move starts and ends softly

// motion name -> [scale0, scale1, x0, x1, y0, y1] (x/y are fractions of the frame, positive = image moves right/down)
const MOTION: Record<string, number[]> = {
  in: [1.0, 1.12, 0, 0, 0, 0],
  out: [1.14, 1.0, 0, 0, 0, 0],
  "in-left": [1.06, 1.15, 0.02, -0.02, 0, 0],
  "in-right": [1.06, 1.15, -0.02, 0.02, 0, 0],
  "out-left": [1.15, 1.06, 0.02, -0.01, 0, 0],
  "out-right": [1.15, 1.06, -0.02, 0.01, 0, 0],
  "in-up": [1.04, 1.14, 0, 0, 0.02, -0.02],
  "in-down": [1.04, 1.14, 0, 0, -0.02, 0.02],
};

// One picture with a slow, smooth zoom/pan and optional light ambient animation (rain, wind, flicker, dust).
// `fade` frames of fade in/out at both ends so scenes cross-dissolve when overlapped by the caller.
export const KenBurns: React.FC<{ src: string; dur: number; motion: string; fx: string; fade?: number; seed?: string }> = ({ src, dur, motion, fx, fade = 12, seed = "s" }) => {
  const f = useCurrentFrame();
  const m = MOTION[motion] ?? MOTION.in;
  const t = ease(interpolate(f, [0, dur], [0, 1], clamp));
  const sc = m[0] + (m[1] - m[0]) * t;
  const tx = (m[2] + (m[3] - m[2]) * t) * 1920;
  const ty = (m[4] + (m[5] - m[4]) * t) * 1080;
  const o = interpolate(f, [0, fade, dur - fade, dur], [0, 1, 1, 0], clamp);
  const flick = fx === "flicker" ? 0.1 * Math.max(0, Math.sin(f * 0.37) * Math.sin(f * 0.11 + 1.3)) : 0;
  return (
    <AbsoluteFill style={{ background: "#07090c", opacity: o, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: "50% 50%" }} />
      {fx === "rain" && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Rain f={f} seed={seed} count={110} angle={14} opacity={0.35} />
        </svg>
      )}
      {(fx === "wind" || fx === "dust") && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Wind f={f} seed={seed} count={fx === "dust" ? 10 : 16} angle={100} speed={fx === "dust" ? 5 : 9} opacity={fx === "dust" ? 0.16 : 0.22} />
        </svg>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      {flick > 0 && <AbsoluteFill style={{ background: `rgba(255,235,200,${flick})`, mixBlendMode: "screen", pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};
