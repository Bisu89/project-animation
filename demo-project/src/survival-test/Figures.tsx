import React from "react";
import { Actor } from "../stickman/stick";
import type { Joints } from "../stickman/stick";
import { SKIN } from "../stickman/cast";
import type { Preset } from "../stickman/cast";
import { interpolate } from "remotion";
import { REST, REST_HIP, blend, groundedRun, smooth } from "./gait";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// the survivor: same sober character set as the Agincourt pilot (smaller head, dot eyes), modern jacket
export const SURVIVOR: Preset = {
  hair: "short",
  hairColor: "#2b2118",
  skin: SKIN.light,
  shape: "round",
  head: 0.8,
  eyes: "dot",
  emotion: "worried",
  outfit: "soldier",
  outfitColor: "#5b6b72",
  trim: "#2a2f33",
};

export const STRIDE = 175; // world px per full run cycle at scale 0.9
export const BASE_SCALE = 0.9;

// Backpack hung on the back of the torso (joints from Hero's `held`). It follows the torso lean and has a
// little lag: it rocks against the stride and bounces at twice the stride frequency.
export const Backpack: React.FC<{ j: Joints; s: number; phase: number }> = ({ j, s, phase }) => {
  const [nx, ny] = j.neck;
  const [hx, hy] = j.hip;
  const dx = hx - nx;
  const dy = hy - ny;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // points to the back for a right-facing figure
  const py = ux;
  const lag = Math.sin(phase * Math.PI * 4 + 0.7);
  const cx = nx + ux * len * 0.6 + px * 26 * s;
  const cy = ny + uy * len * 0.6 + py * 26 * s + lag * 2.2 * s;
  const rot = (Math.atan2(uy, ux) * 180) / Math.PI - 90 + Math.sin(phase * Math.PI * 2 + 0.4) * 4;
  const w = 34 * s;
  const h = 54 * s;
  const ink = "#1a1a1a";
  return (
    <g>
      <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={9 * s} fill="#6a5a3a" stroke={ink} strokeWidth={4 * s} />
        <rect x={-w / 2 + 3 * s} y={-h / 2 - 7 * s} width={w - 6 * s} height={14 * s} rx={6 * s} fill="#54462b" stroke={ink} strokeWidth={3.5 * s} />
        <rect x={-w / 2 + 5 * s} y={h * 0.08} width={w - 10 * s} height={h * 0.3} rx={4 * s} fill="#54462b" stroke={ink} strokeWidth={3 * s} />
      </g>
      {/* strap over the shoulder */}
      <line x1={nx + ux * 8 * s} y1={ny + uy * 8 * s} x2={cx - px * 8 * s} y2={cy - py * 8 * s - h * 0.2} stroke="#3a2f1c" strokeWidth={4 * s} strokeLinecap="round" />
    </g>
  );
};

// survivor body pose for the run, blended to a standing pose between `settleFrom` and `settleTo`
export const runnerMod = (d: number, s: number, ground: number, settle: number, opts: { stride: number; lean?: number; lift?: number }) => {
  const g = groundedRun(d, s, opts);
  const gaitPose = { ...g.pose };
  const b = smooth(settle);
  const pose = blend(gaitPose, REST, b);
  const hipH = g.hipH + (REST_HIP - g.hipH) * b;
  return { pose, y: ground - hipH * s };
};

// dark infected silhouette: plain Actor (small built-in head), lurching run: leaning, arms reaching forward.
// When it reaches the shutter it settles into pounding with both arms overhead.
export const Pursuer: React.FC<{ f: number; i: number; x0: number; v: number; target: number; ground: (x: number) => number; scale: (x: number) => number }> = ({ f, i, x0, v, target, ground, scale }) => {
  const x = Math.min(x0 + v * f, target);
  const d = x - x0;
  const fa = (target - x0) / v;
  const s = scale(x);
  const g = ground(x);
  const arrive = smooth((f - fa) / 8);
  const run = groundedRun(d, s, { stride: 215, lean: 24, lift: 22 });
  const reach = { ...run.pose, la1: 78 + Math.sin(d * 0.04 + i) * 8, ra1: 84 + Math.cos(d * 0.04 + i) * 8, la2: -12, ra2: -10 };
  // banging on the shutter: arms alternate between raised and lowered, out of step between figures
  const bang = (ph: number) => 105 + 45 * Math.sin(f * 0.55 + ph);
  const pound = { ...REST, la1: -bang(i * 1.7 + Math.PI), la2: -20, ra1: bang(i * 1.7), ra2: -20, lean: 6 };
  const pose = blend(reach, pound, arrive);
  const hipH = run.hipH + (REST_HIP - run.hipH) * arrive;
  return (
    <Actor
      f={f}
      keys={[{ f: 0, p: {} }]}
      color="#1b1e23"
      scale={s}
      facing={1}
      face="none"
      trails={false}
      opacity={0.94}
      mod={(t, p) => ({ ...p, ...pose, x, y: g - hipH * s })}
    />
  );
};

// small grey figure far away, running the same way (a ground-locked gait at its own scale)
export const DistantRunner: React.FC<{ f: number; x: number; ground: number; scale: number }> = ({ f, x, ground, scale }) => {
  const d = x;
  const run = groundedRun(d, scale, { stride: 175 * (scale / BASE_SCALE), lean: 12, lift: 20 });
  return (
    <Actor
      f={f}
      keys={[{ f: 0, p: {} }]}
      color="#6c7580"
      scale={scale}
      facing={1}
      face="none"
      trails={false}
      mod={(t, p) => ({ ...p, ...run.pose, x, y: ground - run.hipH * scale })}
    />
  );
};

export const lerp = (f: number, a: number[], b: number[]) => interpolate(f, a, b, clamp);
