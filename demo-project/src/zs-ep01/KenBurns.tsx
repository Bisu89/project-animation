import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Rain, Wind } from "../stickman/weather";
import { Cards, FX_RED, ImageFx, ScreenFx, has, heartAmt, parseFx, shakeOffset } from "./Fx";

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

export type KenBurnsProps = {
  src: string;
  dur: number;
  motion: string;
  fx: string; // effect tokens, see Fx.tsx
  fade?: number;
  seed?: string;
  n?: number; // scene number (varies the random light flicker)
  from?: number; // global frame where this scene starts
  firstCue?: number; // first narration cue of the scene
  hits?: [number, number][]; // [global frame, strength] camera knocks (door pushes, impacts)
  debug?: boolean; // draw the effect regions
};

// One picture with a slow, smooth zoom/pan, a little hand-held sway and the effects listed in `fx`.
// `fade` frames of fade in/out at both ends so scenes cross-dissolve when overlapped by the caller.
export const KenBurns: React.FC<KenBurnsProps> = ({ src, dur, motion, fx, fade = 12, seed = "s", n = 1, from = 0, firstCue = 0, hits = [], debug }) => {
  const f = useCurrentFrame();
  const g = from + f;
  const toks = parseFx(fx);
  const m = MOTION[motion] ?? MOTION.in;
  const t = ease(interpolate(f, [0, dur], [0, 1], clamp));
  const hb = has(toks, "heart")[0];
  const hs = hb && FX_RED ? 1 + 0.006 * heartAmt(f, +(hb.a[0] || 80)) : 1;
  const sc = (m[0] + (m[1] - m[0]) * t) * hs * 1.012; // 1.2% extra so the sway never shows an edge
  const hand = has(toks, "still").length ? 0 : has(toks, "hand").length ? 2.6 : 1.1;
  const [dx, dy] = shakeOffset(g, hits, hand);
  const tx = (m[2] + (m[3] - m[2]) * t) * 1920 + dx;
  const ty = (m[4] + (m[5] - m[4]) * t) * 1080 + dy;
  const o = interpolate(f, [0, fade, dur - fade, dur], [0, 1, 1, 0], clamp);
  const flick = has(toks, "flicker").length ? 0.1 * Math.max(0, Math.sin(f * 0.37) * Math.sin(f * 0.11 + 1.3)) : 0;
  const dust = has(toks, "dust").length > 0;
  return (
    <AbsoluteFill style={{ background: "#07090c", opacity: o, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        <ImageFx toks={toks} src={staticFile(src)} f={f} g={g} dur={dur} firstCue={firstCue} seed={n} debug={debug} />
      </AbsoluteFill>
      {has(toks, "rain").length > 0 && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Rain f={f} seed={seed} count={110} angle={14} opacity={0.35} />
        </svg>
      )}
      {(has(toks, "wind").length > 0 || dust) && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Wind f={f} seed={seed} count={dust ? 10 : 16} angle={100} speed={dust ? 5 : 9} opacity={dust ? 0.16 : 0.22} />
        </svg>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
      {flick > 0 && <AbsoluteFill style={{ background: `rgba(255,235,200,${flick})`, mixBlendMode: "screen", pointerEvents: "none" }} />}
      <ScreenFx toks={toks} f={f} dur={dur} />
      <Cards toks={toks} f={f} sceneFrom={from} firstCue={firstCue} />
    </AbsoluteFill>
  );
};
